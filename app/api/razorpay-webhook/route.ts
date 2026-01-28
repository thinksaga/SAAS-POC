import { createClerkClient } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { upsertSubscription, recordPayment, syncUserToDatabase, logAudit } from '@/lib/db-helpers';

const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', razorpayWebhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    console.log('Razorpay webhook event:', event);

    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    // Helper function to determine plan based on Razorpay plan_id
    const getPlanFromRazorpayPlanId = (planId: string): 'lite' | 'pro' | 'free' => {
      // Map your Razorpay plan IDs to plan names
      const planMapping: Record<string, 'lite' | 'pro'> = {
        'plan_S9Dk9z7e6IH6EO': 'lite', // Lite plan (₹999/month)
        // Add your Pro plan ID here when created
        // 'plan_xxxxxxxxxxxxx': 'pro', // Pro plan (₹2999/month)
      };
      
      return planMapping[planId] || 'free';
    };

    switch (event) {
      case 'subscription.activated': {
        const subscription = payload.payload.subscription.entity;
        const clerkUserId = subscription.notes?.clerk_user_id;

        if (clerkUserId) {
          // Ensure user exists in database
          await syncUserToDatabase(clerkUserId);

          // Determine plan based on Razorpay plan_id
          const plan = getPlanFromRazorpayPlanId(subscription.plan_id);
          
          // Save subscription to database
          await upsertSubscription({
            userId: clerkUserId,
            razorpaySubscriptionId: subscription.id,
            planType: plan,
            status: 'active',
            razorpayPlanId: subscription.plan_id,
            startDate: new Date(subscription.start_at * 1000),
            endDate: subscription.end_at ? new Date(subscription.end_at * 1000) : undefined,
            currentPeriodStart: subscription.current_start ? new Date(subscription.current_start * 1000) : undefined,
            currentPeriodEnd: subscription.current_end ? new Date(subscription.current_end * 1000) : undefined,
          });

          // Log audit
          await logAudit({
            userId: clerkUserId,
            action: 'SUBSCRIPTION_ACTIVATED',
            resourceType: 'subscription',
            resourceId: subscription.id,
            details: { plan, razorpayPlanId: subscription.plan_id },
          });

          console.log(`Updated user ${clerkUserId} with ${plan} plan (subscription ${subscription.id})`);
        }
        break;
      }

      case 'subscription.charged': {
        const payment = payload.payload.payment.entity;
        const subscription = payload.payload.subscription.entity;
        const clerkUserId = subscription.notes?.clerk_user_id;

        if (clerkUserId) {
          await syncUserToDatabase(clerkUserId);

          const plan = getPlanFromRazorpayPlanId(subscription.plan_id);
          
          // Update subscription status
          await upsertSubscription({
            userId: clerkUserId,
            razorpaySubscriptionId: subscription.id,
            planType: plan,
            status: 'active',
            razorpayPlanId: subscription.plan_id,
            currentPeriodStart: subscription.current_start ? new Date(subscription.current_start * 1000) : undefined,
            currentPeriodEnd: subscription.current_end ? new Date(subscription.current_end * 1000) : undefined,
          });

          // Record the payment
          await recordPayment({
            razorpaySubscriptionId: subscription.id,
            razorpayPaymentId: payment.id,
            amount: (payment.amount / 100).toString(), // Convert paise to rupees
            currency: payment.currency,
            status: payment.status,
            paymentMethod: payment.method,
            paymentDate: new Date(payment.created_at * 1000),
            metadata: {
              subscription_id: subscription.id,
              plan: plan,
            },
          });

          // Log audit
          await logAudit({
            userId: clerkUserId,
            action: 'PAYMENT_SUCCESS',
            resourceType: 'payment',
            resourceId: payment.id,
            details: { amount: payment.amount, plan },
          });

          console.log(`Payment successful for user ${clerkUserId}`);
        }
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const subscription = payload.payload.subscription.entity;
        const clerkUserId = subscription.notes?.clerk_user_id;

        if (clerkUserId) {
          await syncUserToDatabase(clerkUserId);

          const status = event === 'subscription.cancelled' ? 'cancelled' : 'expired';
          
          // Update subscription in database
          await upsertSubscription({
            userId: clerkUserId,
            razorpaySubscriptionId: subscription.id,
            planType: 'free', // Downgrade to free
            status: status as any,
            razorpayPlanId: subscription.plan_id,
          });

          // Log audit
          await logAudit({
            userId: clerkUserId,
            action: event === 'subscription.cancelled' ? 'SUBSCRIPTION_CANCELLED' : 'SUBSCRIPTION_EXPIRED',
            resourceType: 'subscription',
            resourceId: subscription.id,
            details: { reason: event },
          });

          console.log(`User ${clerkUserId} downgraded to free plan (${event})`);
        }
        break;
      }

      case 'subscription.paused': {
        const subscription = payload.payload.subscription.entity;
        const clerkUserId = subscription.notes?.clerk_user_id;

        if (clerkUserId) {
          await syncUserToDatabase(clerkUserId);

          const plan = getPlanFromRazorpayPlanId(subscription.plan_id);
          
          await upsertSubscription({
            userId: clerkUserId,
            razorpaySubscriptionId: subscription.id,
            planType: plan,
            status: 'paused',
            razorpayPlanId: subscription.plan_id,
          });

          await logAudit({
            userId: clerkUserId,
            action: 'SUBSCRIPTION_PAUSED',
            resourceType: 'subscription',
            resourceId: subscription.id,
          });

          console.log(`Subscription paused for user ${clerkUserId}`);
        }
        break;
      }

      case 'subscription.resumed': {
        const subscription = payload.payload.subscription.entity;
        const clerkUserId = subscription.notes?.clerk_user_id;

        if (clerkUserId) {
          await syncUserToDatabase(clerkUserId);

          const plan = getPlanFromRazorpayPlanId(subscription.plan_id);
          
          await upsertSubscription({
            userId: clerkUserId,
            razorpaySubscriptionId: subscription.id,
            planType: plan,
            status: 'active',
            razorpayPlanId: subscription.plan_id,
          });

          await logAudit({
            userId: clerkUserId,
            action: 'SUBSCRIPTION_RESUMED',
            resourceType: 'subscription',
            resourceId: subscription.id,
          });

          console.log(`Subscription resumed for user ${clerkUserId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}
