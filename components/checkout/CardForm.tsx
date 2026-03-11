'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    MercadoPago: new (key: string, opts: { locale: string }) => MPInstance;
  }
}

interface MPInstance {
  cardForm: (opts: object) => CardFormInstance;
}

interface CardFormInstance {
  unmount: () => void;
  getCardFormData: () => CardFormData;
}

interface CardFormData {
  token: string;
  installments: string;
  paymentMethodId: string;
  issuerId: string;
}

interface CardFormProps {
  amount: number;
  onToken: (data: CardFormData) => void;
  loading?: boolean;
}

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

export default function CardForm({ amount, onToken, loading = false }: CardFormProps) {
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [formMounted, setFormMounted] = useState(false);
  const cardFormRef = useRef<CardFormInstance | null>(null);

  const initCardForm = useCallback(() => {
    if (!window.MercadoPago) {
      setSdkStatus('error');
      return;
    }
    if (!MP_PUBLIC_KEY || MP_PUBLIC_KEY.includes('xxxx')) {
      setSdkStatus('error');
      return;
    }

    setSdkStatus('ready');
    cardFormRef.current?.unmount();

    try {
      const mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: 'pt-BR' });

      const cf = mp.cardForm({
        amount: String(amount),
        iframe: true,
        form: {
          id: 'card-form',
          cardNumber: { id: 'mp-card-number', placeholder: '•••• •••• •••• ••••' },
          expirationDate: { id: 'mp-expiration-date', placeholder: 'MM/AA' },
          securityCode: { id: 'mp-security-code', placeholder: 'CVV' },
          cardholderName: { id: 'mp-cardholder-name', placeholder: 'Nome no cartão' },
          issuer: { id: 'mp-issuer' },
          installments: { id: 'mp-installments' },
          identificationType: { id: 'mp-identification-type' },
          identificationNumber: { id: 'mp-identification-number', placeholder: '000.000.000-00' },
          cardholderEmail: { id: 'mp-cardholder-email', placeholder: 'E-mail' },
        },
        callbacks: {
          onFormMounted: (error: unknown) => {
            if (error) {
              console.error('[CardForm] onFormMounted error:', error);
              setSdkStatus('error');
              return;
            }
            setFormMounted(true);
          },
          onSubmit: async (event: { preventDefault: () => void }) => {
            event.preventDefault();
            if (!cardFormRef.current) return;
            const data = cardFormRef.current.getCardFormData();
            onToken(data);
          },
          onError: (errors: unknown) => {
            console.error('[CardForm] validation errors:', errors);
          },
        },
      });

      cardFormRef.current = cf as unknown as CardFormInstance;
    } catch (err) {
      console.error('[CardForm] init error:', err);
      setSdkStatus('error');
    }
  }, [amount, onToken]);

  // If SDK already loaded when component mounts (e.g., page revisit), init immediately
  useEffect(() => {
    if (typeof window !== 'undefined' && window.MercadoPago) {
      initCardForm();
    }
    return () => {
      cardFormRef.current?.unmount();
    };
  }, [initCardForm]);

  const fieldClass =
    'w-full min-h-[48px] border-[1.5px] border-gray-200 rounded-xl bg-white transition-all overflow-hidden';
  const inputClass =
    'w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl text-base outline-none transition-all bg-white focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/10';
  const labelClass = 'block text-sm font-bold text-gray-700 mb-1.5';

  if (sdkStatus === 'error') {
    return (
      <div
        className="p-5 rounded-2xl text-center space-y-3"
        style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}
      >
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="font-bold text-red-700 text-sm">Erro ao carregar formulário do cartão</p>
        <p className="text-red-600 text-xs">
          {!MP_PUBLIC_KEY || MP_PUBLIC_KEY.includes('xxxx')
            ? 'Public Key do Mercado Pago não configurada no .env.local'
            : 'Verifique sua conexão com a internet e recarregue a página'}
        </p>
        <button
          onClick={() => {
            setSdkStatus('loading');
            setFormMounted(false);
            setTimeout(initCardForm, 100);
          }}
          className="flex items-center gap-2 text-xs font-bold text-red-600 mx-auto hover:text-red-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Load SDK via Next.js Script — onLoad fires exactly when ready */}
      <Script
        src="https://sdk.mercadopago.com/v2/mercadopago.js"
        strategy="afterInteractive"
        onLoad={initCardForm}
        onError={() => setSdkStatus('error')}
      />

      {/* Loading indicator */}
      {!formMounted && (
        <div className="flex items-center justify-center gap-2 py-3 text-gray-400 text-sm mb-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Carregando formulário seguro...
        </div>
      )}

      <form
        id="card-form"
        style={{ opacity: formMounted ? 1 : 0.3, transition: 'opacity 0.4s' }}
      >
        <div className="space-y-4">
          {/* Card number */}
          <div>
            <label className={labelClass}>Número do cartão</label>
            <div id="mp-card-number" className={fieldClass} style={{ padding: '12px 14px' }} />
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Validade</label>
              <div id="mp-expiration-date" className={fieldClass} style={{ padding: '12px 14px' }} />
            </div>
            <div>
              <label className={labelClass}>CVV</label>
              <div id="mp-security-code" className={fieldClass} style={{ padding: '12px 14px' }} />
            </div>
          </div>

          {/* Cardholder name */}
          <div>
            <label className={labelClass}>Nome no cartão</label>
            <input
              type="text"
              id="mp-cardholder-name"
              className={inputClass}
              placeholder="NOME SOBRENOME"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          {/* Hidden issuer */}
          <select id="mp-issuer" className="hidden" aria-hidden="true" />

          {/* Installments */}
          <div>
            <label className={labelClass}>Parcelas</label>
            <select
              id="mp-installments"
              className="w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-base font-medium outline-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/10 transition-all cursor-pointer"
            />
          </div>

          {/* ID type + number */}
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2">
              <label className={labelClass}>Documento</label>
              <select
                id="mp-identification-type"
                className="w-full h-12 px-3 border-[1.5px] border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:border-[#00B4D8] transition-all"
              />
            </div>
            <div className="col-span-3">
              <label className={labelClass}>Número</label>
              <input
                type="text"
                id="mp-identification-number"
                className={inputClass}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>E-mail</label>
            <input
              type="email"
              id="mp-cardholder-email"
              className={inputClass}
              placeholder="seu@email.com"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formMounted}
            className="w-full h-14 text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #06D6A0, #00B4D8)',
              boxShadow: loading ? 'none' : '0 8px 30px rgba(0, 180, 216, 0.4)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando pagamento...
              </>
            ) : (
              '🔒 Finalizar Compra com Segurança'
            )}
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-gray-400 mt-3">
        🔒 Pagamento 100% seguro — SSL 256-bit via Mercado Pago
      </p>
    </>
  );
}
