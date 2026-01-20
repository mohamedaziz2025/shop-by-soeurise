'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/CRMComponents';

export default function AdminProductsPendingPage() {
  return (
    <AdminLayout title="Produits à approuver" subtitle="Validation des nouveaux produits">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <DataTable headers={["Produit", "Boutique", "Prix", "Actions"]} rows={[]} emptyMessage="Aucun produit en attente" />
        </div>
      </div>
    </AdminLayout>
  );
}
