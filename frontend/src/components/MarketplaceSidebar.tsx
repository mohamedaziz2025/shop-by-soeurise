'use client';

import { useState } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';

interface MarketplaceSidebarProps {
  categories: string[];
  selectedCategory: string;
  shops: any[];
  selectedShop: any | null;
  onCategorySelect: (category: string) => void;
  onShopSelect: (shop: any) => void;
  accentColor: string;
}

export default function MarketplaceSidebar({
  categories,
  selectedCategory,
  shops,
  selectedShop,
  onCategorySelect,
  onShopSelect,
  accentColor,
}: MarketplaceSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const getColorClasses = (isActive: boolean, category?: string) => {
    if (!isActive) {
      return 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent hover:text-gray-900';
    }
    
    if (category === 'Mode') {
      return 'bg-gradient-to-r from-indigo-50 to-indigo-0 text-indigo-700 border-l-4 border-indigo-600 font-semibold';
    }
    return 'bg-gradient-to-r from-rose-50 to-rose-0 text-rose-700 border-l-4 border-rose-600 font-semibold';
  };

  const sidebarContent = (
    <div className="p-6">
      <h2 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-6">
        Univers
      </h2>
      <nav className="space-y-3">
        {categories.map((cat) => (
          <div key={cat}>
            <button
              onClick={() => {
                onCategorySelect(cat);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-black text-lg transition-all duration-200 ${
                getColorClasses(selectedCategory === cat, cat)
              }`}
            >
              {cat}
            </button>

            {/* Shops sub-menu */}
            {selectedCategory === cat && shops.length > 0 && (
              <div className="ml-6 mt-2 space-y-1.5">
                {shops.map((shop) => {
                  const isActive = selectedShop?._id === shop._id;
                  return (
                    <button
                      key={shop._id}
                      onClick={() => {
                        onShopSelect(shop);
                        setMobileOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? `bg-gradient-to-r from-pink-50 to-pink-0 text-pink-700 border-l-2 border-pink-600 shadow-sm`
                          : `text-gray-600 hover:bg-gray-50 hover:text-pink-600 hover:border-l-2 hover:border-pink-300`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight className={`w-3 h-3 transition-transform ${isActive ? 'text-pink-600' : ''}`} />
                        {shop.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-40 bg-gradient-to-r from-pink-600 to-rose-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
        aria-label="Ouvrir les filtres"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static lg:block inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-lg lg:shadow-none
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}