'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  const categories = [
    'Mode Femme',
    'Mode Homme',
    'Enfants',
    'Accessoires',
    'Beauté & Cosmétiques',
    'Maison & Décoration',
    'Alimentation Halal',
    'Livres & Éducation',
    'Sport & Loisirs',
    'High-Tech',
  ];

  useEffect(() => {
    fetchProducts();
  }, [search, category, minPrice, maxPrice, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        status: 'ACTIVE',
        limit: 24,
      };

      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;

      const data = await api.getProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <img src="/logo-soeurise/logo-main.svg" alt="Soeurise" className="h-8" />
            </a>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            {/* Cart */}
            <a
              href="/cart"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              🛒
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filtres */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 sticky top-24">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filtres
              </h2>

              {/* Catégories */}
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-2">Catégorie</h3>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-2">Prix</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Tri */}
              <div className="mb-4">
                <h3 className="font-medium text-sm mb-2">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="popular">Populaires</option>
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setCategory('');
                  setMinPrice('');
                  setMaxPrice('');
                  setSortBy('newest');
                }}
                className="w-full py-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </aside>

          {/* Produits */}
          <main className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <p className="text-gray-600">
                {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <LoadingSpinner size="lg" />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-2">Aucun produit trouvé</p>
                <p className="text-gray-400 text-sm">
                  Essayez de modifier vos filtres
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
