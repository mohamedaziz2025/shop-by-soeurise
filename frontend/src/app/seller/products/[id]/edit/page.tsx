'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChevronLeft, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  cost?: number;
  stock: number;
  category: string;
  tags: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  image?: string;
  images?: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    category: '',
    tags: '',
    status: 'ACTIVE',
    image: '',
    images: [],
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchProduct();
  }, [user, router]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await api.getProductById(productId);
      if (data) {
        setForm({
          name: data.name || '',
          description: data.description || '',
          price: data.price || 0,
          cost: data.cost || 0,
          stock: data.stock || 0,
          category: data.category || '',
          tags: data.tags?.join(', ') || '',
          status: data.status || 'ACTIVE',
          image: data.image || '',
          images: data.images || [],
        });
        setImagePreview(data.image);
      }
    } catch (error) {
      console.error('Erreur chargement produit:', error);
      setError('Erreur lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'cost' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Le nom du produit est requis');
      return;
    }

    if (form.price <= 0) {
      setError('Le prix doit être supérieur à 0');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price.toString());
      formData.append('cost', (form.cost || 0).toString());
      formData.append('stock', form.stock.toString());
      formData.append('category', form.category);
      if (form.tags) {
        formData.append('tags', JSON.stringify(form.tags.split(',').map((t) => t.trim())));
      }
      formData.append('status', form.status);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.updateProduct(productId, formData);
      setSuccess('Produit mis à jour avec succès');
      setTimeout(() => {
        router.push('/seller/products');
      }, 1500);
    } catch (error) {
      console.error('Erreur mise à jour produit:', error);
      setError('Erreur lors de la mise à jour du produit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/seller/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier Produit</h1>
          <p className="text-gray-600 mt-1">{form.name}</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Image du Produit</h2>

              {imagePreview && (
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}

              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Cliquez pour télécharger une image</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Informations Générales</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Produit *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  placeholder="Ex: T-Shirt Premium Coton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  placeholder="Décrivez votre produit..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="electronics">Électronique</option>
                    <option value="fashion">Mode</option>
                    <option value="home">Maison</option>
                    <option value="beauty">Beauté</option>
                    <option value="sports">Sports</option>
                    <option value="books">Livres</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="DRAFT">Brouillon</option>
                    <option value="ARCHIVED">Archivé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  placeholder="ex: premium, coton, été"
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarification et Inventaire</h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix de Vente *
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">$</span>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coût</label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">$</span>
                    <input
                      type="number"
                      name="cost"
                      value={form.cost}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  />
                </div>
              </div>

              {form.cost && form.price && form.cost > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Marge:</span> ${(form.price - form.cost).toFixed(2)} ({(((form.price - form.cost) / form.price) * 100).toFixed(1)}%)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>

                <Link
                  href="/seller/products"
                  className="block w-full text-center px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold"
                >
                  Annuler
                </Link>
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Conseils</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Utilisez des descriptions détaillées</li>
                <li>• Ajoutez une image de haute qualité</li>
                <li>• Définissez le stock correct</li>
                <li>• Utilisez des tags pertinents</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
