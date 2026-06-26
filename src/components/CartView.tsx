import { useState, FormEvent } from 'react';
import { X, Trash2, ShoppingBag, CreditCard, Sparkles, Check, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { Product, Coupon, Order, OrderItem } from '../types';

interface CartViewProps {
  cart: { product: Product; quantity: number }[];
  coupons: Coupon[];
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<string>;
  onClose: () => void;
  currentUser: { uid: string; email: string; displayName: string } | null;
}

export default function CartView({
  cart,
  coupons,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  onClose,
  currentUser
}: CartViewProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Checkout Form State
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Easypaisa' | 'JazzCash' | 'Bank Transfer' | 'Cash on Delivery'>('Cash on Delivery');
  
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccessOrderId, setCheckoutSuccessOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.discountPrice !== null ? item.product.discountPrice : item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  const couponDiscount = appliedCoupon ? (
    appliedCoupon.discountType === 'percentage'
      ? (subtotal * appliedCoupon.discountValue) / 100
      : appliedCoupon.discountValue
  ) : 0;

  const totalAmount = Math.max(0, subtotal - couponDiscount);

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    const code = couponCode.trim().toUpperCase();
    const found = coupons.find(c => c.code === code && c.active);

    if (!found) {
      setCouponError('Invalid or expired luxury coupon code.');
      setAppliedCoupon(null);
      return;
    }

    if (subtotal < found.minPurchase) {
      setCouponError(`Minimum purchase value of Rs. ${found.minPurchase.toLocaleString()} required for this coupon.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(found);
    setCouponSuccess(true);
  };

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setCheckoutError('');
    
    if (cart.length === 0) {
      setCheckoutError('Your shopping bag is empty.');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setCheckoutError('Please provide all shipping and contact credentials.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems: OrderItem[] = cart.map(item => {
        const price = item.product.discountPrice !== null ? item.product.discountPrice : item.product.price;
        return {
          productId: item.product.id,
          name: item.product.name,
          price,
          quantity: item.quantity,
          image: item.product.images[0]
        };
      });

      const orderData: Omit<Order, 'id' | 'createdAt'> = {
        userId: currentUser?.uid || null,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items: orderItems,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        orderStatus: 'Pending',
        couponUsed: appliedCoupon ? appliedCoupon.code : null
      };

      const orderId = await onPlaceOrder(orderData);
      setCheckoutSuccessOrderId(orderId);
      onClearCart();
    } catch (err) {
      console.error(err);
      setCheckoutError('Checkout failed. Please inspect your database connectivity parameters.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true" id="cart-drawer-container">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-lg">
            <div className="flex h-full flex-col bg-[#050505] border-l border-white/10 shadow-2xl text-white">
              
              {/* Drawer Header */}
              <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <h2 className="font-serif text-lg font-light uppercase tracking-widest text-white">Your Shopping Bag</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-white/40 hover:text-[#D4AF37] hover:bg-white/5 transition-colors focus:outline-none"
                  id="btn-cart-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success Screen after placing Order */}
              {checkoutSuccessOrderId ? (
                <div className="flex-1 px-6 py-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="h-16 w-16 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-light tracking-widest text-[#D4AF37] uppercase">Order Placed</h3>
                    <p className="text-xs text-white/50 max-w-xs leading-relaxed font-light">
                      Your premium fragrance order has been successfully locked in. Keep your Order ID safe to track your sillage journey.
                    </p>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/10 font-mono text-xs w-full max-w-xs">
                    <p className="text-white/40 uppercase text-[10px] tracking-widest">Your Private Order ID</p>
                    <p className="text-[#D4AF37] font-semibold text-lg mt-1 select-all">{checkoutSuccessOrderId}</p>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-[#D4AF37]/20 text-[11px] text-[#D4AF37] text-left space-y-2 max-w-sm font-light">
                    <p className="font-semibold flex items-center gap-1.5 uppercase tracking-wider"><Phone className="w-3.5 h-3.5" /> Next Steps:</p>
                    {paymentMethod !== 'Cash on Delivery' ? (
                      <p className="leading-relaxed">
                        Please proceed to transfer the total of <strong className="font-mono">Rs. {totalAmount.toLocaleString()}</strong> to our <strong>JazzCash Account: 03369296853</strong>. Our team will verify and dispatch within 24 hours.
                      </p>
                    ) : (
                      <p className="leading-relaxed">
                        Your order will be shipped via premium courier. Cash of Rs. {totalAmount.toLocaleString()} will be collected upon delivery.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={onClose}
                    className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold tracking-widest text-xs uppercase transition-all duration-300 w-full max-w-xs shadow-lg"
                    id="btn-cart-success-continue"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart items list */}
                  <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                        <ShoppingBag className="w-12 h-12 text-white/10 animate-pulse" />
                        <p className="text-xs text-white/40 italic font-light">Your luxury shopping bag is currently vacant.</p>
                        <button
                          onClick={onClose}
                          className="px-6 py-2.5 border border-[#D4AF37]/40 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold tracking-widest text-[10px] uppercase transition-all"
                          id="btn-cart-empty-shop"
                        >
                          Browse Boutique
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => {
                          const hasDisc = item.product.discountPrice !== null;
                          const singlePrice = hasDisc ? item.product.discountPrice! : item.product.price;
                          return (
                            <div 
                              key={item.product.id}
                              className="flex items-center gap-4 p-3 bg-white/[0.01] border border-white/10 group"
                            >
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name} 
                                className="h-16 w-16 object-cover bg-[#050505] border border-white/10 shrink-0 grayscale opacity-90"
                              />
                              <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="font-serif text-sm font-light uppercase truncate text-white tracking-wide">{item.product.name}</h4>
                                <p className="text-[10px] text-[#D4AF37] font-mono tracking-widest uppercase">{item.product.category}</p>
                                <div className="text-xs font-mono text-white/50">
                                  Rs. {singlePrice.toLocaleString()} x {item.quantity}
                                </div>
                              </div>
                              
                              {/* Quantity adjustments */}
                              <div className="flex flex-col items-end gap-2">
                                <button
                                  onClick={() => onRemoveFromCart(item.product.id)}
                                  className="text-white/40 hover:text-red-400 transition-colors"
                                  title="Remove allocation"
                                  id={`btn-cart-remove-${item.product.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-1.5 border border-white/10 bg-[#050505] px-1 py-0.5">
                                  <button
                                    onClick={() => onUpdateCartQty(item.product.id, item.quantity - 1)}
                                    className="text-[10px] text-white/40 hover:text-white px-1"
                                    id={`btn-cart-qty-minus-${item.product.id}`}
                                  >
                                    -
                                  </button>
                                  <span className="font-mono text-[11px] px-1 font-semibold">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                                    className="text-[10px] text-white/40 hover:text-white px-1"
                                    id={`btn-cart-qty-plus-${item.product.id}`}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Applied Coupon Display */}
                    {appliedCoupon && (
                      <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs flex items-center justify-between font-light">
                        <span className="font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" /> Coupon Applied: {appliedCoupon.code}
                        </span>
                        <button
                          onClick={() => setAppliedCoupon(null)}
                          className="text-white/40 hover:text-red-400 transition-colors"
                          id="btn-cart-coupon-remove"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Calculations and checkout form */}
                  {cart.length > 0 && (
                    <div className="border-t border-white/10 bg-black/40 px-6 py-6 space-y-6">
                      
                      {/* Coupon applier form */}
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="ENTER LUXURY COUPON (e.g. LUXURY20)"
                          className="flex-1 px-3 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-[10px] font-mono tracking-widest text-white uppercase placeholder-white/20 focus:outline-none rounded-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-3 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold text-[10px] uppercase tracking-widest transition-all"
                          id="btn-cart-coupon-apply"
                        >
                          Apply
                        </button>
                      </form>
                      {couponError && <p className="text-[10px] text-red-400 font-mono tracking-wide">{couponError}</p>}
                      {couponSuccess && <p className="text-[10px] text-green-400 font-mono tracking-wide">✨ Code verified. Luxury discount updated.</p>}

                      {/* Financial values */}
                      <div className="space-y-2 border-b border-white/10 pb-4 text-xs font-mono">
                        <div className="flex justify-between text-white/40">
                          <span>Luxury Subtotal</span>
                          <span>Rs. {subtotal.toLocaleString()}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between text-[#D4AF37]">
                            <span>Bespoke Discount</span>
                            <span>- Rs. {couponDiscount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-white/40">
                          <span>Shipping Assurance</span>
                          <span className="text-green-400 font-semibold uppercase">FREE</span>
                        </div>
                        <div className="flex justify-between text-sm text-white font-semibold pt-2">
                          <span className="font-serif uppercase tracking-widest">Total Allocation</span>
                          <span className="text-[#D4AF37]">Rs. {totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Checkout Information Form */}
                      <form onSubmit={handleCheckout} className="space-y-4">
                        <h3 className="font-serif text-xs uppercase tracking-widest text-white/60 font-semibold">Shipping Credentials</h3>
                        
                        {checkoutError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-1.5 font-mono">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{checkoutError}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono uppercase text-white/40 tracking-wider">Client Name</label>
                            <input
                              type="text"
                              required
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="e.g. Hissan Sethi"
                              className="w-full px-3 py-2.5 bg-[#050505] border border-white/10 text-xs text-white focus:outline-none placeholder-white/20 rounded-none focus:border-[#D4AF37] transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono uppercase text-white/40 tracking-wider">Client Email</label>
                            <input
                              type="email"
                              required
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              placeholder="e.g. hissansethi@gmail.com"
                              className="w-full px-3 py-2.5 bg-[#050505] border border-white/10 text-xs text-white focus:outline-none placeholder-white/20 rounded-none focus:border-[#D4AF37] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono uppercase text-white/40 tracking-wider">Phone (Easypaisa/JazzCash Contact)</label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="e.g. 03133492982"
                            className="w-full px-3 py-2.5 bg-[#050505] border border-white/10 text-xs text-white focus:outline-none placeholder-white/20 rounded-none focus:border-[#D4AF37] transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono uppercase text-white/40 tracking-wider">Shipping Address (Pakistan)</label>
                          <textarea
                            required
                            rows={2}
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="Detailed House No, Block, Society, City"
                            className="w-full px-3 py-2.5 bg-[#050505] border border-white/10 text-xs text-white focus:outline-none placeholder-white/20 rounded-none focus:border-[#D4AF37] transition-colors"
                          />
                        </div>

                        {/* Payment Selection */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono uppercase text-white/40 tracking-wider">Allocation Settlement Method</label>
                          <div className="grid grid-cols-2 gap-2">
                            {([
                              'Cash on Delivery', 
                              'JazzCash', 
                              'Easypaisa', 
                              'Bank Transfer'
                            ] as const).map((method) => (
                              <button
                                type="button"
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`px-2 py-2.5 text-[10px] uppercase tracking-wider border text-center transition-colors duration-300 focus:outline-none font-semibold rounded-none ${
                                  paymentMethod === method
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                                    : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white'
                                }`}
                                id={`btn-pay-method-${method.replace(/\s+/g, '-')}`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Payment Details Helper Box */}
                        {paymentMethod !== 'Cash on Delivery' && (
                          <div className="p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/10 text-[10px] text-[#D4AF37]/90 leading-relaxed space-y-1 font-light">
                            {paymentMethod === 'JazzCash' && (
                              <p>
                                📱 Please transfer <strong>Rs. {totalAmount.toLocaleString()}</strong> to JazzCash number: <strong>03369296853</strong> before clicking submit. Mention your name in remarks.
                              </p>
                            )}
                            {paymentMethod === 'Easypaisa' && (
                              <p>
                                📱 Please transfer <strong>Rs. {totalAmount.toLocaleString()}</strong> to Easypaisa number: <strong>03133492982</strong>.
                              </p>
                            )}
                            {paymentMethod === 'Bank Transfer' && (
                              <p>
                                🏦 <strong>Meezan Bank Ltd</strong> <br />
                                A/C Name: HS Fragrances <br />
                                A/C No: 1209-38491823-01 <br />
                                Send receipt to hissansethi0@gmail.com
                              </p>
                            )}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold tracking-widest text-xs uppercase transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none shadow-lg"
                          id="btn-cart-submit-order"
                        >
                          <CreditCard className="w-4 h-4 text-black" />
                          <span>{isSubmitting ? 'Securing Scent Allocation...' : 'Lock In Scent Order'}</span>
                          <ArrowRight className="w-4 h-4 text-black" />
                        </button>
                      </form>

                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
