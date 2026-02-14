# 🚀 NASA Space Exploration — Weekly Space Photos Newsletter

A stunning, immersive space-themed subscription website that lets users sign up to receive weekly space photos via email. Built with **React (Vite)**, **Node.js/Express**, and **Supabase**, powered by **n8n** for automated workflows.

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

[n8n](https://n8n.io) is the backbone of our email automation:

1. **Webhook Trigger** — Receives subscriber data (name, email, interests) when someone fills the form
2. **NASA API Node** — Fetches the Astronomy Picture of the Day (APOD) or images matching the subscriber's interests (Planets, Nebulae, Galaxies, Missions)
3. **Email Compose** — Builds a beautiful HTML email with the space photo, description, and credits
4. **Send Email** — Delivers the email via Gmail / SMTP / SendGrid
5. **Scheduled Trigger** — Runs weekly (every Monday) to send new space photos to all subscribers automatically

### 📡 n8n Webhook Payload

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
| 🌠 **Animated Starfield** | Canvas-based twinkling stars with shooting stars |
| 🔭 **Parallax Hero** | Glassmorphic card with nebula gradient background |
| 🖼️ **Space Gallery** | 3 NASA image cards with click-to-enlarge lightbox |
| 📝 **Subscribe Form** | Full validation, honeypot anti-spam, rate limiting |
| 🚀 **Rocket Animation** | Confetti + rocket launch on successful subscribe |
| 📱 **Fully Responsive** | Mobile-first (480px, 768px, 1024px breakpoints) |
| ♿ **Accessible** | ARIA labels, focus outlines, keyboard navigation |
| 🔒 **Secure** | Server-side webhook calls, rate limiting, honeypot |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 6 + Vanilla CSS |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Automation | n8n (NASA API + email delivery) |
| Fonts | Orbitron (headlines) + Inter (body) |
| Images | NASA public domain (Cassini, Hubble, etc.) |

---

## 📁 Project Structure

```
Nasa-Exploration/
├── client/                  ← React (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          — Sticky nav + hamburger menu
│   │   │   ├── Hero.jsx            — Parallax hero section
│   │   │   ├── Starfield.jsx       — Canvas animated starfield
│   │   │   ├── Gallery.jsx         — NASA photo cards
│   │   │   ├── ImageModal.jsx      — Lightbox image viewer
│   │   │   ├── SubscribeForm.jsx   — Form → backend → n8n
│   │   │   ├── ConfettiRocket.jsx  — Rocket + confetti animation
│   │   │   ├── SuccessModal.jsx    — Post-subscribe modal
│   │   │   ├── Toast.jsx           — Notification toasts
│   │   │   └── Footer.jsx          — Social icons + privacy
│   │   ├── App.jsx                 — Root component
│   │   ├── main.jsx                — React entry point
│   │   └── index.css               — Full design system
│   ├── index.html                  — SEO + Open Graph meta tags
│   ├── vite.config.js              — Vite config + API proxy
│   └── package.json
├── server/                  ← Node.js/Express backend
│   ├── index.js             — API + n8n webhook forwarding
│   ├── supabase-schema.sql  — Database table schema
│   ├── webhook-sample.js    — Sample webhook handler
│   ├── .env.example         — All config placeholders
│   └── package.json
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
cd client && npm install
cd ../server && npm install
```

### 3. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env — n8n webhook is pre-configured
# Add your Supabase URL + key if using database storage
```

### 4. (Optional) Set up Supabase
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

## 📧 Email Delivery Flow (via n8n)

1. User fills subscribe form → data sent to **Express backend** (`POST /api/subscribe`)
2. Backend stores subscriber in **Supabase** + forwards data to **n8n webhook**
3. n8n workflow:
   - Calls **NASA APOD API** to fetch the latest space photo
   - Creates an HTML email with the photo + description
   - Sends the email via **Gmail SMTP** to the subscriber
4. **Scheduled n8n trigger** runs weekly to send new photos to all subscribers

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#071427` (deep space navy) |
| Accent Purple | `#7b61ff` |
| Accent Cyan | `#00e6ff` |
| Gradient | `linear-gradient(135deg, #7b61ff, #00e6ff)` |
| Headline Font | Orbitron |
| Body Font | Inter |

---

## 👤 Author

**Yash** — [GitHub](https://github.com/YashCube-x)

## 📄 License

MIT — Space images courtesy of NASA/ESA (public domain).
