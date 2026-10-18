import React, { useState } from 'react';
import { GymItem } from '../../data/gymProducts';
import { CountryInfo, formatPriceForCountry } from '../../data/countries';
import { StoreCartItem } from '../../types';
import { VALID_COUPONS, StoreCoupon } from '../../services/storeService';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Check,
  X,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Heart,
} from 'lucide-react';

interface StoreCartViewProps {
  cartItems: StoreCartItem[];
  allProducts: GymItem[];
  userCountry: CountryInfo;
  appliedCoupon: StoreCoupon | null;
  onApplyCoupon: (coupon: StoreCoupon | null) => void;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onMoveToWishlist?: (productId: string, cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onSelectProduct: (product: GymItem) => void;
}

export const StoreCartView: React.FC<StoreCartViewProps> = ({
  cartItems,
  allProducts,
  userCountry,
  appliedCoupon,
  onApplyCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onClearCart,
  onProceedToCheckout,
  onContinueShopping,
  onSelectProduct,
}) => {
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');

  // Map cart items to full product data
  const populatedItems = cartItems
    .map((ci) => {
      const prod = allProducts.find((p) => p.id === ci.productId);
      const uniqueKey = ci.cartItemId || `${ci.productId}_${ci.selectedSize || 'std'}_${ci.selectedColor || 'def'}`;
      return { item: ci, product: prod, uniqueKey };
    })
    .filter((x): x is { item: StoreCartItem; product: GymItem; uniqueKey: string } => x.product !== undefined);

  const subtotalUSD = populatedItems.reduce(
    (sum, cur) => sum + cur.product.priceUSD * cur.item.quantity,
    0
  );

  const discountUSD = appliedCoupon ? (subtotalUSD * appliedCoupon.discountPercentage) / 100 : 0;
  const deliveryUSD = 0; // Free global express courier
  const totalUSD = Math.max(0, subtotalUSD - discountUSD + deliveryUSD);

  const handleApplyCoupon = (code: string) => {
    setCouponError('');
    const clean = code.trim().toUpperCase();
    const found = VALID_COUPONS.find((c) => c.code === clean);
    if (!found) {
      setCouponError('Invalid coupon code. Try ZYRO20, CAMPUS15, or STUDENT10');
      return;
    }
    if (subtotalUSD < found.minSpendUSD) {
      setCouponError(`Minimum order value of $${found.minSpendUSD} required for ${found.code}.`);
      return;
    }
    onApplyCoupon(found);
    setCouponInput('');
  };

  if (populatedItems.length === 0) {
    return (
      <div className="rounded-3xl bg-[#111613] border border-emerald-950/60 p-12 text-center space-y-5 max-w-lg mx-auto shadow-2xl my-8">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white">Your Shopping Cart is Empty</h3>
          <p className="text-xs text-gray-400">
            Looks like you haven't added any dumbbells, running shoes, or athlete apparel yet. Explore our campus and pro gear!
          </p>
        </div>
        <button
          type="button"
          onClick={onContinueShopping}
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all cursor-pointer inline-flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
        >
          <span>Explore Marketplace</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header with Back button & Clear cart */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Continue Shopping</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            <strong className="text-white font-bold">{populatedItems.length}</strong> items in cart
          </span>
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Cart Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Cart Items List */}
        <div className="lg:col-span-2 space-y-3.5">
          {populatedItems.map(({ item, product, uniqueKey }) => {
            const lineTotalUSD = product.priceUSD * item.quantity;
            const stock = product.stockQuantity ?? 12;

            return (
              <div
                key={uniqueKey}
                className="p-4 rounded-2xl bg-[#111613] border border-emerald-950/60 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Thumbnail & Product Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0 cursor-pointer group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        {product.brand}
                      </span>
                      <span className="text-[10px] text-gray-500">•</span>
                      <span className="text-[10px] text-gray-400">{product.subcategory || product.categoryLabel}</span>
                    </div>

                    <h4
                      onClick={() => onSelectProduct(product)}
                      className="text-xs sm:text-sm font-bold text-white line-clamp-2 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h4>

                    {/* Size & Color Selected Pills */}
                    {(item.selectedSize || item.selectedColor) && (
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {item.selectedSize && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-gray-200 border border-white/10">
                            Size: <strong className="text-white">{item.selectedSize}</strong>
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-gray-200 border border-white/10">
                            Color: <strong className="text-white">{item.selectedColor}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs pt-0.5">
                      <span className="font-bold text-white">
                        {formatPriceForCountry(product.priceUSD, userCountry)} each
                      </span>
                      <span className="text-gray-500 line-through text-[11px]">
                        {formatPriceForCountry(product.originalPriceUSD, userCountry)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-white/10 rounded-xl bg-black/50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(uniqueKey, item.quantity - 1)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-xs font-bold text-white min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(uniqueKey, Math.min(stock, item.quantity + 1))}
                      disabled={item.quantity >= stock}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-black text-white block">
                      {formatPriceForCountry(lineTotalUSD, userCountry)}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">In Stock</span>
                  </div>

                  {/* Action Buttons: Wishlist & Trash */}
                  <div className="flex items-center gap-1">
                    {onMoveToWishlist && (
                      <button
                        type="button"
                        onClick={() => onMoveToWishlist(product.id, uniqueKey)}
                        className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Move to Wishlist"
                      >
                        <Heart size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(uniqueKey)}
                      className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Summary & Coupons */}
        <div className="space-y-4">
          {/* Promo Code Card */}
          <div className="p-5 rounded-3xl bg-[#111613] border border-emerald-950/60 space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-emerald-400" />
              <span className="text-xs font-black uppercase text-white tracking-wider">
                Coupons & Discounts
              </span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-emerald-300 block">{appliedCoupon.code}</span>
                  <span className="text-[11px] text-gray-300">{appliedCoupon.description}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onApplyCoupon(null)}
                  className="p-1 text-gray-400 hover:text-white cursor-pointer"
                  title="Remove coupon"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError('');
                    }}
                    placeholder="Enter coupon code (e.g. ZYRO20)..."
                    className="flex-1 bg-black/50 border border-white/10 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon(couponInput)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-400">{couponError}</p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {VALID_COUPONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleApplyCoupon(c.code)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
                    >
                      {c.code} ({c.discountPercentage}% OFF)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Bill Summary */}
          <div className="p-5 rounded-3xl bg-[#111613] border border-emerald-950/60 space-y-4 shadow-lg">
            <h3 className="text-xs font-black uppercase text-white tracking-wider border-b border-white/5 pb-2">
              Price Details ({populatedItems.length} items)
            </h3>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">
                  {formatPriceForCountry(subtotalUSD, userCountry)}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-bold">
                    -{formatPriceForCountry(discountUSD, userCountry)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Doorstep Delivery</span>
                <span className="text-emerald-400 font-bold">FREE Express</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-sm">
                <span className="font-black text-white">Total Amount</span>
                <span className="font-black text-white text-base">
                  {formatPriceForCountry(totalUSD, userCountry)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-400" /> Secure Checkout
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Truck size={13} className="text-cyan-400" /> Cash on Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
