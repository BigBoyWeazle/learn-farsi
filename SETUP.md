# Quick Setup Guide

This guide will get you up and running in under 10 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

### Option A: Neon (Recommended - Free Tier Available)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:pass@host/db`)

### Option B: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
createdb farsi_vocab
```

Your connection string will be: `postgresql://localhost:5432/farsi_vocab`

## Step 3: Configure Environment

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your database URL:

   ```env
   DATABASE_URL=your-connection-string-here
   ```

3. Generate an auth secret:

   ```bash
   openssl rand -base64 32
   ```

   Add it to `.env`:

   ```env
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Configure email (for testing, you can use Gmail):

   ```env
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your.email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=noreply@farsi-vocab.com
   ```

   **Gmail App Password:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Generate an app password
   - Use that password (not your regular Gmail password)

## Step 4: Initialize Database

Push the schema to your database:

```bash
npm run db:push
```

Seed with sample vocabulary:

```bash
npm run db:seed
```

## Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing Authentication

1. Click "Get Started"
2. Enter your email address
3. Check your email for the magic link
4. Click the link to sign in
5. You'll be redirected to the dashboard with vocabulary words

## Next Steps

- View your database: `npm run db:studio`
- Add more vocabulary words in Drizzle Studio
- Explore the codebase structure in the [README](README.md)

## Common Issues

**Email not arriving?**

- Check spam/junk folder
- Verify Gmail App Password is correct
- Make sure 2FA is enabled on your Google account

**Database connection error?**

- Verify DATABASE_URL in `.env` is correct
- Check if database exists
- For Neon, ensure you're using the correct region URL

**Port 3000 already in use?**

```bash
npm run dev -- -p 3001
```

This will run the app on port 3001 instead.
