'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

const locations = [
  'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Curitiba, PR',
  'Fortaleza, CE', 'Salvador, BA', 'Porto Alegre, RS', 'Manaus, AM',
  'Brasília, DF', 'Recife, PE', 'Goiânia, GO', 'Campinas, SP',
  'São Luís, MA', 'Maceió, AL', 'Natal, RN', 'Teresina, PI'
];

const names = [
  'Ana', 'Beatriz', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena',
  'Igor', 'Juliana', 'Kleber', 'Larissa', 'Marcelo', 'Natália', 'Otávio', 'Patrícia',
  'Ricardo', 'Sílvia', 'Tiago', 'Ursula', 'Vitor', 'Wanessa', 'Yago', 'Zilda'
];

const products = [
  'Mini Geladeira Kids™',
  'Pack 2 Bolas Surpresa',
  'Pack 5 Bolas Surpresa',
  'Combo Geladeira + Pack 5'
];

export default function PurchaseNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentData, setCurrentData] = useState({ name: '', location: '', product: '', time: '' });

  const generateRandomData = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const time = Math.floor(Math.random() * 55) + 5; // 5 to 60 minutes ago
    setCurrentData({ name, location, product, time: `${time} min` });
  };

  useEffect(() => {
    const triggerNotification = () => {
      generateRandomData();
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Initial delay
    const initialDelay = setTimeout(triggerNotification, 10000);

    // Loop interval
    const interval = setInterval(triggerNotification, 25000 + Math.random() * 10000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-4 bg-white p-4 rounded-2xl shadow-2xl border border-blue-50 max-w-[320px]"
          style={{
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          }}
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 leading-tight">
              {currentData.name} de {currentData.location}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Acabou de comprar <span className="text-blue-500 font-bold">{currentData.product}</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
              HÁ {currentData.time}
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 p-1 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
