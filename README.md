<div align="center">

# 🚀 Kiddiex

### A creative startup for video, design, content & AI

*Video Editing • Content Writing • Graphic Design • Web Development • AI Agents*

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kiddiex-freelancing.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://kiddiex-freelancing.onrender.com)

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_4-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Brevo](https://img.shields.io/badge/Brevo-0B996E?style=flat-square&logo=brevo&logoColor=white)

</div>

---

## ✨ About

**Kiddiex** is a modern, animated portfolio website for a small creative and tech team. It showcases our services, projects and team, and lets visitors reach us through a secure contact form backed by a custom Node.js email server.

The design is inspired by sleek Framer templates: pill-shaped navigation, smooth scroll-linked card animations and a bold dark footer.

## 🎨 Features

| | Feature | Details |
|---|---|---|
| 🧭 | **Fixed pill navbar** | Bordered icon buttons and a text-roll hover effect |
| 🏠 | **Animated home page** | Hero with photo-in-heading, services section, scroll-linked cards |
| 🃏 | **Scroll-linked card animation** | Cards move from an overlapping pile into a row as you scroll |
| 🖼️ | **Projects showcase** | 2-column grid with a follow-cursor "View more" pill |
| 📄 | **Project detail pages** | Overview, features, tools, gallery, timeline and embedded videos |
| 👥 | **Team page** | Each member's photo, skills and a Portfolio button |
| ℹ️ | **About page** | Full-page animations |
| 📬 | **Contact page** | Validated form, contact details and an FAQ accordion |
| 💌 | **Automated emails** | Owner notification and a styled welcome email to the visitor |

## 🛠️ Services

- 🎬 **Video Editing**: including AI-assisted edits and motion graphics
- ✍️ **Content Writing**
- 🎨 **Graphic Design**
- 💻 **Web Development**
- 🤖 **AI Agents**

## 🗂️ Featured Projects

- 📧 **AI Powered Email Copilot**
- ⚖️ **Legal Information Retrieval System**
- 📞 **AI Calling Agent**
- 🎞️ **Video Editing Showreel**: AI editing and motion graphic videos

## 🧰 Tech Stack

**Frontend**
- React, React Router
- Bootstrap 4, react-icons
- Custom CSS scroll-linked animations

**Backend**
- Node.js, Express
- Brevo HTTPS email API
- `express-rate-limit`, honeypot spam protection

**Deployment**
- Frontend on **Vercel**
- Backend on **Render**

## 📁 Project Structure

```
Kiddiex_Freelancing/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Navbar, Footer, cards, etc.
│   │   ├── pages/          # Home, Projects, Team, About, Contact
│   │   └── media/          # Images and videos
│   └── package.json
├── server/                 # Express backend
│   ├── index.js
│   └── .env                # Not committed
└── README.md
```

> Adjust folder names above to match your repository layout.

## ⚡ Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### 1. Clone the repo
```bash
git clone https://github.com/Viveksh18/Kiddiex_Freelancing.git
cd Kiddiex_Freelancing
```

### 2. Run the frontend
```bash
cd client
npm install
npm start
```

### 3. Run the backend
```bash
cd server
npm install
npm start
```

## 🔐 Environment Variables

Create a `.env` file in the server folder:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
SITE_URL=http://localhost:3000
BRAND_NAME=Kiddiex
OWNER_EMAIL=your-inbox@example.com
BREVO_API_KEY=your_brevo_api_key
```

> ⚠️ Never commit your `.env` file or share API keys.

## 📮 Contact API

**`POST /api/contact`**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hi, I'd like to work with you!"
}
```

**Built-in protection**
- 🛡️ Rate limit: 5 requests per 15 minutes
- 🍯 Honeypot field to trap bots
- 🧼 HTML-escaped owner notification emails

## 🎥 Adding a Project

Projects live in a `projects` array:

```js
{
  id: 1,
  title: "Project Name",
  tag: "AI",
  color: "#6C63FF",
  image: coverImage,
  tools: ["React", "Node.js"],
  overview: "Short description...",
  features: ["Feature one", "Feature two"],
  gallery: [],
  timeline: [],
  videos: [
    { type: "youtube", src: "VIDEO_ID" },
    { type: "file", src: localVideo } // imported from src/media/video
  ]
}
```

## 📸 Screenshots

| Home | Projects |
|---|---|
| *Add screenshot* | *Add screenshot* |

| Team | Contact |
|---|---|
| *Add screenshot* | *Add screenshot* |

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📬 Contact

- 🌐 Website: [kiddiex-freelancing.vercel.app](https://kiddiex-freelancing.vercel.app)
- 📧 Email: [Kiddiex2026@gmail.com](mailto:Kiddiex2026@gmail.com)
- 🐙 GitHub: [@Viveksh18](https://github.com/Viveksh18)

---

<div align="center">

**Made with 💜 by the Kiddiex team**

⭐ Star this repo if you like it!

</div>
