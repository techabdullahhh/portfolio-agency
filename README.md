# Portfolio Agency Website

A beautiful, modern, and fully responsive portfolio agency website with a powerful admin panel for content management.

## Features

### Public Website
- 🎨 Modern and clean design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth scrolling and animations
- 🎯 Interactive navigation with active section highlighting
- 💼 Projects showcase section
- 🛠️ Services and technologies section
- 👥 Team members section
- 💬 Testimonials section
- 📧 Contact form
- 🌐 Social media links

### Admin Panel
- 📊 Dashboard with metrics, activity feed, and analytics
- 📝 Full CRUD for Projects, Services, Testimonials, Blog Posts, Team Members
- 📧 Contact Messages inbox with read/unread tracking
- ⚙️ Site Settings (branding, social links, theme toggle, logo/favicon uploads)
- 📁 Media Library for upload/rename/delete
- 🔐 Authentication via NextAuth credentials

## Tech Stack

### Public Site
- HTML, CSS, JavaScript
- Three.js for 3D animations

### Admin Panel
- Next.js 15 App Router + React 19
- TypeScript, Tailwind CSS, shadcn-inspired UI primitives
- NextAuth (credentials provider) with bcrypt-hashed admin user
- Prisma ORM with SQLite (override with PostgreSQL via `DATABASE_URL`)
- React Hook Form + Zod, TanStack Query, Recharts, React Hot Toast

## Project Structure

```
portfolio-agency/
├── index.html              # Main homepage
├── about.html              # About page
├── services.html           # Services page
├── projects.html           # Projects listing
├── blog.html               # Blog listing
├── testimonials.html       # Testimonials page
├── contact.html            # Contact page
├── style.css               # Main stylesheet
├── script.js               # Main JavaScript
├── admin-panel/            # Next.js admin panel
│   ├── app/                # App Router routes (public, admin, and API handlers)
│   ├── components/         # UI kit, dashboard widgets, form wrappers
│   ├── lib/                # Prisma client, auth helpers, upload utilities, validators
│   └── prisma/             # Database schema and seed script
└── README.md               # This file
```

## Getting Started

### Public Website

1. Open `index.html` in your web browser
2. That's it! No build process needed.

### Admin Panel

#### 1. Install dependencies

```bash
cd admin-panel
npm install
```

#### 2. Configure environment

Copy `.env.example` to `.env` and fill in secrets. Important variables:

- `DATABASE_URL` – defaults to local SQLite (`file:./prisma/dev.db`)
- `NEXTAUTH_SECRET` – random string for NextAuth JWT
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` – initial admin credentials seeded into the database
- `UPLOAD_DIR` – path for local media uploads (default `./public/uploads`)

#### 3. Generate schema & seed admin

```bash
npm run db:migrate -- --name init   # create database & tables
npm run db:seed                     # seed admin user and default settings
```

#### 4. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000/login](http://localhost:3000/login) and log in with the seeded admin credentials.

#### 5. Production build

```bash
npm run build
npm start
```

## Public API Endpoints

Unauthenticated JSON APIs consume the same database so the existing static site can fetch fresh content:

```
GET /api/public/projects
GET /api/public/services
GET /api/public/testimonials
GET /api/public/blog
GET /api/public/team
GET /api/public/settings
POST /api/messages       # contact form submissions (name, email, message)
```

### Integrating with the static portfolio site

- Replace hard-coded sections by fetching from the endpoints above (e.g. `fetch('https://your-admin-domain/api/public/projects').then(res => res.json())`).
- Update the portfolio contact form to `POST` to `/api/messages` with JSON `{ name, email, message }`.
- Media URLs returned from the CMS are relative (e.g. `/uploads/filename.jpg`); prefix them with the admin host when rendering on the static site.

## Authentication & Security

- `/login` authenticates via credentials; passwords stored with bcrypt hash.
- Middleware guards all `/admin` and `/api` CRUD routes.
- Update the seeded password immediately via `ADMIN_SEED_PASSWORD` and rerun `npm run db:seed` (or update via database) before deploying.

## Database Notes

- Default SQLite is ideal for local development; swap to PostgreSQL by updating `DATABASE_URL` and re-running migrations.
- Prisma migrations live under `prisma/migrations`. Use `npm run db:migrate -- --name your_change` to evolve the schema.

## Deployment

The project deploys cleanly to Vercel, Render, or any Node host supporting Next.js App Router:

1. Provide production environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.).
2. Run migrations on deploy (`npx prisma migrate deploy`).
3. Seed an admin user once (`npm run db:seed`).

The static HTML files can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## License

This project is open source and available for personal and commercial use.

---

**Enjoy your beautiful portfolio agency website!** 🚀
