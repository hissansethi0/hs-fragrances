import { Youtube, Mail, Phone, MapPin, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export default function Footer({ setCurrentView }: FooterProps) {
  const handleNavClick = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] text-white/50 border-t border-white/10 pt-16 pb-8" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#050505] flex items-center justify-center border border-[#D4AF37]/30">
              <span className="font-serif font-bold text-xs text-[#D4AF37]">HS</span>
            </div>
            <span className="font-serif font-medium tracking-[0.15em] text-[#D4AF37] text-lg">HS FRAGRANCES</span>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed font-light">
            Crafting the finest luxurious and long-lasting artisanal fragrances since 2024. Elevating olfactory memories into pure liquid art.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a 
              href="https://www.youtube.com/@ProgrammingWithHs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] text-white/40 hover:text-[#D4AF37] transition-all duration-300"
              title="YouTube channel"
              id="footer-social-youtube"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://tiktok.com/@hs.programmer12" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] text-white/40 hover:text-[#D4AF37] transition-all duration-300 flex items-center justify-center"
              title="TikTok"
              id="footer-social-tiktok"
            >
              <span className="text-[9px] font-mono tracking-widest uppercase">TikTok</span>
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="font-serif text-[#D4AF37] tracking-[0.2em] uppercase text-[10px] font-bold mb-5 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Collection
          </h3>
          <ul className="space-y-3 text-[11px] uppercase tracking-wider font-light">
            <li>
              <button onClick={() => handleNavClick('shop')} className="hover:text-white transition-colors duration-300">
                All Fragrances
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('shop')} className="hover:text-white transition-colors duration-300">
                Oud Collection
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('shop')} className="hover:text-white transition-colors duration-300">
                Floral Extrait
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('shop')} className="hover:text-white transition-colors duration-300">
                Amber & Sandalwood
              </button>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-serif text-[#D4AF37] tracking-[0.2em] uppercase text-[10px] font-bold mb-5">
            Discover
          </h3>
          <ul className="space-y-3 text-[11px] uppercase tracking-wider font-light">
            <li>
              <button onClick={() => handleNavClick('about')} className="hover:text-white transition-colors duration-300">
                Our Story
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('blog')} className="hover:text-white transition-colors duration-300">
                Olfactory Journal (Blog)
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('track-order')} className="hover:text-white transition-colors duration-300">
                Track Your Shipment
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('faq')} className="hover:text-white transition-colors duration-300">
                Frequently Asked FAQs
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="font-serif text-[#D4AF37] tracking-[0.2em] uppercase text-[10px] font-bold mb-5">
            Haute Atelier
          </h3>
          <ul className="space-y-3 text-[11px] font-light">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]/80 shrink-0" />
              <a href="tel:03133492982" className="hover:text-white transition-colors">0313 3492982</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]/80 shrink-0" />
              <a href="mailto:hissansethi0@gmail.com" className="hover:text-white transition-colors break-all">hissansethi0@gmail.com</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]/80 shrink-0 mt-0.5" />
              <span className="leading-relaxed text-white/40">
                Gulberg Atelier, Lahore, Pakistan
              </span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/30 gap-4">
        <div>
          &copy; {new Date().getFullYear()} HS Fragrances (Private) Ltd. All Rights Reserved.
        </div>
        <div className="flex items-center gap-1.5 font-sans tracking-widest uppercase">
          Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> by ProgrammingWithHs
        </div>
      </div>
    </footer>
  );
}
