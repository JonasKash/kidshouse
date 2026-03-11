import { NextRequest, NextResponse } from 'next/server';
import { mpPayment, PRODUCT, ORDER_BUMP } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  // Verifica se o Access Token está configurado
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken || accessToken === 'COLE_SEU_ACCESS_TOKEN_AQUI' || accessToken.includes('xxxx')) {
    console.error('[/api/pagamento] MP_ACCESS_TOKEN não configurado no .env.local');
    return NextResponse.json(
      { error: true, message: 'Pagamento não configurado. Configure o Access Token do Mercado Pago no .env.local' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { token: cardToken, installments, paymentMethod, issuer_id, payer, orderBump, cartItems } = body;

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

    if (cartItems && Array.isArray(cartItems)) {
      cartItems.forEach((item: any) => {
        items.push({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: 'BRL',
        });
      });
    }

    const transactionAmount = Math.round(items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0) * 100) / 100;

    const payerInfo = {
      email: payer.email,
      identification: {
        type: 'CPF',
        number: (payer.cpf || '').replace(/\D/g, ''),
      },
      first_name: payer.firstName,
      last_name: payer.lastName,
    };

    type PaymentBody = {
      transaction_amount: number;
      description: string;
      metadata: object;
      notification_url?: string;
      payer: typeof payerInfo;
      payment_method_id?: string;
      token?: string;
      installments?: number;
      issuer_id?: number;
    };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const isPublicUrl = siteUrl.startsWith('https://');

    const paymentBody: PaymentBody = {
      transaction_amount: transactionAmount,
      description: 'Mini Geladeira Kids™ — GeladeiraKids',
      metadata: { items, source: 'website' },
      ...(isPublicUrl && { notification_url: `${siteUrl}/api/webhook` }),
      payer: payerInfo,
    };

    if (paymentMethod === 'pix') {
      paymentBody.payment_method_id = 'pix';
    } else {
      // Cartão de crédito
      paymentBody.token = cardToken;
      paymentBody.installments = parseInt(installments) || 1;
      paymentBody.payment_method_id = paymentMethod;
      if (issuer_id) paymentBody.issuer_id = parseInt(issuer_id) || undefined;
    }

    console.log(`[/api/pagamento] Processando ${paymentMethod} — R$ ${transactionAmount}`);
    console.log('[/api/pagamento] payerInfo:', JSON.stringify(payerInfo));
    console.log('[/api/pagamento] paymentBody (sem token):', JSON.stringify({ ...paymentBody, token: paymentMethod !== 'pix' ? '[OMITTED]' : undefined }));

    const payment = await mpPayment.create({ body: paymentBody });

    console.log(`[/api/pagamento] Pagamento ${payment.id} — status: ${payment.status} (${payment.status_detail})`);

    return NextResponse.json({
      status: payment.status,
      status_detail: payment.status_detail,
      payment_id: String(payment.id),
      // PIX
      qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
    });
  } catch (error: unknown) {
    const mpError = error as {
      message?: string;
      status?: number;
      cause?: Array<{ code?: string; description?: string }>;
    };

    console.error('[/api/pagamento] Erro MP:', {
      message: mpError?.message,
      status: mpError?.status,
      cause: mpError?.cause,
    });

    let userMessage = 'Erro ao processar pagamento. Tente novamente.';
    if (mpError?.status === 401) userMessage = 'Credenciais do Mercado Pago inválidas.';
    if (mpError?.status === 422) {
      const cause = mpError?.cause?.[0];
      if (cause?.code === '205') userMessage = 'Número do cartão inválido.';
      else if (cause?.code === '208') userMessage = 'Data de validade inválida.';
      else if (cause?.code === '209') userMessage = 'CVV inválido.';
      else if (cause?.code === '212') userMessage = 'CPF inválido.';
      else if (cause?.description) userMessage = cause.description;
    }

    return NextResponse.json({ error: true, message: userMessage }, { status: 500 });
  }
}
