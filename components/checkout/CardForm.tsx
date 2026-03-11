'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    MercadoPago: any;
  }
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
  const cardFormRef = useRef<any>(null);
  const initializedRef = useRef(false);

  // Function to initialize CardForm when MP SDK is ready
  const initializeCardForm = () => {
    if (initializedRef.current || !window.MercadoPago || !publicKey) return;

    try {
      console.log('[CardForm] Initializing MercadoPago CardForm...');
      const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' });
      
      const cardForm = mp.cardForm({
        amount: String(amount),
        iframe: true,
        form: {
          id: 'card-form',
          cardNumber: { id: 'mp-card-number', placeholder: '•••• •••• •••• ••••' },
          expirationDate: { id: 'mp-expiration-date', placeholder: 'MM/AA' },
          securityCode: { id: 'mp-security-code', placeholder: 'CVV' },
          cardholderName: { id: 'mp-cardholder-name' }, // no placeholder for normal input
          issuer: { id: 'mp-issuer' },
          installments: { id: 'mp-installments' },
          identificationType: { id: 'mp-identification-type' },
          identificationNumber: { id: 'mp-identification-number' },
          cardholderEmail: { id: 'mp-cardholder-email' },
        },
        callbacks: {
          onFormMounted: (error: any) => {
            if (error) {
              console.error('[CardForm] Error mounting form:', error);
              setStatus('error');
              return;
            }
            console.log('[CardForm] Form successfully mounted');
            setFormMounted(true);
            setStatus('ready');
          },
          onSubmit: (event: any) => {
            event.preventDefault();
            const formData = cardForm.getCardFormData();
            onToken(formData);
          },
          onError: (errors: any) => {
            console.error('[CardForm] Form errors:', errors);
          },
        },
      });

      cardFormRef.current = cardForm;
      initializedRef.current = true;
    } catch (err) {
      console.error('[CardForm] Initialization crash:', err);
      setStatus('error');
    }
  };

  useEffect(() => {
    // If MP is already on window (from previous navigation), init immediately
    if (window.MercadoPago && !initializedRef.current) {
      initializeCardForm();
    }

    return () => {
      if (cardFormRef.current) {
        cardFormRef.current.unmount();
        cardFormRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [publicKey, amount, onToken]); // Added dependencies for initializeCardForm to be up-to-date

  const field = 'w-full min-h-[48px] border-[1.5px] border-gray-200 rounded-xl bg-white overflow-hidden';
  const input = 'w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl text-base outline-none bg-white focus:border-[#00B4D8]';
  const lbl = 'block text-sm font-bold text-gray-700 mb-1.5';

  if (status === 'error') {
    return (
      <div className="p-5 rounded-2xl text-center space-y-3" style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}>
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="font-bold text-red-700 text-sm">Erro ao carregar formulário do cartão</p>
        <p className="text-red-600 text-xs">
          {!publicKey ? 'Public Key não configurada' : 'Verifique sua conexão ou tente recarregar'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-xs font-bold text-red-600 mx-auto hover:text-red-800"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Recarregar página
        </button>
      </div>
    );
  }

  return (
    <>
      <Script 
        src="https://sdk.mercadopago.com/v2/mercadopago.js" 
        onLoad={initializeCardForm}
        onError={() => setStatus('error')}
      />

      {!formMounted && (
        <div className="flex items-center justify-center gap-2 py-8 text-gray-400 text-sm mb-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Carregando formulário seguro...
        </div>
      )}

      <form id="card-form" style={{ display: formMounted ? 'block' : 'none', transition: 'opacity 0.4s' }}>
        <div className="space-y-4">
          <div>
            <label className={lbl}>Número do cartão</label>
            <div id="mp-card-number" className={field} style={{ padding: '0 14px', display: 'flex', alignItems: 'center' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Validade</label>
              <div id="mp-expiration-date" className={field} style={{ padding: '0 14px', display: 'flex', alignItems: 'center' }} />
            </div>
            <div>
              <label className={lbl}>CVV</label>
              <div id="mp-security-code" className={field} style={{ padding: '0 14px', display: 'flex', alignItems: 'center' }} />
            </div>
          </div>
          <div>
            <label className={lbl}>Nome no cartão</label>
            <input type="text" id="mp-cardholder-name" className={input} placeholder="NOME SOBRENOME" style={{ textTransform: 'uppercase' }} />
          </div>
          
          <div id="mp-issuer-container" className="hidden">
            <select id="mp-issuer" />
          </div>

          <div>
            <label className={lbl}>Parcelas</label>
            <select id="mp-installments" className="w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-base outline-none focus:border-[#00B4D8] cursor-pointer" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2">
              <label className={lbl}>Documento</label>
              <select id="mp-identification-type" className="w-full h-12 px-3 border-[1.5px] border-gray-200 rounded-xl bg-white text-sm outline-none focus:border-[#00B4D8]" />
            </div>
            <div className="col-span-3">
              <label className={lbl}>Número</label>
              <input type="text" id="mp-identification-number" className={input} placeholder="000.000.000-00" />
            </div>
          </div>
          <div>
            <label className={lbl}>E-mail</label>
            <input type="email" id="mp-cardholder-email" className={input} placeholder="seu@email.com" />
          </div>
          <button
            type="submit"
            disabled={loading || !formMounted}
            className="w-full h-14 text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #06D6A0, #00B4D8)',
              boxShadow: loading ? 'none' : '0 8px 30px rgba(0,180,216,0.4)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</> : '🔒 Finalizar Compra com Segurança'}
          </button>
        </div>
      </form>
      <p className="text-center text-xs text-gray-400 mt-3">🔒 Pagamento 100% seguro — SSL 256-bit via Mercado Pago</p>
    </>
  );
}
