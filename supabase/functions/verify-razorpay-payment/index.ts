// Supabase Edge Function: verify-razorpay-payment
// Deploy via: supabase functions deploy verify-razorpay-payment
// Required Supabase secrets:
//   supabase secrets set RAZORPAY_KEY_SECRET=<your_razorpay_live_secret>
//   (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase Edge Runtime)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function computeHmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      billingCycle = 'monthly',
      amountInr = 0,
      userEmail,
      userId,
    } = body || {};

    if (!razorpay_payment_id || !planId || !userEmail) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Missing required payment or user details.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const secret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
    if (!secret) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Server RAZORPAY_KEY_SECRET is not configured in Supabase Secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!razorpay_order_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Missing Razorpay order ID or signature for verification.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const expectedSignature = await computeHmacSha256Hex(
      secret,
      `${razorpay_order_id}|${razorpay_payment_id}`
    );

    const isAuthentic = timingSafeEqualHex(expectedSignature.toLowerCase(), String(razorpay_signature).toLowerCase());
    if (!isAuthentic) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Invalid Razorpay signature. Payment verification failed.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Supabase service credentials unavailable.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + (billingCycle === 'annual' ? 365 : 30));

    const { data, error } = await supabaseAdmin
      .from('user_subscriptions')
      .upsert(
        {
          user_id: userId || null,
          user_email: String(userEmail).toLowerCase().trim(),
          plan_id: planId,
          billing_cycle: billingCycle,
          status: 'active',
          amount_inr: Number(amountInr) || 0,
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          signature_verified: true,
          activated_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          updated_at: now.toISOString(),
        },
        { onConflict: 'user_email' }
      )
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ verified: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        verified: true,
        subscription: data,
        message: 'Razorpay signature verified and subscription activated in Supabase.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ verified: false, error: (err as Error)?.message || 'Verification error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
