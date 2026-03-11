'use client';

import { useState, useEffect, useRef, memo, useCallback } from 'react';
import {
  initMercadoPago,
  CardNumber,
  ExpirationDate,
  SecurityCode,
  createCardToken,
  getPaymentMethods,
} from '@mercadopago/sdk-react';
import { Loader2, Info } from 'lucide-react';

interface CardFormData {
  token: string;
  installments: string;
  paymentMethodId: string;
  issuerId: string;
  cardholderName: string;
  cardholderEmail: string;
}

interface CardFormProps {
  amount: number;
  mpPublicKey: string;
  payerData?: {
    email: string;
    cpf: string;
    firstName: string;
    lastName: string;
  };
  onToken: (data: CardFormData) => void;
  loading?: boolean;
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

// Secure fields isolated in memo to NEVER re-render when parent state changes
const SecureCardFields = memo(function SecureCardFields({
  onBinChange,
}: {
  onBinChange: (bin: string) => void;
}) {
  const fieldStyle = { fontSize: '15px', fontFamily: 'Nunito, sans-serif', color: '#111827' };
  const wrapper = {
    height: '48px',
    overflow: 'hidden',
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid #E5E7EB',
    borderRadius: '12px',
    background: 'white',
  } as React.CSSProperties;

  return (
    <>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Número do cartão</label>
        <div style={wrapper}>
          <CardNumber
            placeholder="•••• •••• •••• ••••"
            style={fieldStyle}
            onBinChange={(binData: any) => {
              const bin = typeof binData === 'string' ? binData : binData?.bin;
              if (bin) onBinChange(bin);
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Validade</label>
          <div style={wrapper}>
            <ExpirationDate placeholder="MM/AA" style={fieldStyle} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">CVV</label>
          <div style={wrapper}>
            <SecurityCode placeholder="CVV" style={fieldStyle} />
          </div>
        </div>
      </div>
    </>
  );
});

let mpInitialized = false;

export default function CardForm({ amount, mpPublicKey, payerData, onToken, loading = false }: CardFormProps) {
  const publicKey = mpPublicKey || process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-97f1dfa1-c950-49a7-bf24-78c4d613f272';

  const [cardholderName, setCardholderName] = useState(
    payerData ? `${payerData.firstName} ${payerData.lastName}`.toUpperCase() : ''
  );
  const [cardholderEmail, setCardholderEmail] = useState(payerData?.email || '');
  const [docType, setDocType] = useState('CPF');
  const [docNumber, setDocNumber] = useState(payerData?.cpf || '');
  const [installments, setInstallments] = useState('1');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [issuerId, setIssuerId] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mpInitialized) {
      initMercadoPago(publicKey, { locale: 'pt-BR' });
      mpInitialized = true;
    }
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, [publicKey]);

  const handleBinChange = useCallback(async (bin: string) => {
    if (bin.length >= 6) {
      try {
        const methods = await getPaymentMethods({ bin }) as any;
        const m = methods?.results?.[0];
        if (m) {
          setPaymentMethodId(m.id);
          setIssuerId(m.issuer?.id?.toString() || '');
        }
      } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cardholderName.trim()) {
      setError('Informe o nome impresso no cartão.');
      return;
    }
    if (!docNumber.trim()) {
      setError('Informe o número do documento.');
      return;
    }
    if (!paymentMethodId) {
      setError('Bandeira do cartão não identificada. Verifique o número do cartão e aguarde um instante antes de tentar novamente.');
      return;
    }

    try {
      const result = await createCardToken({
        cardholderName,
        identificationType: docType,
        identificationNumber: docNumber.replace(/\D/g, ''),
      });

      if (!result?.id) {
        throw new Error('Não foi possível validar os dados do cartão. Verifique e tente novamente.');
      }

      onToken({
        token: result.id,
        installments,
        paymentMethodId: paymentMethodId,
        issuerId: issuerId,
        cardholderName,
        cardholderEmail,
      });
    } catch (err: any) {
      const cause = err?.cause?.[0];
      const codeMessages: Record<string, string> = {
        '205': 'Número do cartão inválido.',
        '208': 'Data de validade inválida.',
        '209': 'CVV inválido.',
        '212': 'CPF inválido.',
        '213': 'Nome no cartão inválido.',
        '214': 'Nome no cartão muito curto.',
        '220': 'Banco emissor não encontrado.',
        '221': 'Nome no cartão inválido.',
        '224': 'CVV obrigatório.',
        'E301': 'Número do cartão inválido.',
        'E302': 'CVV inválido.',
        'E303': 'Data de validade inválida.',
        'E304': 'Data de validade inválida.',
      };
      const msg = (cause?.code && codeMessages[cause.code]) || cause?.description || err?.message || 'Erro ao processar o cartão. Verifique os dados e tente novamente.';
      setError(msg);
    }
  };

  const input = 'w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl text-base outline-none bg-white focus:border-[#00B4D8]';
  const lbl = 'block text-sm font-bold text-gray-700 mb-1.5';

  return (
    <div className="relative">
      {!ready && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#00B4D8]" />
          <p className="text-sm font-medium animate-pulse">Conectando ao sistema seguro...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: ready ? 'block' : 'none' }}>
        {/* Secure fields - memoized, NEVER re-render */}
        <SecureCardFields onBinChange={handleBinChange} />

        <div className="space-y-4 mt-4">
          <div>
            <label className={lbl}>Nome no cartão</label>
            <input
              type="text"
              className={input}
              placeholder="NOME COMO NO CARTÃO"
              style={{ textTransform: 'uppercase' }}
              value={cardholderName}
              onChange={e => setCardholderName(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div>
            <label className={lbl}>Parcelas</label>
            <select
              className="w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-base outline-none focus:border-[#00B4D8] cursor-pointer"
              value={installments}
              onChange={e => setInstallments(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                <option key={n} value={String(n)}>
                  {n}x de R$ {(amount / n).toFixed(2).replace('.', ',')} {n === 1 ? '(sem juros)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2">
              <label className={lbl}>Documento</label>
              <select
                className="w-full h-12 px-3 border-[1.5px] border-gray-200 rounded-xl bg-white text-sm outline-none focus:border-[#00B4D8]"
                value={docType}
                onChange={e => setDocType(e.target.value)}
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className={lbl}>Número</label>
              <input
                type="text"
                className={input}
                placeholder="000.000.000-00"
                value={docType === 'CPF' ? (
                  docNumber.length <= 11 
                    ? docNumber.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
                    : docNumber
                ) : docNumber}
                onChange={e => {
                  let v = e.target.value;
                  if (docType === 'CPF') {
                    v = v.replace(/\D/g, '');
                    if (v.length > 11) v = v.slice(0, 11);
                  }
                  setDocNumber(v);
                }}
                required
              />
            </div>
          </div>

          <div>
            <label className={lbl}>E-mail para confirmação</label>
            <input
              type="email"
              className={input}
              placeholder="seu@email.com"
              value={cardholderEmail}
              onChange={e => setCardholderEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl text-sm text-red-700 font-medium" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="p-3 bg-blue-50/50 rounded-xl flex items-start gap-2 border border-blue-100/50">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-blue-600 leading-tight">
              Seu pagamento será processado de forma segura pelo Mercado Pago. Não armazenamos seus dados de cartão.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !ready}
            className="w-full h-14 text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #06D6A0, #00B4D8)',
              boxShadow: loading ? 'none' : '0 8px 30px rgba(0,180,216,0.4)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</> : '🔒 Finalizar Compra'}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400 font-medium">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-400" /> Conexão segura SSL</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full" />
        <span>Pagamento processado por Mercado Pago</span>
      </div>
    </div>
  );
}
