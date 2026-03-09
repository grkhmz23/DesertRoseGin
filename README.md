# Desert Rose Gin 🍸

A luxury landing page for Desert Rose Gin, a premium Swiss spirit brand. Built with React, TypeScript, and sophisticated animations.

![Desert Rose Gin](client/public/assets/logo.jpg)

## 🌐 Live Demo

[Vercel Deployment](https://desert-rose-gin.vercel.app) *(update with your URL)*

## ✨ Features

- **Immersive Gallery Navigation** - Circular 3D card carousel on mobile, elegant fan spread on desktop
- **Scene-Based Architecture** - Hero, Story, Experience, Products, and Cocktails scenes
- **Shopify E-Commerce** - Full cart integration with Shopify Storefront API
- **19 Signature Cocktails** - Swipeable card stack with downloadable recipes
- **Multi-language Support** - English, Italian, German, French
- **Age Verification Gate** - 18+ compliance
- **Smooth Animations** - Framer Motion powered transitions

## 🎨 Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Sand Light | `#F9F5F0` | Light backgrounds |
| Sand | `#E8DCCA` | Warm backgrounds |
| Gold | `#917D37` | Primary accent |
| Copper | `#CD7E31` | Secondary accent |
| Charcoal | `#2B1810` | Dark backgrounds |

**Typography:** Cinzel (luxury), Playfair Display (body), Space Mono (technical)

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **State:** TanStack Query + React Context
- **Backend:** Express.js + Drizzle ORM
- **E-Commerce:** Shopify Storefront API
- **Database:** PostgreSQL

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (optional for frontend-only development)

### Installation

```bash
# Clone the repository
git clone https://github.com/grkhmz23/DesertRoseGin.git
cd DesertRoseGin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Shopify credentials

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_token
```

## 📦 Build for Production

```bash
npm run build
```

## 🌐 Deploy on Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Option 2: GitHub Integration
1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy!

### Vercel Build Settings

This repository is currently deployed to Vercel as a static Vite application.

- Install command: `npm ci`
- Build command: `npm run build:client`
- Output directory: `dist/public`

The Express server in `server/` is not required for the storefront experience that ships from Vercel today. If you later want to use `/api/shopify/*` on Vercel, that needs a separate serverless/API deployment path.

## 📁 Project Structure

```
client/
├── public/                # Static media, fonts, PDFs, video, audio
└── src/
    ├── components/        # Gallery, scenes, UI, music, cart
    ├── experience/        # 3D / world-specific presentation code
    ├── i18n/              # Locale config and translations
    ├── lib/               # Utilities and Shopify browser client
    └── pages/             # Routed page compositions
server/
├── shopify/               # Optional Express Shopify API layer
└── *.ts                   # Server entry, static serving, route registration
shared/
└── *.ts                   # Shared TypeScript contracts
```

## 🛒 Products

### Classic Edition
- 500ml: 52 CHF
- 200ml: 37 CHF
- Gift Box: 62 CHF
- Box of 6: 312 CHF

### Limited Edition
- 500ml: 62 CHF
- Gift Box: 72 CHF
- Box of 6: 372 CHF

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Credits

- Design & Development: Desert Rose Gin Team
- Built with ❤️ on Replit, deployed on Vercel
