'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, Copy, ExternalLink, Home, Snowflake } from 'lucide-react';
import { purchase } from '@/lib/pixel';
import { conversion } from '@/lib/gtag';

function Confetti() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const colors = ['#00B4D8', '#06D6A0', '#FFB800', '#FF6B6B', '#A855F7', '#48CAE4'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
    document.body.appendChild(container);

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      const size = Math.random() * 10 + 6;
      piece.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        top:-20px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation:confetti-fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear forwards;
        opacity:1;
      `;
      container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 6000);
  }, []);

  return null;
}

function SuccessContent() {
  const params = useSearchParams();
  const paymentId = params.get('payment_id') || '';
  const status = params.get('status') || 'approved';
  const method = params.get('method') || 'cartao';
  const total = parseFloat(params.get('total') || '249');
  const qrCodeBase64 = params.get('qr_base64') || '';
  const qrCode = params.get('qr_code') || '';
  const barcode = params.get('barcode') || '';
  const boletoUrl = params.get('boleto_url') || '';

  useEffect(() => {
    if (status === 'approved' && paymentId) {
      purchase(paymentId, total);
      conversion(paymentId, total);
    }
  }, [paymentId, status, total]);

  const isApproved = status === 'approved';
  const isPix = method === 'pix';
  const isBoleto = method === 'boleto';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(180deg, #F0FDFF 0%, #F8F9FF 100%)' }}>

      {isApproved && <Confetti />}

      <div className="w-full max-w-lg">
        {/* Header card */}
        <div
          className="text-center p-8 rounded-3xl mb-6"
          style={{
            background: isApproved
              ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
              : isPix
              ? 'linear-gradient(135deg, #E0F7FA, #B2EBF2)'
              : 'linear-gradient(135deg, #FFF8E1, #FEF3C7)',
            border: `1.5px solid ${isApproved ? '#A7F3D0' : isPix ? '#B2EBF2' : '#FDE68A'}`,
            boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          }}
        >
          <div className="text-6xl mb-4 animate-bounce-gentle">
            {isApproved ? '🎉' : isPix ? '📱' : '📄'}
          </div>

          {isApproved && (
            <>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#06D6A0' }}
              >
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <h1
                className="font-black text-2xl text-green-800 mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Pedido Confirmado!
              </h1>
              <p className="text-green-700 font-medium">
                Seu pagamento foi aprovado com sucesso.
              </p>
              <p className="text-green-600 text-sm mt-2">
                Você receberá um e-mail de confirmação em breve.
              </p>
            </>
          )}

          {isPix && !isApproved && (
            <>
              <h1
                className="font-black text-2xl text-cyan-800 mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Escaneie o QR Code PIX
              </h1>
              <div className="flex items-center gap-1.5 justify-center text-cyan-600 text-sm font-medium">
                <Clock className="w-4 h-4" />
                Válido por 30 minutos
              </div>
            </>
          )}

          {isBoleto && !isApproved && (
            <>
              <h1
                className="font-black text-2xl text-amber-800 mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Boleto Gerado!
              </h1>
              <p className="text-amber-700 font-medium text-sm">
                Vencimento: próximo dia útil
              </p>
            </>
          )}
        </div>

        {/* PIX QR Code */}
        {isPix && !isApproved && (
          <div
            className="bg-white rounded-3xl p-6 mb-6 text-center"
            style={{ border: '1.5px solid #B2EBF2', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
          >
            {qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code PIX"
                className="w-52 h-52 mx-auto rounded-2xl mb-4"
                style={{ border: '4px solid #E5E7EB' }}
              />
            ) : (
              <div
                className="w-52 h-52 mx-auto rounded-2xl mb-4 flex items-center justify-center text-5xl"
                style={{ background: '#F3F4F6', border: '2px dashed #E5E7EB' }}
              >
                📱
              </div>
            )}
            {qrCode && (
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Código PIX (copie e cole):</p>
                <div
                  className="flex items-center gap-2 p-3 rounded-xl text-left"
                  style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}
                >
                  <code className="text-xs text-gray-600 truncate flex-1 font-mono">
                    {qrCode.substring(0, 50)}...
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(qrCode)}
                    className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:bg-gray-200"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Boleto */}
        {isBoleto && !isApproved && barcode && (
          <div
            className="bg-white rounded-3xl p-6 mb-6"
            style={{ border: '1.5px solid #FDE68A', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
          >
            <p className="text-sm font-bold text-gray-700 mb-2">Código de barras:</p>
            <div
              className="p-3 rounded-xl mb-4"
              style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}
            >
              <code className="text-xs font-mono text-gray-600 break-all">{barcode}</code>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(barcode)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: '#E0F7FA', color: '#0090AE', border: '1px solid #B2EBF2' }}
              >
                <Copy className="w-4 h-4" />
                Copiar código
              </button>
              {boletoUrl && (
                <a
                  href={boletoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Imprimir
                </a>
              )}
            </div>
          </div>
        )}

        {/* Order summary */}
        <div
          className="bg-white rounded-3xl p-6 mb-6"
          style={{ border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Detalhes do Pedido
          </h3>
          <div className="space-y-2 text-sm">
            {paymentId && (
              <div className="flex justify-between text-gray-600">
                <span>ID do Pedido:</span>
                <code className="font-mono text-gray-800 font-bold text-xs">#{paymentId}</code>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Produto:</span>
              <span className="font-semibold text-gray-800">Mini Geladeira Kids™</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frete:</span>
              <span className="font-semibold text-green-600">Grátis</span>
            </div>
            <div
              className="flex justify-between font-black text-base pt-2"
              style={{ borderTop: '1px solid #E5E7EB', fontFamily: "'Poppins', sans-serif", color: '#0090AE' }}
            >
              <span>Total pago:</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        {isApproved && (
          <div
            className="p-4 rounded-2xl mb-6 text-center"
            style={{ background: '#F0FDFF', border: '1px solid #B2EBF2' }}
          >
            <p className="font-bold text-cyan-800 text-sm">
              🚚 Previsão de entrega: <strong>5 a 8 dias úteis</strong>
            </p>
            <p className="text-cyan-700 text-xs mt-1">
              Você receberá o código de rastreamento por e-mail em até 24h.
            </p>
          </div>
        )}

        {/* Back to home */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, #06D6A0, #00B4D8)',
            color: 'white',
            boxShadow: '0 8px 30px rgba(0,180,216,0.35)',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <Home className="w-5 h-5" />
          Voltar à Loja
        </Link>

        {/* Logo */}
        <div className="text-center mt-8">
          <div className="flex items-center gap-2 justify-center">
            <Snowflake className="w-5 h-5" style={{ color: '#00B4D8' }} />
            <span
              className="font-bold text-gray-700"
              style={{ fontFamily: "'Bricolage Grotesque', 'Poppins', sans-serif" }}
            >
              Geladeira<span style={{ color: '#00B4D8' }}>Kids</span>™
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Obrigado pela sua compra! 🙏</p>
        </div>
      </div>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
