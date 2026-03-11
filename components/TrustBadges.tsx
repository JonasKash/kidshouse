'use client';

import { ShieldCheck, Truck, RotateCcw, Package } from 'lucide-react';

const badges = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Compra Segura',
    sub: 'SSL 256-bit',
    color: '#06D6A0',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    icon: <Truck className="w-5 h-5" />,
    title: 'Frete Grátis',
    sub: 'Todo o Brasil',
    color: '#00B4D8',
    bg: '#E0F7FA',
    border: '#B2EBF2',
  },
  {
    icon: <RotateCcw className="w-5 h-5" />,
    title: '7 dias p/ trocar',
    sub: 'Garantia total',
    color: '#FF8C42',
    bg: '#FFF3E0',
    border: '#FFCC80',
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: 'Envio em 24h',
    sub: 'Dias úteis',
    color: '#A855F7',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
];

export default function TrustBadges({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {badges.map((b) => (
          <div
            key={b.title}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}
          >
            <span style={{ color: b.color }}>{b.icon}</span>
            {b.title}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {badges.map((b) => (
        <div
          key={b.title}
          className="flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-300 hover:scale-105"
          style={{
            background: b.bg,
            border: `1.5px solid ${b.border}`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
            style={{ background: `${b.color}20`, color: b.color }}
          >
            {b.icon}
          </div>
          <p className="font-bold text-sm" style={{ color: b.color }}>
            {b.title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{b.sub}</p>
        </div>
      ))}
    </div>
  );
}
