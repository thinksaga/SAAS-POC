# SaaS POC - Subscription Management Platform

A production-ready SaaS application built with Next.js 15, featuring subscription management, authentication, and payment processing with optimized performance.

## ✨ Features

- 🔐 **Authentication**: Clerk integration with automatic user sync
- 💳 **Payments**: Razorpay integration for Indian market
- 📊 **Subscription Tiers**: Free, Lite (₹999/month), Pro (₹2,999/month)
- 🎨 **Modern UI**: Responsive dashboard with hamburger menu and gradients
- 💾 **Database**: PostgreSQL (Neon) with Drizzle ORM
- ⚡ **Caching**: Redis (Upstash) with 5-minute TTL for optimal performance
- 🔄 **Webhooks**: Automated payment and user sync handlers
- 📱 **Responsive**: Mobile-first design with Tailwind CSS
- 🚀 **Optimized**: React cache and direct redirects for fast loading

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.6 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Authentication**: Clerk 6.36.10
- **Database**: Neon Postgres + Drizzle ORM 0.45.1
- **Caching**: Upstash Redis
- **Payments**: Razorpay 2.9.6
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React 0.563.0

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Accounts on: Clerk, Neon, Upstash, Razorpay

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd saas-poc
npm install
\`\`\`

### 2. Environment Setup

Copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your credentials in \`.env.local\`:

#### Clerk (https://dashboard.clerk.com)
- Create a new application
- Copy API keys from "API Keys" section
- Set up webhook endpoint: \`https://your-domain.com/api/clerk-webhook\`

#### Neon (https://console.neon.tech)
- Create a new project
- Copy connection string from dashboard

#### Upstash (https://console.upstash.com)
- Create a Redis database
- Copy REST URL and token

#### Razorpay (https://dashboard.razorpay.com)
- Enable test mode
- Copy API keys from settings
- Create subscription plans (Lite: ₹999/month, Pro: ₹2,999/month)
- Set up webhook: \`https://your-domain.com/api/razorpay-webhook\`

### 3. Database Setup

\`\`\`bash
# Push schema to database
npm run db:push

# (Optional) Seed database
npx tsx lib/db/seed.ts
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

\`\`\`
saas-poc/
├── app/
│   ├── api/
│   │   ├── auth-redirect/      # Post-login redirect handler
│   │   ├── clerk-webhook/      # User sync webhook
│   │   ├── create-subscription/ # Razorpay checkout
│   │   ├── razorpay-webhook/   # Payment webhooks
│   │   └── pro-feature/        # Protected API example
│   ├── dashboard/
│   │   ├── free/               # Free tier dashboard
│   │   ├── lite/               # Lite tier dashboard
│   │   ├── pro/                # Pro tier dashboard
│   │   └── page.tsx            # Dashboard router
│   ├── pricing/                # Pricing & subscription page
│   ├── sign-in/                # Authentication pages
│   ├── sign-up/
│   ├── layout.tsx              # Root layout with Clerk
│   ├── page.tsx                # Landing page
│   └── sitemap.ts              # SEO sitemap
├── components/
│   ├── BackButton.tsx          # Reusable back navigation
│   └── DashboardLayout.tsx     # Dashboard shell with sidebar
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema (5 tables)
│   │   ├── migrate.ts          # Migration runner
│   │   └── seed.ts             # Database seeding
│   ├── db-helpers.ts           # Database utilities
│   ├── redis.ts                # Redis cache layer
│   └── subscription.ts         # Subscription logic with caching
├── scripts/
│   └── set-user-plan.ts        # CLI tool for plan management
├── types/
│   └── index.ts                # Global TypeScript types
├── .env.example                # Environment template
├── drizzle.config.ts           # Drizzle ORM config
├── middleware.ts               # Clerk auth middleware
└── package.json
\`\`\`

## 💾 Database Schema

### Tables

1. **users** - User profiles synced from Clerk
   - id, clerkId, email, firstName, lastName, timestamps

2. **subscriptions** - Subscription records
   - userId, planType (free/lite/pro), status, Razorpay details

3. **payments** - Payment transactions
   - userId, subscriptionId, amount, status, Razorpay payment details

4. **usage_metrics** - Feature usage tracking
   - userId, metricType, currentValue, limitValue

5. **audit_logs** - Audit trail for security
   - userId, action, resourceType, details, IP, userAgent

## 💰 Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | ₹0/month | Basic dashboard, Limited storage, 1 project |
| **Lite** | ₹999/month | Enhanced features, 10GB storage, 5 projects, Analytics |
| **Pro** | ₹2,999/month | All features, Unlimited storage, Unlimited projects, Priority support |

## 🔧 Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
\`\`\`

### Manual Plan Assignment (Development)

\`\`\`bash
npx tsx scripts/set-user-plan.ts <clerk-user-id> <plan>
# Example: npx tsx scripts/set-user-plan.ts user_abc123 lite
\`\`\`

### Webhook Testing

Use ngrok or similar for local webhook testing:

\`\`\`bash
ngrok http 3000
# Update webhook URLs in Clerk and Razorpay dashboards
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   \`\`\`

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables from \`.env.local\`
   - Deploy

3. **Update Webhook URLs**
   - Update Clerk webhook: \`https://your-domain.vercel.app/api/clerk-webhook\`
   - Update Razorpay webhook: \`https://your-domain.vercel.app/api/razorpay-webhook\`

### Other Platforms

The application works on any platform supporting Next.js:
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## 🔐 Security

- All API routes are protected with Clerk authentication
- Webhook signatures are verified
- Sensitive data encrypted in transit (HTTPS)
- Environment variables for secrets
- Redis cache with TTL to prevent stale data
- Audit logging for critical actions

## 🐛 Troubleshooting

### Database Connection Issues
\`\`\`bash
# Test database connection
npm run db:push
\`\`\`

### Redis Connection Issues
- Verify UPSTASH_REDIS_REST_URL and token
- Check if Redis instance is active in Upstash dashboard

### Webhook Not Working
- Verify webhook secrets match
- Check webhook URLs are publicly accessible
- Review webhook logs in respective dashboards

### Build Errors
\`\`\`bash
# Clear cache and rebuild
rm -rf .next
npm run build
\`\`\`

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email your-email@example.com or open an issue.

---

**Built with ❤️ using Next.js, Clerk, and Razorpay**
