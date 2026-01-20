'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Sparkles, Menu, X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function Header() {
  const { user } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'SELLER') return '/seller/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/dashboard';
  };

  const cartItemCount = items?.length || 0;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all ${
      isScrolled ? 'backdrop-blur bg-white/80 border-b border-pink-100 py-3' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-pink-200"
            >
              <Sparkles className="text-white w-6 h-6" />
            </motion.div>
          </div>
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            SHOP BY SOEURISE
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors relative group">
            Accueil
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
          </Link>
          <Link href="/marketplace" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors relative group">
            Marketplace
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
          </Link>
          <Link href="/#collections" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors relative group">
            Collections
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
          </Link>
          {/* 'Le Journal' removed as requested */}
          <Link href="/about" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors relative group">
            À propos
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
          </Link>
          <Link href="/cart" className="relative p-2 hover:bg-pink-50 rounded-lg transition">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link href={getDashboardLink()} className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-pink-600 transition-all">
            {user ? 'Mon Espace' : 'Se connecter'}
          </Link>
        </nav>

        <button className="md:hidden p-2" onClick={() => setIsMenuOpen((v) => !v)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-pink-50 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <Link href="/" className="text-lg font-bold text-gray-800">Accueil</Link>
              <Link href="/marketplace" className="text-lg font-bold text-gray-800">Marketplace</Link>
              <Link href="/#collections" className="text-lg font-bold text-gray-800">Collections</Link>
              {/* 'Le Journal' removed from mobile menu */}
              <Link href="/about" className="text-lg font-bold text-gray-800">À propos</Link>
              <Link href="/cart" className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Panier {cartItemCount > 0 && <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">{cartItemCount}</span>}
              </Link>
              <Link href={getDashboardLink()} className="w-full py-4 rounded-xl bg-pink-600 text-white font-bold text-center">Mon Espace</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
