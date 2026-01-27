'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

interface Shop {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  logo?: string;
  category?: string;
  status?: string;
}

export default function PartnerLogos() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const data = await api.getShops({ status: 'ACTIVE', limit: 100 });
      // Filtrer pour ne montrer que les boutiques actives avec un logo
      const shopsWithLogos = (data?.data || data || []).filter(
        (shop: any) => (shop.status === 'ACTIVE' || shop.status === 'APPROVED') && shop.logo
      );
      setShops(shopsWithLogos || []);
    } catch (error) {
      console.error('Erreur chargement boutiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || shops.length === 0) return null;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://72.62.71.97:3001';

  return (
    <section className="py-16 bg-white border-y border-pink-50 overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <h2 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
          Nos Boutiques
        </h2>
        <p className="text-center text-2xl font-black text-gray-900">
          Découvrez nos vendeurs
        </p>
      </div>

      {/* Marquee avec boutiques - Responsive */}
      {/* Desktop: Marquee Animation */}
      <div className="hidden md:block marquee-container relative">
        <div className="marquee-content flex gap-12 items-center">
          {[...shops, ...shops].map((shop, i) => (
            <motion.a
              key={`${shop._id}-${i}`}
              href={`/shops/${shop.slug}`}
              className="flex-shrink-0 group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-100 flex items-center justify-center p-4 group-hover:border-pink-300 transition-all shadow-sm group-hover:shadow-md">
                {shop.logo ? (
                  <img
                    src={shop.logo?.startsWith('http') ? shop.logo : `${API_BASE}${shop.logo}`}
                    alt={shop.name}
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const container = e.currentTarget.parentElement;
                      if (container) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-16 h-16 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center text-xl font-bold text-pink-700 shadow-lg';
                        fallback.textContent = shop.name.charAt(0).toUpperCase();
                        container.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-pink-700">{shop.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <p className="text-center text-xs font-bold text-gray-600 mt-2 group-hover:text-pink-600 transition-colors">
                {shop.name}
              </p>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Mobile & Tablet: Grid Layout */}
      <div className="md:hidden px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {shops.map((shop) => (
            <motion.a
              key={shop._id}
              href={`/shops/${shop.slug}`}
              className="group flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-100 flex items-center justify-center p-3 group-hover:border-pink-300 transition-all shadow-sm group-hover:shadow-md">
                {shop.logo ? (
                  <img
                    src={shop.logo?.startsWith('http') ? shop.logo : `${API_BASE}${shop.logo}`}
                    alt={shop.name}
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const container = e.currentTarget.parentElement;
                      if (container) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold text-pink-700 shadow-lg';
                        fallback.textContent = shop.name.charAt(0).toUpperCase();
                        container.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm sm:text-lg font-bold text-pink-700">{shop.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <p className="text-center text-xs font-bold text-gray-600 mt-2 group-hover:text-pink-600 transition-colors leading-tight line-clamp-2">
                {shop.name}
              </p>
            </motion.a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
        }
        .marquee-content {
          animation: marquee 50s linear infinite;
          white-space: nowrap;
          padding-right: 48px;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
