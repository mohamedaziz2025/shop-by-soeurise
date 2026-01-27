'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus, X, Upload, AlertCircle, Store, Info } from 'lucide-react';
import Image from 'next/image';

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [myShop, setMyShop] = useState<any>(null);
  const [loadingShop, setLoadingShop] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    images: [] as File[],
    variants: [] as any[],
    shippingInfo: {
      weight: '',
      dimensions: '',
      processingTime: '1-3',
    },
  });

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shop = await api.getMyShop();
        setMyShop(shop);
      } catch (err) {
        console.error('Erreur chargement boutique:', err);
      } finally {
        setLoadingShop(false);
      }
    };

    if (user) {
      fetchShop();
    }
  }, [user]);

  const categories = [
    'Mode',
    'Cosmétiques',
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));
    
    setImages([...images, ...newImageUrls]);
    setImageFiles([...imageFiles, ...newFiles]);
    setFormData({ ...formData, images: [...formData.images, ...newFiles] });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImages(newImages);
    setImageFiles(newImageFiles);
    setFormData({ ...formData, images: newImageFiles });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { name: '', price: '', stock: '', sku: '' },
      ],
    });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Le nom du produit est requis');
      }
      if (!formData.description.trim()) {
        throw new Error('La description du produit est requise');
      }
      if (!formData.category) {
        throw new Error('Veuillez sélectionner une catégorie');
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error('Le prix doit être supérieur à 0');
      }
      if (imageFiles.length === 0) {
        throw new Error('Ajoutez au moins une image');
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        variants: formData.variants.map((v) => ({
          ...v,
          price: parseFloat(v.price),
          stock: parseInt(v.stock),
        })),
        shippingInfo: {
          ...formData.shippingInfo,
          weight: parseFloat(formData.shippingInfo.weight),
        },
      };

      await api.createProduct(productData);
      router.push('/seller/products');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
        {/* Shop Info Alert */}
        {loadingShop ? (
          <LoadingSpinner size="sm" />
        ) : myShop ? (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <Store className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Produit assigné à votre boutique</h3>
              <p className="text-sm text-blue-800 mt-1">
                Ce produit sera créé pour <strong>{myShop.name}</strong>. Les clients le découvriront en naviguant sur votre boutique.
              </p>
            </div>
          </div>
        ) : null}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Informations de base</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Décrivez votre produit en détail : matériaux, dimensions, utilisation...
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Photos du produit *</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image src={image} alt={`Photo ${index + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {images.length < 8 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Ajouter</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Ajoutez jusqu'à 8 photos. La première sera l'image principale.
            </p>
          </div>

          {/* Prix et stock */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Prix et inventaire</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock disponible *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Variantes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Variantes (optionnel)</h2>
              <button
                type="button"
                onClick={addVariant}
                className="px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une variante
              </button>
            </div>

            {formData.variants.length > 0 && (
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Variante {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nom (ex: Taille M, Couleur Bleu)"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Prix"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-3">
              Les variantes permettent de proposer différentes options (tailles, couleurs, etc.)
            </p>
          </div>

          {/* Expédition */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Informations d'expédition</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.shippingInfo.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingInfo: { ...formData.shippingInfo, weight: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Délai de traitement
                </label>
                <select
                  value={formData.shippingInfo.processingTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingInfo: { ...formData.shippingInfo, processingTime: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="1-3">1-3 jours ouvrés</option>
                  <option value="3-5">3-5 jours ouvrés</option>
                  <option value="5-7">5-7 jours ouvrés</option>
                  <option value="7-14">7-14 jours ouvrés</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création en cours...' : 'Créer le produit'}
            </button>
            <a
              href="/seller/products"
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Annuler
            </a>
          </div>
        </form>
      </div>
  );
}
