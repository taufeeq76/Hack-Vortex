import React, { useState } from 'react';
import { GymItem } from '../../data/gymProducts';
import { CountryInfo, formatPriceForCountry } from '../../data/countries';
import { StoreCartItem, StoreShippingAddress, StoreOrder } from '../../types';
import { StoreCoupon } from '../../services/storeService';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';

interface StoreCheckoutViewProps {
  cartItems: StoreCartItem[];
  allProducts: GymItem[];
  userCountry: CountryInfo;
  appliedCoupon: StoreCoupon | null;
  savedAddress: StoreShippingAddress;
  onSaveAddress: (address: StoreShippingAddress) => void;
  onBackToCart: () => void;
  onOrderComplete: (order: StoreOrder) => void;
}

type PaymentMethodType = 'cod' | 'upi' | 'card' | 'apple_pay' | 'net_banking';

export const StoreCheckoutView: React.FC<StoreCheckoutViewProps> = ({
  cartItems,
  allProducts,
  userCountry,
  appliedCoupon,
  savedAddress,
  onSaveAddress,
  onBackToCart,
  onOrderComplete,
}) => {
  // Address State
  const [address, setAddress] = useState<StoreShippingAddress>(savedAddress);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    userCountry.code === 'IN' ? 'upi' : 'cod'
  );
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('888');
  const [upiId, setUpiId] = useState<string>('athlete@oksbi');

  // Simulation loading state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const populatedItems = cartItems
    .map((ci) => {
      const prod = allProducts.find((p) => p.id === ci.productId);
      return { item: ci, product: prod };
    })
    .filter((x): x is { item: StoreCartItem; product: GymItem } => x.product !== undefined);

  const subtotalUSD = populatedItems.reduce(
    (sum, cur) => sum + cur.product.priceUSD * cur.item.quantity,
    0
  );
  const discountUSD = appliedCoupon ? (subtotalUSD * appliedCoupon.discountPercentage) / 100 : 0;
  const deliveryUSD = 0; // Free global courier
  const totalUSD = Math.max(0, subtotalUSD - discountUSD + deliveryUSD);

  const validateAddress = (): boolean => {
    const errs: Record<string, string> = {};
    if (!address.fullName.trim()) errs.fullName = 'Full name is required';
    if (!address.phone.trim()) errs.phone = 'Contact number is required';
    if (!address.streetAddress.trim()) errs.streetAddress = 'Address/Dorm is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.postalCode.trim()) errs.postalCode = 'Postal/PIN code is required';
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateAddress()) {
      return;
    }

    onSaveAddress(address);
    setIsProcessing(true);
    setProcessingStep('Encrypting delivery data & verifying warehouse inventory...');

    setTimeout(() => {
      setProcessingStep('Authorizing secure simulated gateway verification...');
      setTimeout(() => {
        setProcessingStep('Generating Global Express tracking manifest...');
        setTimeout(() => {
          setIsProcessing(false);

          // Build confirmed order
          const randomSuffix = Math.floor(100000 + Math.random() * 900000);
          const newOrder: StoreOrder = {
            orderId: `ZYRO-ORD-${randomSuffix}`,
            date: new Date().toISOString().split('T')[0],
            items: populatedItems.map(({ item, product }) => ({
              productId: product.id,
              productName: product.name,
              productImage: product.image,
              category: product.categoryLabel,
              priceUSD: product.priceUSD,
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
            })),
            subtotalUSD,
            discountUSD,
            deliveryUSD,
            totalUSD,
            couponCode: appliedCoupon?.code,
            shippingAddress: address,
            paymentMethod:
              paymentMethod === 'cod'
                ? 'Cash on Delivery (Pay at Door)'
                : paymentMethod === 'upi'
                ? `UPI Instant Pay (${upiId})`
                : paymentMethod === 'card'
                ? `Credit Card (•••• ${cardNumber.slice(-4)})`
                : paymentMethod === 'apple_pay'
                ? 'Apple Pay / Digital Wallet'
                : 'Net Banking / Direct Wire',
            status: 'Order Placed',
            estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
              'en-US',
              { month: 'short', day: 'numeric', year: 'numeric' }
            ),
            trackingCode: `GLB-${userCountry.code}-${Math.floor(1000000 + Math.random() * 9000000)}`,
          };

          onOrderComplete(newOrder);
        }, 800);
      }, 800);
    }, 900);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToCart}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Cart</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
          <Lock size={13} />
          <span>256-Bit SSL Checkout Guaranteed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Delivery & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="p-6 rounded-3xl bg-[#111613] border border-emerald-950/60 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-black flex items-center justify-center">
                  1
                </span>
                <span>Delivery Address & Contact</span>
              </h2>
              <span className="text-[11px] text-gray-400">
                Country: <strong className="text-white">{userCountry.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-300 font-bold block">
                  Full Recipient Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
                {addressErrors.fullName && (
                  <p className="text-[10px] text-rose-400">{addressErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">
                  Mobile Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
                {addressErrors.phone && (
                  <p className="text-[10px] text-rose-400">{addressErrors.phone}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">
                  Postal / PIN / ZIP Code <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  placeholder="e.g. 90210"
                  className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
                {addressErrors.postalCode && (
                  <p className="text-[10px] text-rose-400">{addressErrors.postalCode}</p>
                )}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-300 font-bold block">
                  Street Address, Dorm Room, or Apartment <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={address.streetAddress}
                  onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                  placeholder="Room 304, Varsity Quad Hall, North Campus"
                  className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
                {addressErrors.streetAddress && (
                  <p className="text-[10px] text-rose-400">{addressErrors.streetAddress}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">
                  City <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Campus West"
                  className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
                {addressErrors.city && (
                  <p className="text-[10px] text-rose-400">{addressErrors.city}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">State / Province</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="California"
                  className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="p-6 rounded-3xl bg-[#111613] border border-emerald-950/60 space-y-5 shadow-xl">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-black flex items-center justify-center">
                  2
                </span>
                <span>Select Payment Method</span>
              </h2>
            </div>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery (COD) */}
              <label
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-md'
                    : 'bg-black/30 border-white/5 text-gray-400 hover:bg-black/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-emerald-500 focus:ring-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote size={16} className="text-emerald-400" />
                      <span className="font-bold text-white text-xs sm:text-sm">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        Zero Advance Fee
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Pay safely at your doorstep in cash or by scanning the delivery agent's UPI/Card machine upon package inspection.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 2: UPI / Instant QR (For India & International Wallets) */}
              <label
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-md'
                    : 'bg-black/30 border-white/5 text-gray-400 hover:bg-black/50'
                }`}
              >
                <div className="flex items-start gap-3 w-full">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-1 text-emerald-500 focus:ring-0"
                  />
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <QrCode size={16} className="text-emerald-400" />
                      <span className="font-bold text-white text-xs sm:text-sm">
                        UPI / Instant Pay (GPay, PhonePe, Paytm, BHIM)
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Instant zero-fee transfer with simulated biometric confirmation.
                    </p>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-full sm:flex-1">
                          <label className="text-[11px] font-bold text-gray-300 block mb-1">
                            Your UPI ID / Virtual Address
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="athlete@okhdfcbank"
                            className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-emerald-300">
                          <CheckCircle2 size={14} />
                          <span>Simulated Instant Verification Active</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </label>

              {/* Option 3: Credit / Debit Card */}
              <label
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-md'
                    : 'bg-black/30 border-white/5 text-gray-400 hover:bg-black/50'
                }`}
              >
                <div className="flex items-start gap-3 w-full">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-emerald-500 focus:ring-0"
                  />
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-emerald-400" />
                      <span className="font-bold text-white text-xs sm:text-sm">
                        Credit / Debit Card (Visa, MasterCard, Amex)
                      </span>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="sm:col-span-3">
                          <label className="text-[11px] font-bold text-gray-300 block mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-300 block mb-1">
                            Valid Thru (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-300 block mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="888"
                            className="w-full bg-black/60 border border-emerald-900/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </label>

              {/* Option 4: Apple Pay / Digital Wallets */}
              <label
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-md'
                    : 'bg-black/30 border-white/5 text-gray-400 hover:bg-black/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'apple_pay'}
                    onChange={() => setPaymentMethod('apple_pay')}
                    className="mt-1 text-emerald-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-white text-xs sm:text-sm">
                      Apple Pay / Google Pay / 1-Tap Wallet
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Fast 1-click tokenized authorization without entering card numbers.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Final Order Review & Trigger */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#111613] border border-emerald-950/60 space-y-4 shadow-xl">
            <h3 className="text-sm font-black uppercase text-white tracking-wider">
              Order Review
            </h3>

            {/* Thumbnail mini-list */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 border-b border-white/5 pb-4 scrollbar-none">
              {populatedItems.map(({ item, product }) => (
                <div key={item.cartItemId || `${product.id}_${item.selectedSize}_${item.selectedColor}`} className="flex items-center gap-3 text-xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-white/5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white truncate">{product.name}</h5>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                      <span>Qty: {item.quantity} × {formatPriceForCountry(product.priceUSD, userCountry)}</span>
                      {item.selectedSize && (
                        <span className="text-emerald-400">• Size: {item.selectedSize}</span>
                      )}
                      {item.selectedColor && (
                        <span className="text-gray-300">• {item.selectedColor}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="space-y-2 text-xs text-gray-300 border-b border-white/5 pb-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">
                  {formatPriceForCountry(subtotalUSD, userCountry)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span className="font-bold">
                    -{formatPriceForCountry(discountUSD, userCountry)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-emerald-400" />
                  <span>Express Courier</span>
                </span>
                <span className="text-emerald-400 font-bold uppercase text-[11px]">FREE</span>
              </div>
            </div>

            {/* Total To Pay */}
            <div className="flex justify-between items-baseline pt-1">
              <div>
                <span className="text-sm font-black text-white block">Total Amount</span>
                <span className="text-[10px] text-gray-400">Including all local duties</span>
              </div>
              <span className="text-2xl font-black text-emerald-400">
                {formatPriceForCountry(totalUSD, userCountry)}
              </span>
            </div>

            {/* Place Order CTA */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authorizing Order...</span>
                </>
              ) : (
                <>
                  <span>
                    Place Order ({formatPriceForCountry(totalUSD, userCountry)})
                  </span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            {/* Processing Steps feedback */}
            {isProcessing && (
              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2 animate-pulse">
                <Loader2 size={13} className="animate-spin shrink-0" />
                <span>{processingStep}</span>
              </div>
            )}

            <div className="text-[11px] text-gray-400 text-center space-y-1 pt-2">
              <p className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck size={14} />
                <span>Simulated Safe Prototype Checkout</span>
              </p>
              <p>No real charges will occur on your banking account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
