import { NextRequest, NextResponse } from 'next/server';
import { mpPayment } from '@/lib/mercadopago';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get('payment_id');

  if (!paymentId) {
    return NextResponse.json({ error: true, message: 'payment_id obrigatório' }, { status: 400 });
  }

  try {
    const payment = await mpPayment.get({ id: paymentId });
    return NextResponse.json({
      status: payment.status,
      status_detail: payment.status_detail,
      payment_id: String(payment.id),
      qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
    });
  } catch (error: any) {
    console.error('[/api/pagamento/status] Erro:', error?.message);
    return NextResponse.json({ error: true, message: 'Erro ao verificar status' }, { status: 500 });
  }
}
