# Filament Manager - Cloudflare Pages + D1 Deployment Guide

## What You're Setting Up

This project runs on Cloudflare's free tier:
- **Cloudflare Pages** hosts the frontend (React app)
- **Cloudflare D1** stores your data (SQLite database)
- **Pages Functions** handle the API (serverless backend)

Everything runs on Cloudflare's edge network. No servers to manage.

## Built-in Features

- Mobile-responsive design (cards on phones, tables on desktop)
- Bambu Lab catalog quick-fill - select from 40+ Bambu Lab filaments and the form auto-fills brand, material, diameter, spool weight, cost, and recommended bed/nozzle temperatures
- Auto-deduct filament weight when logging prints
- CSV export for inventory and print log
- Dashboard with stats, material breakdown, and low-stock alerts

---

## Prerequisites

1. A Cloudflare account (free at https://dash.cloudflare.com/sign-up)
2. A domain managed by Cloudflare (or use the free .pages.dev subdomain)
3. Node.js 18+ installed on your computer
4. Git installed

---

## Step 1: Install Dependencies

Unzip the project and open a terminal in the project folder:

```bash
cd filament-app
npm install
```

---

## Step 2: Install Wrangler CLI

Wrangler is Cloudflare's CLI tool:

```bash
npm install -g wrangler
```

Log in to your Cloudflare account:

```bash
wrangler login
```

This opens a browser window to authorize the CLI.

---

## Step 3: Create the D1 Database

```bash
wrangler d1 create filament-db
```

This outputs something like:

```
Created D1 database 'filament-db'
database_id = "abc123-def456-ghi789"
```

Copy that `database_id` value.

Open `wrangler.toml` and replace `REPLACE_WITH_YOUR_DATABASE_ID` with your actual ID:

```toml
[[d1_databases]]
binding = "FILAMENT_DB"
database_name = "filament-db"
database_id = "abc123-def456-ghi789"
```

---

## Step 4: Initialize the Database Schema

Run the schema against your production database:

```bash
wrangler d1 execute filament-db --file=db/schema.sql --remote
```

This creates the `filaments` and `print_logs` tables.

---

## Step 5: Test Locally

Start the local dev server:

```bash
npm run dev
```

In a second terminal, start the Cloudflare dev server (handles API routes + D1):

```bash
npx wrangler pages dev dist --d1 FILAMENT_DB=filament-db
```

Or use the shortcut that runs both together:

```bash
npm run db:init:local
npm run dev
```

Visit http://localhost:8788 to test. Add a few spools, make sure everything saves.

---

## Step 6: Deploy to Cloudflare

Build and deploy:

```bash
npm run build
wrangler pages deploy dist
```

The first time, it asks you to create a Pages project. Name it `filament-manager` (or whatever you want).

After deployment, Wrangler gives you a URL like:
```
https://filament-manager.pages.dev
```

---

## Step 7: Bind D1 to Your Pages Project

Go to the Cloudflare dashboard:

1. Navigate to **Workers & Pages**
2. Click your `filament-manager` project
3. Go to **Settings** > **Bindings**
4. Click **Add** under D1 database bindings
5. Set Variable name to `FILAMENT_DB`
6. Select your `filament-db` database
7. Click **Save**

Redeploy after adding the binding:

```bash
npm run deploy
```

---

## Step 8: Set Up Your Subdomain

If you have a domain managed by Cloudflare (e.g. `yourdomain.com`):

1. In the Cloudflare dashboard, go to your Pages project
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter your subdomain: `filament.yourdomain.com`
5. Cloudflare auto-creates the DNS record
6. Wait a few minutes for it to propagate

Your app is now live at `https://filament.yourdomain.com`

---

## Ongoing Updates

After making code changes, deploy with:

```bash
npm run deploy
```

Or connect a GitHub repo for automatic deploys:

1. Push this project to a GitHub repo
2. In Cloudflare Pages, go to your project settings
3. Click **Manage** under Build configuration
4. Connect to your GitHub repo
5. Set build command: `npm run build`
6. Set build output directory: `dist`

Now every push to `main` triggers a new deploy.

---

## Database Management

View your data:
```bash
wrangler d1 execute filament-db --command "SELECT * FROM filaments" --remote
```

Back up your database:
```bash
wrangler d1 export filament-db --remote --output=backup.sql
```

---

## Cost

All of this runs on Cloudflare's free tier:
- Pages: 500 builds/month, unlimited bandwidth
- D1: 5 million reads/day, 100k writes/day, 5 GB storage
- Functions: 100k requests/day

For personal use, you will never hit these limits.

---

## Troubleshooting

**API returns 500 errors after deploy:**
Make sure the D1 binding is configured in your Pages project settings (Step 7).

**Database tables don't exist:**
Run the schema again: `wrangler d1 execute filament-db --file=db/schema.sql --remote`

**Local dev not connecting to D1:**
Make sure you initialized the local DB: `npm run db:init:local`

**Subdomain not working:**
Check that the DNS record was created under your domain's DNS settings in Cloudflare. It can take up to 5 minutes.
