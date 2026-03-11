import Link from 'next/link';
import { Snowflake, Mail, Phone, Instagram, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #0F3460 0%, #1A1A2E 100%)',
        color: 'white',
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,180,216,0.25)' }}
              >
                <Snowflake className="w-6 h-6" style={{ color: '#48CAE4' }} />
              </div>
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: "'Bricolage Grotesque', 'Poppins', sans-serif" }}
              >
                Geladeira<span style={{ color: '#48CAE4' }}>Kids</span>
                <span style={{ fontSize: '0.55em', verticalAlign: 'super', color: '#90E0EF' }}>™</span>
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              A loja oficial da Mini Geladeira viral do TikTok! Geladeira retro com luz UV, bolas surpresa
              e miniaturas colecionáveis para crianças.
            </p>

            {/* Contact */}
            <div className="space-y-2">
              <a
                href="mailto:contato@geladeirakinds.com.br"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4" style={{ color: '#00B4D8' }} />
                contato@geladeirakinds.com.br
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4" style={{ color: '#06D6A0' }} />
                (11) 9xxxx-xxxx
              </a>
              <a
                href="https://instagram.com/geladeirakinds"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Instagram className="w-4 h-4" style={{ color: '#FF6B6B' }} />
                @geladeirakinds
              </a>
            </div>
          </div>

          {/* Links column */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Produto
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Mini Geladeira Kids™', href: '/' },
                { label: 'Pack 2 Bolas Surpresa', href: '/checkout' },
                { label: 'Pack 5 Bolas Surpresa', href: '/checkout' },
                { label: 'Avaliações', href: '#reviews' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Suporte
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Política de Privacidade', href: '/privacidade' },
                { label: 'Termos de Uso', href: '/termos' },
                { label: 'Trocas e Devoluções', href: '/trocas' },
                { label: 'Rastrear Pedido', href: '/rastreamento' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div
          className="mt-12 pt-8 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Payments */}
            <div>
              <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider">
                Pagamentos aceitos
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Visa', 'Master', 'Amex', 'PIX', 'Boleto', 'Elo'].map((method) => (
                  <span
                    key={method}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Security badges */}
            <div className="flex items-center gap-3">
              {['🔒 SSL Seguro', '✅ Compra Garantida', '📦 CNPJ Verificado'].map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(6,214,160,0.15)',
                    border: '1px solid rgba(6,214,160,0.3)',
                    color: '#6EE7B7',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="py-4 text-center"
        style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-gray-500 text-xs">
          © 2026 GeladeiraKids™ — Todos os direitos reservados. CNPJ: XX.XXX.XXX/0001-XX
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Este site não é afiliado à ZURU. Mini Brands® é marca registrada da ZURU.
        </p>
      </div>
    </footer>
  );
}
