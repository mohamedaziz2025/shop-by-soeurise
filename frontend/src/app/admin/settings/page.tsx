'use client';

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSettingsPage() {
  return (
    <AdminLayout title="Paramètres" subtitle="Configuration système">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold mb-4">Général</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border border-gray-300 rounded-md px-3 py-2" placeholder="Nom du marketplace" />
            <input className="border border-gray-300 rounded-md px-3 py-2" placeholder="Email support" />
            <select className="border border-gray-300 rounded-md px-3 py-2 md:col-span-2">
              <option>EUR (€)</option>
              <option>USD ($)</option>
            </select>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg w-fit">Enregistrer</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
