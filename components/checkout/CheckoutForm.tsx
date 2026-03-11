'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { User, MapPin, CreditCard, ChevronRight, Loader2, Search } from 'lucide-react';
import OrderBump from './OrderBump';
import PaymentMethods from './PaymentMethods';
import { initiateCheckout, addPaymentInfo } from '@/lib/pixel';
import { beginCheckout } from '@/lib/gtag';
import { useCart } from '@/context/CartContext';

/* ============================================================
   CPF Helpers
   ============================================================ */
const validateCPF = (cpf: string) => {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11 || !!digits.match(/(\d)\1{10}/)) return false;
  
  const calc = (n: number) => {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += parseInt(digits[i]) * (n + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  
  return calc(9) === parseInt(digits[9]) && calc(10) === parseInt(digits[10]);
};

const formatCPF = (v: string) => {
  v = v.replace(/\D/g, '');
  if (v.length <= 3) return v;
  if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
  if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
  return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9, 11)}`;
};

const formatPhone = (v: string) => {
  v = v.replace(/\D/g, '');
  if (v.length <= 2) return v;
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
};

/* ============================================================
   Validation schema — uses refine() so formatted masks don't fail
   ============================================================ */
const schema = z.object({
  firstName: z.string().min(2, 'Nome muito curto'),
  lastName: z.string().min(2, 'Sobrenome muito curto'),
  email: z.string().email('E-mail inválido'),
  cpf: z
    .string()
    .min(1, 'CPF obrigatório')
    .refine((v) => validateCPF(v), 'CPF inválido'),
  phone: z
    .string()
    .min(1, 'Telefone obrigatório')
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Telefone inválido'),
  cep: z
    .string()
    .min(1, 'CEP obrigatório')
    .refine((v) => v.replace(/\D/g, '').length === 8, 'CEP deve ter 8 dígitos'),
  street: z.string().min(3, 'Endereço obrigatório'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z
    .string()
    .min(2, 'Estado obrigatório (ex: SP)')
    .max(2, 'Estado inválido (ex: SP)'),
});

type FormData = z.infer<typeof schema>;

/* ============================================================
   Input component
   — extrai onFocus/onBlur do register para não sobrescrevê-los
   ============================================================ */

const FormInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }
>(({ label, error, className = '', onFocus: outerOnFocus, onBlur: outerOnBlur, ...props }, ref) => {
  return (
    <div className={className}>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>
      <input
        {...props}
        ref={ref}
        className="w-full h-12 px-4 border-[1.5px] rounded-xl font-sans text-base outline-none transition-all bg-white"
        style={{
          borderColor: error ? '#EF4444' : '#E5E7EB',
          boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
          fontFamily: 'Nunito, sans-serif',
        }}
        onFocus={(e) => {
          outerOnFocus?.(e);
          if (!error) (e.target as HTMLInputElement).style.borderColor = '#00B4D8';
          if (!error) (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(0,180,216,0.12)';
        }}
        onBlur={(e) => {
          outerOnBlur?.(e); // chama o onBlur do react-hook-form (validação)
          if (!error) (e.target as HTMLInputElement).style.borderColor = '#E5E7EB';
          if (!error) (e.target as HTMLInputElement).style.boxShadow = 'none';
        }}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
});

FormInput.displayName = 'FormInput';

/* ============================================================
   Step indicator
   ============================================================ */
function Steps({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Dados', icon: <User className="w-3.5 h-3.5" /> },
    { n: 2, label: 'Endereço', icon: <MapPin className="w-3.5 h-3.5" /> },
    { n: 3, label: 'Pagamento', icon: <CreditCard className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center gap-2 flex-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              background:
                current >= step.n
                  ? 'linear-gradient(135deg, #06D6A0, #00B4D8)'
                  : '#F3F4F6',
              color: current >= step.n ? 'white' : '#9CA3AF',
              boxShadow: current === step.n ? '0 4px 12px rgba(0,180,216,0.35)' : 'none',
            }}
          >
            {current > step.n ? '✓' : step.icon}
          </div>
          <span
            className="text-xs font-bold truncate"
            style={{ color: current >= step.n ? '#0090AE' : '#9CA3AF' }}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-0.5 rounded-full transition-all duration-500"
              style={{ background: current > step.n ? '#00B4D8' : '#E5E7EB' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Main CheckoutForm
   ============================================================ */
export default function CheckoutForm({ 
  mpPublicKey = '',
  orderBump,
  setOrderBump
}: { 
  mpPublicKey?: string;
  orderBump: boolean;
  setOrderBump: (v: boolean) => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cepLoading, setCepLoading] = useState(false);

  const { cartItems, total: cartTotal } = useCart();

  const basePrice = 149.0;
  const bumpPrice = 49.9;
  
  const total = basePrice + (orderBump ? bumpPrice : 0) + cartTotal;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched', // mostra erros ao sair do campo, não só no submit
  });

  const watchedValues = watch(['email', 'cpf', 'firstName', 'lastName']);
  const payerData = {
    email: watchedValues[0] || '',
    cpf: (watchedValues[1] || '').replace(/\D/g, ''),
    firstName: watchedValues[2] || '',
    lastName: watchedValues[3] || '',
  };

  // Fire analytics on mount
  useEffect(() => {
    initiateCheckout(basePrice);
    beginCheckout(basePrice);
  }, [basePrice]);

  // CEP autocomplete
  const handleCepBlur = async (cep: string) => {
    const raw = cep.replace(/\D/g, '');
    if (raw.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setValue('street', data.logradouro || '');
        setValue('neighborhood', data.bairro || '');
        setValue('city', data.localidade || '');
        setValue('state', data.uf || '');
      }
    } catch {
      /* ignore */
    } finally {
      setCepLoading(false);
    }
  };

  const goToStep2 = async () => {
    const ok = await trigger(['firstName', 'lastName', 'email', 'cpf', 'phone']);
    if (ok) setStep(2);
  };

  const goToStep3 = async () => {
    const ok = await trigger(['cep', 'street', 'number', 'neighborhood', 'city', 'state']);
    if (ok) {
      setStep(3);
      addPaymentInfo();
    }
  };

  const handlePaymentSuccess = useCallback((data: { paymentId: string; method: string; status: string; qrCode?: string; qrCodeBase64?: string; barcode?: string; boletoUrl?: string }) => {
    const params = new URLSearchParams({
      payment_id: data.paymentId,
      status: data.status,
      method: data.method,
      total: total.toFixed(2),
      ...(data.qrCode && { qr_code: data.qrCode }),
      ...(data.qrCodeBase64 && { qr_base64: data.qrCodeBase64 }),
      ...(data.barcode && { barcode: data.barcode }),
      ...(data.boletoUrl && { boleto_url: data.boletoUrl }),
    });
    router.push(`/obrigado?${params.toString()}`);
  }, [router, total]);

  return (
    <div className="max-w-xl mx-auto">
      {/* Steps */}
      <Steps current={step} />

      {/* STEP 1 — Personal data */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="font-bold text-xl text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Dados Pessoais
            </h2>
            <p className="text-gray-500 text-sm">Informe seus dados para a compra</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Nome"
              placeholder="João"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <FormInput
              label="Sobrenome"
              placeholder="Silva"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <FormInput
            label="E-mail"
            type="email"
            placeholder="joao@email.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="CPF"
              placeholder="000.000.000-00"
              maxLength={14}
              {...register('cpf', {
                onChange: (e) => {
                  e.target.value = formatCPF(e.target.value);
                },
              })}
              error={errors.cpf?.message}
            />
            <FormInput
              label="Telefone"
              type="tel"
              placeholder="(11) 90000-0000"
              maxLength={15}
              {...register('phone', {
                onChange: (e) => {
                  e.target.value = formatPhone(e.target.value);
                },
              })}
              error={errors.phone?.message}
            />
          </div>

          <button
            onClick={goToStep2}
            className="w-full h-13 py-3.5 text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
            style={{
              background: 'linear-gradient(135deg, #06D6A0, #00B4D8)',
              boxShadow: '0 8px 30px rgba(0,180,216,0.4)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Continuar <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 2 — Address */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="font-bold text-xl text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Endereço de Entrega
            </h2>
            <p className="text-gray-500 text-sm">Digite seu CEP para autocompletar</p>
          </div>

          {/* CEP with loader */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">CEP</label>
            <div className="relative">
              <input
                {...register('cep', {
                  onBlur: (e) => handleCepBlur(e.target.value), // autocomplete sem sobrescrever o RHF onBlur
                })}
                placeholder="00000-000"
                maxLength={9}
                className="w-full h-12 px-4 pr-12 border-[1.5px] rounded-xl font-sans text-base outline-none transition-all bg-white"
                style={{ borderColor: errors.cep ? '#EF4444' : '#E5E7EB', fontFamily: 'Nunito, sans-serif' }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {cepLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <Search className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            {errors.cep && <p className="text-red-500 text-xs mt-1 font-medium">{errors.cep.message}</p>}
          </div>

          <FormInput
            label="Logradouro"
            placeholder="Rua, Avenida..."
            {...register('street')}
            error={errors.street?.message}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Número"
              placeholder="123"
              {...register('number')}
              error={errors.number?.message}
            />
            <FormInput
              label="Complemento"
              placeholder="Apto, Bl..."
              {...register('complement')}
            />
          </div>

          <FormInput
            label="Bairro"
            placeholder="Centro"
            {...register('neighborhood')}
            error={errors.neighborhood?.message}
          />

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <FormInput
                label="Cidade"
                placeholder="São Paulo"
                {...register('city')}
                error={errors.city?.message}
              />
            </div>
            <FormInput
              label="Estado"
              placeholder="SP"
              maxLength={2}
              {...register('state')}
              error={errors.state?.message}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 h-12 font-bold text-sm rounded-2xl border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: '#E5E7EB', color: '#6C757D' }}
            >
              ← Voltar
            </button>
            <button
              onClick={goToStep3}
              className="flex-[2] h-12 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
              style={{
                background: 'linear-gradient(135deg, #06D6A0, #00B4D8)',
                boxShadow: '0 8px 30px rgba(0,180,216,0.4)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Ir para Pagamento <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Payment */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-xl text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Pagamento
            </h2>
            <p className="text-gray-500 text-sm">Escolha sua forma de pagamento</p>
          </div>

          {/* Order bump */}
          <OrderBump checked={orderBump} onChange={setOrderBump} />

          {/* Total summary */}
          <div
            className="p-4 rounded-2xl"
            style={{ background: '#F0FDFF', border: '1.5px solid #B2EBF2' }}
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Mini Geladeira Kids™</span>
                <span className="font-semibold">R$ 149,00</span>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-1">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-white shadow-sm flex items-center justify-center">
                    {item.name.includes('2') ? (
                       <img src="/DM_20260311022954_001.webp" alt="P2" className="w-full h-full object-cover" />
                    ) : item.name.includes('5') ? (
                       <img src="/DM_20260311023339_001.webp" alt="P5" className="w-full h-full object-cover" />
                    ) : (
                       <span className="text-xs">{item.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 flex justify-between text-gray-600">
                    <span>{item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}</span>
                    <span className="font-semibold">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              ))}
              {orderBump && (
                <div className="flex justify-between text-gray-600">
                  <span>Pack 2 Bolas Surpresa (Oferta)</span>
                  <span className="font-semibold">R$ 49,90</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span className="font-semibold text-green-600">Grátis 🎉</span>
              </div>
              <div
                className="flex justify-between font-black text-base pt-2"
                style={{ borderTop: '1px solid #B2EBF2', color: '#0090AE', fontFamily: "'Poppins', sans-serif" }}
              >
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <PaymentMethods
            total={total}
            orderBump={orderBump}
            cartItems={cartItems}
            payerData={payerData}
            mpPublicKey={mpPublicKey}
            onSuccess={handlePaymentSuccess}
          />

          <button
            onClick={() => setStep(2)}
            className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Voltar para endereço
          </button>
        </div>
      )}
    </div>
  );
}
