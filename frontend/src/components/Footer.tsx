'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-pink-600 to-rose-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black">SHOP BY SOEURISE</span>
            </div>
            <p className="text-sm text-gray-300">Marketplace premium et éthique dédiée aux femmes. L'élégance engagée.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-pink-400">Marketplace</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/marketplace" className="hover:text-pink-400 transition">Tous les produits</Link></li>
              <li><Link href="/marketplace?category=fashion" className="hover:text-pink-400 transition">Prêt-à-porter</Link></li>
              <li><Link href="/marketplace?category=accessories" className="hover:text-pink-400 transition">Accessoires</Link></li>
              <li><Link href="/marketplace" className="hover:text-pink-400 transition">Boutiques</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-pink-400">À propos</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-pink-400 transition">Qui sommes-nous</Link></li>
              <li><Link href="/seller/register" className="hover:text-pink-400 transition">Devenir vendeuse</Link></li>
              <li><Link href="/contact" className="hover:text-pink-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-pink-400">Aide</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/account" className="hover:text-pink-400 transition">Mon compte</Link></li>
              <li><Link href="/account/orders" className="hover:text-pink-400 transition">Mes commandes</Link></li>
              <li><Link href="/contact" className="hover:text-pink-400 transition">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Shop By Soeurise. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
