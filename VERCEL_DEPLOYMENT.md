# Vercel Deployment Guide

This guide will walk you through deploying the Web Platform to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A PostgreSQL database (you can use Vercel Postgres, Supabase, Neon, or any other provider)
3. Clerk account for authentication
4. OpenAI API key (for AI features)
5. Optional: AWS S3 or Uploadthing for file storage
6. Optional: Qdrant for semantic search

## Deployment Steps

### 1. Prepare Your Database

First, ensure you have a PostgreSQL database ready. You can use:
- **Vercel Postgres**: Available in your Vercel dashboard
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Option B: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

### 3. Configure Environment Variables

In your Vercel project settings, add the following environment variables:

#### Required Variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# OpenAI
OPENAI_API_KEY="sk-..."
```

#### Optional Variables:

```bash
# Clerk URLs (if customizing)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"

# Uploadthing (alternative to S3)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"

# Qdrant (for semantic search)
QDRANT_URL="https://your-cluster.qdrant.io"
QDRANT_API_KEY="your-api-key"

# Application URL
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### 4. Initialize Database

After deployment, you need to run database migrations:

1. Go to your Vercel project dashboard
2. Navigate to the "Functions" tab
3. Create a new function or use Vercel CLI:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

Or if using Vercel Postgres:
```bash
vercel db push
```

### 5. Post-Deployment Setup

1. **Set up Clerk Webhook** (if using webhooks):
   - Go to Clerk Dashboard → Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`

2. **Configure CORS** (if needed):
   - Update allowed origins in your API routes

3. **Set up custom domain** (optional):
   - In Vercel project settings → Domains
   - Add your custom domain

## Build Configuration

The project includes a `vercel.json` file with optimized settings:

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "functions": {
    "src/app/api/ai/*/route.ts": {
      "maxDuration": 30
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Ensure DATABASE_URL is correctly formatted
   - Check if database allows connections from Vercel IPs
   - For Vercel Postgres, use the connection string from your dashboard

2. **Prisma Client Error**
   - The `postinstall` script should handle this automatically
   - If issues persist, add `prisma generate` to your build command

3. **Environment Variables Not Loading**
   - Ensure all variables are added in Vercel dashboard
   - Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

4. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Run `npm run build` locally to test

### Performance Optimization:

1. **Enable Vercel Analytics**:
   ```bash
   npm i @vercel/analytics
   ```

2. **Use Vercel Image Optimization**:
   - Images are automatically optimized with Next.js Image component

3. **Enable ISR (Incremental Static Regeneration)**:
   - Already configured for dynamic content

## Monitoring

1. **Vercel Dashboard**: Monitor deployments, functions, and errors
2. **Clerk Dashboard**: Track authentication metrics
3. **Database Monitoring**: Use your database provider's dashboard

## Security Best Practices

1. Never commit `.env` files
2. Use Vercel's environment variable system
3. Enable Vercel's DDoS protection
4. Set up proper CORS policies
5. Use Clerk's security features

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- Clerk Documentation: https://clerk.com/docs

For project-specific issues, check the repository's issue tracker.
