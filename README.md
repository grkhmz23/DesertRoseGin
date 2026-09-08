# Desert Rose Gin 🍸

A luxury landing page for Desert Rose Gin, a premium Swiss spirit brand. Built with React, TypeScript, and sophisticated animations.

![Desert Rose Gin](client/public/assets/logo.jpg)

## 🌐 Live Demo

Public website: https://www.thedesertrosegin.com/

## ✨ Features

- **Immersive Gallery Navigation** - Circular 3D card carousel on mobile, elegant fan spread on desktop
- **Scene-Based Architecture** - Hero, Story, Experience, Products, and Cocktails scenes
- **Shopify E-Commerce** - Full cart integration with Shopify Storefront API
- **19 Signature Cocktails** - Swipeable card stack with downloadable recipes
- **Multi-language Support** - English, Italian, German, French, Spanish, Arabic (RTL)
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
- **API:** Vercel serverless functions (`api/`)
- **E-Commerce:** Shopify Storefront API
- **Local server:** Express.js (development / self-hosting only)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

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
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_token
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

Vercel serves the built client from `dist/public` and deploys everything in `api/` as serverless functions:

- `api/shopify.js` proxies the Storefront GraphQL API so the access token never reaches the browser bundle.
- `api/market.js` returns the visitor's country from Vercel's geo headers, which drives language selection.

The Express app in `server/` mirrors those two endpoints for local development and self-hosting. It is not part of the Vercel deployment.

## 📁 Project Structure

```
api/                       # Vercel serverless functions (deployed)
├── shopify.js             # Storefront API proxy, keeps the token server-side
└── market.js              # Visitor country from Vercel geo headers
client/
├── public/                # Static media, fonts, PDFs, video, audio
├── index.html             # Gallery site entry
├── signature.html         # Staff email-signature tool (unlisted, noindex)
└── src/
    ├── components/        # Gallery, scenes, UI, music, cart
    ├── experience/        # World policy: cinematic vs performance mode
    ├── i18n/              # Locale config and six translation files
    ├── lib/               # Utilities, Shopify browser client, legal policies
    ├── pages/             # Routed page compositions
    └── signature/         # Signature generator app
script/                    # Build, image conversion, and test scripts
server/                    # Express mirror of api/ for local development
shared/
└── *.ts                   # Shared TypeScript contracts
```

## 🛒 Products

Live prices come from Shopify. The figures below are the static fallbacks in
`client/src/hooks/use-gin-editions.ts`, shown when a live price is unavailable.
All prices are in CHF, VAT included.

### Classic Edition
- 500ml bottle: 48.80
- 500ml Gift Box: 54.90
- Box of 6 x 500ml: 292.80
- Box of 10 x 200ml: 274.00

### Limited Edition
- 500ml bottle: 53.35
- 500ml Gift Box: 62.35
- Box of 6 x 500ml: 320.00

Cocktail Booklet: 3.00. Curated sets and apparel live under THE STORE.

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Credits

- Design & Development: Desert Rose Gin Team
- Source on GitHub, deployed with ❤️ on Vercel
