import { useState } from 'react';
import { ShoppingBag, Heart, User, Menu, X, ShieldAlert, LogOut, Info, HelpCircle, BookOpen, Send, MapPin } from 'lucide-react';
import { UserProfile, Product, OrderItem } from '../types';

interface HeaderProps {
  currentUser: UserProfile | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  cart: { product: Product; quantity: number }[];
  wishlist: Product[];
  onOpenCart: () => void;
  onLogout: () => void;
}

export default function Header({
  currentUser,
  currentView,
  setCurrentView,
  cart,
  wishlist,
  onOpenCart,
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navItems = [
    { label: 'Home', view: 'home', icon: null },
    { label: 'Shop Luxury', view: 'shop', icon: null },
    { label: 'Track Order', view: 'track-order', icon: MapPin },
    { label: 'About Us', view: 'about', icon: Info },
    { label: 'Contact', view: 'contact', icon: Send },
    { label: 'Blog', view: 'blog', icon: BookOpen },
    { label: 'FAQ', view: 'faq', icon: HelpCircle },
  ];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505]/95 backdrop-blur-md border-b border-white/10 text-white shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo / Branding */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group focus:outline-none"
          id="btn-nav-logo"
        >
          {!logoError ? (
            <img 
              src="/hs-fragrances.webp" 
              alt="HS Fragrances Logo" 
              className="h-11 w-11 object-contain rounded-full border border-white/10 group-hover:border-[#D4AF37] transition-all duration-500"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#050505] flex items-center justify-center border border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-all duration-500 shadow-md">
              <span className="font-serif font-bold text-sm text-[#D4AF37] tracking-wider">HS</span>
            </div>
          )}
          <div className="flex flex-col items-start leading-none text-left">
            <span className="font-serif text-lg sm:text-xl font-medium tracking-[0.15em] text-[#D4AF37] group-hover:text-white transition-colors duration-500">
              HS FRAGRANCES
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-white/40 mt-1 font-sans">
              Haute Parfumerie
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`relative py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:text-white ${
                currentView === item.view ? 'text-[#D4AF37]' : 'text-white/60'
              }`}
              id={`nav-item-${item.view}`}
            >
              {item.label}
              {currentView === item.view && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </nav>

        {/* Toolbar Icons */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Wishlist Button */}
          <button
            onClick={() => handleNavClick('wishlist')}
            className="relative p-2 text-white/60 hover:text-[#D4AF37] transition-colors duration-300 rounded-full hover:bg-white/5 focus:outline-none"
            title="Wishlist"
            id="btn-nav-wishlist"
          >
            <Heart className={`w-4.5 h-4.5 ${currentView === 'wishlist' ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-black bg-[#D4AF37] rounded-full shadow-md">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-white/60 hover:text-[#D4AF37] transition-colors duration-300 rounded-full hover:bg-white/5 focus:outline-none"
            title="Shopping Cart"
            id="btn-nav-cart"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-black bg-[#D4AF37] rounded-full shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] tracking-[0.15em] uppercase transition-all duration-300 focus:outline-none ${
                  currentView === 'dashboard'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white/70'
                }`}
                title="Go to Dashboard"
                id="btn-nav-dashboard"
              >
                {currentUser.role === 'Admin' && <ShieldAlert className="w-3 h-3 text-[#D4AF37] animate-pulse" />}
                <span className="font-medium hidden sm:inline max-w-[80px] truncate">
                  {currentUser.displayName.split(' ')[0]}
                </span>
                <span className="sm:hidden">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                </span>
              </button>
              
              <button
                onClick={onLogout}
                className="p-1.5 text-white/40 hover:text-red-400 transition-colors duration-300 rounded-full hover:bg-white/5 hidden sm:inline-flex"
                title="Sign Out"
                id="btn-nav-signout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold text-[10px] uppercase tracking-widest transition-all duration-300 focus:outline-none"
              id="btn-nav-login"
            >
              <User className="w-3 h-3 text-black" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-white/75 hover:text-[#D4AF37] transition-colors duration-300 focus:outline-none"
            aria-label="Toggle Menu"
            id="btn-nav-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050505] border-b border-white/10 px-6 pt-2 pb-6 flex flex-col space-y-4 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`flex items-center gap-3 py-2 text-[10px] uppercase tracking-[0.2em] font-medium text-left border-b border-white/5 ${
                currentView === item.view ? 'text-[#D4AF37] border-[#D4AF37]/30' : 'text-white/60'
              }`}
              id={`nav-item-mobile-${item.view}`}
            >
              {item.icon && <item.icon className="w-3.5 h-3.5 text-[#D4AF37]/70" />}
              <span>{item.label}</span>
            </button>
          ))}
          {currentUser && (
            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 py-2 text-[10px] uppercase tracking-[0.2em] font-medium text-red-400 text-left"
              id="btn-nav-mobile-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
