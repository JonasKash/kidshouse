'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';
import Header from '@/components/Header';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import TrustBadges from '@/components/TrustBadges';
import ProductSections from '@/components/ProductSections';
import ReviewsSection from '@/components/ReviewsSection';
import StickyBuyBar from '@/components/StickyBuyBar';
import Footer from '@/components/Footer';
import { viewContent } from '@/lib/pixel';

export default function Home() {
  useEffect(() => {
    viewContent();
  }, []);

  return (
    <>
      <Header />

      <main>
        {/* Breadcrumb */}
        <div
          className="py-2.5 px-4"
          style={{ background: '#F8F9FF', borderBottom: '1px solid #E5E7EB' }}
        >
          <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-500 transition-colors">
              Início
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-gray-700">Mini Geladeira Kids™</span>
          </div>
        </div>

        {/* ======== HERO — Gallery + Product Info ======== */}
        <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">
            {/* Gallery */}
            <div className="md:sticky md:top-24">
              <ProductGallery />
            </div>

            {/* Info */}
            <div>
              <ProductInfo />
            </div>
          </div>
        </section>

        {/* ======== TRUST BADGES full ======== */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <TrustBadges />
        </section>

        {/* ======== PRODUCT DESCRIPTION SECTIONS ======== */}
        <ProductSections />

        {/* ======== RELATED PRODUCTS ======== */}
        <section className="py-16" style={{ background: '#F8F9FF' }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,180,216,0.12)', color: '#00B4D8' }}
              >
                Complete sua coleção
              </span>
              <h2
                className="font-bold"
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
              >
                Produtos Relacionados
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                { name: 'Pack 2 Bolas Surpresa', price: 49.9, emoji: '🎱', count: '2 bolas' },
                { name: 'Pack 5 Bolas Surpresa', price: 109.9, emoji: '🎯', count: '5 bolas', popular: true },
              ].map((product) => (
                <div
                  key={product.name}
                  className="relative bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                  style={{ border: '1.5px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                >
                  {product.popular && (
                    <div
                      className="absolute top-3 right-3 text-white text-xs font-black px-2.5 py-1 rounded-full z-10"
                      style={{ background: 'linear-gradient(135deg, #FF8C42, #FF6B6B)' }}
                    >
                      🔥 Popular
                    </div>
                  )}
                  <div
                    className="h-36 flex items-center justify-center text-6xl"
                    style={{ background: 'linear-gradient(135deg, #FFE0B2, #FFCC80)' }}
                  >
                    {product.emoji}
                  </div>
                  <div className="p-5">
                    <p className="font-bold text-gray-900 mb-1">{product.name}</p>
                    <p className="text-sm text-gray-500 mb-3">{product.count} — Mini Brands Fill the Fridge</p>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-black text-xl"
                        style={{ color: '#00B4D8', fontFamily: "'Poppins', sans-serif" }}
                      >
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      <Link
                        href="/checkout"
                        className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #06D6A0, #00B4D8)' }}
                      >
                        <Zap className="w-3 h-3 fill-white" />
                        Comprar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== REVIEWS ======== */}
        <ReviewsSection />

        {/* ======== FINAL CTA ======== */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0096C7 0%, #00B4D8 50%, #48CAE4 100%)' }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="relative z-10 text-center px-4">
            <div className="text-5xl mb-5 animate-bounce-gentle">🧊</div>
            <h2
              className="text-white font-black mb-4 leading-tight"
              style={{
                fontFamily: "'Bricolage Grotesque', 'Poppins', sans-serif",
                fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                textShadow: '0 2px 20px rgba(0,0,0,0.15)',
              }}
            >
              Garanta já a sua!
              <br />
              <span style={{ color: '#90E0EF' }}>Estoque limitado. 🔥</span>
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
              Frete Grátis + Parcelamento em até 12x sem juros
            </p>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-3 text-white font-black text-xl px-10 py-5 rounded-full transition-all hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2.5px solid rgba(255,255,255,0.5)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <Zap className="w-6 h-6 fill-white" />
              COMPRAR AGORA — R$ 149,00
            </Link>
            <p className="text-white/60 text-sm mt-4">
              ✅ 100% Seguro | ↩️ 7 dias para devolver | 🚚 Frete Grátis
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <StickyBuyBar />
    </>
  );
}
