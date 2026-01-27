'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  DollarSign,
  Shield,
  AlertTriangle,
  Trash2,
  Ban,
  CheckCircle,
  Clock,
  Edit,
  Download,
  MoreHorizontal
} from 'lucide-react';

interface Order {
  _id: string;
  id?: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  itemsCount: number;
}

interface UserDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastLoginAt?: string;
  totalSpent: number;
  orderCount: number;
  recentOrders: Order[];
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllUsers();
      const foundUser = data.find((u: any) => u.id === userId);
      if (foundUser) {
        setUser({
          ...foundUser,
          totalSpent: foundUser.totalSpent || 0,
          orderCount: foundUser.ordersCount || 0,
          recentOrders: foundUser.recentOrders || []
        } as UserDetail);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!user) return;
    try {
      setActionLoading('ban');
      await api.banUser(user.id);
      alert('Utilisateur banni avec succès');
      await fetchUserDetail();
      setShowActionMenu(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du bannissement');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async () => {
    if (!user) return;
    try {
      setActionLoading('unban');
      await api.unbanUser(user.id);
      alert('Utilisateur débanni avec succès');
      await fetchUserDetail();
      setShowActionMenu(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du débannissement');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    try {
      setActionLoading('delete');
      await api.deleteUser(user.id);
      alert('Utilisateur supprimé avec succès');
      router.push('/admin/users');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'INACTIVE': return 'text-gray-600 bg-gray-100';
      case 'SUSPENDED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-purple-600 bg-purple-100';
      case 'SELLER': return 'text-blue-600 bg-blue-100';
      case 'USER': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Détails utilisateur" subtitle="">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="Détails utilisateur" subtitle="">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Utilisateur non trouvé</h3>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Détails utilisateur" subtitle={`${user.firstName} ${user.lastName}`}>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <div className="relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            {showActionMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-20 border border-gray-200 overflow-hidden">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowActionMenu(false);
                      }}
                      disabled={actionLoading !== null}
                      className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Supprimer l'utilisateur
                    </button>
                    {user.status !== 'SUSPENDED' ? (
                      <button
                        onClick={handleBanUser}
                        disabled={actionLoading !== null}
                        className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 transition-colors"
                      >
                        <Ban className="w-4 h-4 mr-3" />
                        {actionLoading === 'ban' ? 'Bannissement...' : 'Bannir'}
                      </button>
                    ) : (
                      <button
                        onClick={handleUnbanUser}
                        disabled={actionLoading !== null}
                        className="flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full text-left disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-3" />
                        {actionLoading === 'unban' ? 'Débannissement...' : 'Débannir'}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">ID: {user.id.substring(0, 16)}...</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${getRoleColor(user.role)}`}>
                {user.role === 'ADMIN' && <Shield className="w-3.5 h-3.5" />}
                {user.role}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(user.status)}`}>
                {user.status === 'ACTIVE' && <CheckCircle className="w-3.5 h-3.5" />}
                {user.status === 'SUSPENDED' && <AlertTriangle className="w-3.5 h-3.5" />}
                {user.status === 'INACTIVE' && <Clock className="w-3.5 h-3.5" />}
                {user.status}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="text-gray-900 font-medium break-all">{user.email}</p>
            </div>

            {user.phone && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Téléphone</span>
                </div>
                <p className="text-gray-900 font-medium">{user.phone}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Inscription</span>
              </div>
              <p className="text-gray-900 font-medium">
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {user.lastLoginAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Dernière connexion</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {new Date(user.lastLoginAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-sm font-medium">Commandes</span>
              </div>
              <p className="text-gray-900 font-semibold text-lg">{user.orderCount}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Total dépensé</span>
              </div>
              <p className="text-gray-900 font-semibold text-lg">{user.totalSpent} €</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        {user.recentOrders && user.recentOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
              <p className="text-sm text-gray-500 mt-1">{user.recentOrders.length} dernières commandes</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">N° Commande</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Articles</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {user.recentOrders.map((order) => (
                    <tr key={order._id || order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.itemsCount} article{order.itemsCount > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {order.total} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Export Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
            <Download className="w-4 h-4" />
            Exporter les données
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => !actionLoading && setShowDeleteConfirm(false)} />
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium">Supprimer l'utilisateur</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Confirmer la suppression de <strong>{user.firstName} {user.lastName}</strong> ? Cette action ne peut pas être annulée.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === 'delete' ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
