# 🚀 NASA Space Exploration — Weekly Space Photos Newsletter

A stunning, immersive space-themed subscription website that lets users sign up to receive weekly space photos via email. Built with **React**, **Node.js/Express**, and **Supabase**, powered by **n8n** for automated workflows.

---

## 🌌 How It Works

```
User subscribes on the website
        ↓
Express backend receives the form data
        ↓
Data is stored in Supabase (PostgreSQL)
        ↓
Data is forwarded to n8n webhook (server-side)
        ↓
n8n workflow triggers:
  1. Fetches space images from NASA API (APOD / Mars Rover / etc.)
  2. Composes a beautiful email with the space photo
  3. Sends the email to the subscriber via Gmail / SMTP
        ↓
Subscriber receives weekly space photos in their inbox! 🪐📸
```

### 🔗 n8n Automation Workflow

[n8n](https://n8n.io) is the backbone of our email automation. Here's what the n8n workflow does:

1. **Webhook Trigger** — Receives subscriber data (name, email, interests) when someone fills the form
2. **NASA API Node** — Fetches the latest Astronomy Picture of the Day (APOD) or images matching the subscriber's interests (Planets, Nebulae, Galaxies, Missions) from NASA's public API
3. **Email Compose** — Builds a beautiful HTML email with the space photo, image description, and credits
4. **Send Email** — Delivers the email to the subscriber using Gmail / SMTP / SendGrid
5. **Scheduled Trigger** — Runs weekly (every Monday) to send new space photos to all subscribers automatically

### 📡 n8n Webhook URL

The website sends subscriber data to:
```
https://yash-ninja.app.n8n.cloud/webhook-test/af53988d-27ee-479b-a28d-3b6276496d46
```

JSON payload sent to n8n:
```json
{
  "name": "Neil Armstrong",
  "age": 39,
  "email": "neil@nasa.gov",
  "interests": ["Planets", "Nebulae"],
  "consent": true,
  "timestamp": "2026-02-14T14:00:00Z",
  "source": "lovable"
}
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌠 Animated Starfield | Canvas-based twinkling stars with shooting stars |
| 🔭 Parallax Hero | Glassmorphic card with nebula gradient background |
| 🖼️ Space Gallery | 3 NASA image cards with click-to-enlarge lightbox |
| 📝 Subscribe Form | Full validation, honeypot anti-spam, rate limiting |
| 🚀 Rocket Animation | Confetti + rocket launch on successful subscribe |
| 📱 Fully Responsive | Mobile-first design (480px, 768px, 1024px breakpoints) |
| ♿ Accessible | ARIA labels, focus outlines, keyboard navigation |
| 🔒 Secure | Server-side webhook calls, rate limiting, honeypot |

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite 6 + Vanilla CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Automation**: n8n (workflow automation for NASA API + email delivery)
- **Fonts**: Orbitron (headlines) + Inter (body)
- **Images**: NASA public domain (Cassini, Hubble, etc.)

---

## 📁 Project Structure

```
NASA/
├── client/                 ← React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         — Sticky nav + hamburger
│   │   │   ├── Hero.jsx           — Hero with parallax
│   │   │   ├── Starfield.jsx      — Canvas animated stars
│   │   │   ├── Gallery.jsx        — NASA photo cards
│   │   │   ├── ImageModal.jsx     — Lightbox viewer
│   │   │   ├── SubscribeForm.jsx  — Form → backend → n8n
│   │   │   ├── ConfettiRocket.jsx — Success animation
│   │   │   ├── SuccessModal.jsx   — Post-subscribe modal
│   │   │   ├── Toast.jsx          — Notifications
│   │   │   └── Footer.jsx         — Social icons + privacy
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              — Design system
│   └── index.html                 — SEO + Open Graph
├── server/                 ← Express backend
│   ├── index.js            — API + n8n webhook forwarding
│   ├── supabase-schema.sql — Database schema
│   ├── webhook-sample.js   — Sample webhook handler
│   ├── .env.example        — All config placeholders
│   └── .env                — Your actual config (gitignored)
├── vanilla-export/         ← Standalone HTML/CSS/JS version
│   └── index.html
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YashCube-x/Nasa-Exploration.git
cd Nasa-Exploration
```

### 2. Install dependencies
```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 3. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env with your Supabase credentials (n8n webhook is pre-configured)
```

### 4. Set up Supabase (optional)
1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in the SQL Editor
3. Add your URL & key to `.env`

### 5. Start development
```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 3000)
cd client && npm run dev
```

Open **http://localhost:3000** 🎉

---

## 📧 How Email Delivery Works (via n8n)

1. User fills out the subscribe form on the website
2. Form data is sent to the **Express backend** (`POST /api/subscribe`)
3. Backend stores the subscriber in **Supabase** and forwards data to **n8n webhook**
4. n8n workflow:
   - Receives the subscriber data
   - Calls **NASA APOD API** to get the latest space photo
   - Creates an HTML email with the photo + description
   - Sends the email via **Gmail SMTP** to the subscriber
5. A **scheduled n8n trigger** runs weekly to send new photos to all subscribers

### Setting up the n8n Workflow

1. Go to your n8n instance (e.g., `https://yash-ninja.app.n8n.cloud`)
2. Create a new workflow with these nodes:
   - **Webhook** trigger → receives subscriber data
   - **HTTP Request** → `GET https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`
   - **Gmail / SMTP** → send email with the space photo
3. Activate the workflow and switch to the **production webhook URL**

---

## 🎨 Design

- **Background**: Deep space navy (`#071427`) with layered nebula gradients
- **Accent colors**: Nebula purple (`#7b61ff`) → Cyan (`#00e6ff`)
- **Headline font**: Orbitron (futuristic, bold)
- **Body font**: Inter (clean, readable)
- **Effects**: Animated starfield, parallax scrolling, glowing CTAs, glassmorphism

---

## 👤 Author

**Yash** — [GitHub](https://github.com/YashCube-x)

---

## 📄 License

MIT — Space images courtesy of NASA/ESA (public domain).
