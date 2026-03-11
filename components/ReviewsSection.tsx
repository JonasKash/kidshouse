'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Check } from 'lucide-react';

const reviews = [
  {
    id: 1,
    nome: 'Camila R.',
    cidade: 'São Paulo, SP',
    estrelas: 5,
    data: '15 fev 2026',
    avatar: '👩',
    avatarBg: '#FFE0E9',
    titulo: 'Minha filha AMOU!',
    texto:
      'Chegou em 3 dias e a qualidade é incrível. A luz UV acende de verdade quando abre a portinha. Ela já pediu mais bolinhas surpresa. Vale cada centavo!',
    helpful: 24,
    verified: true,
    tags: ['Frete rápido', 'Ótima qualidade'],
  },
  {
    id: 2,
    nome: 'Rafael M.',
    cidade: 'Curitiba, PR',
    estrelas: 5,
    data: '2 mar 2026',
    avatar: '👨',
    avatarBg: '#E0F0FF',
    titulo: 'Presentou no aniversário e foi um sucesso',
    texto:
      'Comprei para o aniversário de 7 anos da minha sobrinha. Ela ficou fascinada com as miniaturas. O produto parece muito mais caro do que o preço que paguei!',
    helpful: 18,
    verified: true,
    tags: ['Presente perfeito', 'Excelente custo-benefício'],
  },
  {
    id: 3,
    nome: 'Mariana L.',
    cidade: 'Rio de Janeiro, RJ',
    estrelas: 5,
    data: '20 fev 2026',
    avatar: '👩',
    avatarBg: '#F0E0FF',
    titulo: 'Melhor presente do ano',
    texto:
      'Vi no TikTok e fui comprar. Qualidade impecável! A geladeirinha é linda e as bolinhas surpresa vieram com itens muito detalhados. Já estou querendo colecionar todos.',
    helpful: 31,
    verified: true,
    tags: ['TikTok', 'Colecionável'],
  },
  {
    id: 4,
    nome: 'Pedro H.',
    cidade: 'Belo Horizonte, MG',
    estrelas: 5,
    data: '28 fev 2026',
    avatar: '👨',
    avatarBg: '#E0FFE8',
    titulo: 'Produto viral que realmente vale a pena',
    texto:
      'Meu filho de 8 anos adora. A coleção de miniaturas é muito detalhada. Estamos juntando para completar todas as 60+ peças. Entrega super rápida!',
    helpful: 15,
    verified: true,
    tags: ['Entrega rápida', 'Vale a pena'],
  },
  {
    id: 5,
    nome: 'Juliana C.',
    cidade: 'Fortaleza, CE',
    estrelas: 4,
    data: '10 mar 2026',
    avatar: '👩',
    avatarBg: '#FFFBE0',
    titulo: 'Ótimo produto, entrega um pouco demorada',
    texto:
      'A geladeirinha é perfeita e minha filha adorou. A entrega demorou 6 dias mas chegou bem embalada. O produto em si é 5 estrelas sem dúvida!',
    helpful: 9,
    verified: true,
    tags: ['Boa embalagem'],
  },
  {
    id: 6,
    nome: 'Lucas S.',
    cidade: 'Porto Alegre, RS',
    estrelas: 5,
    data: '8 mar 2026',
    avatar: '👨',
    avatarBg: '#FFE8E0',
    titulo: 'Virou a brincadeira favorita da casa',
    texto:
      'Tanto eu quanto minha filha ficamos viciados em abrir as bolinhas. A geladeira tem espaço para todas as miniaturas e a luz UV é um charme à parte. Recomendo muito!',
    helpful: 22,
    verified: true,
    tags: ['Viciante', 'Luz UV incrível'],
  },
];

const ratingBars = [
  { stars: 5, pct: 89, color: '#FFB800' },
  { stars: 4, pct: 8, color: '#FFD53D' },
  { stars: 3, pct: 3, color: '#E5E7EB' },
  { stars: 2, pct: 0, color: '#E5E7EB' },
  { stars: 1, pct: 0, color: '#E5E7EB' },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="w-4 h-4"
          fill={s <= count ? '#FFB800' : '#E5E7EB'}
          stroke="none"
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [clicked, setClicked] = useState(false);

  return (
    <div className="review-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: review.avatarBg }}
          >
            {review.avatar}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{review.nome}</p>
            <p className="text-gray-500 text-xs">{review.cidade}</p>
          </div>
        </div>
        {review.verified && (
          <span
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}
          >
            <Check className="w-3 h-3" strokeWidth={3} />
            Verificado
          </span>
        )}
      </div>

      {/* Stars + title */}
      <div className="mb-2">
        <StarRow count={review.estrelas} />
        <h4 className="font-bold text-gray-900 mt-1.5">{review.titulo}</h4>
      </div>

      {/* Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-3">{review.texto}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {review.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            style={{ background: '#E0F7FA', color: '#0090AE' }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
        <span className="text-xs text-gray-400">{review.data}</span>
        <button
          onClick={() => {
            if (!clicked) {
              setHelpful((h) => h + 1);
              setClicked(true);
            }
          }}
          className="flex items-center gap-1.5 text-xs font-semibold transition-all"
          style={{ color: clicked ? '#059669' : '#9CA3AF' }}
        >
          <ThumbsUp className="w-3.5 h-3.5" fill={clicked ? '#059669' : 'none'} />
          Útil ({helpful})
        </button>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section id="reviews" className="py-16 md:py-24 section-alt">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
            style={{ background: 'rgba(0,180,216,0.12)', color: '#00B4D8' }}
          >
            Avaliações verificadas
          </span>
          <h2
            className="font-bold"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            }}
          >
            O que as famílias estão dizendo
          </h2>
        </div>

        {/* Summary card */}
        <div
          className="max-w-3xl mx-auto mb-12 p-8 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #F0FDFF 100%)',
            border: '1.5px solid #B2EBF2',
            boxShadow: '0 8px 30px rgba(0, 180, 216, 0.1)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Big rating */}
            <div className="text-center flex-shrink-0">
              <div
                className="font-black mb-1 leading-none"
                style={{
                  fontFamily: "'Bricolage Grotesque', 'Poppins', sans-serif",
                  fontSize: '5rem',
                  color: '#1A1A2E',
                }}
              >
                4.9
              </div>
              <div className="flex items-center gap-1 justify-center mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5" fill="#FFB800" stroke="none" />
                ))}
              </div>
              <p className="text-gray-500 text-sm font-medium">127 avaliações</p>
            </div>

            {/* Rating bars */}
            <div className="flex-1 w-full space-y-2.5">
              {ratingBars.map((bar) => (
                <div key={bar.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12 flex-shrink-0 justify-end">
                    <span className="text-sm font-bold text-gray-700">{bar.stars}</span>
                    <Star className="w-3.5 h-3.5" fill={bar.pct > 5 ? '#FFB800' : '#E5E7EB'} stroke="none" />
                  </div>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${bar.pct}%`, background: bar.pct > 5 ? '#FFB800' : '#E5E7EB' }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-8 flex-shrink-0">{bar.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {displayed.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Show more button */}
        {!showAll && reviews.length > 3 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
              style={{
                background: 'white',
                border: '2px solid #00B4D8',
                color: '#00B4D8',
                boxShadow: '0 2px 12px rgba(0, 180, 216, 0.15)',
              }}
            >
              Ver mais {reviews.length - 3} avaliações →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
