'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User
} from 'lucide-react';
import Image from 'next/image';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Statistiques détaillées'
  },
  {
    name: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
    description: 'Gestion des utilisateurs'
  },
  {
    name: 'Boutiques',
    href: '/admin/shops',
    icon: Store,
    description: 'Gestion des boutiques'
  },
  {
    name: 'Produits',
    href: '/admin/products',
    icon: Package,
    description: 'Gestion des produits'
  },
  {
    name: 'Commandes',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Gestion des commandes'
  },
  {
    name: 'Commissions',
    href: '/admin/commissions',
    icon: DollarSign,
    description: 'Revenus et commissions'
  },
  {
    name: 'Paramètres',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configuration système'
  }
];

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `} role="navigation" aria-label="Navigation administrateur">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <Image
              src="/logo-soeurise/logo_soeurise.jpg"
              alt="Soeurise Admin"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-xl font-bold text-gray-900">Admin</span>
          </Link>

          <button
            onClick={onToggle}
            className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-pink-600 to-rose-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Administrateur
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition transform duration-200 ease-in-out
                  ${isActive
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${isActive ? 'bg-white/20 shadow-sm' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${isActive ? 'text-pink-100' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            aria-label="Se déconnecter"
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
}