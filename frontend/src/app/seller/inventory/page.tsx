'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import SellerLayout from '@/components/SellerLayout';
import { AlertTriangle } from 'lucide-react';

export default function SellerInventoryPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.role === 'SELLER') {
      fetchProducts();
    }
  }, [user]);

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

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockProducts = filteredProducts.filter((p) => p.stock && p.stock < 10);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <SellerLayout activeTab="inventory" onSearch={handleSearch} title="Gestion du stock" subtitle="Suivez et gérez votre inventaire">
      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-900">Alerte stock faible</h3>
            <p className="text-sm text-orange-800">
              {lowStockProducts.length} produit(s) en rupture de stock imminente
            </p>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/50">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock < 10
                            ? 'bg-red-100 text-red-800'
                            : product.stock < 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.stock || 0} unités
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  );
}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-soeurise/logo-main.svg" alt="Soeurise" className="h-8" />
            <div className="h-6 w-px bg-gray-300/30" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              Seller CRM
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-all">
              <Bell className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500">Vendeuse</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-all"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200/50 min-h-screen sticky top-16 shadow-sm">
          <nav className="p-4 space-y-1">
            <Link
              href="/seller/dashboard"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                📊
              </div>
              Dashboard
            </Link>
            <Link
              href="/seller/products"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                📦
              </div>
              Produits
            </Link>
            <Link
              href="/seller/orders"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                🛍️
              </div>
              Commandes
            </Link>
            <Link
              href="/seller/customers"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                👥
              </div>
              Clients
            </Link>
            <Link
              href="/seller/analytics"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                📈
              </div>
              Analytics
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-200/50">
              <Link
                href="/seller/settings"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                  <Settings className="w-4 h-4" />
                </div>
                Paramètres
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion du stock</h2>
            <p className="text-gray-600">Suivez et gérez votre inventaire</p>
          </div>

          {/* Search */}
          <div className="mb-6 md:hidden">
            <input
              type="search"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900">Alerte stock faible</h3>
                <p className="text-sm text-orange-800">
                  {lowStockProducts.length} produit(s) en rupture de stock imminente
                </p>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sku || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock < 10
                                ? 'bg-red-100 text-red-800'
                                : product.stock < 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {product.stock || 0} unités
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        Aucun produit trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
