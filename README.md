# Farsi Vocabulary Learning App

A modern web application for learning Farsi (Persian) vocabulary one word at a time. Built with Next.js 15, TypeScript, and passwordless authentication.

# TO BUILD

- make word library design better (add words from farsi doc / lessons)
- one extra design color?
- Footer add links to all the pages on the website. We should possible also add some other classical website stuff here or Google SEO stuff, what you recommend?
- PAID model for lessons? / Referral to teacher?
- make cool main page thomasvanwelsenes (show CV, hobbies and entrepeneurship) (cool sky / cali / redwood / highland video / stock image?)
- Make foto site where publish my travel foto's

## Features

- **Passwordless Authentication**: Secure email-based magic link authentication (no passwords required)
- **Farsi Vocabulary Database**: Comprehensive vocabulary storage with Persian script, English translations, and phonetic transcriptions
- **Clean UI**: Minimal, functional interface focused on learning
- **User Progress Tracking**: Foundation for tracking learning progress over time
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js v5 (Auth.js) with magic link email
- **Styling**: Tailwind CSS
- **Database Provider**: Neon (serverless PostgreSQL)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (recommended: [Neon](https://neon.tech) for serverless PostgreSQL)
- SMTP email service (Gmail, SendGrid, etc.) for magic link authentication

## Getting Started

### 1. Clone and Install

```bash
cd farsi-vocab
npm install
```

### 2. Database Setup

Create a PostgreSQL database. For Neon:

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@farsi-vocab.com
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

**Email Setup (Gmail example):**

1. Enable 2-factor authentication on your Google account
2. Generate an App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use this app password as `EMAIL_SERVER_PASSWORD`

### 4. Database Schema Migration

Push the database schema:

```bash
npm run db:push
```

### 5. Seed Initial Data

Populate the database with sample Farsi vocabulary:

```bash
npm run db:seed
```

This adds 15 common Farsi words with translations and examples.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
farsi-vocab/
├── app/                        # Next.js App Router
│   ├── api/auth/              # NextAuth.js API routes
│   ├── dashboard/             # Protected dashboard pages
│   │   ├── layout.tsx         # Dashboard layout with nav
│   │   ├── page.tsx           # Main dashboard
│   │   └── word-card.tsx      # Vocabulary card component
│   ├── login/                 # Authentication pages
│   │   ├── error/             # Auth error page
│   │   ├── verify/            # Email verification page
│   │   ├── login-form.tsx     # Client-side login form
│   │   └── page.tsx           # Login page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── db/                        # Database layer
│   ├── schema.ts              # Drizzle ORM schema definitions
│   ├── index.ts               # Database client
│   └── seed.ts                # Seed script
├── auth.ts                    # NextAuth.js configuration
├── auth.config.ts             # NextAuth.js config
├── middleware.ts              # Route protection middleware
├── drizzle.config.ts          # Drizzle Kit configuration
├── next.config.ts             # Next.js configuration
└── tailwind.config.ts         # Tailwind CSS configuration
```

## Database Schema

### Tables

#### `users`

Stores user accounts (email-based authentication).

- `id` (uuid, primary key)
- `email` (text, unique)
- `email_verified` (timestamp)
- `created_at`, `updated_at` (timestamps)

#### `verification_tokens`

Stores magic link tokens for authentication.

- `identifier` (text) - email address
- `token` (text) - one-time token
- `expires` (timestamp)

#### `vocabulary`

Stores Farsi vocabulary words.

- `id` (uuid, primary key)
- `farsi_word` (text) - Persian script
- `english_translation` (text)
- `phonetic` (text, optional) - pronunciation guide
- `example_farsi` (text, optional)
- `example_english` (text, optional)
- `difficulty_level` (integer, 1-5)
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamps)

#### `user_progress`

Tracks user learning progress (foundation for future features).

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `vocabulary_id` (uuid, foreign key)
- `review_count` (integer)
- `last_reviewed_at` (timestamp)
- `confidence_level` (integer, 1-5)
- `first_seen_at`, `updated_at` (timestamps)

#### `daily_lessons`

Associates vocabulary words with specific dates (for "word of the day" feature).

- `id` (uuid, primary key)
- `vocabulary_id` (uuid, foreign key)
- `lesson_date` (timestamp)
- `created_at` (timestamp)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with sample vocabulary

## Extending the Application

### Adding More Vocabulary

1. **Manual via Drizzle Studio:**

   ```bash
   npm run db:studio
   ```

   Open the browser interface to add/edit vocabulary directly.

2. **Programmatically via seed script:**

   Edit [db/seed.ts](db/seed.ts) to add more words, then run:

   ```bash
   npm run db:seed
   ```

3. **Build an Admin Interface:**
   Create admin routes to add/manage vocabulary through the UI.

### Implementing Daily Lessons

The `daily_lessons` table is ready for a "word of the day" feature:

```typescript
// Example: Create daily lesson
import { db } from "@/db";
import { dailyLessons, vocabulary } from "@/db/schema";

await db.insert(dailyLessons).values({
  vocabularyId: wordId,
  lessonDate: new Date(),
});
```

### Tracking User Progress

The `user_progress` table supports future features:

- Spaced repetition algorithms
- Learning streaks
- Mastery levels
- Review scheduling

Example implementation:

```typescript
import { db } from "@/db";
import { userProgress } from "@/db/schema";

// Record that user viewed a word
await db.insert(userProgress).values({
  userId: session.user.id,
  vocabularyId: wordId,
  reviewCount: 1,
  lastReviewedAt: new Date(),
  confidenceLevel: 3,
});
```

### Adding Spaced Repetition

Build on the foundation with:

1. Algorithm implementation (SM-2, Leitner system, etc.)
2. Review scheduling based on `user_progress.last_reviewed_at`
3. Adaptive difficulty using `confidence_level`

### Authentication Extensions

Current setup uses email magic links. To extend:

- Add OAuth providers (Google, GitHub) in [auth.config.ts](auth.config.ts)
- Customize email templates in NextAuth configuration
- Add user profiles and settings

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Ensure all variables from `.env.example` are set:

- `DATABASE_URL` - Production database
- `NEXTAUTH_URL` - Production URL
- `NEXTAUTH_SECRET` - Strong random secret
- Email configuration for production SMTP

## Security Considerations

- **NEXTAUTH_SECRET**: Use a strong random secret in production
- **Email verification**: Magic links expire automatically
- **HTTPS**: Always use HTTPS in production for secure token transmission
- **Rate limiting**: Consider adding rate limiting for login attempts
- **Input validation**: All user inputs are validated via Zod schemas

## Troubleshooting

### Authentication Issues

- Verify email configuration in `.env`
- Check spam folder for magic link emails
- Ensure `NEXTAUTH_URL` matches your domain
- For Gmail, verify App Password is correct

### Database Connection Issues

- Verify `DATABASE_URL` format
- Check network access to database
- For Neon, verify IP allowlist settings

### Development Issues

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

## Contributing

This is a foundational MVP. Future enhancements:

- [ ] Spaced repetition algorithm
- [ ] Audio pronunciations
- [ ] Quiz/flashcard mode
- [ ] Learning statistics dashboard
- [ ] Mobile app (React Native)
- [ ] Social features (share progress)

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
