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

    // Build additional_info for anti-fraud scoring
    const phoneClean = (payer.phone || '').replace(/\D/g, '');
    const cepClean = (payer.cep || '').replace(/\D/g, '');
    const additionalInfo: Record<string, unknown> = {
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        category_id: 'toys',
      })),
      payer: {
        first_name: payer.firstName,
        last_name: payer.lastName,
        is_prime_user: false,
        is_first_purchase_online: true,
        ...(phoneClean.length >= 10 && {
          phone: {
            area_code: phoneClean.slice(0, 2),
            number: phoneClean.slice(2),
          },
        }),
        ...(payer.street && {
          address: {
            street_name: payer.street,
            street_number: payer.number || '',
            zip_code: cepClean,
          },
        }),
      },
      ...(payer.street && {
        shipments: {
          receiver_address: {
            zip_code: cepClean,
            state_name: payer.state || '',
            city_name: payer.city || '',
            street_name: payer.street || '',
            street_number: payer.number || '',
          },
        },
      }),
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
      additional_info?: Record<string, unknown>;
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
      paymentBody.additional_info = additionalInfo;
    }

    console.log(`[/api/pagamento] Processando ${paymentMethod} — R$ ${transactionAmount}`);
    console.log('[/api/pagamento] payerInfo:', JSON.stringify(payerInfo));
    console.log('[/api/pagamento] paymentBody (sem token):', JSON.stringify({ ...paymentBody, token: paymentMethod !== 'pix' ? '[OMITTED]' : undefined }));

    const payment = await mpPayment.create({ body: paymentBody });

    console.log(`[/api/pagamento] Pagamento ${payment.id} — status: ${payment.status} (${payment.status_detail})`);

    // Bloquear redirecionamento se o cartão for recusado
    if (paymentMethod !== 'pix' && payment.status === 'rejected') {
      const detail = payment.status_detail || '';
      const rejectionMessages: Record<string, string> = {
        cc_rejected_high_risk: 'Pagamento bloqueado por segurança. Tente PIX ou use outro cartão.',
        cc_rejected_insufficient_amount: 'Saldo insuficiente. Verifique o limite do seu cartão.',
        cc_rejected_bad_filled_card_number: 'Número do cartão inválido. Verifique e tente novamente.',
        cc_rejected_bad_filled_date: 'Data de validade inválida. Verifique e tente novamente.',
        cc_rejected_bad_filled_security_code: 'CVV inválido. Verifique o código de segurança do cartão.',
        cc_rejected_call_for_authorize: 'Seu banco pediu autorização manual. Ligue para o banco e tente novamente.',
        cc_rejected_card_disabled: 'Cartão bloqueado. Entre em contato com seu banco.',
        cc_rejected_duplicated_payment: 'Pagamento duplicado detectado. Aguarde alguns minutos antes de tentar novamente.',
        cc_rejected_invalid_installments: 'Parcelamento não disponível neste cartão. Tente à vista ou outro cartão.',
        cc_rejected_max_attempts: 'Limite de tentativas atingido. Tente outro cartão ou use PIX.',
        cc_rejected_other_reason: 'Pagamento recusado pelo banco. Tente PIX ou use outro cartão.',
      };
      const msg = rejectionMessages[detail] || `Pagamento recusado (${detail}). Verifique os dados ou use PIX.`;
      return NextResponse.json({ error: true, message: msg, status_detail: detail }, { status: 400 });
    }

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
