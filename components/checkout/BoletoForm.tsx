'use client';

import { useState } from 'react';
import { Loader2, Copy, CheckCheck, ExternalLink } from 'lucide-react';

interface BoletoFormProps {
  payerData: {
    email: string;
    cpf: string;
    firstName: string;
    lastName: string;
  };
  total: number;
  orderBump: boolean;
  onSuccess: (data: { paymentId: string; barcode: string; url: string }) => void;
}

export default function BoletoForm({ payerData, total, orderBump, onSuccess }: BoletoFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [boletoData, setBoletoData] = useState<{ barcode: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!payerData.email || !payerData.cpf) {
      setError('Preencha seus dados pessoais antes de gerar o boleto.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'bolbradesco',
          payer: payerData,
          orderBump,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.message || 'Erro ao gerar boleto');

      setBoletoData({ barcode: data.barcode, url: data.external_resource_url });
      onSuccess({ paymentId: data.payment_id, barcode: data.barcode, url: data.external_resource_url });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar boleto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (boletoData?.barcode) {
      navigator.clipboard.writeText(boletoData.barcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (boletoData) {
    return (
      <div className="space-y-5">
        <div className="p-5 rounded-2xl text-center" style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0' }}>
          <div className="text-4xl mb-2">📄</div>
          <p className="font-bold text-green-800 text-lg">Boleto gerado!</p>
          <p className="text-green-700 text-sm mt-1">Vencimento: próximo dia útil</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-700">Código de barras:</p>
          <div
            className="p-3 rounded-xl"
            style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}
          >
            <code className="text-xs text-gray-600 font-mono break-all leading-relaxed block">
              {boletoData.barcode}
            </code>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: copied ? '#ECFDF5' : '#E0F7FA',
              color: copied ? '#059669' : '#0090AE',
              border: `1px solid ${copied ? '#A7F3D0' : '#B2EBF2'}`,
            }}
          >
            {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Código copiado!' : 'Copiar código de barras'}
          </button>
        </div>

        {boletoData.url && (
          <a
            href={boletoData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold transition-all hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #0090AE, #00B4D8)' }}
          >
            <ExternalLink className="w-4 h-4" />
            Imprimir / Visualizar Boleto
          </a>
        )}

        <p className="text-xs text-gray-500 text-center">
          ⚠️ O pedido será confirmado após a compensação bancária (1 dia útil).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Info card */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: '#FFF8E1', border: '1.5px solid #FDE68A' }}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">🏦</span>
          <div>
            <p className="font-bold text-amber-800">Pague com Boleto Bancário</p>
            <p className="text-sm text-amber-700 mt-1">
              Prazo de compensação: 1 a 3 dias úteis após o pagamento.
            </p>
            <div className="mt-3 space-y-1">
              {[
                '📄 Imprima ou copie o código de barras',
                '🏦 Pague em qualquer banco ou lotérica',
                '✅ Compensação em até 3 dias úteis',
              ].map((step) => (
                <p key={step} className="text-xs text-amber-700 font-medium">
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
        <span className="font-black text-xl" style={{ color: '#00B4D8', fontFamily: "'Poppins', sans-serif" }}>
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
          background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #F59E0B, #D97706)',
          boxShadow: loading ? 'none' : '0 8px 30px rgba(245, 158, 11, 0.35)',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Gerando boleto...
          </>
        ) : (
          <>🏦 Gerar Boleto Bancário</>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        🔒 Boleto gerado de forma segura via Mercado Pago
      </p>
    </div>
  );
}
