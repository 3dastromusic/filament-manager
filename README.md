# Filament Manager - Cloudflare Pages + D1 Deployment Guide

## What You're Setting Up

This project runs on Cloudflare's free tier:
- **Cloudflare Pages** hosts the frontend (React app)
- **Cloudflare D1** stores your data (SQLite database)
- **Pages Functions** handle the API (serverless backend)

Everything runs on Cloudflare's edge network. No servers to manage.

## Built-in Features

- **Multi-user accounts** with username/password login - each user has their own private filament inventory
- Mobile-responsive design (cards on phones, tables on desktop)
- Bambu Lab catalog quick-fill - 40+ Bambu Lab filaments with auto-fill for brand, material, diameter, spool weight, cost, and recommended bed/nozzle temps
- Auto-deduct filament weight when logging prints
- CSV export for inventory and print log
- Dashboard with stats, material breakdown, and low-stock alerts
- Secure session cookies (HTTP-only, signed) with 30-day expiration
- PBKDF2 password hashing using the Web Crypto API

---

## Prerequisites

1. A Cloudflare account (free at https://dash.cloudflare.com/sign-up)
2. A domain managed by Cloudflare (or use the free .pages.dev subdomain)
3. Node.js 18+ installed on your computer
4. Git installed

---

## Step 1: Install Dependencies

Unzip the project and open a terminal in the project folder:

```
cd filament-app
npm install
```

---

## Step 2: Install Wrangler CLI

Wrangler is Cloudflare's CLI tool:

```
npm install -g wrangler
```

Log in to your Cloudflare account:

```
wrangler login
```

---

## Step 3: Create the D1 Database

```
wrangler d1 create filament-db
```

Copy the `database_id` it outputs and paste it into `wrangler.toml`, replacing `REPLACE_WITH_YOUR_DATABASE_ID`.

---

## Step 4: Initialize the Database Schema

For a fresh install, run the schema:

```
wrangler d1 execute filament-db --file=db/schema.sql --remote
```

**If you already had data from a pre-auth version**, instead run the migration:

```
wrangler d1 execute filament-db --file=db/migrate-add-auth.sql --remote
```

Then after creating your first user account through the app, claim your existing data with:

```
wrangler d1 execute filament-db --remote --command "UPDATE filaments SET user_id = 1 WHERE user_id IS NULL; UPDATE print_logs SET user_id = 1 WHERE user_id IS NULL;"
```

(Replace `1` with your actual user_id if you happen to sign up someone else first.)

---

## Step 5: Deploy to Cloudflare

```
npm run build
wrangler pages deploy dist
```

Name the project `filament-manager` (or whatever you want).

---

## Step 6: Bind D1 to Your Pages Project

1. Cloudflare dashboard > **Workers & Pages**
2. Click your `filament-manager` project
3. **Settings** > **Bindings**
4. Click **Add** under D1 database bindings
5. Variable name: `FILAMENT_DB`
6. Database: `filament-db`
7. Save and redeploy: `npm run deploy`

---

## Step 7: Set Up Your Subdomain

If you have a domain managed by Cloudflare:

1. Pages project > **Custom domains**
2. **Set up a custom domain**
3. Enter your subdomain: `filament.yourdomain.com`
4. Cloudflare auto-creates the DNS record

---

## Step 8: Create Your First Account

Visit your live URL. You'll see the sign-in screen. Click **Sign up**, create your account with a username and password, and you're in.

To add additional users, just share the URL with them and they can create their own accounts. Each person's inventory is private to their account.

---

## Local Development

```
npm run db:init:local
npm run dev
```

In a second terminal:

```
npx wrangler pages dev dist --d1 FILAMENT_DB=filament-db
```

Visit http://localhost:8788

---

## Updates

```
git add .
git commit -m "describe changes"
git push
```

If connected to GitHub, Cloudflare auto-rebuilds.

Otherwise: `npm run deploy`

---

## Security Notes

- Passwords are hashed with PBKDF2 (100,000 iterations, SHA-256), never stored in plaintext
- Session tokens are 256-bit random values stored in HTTP-only Secure cookies
- Sessions expire after 30 days of inactivity (you can adjust this in `functions/_lib/auth.js`)
- Each user's data is isolated at the database level - the API enforces user_id on every query
- Logout revokes the session token in the database

---

## Database Management

View users:
```
wrangler d1 execute filament-db --remote --command "SELECT id, username, email, created_at FROM users"
```

Reset a user's password (replace USER_ID with their id and NEW_HASH with a hash from the app):
```
# Easier: have them create a new account, then delete the old one
wrangler d1 execute filament-db --remote --command "DELETE FROM users WHERE id = USER_ID"
```

Back up:
```
wrangler d1 export filament-db --remote --output=backup.sql
```

---

## Troubleshooting

**API returns 401 Not Authenticated:** Your session cookie expired or wasn't set. Sign in again.

**API returns 500 errors after deploy:** D1 binding not configured in Pages project (Step 6).

**Schema errors:** Run the schema again: `wrangler d1 execute filament-db --file=db/schema.sql --remote`

**Local dev not connecting to D1:** Run `npm run db:init:local` first.

**Subdomain not working:** Wait up to 5 minutes for DNS propagation.
