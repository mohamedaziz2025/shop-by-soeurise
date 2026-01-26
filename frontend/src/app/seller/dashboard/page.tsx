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
        fetchStats();
        return;
      }
      
      // Check if user has a shop
      try {
        const shop = await api.getMyShop().catch(() => null);
        if (shop && shop._id) {
          fetchStats();
        } else {
          router.push('/');
        }
      } catch (err) {
        router.push('/');
      }
    };
    
    checkAccess();
  }, [user, router, timeRange, isAuthenticated, isLoading]);

  const fetchStats = async () => {
    try {
      const data = await api.getSellerStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-soeurise/logo-main.svg" alt="Soeurise" className="h-8" />
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">Seller CRM</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Rechercher produits, commandes..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-64"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
            </button>
            
            {/* User Menu */}
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="text-right">
                <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-gray-500">Vendeuse</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
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
        <aside className="w-64 bg-white border-r min-h-screen sticky top-16">
          <nav className="p-4 space-y-1">
            <Link
              href="/seller/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-pink-50 text-pink-600 rounded-lg font-medium"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/seller/products"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700"
            >
              <Package className="w-5 h-5" />
              Produits
            </Link>
            <Link
              href="/seller/orders"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700"
            >
              <ShoppingBag className="w-5 h-5" />
              Commandes
            </Link>
            <Link
              href="/seller/customers"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700"
            >
              <Users className="w-5 h-5" />
              Clients
            </Link>
            <Link
              href="/seller/analytics"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700"
            >
              <TrendingUp className="w-5 h-5" />
              Analytics
            </Link>
            
            <div className="pt-4 mt-4 border-t">
              <Link
                href="/seller/settings"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700"
              >
                <Settings className="w-5 h-5" />
                Paramètres
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header with Time Range */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h2>
              <p className="text-gray-600 mt-1">Tableau de bord vendeuse</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">1 an</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Revenus par semaine</h3>
                <button className="text-sm text-pink-600 hover:underline">Voir détails</button>
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Statut des commandes</h3>
                <button className="text-sm text-pink-600 hover:underline">Voir tout</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Livrées</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats?.deliveredOrders || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">En cours</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats?.inProgressOrders || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-900">À traiter</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{stats?.pendingOrders || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-900">Annulées</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{stats?.cancelledOrders || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Commandes récentes</h3>
                <Link href="/seller/orders" className="text-sm text-pink-600 hover:underline">
                  Voir toutes
                </Link>
              </div>
              
              <div className="space-y-3">
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">#{order.orderNumber || order._id.slice(-6)}</span>
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
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatPrice(order.totalAmount || 0)}</div>
                        <button className="text-xs text-pink-600 hover:underline mt-1">
                          Voir détails
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Produits les plus vendus</h3>
                <Link href="/seller/products" className="text-sm text-pink-600 hover:underline">
                  Voir tous
                </Link>
              </div>
              
              <div className="space-y-3">
                {stats?.topProducts?.length > 0 ? (
                  stats.topProducts.map((product: any, idx: number) => (
                    <div key={product._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.salesCount || 0} ventes</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{formatPrice(product.price)}</div>
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
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-bold mb-6">Aperçu clients</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-900">{stats?.totalCustomers || 0}</div>
                <div className="text-sm text-blue-700 mt-1">Clients totaux</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-900">{stats?.returningCustomers || 0}%</div>
                <div className="text-sm text-green-700 mt-1">Clients fidèles</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-900">{stats?.averageRating?.toFixed(1) || '0.0'}</div>
                <div className="text-sm text-purple-700 mt-1">Satisfaction moyenne</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Actions rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/seller/products/new" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center backdrop-blur">
                <Package className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Ajouter produit</div>
              </Link>
              <Link href="/seller/orders?status=pending" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center backdrop-blur">
                <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Traiter commandes</div>
              </Link>
              <Link href="/seller/inventory" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center backdrop-blur">
                <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Gérer stock</div>
              </Link>
              <Link href="/seller/analytics" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center backdrop-blur">
                <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Voir rapports</div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
