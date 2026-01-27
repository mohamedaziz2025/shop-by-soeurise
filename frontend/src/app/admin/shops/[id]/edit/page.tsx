'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Shop {
  _id?: string;
  id?: string;
  slug?: string;
  name: string;
  description: string;
  owner: {
    _id?: string;
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  category: string;
  location?: string;
  createdAt: string;
  productsCount?: number;
  totalSales?: number;
  rating?: number;
  logo?: string;
}

export default function EditShopPage() {
  const router = useRouter();
  const params = useParams();
  const shopId = params.id as string;

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: ''
  });

  useEffect(() => {
    fetchShop();
  }, [shopId]);

  const fetchShop = async () => {
    try {
      setLoading(true);
      const data = await api.getAllShops();
      const foundShop = data.find((s: any) => (s._id || s.id) === shopId);
      if (foundShop) {
        setShop(foundShop);
        setFormData({
          name: foundShop.name,
          description: foundShop.description || '',
          category: foundShop.category,
          location: foundShop.location || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la boutique:', error);
      alert('Erreur lors du chargement de la boutique');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    try {
      setSaving(true);
      await api.updateShopAdmin(shopId, formData);
      alert('Boutique mise à jour avec succès');
      router.push('/admin/shops');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Modifier la boutique">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (!shop) {
    return (
      <AdminLayout title="Modifier la boutique">
        <div className="text-center py-12">
          <p className="text-gray-500">Boutique non trouvée</p>
          <button
            onClick={() => router.push('/admin/shops')}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Retour à la liste
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Modifier la boutique" subtitle={shop?.name}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/shops')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modifier la boutique</h1>
              <p className="text-gray-600">{shop.name}</p>
            </div>
          </div>
        </div>

        {/* Shop Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg flex items-center justify-center overflow-hidden">
              {shop.logo ? (
                <img
                  src={shop.logo.startsWith('http') ? shop.logo : `http://72.62.71.97:3001${shop.logo}`}
                  alt={shop.name}
                  className="object-contain h-full w-full p-2"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div class="w-12 h-12 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center text-lg font-bold text-pink-700">
                          ${shop.name.charAt(0).toUpperCase()}
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-pink-700">
                    {shop.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
              <p className="text-sm text-gray-600">{shop.category}</p>
              <p className="text-sm text-gray-500">Propriétaire: {shop.owner?.firstName} {shop.owner?.lastName}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la boutique</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Mode">Mode</option>
                <option value="Cosmétiques">Cosmétiques</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ville, Pays"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/shops')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}