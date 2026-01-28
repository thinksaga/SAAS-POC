import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { TrendingUp, Users, Database, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Free Dashboard',
  description: 'Manage your free plan account',
};

export default async function FreeDashboard() {
  const user = await currentUser();

  if (!user) redirect('/sign-in');

  return (
    <DashboardLayout plan="free">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}! 👋
          </h2>
          <p className="text-gray-600">
            You're on the <span className="font-semibold">Free Plan</span> with basic features
          </p>
        </div>

        {/* Upgrade Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Unlock More Features</h3>
              <p className="text-blue-100 mb-4">
                Upgrade to Lite or Pro for advanced analytics, more storage, and priority support
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                View Plans
                <Zap className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Total Views"
            value="1,234"
            change="+12%"
            trend="up"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Active Users"
            value="23"
            change="+5%"
            trend="up"
          />
          <StatCard
            icon={<Database className="h-6 w-6" />}
            title="Storage Used"
            value="1.2 GB"
            subtitle="of 5 GB"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Projects"
            value="3"
            subtitle="of 5"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              title="Project Created"
              description="New project 'Website Redesign' was created"
              time="2 hours ago"
            />
            <ActivityItem
              title="Document Uploaded"
              description="Design specs uploaded to Project Alpha"
              time="5 hours ago"
            />
            <ActivityItem
              title="Team Update"
              description="You completed onboarding"
              time="1 day ago"
            />
          </div>
        </div>

        {/* Feature Limitations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="Basic Analytics"
            description="View essential metrics and insights"
            available={true}
          />
          <FeatureCard
            title="5 GB Storage"
            description="Store your files and documents"
            available={true}
          />
          <FeatureCard
            title="Advanced Reports"
            description="Custom reports and detailed analytics"
            available={false}
            requiresPlan="Lite"
          />
          <FeatureCard
            title="Priority Support"
            description="Get help when you need it most"
            available={false}
            requiresPlan="Pro"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
  trend,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-400">{icon}</div>
        {change && (
          <span
            className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  available,
  requiresPlan,
}: {
  title: string;
  description: string;
  available: boolean;
  requiresPlan?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {available ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Locked
          </span>
        )}
      </div>
      {!available && requiresPlan && (
        <div className="mt-4">
          <Link
            href="/pricing"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Upgrade to {requiresPlan} →
          </Link>
        </div>
      )}
    </div>
  );
}
