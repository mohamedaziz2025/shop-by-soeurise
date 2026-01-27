'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Search, LogOut, Bell, Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface SellerLayoutProps {
  children: ReactNode;
}

const SIDEBAR_ITEMS = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: '📊', key: 'dashboard' },
  { href: '/seller/products', label: 'Produits', icon: '📦', key: 'products' },
  { href: '/seller/orders', label: 'Commandes', icon: '🛍️', key: 'orders' },
  { href: '/seller/customers', label: 'Clients', icon: '👥', key: 'customers' },
  {
    href: '/seller/inventory',
    label: 'Gestion du stock',
    icon: '📋',
    key: 'inventory',
  },
  { href: '/seller/analytics', label: 'Analytics', icon: '📈', key: 'analytics' },
];

export default function SellerLayout({ children }: SellerLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-600 to-rose-500 flex items-center justify-center text-white font-bold">
            S
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Seller Hub</h1>
            <p className="text-xs text-gray-600">{user?.firstName || 'Ma Boutique'}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all group"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={() => router.push('/seller/settings')}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Paramètres</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Vendeur'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'V'}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-2">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
