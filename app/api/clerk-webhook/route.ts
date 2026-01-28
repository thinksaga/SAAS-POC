import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { syncUserToDatabase, logAudit } from '@/lib/db-helpers';
import { db } from '@/lib/db';
import { users, subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    // Get the headers
    const headersList = await headers();
    const svix_id = headersList.get('svix-id');
    const svix_timestamp = headersList.get('svix-timestamp');
    const svix_signature = headersList.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
    }

    // Get the body
    const body = await req.text();

    // Get the Clerk webhook secret from environment variables
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(webhookSecret);

    let evt: any;

    // Verify the webhook signature
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Handle the webhook
    const eventType = evt.type;
    console.log('Clerk webhook event:', eventType);

    switch (eventType) {
      case 'user.created':
        console.log('User created:', evt.data.id);
        // Sync user to database
        await syncUserToDatabase(evt.data.id);
        
        // Log audit
        await logAudit({
          userId: evt.data.id,
          action: 'USER_CREATED',
          resourceType: 'user',
          resourceId: evt.data.id,
          details: {
            email: evt.data.email_addresses?.[0]?.email_address,
          },
        });
        break;

      case 'user.updated':
        console.log('User updated:', evt.data.id);
        // Sync user updates to database
        await syncUserToDatabase(evt.data.id);
        break;

      case 'user.deleted':
        console.log('User deleted:', evt.data.id);
        // Delete user from database (cascade will handle subscriptions, etc.)
        await db.delete(users).where(eq(users.clerkId, evt.data.id));
        
        // Log audit
        await logAudit({
          action: 'USER_DELETED',
          resourceType: 'user',
          resourceId: evt.data.id,
        });
        break;

      case 'user.deleted':
        console.log('User deleted:', evt.data.id);
        // Clean up user data if needed
        break;

      case 'organizationMembership.created':
        console.log('Organization membership created');
        // Handle organization membership events
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true, event: eventType });
  } catch (error: any) {
    console.error('Clerk webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}
