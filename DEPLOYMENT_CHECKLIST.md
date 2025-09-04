# Quick Deployment Checklist for Vercel

## Pre-Deployment
- [ ] Code is committed to GitHub
- [ ] All tests pass locally (`npm run test`)
- [ ] Build works locally (`npm run build`)

## Required Services Setup
- [ ] PostgreSQL database created and accessible
- [ ] Clerk account created and configured
- [ ] OpenAI API key obtained

## Vercel Deployment
1. [ ] Go to https://vercel.com/new
2. [ ] Import your GitHub repository
3. [ ] Add environment variables:
   - [ ] `DATABASE_URL`
   - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - [ ] `CLERK_SECRET_KEY`
   - [ ] `OPENAI_API_KEY`
4. [ ] Click "Deploy"

## Post-Deployment
- [ ] Run database migrations:
  ```bash
  vercel env pull .env.local
  npx prisma migrate deploy
  ```
- [ ] Verify deployment at your Vercel URL
- [ ] Test core features:
  - [ ] Authentication (sign up/sign in)
  - [ ] Course browsing
  - [ ] AI features
- [ ] Set up custom domain (optional)

## Optional Services
- [ ] AWS S3 or Uploadthing for file uploads
- [ ] Qdrant for semantic search
- [ ] Vercel Analytics for monitoring

## Troubleshooting Commands
```bash
# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy
vercel --prod
```

Need help? Check `VERCEL_DEPLOYMENT.md` for detailed instructions.
