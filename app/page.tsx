import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                SaaS POC
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {userId && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Welcome to{' '}
            <span className="text-blue-600">SaaS POC</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A complete SaaS boilerplate with Clerk authentication, Razorpay subscriptions, and role-based access control.
          </p>
          <div className="flex gap-4 justify-center">
            {userId ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            )}
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔐"
              title="Clerk Authentication"
              description="Secure user authentication and management with Clerk"
            />
            <FeatureCard
              icon="💳"
              title="Razorpay Subscriptions"
              description="Seamless recurring payments with Razorpay integration"
            />
            <FeatureCard
              icon="🛡️"
              title="RBAC"
              description="Role-based access control for feature gating"
            />
            <FeatureCard
              icon="🔄"
              title="Webhook Syncing"
              description="Automatic subscription status updates via webhooks"
            />
            <FeatureCard
              icon="🚀"
              title="Next.js 15"
              description="Built with the latest Next.js features and best practices"
            />
            <FeatureCard
              icon="⚡"
              title="TypeScript"
              description="Fully typed with TypeScript for better developer experience"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start building your SaaS application today with our powerful boilerplate.
          </p>
          {!userId && (
            <Link
              href="/sign-up"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2026 SaaS POC. Built with Next.js, Clerk, and Razorpay.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
