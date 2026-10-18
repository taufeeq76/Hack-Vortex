import React, { useState, useEffect } from 'react';
import { UserHealthProfile, StoreCartItem, StoreOrder, StoreShippingAddress } from '../types';
import { GymItem } from '../data/gymProducts';
import { CountryInfo } from '../data/countries';
import {
  ENRICHED_STORE_PRODUCTS,
  getStoredCart,
  saveStoredCart,
  getStoredWishlist,
  saveStoredWishlist,
  getStoredAddress,
  saveStoredAddress,
  getStoredOrders,
  saveStoredOrders,
  advanceOrderStatus,
  StoreCoupon,
  getProductById,
} from '../services/storeService';
import { StoreHeader } from '../components/store/StoreHeader';
import { StoreHome } from '../components/store/StoreHome';
import { StoreCatalog } from '../components/store/StoreCatalog';
import { ProductDetailsView } from '../components/store/ProductDetailsView';
import { StoreCartView } from '../components/store/StoreCartView';
import { StoreWishlistView } from '../components/store/StoreWishlistView';
import { StoreCheckoutView } from '../components/store/StoreCheckoutView';
import { StoreOrderConfirmation } from '../components/store/StoreOrderConfirmation';
import { StoreOrdersView } from '../components/store/StoreOrdersView';

interface StoreViewProps {
  userProfile: UserHealthProfile;
  userCountry: CountryInfo;
  onOpenCountryModal?: () => void;
}

export type StoreMainView =
  | 'home'
  | 'catalog'
  | 'details'
  | 'cart'
  | 'wishlist'
  | 'checkout'
  | 'confirmation'
  | 'orders';

export const StoreView: React.FC<StoreViewProps> = ({
  userCountry,
  onOpenCountryModal,
}) => {
  // Navigation & Search State
  const [activeView, setActiveView] = useState<StoreMainView>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<GymItem | null>(null);

  // Persistent E-Commerce State
  const [cartItems, setCartItems] = useState<StoreCartItem[]>(() => getStoredCart());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => getStoredWishlist());
  const [orders, setOrders] = useState<StoreOrder[]>(() => getStoredOrders());
  const [shippingAddress, setShippingAddress] = useState<StoreShippingAddress>(() =>
    getStoredAddress(userCountry.name)
  );
  const [appliedCoupon, setAppliedCoupon] = useState<StoreCoupon | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<StoreOrder | null>(null);

  // Sync state to local storage
  useEffect(() => {
    saveStoredCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveStoredWishlist(wishlistIds);
  }, [wishlistIds]);

  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveStoredAddress(shippingAddress);
  }, [shippingAddress]);

  // Derived counts
  const totalCartUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartProductIds = cartItems.map((c) => c.productId);

  // ---------------- HANDLERS ----------------

  const handleAddToCart = (
    product: GymItem,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    const size = selectedSize || (product.availableSizes && product.availableSizes[0]);
    const color = selectedColor || (product.availableColors && product.availableColors[0]?.name);
    const cartItemId = `${product.id}_${size || 'std'}_${color || 'def'}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          quantity,
          selectedSize: size,
          selectedColor: color,
        },
      ];
    });
  };

  const handleBuyNow = (
    product: GymItem,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    handleAddToCart(product, quantity, selectedSize, selectedColor);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.cartItemId || item.productId) === cartItemId
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => (item.cartItemId || item.productId) !== cartItemId)
    );
  };

  const handleMoveToWishlist = (productId: string, cartItemId: string) => {
    if (!wishlistIds.includes(productId)) {
      setWishlistIds((prev) => [...prev, productId]);
    }
    handleRemoveFromCart(cartItemId);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleMoveWishlistToCart = (product: GymItem) => {
    handleAddToCart(product, 1);
    handleToggleWishlist(product.id);
  };

  const handleMoveAllWishlistToCart = () => {
    wishlistIds.forEach((id) => {
      const prod = getProductById(id);
      if (prod) {
        handleAddToCart(prod, 1);
      }
    });
    setWishlistIds([]);
  };

  const handleOrderComplete = (newOrder: StoreOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setLastConfirmedOrder(newOrder);
    setCartItems([]);
    setAppliedCoupon(null);
    setActiveView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceOrderStatus = (orderId: string) => {
    const updated = advanceOrderStatus(orderId);
    setOrders(updated);
  };

  const handleReorder = (order: StoreOrder) => {
    order.items.forEach((item) => {
      const prod = getProductById(item.productId);
      if (prod) {
        handleAddToCart(prod, item.quantity, item.selectedSize, item.selectedColor);
      }
    });
    setActiveView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: GymItem) => {
    setSelectedProduct(product);
    setActiveView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllSection = (filterType: 'deals' | 'trending' | 'recommended' | 'newArrivals' | 'student' | 'all') => {
    if (filterType === 'student') {
      setSelectedCategory('student_essentials');
    } else {
      setSelectedCategory('all');
    }
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Populated Wishlist Items
  const wishlistProducts = wishlistIds
    .map((id) => getProductById(id))
    .filter((p): p is GymItem => p !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Universal Store Header */}
      <StoreHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        userCountry={userCountry}
        onOpenCountryModal={onOpenCountryModal}
        cartCount={totalCartUnits}
        wishlistCount={wishlistIds.length}
        ordersCount={orders.length}
        activeView={
          activeView === 'details' || activeView === 'confirmation' ? 'home' : activeView
        }
        onNavigateView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleSelectCategory}
      />

      {/* View Switcher Router */}
      <main>
        {/* 1. STORE HOMEPAGE */}
        {activeView === 'home' && (
          <StoreHome
            products={ENRICHED_STORE_PRODUCTS}
            userCountry={userCountry}
            wishlistIds={wishlistIds}
            cartProductIds={cartProductIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
            onViewAllSection={handleViewAllSection}
          />
        )}

        {/* 2. CATALOG & SEARCH & FILTERS */}
        {activeView === 'catalog' && (
          <StoreCatalog
            products={ENRICHED_STORE_PRODUCTS}
            userCountry={userCountry}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onClearSearch={() => setSearchQuery('')}
            wishlistIds={wishlistIds}
            cartProductIds={cartProductIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* 3. PRODUCT DETAILS VIEW */}
        {activeView === 'details' && selectedProduct && (
          <ProductDetailsView
            product={selectedProduct}
            userCountry={userCountry}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            isInCart={cartProductIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onBack={() => setActiveView('catalog')}
          />
        )}

        {/* 4. SHOPPING CART */}
        {activeView === 'cart' && (
          <StoreCartView
            cartItems={cartItems}
            allProducts={ENRICHED_STORE_PRODUCTS}
            userCountry={userCountry}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onMoveToWishlist={handleMoveToWishlist}
            onClearCart={handleClearCart}
            onProceedToCheckout={() => {
              setActiveView('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onContinueShopping={() => setActiveView('home')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* 5. WISHLIST */}
        {activeView === 'wishlist' && (
          <StoreWishlistView
            wishlistProducts={wishlistProducts}
            userCountry={userCountry}
            cartProductIds={cartProductIds}
            onRemoveWishlist={handleToggleWishlist}
            onMoveToCart={handleMoveWishlistToCart}
            onMoveAllToCart={handleMoveAllWishlistToCart}
            onContinueShopping={() => setActiveView('home')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* 6. CHECKOUT FLOW */}
        {activeView === 'checkout' && (
          <StoreCheckoutView
            cartItems={cartItems}
            allProducts={ENRICHED_STORE_PRODUCTS}
            userCountry={userCountry}
            appliedCoupon={appliedCoupon}
            savedAddress={shippingAddress}
            onSaveAddress={setShippingAddress}
            onBackToCart={() => setActiveView('cart')}
            onOrderComplete={handleOrderComplete}
          />
        )}

        {/* 7. ORDER CONFIRMATION */}
        {activeView === 'confirmation' && lastConfirmedOrder && (
          <StoreOrderConfirmation
            order={lastConfirmedOrder}
            userCountry={userCountry}
            onTrackOrder={() => {
              setActiveView('orders');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onContinueShopping={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 8. MY ORDERS & TRACKING */}
        {activeView === 'orders' && (
          <StoreOrdersView
            orders={orders}
            userCountry={userCountry}
            onAdvanceStatus={handleAdvanceOrderStatus}
            onReorder={handleReorder}
            onContinueShopping={() => setActiveView('home')}
          />
        )}
      </main>
    </div>
  );
};
