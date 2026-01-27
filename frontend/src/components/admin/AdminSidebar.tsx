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
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white to-gray-50 shadow-xl transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        border-r border-gray-100
      `} role="navigation" aria-label="Navigation administrateur">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 bg-white/50 backdrop-blur">
          <Link href="/admin/dashboard" className="flex items-center space-x-2 group">
            <Image
              src="/logo-soeurise/logo_soeurise.jpg"
              alt="Soeurise Admin"
              width={32}
              height={32}
              className="rounded group-hover:shadow-lg transition-all duration-200"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">Admin</span>
          </Link>

          <button
            onClick={onToggle}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 lg:hidden transition-colors duration-150"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-pink-50/30 to-rose-50/30">
          <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate font-medium">
                Administrateur
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out
                  ${isActive
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-600/30 scale-[1.02]'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-transparent hover:text-gray-900'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-3 transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/30 shadow-md' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-pink-600'}`} />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm transition-colors ${isActive ? 'text-white' : 'text-gray-700'}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs transition-colors ${isActive ? 'text-pink-100' : 'text-gray-500 group-hover:text-gray-700'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200/50 bg-gradient-to-b from-transparent to-gray-50/50">
          <button
            onClick={handleLogout}
            aria-label="Se déconnecter"
            className="flex items-center w-full px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 group"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-red-100 mr-3 transition-all">
              <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors" />
            </div>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}