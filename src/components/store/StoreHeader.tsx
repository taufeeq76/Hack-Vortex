import React from 'react';
import { CountryInfo } from '../../data/countries';
import {
  Search,
  X,
  Heart,
  ShoppingBag,
  Package,
  Globe,
  Tag,
  Sparkles,
  Flame,
  Grid,
} from 'lucide-react';

interface StoreHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
  userCountry: CountryInfo;
  onOpenCountryModal?: () => void;
  cartCount: number;
  wishlistCount: number;
  ordersCount: number;
  activeView: 'home' | 'catalog' | 'cart' | 'wishlist' | 'checkout' | 'orders';
  onNavigateView: (view: 'home' | 'catalog' | 'cart' | 'wishlist' | 'checkout' | 'orders') => void;
  onSelectCategory?: (category: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  userCountry,
  onOpenCountryModal,
  cartCount,
  wishlistCount,
  ordersCount,
  activeView,
  onNavigateView,
}) => {
  return (
    <div className="space-y-3">
      {/* Top Main Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#101411] border border-emerald-500/20 rounded-3xl p-3.5 sm:p-4 shadow-xl">
        {/* Brand & Store Identity */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => onNavigateView('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black font-brand text-white tracking-tight">
                  ZYRO <span className="text-emerald-400">MegaStore</span>
                </span>
                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Global Pro
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Official Gym Gear, Barbells, Tech & Nutrition
              </p>
            </div>
          </div>

          {/* Mobile Country Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={onOpenCountryModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold"
            >
              <span>{userCountry.flag}</span>
              <span className="text-[11px]">{userCountry.currency}</span>
            </button>
          </div>
        </div>

        {/* Search Bar with Instant Matching */}
        <div className="relative flex-1 max-w-xl">
          <Search size={16} className="absolute left-3.5 top-3 text-emerald-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (activeView !== 'catalog' && e.target.value.trim().length > 0) {
                onNavigateView('catalog');
              }
            }}
            placeholder={`Search gym products (e.g. Cerakote Barbell, 10mm Belt, Whey Isolate)...`}
            className="w-full bg-black/60 border border-emerald-900/60 focus:border-emerald-500 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white focus:outline-none placeholder-gray-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-2.5 p-0.5 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Right Navigation & Quick Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-center">
          {/* Desktop Country / Currency Switcher */}
          <button
            type="button"
            onClick={onOpenCountryModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/5 border border-emerald-500/20 text-white hover:bg-white/10 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Change Delivery Country & Currency"
          >
            <Globe size={14} className="text-emerald-400" />
            <span>
              {userCountry.flag} {userCountry.name} ({userCountry.currency})
            </span>
          </button>

          {/* Wishlist Button ❤️ */}
          <button
            type="button"
            onClick={() => onNavigateView('wishlist')}
            className={`relative p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'wishlist'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="My Wishlist"
          >
            <Heart size={16} className={wishlistCount > 0 ? 'text-rose-400 fill-rose-400/30' : ''} />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* My Orders Button 📦 */}
          <button
            type="button"
            onClick={() => onNavigateView('orders')}
            className={`relative p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'orders'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="My Orders & Tracking"
          >
            <Package size={16} className="text-emerald-400" />
            <span className="hidden sm:inline">Orders</span>
            {ordersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-black flex items-center justify-center">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button 🛒 */}
          <button
            type="button"
            onClick={() => onNavigateView('cart')}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span className="font-black">Cart</span>
            <span className="w-5 h-5 rounded-full bg-black text-emerald-400 text-[10px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Secondary Horizontal Navigation Bar (Amazon/Flipkart/Myntra style tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => onNavigateView('home')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeView === 'home'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Sparkles size={13} />
          <span>Store Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateView('catalog')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeView === 'catalog'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Grid size={13} />
          <span>All Products & Filters</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onNavigateView('catalog');
          }}
          className="px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer"
        >
          <Flame size={13} className="text-amber-400" />
          <span>Lightning Deals & Offers</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateView('wishlist')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeView === 'wishlist'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Heart size={13} />
          <span>Wishlist ({wishlistCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateView('orders')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeView === 'orders'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Package size={13} />
          <span>My Orders ({ordersCount})</span>
        </button>
      </div>
    </div>
  );
};
