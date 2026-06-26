import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import ProductDetailView from './components/ProductDetailView';
import CartView from './components/CartView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import OtherViews from './components/OtherViews';

import { 
  fetchProducts, saveProduct, removeProduct, 
  fetchOrders, createOrder, updateOrderStatus, deleteOrder,
  fetchCoupons, saveCoupon, removeCoupon,
  fetchUserProfile, saveUserProfile, fetchAllUsers, updateUserRole,
  auth, registerConnectionListener, testConnection, getDatabaseMode
} from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

import { Product, Order, Coupon, UserProfile, UserRole, Review } from './types';

export default function App() {
  // Navigation View State
  // Possible views: 'home' | 'shop' | 'product-details' | 'about' | 'contact' | 'faq' | 'blog' | 'wishlist' | 'track-order' | 'login' | 'dashboard'
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  
  // Shopping States
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // App notification banner
  const [notification, setNotification] = useState<string | null>(null);

  // Load initial datasets from our persistent online/offline database engine
  useEffect(() => {
    async function loadInitialData() {
      try {
        const loadedProds = await fetchProducts();
        setProducts(loadedProds);

        const loadedOrders = await fetchOrders();
        setOrders(loadedOrders);

        const loadedCoupons = await fetchCoupons();
        setCoupons(loadedCoupons);

        const usersList = await fetchAllUsers();
        setAllUsers(usersList);
      } catch (err) {
        console.error("Error fetching initial database entities:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [currentUser]);

  // Register connection listener and kick off connectivity check on mount
  useEffect(() => {
    registerConnectionListener(() => {
      // Live Firebase connected successfully! Reload all datasets from live Firestore
      async function reloadLiveData() {
        try {
          const loadedProds = await fetchProducts();
          setProducts(loadedProds);

          const loadedOrders = await fetchOrders();
          setOrders(loadedOrders);

          const loadedCoupons = await fetchCoupons();
          setCoupons(loadedCoupons);

          const usersList = await fetchAllUsers();
          setAllUsers(usersList);
          
          triggerNotification("Upgraded to real-time Cloud Sync.");
        } catch (err) {
          console.error("Error upgrading to live Firebase data:", err);
        }
      }
      reloadLiveData();
    });
    
    testConnection();
  }, []);

  // Handle Firebase and Local Storage Auth syncing
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Logged in
        const profile = await fetchUserProfile(firebaseUser.uid);
        const isHissan = firebaseUser.email?.toLowerCase() === 'hissansethi0@gmail.com';
        if (profile) {
          if (isHissan && profile.role !== 'Admin') {
            profile.role = 'Admin';
            await saveUserProfile(profile);
          }
          setCurrentUser(profile);
        } else {
          // If profile hasn't been written to firestore yet, write a default customer profile
          const defaultProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || (isHissan ? 'Hissan Sethi' : 'Connoisseur'),
            role: isHissan ? 'Admin' : 'Customer',
            createdAt: new Date().toISOString()
          };
          await saveUserProfile(defaultProfile);
          setCurrentUser(defaultProfile);
        }
      } else {
        // Try looking in local storage fallback first if we logged out or are in local offline mode
        const savedDemoUser = localStorage.getItem('hs_fragrances_active_demo_user');
        if (savedDemoUser) {
          setCurrentUser(JSON.parse(savedDemoUser));
        } else {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Utility to show beautiful quick toast notification
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // -------------------------------------------------------------
  // SHOPPING CART CONTROLS
  // -------------------------------------------------------------
  const handleAddToCart = (product: Product, quantity: number) => {
    if (product.stockQuantity === 0) {
      triggerNotification(`Sorry, ${product.name} is currently sold out.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stockQuantity, existing.quantity + quantity);
        triggerNotification(`Updated quantity of ${product.name} in your bag.`);
        return prevCart.map(item => 
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        triggerNotification(`Added ${product.name} to your luxury shopping bag.`);
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) => 
      prevCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.product.id !== productId));
    triggerNotification("Removed fragrance allocation from bag.");
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // -------------------------------------------------------------
  // WISHLIST CONTROLS
  // -------------------------------------------------------------
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prevWish) => {
      const exists = prevWish.some(p => p.id === product.id);
      if (exists) {
        triggerNotification(`Removed ${product.name} from your private wishlist.`);
        return prevWish.filter(p => p.id !== product.id);
      } else {
        triggerNotification(`Added ${product.name} to your private wishlist.`);
        return [...prevWish, product];
      }
    });
  };

  // -------------------------------------------------------------
  // AUTHENTICATION OPERATIONS
  // -------------------------------------------------------------
  const handleLogin = async (emailStr: string, passwordStr: string, isDemo = false, demoRole: UserRole = 'Customer') => {
    if (isDemo) {
      // Instant Concierge Access Gate
      const mockProfile: UserProfile = {
        uid: 'demo-' + demoRole.toLowerCase() + '-' + Math.random().toString(36).substr(2, 5),
        email: demoRole.toLowerCase() + '@hs.com',
        displayName: `Demo ${demoRole}`,
        role: demoRole,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('hs_fragrances_active_demo_user', JSON.stringify(mockProfile));
      setCurrentUser(mockProfile);
      triggerNotification(`Bypassed auth: Logged in as Demo ${demoRole}`);
      return;
    }

    // Regular Firebase Authentication Flow
    if (getDatabaseMode() === 'firebase') {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailStr, passwordStr);
        const profile = await fetchUserProfile(userCredential.user.uid);
        if (profile) {
          setCurrentUser(profile);
          triggerNotification(`Access authorized. Welcome back, ${profile.displayName}.`);
          return;
        }
      } catch (err: any) {
        console.warn("Firebase authentication failed. Trying local storage database fallback.", err);
      }
    }

    // Local Fallback Credentials Verification
    const localUsers: UserProfile[] = JSON.parse(localStorage.getItem('hs_fragrances_users') || '[]');
    const matchedUser = localUsers.find(u => u.email.toLowerCase() === emailStr.toLowerCase());
    if (matchedUser) {
      localStorage.setItem('hs_fragrances_active_demo_user', JSON.stringify(matchedUser));
      setCurrentUser(matchedUser);
      triggerNotification(`Access authorized (Local). Welcome, ${matchedUser.displayName}.`);
    } else {
      throw new Error("No client profile found matching those credentials. Try registering a new luxury account.");
    }
  };

  const handleRegister = async (emailStr: string, passwordStr: string, nameStr: string, roleStr: UserRole) => {
    const assignedRole: UserRole = emailStr.toLowerCase() === 'hissansethi0@gmail.com' ? 'Admin' : 'Customer';
    
    // Regular Firebase Registration Flow
    if (getDatabaseMode() === 'firebase') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailStr, passwordStr);
        const newProfile: UserProfile = {
          uid: userCredential.user.uid,
          email: emailStr,
          displayName: nameStr,
          role: assignedRole,
          createdAt: new Date().toISOString()
        };
        await saveUserProfile(newProfile);
        setCurrentUser(newProfile);
        triggerNotification(`Luxury credentials cataloged. Welcome, ${nameStr}!`);
        return;
      } catch (err: any) {
        console.warn("Firebase registration failed. Cataloging locally.", err);
      }
    }

    // Local Fallback Account Generation
    const localUsers: UserProfile[] = JSON.parse(localStorage.getItem('hs_fragrances_users') || '[]');
    const exists = localUsers.some(u => u.email.toLowerCase() === emailStr.toLowerCase());
    if (exists) {
      throw new Error("An account with this email address has already been cataloged.");
    }

    const newLocalProfile: UserProfile = {
      uid: 'local-' + Math.random().toString(36).substr(2, 9),
      email: emailStr,
      displayName: nameStr,
      role: assignedRole,
      createdAt: new Date().toISOString()
    };

    localUsers.push(newLocalProfile);
    localStorage.setItem('hs_fragrances_users', JSON.stringify(localUsers));
    localStorage.setItem('hs_fragrances_active_demo_user', JSON.stringify(newLocalProfile));

    // Async save to local/live (best-effort)
    await saveUserProfile(newLocalProfile);

    setCurrentUser(newLocalProfile);
    triggerNotification(`Luxury credentials cataloged (Local). Welcome, ${nameStr}!`);
  };

  const handleLogout = async () => {
    localStorage.removeItem('hs_fragrances_active_demo_user');
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Firebase signOut threw error, logged out locally successfully.", err);
    }
    setCurrentUser(null);
    setCurrentView('home');
    triggerNotification("Logged out of scent concierge lounge.");
  };

  // -------------------------------------------------------------
  // BACKEND / DATABASE COMMITS
  // -------------------------------------------------------------
  const handlePlaceOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newId = 'HS-' + Math.floor(1000 + Math.random() * 9000);
    const fullOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    await createOrder(fullOrder);
    
    // Refresh products list to reflect deducted stock levels
    const updatedProds = await fetchProducts();
    setProducts(updatedProds);
    
    // Refresh orders list
    const updatedOrders = await fetchOrders();
    setOrders(updatedOrders);

    triggerNotification(`Scent Order ${newId} logged successfully!`);
    return newId;
  };

  const handleSaveProduct = async (productData: Product) => {
    await saveProduct(productData);
    const updatedProds = await fetchProducts();
    setProducts(updatedProds);
    triggerNotification("Perfume specifications saved successfully.");
  };

  const handleRemoveProduct = async (productId: string) => {
    await removeProduct(productId);
    const updatedProds = await fetchProducts();
    setProducts(updatedProds);
    triggerNotification("Perfume removed from boutique catalog.");
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus'], paymentStatus: Order['paymentStatus']) => {
    await updateOrderStatus(orderId, status, paymentStatus);
    const updatedOrders = await fetchOrders();
    setOrders(updatedOrders);
    triggerNotification(`Order ${orderId} dispatch status set to ${status}.`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    await deleteOrder(orderId);
    const updatedOrders = await fetchOrders();
    setOrders(updatedOrders);
    triggerNotification(`Order ${orderId} cancelled & deleted.`);
  };

  const handleSaveCoupon = async (couponData: Coupon) => {
    await saveCoupon(couponData);
    const updatedCoupons = await fetchCoupons();
    setCoupons(updatedCoupons);
    triggerNotification("Luxury coupon code configured.");
  };

  const handleRemoveCoupon = async (couponId: string) => {
    await removeCoupon(couponId);
    const updatedCoupons = await fetchCoupons();
    setCoupons(updatedCoupons);
    triggerNotification("Coupon removed.");
  };

  const handleUpdateUserRole = async (uid: string, role: UserRole) => {
    if (!currentUser || currentUser.email.toLowerCase() !== 'hissansethi0@gmail.com') {
      triggerNotification("Access Denied: Only Hissan Sethi (hissansethi0@gmail.com) can manage account roles.");
      return;
    }
    await updateUserRole(uid, role);
    const usersList = await fetchAllUsers();
    setAllUsers(usersList);
    triggerNotification("Client authorization status updated.");
  };

  const handleAddReview = async (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;

    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Math.random().toString(36).substr(2, 5),
      date: new Date().toLocaleDateString()
    };

    const updatedReviews = [...targetProduct.reviews, newReview];
    // Recalculate average rating
    const avgRating = Number(
      (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
    );

    const updatedProduct: Product = {
      ...targetProduct,
      reviews: updatedReviews,
      rating: avgRating
    };

    await handleSaveProduct(updatedProduct);
    setSelectedProduct(updatedProduct); // refresh current detail view profile
  };

  // Helper helper to switch product detail screen cleanly
  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-neutral-950 text-white min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Absolute Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-black border border-amber-500/30 text-amber-300 text-xs font-serif font-bold tracking-wider flex items-center gap-2 shadow-2xl animate-slideUp">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header element */}
      <Header 
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setSelectedProduct(null);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        cart={cart}
        wishlist={wishlist}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Primary Layout Router */}
      <main className="flex-grow">
        {loading ? (
          <div className="h-[75vh] flex flex-col items-center justify-center space-y-4">
            <span className="h-10 w-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-xs uppercase font-mono tracking-[0.2em] text-neutral-500">Retrieving Olfactory Datasets...</p>
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <HomeView 
                onSelectProduct={viewProductDetails}
                products={products}
                onAddToCart={handleAddToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                setCurrentView={setCurrentView}
              />
            )}

            {currentView === 'shop' && (
              <ShopView 
                products={products}
                onSelectProduct={viewProductDetails}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            )}

            {currentView === 'product-details' && selectedProduct && (
              <ProductDetailView 
                product={selectedProduct}
                allProducts={products}
                onBackToShop={() => setCurrentView('shop')}
                onSelectProduct={viewProductDetails}
                onAddToCart={handleAddToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddReview={handleAddReview}
              />
            )}

            {currentView === 'login' && (
              <AuthView 
                onLogin={handleLogin}
                onRegister={handleRegister}
                onBackToHome={() => setCurrentView('home')}
              />
            )}

            {currentView === 'dashboard' && currentUser && (
              <DashboardView 
                currentUser={currentUser}
                products={products}
                orders={orders}
                coupons={coupons}
                allUsers={allUsers}
                onSaveProduct={handleSaveProduct}
                onRemoveProduct={handleRemoveProduct}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onDeleteOrder={handleDeleteOrder}
                onSaveCoupon={handleSaveCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onUpdateUserRole={handleUpdateUserRole}
                setCurrentView={setCurrentView}
                triggerNotification={triggerNotification}
              />
            )}

            {/* Other static views */}
            {['about', 'contact', 'faq', 'blog', 'wishlist', 'track-order'].includes(currentView) && (
              <OtherViews 
                viewType={currentView as any}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={viewProductDetails}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                orders={orders}
              />
            )}
          </>
        )}
      </main>

      {/* Cart Slider Overlay */}
      {isCartOpen && (
        <CartView 
          cart={cart}
          coupons={coupons}
          onUpdateCartQty={handleUpdateCartQty}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onPlaceOrder={handlePlaceOrder}
          onClose={() => setIsCartOpen(false)}
          currentUser={currentUser}
        />
      )}

      {/* Footer element */}
      <Footer setCurrentView={(view) => {
        setCurrentView(view);
        setSelectedProduct(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

    </div>
  );
}
