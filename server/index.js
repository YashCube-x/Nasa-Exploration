import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 5000;

/* ================================================
   CONFIGURATION
   ================================================ */

// Supabase client
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  : null;

if (!supabase) {
  console.warn('⚠️  Supabase not configured. Subscriptions will only be forwarded to webhooks.');
}

// n8n Webhook URL (primary integration)
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://yash-ninja.app.n8n.cloud/webhook-test/af53988d-27ee-479b-a28d-3b6276496d46';

// Optional webhook
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Double opt-in toggle
const DOUBLE_OPTIN = process.env.DOUBLE_OPTIN === 'true';

/* ================================================
   MIDDLEWARE
   ================================================ */

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// JSON body parser
app.use(express.json());

// Rate limiting: 100 requests per 15 minutes per IP
const subscribeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ================================================
   ROUTES
   ================================================ */

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    supabase: !!supabase,
    n8nWebhook: !!N8N_WEBHOOK_URL,
    doubleOptIn: DOUBLE_OPTIN,
    timestamp: new Date().toISOString(),
  });
});

// Subscribe endpoint
app.post('/api/subscribe', subscribeRateLimit, async (req, res) => {
  try {
    const { name, age, email, interests, consent, timestamp, source } = req.body;

    /* --- Validation --- */
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (age !== null && age !== undefined) {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum <= 0) {
        return res.status(400).json({ error: 'Age must be a positive integer.' });
      }
    }

    if (!consent) {
      return res.status(400).json({ error: 'Consent is required to subscribe.' });
    }

    /* --- Honeypot check (from frontend hidden field) --- */
    if (req.body.nickname) {
      // Bot detected — silently accept
      return res.json({ success: true });
    }

    const subscriberData = {
      full_name: name.trim(),
      age: age ? parseInt(age, 10) : null,
      email: email.trim().toLowerCase(),
      interests: interests || [],
      consent: true,
      source: source || 'lovable',
      ip_address: req.ip,
      double_optin_verified: !DOUBLE_OPTIN, // auto-verify if double opt-in is off
    };

    /* --- Store in Supabase --- */
    let alreadySubscribed = false;
    
    if (supabase) {
      // Check for existing subscriber
      const { data: existing } = await supabase
        .from('subscribers')
        .select('id, email')
        .eq('email', subscriberData.email)
        .maybeSingle();

      if (existing) {
        alreadySubscribed = true;
        return res.json({
          success: true,
          alreadySubscribed: true,
          message: 'This email is already subscribed.',
        });
      }

      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert([subscriberData]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        // Continue — n8n is the primary integration
      }
    }

    /* --- Forward to n8n webhook (PRIMARY) --- */
    if (N8N_WEBHOOK_URL && N8N_WEBHOOK_URL !== 'WEBHOOK_URL_PLACEHOLDER') {
      try {
        const webhookPayload = {
          name: subscriberData.full_name,
          age: subscriberData.age,
          email: subscriberData.email,
          interests: subscriberData.interests,
          consent: subscriberData.consent,
          timestamp: timestamp || new Date().toISOString(),
          source: subscriberData.source,
          doubleOptIn: DOUBLE_OPTIN,
        };

        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });
      } catch (webhookErr) {
        console.warn('n8n webhook error:', webhookErr.message);
      }
    }

    /* --- Forward to generic webhook (optional) --- */
    if (WEBHOOK_URL && WEBHOOK_URL !== 'WEBHOOK_URL_PLACEHOLDER') {
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: subscriberData.full_name,
            age: subscriberData.age,
            email: subscriberData.email,
            interests: subscriberData.interests,
            consent: subscriberData.consent,
            timestamp: timestamp || new Date().toISOString(),
            source: subscriberData.source,
          }),
        });
      } catch (webhookErr) {
        console.warn('Webhook forward error:', webhookErr.message);
      }
    }

    /* ================================================
       OPTIONAL INTEGRATIONS (uncomment and configure)
       ================================================ */

    /* --- Mailchimp --- */
    // To enable Mailchimp integration:
    // 1. Set MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_SERVER_PREFIX in .env
    // 2. Install: npm install @mailchimp/mailchimp_marketing
    // 3. Uncomment the code below:
    //
    // import mailchimp from '@mailchimp/mailchimp_marketing';
    // mailchimp.setConfig({
    //   apiKey: process.env.MAILCHIMP_API_KEY,
    //   server: process.env.MAILCHIMP_SERVER_PREFIX,
    // });
    // await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
    //   email_address: subscriberData.email,
    //   status: DOUBLE_OPTIN ? 'pending' : 'subscribed',
    //   merge_fields: { FNAME: subscriberData.full_name },
    //   tags: subscriberData.interests,
    // });

    /* --- SendGrid (confirmation email) --- */
    // To enable SendGrid:
    // 1. Set SENDGRID_API_KEY, SENDGRID_FROM_EMAIL in .env
    // 2. Install: npm install @sendgrid/mail
    // 3. Uncomment:
    //
    // import sgMail from '@sendgrid/mail';
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: subscriberData.email,
    //   from: process.env.SENDGRID_FROM_EMAIL,
    //   subject: '🚀 Welcome to CosmicMail!',
    //   html: `<h1>Welcome, ${subscriberData.full_name}!</h1>
    //          <p>Thanks for subscribing. Your first space photo is on its way!</p>
    //          ${DOUBLE_OPTIN ? '<p><a href="VERIFY_LINK_HERE">Click here to verify your email</a></p>' : ''}`,
    // });

    /* --- Google Sheets (via webhook) --- */
    // To enable Google Sheets:
    // 1. Set GOOGLE_SHEETS_WEBHOOK_URL in .env (use Apps Script or Zapier webhook)
    // 2. Uncomment:
    //
    // if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    //   await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(subscriberData),
    //   });
    // }

    res.json({
      success: true,
      alreadySubscribed: false,
      message: DOUBLE_OPTIN
        ? 'Please check your email to confirm your subscription.'
        : 'Welcome aboard! Your first space photo is on its way.',
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

/* ================================================
   START SERVER
   ================================================ */
app.listen(PORT, () => {
  console.log(`🚀 CosmicMail server running on http://localhost:${PORT}`);
  console.log(`   n8n Webhook: ${N8N_WEBHOOK_URL ? '✅ Configured' : '❌ Not set'}`);
  console.log(`   Supabase:    ${supabase ? '✅ Connected' : '⚠️  Not configured'}`);
  console.log(`   Double Opt-in: ${DOUBLE_OPTIN ? 'ON' : 'OFF'}`);
});
