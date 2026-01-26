'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

interface Partner {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  categories: string[];
}

export default function PartnerLogos() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const data = await api.getPartners();
      setPartners(data || []);
    } catch (error) {
      console.error('Erreur chargement partenaires:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || partners.length === 0) return null;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://72.62.71.97:3001';

  return (
    <section className="py-16 bg-white border-y border-pink-50 overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <h2 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
          Nos Partenaires
        </h2>
        <p className="text-center text-2xl font-black text-gray-900">
          Ils nous font confiance
        </p>
      </div>

      {/* Marquee avec partenaires */}
      <div className="marquee-container relative">
        <div className="marquee-content flex gap-12 items-center">
          {[...partners, ...partners].map((partner, i) => (
            <motion.a
              key={`${partner._id}-${i}`}
              href={`/shops/${partner.slug}`}
              className="flex-shrink-0 group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-100 flex items-center justify-center p-4 group-hover:border-pink-300 transition-all shadow-sm group-hover:shadow-md">
                <img
                  src={partner.logo.startsWith('http') ? partner.logo : `${API_BASE}${partner.logo}`}
                  alt={partner.name}
                  className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              <p className="text-center text-xs font-bold text-gray-600 mt-2 group-hover:text-pink-600 transition-colors">
                {partner.name}
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
          animation: marquee 40s linear infinite;
          white-space: nowrap;
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
