'use client';

import { useEffect, useRef, useState } from 'react';
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
  mpPublicKey: string;
  onToken: (data: CardFormData) => void;
  loading?: boolean;
}

export default function CardForm({ amount, mpPublicKey, onToken, loading = false }: CardFormProps) {
  const publicKey = mpPublicKey || process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [formMounted, setFormMounted] = useState(false);
  const cardFormRef = useRef<CardFormInstance | null>(null);
  const initializedRef = useRef(false);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  const mount = (key: string, amt: number) => {
    if (initializedRef.current) return;
    if (!window.MercadoPago) { setStatus('error'); return; }
    if (!key) { setStatus('error'); return; }

    initializedRef.current = true;
    setStatus('ready');
    cardFormRef.current?.unmount();

    try {
      const mp = new window.MercadoPago(key, { locale: 'pt-BR' });
      const cf = mp.cardForm({
        amount: String(amt),
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
            if (error) { console.error('[CardForm] mount error:', error); return; }
            setFormMounted(true);
          },
          onSubmit: async (event: { preventDefault: () => void }) => {
            event.preventDefault();
            if (!cardFormRef.current) return;
            onTokenRef.current(cardFormRef.current.getCardFormData());
          },
          onError: (errors: unknown) => {
            console.error('[CardForm] errors:', errors);
          },
        },
      });
      cardFormRef.current = cf as unknown as CardFormInstance;
      // fallback: show form after 4s if onFormMounted never fires
      setTimeout(() => setFormMounted(true), 4000);
    } catch (err) {
      console.error('[CardForm] init error:', err);
      setStatus('error');
    }
  };

  useEffect(() => {
    const SDK_URL = 'https://sdk.mercadopago.com/v2/mercadopago.js';

    // If SDK already loaded (e.g. navigating back to page)
    if (window.MercadoPago) {
      mount(publicKey, amount);
      return () => { cardFormRef.current?.unmount(); };
    }

    // Load SDK manually — most reliable method
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = SDK_URL;
      document.head.appendChild(script);
    }

    const onLoad = () => mount(publicKey, amount);
    const onError = () => setStatus('error');
    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    return () => {
      script!.removeEventListener('load', onLoad);
      script!.removeEventListener('error', onError);
      cardFormRef.current?.unmount();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fieldClass = 'w-full min-h-[48px] border-[1.5px] border-gray-200 rounded-xl bg-white transition-all overflow-hidden';
  const inputClass = 'w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl text-base outline-none transition-all bg-white focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/10';
  const labelClass = 'block text-sm font-bold text-gray-700 mb-1.5';

  if (status === 'error') {
    return (
      <div className="p-5 rounded-2xl text-center space-y-3" style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}>
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="font-bold text-red-700 text-sm">Erro ao carregar formulário do cartão</p>
        <p className="text-red-600 text-xs">
          {!publicKey ? 'Public Key do Mercado Pago não configurada' : 'Recarregue a página e tente novamente'}
        </p>
        <button
          onClick={() => {
            initializedRef.current = false;
            setStatus('loading');
            setFormMounted(false);
            setTimeout(() => mount(publicKey, amount), 200);
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
      {!formMounted && (
        <div className="flex items-center justify-center gap-2 py-3 text-gray-400 text-sm mb-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Carregando formulário seguro...
        </div>
      )}

      <form id="card-form" style={{ opacity: formMounted ? 1 : 0.3, transition: 'opacity 0.4s' }}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Número do cartão</label>
            <div id="mp-card-number" className={fieldClass} style={{ padding: '12px 14px' }} />
          </div>

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

          <div>
            <label className={labelClass}>Nome no cartão</label>
            <input type="text" id="mp-cardholder-name" className={inputClass} placeholder="NOME SOBRENOME" style={{ textTransform: 'uppercase' }} />
          </div>

          <select id="mp-issuer" className="hidden" aria-hidden="true" />

          <div>
            <label className={labelClass}>Parcelas</label>
            <select id="mp-installments" className="w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-base font-medium outline-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/10 transition-all cursor-pointer" />
          </div>

          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2">
              <label className={labelClass}>Documento</label>
              <select id="mp-identification-type" className="w-full h-12 px-3 border-[1.5px] border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:border-[#00B4D8] transition-all" />
            </div>
            <div className="col-span-3">
              <label className={labelClass}>Número</label>
              <input type="text" id="mp-identification-number" className={inputClass} placeholder="000.000.000-00" />
            </div>
          </div>

          <div>
            <label className={labelClass}>E-mail</label>
            <input type="email" id="mp-cardholder-email" className={inputClass} placeholder="seu@email.com" />
          </div>

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
              <><Loader2 className="w-5 h-5 animate-spin" /> Processando pagamento...</>
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
