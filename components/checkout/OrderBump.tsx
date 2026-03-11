'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface OrderBumpProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  bumpPrice?: number;
  originalPrice?: number;
}

export default function OrderBump({
  checked,
  onChange,
  bumpPrice = 49.9,
  originalPrice = 79.9,
}: OrderBumpProps) {
  const discount = Math.round(((originalPrice - bumpPrice) / originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="order-bump relative rounded-2xl overflow-hidden"
      style={{
        border: checked ? '2.5px solid #FFB800' : '2px solid #FDE68A',
        boxShadow: checked
          ? '0 0 0 4px rgba(255,184,0,0.12), 0 8px 30px rgba(255,184,0,0.2)'
          : '0 4px 20px rgba(255,184,0,0.08)',
        background: checked
          ? 'linear-gradient(135deg, #FFFBEA 0%, #FEF3C7 100%)'
          : 'linear-gradient(135deg, #FFFDF0 0%, #FFFBEA 100%)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* "MAIS VENDIDO" badge */}
      <div
        className="absolute top-2.5 right-2.5 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight shadow-sm"
        style={{ background: 'linear-gradient(135deg, #FF8C42, #FF6B6B)', zIndex: 10 }}
      >
        🔥 Mais Vendido
      </div>

      {/* Header strip */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{
          background: 'linear-gradient(90deg, rgba(255,184,0,0.15), transparent)',
          borderBottom: '1px solid rgba(255,184,0,0.2)',
        }}
      >
        <Sparkles className="w-4 h-4" style={{ color: '#D97706' }} />
        <p className="font-black text-sm" style={{ color: '#92400E' }}>
          🎁 OFERTA ESPECIAL — Adicione com 1 clique!
        </p>
      </div>

      {/* Product row */}
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          {/* Product image placeholder */}
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl"
            style={{
              background: 'linear-gradient(135deg, #FF8C42, #FFB800)',
              boxShadow: '0 4px 16px rgba(255,140,66,0.3)',
            }}
          >
            🎱
          </div>

          {/* Product info */}
          <div className="flex-1">
            <p className="font-black text-gray-900 leading-tight text-sm">
              Pack 2 Bolas Surpresa
            </p>
            <p className="text-gray-600 text-xs mb-2">Mini Brands Fill the Fridge</p>
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-400 text-xs">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </span>
              <span
                className="font-black text-base"
                style={{ color: '#D97706' }}
              >
                R$ {bumpPrice.toFixed(2).replace('.', ',')}
              </span>
              <span
                className="text-white text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background: '#FF3B30' }}
              >
                {discount}% OFF
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          🎲 Cada bolinha revela 1 miniatura surpresa para encher sua geladeirinha!
          São mais de <strong>60 itens diferentes</strong> para colecionar.
        </p>

        {/* Checkbox CTA */}
        <label
          className="flex items-center gap-3 cursor-pointer group"
          htmlFor="order-bump-checkbox"
        >
          <div className="relative flex-shrink-0">
            <input
              id="order-bump-checkbox"
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                background: checked
                  ? 'linear-gradient(135deg, #FFB800, #FF8C42)'
                  : 'white',
                border: checked ? 'none' : '2px solid #D1D5DB',
                boxShadow: checked ? '0 4px 12px rgba(255,184,0,0.4)' : 'none',
              }}
            >
              <AnimatePresence>
                {checked && (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
          </div>
          <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900">
            ✅ Sim! Quero adicionar as bolinhas surpresa por apenas{' '}
            <span style={{ color: '#D97706' }}>
              R$ {bumpPrice.toFixed(2).replace('.', ',')}
            </span>
          </span>
        </label>

        {/* Animated total update */}
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 p-2.5 rounded-xl text-center text-sm font-bold"
                style={{ background: 'rgba(255,184,0,0.15)', color: '#B45309' }}
              >
                <ShoppingBag className="w-4 h-4 inline mr-1.5 mb-0.5" />
                Bolas surpresa adicionadas! 🎉 Você economizou R$ {(originalPrice - bumpPrice).toFixed(2).replace('.', ',')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
