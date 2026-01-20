'use client';

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminUserNewPage() {
  return (
    <AdminLayout title="Nouvel utilisateur" subtitle="Créer un compte admin ou vendeur">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border border-gray-300 rounded-md px-3 py-2" placeholder="Prénom" />
            <input className="border border-gray-300 rounded-md px-3 py-2" placeholder="Nom" />
            <input className="border border-gray-300 rounded-md px-3 py-2 md:col-span-2" placeholder="Email" />
            <select className="border border-gray-300 rounded-md px-3 py-2 md:col-span-2">
              <option>CLIENT</option>
              <option>SELLER</option>
              <option>ADMIN</option>
            </select>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg w-fit">Créer</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
