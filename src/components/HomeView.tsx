import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Star, Heart, Flame, Shield, Award, Sparkle } from 'lucide-react';
import { Product, Review } from '../types';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  setCurrentView: (view: string) => void;
}

export default function HomeView({
  products,
  onSelectProduct,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  setCurrentView
}: HomeViewProps) {
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const featured = products.filter(p => p.featured);
  const bestSellers = products.filter(p => p.bestSeller);

  // Take first 3 products for showcase carousel
  const carouselProducts = products.slice(0, 3);
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setNewsletterSubscribed(true);
      setEmailInput('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const isProductInWishlist = (product: Product) => {
    return wishlist.some(p => p.id === product.id);
  };

  const reviewsList: Review[] = [
    { id: 'r10', user: 'Hassan Shah', rating: 5, comment: "I've worn niche fragrances for a decade, but the projection and sheer sophistication of Oud Royale is unmatched. A true masterpiece.", date: '2026-06-12' },
    { id: 'r11', user: 'Maria Nadeem', rating: 5, comment: "Imperial Jasmine is like walking through a luxury royal garden at twilight. It lasts on my cashmere coats for days!", date: '2026-06-18' },
    { id: 'r12', user: 'Dr. Faisal', rating: 5, comment: "Golden Amber is warm, premium, and commands attention. HS Fragrances is putting Pakistan on the luxury perfumery map.", date: '2026-06-24' }
  ];

  return (
    <div className="bg-[#050505] text-white overflow-hidden" id="home-view-container">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center bg-[#050505] overflow-hidden py-20" id="hero-section">
        {/* Ambient backlighting */}
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-full blur-[130px] opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/20 text-[#D4AF37] text-[9px] tracking-[0.3em] uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>THE QUINTESSENCE OF HAUTE PARFUMERIE</span>
            </div>
            
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
              Noir <span className="italic text-[#D4AF37] font-serif">Mystique</span> <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.1em] font-sans font-light uppercase text-white/90">
                For the Elite Soul
              </span>
            </h1>
            
            <p className="text-white/40 text-xs sm:text-sm max-w-lg leading-relaxed font-light">
              HS Fragrances creates ultra-niche, highly concentrated extraits de parfum. Each bottle is a hand-crafted masterwork of exquisite French ingredients, designed to project allure, prestige, and endless depth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-10 py-4 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold tracking-widest text-[10px] uppercase transition-all duration-300 flex items-center justify-center gap-2 group focus:outline-none"
                id="hero-shop-now-btn"
              >
                <span>Explore Boutique</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => {
                  const element = document.getElementById('featured-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-4 border border-white/15 hover:border-[#D4AF37] text-white hover:text-black hover:bg-[#D4AF37] font-semibold tracking-widest text-[10px] uppercase bg-transparent transition-all duration-300 flex items-center justify-center focus:outline-none"
                id="hero-discover-btn"
              >
                Discover Collection
              </button>
            </div>

            {/* Microstats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 font-sans text-center sm:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-light font-serif text-[#D4AF37]">12h+</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1">Guaranteed Sillage</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-light font-serif text-[#D4AF37]">100%</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1">Pure French Oils</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-light font-serif text-[#D4AF37]">Niche</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1">Limited Batches</p>
              </div>
            </div>
          </motion.div>

          {/* Perfume Showcase Mock */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            {/* Elegant glowing halo behind product */}
            <div className="absolute inset-0 m-auto w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-[100px]" />
            
            <div className="relative z-10 w-full max-w-sm bg-white/5 border border-white/10 p-8 backdrop-blur-2xl shadow-2xl">
              {/* Product Card Header */}
              <div className="flex justify-between items-center mb-5">
                <span className="text-[9px] font-sans tracking-widest text-[#D4AF37] uppercase font-semibold">Best Seller</span>
                <div className="flex items-center gap-1 text-[#D4AF37] text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold">4.9</span>
                </div>
              </div>

              {/* Showcase Image */}
              <div className="relative h-64 overflow-hidden bg-[#050505] border border-white/10 mb-6 flex items-center justify-center group">
                <img 
                  src={carouselProducts[activeShowcaseIdx]?.images[0]} 
                  alt={carouselProducts[activeShowcaseIdx]?.name} 
                  className="h-full w-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
              </div>

              {/* Showcase controls */}
              <div className="flex justify-center gap-2.5 mb-5">
                {carouselProducts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveShowcaseIdx(idx)}
                    className={`h-1.5 transition-all duration-300 ${activeShowcaseIdx === idx ? 'w-8 bg-[#D4AF37]' : 'w-1.5 bg-white/20'}`}
                    id={`hero-carousel-dot-${idx}`}
                  />
                ))}
              </div>

              {/* Product info details */}
              <div className="text-center space-y-2">
                <h3 className="font-serif text-2xl font-light tracking-wide text-white">
                  {carouselProducts[activeShowcaseIdx]?.name}
                </h3>
                <p className="text-[10px] text-[#D4AF37] font-sans tracking-[0.2em] uppercase">
                  Notes: {carouselProducts[activeShowcaseIdx]?.fragranceNotes.top.split(',')[0]} &bull; {carouselProducts[activeShowcaseIdx]?.fragranceNotes.heart.split(',')[0]}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="text-white/40 line-through text-xs font-light">Rs. {carouselProducts[activeShowcaseIdx]?.price.toLocaleString()}</span>
                  <span className="text-[#D4AF37] font-semibold text-lg font-mono">
                    Rs. {carouselProducts[activeShowcaseIdx]?.discountPrice ? carouselProducts[activeShowcaseIdx].discountPrice!.toLocaleString() : carouselProducts[activeShowcaseIdx]?.price.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => onSelectProduct(carouselProducts[activeShowcaseIdx])}
                  className="w-full mt-5 py-3 bg-[#050505] border border-white/10 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition-all duration-300 text-[10px] tracking-widest uppercase font-bold"
                  id={`hero-view-details-${carouselProducts[activeShowcaseIdx]?.id}`}
                >
                  View Craft Scent
                </button>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* 2. TRUST PILLARS */}
      <section className="bg-[#0a0a0a] py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center p-4 space-y-3">
            <Award className="w-8 h-8 text-[#D4AF37] font-light" />
            <h4 className="font-serif text-white tracking-[0.2em] text-sm uppercase">Unmatched Sillage</h4>
            <p className="text-xs text-white/40 max-w-xs leading-relaxed font-light">Highly concentrated pure perfume oils designed to cast an enchanting aura that lingers beautifully all day.</p>
          </div>
          <div className="flex flex-col items-center p-4 space-y-3">
            <Shield className="w-8 h-8 text-[#D4AF37] font-light" />
            <h4 className="font-serif text-white tracking-[0.2em] text-sm uppercase">Original Ingredients</h4>
            <p className="text-xs text-white/40 max-w-xs leading-relaxed font-light">Sourced globally from legendary French flower valleys and specialized spice growers to retain absolute quality.</p>
          </div>
          <div className="flex flex-col items-center p-4 space-y-3">
            <Flame className="w-8 h-8 text-[#D4AF37] font-light" />
            <h4 className="font-serif text-white tracking-[0.2em] text-sm uppercase">Luxury Packaging</h4>
            <p className="text-xs text-white/40 max-w-xs leading-relaxed font-light">Each perfume is delivered inside a lavish, heavy glass flacon within an embossed dark velvet coffer.</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (ANIMATED SHOWCASE) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" id="featured-section">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-sans">
            <Sparkle className="w-3.5 h-3.5" />
            <span>OUR MASTERPIECES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-white uppercase">
            The Featured Collection
          </h2>
          <div className="h-[1px] w-20 bg-[#D4AF37]/30 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((p) => {
            const hasDiscount = p.discountPrice !== null;
            return (
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                key={p.id}
                className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 overflow-hidden flex flex-col group"
              >
                {/* Image gallery area */}
                <div className="relative h-72 overflow-hidden bg-[#050505] flex items-center justify-center">
                  <img 
                    src={p.images[0]} 
                    alt={p.name} 
                    className="h-full w-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  {hasDiscount && (
                    <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 text-[9px] font-semibold bg-[#D4AF37] text-black uppercase tracking-widest shadow-lg">
                      OFFER
                    </span>
                  )}
                  {/* Wishlist toggle overlay */}
                  <button
                    onClick={() => onToggleWishlist(p)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 text-white/60 hover:text-[#D4AF37] transition-all focus:outline-none backdrop-blur-md border border-white/10"
                    id={`btn-wishlist-${p.id}`}
                  >
                    <Heart className={`w-4 h-4 ${isProductInWishlist(p) ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                  </button>
                </div>

                {/* Content info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase font-light font-sans">{p.category}</span>
                    <h3 className="font-serif text-xl font-light text-white group-hover:text-[#D4AF37] transition-colors duration-300 uppercase">
                      {p.name}
                    </h3>
                    <p className="text-xs text-white/40 line-clamp-2 leading-relaxed font-light">
                      {p.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Fragrance micro notes */}
                    <div className="bg-[#050505] border border-white/5 p-3 text-[11px] space-y-1">
                      <p className="text-white/40"><strong className="text-[#D4AF37] font-normal tracking-wider">TOP:</strong> {p.fragranceNotes.top.split(',').slice(0, 2).join(', ')}</p>
                      <p className="text-white/40"><strong className="text-[#D4AF37] font-normal tracking-wider">HEART:</strong> {p.fragranceNotes.heart.split(',').slice(0, 1).join(', ')}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col justify-end">
                        {hasDiscount ? (
                          <>
                            <span className="text-[10px] text-white/30 line-through">Rs. {p.price.toLocaleString()}</span>
                            <span className="text-[#D4AF37] font-semibold text-lg font-mono">Rs. {p.discountPrice!.toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-white font-semibold text-lg font-mono">Rs. {p.price.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="px-5 py-2.5 bg-transparent border border-white/10 hover:border-[#D4AF37] text-white/70 hover:text-[#D4AF37] font-semibold tracking-widest text-[9px] uppercase transition-all duration-300"
                        id={`btn-view-${p.id}`}
                      >
                        DISCOVER SCENT
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. BEST SELLING PERFUMES (BENTO-LIKE GRID) */}
      <section className="bg-[#0a0a0a] py-24 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-sans">
              <Star className="w-3.5 h-3.5" />
              <span>LEGENDARY SCENT TRAIL</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-white uppercase">
              The Best Sellers
            </h2>
            <div className="h-[1px] w-20 bg-[#D4AF37]/30 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bestSellers.slice(0, 2).map((p) => {
              const hasDiscount = p.discountPrice !== null;
              return (
                <div 
                  key={p.id}
                  className="bg-[#050505] border border-white/10 overflow-hidden shadow-2xl flex flex-col sm:flex-row group"
                >
                  <div className="relative h-60 sm:h-auto sm:w-1/2 overflow-hidden bg-[#050505] flex items-center justify-center shrink-0">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="h-full w-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-black/80 text-[#D4AF37] text-[9px] tracking-widest uppercase font-semibold px-2.5 py-1 border border-[#D4AF37]/30">
                      Best Seller
                    </span>
                  </div>
                  
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase font-light">{p.category}</span>
                        <div className="flex items-center text-[#D4AF37] text-xs">
                          <Star className="w-3 h-3 fill-current mr-0.5" />
                          <span className="font-semibold">{p.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-serif text-xl font-light text-white group-hover:text-[#D4AF37] transition-colors duration-300 uppercase">
                        {p.name}
                      </h3>
                      <p className="text-xs text-white/40 leading-relaxed line-clamp-3 font-light">
                        {p.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="flex items-baseline gap-2">
                        {hasDiscount ? (
                          <>
                            <span className="text-[#D4AF37] font-semibold text-lg font-mono">Rs. {p.discountPrice!.toLocaleString()}</span>
                            <span className="text-xs text-white/30 line-through">Rs. {p.price.toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-white font-semibold text-lg font-mono">Rs. {p.price.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="w-full py-3 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold tracking-widest text-[10px] uppercase transition-all duration-300"
                        id={`btn-bestseller-${p.id}`}
                      >
                        Secure Bottle
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-sans">
            <Heart className="w-3.5 h-3.5" />
            <span>ECHOES OF AFFECTION</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-white uppercase">
            Client Testimonials
          </h2>
          <div className="h-[1px] w-20 bg-[#D4AF37]/30 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsList.map((review) => (
            <div 
              key={review.id} 
              className="bg-white/[0.02] border border-white/10 p-8 space-y-4 backdrop-blur-sm relative"
            >
              {/* Elegant floating double quote */}
              <span className="absolute top-4 right-6 font-serif text-6xl text-[#D4AF37]/5 pointer-events-none select-none">&ldquo;</span>
              
              <div className="flex gap-1 text-[#D4AF37]">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-serif italic font-light">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-white tracking-widest uppercase">{review.user}</span>
                <span className="text-white/30 font-mono">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NEWSLETTER SIGNUP */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[#D4AF37] mb-2">
            <Sparkle className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-widest text-white uppercase">
            Join The Royal Council
          </h3>
          <p className="text-xs text-white/40 leading-relaxed font-light">
            Subscribe to receive private invitations to new limited-batch extrait launches, priority restocking alerts, and luxury perfume masterclasses.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-serif text-sm">
              ✨ Welcome to the Council. Check your inbox shortly for your private allocation.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 mt-4">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="SUBSCRIBE TO LUXURY"
                className="flex-1 px-4 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-[10px] text-white focus:outline-none placeholder-white/25 tracking-widest uppercase"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold tracking-widest text-[10px] uppercase transition-all duration-300 focus:outline-none"
                id="btn-newsletter-subscribe"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
