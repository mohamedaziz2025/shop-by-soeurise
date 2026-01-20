'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable, StatusBadge } from '@/components/CRMComponents';

export default function AdminOrdersPage() {
  const headers = ['Commande', 'Client', 'Montant', 'Date', 'Statut'];
  const rows = [
    ['#1234', 'Sophie', '89,00 €', '2026-01-14', <StatusBadge key="o1" status="Payée" type="success" />],
    ['#1235', 'Aïcha', '29,00 €', '2026-01-15', <StatusBadge key="o2" status="En cours" type="info" />],
  ];
  return (
    <AdminLayout title="Commandes" subtitle="Suivi et gestion des commandes">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <DataTable headers={headers} rows={rows} />
        </div>
      </div>
    </AdminLayout>
  );
}
