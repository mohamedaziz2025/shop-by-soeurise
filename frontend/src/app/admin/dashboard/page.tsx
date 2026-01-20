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
  Filter, Download, Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats admin:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <AdminLayout title="Dashboard" subtitle="Tableau de bord administrateur">
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Vue d'ensemble</h2>
            <p className="text-sm text-gray-600">Statistiques des 30 derniers jours</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
              <option value="90d">90 jours</option>
              <option value="1y">1 an</option>
            </select>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Revenus totaux"
            value={stats?.totalRevenue ? formatPrice(stats.totalRevenue) : '0,00 €'}
           
            icon={<DollarSign className="w-6 h-6" />}
          />
          <StatCard
            title="Commandes"
            value={stats?.totalOrders || 0}
           
            icon={<ShoppingBag className="w-6 h-6" />}
          />
          <StatCard
            title="Utilisateurs"
            value={stats?.totalUsers || 0}
           
            icon={<Users className="w-6 h-6" />}
          />
          <StatCard
            title="Boutiques actives"
            value={stats?.activeShops || 0}
            
            icon={<Store className="w-6 h-6" />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Ventes par jour</h3>
              <button className="text-sm text-blue-600 hover:underline">Voir détails</button>
            </div>
            <SimpleBarChart
              data={[
                { label: 'Lun', value: 12500 },
                { label: 'Mar', value: 18300 },
                { label: 'Mer', value: 15600 },
                { label: 'Jeu', value: 21400 },
                { label: 'Ven', value: 19800 },
                { label: 'Sam', value: 28900 },
                { label: 'Dim', value: 25100 },
              ]}
              height={250}
              color="#3b82f6"
            />
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Catégories populaires</h3>
              <button className="text-sm text-blue-600 hover:underline">Voir tout</button>
            </div>
            <div className="space-y-4">
              {['Vêtements', 'Accessoires', 'Beauté', 'Maison', 'Enfants'].map((cat, idx) => {
                const values = [45, 32, 28, 18, 12];
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{cat}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${values[idx]}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{values[idx]}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  En attente d'approbation
                </h3>
                <StatusBadge status={`${stats?.pendingShops || 0} en attente`} type="warning" />
              </div>
              
              <div className="space-y-3">
                {stats?.pendingShops > 0 ? (
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Store className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">{stats.pendingShops} boutiques</div>
                          <div className="text-sm text-gray-600">À valider</div>
                        </div>
                      </div>
                      <Link
                        href="/admin/shops?status=pending"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Examiner
                      </Link>
                    </div>
                  </div>
                ) : null}
                
                {stats?.pendingProducts > 0 ? (
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{stats.pendingProducts} produits</div>
                          <div className="text-sm text-gray-600">À approuver</div>
                        </div>
                      </div>
                      <Link
                        href="/admin/products?approved=false"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Examiner
                      </Link>
                    </div>
                  </div>
                ) : null}
                
                {(!stats?.pendingShops && !stats?.pendingProducts) && (
                  <p className="text-center text-gray-500 py-8">Aucune approbation en attente</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Activité récente</h3>
                <button className="text-sm text-blue-600 hover:underline">Voir tout</button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Nouvelle commande #1234</p>
                    <p className="text-xs text-gray-500">Il y a 5 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Nouvel utilisateur inscrit</p>
                    <p className="text-xs text-gray-500">Il y a 12 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Store className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Boutique "Ma Boutique" créée</p>
                    <p className="text-xs text-gray-500">Il y a 1 heure</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">15 nouveaux produits ajoutés</p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Actions rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/users/new" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center backdrop-blur">
                <Users className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Nouvel utilisateur</div>
              </Link>
              <Link href="/admin/shops/pending" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center backdrop-blur">
                <Store className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Valider boutiques</div>
              </Link>
              <Link href="/admin/products/pending" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center backdrop-blur">
                <Package className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Approuver produits</div>
              </Link>
              <Link href="/admin/reports" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center backdrop-blur">
                <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Générer rapport</div>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
