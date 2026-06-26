import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  getDocFromServer
} from 'firebase/firestore';
import { Product, Order, Coupon, UserProfile, UserRole } from './types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from './data/initialProducts';

// Hardcoded Firebase configuration supplied by the user
const firebaseConfig = {
  apiKey: "AIzaSyDJAkrKfc6UQI9XZ6d6n8e-Jf-pxfa4g6s",
  authDomain: "hs-fragrances.firebaseapp.com",
  projectId: "hs-fragrances",
  storageBucket: "hs-fragrances.firebasestorage.app",
  messagingSenderId: "1092143134459",
  appId: "1:1092143134459:web:c058a57566f16af767625e",
  measurementId: "G-N7JZDLYDY2"
};

// Initialize Firebase App
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (error) {
  console.error("Firebase App initialization failed:", error);
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connectivity Test
let connectionListener: (() => void) | null = null;

export function registerConnectionListener(listener: () => void) {
  connectionListener = listener;
}

export async function testConnection() {
  try {
    // Race connection check with a 2-second timeout to prevent initial boot freeze
    const connPromise = getDocFromServer(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000));
    
    await Promise.race([connPromise, timeoutPromise]);
    console.log("Firebase Firestore connected successfully. Activating Live Cloud DB.");
    setDatabaseMode('firebase');
    if (connectionListener) {
      connectionListener();
    }
  } catch (error) {
    console.warn("Firebase Firestore is unreachable or unauthorized. Running in high-performance local-fallback mode.", error);
    setDatabaseMode('local');
  }
}

// Helper to enforce a timeout on promise execution
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Timeout waiting for Firestore response"));
    }, timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

// Operation Types for custom structured errors
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Custom error logger
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// LOCAL STORAGE DB FALLBACK
// -------------------------------------------------------------
// This fallback ensures that the live application is always fully
// interactive even if Firebase rules, API quotas, or network issues occur.
const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'hs_fragrances_products',
  ORDERS: 'hs_fragrances_orders',
  COUPONS: 'hs_fragrances_coupons',
  USERS: 'hs_fragrances_users',
  CURRENT_USER: 'hs_fragrances_current_user'
};

function initLocalStorageData() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.COUPONS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)) {
    // Initial users (Admin seeded as Hissan Sethi per user instruction)
    const initialUsers: UserProfile[] = [
      {
        uid: 'hissan-admin-uid',
        email: 'hissansethi0@gmail.com',
        displayName: 'Hissan Sethi (Admin)',
        role: 'Admin',
        createdAt: new Date().toISOString()
      },
      {
        uid: 'user1',
        email: 'customer@hs.com',
        displayName: 'Ali Malik (Customer)',
        role: 'Customer',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
}
initLocalStorageData();

// -------------------------------------------------------------
// DATA OPERATION LAYER (With graceful online-first, local-second strategy)
// -------------------------------------------------------------

// Active mode switcher (can be toggled if firebase fails)
// Default to false (local storage fallback) initially so that initial loading succeeds instantly.
// If testConnection succeeds in the background, we will upgrade the mode to true.
let useFirebaseOnly = false;

export const setDatabaseMode = (mode: 'firebase' | 'local') => {
  useFirebaseOnly = mode === 'firebase';
  console.log(`Database engine set to: ${useFirebaseOnly ? 'Firebase Firestore' : 'LocalStorage'}`);
};

export const getDatabaseMode = () => useFirebaseOnly ? 'firebase' : 'local';

// -- Products Operations --
export async function fetchProducts(): Promise<Product[]> {
  if (useFirebaseOnly) {
    const path = 'products';
    try {
      const qSnapshot = await withTimeout(getDocs(collection(db, path)), 2500);
      if (qSnapshot.empty) {
        // Seed initial products to Firestore
        for (const prod of INITIAL_PRODUCTS) {
          await withTimeout(setDoc(doc(db, path, prod.id), prod), 2000).catch(e => console.warn("Seed write timed out", e));
        }
        return INITIAL_PRODUCTS;
      }
      return qSnapshot.docs.map(d => d.data() as Product);
    } catch (err) {
      console.warn("Firestore products fetch failed or timed out. Falling back to LocalStorage.", err);
      // Automatically switch to offline mode to keep UI responsive
      setDatabaseMode('local');
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
    }
  }
  
  // Local fallback
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
}

export async function saveProduct(product: Product): Promise<void> {
  // Update local storage first
  const localProds = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
  const idx = localProds.findIndex((p: Product) => p.id === product.id);
  if (idx > -1) {
    localProds[idx] = product;
  } else {
    localProds.push(product);
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(localProds));

  if (useFirebaseOnly) {
    const path = `products/${product.id}`;
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
}

export async function removeProduct(productId: string): Promise<void> {
  const localProds = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
  const filtered = localProds.filter((p: Product) => p.id !== productId);
  localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));

  if (useFirebaseOnly) {
    const path = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }
}

// -- Orders Operations --
export async function fetchOrders(): Promise<Order[]> {
  if (useFirebaseOnly) {
    const path = 'orders';
    try {
      const qSnapshot = await withTimeout(getDocs(collection(db, path)), 2500);
      return qSnapshot.docs.map(d => d.data() as Order);
    } catch (err) {
      console.warn("Firestore orders fetch failed or timed out. Falling back to LocalStorage.", err);
      setDatabaseMode('local');
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
    }
  }
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
}

export async function createOrder(order: Order): Promise<void> {
  // Save to local
  const localOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
  localOrders.push(order);
  localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(localOrders));

  // Deduct stock locally
  const localProducts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
  for (const item of order.items) {
    const pIdx = localProducts.findIndex((p: Product) => p.id === item.productId);
    if (pIdx > -1) {
      localProducts[pIdx].stockQuantity = Math.max(0, localProducts[pIdx].stockQuantity - item.quantity);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(localProducts));

  if (useFirebaseOnly) {
    const path = `orders/${order.id}`;
    try {
      await setDoc(doc(db, 'orders', order.id), order);
      
      // Update stock in Firestore
      for (const item of order.items) {
        try {
          const pDoc = await getDoc(doc(db, 'products', item.productId));
          if (pDoc.exists()) {
            const pData = pDoc.data() as Product;
            const newStock = Math.max(0, pData.stockQuantity - item.quantity);
            await updateDoc(doc(db, 'products', item.productId), { stockQuantity: newStock });
          }
        } catch (stockErr) {
          console.error("Failed to deduct stock for product", item.productId, stockErr);
        }
      }
    } catch (err) {
      console.warn("Best-effort Firestore createOrder failed:", err);
    }
  }
}

export async function updateOrderStatus(orderId: string, status: Order['orderStatus'], paymentStatus: Order['paymentStatus']): Promise<void> {
  const localOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
  const idx = localOrders.findIndex((o: Order) => o.id === orderId);
  if (idx > -1) {
    localOrders[idx].orderStatus = status;
    localOrders[idx].paymentStatus = paymentStatus;
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(localOrders));
  }

  if (useFirebaseOnly) {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), { orderStatus: status, paymentStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  const localOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
  const filtered = localOrders.filter((o: Order) => o.id !== orderId);
  localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(filtered));

  if (useFirebaseOnly) {
    const path = `orders/${orderId}`;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }
}

// -- Coupons Operations --
export async function fetchCoupons(): Promise<Coupon[]> {
  if (useFirebaseOnly) {
    const path = 'coupons';
    try {
      const qSnapshot = await withTimeout(getDocs(collection(db, path)), 2500);
      if (qSnapshot.empty) {
        for (const coup of INITIAL_COUPONS) {
          await withTimeout(setDoc(doc(db, path, coup.id), coup), 2000).catch(e => console.warn("Seed write timed out", e));
        }
        return INITIAL_COUPONS;
      }
      return qSnapshot.docs.map(d => d.data() as Coupon);
    } catch (err) {
      console.warn("Firestore coupons fetch failed or timed out. Falling back to LocalStorage.", err);
      setDatabaseMode('local');
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.COUPONS) || '[]');
    }
  }
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.COUPONS) || '[]');
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const localCoupons = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.COUPONS) || '[]');
  const idx = localCoupons.findIndex((c: Coupon) => c.id === coupon.id);
  if (idx > -1) {
    localCoupons[idx] = coupon;
  } else {
    localCoupons.push(coupon);
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.COUPONS, JSON.stringify(localCoupons));

  if (useFirebaseOnly) {
    const path = `coupons/${coupon.id}`;
    try {
      await setDoc(doc(db, 'coupons', coupon.id), coupon);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
}

export async function removeCoupon(couponId: string): Promise<void> {
  const localCoupons = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.COUPONS) || '[]');
  const filtered = localCoupons.filter((c: Coupon) => c.id !== couponId);
  localStorage.setItem(LOCAL_STORAGE_KEYS.COUPONS, JSON.stringify(filtered));

  if (useFirebaseOnly) {
    const path = `coupons/${couponId}`;
    try {
      await deleteDoc(doc(db, 'coupons', couponId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }
}

// -- User Profiles Operations --
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  if (useFirebaseOnly) {
    const path = `users/${uid}`;
    try {
      const docSnap = await withTimeout(getDoc(doc(db, 'users', uid)), 2500);
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        if (profile.email && profile.email.toLowerCase() === 'hissansethi0@gmail.com') {
          profile.role = 'Admin';
        }
        return profile;
      }
    } catch (err) {
      console.warn("Firestore user Profile fetch failed or timed out. Trying local storage database fallback.", err);
    }
  }

  const localUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) || '[]');
  const found = localUsers.find((u: UserProfile) => u.uid === uid);
  if (found) {
    if (found.email && found.email.toLowerCase() === 'hissansethi0@gmail.com') {
      found.role = 'Admin';
    }
    return found;
  }
  return null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const localUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) || '[]');
  const idx = localUsers.findIndex((u: UserProfile) => u.uid === profile.uid);
  if (idx > -1) {
    localUsers[idx] = profile;
  } else {
    localUsers.push(profile);
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(localUsers));

  if (useFirebaseOnly) {
    const path = `users/${profile.uid}`;
    try {
      await setDoc(doc(db, 'users', profile.uid), profile);
    } catch (err) {
      console.warn("Best-effort Firestore saveUserProfile failed:", err);
    }
  }
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  if (useFirebaseOnly) {
    const path = 'users';
    try {
      const qSnapshot = await withTimeout(getDocs(collection(db, path)), 2500);
      const list = qSnapshot.docs.map(d => d.data() as UserProfile);
      list.forEach(u => {
        if (u.email && u.email.toLowerCase() === 'hissansethi0@gmail.com') {
          u.role = 'Admin';
        }
      });
      return list;
    } catch (err) {
      console.warn("Firestore users fetch failed or timed out. Falling back to LocalStorage.", err);
      setDatabaseMode('local');
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) || '[]');
    }
  }
  const localList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) || '[]');
  localList.forEach((u: UserProfile) => {
    if (u.email && u.email.toLowerCase() === 'hissansethi0@gmail.com') {
      u.role = 'Admin';
    }
  });
  return localList;
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  const localUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) || '[]');
  const idx = localUsers.findIndex((u: UserProfile) => u.uid === uid);
  if (idx > -1) {
    localUsers[idx].role = role;
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(localUsers));
  }

  if (useFirebaseOnly) {
    const path = `users/${uid}`;
    try {
      await updateDoc(doc(db, 'users', uid), { role });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}
