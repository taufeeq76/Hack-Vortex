import React from 'react';
import { GymItem } from '../../data/gymProducts';
import { CountryInfo, formatPriceForCountry } from '../../data/countries';
import { Star, Heart, Plus, Check, Zap } from 'lucide-react';

interface ProductCardProps {
  product: GymItem;
  userCountry: CountryInfo;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: GymItem) => void;
  onSelectProduct: (product: GymItem) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userCountry,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  isInCart = false,
}) => {
  const formattedPrice = formatPriceForCountry(product.priceUSD, userCountry);
  const formattedOriginal = formatPriceForCountry(product.originalPriceUSD, userCountry);
  const discountPct = product.discountPercentage ?? Math.round(((product.originalPriceUSD - product.priceUSD) / product.originalPriceUSD) * 100);
  const stock = product.stockQuantity ?? 12;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.requiresSize || product.requiresColor) {
      // Direct to details view so user picks their size/color
      onSelectProduct(product);
    } else {
      onAddToCart(product);
    }
  };

  return (
    <div className="group relative rounded-3xl bg-[#111613] border border-emerald-950/60 hover:border-emerald-500/40 p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7)]">
      <div>
        {/* Image Container with Wishlist & Badges */}
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

          {/* Discount Pill */}
          {discountPct > 0 && (
            <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-500 text-black shadow-md flex items-center gap-0.5">
              -{discountPct}% OFF
            </span>
          )}

          {/* Product Badge if any */}
          {product.badge && (
            <span className="absolute bottom-2.5 left-2.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
              {product.badge}
            </span>
          )}

          {/* Brand Tag */}
          <span className="absolute bottom-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-gray-300 border border-white/10">
            {product.brand}
          </span>

          {/* Wishlist Button ❤️ */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500/90 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)] scale-105'
                : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/90'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={15} className={isWishlisted ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Product Information */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate">
              {product.subcategory || product.categoryLabel}
            </span>
            {stock <= 5 ? (
              <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded shrink-0">
                Only {stock} left!
              </span>
            ) : (
              <span className="text-[9px] text-gray-400 shrink-0">In Stock</span>
            )}
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-white leading-snug line-clamp-2 hover:text-emerald-300 transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-2 text-xs text-gray-400 pt-0.5">
            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
              <Star size={12} className="fill-amber-400" /> {product.rating}
            </span>
            <span>•</span>
            <span className="text-[11px] text-gray-400">({product.reviewsCount} reviews)</span>
          </div>

          {/* Color & Size Swatches Preview */}
          <div className="flex items-center justify-between pt-1 gap-1 text-[10px]">
            {product.availableSizes && product.availableSizes.length > 0 ? (
              <span className="text-gray-400 font-medium truncate">
                Sizes: <strong className="text-gray-200">{product.availableSizes.slice(0, 3).join(', ')}{product.availableSizes.length > 3 ? '...' : ''}</strong>
              </span>
            ) : (
              <span className="text-gray-400 font-medium">Standard Fit</span>
            )}

            {product.availableColors && product.availableColors.length > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                {product.availableColors.slice(0, 3).map((col, idx) => (
                  <span
                    key={idx}
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
                {product.availableColors.length > 3 && (
                  <span className="text-[9px] text-gray-400">+{product.availableColors.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing and Actions */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-white">{formattedPrice}</span>
            <span className="text-[11px] text-gray-500 line-through">
              {formattedOriginal}
            </span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold block">
            COD & Free Express Delivery
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Details
          </button>

          <button
            type="button"
            onClick={handleActionClick}
            className={`p-2 rounded-xl font-extrabold transition-all cursor-pointer shadow-sm ${
              isInCart
                ? 'bg-emerald-400 text-black'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95'
            }`}
            title={
              product.requiresSize || product.requiresColor
                ? 'Select Size & Color'
                : isInCart
                ? 'Add another to cart'
                : 'Add to Cart'
            }
          >
            {product.requiresSize || product.requiresColor ? (
              <Zap size={16} />
            ) : isInCart ? (
              <Check size={16} />
            ) : (
              <Plus size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
