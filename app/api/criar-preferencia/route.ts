import { NextRequest, NextResponse } from 'next/server';
import { mpPreference, PRODUCT, ORDER_BUMP } from '@/lib/mercadopago';

// Checkout Pro fallback — creates a preference for redirect checkout
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderBump, customerEmail } = body;

    const items = [
      {
        id: PRODUCT.id,
        title: PRODUCT.name,
        quantity: 1,
        unit_price: PRODUCT.price,
        currency_id: 'BRL',
      },
    ];

    if (orderBump) {
      items.push({
        id: ORDER_BUMP.id,
        title: ORDER_BUMP.name,
        quantity: 1,
        unit_price: ORDER_BUMP.price,
        currency_id: 'BRL',
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const preference = await mpPreference.create({
      body: {
        items,
        payer: customerEmail ? { email: customerEmail } : undefined,
        back_urls: {
          success: `${siteUrl}/sucesso?status=approved&method=cartao`,
          failure: `${siteUrl}/checkout?error=payment_failed`,
          pending: `${siteUrl}/sucesso?status=pending&method=boleto`,
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/webhook`,
        statement_descriptor: 'GELADEIRAKINDS',
        expires: false,
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
      },
    });

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error: unknown) {
    console.error('[/api/criar-preferencia] Error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao criar preferência';
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}
