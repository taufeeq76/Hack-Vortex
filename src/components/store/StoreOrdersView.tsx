import React from 'react';
import { StoreOrder, StoreOrderStatus } from '../../types';
import { CountryInfo, formatPriceForCountry } from '../../data/countries';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Calendar,
  MapPin,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface StoreOrdersViewProps {
  orders: StoreOrder[];
  userCountry: CountryInfo;
  onAdvanceStatus: (orderId: string) => void;
  onReorder: (order: StoreOrder) => void;
  onContinueShopping: () => void;
}

export const StoreOrdersView: React.FC<StoreOrdersViewProps> = ({
  orders,
  userCountry,
  onAdvanceStatus,
  onReorder,
  onContinueShopping,
}) => {
  const steps: StoreOrderStatus[] = [
    'Order Placed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStepIndex = (status: StoreOrderStatus): number => {
    return steps.indexOf(status);
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl bg-[#111613] border border-emerald-950/60 p-12 text-center space-y-5 max-w-lg mx-auto shadow-2xl my-8">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
          <Package size={36} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white">No Orders Yet</h3>
          <p className="text-xs text-gray-400">
            When you purchase gym barbells, plates, or fitness accessories, your delivery progress and tracking codes will appear here.
          </p>
        </div>
        <button
          type="button"
          onClick={onContinueShopping}
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all cursor-pointer inline-flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
        >
          <span>Start Shopping</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
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
            <span>My Orders & Dispatch Tracking</span>
            <span className="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {orders.length} Orders
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={onContinueShopping}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer border border-white/10"
        >
          Browse More Equipment
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const currentStepIdx = getStepIndex(order.status);

          return (
            <div
              key={order.orderId}
              className="p-6 rounded-3xl bg-[#111613] border border-emerald-950/60 space-y-6 shadow-xl"
            >
              {/* Top Order Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white font-mono">
                      {order.orderId}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span>Placed on {order.date}</span>
                    <span>•</span>
                    <span>Tracking: {order.trackingCode}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-emerald-400 block">
                    {formatPriceForCountry(order.totalUSD, userCountry)}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {order.items.reduce((s, c) => s + c.quantity, 0)} Items Total
                  </span>
                </div>
              </div>

              {/* Visual 4-Step Progress Stepper */}
              <div className="py-2">
                <div className="relative flex items-center justify-between">
                  {/* Connecting Line */}
                  <div className="absolute left-6 right-6 top-4 h-0.5 bg-gray-800 -z-0" />
                  <div
                    className="absolute left-6 top-4 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
                    style={{
                      width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                    }}
                  />

                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div
                        key={step}
                        className="relative z-10 flex flex-col items-center text-center space-y-1"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                              : 'bg-black border border-gray-700 text-gray-600'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-bold max-w-[70px] sm:max-w-none ${
                            isCurrent
                              ? 'text-emerald-400'
                              : isDone
                              ? 'text-white'
                              : 'text-gray-500'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Simulation button to test stepper */}
                {order.status !== 'Delivered' && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-gray-400 text-[11px]">
                      Est. Arrival: <strong className="text-white">{order.estimatedDelivery}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => onAdvanceStatus(order.orderId)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      title="Advance to next shipping phase"
                    >
                      <RotateCcw size={12} />
                      <span>Simulate Next Delivery Status</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Items in this Order */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider block">
                  Items in this Shipment
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3 text-xs"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover bg-black/50 border border-white/5 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-white truncate">{item.productName}</h5>
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <span>Qty {item.quantity} • {formatPriceForCountry(item.priceUSD, userCountry)}</span>
                          {item.selectedSize && (
                            <span className="text-emerald-400 font-medium">• Size: {item.selectedSize}</span>
                          )}
                          {item.selectedColor && (
                            <span className="text-gray-300 font-medium">• {item.selectedColor}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Actions */}
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="text-gray-400 text-[11px] flex items-center gap-1.5">
                  <MapPin size={13} className="text-emerald-400 shrink-0" />
                  <span>
                    Delivering to: <strong className="text-white">{order.shippingAddress.fullName}</strong>, {order.shippingAddress.streetAddress}, {order.shippingAddress.city}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onReorder(order)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <ShoppingBag size={14} />
                    <span>Buy Again / Reorder</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
