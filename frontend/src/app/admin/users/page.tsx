'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import {
  Search,
  MoreHorizontal,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Phone,
  User,
  Shield,
  AlertTriangle,
  Trash2,
  Eye
} from 'lucide-react';

interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastLoginAt?: string;
  ordersCount?: number;
  totalSpent?: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, roleFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = Array.isArray(users) ? users : [];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'INACTIVE': return 'text-gray-600 bg-gray-100';
      case 'SUSPENDED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'INACTIVE': return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'SUSPENDED': return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
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

  const handleBanUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      await api.banUser(userId);
      await fetchUsers();
      setShowActionMenu(null);
      // Toast success
      alert('Utilisateur banni avec succès');
    } catch (error) {
      console.error('Erreur lors du bannissement:', error);
      alert('Erreur lors du bannissement');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      await api.unbanUser(userId);
      await fetchUsers();
      setShowActionMenu(null);
      // Toast success
      alert('Utilisateur débanni avec succès');
    } catch (error) {
      console.error('Erreur lors du débannissement:', error);
      alert('Erreur lors du débannissement');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(selectedUser.id);
      await api.deleteUser(selectedUser.id);
      await fetchUsers();
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      // Toast success
      alert('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des utilisateurs" subtitle="Gérer les comptes utilisateurs">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des utilisateurs" subtitle="Gérer les comptes utilisateurs">
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Add User button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-gray-600">Gérez et modifiez tous les utilisateurs de la plateforme</p>
          </div>
          <a
            href="/admin/users/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <User className="w-4 h-4" />
            Ajouter un utilisateur
          </a>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 sm:gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:w-40 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous</option>
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="SUSPENDED">Banni</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="flex-1 sm:w-40 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous</option>
                <option value="USER">Client</option>
                <option value="SELLER">Vendeur</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Gestion complète des comptes utilisateurs</p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Activité</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
                  <tr key={user.id || user.email} className="hover:bg-slate-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-gray-500 font-mono">ID: {user.id ? user.id.substring(0, 8) + '...' : 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{user.email}</div>
                      {user.phone && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" />{user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${getRoleColor(user.role)} border-0`}>
                        {user.role === 'ADMIN' && <Shield className="w-3.5 h-3.5" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(user.status)} border-0`}>
                        {getStatusIcon(user.status)}
                        <span>{user.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-900 font-medium">{user.ordersCount || 0} cmd</div>
                      <div className="text-gray-500 text-xs">{user.totalSpent || 0} €</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === (user.id || user.email) ? null : (user.id || user.email))}
                          className="text-gray-400 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {showActionMenu === (user.id || user.email) && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-20 border border-gray-200 overflow-hidden">
                              <div className="py-2">
                                <button className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 w-full text-left transition-colors">
                                  <Eye className="w-4 h-4 mr-3 text-gray-400" />Voir le profil
                                </button>
                                <button className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 w-full text-left transition-colors">
                                  <Edit className="w-4 h-4 mr-3 text-gray-400" />Modifier
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                {user.status !== 'SUSPENDED' ? (
                                  <button
                                    onClick={() => user.id && handleBanUser(user.id)}
                                    disabled={actionLoading === user.id}
                                    className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 transition-colors"
                                  >
                                    <Ban className="w-4 h-4 mr-3" />
                                    {actionLoading === user.id ? 'Bannissement...' : 'Bannir'}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => user.id && handleUnbanUser(user.id)}
                                    disabled={actionLoading === user.id}
                                    className="flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full text-left disabled:opacity-50 transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-3" />
                                    {actionLoading === user.id ? 'Débannissement...' : 'Débannir'}
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowDeleteConfirm(true);
                                    setShowActionMenu(null);
                                  }}
                                  disabled={actionLoading !== null}
                                  className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 mr-3" />Supprimer
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-100">
            {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
              <div key={user.id || user.email} className="p-4 hover:bg-slate-50 transition-colors duration-150">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === (user.id || user.email) ? null : (user.id || user.email))}
                    className="ml-2 text-gray-400 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    <span>{user.status}</span>
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1 mb-3">
                  {user.phone && <div><span className="font-medium">Tel:</span> {user.phone}</div>}
                  <div><span className="font-medium">{user.ordersCount || 0}</span> commandes • <span className="font-medium">{user.totalSpent || 0}€</span></div>
                </div>

                {showActionMenu === user.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                    <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl z-20 border border-gray-200 overflow-hidden">
                      <div className="py-2">
                        <button className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 w-full text-left transition-colors">
                          <Eye className="w-4 h-4 mr-3 text-gray-400" />Voir le profil
                        </button>
                        {user.status !== 'SUSPENDED' ? (
                          <button onClick={() => user.id && handleBanUser(user.id)} className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors">
                            <Ban className="w-4 h-4 mr-3" />Bannir
                          </button>
                        ) : (
                          <button onClick={() => user.id && handleUnbanUser(user.id)} className="flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full text-left transition-colors">
                            <CheckCircle className="w-4 h-4 mr-3" />Débannir
                          </button>
                        )}
                        <button onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteConfirm(true);
                          setShowActionMenu(null);
                        }} className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors">
                          <Trash2 className="w-4 h-4 mr-3" />Supprimer
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => !actionLoading && setShowDeleteConfirm(false)} />
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium">Supprimer l'utilisateur</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Confirmer la suppression de <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> ? Cette action ne peut pas être annulée.
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
                  {actionLoading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
