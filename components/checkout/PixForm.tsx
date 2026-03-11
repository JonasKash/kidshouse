'use client';

import { useState } from 'react';
import { Loader2, Copy, CheckCheck } from 'lucide-react';

interface PixFormProps {
  payerData: {
    email: string;
    cpf: string;
    firstName: string;
    lastName: string;
  };
  total: number;
  orderBump: boolean;
  cartItems: any[];
  onSuccess: (data: { paymentId: string; qrCode: string; qrCodeBase64: string }) => void;
}

export default function PixForm({ payerData, total, orderBump, cartItems, onSuccess }: PixFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrData, setQrData] = useState<{ qrCode: string; qrCodeBase64: string; paymentId: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<'pending' | 'approved' | 'failed' | null>(null);

  const handleGenerate = async () => {
    if (!payerData.email || !payerData.cpf) {
      setError('Preencha seus dados pessoais antes de gerar o PIX.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'pix',
          payer: payerData,
          orderBump,
          cartItems,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.message || 'Erro ao gerar PIX');
      }

      setQrData({ qrCode: data.qr_code, qrCodeBase64: data.qr_code_base64, paymentId: data.payment_id });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar PIX. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!qrData?.paymentId) return;
    setVerifying(true);
    setVerifyResult(null);

    try {
      const res = await fetch(`/api/pagamento/status?payment_id=${qrData.paymentId}`);
      const data = await res.json();

      if (data.status === 'approved') {
        setVerifyResult('approved');
        // Redirect to obrigado after a short delay
        setTimeout(() => {
          onSuccess({ paymentId: qrData.paymentId, qrCode: qrData.qrCode, qrCodeBase64: qrData.qrCodeBase64 });
        }, 1500);
      } else if (data.status === 'pending' || data.status === 'in_process') {
        setVerifyResult('pending');
      } else {
        setVerifyResult('failed');
      }
    } catch {
      setVerifyResult('pending');
    } finally {
      setVerifying(false);
    }
  };

  const handleCopy = () => {
    if (qrData?.qrCode) {
      navigator.clipboard.writeText(qrData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (qrData) {
    return (
      <div className="text-center space-y-5">
        <div
          className="p-6 rounded-2xl"
          style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0' }}
        >
          <div className="text-4xl mb-2">📱</div>
          <p className="font-bold text-green-800 text-lg">QR Code gerado! Escaneie para pagar</p>
          <p className="text-green-700 text-sm mt-1">Válido por 30 minutos</p>
        </div>

        {/* QR Code */}
        {qrData.qrCodeBase64 ? (
          <div className="flex justify-center">
            <img
              src={`data:image/png;base64,${qrData.qrCodeBase64}`}
              alt="QR Code PIX"
              className="w-52 h-52 rounded-2xl"
              style={{ border: '4px solid #E5E7EB' }}
            />
          </div>
        ) : (
          <div
            className="w-52 h-52 mx-auto rounded-2xl flex items-center justify-center text-5xl"
            style={{ background: '#F3F4F6', border: '2px solid #E5E7EB' }}
          >
            📱
          </div>
        )}

        {/* Copy code */}
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Ou copie o código PIX:</p>
          <div
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}
          >
            <code className="text-xs text-gray-600 truncate flex-1 font-mono">
              {qrData.qrCode?.substring(0, 60)}...
            </code>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: copied ? '#ECFDF5' : '#E0F7FA',
                color: copied ? '#059669' : '#0090AE',
              }}
            >
              {copied ? (
                <><CheckCheck className="w-3.5 h-3.5" /> Copiado!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copiar</>
              )}
            </button>
          </div>
        </div>

        {/* Verify payment button */}
        <div className="space-y-3">
          {verifyResult === 'approved' && (
            <div className="p-4 rounded-xl text-center" style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0' }}>
              <p className="font-bold text-green-800 text-base">✅ Pagamento confirmado! Redirecionando...</p>
            </div>
          )}
          {verifyResult === 'pending' && (
            <div className="p-3 rounded-xl text-sm text-amber-700 font-medium" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              ⏳ Pagamento ainda não detectado. Aguarde alguns segundos após pagar e tente novamente.
            </div>
          )}
          {verifyResult === 'failed' && (
            <div className="p-3 rounded-xl text-sm text-red-700 font-medium" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              ❌ Pagamento não aprovado. Verifique e tente novamente.
            </div>
          )}

          <button
            onClick={handleVerifyPayment}
            disabled={verifying || verifyResult === 'approved'}
            className="w-full h-14 text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #06D6A0, #00B4D8)',
              boxShadow: '0 8px 30px rgba(0, 180, 216, 0.4)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {verifying ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Verificando pagamento...</>
            ) : verifyResult === 'approved' ? (
              <>✅ Pagamento confirmado!</>
            ) : (
              <>✅ Já paguei — Verificar pagamento</>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Após pagar, clique em "Já paguei" para confirmar e liberar seu pedido.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Info card */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: '#F0FDFF', border: '1.5px solid #B2EBF2' }}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">📱</span>
          <div>
            <p className="font-bold text-gray-800">Pague via PIX</p>
            <p className="text-sm text-gray-600 mt-1">
              Pagamento instantâneo aprovado em segundos. QR Code válido por 30 minutos.
            </p>
            <div className="mt-3 space-y-1">
              {[
                '📸 Abra o app do seu banco',
                '🔍 Escaneie o QR Code ou cole o código',
                '✅ Confirme na tela abaixo que pagou',
              ].map((step) => (
                <p key={step} className="text-xs text-gray-600 font-medium">
                  {step}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div
        className="flex items-center justify-between p-4 rounded-xl"
        style={{ background: '#F8F9FF', border: '1px solid #E5E7EB' }}
      >
        <span className="font-bold text-gray-700">Total a pagar:</span>
        <span
          className="font-black text-xl"
          style={{ color: '#00B4D8', fontFamily: "'Poppins', sans-serif" }}
        >
          R$ {total.toFixed(2).replace('.', ',')}
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-xl text-sm text-red-700 font-medium" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full h-14 text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #06D6A0, #00B4D8)',
          boxShadow: loading ? 'none' : '0 8px 30px rgba(0, 180, 216, 0.4)',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Gerando QR Code PIX...
          </>
        ) : (
          <>📱 Gerar QR Code PIX</>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        🔒 Pagamento 100% seguro via Mercado Pago
      </p>
    </div>
  );
}
