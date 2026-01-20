'use client';

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminReportsPage() {
  return (
    <AdminLayout title="Rapports" subtitle="Export & synthèses">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-700">Générez des rapports CSV/PDF depuis cette page.</p>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg">Exporter CSV</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Exporter PDF</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
