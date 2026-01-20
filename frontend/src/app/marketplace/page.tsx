'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ModernLayout from '@/components/ModernLayout';
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [showFilters, setShowFilters] = useState(false);
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, string>>({});

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

  const categoryFilters: Record<string, Array<any>> = {
    'Mode Femme': [
      { key: 'size', label: 'Taille', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'] },
      { key: 'color', label: 'Couleur', type: 'select', options: ['Noir', 'Blanc', 'Rouge', 'Bleu'] },
    ],
    'Mode Homme': [
      { key: 'size', label: 'Taille', type: 'select', options: ['S', 'M', 'L', 'XL'] },
      { key: 'color', label: 'Couleur', type: 'select', options: ['Noir', 'Blanc', 'Gris', 'Bleu'] },
    ],
    'High-Tech': [
      { key: 'brand', label: 'Marque', type: 'select', options: ['Apple', 'Samsung', 'Xiaomi', 'Autre'] },
      { key: 'condition', label: "État", type: 'select', options: ['Neuf', 'Occasion'] },
    ],
    'Maison & Décoration': [
      { key: 'material', label: 'Matériau', type: 'select', options: ['Bois', 'Métal', 'Textile', 'Verre'] },
    ],
  };

  useEffect(() => {
    // reset dynamic filters when category changes
    setDynamicFilters({});
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

      // include dynamic filters (brand, size, color, etc.)
      Object.keys(dynamicFilters).forEach((k) => {
        if (dynamicFilters[k]) params[k] = dynamicFilters[k];
      });

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

  const FilterSidebar = () => (
    <div className="bg-white rounded-[32px] p-6 shadow-lg border border-pink-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-black text-xl flex items-center gap-3">
          <SlidersHorizontal className="w-6 h-6 text-pink-600" />
          Filtres
        </h2>
        {showFilters && (
          <button onClick={() => setShowFilters(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Catégories */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-3 text-gray-700">Catégorie</h3>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Filtres dynamiques selon la catégorie */}
      {category && categoryFilters[category] && (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 text-gray-700">Filtrer par {category}</h3>
          <div className="flex flex-col gap-3">
            {categoryFilters[category].map((f) => (
              <div key={f.key}>
                <label className="text-sm text-gray-600 mb-2 block font-medium">{f.label}</label>
                {f.type === 'select' && (
                  <select
                    value={dynamicFilters[f.key] || ''}
                    onChange={(e) => setDynamicFilters((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    <option value="">Tous</option>
                    {f.options.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prix */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-3 text-gray-700">Prix</h3>
        <div className="flex gap-3">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Tri */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-3 text-gray-700">Trier par</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
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
          setDynamicFilters({});
        }}
        className="w-full py-3 text-sm font-bold text-pink-600 hover:bg-pink-50 rounded-xl transition-colors"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );

  return (
    <ModernLayout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter">
              Marketplace
            </h1>
            <p className="text-xl text-gray-600">
              Découvrez {products.length} produit{products.length > 1 ? 's' : ''} sélectionné{products.length > 1 ? 's' : ''} avec soin
            </p>
          </motion.div>

          {/* Barre de recherche */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch} 
            className="mb-8"
          >
            <div className="relative max-w-3xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit, une marque, une catégorie..."
                className="w-full pl-16 pr-6 py-5 border-2 border-gray-200 rounded-[28px] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-lg shadow-lg"
              />
            </div>
          </motion.form>

          {/* Bouton filtres mobile */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-pink-600 text-pink-600 rounded-full font-bold hover:bg-pink-50 transition-all shadow-lg"
            >
              <Filter className="w-5 h-5" />
              Filtres
            </button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filtres - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-32">
                <FilterSidebar />
              </div>
            </aside>

            {/* Sidebar Filtres - Mobile */}
            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                  />
                  <motion.aside
                    initial={{ x: -320 }}
                    animate={{ x: 0 }}
                    exit={{ x: -320 }}
                    className="lg:hidden fixed left-0 top-0 h-full w-80 bg-[#fafafa] z-50 p-6 overflow-y-auto"
                  >
                    <FilterSidebar />
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Produits */}
            <main className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <LoadingSpinner size="lg" />
                </div>
              ) : products.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-32 bg-white rounded-[40px] border border-pink-50"
                >
                  <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-pink-600" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-3">Aucun produit trouvé</h3>
                  <p className="text-gray-500 text-lg">
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}
