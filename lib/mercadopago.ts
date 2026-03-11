import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

export const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: {
    timeout: 20000,
  },
});

export const mpPayment = new Payment(mpConfig);
export const mpPreference = new Preference(mpConfig);

export const PRODUCT = {
  id: 'mini-geladeira-kids',
  name: process.env.PRODUCT_NAME || 'Mini Geladeira Kids™ Fill the Fridge Playset',
  price: parseFloat(process.env.PRODUCT_PRICE || '149.00'),
};

export const ORDER_BUMP = {
  id: 'bolas-surpresa-pack-2',
  name: process.env.ORDER_BUMP_NAME || 'Pack 2 Bolas Surpresa Mini Brands',
  price: parseFloat(process.env.ORDER_BUMP_PRICE || '49.90'),
};
