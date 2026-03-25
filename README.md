# StudyMind AI

An AI-powered document analyzer that lets you upload PDFs and DOCX files to get instant summaries, generate practice tests, and create presentations — built with Next.js, OpenAI, and MongoDB.

## Features

- **Document Analysis** — Upload PDF or DOCX files and get an AI-generated summary with key points and insights
- **Test Generation** — Generate multiple-choice, fill-in-the-blank, enumeration, and essay questions from your document
- **Presentation Generation** — Auto-generate a PowerPoint presentation with customizable templates
- **Download** — Export tests as PDF/DOCX and presentations as PPTX
- **Authentication** — Google OAuth via NextAuth.js
- **Credit System** — Each action (analyze, test, presentation) costs 1 credit
- **Plan Tiers** — Free plan with limits; purchase credits to unlock full access
- **Payments** — Buy credit packs via PayMongo (one-time purchase, no subscription)

## Plan Limits

| Feature               | Free Plan         | Paid (Credits)  |
| --------------------- | ----------------- | --------------- |
| Test questions        | Up to 10          | Unlimited       |
| Presentation slides   | Up to 5           | Up to 20        |
| PPT templates         | Default - Dark    | All 3 templates |

### PPT Templates

| Template      | Style                          | Availability |
| ------------- | ------------------------------ | ------------ |
| Default - Dark | Dark teal background           | Free         |
| Light         | White background, teal accents | Paid         |
| Classic       | Black & white, print-ready     | Paid         |

## Tech Stack

- **Framework** — Next.js (App Router), TypeScript, Tailwind CSS v4
- **AI** — OpenAI GPT-4o mini
- **Storage** — AWS S3 (file uploads)
- **Database** — MongoDB Atlas + Mongoose
- **Auth** — NextAuth.js v4 (Google OAuth, JWT sessions, custom MongoDB adapter)
- **Payments** — PayMongo (checkout sessions + webhooks)
- **File generation** — pptxgenjs, pdfkit, mammoth, docx

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root with the following:

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

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Set up PayMongo webhooks (local)

Install the PayMongo CLI and forward webhooks to your local server:

```bash
paymongo listen --forward-to localhost:3000/api/webhooks/paymongo
```

Copy the webhook secret printed by the CLI into `PAYMONGO_WEBHOOK_SECRET`.

## Database

Uses MongoDB Atlas with two separate databases — one for development and one for production. Set `MONGODB_DB_NAME` to the appropriate database name in each environment.

### Collections

| Collection            | Description                                       |
| --------------------- | ------------------------------------------------- |
| `users`               | User accounts (name, email, credits, plan)        |
| `accounts`            | OAuth provider links (Google)                     |
| `purchases`           | Credit purchase history                           |
| `verification_tokens` | Email verification tokens (NextAuth)              |

### User Plan Field

The `plan` field on users can be:
- `"free"` — default for new users, limited features
- `"paid"` — set after successful PayMongo payment
- `"unpaid"` — set if payment fails or is refunded

## Credit Packs

| Pack    | Credits | Price     |
| ------- | ------- | --------- |
| Starter | 5       | $3 (₱150) |
| Pro     | 20      | $9 (₱450) |

Prices displayed in USD, processed in PHP via PayMongo.

## Deployment

### Environment Variables

Set all environment variables in your hosting platform (e.g. Vercel), replacing dev values with production ones:

```env
NEXTAUTH_URL=https://yourdomain.com
MONGODB_DB_NAME=your_prod_db_name
PAYMONGO_SECRET_KEY=sk_live_...
PAYMONGO_PUBLIC_KEY=pk_live_...
PAYMONGO_WEBHOOK_SECRET=whsk_...
```

### Google OAuth Setup

For Google sign-in to work in production, you must whitelist your production URL in [Google Cloud Console](https://console.cloud.google.com/):

1. Go to **APIs & Services** → **Credentials** → your OAuth 2.0 Client ID
2. Under **Authorized JavaScript origins**, add:
   ```
   https://yourdomain.com
   ```
3. Under **Authorized redirect URIs**, add:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

### PayMongo Webhook

Add a webhook in the PayMongo dashboard pointing to:

```
https://yourdomain.com/api/webhooks/paymongo
```

Event: `checkout_session.payment.paid`
