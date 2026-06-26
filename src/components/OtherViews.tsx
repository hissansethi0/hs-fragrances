import { useState, FormEvent } from 'react';
import { 
  Heart, Trash2, ShoppingBag, Eye, Send, MapPin, Phone, Mail, 
  HelpCircle, ChevronDown, ChevronUp, BookOpen, Clock, User, ClipboardList, PackageCheck, Truck, Sparkles, CheckCircle
} from 'lucide-react';
import { Product, BlogPost } from '../types';
import { INITIAL_BLOGS, FAQS } from '../data/initialProducts';

interface OtherViewsProps {
  viewType: 'about' | 'contact' | 'faq' | 'blog' | 'wishlist' | 'track-order';
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  orders: { id: string; orderStatus: string; customerName: string; totalAmount: number; createdAt: string; items: any[] }[];
}

export default function OtherViews({
  viewType,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  orders
}: OtherViewsProps) {
  
  // Contact state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // FAQ state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Track Order state
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [trackError, setTrackError] = useState('');

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (contactName.trim() && contactEmail.trim()) {
      setContactSent(true);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setTimeout(() => setContactSent(false), 5000);
    }
  };

  const handleTrackOrder = (e: FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackedOrder(null);

    const id = trackOrderId.trim().toUpperCase();
    if (!id) return;

    // Search inside the global orders array
    const found = orders.find(o => o.id === id || o.id === '#' + id);
    if (!found) {
      setTrackError('Order ID not found. Verify your ID matches the format (e.g. #HS-1234 or p-xxxx).');
      return;
    }

    setTrackedOrder(found);
  };

  return (
    <div className="bg-[#050505] text-white min-h-[80vh] py-16" id={`other-view-${viewType}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* -------------------------------------------------------------
            VIEW: ABOUT US
            ------------------------------------------------------------- */}
        {viewType === 'about' && (
          <div className="space-y-16 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase font-light">Our Heritage</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-[0.15em] text-white">
                HS Fragrances
              </h1>
              <div className="h-[1px] w-12 bg-[#D4AF37]/30 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800" 
                  alt="Fragrance Atelier" 
                  className="h-full w-full object-cover grayscale opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              </div>

              <div className="space-y-6 text-white/70 text-sm sm:text-base font-serif leading-relaxed italic font-light">
                <p>
                  Founded in 2024 by visionary perfumer <strong className="text-[#D4AF37] font-semibold">Hissan Sethi</strong>, HS Fragrances represents the absolute pinnacle of artisanal liquid masterworks within Pakistan. 
                </p>
                <p>
                  We do not manufacture common sprays. Our boutique operates purely in highly concentrated extracts (Extraits de Parfum), composed of globally curated French ingredients, pure absolute oils, and organic fixing resins.
                </p>
                <p>
                  Every collection batch is strictly limited to 100 hand-numbered flacons, hand-filled, sealed with luxury gold waxes, and boxed inside velvet cushions. We celebrate the luxury scent trail as a statement of high-society poetry.
                </p>
              </div>
            </div>

            {/* Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-white/10 text-center text-xs">
              <div className="space-y-2">
                <h4 className="font-serif font-light text-[#D4AF37] uppercase tracking-[0.2em]">Unparalleled Sillage</h4>
                <p className="text-white/40 leading-relaxed font-light">Configured to projection profiles reaching up to 12 hours on skin and 24+ hours on fabrics.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-light text-[#D4AF37] uppercase tracking-[0.2em]">Hand-Crafted Batches</h4>
                <p className="text-white/40 leading-relaxed font-light">No generic mass production. Every bottle is carefully handled by perfume artisans in our Lahore atelier.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-light text-[#D4AF37] uppercase tracking-[0.2em]">Global Sourcing</h4>
                <p className="text-white/40 leading-relaxed font-light">From Bulgarian roses to Cambodian agarwood, our ingredient profiles are pristine and completely certified.</p>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW: CONTACT US
            ------------------------------------------------------------- */}
        {viewType === 'contact' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase font-light">Get in touch</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-[0.15em] text-white">
                Contact The Atelier
              </h1>
              <div className="h-[1px] w-12 bg-[#D4AF37]/30 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Info Column */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="font-serif text-lg font-light text-[#D4AF37] uppercase tracking-wider">Contact Credentials</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    We welcome inquiries regarding custom blends, bulk corporate allocations, wedding favors, and direct booking appointments at our Lahore atelier.
                  </p>
                </div>

                <div className="space-y-6 text-xs font-mono tracking-wider">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/[0.02] border border-white/10 text-[#D4AF37]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white/30 uppercase text-[9px] tracking-widest">Atelier Phone</p>
                      <a href="tel:03133492982" className="text-white hover:text-[#D4AF37] font-semibold transition-colors">0313 3492982</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/[0.02] border border-white/10 text-[#D4AF37]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white/30 uppercase text-[9px] tracking-widest">Official Email</p>
                      <a href="mailto:hissansethi0@gmail.com" className="text-white hover:text-[#D4AF37] font-semibold transition-colors">hissansethi0@gmail.com</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/[0.02] border border-white/10 text-[#D4AF37]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white/30 uppercase text-[9px] tracking-widest">Atelier Headquarters</p>
                      <p className="text-white/80 font-semibold">Gulberg Atelier, Lahore, Pakistan</p>
                    </div>
                  </div>
                </div>

                {/* Social media connections */}
                <div className="p-5 bg-white/[0.01] border border-white/10 space-y-3">
                  <h4 className="font-serif text-xs text-[#D4AF37] uppercase tracking-wider font-light">Follow On Socials</h4>
                  <ul className="text-[11px] space-y-2 text-white/50 font-mono tracking-wider">
                    <li>TikTok: <span className="text-white font-semibold">hs.programmer12</span></li>
                    <li>YouTube: <span className="text-white font-semibold">ProgrammingWithHs</span></li>
                  </ul>
                </div>
              </div>

              {/* Form Column */}
              <form onSubmit={handleContactSubmit} className="p-6 bg-white/[0.02] border border-white/10 space-y-5 text-xs">
                <h3 className="font-serif text-white font-light text-sm uppercase tracking-wider">Dispatch Private Message</h3>
                
                {contactSent && (
                  <div className="p-3 bg-white/[0.02] border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-wider font-mono">
                    ✨ Your message sillage has been dispatched. Hissan Sethi will reply shortly.
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Zara Khan"
                    className="w-full px-3 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-white focus:outline-none text-xs rounded-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. zara@gmail.com"
                    className="w-full px-3 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-white focus:outline-none text-xs rounded-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Private Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Express your questions or customization requests..."
                    className="w-full px-3 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-white focus:outline-none text-xs rounded-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold uppercase tracking-widest text-[10px] transition-all duration-300 shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW: FAQ
            ------------------------------------------------------------- */}
        {viewType === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center space-y-3 mb-12">
              <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase font-light">Clarifications</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-[0.15em] text-white">
                Frequently Asked FAQs
              </h1>
              <div className="h-[1px] w-12 bg-[#D4AF37]/30 mx-auto mt-4" />
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div 
                  key={idx}
                  className="border border-white/10 bg-white/[0.01] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-white/[0.02] transition-colors focus:outline-none"
                  >
                    <span className="font-serif text-sm sm:text-base font-light text-white tracking-wide">{faq.question}</span>
                    {openFaqIdx === idx ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4 text-[#D4AF37]" />}
                  </button>
                  {openFaqIdx === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-white/50 leading-relaxed border-t border-white/10 font-light">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW: BLOG (OLFACTORY JOURNAL)
            ------------------------------------------------------------- */}
        {viewType === 'blog' && (
          <div className="space-y-12 max-w-5xl mx-auto">
            <div className="text-center space-y-3 mb-10">
              <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase font-bold">The Olfactory Journal</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-[0.15em] text-white">
                Fragrance Wisdom & Tips
              </h1>
              <div className="h-[1px] w-12 bg-[#D4AF37]/30 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {INITIAL_BLOGS.map((blog) => (
                <div 
                  key={blog.id}
                  className="bg-white/[0.02] border border-white/10 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-60 overflow-hidden bg-[#050505] flex items-center justify-center relative">
                      <img src={blog.image} alt={blog.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700 grayscale opacity-90" />
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex gap-4 items-center text-[10px] text-white/40 font-mono tracking-wider uppercase">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {blog.date}</span>
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#D4AF37]" /> By {blog.author}</span>
                      </div>
                      <h3 className="font-serif text-base font-light text-white tracking-wide uppercase line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed font-serif italic font-light">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/10 mt-4">
                    <details className="text-xs text-white/50 font-serif leading-relaxed italic mt-4 group">
                      <summary className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#D4AF37] hover:text-[#b8962f] cursor-pointer list-none flex items-center gap-1">
                        Read Private Essay &darr;
                      </summary>
                      <p className="mt-4 border-l-2 border-[#D4AF37]/40 pl-3 py-1 bg-white/[0.01] font-light">
                        {blog.content}
                      </p>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW: WISHLIST
            ------------------------------------------------------------- */}
        {viewType === 'wishlist' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3 mb-10">
              <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase font-light">Saved Allocations</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-[0.15em] text-white flex items-center justify-center gap-3">
                <Heart className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" /> Your Private Wishlist
              </h1>
              <div className="h-[1px] w-12 bg-[#D4AF37]/30 mx-auto mt-4" />
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/10 space-y-4">
                <Heart className="w-10 h-10 text-white/20 mx-auto" />
                <p className="text-xs text-white/40 italic font-light">No luxury sillage has been added to your wishlist yet.</p>
                <button
                  onClick={() => onSelectProduct(null as any)} // will route to shop
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-semibold uppercase tracking-widest text-[10px] hover:bg-[#b8962f] transition-all duration-300 shadow-md"
                >
                  Browse Scent Boutique
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((p) => {
                  const hasDisc = p.discountPrice !== null;
                  return (
                    <div 
                      key={p.id}
                      className="bg-white/[0.02] border border-white/10 p-4 space-y-4 flex flex-col justify-between group hover:border-[#D4AF37]/30 transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden bg-[#050505] flex items-center justify-center">
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-700 grayscale opacity-90" />
                        <button
                          onClick={() => onToggleWishlist(p)}
                          className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 hover:bg-black text-red-400 transition-colors border border-white/10"
                          title="Purge"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] tracking-[0.15em] text-[#D4AF37] uppercase font-light">{p.category}</span>
                        <h4 className="font-serif text-base font-light text-white truncate uppercase">{p.name}</h4>
                        <div className="flex items-baseline gap-1.5 pt-1">
                          {hasDisc ? (
                            <>
                              <span className="text-[#D4AF37] font-semibold font-mono text-sm">Rs. {p.discountPrice!.toLocaleString()}</span>
                              <span className="text-[10px] text-white/30 line-through">Rs. {p.price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="text-white font-semibold font-mono text-sm">Rs. {p.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onSelectProduct(p)}
                          className="flex-1 py-2 bg-[#050505] hover:bg-white/5 border border-white/10 text-[#D4AF37] font-semibold text-[9px] uppercase tracking-wider transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(p, 1)}
                          className="px-3 py-2 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold uppercase tracking-wider text-[9px] transition-colors shadow-md"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW: TRACK ORDER
            ------------------------------------------------------------- */}
        {/* -------------------------------------------------------------
            VIEW: TRACK ORDER
            ------------------------------------------------------------- */}
        {viewType === 'track-order' && (
          <div className="max-w-xl mx-auto space-y-10 animate-fadeIn">
            <div className="text-center space-y-3 mb-10">
              <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase font-light">Real-time Sillage GPS</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-[0.15em] text-white flex items-center justify-center gap-2">
                Track Shipment Status
              </h1>
              <div className="h-[1px] w-12 bg-[#D4AF37]/30 mx-auto mt-4" />
            </div>

            <form onSubmit={handleTrackOrder} className="p-6 bg-white/[0.02] border border-white/10 space-y-5">
              <h3 className="font-serif text-white font-light text-sm uppercase text-center tracking-wider">Enter Order Identifier</h3>
              <p className="text-[11px] text-white/50 text-center leading-relaxed font-light">
                Enter your private Order ID supplied in your email or dashboard (e.g. #HS-1049) to track active sillage processing.
              </p>

              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  required
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  placeholder="e.g. #HS-1049"
                  className="flex-1 px-4 py-3 bg-[#050505] border border-white/10 text-xs text-white uppercase font-mono tracking-widest focus:border-[#D4AF37] focus:outline-none rounded-none"
                  id="input-track-id"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold text-xs uppercase tracking-widest transition-all duration-300"
                  id="btn-track-submit"
                >
                  Locate
                </button>
              </div>

              {trackError && (
                <p className="text-[11px] text-red-400 font-mono text-center tracking-wide">{trackError}</p>
              )}
            </form>

            {/* Tracking Results Visuals */}
            {trackedOrder && (
              <div className="p-6 bg-white/[0.02] border border-white/10 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[9px] text-white/40 uppercase font-mono tracking-widest">Private Shipment</span>
                    <h4 className="font-mono text-[#D4AF37] font-semibold text-sm tracking-wide">{trackedOrder.id}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-white/40 uppercase font-mono tracking-widest">Placed on</span>
                    <p className="text-xs text-white font-semibold">{new Date(trackedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Scent items summary */}
                <div className="space-y-3 text-xs">
                  <p className="text-white/60 font-semibold tracking-wide">Consignment summary:</p>
                  <div className="space-y-2">
                    {trackedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-white/70 font-serif italic font-light">
                        <span>{item.name} <strong className="font-mono text-white/30 font-light">x{item.quantity}</strong></span>
                        <span className="font-mono text-white/50">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-semibold pt-3 border-t border-white/10 text-[#D4AF37] font-mono tracking-wide">
                    <span>Total Amount:</span>
                    <span>Rs. {trackedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Visual state map */}
                <div className="space-y-5 pt-4 border-t border-white/10">
                  <p className="text-white/30 uppercase font-mono text-[9px] tracking-[0.15em]">Active Dispatch State</p>
                  
                  <div className="relative flex justify-between items-center text-xs font-mono">
                    {/* Progress line */}
                    <div className="absolute top-4 left-0 w-full h-[1px] bg-white/10 -z-1" />
                    <div 
                      className="absolute top-4 left-0 h-[1px] bg-[#D4AF37] -z-1 transition-all duration-500" 
                      style={{
                        width: trackedOrder.orderStatus === 'Delivered' ? '100%' :
                               trackedOrder.orderStatus === 'Shipped' ? '66%' :
                               trackedOrder.orderStatus === 'Confirmed' ? '33%' : '0%'
                      }}
                    />

                    {/* Pending Node */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`h-8 w-8 rounded-none flex items-center justify-center border font-semibold ${
                        ['Pending', 'Confirmed', 'Shipped', 'Delivered'].includes(trackedOrder.orderStatus)
                          ? 'border-[#D4AF37] bg-[#050505] text-[#D4AF37]'
                          : 'border-white/10 bg-[#050505] text-white/30'
                      }`}>
                        <ClipboardList className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 font-light">Received</span>
                    </div>

                    {/* Confirmed Node */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`h-8 w-8 rounded-none flex items-center justify-center border font-semibold ${
                        ['Confirmed', 'Shipped', 'Delivered'].includes(trackedOrder.orderStatus)
                          ? 'border-[#D4AF37] bg-[#050505] text-[#D4AF37]'
                          : 'border-white/10 bg-[#050505] text-white/30'
                      }`}>
                        <PackageCheck className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 font-light">Verified</span>
                    </div>

                    {/* Shipped Node */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`h-8 w-8 rounded-none flex items-center justify-center border font-semibold ${
                        ['Shipped', 'Delivered'].includes(trackedOrder.orderStatus)
                          ? 'border-[#D4AF37] bg-[#050505] text-[#D4AF37]'
                          : 'border-white/10 bg-[#050505] text-white/30'
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 font-light">Shipped</span>
                    </div>

                    {/* Delivered Node */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`h-8 w-8 rounded-none flex items-center justify-center border font-semibold ${
                        trackedOrder.orderStatus === 'Delivered'
                          ? 'border-green-500 bg-[#050505] text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.15)]'
                          : 'border-white/10 bg-[#050505] text-white/30'
                      }`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 font-light">Delivered</span>
                    </div>

                  </div>

                  {/* Estimated time / explanation */}
                  <div className="p-4 bg-white/[0.01] border border-white/10 text-white/60 text-xs font-serif italic font-light">
                    {trackedOrder.orderStatus === 'Pending' && (
                      <p>✨ Scent allocation received. Awaiting payment verification / courier booking confirmation.</p>
                    )}
                    {trackedOrder.orderStatus === 'Confirmed' && (
                      <p>✨ Payment appraisal settled! Your perfume is currently being hand-boxed, gold wax-sealed, and cataloged for shipment dispatch shortly.</p>
                    )}
                    {trackedOrder.orderStatus === 'Shipped' && (
                      <p>🚚 Consignment dispatched via Premium Logistics. Delivery to your Pakistani address estimated within 24 to 48 hours.</p>
                    )}
                    {trackedOrder.orderStatus === 'Delivered' && (
                      <p>🎉 Consignment successfully received. Enjoy your bespoke olfactory sillage journey!</p>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
