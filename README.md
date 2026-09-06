# 🚀 NovaBlog AI — Autonomous Auto-Blogging Platform

NovaBlog AI is a production-ready, fully automated blogging platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM (SQLite)**, and **Google Gemini AI**.

It autonomously writes, formats in Markdown, enriches with SEO metadata, pairs with Unsplash photography, and publishes engaging, high-quality blog posts on a recurring schedule across diverse trending topics—with zero manual writing required.

---

## 🌟 Key Features

- 🤖 **Autonomous AI Content Engine**:
  - Automatically rotates across categories (*Technology, Health & Wellness, Finance & Money, Lifestyle, Science, World Trends, Productivity*).
  - Uses Google Gemini API (`gemini-1.5-flash` or `gemini-2.0-flash`) on the **free tier**.
  - Generates SEO-optimized titles, 800–1200 word Markdown articles, 150-character meta descriptions, and relevant tags.
  - Automatically pairs articles with high-resolution imagery via Unsplash API with automatic curated fallbacks.
  
- ⏱️ **Dual Scheduling System**:
  - **Vercel Cron** (`vercel.json`) for seamless zero-maintenance cloud scheduling (configured for twice daily).
  - **Node-Cron Worker** (`scripts/cron-worker.js`) for self-hosted VPS or local development (`npm run cron`).
  - Protected endpoint (`/api/cron/generate`) secured by `CRON_SECRET`.

- 💻 **Public Blog Frontend**:
  - **Homepage**: Responsive grid with featured story, real-time client-side search, category filter, reading time estimates, and publication badges.
  - **/blog/[slug]**: Beautiful prose Markdown reader with OpenGraph tags, Twitter Cards, and schema.org `BlogPosting` JSON-LD structured data.
  - **/category/[category]**: Category archives with breadcrumbs.
  - **SEO Feeds**: Dynamic `/sitemap.xml`, `/robots.txt`, and full `/rss.xml` feed.

- 🛡️ **Admin Dashboard (`/admin`)**:
  - Password-protected with session cookie authentication (`ADMIN_PASSWORD`).
  - Real-time metrics overview (Total Articles, Published, Drafts, Active Topics).
  - **"Generate New Post Now"** instant button with category picker and live progress feedback.
  - Full article editor with live split-screen Markdown preview, draft ↔ published toggle, and delete actions.
  - Settings panel to add or remove rotating topic categories dynamically.

---

## 📁 Tech Stack & Directory Structure

```text
auto-blog/
├── app/
│   ├── admin/                    # Admin Dashboard & Login
│   │   ├── login/page.tsx
│   │   ├── posts/[id]/edit/      # Markdown post editor
│   │   └── page.tsx
│   ├── api/
│   │   ├── admin/                # Admin endpoints (auth, posts, generate, settings)
│   │   └── cron/generate/        # Secured cron endpoint
│   ├── blog/[slug]/page.tsx      # SEO post reader & JSON-LD
│   ├── category/[category]/      # Category archive
│   ├── layout.tsx                # Root layout (Navbar, Footer, Inter font)
│   ├── page.tsx                  # Home page & BlogExplorer
│   ├── robots.ts                 # Dynamic robots.txt
│   ├── rss.xml/route.ts          # RSS 2.0 feed generator
│   └── sitemap.ts                # Dynamic sitemap generator
├── components/                   # Navbar, Footer, PostCard, CategoryBadge, BlogExplorer
├── lib/
│   ├── auth.ts                   # Admin authentication & sessions
│   ├── constants.ts              # Categories, palettes, fallback images
│   ├── generatePost.ts           # Gemini AI generation engine
│   ├── prisma.ts                 # Prisma ORM singleton
│   ├── settings.ts               # Dynamic category persistence
│   ├── slugify.ts                # Collision-free slug generator
│   └── unsplash.ts               # Unsplash photo fetcher & fallback
├── prisma/
│   ├── schema.prisma             # Post and Setting database schema
│   └── seed.ts                   # Initial seed data
├── scripts/
│   └── cron-worker.js            # Standalone node-cron scheduler
├── vercel.json                   # Vercel Cron configuration
└── tailwind.config.ts            # Tailwind + @tailwindcss/typography
```

---

## 🔑 Getting Your Free API Keys

### 1. Google Gemini API Key (Free)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** and create a key in a new or existing Google Cloud project.
4. Copy the API key and set it as `GEMINI_API_KEY` in your `.env`.

### 2. Unsplash Access Key (Optional)
1. Visit [Unsplash Developers](https://unsplash.com/developers).
2. Create a free developer account and click **New Application**.
3. Copy your **Access Key** and set it as `UNSPLASH_ACCESS_KEY` in `.env`.
> *Note: If left blank, the app will automatically use curated high-resolution photography matched to each category.*

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Database (SQLite file)
DATABASE_URL="file:./dev.db"

# Google Gemini API Key
GEMINI_API_KEY="your_gemini_api_key_here"

# Unsplash API Access Key (Optional)
UNSPLASH_ACCESS_KEY="your_unsplash_access_key_here"

# Admin Dashboard Password
ADMIN_PASSWORD="admin123_secure_password"

# Cron API Secret Token
CRON_SECRET="cron_secret_key_987654321"

# Public site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed Sample Posts
```bash
npx prisma db push
npm run seed
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Blog Home**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Password: `admin123_secure_password`)*
- **RSS Feed**: [http://localhost:3000/rss.xml](http://localhost:3000/rss.xml)
- **Sitemap**: [http://localhost:3000/sitemap.xml](http://localhost:3000/sitemap.xml)

### 4. Run the Standalone Local Cron Worker (Optional)
To test or run the scheduled auto-poster in the background on your computer or VPS:
```bash
npm run cron
```

---

## ☁️ Deploying to Vercel

1. **Push your code to GitHub / GitLab**.
2. **Import the repository into [Vercel](https://vercel.com/)**.
3. **Set Environment Variables in Vercel Project Settings**:
   - `GEMINI_API_KEY`
   - `UNSPLASH_ACCESS_KEY` (optional)
   - `ADMIN_PASSWORD`
   - `CRON_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (set to your production domain, e.g. `https://my-autoblog.vercel.app`)
   - `DATABASE_URL` (For serverless deployments on Vercel, you can connect a hosted database like Turso / libSQL / PostgreSQL via Prisma, or use Vercel Postgres / Supabase).
4. **Vercel Cron**: Vercel will automatically read `vercel.json` and trigger `/api/cron/generate` twice daily with the `CRON_SECRET`.

---

## 🔒 Security & Best Practices

- The `/api/cron/generate` route is protected and will reject any unauthorized requests unless the correct `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret` header is provided.
- The Admin dashboard (`/admin`) uses secure, HTTP-only cookie sessions.
- All AI and network calls are wrapped in defensive error handling so a single failed request never crashes the server or breaks scheduled jobs.

---

## 📝 License
MIT License. Built for autonomous publishing.
