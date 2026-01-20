'use client';

import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable, StatusBadge } from '@/components/CRMComponents';

export default function AdminUsersPage() {
  const headers = ['Nom', 'Email', 'Rôle', 'Statut', 'Actions'];
  const rows = [
    [
      'Sophie Martin',
      'sophie@example.com',
      'CLIENT',
      <StatusBadge key="u1" status="Actif" type="success" />,
      <Link key="a1" href="#" className="text-blue-600 hover:underline">Voir</Link>,
    ],
    [
      'Aïcha Ben',
      'aicha@example.com',
      'SELLER',
      <StatusBadge key="u2" status="En validation" type="warning" />,
      <Link key="a2" href="#" className="text-blue-600 hover:underline">Voir</Link>,
    ],
  ];

  return (
    <AdminLayout title="Utilisateurs" subtitle="Gestion des comptes">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Liste des utilisateurs</h3>
          <Link href="/admin/users/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Nouveau</Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <DataTable headers={headers} rows={rows} />
        </div>
      </div>
    </AdminLayout>
  );
}
