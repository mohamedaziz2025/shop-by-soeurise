'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalShops: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    userGrowth: number;
    shopGrowth: number;
    productGrowth: number;
    orderGrowth: number;
    revenueGrowth: number;
  };
  salesByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topCategories: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
  userActivity: {
    activeUsers: number;
    newUsers: number;
    returningUsers: number;
  };
  shopPerformance: Array<{
    shopName: string;
    revenue: number;
    orders: number;
    rating: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // TODO: Remplacer par l'appel API réel
      const mockAnalytics: AnalyticsData = {
        overview: {
          totalUsers: 1250,
          totalShops: 45,
          totalProducts: 3200,
          totalOrders: 890,
          totalRevenue: 125000,
          userGrowth: 12.5,
          shopGrowth: 8.3,
          productGrowth: 15.2,
          orderGrowth: -2.1,
          revenueGrowth: 18.7
        },
        salesByMonth: [
          { month: 'Jan', revenue: 8500, orders: 45 },
          { month: 'Fév', revenue: 9200, orders: 52 },
          { month: 'Mar', revenue: 7800, orders: 38 },
          { month: 'Avr', revenue: 10500, orders: 67 },
          { month: 'Mai', revenue: 12300, orders: 78 },
          { month: 'Jun', revenue: 11800, orders: 72 }
        ],
        topCategories: [
          { category: 'Vêtements', sales: 45000, percentage: 36 },
          { category: 'Accessoires', sales: 32000, percentage: 26 },
          { category: 'Bijoux', sales: 28000, percentage: 22 },
          { category: 'Maison', sales: 15000, percentage: 12 },
          { category: 'Autres', sales: 5000, percentage: 4 }
        ],
        userActivity: {
          activeUsers: 892,
          newUsers: 156,
          returningUsers: 736
        },
        shopPerformance: [
          { shopName: 'Mode & Style', revenue: 25000, orders: 145, rating: 4.8 },
          { shopName: 'Bijoux Créatifs', revenue: 18500, orders: 98, rating: 4.6 },
          { shopName: 'Maison & Déco', revenue: 15200, orders: 76, rating: 4.4 },
          { shopName: 'Accessoires Chic', revenue: 12800, orders: 67, rating: 4.7 },
          { shopName: 'Vintage Corner', revenue: 9800, orders: 52, rating: 4.5 }
        ]
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Erreur lors du chargement des analyses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Analyses" subtitle="Statistiques et performances de la plateforme">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analyses" subtitle="Statistiques et performances de la plateforme">
      <div className="space-y-8">
        {/* Time Range Selector */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {[
              { value: '7d', label: '7 jours' },
              { value: '30d', label: '30 jours' },
              { value: '90d', label: '90 jours' },
              { value: '1y', label: '1 an' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  timeRange === range.value
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics?.overview.totalUsers || 0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{analytics?.overview.userGrowth}%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Boutiques</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.overview.totalShops || 0}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{analytics?.overview.shopGrowth}%</span>
                </div>
              </div>
              <Store className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produits</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics?.overview.totalProducts || 0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{analytics?.overview.productGrowth}%</span>
                </div>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.overview.totalOrders || 0}</p>
                <div className="flex items-center mt-1">
                  {analytics?.overview.orderGrowth && analytics.overview.orderGrowth > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${analytics?.overview.orderGrowth && analytics.overview.orderGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics?.overview.orderGrowth && analytics.overview.orderGrowth > 0 ? '+' : ''}{analytics?.overview.orderGrowth}%
                  </span>
                </div>
              </div>
              <ShoppingCart className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics?.overview.totalRevenue || 0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{analytics?.overview.revenueGrowth}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Évolution des ventes</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics?.salesByMonth.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(month.revenue / Math.max(...analytics.salesByMonth.map(m => m.revenue))) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(month.revenue)}</div>
                    <div className="text-xs text-gray-500">{month.orders} cmd</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Ventes par catégorie</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics?.topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: [
                          '#3B82F6', // blue
                          '#10B981', // green
                          '#F59E0B', // yellow
                          '#EF4444', // red
                          '#8B5CF6'  // purple
                        ][index % 5]
                      }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(category.sales)}</div>
                    <div className="text-xs text-gray-500">{category.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Activity & Shop Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Activité utilisateurs</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{analytics?.userActivity.activeUsers}</div>
                <div className="text-sm text-gray-600">Utilisateurs actifs</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl font-semibold text-blue-600">{analytics?.userActivity.newUsers}</div>
                  <div className="text-xs text-blue-600">Nouveaux</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl font-semibold text-green-600">{analytics?.userActivity.returningUsers}</div>
                  <div className="text-xs text-green-600">Récurrents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Shops */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Top boutiques</h3>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics?.shopPerformance.map((shop, index) => (
                <div key={shop.shopName} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                      <span className="text-xs font-medium text-gray-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{shop.shopName}</div>
                      <div className="text-xs text-gray-500">{shop.orders} commandes</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(shop.revenue)}</div>
                    <div className="flex items-center text-xs text-gray-500">
                      ★ {shop.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Métriques supplémentaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4.6</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
              <div className="text-xs text-gray-500 mt-1">Sur 5 étoiles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2.3j</div>
              <div className="text-sm text-gray-600">Temps de livraison moyen</div>
              <div className="text-xs text-gray-500 mt-1">En jours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">94%</div>
              <div className="text-sm text-gray-600">Taux de satisfaction</div>
              <div className="text-xs text-gray-500 mt-1">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}