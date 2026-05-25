# Creamy Corner — Ice Cream E-Commerce & Admin Dashboard

A Next.js + React + TypeScript + Supabase ice cream e-commerce/admin dashboard application. **All product data comes exclusively from Supabase** — no local product arrays, mock data, or hardcoded values.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20 or newer
- **npm** 10 or newer
- **Git**
- **Supabase** account with active project
- **.env.local** file with Supabase credentials

### Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file with Supabase credentials (see section below)

# 3. Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## ⚙️ Supabase Configuration

> **Note (credentials):** For security, do **not** commit real Supabase values. Use environment variables (`.env.local` for local dev). The README includes the variable names you must set, plus where to find them in Supabase.


This section guides you through setting up your Supabase connection.

### Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project dashboard
3. Click **Settings** → **API** in the left sidebar
4. Copy these values:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. For database migrations, get your database credentials:
   - In **Settings** → **Database**, find your connection string
   - Copy the **Connection Pooler** URL for `DATABASE_URL`
   - Copy the **Direct Connection** URL for `DIRECT_URL`
   - Replace `[YOUR-PASSWORD]` with your actual database password

### Step 2: Create `.env.local` File

In the project root, create a file named `.env.local` and add your Supabase URL, anon key, and (optionally) database URLs:


```env
# ============================================
# SUPABASE PUBLIC (Client-Side) CONFIGURATION
# ============================================
# These values are public and safe to expose

# Your Supabase project URL
# Format: https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase public/anon key
# Starts with: sb_publishable_...
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your_key_here

# ============================================
# SUPABASE DATABASE CONFIGURATION (Optional)
# ============================================
# Only needed if running migrations or seeding
# Replace [YOUR-PASSWORD] with your database password

# Connection pooling URL (recommended for serverless)
DATABASE_URL="postgresql://postgres.[your-project-id]:postgres@aws-1-region.pooler.supabase.com:6543/postgres?pgbouncer=true&password=[YOUR-PASSWORD]"

# Direct database connection (for migrations)
DIRECT_URL="postgresql://postgres.[your-project-id]:postgres@aws-1-region.pooler.supabase.com:5432/postgres?password=[YOUR-PASSWORD]"
```

**⚠️ Security Warning:**
- Never commit `.env.local` to version control (it's in `.gitignore`)
- Keep your database password safe
- Never share your keys publicly
- Rotate keys if accidentally exposed

---

## 🔑 Application Access

### Admin Credentials

| Item | Value |
|------|-------|
| **URL** | `/login` or `http://localhost:3000/login` |
| **Email** | `admin@creamycorner.pk` |
| **Password** | `admin123` |

> **Note:** If your Supabase auth/admin user credentials differ, update the values in the admin-login flow and/or Supabase seed/auth setup. This README documents the demo credentials currently expected by the app.

### Customer Access

| Item | Details |
|------|---------|
| **URL** | `/shop` or `http://localhost:3000/shop` |
| **Access** | Guest checkout — no login required |

---

## 📍 Available URLs

### Local Development (http://localhost:3000)

| Page | URL | Purpose |
|------|-----|---------|
| **Home** | `/` | Landing page |
| **Shop** | `/shop` | Browse & purchase ice cream |
| **Login** | `/login` | Admin authentication |
| **Products Dashboard** | `/products` | Manage products (admin only) |
| **Orders Dashboard** | `/orders` | View orders (admin only) |
| **Analytics** | `/analytics` | Sales & product analytics (admin only) |
| **Track Order** | `/track-order` | Customer order tracking |
| **Cart** | `/cart` | Shopping cart |
| **Customers** | `/customers` | Customer list (admin only) |
| **Ratings** | `/ratings` | Product ratings (admin only) |
| **Debug** | `/debug` | Database connection test |

### Production (Vercel Deployment)

| Item | URL |
|------|-----|
| **App Home** | https://creamy-corner-web.vercel.app |
| **Shop** | https://creamy-corner-web.vercel.app/shop |
| **Login** | https://creamy-corner-web.vercel.app/login |
| **Orders API** | POST https://creamy-corner-web.vercel.app/api/orders |

---

## 🔨 Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after npm run build)
npm run start

# Run ESLint to check code quality
npm run lint

# Format code (if configured)
npm run format
```

---

## 📊 Supabase Database Schema

### Products Table

All product data comes from the `products` table in Supabase:

```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,           -- PKR (Pakistani Rupees)
  image_path TEXT DEFAULT '',                          -- URL to product image
  stock INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  category TEXT,                           -- 'Kulfi' | 'Cone' | 'Sundae' | 'Takeaway' | 'Specialty'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Related Tables

- **orders** — Customer orders
- **customers** — Customer profiles
- **order_items** — Line items in orders
- **ratings** — Product ratings & reviews

---

## 🗂️ Project Architecture

### Key Directories

```
app/                              # Next.js App Router
├── api/orders/route.ts          # Order creation API
├── shop/page.tsx                # Product listing & shopping
├── products/page.tsx            # Product management (admin)
├── orders/page.tsx              # Order management (admin)
├── analytics/page.tsx           # Sales analytics
├── track-order/page.tsx         # Order tracking
└── ...

components/
├── dashboard/                    # Admin dashboard components
│   ├── products-table.tsx       # CRUD for products
│   ├── orders-table.tsx         # Order list
│   └── ...
├── products/
│   ├── product-card.tsx         # Individual product display
│   └── recommendations.tsx      # Recommended products
└── ui/                          # Reusable UI components (shadcn/ui)

lib/
├── supabase.ts                  # Supabase client setup
├── supabase-client.ts           # Client-side Supabase wrapper
├── types/product.ts             # Product TypeScript type
└── data/
    └── seed-orders.ts           # Sample order data (internal only)

hooks/
├── use-supabase.ts              # Supabase hook
├── use-cart.tsx                 # Shopping cart state
└── use-toast.ts                 # Toast notifications
```

### Data Flow

```
Supabase Database
       ↓
   Supabase Client (lib/supabase.ts)
       ↓
   React Components & Pages
       ↓
   UI Display
```

---

## ✅ Product Data Requirements

### Rules

1. **Single Source of Truth**: All product data must come from Supabase `products` table
2. **No Mock Data**: No hardcoded arrays, JSON files, or local fallbacks
3. **No Unused Assets**: All product images must be URLs from Supabase Storage or external CDN
4. **Empty State**: Display empty state when no products exist, not mock data
5. **Real CRUD**: All create, read, update, delete operations use Supabase

### Compliance Checklist

- ✅ No `lib/data/products.ts` mock data file
- ✅ No placeholder/demo product arrays
- ✅ No Unsplash demo image URLs
- ✅ No local product image assets
- ✅ All components import from `lib/types/product.ts`
- ✅ All API routes query Supabase directly
- ✅ Empty states implemented for zero products
- ✅ No API mocking or fallback logic

---

## 🧪 Testing

### Test Product Operations

1. **Add Product**
   - Go to `/login` with `admin@creamycorner.pk` / `admin123`
   - Navigate to `/products`
   - Click "Add Product" and fill in form
   - Verify in `/shop` that product appears

2. **View Products**
   - Visit `/shop`
   - See all products from Supabase
   - Test search & category filters

3. **Edit/Delete Products**
   - In `/products` dashboard
   - Click edit/delete on any product
   - Verify Supabase updates

4. **Empty State**
   - Delete all products from Supabase dashboard
   - Visit `/shop`
   - Verify empty state message appears

5. **Place Order**
   - Go to `/shop`
   - Add products to cart
   - Complete checkout
   - Verify order created in `/orders` dashboard

---

## 🔍 Debugging

### Check Database Connection

```bash
# Visit the debug page
http://localhost:3000/debug
```

This page tests Supabase connectivity and displays connection status.

### View Logs

```bash
# Check browser console for errors
# Check terminal for server-side errors
npm run dev   # Look for errors in terminal
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Supabase URL not found" | Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` |
| "Anon key missing" | Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` |
| "No products showing" | Check products exist in Supabase `products` table |
| "404 on /api/orders" | Verify API route exists at `app/api/orders/route.ts` |

---

## 📦 Technologies Used

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **UI Library**: shadcn/ui
- **Deployment**: Vercel
- **Package Manager**: npm

---

## 📝 Removed Files

The following files were intentionally removed because they contained mock data or were temporary:

- `lib/data/products.ts` — Mock product data (67 hardcoded products)
- `lib/data/seed.ts` — Mock data seeding script
- `lib/data/seed-simple.mjs` — Alternative mock seed script
- `public/mock-products/` — Directory of demo images
- `Project_Submission_Final.html` — Submission artifact
- `pnpm-lock.yaml` — Redundant lock file
- `tsconfig.tsbuildinfo` — Build artifact
- `take-screenshots.mjs` — Utility script
- `video-walkthrough.mjs` — Documentation script
- `demo/` — Demo directory
- `screenshots/` — Screenshots directory

See [MOCK_DATA_REMOVAL_REPORT.md](MOCK_DATA_REMOVAL_REPORT.md) for detailed removal log.

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main

# Vercel auto-deploys on push to main branch
# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Set Environment Variables in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📞 Support

For issues with:
- **Supabase**: Visit [Supabase Docs](https://supabase.com/docs)
- **Next.js**: Visit [Next.js Docs](https://nextjs.org/docs)
- **This Project**: Check [MOCK_DATA_REMOVAL_REPORT.md](MOCK_DATA_REMOVAL_REPORT.md) or create an issue

---

## 📄 License

This project is proprietary. All rights reserved.
