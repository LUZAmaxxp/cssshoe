# LYZANE — Frontend Specification

## 1. Project Overview

- **Name:** Lyzane
- **Framework:** Next.js 16.2.10 (React 19.2.4)
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui (base-nova, neutral)
- **State:** Zustand 5.0.14 (persisted cart)
- **Animation:** Framer Motion 12.42.2
- **3D:** Three.js 0.185.1 via @react-three/fiber 9.6.1 + @react-three/drei 10.7.7
- **Admin UI:** MUI v9.2.0 (Material, X-DataGrid, X-Charts)
- **Auth:** NextAuth v5.0.0-beta.31 (Credentials, JWT)
- **Database:** MongoDB via Mongoose 9.7.4
- **Email:** Resend 6.17.2
- **Forms:** React Hook Form 7.82.0 + Zod 4.4.3
- **Icons:** Lucide React 1.25.0

---

## 2. Design System

### 2.1 Brand Colors

| Name | Hex | Tailwind | Usage |
|---|---|---|---|
| Cream | `#f5f5f5` | `cream` | Page background, hero gradient |
| Charcoal | `#1a1a1a` | `charcoal` | Navbar, primary buttons, headings, 3D model |
| Burgundy | `#722f37` | `burgundy` | Accent, CTAs, focus ring, cart badge, liked heart |
| Brass | `#b5985a` | `brass` | Hero title color, chart-2 |

### 2.2 Full Color Palette (Light Mode)

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#f5f5f5` | Page bg |
| `--foreground` | `#1a1a1a` | Default text |
| `--card` | `#ffffff` | Card bg |
| `--primary` | `#1a1a1a` | Primary button bg |
| `--primary-foreground` | `#f5f5f5` | Primary button text |
| `--secondary` | `#ebebeb` | Secondary bg |
| `--muted` | `#ebebeb` | Muted bg |
| `--muted-foreground` | `#6b6b6b` | Secondary text |
| `--accent` | `#722f37` | Accent |
| `--destructive` | `#dc2626` | Error/delete |
| `--border` | `#d4cfc7` | All borders |
| `--input` | `#d4cfc7` | Input borders |
| `--ring` | `#722f37` | Focus ring |

### 2.3 Typography

| Font | Variable | Weight | Usage |
|---|---|---|---|
| **Playfair Display** | `--font-playfair` | default | Headings (h1-h6), `font-heading` |
| **Inter** | `--font-inter` | default | Body text, `font-sans` |
| **Josefin Sans** | `--font-josefin` | 500 | Brand name, `font-brand` class |

**Brand font class:**
```css
.font-brand {
  font-family: var(--font-josefin), sans-serif !important;
  font-weight: 500 !important;
  font-style: normal !important;
  text-transform: uppercase;
  letter-spacing: 0.25em;
}
```

### 2.4 Border Radius Scale
```
--radius: 0.5rem
--radius-sm: 0.3rem
--radius-md: 0.4rem
--radius-lg: 0.5rem
--radius-xl: 0.7rem
--radius-2xl: 0.9rem
--radius-3xl: 1.1rem
--radius-4xl: 1.3rem
```

### 2.5 Responsive Breakpoints

| Prefix | Min-width |
|---|---|
| (default) | 0px |
| `md:` | 768px |
| `lg:` | 1024px |

---

## 3. Layout

### 3.1 Root Layout (`src/app/layout.tsx`)
- HTML: `class="[font-vars] h-full antialiased"`
- Body: `class="min-h-full flex flex-col"`
- Favicon: `/favicon.ico`
- Metadata: title template `%s | Lyzane`, default "Lyzane — Classic Tuxedo & Mocassin Shoes"

### 3.2 Navbar (`src/components/layout/Navbar.tsx`)
- **Position:** Fixed top, full width, `z-50`
- **Background:** `bg-charcoal` (#1a1a1a)
- **Height:** `h-20` (80px)

**Logo:**
- Image: `/images/logo1v1.png`
- Size: `h-14 w-auto` (56px height), 120×40px
- `priority` loading
- Links to `/`

**Desktop Nav** (hidden mobile, `md:flex`):
- Container: `flex items-center gap-8`
- Links: `text-sm tracking-wide text-white/70 hover:text-white transition-colors`
- Links: Shop → `/shop`, Our Story → `/#values`, Craftsmanship → `/#journey`

**Right Controls:**
- Cart button: `<ShoppingBag>` icon `w-5 h-5`
  - Badge: `-top-2 -right-2`, `w-4 h-4`, `bg-burgundy text-white text-[10px] rounded-full`
  - Shows `totalItems()` from Zustand, hidden when 0
- Mobile menu toggle: `md:hidden`, `<Menu>`/`<X>` icons

**Mobile Menu:**
- `md:hidden border-t border-border bg-cream px-4 py-4 space-y-3`
- Links: `block text-sm`, same links as desktop

### 3.3 Footer (`src/components/layout/Footer.tsx`)
- Container: `border-t border-border bg-cream`
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-8`
- Column 1: Logo + brand text
- Column 2: Navigation links
- Column 3: Contact info
- Bottom bar: `mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground`
- Dynamic year copyright

---

## 4. Landing Page

### 4.1 Page Composition (`src/app/page.tsx`)
```
<Navbar />
<main>
  <ShoeHero />
  <NarrativeSection id="values" ... />
  <NarrativeSection id="journey" align="right" ... />
  <NarrativeSection id="purpose" align="left" ... />
  <CTASection />
</main>
<Footer />
```

### 4.2 ShoeHero (`src/components/landing/ShoeHero.tsx`)

**Container:**
- `section relative h-[100vh] flex items-center justify-center overflow-hidden`
- Gradient: `absolute inset-0 bg-gradient-to-b from-cream via-cream to-background`

**3D Detection (`canRun3D()`):**
Returns false if: SSR, `prefers-reduced-motion`, <4 CPU cores, no WebGL.

**Fallback:**
- `w-64 h-64 md:w-96 md:h-96 mx-auto bg-charcoal/5 rounded-2xl flex items-center justify-center`
- Letter "L": `text-6xl md:text-8xl font-heading text-charcoal/20 select-none`

**Three.js Canvas:**
- Camera: `position: [0, 2, 5]`, `fov: 50`
- GL: `antialias: true`, `alpha: true`, transparent background

**Scene Lighting:**
- `ambientLight intensity={0.5}`
- `directionalLight position={[5, 5, 5]} intensity={1}`
- `directionalLight position={[-3, 3, -3]} intensity={0.3}`

**Shoe Model:**
- File: `/models/shoe.obj`
- Material: `MeshStandardMaterial` — color `#1a1512`, roughness 0.35, metalness 0.1
- Centered via BBox, scale normalized to 2 units max dimension
- Group position: `[0.1, 1.2, 0]`
- **Animation:** `rotation.y = Math.sin(elapsedTime * 0.5) * 0.4`
  - Speed: 0.5 rad/s (~1.26s period)
  - Amplitude: 0.4 rad (~23°)

**Text Overlay:**
- Container: `relative z-10 text-center px-4 pt-[30vh]`

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| "Lyzane" h1 | fade + slide up 30px | 1.2s | 0s | `[0.25, 0.1, 0.25, 1]` |
| Subtitle | fade + slide up 20px | 1s | 0.3s | `[0.25, 0.1, 0.25, 1]` |
| "Discover" link | fade | 1s | 1s | linear |

**Title styles:** `text-5xl md:text-7xl lg:text-8xl font-brand`, color `#b5985a` (brass)
**Subtitle:** `mt-4 text-lg md:text-xl text-muted-foreground tracking-wide`
**Discover link:** `inline-block text-sm tracking-widest uppercase text-burgundy border-b border-burgundy pb-1 hover:text-charcoal hover:border-charcoal transition-colors`

### 4.3 NarrativeSection (`src/components/landing/NarrativeSection.tsx`)

**Props:** `id`, `title`, `paragraphs[]`, `align` (left/right/center)

**Layout:**
- Section: `min-h-[80vh] flex items-center py-24 px-4`
- Left: `text-left max-w-2xl`
- Right: `text-right max-w-2xl ml-auto`
- Center: `text-center max-w-3xl mx-auto`
- Title: `text-4xl md:text-5xl lg:text-6xl font-heading text-charcoal mb-8`
- Paragraphs: `text-lg md:text-xl text-muted-foreground leading-relaxed`

**Animation (useInView, once, margin -100px):**

| Element | Duration | Delay | Easing |
|---|---|---|---|
| Title | 1s | 0s | `[0.25, 0.1, 0.25, 1]` |
| Paragraph i | 0.8s | 0.2 + i*0.15s | `[0.25, 0.1, 0.25, 1]` |

**Narrative Content:**

**Section 1 — "The Art of the Shoe"** (center):
- "A tuxedo shoe is not just footwear — it is the final sentence of a well-tailored statement."
- "At Lyzane, we believe elegance begins at the sole. Every curve, every stitch, every finish is deliberate."
- "We craft for those who understand that true luxury whispers, never shouts."

**Section 2 — "Craftsmanship in Motion"** (right):
- "From the first cut of leather to the final polish, our artisans spend over 40 hours on each pair."
- "The mocassin construction wraps the foot in a single piece of leather — seamless, supple, unforgettable."
- "Turn the shoe over and you will find the signature: a hand-stamped mark of authenticity and pride."

**Section 3 — "Built for Moments That Matter"** (left):
- "Black-tie galas. Wedding aisles. Boardrooms. These are the stages where first impressions are permanent."
- "Our shoes do not follow trends — they transcend them. Classic silhouettes, refined over decades."
- "Step with confidence. The rest will follow."

### 4.4 CTASection (`src/components/landing/CTASection.tsx`)

**Layout:**
- Section: `min-h-[60vh] flex items-center justify-center py-24 px-4`
- Content: `text-center max-w-2xl`
- Heading: `text-4xl md:text-5xl lg:text-6xl font-heading text-charcoal mb-6`
- Paragraph: `text-lg text-muted-foreground mb-10`
- Button: `inline-block bg-burgundy text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-charcoal transition-colors duration-300`

**Content:**
- Heading: "Ready to Step Into Elegance?"
- Paragraph: "Each pair is handcrafted to order. Explore our collection and find your perfect fit."
- Button: "Explore the Collection" → `/shop`

**Animation (useInView, once, margin -100px):**

| Element | Duration | Delay | Easing |
|---|---|---|---|
| Heading | 1s | 0s | `[0.25, 0.1, 0.25, 1]` |
| Paragraph | 0.8s | 0.2s | `[0.25, 0.1, 0.25, 1]` |
| Button | 0.8s | 0.4s | `[0.25, 0.1, 0.25, 1]` |

---

## 5. Shop Pages

### 5.1 Shop Page (`src/app/(shop)/shop/page.tsx`)

**Layout:** `container mx-auto px-4 py-8 pt-24`
- `pt-24` accounts for fixed navbar
- Heading: `text-3xl font-heading text-charcoal mb-2` — "Shop"
- Subtitle: `text-muted-foreground mb-8` — "Handcrafted tuxedo and mocassin shoes"

### 5.2 ShopContent (`src/app/(shop)/shop/ShopContent.tsx`)

**Data Fetching:**
- `GET /api/products` or `GET /api/products?category=...`
- Derives unique categories from products

**Loading Skeleton:**
- Grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6`
- 8 placeholders, each with `animate-pulse`:
  - Image: `aspect-square bg-muted rounded`
  - Category: `h-3 bg-muted rounded w-1/3`
  - Name: `h-4 bg-muted rounded w-2/3`
  - Price: `h-3 bg-muted rounded w-1/4`

**Category Filters:**
- Container: `flex flex-wrap gap-2 mb-6`
- Button: `px-3 py-1 text-sm border transition-colors`
- Active: `bg-charcoal text-white border-charcoal`
- Inactive: `border-border hover:border-charcoal`

**Product Grid:**
- `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6`
- Empty: `text-center py-16 text-muted-foreground` — "No products found. Check back soon."

### 5.3 ProductCard (`src/components/shop/ProductCard.tsx`)

**Structure:** `<Link href={/shop/${_id}} class="group block">`

**Image Container:**
- `relative aspect-square overflow-hidden bg-muted`
- Image: `fill object-cover transition-transform duration-500 group-hover:scale-105`
- Fallback: `text-muted-foreground text-4xl font-heading` — "M"

**Like Button:**
- Position: `absolute top-3 right-3`
- Styles: `p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity`
- Liked: `fill-burgundy text-burgundy`
- Unliked: `text-muted-foreground`
- On click: `POST /api/products/${_id}/like`

**Info:**
- Category: `text-xs text-muted-foreground uppercase tracking-wider`
- Name: `text-sm font-medium mt-1`
- Price: `text-sm font-medium` — `${price}`
- Likes: `text-xs text-muted-foreground` — `{likes} likes`

### 5.4 Product Detail (`src/app/(shop)/shop/[slug]/page.tsx`)

**JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "...",
  "description": "...",
  "image": "...",
  "offers": { "@type": "Offer", "priceCurrency": "USD", "price": ..., "availability": "https://schema.org/InStock" },
  "brand": { "@type": "Brand", "name": "Lyzane" }
}
```

**Layout:**
- Container: `container mx-auto px-4 py-8 pt-24`
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-8`

**Product Info:**
- Category: `text-sm text-muted-foreground uppercase tracking-wider`
- Name: `text-3xl font-heading text-charcoal mt-2`
- Price: `text-2xl text-charcoal mt-2`

**Size Selector:**
- Container: `mt-6`
- Label: `text-sm font-medium mb-2` — "Size"
- Buttons: `flex flex-wrap gap-2`
- Each: `px-4 py-2 text-sm border transition-colors`
- Selected: `bg-charcoal text-white border-charcoal`
- Unselected: `border-border hover:border-charcoal`

**Add to Cart Button:**
- `w-full py-3 text-sm tracking-widest uppercase transition-colors`
- Default (size selected): `bg-burgundy text-white hover:bg-charcoal`
- Disabled (no size): `bg-muted disabled:text-muted-foreground`
- Added state: `bg-green-700 text-white` with Check icon + "Added" (resets after 2s)

**Description:** `mt-8 text-muted-foreground leading-relaxed`
**Like Count:** `mt-4 text-sm text-muted-foreground` — "{likeCount} people liked this"

### 5.5 ProductGallery (`src/components/shop/ProductGallery.tsx`)

**Main Image:**
- `relative aspect-square overflow-hidden bg-muted`
- Image: `fill object-cover`
- Fallback: `text-muted-foreground text-6xl font-heading` — "M"

**Thumbnails** (when >1 image):
- Container: `flex gap-2`
- Each: `relative w-16 h-16 overflow-hidden border-2 transition-colors`
- Selected: `border-charcoal`
- Unselected: `border-transparent`

---

## 6. Cart

### 6.1 CartDrawer (`src/components/shop/CartDrawer.tsx`)

**Animations (Framer Motion + AnimatePresence):**

| Element | Initial | Animate | Exit | Transition |
|---|---|---|---|---|
| Backdrop | opacity: 0 | opacity: 1 | opacity: 0 | 0.3s |
| Drawer | x: "100%" | x: 0 | x: "100%" | spring, damping: 30, stiffness: 300 |

**Drawer Panel:**
- `fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col`

**Header:**
- `flex items-center justify-between p-4 border-b`
- Title: `text-lg font-heading` — "Cart"
- Close: `<X className="w-5 h-5" />`

**Items:**
- Container: `flex-1 overflow-y-auto p-4`
- Empty: `text-center text-muted-foreground py-8` — "Your cart is empty"
- Each item: `motion.div` fade + slide up 10px
- Layout: `flex gap-4 border-b pb-4`

**Item Image Placeholder:**
- `w-16 h-16 bg-muted flex-shrink-0 flex items-center justify-center text-xs font-heading` — "M"

**Item Info:**
- Name: `text-sm font-medium truncate`
- Size: `text-xs text-muted-foreground` — "Size: {size}"
- Price: `text-sm mt-1` — "${price}"

**Quantity Controls:**
- Container: `flex items-center gap-2 mt-2`
- Minus: `p-1 border rounded` with `<Minus className="w-3 h-3" />`
- Quantity: `text-sm w-6 text-center`
- Plus: `p-1 border rounded` with `<Plus className="w-3 h-3" />`
- Delete: `ml-auto p-1 text-muted-foreground hover:text-destructive` with `<Trash2 className="w-4 h-4" />`

**Footer (when items exist):**
- Container: `border-t p-4 space-y-4`
- Total: `flex justify-between text-lg font-medium`
- Checkout button: `block w-full bg-burgundy text-white text-center py-3 text-sm tracking-widest uppercase hover:bg-charcoal transition-colors`
- Text: "Checkout via WhatsApp" → `/checkout`

---

## 7. Checkout

### 7.1 Checkout Page (`src/app/(shop)/checkout/page.tsx`)

**Empty Cart State:**
- Content: `container mx-auto px-4 py-8 pt-24 text-center`
- Heading: `text-3xl font-heading text-charcoal mb-4`
- Text: `text-muted-foreground mb-6` — "Your cart is empty."
- Button: `bg-burgundy text-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-charcoal transition-colors`

**Form:**
- Container: `container mx-auto px-4 py-8 pt-24 max-w-2xl`
- Heading: `text-3xl font-heading text-charcoal mb-8`

**Order Summary:**
- Container: `space-y-3 mb-8`
- Each item: `flex justify-between text-sm` — "{name} (Size: {size}) x{quantity}" / "${price * quantity}"
- Total: `border-t pt-3 flex justify-between font-medium text-lg`

**Form Fields:**
All inputs: `w-full border border-border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-ring`
Label: `text-sm font-medium flex items-center gap-2 mb-1`

| Field | Type | Icon | Placeholder |
|---|---|---|---|
| Full Name | `text` | `<User>` | "Your full name" |
| Email | `email` | `<Mail>` | "your@email.com" |
| Phone Number | `tel` | `<Phone>` | "+212 6XX XXX XXX" |
| Delivery Address | `textarea` | `<MapPin>` | "Full delivery address, city" |

Textarea: `min-h-[80px]`

**Submit Button:**
- `w-full bg-burgundy text-white py-3 text-sm tracking-widest uppercase hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center justify-center gap-2`
- Loading: `<Loader2 className="w-4 h-4 animate-spin" /> Processing...`
- Normal: "Order via WhatsApp"

**Submit Flow:**
1. POST to `/api/orders`
2. Constructs WhatsApp message with customer info, items, total, order ID
3. Opens `https://wa.me/{number}?text={message}` in new tab
4. Clears cart
5. Redirects to `/shop`

**WhatsApp Message Format:**
```
New Order from Lyzane

Customer: {name}
Phone: {phone}
Delivery: {address}

Items:
- {name} (Size: {size}) x{quantity} — ${lineTotal}

Total: ${totalPrice}

Order ID: {_id}
```

---

## 8. Admin

### 8.1 Admin Login (`src/app/(admin)/admin/login/page.tsx`)

- Full page centered: `flex min-h-screen items-center justify-center bg-gray-50 px-4`
- Container: `w-full max-w-md`
- Header: `text-3xl font-brand text-gray-900` — "Lyzane", subtitle `text-sm text-gray-500 mt-1` — "Manager Portal"
- Form card: `bg-white rounded-lg border shadow-sm p-8`
- Heading: `text-xl font-semibold text-center mb-6` — "Sign In"

**Fields:**
All inputs: `w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`

| Field | Type | Icon | Placeholder |
|---|---|---|---|
| Email | `email` | `<Mail>` | "admin@lyzane.com" |
| Password | `password` | `<Lock>` | "--------" |

**Submit:** `w-full bg-gray-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2`

### 8.2 Admin Layout

- Outer: `min-h-screen bg-gray-50`
- Inner: `flex min-h-screen` — sidebar + main content
- Main: `flex-1 bg-gray-50 p-8 overflow-auto`

### 8.3 Admin Sidebar (`src/components/admin/AdminSidebar.tsx`)

- Container: `w-64 bg-gray-900 text-white min-h-screen flex flex-col`
- Header: `p-6 border-b border-gray-800`
  - Title: `text-lg font-brand` — "Lyzane"
  - Subtitle: `text-xs text-gray-400 mt-1` — "Admin Panel"

**Nav Items:**

| Label | Icon | href |
|---|---|---|
| Dashboard | `LayoutDashboard` | `/admin` |
| Orders | `ShoppingCart` | `/admin/orders` |
| Analytics | `BarChart3` | `/admin/analytics` |
| Products | `Package` | `/admin/products` |

**Link Styles:**
- Base: `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors`
- Active: `bg-gray-800 text-white`
- Inactive: `text-gray-400 hover:text-white hover:bg-gray-800/50`
- Icons: `w-4 h-4`

**Sign Out:**
- Container: `p-4 border-t border-gray-800`
- Button: `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors w-full`

### 8.4 Admin Dashboard (`src/app/(admin)/admin/page.tsx`)

**Metrics:** totalOrders (hardcoded 0), totalProducts, mostLikedProduct

**MUI Grid:** `<Grid container spacing={3}>`, three columns on `sm+`

| Card | Icon | Color | Value | Label |
|---|---|---|---|---|
| Orders | `ShoppingCart` | primary | totalOrders | "Orders in Process" |
| Most Liked | `Favorite` | error | mostLikedProduct | "Most Liked Product" |
| Products | `Inventory` | success | totalProducts | "Live Products" |

Grid: `xs: 12, sm: 4` per card.

### 8.5 Admin Orders (`src/app/(admin)/admin/orders/page.tsx`)

**MUI DataGrid:**
- Height: `600px`
- PageSizeOptions: `[10, 25, 50]`

**Columns:**

| Field | Header | Flex | Renderer |
|---|---|---|---|
| `customerName` | "Customer" | 1 | Default |
| `phone` | "Phone" | 1 | Default |
| `items` | "Items" | 1 | Custom: `{name} x{qty}` |
| `totalPrice` | "Total" | 0.5 | Custom: `${value}` |
| `status` | "Status" | 1 | Custom: MUI `<Select>` dropdown |
| `createdAt` | "Date" | 1 | Custom: `toLocaleDateString()` |

**Status Options:** `new`, `contacted`, `confirmed`, `shipped`, `cancelled`
On change: `PATCH /api/orders/${orderId}` with `{ status }`

### 8.6 Admin Products (`src/app/(admin)/admin/products/page.tsx`)

**Header:** `flex items-center justify-between mb-4`
- Title: `<Typography variant="h4" sx={{ fontWeight: "bold" }}>` — "Products"
- Add button: `<Link href="/admin/products/new"><Button variant="contained">Add Product</Button></Link>`

**MUI Table:**

| Column | Field |
|---|---|
| "Name" | `product.name` |
| "Category" | `product.category` |
| "Price" | `${product.price}` |
| "Views" | `product.viewCount` |
| "Likes" | `product.likeCount` |
| "Status" | `isArchived` (Chip: Active/Archived) |
| "Actions" | Edit/Archive buttons |

### 8.7 Admin Create/Edit Product

**Form Fields (MUI TextField):**

| Field | Type | Required | Props |
|---|---|---|---|
| Name | text | Yes | `fullWidth` |
| Description | text | Yes | `fullWidth multiline rows={3}` |
| Price ($) | number | Yes | `fullWidth` |
| Category | text | Yes | `fullWidth` |

**Sizes:** Chip management with input + Add button, enter key adds
**Image URLs:** List management with input + Add button, delete `x` per item

**Actions:** Create/Save Changes + Cancel buttons

### 8.8 Admin Analytics (`src/app/(admin)/admin/analytics/page.tsx`)

**MUI BarCharts:**
- Grid: `xs: 12, md: 6` (two columns)
- Chart height: `300px`
- Top 5 Most Viewed Products (by viewCount)
- Top 5 Most Liked Products (by likeCount)
- X-axis names truncated to 15 chars + "..."

---

## 9. Animation Parameters Summary

| Element | Duration | Delay | Easing | Trigger |
|---|---|---|---|---|
| Hero title "Lyzane" | 1.2s | 0s | `[0.25, 0.1, 0.25, 1]` | On mount |
| Hero subtitle | 1s | 0.3s | `[0.25, 0.1, 0.25, 1]` | On mount |
| Hero "Discover" | 1s | 1s | linear | On mount |
| 3D shoe sway | continuous | — | `Math.sin(t*0.5)*0.4` | Per frame |
| Scroll text fade | — | — | — | scrollYProgress 0.8-1.0 |
| Narrative title | 1s | 0s | `[0.25, 0.1, 0.25, 1]` | useInView (once, -100px) |
| Narrative paragraphs | 0.8s | 0.2 + i*0.15s | `[0.25, 0.1, 0.25, 1]` | useInView |
| CTA heading | 1s | 0s | `[0.25, 0.1, 0.25, 1]` | useInView |
| CTA paragraph | 0.8s | 0.2s | `[0.25, 0.1, 0.25, 1]` | useInView |
| CTA button | 0.8s | 0.4s | `[0.25, 0.1, 0.25, 1]` | useInView |
| Cart drawer slide | spring | — | damping: 30, stiffness: 300 | open state |
| Cart backdrop | 0.3s | 0s | default | open state |
| Cart items | — | — | — | fade + slide up 10px on enter |
| Product image hover | 500ms | — | default | group-hover scale 1.05 |
| Like button | — | — | — | opacity 0→1 on group-hover |
| Add to cart "Added" | — | 2s | — | timeout reset |

---

## 10. Zustand Cart Store

**Interface:**
```typescript
interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}
```

**Actions:**

| Action | Behavior |
|---|---|
| `addItem(item)` | Add or increment if same productId+size |
| `removeItem(productId, size)` | Filter out matching item |
| `updateQuantity(productId, size, qty)` | Update or remove if <= 0 |
| `clearCart()` | Empty array |
| `totalItems()` | Sum of quantities |
| `totalPrice()` | Sum of (price * quantity) |

**Persistence:** localStorage key `"lyzane-cart"`

---

## 11. Middleware

**Pattern:** `/admin/:path*`

**Logic:**
1. `/admin/*` (not `/admin/login`): Check session cookie → redirect to login if missing
2. `/admin/login`: Redirect to `/admin` if session exists
3. Otherwise: next()

---

## 12. API Routes

| Method | Endpoint | Purpose | Rate Limited |
|---|---|---|---|
| GET | `/api/products` | List products | No |
| POST | `/api/products` | Create product | No |
| GET | `/api/products/[id]` | Get product + increment views | No |
| PATCH | `/api/products/[id]` | Update product | No |
| POST | `/api/products/[id]/like` | Increment likes | No |
| GET | `/api/orders` | List orders | No |
| POST | `/api/orders` | Create order + send email | Yes (10/min/IP) |
| PATCH | `/api/orders/[id]` | Update order status | No |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth | No |

---

## 13. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `AUTH_SECRET` | Yes | NextAuth JWT secret |
| `RESEND_API_KEY` | Optional | Resend email API key |
| `RESEND_FROM_EMAIL` | Optional | Default: `orders@lyzane.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | Default: `212600000000` |
| `NEXT_PUBLIC_APP_URL` | Optional | Default: `http://localhost:3000` |

---

## 14. File Tree

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (shop)/
│   │   ├── layout.tsx
│   │   ├── shop/
│   │   │   ├── page.tsx
│   │   │   ├── ShopContent.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── checkout/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── login/page.tsx
│   │       ├── orders/page.tsx
│   │       ├── analytics/page.tsx
│   │       └── products/
│   │           ├── page.tsx
│   │           ├── new/page.tsx
│   │           └── [id]/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── products/route.ts
│       ├── products/[id]/route.ts
│       ├── products/[id]/like/route.ts
│       ├── orders/route.ts
│       └── orders/[id]/route.ts
├── components/
│   ├── layout/Navbar.tsx, Footer.tsx
│   ├── landing/ShoeHero.tsx, NarrativeSection.tsx, CTASection.tsx
│   ├── shop/CartDrawer.tsx, ProductCard.tsx, ProductGallery.tsx
│   ├── admin/AdminSidebar.tsx
│   └── ui/button.tsx
├── lib/
│   ├── utils.ts, auth.ts, db.ts, email.ts, rate-limit.ts
│   └── validations/order.ts, product.ts
├── models/
│   ├── Product.ts, Order.ts, AdminUser.ts, AnalyticsEvent.ts
├── stores/cart.ts
└── middleware.ts

public/
├── images/logo1v1.png
├── models/shoe.obj, character.obj
└── fonts/ (Avenir Next family — legacy)
```
