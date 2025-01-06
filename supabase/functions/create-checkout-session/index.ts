import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, promotionCode, successUrl, cancelUrl } = await req.json();
    console.log('Received request:', { priceId, promotionCode, successUrl, cancelUrl });
    
    // Get the user from the authorization header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    if (!user?.email) {
      throw new Error('No email found');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    console.log('Creating/retrieving customer for email:', user.email);

    // Get or create customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log('Found existing customer:', customerId);
    } else {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUid: user.id,
        },
      });
      customerId = newCustomer.id;
      console.log('Created new customer:', customerId);
    }

    // Create checkout session configuration
    const sessionConfig: any = {
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    };

    // Handle promotion code if provided
    if (promotionCode) {
      console.log('Looking up promotion code:', promotionCode);
      const promoCode = await stripe.promotionCodes.list({
        code: promotionCode,
        active: true,
        limit: 1,
      });

      if (promoCode.data.length > 0) {
        console.log('Found valid promotion code:', promoCode.data[0].id);
        sessionConfig.discounts = [{ promotion_code: promoCode.data[0].id }];
      } else {
        console.log('No valid promotion code found');
      }
    }

    console.log('Creating checkout session with config:', sessionConfig);
    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    let statusCode = 400;

    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      statusCode = error.statusCode || 400;
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode,
      }
    );
  }
});