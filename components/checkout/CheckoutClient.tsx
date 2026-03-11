'use client';

import React from 'react';
import Link from 'next/link';
import { Snowflake, ShieldCheck, Lock } from 'lucide-react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';

export default function CheckoutClient() {
  const mpPublicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? '';
  const { cartItems, total: cartTotal } = useCart();
  
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout');
    }
  }, []);
  
  const basePrice = 149.0;
  const finalTotal = basePrice + cartTotal;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0FDFF 0%, #F8F9FF 60%, #FFFFFF 100%)' }}>
      {/* Checkout Header */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'linear-gradient(135deg, #0096C7, #00B4D8)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.12)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Snowflake className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-white font-bold text-lg"
              style={{ fontFamily: "'Bricolage Grotesque', 'Poppins', sans-serif" }}
            >
              Geladeira<span style={{ color: '#90E0EF' }}>Kids</span>™
            </span>
          </Link>

          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            Compra 100% Segura
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Form column */}
          <div
            className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}
          >
            <CheckoutForm mpPublicKey={mpPublicKey} />
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
            {/* Product card */}
            <div
              className="bg-white rounded-3xl p-6"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}
            >
              <h3
                className="font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Resumo do Pedido
              </h3>

              {/* Product item */}
              <div className="flex items-center gap-3 pb-4 mb-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)' }}
                >
                  ❄️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 leading-tight">
                    Mini Geladeira Kids™
                  </p>
                  <p className="text-xs text-gray-500">Fill the Fridge Playset</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400 line-through">R$ 249,00</p>
                  <p className="font-black text-sm" style={{ color: '#00B4D8' }}>R$ 149,00</p>
                </div>
              </div>

              {/* Cart items */}
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pb-4 mb-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50 border border-gray-100"
                  >
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-sm" style={{ color: '#00B4D8' }}>
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}

              {/* Subtotal */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="text-green-600 font-bold">Grátis 🎉</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Desconto</span>
                  <span className="text-red-500 font-bold">- R$ 100,00</span>
                </div>
              </div>

              <div
                className="flex justify-between items-center pt-3 font-black text-base"
                style={{
                  borderTop: '2px solid #E0F7FA',
                  color: '#0090AE',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <span>Total</span>
                <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">
                ou 12x de <strong>R$ {(finalTotal / 12).toFixed(2).replace('.', ',')}</strong> sem juros
              </p>
            </div>

            {/* Security badges */}
            <div
              className="bg-white rounded-2xl p-4"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <div className="space-y-2">
                {[
                  { icon: '🔒', text: 'SSL 256-bit — Dados criptografados' },
                  { icon: '🛡️', text: 'Compra protegida pelo Mercado Pago' },
                  { icon: '↩️', text: '7 dias para devolução sem custo' },
                  { icon: '📦', text: 'Enviamos em até 24h (dias úteis)' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <p className="text-xs text-gray-600 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment logos */}
            <div
              className="bg-white rounded-2xl p-4 text-center"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">
                Pagamentos aceitos
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {['Visa', 'Master', 'Amex', 'Elo', 'PIX', 'Boleto'].map((method) => (
                  <span
                    key={method}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{
                      background: '#F8F9FF',
                      border: '1px solid #E5E7EB',
                      color: '#6C757D',
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
