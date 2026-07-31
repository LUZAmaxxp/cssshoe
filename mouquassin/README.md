# Lyzane — Handcrafted Tuxedo & Mocassin Shoes

A luxury e-commerce platform for handcrafted tuxedo and mocassin shoes, built with Next.js, MongoDB, and Cloudinary. Features a cinematic landing page, public shop with WhatsApp checkout, admin dashboard, and full i18n support (English, Arabic RTL, French).

**Live site:** [https://lyzane.ma](https://lyzane.ma)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [API Routes](#api-routes)
- [i18n (Internationalization)](#i18n)
- [Image & Video Hosting](#image--video-hosting)
- [SEO](#seo)
- [Admin Dashboard](#admin-dashboard)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MongoDB (Mongoose) |
| Authentication | NextAuth.js (credentials provider) |
| Image/Video CDN | Cloudinary |
| Email | Resend |
| Push Notifications | ntfy.sh |
| Animations | Framer Motion |
| Icons | Lucide React |
| State Management | Zustand (cart) |
| Fonts | Playfair Display (headings), Tenor Sans (brand), Inter (body), Noto Sans Arabic |

---

## Features

### Landing Page
- **Intro Reveal** — Animated logo entrance on first visit (mobile: centered logo, desktop: full image)
- **Hero Section** — Full-viewport video background with parallax scroll, CTA button
- **Art of the Shoe** — 50/50 split layout with transparent PNG, ambient + floor shadows, ghost numeral "01", gradient bridge, editorial caption
- **Brand Grid** — 4-card feature grid with translated content
- **Split Feature** — Reusable split layout with gold subtitle, ghost numeral, CTA
- **Craft Section** — Video background with overlay, ghost numeral "03"

### Shop
- **Product Grid** — Responsive 2/3/4 column grid with auto-fit
- **Category Filters** — Brass underline active state, horizontal scroll on mobile
- **Product Cards** — Buy Now + heart like button, like count display
- **Sparse State Placeholder** — "More arriving soon" when fewer than 4 products
- **Infinite Scroll** — "Load More" button for pagination

### Product Detail Page
- **Gallery** — Full-width image with left/right arrows, fullscreen lightbox (React Portal, Escape key, body scroll lock)
- **Color Selector** — All colors shown, unavailable ones crossed out with diagonal strikethrough
- **Size Selector** — Selectable chips, unavailable sizes crossed out, error only after attempted add-to-cart
- **CTA Buttons** — "Add to Cart" (filled) + heart wishlist + "Buy Now" (outlined)
- **Trust Icons** — Free delivery + 14-day returns
- **Size Guide** — Modal with guide_size.PNG image
- **Expandable Sections** — Product Details and Delivery accordions
- **Related Products** — From same category, "You may also like"
- **JSON-LD** — Product structured data for Google

### Cart & Checkout
- **Cart Drawer** — Slide-in from right, quantity controls, remove item, total
- **Checkout Form** — Name/phone/address required, email optional
- **Order Success** — Success screen with optional WhatsApp button
- **Order Notifications** — Admin email via Resend, push via ntfy.sh

### Admin Dashboard (`/admin`)
- **Login** — Credentials-based auth (`admin@lyzane.com` / `admin123`)
- **Dashboard** — Total orders, most liked product, live products count
- **Products** — List with images, views, likes, archive/unarchive, add new
- **Product Forms** — 4-step wizard (Details → Pricing → Colors → Review)
  - Color variants with name, hex color, images per color, sizes per color
  - Cloudinary image upload
- **Orders** — List with status badges, expandable details, status update (new → contacted → confirmed → shipped → cancelled)
- **Analytics** — Most viewed/liked products with bar charts, recent orders table, revenue stats

### Internationalization (i18n)
- **3 Languages** — English, Arabic (RTL), French
- **Language Selector** — Full-screen modal on first visit, cookie-persisted
- **All strings translated** — Nav, hero, shop, product, cart, checkout, footer
- **RTL Support** — Automatic dir="rtl" for Arabic, font overrides

### Search
- **Search Modal** — Full-screen dark overlay, live search with 300ms debounce
- **Results** — Product thumbnails, name, category, price

### SEO
- **Metadata** — Title templates, descriptions, keywords (14 terms)
- **Open Graph** — Full OG tags with images for social sharing
- **Twitter Cards** — Summary large image
- **JSON-LD** — ShoeStore schema (homepage), Product schema (detail pages)
- **Sitemap** — Auto-generated from products API
- **Robots.txt** — Allows all, blocks /admin and /api
- **Google Verification** — Meta tag for Search Console

---

## Project Structure

```
mouquassin/
├── src/
│   ├── app/
│   │   ├── (admin)/admin/          # Admin dashboard
│   │   │   ├── analytics/          # Analytics page
│   │   │   ├── login/              # Admin login
│   │   │   ├── orders/             # Order management
│   │   │   ├── products/           # Product list
│   │   │   │   ├── [id]/           # Edit product
│   │   │   │   └── new/            # Create product
│   │   │   ├── layout.tsx          # Admin layout with sidebar
│   │   │   └── page.tsx            # Dashboard
│   │   ├── (shop)/
│   │   │   ├── checkout/           # Checkout page
│   │   │   └── shop/
│   │   │       ├── [slug]/         # Product detail
│   │   │       ├── ShopContent.tsx # Product grid
│   │   │       ├── layout.tsx      # Shop metadata
│   │   │       └── page.tsx        # Shop page
│   │   ├── api/                    # API routes
│   │   │   ├── orders/             # Order CRUD
│   │   │   ├── products/           # Product CRUD + categories
│   │   │   └── upload/             # Cloudinary upload
│   │   ├── globals.css             # Tailwind config, brand colors
│   │   ├── layout.tsx              # Root layout, fonts, metadata
│   │   ├── page.tsx                # Homepage
│   │   ├── robots.ts               # Robots.txt
│   │   └── sitemap.ts              # Sitemap.xml
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminSidebar.tsx
│   │   ├── landing/
│   │   │   ├── ArtOfShoe.tsx       # Split section with shadows
│   │   │   ├── BrandGrid.tsx       # 4-card feature grid
│   │   │   ├── CraftSection.tsx    # Video background section
│   │   │   ├── HeroCarousel.tsx    # Hero with video
│   │   │   ├── IntroReveal.tsx     # Intro animation
│   │   │   └── SplitFeature.tsx    # Reusable split layout
│   │   ├── layout/
│   │   │   ├── Footer.tsx          # Black mobile / cream desktop
│   │   │   ├── LanguageSelector.tsx # First-visit language picker
│   │   │   ├── Navbar.tsx          # Responsive navbar
│   │   │   ├── SearchModal.tsx     # Live search overlay
│   │   │   ├── VideoAutoplay.tsx   # Force play on mobile
│   │   │   └── client-providers.tsx # I18n + global providers
│   │   └── shop/
│   │       ├── CartDrawer.tsx      # Slide-in cart
│   │       ├── ProductCard.tsx     # Product card
│   │       └── ProductGallery.tsx  # Image gallery + lightbox
│   ├── i18n/
│   │   ├── config.ts               # Locale definitions
│   │   └── context.tsx             # I18nProvider, useLocale, t(), tArray()
│   ├── lib/
│   │   ├── connectDb.ts            # MongoDB connection
│   │   ├── email.ts                # Resend email functions
│   │   ├── notify.ts               # ntfy.sh push notifications
│   │   └── validations/            # Zod schemas
│   │       ├── order.ts
│   │       └── product.ts
│   ├── models/
│   │   ├── Order.ts                # Order model
│   │   └── Product.ts              # Product model with color variants
│   ├── locales/
│   │   ├── en.json                 # English translations
│   │   ├── ar.json                 # Arabic translations
│   │   └── fr.json                 # French translations
│   └── stores/
│       └── cart.ts                 # Zustand cart store
├── public/
│   ├── favicon.png                 # Logo favicon
│   └── images/                     # Static images
├── .env.local                      # Environment variables
├── next.config.ts                  # Security headers, Cloudinary
├── tailwind.config.ts              # Tailwind theme
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account
- Resend API key (for emails)

### Installation

```bash
git clone https://github.com/LUZAmaxxp/cssshoe.git
cd mouquassin
npm install
```

### Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=your-secret-key
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=orders@lyzane.com
CLOUDINARY_CLOUD_NAME=dzrsbjdma
CLOUDINARY_API_KEY=111723593858282
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_WHATSAPP_NUMBER=212631604905
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `AUTH_SECRET` | NextAuth.js secret for session encryption | Yes |
| `RESEND_API_KEY` | Resend API key for transactional emails | Yes |
| `RESEND_FROM_EMAIL` | Sender email address | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number for checkout (with country code) | No |

---

## Authentication

Admin login uses NextAuth.js with credentials provider.

- **Email:** `admin@lyzane.com`
- **Password:** `admin123`

Protected routes: `/admin/*`

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (supports `?category=`, `?search=`, `?limit=`, `?page=`) |
| GET | `/api/products/categories` | List all categories |
| GET | `/api/products/[id]` | Get product by ID or slug |
| POST | `/api/products` | Create product |
| PATCH | `/api/products/[id]` | Update product |
| POST | `/api/products/[id]/like` | Increment like count |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order (sends email + push notification) |
| PATCH | `/api/orders/[id]` | Update order status |
| POST | `/api/upload` | Upload image to Cloudinary |

---

## i18n

Three languages with full translations:

| Locale | Name | Direction |
|--------|------|-----------|
| `en` | English | LTR |
| `ar` | العربية | RTL |
| `fr` | Français | LTR |

Usage in components:
```tsx
const { t, tArray, locale, setLocale } = useLocale();
t("shop.title")        // string
tArray("brandGrid.items") // string[]
```

Translation files: `src/locales/{en,ar,fr}.json`

---

## Image & Video Hosting

All media is hosted on Cloudinary (`res.cloudinary.com/dzrsbjdma/`).

**Cloud name:** `dzrsbjdma`

Key assets:
- Logo: `lyzane/logo1v1.png`
- Title: `lyzane/title-nobg.png`
- Hero video: `lyzane/hero-video.mp4`
- Craft video: `lyzane/craft-video.mp4`
- Product images: `lyzane/[product-name].png`

Upload endpoint: `POST /api/upload` (multipart/form-data)

---

## SEO

- **Metadata:** Title templates, 14 keywords, Open Graph, Twitter Cards
- **Structured Data:** ShoeStore schema (homepage), Product schema (detail pages)
- **Sitemap:** Auto-generated at `/sitemap.xml`
- **Robots:** `/robots.txt` allows all, blocks `/admin` and `/api`
- **Google Verification:** Meta tag for Search Console
- **Domain:** `https://lyzane.ma`

---

## Admin Dashboard

Access at `/admin/login`.

**Pages:**
- **Dashboard** — Order count, most liked product, product count
- **Products** — CRUD with 4-step wizard, color variants, Cloudinary upload
- **Orders** — Status management (new → contacted → confirmed → shipped → cancelled)
- **Analytics** — View/like counts with bar charts, revenue, recent orders

**Security:**
- CORS headers
- Rate limiting per-route
- Security headers (CSP, X-Frame-Options, etc.)

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Set environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

### Post-Deployment Checklist

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Request indexing for homepage and key pages
- [ ] Set up Google Business Profile (if physical store)
- [ ] Verify SSL certificate
- [ ] Test checkout flow end-to-end
- [ ] Test all three languages
- [ ] Test mobile responsiveness

---

## License

Private — Lyzane © 2026
