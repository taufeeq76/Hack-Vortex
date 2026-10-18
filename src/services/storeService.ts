import { GymItem, ALL_GYM_PRODUCTS, CustomerReview } from '../data/gymProducts';
import { StoreCartItem, StoreOrder, StoreShippingAddress, StoreOrderStatus } from '../types';

const STORAGE_KEYS = {
  CART: 'zyro_store_cart_v3',
  WISHLIST: 'zyro_store_wishlist_v3',
  ADDRESS: 'zyro_store_address_v3',
  ORDERS: 'zyro_store_orders_v3',
};

export interface StoreCategoryMeta {
  id: string;
  label: string;
  tagline: string;
  iconName: string;
  productCount: number;
  bgGradient: string;
}

export const STORE_CATEGORIES: StoreCategoryMeta[] = [
  {
    id: 'all',
    label: 'All Products',
    tagline: 'Complete Marketplace & Gear Catalog',
    iconName: 'ShoppingBag',
    productCount: ALL_GYM_PRODUCTS.length,
    bgGradient: 'from-emerald-900/40 to-teal-950/20',
  },
  {
    id: 'strength',
    label: 'Strength Training',
    tagline: 'Dumbbells, Barbells, Plates, Racks & Benches',
    iconName: 'Dumbbell',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'strength').length,
    bgGradient: 'from-emerald-950/60 to-black',
  },
  {
    id: 'yoga_flexibility',
    label: 'Yoga & Flexibility',
    tagline: 'Eco Mats, Cork Blocks, Dharma Wheels & Bands',
    iconName: 'Sparkles',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'yoga_flexibility').length,
    bgGradient: 'from-teal-950/60 to-black',
  },
  {
    id: 'running_cardio',
    label: 'Running & Cardio',
    tagline: 'Carbon Plated Shoes, Speed Ropes & Treadmills',
    iconName: 'Flame',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'running_cardio').length,
    bgGradient: 'from-amber-950/60 to-black',
  },
  {
    id: 'team_sports',
    label: 'Team & Outdoor Sports',
    tagline: 'Football, Cricket, Basketball, Badminton & Tennis',
    iconName: 'Trophy',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'team_sports').length,
    bgGradient: 'from-blue-950/60 to-black',
  },
  {
    id: 'sportswear',
    label: 'Sportswear & Clothing',
    tagline: 'Oversized Tees, Shorts, Sports Bras & Leggings',
    iconName: 'Shirt',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'sportswear').length,
    bgGradient: 'from-rose-950/60 to-black',
  },
  {
    id: 'footwear',
    label: 'Sports Footwear',
    tagline: 'Gym Flats, Studded Cleats & Court Shoes',
    iconName: 'Footprints',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'footwear').length,
    bgGradient: 'from-indigo-950/60 to-black',
  },
  {
    id: 'accessories',
    label: 'Sports Accessories',
    tagline: 'Gym Bags, 10mm Lever Belts & Shakers',
    iconName: 'Layers',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'accessories').length,
    bgGradient: 'from-purple-950/60 to-black',
  },
  {
    id: 'recovery_support',
    label: 'Support & Recovery',
    tagline: '7mm Knee Sleeves, Massage Guns & Foam Rollers',
    iconName: 'HeartPulse',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'recovery_support').length,
    bgGradient: 'from-cyan-950/60 to-black',
  },
  {
    id: 'home_workout',
    label: 'Home Workout & Kits',
    tagline: 'Starter Bundles, Push-up Boards & Ab Rollers',
    iconName: 'Home',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'home_workout').length,
    bgGradient: 'from-orange-950/60 to-black',
  },
  {
    id: 'student_essentials',
    label: 'Student Essentials',
    tagline: 'Affordable Fitness Gear from Under ₹500 to ₹5,000',
    iconName: 'GraduationCap',
    productCount: ALL_GYM_PRODUCTS.filter((p) => p.category === 'student_essentials' || p.isStudentEssential).length,
    bgGradient: 'from-emerald-950/80 to-teal-950/40',
  },
];

export const SPORTS_LIST = [
  { id: 'all', label: 'All Sports' },
  { id: 'gym', label: '🏋️ Gym & Lifting' },
  { id: 'running', label: '🏃 Running & Track' },
  { id: 'football', label: '⚽ Football' },
  { id: 'cricket', label: '🏏 Cricket' },
  { id: 'basketball', label: '🏀 Basketball' },
  { id: 'badminton', label: '🏸 Badminton' },
  { id: 'tennis', label: '🎾 Tennis' },
  { id: 'yoga', label: '🧘 Yoga' },
  { id: 'boxing', label: '🥊 Boxing' },
  { id: 'swimming', label: '🏊 Swimming' },
];

export const STUDENT_BUDGET_TIERS = [
  { id: 'all', label: 'All Student Gear', maxUSD: Infinity },
  { id: 'under500', label: 'Under ₹500 ($6)', maxUSD: 6.2 },
  { id: 'under1000', label: 'Under ₹1,000 ($12)', maxUSD: 12.2 },
  { id: 'under2000', label: 'Under ₹2,000 ($24)', maxUSD: 24.5 },
  { id: 'under5000', label: 'Under ₹5,000 ($60)', maxUSD: 60.5 },
];

// Generate realistic verified customer reviews for any product
const generateSampleReviews = (product: GymItem): CustomerReview[] => {
  const reviews: CustomerReview[] = [
    {
      id: `rev_1_${product.id}`,
      author: 'Marcus Vance',
      rank: 'Varsity Athlete',
      rating: 5,
      date: 'Aug 28, 2026',
      title: 'Exceeded all expectations! Solid build quality',
      comment: `Purchased this ${product.name} for our college training sessions. The build quality feels authentic and premium. Would 100% recommend to anyone training seriously.`,
      verified: true,
    },
    {
      id: `rev_2_${product.id}`,
      author: 'Aarav Sharma',
      rank: 'Verified Student Buyer',
      rating: 5,
      date: 'Aug 14, 2026',
      title: 'Amazing value for money, fast delivery',
      comment: 'Super fast delivery to our dorm. Packed securely with zero transit damage. Exactly as described in the specs.',
      verified: true,
    },
    {
      id: `rev_3_${product.id}`,
      author: 'Chloe Bennett',
      rank: 'Fitness Trainer',
      rating: 4,
      date: 'Jul 30, 2026',
      title: 'Great ergonomics and durability',
      comment: 'Using this regularly for daily training. Comfortable, reliable, and holds up well against heavy sweat and wear.',
      verified: true,
    },
  ];
  return reviews;
};

// Enrich all products
export const ENRICHED_STORE_PRODUCTS: GymItem[] = ALL_GYM_PRODUCTS.map((p) => {
  const discountPct = p.discountPercentage ?? Math.round(((p.originalPriceUSD - p.priceUSD) / p.originalPriceUSD) * 100);

  // Gallery images fallback if not specified
  const gallery = p.galleryImages && p.galleryImages.length > 0
    ? p.galleryImages
    : [
        p.image,
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      ];

  return {
    ...p,
    discountPercentage: discountPct,
    features: p.features || p.specs,
    galleryImages: gallery,
    customerReviews: p.customerReviews || generateSampleReviews(p),
  };
});

export const getProductById = (id: string): GymItem | undefined => {
  return ENRICHED_STORE_PRODUCTS.find((p) => p.id === id);
};

// ---------------- LOCAL STORAGE MANAGERS ----------------

export const getStoredCart = (): StoreCartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoreCartItem[];
    // Ensure all items have cartItemId
    return parsed.map((item) => ({
      ...item,
      cartItemId: item.cartItemId || `${item.productId}_${item.selectedSize || 'std'}_${item.selectedColor || 'def'}`,
    }));
  } catch (e) {
    return [];
  }
};

export const saveStoredCart = (cart: StoreCartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.warn('Could not save cart:', e);
  }
};

export const getStoredWishlist = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredWishlist = (wishlist: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  } catch (e) {
    console.warn('Could not save wishlist:', e);
  }
};

export const getStoredAddress = (defaultCountry: string = 'United States'): StoreShippingAddress => {
  if (typeof window === 'undefined') {
    return {
      fullName: 'Devon Vance',
      phone: '+1 (555) 321-9874',
      streetAddress: 'Room 304, Varsity Hall, Quad South',
      city: 'Campus City',
      state: 'California',
      postalCode: '90007',
      country: defaultCountry,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADDRESS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return {
    fullName: 'Devon Vance',
    phone: '+1 (555) 321-9874',
    streetAddress: 'Room 304, Varsity Hall, Quad South',
    city: 'Campus City',
    state: 'California',
    postalCode: '90007',
    country: defaultCountry,
  };
};

export const saveStoredAddress = (address: StoreShippingAddress) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ADDRESS, JSON.stringify(address));
  } catch (e) {
    console.warn('Could not save address:', e);
  }
};

export const getStoredOrders = (): StoreOrder[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    return [];
  }
  // Default realistic mock orders showcasing different tracking states
  const sampleOrders: StoreOrder[] = [
    {
      orderId: 'ZYRO-ORD-902148',
      date: '2026-09-04',
      items: [
        {
          productId: 'run_01',
          productName: 'Nitro Velocity Carbon-Plate Marathon Running Shoes',
          productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
          category: 'Running & Cardio',
          priceUSD: 119.0,
          quantity: 1,
          selectedSize: 'US 10',
          selectedColor: 'Stealth Black / Volt',
        },
        {
          productId: 'run_03',
          productName: 'Ultra-Fast Precision Ball-Bearing Speed Jump Rope',
          productImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
          category: 'Running & Cardio',
          priceUSD: 12.0,
          quantity: 1,
        },
      ],
      subtotalUSD: 131.0,
      discountUSD: 19.65,
      deliveryUSD: 0,
      totalUSD: 111.35,
      couponCode: 'CAMPUS15',
      shippingAddress: {
        fullName: 'Devon Vance',
        phone: '+1 (555) 321-9874',
        streetAddress: 'Room 304, Varsity Hall, Quad South',
        city: 'Campus City',
        state: 'California',
        postalCode: '90007',
        country: 'United States',
      },
      paymentMethod: 'UPI / Credit Card',
      status: 'Shipped',
      estimatedDelivery: 'Sep 09, 2026',
      trackingCode: 'ZYRO-TRK-8829410',
    },
    {
      orderId: 'ZYRO-ORD-774291',
      date: '2026-08-28',
      items: [
        {
          productId: 'home_01',
          productName: '🔥 Complete Beginner Home Gym Starter Kit (4-in-1)',
          productImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
          category: 'Home Workout',
          priceUSD: 49.0,
          quantity: 1,
        },
        {
          productId: 'stu_04',
          productName: 'BPA-Free Shaker Bottle with Wire Whisk Ball (600ml)',
          productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
          category: 'Student Fitness Essentials',
          priceUSD: 7.5,
          quantity: 1,
          selectedColor: 'Emerald Green',
        },
      ],
      subtotalUSD: 56.5,
      discountUSD: 11.3,
      deliveryUSD: 0,
      totalUSD: 45.2,
      couponCode: 'ZYRO20',
      shippingAddress: {
        fullName: 'Devon Vance',
        phone: '+1 (555) 321-9874',
        streetAddress: 'Room 304, Varsity Hall, Quad South',
        city: 'Campus City',
        state: 'California',
        postalCode: '90007',
        country: 'United States',
      },
      paymentMethod: 'Cash on Delivery',
      status: 'Delivered',
      estimatedDelivery: 'Sep 02, 2026',
      trackingCode: 'ZYRO-TRK-4491028',
    },
  ];
  return sampleOrders;
};

export const saveStoredOrders = (orders: StoreOrder[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.warn('Could not save orders:', e);
  }
};

export const advanceOrderStatus = (orderId: string): StoreOrder[] => {
  const orders = getStoredOrders();
  const nextStatusMap: Record<StoreOrderStatus, StoreOrderStatus> = {
    'Order Placed': 'Packed',
    'Packed': 'Shipped',
    'Shipped': 'Out for Delivery',
    'Out for Delivery': 'Delivered',
    'Delivered': 'Delivered',
  };

  const updated = orders.map((o) => {
    if (o.orderId === orderId) {
      return { ...o, status: nextStatusMap[o.status] };
    }
    return o;
  });

  saveStoredOrders(updated);
  return updated;
};

// ---------------- COUPONS ----------------

export interface StoreCoupon {
  code: string;
  discountPercentage: number;
  description: string;
  minSpendUSD: number;
}

export const VALID_COUPONS: StoreCoupon[] = [
  { code: 'ZYRO20', discountPercentage: 20, description: '20% off Storewide for Athletes', minSpendUSD: 40 },
  { code: 'CAMPUS15', discountPercentage: 15, description: '15% Varsity Student Discount', minSpendUSD: 25 },
  { code: 'STUDENT10', discountPercentage: 10, description: '10% Instant Student Discount', minSpendUSD: 0 },
  { code: 'BEAST25', discountPercentage: 25, description: '25% Flash Discount on Orders > $100', minSpendUSD: 100 },
];
