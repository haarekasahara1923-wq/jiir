# Journal of Interdisciplinary Innovation & Research (JIIR)

> **Advancing Knowledge Across Disciplines**  
> *Educate · Innovate · Collaborate*

JIIR is a high-performance, full-stack, production-ready academic journal management and publication platform built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS v4**, **Prisma ORM**, and **PostgreSQL**.

---

## 🏛️ Platform Architecture & Surfaces

The platform consists of three core surfaces:

### 1. Public Journal Website
- **Modern Academic Aesthetic**: Designed with deep navy, warm slate, and gold academic accents, with full dark mode support.
- **Home & Journal Overview**: Aims, scope, indexing statuses, latest publications, editor picks, and call-for-papers alerts.
- **Current & Past Issues**: Comprehensive archive explorer with volume/issue navigation, DOI links, abstracts, citation export, and PDF readers.
- **Editorial Board**: Categorized directory of Chief Editors, Section Editors, and Advisory Board members with affiliation and ORCID badges.
- **Information & Guidelines**: Author guidelines, publication ethics (COPE aligned), peer review workflow, open-access policy, and APC transparency.
- **Tracking & Public Lookup**: Public manuscript tracker using tracking ID (e.g. `JIIR-2026-XXXX`) and certificate verification.
- **Online Fee Payment**: Integrated Razorpay checkout with fallback lookup and payment confirmation receipt generator.

### 2. Scholar Portal (`/scholar`)
- **Self-Service Author Hub**: Authors can register, manage their academic profile, institutional affiliations, and ORCID ID.
- **Manuscript Submission Wizard**: Guided multi-step submission with title, abstract, keywords, research area, co-author management, and secure document upload.
- **Manuscript Tracker**: Real-time lifecycle monitoring through editorial triage, blind peer review, revision requests, acceptance, and publication.

### 3. Editorial & Admin Panel (`/admin`)
- **Manuscript Management**: Detailed submission review, assignment to section editors and peer reviewers, decision recording (Accept, Revise, Reject).
- **Scholar Directory**: Manage registered researchers, review account statuses (Active, Suspended, Blocked).
- **CMS & Site Settings**: Dynamic management of journal metadata, indexing badges, announcement banners, FAQs, navigation, and logos.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` tokens
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/) with Credentials & Prisma Adapter
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Data Fetching**: TanStack React Query v5
- **Forms & Validation**: React Hook Form with Zod schemas
- **Document Processing**: `pdf-lib` for watermarking and certificates, `qrcode` for verification badges
- **Media & Cloud**: Cloudinary SDK for manuscript assets & media uploads
- **Payment Gateway**: Razorpay API integration

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or higher (v22 LTS recommended)
- **PostgreSQL**: A running PostgreSQL instance (local or hosted, e.g., Supabase / Neon / Render)

### 1. Environment Configuration

Copy `.env.example` to `.env` or verify the configuration in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jiir_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="your-32-character-random-secret"

# Cloudinary (Media storage)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Razorpay (Online APC payments)
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# Default Super Admin Seed
SEED_SUPERADMIN_EMAIL="admin@jiir.in"
SEED_SUPERADMIN_PASSWORD="Admin@JIIR2026!"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database Schema & Seed Data

Ensure your PostgreSQL service is running, then run:

```bash
# Push Prisma schema to your database
npm run db:push

# Populate initial journal settings, admin user, issues, and sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials

After running `npm run db:seed`, the following default super admin account is available:

- **Portal URL**: [http://localhost:3000/login](http://localhost:3000/login)
- **Email**: `admin@jiir.in`
- **Password**: `Admin@JIIR2026!`

*(Authors can register directly at `/register` to test the scholar submission flow.)*

---

## 📁 Project Directory Structure

```
jiir/
├── prisma/
│   ├── schema.prisma       # Database schema (User, Manuscript, Issue, Setting, etc.)
│   └── seed.ts             # Comprehensive database seed script
├── public/
│   └── brand/              # Logos, crests, and branding assets
├── src/
│   ├── app/
│   │   ├── (auth)/         # Login, Register with Suspense CSR boundaries
│   │   ├── (public)/       # Public pages: home, archive, editorial board, etc.
│   │   ├── admin/          # Editorial & Admin dashboard
│   │   ├── scholar/        # Scholar author portal & manuscript submission
│   │   ├── api/            # Route handlers (auth, manuscripts, payments, scholars)
│   │   ├── globals.css     # Tailwind CSS v4 design tokens and theme variables
│   │   └── layout.tsx      # Root application layout
│   ├── components/         # Reusable UI components & navigation
│   ├── lib/                # Auth, Prisma client, Cloudinary, Razorpay utilities
│   └── middleware.ts       # Route guards and authentication proxy
└── next.config.ts          # Turbopack and Tailwind v4 loader configuration
```

---

## 🧪 Production Verification

To verify full build integrity:

```bash
npm run build
```

---

## 📄 License & Attribution

Published by JIIR Publications. All rights reserved.
