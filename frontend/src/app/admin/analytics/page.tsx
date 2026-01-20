'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { StatCard, SimpleBarChart, DataTable } from '@/components/CRMComponents';
import { BarChart3, Users, Package, Store, DollarSign } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout title="Analytics" subtitle="Statistiques détaillées">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="CA (30j)" value="12 540 €" icon={<DollarSign className="w-6 h-6" />} color="indigo" />
          <StatCard title="Nouv. utilisateurs" value={154} icon={<Users className="w-6 h-6" />} color="green" />
          <StatCard title="Produits vendus" value={892} icon={<Package className="w-6 h-6" />} color="purple" />
          <StatCard title="Boutiques actives" value={42} icon={<Store className="w-6 h-6" />} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Ventes par jour</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
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
              height={260}
              color="#6366F1"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Catégories performantes</h3>
            <DataTable
              headers={["Catégorie", "Ventes", "Panier moyen"]}
              rows={[
                ["Vêtements", "1 254", "45,30 €"],
                ["Accessoires", "892", "32,10 €"],
                ["Beauté", "648", "28,40 €"],
              ]}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
