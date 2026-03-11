export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args);
  }
}

export const pageview = () => {
  fbq('track', 'PageView');
};

export const viewContent = () => {
  fbq('track', 'ViewContent', {
    content_name: 'Mini Geladeira Kids™',
    content_ids: ['mini-geladeira-kids'],
    content_type: 'product',
    value: 149.0,
    currency: 'BRL',
  });
};

export const initiateCheckout = (total: number) => {
  fbq('track', 'InitiateCheckout', {
    value: total,
    currency: 'BRL',
    num_items: 1,
    content_ids: ['mini-geladeira-kids'],
    content_type: 'product',
  });
};

export const addPaymentInfo = () => {
  fbq('track', 'AddPaymentInfo');
};

export const purchase = (orderId: string, total: number) => {
  fbq('track', 'Purchase', {
    value: total,
    currency: 'BRL',
    content_ids: ['mini-geladeira-kids'],
    content_type: 'product',
    order_id: orderId,
  });
};
