/* ============================================
   CosmicMail — Sample Webhook Handler
   ============================================
   This is a standalone Express app that shows how to receive
   the webhook POST from the CosmicMail subscribe form and push
   to Mailchimp or Google Sheets.

   Usage:
     1. npm init -y
     2. npm install express @mailchimp/mailchimp_marketing googleapis
     3. node webhook-sample.js
     4. Set this server's URL as WEBHOOK_URL in the main server .env
   ============================================ */

import express from 'express';
// import mailchimp from '@mailchimp/mailchimp_marketing';
// import { google } from 'googleapis';

const app = express();
app.use(express.json());

app.post('/webhook/subscribe', async (req, res) => {
  const { name, age, email, interests, consent, timestamp, source } = req.body;

  console.log('📡 New subscriber received:', { name, email, interests, timestamp });

  /* --- Push to Mailchimp --- */
  // mailchimp.setConfig({
  //   apiKey: 'YOUR_MAILCHIMP_API_KEY',
  //   server: 'us1', // e.g. us1, us2
  // });
  //
  // try {
  //   await mailchimp.lists.addListMember('YOUR_AUDIENCE_ID', {
  //     email_address: email,
  //     status: 'subscribed',
  //     merge_fields: { FNAME: name },
  //     tags: interests,
  //   });
  //   console.log('✅ Added to Mailchimp');
  // } catch (err) {
  //   console.error('Mailchimp error:', err.message);
  // }

  /* --- Push to Google Sheets --- */
  // const auth = new google.auth.GoogleAuth({
  //   keyFile: 'service-account.json',
  //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  // });
  // const sheets = google.sheets({ version: 'v4', auth });
  //
  // try {
  //   await sheets.spreadsheets.values.append({
  //     spreadsheetId: 'YOUR_SPREADSHEET_ID',
  //     range: 'Sheet1!A:G',
  //     valueInputOption: 'USER_ENTERED',
  //     requestBody: {
  //       values: [[name, age, email, interests.join(', '), consent, timestamp, source]],
  //     },
  //   });
  //   console.log('✅ Added to Google Sheets');
  // } catch (err) {
  //   console.error('Google Sheets error:', err.message);
  // }

  res.json({ received: true });
});

app.listen(4000, () => {
  console.log('🔗 Webhook handler running on http://localhost:4000');
});
