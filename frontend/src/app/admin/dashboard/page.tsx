'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { StatCard, SimpleBarChart, DataTable, StatusBadge, MetricCard } from '@/components/CRMComponents';
import {
  BarChart3, ShoppingBag, CheckCircle, AlertCircle, Users, Package,
  Store, TrendingUp, DollarSign, Eye, Settings, LogOut, Bell, Search,
  Filter, Download, Calendar, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalShops: number;
  activeShops: number;
  totalProducts: number;
  totalOrders: number;
  pendingShops: number;
  pendingProducts: number;
  monthlyRevenue: number;
  monthlyCommission: number;
  newUsersThisMonth: number;
  pendingOrders: number;
}

interface DailySale {
  label: string;
  value: number;
  orders: number;
}

interface Category {
  name: string;
  count: number;
  totalSales: number;
  percentage: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsData, salesData, categoriesData, ordersData, usersData] = await Promise.all([
        api.getAdminStats(),
        api.getDailySales(parseInt(timeRange)),
        api.getCategoriesStats(),
        api.getRecentOrders(5),
        api.getRecentUsers(5),
      ]);
      
      setStats(statsData);
      setDailySales(salesData);
      setCategories(categoriesData);
      setRecentOrders(ordersData);
      setRecentUsers(usersData);
    } catch (error) {
      console.error('Erreur chargement données dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  // Valeurs par défaut pour éviter les erreurs TypeScript
  const pendingShops = stats?.pendingShops ?? 0;
  const pendingProducts = stats?.pendingProducts ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const newUsersThisMonth = stats?.newUsersThisMonth ?? 0;

  return (
    <AdminLayout title="Dashboard" subtitle="Tableau de bord administrateur">
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
            <p className="text-sm text-gray-600 mt-1">
              Statistiques des {timeRange} derniers jours
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="7">7 jours</option>
              <option value="14">14 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
            </select>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">Mois</span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-blue-100 mb-1">Revenus mensuels</p>
              <p className="text-3xl font-bold">{formatPrice(stats?.monthlyRevenue || 0)}</p>
              <p className="text-xs text-blue-100 mt-2">
                Commission: {formatPrice(stats?.monthlyCommission || 0)}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                <ShoppingBag className="w-6 h-6" />
              </div>
              {stats && pendingOrders > 0 && (
                <span className="text-xs font-semibold bg-red-500 px-2 py-1 rounded">{pendingOrders} en attente</span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-100 mb-1">Total commandes</p>
              <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
              <p className="text-xs text-green-100 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Moyenne: {formatPrice((stats?.monthlyRevenue || 0) / (stats?.totalOrders || 1))}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                <Users className="w-6 h-6" />
              </div>
              {stats && newUsersThisMonth > 0 && (
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">+{newUsersThisMonth} ce mois</span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-purple-100 mb-1">Utilisateurs</p>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              <p className="text-xs text-purple-100 mt-2">
                Nouveaux ce mois: {stats?.newUsersThisMonth || 0}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                <Store className="w-6 h-6" />
              </div>
              {stats && pendingShops > 0 && (
                <span className="text-xs font-semibold bg-red-500 px-2 py-1 rounded">{pendingShops} en attente</span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-orange-100 mb-1">Boutiques</p>
              <p className="text-3xl font-bold">{stats?.totalShops || 0}</p>
              <p className="text-xs text-orange-100 mt-2">
                Actives: {stats?.activeShops || 0}
              </p>
            </div>
          </div>
        </div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Ventes quotidiennes</h3>
                <p className="text-sm text-gray-500 mt-1">Évolution des ventes sur {timeRange} jours</p>
              </div>
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 mr-1" />
                {dailySales.reduce((sum, d) => sum + d.orders, 0)} commandes
              </div>
            </div>
            {dailySales.length > 0 ? (
              <SimpleBarChart
                data={dailySales.map(d => ({ label: d.label, value: d.value }))}
                height={280}
                color="#3b82f6"
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>Aucune donnée de vente disponible</p>
              </div>
            )}
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Catégories populaires</h3>
                <p className="text-sm text-gray-500 mt-1">Top 5 des catégories</p>
              </div>
              <Link href="/admin/products" className="text-sm text-blue-600 hover:underline font-medium">
                Voir tout
              </Link>
            </div>
            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <div key={cat.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">{idx + 1}.</span>
                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{cat.count} produits</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-12 text-right">{cat.percentage}%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-6">
                      {cat.totalSales} ventes totales
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-8">Aucune catégorie disponible</p>
              )}
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  En attente d'approbation
                </h3>
                <p className="text-sm text-gray-500 mt-1">Éléments à valider</p>
              </div>
              {(pendingShops > 0 || pendingProducts > 0) && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                  {(pendingShops || 0) + (pendingProducts || 0)} total
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {pendingShops > 0 && (
                <div className="border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-orange-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{pendingShops} boutiques</div>
                        <div className="text-sm text-gray-600">En attente de validation</div>
                      </div>
                    </div>
                    <Link
                      href="/admin/shops/pending"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow"
                    >
                      Examiner
                    </Link>
                  </div>
                </div>
              )}
              
              {pendingProducts > 0 && (
                <div className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{pendingProducts} produits</div>
                        <div className="text-sm text-gray-600">En attente d'approbation</div>
                      </div>
                    </div>
                    <Link
                      href="/admin/products/pending"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow"
                    >
                      Examiner
                    </Link>
                  </div>
                </div>
              )}
              
              {(!pendingShops && !pendingProducts) && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Aucune approbation en attente</p>
                  <p className="text-sm text-gray-400 mt-1">Toutes les demandes ont été traitées</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Activité récente</h3>
                <p className="text-sm text-gray-500 mt-1">Dernières actions</p>
              </div>
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline font-medium">
                Voir tout
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 4).map((order, idx) => (
                  <div key={order._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      idx === 0 ? 'bg-green-100' : 
                      idx === 1 ? 'bg-blue-100' : 
                      idx === 2 ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      {idx === 0 ? <ShoppingBag className="w-5 h-5 text-green-600" /> :
                       idx === 1 ? <CheckCircle className="w-5 h-5 text-blue-600" /> :
                       idx === 2 ? <Clock className="w-5 h-5 text-purple-600" /> :
                       <Package className="w-5 h-5 text-orange-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Commande #{order.orderNumber || order._id.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.customerId?.firstName} {order.customerId?.lastName} • {formatPrice(order.total)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune activité récente</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Users Table */}
        {recentUsers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Nouveaux utilisateurs</h3>
                <p className="text-sm text-gray-500 mt-1">Inscriptions récentes</p>
              </div>
              <Link href="/admin/users" className="text-sm text-blue-600 hover:underline font-medium">
                Voir tous
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Utilisateur</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rôle</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date inscription</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                          user.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        {user.isEmailVerified ? (
                          <span className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Vérifié
                          </span>
                        ) : (
                          <span className="flex items-center text-orange-600 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            En attente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">Actions rapides</h3>
              <p className="text-blue-100 mt-1">Accès direct aux fonctions principales</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/admin/users/new" 
              className="bg-white/10 hover:bg-white/20 rounded-xl p-6 text-center backdrop-blur transition-all hover:scale-105 hover:shadow-xl border border-white/20"
            >
              <Users className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold">Nouvel utilisateur</div>
              <div className="text-xs text-white/80 mt-1">Créer un compte</div>
            </Link>
            <Link 
              href="/admin/shops/pending" 
              className="bg-white/10 hover:bg-white/20 rounded-xl p-6 text-center backdrop-blur transition-all hover:scale-105 hover:shadow-xl border border-white/20"
            >
              <Store className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold">Valider boutiques</div>
              <div className="text-xs text-white/80 mt-1">
                {pendingShops || 0} en attente
              </div>
            </Link>
            <Link 
              href="/admin/products/pending" 
              className="bg-white/10 hover:bg-white/20 rounded-xl p-6 text-center backdrop-blur transition-all hover:scale-105 hover:shadow-xl border border-white/20"
            >
              <Package className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold">Approuver produits</div>
              <div className="text-xs text-white/80 mt-1">
                {pendingProducts || 0} en attente
              </div>
            </Link>
            <Link 
              href="/admin/reports" 
              className="bg-white/10 hover:bg-white/20 rounded-xl p-6 text-center backdrop-blur transition-all hover:scale-105 hover:shadow-xl border border-white/20"
            >
              <BarChart3 className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold">Rapports</div>
              <div className="text-xs text-white/80 mt-1">Générer un rapport</div>
            </Link>
          </div>
        </div>
    </AdminLayout>
  );
}
