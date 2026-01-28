import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserSubscription } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user's subscription and redirect to plan-specific dashboard
  const subscription = await getUserSubscription();
  redirect(`/dashboard/${subscription.plan}`);
}
