'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import MarketplaceSidebar from '@/components/MarketplaceSidebar';
import { Star, Package, MapPin, Truck, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter state
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, string>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchShopData();
    }
  }, [slug]);

  useEffect(() => {
    if (shop) {
      fetchProducts();
    }
  }, [shop, minPrice, maxPrice, sortBy, dynamicFilters]);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const shopData = await api.getShopBySlug(slug);
      setShop(shopData);
      // set category and fetch nearby shops in same category
      const cat = shopData.categories?.includes('Mode') ? 'Mode' : shopData.categories?.includes('Cosmétiques') ? 'Cosmétiques' : null;
      setSelectedCategory(cat);
      if (cat) fetchShopsByCategory(cat);
    } catch (error) {
      console.error('Erreur chargement boutique:', error);
      setLoading(false);
    }
  };

  const fetchShopsByCategory = async (cat: string) => {
    try {
      const data = await api.getShops({ status: 'ACTIVE', category: cat }).catch(() => []);
      setShops(data || []);
    } catch (err) {
      setShops([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        shopSlug: slug,
        status: 'ACTIVE',
      };
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;

      Object.keys(dynamicFilters).forEach((k) => {
        if (dynamicFilters[k]) params[k] = dynamicFilters[k];
      });

      const productsData = await api.getProducts(params);
      setProducts(productsData);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Boutique introuvable</h1>
          <p className="text-gray-600">Cette boutique n'existe pas ou a été supprimée.</p>
          <a href="/marketplace" className="text-primary hover:underline mt-4 inline-block">
            Retour à la marketplace
          </a>
        </div>
      </div>
    );
  }

  // Determine filters based on shop categories
  const shopCategory = shop.categories?.includes('Mode') ? 'Mode' : shop.categories?.includes('Cosmétiques') ? 'Cosmétiques' : null;

  const categoryFilters: Record<string, Array<any>> = {
    Mode: [
      { key: 'size', label: 'Taille', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { key: 'color', label: 'Couleur', type: 'select', options: ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Rose', 'Gris'] },
    ],
    Cosmétiques: [
      { key: 'skinType', label: 'Type de peau', type: 'select', options: ['Normale', 'Sèche', 'Grasse', 'Mixte', 'Sensible'] },
      { key: 'productType', label: 'Type de produit', type: 'select', options: ['Soin visage', 'Maquillage', 'Parfum', 'Soin corps', 'Cheveux'] },
    ],
  };

  const accentColor = shopCategory === 'Mode' ? 'indigo' : 'rose';

  const FilterSidebar = () => (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-black text-xl flex items-center gap-3">
          <SlidersHorizontal className={`w-6 h-6 text-${accentColor}-600`} />
          Filtres
        </h2>
        {showMobileFilters && (
          <button onClick={() => setShowMobileFilters(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dynamic filters selon la catégorie */}
      {shopCategory && categoryFilters[shopCategory] && (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 text-gray-700 uppercase tracking-widest">
            Filtres {shopCategory}
          </h3>
          <div className="flex flex-col gap-3">
            {categoryFilters[shopCategory].map((f) => (
              <div key={f.key}>
                <label className="text-sm text-gray-600 mb-2 block font-medium">{f.label}</label>
                {f.type === 'select' && (
                  <select
                    value={dynamicFilters[f.key] || ''}
                    onChange={(e) =>
                      setDynamicFilters((prev) => ({ ...prev, [f.key]: e.target.value }))
                    }
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent transition-all`}
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
        <h3 className="font-bold text-sm mb-3 text-gray-700 uppercase tracking-widest">Prix</h3>
        <div className="flex gap-3">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent transition-all`}
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent transition-all`}
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
          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent transition-all`}
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
  );

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://72.62.71.97:3001';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header boutique */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-pink-50 to-orange-50 rounded-[2.5rem] flex-shrink-0 border-2 border-gray-100 overflow-hidden flex items-center justify-center group hover:shadow-lg transition-shadow">
              {shop.logo ? (
                <img
                  src={shop.logo?.startsWith('http') ? shop.logo : `${API_BASE}${shop.logo}`}
                  alt={shop.name}
                  className="object-contain w-full h-full p-3 group-hover:scale-110 transition-transform"
                  onError={(e) => {
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      container.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-pink-200 to-rose-200 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-pink-700">${shop.name.charAt(0)}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-rose-200">
                  <span className="text-4xl font-black text-pink-700">
                    {shop.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{shop.name}</h1>
              <p className="text-gray-600 mb-4 font-light">{shop.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                {shop.averageRating && shop.totalReviews ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{shop.averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({shop.totalReviews} avis)</span>
                  </div>
                ) : null}

                <div className="flex items-center gap-1 text-gray-600">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">{products.length} produits</span>
                </div>

                {shop.seller?.city && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{shop.seller.city}</span>
                  </div>
                )}
              </div>

              {/* Shipping info */}
              {shop.shippingConfig && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-[2.5rem] inline-block">
                  <div className="flex items-center gap-2 text-sm text-green-800 font-medium">
                    <Truck className="w-4 h-4" />
                    <span>
                      Livraison à partir de {shop.shippingConfig.flatRate}€
                      {shop.shippingConfig.freeShippingThreshold && (
                        <> • Gratuite dès {shop.shippingConfig.freeShippingThreshold}€</>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Produits avec sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile filter button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className={`flex items-center gap-2 px-6 py-3 bg-${accentColor}-600 text-white rounded-full font-bold shadow-lg`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filtres
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Marketplace Sidebar */}
          <MarketplaceSidebar
            categories={['Mode', 'Cosmétiques']}
            selectedCategory={selectedCategory || 'Mode'}
            shops={shops}
            selectedShop={shop}
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              fetchShopsByCategory(cat);
            }}
            onShopSelect={(s) => window.location.href = `/shops/${s.slug || s._id}`}
            accentColor={accentColor}
          />
          {/* Sidebar Filtres - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar />
            </div>
          </aside>

          {/* Sidebar Filtres - Mobile */}
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
                  <FilterSidebar />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            <h2 className="text-3xl font-black mb-6 tracking-tight">Catalogue Produits</h2>

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[2.5rem] border border-gray-100">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  Aucun produit disponible pour le moment
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
