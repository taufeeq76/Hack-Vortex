import React, { useState, useMemo } from 'react';
import { GymItem } from '../../data/gymProducts';
import { CountryInfo } from '../../data/countries';
import { STORE_CATEGORIES, SPORTS_LIST, STUDENT_BUDGET_TIERS } from '../../services/storeService';
import { ProductCard } from './ProductCard';
import {
  Filter,
  ArrowUpDown,
  X,
  RotateCcw,
  SlidersHorizontal,
  Star,
  Check,
  GraduationCap,
  Trophy,
} from 'lucide-react';

interface StoreCatalogProps {
  products: GymItem[];
  userCountry: CountryInfo;
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onClearSearch: () => void;
  wishlistIds: string[];
  cartProductIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: GymItem) => void;
  onSelectProduct: (product: GymItem) => void;
  initialFilter?: string;
}

export type SortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'discount_desc'
  | 'newest';

export const StoreCatalog: React.FC<StoreCatalogProps> = ({
  products,
  userCountry,
  searchQuery,
  selectedCategory,
  onSelectCategory,
  onClearSearch,
  wishlistIds,
  cartProductIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<'all' | 'under25' | '25to75' | '75to150' | 'above150'>('all');
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState<boolean>(false);

  // Extract unique brands for brand filter
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCat = item.categoryLabel.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        const matchesSubcat = item.subcategory ? item.subcategory.toLowerCase().includes(q) : false;
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesSport = item.sport ? item.sport.toLowerCase().includes(q) : false;
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesSpecs = item.specs.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesSubcat && !matchesBrand && !matchesSport && !matchesDesc && !matchesSpecs) {
          return false;
        }
      }

      // 2. Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'student_essentials') {
          if (!item.isStudentEssential && item.category !== 'student_essentials') return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Sport match
      if (selectedSport !== 'all') {
        if (item.sport !== selectedSport) return false;
      }

      // 4. Student budget tier match
      if (selectedBudget !== 'all') {
        const tier = STUDENT_BUDGET_TIERS.find((t) => t.id === selectedBudget);
        if (tier && item.priceUSD > tier.maxUSD) return false;
      }

      // 5. Brand match
      if (selectedBrand !== 'all') {
        if (item.brand !== selectedBrand) return false;
      }

      // 6. Price range match
      if (priceRange === 'under25' && item.priceUSD >= 25) return false;
      if (priceRange === '25to75' && (item.priceUSD < 25 || item.priceUSD > 75)) return false;
      if (priceRange === '75to150' && (item.priceUSD < 75 || item.priceUSD > 150)) return false;
      if (priceRange === 'above150' && item.priceUSD <= 150) return false;

      // 7. Rating match
      if (minRating > 0 && item.rating < minRating) return false;

      // 8. In-stock match
      if (inStockOnly && (!item.inStock || (item.stockQuantity && item.stockQuantity <= 0))) {
        return false;
      }

      // 9. Minimum discount match
      const discount = item.discountPercentage ?? Math.round(((item.originalPriceUSD - item.priceUSD) / item.originalPriceUSD) * 100);
      if (minDiscount > 0 && discount < minDiscount) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price_desc') return b.priceUSD - a.priceUSD;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      if (sortBy === 'discount_desc') {
        const discA = a.discountPercentage ?? 0;
        const discB = b.discountPercentage ?? 0;
        return discB - discA;
      }
      if (sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      // 'featured'
      return 0;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedSport,
    selectedBudget,
    selectedBrand,
    priceRange,
    minRating,
    inStockOnly,
    minDiscount,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSport !== 'all' ? 1 : 0) +
    (selectedBudget !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0);

  const resetAllFilters = () => {
    onSelectCategory('all');
    setSelectedSport('all');
    setSelectedBudget('all');
    setSelectedBrand('all');
    setPriceRange('all');
    setMinRating(0);
    setInStockOnly(false);
    setMinDiscount(0);
    setSortBy('featured');
    if (searchQuery) onClearSearch();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Category Horizontal Nav Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STORE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-102'
                  : 'bg-[#111613] text-gray-300 border-white/5 hover:border-emerald-500/30 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-black/50 text-gray-400'
                }`}
              >
                {cat.productCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-Bar: Sport Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-gray-400 font-bold shrink-0 flex items-center gap-1">
          <Trophy size={13} className="text-emerald-400" /> Sport:
        </span>
        {SPORTS_LIST.map((sp) => (
          <button
            key={sp.id}
            type="button"
            onClick={() => setSelectedSport(sp.id)}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer border ${
              selectedSport === sp.id
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-black/40 text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            {sp.label}
          </button>
        ))}
      </div>

      {/* Results Header Bar with Search pill, Active Count, Sorting, and Mobile Filter toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111613] border border-emerald-950/60">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-400">
            Showing <strong className="text-white font-bold">{filteredProducts.length}</strong> of{' '}
            <strong className="text-gray-300">{products.length}</strong> products
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
              <span>"{searchQuery}"</span>
              <button
                type="button"
                onClick={onClearSearch}
                className="hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-bold cursor-pointer ml-1"
            >
              Reset filters ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
            className="lg:hidden px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal size={14} className="text-emerald-400" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-gray-400" />
            <span className="text-xs text-gray-400 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-black/60 border border-emerald-900/60 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated (★ 4.8+)</option>
              <option value="discount_desc">Biggest Discount (%)</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout: Left Filter Sidebar + Right Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div
          className={`${
            isFilterMobileOpen ? 'block' : 'hidden'
          } lg:block space-y-5 bg-[#111613] border border-emerald-950/60 rounded-3xl p-5 h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Filter size={15} className="text-emerald-400" />
              <span>Filters & Refinements</span>
            </h3>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Student Budget Tiers */}
          <div className="space-y-2">
            <label className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <GraduationCap size={14} />
              <span>Student Budget Tiers</span>
            </label>
            <div className="space-y-1 text-xs">
              {STUDENT_BUDGET_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedBudget(tier.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                    selectedBudget === tier.id
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tier.label}</span>
                  {selectedBudget === tier.id && <Check size={14} className="text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <label className="text-xs font-black text-white uppercase tracking-wider block">
              Price Range
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under25', label: 'Under $25 (Budget)' },
                { id: '25to75', label: '$25 to $75 (Everyday)' },
                { id: '75to150', label: '$75 to $150 (Performance)' },
                { id: 'above150', label: '$150 & Above (Pro)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPriceRange(opt.id as any)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                    priceRange === opt.id
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{opt.label}</span>
                  {priceRange === opt.id && <Check size={14} className="text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <label className="text-xs font-black text-white uppercase tracking-wider block">
              Brand
            </label>
            <div className="space-y-1 text-xs max-h-36 overflow-y-auto scrollbar-none pr-1">
              <button
                type="button"
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                  selectedBrand === 'all'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>All Brands</span>
                {selectedBrand === 'all' && <Check size={14} className="text-emerald-400" />}
              </button>
              {availableBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                    selectedBrand === brand
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{brand}</span>
                  {selectedBrand === brand && <Check size={14} className="text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <label className="text-xs font-black text-white uppercase tracking-wider block">
              Customer Rating
            </label>
            <div className="space-y-1 text-xs">
              {[
                { val: 0, label: 'Any Rating' },
                { val: 4.8, label: '4.8 ★ & Above' },
                { val: 4.5, label: '4.5 ★ & Above' },
                { val: 4.0, label: '4.0 ★ & Above' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setMinRating(opt.val)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                    minRating === opt.val
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {opt.val > 0 && <Star size={12} className="fill-amber-400 text-amber-400" />}
                    <span>{opt.label}</span>
                  </span>
                  {minRating === opt.val && <Check size={14} className="text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Discount */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <label className="text-xs font-black text-white uppercase tracking-wider block">
              Discounts & Offers
            </label>
            <div className="space-y-1 text-xs">
              {[
                { val: 0, label: 'All Items' },
                { val: 10, label: '10% or more' },
                { val: 20, label: '20% or more' },
                { val: 30, label: '30% or more' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setMinDiscount(opt.val)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                    minDiscount === opt.val
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{opt.label}</span>
                  {minDiscount === opt.val && <Check size={14} className="text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Checkbox */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <label className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-black text-emerald-500 focus:ring-emerald-500 focus:ring-offset-black"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Product Cards Grid (3 Columns on desktop, 2 on tablet, 1 on mobile) */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userCountry={userCountry}
                  isWishlisted={wishlistIds.includes(product.id)}
                  isInCart={cartProductIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#111613] border border-white/5 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 text-gray-400 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-bold text-white">No products match your criteria</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                We couldn't find any sports or gym equipment matching your current filter set. Try resetting your filters to view all products.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
