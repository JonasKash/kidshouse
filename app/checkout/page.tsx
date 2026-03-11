import type { Metadata } from 'next';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout — Mini Geladeira Kids™ | GeladeiraKids',
  description: 'Finalize sua compra da Mini Geladeira Kids™. Pagamento 100% seguro via Mercado Pago.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
