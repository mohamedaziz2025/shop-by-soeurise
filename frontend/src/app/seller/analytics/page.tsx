'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import SellerLayout from '@/components/SellerLayout';
import { Download, TrendingUp } from 'lucide-react';

export default function SellerAnalyticsPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    if (user?.role === 'SELLER') {
      fetchAnalytics();
    }
  }, [user, period]);

  const fetchAnalytics = async () => {
    try {
      const data = await api.getSellerStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <SellerLayout activeTab="analytics" title="Analytics & Rapports" subtitle="Analysez vos performances de vente">
      {/* Header with Export Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">1 an</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg hover:shadow-lg font-semibold transition-all">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
          <div className="text-4xl font-bold text-pink-600 mb-2">
            €{stats?.revenue ? stats.revenue.toFixed(2) : '0.00'}
          </div>
          <p className="text-gray-600 text-sm">Revenu total</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {stats?.ordersCount || 0}
          </div>
          <p className="text-gray-600 text-sm">Commandes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {stats?.activeProducts || 0}
          </div>
          <p className="text-gray-600 text-sm">Produits actifs</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}⭐
          </div>
          <p className="text-gray-600 text-sm">Note moyenne</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50 h-80 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Graphique des revenus</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/50 h-80 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Graphique des commandes</p>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
