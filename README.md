<div align="center">

# 🚀 SaaS POC - Subscription Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**A production-ready SaaS application with authentication, subscription management, and payment processing**

[Demo](https://your-demo.vercel.app) • [Documentation](DEPLOYMENT.md) • [Report Bug](https://github.com/thinksaga/SAAS-POC/issues) • [Request Feature](https://github.com/thinksaga/SAAS-POC/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Subscription Plans](#-subscription-plans)
- [Development](#-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

A complete SaaS boilerplate built with modern technologies, featuring:
- **Zero to Production**: Ready to deploy with comprehensive documentation
- **Optimized Performance**: React cache, Redis caching, and direct redirects
- **Production-Ready**: Webhook handlers, audit logging, and error handling
- **Developer-Friendly**: TypeScript, ESLint, and clean architecture

Perfect for building subscription-based applications with Razorpay integration for the Indian market.

---

## ✨ Features

### 🔐 Authentication & User Management
- Clerk integration with automatic user sync via webhooks
- Secure session management
- Email verification and password recovery
- User profile management

### 💳 Payment Processing
- Razorpay integration for Indian market
- Support for multiple subscription plans
- Automated invoice generation
- Webhook-based payment tracking
- Test mode for development

### 📊 Subscription Management
- Three-tier system: Free, Lite (₹999/month), Pro (₹2,999/month)
- Automated plan upgrades and downgrades
- Subscription pause and resume functionality
- Usage tracking and limits enforcement

### 🎨 Modern UI/UX
- Responsive dashboard with hamburger menu
- Mobile-first design approach
- Smooth animations and gradients
- Dark mode support (coming soon)
- Accessible components

### ⚡ Performance & Optimization
- Redis caching with 5-minute TTL
- React cache for request deduplication
- Optimized database queries with Drizzle ORM
- Edge-ready API routes
- Image optimization

### 🔒 Security Features
- Environment variable protection
- Webhook signature verification
- SQL injection prevention via ORM
- Audit logging for critical actions
- Rate limiting (configurable)

---

## 🛠️ Tech Stack

<table>
<tr>
<td>

**Frontend**
- [Next.js 15.1.6](https://nextjs.org/) - React framework
- [React 19.2.3](https://react.dev/) - UI library
- [TypeScript 5](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons

</td>
<td>

**Backend**
- [Clerk 6.36.10](https://clerk.com/) - Authentication
- [Drizzle ORM 0.45.1](https://orm.drizzle.team/) - Database ORM
- [Neon](https://neon.tech/) - PostgreSQL database
- [Upstash Redis](https://upstash.com/) - Caching layer
- [Razorpay 2.9.6](https://razorpay.com/) - Payment gateway

</td>
</tr>
</table>

---

## 📸 Screenshots

<div align="center">

### Landing Page
<img src="docs/screenshots/landing.png" alt="Landing Page" width="800" />

### Dashboard
<img src="docs/screenshots/dashboard.png" alt="Dashboard" width="800" />

### Pricing Page
<img src="docs/screenshots/pricing.png" alt="Pricing" width="800" />

*Screenshots coming soon*

</div>

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

Required accounts:
- [Clerk](https://clerk.com) - Authentication
- [Neon](https://neon.tech) - PostgreSQL database
- [Upstash](https://upstash.com) - Redis cache
- [Razorpay](https://razorpay.com) - Payment processing

### 1️⃣ Clone Repository

\`\`\`bash
git clone https://github.com/thinksaga/SAAS-POC.git
cd SAAS-POC
npm install
\`\`\`

### 2️⃣ Environment Configuration

Copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Configure your environment variables in \`.env.local\`:

<details>
<summary><b>🔑 Clerk Setup (Click to expand)</b></summary>

1. Visit [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Navigate to "API Keys" section
4. Copy the following:
   \`\`\`env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   \`\`\`
5. Set up webhook:
   - URL: \`https://your-domain.com/api/clerk-webhook\`
   - Events: user.created, user.updated, user.deleted
   - Copy webhook secret to \`CLERK_WEBHOOK_SECRET\`

</details>

<details>
<summary><b>💾 Neon Database Setup (Click to expand)</b></summary>

1. Visit [Neon Console](https://console.neon.tech)
2. Create a new project
3. Choose your preferred region
4. Copy the connection string:
   \`\`\`env
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   \`\`\`

</details>

<details>
<summary><b>⚡ Upstash Redis Setup (Click to expand)</b></summary>

1. Visit [Upstash Console](https://console.upstash.com)
2. Create a new Redis database
3. Choose region closest to your app
4. Copy REST credentials:
   \`\`\`env
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ==
   \`\`\`

</details>

<details>
<summary><b>💰 Razorpay Setup (Click to expand)</b></summary>

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Enable "Test Mode"
3. Navigate to Settings → API Keys
4. Generate keys:
   \`\`\`env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   \`\`\`
5. Create subscription plans:
   - Lite Plan: ₹999/month (copy plan ID)
   - Pro Plan: ₹2,999/month (copy plan ID)
6. Setup webhook:
   - URL: \`https://your-domain.com/api/razorpay-webhook\`
   - Active Events: All subscription and payment events
   - Copy webhook secret to \`RAZORPAY_WEBHOOK_SECRET\`

</details>

### 3️⃣ Database Setup

Initialize your database schema:

\`\`\`bash
# Push schema to Neon database
npm run db:push

# (Optional) Open Drizzle Studio to view your database
npm run db:studio

# (Optional) Seed with sample data
npx tsx lib/db/seed.ts
\`\`\`

### 4️⃣ Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5️⃣ Test the Application

1. **Sign Up**: Create a new account
2. **Verify Email**: Check your email for verification link
3. **Explore Dashboard**: Navigate to the free tier dashboard
4. **Test Payment**: Go to Pricing and test subscription upgrade with [Razorpay test cards](https://razorpay.com/docs/payments/payments/test-card-details/)
5. **Webhook Testing**: Use [ngrok](https://ngrok.com/) for local webhook testing

---

## 📁 Project Structure

\`\`\`
saas-poc/
├── 📁 app/
│   ├── 📁 api/                      # API routes
│   │   ├── auth-redirect/           # Post-authentication handler
│   │   ├── clerk-webhook/           # Clerk user sync
│   │   ├── create-subscription/     # Razorpay checkout initiation
│   │   ├── razorpay-webhook/        # Payment event handler
│   │   └── pro-feature/             # Protected API example
│   ├── 📁 dashboard/                # Dashboard pages
│   │   ├── free/                    # Free tier
│   │   ├── lite/                    # Lite tier (₹999/month)
│   │   ├── pro/                     # Pro tier (₹2,999/month)
│   │   └── page.tsx                 # Dashboard router
│   ├── 📁 pricing/                  # Pricing & subscription page
│   ├── 📁 sign-in/                  # Clerk sign-in
│   ├── 📁 sign-up/                  # Clerk sign-up
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   └── sitemap.ts                   # SEO sitemap
├── 📁 components/                   # Reusable React components
│   ├── BackButton.tsx               # Navigation component
│   └── DashboardLayout.tsx          # Dashboard shell with sidebar
├── 📁 lib/                          # Core business logic
│   ├── 📁 db/                       # Database layer
│   │   ├── schema.ts                # Drizzle schema (5 tables)
│   │   ├── migrate.ts               # Migration runner
│   │   └── seed.ts                  # Database seeding
│   ├── db-helpers.ts                # Database utilities
│   ├── redis.ts                     # Redis cache layer
│   └── subscription.ts              # Subscription logic
├── 📁 scripts/                      # Utility scripts
│   └── set-user-plan.ts             # Manual plan management CLI
├── 📁 types/                        # TypeScript type definitions
├── 📄 middleware.ts                 # Clerk auth middleware
├── 📄 drizzle.config.ts             # Drizzle ORM config
├── 📄 .env.example                  # Environment template
└── 📄 package.json                  # Dependencies
\`\`\`

---

## 💾 Database Schema

Our application uses 5 tables designed for scalability and audit trails:

\`\`\`typescript
📊 users                          # Synced from Clerk via webhook
   ├── id (PK)                   # Clerk user ID
   ├── email
   ├── name
   ├── createdAt
   └── updatedAt

💳 subscriptions                  # User subscription state
   ├── id (PK)
   ├── userId (FK → users)
   ├── plan (free/lite/pro)
   ├── status (active/canceled/paused)
   ├── razorpaySubscriptionId
   ├── currentPeriodStart
   ├── currentPeriodEnd
   └── createdAt/updatedAt

💰 payments                       # Payment transaction history
   ├── id (PK)
   ├── userId (FK → users)
   ├── subscriptionId (FK)
   ├── amount
   ├── currency (INR)
   ├── status (success/failed/pending)
   ├── razorpayPaymentId
   ├── razorpayOrderId
   └── createdAt

📈 usage_metrics                  # Feature usage tracking
   ├── id (PK)
   ├── userId (FK → users)
   ├── feature (api_calls/storage/exports)
   ├── usage (count)
   ├── limit (plan-based limit)
   └── periodStart/periodEnd

🔍 audit_logs                     # Critical action audit trail
   ├── id (PK)
   ├── userId (FK → users)
   ├── action (subscription.created/payment.success)
   ├── details (JSONB)
   └── timestamp
\`\`\`

---

## 💎 Subscription Plans

| Feature | 🆓 Free | 💡 Lite | ⭐ Pro |
|---------|---------|---------|--------|
| **Price** | ₹0/month | ₹999/month | ₹2,999/month |
| **API Calls** | 1,000/month | 10,000/month | Unlimited |
| **Storage** | 100 MB | 5 GB | 50 GB |
| **Exports** | 10/month | 100/month | Unlimited |
| **Support** | Community | Email | Priority + Phone |
| **Analytics** | Basic | Advanced | Custom Reports |
| **Team Members** | 1 | 3 | Unlimited |

### Plan Features

<details>
<summary><b>🆓 Free Plan</b></summary>

Perfect for getting started:
- Access to core features
- Basic analytics dashboard
- Community forum support
- 1 team member
- Data retention: 30 days

</details>

<details>
<summary><b>💡 Lite Plan (₹999/month)</b></summary>

For growing businesses:
- All Free features
- 10× API call limit
- 5 GB secure storage
- Email support (24h response)
- Up to 3 team members
- Data retention: 90 days
- Advanced analytics
- Export to CSV/PDF

</details>

<details>
<summary><b>⭐ Pro Plan (₹2,999/month)</b></summary>

For power users:
- All Lite features
- Unlimited API calls
- 50 GB storage
- Priority support (2h response)
- Unlimited team members
- Data retention: 1 year
- Custom reports
- White-label options
- Dedicated account manager
- SLA guarantee (99.9%)

</details>

---

## 🔧 Development

### Available Scripts

\`\`\`bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations

# Utilities
npm run type-check   # TypeScript type checking
npx tsx scripts/set-user-plan.ts <email> <plan>  # Manual plan update
\`\`\`

### Testing Webhooks Locally

Use [ngrok](https://ngrok.com/) to expose your local server:

\`\`\`bash
# Terminal 1: Start your app
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Use the ngrok URL for webhook endpoints:
# https://abc123.ngrok.io/api/clerk-webhook
# https://abc123.ngrok.io/api/razorpay-webhook
\`\`\`

### Razorpay Test Cards

For testing subscriptions:
- **Success**: 4111 1111 1111 1111 (Any CVV, Any future date)
- **Failure**: 4000 0000 0000 0002
- **OTP**: 123456

---

## 🚀 Deployment

Detailed deployment instructions are available in [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/thinksaga/SAAS-POC)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Update webhook URLs to use your production domain
\`\`\`

**Important**: After deployment:
1. Update Clerk webhook URL to production domain
2. Update Razorpay webhook URL to production domain
3. Test all payment flows in Razorpay test mode
4. Enable Razorpay live mode when ready

---

## 🔒 Security

- Environment variables are never committed
- Webhook signatures are verified
- SQL injection prevention via Drizzle ORM
- XSS protection enabled
- CSRF protection via Clerk
- Audit logs for critical actions

For security vulnerabilities, see [SECURITY.md](SECURITY.md).

---

## 📝 API Documentation

### Protected Routes

All dashboard routes require authentication via Clerk middleware.

### Key API Endpoints

- **POST** \`/api/create-subscription\` - Initiate Razorpay checkout
  - Body: \`{ plan: "lite" | "pro" }\`
  - Returns: Razorpay checkout options

- **POST** \`/api/razorpay-webhook\` - Handle payment events
  - Verifies webhook signature
  - Updates subscription status
  - Logs payment transactions

- **POST** \`/api/clerk-webhook\` - Sync user data
  - Creates/updates user records
  - Triggered on user lifecycle events

- **GET** \`/api/pro-feature\` - Example protected API
  - Requires Pro plan subscription
  - Returns 403 for unauthorized users

---

## 🧪 Troubleshooting

<details>
<summary><b>Database connection issues</b></summary>

\`\`\`bash
# Verify connection string format
echo $DATABASE_URL

# Test connection
npx drizzle-kit studio

# Re-push schema
npm run db:push
\`\`\`

</details>

<details>
<summary><b>Webhook not receiving events</b></summary>

1. Check webhook URL is publicly accessible
2. Verify webhook secret matches
3. Check webhook logs in provider dashboard
4. Use ngrok for local testing
5. Inspect request logs in your API route

</details>

<details>
<summary><b>Redis caching issues</b></summary>

\`\`\`bash
# Test Redis connection
curl $UPSTASH_REDIS_REST_URL/get/test \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"

# Clear specific cache
# Add ?nocache=true to bypass cache temporarily
\`\`\`

</details>

<details>
<summary><b>Payment test failing</b></summary>

1. Ensure Razorpay is in **Test Mode**
2. Use correct test card numbers
3. Verify webhook is receiving events
4. Check browser console for errors
5. Inspect \`/api/razorpay-webhook\` logs

</details>

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Make your changes
4. Run tests and linting: \`npm run lint\`
5. Commit your changes: \`git commit -m 'Add amazing feature'\`
6. Push to branch: \`git push origin feature/amazing-feature\`
7. Open a Pull Request

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team/docs/overview)
- [Razorpay Integration](https://razorpay.com/docs/payments/subscriptions/)
- [Upstash Redis](https://docs.upstash.com/redis)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Clerk** - Seamless authentication
- **Neon** - Serverless Postgres
- **Razorpay** - Indian payment gateway
- **Upstash** - Redis caching solution

---

## 📞 Support

- 📧 **Email**: support@yourdomain.com
- 💬 **Discord**: [Join our community](https://discord.gg/your-invite)
- 🐦 **Twitter**: [@yourusername](https://twitter.com/yourusername)
- 🐛 **Issues**: [GitHub Issues](https://github.com/thinksaga/SAAS-POC/issues)

---

<div align="center">

**Built with ❤️ by [thinksaga](https://github.com/thinksaga)**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/thinksaga/SAAS-POC/issues) • [Request Feature](https://github.com/thinksaga/SAAS-POC/issues) • [Documentation](DEPLOYMENT.md)

</div>

---

## 📁 Project Structure

\`\`\`
saas-poc/
├── 📁 app/
│   ├── 📁 api/                      # API routes
│   │   ├── auth-redirect/           # Post-authentication handler
│   │   ├── clerk-webhook/           # Clerk user sync
│   │   ├── create-subscription/     # Razorpay checkout initiation
│   │   ├── razorpay-webhook/        # Payment event handler
│   │   └── pro-feature/             # Protected API example
│   ├── 📁 dashboard/                # Dashboard pages
│   │   ├── free/                    # Free tier
│   │   ├── lite/                    # Lite tier (₹999/month)
│   │   ├── pro/                     # Pro tier (₹2,999/month)
│   │   └── page.tsx                 # Dashboard router
│   ├── 📁 pricing/                  # Pricing & subscription page
│   ├── 📁 sign-in/                  # Clerk sign-in
│   ├── 📁 sign-up/                  # Clerk sign-up
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   └── sitemap.ts                   # SEO sitemap
├── 📁 components/                   # Reusable React components
│   ├── BackButton.tsx               # Navigation component
│   └── DashboardLayout.tsx          # Dashboard shell with sidebar
├── 📁 lib/                          # Core business logic
│   ├── 📁 db/                       # Database layer
│   │   ├── schema.ts                # Drizzle schema (5 tables)
│   │   ├── migrate.ts               # Migration runner
│   │   └── seed.ts                  # Database seeding
│   ├── db-helpers.ts                # Database utilities
│   ├── redis.ts                     # Redis cache layer
│   └── subscription.ts              # Subscription logic
├── 📁 scripts/                      # Utility scripts
│   └── set-user-plan.ts             # Manual plan management CLI
├── 📁 types/                        # TypeScript type definitions
├── 📄 middleware.ts                 # Clerk auth middleware
├── 📄 drizzle.config.ts             # Drizzle ORM config
├── 📄 .env.example                  # Environment template
└── 📄 package.json                  # Dependencies
\`\`\`

---
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
