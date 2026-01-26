'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import LoadingSpinner from '@/components/LoadingSpinner';
import MarketplaceSidebar from '@/components/MarketplaceSidebar';
import { Star, Truck, ShieldCheck, Package, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Sidebar data
  const [categories] = useState(['Mode', 'Cosmétiques']);
  const [currentCategory, setCurrentCategory] = useState<string>('Mode');
  const [shops, setShops] = useState<any[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);

  const { addItem } = useCartStore();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await api.getProductBySlug(slug);
      // API returns { product, variants } — normalize to `product`
      const productData = data?.product ?? data;
      setProduct(productData);
      if (data?.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }

      // Determine category from product
      const productCategory = productData?.shop?.category || productData?.category || 'Mode';
      setCurrentCategory(productCategory);

      // Fetch shops for this category
      await fetchShopsForCategory(productCategory);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopsForCategory = async (category: string) => {
    setSidebarLoading(true);
    try {
      const filters: any = { status: 'ACTIVE', category };
      const data = await api.getShops(filters);
      setShops(data);
    } catch (error) {
      console.error('Erreur chargement boutiques:', error);
    } finally {
      setSidebarLoading(false);
    }
  };

  const handleCategorySelect = async (category: string) => {
    setCurrentCategory(category);
    await fetchShopsForCategory(category);
  };

  const handleShopSelect = (shop: any) => {
    // Navigate to shop page
    window.location.href = `/shops/${shop.slug}`;
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem({
        productId: product._id,
        variantId: selectedVariant?._id,
        quantity,
      });
      alert('Produit ajouté au panier !');
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setAdding(false);
    }
  };

  const accentColor = currentCategory === 'Mode' ? 'indigo' : 'rose';

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h1>
          <a href="/marketplace" className="text-pink-600 hover:underline">
            Retour à la marketplace
          </a>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <MarketplaceSidebar
          categories={categories}
          selectedCategory={currentCategory}
          shops={shops}
          selectedShop={product?.shop}
          onCategorySelect={handleCategorySelect}
          onShopSelect={handleShopSelect}
          accentColor={accentColor}
        />

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              {/* Image principale */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={product?.images?.[selectedImage] || '/placeholder-product.png'}
                  alt={product?.name || 'Produit'}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Miniatures */}
              {product?.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                        selectedImage === idx ? 'ring-2 ring-pink-600' : ''
                      }`}
                    >
                      <Image src={img} alt={`${product?.name || 'Produit'} ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Détails */}
            <div>
              {/* Shop */}
              <a
                href={`/shops/${product?.shop?.slug || product?.shopId?.slug || '#'}`}
                className="text-sm text-pink-600 hover:underline mb-2 inline-block"
              >
                {product?.shop?.name || product?.shopId?.name || ''}
              </a>

              {/* Nom */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              {product.averageRating && product.totalReviews ? (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{product.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500">({product.totalReviews} avis)</span>
                </div>
              ) : null}

              {/* Prix */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-pink-600">{formatPrice(currentPrice)}</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Variantes */}
              {product.hasVariants && product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Choisir une option :</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variants.map((variant: any) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 border rounded-lg text-sm ${
                          selectedVariant?._id === variant._id
                            ? 'border-pink-600 bg-pink-600/5'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={variant.stock === 0}
                      >
                        <div className="font-medium">{variant.name}</div>
                        <div className="text-xs text-gray-500">{formatPrice(variant.price)}</div>
                        {variant.stock === 0 && (
                          <div className="text-xs text-red-500">Épuisé</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantité */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Quantité :</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border rounded-lg hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-10 text-center border rounded-lg"
                    min="1"
                    max={currentStock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="w-10 h-10 border rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">
                    ({currentStock} disponibles)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || currentStock === 0}
                  className="flex-1 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-600/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? 'Ajout...' : currentStock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50">
                  <Heart className="w-6 h-6" />
                </button>
              </div>

              {/* Infos livraison */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Truck className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Livraison par la boutique</div>
                    <div className="text-gray-600">
                      Frais de port calculés à la commande
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <ShieldCheck className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Label de Confiance Shop By Soeurise</div>
                    <div className="text-gray-600">Produit vérifié et sélectionné</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Package className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Retours acceptés</div>
                    <div className="text-gray-600">Selon conditions de la boutique</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avis (à implémenter) */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-4">Avis clients</h2>
          <p className="text-gray-500">Aucun avis pour le moment</p>
        </div>
      </div>
    </main>
      </div>
    </div>
  );
}
