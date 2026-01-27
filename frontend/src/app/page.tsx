'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  Quote,
  Store,
  Star,
  Menu,
  X,
} from 'lucide-react';

import heroImg from '@/images-vitrine/femme-hijabi.jpg';
import imgPretAPorter from '@/images-vitrine/pret-a-porter.jpg';
import imgAccessoires from '@/images-vitrine/Accessoires.png';
import PartnerLogos from '@/components/PartnerLogos';
const imgBienEtre = new URL('../images-vitrine/routine bien-etre.jfif', import.meta.url).href;

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = '', variant = 'primary' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (ref.current) {
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    }
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const baseStyles = 'relative flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold transition-all duration-300 overflow-hidden group cursor-pointer';
  const variants: Record<'primary' | 'secondary', string> = {
    primary: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg',
    secondary: 'border-2 border-pink-600 text-pink-600 bg-white hover:bg-pink-50',
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 160, damping: 14, mass: 0.15 }}
    >
      <div className={`${baseStyles} ${variants[variant]} ${className}`}>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <motion.div
          className="absolute inset-0 bg-white/15 scale-x-0 group-hover:scale-x-100 origin-left"
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

const FadeInView: React.FC<FadeInViewProps> = ({ children, delay = 0, direction = 'up', className }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const initial = {
    opacity: 0,
    y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const { user } = useAuthStore();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -160]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    const onMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMouse);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'SELLER') return '/seller/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
      {/* Spotlight */}
      <div
        className="pointer-events-none fixed z-[9998] w-[420px] h-[420px] bg-pink-400/15 rounded-full blur-[100px] transition-transform duration-200 ease-out"
        style={{ transform: `translate(${mousePos.x - 210}px, ${mousePos.y - 210}px)` }}
      />

      {/* Header */}
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
            <Link href="#collections" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors relative group">
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
            </Link>
            
            <Link href="/about" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors relative group">
              À propos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
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
                <Link href="#collections" className="text-lg font-bold text-gray-800">Collections</Link>
                <Link href="/about" className="text-lg font-bold text-gray-800">À propos</Link>
                <Link href={getDashboardLink()} className="w-full py-4 rounded-xl bg-pink-600 text-white font-bold text-center">Mon Espace</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-24 md:pt-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-pink-200 rounded-full"
              animate={{
                x: [0, 50, -50, 0],
                y: [0, -40, 40, 0],
              }}
              transition={{ duration: Math.random() * 18 + 10, repeat: Infinity, ease: 'linear' }}
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeInView>
              <span className="inline-flex items-center gap-2 bg-white border border-pink-100 px-4 py-2 rounded-full text-xs font-bold text-pink-600 mb-8 shadow-sm">
                MARKETPLACE PREMIUM & ÉTHIQUE
              </span>
              <h1 className="text-7xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter text-gray-900">
                L'élégance <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500">engagée.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg mb-10 leading-relaxed font-medium">
                La première destination mode et lifestyle dédiée aux femmes qui ne font aucun compromis entre style, foi et éthique.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/marketplace">
                  <MagneticButton variant="primary">
                    Explorer la collection <ArrowRight className="w-5 h-5" />
                  </MagneticButton>
                </Link>
                <Link href="/seller/register">
                  <MagneticButton variant="secondary">
                    Devenir vendeuse
                  </MagneticButton>
                </Link>
              </div>
            </FadeInView>
          </div>

          <div className="relative">
            <motion.div style={{ y: yParallax }} className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              <Image
                src={heroImg}
                alt="Mode élégante avec hijab"
                width={1000}
                height={1200}
                className="w-full h-[600px] object-cover"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 -right-10 bg-white p-6 rounded-2xl shadow-xl z-20 border border-pink-50 hidden sm:block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold">QUALITÉ CERTIFIÉE</div>
                  <div className="text-lg font-black">100% Éthique</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logos Marquee - Partenaires */}
      <PartnerLogos />

      {/* Le Journal: removed as requested */}

      {/* Collections */}
      <section id="collections" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <FadeInView>
              <span className="text-pink-600 font-bold uppercase tracking-widest text-xs mb-3 block">Collections</span>
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Parcourir par univers</h2>
            </FadeInView>
            <Link href="/marketplace" className="hidden md:flex items-center gap-2 text-gray-900 font-bold hover:text-pink-600 transition">
              Voir tout <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Prêt-à-porter', img: imgPretAPorter, count: '1.2k+ Articles' },
              { name: 'Accessoires Or', img: imgAccessoires, count: '850+ Articles' },
              { name: 'Bien-être Bio', img: imgBienEtre, count: '420+ Articles' },
            ].map((cat, i) => (
              <Link key={i} href="/marketplace" className="group relative h-[480px] rounded-[40px] overflow-hidden">
                <Image src={cat.img} alt={`${cat.name} — femme avec hijab`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <p className="text-pink-300 font-bold text-xs uppercase tracking-[0.2em] mb-1">{cat.count}</p>
                  <h3 className="text-white text-3xl font-black">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      

      {/* Témoignage */}
      <section className="py-28 bg-gray-950 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="w-16 h-16 text-pink-300 mx-auto mb-8" />
            <h3 className="text-3xl md:text-5xl font-black italic leading-tight mb-6">“Shop By Soeurise n'est pas qu'une boutique, c'est une communauté. J'y ai trouvé des produits d'une qualité rare et des créatrices passionnées.”</h3>
            <div className="text-pink-400 font-bold tracking-widest text-xs uppercase">Sophie, Membre Gold</div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6 text-center">
          <FadeInView>
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight">Prête pour le voyage ?</h2>
            <div className="flex items-center justify-center gap-6">
              <Link href="/register" className="w-24 h-24 rounded-full bg-pink-600 text-white flex items-center justify-center hover:scale-110 transition">
                <ArrowRight className="w-8 h-8" />
              </Link>
              <Link href="/marketplace" className="px-8 py-4 rounded-full border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition">Explorer la marketplace</Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Footer */}
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
                <li><Link href="/categories" className="hover:text-pink-400 transition">Catégories</Link></li>
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
                <li><Link href="/faq" className="hover:text-pink-400 transition">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-pink-400 transition">Livraison</Link></li>
                <li><Link href="/returns" className="hover:text-pink-400 transition">Retours</Link></li>
              </ul>
            </div>
          </div>

            <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Shop By Soeurise. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .marquee { animation: marquee 20s linear infinite; white-space: nowrap; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
