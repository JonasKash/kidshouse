'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Snowflake, Zap } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        className="text-white text-center py-2 px-4 text-sm font-semibold"
        style={{
          background: 'linear-gradient(90deg, #0090AE, #00B4D8, #48CAE4, #00B4D8, #0090AE)',
          backgroundSize: '300% 100%',
          animation: 'gradientShift 6s ease infinite',
        }}
      >
        <span className="animate-bounce-gentle inline-block mr-1">🎉</span>
        FRETE GRÁTIS para todo Brasil + Parcelamento em até{' '}
        <strong>12x sem juros!</strong>
        <span className="ml-1">🚀</span>
      </div>

      {/* Main Header */}
      <header
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background: isScrolled
            ? 'rgba(0, 144, 174, 0.97)'
            : 'linear-gradient(135deg, #0096C7 0%, #00B4D8 60%, #48CAE4 100%)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          boxShadow: isScrolled ? '0 4px 30px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <Snowflake className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <span
              className="text-white font-bold text-xl leading-none"
              style={{ fontFamily: "'Bricolage Grotesque', 'Poppins', sans-serif" }}
            >
              Geladeira<span style={{ color: '#90E0EF' }}>Kids</span>
              <span style={{ fontSize: '0.6em', verticalAlign: 'super' }}>™</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-white/90 hover:text-white font-semibold text-sm transition-colors"
            >
              Produto
            </Link>
            <Link
              href="#reviews"
              className="text-white/90 hover:text-white font-semibold text-sm transition-colors"
            >
              Avaliações
            </Link>
            <Link
              href="#faq"
              className="text-white/90 hover:text-white font-semibold text-sm transition-colors"
            >
              Dúvidas
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="https://ggcheckout.com.br/checkout/v2/eFVZqmFdbzaoHss6XIfr"
              onClick={() => { if (typeof window !== 'undefined' && (window as any).fbq) { (window as any).fbq('track', 'InitiateCheckout'); } }}
              className="relative hidden md:flex items-center gap-2 text-white font-bold text-sm px-5 py-2 rounded-full transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1.5px solid rgba(255,255,255,0.4)',
              }}
            >
              <Zap className="w-4 h-4 fill-white" />
              COMPRAR AGORA
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white p-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-4 py-4 space-y-3"
            style={{ background: '#0090AE', borderColor: 'rgba(255,255,255,0.15)' }}
          >
            {['/', '#reviews', '#faq'].map((href, i) => {
              const labels = ['Produto', 'Avaliações', 'Dúvidas'];
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-white font-semibold py-2 border-b border-white/10"
                >
                  {labels[i]}
                </Link>
              );
            })}
            <a
              href="https://ggcheckout.com.br/checkout/v2/eFVZqmFdbzaoHss6XIfr"
              onClick={() => { setMobileOpen(false); if (typeof window !== 'undefined' && (window as any).fbq) { (window as any).fbq('track', 'InitiateCheckout'); } }}
              className="flex items-center justify-center gap-2 text-white font-bold py-3 rounded-full mt-2 relative"
              style={{ background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)' }}
            >
              <Zap className="w-4 h-4 fill-white" />
              COMPRAR AGORA
            </a>
          </div>
        )}
      </header>
    </>
  );
}
