import React from 'react';
import { StoreOrder } from '../../types';
import { CountryInfo, formatPriceForCountry } from '../../data/countries';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Calendar,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react';

interface StoreOrderConfirmationProps {
  order: StoreOrder;
  userCountry: CountryInfo;
  onTrackOrder: () => void;
  onContinueShopping: () => void;
}

export const StoreOrderConfirmation: React.FC<StoreOrderConfirmationProps> = ({
  order,
  userCountry,
  onTrackOrder,
  onContinueShopping,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyTracking = () => {
    navigator.clipboard?.writeText(order.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 pt-4">
      {/* Success Celebration Card */}
      <div className="p-8 rounded-3xl bg-[#111613] border border-emerald-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in zoom-in-50 duration-300">
          <CheckCircle2 size={40} />
        </div>

        <div className="space-y-1 relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Order Confirmed & Payment Verified
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-brand text-white">
            Thank You! Your Athletic Gear is on the Way
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
            We've received your order and dispatched allocation to our automated campus fulfillment warehouse.
          </p>
        </div>

        {/* Order ID & Tracking Code Box */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <div className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-gray-300">
            Order ID: <strong className="text-white">{order.orderId}</strong>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-xs text-emerald-300">
            <Truck size={14} className="text-emerald-400" />
            <span>Tracking: <strong>{order.trackingCode}</strong></span>
            <button
              type="button"
              onClick={handleCopyTracking}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Copy tracking code"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111613] border border-emerald-950/60 space-y-6 shadow-xl">
        <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-white/5 pb-3">
          Order Summary & Delivery Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Calendar size={14} />
              <span>Estimated Delivery</span>
            </div>
            <p className="text-white font-bold text-sm">{order.estimatedDelivery}</p>
            <p className="text-[11px] text-gray-400">Via Worldwide Express Air</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <MapPin size={14} />
              <span>Shipping Destination</span>
            </div>
            <p className="text-white font-bold truncate">{order.shippingAddress.fullName}</p>
            <p className="text-[11px] text-gray-400 line-clamp-2">
              {order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <CreditCard size={14} />
              <span>Payment Mode</span>
            </div>
            <p className="text-white font-bold text-xs">{order.paymentMethod}</p>
            <p className="text-[11px] text-emerald-400 font-bold">Paid / Verified Status</p>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">
            Purchased Equipment ({order.items.length} items)
          </h4>
          <div className="space-y-2.5">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover bg-black/50 border border-white/5 shrink-0"
                  />
                  <div>
                    <h5 className="font-bold text-white line-clamp-1">{item.productName}</h5>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                      <span>Qty: {item.quantity} × {formatPriceForCountry(item.priceUSD, userCountry)}</span>
                      {item.selectedSize && (
                        <span className="text-emerald-400 font-medium">• Size: {item.selectedSize}</span>
                      )}
                      {item.selectedColor && (
                        <span className="text-gray-300 font-medium">• {item.selectedColor}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-black text-white text-sm">
                  {formatPriceForCountry(item.priceUSD * item.quantity, userCountry)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price Banner */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Final Total Paid</span>
            <span className="text-[11px] text-emerald-400">Includes Free Courier & Discounts</span>
          </div>
          <span className="text-2xl font-black text-emerald-400">
            {formatPriceForCountry(order.totalUSD, userCountry)}
          </span>
        </div>

        {/* Action CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
          <button
            type="button"
            onClick={onTrackOrder}
            className="py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Package size={16} />
            <span>Track in My Orders</span>
          </button>

          <button
            type="button"
            onClick={onContinueShopping}
            className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
