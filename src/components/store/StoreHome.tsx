import React, { useState, useEffect } from 'react';
import { GymItem } from '../../data/gymProducts';
import { CountryInfo, formatPriceForCountry } from '../../data/countries';
import { STORE_CATEGORIES } from '../../services/storeService';
import { ProductCard } from './ProductCard';
import {
  Flame,
  Sparkles,
  ArrowRight,
  Clock,
  Truck,
  ShieldCheck,
  Banknote,
  CheckCircle2,
  Tag,
  Zap,
  RotateCcw,
  Dumbbell,
  Trophy,
  Shirt,
  Footprints,
  Layers,
  HeartPulse,
  Home,
  GraduationCap,
  ShoppingBag,
} from 'lucide-react';

interface StoreHomeProps {
  products: GymItem[];
  userCountry: CountryInfo;
  wishlistIds: string[];
  cartProductIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: GymItem) => void;
  onSelectProduct: (product: GymItem) => void;
  onSelectCategory: (categoryId: string) => void;
  onViewAllSection: (filterType: 'deals' | 'trending' | 'recommended' | 'newArrivals' | 'student' | 'all') => void;
}

export const StoreHome: React.FC<StoreHomeProps> = ({
  products,
  userCountry,
  wishlistIds,
  cartProductIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onSelectCategory,
  onViewAllSection,
}) => {
  // Flash deal countdown timer (simulated ticking)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter curated sections
  const dealProducts = products.filter((p) => p.dealOfTheDay || (p.discountPercentage && p.discountPercentage >= 20)).slice(0, 4);
  const trendingProducts = products.filter((p) => p.trending).slice(0, 4);
  const recommendedProducts = products.filter((p) => p.recommended).slice(0, 4);
  const newArrivalProducts = products.filter((p) => p.newArrival).slice(0, 4);
  const studentProducts = products.filter((p) => p.isStudentEssential || p.category === 'student_essentials').slice(0, 4);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell size={18} />;
      case 'Sparkles':
        return <Sparkles size={18} />;
      case 'Flame':
        return <Flame size={18} />;
      case 'Trophy':
        return <Trophy size={18} />;
      case 'Shirt':
        return <Shirt size={18} />;
      case 'Footprints':
        return <Footprints size={18} />;
      case 'Layers':
        return <Layers size={18} />;
      case 'HeartPulse':
        return <HeartPulse size={18} />;
      case 'Home':
        return <Home size={18} />;
      case 'GraduationCap':
        return <GraduationCap size={18} />;
      default:
        return <ShoppingBag size={18} />;
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Deals & Offers Banner (Amazon/Flipkart Style Mega Carousel Banner) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c1a14] via-[#10241b] to-[#0a1510] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              <Flame size={14} className="text-emerald-400 fill-emerald-400" />
              <span>Mega Athlete & Student Gear Fair</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-brand text-white tracking-tight leading-tight">
              Up to <span className="text-emerald-400">40% OFF</span> Gym Gear, Running Shoes & Team Sports
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Equip your workout with barbells, yoga mats, footballs, recovery guns, and student budget essentials under ₹500 to ₹5,000. Doorstep delivery across {userCountry.name} with Cash on Delivery support.
            </p>

            {/* Flash Deal Timer */}
            <div className="flex items-center gap-2 pt-1">
              <Clock size={15} className="text-amber-400" />
              <span className="text-xs font-bold text-gray-300">Flash Deals End In:</span>
              <div className="flex items-center gap-1 font-mono text-xs font-black">
                <span className="bg-black/60 px-2 py-1 rounded-lg border border-white/10 text-white">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="text-emerald-400">:</span>
                <span className="bg-black/60 px-2 py-1 rounded-lg border border-white/10 text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="text-emerald-400">:</span>
                <span className="bg-black/60 px-2 py-1 rounded-lg border border-white/10 text-emerald-400">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onViewAllSection('deals')}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer flex items-center gap-2"
              >
                <span>Shop Lightning Deals</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onViewAllSection('student')}
                className="px-4 py-2.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <GraduationCap size={15} />
                <span>Student Under ₹500 - ₹5k</span>
              </button>

              <button
                type="button"
                onClick={() => onViewAllSection('all')}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Browse All {products.length} Products
              </button>
            </div>
          </div>

          {/* Quick Highlight Feature Card */}
          {dealProducts[0] && (
            <div
              onClick={() => onSelectProduct(dealProducts[0])}
              className="w-full lg:w-72 bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group shadow-xl"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-black/40">
                <img
                  src={dealProducts[0].image}
                  alt={dealProducts[0].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-black">
                  -{dealProducts[0].discountPercentage}% OFF
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                Featured Deal
              </span>
              <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-300">
                {dealProducts[0].name}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-black text-white">
                  {formatPriceForCountry(dealProducts[0].priceUSD, userCountry)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  {formatPriceForCountry(dealProducts[0].originalPriceUSD, userCountry)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Global Logistics & Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Express Courier</span>
              <span className="text-[11px] text-gray-400">Direct to {userCountry.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Banknote size={18} className="text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Cash on Delivery</span>
              <span className="text-[11px] text-gray-400">Pay on doorstep delivery</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">100% Authentic</span>
              <span className="text-[11px] text-gray-400">IPF & Lab certified specs</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RotateCcw size={18} className="text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">30-Day Guarantee</span>
              <span className="text-[11px] text-gray-400">Hassle-free equipment replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section with Icons & Counts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black font-brand text-white flex items-center gap-2">
              <span>Shop by Category</span>
              <span className="text-xs font-normal text-gray-400">({STORE_CATEGORIES.length - 1} categories)</span>
            </h2>
            <p className="text-xs text-gray-400">
              Browse strength, yoga, running, team sports, footwear, accessories, and student essentials
            </p>
          </div>
          <button
            type="button"
            onClick={() => onViewAllSection('all')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {STORE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="p-3.5 rounded-2xl bg-[#111613] border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer text-center group hover:bg-[#141b16] hover:shadow-lg flex flex-col items-center justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                  {cat.label}
                </h4>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  {cat.productCount} products
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 💰 Lightning Deals / Offers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Flame size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Lightning Deals & Offers</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Hot
                </span>
              </h3>
              <p className="text-xs text-gray-400">Deep discounts on high-demand lifting gear and accessories</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onViewAllSection('deals')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({products.filter((p) => p.dealOfTheDay).length})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dealProducts.map((product) => (
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
      </div>

      {/* 🎓 Student Fitness Essentials (Under ₹500 - ₹5,000) */}
      <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#111613] to-black border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Student Fitness Essentials</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Budget Friendly
                </span>
              </h3>
              <p className="text-xs text-gray-300">
                Picks under ₹500, ₹1,000, ₹2,000 & ₹5,000 tailored for dorm rooms, campus gym sessions & varsity practice
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onViewAllSection('student')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Student Picks</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {studentProducts.map((product) => (
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
      </div>

      {/* 🔥 Trending Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">Trending in Athletics</h3>
              <p className="text-xs text-gray-400">Most popular gear chosen by college and competitive lifters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onViewAllSection('trending')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingProducts.map((product) => (
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
      </div>

      {/* ⭐ Recommended For You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">Recommended for You</h3>
              <p className="text-xs text-gray-400">Curated based on strength building, muscle hypertrophy, and recovery</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onViewAllSection('recommended')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedProducts.map((product) => (
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
      </div>

      {/* 🆕 New Arrivals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">New Arrivals</h3>
              <p className="text-xs text-gray-400">Latest 2026 releases in gym tech, carbon shoes, and massage guns</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onViewAllSection('newArrivals')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newArrivalProducts.map((product) => (
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
      </div>
    </div>
  );
};
