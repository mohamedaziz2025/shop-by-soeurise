'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { StatCard, SimpleBarChart, DataTable, StatusBadge, MetricCard } from '@/components/CRMComponents';
import { 
  BarChart3, Package, ShoppingBag, TrendingUp, Euro, Users, 
  Star, Eye, Settings, LogOut, Bell, Search, Download, 
  ArrowUpRight, Clock, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (isLoading) return; // Wait for auth initialization

    if (!user) {
      return;
    }
    
    // Allow access if user is SELLER or has a shop
    const checkAccess = async () => {
      if (user.role === 'SELLER') {
        console.log('User is SELLER, fetching stats...');
        fetchStats();
        return;
      }
      
      // Check if user has a shop
      try {
        console.log('Checking if user has a shop...');
        const shop = await api.getMyShop().catch((error) => {
          console.error('Error fetching shop:', error);
          return null;
        });
        console.log('Shop data:', shop);
        if (shop && shop._id) {
          console.log('User has shop, fetching stats...');
          fetchStats();
        } else {
          console.log('User has no shop, redirecting...');
          router.push('/');
        }
      } catch (err) {
        console.error('Error in checkAccess:', err);
        router.push('/');
      }
    };
    
    checkAccess();
  }, [user, router, timeRange, isAuthenticated, isLoading]);

  const fetchStats = async () => {
    try {
      console.log('Fetching seller stats...');
      const data = await api.getSellerStats();
      console.log('Stats data received:', data);
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      // Set empty stats on error to prevent crashes
      setStats({
        revenue: 0,
        ordersCount: 0,
        pendingOrders: 0,
        activeProducts: 0,
        deliveredOrders: 0,
        inProgressOrders: 0,
        cancelledOrders: 0,
        totalCustomers: 0,
        returningCustomers: 0,
        recentOrders: [],
        topProducts: [],
        averageRating: 0,
        totalReviews: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!user) {
    return null;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-soeurise/logo-main.svg" alt="Soeurise" className="h-8" />
            <div className="h-6 w-px bg-gray-300/30" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">Seller CRM</h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 w-64 transition-all"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2.5 hover:bg-gray-100/50 rounded-lg transition-colors group">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200/50">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">{user.firstName}</div>
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
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-50 to-pink-0 text-pink-600 rounded-xl font-semibold transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg group-hover:shadow-lg transition-all">
                <BarChart3 className="w-4 h-4" />
              </div>
              Dashboard
            </Link>
            <Link
              href="/seller/products"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                <Package className="w-4 h-4" />
              </div>
              Produits
            </Link>
            <Link
              href="/seller/orders"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                <ShoppingBag className="w-4 h-4" />
              </div>
              Commandes
            </Link>
            <Link
              href="/seller/customers"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                <Users className="w-4 h-4" />
              </div>
              Clients
            </Link>
            <Link
              href="/seller/analytics"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-gray-700 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-200 transition-all">
                <TrendingUp className="w-4 h-4" />
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
          {/* Header with Time Range */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Vue d'ensemble</h2>
              <p className="text-gray-600 mt-1 text-sm">Tableau de bord de votre boutique</p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">1 an</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all font-semibold">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Ventes du mois"
              value={formatPrice(stats?.revenue || 0)}
              subtitle={`${stats?.ordersCount || 0} commandes`}
              icon={<Euro className="w-6 h-6" />}
              trend={{ value: '+12.3%', isPositive: true }}
              color="green"
            />
            
            <StatCard
              title="Commandes en attente"
              value={stats?.pendingOrders || 0}
              subtitle="À traiter"
              icon={<ShoppingBag className="w-6 h-6" />}
              trend={{ value: '-5.2%', isPositive: true }}
              color="orange"
            />
            
            <StatCard
              title="Produits actifs"
              value={stats?.activeProducts || 0}
              subtitle={`${stats?.totalProducts || 0} au total`}
              icon={<Package className="w-6 h-6" />}
              trend={{ value: '+8.1%', isPositive: true }}
              color="blue"
            />
            
            <StatCard
              title="Note moyenne"
              value={`${stats?.averageRating?.toFixed(1) || '0.0'} ⭐`}
              subtitle={`${stats?.totalReviews || 0} avis`}
              icon={<Star className="w-6 h-6" />}
              trend={{ value: '+0.3', isPositive: true }}
              color="purple"
            />
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Taux de conversion"
              value="4.2%"
              change={15.8}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <MetricCard
              title="Visiteurs uniques"
              value="1,234"
              change={22.5}
              icon={<Eye className="w-5 h-5" />}
            />
            <MetricCard
              title="Panier moyen"
              value={formatPrice(58.90)}
              change={7.3}
              icon={<ShoppingBag className="w-5 h-5" />}
            />
            <MetricCard
              title="Clients récurrents"
              value="38%"
              change={-3.2}
              icon={<Users className="w-5 h-5" />}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Revenus par semaine</h3>
                <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">Voir détails</button>
              </div>
              <SimpleBarChart
                data={[
                  { label: 'S1', value: 2400 },
                  { label: 'S2', value: 3100 },
                  { label: 'S3', value: 2800 },
                  { label: 'S4', value: 3900 },
                ]}
                height={250}
                color="#ec4899"
              />
            </div>

            {/* Orders Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Statut des commandes</h3>
                <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">Voir tout</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Livrées</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats?.deliveredOrders || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-900">En cours</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats?.inProgressOrders || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200/50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="font-semibold text-gray-900">À traiter</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{stats?.pendingOrders || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200/50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Annulées</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{stats?.cancelledOrders || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Commandes récentes</h3>
                <Link href="/seller/orders" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                  Voir toutes
                </Link>
              </div>
              
              <div className="space-y-3">
                {stats?.recentOrders && Array.isArray(stats.recentOrders) && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50 hover:shadow-md cursor-pointer transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">#{order.orderNumber || (order._id && typeof order._id === 'string' ? order._id.slice(-6) : 'N/A')}</span>
                          <StatusBadge 
                            status={order.status} 
                            type={
                              order.status === 'DELIVERED' ? 'success' : 
                              order.status === 'CANCELLED' ? 'error' : 
                              order.status === 'PENDING' ? 'warning' : 'info'
                            }
                          />
                        </div>
                        <div className="text-sm text-gray-600">{order.customerName || 'Client'}</div>
                        <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-gray-900">{formatPrice(order.totalAmount || 0)}</div>
                        <button className="text-xs text-pink-600 hover:text-pink-700 font-medium mt-1">
                          Détails
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">Aucune commande récente</p>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Produits les plus vendus</h3>
                <Link href="/seller/products" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                  Voir tous
                </Link>
              </div>
              
              <div className="space-y-3">
                {stats?.topProducts && Array.isArray(stats.topProducts) && stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product: any, idx: number) => (
                    <div key={product._id} className="flex items-center gap-3 p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.salesCount || 0} ventes</div>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <div className="font-bold text-sm text-gray-900">{formatPrice(product.price)}</div>
                        <div className="text-xs text-gray-500">{formatPrice((product.price * (product.salesCount || 0)))}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">Aucune vente encore</p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Insights */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Aperçu clients</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-900">{stats?.totalCustomers || 0}</div>
                <div className="text-sm text-blue-700 mt-2 font-medium">Clients totaux</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200/50">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-900">{stats?.returningCustomers || 0}%</div>
                <div className="text-sm text-green-700 mt-2 font-medium">Clients fidèles</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-900">{stats?.averageRating?.toFixed(1) || '0.0'}</div>
                <div className="text-sm text-purple-700 mt-2 font-medium">Satisfaction moyenne</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-500 rounded-xl p-8 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-6">Actions rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/seller/products/new" className="bg-white/15 hover:bg-white/25 rounded-lg p-4 text-center backdrop-blur transition-all group">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg mb-3 group-hover:bg-white/30 transition-all">
                  <Package className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold">Ajouter produit</div>
              </Link>
              <Link href="/seller/orders?status=pending" className="bg-white/15 hover:bg-white/25 rounded-lg p-4 text-center backdrop-blur transition-all group">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg mb-3 group-hover:bg-white/30 transition-all">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold">Traiter commandes</div>
              </Link>
              <Link href="/seller/inventory" className="bg-white/15 hover:bg-white/25 rounded-lg p-4 text-center backdrop-blur transition-all group">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg mb-3 group-hover:bg-white/30 transition-all">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold">Gérer stock</div>
              </Link>
              <Link href="/seller/analytics" className="bg-white/15 hover:bg-white/25 rounded-lg p-4 text-center backdrop-blur transition-all group">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg mb-3 group-hover:bg-white/30 transition-all">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold">Voir rapports</div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
