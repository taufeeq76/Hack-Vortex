import React from 'react';
import { GymItem } from '../../data/gymProducts';
import { CountryInfo, formatPriceForCountry } from '../../data/countries';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Star,
  Check,
} from 'lucide-react';

interface StoreWishlistViewProps {
  wishlistProducts: GymItem[];
  userCountry: CountryInfo;
  cartProductIds: string[];
  onRemoveWishlist: (productId: string) => void;
  onMoveToCart: (product: GymItem) => void;
  onMoveAllToCart: () => void;
  onContinueShopping: () => void;
  onSelectProduct: (product: GymItem) => void;
}

export const StoreWishlistView: React.FC<StoreWishlistViewProps> = ({
  wishlistProducts,
  userCountry,
  cartProductIds,
  onRemoveWishlist,
  onMoveToCart,
  onMoveAllToCart,
  onContinueShopping,
  onSelectProduct,
}) => {
  if (wishlistProducts.length === 0) {
    return (
      <div className="rounded-3xl bg-[#111613] border border-emerald-950/60 p-12 text-center space-y-5 max-w-lg mx-auto shadow-2xl my-8">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-3xl">
          <Heart size={36} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-400">
            Keep track of barbells, lifting belts, massage guns, and supplements you plan to get. Tap the ❤️ icon on any product to save it here!
          </p>
        </div>
        <button
          type="button"
          onClick={onContinueShopping}
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all cursor-pointer inline-flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
        >
          <span>Discover Products</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer mb-1"
          >
            <ArrowLeft size={14} />
            <span>Back to Store</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-black font-brand text-white flex items-center gap-2">
            <span>Saved Wishlist</span>
            <span className="text-xs font-bold text-rose-400 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
              {wishlistProducts.length} Items
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={onMoveAllToCart}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all cursor-pointer inline-flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
        >
          <ShoppingBag size={15} />
          <span>Move All to Cart</span>
        </button>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {wishlistProducts.map((product) => {
          const formattedPrice = formatPriceForCountry(product.priceUSD, userCountry);
          const formattedOriginal = formatPriceForCountry(product.originalPriceUSD, userCountry);
          const isInCart = cartProductIds.includes(product.id);
          const discountPct = product.discountPercentage ?? Math.round(((product.originalPriceUSD - product.priceUSD) / product.originalPriceUSD) * 100);

          return (
            <div
              key={product.id}
              className="p-3.5 rounded-3xl bg-[#111613] border border-emerald-950/60 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/5 mb-3 cursor-pointer group/img"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />

                  {discountPct > 0 && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-500 text-black">
                      -{discountPct}% OFF
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/70 hover:bg-rose-500 text-rose-400 hover:text-white transition-all cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate block">
                    {product.brand}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-xs sm:text-sm font-bold text-white line-clamp-2 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <Star size={12} className="fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-500 text-[10px]">({product.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-white">{formattedPrice}</span>
                  <span className="text-xs text-gray-500 line-through">{formattedOriginal}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onMoveToCart(product)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isInCart
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                  }`}
                >
                  {isInCart ? <Check size={14} /> : <ShoppingBag size={14} />}
                  <span>{isInCart ? 'In Cart (+1 More)' : 'Move to Cart'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
