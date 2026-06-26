import { useState, useMemo, FormEvent } from 'react';
import { Heart, Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw, Send, Check } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBackToShop: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ProductDetailView({
  product,
  allProducts,
  onBackToShop,
  onSelectProduct,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  onAddReview
}: ProductDetailViewProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewAddedMsg, setReviewAddedMsg] = useState(false);

  const isWishlisted = wishlist.some(p => p.id === product.id);
  const hasDiscount = product.discountPrice !== null;
  const activePrice = hasDiscount ? product.discountPrice! : product.price;

  // Calculate related products (same category or other bestSellers, excluding current)
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(p => p.id !== product.id)
      .filter(p => p.category === product.category || p.bestSeller)
      .slice(0, 3);
  }, [allProducts, product]);

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (reviewerName.trim() && reviewerComment.trim()) {
      onAddReview(product.id, {
        user: reviewerName,
        rating: reviewerRating,
        comment: reviewerComment
      });
      setReviewerName('');
      setReviewerComment('');
      setReviewerRating(5);
      setReviewAddedMsg(true);
      setTimeout(() => setReviewAddedMsg(false), 5000);
    }
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen py-12" id="product-detail-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={onBackToShop}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#D4AF37] transition-colors duration-300 mb-10 focus:outline-none"
          id="btn-detail-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Boutique</span>
        </button>

        {/* Product specs panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT: Image gallery */}
          <div className="space-y-4">
            <div className="relative h-[480px] overflow-hidden bg-black border border-white/10 flex items-center justify-center">
              <img
                src={product.images[activeImageIdx] || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800'}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-700"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[9px] font-semibold tracking-widest px-3 py-1.5 shadow-lg uppercase">
                  SPECIAL ALLOCATION
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 w-16 overflow-hidden border transition-all duration-300 focus:outline-none ${
                      activeImageIdx === idx ? 'border-[#D4AF37]' : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                    id={`btn-detail-thumb-${idx}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Specs and Actions */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] tracking-[0.25em] text-[#D4AF37] uppercase font-light">{product.category} &bull; EXTRAIT DE PARFUM</span>
                <div className="flex items-center text-[#D4AF37] text-xs gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-white/30 text-[10px] font-sans">({product.reviews.length} reviews)</span>
                </div>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide uppercase">
                {product.name}
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans">
                Artisanal Blend &bull; {product.brand} Signature Scent
              </p>
            </div>

            {/* Price Box */}
            <div className="p-6 bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Retail Allocation Price</p>
                <div className="flex items-baseline gap-2.5 mt-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-semibold text-[#D4AF37] font-mono">Rs. {product.discountPrice!.toLocaleString()}</span>
                      <span className="text-xs text-white/30 line-through">Rs. {product.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-semibold text-white font-mono">Rs. {product.price.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] text-right">Status</p>
                <p className={`text-[10px] uppercase tracking-widest font-semibold mt-2.5 text-right ${
                  product.stockQuantity > 0 ? 'text-[#D4AF37]' : 'text-red-400'
                }`}>
                  {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} Left)` : 'Sold Out'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-semibold">The Olfactory Narrative</h3>
              <p className="text-xs text-white/70 leading-relaxed font-serif italic font-light">
                {product.description}
              </p>
            </div>

            {/* Fragrance Notes Breakdown */}
            <div className="space-y-4">
              <h3 className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-semibold">Olfactory Architecture</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/10 text-center">
                  <p className="text-[8px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Top Accord</p>
                  <p className="text-xs text-white/80 mt-2 font-serif italic font-light">{product.fragranceNotes.top}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/10 text-center">
                  <p className="text-[8px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Heart Accord</p>
                  <p className="text-xs text-white/80 mt-2 font-serif italic font-light">{product.fragranceNotes.heart}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/10 text-center">
                  <p className="text-[8px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Base Accord</p>
                  <p className="text-xs text-white/80 mt-2 font-serif italic font-light">{product.fragranceNotes.base}</p>
                </div>
              </div>
            </div>

            {/* Checkout / Bag Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
              
              {/* Quantity selectors */}
              {product.stockQuantity > 0 && (
                <div className="flex items-center justify-between border border-white/10 p-1 bg-black shrink-0 sm:w-32">
                  <button
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="px-3 py-2 text-white/40 hover:text-white transition-colors"
                    id="btn-detail-qty-minus"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs">{orderQuantity}</span>
                  <button
                    onClick={() => setOrderQuantity(Math.min(product.stockQuantity, orderQuantity + 1))}
                    className="px-3 py-2 text-white/40 hover:text-white transition-colors"
                    id="btn-detail-qty-plus"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Add to Cart button */}
              <button
                onClick={() => {
                  onAddToCart(product, orderQuantity);
                  setOrderQuantity(1);
                }}
                disabled={product.stockQuantity === 0}
                className={`flex-1 py-4 px-6 font-semibold tracking-widest text-[10px] uppercase transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none ${
                  product.stockQuantity === 0
                    ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                    : 'bg-[#D4AF37] hover:bg-[#b8962f] text-black shadow-2xl'
                }`}
                id="btn-detail-add-to-bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Shopping Bag'}</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-4 border transition-all duration-300 focus:outline-none ${
                  isWishlisted
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white hover:bg-white/5'
                }`}
                id="btn-detail-wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
              </button>
            </div>

            {/* Quality Seals Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-[10px] text-white/40 border-t border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>100% Original Scent Oil</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Swift Premium Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
                <span>No-Questions Return</span>
              </div>
            </div>

          </div>

        </div>

        {/* Client Reviews Section */}
        <section className="mt-24 pt-16 border-t border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Review write block */}
          <div className="space-y-6 lg:col-span-1">
            <h3 className="font-serif text-xl font-light tracking-widest uppercase text-[#D4AF37]">Client Feedback</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              Have you experienced this fragrance allocation? Leave a premium appraisal to help other connoisseurs.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 p-6 bg-white/[0.02] border border-white/10">
              {reviewAddedMsg && (
                <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-wider flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>Review logged successfully.</span>
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-semibold">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Ali Ahmed"
                  className="w-full px-4 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-[10px] text-white focus:outline-none placeholder-white/20 uppercase tracking-wider"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-semibold">Appraisal Rating</label>
                <select
                  value={reviewerRating}
                  onChange={(e) => setReviewerRating(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-[10px] text-[#D4AF37] focus:outline-none uppercase tracking-wider"
                >
                  <option value="5">★★★★★ (5 Stars)</option>
                  <option value="4">★★★★☆ (4 Stars)</option>
                  <option value="3">★★★☆☆ (3 Stars)</option>
                  <option value="2">★★☆☆☆ (2 Stars)</option>
                  <option value="1">★☆☆☆☆ (1 Star)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-semibold">Your Comment</label>
                <textarea
                  required
                  rows={3}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="Share your experience regarding performance, projection, and sillage..."
                  className="w-full px-4 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-[10px] text-white focus:outline-none placeholder-white/20 tracking-wider"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold tracking-widest text-[9px] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 focus:outline-none"
                id="btn-submit-review"
              >
                <Send className="w-3 h-3" />
                <span>Submit Appraisal</span>
              </button>
            </form>
          </div>

          {/* Review listings */}
          <div className="space-y-6 lg:col-span-2">
            <h3 className="font-serif text-xl font-light tracking-widest uppercase text-white">Client Assessments ({product.reviews.length})</h3>
            
            {product.reviews.length === 0 ? (
              <p className="text-xs text-white/30 italic font-light">No appraisals recorded yet. Be the first to review this elegant blend.</p>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-6 bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-white tracking-widest uppercase">{rev.user}</span>
                      <span className="text-white/30 font-mono">{rev.date}</span>
                    </div>
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-900'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed font-serif font-light">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-white/10">
            <div className="text-center space-y-3 mb-12">
              <h3 className="font-serif text-2xl font-light tracking-widest uppercase text-[#D4AF37]">Related Perfumes</h3>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">You might also appreciate these exquisite blends</p>
              <div className="h-[1px] w-12 bg-[#D4AF37]/30 mx-auto mt-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => {
                const hasDisc = p.discountPrice !== null;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/30 overflow-hidden flex flex-col group cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden bg-[#050505] flex items-center justify-center">
                      <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase font-light">{p.category}</span>
                        <h4 className="font-serif text-base font-light text-white group-hover:text-[#D4AF37] transition-colors truncate uppercase">
                          {p.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                          {hasDisc ? (
                            <>
                              <span className="text-[#D4AF37] font-semibold font-mono text-sm">Rs. {p.discountPrice!.toLocaleString()}</span>
                              <span className="text-[10px] text-white/30 line-through">Rs. {p.price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="text-white font-semibold font-mono text-sm">Rs. {p.price.toLocaleString()}</span>
                          )}
                        </div>
                        <span className="text-[9px] uppercase font-semibold tracking-widest text-[#D4AF37] group-hover:text-white transition-colors">
                          Details &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
