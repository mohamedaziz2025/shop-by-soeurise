'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import ShopCard from '@/components/ShopCard';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ModernLayout from '@/components/ModernLayout';
import MarketplaceSidebar from '@/components/MarketplaceSidebar';
import { Search, ChevronRight, Home, Filter, X } from 'lucide-react';

function MarketplacePageContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<'shops' | 'products'>('shops'); // shops = step 2, products = step 3
  const [category, setCategory] = useState<string>('Mode'); // Level 1 - Univers
  const [selectedShop, setSelectedShop] = useState<any | null>(null); // Level 2
  const [shops, setShops] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  // Product filters (Level 3)
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, string>>({});

  const categories = ['Mode', 'Cosmétiques'];

  // Dynamic filters by category
  const categoryFilters: Record<string, Array<any>> = {
    Mode: [
      { key: 'size', label: 'Taille', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'] },
      { key: 'color', label: 'Couleur', type: 'select', options: ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert'] },
    ],
    Cosmétiques: [
      { key: 'skinType', label: 'Type de peau', type: 'select', options: ['Normale', 'Sèche', 'Grasse', 'Mixte', 'Sensible'] },
      { key: 'productType', label: 'Type de produit', type: 'select', options: ['Soin visage', 'Maquillage', 'Parfum', 'Soin corps'] },
    ],
  };

  useEffect(() => {
    fetchShops();
  }, [category]);

  useEffect(() => {
    if (selectedShop) {
      fetchProducts();
    }
  }, [selectedShop, minPrice, maxPrice, sortBy, dynamicFilters, search]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const filters: any = { status: 'ACTIVE', category };
      const data = await api.getShops(filters);
      setShops(data);
      setView('shops');
      setSelectedShop(null);
    } catch (error) {
      console.error('Erreur chargement boutiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        status: 'ACTIVE',
        shopSlug: selectedShop.slug,
        limit: 24,
      };
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;

      Object.keys(dynamicFilters).forEach((k) => {
        if (dynamicFilters[k]) params[k] = dynamicFilters[k];
      });

      const data = await api.getProducts(params);
      setProducts(data);
      setView('products');
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedShop) {
      fetchProducts();
    }
  };

  const handleShopClick = (shop: any) => {
    setSelectedShop(shop);
    setView('products');
    setSearch('');
    setDynamicFilters({});
  };

  const handleBackToShops = () => {
    setSelectedShop(null);
    setView('shops');
    setProducts([]);
    setDynamicFilters({});
  };

  const accentColor = category === 'Mode' ? 'indigo' : 'rose';

  return (
    <ModernLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar with categories and shops */}
          <MarketplaceSidebar
            categories={categories}
            selectedCategory={category}
            shops={shops}
            selectedShop={selectedShop}
            onCategorySelect={(cat) => {
              setCategory(cat);
              setSelectedShop(null);
              setView('shops');
            }}
            onShopSelect={handleShopClick}
            accentColor={accentColor}
          />

          {/* Main Content */}
          <main className="flex-1">
            {/* Header Sticky: Breadcrumb + Search */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
              <div className="px-4 sm:px-6 lg:px-8 py-4">
                {/* Mobile categories button */}
                <div className="lg:hidden mb-3">
                  <button
                    onClick={() => setShowMobileCategories(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-600 transition"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Univers & Boutiques</span>
                  </button>
                </div>
                {/* Breadcrumb */}
                <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                  <Home className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                  <span className={`text-${accentColor}-600 font-black`}>{category}</span>
                  {selectedShop && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-gray-900 font-black">{selectedShop.name}</span>
                    </>
                  )}
                  {selectedShop && (
                    <button
                      onClick={handleBackToShops}
                      className="ml-auto text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      ← Retour aux boutiques
                    </button>
                  )}
                </div>

                {/* Search contextuelle */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      selectedShop
                        ? `Rechercher dans ${selectedShop.name}...`
                        : `Rechercher dans ${category}...`
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-[2.5rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </form>

                {/* Mobile filters button */}
                {view === 'products' && (
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-bold"
                  >
                    <Filter className="w-4 h-4" />
                    Filtres
                  </button>
                )}
              </div>
            </div>

            {/* Content: Shops or Products */}
            <div className="p-4 lg:p-8">
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <LoadingSpinner size="lg" />
                </div>
              ) : view === 'shops' ? (
                <>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 lg:mb-4 tracking-tighter"
                  >
                    Boutiques — {category}
                  </motion.h1>
                  <p className="text-lg sm:text-xl text-gray-600 mb-6 lg:mb-8">
                    {shops.length} boutique{shops.length > 1 ? 's' : ''} disponible{shops.length > 1 ? 's' : ''}
                  </p>

                  {shops.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[2.5rem] border border-gray-100">
                      <div className={`w-24 h-24 bg-${accentColor}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <Search className={`w-12 h-12 text-${accentColor}-600`} />
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 mb-3">Aucune boutique trouvée</h3>
                      <p className="text-gray-500 text-lg">
                        Aucune boutique dans cette catégorie pour le moment
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array.isArray(shops) && shops.map((shop, i) => (
                        <motion.div
                          key={shop._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => handleShopClick(shop)}
                          className="cursor-pointer"
                        >
                          <ShopCard shop={{ ...shop, category }} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
                  ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Product Filters Sidebar (Niveau 3) */}
                  <aside className="hidden lg:block w-80 flex-shrink-0">
                    <div className="sticky top-32 bg-white rounded-[2.5rem] p-6 shadow-lg border border-gray-100">
                      <h2 className="font-black text-xl mb-6">Filtres</h2>

                      {/* Dynamic filters selon la catégorie */}
                      {categoryFilters[category] && (
                        <div className="mb-6">
                          <h3 className="font-bold text-sm mb-3 text-gray-700 uppercase tracking-widest">
                            Filtres {category}
                          </h3>
                          <div className="flex flex-col gap-3">
                            {categoryFilters[category].map((f) => (
                              <div key={f.key}>
                                <label className="text-sm text-gray-600 mb-2 block font-medium">
                                  {f.label}
                                </label>
                                {f.type === 'select' && (
                                  <select
                                    value={dynamicFilters[f.key] || ''}
                                    onChange={(e) =>
                                      setDynamicFilters((prev) => ({ ...prev, [f.key]: e.target.value }))
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                        <h3 className="font-bold text-sm mb-3 text-gray-700 uppercase tracking-widest">
                          Prix
                        </h3>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      {/* Tri */}
                      <div className="mb-6">
                        <h3 className="font-bold text-sm mb-3 text-gray-700 uppercase tracking-widest">
                          Trier par
                        </h3>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                          setMinPrice('');
                          setMaxPrice('');
                          setSortBy('newest');
                          setDynamicFilters({});
                        }}
                        className={`w-full py-3 text-sm font-bold text-${accentColor}-600 hover:bg-${accentColor}-50 rounded-xl transition-colors`}
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  </aside>

                  {/* Mobile Categories Sidebar */}
                  <AnimatePresence>
                    {showMobileCategories && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowMobileCategories(false)}
                          className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        />
                        <motion.aside
                          initial={{ x: -320 }}
                          animate={{ x: 0 }}
                          exit={{ x: -320 }}
                          className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 p-6 overflow-y-auto"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="font-black text-xl">Univers</h2>
                            <button onClick={() => setShowMobileCategories(false)}>
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                          <div className="space-y-4">
                            {categories.map((cat) => (
                              <div key={cat}>
                                <button
                                  onClick={() => {
                                    setCategory(cat);
                                    setShowMobileCategories(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 rounded-xl font-black text-lg transition-all ${
                                    category === cat ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {cat}
                                </button>

                                {category === cat && shops.length > 0 && (
                                  <div className="ml-4 mt-2 space-y-1">
                                    {shops.map((shop) => (
                                      <button
                                        key={shop._id}
                                        onClick={() => {
                                          handleShopClick(shop);
                                          setShowMobileCategories(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                                      >
                                        {shop.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.aside>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Mobile Filters Sidebar */}
                  <AnimatePresence>
                    {showMobileFilters && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowMobileFilters(false)}
                          className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        />
                        <motion.aside
                          initial={{ x: -320 }}
                          animate={{ x: 0 }}
                          exit={{ x: -320 }}
                          className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 p-6 overflow-y-auto"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="font-black text-xl">Filtres</h2>
                            <button onClick={() => setShowMobileFilters(false)}>
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                          {/* Same filters as desktop */}
                          {categoryFilters[category] && (
                            <div className="mb-6">
                              <h3 className="font-bold text-sm mb-3 text-gray-700 uppercase tracking-widest">
                                Filtres {category}
                              </h3>
                              <div className="flex flex-col gap-3">
                                {categoryFilters[category].map((f) => (
                                  <div key={f.key}>
                                    <label className="text-sm text-gray-600 mb-2 block font-medium">
                                      {f.label}
                                    </label>
                                    {f.type === 'select' && (
                                      <select
                                        value={dynamicFilters[f.key] || ''}
                                        onChange={(e) =>
                                          setDynamicFilters((prev) => ({ ...prev, [f.key]: e.target.value }))
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                          <div className="mb-6">
                            <h3 className="font-bold text-sm mb-3 text-gray-700 uppercase tracking-widest">
                              Prix
                            </h3>
                            <div className="flex gap-3">
                              <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="Min"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              />
                              <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Max"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>
                          <div className="mb-6">
                            <h3 className="font-bold text-sm mb-3 text-gray-700 uppercase tracking-widest">
                              Trier par
                            </h3>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                              <option value="newest">Plus récents</option>
                              <option value="price-asc">Prix croissant</option>
                              <option value="price-desc">Prix décroissant</option>
                              <option value="rating">Meilleures notes</option>
                              <option value="popular">Populaires</option>
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              setMinPrice('');
                              setMaxPrice('');
                              setSortBy('newest');
                              setDynamicFilters({});
                            }}
                            className={`w-full py-3 text-sm font-bold text-${accentColor}-600 hover:bg-${accentColor}-50 rounded-xl transition-colors`}
                          >
                            Réinitialiser les filtres
                          </button>
                        </motion.aside>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Products Grid */}
                  <div className="flex-1">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3 lg:mb-4 tracking-tighter"
                    >
                      {selectedShop?.name} — Catalogue
                    </motion.h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-6 lg:mb-8">
                      {products.length} produit{products.length > 1 ? 's' : ''}
                    </p>

                    {products.length === 0 ? (
                      <div className="text-center py-32 bg-white rounded-[2.5rem] border border-gray-100">
                        <div className={`w-24 h-24 bg-${accentColor}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                          <Search className={`w-12 h-12 text-${accentColor}-600`} />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-3">
                          Aucun produit trouvé
                        </h3>
                        <p className="text-gray-500 text-lg">
                          Essayez de modifier vos filtres ou votre recherche
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {Array.isArray(products) && products.map((product, i) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ModernLayout>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <ModernLayout>
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </ModernLayout>
      }
    >
      <MarketplacePageContent />
    </Suspense>
  );
}
