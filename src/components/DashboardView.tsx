import { useState, useMemo, FormEvent, useRef, ChangeEvent } from 'react';
import { 
  ShieldAlert, User, ShoppingBag, Plus, Edit2, Trash2, Tag, Percent, 
  BarChart3, Users, Landmark, AlertTriangle, CheckCircle, RefreshCw, Send, Sparkles, MapPin, Eye, FileText,
  Image, Upload
} from 'lucide-react';
import { Product, Order, Coupon, UserProfile, UserRole } from '../types';

interface DashboardViewProps {
  currentUser: UserProfile;
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  allUsers: UserProfile[];
  onSaveProduct: (product: Product) => Promise<void>;
  onRemoveProduct: (productId: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus'], paymentStatus: Order['paymentStatus']) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onSaveCoupon: (coupon: Coupon) => Promise<void>;
  onRemoveCoupon: (couponId: string) => Promise<void>;
  onUpdateUserRole: (uid: string, role: UserRole) => Promise<void>;
  setCurrentView: (view: string) => void;
  triggerNotification?: (message: string) => void;
}

export default function DashboardView({
  currentUser,
  products,
  orders,
  coupons,
  allUsers,
  onSaveProduct,
  onRemoveProduct,
  onUpdateOrderStatus,
  onDeleteOrder,
  onSaveCoupon,
  onRemoveCoupon,
  onUpdateUserRole,
  setCurrentView,
  triggerNotification
}: DashboardViewProps) {
  // Roles check
  const isAdmin = currentUser.role === 'Admin';
  const isEditor = currentUser.role === 'Editor';
  const isCustomer = currentUser.role === 'Customer';

  // Sub-navigation tab states
  // Admin tabs: 'analytics', 'products', 'orders', 'coupons', 'users'
  // Editor tabs: 'products' (limited actions)
  // Customer tabs: 'orders', 'coupons'
  const initialTab = isCustomer ? 'customer-orders' : 'products';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Form State - Add/Edit Product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [prodFormId, setProdFormId] = useState('');
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormBrand, setProdFormBrand] = useState('HS Fragrances');
  const [prodFormPrice, setProdFormPrice] = useState(10000);
  const [prodFormDiscount, setProdFormDiscount] = useState<number | ''>('');
  const [prodFormDesc, setProdFormDesc] = useState('');
  const [prodFormTop, setProdFormTop] = useState('');
  const [prodFormHeart, setProdFormHeart] = useState('');
  const [prodFormBase, setProdFormBase] = useState('');
  const [prodFormCat, setProdFormCat] = useState<'Men' | 'Women' | 'Unisex'>('Unisex');
  const [prodFormStock, setProdFormStock] = useState(15);
  const [prodFormImages, setProdFormImages] = useState<string[]>(['']);

  // Form State - Add/Edit Coupon
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [coupCode, setCoupCode] = useState('');
  const [coupType, setCoupType] = useState<'percentage' | 'fixed'>('percentage');
  const [coupValue, setCoupValue] = useState(15);
  const [coupMin, setCoupMin] = useState(5000);

  // Stats Analytics
  const stats = useMemo(() => {
    const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = allUsers.filter(u => u.role === 'Customer').length;
    return { totalSales, totalOrders, totalProducts, totalCustomers };
  }, [orders, products, allUsers]);

  // Handle image inputs change
  const [galleryTargetIndex, setGalleryTargetIndex] = useState<number | null>(null);
  const [uploadTargetIndex, setUploadTargetIndex] = useState<number | null>(null);
  const [uploadingIndices, setUploadingIndices] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const PRESET_GALLERY_IMAGES = [
    { url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800', label: 'Dark Oud Royale' },
    { url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800', label: 'Amber Gold Classic' },
    { url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800', label: 'Imperial Bloom' },
    { url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800', label: 'Sandalwood Aura' },
    { url: 'https://images.unsplash.com/photo-1585218356057-dc0e8d3558bb?auto=format&fit=crop&q=80&w=800', label: 'Bulgarian Rose' },
    { url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800', label: 'Obsidian Nocturne' },
    { url: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=800', label: 'Dewy Bergamot' },
    { url: 'https://images.unsplash.com/photo-1512781476588-f15d7a6a949a?auto=format&fit=crop&q=80&w=800', label: 'Vintage Atomizer' },
    { url: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=800', label: 'Citrus Sillage' },
    { url: 'https://images.unsplash.com/photo-1563170351-be82bc888bb4?auto=format&fit=crop&q=80&w=800', label: 'Patchouli Earth' },
    { url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800', label: 'Absolute Crystal' },
    { url: 'https://images.unsplash.com/photo-1557170334-a7c3d4ee7f07?auto=format&fit=crop&q=80&w=800', label: 'Luminous Elixir' },
  ];

  const handleSharedFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTargetIndex !== null) {
      const targetIndex = uploadTargetIndex;
      setUploadingIndices(prev => ({ ...prev, [targetIndex]: true }));

      const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || 'dcaomiuls';
      const uploadPreset = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || 'Hs-fragrances';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        if (data.secure_url) {
          const updated = [...prodFormImages];
          updated[targetIndex] = data.secure_url;
          setProdFormImages(updated);
          if (triggerNotification) {
            triggerNotification(`Image #${targetIndex + 1} uploaded to Cloudinary successfully!`);
          }
        } else {
          throw new Error('Cloudinary response did not return a secure_url');
        }
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        if (triggerNotification) {
          triggerNotification("Image upload failed. Check Cloudinary settings.");
        }
      } finally {
        setUploadingIndices(prev => ({ ...prev, [targetIndex]: false }));
        setUploadTargetIndex(null);
      }
    }
    e.target.value = '';
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...prodFormImages];
    updated[index] = val;
    setProdFormImages(updated);
  };

  const addImageField = () => {
    setProdFormImages([...prodFormImages, '']);
  };

  const removeImageField = (index: number) => {
    if (prodFormImages.length > 1) {
      setProdFormImages(prodFormImages.filter((_, idx) => idx !== index));
    }
  };

  // Product submission
  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prodFormName.trim() || !prodFormDesc.trim()) return;

    const filteredImages = prodFormImages.filter(img => img.trim() !== '');
    if (filteredImages.length === 0) {
      filteredImages.push('https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800'); // default fallback
    }

    const payload: Product = {
      id: prodFormId || 'p-' + Math.random().toString(36).substr(2, 9),
      name: prodFormName,
      brand: prodFormBrand,
      price: Number(prodFormPrice),
      discountPrice: prodFormDiscount === '' ? null : Number(prodFormDiscount),
      description: prodFormDesc,
      images: filteredImages,
      fragranceNotes: {
        top: prodFormTop || 'Bergamot',
        heart: prodFormHeart || 'Jasmine',
        base: prodFormBase || 'Vanilla'
      },
      category: prodFormCat,
      stockQuantity: Number(prodFormStock),
      rating: editingProduct?.rating || 5.0,
      reviews: editingProduct?.reviews || []
    };

    await onSaveProduct(payload);
    resetProductForm();
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdFormId(p.id);
    setProdFormName(p.name);
    setProdFormBrand(p.brand);
    setProdFormPrice(p.price);
    setProdFormDiscount(p.discountPrice === null ? '' : p.discountPrice);
    setProdFormDesc(p.description);
    setProdFormTop(p.fragranceNotes.top);
    setProdFormHeart(p.fragranceNotes.heart);
    setProdFormBase(p.fragranceNotes.base);
    setProdFormCat(p.category);
    setProdFormStock(p.stockQuantity);
    setProdFormImages(p.images.length > 0 ? p.images : ['']);
    setShowProductForm(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdFormId('');
    setProdFormName('');
    setProdFormPrice(10000);
    setProdFormDiscount('');
    setProdFormDesc('');
    setProdFormTop('');
    setProdFormHeart('');
    setProdFormBase('');
    setProdFormCat('Unisex');
    setProdFormStock(15);
    setProdFormImages(['']);
    setGalleryTargetIndex(null);
    setUploadTargetIndex(null);
    setUploadingIndices({});
    setShowProductForm(false);
  };

  // Coupon Submission
  const handleCouponSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coupCode.trim()) return;

    const payload: Coupon = {
      id: 'c-' + Math.random().toString(36).substr(2, 9),
      code: coupCode.trim().toUpperCase(),
      discountType: coupType,
      discountValue: Number(coupValue),
      minPurchase: Number(coupMin),
      active: true
    };

    await onSaveCoupon(payload);
    setCoupCode('');
    setCoupValue(15);
    setCoupMin(5000);
    setShowCouponForm(false);
  };

  // Filter orders belonging to the logged-in user if they are Customer
  const customerOrders = useMemo(() => {
    return orders.filter(o => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() || o.userId === currentUser.uid);
  }, [orders, currentUser]);

  return (
    <div className="bg-[#050505] text-white min-h-screen py-10" id="dashboard-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span>Role Level: {currentUser.role} Control Panel</span>
            </div>
            <h1 className="font-serif text-3xl font-light tracking-wide text-white mt-1">
              Welcome, {currentUser.displayName}
            </h1>
            <p className="text-xs text-white/40 font-light">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] bg-white/[0.01] border border-white/10 px-3.5 py-1.5 text-[#D4AF37] rounded-none">
            <span>Secure TLS Encryption: Active</span>
          </div>
        </div>

        {/* ROLE BASED SUB-NAVBAR CONTROL */}
        <div className="flex flex-wrap gap-2 pb-6 mb-8 border-b border-white/10">
          
          {/* Admin Tabs */}
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-none border ${
                  activeTab === 'analytics' ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-md' : 'bg-white/[0.01] border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
                id="btn-tab-analytics"
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-none border ${
                  activeTab === 'products' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/[0.01] border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
                id="btn-tab-products"
              >
                Manage Perfumes
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-none border ${
                  activeTab === 'orders' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/[0.01] border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
                id="btn-tab-orders"
              >
                Manage Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-none border ${
                  activeTab === 'coupons' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/[0.01] border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
                id="btn-tab-coupons"
              >
                Coupons
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-none border ${
                  activeTab === 'users' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/[0.01] border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
                id="btn-tab-users"
              >
                Manage Accounts
              </button>
            </>
          )}

          {/* Editor Tabs */}
          {isEditor && (
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-none border ${
                activeTab === 'products' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/[0.01] border-white/10 text-white/40 hover:text-white hover:border-white/20'
              }`}
              id="btn-tab-editor-products"
            >
              Inventory Management Only
            </button>
          )}

          {/* Customer Tabs */}
          {isCustomer && (
            <>
              <button
                onClick={() => setActiveTab('customer-orders')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-none border ${
                  activeTab === 'customer-orders' ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-md' : 'bg-white/[0.01] border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
                id="btn-tab-cust-orders"
              >
                My Luxury Orders ({customerOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('customer-coupons')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-none border ${
                  activeTab === 'customer-coupons' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/[0.01] border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
                id="btn-tab-cust-coupons"
              >
                Available Discounts ({coupons.length})
              </button>
            </>
          )}

        </div>

        {/* -------------------------------------------------------------
            TAB CONTENT: ANALYTICS (ADMIN ONLY)
            ------------------------------------------------------------- */}
        {activeTab === 'analytics' && isAdmin && (
          <div className="space-y-10">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/[0.01] border border-white/10 p-6 relative overflow-hidden rounded-none">
                <div className="absolute right-4 bottom-4 text-[#D4AF37]/5">
                  <Landmark className="w-16 h-16" />
                </div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/40">Gross Sillage Revenue</p>
                <p className="text-2xl font-serif font-light mt-2 text-[#D4AF37]">Rs. {stats.totalSales.toLocaleString()}</p>
                <p className="text-[10px] text-green-400 mt-2 font-mono tracking-wide">100% Settled Settlements</p>
              </div>

              <div className="bg-white/[0.01] border border-white/10 p-6 relative overflow-hidden rounded-none">
                <div className="absolute right-4 bottom-4 text-[#D4AF37]/5">
                  <ShoppingBag className="w-16 h-16" />
                </div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/40">Total Allocations Logged</p>
                <p className="text-2xl font-serif font-light mt-2 text-white">{stats.totalOrders}</p>
                <p className="text-[10px] text-white/30 mt-2 font-mono">Orders dispatch rate: 100%</p>
              </div>

              <div className="bg-white/[0.01] border border-white/10 p-6 relative overflow-hidden rounded-none">
                <div className="absolute right-4 bottom-4 text-[#D4AF37]/5">
                  <Tag className="w-16 h-16" />
                </div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/40">Unique Fragrances</p>
                <p className="text-2xl font-serif font-light mt-2 text-white">{stats.totalProducts}</p>
                <p className="text-[10px] text-white/30 mt-2 font-mono">Active boutique catalog</p>
              </div>

              <div className="bg-white/[0.01] border border-white/10 p-6 relative overflow-hidden rounded-none">
                <div className="absolute right-4 bottom-4 text-[#D4AF37]/5">
                  <Users className="w-16 h-16" />
                </div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/40">Registered Connoisseurs</p>
                <p className="text-2xl font-serif font-light mt-2 text-white">{stats.totalCustomers}</p>
                <p className="text-[10px] text-white/30 mt-2 font-mono">Verified accounts registered</p>
              </div>
            </div>

            {/* Custom visual Bento analytics graph */}
            <div className="p-6 bg-white/[0.01] border border-white/10 space-y-4 rounded-none">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-light uppercase tracking-widest">Scent Category Distribution</h3>
                <span className="text-[10px] font-mono text-white/30">Real-time stats</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {['Men', 'Women', 'Unisex'].map((cat) => {
                  const count = products.filter(p => p.category === cat).length;
                  const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
                  return (
                    <div key={cat} className="p-4 bg-black/40 border border-white/10 space-y-2 rounded-none">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-serif font-light text-white uppercase tracking-wider">{cat} Blends</span>
                        <span className="text-xs font-mono text-[#D4AF37] font-semibold">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-[#050505] h-1 rounded-none overflow-hidden">
                        <div className="bg-[#D4AF37] h-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB CONTENT: PRODUCTS (ADMIN & EDITOR)
            ------------------------------------------------------------- */}
        {activeTab === 'products' && (isAdmin || isEditor) && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-lg font-light uppercase tracking-widest text-white">Perfume Catalog</h2>
                <p className="text-xs text-white/40 font-light">
                  {isEditor ? 'You can adjust prices, stock parameters, and descriptive details.' : 'Complete catalog creation, adjustment and purging controls.'}
                </p>
              </div>

              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold text-xs uppercase tracking-widest rounded-none flex items-center gap-1.5 focus:outline-none transition-colors shadow-lg"
                id="btn-add-product-toggle"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Add Premium Perfume</span>
              </button>
            </div>

            {/* Product form modal/panel */}
            {showProductForm && (
              <div className="p-6 bg-white/[0.01] border border-[#D4AF37]/20 max-w-3xl mx-auto space-y-6 rounded-none">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="font-serif text-base font-light text-[#D4AF37] uppercase tracking-wider">
                    {editingProduct ? 'Edit Perfume Specifications' : 'Inject Luxury Perfume'}
                  </h3>
                  <button onClick={resetProductForm} className="text-white/40 hover:text-white font-mono text-[11px] uppercase tracking-widest" id="btn-close-prod-form">Cancel</button>
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Product ID (Unique, e.g. p7)</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingProduct}
                        value={prodFormId}
                        onChange={(e) => setProdFormId(e.target.value)}
                        placeholder="e.g. p7"
                        className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] disabled:opacity-50 rounded-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Perfume Title</label>
                      <input
                        type="text"
                        required
                        value={prodFormName}
                        onChange={(e) => setProdFormName(e.target.value)}
                        placeholder="e.g. Imperial Musc"
                        className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-serif"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Price (Rs.)</label>
                      <input
                        type="number"
                        required
                        value={prodFormPrice}
                        onChange={(e) => setProdFormPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Discount Price (Rs.) (Optional)</label>
                      <input
                        type="number"
                        value={prodFormDiscount}
                        onChange={(e) => setProdFormDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Leave empty if none"
                        className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Stock Quantity</label>
                      <input
                        type="number"
                        required
                        value={prodFormStock}
                        onChange={(e) => setProdFormStock(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Gender Category</label>
                      <select
                        value={prodFormCat}
                        onChange={(e) => setProdFormCat(e.target.value as any)}
                        className="w-full px-3 py-2 bg-black border border-white/10 text-[#D4AF37] focus:outline-none rounded-none"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Brand Label</label>
                      <input
                        type="text"
                        required
                        value={prodFormBrand}
                        onChange={(e) => setProdFormBrand(e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none"
                      />
                    </div>
                  </div>

                  {/* Notes specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Top Accord Notes</label>
                      <input
                        type="text"
                        required
                        value={prodFormTop}
                        onChange={(e) => setProdFormTop(e.target.value)}
                        placeholder="Saffron, Bergamot"
                        className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Heart Accord Notes</label>
                      <input
                        type="text"
                        required
                        value={prodFormHeart}
                        onChange={(e) => setProdFormHeart(e.target.value)}
                        placeholder="Jasmine, Patchouli"
                        className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Base Accord Notes</label>
                      <input
                        type="text"
                        required
                        value={prodFormBase}
                        onChange={(e) => setProdFormBase(e.target.value)}
                        placeholder="Oud, Vanilla, Musk"
                        className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Artisanal Narrative description</label>
                    <textarea
                      required
                      rows={3}
                      value={prodFormDesc}
                      onChange={(e) => setProdFormDesc(e.target.value)}
                      placeholder="Narrate the sillage, persistence, and emotional experience of this parfum..."
                      className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none"
                    />
                  </div>

                  {/* Multiple image inputs */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono uppercase text-white/40 block font-bold tracking-wider">Multiple Premium Image Links</label>
                    <div className="space-y-3">
                      {prodFormImages.map((imgUrl, idx) => (
                        <div key={idx} className="space-y-2 p-3 bg-white/[0.02] border border-white/5">
                          <div className="flex gap-3 items-center">
                            {/* Thumbnail Preview */}
                            <div className="w-12 h-12 border border-white/10 bg-black flex items-center justify-center overflow-hidden shrink-0 relative">
                              {uploadingIndices[idx] ? (
                                <RefreshCw className="w-4 h-4 text-[#D4AF37] animate-spin" />
                              ) : imgUrl ? (
                                <img src={imgUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=100'; }} />
                              ) : (
                                <Image className="w-4 h-4 text-white/20" />
                              )}
                            </div>

                            {/* Main Url Input */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                required
                                disabled={uploadingIndices[idx]}
                                value={imgUrl}
                                onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                                placeholder={uploadingIndices[idx] ? "Uploading directly to Cloudinary..." : "https://images.unsplash.com/... or upload"}
                                className={`w-full px-3 py-1.5 bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono ${uploadingIndices[idx] ? 'text-white/40' : ''}`}
                              />
                            </div>

                            {/* Trash/Remove */}
                            {prodFormImages.length > 1 && (
                              <button
                                type="button"
                                disabled={uploadingIndices[idx]}
                                onClick={() => removeImageField(idx)}
                                className={`p-2 text-red-400 hover:bg-neutral-900 rounded-none transition-colors shrink-0 ${uploadingIndices[idx] ? 'opacity-40 cursor-not-allowed' : ''}`}
                                title="Remove image field"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Elegant Actions Button Bar */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={uploadingIndices[idx]}
                              onClick={() => setGalleryTargetIndex(idx)}
                              className={`px-2.5 py-1 bg-black hover:bg-neutral-900 border border-white/10 text-[9px] uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                                uploadingIndices[idx] ? 'text-white/20 cursor-not-allowed' : 'text-[#D4AF37]'
                              }`}
                            >
                              <Image className="w-3 h-3" />
                              <span>Select from Gallery</span>
                            </button>

                            <button
                              type="button"
                              disabled={uploadingIndices[idx]}
                              onClick={() => {
                                setUploadTargetIndex(idx);
                                setTimeout(() => {
                                  if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                  }
                                }, 50);
                              }}
                              className={`px-2.5 py-1 bg-black hover:bg-neutral-900 border border-white/10 text-[9px] uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                                uploadingIndices[idx] ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:text-white'
                              }`}
                            >
                              {uploadingIndices[idx] ? (
                                <>
                                  <RefreshCw className="w-3 h-3 text-[#D4AF37] animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3 h-3 text-white/40" />
                                  <span>Upload Local Image</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addImageField}
                      className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest hover:text-white transition-colors"
                    >
                      + Add Additional Image Link
                    </button>
                  </div>

                  {/* Hidden Shared File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleSharedFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold tracking-widest text-xs uppercase rounded-none transition-colors"
                  >
                    {editingProduct ? 'Commit Specifications' : 'Inject Scent Into Database'}
                  </button>

                </form>
              </div>
            )}

            {/* Curated Scent Portrait Gallery Overlay */}
            {galleryTargetIndex !== null && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-[#050505] border border-[#D4AF37]/30 max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto rounded-none relative">
                  <div className="flex justify-between items-start border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-serif text-base font-light text-[#D4AF37] uppercase tracking-wider">
                        Exquisite Scent Portrait Gallery
                      </h3>
                      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-1">
                        Select a curated masterpiece for Image Slot #{galleryTargetIndex + 1}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGalleryTargetIndex(null)}
                      className="text-white/40 hover:text-white font-mono text-[10px] uppercase tracking-widest border border-white/10 px-2.5 py-1 hover:border-white/20 transition-colors"
                    >
                      Close
                    </button>
                  </div>

                  {/* Grid of high-end perfume portraits */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {PRESET_GALLERY_IMAGES.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const updated = [...prodFormImages];
                          updated[galleryTargetIndex] = item.url;
                          setProdFormImages(updated);
                          setGalleryTargetIndex(null);
                        }}
                        className="group relative aspect-square border border-white/10 hover:border-[#D4AF37] bg-black overflow-hidden flex flex-col text-left transition-all duration-300"
                      >
                        <div className="w-full flex-1 overflow-hidden relative">
                          <img
                            src={item.url}
                            alt={item.label}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                        <div className="p-2 bg-black border-t border-white/5 text-[9px] font-mono uppercase tracking-wider text-white/70 group-hover:text-[#D4AF37] transition-colors">
                          {item.label}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end border-t border-white/10 pt-3">
                    <button
                      type="button"
                      onClick={() => setGalleryTargetIndex(null)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider transition-colors"
                    >
                      Cancel Selection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products catalog list/grid */}
            <div className="overflow-x-auto bg-white/[0.01] border border-white/10 rounded-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase tracking-wider bg-black/40">
                    <th className="p-4">Allocated Scent</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Base Retail Price</th>
                    <th className="p-4">Offer Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="h-10 w-10 object-cover bg-black rounded-none border border-white/10" />
                          <div>
                            <span className="font-serif font-light text-white text-sm tracking-wide">{p.name}</span>
                            <span className="block text-[10px] text-white/40 font-mono">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-white/80">{p.category}</td>
                      <td className="p-4 font-mono">
                        <span className={`font-semibold ${p.stockQuantity <= 5 ? 'text-[#D4AF37]' : 'text-white/80'}`}>
                          {p.stockQuantity} Bottles
                        </span>
                      </td>
                      <td className="p-4 font-mono text-white/80">Rs. {p.price.toLocaleString()}</td>
                      <td className="p-4 font-mono text-[#D4AF37]">
                        {p.discountPrice ? `Rs. ${p.discountPrice.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEditProduct(p)}
                            className="p-1.5 text-white/60 hover:text-[#D4AF37] bg-white/[0.01] border border-white/10 hover:border-[#D4AF37]/50 rounded-none transition-colors"
                            title="Edit specifications"
                            id={`btn-edit-prod-${p.id}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* ONLY Admin role can delete products */}
                          {isAdmin && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to remove ${p.name}?`)) {
                                  onRemoveProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-neutral-500 hover:text-red-400 bg-white/[0.01] border border-white/10 rounded-none transition-colors"
                              title="Delete blend"
                              id={`btn-delete-prod-${p.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB CONTENT: ORDERS (ADMIN ONLY)
            ------------------------------------------------------------- */}
        {activeTab === 'orders' && isAdmin && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg font-light uppercase tracking-widest text-white">Active Customer Orders</h2>
            
            {orders.length === 0 ? (
              <p className="text-xs text-white/40 italic">No customer orders recorded in Database.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-6 bg-white/[0.01] border border-white/10 space-y-4 rounded-none">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-white/10">
                      <div>
                        <span className="font-mono text-[#D4AF37] font-semibold text-sm">Order {o.id}</span>
                        <span className="block text-[10px] text-white/40 font-mono">Date: {new Date(o.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2.5 py-1 text-[10px] font-bold font-mono uppercase rounded-none ${
                          o.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : o.orderStatus === 'Shipped' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'bg-white/5 text-white/60 border border-white/10'
                        }`}>
                          {o.orderStatus}
                        </span>
                        <span className={`px-2.5 py-1 text-[10px] font-bold font-mono uppercase rounded-none ${
                          o.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif leading-relaxed">
                      <div>
                        <p className="text-white/40 uppercase font-mono text-[9px] tracking-widest">Billing credentials</p>
                        <p className="font-light text-white text-sm mt-1 font-serif">{o.customerName}</p>
                        <p className="text-white/40 font-mono text-[11px]">{o.customerEmail} &bull; {o.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-white/40 uppercase font-mono text-[9px] tracking-widest">Dispatch Coordinates</p>
                        <p className="text-white/80 mt-1 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="font-light">{o.shippingAddress}</span>
                        </p>
                      </div>
                    </div>

                    {/* Order items list */}
                    <div className="space-y-2 border-t border-b border-white/10 py-3">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs items-center">
                          <span className="text-white/80 flex items-center gap-2">
                            <img src={item.image} alt="" className="h-8 w-8 object-cover bg-black rounded-none border border-white/10" />
                            <span className="font-serif font-light">{item.name} <strong className="font-mono text-white/40">x{item.quantity}</strong></span>
                          </span>
                          <span className="font-mono text-[#D4AF37]">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary row & Admin Status changer controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                      <div className="text-xs">
                        <span className="text-white/40 uppercase font-mono text-[9px] tracking-widest">Total Transaction:</span>
                        <span className="block font-semibold font-mono text-[#D4AF37] text-base mt-1">Rs. {o.totalAmount.toLocaleString()} via {o.paymentMethod}</span>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onUpdateOrderStatus(o.id, 'Confirmed', 'Paid')}
                          className="px-3 py-1.5 bg-white/[0.01] hover:bg-white/[0.03] text-[10px] font-mono uppercase text-green-400 border border-green-500/20 rounded-none transition-colors"
                          id={`btn-order-confirm-${o.id}`}
                        >
                          Confirm & Mark Paid
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(o.id, 'Shipped', o.paymentStatus)}
                          className="px-3 py-1.5 bg-white/[0.01] hover:bg-white/[0.03] text-[10px] font-mono uppercase text-[#D4AF37] border border-[#D4AF37]/20 rounded-none transition-colors"
                          id={`btn-order-ship-${o.id}`}
                        >
                          Ship Scent
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(o.id, 'Delivered', 'Paid')}
                          className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#b8962f] text-[10px] font-mono uppercase text-black font-semibold rounded-none transition-colors"
                          id={`btn-order-deliver-${o.id}`}
                        >
                          Delivered
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete Order ${o.id}?`)) {
                              onDeleteOrder(o.id);
                            }
                          }}
                          className="px-3 py-1.5 text-neutral-500 hover:text-red-400 hover:bg-white/[0.02] border border-white/10 rounded-none transition-colors"
                          id={`btn-order-delete-${o.id}`}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB CONTENT: COUPONS (ADMIN ONLY)
            ------------------------------------------------------------- */}
        {activeTab === 'coupons' && isAdmin && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-lg font-light uppercase tracking-widest text-white">Discounts & Coupons</h2>
              <button
                onClick={() => setShowCouponForm(!showCouponForm)}
                className="px-3 py-1.5 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest rounded-none flex items-center gap-1 focus:outline-none transition-colors hover:bg-[#b8962f]"
                id="btn-add-coupon-toggle"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Add Code</span>
              </button>
            </div>

            {showCouponForm && (
              <form onSubmit={handleCouponSubmit} className="p-5 bg-white/[0.01] border border-white/10 max-w-md mx-auto space-y-4 text-xs rounded-none">
                <h3 className="font-serif text-white uppercase font-light text-xs tracking-wider">New Luxury Coupon Code</h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Code String</label>
                  <input
                    type="text"
                    required
                    value={coupCode}
                    onChange={(e) => setCoupCode(e.target.value)}
                    placeholder="e.g. EXTRAOUD"
                    className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Discount Type</label>
                    <select
                      value={coupType}
                      onChange={(e) => setCoupType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none rounded-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (Rs.)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={coupValue}
                      onChange={(e) => setCoupValue(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Minimum Purchase Required (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={coupMin}
                    onChange={(e) => setCoupMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                  />
                </div>

                <button type="submit" className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold uppercase tracking-widest text-xs rounded-none transition-colors">
                  Save Coupon
                </button>
              </form>
            )}

            {/* Coupons list table */}
            <div className="overflow-hidden bg-white/[0.01] border border-white/10 rounded-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase bg-black/40">
                    <th className="p-4">Coupon Code</th>
                    <th className="p-4">Benefit</th>
                    <th className="p-4">Min. Purchase</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="p-4 font-mono font-semibold text-[#D4AF37] tracking-widest">{c.code}</td>
                      <td className="p-4 font-light text-white/80">
                        {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `Rs. ${c.discountValue.toLocaleString()} Off`}
                      </td>
                      <td className="p-4 font-mono text-white/80">Rs. {c.minPurchase.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onRemoveCoupon(c.id)}
                          className="p-1.5 text-white/40 hover:text-red-400 bg-white/[0.01] border border-white/10 hover:border-red-500/30 rounded-none transition-colors"
                          id={`btn-delete-coupon-${c.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB CONTENT: USERS (ADMIN ONLY)
            ------------------------------------------------------------- */}
        {activeTab === 'users' && isAdmin && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg font-light uppercase tracking-widest text-white">Client Credentials & Roles Control</h2>
            
            <div className="overflow-hidden bg-white/[0.01] border border-white/10 rounded-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase bg-black/40">
                    <th className="p-4">Name & Email</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4 text-right">Assign Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {allUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-white block font-serif tracking-wide">{u.displayName}</span>
                        <span className="text-[10px] text-white/40 font-mono">{u.email}</span>
                      </td>
                      <td className="p-4 font-mono">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-none ${
                          u.role === 'Admin' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : u.role === 'Editor' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-white/5 text-white/60 border border-white/10'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {/* Can change roles except self to prevent administrative locked states */}
                        {u.uid !== currentUser.uid ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => onUpdateUserRole(u.uid, 'Customer')}
                              className="px-2 py-1 border border-white/10 rounded-none text-[9px] uppercase font-mono text-white/40 hover:text-white hover:border-white/20 transition-all"
                              id={`btn-role-customer-${u.uid}`}
                            >
                              Set Cust
                            </button>
                            <button
                              onClick={() => onUpdateUserRole(u.uid, 'Editor')}
                              className="px-2 py-1 border border-white/10 rounded-none text-[9px] uppercase font-mono text-blue-400 hover:text-blue-300 hover:border-blue-500/20 transition-all"
                              id={`btn-role-editor-${u.uid}`}
                            >
                              Set Edit
                            </button>
                            <button
                              onClick={() => onUpdateUserRole(u.uid, 'Admin')}
                              className="px-2 py-1 border border-white/10 rounded-none text-[9px] uppercase font-mono text-[#D4AF37] hover:text-white hover:border-[#D4AF37]/20 transition-all"
                              id={`btn-role-admin-${u.uid}`}
                            >
                              Set Admin
                            </button>
                          </div>
                        ) : (
                          <span className="text-white/20 italic text-[10px] font-mono">Self Account</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB CONTENT: CUSTOMER ORDERS (CUSTOMER ONLY)
            ------------------------------------------------------------- */}
        {activeTab === 'customer-orders' && isCustomer && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg font-light uppercase tracking-widest text-white">Your Fragrance Allocations History</h2>
            
            {customerOrders.length === 0 ? (
              <div className="text-center py-16 bg-white/[0.01] border border-white/10 rounded-none space-y-4">
                <p className="text-white/40 italic text-sm font-serif font-light">You have not logged any fragrance allocations yet.</p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold uppercase tracking-widest text-[10px] rounded-none transition-colors shadow-lg"
                  id="btn-cust-order-shop"
                >
                  Browse Boutique
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {customerOrders.map((o) => (
                  <div key={o.id} className="p-5 bg-white/[0.01] border border-white/10 space-y-4 rounded-none">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-white/10">
                      <div>
                        <span className="font-mono text-[#D4AF37] font-semibold text-sm">Order ID: {o.id}</span>
                        <span className="block text-[10px] text-white/40 font-mono">Placed on: {new Date(o.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2.5 py-1 text-[10px] font-bold font-mono uppercase rounded-none ${
                          o.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : o.orderStatus === 'Shipped' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'bg-white/5 text-white/60 border border-white/10'
                        }`}>
                          {o.orderStatus}
                        </span>
                        <span className={`px-2.5 py-1 text-[10px] font-bold font-mono uppercase rounded-none ${
                          o.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Scent items */}
                    <div className="space-y-3">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img src={item.image} alt="" className="h-10 w-10 object-cover bg-black rounded-none border border-white/10 grayscale opacity-90" />
                          <div className="flex-1 min-w-0">
                            <span className="font-serif font-light text-white block truncate text-sm tracking-wide">{item.name}</span>
                            <span className="text-[10px] text-white/40 font-mono">Price: Rs. {item.price.toLocaleString()} x {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment message alert */}
                    {o.paymentStatus === 'Pending' && o.paymentMethod !== 'Cash on Delivery' && (
                      <div className="p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[#D4AF37] text-xs flex items-center gap-2 rounded-none font-light">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                        <span>Please remember to transfer Rs. {o.totalAmount.toLocaleString()} to our JazzCash account: <strong>03369296853</strong> for verification.</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 text-xs">
                      <div>
                        <span className="text-white/40 font-mono">Settled Payment Method:</span>
                        <span className="block font-serif font-light text-white mt-0.5">{o.paymentMethod}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white/40 font-mono text-[10px]">Total Amount Paid:</span>
                        <span className="block font-semibold font-mono text-[#D4AF37] text-sm mt-0.5">Rs. {o.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB CONTENT: CUSTOMER COUPONS (CUSTOMER ONLY)
            ------------------------------------------------------------- */}
        {activeTab === 'customer-coupons' && isCustomer && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg font-light uppercase tracking-widest text-white">Available Luxury Discount Vouchers</h2>
            <p className="text-xs text-white/40 font-light">Copy these exclusive vouchers to apply discount ratios at checkout.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="p-5 bg-white/[0.01] border border-white/10 flex justify-between items-center rounded-none">
                  <div className="space-y-1.5">
                    <span className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-xs font-mono font-semibold uppercase tracking-widest select-all rounded-none">
                      {c.code}
                    </span>
                    <p className="text-xs text-white font-serif font-light pt-2 uppercase tracking-wide">
                      {c.discountType === 'percentage' ? `${c.discountValue}% Off Total Order` : `Rs. ${c.discountValue.toLocaleString()} Off Order`}
                    </p>
                    <p className="text-[10px] text-white/40 font-mono">Min Purchase: Rs. {c.minPurchase.toLocaleString()}</p>
                  </div>
                  <div className="text-xs text-[#D4AF37] font-mono animate-pulse tracking-wider">
                    &bull; Active Code
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
