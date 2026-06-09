# 🚀 API Showcase

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A curated collection of 500+ free APIs across 47 categories for developers**

[🌐 Live Demo](https://api-showcase-app-production.up.railway.app) • [Features](#features) • [Installation](#installation) • [Categories](#categories) • [Contributing](#contributing)

</div>

---

## 📖 About

API Showcase is a modern web application that helps developers discover free APIs for their projects. Whether you're building a weather app, a crypto tracker, or a gaming dashboard, you'll find the right API here.

## ✨ Features

- 🎯 **500+ Free APIs** - Carefully curated and organized
- 📂 **47 Categories** - From Weather to Cyber Security, Crypto to AI
- 🌙 **Dark/Light Mode** - Easy on the eyes
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast & Modern** - Built with Next.js 15
- 🎨 **Beautiful UI** - Glass morphism effects & smooth animations
- ⭐ **Recommended APIs** - Highlighted picks for each category
- 🔍 **Rate Limits** - Know the limits before you start
- 🎉 **v2.0 Update Banner** - Always stay informed about new additions

## 🖥️ Demo

<div align="center">
  <a href="https://api-showcase.up.railway.app/">
    <img src="https://via.placeholder.com/800x400/0ea5e9/ffffff?text=API+Showcase+Demo" alt="API Showcase Screenshot" />
  </a>
  <p><em>Click to view live demo</em></p>
</div>

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React Framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme Management |
| [Lucide React](https://lucide.dev/) | Icons |

## 📁 Project Structure

```
api-showcase/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── not-found.tsx       # 404 page
│   │   └── category/
│   │       └── [id]/           # Dynamic category pages
│   │           ├── page.tsx
│   │           └── CategoryPageClient.tsx
│   │
│   ├── components/             # Reusable React components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Hero.tsx            # Landing hero section
│   │   ├── CategoryGrid.tsx    # Category cards grid
│   │   ├── UpdateBanner.tsx    # v2.0 sticky update banner
│   │   ├── ThemeProvider.tsx   # Theme context provider
│   │   └── ThemeToggle.tsx     # Dark/Light mode toggle
│   │
│   └── data/
│       └── apis.ts             # All API data (500+ APIs)
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/CanKStar0/API-SHOWCASE-APP.git
   cd API-SHOWCASE-APP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📚 Categories

| Category | APIs | Description |
|----------|------|-------------|
| ☁️ Weather | 14 | Weather forecasts, climate data, air quality |
| 💰 Crypto | 21 | Cryptocurrency prices, blockchain data, Web3 |
| 🎮 Gaming | 20+ | Game databases, player stats, card games |
| 🗺️ Maps | 10+ | Geocoding, routing, location services |
| 🎬 Movies | 10+ | Film databases, streaming info |
| 🎵 Music | 10+ | Music streaming, lyrics, audio analysis |
| 📰 News | 10+ | News aggregation, headlines |
| 💵 Finance | 15+ | Stock prices, exchange rates |
| 🚀 Space | 10+ | NASA data, astronomy, satellites |
| 🐾 Animals | 10+ | Pet photos, animal facts |
| 🔒 Security | 19 | Cyber security, malware analysis, threat intel |
| 🔑 Auth | 8 | Passwordless login, OAuth, access control |
| 🤖 AI & ML | 11 | Computer vision, AI models, image recognition |
| 🛒 E-Commerce | 10 | Shopping platforms, mock products, store data |
| ...and 33 more! | | |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Adding a New API

1. Fork the repository
2. Edit `src/data/apis.ts`
3. Add your API to the appropriate category:
   ```typescript
   {
     name: "API Name",
     url: "https://api-url.com",
     description: "What it does",
     rateLimit: "1000 requests/day",
     isRecommended: false,
     isNew: true  // optional
   }
   ```
4. Submit a Pull Request

### Adding a New Category

1. Add the category to `categories` array in `src/data/apis.ts`
2. Add gradient color mapping in `CategoryGrid.tsx` and `CategoryPageClient.tsx`
3. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- All the amazing API providers who offer free tiers
- The open-source community for the awesome tools

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ by [CanKStar0](https://github.com/CanKStar0)

</div>
