import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import PurchaseNotification from '@/components/PurchaseNotification';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mini Geladeira Kids™ | Fill the Fridge Playset by ZURU | GeladeiraKids',
  description:
    'A Mini Geladeira viral que toda criança quer ter! Geladeira retro com luz UV, 2 bolas surpresa e mais de 60 miniaturas colecionáveis. Frete Grátis + Parcele em até 12x.',
  keywords: [
    'mini geladeira kids',
    'fill the fridge playset',
    'zuru mini brands',
    'geladeira brinquedo',
    'bolas surpresa',
    'miniaturas colecionáveis',
  ],
  openGraph: {
    title: 'Mini Geladeira Kids™ — A Geladeira Viral do TikTok!',
    description: 'Geladeira retro com luz UV + 2 bolas surpresa + 60+ miniaturas colecionáveis. Frete Grátis!',
    images: ['/images/og-image.jpg'],
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini Geladeira Kids™ — A Geladeira Viral do TikTok!',
    description: 'Geladeira retro com luz UV + 2 bolas surpresa + 60+ miniaturas colecionáveis.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtagId = process.env.NEXT_PUBLIC_GTAG_ID;
  const fbPixelId = '914964177968633';

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        {/* Facebook Pixel */}
        {fbPixelId && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=914964177968633&ev=PageView&noscript=1`}
          />
        </noscript>

        {/* Google Ads */}
        {gtagId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtagId}');
              `}
            </Script>
          </>
        )}

        {/* Mercado Pago SDK - Load early to avoid initialization issues */}
        <Script
          src="https://sdk.mercadopago.com/v2/mercadopago.js"
          strategy="beforeInteractive"
        />

        <CartProvider>
          {children}
          <PurchaseNotification />
        </CartProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Nunito, sans-serif',
              fontWeight: '600',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
            success: {
              style: {
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
              },
              iconTheme: { primary: '#06D6A0', secondary: 'white' },
            },
            error: {
              style: {
                background: '#FEF2F2',
                color: '#991B1B',
                border: '1px solid #FECACA',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
