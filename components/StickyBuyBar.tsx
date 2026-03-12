'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

export default function StickyBuyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-50 transition-transform duration-500 ease-out"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        background: 'white',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.12)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {/* Mini product image */}
      <div
        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
        style={{ background: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)' }}
      >
        ❄️
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900 truncate">Mini Geladeira Kids™</p>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 line-through text-[10px]">R$ 249,00</span>
          <span className="font-black text-sm" style={{ color: '#00B4D8' }}>
            R$ 149,00
          </span>
        </div>
      </div>

      {/* CTA */}
      <a
        href="https://ggcheckout.com.br/checkout/v2/eFVZqmFdbzaoHss6XIfr"
        className="flex-shrink-0 flex items-center gap-1.5 text-white font-bold text-sm px-5 py-3 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #06D6A0, #00B4D8)',
          boxShadow: '0 4px 20px rgba(0,180,216,0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        <Zap className="w-4 h-4 fill-white" />
        Comprar
      </a>
    </div>
  );
}
