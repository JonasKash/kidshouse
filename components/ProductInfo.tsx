'use client';

import { useState } from 'react';
import { ShoppingCart, Zap, Star, ChevronDown } from 'lucide-react';
import TrustBadges from './TrustBadges';

const variants = [
  { id: 'azul', label: 'Azul ❄️', color: '#00B4D8', inStock: true },
  { id: 'rosa', label: 'Rosa 🌸', color: '#FF6B9D', inStock: false },
];

const installments = [
  { n: 1, value: 149.0 },
  { n: 2, value: 74.5 },
  { n: 3, value: 49.66 },
  { n: 6, value: 24.83 },
  { n: 9, value: 16.55 },
  { n: 12, value: 12.41 },
];

export default function ProductInfo() {
  const [selectedVariant, setSelectedVariant] = useState('azul');
  const [showInstallments, setShowInstallments] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span
          className="text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide"
          style={{ background: '#FF3B30' }}
        >
          🔥 Oferta Especial
        </span>
        <span
          className="font-semibold text-xs px-3 py-1 rounded-full"
          style={{ background: '#FFF3CD', color: '#B45309', border: '1px solid #FDE68A' }}
        >
          ⚡ Estoque Limitado
        </span>
      </div>

      {/* Title */}
      <div>
        <h1
          className="font-bold leading-tight mb-1"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
            color: '#1A1A2E',
          }}
        >
          Mini Geladeira Kids™
          <br />
          <span style={{ color: '#00B4D8', fontSize: '0.85em' }}>Fill the Fridge Playset</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">by ZURU — Mini Brands®</p>
      </div>

      {/* Rating */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className="w-4 h-4 md:w-5 md:h-5"
              fill="#FFB800"
              stroke="none"
            />
          ))}
        </div>
        <span className="font-bold text-gray-800">4.9</span>
        <a
          href="#reviews"
          className="text-sm underline underline-offset-2"
          style={{ color: '#00B4D8' }}
        >
          127 avaliações
        </a>
        <span
          className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}
        >
          ✓ Verificadas
        </span>
      </div>

      {/* Price block */}
      <div
        className="p-4 md:p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #F0FDFF 0%, #E0F7FA 100%)',
          border: '1.5px solid #B2EBF2',
        }}
      >
        <div className="flex flex-col gap-1 mb-2">
          <span className="line-through text-gray-400 text-sm md:text-base font-medium">De R$ 249,00</span>
          <div className="flex items-center gap-3">
            <span
              className="font-black leading-none"
              style={{
                color: '#FF3B30',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '2.5rem',
              }}
            >
              R$ 149,00
            </span>
            <span
              className="font-bold text-xs px-2.5 py-1 rounded-full text-white"
              style={{ background: '#FF3B30' }}
            >
              40% OFF
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm font-medium">
          ou{' '}
          <strong style={{ color: '#0090AE' }}>12x de R$ 12,41</strong> sem juros
        </p>

        {/* Installment calculator */}
        <button
          onClick={() => setShowInstallments(!showInstallments)}
          className="flex items-center gap-1.5 text-xs mt-2 font-semibold transition-colors"
          style={{ color: '#00B4D8' }}
        >
          Ver todas as parcelas
          <ChevronDown
            className="w-3.5 h-3.5 transition-transform"
            style={{ transform: showInstallments ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {showInstallments && (
          <div className="mt-3 rounded-xl overflow-hidden border" style={{ borderColor: '#B2EBF2' }}>
            <table className="w-full text-xs">
              <tbody>
                {installments.map((inst, i) => (
                  <tr
                    key={inst.n}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}
                  >
                    <td className="px-3 py-2 font-semibold text-gray-700">{inst.n}x</td>
                    <td className="px-3 py-2 font-bold" style={{ color: '#0090AE' }}>
                      R$ {inst.value.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-3 py-2 text-gray-500 text-right">
                      {inst.n === 12 ? 'Sem juros' : `Total R$ ${(inst.n * inst.value).toFixed(2).replace('.', ',')}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Variant selector */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-2">
          Cor:{' '}
          <span style={{ color: '#00B4D8' }}>
            {variants.find((v) => v.id === selectedVariant)?.label}
          </span>
        </p>
        <div className="flex gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => v.inStock && setSelectedVariant(v.id)}
              disabled={!v.inStock}
              className="relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
              style={{
                background:
                  selectedVariant === v.id
                    ? v.color
                    : `${v.color}18`,
                color: selectedVariant === v.id ? 'white' : v.color,
                border: `2px solid ${selectedVariant === v.id ? v.color : `${v.color}40`}`,
                opacity: v.inStock ? 1 : 0.4,
                cursor: v.inStock ? 'pointer' : 'not-allowed',
                boxShadow:
                  selectedVariant === v.id
                    ? `0 4px 16px ${v.color}55`
                    : 'none',
              }}
            >
              {v.label}
              {!v.inStock && (
                <span
                  className="absolute -top-2 -right-2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#FF3B30' }}
                >
                  Esgot.
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <a
          href="https://ggcheckout.com.br/checkout/v2/eFVZqmFdbzaoHss6XIfr"
          onClick={() => { if (typeof window !== 'undefined' && (window as any).fbq) { (window as any).fbq('track', 'InitiateCheckout'); } }}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white font-black text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, #06D6A0 0%, #00B4D8 100%)',
            boxShadow: '0 8px 30px rgba(0, 180, 216, 0.45)',
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.01em',
          }}
        >
          <Zap className="w-5 h-5 fill-white" />
          COMPRAR AGORA
          <span className="text-sm font-bold opacity-90">→</span>
        </a>

        <a
          href="https://ggcheckout.com.br/checkout/v2/eFVZqmFdbzaoHss6XIfr"
          onClick={() => { if (typeof window !== 'undefined' && (window as any).fbq) { (window as any).fbq('track', 'InitiateCheckout'); } }}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-[1.01]"
          style={{
            background: 'transparent',
            border: '2px solid #00B4D8',
            color: '#00B4D8',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <ShoppingCart className="w-4.5 h-4.5" />
          Adicionar ao Carrinho
        </a>
      </div>

      {/* Trust badges compact */}
      <TrustBadges compact />

      {/* Urgency bar */}
      <div
        className="flex items-center gap-2 p-3 rounded-xl"
        style={{ background: '#FFF3CD', border: '1px solid #FDE68A' }}
      >
        <span className="text-xl">⏰</span>
        <div>
          <p className="text-sm font-bold text-amber-800">Só restam 7 unidades!</p>
          <p className="text-xs text-amber-700">Garanta o seu antes que esgote novamente</p>
        </div>
      </div>
    </div>
  );
}
