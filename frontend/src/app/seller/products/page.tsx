'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getMyProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
      await api.updateProduct(productId, { status: newStatus });
      fetchProducts();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Supprimer ce produit ?')) {
      try {
        await api.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <img src="/logo-soeurise/logo-main.svg" alt="Soeurise" className="h-8 mb-6" />
            <nav className="space-y-2">
              <a href="/seller/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                📊 Dashboard
              </a>
              <a
                href="/seller/products"
                className="block px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
              >
                📦 Mes Produits
              </a>
              <a href="/seller/orders" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                🛒 Commandes
              </a>
              <a href="/seller/settings" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                ⚙️ Paramètres
              </a>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Mes Produits</h1>
            <a
              href="/seller/products/new"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau produit
            </a>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 mb-4">Aucun produit pour le moment</p>
              <a
                href="/seller/products/new"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Créer mon premier produit
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                            {product.images?.[0] && (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`${
                            product.stock > 10
                              ? 'text-green-600'
                              : product.stock > 0
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'DRAFT'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(product._id, product.status)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title={product.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                          >
                            {product.status === 'ACTIVE' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <a
                            href={`/seller/products/edit/${product._id}`}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
