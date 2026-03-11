'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, Info } from 'lucide-react';

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
  const publicKey = mpPublicKey || process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-97f1dfa1-c950-49a7-bf24-78c4d613f272';
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [formMounted, setFormMounted] = useState(false);
  const [showForceButton, setShowForceButton] = useState(false);
  
  const cardFormRef = useRef<any>(null);
  const onTokenRef = useRef(onToken);
  const initializedRef = useRef(false);
  const isUnmounted = useRef(false);

  // Update ref when onToken changes (without re-triggering effect)
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    isUnmounted.current = false;
    
    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.MercadoPago) return resolve();
        
        // Find existing script
        const existingScript = document.querySelector('script[src*="mercadopago.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () => reject());
          // If it's already there but not loaded, we wait. 
          // If it's already there and loaded, window.MercadoPago would be true.
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/v2/mercadopago.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });
    };

    const init = async () => {
      if (initializedRef.current) return;

      try {
        console.log('[MP] Starting loading process...');
        await loadScript();
        
        // Final check with short retry
        let checkAttempts = 0;
        while (!window.MercadoPago && checkAttempts < 10) {
          if (isUnmounted.current) return;
          await new Promise(r => setTimeout(r, 500));
          checkAttempts++;
        }

        if (!window.MercadoPago) throw new Error('SDK not found on window after loading');

        if (isUnmounted.current || !publicKey) return;

        console.log('[MP] Initializing SDK...');
        initializedRef.current = true;

        const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' });
        
        const cardForm = mp.cardForm({
          amount: String(amount.toFixed(2)),
          iframe: true,
          form: {
            id: 'card-form',
            cardNumber: { id: 'mp-card-number', placeholder: '•••• •••• •••• ••••' },
            expirationDate: { id: 'mp-expiration-date', placeholder: 'MM/AA' },
            securityCode: { id: 'mp-security-code', placeholder: 'CVV' },
            cardholderName: { id: 'mp-cardholder-name' },
            issuer: { id: 'mp-issuer' },
            installments: { id: 'mp-installments' },
            identificationType: { id: 'mp-identification-type' },
            identificationNumber: { id: 'mp-identification-number' },
            cardholderEmail: { id: 'mp-cardholder-email' },
          },
          callbacks: {
            onFormMounted: (error: any) => {
              if (isUnmounted.current) return;
              if (error) {
                console.error('[MP] Mount Error:', error);
                setFormMounted(true);
                setStatus('ready');
                return;
              }
              setFormMounted(true);
              setStatus('ready');
            },
            onSubmit: (event: any) => {
              event.preventDefault();
              try {
                const formData = cardForm.getCardFormData();
                onTokenRef.current(formData);
              } catch (e) {
                console.error('[MP] Submit Error:', e);
              }
            },
            onError: (errors: any) => {
              console.warn('[MP] SDK Errors:', errors);
            },
          },
        });

        cardFormRef.current = cardForm;
      } catch (err) {
        console.error('[MP] Initialization Failure:', err);
        if (!isUnmounted.current) setStatus('error');
      }
    };

    init();

    return () => {
      isUnmounted.current = true;
      if (cardFormRef.current) {
        try { cardFormRef.current.unmount(); } catch (e) {}
        cardFormRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [publicKey, amount]);

  const field = 'w-full min-h-[48px] border-[1.5px] border-gray-200 rounded-xl bg-white overflow-hidden';
  const input = 'w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl text-base outline-none bg-white focus:border-[#00B4D8]';
  const lbl = 'block text-sm font-bold text-gray-700 mb-1.5';

  if (status === 'error') {
    return (
      <div className="p-5 rounded-2xl text-center space-y-3" style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}>
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="font-bold text-red-700 text-sm">Erro ao carregar checkout</p>
        <button onClick={() => window.location.reload()} className="text-xs font-bold text-red-600 flex items-center gap-1 mx-auto underline">
          <RefreshCw className="w-3 h-3" /> Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {!formMounted && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#00B4D8]" />
          <p className="text-sm font-medium animate-pulse">Conectando ao sistema seguro...</p>
          
          {showForceButton && (
            <button 
              onClick={() => { setFormMounted(true); setStatus('ready'); }}
              className="mt-4 text-xs bg-white px-4 py-2 rounded-full border shadow-sm text-gray-500 hover:text-[#00B4D8]"
            >
              O carregamento está lento? Clique aqui.
            </button>
          )}
        </div>
      )}

      <div style={{ 
        opacity: formMounted ? 1 : 0, 
        visibility: formMounted ? 'visible' : 'hidden',
        height: formMounted ? 'auto' : '0', 
        overflow: 'hidden',
        transition: 'opacity 0.5s ease-in-out' 
      }}>
        <form id="card-form" className="space-y-4">
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
            <input type="text" id="mp-cardholder-name" className={input} placeholder="NOME COMO NO CARTÃO" style={{ textTransform: 'uppercase' }} />
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
            <label className={lbl}>E-mail para confirmação</label>
            <input type="email" id="mp-cardholder-email" className={input} placeholder="seu@email.com" />
          </div>

          <div className="mt-2 p-3 bg-blue-50/50 rounded-xl flex items-start gap-2 border border-blue-100/50">
            <Info className="w-4 h-4 text-blue-400 mt-0.5" />
            <p className="text-[10px] text-blue-600 leading-tight">
              Seu pagamento será processado de forma segura pelo Mercado Pago. Não armazenamos seus dados de cartão.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !formMounted}
            className="w-full h-14 text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-2"
            style={{
              background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #06D6A0, #00B4D8)',
              boxShadow: loading ? 'none' : '0 8px 30px rgba(0,180,216,0.4)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</> : '🔒 Finalizar Compra'}
          </button>
        </form>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400 font-medium">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-400" /> Conexão segura SSL</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full" />
        <span>Pagamento processado por Mercado Pago</span>
      </div>
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
