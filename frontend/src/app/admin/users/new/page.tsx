'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastLogin?: string;
  emailVerified: boolean;
  profileCompleted: boolean;
}

export default function AdminNewUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchNewUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchNewUsers = async () => {
    try {
      // TODO: Remplacer par l'appel API réel - seulement les nouveaux utilisateurs (derniers 30 jours)
      const mockUsers: User[] = [
        {
          id: '1',
          firstName: 'Marie',
          lastName: 'Dupont',
          email: 'marie.dupont@email.com',
          phone: '+33123456789',
          role: 'USER',
          status: 'active',
          createdAt: '2024-01-20',
          lastLogin: '2024-01-20',
          emailVerified: true,
          profileCompleted: true
        },
        {
          id: '2',
          firstName: 'Jean',
          lastName: 'Martin',
          email: 'jean.martin@email.com',
          role: 'SELLER',
          status: 'active',
          createdAt: '2024-01-19',
          lastLogin: '2024-01-19',
          emailVerified: true,
          profileCompleted: false
        },
        {
          id: '3',
          firstName: 'Sophie',
          lastName: 'Bernard',
          email: 'sophie.bernard@email.com',
          phone: '+33987654321',
          role: 'USER',
          status: 'active',
          createdAt: '2024-01-18',
          emailVerified: false,
          profileCompleted: true
        },
        {
          id: '4',
          firstName: 'Pierre',
          lastName: 'Leroy',
          email: 'pierre.leroy@email.com',
          role: 'USER',
          status: 'inactive',
          createdAt: '2024-01-17',
          emailVerified: true,
          profileCompleted: false
        },
        {
          id: '5',
          firstName: 'Alice',
          lastName: 'Moreau',
          email: 'alice.moreau@email.com',
          phone: '+33555666777',
          role: 'SELLER',
          status: 'active',
          createdAt: '2024-01-16',
          lastLogin: '2024-01-16',
          emailVerified: true,
          profileCompleted: true
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des nouveaux utilisateurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'banned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'banned': return <AlertTriangle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
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

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // TODO: Implémenter les actions utilisateur
      console.log(`Action ${action} pour l'utilisateur ${userId}`);
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors de l\'action utilisateur:', error);
    }
  };

  const getDaysSinceRegistration = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <AdminLayout title="Nouveaux utilisateurs" subtitle="Gérer les utilisateurs inscrits récemment">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Nouveaux utilisateurs" subtitle="Gérer les utilisateurs inscrits récemment">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nouveaux utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Ce mois</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Comptes vérifiés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredUsers.filter(u => u.emailVerified).length}
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  {Math.round((filteredUsers.filter(u => u.emailVerified).length / filteredUsers.length) * 100)}% du total
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendeurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredUsers.filter(u => u.role === 'SELLER').length}
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  Intéressés par la vente
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* User Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                          {user.role}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Il y a {getDaysSinceRegistration(user.createdAt)} jour{getDaysSinceRegistration(user.createdAt) > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {showActionMenu === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleUserAction(user.id, 'view')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Voir profil
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'contact')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Contacter
                          </button>
                          {user.status !== 'banned' ? (
                            <button
                              onClick={() => handleUserAction(user.id, 'ban')}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Bannir
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user.id, 'unban')}
                              className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Débannir
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Informations de contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">{user.email}</span>
                        {user.emailVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 ml-2" />
                        )}
                      </div>
                      {user.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Status */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Statut du compte</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email vérifié:</span>
                        {user.emailVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Profil complet:</span>
                        {user.profileCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Activity */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Activité récente</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Inscrit le:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {user.lastLogin && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Dernière connexion:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {user.role === 'SELLER' && (
                      <span className="text-blue-600 font-medium">Intéressé par la création d'une boutique</span>
                    )}
                    {user.role === 'USER' && (
                      <span>Acheteur régulier potentiel</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {!user.emailVerified && (
                      <button
                        onClick={() => handleUserAction(user.id, 'resend-verification')}
                        className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Renvoyer email
                      </button>
                    )}
                    <button
                      onClick={() => handleUserAction(user.id, 'view')}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Voir profil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun nouvel utilisateur</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun utilisateur ne s'est inscrit récemment.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}