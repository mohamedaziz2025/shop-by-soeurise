'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/CRMComponents';

export default function AdminShopsPendingPage() {
  return (
    <AdminLayout title="Boutiques à valider" subtitle="Demandes d'ouverture">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <DataTable headers={["Boutique", "Propriétaire", "Date", "Actions"]} rows={[]} emptyMessage="Aucune boutique en attente" />
        </div>
      </div>
    </AdminLayout>
  );
}
