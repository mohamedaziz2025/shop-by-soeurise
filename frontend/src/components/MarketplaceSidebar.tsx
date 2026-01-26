'use client';

import { ChevronRight } from 'lucide-react';

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
  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4">
          Univers
        </h2>
        <nav className="space-y-2">
          {categories.map((cat) => (
            <div key={cat}>
              <button
                onClick={() => onCategorySelect(cat)}
                className={`w-full text-left px-4 py-3 rounded-xl font-black text-lg transition-all ${
                  selectedCategory === cat
                    ? cat === 'Mode'
                      ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                      : 'bg-rose-50 text-rose-600 border-l-4 border-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>

              {/* Shops sub-menu */}
              {selectedCategory === cat && shops.length > 0 && (
                <div className="ml-6 mt-2 space-y-1">
                  {shops.map((shop) => (
                    <button
                      key={shop._id}
                      onClick={() => onShopSelect(shop)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedShop?._id === shop._id
                          ? `bg-${accentColor}-50 text-${accentColor}-700 border-l-2 border-${accentColor}-600`
                          : `text-gray-600 hover:bg-gray-50 hover:text-${accentColor}-600`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        {shop.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}