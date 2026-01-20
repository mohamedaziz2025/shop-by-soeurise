'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/CRMComponents';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function AdminCommissionsPage() {
  return (
    <AdminLayout title="Commissions" subtitle="Revenus de la plateforme">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Commissions (30j)" value="3 245 €" icon={<DollarSign className="w-6 h-6" />} color="blue" />
          <StatCard title="Taux moyen" value="12%" icon={<TrendingUp className="w-6 h-6" />} color="green" />
          <StatCard title="Payouts en attente" value={6} icon={<DollarSign className="w-6 h-6" />} color="orange" />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-700">Historique des commissions et versements à venir.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
