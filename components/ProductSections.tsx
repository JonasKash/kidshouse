'use client';

import { CheckCircle2, Check } from 'lucide-react';

/* ============================================================
   Shared helpers
   ============================================================ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
      style={{ background: 'rgba(0,180,216,0.12)', color: '#00B4D8' }}
    >
      {children}
    </span>
  );
}

function PlaceholderImg({
  emoji,
  gradient,
  height = 380,
  label,
}: {
  emoji: string;
  gradient: string;
  height?: number;
  label: string;
}) {
  return (
    <div
      className="rounded-3xl flex flex-col items-center justify-center w-full"
      style={{ background: gradient, minHeight: height, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
    >
      <span style={{ fontSize: '5rem' }}>{emoji}</span>
      <p className="text-white/80 font-semibold text-sm mt-3 text-center px-4">{label}</p>
    </div>
  );
}

/* ============================================================
   SECTION 1 — Headline Emocional
   ============================================================ */
function Section1() {
  return (
    <section className="py-16 md:py-24" style={{ background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <SectionLabel>Tendência viral</SectionLabel>
            <h2
              className="font-black mb-5 leading-tight"
              style={{
                fontFamily: "'Bricolage Grotesque', 'Poppins', sans-serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                color: '#1A1A2E',
              }}
            >
              🧊 A Mini Geladeira Viral
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #00B4D8, #06D6A0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                que toda criança quer ter!
              </span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Inspire-se na tendência do TikTok e crie sua própria coleção em miniatura. Abre as
              portinhas, acende a{' '}
              <strong style={{ color: '#00B4D8' }}>luz UV mágica</strong> e é só começar a encher com
              as bolinhas surpresa!
            </p>
            <div className="flex flex-wrap gap-3">
              {['#TikTokViral', '#MiniBrands', '#GeladeiraKids', '#Colecionável'].map((tag) => (
                <span
                  key={tag}
                  className="text-sm font-bold px-4 py-1.5 rounded-full"
                  style={{ background: '#E0F7FA', color: '#0090AE' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="animate-float">
            <PlaceholderImg
              emoji="🧊"
              gradient="linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)"
              label="Criança abrindo a geladeira com expressão animada"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 2 — Por que escolher
   ============================================================ */
const benefits = [
  'Geladeira retro azul com LUZ UV que acende ao abrir a porta',
  'Inclui 2 Bolas Surpresa com miniaturas exclusivas',
  'Mais de 60 miniaturas colecionáveis para completar',
  'Portas que abrem de verdade com prateleiras internas',
  'Perfeita para crianças a partir de 5 anos',
  'Ímã decorativo + colher de gelo inclusos',
  'Fenômeno viral nas redes sociais — esgota rápido!',
];

function Section2() {
  return (
    <section className="py-16 md:py-24 section-alt">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image first on mobile */}
          <div className="order-2 md:order-1">
            <PlaceholderImg
              emoji="⭐"
              gradient="linear-gradient(135deg, #0077B6 0%, #023E8A 100%)"
              label="Produto em destaque com fundo azul turquesa"
            />
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <SectionLabel>Diferenciais</SectionLabel>
            <h2
              className="font-bold mb-6 leading-tight"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              }}
            >
              Por que escolher a{' '}
              <span style={{ color: '#00B4D8' }}>Mini Geladeira Kids™?</span>
            </h2>
            <ul className="space-y-3">
              {benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-white hover:shadow-sm"
                >
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #06D6A0, #00B4D8)' }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 font-medium leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 3 — Banner full-width Bolas Surpresa
   ============================================================ */
const collectionIcons = [
  { icon: '✨', label: 'Colecionável' },
  { icon: '🎁', label: 'Surpresa' },
  { icon: '🧸', label: '+5 anos' },
  { icon: '♻️', label: 'Plástico reciclado' },
];

function Section3() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div
        className="relative mx-4 md:mx-auto max-w-6xl rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 40%, #00B4D8 100%)',
          boxShadow: '0 20px 60px rgba(0, 119, 182, 0.4)',
        }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        <div className="relative z-10 p-10 md:p-16 text-center">
          <span className="text-6xl md:text-7xl block mb-6">🔮</span>

          <h2
            className="text-white font-black mb-4 leading-tight"
            style={{
              fontFamily: "'Bricolage Grotesque', 'Poppins', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            }}
          >
            Bolas Surpresa
          </h2>
          <p
            className="font-bold mb-2 leading-tight"
            style={{
              color: '#90E0EF',
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            }}
          >
            Mais de 60 miniaturas
            <br />
            para colecionares
          </p>
          <p className="text-white/70 mb-10 max-w-md mx-auto text-base">
            Alimentos, bebidas, produtos de verdade em miniatura! Cada bolinha é uma surpresa!
          </p>

          {/* Icon grid */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {collectionIcons.map(({ icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 px-5 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-white font-bold text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 4 — Ideal para ocasiões
   ============================================================ */
const occasions = ['🎂 Aniversários', '🎄 Natal e Dia das Crianças', '🎁 Presente surpresa', '🌟 Colecionadores mirins'];

function Section4() {
  return (
    <section className="py-16 md:py-24 section-alt">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <SectionLabel>Presenteie com amor</SectionLabel>
            <h2
              className="font-bold mb-6 leading-tight"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              }}
            >
              🎁 Ideal para presentear
              <br />
              <span style={{ color: '#00B4D8' }}>em qualquer ocasião</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {occasions.map((occasion) => (
                <div
                  key={occasion}
                  className="flex items-center gap-3 p-4 rounded-2xl font-semibold text-gray-700 transition-all hover:scale-[1.02] cursor-default"
                  style={{
                    background: 'white',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    border: '1.5px solid #E5E7EB',
                  }}
                >
                  {occasion}
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-4">
              ✈️ Enviamos para todo o Brasil — entrega em 3 a 8 dias úteis
            </p>
          </div>

          {/* Image */}
          <div>
            <PlaceholderImg
              emoji="🎀"
              gradient="linear-gradient(135deg, #FF6B9D 0%, #FF8C42 100%)"
              label="Produto embalado para presente"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 5 — O que as famílias amam
   ============================================================ */
const familyPraises = [
  '"Minha filha não larga desde que chegou!"',
  '"Qualidade incrível, parece de loja!"',
  '"A luz UV faz toda a diferença na hora de abrir"',
  '"Já compramos 3 packs de bolinhas extras"',
];

function Section5() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div>
            <PlaceholderImg
              emoji="👧"
              gradient="linear-gradient(135deg, #48CAE4 0%, #00B4D8 100%)"
              label="Criança organizando miniaturas na geladeira"
            />
          </div>

          {/* Text */}
          <div>
            <SectionLabel>Depoimentos reais</SectionLabel>
            <h2
              className="font-bold mb-6 leading-tight"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              }}
            >
              👨‍👩‍👧‍👦 O que os pais{' '}
              <span style={{ color: '#00B4D8' }}>mais amam</span>
            </h2>
            <div className="space-y-3">
              {familyPraises.map((praise, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${'#E0F7FA'}${i % 2 ? '' : '80'}, #F0FDFF)`,
                    border: '1px solid #B2EBF2',
                  }}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">
                    {['💬', '⭐', '💡', '🛍️'][i]}
                  </span>
                  <p className="text-gray-700 font-medium italic">{praise}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 6 — Banner "É hora de brincar"
   ============================================================ */
function Section6() {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="relative rounded-3xl overflow-hidden text-center py-16 px-6"
          style={{
            background: 'linear-gradient(135deg, #90E0EF 0%, #48CAE4 40%, #00B4D8 100%)',
            boxShadow: '0 12px 40px rgba(0, 180, 216, 0.3)',
          }}
        >
          {/* Decorative circles */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${80 + i * 60}px`,
                height: `${80 + i * 60}px`,
                background: 'white',
                top: `${-20 + i * 15}%`,
                right: `${-5 + i * 8}%`,
              }}
            />
          ))}

          <p className="text-white/80 font-bold text-lg mb-2">🛒 Mini Mercado em Casa</p>
          <h2
            className="text-white font-black leading-tight"
            style={{
              fontFamily: "'Bricolage Grotesque', 'Poppins', sans-serif",
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              textShadow: '0 2px 20px rgba(0,0,0,0.15)',
            }}
          >
            É hora de brincar
            <br />
            de mini mercado! 🛒
          </h2>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 7 — Material seguro
   ============================================================ */
const materialFeatures = [
  { icon: '♻️', text: 'Plástico reciclado certificado pela ZURU' },
  { icon: '🛡️', text: 'Aprovado pelas normas de segurança infantil' },
  { icon: '❌', text: 'Sem BPA | Sem substâncias tóxicas' },
  { icon: '🌍', text: 'Produção sustentável e responsável' },
];

function Section7() {
  return (
    <section className="py-16 md:py-24 section-alt">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <SectionLabel>Segurança garantida</SectionLabel>
            <h2
              className="font-bold mb-6 leading-tight"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              }}
            >
              Material seguro
              <br />
              <span style={{ color: '#A855F7' }}>e certificado 🛡️</span>
            </h2>
            <div className="space-y-3">
              {materialFeatures.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl font-medium"
                  style={{
                    background: 'white',
                    border: '1.5px solid #EDE9FE',
                    boxShadow: '0 2px 8px rgba(168,85,247,0.06)',
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{f.icon}</span>
                  <span className="text-gray-700">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div>
            <PlaceholderImg
              emoji="🛡️"
              gradient="linear-gradient(135deg, #A855F7 0%, #EC4899 100%)"
              label="Certificado de segurança ZURU"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 8 — Especificações Técnicas
   ============================================================ */
const specs = [
  { label: 'Dimensões', value: '25cm × 10cm × 9cm' },
  { label: 'Bolas surpresa', value: '2 incluídas' },
  { label: 'Colecionáveis totais', value: '60+ miniaturas' },
  { label: 'Baterias', value: '3x LR44 (incluídas)' },
  { label: 'Idade recomendada', value: '+5 anos' },
  { label: 'Material', value: 'Plástico reciclado certificado' },
  { label: 'Marca', value: 'ZURU — Mini Brands®' },
  { label: 'Garantia', value: '90 dias (PROCON)' },
];

function Section8() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <SectionLabel>Especificações</SectionLabel>
          <h2
            className="font-bold mt-2"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            📋 Ficha Técnica do Produto
          </h2>
        </div>
        <div
          className="rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}
        >
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              className="flex items-center justify-between px-6 py-4"
              style={{
                background: i % 2 === 0 ? '#F8F9FF' : 'white',
                borderBottom: i < specs.length - 1 ? '1px solid #E5E7EB' : 'none',
              }}
            >
              <span className="font-semibold text-gray-600 text-sm">{spec.label}</span>
              <span className="font-bold text-gray-900 text-sm text-right max-w-[55%]">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Main export — All sections
   ============================================================ */
export default function ProductSections() {
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
    </>
  );
}
