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
      {/* Mobile toggle button - Enhanced */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 right-4 z-50 bg-gradient-to-r from-pink-600 to-rose-500 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl hover:scale-125 transition-all duration-300 ease-out active:scale-95 flex items-center justify-center group"
        aria-label={mobileOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'}
        title={mobileOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 animate-pulse opacity-20 group-hover:opacity-30 transition-opacity" />
        {mobileOpen ? (
          <X className="w-6 h-6 relative z-10 transition-transform duration-200" />
        ) : (
          <Menu className="w-6 h-6 relative z-10 transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>

      {/* Mobile overlay - Enhanced */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-60 transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        />
      )}

      {/* Sidebar - Enhanced */}
      <aside
        className={`
          fixed lg:static lg:block inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 min-h-screen
          transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:shadow-md
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          overflow-y-auto overflow-x-hidden
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        `}
        role="navigation"
        aria-label="Filtres et catégories"
        aria-hidden={!mobileOpen && 'true'}
      >
        {sidebarContent}
      </aside>

      {/* Mobile hint on first load */}
      {!mobileOpen && (
        <div className="lg:hidden fixed bottom-24 right-4 pointer-events-none">
          <div className="animate-bounce bg-white rounded-lg shadow-lg px-3 py-1.5 text-xs font-semibold text-pink-600 whitespace-nowrap">
            Ouvrir les filtres
          </div>
        </div>
      )}
    </>
  );
}