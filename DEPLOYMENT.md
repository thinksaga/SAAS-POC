# Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (or alternative platform)
- Production credentials for:
  - Clerk
  - Neon (PostgreSQL)
  - Upstash (Redis)
  - Razorpay

## Step-by-Step Deployment

### 1. Prepare Production Credentials

#### Clerk (Production App)
1. Go to https://dashboard.clerk.com
2. Create a new production application
3. Note down:
   - Publishable key
   - Secret key
4. Configure:
   - Production domain
   - Webhook endpoint: `https://yourdomain.com/api/clerk-webhook`

#### Neon (Production Database)
1. Go to https://console.neon.tech
2. Create new project (choose region closest to users)
3. Copy connection string
4. Enable connection pooling

#### Upstash (Production Redis)
1. Go to https://console.upstash.com
2. Create new Redis database (choose region)
3. Copy REST URL and token
4. Enable TLS

#### Razorpay (Live Mode)
1. Go to https://dashboard.razorpay.com
2. Switch to "Live Mode"
3. Copy live API keys
4. Create production subscription plans:
   - Lite: ₹999/month
   - Pro: ₹2,999/month
5. Set webhook: `https://yourdomain.com/api/razorpay-webhook`

### 2. Deploy to Vercel

#### Option A: Via Dashboard
1. Push code to GitHub
2. Visit https://vercel.com/new
3. Import repository
4. Configure project:
   - Framework: Next.js
   - Root directory: ./
   - Build command: `npm run build`
   - Output directory: `.next`

5. Add environment variables (copy from `.env.example`)
6. Deploy

#### Option B: Via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Setup Database

```bash
# Push schema to production database
DATABASE_URL="your-production-url" npm run db:push
```

### 4. Configure Webhooks

#### Clerk Webhook
1. In Clerk dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/clerk-webhook`
3. Select events:
   - user.created
   - user.updated
   - user.deleted
4. Copy signing secret to `CLERK_WEBHOOK_SECRET`

#### Razorpay Webhook
1. In Razorpay dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/razorpay-webhook`
3. Select events:
   - subscription.activated
   - subscription.charged
   - subscription.cancelled
   - subscription.paused
   - subscription.resumed
   - payment.captured
   - payment.failed
4. Copy secret to `RAZORPAY_WEBHOOK_SECRET`

### 5. Test Production

1. Visit your domain
2. Sign up with test account
3. Verify email
4. Check dashboard loads correctly
5. Test subscription upgrade (use Razorpay test cards)
6. Verify webhook events in logs

### 6. Setup Custom Domain (Optional)

1. In Vercel dashboard → Domains
2. Add your domain
3. Configure DNS records
4. Wait for SSL certificate
5. Update webhook URLs with new domain

## Environment Variables Checklist

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...

# Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Razorpay
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Post-Deployment

### Monitor
- Check Vercel logs
- Monitor Clerk user signups
- Track Razorpay transactions
- Monitor Redis cache hits
- Check database queries

### Optimize
- Enable Vercel Analytics
- Setup error tracking (e.g., Sentry)
- Configure monitoring alerts
- Optimize images
- Enable caching headers

### Backup
- Setup automated database backups
- Export user data regularly
- Keep environment variable backups secure

## Alternative Platforms

### Railway
```bash
railway login
railway init
railway up
```

### Render
1. Connect repository
2. Select Web Service
3. Add environment variables
4. Deploy

### AWS Amplify
1. Connect repository
2. Configure build settings
3. Add environment variables
4. Deploy

## Rollback Plan

If issues occur:

1. **Vercel**: Instantly rollback to previous deployment
2. **Database**: Restore from backup
3. **Environment**: Revert to previous env vars
4. **Webhooks**: Disable if causing issues

## Support

For deployment issues:
- Check Vercel docs: https://vercel.com/docs
- Clerk support: https://clerk.com/support
- Razorpay docs: https://razorpay.com/docs
