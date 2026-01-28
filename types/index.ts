// Extend Clerk types with our custom metadata
declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      plan?: string;
      subscription_status?: string;
      razorpay_subscription_id?: string;
    };
  }
}

export interface RazorpaySubscription {
  id: string;
  entity: string;
  plan_id: string;
  status: 'created' | 'authenticated' | 'active' | 'paused' | 'cancelled' | 'expired';
  current_start?: number;
  current_end?: number;
  ended_at?: number;
  quantity: number;
  notes?: {
    clerk_user_id?: string;
    [key: string]: string | undefined;
  };
  charge_at?: number;
  start_at?: number;
  end_at?: number;
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  customer_notify: number;
  created_at: number;
  expire_by?: number;
  short_url: string;
  has_scheduled_changes: boolean;
  change_scheduled_at?: number;
  remaining_count: number;
}

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: 
    | 'subscription.activated'
    | 'subscription.charged'
    | 'subscription.cancelled'
    | 'subscription.expired'
    | 'subscription.paused'
    | 'subscription.resumed'
    | 'subscription.updated'
    | 'subscription.pending'
    | 'subscription.halted'
    | 'subscription.completed';
  contains: string[];
  payload: {
    subscription: {
      entity: RazorpaySubscription;
    };
    payment?: {
      entity: RazorpayPayment;
    };
  };
  created_at: number;
}

export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  order_id?: string;
  invoice_id?: string;
  international: boolean;
  method: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi';
  amount_refunded: number;
  refund_status?: 'null' | 'partial' | 'full';
  captured: boolean;
  description?: string;
  card_id?: string;
  bank?: string;
  wallet?: string;
  vpa?: string;
  email: string;
  contact: string;
  notes?: Record<string, string>;
  fee?: number;
  tax?: number;
  error_code?: string;
  error_description?: string;
  error_source?: string;
  error_step?: string;
  error_reason?: string;
  created_at: number;
}

export interface ClerkWebhookEvent {
  data: {
    id: string;
    object: string;
    type: string;
    [key: string]: any;
  };
  object: string;
  type: 
    | 'user.created'
    | 'user.updated'
    | 'user.deleted'
    | 'email.created'
    | 'sms.created'
    | 'session.created'
    | 'session.ended'
    | 'session.removed'
    | 'session.revoked'
    | 'organization.created'
    | 'organization.updated'
    | 'organization.deleted'
    | 'organizationMembership.created'
    | 'organizationMembership.updated'
    | 'organizationMembership.deleted'
    | 'organizationInvitation.created'
    | 'organizationInvitation.accepted'
    | 'organizationInvitation.revoked';
}

export interface RazorpayCheckoutOptions {
  key: string;
  subscription_id: string;
  name: string;
  description?: string;
  image?: string;
  handler: (response: RazorpayCheckoutResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
  };
  readonly?: {
    email?: boolean;
    contact?: boolean;
    name?: boolean;
  };
}

export interface RazorpayCheckoutResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

// Extend window object for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export {};
