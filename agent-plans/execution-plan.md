# Mouquassin — Execution Plan

## Project Overview
A Next.js 15 e-commerce platform for tuxedo/mocassin shoes featuring:
- Cinematic 3D landing page (Spline)
- Public shop with WhatsApp-based checkout
- Authenticated manager dashboard (MUI)

## Execution Strategy
Each phase follows: **Build → Audit → Fix → Next Phase**

---

## Phase 0: Project Setup
**Goal:** Scaffold the Next.js project with all dependencies configured.

### Tasks
1. Init Next.js 15 app with TypeScript + App Router + Tailwind
2. Install and configure shadcn/ui (customer routes)
3. Set up MUI (admin routes only, scoped via route group `(admin)`)
4. Set up MongoDB Atlas connection singleton (`lib/db.ts`)
5. Configure Auth.js v5 with Credentials provider + JWT
6. Set up Zustand store for cart with localStorage persistence
7. Configure `.env` variables

### Deliverables
- `/` — root project with `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`
- `/lib/db.ts` — MongoDB singleton
- `/lib/auth.ts` — Auth.js config
- `/stores/cart.ts` — Zustand cart store
- `.env.example` — documented env vars

---

## Phase 1: Data Models & Validation
**Goal:** Define all Mongoose models with Zod validation schemas.

### Tasks
1. Product model (name, description, price, images[], sizes[], category, isArchived, viewCount, likeCount)
2. Order model (customerName, phone, deliveryLocation, items[], totalPrice, status enum)
3. AnalyticsEvent model (type enum, productId, meta)
4. AdminUser model (email, passwordHash, role)
5. Shared Zod schemas in `/lib/validations/`

### Deliverables
- `/models/Product.ts`
- `/models/Order.ts`
- `/models/AnalyticsEvent.ts`
- `/models/AdminUser.ts`
- `/lib/validations/product.ts`
- `/lib/validations/order.ts`

---

## Phase 2: Landing Page (Spline 3D + Scroll Narrative)
**Goal:** Build the cinematic landing page with 3D shoe and scroll-driven narrative.

### Tasks
1. Install @splinetool/react-spline
2. Build ShoeHero client component (Spline scene embed)
3. Use Framer Motion useScroll() to drive splineApp.setVariable('scrollProgress')
4. Build scroll-triggered narrative sections (values/journey/purpose)
5. Add low-end device fallback (static image + CSS rotation)

### Design Direction
- Neutral editorial palette: cream background, deep charcoal text, burgundy/brass accent
- Serif display font (Playfair Display) + clean sans-serif (Inter)
- Deliberate, slow motion (luxury pacing)
- Sections: Hero → Values → Journey → Purpose → CTA

---

## Phase 3: Shop & Product Pages
**Goal:** Server-rendered product grid and detail pages.

### Tasks
1. `/shop` — product grid with filters (price, size, category)
2. `/shop/[slug]` — detail page (gallery, size selector, add to cart)
3. Log product_view AnalyticsEvent on detail page
4. Wishlist heart icon (Zustand persistence, likeCount API)

---

## Phase 4: Cart & WhatsApp Checkout
**Goal:** Cart drawer and WhatsApp handoff flow.

### Tasks
1. Cart drawer (Zustand state, edit quantity, remove)
2. Checkout: delivery location picker + name/phone
3. Create Order document in MongoDB (status: 'new')
4. Generate wa.me deep link with pre-filled message
5. Log whatsapp_redirect event, redirect to WhatsApp
6. Clear cart after handoff

---

## Phase 5: Manager Authentication
**Goal:** Admin login and route protection.

### Tasks
1. `/admin/login` page (Auth.js Credentials, JWT)
2. Middleware to protect `/admin/*` routes
3. Seed script for first owner AdminUser (bcrypt)

---

## Phase 6: Manager Dashboard
**Goal:** Full admin UI with MUI.

### Tasks
1. `/admin` — dashboard home (metric cards)
2. `/admin/orders` — MUI Data Grid, filter by status, status update
3. `/admin/analytics` — MUI X Charts (view/like rankings, trends)
4. `/admin/products` — product list with edit/archive
5. `/admin/products/new` and `/admin/products/[id]/edit` — form + image upload
6. Soft-delete (isArchived flag)

---

## Phase 7: Polish & Launch
**Goal:** Production-ready deployment.

### Tasks
1. SEO: metadata, OpenGraph, JSON-LD Product schema
2. Rate limiting on public API routes
3. Accessibility pass (motion-safe, alt text, keyboard nav)
4. Cross-browser/device QA (especially 3D on mobile)
5. Deploy to Vercel, connect domain

---

## Open Decisions (Pending User Input)
- Image host: Cloudinary vs UploadThing
- Map library: react-leaflet vs Google Maps
- WhatsApp Business number and message template
