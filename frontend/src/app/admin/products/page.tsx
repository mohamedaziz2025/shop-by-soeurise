'use client';

import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable, StatusBadge } from '@/components/CRMComponents';

export default function AdminProductsPage() {
  const headers = ['Produit', 'Boutique', 'Prix', 'Stock', 'Statut', 'Actions'];
  const rows = [
    ['Robe Éthique', 'Maison Zaynab', '59,00 €', 34, <StatusBadge key="p1" status="Approuvé" type="success" />, <Link key="v1" href="#" className="text-blue-600 hover:underline">Voir</Link>],
    ['Hijab Premium', 'Soeur Mode', '29,00 €', 120, <StatusBadge key="p2" status="En attente" type="warning" />, <Link key="v2" href="#" className="text-blue-600 hover:underline">Voir</Link>],
  ];

  return (
    <AdminLayout title="Produits" subtitle="Catalogue et validations">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Catalogue produits</h3>
          <Link href="/admin/products/pending" className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">À approuver</Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <DataTable headers={headers} rows={rows} />
        </div>
      </div>
    </AdminLayout>
  );
}
