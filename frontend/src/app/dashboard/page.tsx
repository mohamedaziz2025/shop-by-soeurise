'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Package, Heart, ShoppingBag, User, Store, MapPin, Mail, Phone, LogOut } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    if (isLoading) return; // Wait for auth initialization

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!user) {
      return;
    }

    // Rediriger selon le rôle
    if (user.role === 'SELLER') {
      router.push('/seller/dashboard');
      return;
    }
    if (user.role === 'ADMIN') {
      router.push('/admin/dashboard');
      return;
    }

    fetchDashboardData();
  }, [user, router, isAuthenticated, isLoading]);

  const fetchDashboardData = async () => {
    // Vérifier que l'utilisateur est toujours authentifié avant de faire les appels
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const [ordersData, favoritesData] = await Promise.all([
        api.getMyOrders().catch(() => []),
        api.getFavorites().catch(() => []),
      ]);

      setRecentOrders(ordersData.slice(0, 5));
      setFavorites(favoritesData.slice(0, 6));

      // Calculer les stats
      const totalSpent = ordersData.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      const completedOrders = ordersData.filter((o: any) => o.status === 'DELIVERED').length;

      setStats({
        totalOrders: ordersData.length,
        totalSpent,
        completedOrders,
        favorites: favoritesData.length,
      });
    } catch (error: any) {
      // Si erreur 401, l'utilisateur n'est plus authentifié
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
        return;
      }
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-soeurise/logo_soeurise.jpg" alt="Shop By Soeurise" className="h-8" />
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/marketplace" className="text-gray-600 hover:text-gray-900">
              Marketplace
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              Panier
            </Link>
            <Link href="/dashboard" className="text-pink-500 font-medium">
              Mon compte
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg p-8 text-white mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bienvenue, {user.firstName} ! 👋
              </h1>
              <p className="text-pink-100">
                Ravie de vous revoir sur Shop By Soeurise
              </p>
            </div>
            <Link
              href="/account"
              className="px-6 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:bg-pink-50 flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              Mon profil
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Commandes</span>
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats?.completedOrders || 0} livrées
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total dépensé</span>
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(stats?.totalSpent || 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Tous achats confondus</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Favoris</span>
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.favorites || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Produits enregistrés</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Membre depuis</span>
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : 'N/A'}
            </div>
            <div className="text-xs text-gray-500 mt-1">Date d'inscription</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Commandes récentes</h2>
                <Link href="/account/orders" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                  Voir tout →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Aucune commande pour le moment</p>
                  <Link
                    href="/marketplace"
                    className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600"
                  >
                    Découvrir nos produits
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-semibold">#{order.orderNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status === 'DELIVERED' ? 'Livrée' :
                               order.status === 'SHIPPED' ? 'Expédiée' :
                               order.status === 'PROCESSING' ? 'En préparation' : 'En attente'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{formatPrice(order.total)}</div>
                          <p className="text-xs text-gray-500">{order.items?.length || 0} articles</p>
                        </div>
                      </div>
                      <Link
                        href={`/account/orders`}
                        className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Voir les détails →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Mon profil</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-700">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-700">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.city && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-700">{user.city}, {user.country || 'France'}</p>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/account"
                className="block mt-4 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Modifier mon profil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>

            {/* Become Seller */}
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg p-6 border-2 border-pink-200">
              <Store className="w-10 h-10 text-pink-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Devenez vendeuse !</h3>
              <p className="text-sm text-gray-700 mb-4">
                Créez votre boutique et vendez vos créations à notre communauté
              </p>
              <Link
                href="/seller/register"
                className="block text-center px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600"
              >
                Créer ma boutique
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Liens rapides</h2>
              <div className="space-y-2">
                <Link
                  href="/account/orders"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  📦 Mes commandes
                </Link>
                <Link
                  href="/favorites"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  ❤️ Mes favoris
                </Link>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  ⚙️ Paramètres
                </Link>
                <Link
                  href="/contact"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  💬 Support
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  🚪 Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

