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
  const [sellerShop, setSellerShop] = useState<any | null>(null);
  const [hasShop, setHasShop] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    if (isLoading) return; // Wait for auth initialization

    if (!user) {
      return;
    }

    // Check for admin role
    if ((user as any).role === 'ADMIN') {
      router.push('/admin/dashboard');
      return;
    }

    // Check if the user owns a shop (render seller + client sections)
    (async () => {
      try {
        const shop = await api.getMyShop().catch(() => null);
        if (shop && shop._id) {
          setSellerShop(shop);
          setHasShop(true);
        } else {
          setSellerShop(null);
          setHasShop(false);
        }
      } catch (err) {
        setSellerShop(null);
        setHasShop(false);
      }
    })();

    fetchDashboardData();
  }, [user, router, isAuthenticated, isLoading]);

  const fetchDashboardData = async () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo-soeurise/logo_soeurise.jpg" alt="Shop By Soeurise" className="h-8 group-hover:shadow-lg transition-all duration-200" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Marketplace
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Panier
            </Link>
            <Link href="/dashboard" className="text-pink-600 font-semibold transition-colors">
              Mon compte
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-pink-600 via-rose-500 to-orange-500 rounded-2xl p-8 md:p-10 text-white mb-10 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                Bienvenue, {user.firstName} ! 👋
              </h1>
              <p className="text-pink-100 text-lg">
                Ravie de vous revoir sur Shop By Soeurise
              </p>
            </div>
            <Link
              href="/account"
              className="px-6 py-3 bg-white text-pink-600 rounded-xl font-semibold hover:bg-pink-50 flex items-center gap-2 transition-all hover:shadow-lg whitespace-nowrap"
            >
              <User className="w-5 h-5" />
              Mon profil
            </Link>
          </div>
        </div>

        {/* Seller Summary (if user owns a shop) */}
        {hasShop && sellerShop && (
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-10 border border-gray-200/50 hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Espace Vendeur</h2>
                <p className="text-gray-600 mt-2">Votre boutique : <span className="font-semibold text-gray-900">{sellerShop.name}</span></p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href={`/shops/${sellerShop.slug || sellerShop._id}`} className="px-4 py-2.5 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 font-semibold transition-all">
                  Voir la boutique
                </Link>
                <Link href="/seller/dashboard" className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                  Gérer ma boutique
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50 hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm font-medium">Commandes</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</div>
            <div className="text-xs text-gray-500 mt-2 font-medium">
              {stats?.completedOrders || 0} livrées
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50 hover:shadow-md hover:border-green-200 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm font-medium">Total dépensé</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(stats?.totalSpent || 0)}
            </div>
            <div className="text-xs text-gray-500 mt-2 font-medium">Tous achats confondus</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50 hover:shadow-md hover:border-pink-200 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm font-medium">Favoris</span>
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.favorites || 0}</div>
            <div className="text-xs text-gray-500 mt-2 font-medium">Produits enregistrés</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50 hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm font-medium">Membre depuis</span>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : 'N/A'}
            </div>
            <div className="text-xs text-gray-500 mt-2 font-medium">Date d'inscription</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Commandes récentes</h2>
                <Link href="/account/orders" className="text-pink-600 hover:text-pink-700 text-sm font-semibold transition-colors">
                  Voir tout →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-6 font-medium">Aucune commande pour le moment</p>
                  <Link
                    href="/marketplace"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Découvrir nos produits
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(recentOrders) && recentOrders.map((order) => (
                    <div key={order._id} className="border border-gray-200/50 rounded-lg p-5 hover:border-pink-300 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-bold text-gray-900">#{order.orderNumber}</span>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status === 'DELIVERED' ? '✓ Livrée' :
                               order.status === 'SHIPPED' ? '📦 Expédiée' :
                               order.status === 'PROCESSING' ? '⚙️ En préparation' : '⏳ En attente'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</div>
                          <p className="text-xs text-gray-500 mt-1">{order.items?.length || 0} articles</p>
                        </div>
                      </div>
                      <Link
                        href={`/account/orders`}
                        className="text-sm text-pink-600 hover:text-pink-700 font-semibold group-hover:underline transition-all"
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
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Mon profil</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Nom</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-gray-700 truncate">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Téléphone</p>
                      <p className="text-gray-700 truncate">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.city && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Localisation</p>
                      <p className="text-gray-700">{user.city}, {user.country || 'France'}</p>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/account"
                className="block w-full mt-6 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-all text-center"
              >
                Modifier mon profil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full mt-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>

            {/* Become Seller */}
            {!hasShop && (
              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-xl p-6 border-2 border-pink-200 hover:border-pink-300 transition-all">
                <div className="w-12 h-12 bg-pink-200 rounded-lg flex items-center justify-center mb-4">
                  <Store className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Devenez vendeuse !</h3>
                <p className="text-sm text-gray-700 mb-5 leading-relaxed">
                  Créez votre boutique et vendez vos créations à notre communauté
                </p>
                <Link
                  href="/seller/register"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Créer ma boutique
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Liens rapides</h2>
              <div className="space-y-2">
                <Link
                  href="/account/orders"
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-all group flex items-center gap-2"
                >
                  <span>📦</span> Mes commandes
                </Link>
                <Link
                  href="/favorites"
                  className="block px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg font-medium transition-all group flex items-center gap-2"
                >
                  <span>❤️</span> Mes favoris
                </Link>
                <Link
                  href="/account"
                  className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg font-medium transition-all group flex items-center gap-2"
                >
                  <span>⚙️</span> Paramètres
                </Link>
                <Link
                  href="/contact"
                  className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium transition-all group flex items-center gap-2"
                >
                  <span>💬</span> Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

