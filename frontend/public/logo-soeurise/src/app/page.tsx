import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo-soeurise/logo-main.svg"
              alt="Shop By Soeurise"
              width={150}
              height={50}
              className="h-12 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/marketplace" className="hover:text-primary">
              Marketplace
            </Link>
            <Link href="/categories" className="hover:text-primary">
              Catégories
            </Link>
            <Link href="/shops" className="hover:text-primary">
              Boutiques
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/wishlist">
              <Heart className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Connexion
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenue sur Shop By Soeurise
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            La marketplace communautaire dédiée aux femmes musulmanes engagées.
            Découvrez des marques éthiques et de qualité, sélectionnées avec soin.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/marketplace"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Découvrir la Marketplace
            </Link>
            <Link
              href="/seller/register"
              className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition"
            >
              Devenir Vendeuse
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir Soeurise ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Label de Confiance</h3>
              <p className="text-gray-600">
                Toutes nos marques sont rigoureusement sélectionnées selon nos
                critères éthiques et qualité.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communauté Engagée</h3>
              <p className="text-gray-600">
                Rejoignez une communauté de +200 000 femmes musulmanes
                partageant les mêmes valeurs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expérience Premium</h3>
              <p className="text-gray-600">
                Profitez d'une expérience d'achat fluide, transparente et
                sécurisée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/logo-soeurise/logo-main.svg"
                alt="Soeurise"
                width={120}
                height={40}
                className="h-10 w-auto mb-4"
              />
              <p className="text-sm text-gray-600">
                Marketplace communautaire premium pour femmes musulmanes engagées.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/marketplace">Tous les produits</Link>
                </li>
                <li>
                  <Link href="/categories">Catégories</Link>
                </li>
                <li>
                  <Link href="/shops">Boutiques</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">À propos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about">Qui sommes-nous</Link>
                </li>
                <li>
                  <Link href="/seller/register">Devenir vendeuse</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Aide</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/shipping">Livraison</Link>
                </li>
                <li>
                  <Link href="/returns">Retours</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 Shop By Soeurise. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
