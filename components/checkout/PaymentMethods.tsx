'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, FileText } from 'lucide-react';
import CardForm from './CardForm';
import PixForm from './PixForm';
import BoletoForm from './BoletoForm';

type PaymentTab = 'cartao' | 'pix' | 'boleto';

interface PayerData {
  email: string;
  cpf: string;
  firstName: string;
  lastName: string;
}

interface PaymentMethodsProps {
  total: number;
  orderBump: boolean;
  payerData: PayerData;
  onSuccess: (data: {
    paymentId: string;
    method: PaymentTab;
    status: string;
    qrCode?: string;
    qrCodeBase64?: string;
    barcode?: string;
    boletoUrl?: string;
  }) => void;
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
  {
    id: 'boleto',
    label: 'Boleto',
    icon: <FileText className="w-4 h-4" />,
    desc: '1–3 dias úteis',
  },
];

export default function PaymentMethods({
  total,
  orderBump,
  payerData,
  onSuccess,
}: PaymentMethodsProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>('cartao');
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-6">
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
      <div>
        {activeTab === 'cartao' && (
          <CardForm
            amount={total}
            loading={loading}
            onToken={async (tokenData) => {
              setLoading(true);
              try {
                const res = await fetch('/api/pagamento', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    token: tokenData.token,
                    installments: parseInt(tokenData.installments),
                    paymentMethod: tokenData.paymentMethodId,
                    issuer_id: tokenData.issuerId,
                    payer: payerData,
                    orderBump,
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Erro no pagamento');
                onSuccess({ paymentId: data.payment_id, method: 'cartao', status: data.status });
              } catch (err) {
                console.error(err);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}

        {activeTab === 'pix' && (
          <PixForm
            payerData={payerData}
            total={total}
            orderBump={orderBump}
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

        {activeTab === 'boleto' && (
          <BoletoForm
            payerData={payerData}
            total={total}
            orderBump={orderBump}
            onSuccess={(d) =>
              onSuccess({
                paymentId: d.paymentId,
                method: 'boleto',
                status: 'pending',
                barcode: d.barcode,
                boletoUrl: d.url,
              })
            }
          />
        )}
      </div>
    </div>
  );
}
