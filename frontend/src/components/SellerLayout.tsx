'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Search, LogOut, Bell, Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface SellerLayoutProps {
  children: ReactNode;
  activeTab:
    | 'dashboard'
    | 'products'
    | 'orders'
    | 'customers'
    | 'inventory'
    | 'analytics'
    | 'settings';
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
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

export default function SellerLayout({
  children,
  activeTab,
  onSearch,
  searchPlaceholder = 'Rechercher...',
  title,
  subtitle,
}: SellerLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-tr from-pink-600 to-rose-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-black text-white">S</span>
              </div>
              <h1 className="text-xl font-black bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                SHOP BY SOEURISE
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder={searchPlaceholder}
                onChange={handleSearch}
                className="w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-all">
              <Bell className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500">Vendeuse</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-all"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200/50 min-h-screen sticky top-16 shadow-sm">
          <nav className="p-4 space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.key
                    ? 'bg-gradient-to-r from-pink-50 to-pink-0 text-pink-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                    activeTab === item.key
                      ? 'bg-pink-100'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}
                >
                  {item.icon}
                </div>
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200/50">
              <Link
                href="/seller/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-pink-50 to-pink-0 text-pink-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                    activeTab === 'settings' ? 'bg-pink-100' : 'bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </div>
                Paramètres
              </Link>
            </div>
          </nav>
        </aside>

        {/* Sidebar for Mobile */}
        {mobileOpen && (
          <aside className="fixed lg:hidden inset-0 z-40 bg-black/50">
            <nav className="w-64 bg-white h-full p-4 space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.key
                      ? 'bg-gradient-to-r from-pink-50 to-pink-0 text-pink-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      activeTab === item.key ? 'bg-pink-100' : 'bg-gray-100'
                    }`}
                  >
                    {item.icon}
                  </div>
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-200/50">
                <Link
                  href="/seller/settings"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-pink-50 to-pink-0 text-pink-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      activeTab === 'settings' ? 'bg-pink-100' : 'bg-gray-100'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                  </div>
                  Paramètres
                </Link>
              </div>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 relative">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 p-2.5 sm:p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all text-gray-700"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          {/* Mobile Search */}
          {onSearch && (
            <div className="mb-6 md:hidden">
              <input
                type="search"
                placeholder={searchPlaceholder}
                onChange={handleSearch}
                className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          )}

          {/* Content Header */}
          {title && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>
          )}

          {/* Children Content */}
          {children}
        </main>
      </div>
    </div>
  );
}
