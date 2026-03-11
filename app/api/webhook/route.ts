import { NextRequest, NextResponse } from 'next/server';
import { mpPayment } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-signature') || '';
    const requestId = req.headers.get('x-request-id') || '';

    // TODO: Validate webhook signature
    // const secret = process.env.MP_WEBHOOK_SECRET;
    // validateSignature(signature, body, secret);

    console.log('[Webhook] Received:', { type: body.type, id: body.data?.id, requestId });

    if (body.type === 'payment') {
      const paymentId = body.data?.id;
      if (!paymentId) {
        return NextResponse.json({ received: true });
      }

      const payment = await mpPayment.get({ id: paymentId });

      switch (payment.status) {
        case 'approved':
          console.log(`[Webhook] Payment ${paymentId} APPROVED — R$ ${payment.transaction_amount}`);
          // TODO: Send confirmation email
          // TODO: Update orders database
          // TODO: Server-side conversion event (Facebook CAPI, Google Enhanced)
          break;

        case 'pending':
          console.log(`[Webhook] Payment ${paymentId} PENDING`);
          // Awaiting PIX or boleto payment
          break;

        case 'rejected':
          console.log(`[Webhook] Payment ${paymentId} REJECTED — ${payment.status_detail}`);
          // TODO: Notify customer
          break;

        case 'cancelled':
          console.log(`[Webhook] Payment ${paymentId} CANCELLED`);
          break;

        case 'refunded':
          console.log(`[Webhook] Payment ${paymentId} REFUNDED`);
          // TODO: Process refund
          break;

        default:
          console.log(`[Webhook] Payment ${paymentId} status: ${payment.status}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    // Return 200 to avoid MP retrying
    return NextResponse.json({ received: true });
  }
}

// Handle MP's GET request for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'webhook endpoint active' });
}
