import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserSubscription } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Direct redirect to plan-specific dashboard
  const subscription = await getUserSubscription();
  redirect(`/dashboard/${subscription.plan}`);
}

