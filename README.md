# StudyMind AI

An AI-powered document analyzer that lets you upload PDFs and DOCX files to get instant summaries, generate practice tests, and create presentations — built with Next.js, OpenAI, and MongoDB.

## Features

- Upload PDF or DOCX files and get an AI-generated summary with key points and insights
- Generate multiple-choice, fill-in-the-blank, enumeration, and essay questions from your document
- Auto-generate a PowerPoint presentation with customizable templates
- Export tests as PDF/DOCX and presentations as PPTX
- Google OAuth sign-in via NextAuth.js
- Credit system — each generation costs 1 credit
- Free plan with limits; purchase credits to unlock full access
- Buy credit packs via PayMongo (one-time purchase, no subscription)

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS v4 |
| AI | OpenAI GPT-4o mini |
| Storage | AWS S3 |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth.js v4 (Google OAuth, JWT) |
| Payments | PayMongo (checkout sessions + webhooks) |
| File Generation | pptxgenjs, pdfkit, mammoth, docx |

## Plan Limits

| Feature | Free Plan | Paid (Credits) |
|---------|-----------|----------------|
| Test questions | Up to 10 | Unlimited |
| Presentation slides | Up to 5 | Up to 20 |
| PPT templates | Default - Dark | All 3 templates |

### PPT Templates

| Template | Style | Availability |
|----------|-------|--------------|
| Default - Dark | Dark teal background | Free |
| Light | White background, teal accents | Paid |
| Classic | Black & white, print-ready | Paid |

## Credit Packs

| Pack | Credits | Price |
|------|---------|-------|
| Starter | 5 | $3 (₱150) |
| Pro | 20 | $9 (₱450) |

Prices displayed in USD, processed in PHP via PayMongo.

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

Requires a `.env` file in the root:

```env
# OpenAI
OPENAI_API_KEY=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# MongoDB
MONGODB_URI=
MONGODB_DB_NAME=

# PayMongo
PAYMONGO_SECRET_KEY=sk_test_...
PAYMONGO_PUBLIC_KEY=pk_test_...
PAYMONGO_WEBHOOK_SECRET=whsk_...
```

To test PayMongo webhooks locally, install the PayMongo CLI and run:

```bash
paymongo listen --forward-to localhost:3000/api/webhooks/paymongo
```

Copy the printed webhook secret into `PAYMONGO_WEBHOOK_SECRET`.

## Database

Uses MongoDB Atlas with two separate databases — one for development and one for production. Set `MONGODB_DB_NAME` accordingly.

### Collections

| Collection | Description |
|------------|-------------|
| `users` | User accounts (name, email, credits, plan) |
| `accounts` | OAuth provider links (Google) |
| `purchases` | Credit purchase history |
| `verification_tokens` | Email verification tokens (NextAuth) |

The `plan` field on users: `"free"` (default), `"paid"` (after successful payment), `"unpaid"` (payment failed or refunded).
