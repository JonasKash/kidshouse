export const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

export const conversion = (transactionId: string, value: number) => {
  gtag('event', 'conversion', {
    send_to: process.env.NEXT_PUBLIC_GTAG_CONVERSION,
    value: value,
    currency: 'BRL',
    transaction_id: transactionId,
  });
};

export const addToCart = (value: number) => {
  gtag('event', 'add_to_cart', {
    currency: 'BRL',
    value: value,
    items: [
      {
        item_id: 'mini-geladeira-kids',
        item_name: 'Mini Geladeira Kids™ Fill the Fridge Playset',
        price: value,
        quantity: 1,
      },
    ],
  });
};

export const beginCheckout = (value: number) => {
  gtag('event', 'begin_checkout', {
    currency: 'BRL',
    value: value,
    items: [
      {
        item_id: 'mini-geladeira-kids',
        item_name: 'Mini Geladeira Kids™ Fill the Fridge Playset',
        price: value,
        quantity: 1,
      },
    ],
  });
};
