# CLAUDE.md — Mini Geladeira Kids™ | Loja One-Product

> **Instruções completas para o Claude Code construir a loja do zero, fiel à referência brinquemais.com**

---

## 📦 VISÃO GERAL DO PROJETO

Criar uma loja e-commerce one-product para o **Mini Geladeira Kids™ (Mini Brands Fill the Fridge Playset by ZURU)**, espelhando fielmente a estrutura, layout, seções e experiência de compra do site de referência: `https://brinquemais.com/products/aquavision-kids`.

### Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Estilização**: Tailwind CSS + CSS Modules
- **Pagamento**: Mercado Pago SDK (Checkout Transparente — cartão, PIX, boleto)
- **Analytics**: Facebook Pixel + Google Ads Conversion Tracking
- **UI Icons**: Font Awesome 6
- **Animações**: CSS transitions nativas + Framer Motion
- **Reviews**: Sistema de reviews estático embutido (sem dependência externa)
- **Email**: Klaviyo (script embed, opcional)
- **CDN de imagens**: Cloudflare / Bunny CDN compatível

---

## 🏗️ ESTRUTURA DE ARQUIVOS

```
/
├── app/
│   ├── layout.tsx              # Layout global com pixels e scripts
│   ├── page.tsx                # Página do produto (rota principal /)
│   ├── checkout/
│   │   └── page.tsx            # Checkout transparente Mercado Pago
│   ├── sucesso/
│   │   └── page.tsx            # Página de confirmação de compra
│   └── api/
│       ├── criar-preferencia/
│       │   └── route.ts        # Cria preferência MP (Checkout Pro fallback)
│       ├── pagamento/
│       │   └── route.ts        # Processa pagamento transparente MP
│       └── webhook/
│           └── route.ts        # Recebe notificações do MP
├── components/
│   ├── Header.tsx
│   ├── ProductGallery.tsx
│   ├── ProductInfo.tsx
│   ├── TrustBadges.tsx
│   ├── ProductSections.tsx     # Seções de descrição (como na referência)
│   ├── ReviewsSection.tsx
│   ├── StickyBuyBar.tsx        # Barra flutuante de compra (mobile)
│   ├── checkout/
│   │   ├── CheckoutForm.tsx    # Formulário principal
│   │   ├── OrderBump.tsx       # Order bump da bolinha surpresa
│   │   ├── PaymentMethods.tsx  # Abas: Cartão / PIX / Boleto
│   │   ├── CardForm.tsx
│   │   ├── PixForm.tsx
│   │   └── BoletoForm.tsx
│   └── Footer.tsx
├── lib/
│   ├── mercadopago.ts          # Config e helpers do SDK MP
│   ├── pixel.ts                # Facebook Pixel helpers
│   └── gtag.ts                 # Google Ads helpers
├── public/
│   └── images/                 # Imagens do produto (instruções abaixo)
├── .env.local.example          # Template das variáveis de ambiente
└── next.config.js
```

---

## 🎨 IDENTIDADE VISUAL (baseada na referência)

### Paleta de Cores
```css
--color-primary: #00B4D8;        /* Azul turquesa (header, botões CTA) */
--color-primary-dark: #0090AE;   /* Hover dos botões */
--color-accent: #FF6B6B;         /* Badge de desconto, urgência */
--color-accent-green: #06D6A0;   /* Badges de confiança */
--color-text: #1A1A2E;           /* Texto principal */
--color-text-muted: #6C757D;     /* Texto secundário */
--color-bg: #FFFFFF;
--color-bg-light: #F8F9FF;       /* Fundo de seções alternadas */
--color-border: #E5E7EB;
--color-star: #FFB800;           /* Estrelas de review */
--color-sale-badge: #FF3B30;     /* "OFERTA" badge */
```

### Tipografia
```css
font-family: 'Nunito', 'Inter', sans-serif;  /* Principal — infantil/moderno */
font-family: 'Poppins', sans-serif;           /* Títulos de seção */
```
> Importar via Google Fonts no layout.tsx

### Logo
- Texto: **GeladeiraKids™** ou usar logo SVG personalizado
- Cor: branco sobre fundo turquesa (#00B4D8)
- Estilo: arredondado, amigável, infantil

---

## 📄 PÁGINA DO PRODUTO (`/`) — Estrutura Fiel à Referência

### 1. HEADER
```
[Logo GeladeiraKids™]    [Nav links]    [Ícone carrinho (0)]
```
- Fundo: #00B4D8 (turquesa)
- Texto branco
- Banner de topo: `🎉 FRETE GRÁTIS para todo Brasil + Parcelamento em até 12x!`
- Sticky no scroll

### 2. BREADCRUMB
```
Início > Mini Geladeira Kids™
```

### 3. GALERIA + INFO DO PRODUTO (layout 2 colunas em desktop)

**Coluna Esquerda — Galeria:**
- Imagem principal grande (600x600px)
- Thumbnails horizontais abaixo (8-10 imagens)
- Click na thumbnail troca imagem principal
- Zoom no hover (desktop)
- Swipe em mobile

**Coluna Direita — Info:**
```
Mini Geladeira Kids™ — Fill the Fridge Playset
⭐⭐⭐⭐⭐  4.9  (127 avaliações)

~~R$ 399,00~~   🏷️ R$ 249,00
Em até 12x de R$ 24,94 sem juros

[Seletor de variante: Azul / Rosa / Roxo]

[Botão COMPRAR AGORA — grande, verde/turquesa]
[Botão Adicionar ao Carrinho — outline]

✅ Frete Grátis  🔒 Compra 100% Segura  🚚 Envio em 24h
```

### 4. SEÇÕES DE DESCRIÇÃO (replicar exatamente o estilo da referência)

Cada seção alterna: texto à esquerda + imagem à direita (ou inverso)

---

#### SEÇÃO 1 — Headline Emocional
```
🧊 A Mini Geladeira Viral que toda criança quer ter!

Inspire-se na tendência do TikTok e crie sua própria coleção
em miniatura. Abre as portinhas, acende a luz UV e é só 
começar a encher com as bolinhas surpresa!
```
*(Imagem: criança abrindo a geladeira com expressão animada)*

---

#### SEÇÃO 2 — Por que escolher a Mini Geladeira Kids™?

**Bullets com ícones (replicar estilo da referência com checkmarks coloridos):**
```
✅ Geladeira retro azul com LUZ UV que acende ao abrir a porta
✅ Inclui 2 Bolas Surpresa com miniaturas exclusivas
✅ Mais de 60 miniaturas colecionáveis para completar
✅ Portas que abrem de verdade com prateleiras internas
✅ Perfeita para crianças a partir de 5 anos
✅ Ímã decorativo + colher de gelo inclusos
✅ Fenômeno viral nas redes sociais — esgota rápido!
```

*(Imagem: produto em destaque com fundo azul/turquesa)*

---

#### SEÇÃO 3 — Banner de Destaque (imagem full-width)
```
[Banner com texto sobreposto:]
"🔮 Bolas Surpresa"
"Mais de 60 miniaturas
para colecionares"
[Sub: Alimentos, bebidas, produtos de verdade em miniatura!]
[Ícones: ✨ Colecionável | 🎁 Surpresa | 🧸 +5 anos | ♻️ Plástico reciclado]
```

---

#### SEÇÃO 4 — Ideal para todas as ocasiões
```
🎁 Ideal para presentear em qualquer ocasião

✓ Aniversários
✓ Natal e Dia das Crianças
✓ Presente surpresa
✓ Colecionadores mirins
```
*(Imagem: produto embalado para presente)*

---

#### SEÇÃO 5 — O que as famílias mais amam
```
👨‍👩‍👧‍👦 O que os pais mais amam

• "Minha filha não larga desde que chegou!"
• "Qualidade incrível, parece de loja!"
• "A luz UV faz toda a diferença na hora de abrir"
• "Já compramos 3 packs de bolinhas extras"
```
*(Imagem: mão de criança organizando miniaturas na geladeira)*

---

#### SEÇÃO 6 — Banner "É hora de brincar"
```
[Banner full-width com fundo azul claro/piscina]
"É hora de brincar
de mini mercado! 🛒"
```

---

#### SEÇÃO 7 — Detalhes do material
```
[Banner com fundo rosa/roxo suave]
"Material seguro
e certificado 🛡️"

Plástico reciclado certificado pela ZURU
Aprovado pelas normas de segurança infantil
Sem BPA | Sem substâncias tóxicas
```

---

#### SEÇÃO 8 — Especificações Técnicas
```
📋 Ficha do Produto

| Especificação          | Detalhe                        |
|------------------------|--------------------------------|
| Dimensões              | 25cm × 10cm × 9cm              |
| Bolas surpresa         | 2 incluídas                    |
| Colecionáveis totais   | 60+ miniaturas                 |
| Baterias               | 3x LR44 (incluídas)            |
| Idade recomendada      | +5 anos                        |
| Material               | Plástico reciclado certificado |
| Marca                  | ZURU — Mini Brands             |
```

---

### 5. REVIEWS / AVALIAÇÕES

**Rating geral:**
```
⭐⭐⭐⭐⭐  4.9 / 5
127 avaliações verificadas

[Barra 5 estrelas] ███████████ 89%
[Barra 4 estrelas] ████        8%
[Barra 3 estrelas] ██          3%
```

**Reviews individuais (usar estes dados fixos — mínimo 6 reviews):**

```json
[
  {
    "nome": "Camila R.",
    "cidade": "São Paulo, SP",
    "estrelas": 5,
    "data": "15 fev 2026",
    "foto": "avatar-feminino-1",
    "titulo": "Minha filha AMOU!",
    "texto": "Chegou em 3 dias e a qualidade é incrível. A luz UV acende de verdade quando abre a portinha. Ela já pediu mais bolinhas surpresa. Vale cada centavo!"
  },
  {
    "nome": "Rafael M.",
    "cidade": "Curitiba, PR",
    "estrelas": 5,
    "data": "2 mar 2026",
    "foto": "avatar-masculino-1",
    "titulo": "Presentou no aniversário e foi um sucesso",
    "texto": "Comprei para o aniversário de 7 anos da minha sobrinha. Ela ficou fascinada com as miniaturas. O produto parece muito mais caro do que o preço que paguei!"
  },
  {
    "nome": "Mariana L.",
    "cidade": "Rio de Janeiro, RJ",
    "estrelas": 5,
    "data": "20 fev 2026",
    "foto": "avatar-feminino-2",
    "titulo": "Melhor presente do ano",
    "texto": "Vi no TikTok e fui comprar. Qualidade impecável! A geladeirinha é linda e as bolinhas surpresa vieram com itens muito detalhados. Já estou querendo colecionar todos."
  },
  {
    "nome": "Pedro H.",
    "cidade": "Belo Horizonte, MG",
    "estrelas": 5,
    "data": "28 fev 2026",
    "foto": "avatar-masculino-2",
    "titulo": "Produto viral que realmente vale a pena",
    "texto": "Meu filho de 8 anos adora. A coleção de miniaturas é muito detalhada. Estamos juntando para completar todas as 60+ peças. Entrega super rápida!"
  },
  {
    "nome": "Juliana C.",
    "cidade": "Fortaleza, CE",
    "estrelas": 4,
    "data": "10 mar 2026",
    "foto": "avatar-feminino-3",
    "titulo": "Ótimo produto, entrega um pouco demorada",
    "texto": "A geladeirinha é perfeita e minha filha adorou. A entrega demorou 6 dias mas chegou bem embalada. O produto em si é 5 estrelas sem dúvida!"
  },
  {
    "nome": "Lucas S.",
    "cidade": "Porto Alegre, RS",
    "estrelas": 5,
    "data": "8 mar 2026",
    "foto": "avatar-masculino-3",
    "titulo": "Virou a brincadeira favorita da casa",
    "texto": "Tanto eu quanto minha filha ficamos viciados em abrir as bolinhas. A geladeira tem espaço para todas as miniaturas e a luz UV é um charme à parte. Recomendo muito!"
  }
]
```

---

### 6. PRODUTOS RELACIONADOS (opcional, para aumentar AOV)
```
[Card: Pack 2 Bolas Surpresa]   [Card: Pack 5 Bolas Surpresa]
R$ 49,90                         R$ 109,90
```

---

### 7. FOOTER
```
[Logo] GeladeiraKids™

Atendimento: contato@geladeirakinds.com.br
WhatsApp: (11) 9xxxx-xxxx

Pagamentos aceitos: [Visa][Mastercard][Amex][PIX][Boleto]
Segurança: [SSL][Compra Segura]

© 2026 GeladeiraKids™ — Todos os direitos reservados
Política de Privacidade | Termos de Uso | Trocas e Devoluções
```

---

## 🛒 FLUXO DE COMPRA

```
[Página do Produto /]
        ↓
  Clica "COMPRAR AGORA"
        ↓
[Checkout Transparente /checkout]
  ├── Dados pessoais (nome, email, CPF, telefone)
  ├── Endereço de entrega
  ├── ORDER BUMP (bolinha surpresa) ← caixa destacada
  └── Método de pagamento
      ├── Cartão de crédito (tokenização MP)
      ├── PIX (QR Code gerado)
      └── Boleto Bancário
        ↓
  Confirmação de pagamento
        ↓
[Página de Sucesso /sucesso]
```

---

## 💳 CHECKOUT TRANSPARENTE — MERCADO PAGO

### Variáveis de Ambiente (.env.local)
```env
# Mercado Pago
MP_ACCESS_TOKEN=APP_USR-xxxx-xxxx-xxxx-xxxx    # Substituir pela chave real
MP_PUBLIC_KEY=APP_USR-xxxx-xxxx-xxxx            # Substituir pela chave pública
MP_WEBHOOK_SECRET=xxxx                           # Para validar webhooks

# Produto principal
PRODUCT_PRICE=249.00
PRODUCT_NAME=Mini Geladeira Kids™ Fill the Fridge Playset

# Order bump
ORDER_BUMP_PRICE=49.90
ORDER_BUMP_NAME=Pack 2 Bolas Surpresa Mini Brands

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXXXX       # Substituir pelo ID real

# Google Ads
NEXT_PUBLIC_GTAG_ID=AW-XXXXXXXXXX               # Substituir pelo ID real
NEXT_PUBLIC_GTAG_CONVERSION=AW-XXXXXXXXXX/XXXX # Substituir pelo label real

# URL do site
NEXT_PUBLIC_SITE_URL=https://www.geladeirakinds.com.br
```

### Implementação do SDK Mercado Pago

```typescript
// lib/mercadopago.ts
import MercadoPago from '@mercadopago/sdk-js';

// Server-side (API routes)
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

export const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const mpPayment = new Payment(mpConfig);
export const mpPreference = new Preference(mpConfig);
```

### API Route — Processar Pagamento (`/api/pagamento/route.ts`)

```typescript
// POST /api/pagamento
// Body: { token, paymentMethod, installments, issuer_id, payer, items, orderBump }
// Retorna: { status, payment_id, qr_code (PIX), barcode (boleto) }

export async function POST(req: Request) {
  const body = await req.json();
  
  const items = [
    {
      id: 'mini-geladeira-kids',
      title: process.env.PRODUCT_NAME,
      quantity: 1,
      unit_price: parseFloat(process.env.PRODUCT_PRICE!),
    }
  ];

  // Adiciona order bump se selecionado
  if (body.orderBump) {
    items.push({
      id: 'bolas-surpresa-pack-2',
      title: process.env.ORDER_BUMP_NAME,
      quantity: 1,
      unit_price: parseFloat(process.env.ORDER_BUMP_PRICE!),
    });
  }

  const payment = await mpPayment.create({
    body: {
      token: body.token,          // Token do cartão (gerado pelo SDK JS no frontend)
      installments: body.installments,
      payment_method_id: body.paymentMethod, // 'visa', 'master', 'pix', 'bolbradesco'
      issuer_id: body.issuer_id,
      payer: {
        email: body.payer.email,
        identification: {
          type: 'CPF',
          number: body.payer.cpf,
        },
        first_name: body.payer.firstName,
        last_name: body.payer.lastName,
      },
      transaction_amount: items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),
      description: 'Mini Geladeira Kids™ — GeladeiraKids',
      metadata: { items },
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
    }
  });

  return Response.json({ 
    status: payment.status,
    payment_id: payment.id,
    // PIX
    qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
    qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
    // Boleto
    barcode: payment.barcode?.content,
    external_resource_url: payment.transaction_details?.external_resource_url,
  });
}
```

### Formulário de Pagamento — Frontend

**Fluxo do cartão:**
1. Importar MercadoPago.js via script no head: `https://sdk.mercadopago.com/v2/security.js`
2. Inicializar com `PUBLIC_KEY`
3. Criar `CardForm` usando `mp.cardForm()`
4. No submit, obter token e enviar para `/api/pagamento`

```typescript
// components/checkout/CardForm.tsx
'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window { MercadoPago: any; }
}

export default function CardForm({ onToken }: { onToken: (data: any) => void }) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, {
      locale: 'pt-BR',
    });

    const cardForm = mp.cardForm({
      amount: String(/* total amount */),
      iframe: true,
      form: {
        id: 'card-form',
        cardNumber: { id: 'card-number', placeholder: 'Número do cartão' },
        expirationDate: { id: 'expiration-date', placeholder: 'MM/AA' },
        securityCode: { id: 'security-code', placeholder: 'CVV' },
        cardholderName: { id: 'cardholder-name', placeholder: 'Nome no cartão' },
        issuer: { id: 'issuer' },
        installments: { id: 'installments' },
        identificationType: { id: 'identification-type' },
        identificationNumber: { id: 'identification-number', placeholder: 'CPF' },
        cardholderEmail: { id: 'cardholder-email', placeholder: 'E-mail' },
      },
      callbacks: {
        onFormMounted: (error: any) => { if (error) console.error(error); },
        onSubmit: async (event: any) => {
          event.preventDefault();
          const { token, installments, paymentMethodId, issuerId } = cardForm.getCardFormData();
          onToken({ token, installments, paymentMethodId, issuerId });
        },
      },
    });

    return () => cardForm.unmount();
  }, []);

  return (
    <form id="card-form" ref={formRef}>
      <div id="card-number" className="mp-field" />
      <div id="expiration-date" className="mp-field" />
      <div id="security-code" className="mp-field" />
      <input type="text" id="cardholder-name" placeholder="Nome no cartão" />
      <select id="issuer" />
      <select id="installments" />
      <select id="identification-type" />
      <input type="text" id="identification-number" placeholder="CPF" />
      <input type="email" id="cardholder-email" placeholder="E-mail" />
    </form>
  );
}
```

---

## 🎯 ORDER BUMP — Bolas Surpresa Mini Brands

O order bump é exibido **dentro da página de checkout**, logo acima da área de pagamento.

### Design do Order Bump
```
╔══════════════════════════════════════════════════════╗
║  🎁 OFERTA ESPECIAL — Adicione com 1 clique!        ║
║                                                      ║
║  [Imagem produto]  Pack 2 Bolas Surpresa            ║
║                    Mini Brands Fill the Fridge       ║
║                                                      ║
║                    ~~R$ 79,90~~  R$ 49,90           ║
║                    37% OFF — Só aqui no checkout!   ║
║                                                      ║
║  [✅ CHECKBOX] Sim! Quero adicionar as bolinhas      ║
║               surpresa por apenas R$ 49,90          ║
╚══════════════════════════════════════════════════════╝
```

**Comportamento:**
- Checkbox desmarcado por padrão
- Ao marcar: atualizar total visivelmente com animação
- Cor do border: `#FFB800` (amarelo ouro) + fundo `#FFFBEA`
- Badge "MAIS VENDIDO" no canto superior direito

**Produto do Order Bump — Bolas Surpresa:**
- Nome: Pack 2 Bolas Surpresa Mini Brands
- Preço de: R$ 79,90 → Por: R$ 49,90
- Descrição: "Cada bolinha revela 1 miniatura surpresa para encher sua geladeirinha! São mais de 60 itens diferentes para colecionar."
- Imagem: bolinha colorida laranja/azul com logo Mini Brands

---

## 📊 ANALYTICS & PIXELS

### Facebook Pixel (`lib/pixel.ts`)

```typescript
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export const pageview = () => {
  (window as any).fbq('track', 'PageView');
};

export const viewContent = () => {
  (window as any).fbq('track', 'ViewContent', {
    content_name: 'Mini Geladeira Kids™',
    content_ids: ['mini-geladeira-kids'],
    content_type: 'product',
    value: 249.00,
    currency: 'BRL',
  });
};

export const initiateCheckout = (total: number) => {
  (window as any).fbq('track', 'InitiateCheckout', {
    value: total,
    currency: 'BRL',
    num_items: 1,
  });
};

export const addPaymentInfo = () => {
  (window as any).fbq('track', 'AddPaymentInfo');
};

export const purchase = (orderId: string, total: number) => {
  (window as any).fbq('track', 'Purchase', {
    value: total,
    currency: 'BRL',
    content_ids: ['mini-geladeira-kids'],
    content_type: 'product',
    order_id: orderId,
  });
};
```

### Google Ads (`lib/gtag.ts`)

```typescript
export const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;

export const conversion = (transactionId: string, value: number) => {
  (window as any).gtag('event', 'conversion', {
    send_to: process.env.NEXT_PUBLIC_GTAG_CONVERSION,
    value: value,
    currency: 'BRL',
    transaction_id: transactionId,
  });
};
```

### Eventos por Rota

| Rota         | Eventos disparados                                  |
|-------------|-----------------------------------------------------|
| `/`          | PageView, ViewContent                               |
| `/checkout`  | InitiateCheckout, AddPaymentInfo (ao preencher)     |
| `/sucesso`   | Purchase (FB), conversion (Google Ads)             |

### Implementação no Layout (`app/layout.tsx`)

```tsx
// Adicionar no <head>:
<Script id="fb-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s){...}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `}
</Script>

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTAG_ID}`}
  strategy="afterInteractive"
/>
<Script id="gtag-init" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GTAG_ID}');
  `}
</Script>
```

---

## 🔔 WEBHOOK MERCADO PAGO (`/api/webhook/route.ts`)

```typescript
export async function POST(req: Request) {
  const body = await req.json();
  
  // Validar assinatura do webhook (header x-signature)
  // ...

  if (body.type === 'payment') {
    const paymentId = body.data.id;
    const payment = await mpPayment.get({ id: paymentId });
    
    switch (payment.status) {
      case 'approved':
        // Disparar email de confirmação
        // Atualizar banco de dados de pedidos
        // Disparar evento de conversão server-side
        break;
      case 'pending':
        // Aguardando pagamento (boleto/PIX)
        break;
      case 'rejected':
        // Notificar usuário
        break;
    }
  }

  return Response.json({ received: true });
}
```

---

## 🚀 PÁGINA DE SUCESSO (`/sucesso`)

```tsx
// Recebe: ?payment_id=xxx&status=approved&method=pix

// Conteúdo baseado no método de pagamento:

// CARTÃO APROVADO:
"🎉 Pedido confirmado! Seu pagamento foi aprovado.
Você receberá um e-mail de confirmação em breve.
Previsão de entrega: 5 a 8 dias úteis."

// PIX PENDENTE:
"⏳ Escaneie o QR Code abaixo para pagar
[QR Code gerado pelo MP]
[Código PIX para copiar]
Válido por 30 minutos"

// BOLETO:
"📄 Boleto gerado com sucesso!
[Botão: Imprimir Boleto]
[Código de barras]
Vencimento: próximo dia útil"
```

---

## 📱 RESPONSIVIDADE

### Breakpoints
```css
mobile: < 768px
tablet: 768px - 1024px
desktop: > 1024px
```

### Comportamentos Mobile
- Galeria: carrossel swipeable
- Layout produto: coluna única (galeria → info)
- Sticky bar de compra (fixa na parte inferior): `[Comprar R$ 249,00]`
- Checkout: formulário em coluna única
- Order bump: card full-width com checkbox

---

## 🏷️ TRUST BADGES (exibir abaixo do botão de compra)

```
[🔒 Compra Segura] [🚚 Frete Grátis] [↩️ 7 dias p/ trocar] [📦 Envio em 24h]
```

---

## ⚡ STICKY BUY BAR (mobile)

Aparece após rolar 300px da página:
```
[Foto produto miniatura] Mini Geladeira Kids™  [COMPRAR R$249 →]
```
Fundo branco, sombra top, z-index: 50

---

## 🖼️ IMAGENS DO PRODUTO

> **Instruções para o desenvolvedor**: Todas as imagens devem ser adicionadas em `/public/images/produto/`.

**Imagens necessárias para a galeria (buscar/gerar imagens referentes ao produto Mini Brands Fill the Fridge):**

```
produto-01.jpg — Vista frontal da geladeira fechada (cor azul)
produto-02.jpg — Geladeira aberta com luz UV acesa
produto-03.jpg — Mão de criança segurando produto
produto-04.jpg — Bolas surpresa ao lado da geladeira
produto-05.jpg — Miniaturas dentro da geladeira organizadas
produto-06.jpg — Close nas portas abertas com prateleiras
produto-07.jpg — Produto embalado (caixa)
produto-08.jpg — Lifestyle: criança brincando
produto-09.jpg — Infográfico: "Mais de 60 miniaturas!"
produto-10.jpg — Comparativo de tamanho / escala
```

**Order bump:**
```
bolinha-surpresa.jpg — Pack 2 bolas surpresa laranja/azul
```

**Placeholders temporários:**
Use imagens de placeholder coloridas em tons turquesa/azul com o produto descrito em texto, até as imagens reais serem fornecidas.

---

## 🗺️ ROTAS DO SITE (para configuração de pixel)

| Rota          | Descrição                  | Pixel Event               |
|--------------|----------------------------|---------------------------|
| `/`           | Página do produto          | ViewContent               |
| `/checkout`   | Checkout transparente MP   | InitiateCheckout          |
| `/sucesso`    | Confirmação de pagamento   | Purchase                  |
| `/api/pagamento` | API de pagamento        | (server-side)             |
| `/api/webhook`   | Webhook Mercado Pago    | (server-side)             |

---

## 📦 DEPENDÊNCIAS (package.json)

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "18.x",
    "react-dom": "18.x",
    "mercadopago": "^2.x",
    "@mercadopago/sdk-js": "^2.x",
    "tailwindcss": "^3.x",
    "framer-motion": "^11.x",
    "react-hot-toast": "^2.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "lucide-react": "^0.383.x"
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Página do Produto
- [ ] Header sticky com logo e banner de oferta
- [ ] Galeria com thumbnails e troca de imagem
- [ ] Info do produto: preço riscado + preço promocional
- [ ] Parcelamento "12x de R$ 24,94"
- [ ] Botão "COMPRAR AGORA" redireciona para `/checkout`
- [ ] 8 seções de descrição com alternância texto/imagem
- [ ] Trust badges abaixo do CTA
- [ ] Reviews section com 4.9 estrelas e 6+ reviews
- [ ] Sticky buy bar no mobile
- [ ] Footer completo

### Checkout
- [ ] Formulário de dados pessoais (nome, email, CPF, telefone)
- [ ] Formulário de endereço (CEP com autocomplete via ViaCEP)
- [ ] Order bump visual destacado com checkbox
- [ ] Aba Cartão de Crédito com SDK MP
- [ ] Aba PIX com geração de QR Code
- [ ] Aba Boleto com geração de código
- [ ] Resumo do pedido (sidebar)
- [ ] Total atualiza quando order bump é marcado
- [ ] Badges de segurança SSL

### Integração MP
- [ ] API route `/api/pagamento` implementada
- [ ] API route `/api/webhook` implementada
- [ ] Variáveis de ambiente documentadas
- [ ] Tratamento de erros com mensagens amigáveis
- [ ] Loading states durante processamento

### Analytics
- [ ] FB Pixel no layout
- [ ] Google Ads gtag no layout
- [ ] Evento ViewContent na página do produto
- [ ] Evento InitiateCheckout ao entrar no checkout
- [ ] Evento Purchase na página de sucesso

---

## 🔑 ONDE INSERIR AS CREDENCIAIS

1. Copie `.env.local.example` para `.env.local`
2. Preencha:
   - `MP_ACCESS_TOKEN` — no painel Mercado Pago → Credenciais
   - `MP_PUBLIC_KEY` — no painel Mercado Pago → Credenciais  
   - `NEXT_PUBLIC_FB_PIXEL_ID` — no Gerenciador de Eventos do Facebook
   - `NEXT_PUBLIC_GTAG_ID` — no Google Ads → Ferramentas → Configurações de conversão
   - `NEXT_PUBLIC_GTAG_CONVERSION` — label da conversão de compra no Google Ads

---

## 🎯 OBSERVAÇÕES FINAIS

1. **Nenhum link externo de produto** é usado no site. Todos os dados de produto são hardcoded.
2. **Sem dependência de Shopify** — loja totalmente custom com Next.js.
3. **Checkout na mesma origem** — o usuário nunca sai do domínio durante a compra.
4. **PIX e Boleto** ficam na página de sucesso com as informações de pagamento.
5. **Segurança**: nunca expor `MP_ACCESS_TOKEN` no frontend — apenas no server.
6. **CEP autocomplete**: usar API gratuita ViaCEP `https://viacep.com.br/ws/{cep}/json/`
7. **Parcelamento**: calcular dinamicamente com SDK MP (`mp.getInstallments()`) para mostrar parcelas reais sem juros para o comprador.
