import React, { useState } from 'react';
import { GymItem } from '../../data/gymProducts';
import { CountryInfo, formatPriceForCountry } from '../../data/countries';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Minus,
  Plus,
  Check,
  Sparkles,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface ProductDetailsViewProps {
  product: GymItem;
  userCountry: CountryInfo;
  isWishlisted: boolean;
  isInCart: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: GymItem, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  onBuyNow: (product: GymItem, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  onBack: () => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  userCountry,
  isWishlisted,
  isInCart,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onBack,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.availableColors && product.availableColors.length > 0 ? product.availableColors[0].name : undefined
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAddedToast, setShowAddedToast] = useState<boolean>(false);

  const formattedPrice = formatPriceForCountry(product.priceUSD, userCountry);
  const formattedOriginal = formatPriceForCountry(product.originalPriceUSD, userCountry);
  const savingsUSD = product.originalPriceUSD - product.priceUSD;
  const formattedSavings = formatPriceForCountry(savingsUSD, userCountry);
  const discountPct = product.discountPercentage ?? Math.round((savingsUSD / product.originalPriceUSD) * 100);
  const stock = product.stockQuantity ?? 12;

  const images = product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : [product.image];

  const handleAddToCartClick = () => {
    if (product.requiresSize && !selectedSize) {
      setValidationError('Please select a size to continue.');
      return;
    }
    if (product.requiresColor && !selectedColor) {
      setValidationError('Please select a color to continue.');
      return;
    }
    setValidationError(null);
    onAddToCart(product, quantity, selectedSize, selectedColor);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2500);
  };

  const handleBuyNowClick = () => {
    if (product.requiresSize && !selectedSize) {
      setValidationError('Please select a size to continue.');
      return;
    }
    if (product.requiresColor && !selectedColor) {
      setValidationError('Please select a color to continue.');
      return;
    }
    setValidationError(null);
    onBuyNow(product, quantity, selectedSize, selectedColor);
  };

  // Review rating breakdown simulation
  const ratingDistribution = [
    { stars: 5, pct: 82 },
    { stars: 4, pct: 13 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumbs & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-white/5"
        >
          <ArrowLeft size={14} />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Store</span>
          <span>/</span>
          <span className="text-emerald-400 font-bold">{product.categoryLabel}</span>
          <span>/</span>
          <span className="text-white truncate max-w-[150px]">{product.subcategory || product.brand}</span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#111613] border border-emerald-950/60 rounded-3xl p-5 sm:p-8 shadow-2xl">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-black/40 border border-emerald-500/20 shadow-inner group">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Discount Pill */}
            {discountPct > 0 && (
              <span className="absolute top-4 left-4 text-xs font-black uppercase px-2.5 py-1 rounded-xl bg-emerald-500 text-black shadow-lg">
                -{discountPct}% OFF
              </span>
            )}

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                isWishlisted
                  ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                  : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/90'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-black/40 ${
                    selectedImage === img
                      ? 'border-emerald-500 scale-95 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Pricing, Controls */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Brand, Category, Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {product.brand}
              </span>
              <span className="text-xs font-bold text-gray-400">
                {product.subcategory || product.categoryLabel}
              </span>
              {product.badge && (
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {product.badge}
                </span>
              )}
              {product.isStudentEssential && (
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  🎓 Student Essential
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-brand text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-gray-400">
                Based on <strong className="text-white font-bold">{product.reviewsCount}</strong> verified reviews
              </span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 size={13} /> Verified Authentic
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {formattedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formattedOriginal}
                </span>
                <span className="text-xs font-black text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                  Save {formattedSavings} ({discountPct}% OFF)
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Inclusive of all taxes & doorstep delivery to {userCountry.name}. Cash on Delivery available.
              </p>
            </div>

            {/* Stock Availability */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              {stock <= 5 ? (
                <span className="text-amber-400 font-bold">
                  Hurry, only {stock} units left in stock!
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  In Stock ({stock} units available) — Ready to Dispatch
                </span>
              )}
            </div>

            {/* Size Selector if available */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                    <span>Select Size:</span>
                    <strong className="text-emerald-400">{selectedSize || 'Choose Size'}</strong>
                  </span>
                  <span className="text-[11px] text-gray-400 underline cursor-pointer">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setValidationError(null);
                      }}
                      className={`min-w-[44px] px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        selectedSize === size
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)] scale-105'
                          : 'bg-black/50 text-gray-300 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector if available */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                    <span>Select Color:</span>
                    <strong className="text-emerald-400">{selectedColor || 'Choose Color'}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.availableColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color.name);
                        setValidationError(null);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        selectedColor === color.name
                          ? 'bg-white/15 text-white border-emerald-400 shadow-sm ring-1 ring-emerald-500'
                          : 'bg-black/40 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-bold text-gray-300">Quantity:</span>
              <div className="flex items-center border border-white/10 rounded-xl bg-black/50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-xs font-bold text-white min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  disabled={quantity >= stock}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-gray-400">
                Total: <strong className="text-white">{formatPriceForCountry(product.priceUSD * quantity, userCountry)}</strong>
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={handleAddToCartClick}
                className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-extrabold transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag size={16} />
                <span>{isInCart ? 'Add More to Cart' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNowClick}
                className="py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap size={16} />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* Toast Feedback */}
            {showAddedToast && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <Check size={16} />
                <span>Added {quantity}x "{product.name}" {selectedSize ? `(Size: ${selectedSize})` : ''} to your cart!</span>
              </div>
            )}
          </div>

          {/* Delivery & Assurance Strip */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 text-[11px] text-gray-400">
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-black/20">
              <Truck size={16} className="text-emerald-400 mb-1" />
              <span className="font-bold text-white">Estimated Delivery</span>
              <span>{userCountry.deliveryTimeDays}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-black/20">
              <ShieldCheck size={16} className="text-cyan-400 mb-1" />
              <span className="font-bold text-white">Warranty Included</span>
              <span>{product.warranty}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-black/20">
              <RotateCcw size={16} className="text-amber-400 mb-1" />
              <span className="font-bold text-white">Easy Returns</span>
              <span>30-Day Doorstep Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Specs */}
        <div className="lg:col-span-2 space-y-6 bg-[#111613] border border-emerald-950/60 rounded-3xl p-6">
          <div className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              Product Overview
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles size={15} className="text-emerald-400" />
              <span>Features & Athlete Specifications</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-300"
                >
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Logistics & Payment Guarantees */}
        <div className="space-y-4 bg-[#111613] border border-emerald-950/60 rounded-3xl p-6 text-xs text-gray-300">
          <h3 className="text-sm font-black text-white">Delivery to {userCountry.name}</h3>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Truck size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Express Courier</span>
                <span>Direct dispatch in 24 hours. Arrives at your doorstep in {userCountry.deliveryTimeDays}.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck size={15} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Secure Payment</span>
                <span>Supports Cash on Delivery (COD), UPI, Apple Pay, and Global Credit Cards with 256-bit encryption.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <RotateCcw size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Athlete Protection Guarantee</span>
                <span>Free replacement if equipment shows any transit damage or manufacturing defect.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Feedback with Star Breakdown */}
      <div className="bg-[#111613] border border-emerald-950/60 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div>
            <h3 className="text-lg font-black text-white">Verified Customer Ratings & Reviews</h3>
            <p className="text-xs text-gray-400">Authentic feedback from collegiate athletes, students, and gym lifters</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
                <span>{product.rating}</span>
                <Star size={18} className="fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[10px] text-gray-400 block">{product.reviewsCount} total ratings</span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bar Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-4 rounded-2xl border border-white/5">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-300">Rating Distribution</h4>
            {ratingDistribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 text-gray-400 font-bold flex items-center gap-0.5">
                  {row.stars} <Star size={10} className="fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-400 text-[11px]">{row.pct}%</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center space-y-2 border-t md:border-t-0 md:border-l border-white/5 md:pl-6 pt-3 md:pt-0">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 size={16} />
              <span>100% Verified Buyer Reviews</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every review submitted on ZYRO Store is cross-referenced with genuine shipping tracking numbers to ensure 100% authenticity.
            </p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {(product.customerReviews || []).map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500">{rev.date}</span>
                </div>

                <h5 className="font-bold text-white">{rev.title}</h5>
                <p className="text-gray-400 leading-relaxed text-[11px]">{rev.comment}</p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="font-bold text-emerald-400">{rev.author}</span>
                <span className="text-gray-500 font-medium">{rev.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
