import { NextResponse } from 'next/server';
import { requireAuth, getUserSubscription, hasFeature } from '@/lib/subscription';

/**
 * Example protected API route that requires Pro plan
 * GET /api/pro-feature
 */
export async function GET() {
  try {
    // Ensure user is authenticated
    await requireAuth();
    
    // Get user subscription details
    const subscription = await getUserSubscription();
    
    // Check if user has access to this feature
    const hasAccess = await hasFeature('advanced_analytics');
    
    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Upgrade required',
          message: 'This feature requires a Pro or Enterprise plan',
          currentPlan: subscription.plan,
          requiredPlan: 'pro',
        },
        { status: 403 }
      );
    }
    
    // Feature logic here
    return NextResponse.json({
      success: true,
      message: 'Welcome to the Pro feature!',
      data: {
        analytics: {
          views: 1234,
          clicks: 567,
          conversions: 89,
        },
      },
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
