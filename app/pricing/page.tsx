'use client';

import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: 'plan_free',
    name: 'Free',
    price: '₹0',
    features: ['Basic analytics', 'Community support', '5 projects', 'Email support'],
    razorpayPlanId: null, // Free plan, no subscription
  },
  {
    id: 'plan_lite',
    name: 'Lite',
    price: '₹999/month',
    features: ['All Free features', 'Advanced analytics', 'Priority support', 'Unlimited projects', '10 team members'],
    razorpayPlanId: 'plan_S9Dk9z7e6IH6EO',
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    price: '₹2,999/month',
    features: ['All Lite features', 'API access', 'Custom integrations', 'Dedicated support', 'White label', 'Unlimited team members'],
    razorpayPlanId: 'plan_your_razorpay_pro_plan_id', // Replace with actual Razorpay plan ID
  },
];

export default function PricingPage() {
  const { userId, isLoaded } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (planId: string, razorpayPlanId: string | null) => {
    if (!userId) {
      alert('Please sign in to subscribe');
      window.location.href = '/sign-in';
      return;
    }

    if (!razorpayPlanId) {
      alert('Free plan selected - no payment needed');
      window.location.href = '/dashboard';
      return;
    }

    if (!razorpayLoaded) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    setLoading(planId);

    try {
      // Create subscription on backend
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: razorpayPlanId, userId }),
      });

      if (!res.ok) {
        throw new Error('Failed to create subscription');
      }

      const { subscriptionId } = await res.json();

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: 'SaaS POC',
        description: 'Subscription Payment',
        handler: function (response: any) {
          alert('Subscription successful! Payment ID: ' + response.razorpay_payment_id);
          window.location.href = '/dashboard';
        },
        prefill: {
          email: '', // Can be filled from Clerk user data
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <BackButton href="/" label="Back to Home" />
          {userId && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Go to Dashboard →
            </Link>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Pricing Plans
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <div className="px-6 py-8 flex-1">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  </p>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 pb-8">
                <button
                  onClick={() => handleSubscribe(plan.id, plan.razorpayPlanId)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                    loading === plan.id
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  } transition-colors duration-200`}
                >
                  {loading === plan.id ? 'Processing...' : plan.razorpayPlanId ? 'Subscribe' : 'Get Started'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
