import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { TrendingUp, Users, Database, Zap, DollarSign, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Lite Dashboard',
  description: 'Manage your lite plan account',
};

export default async function LiteDashboard() {
  const user = await currentUser();

  if (!user) redirect('/sign-in');

  return (
    <DashboardLayout plan="lite">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}! 🚀
          </h2>
          <p className="text-gray-600">
            You're on the <span className="font-semibold">Lite Plan</span> - ₹999/month
          </p>
        </div>

        {/* Upgrade Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
              <p className="text-purple-100 mb-4">
                Unlock unlimited features, dedicated support, and advanced analytics
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                View Pro Features
                <Zap className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Revenue"
            value="₹1.2L"
            change="+12.5%"
            trend="up"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Team Members"
            value="8"
            subtitle="of 10"
          />
          <StatCard
            icon={<Database className="h-6 w-6" />}
            title="Storage"
            value="15.7 GB"
            subtitle="Unlimited"
          />
          <StatCard
            icon={<Activity className="h-6 w-6" />}
            title="API Calls"
            value="45K"
            subtitle="100K/month"
          />
        </div>

        {/* Analytics Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Analytics Chart Coming Soon</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Advanced Analytics"
            description="Deep insights and custom reports"
            available={true}
            icon="📊"
          />
          <FeatureCard
            title="Priority Support"
            description="24-hour response time"
            available={true}
            icon="💬"
          />
          <FeatureCard
            title="Unlimited Projects"
            description="Create unlimited projects"
            available={true}
            icon="📁"
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
        <div className="text-blue-500">{icon}</div>
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

function FeatureCard({
  title,
  description,
  available,
  icon,
}: {
  title: string;
  description: string;
  available: boolean;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="text-base font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      {available && (
        <span className="inline-flex items-center mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      )}
    </div>
  );

}