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
    <div className="p-3 sm:p-4 md:p-6">
      <h2 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-3 sm:mb-4 md:mb-6">
        Univers
      </h2>
      <nav className="space-y-2 sm:space-y-2 md:space-y-3">
        {categories.map((cat) => (
          <div key={cat}>
            <button
              onClick={() => {
                onCategorySelect(cat);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-2 sm:px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-black text-sm sm:text-base md:text-lg transition-all duration-200 ${
                getColorClasses(selectedCategory === cat, cat)
              }`}
            >
              {cat}
            </button>

            {/* Shops sub-menu */}
            {selectedCategory === cat && shops.length > 0 && (
              <div className="ml-2 sm:ml-3 md:ml-6 mt-1 sm:mt-1.5 md:mt-2 space-y-1">
                {shops.map((shop) => {
                  const isActive = selectedShop?._id === shop._id;
                  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://72.62.71.97:3001';
                  const logoUrl = shop.logo?.startsWith('http') ? shop.logo : shop.logo ? `${API_BASE}${shop.logo}` : null;
                  
                  return (
                    <button
                      key={shop._id}
                      onClick={() => {
                        onShopSelect(shop);
                        setMobileOpen(false);
                      }}
                      className={`w-full text-left px-2 md:px-2.5 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 flex items-center gap-1.5 sm:gap-2 ${
                        isActive
                          ? `bg-gradient-to-r from-pink-50 to-pink-0 text-pink-700 border-l-2 border-pink-600 shadow-sm`
                          : `text-gray-600 hover:bg-gray-50 hover:text-pink-600 hover:border-l-2 hover:border-pink-300`
                      }`}
                    >
                      {/* Shop Logo thumbnail */}
                      {logoUrl && (
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                          <img
                            src={logoUrl}
                            alt={shop.name}
                            className="object-contain w-full h-full p-0.5"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                        <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${isActive ? 'text-pink-600' : ''}`} />
                        <span className="truncate">{shop.name}</span>
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
        className="lg:hidden fixed bottom-16 sm:bottom-20 md:bottom-6 right-3 sm:right-4 md:right-6 z-50 bg-gradient-to-r from-pink-600 to-rose-500 text-white p-2 sm:p-2.5 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
        aria-label="Ouvrir les filtres"
      >
        {mobileOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static lg:block inset-y-0 left-0 z-50 w-48 sm:w-56 md:w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-lg lg:shadow-none
          overflow-y-auto
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}