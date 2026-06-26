import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid, List, Check, Heart, Eye, ArrowUpDown, Sparkles, Filter } from 'lucide-react';
import { Product } from '../types';

interface ShopViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
}

type CategoryFilter = 'All' | 'Men' | 'Women' | 'Unisex';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export default function ShopView({
  products,
  onSelectProduct,
  onAddToCart,
  wishlist,
  onToggleWishlist
}: ShopViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [selectedSort, setSelectedSort] = useState<SortOption>('default');
  const [priceRange, setPriceRange] = useState<number>(15000); // max price 15000
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  const isProductInWishlist = (product: Product) => {
    return wishlist.some(p => p.id === product.id);
  };

  // Filter & sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search query matching (name, description, notes)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.fragranceNotes.top.toLowerCase().includes(q) ||
        p.fragranceNotes.heart.toLowerCase().includes(q) ||
        p.fragranceNotes.base.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price range filter
    result = result.filter(p => {
      const activePrice = p.discountPrice !== null ? p.discountPrice : p.price;
      return activePrice <= priceRange;
    });

    // Sorting
    if (selectedSort === 'price-asc') {
      result.sort((a, b) => {
        const priceA = a.discountPrice !== null ? a.discountPrice : a.price;
        const priceB = b.discountPrice !== null ? b.discountPrice : b.price;
        return priceA - priceB;
      });
    } else if (selectedSort === 'price-desc') {
      result.sort((a, b) => {
        const priceA = a.discountPrice !== null ? a.discountPrice : a.price;
        const priceB = b.discountPrice !== null ? b.discountPrice : b.price;
        return priceB - priceA;
      });
    } else if (selectedSort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSort, priceRange]);

  return (
    <div className="bg-[#050505] text-white min-h-screen py-12" id="shop-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Haute Collection</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white uppercase">
            The Perfume Boutique
          </h2>
          <p className="text-xs text-white/40 max-w-xl mx-auto leading-relaxed font-light">
            Filter through our prestigious limited-run elixirs. Crafted with precise concentrations to guarantee an extraordinary, commanding sillage.
          </p>
          <div className="h-[1px] w-20 bg-[#D4AF37]/30 mx-auto mt-3" />
        </div>

        {/* Filters and Controls Top-Bar */}
        <div className="bg-white/[0.02] border border-white/10 p-4 sm:p-6 mb-12 backdrop-blur-md grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search oud, jasmine, wood..."
              className="w-full pl-10 pr-4 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-[10px] text-white focus:outline-none placeholder-white/20 uppercase tracking-widest"
              id="shop-search-input"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-center lg:col-span-2">
            {(['All', 'Men', 'Women', 'Unisex'] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 border text-[9px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 focus:outline-none ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-2xl'
                    : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white bg-[#050505]'
                }`}
                id={`shop-cat-filter-${cat}`}
              >
                {cat === 'All' ? 'All Genders' : cat}
              </button>
            ))}
          </div>

          {/* Sort selection drop-down */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#D4AF37]/60 shrink-0" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              className="w-full py-3 px-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-[9px] uppercase tracking-[0.2em] text-white/80 focus:outline-none focus:ring-0 cursor-pointer"
              id="shop-sort-select"
            >
              <option value="default">Default Sort</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Client Rating</option>
            </select>
          </div>

        </div>

        {/* Sidebar + Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="space-y-6 lg:col-span-1 bg-white/[0.02] border border-white/10 p-6 h-fit">
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <Filter className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-xs font-light tracking-widest uppercase">Refine Selection</h3>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] tracking-wider uppercase">
                <span className="text-white/40">Max Price:</span>
                <span className="text-[#D4AF37] font-semibold font-mono">Rs. {priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="15000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer bg-white/10 h-[2px]"
                id="shop-price-slider"
              />
              <div className="flex justify-between text-[9px] text-white/30 font-mono tracking-widest">
                <span>Rs. 5,000</span>
                <span>Rs. 15,000</span>
              </div>
            </div>

            {/* Premium Guarantee Card */}
            <div className="p-4 bg-white/[0.01] border border-[#D4AF37]/15 space-y-2">
              <p className="text-[9px] font-serif text-[#D4AF37] tracking-widest uppercase font-semibold flex items-center gap-1">
                ✨ Artisan Promise
              </p>
              <p className="text-[10px] text-white/50 leading-relaxed font-light">
                All bottles include heavy luxury glass flacons, signature gold wax seal boxes, and registered serial certification.
              </p>
            </div>
          </div>

          {/* Products Grid / List display area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-white/40 border-b border-white/10 pb-3">
              <span>Showing {filteredAndSortedProducts.length} majestic fragrance(s)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1 ${layoutMode === 'grid' ? 'text-[#D4AF37]' : 'text-white/30 hover:text-white'}`}
                  title="Grid Layout"
                  id="btn-layout-grid"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/10 space-y-4">
                <p className="text-white/40 font-serif italic text-xs font-light">No fragrances matched your refined search parameters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setPriceRange(15000);
                  }}
                  className="px-5 py-2.5 border border-[#D4AF37]/40 text-[#D4AF37] text-[9px] uppercase tracking-widest font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                  id="btn-clear-filters"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((p) => {
                  const hasDiscount = p.discountPrice !== null;
                  const isWishlisted = isProductInWishlist(p);
                  
                  return (
                    <div
                      key={p.id}
                      className="bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/30 overflow-hidden flex flex-col group h-full transition-all duration-300"
                    >
                      {/* Image Frame */}
                      <div className="relative h-64 overflow-hidden bg-[#050505] flex items-center justify-center">
                        <img 
                          src={p.images[0]} 
                          alt={p.name} 
                          className="h-full w-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                        />
                        {hasDiscount && (
                          <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5 shadow-md">
                            Offer
                          </span>
                        )}
                        <button
                          onClick={() => onToggleWishlist(p)}
                          className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white/60 hover:text-[#D4AF37] transition-colors backdrop-blur-sm border border-white/10"
                          id={`btn-shop-wishlist-${p.id}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                        </button>
                      </div>

                      {/* Info block */}
                      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase font-light">{p.category}</span>
                          <h3 className="font-serif text-base font-light text-white group-hover:text-[#D4AF37] transition-colors truncate uppercase">
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed h-8 font-light">
                            {p.description}
                          </p>
                        </div>

                        {/* Notes Badge */}
                        <div className="text-[10px] text-white/40 bg-white/[0.01] p-2.5 border border-white/10 font-serif italic font-light">
                          <span className="font-sans text-[8px] font-semibold tracking-wider text-[#D4AF37] uppercase not-italic mr-1.5">NOTES:</span> {p.fragranceNotes.top.split(',').slice(0, 2).join(', ')}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex flex-col">
                            {hasDiscount ? (
                              <>
                                <span className="text-[10px] text-white/30 line-through">Rs. {p.price.toLocaleString()}</span>
                                <span className="text-[#D4AF37] font-semibold font-mono text-sm">Rs. {p.discountPrice!.toLocaleString()}</span>
                              </>
                            ) : (
                              <span className="text-white font-semibold font-mono text-sm">Rs. {p.price.toLocaleString()}</span>
                            )}
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => onSelectProduct(p)}
                              className="p-2.5 bg-[#050505] hover:bg-white/5 border border-white/10 text-[#D4AF37] transition-colors"
                              title="Inspect Scent"
                              id={`btn-shop-inspect-${p.id}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onAddToCart(p, 1)}
                              disabled={p.stockQuantity === 0}
                              className={`px-3 py-1.5 text-[9px] uppercase font-semibold tracking-widest transition-all duration-300 ${
                                p.stockQuantity === 0
                                  ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                                  : 'bg-[#D4AF37] hover:bg-[#b8962f] text-black shadow-lg'
                              }`}
                              id={`btn-shop-add-cart-${p.id}`}
                            >
                              {p.stockQuantity === 0 ? 'Out' : 'Add to Bag'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
