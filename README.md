# 🚀 CosmicMail — Space Photo Subscription Website

A stunning, immersive space-themed subscription website built with **React** (Vite), **Node.js/Express**, and **Supabase**. Subscribers receive weekly space photos delivered to their inbox.

![CosmicMail](https://images-assets.nasa.gov/image/PIA17563/PIA17563~medium.jpg)

---

## ✨ Features

- **Animated starfield** canvas background with shooting stars
- **Glassmorphic UI** with nebula gradients and parallax scrolling
- **Gallery** with 3 space photo cards (click to enlarge in lightbox)
- **Subscribe form** with full validation, honeypot anti-spam, and rate limiting
- **n8n webhook integration** for workflow automation
- **Rocket + confetti animation** on successful subscribe
- **Fully responsive** (480px, 768px, 1024px breakpoints)
- **Accessible** (ARIA, focus outlines, keyboard navigation, semantic HTML)
- **SEO optimized** with meta tags and Open Graph

---

## 📁 Project Structure

```
NASA/
├── client/                  ← React (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          ← Sticky nav + hamburger menu
│   │   │   ├── Hero.jsx            ← Hero with parallax
│   │   │   ├── Starfield.jsx       ← Canvas animated stars
│   │   │   ├── Gallery.jsx         ← 3 NASA photo cards
│   │   │   ├── ImageModal.jsx      ← Lightbox viewer
│   │   │   ├── SubscribeForm.jsx   ← Form with n8n webhook
│   │   │   ├── ConfettiRocket.jsx  ← Success animation
│   │   │   ├── SuccessModal.jsx    ← Post-subscribe modal
│   │   │   ├── Toast.jsx           ← Notification toast
│   │   │   └── Footer.jsx          ← Footer with social icons
│   │   ├── App.jsx                 ← Root component
│   │   ├── main.jsx                ← Entry point
│   │   └── index.css               ← Full design system
│   ├── index.html                  ← SEO + OG meta tags
│   ├── package.json
│   └── vite.config.js
├── server/                  ← Node.js/Express backend
│   ├── index.js             ← API server with /api/subscribe
│   ├── .env                 ← Your environment variables
│   ├── .env.example         ← Template with all placeholders
│   ├── supabase-schema.sql  ← Database schema for Supabase
│   ├── webhook-sample.js    ← Sample webhook handler
│   └── package.json
├── vanilla-export/          ← Standalone HTML/CSS/JS
│   └── index.html
└── README.md
```

---

## 🛠️ Quick Start

### Prerequisites
- **Node.js** 18+ and **npm**
- (Optional) **Supabase** account for database storage

### 1. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Configure environment

```bash
cd server
# Edit .env with your credentials (n8n webhook is pre-configured)
```

### 3. (Optional) Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `server/supabase-schema.sql`
3. Copy your project URL and anon key to `server/.env`

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔗 n8n Webhook Integration

The subscribe form POSTs data directly to your n8n webhook. The JSON payload:

```json
{
  "name": "Neil Armstrong",
  "age": 39,
  "email": "neil@nasa.gov",
  "interests": ["Planets", "Missions"],
  "consent": true,
  "timestamp": "2026-02-14T14:00:00Z",
  "source": "lovable"
}
```

### Configuring n8n

1. In **n8n**, create a new workflow
2. Add a **Webhook** trigger node → it gives you a URL
3. Update `N8N_WEBHOOK_URL` in `server/.env` and in `client/src/components/SubscribeForm.jsx`
4. Wire the webhook output to your desired actions (email, Google Sheets, Slack, etc.)

> **Current webhook URL**: `https://yash-ninja.app.n8n.cloud/webhook-test/af53988d-27ee-479b-a28d-3b6276496d46`

---

## 🔌 Optional Integrations

### Mailchimp
1. Set `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`, `MAILCHIMP_SERVER_PREFIX` in `.env`
2. Install: `npm install @mailchimp/mailchimp_marketing`
3. Uncomment the Mailchimp section in `server/index.js`

### SendGrid (confirmation emails)
1. Set `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL` in `.env`
2. Install: `npm install @sendgrid/mail`
3. Uncomment the SendGrid section in `server/index.js`

### Google Sheets
1. Set `GOOGLE_SHEETS_WEBHOOK_URL` in `.env`
2. Uncomment the Google Sheets section in `server/index.js`

### Google Analytics
1. Replace `GA_MEASUREMENT_ID` in `client/index.html`
2. Uncomment the GA script tags

---

## 🔐 Double Opt-in

Set `DOUBLE_OPTIN=true` in `server/.env` to enable. This will:
- Mark new subscribers as unverified
- Trigger a confirmation email (requires SendGrid or n8n email action)
- Subscriber must click a link to verify

---

## 🎨 Placeholders to Replace

| Placeholder | Location | Purpose |
|---|---|---|
| `N8N_WEBHOOK_URL` | `server/.env`, `SubscribeForm.jsx` | n8n webhook endpoint |
| `SUPABASE_URL` | `server/.env` | Supabase project URL |
| `SUPABASE_ANON_KEY` | `server/.env` | Supabase anonymous key |
| `MAILCHIMP_AUDIENCE_ID` | `server/.env` | Mailchimp audience ID |
| `SENDGRID_API_KEY` | `server/.env` | SendGrid API key |
| `GA_MEASUREMENT_ID` | `client/index.html` | Google Analytics ID |
| `OG_IMAGE_PLACEHOLDER` | `client/index.html` | Open Graph image URL |

---

## 📦 Production Build

```bash
cd client
npm run build
# Output in client/dist/
```

---

## 📄 License

MIT — Images courtesy of NASA/ESA (public domain).
