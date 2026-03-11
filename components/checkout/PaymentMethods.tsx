'use client';

import { useState, useCallback } from 'react';
import { CreditCard, Smartphone } from 'lucide-react';
import CardForm from './CardForm';
import PixForm from './PixForm';

type PaymentTab = 'cartao' | 'pix';

interface PayerData {
  email: string;
  cpf: string;
  firstName: string;
  lastName: string;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

interface PaymentMethodsProps {
  total: number;
  orderBump: boolean;
  cartItems: any[];
  payerData: PayerData;
  mpPublicKey: string;
  onSuccess: (data: {
    paymentId: string;
    method: PaymentTab;
    status: string;
    qrCode?: string;
    qrCodeBase64?: string;
  }) => void;
}

interface CardSubmitData {
  token: string;
  installments: string;
  paymentMethodId: string;
  issuerId: string;
  cardholderName: string;
  cardholderEmail: string;
}

const tabs: { id: PaymentTab; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'cartao',
    label: 'Cartão',
    icon: <CreditCard className="w-4 h-4" />,
    desc: 'Até 12x',
  },
  {
    id: 'pix',
    label: 'PIX',
    icon: <Smartphone className="w-4 h-4" />,
    desc: 'Instantâneo',
  },
];

export default function PaymentMethods({
  total,
  orderBump,
  cartItems,
  payerData,
  mpPublicKey,
  onSuccess,
}: PaymentMethodsProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>('cartao');
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const handleCardSubmit = useCallback(async (tokenData: CardSubmitData) => {
    setLoading(true);
    setGlobalError('');
    try {
      const res = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenData.token,
          installments: parseInt(tokenData.installments),
          paymentMethod: tokenData.paymentMethodId,
          issuer_id: tokenData.issuerId,
          payer: {
            email: tokenData.cardholderEmail || payerData.email,
            cpf: payerData.cpf,
            firstName: tokenData.cardholderName.split(' ')[0] || payerData.firstName,
            lastName: tokenData.cardholderName.split(' ').slice(1).join(' ') || payerData.lastName,
            phone: payerData.phone,
            cep: payerData.cep,
            street: payerData.street,
            number: payerData.number,
            neighborhood: payerData.neighborhood,
            city: payerData.city,
            state: payerData.state,
          },
          orderBump,
          cartItems,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro no pagamento');
      onSuccess({ paymentId: data.payment_id, method: 'cartao', status: data.status });
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || 'Erro ao processar pagamento. Verifique os dados do cartão.');
    } finally {
      setLoading(false);
    }
  }, [onSuccess, payerData, orderBump, cartItems]);

  return (
    <div>
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-[1.5px] transition-all duration-200"
            style={{
              borderColor: activeTab === tab.id ? '#00B4D8' : '#E5E7EB',
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, #E0F7FA, #F0FDFF)'
                  : 'white',
              color: activeTab === tab.id ? '#0090AE' : '#9CA3AF',
              boxShadow: activeTab === tab.id ? '0 2px 12px rgba(0,180,216,0.15)' : 'none',
            }}
          >
            <span
              className="transition-all"
              style={{ color: activeTab === tab.id ? '#00B4D8' : '#9CA3AF' }}
            >
              {tab.icon}
            </span>
            <span className="font-bold text-sm">{tab.label}</span>
            <span className="text-[10px] font-medium opacity-70">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="relative">
        {globalError && (
          <div className="mb-4 p-4 rounded-xl text-sm text-red-700 font-medium animate-in fade-in slide-in-from-top-2" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
            ⚠️ {globalError}
          </div>
        )}
        {activeTab === 'cartao' && (
          <CardForm
            amount={total}
            mpPublicKey={mpPublicKey}
            payerData={payerData}
            loading={loading}
            onToken={handleCardSubmit}
          />
        )}

        {activeTab === 'pix' && (
          <PixForm
            payerData={payerData}
            total={total}
            orderBump={orderBump}
            cartItems={cartItems}
            onSuccess={(d) =>
              onSuccess({
                paymentId: d.paymentId,
                method: 'pix',
                status: 'pending',
                qrCode: d.qrCode,
                qrCodeBase64: d.qrCodeBase64,
              })
            }
          />
        )}
      </div>
    </div>
  );
}
