import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  TrendingUp, 
  Users, 
  Database, 
  DollarSign, 
  Activity, 
  Star,
  Sparkles,
  Shield
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pro Dashboard',
  description: 'Manage your pro plan account',
};

export default async function ProDashboard() {
  const user = await currentUser();

  if (!user) redirect('/sign-in');

  return (
    <DashboardLayout plan="pro">
      <div className="space-y-6">
        {/* Welcome Section with Premium Badge */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  Welcome back, {user.firstName}! ✨
                </h2>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Pro Member
                </span>
              </div>
              <p className="text-purple-100">
                You're on the <span className="font-semibold">Pro Plan</span> - ₹2,999/month
              </p>
            </div>
            <Sparkles className="h-12 w-12 text-white/30" />
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Total Revenue"
            value="₹5.2L"
            change="+18.3%"
            trend="up"
            color="green"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Team Members"
            value="Unlimited"
            subtitle="Active: 24"
            color="blue"
          />
          <StatCard
            icon={<Database className="h-6 w-6" />}
            title="Storage"
            value="142 GB"
            subtitle="Unlimited"
            color="purple"
          />
          <StatCard
            icon={<Activity className="h-6 w-6" />}
            title="API Calls"
            value="285K"
            subtitle="Unlimited"
            color="pink"
          />
        </div>

        {/* Premium Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
            <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                <p className="text-gray-500">Advanced Chart Coming Soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
            <div className="space-y-4">
              <MetricBar label="Active Users" value={85} color="purple" />
              <MetricBar label="Conversion Rate" value={72} color="pink" />
              <MetricBar label="Customer Satisfaction" value={94} color="green" />
              <MetricBar label="Feature Adoption" value={68} color="blue" />
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Pro Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PremiumFeature
              icon={<Shield className="h-5 w-5" />}
              title="Dedicated Support"
              description="Priority 24/7 support"
            />
            <PremiumFeature
              icon={<Database className="h-5 w-5" />}
              title="Unlimited Storage"
              description="Store without limits"
            />
            <PremiumFeature
              icon={<Activity className="h-5 w-5" />}
              title="Advanced Analytics"
              description="Deep insights & reports"
            />
            <PremiumFeature
              icon={<Users className="h-5 w-5" />}
              title="Unlimited Team"
              description="Add unlimited members"
            />
            <PremiumFeature
              icon={<Sparkles className="h-5 w-5" />}
              title="API Access"
              description="Full API integration"
            />
            <PremiumFeature
              icon={<Star className="h-5 w-5" />}
              title="Custom Branding"
              description="White-label options"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem
              title="New team member added"
              description="Sarah Johnson joined the Marketing team"
              time="10 minutes ago"
              type="success"
            />
            <ActivityItem
              title="API integration completed"
              description="Stripe payment gateway successfully integrated"
              time="2 hours ago"
              type="info"
            />
            <ActivityItem
              title="Report generated"
              description="Monthly analytics report is ready for download"
              time="5 hours ago"
              type="success"
            />
          </div>
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
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  subtitle?: string;
  color: 'green' | 'blue' | 'purple' | 'pink';
}) {
  const colorClasses = {
    green: 'text-green-500',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    pink: 'text-pink-500',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <div className={colorClasses[color]}>{icon}</div>
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

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

function PremiumFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
      <div className="text-purple-600 mt-0.5">{icon}</div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}) {
  const colors = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
      <div className={`w-2 h-2 ${colors[type]} rounded-full mt-2`}></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

