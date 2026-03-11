'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const images = [
  { src: '/Capa Principal 0.webp', alt: 'Mini Geladeira Kids™ — Foto Principal', emoji: '❄️' },
  { src: '/capa principal 01.jpeg', alt: 'Mini Geladeira Kids™ — Detalhes internos', emoji: '💡' },
  { src: '/capa principal 02.jpeg', alt: 'Mini Geladeira Kids™ — Organização', emoji: '🧒' },
  { src: '/capa principal 03.jpeg', alt: 'Mini Geladeira Kids™ — Brincadeira', emoji: '🎁' },
  { src: '/capa principal 04.webp', alt: 'Mini Geladeira Kids™ — Acessórios', emoji: '🥫' },
  { src: '/capa principal 05.jpeg', alt: 'Mini Geladeira Kids™ — Embalagem', emoji: '📦' },
];

// Placeholder SVG generator for missing images
function PlaceholderImage({ alt, emoji, index }: { alt: string; emoji: string; index: number }) {
  const colors = [
    ['#00B4D8', '#48CAE4'],
    ['#0096C7', '#00B4D8'],
    ['#48CAE4', '#90E0EF'],
    ['#023E8A', '#0077B6'],
    ['#0090AE', '#00B4D8'],
  ];
  const [from, to] = colors[index % colors.length];

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        minHeight: '100%',
      }}
    >
      <span style={{ fontSize: '3.5rem' }}>{emoji}</span>
      <p className="text-white/80 text-xs mt-3 px-4 text-center font-medium leading-tight max-w-[140px]">
        {alt}
      </p>
    </div>
  );
}

export default function ProductGallery() {
  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const prev = useCallback(() => setActive((a) => (a === 0 ? images.length - 1 : a - 1)), []);
  const next = useCallback(() => setActive((a) => (a === images.length - 1 ? 0 : a + 1)), []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative">
        <div
          ref={mainRef}
          className="relative rounded-2xl overflow-hidden cursor-zoom-in select-none"
          style={{
            aspectRatio: '1 / 1',
            background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
            boxShadow: '0 8px 40px rgba(0, 144, 174, 0.15)',
          }}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image */}
          <Image
            src={images[active].src}
            alt={images[active].alt}
            fill
            priority
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Zoom overlay */}
          {isZoomed && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-200"
              style={{
                backgroundImage: `url(${images[active].src})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '220%',
                backgroundRepeat: 'no-repeat',
                opacity: 0.9,
              }}
            />
          )}

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
            style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
            style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 glass rounded-full px-2.5 py-1 flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white/80 text-xs hidden sm:block">Zoom</span>
          </div>

          {/* Slide counter */}
          <div
            className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            {active + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex-shrink-0 w-[68px] h-[68px] rounded-xl overflow-hidden transition-all duration-200 hover:scale-105"
            style={{
              border: i === active ? '2.5px solid #00B4D8' : '2px solid transparent',
              boxShadow:
                i === active
                  ? '0 0 0 2px rgba(0,180,216,0.25)'
                  : '0 2px 8px rgba(0,0,0,0.08)',
              outline: 'none',
            }}
            aria-label={img.alt}
          >
          <div className="relative w-full h-full">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="68px"
            />
          </div>
          </button>
        ))}
      </div>

      {/* Dot indicators (mobile) */}
      <div className="flex justify-center gap-1.5 md:hidden">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? '24px' : '8px',
              height: '8px',
              background: i === active ? '#00B4D8' : '#CBD5E1',
            }}
            aria-label={`Ir para imagem ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
