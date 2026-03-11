'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, MessageCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ThankYouPage() {
  const { cartItems, total, clearCart } = useCart();
  const basePrice = 149.0;
  const finalTotal = basePrice + total;

  useEffect(() => {
    // Fire Purchase event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: finalTotal,
        currency: 'BRL',
        contents: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity
        })),
        content_type: 'product'
      });
    }
    
    // Clear cart after conversion
    // delay slightly to ensure tracking fires with data
    const timer = setTimeout(() => {
      clearCart();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Pedido Confirmado!
        </h1>
        <p className="text-gray-600 mb-8 font-medium">
          Obrigado pela sua compra. Enviamos um e-mail com todos os detalhes do seu pedido.
        </p>

        <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left border border-blue-100">
          <h3 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Resumo do Pedido
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-blue-700">
              <span>Mini Geladeira Kids™</span>
              <span className="font-bold">R$ 149,00</span>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-blue-700">
                <span>{item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}</span>
                <span className="font-bold">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
            <div className="border-t border-blue-200 mt-3 pt-3 flex justify-between text-blue-900 font-black text-lg">
              <span>Total</span>
              <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Precisa de ajuda?</p>
          <a
            href="https://wa.me/553491615988"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-6 h-6 fill-white" />
            Suporte via WhatsApp
          </a>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 text-gray-500 font-bold hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a loja
          </Link>
        </div>
      </div>
      
      <p className="mt-8 text-gray-400 text-xs font-medium">
        © 2024 GeladeiraKids™ — Todos os direitos reservados.
      </p>
    </div>
  );
}
