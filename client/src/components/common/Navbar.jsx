import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useShop } from '../../store/ShopContext';

export default function Navbar() {
  const { cart, wishlist, user, setIsCartOpen } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jewellery?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EE] border-b border-[#DED8CC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="inline-block flex-shrink-0">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#202522] uppercase block">
              AURÉLIA
            </span>
            <span className="text-[8px] font-semibold tracking-[0.35em] text-[#C49A5A] uppercase block -mt-1">
              FINE JEWELLERY
            </span>
          </Link>

          {/* Desktop Navigation Links Centered */}
          <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#202522]">
            <Link to="/jewellery?newArrival=true" className="hover:text-[#C49A5A] transition-colors py-2">
              NEW IN
            </Link>
            
            <div
              className="relative group py-2"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link to="/jewellery" className="flex items-center gap-1 hover:text-[#C49A5A] transition-colors">
                JEWELLERY <ChevronDown className="w-3 h-3 text-[#C49A5A]" />
              </Link>

              {isMegaMenuOpen && (
                <div className="absolute top-full -left-20 w-[780px] bg-[#FAF7F2] border border-[#DED8CC] shadow-2xl rounded-sm p-6 grid grid-cols-12 gap-6 z-50 animate-fadeIn select-none">
                  
                  {/* Col 1: Categories */}
                  <div className="col-span-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#DED8CC] pb-2">
                      <h4 className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#C49A5A] uppercase">
                        CATEGORIES
                      </h4>
                    </div>
                    <ul className="space-y-2 text-xs normal-case text-[#202522]">
                      <li>
                        <Link to="/jewellery/rings" className="group flex items-center justify-between hover:text-[#D96B27] transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform font-medium">Rings & Solitaires</span>
                          <span className="text-[9px] font-sans font-semibold text-[#D96B27] bg-[#D96B27]/15 px-1.5 py-0.5 rounded">Popular</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/jewellery/necklaces" className="group flex items-center justify-between hover:text-[#D96B27] transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform font-medium">Gold & Diamond Necklaces</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/jewellery/earrings" className="group flex items-center justify-between hover:text-[#D96B27] transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform font-medium">Diamond Drop Earrings</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/jewellery/bracelets" className="group flex items-center justify-between hover:text-[#D96B27] transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform font-medium">Tennis Bracelets & Bangles</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/jewellery?category=Men's" className="group flex items-center justify-between hover:text-[#D96B27] transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform font-medium">Men's Fine Jewellery</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Col 2: Curated Collections */}
                  <div className="col-span-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#DED8CC] pb-2">
                      <h4 className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#C49A5A] uppercase">
                        COLLECTIONS
                      </h4>
                    </div>
                    <ul className="space-y-2 text-xs normal-case text-[#202522]">
                      <li>
                        <Link to="/jewellery?collection=The Bridal Edit" className="group flex items-center justify-between hover:text-[#D96B27] transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform font-medium">The Bridal Edit</span>
                          <span className="text-[9px] font-sans font-bold text-white bg-[#D96B27] px-1.5 py-0.5 uppercase tracking-wider">New</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/jewellery?collection=Everyday Gold" className="group flex items-center justify-between hover:text-[#D96B27] transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform font-medium">Everyday Modern Gold</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/jewellery?collection=Diamond Essentials" className="group flex items-center justify-between hover:text-[#D96B27] transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform font-medium">Diamond Essentials</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/jewellery?newArrival=true" className="group flex items-center justify-between hover:text-[#D96B27] transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform font-medium">Latest 2026 Arrivals</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/jewellery" className="group flex items-center justify-between text-[#D96B27] font-semibold transition-colors py-1">
                          <span className="group-hover:translate-x-1 transition-transform">Browse All Jewellery</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: Featured Spotlight Card */}
                  <div className="col-span-4 bg-[#F0EAE1] border border-[#DED8CC] p-3 rounded-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="aspect-[16/10] overflow-hidden rounded-sm relative mb-2">
                      <img
                        src="/assets/editorial_bridal.jpg"
                        alt="Featured Bridal Collection"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                      />
                      <span className="absolute top-2 left-2 bg-[#D96B27] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-sm">
                        FEATURED EDIT
                      </span>
                    </div>
                    <div>
                      <h5 className="font-serif text-sm font-semibold text-[#202522]">
                        The Royal Bridal Suite
                      </h5>
                      <p className="text-[10px] text-[#77736B] leading-relaxed mt-0.5">
                        Certified diamonds crafted for unforgettable moments.
                      </p>
                      <Link
                        to="/jewellery?category=Bridal"
                        className="inline-block text-[10px] font-semibold text-[#D96B27] uppercase tracking-wider mt-2 border-b border-[#D96B27] pb-0.5 hover:text-[#B85517]"
                      >
                        EXPLORE BRIDAL
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Hallmarks Strip */}
                  <div className="col-span-12 pt-3 border-t border-[#DED8CC] flex items-center justify-between text-[10px] text-[#77736B] uppercase tracking-wider">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="text-[#C49A5A]">✦</span> 100% BIS Hallmarked
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="text-[#C49A5A]">✦</span> IGI / GIA Certified
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="text-[#C49A5A]">✦</span> Insured Express Delivery
                    </span>
                  </div>

                </div>
              )}
            </div>

            <Link to="/jewellery?collection=The Bridal Edit" className="hover:text-[#C49A5A] transition-colors py-2">
              COLLECTIONS
            </Link>
            <Link to="/jewellery?category=Bridal" className="hover:text-[#C49A5A] transition-colors py-2">
              BRIDAL
            </Link>
            <Link to="/jewellery?category=Gift" className="hover:text-[#C49A5A] transition-colors py-2">
              GIFTS
            </Link>
            <Link to="/about" className="hover:text-[#C49A5A] transition-colors py-2">
              ABOUT
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-[#202522]">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:block p-1 hover:text-[#C49A5A] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.3]" />
            </button>

            <Link
              to="/wishlist"
              className="hidden sm:block relative p-1 hover:text-[#D96B27] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.3]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D96B27] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/account'}
              className="p-1 hover:text-[#D96B27] transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5 stroke-[1.3]" />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 hover:text-[#D96B27] transition-colors flex items-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.3]" />
              {totalCartCount > 0 && (
                <span className="bg-[#D96B27] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 hover:text-[#C49A5A]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      {isSearchOpen && (
        <div className="bg-[#EFE7D8] border-t border-b border-[#DED8CC] p-4 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-[#C49A5A]" />
            <input
              type="text"
              placeholder="Search solitaire rings, gold necklaces, polki sets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[#202522] placeholder:text-[#77736B] text-sm focus:outline-none font-serif"
              autoFocus
            />
            <button type="submit" className="bg-[#102C24] text-[#F8F5EE] text-xs px-5 py-2 uppercase tracking-widest hover:bg-[#C49A5A] transition-colors">
              Search
            </button>
            <button type="button" onClick={() => setIsSearchOpen(false)} className="text-[#202522] p-1">
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#202522]/60 backdrop-blur-sm lg:hidden flex justify-start animate-fadeIn">
          <div className="bg-[#F8F5EE] w-4/5 max-w-xs h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#DED8CC] mb-6">
                <div>
                  <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#202522] uppercase block">
                    AURÉLIA
                  </span>
                  <span className="text-[8px] font-semibold tracking-[0.35em] text-[#C49A5A] uppercase block -mt-1">
                    FINE JEWELLERY
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-[#202522] hover:text-[#C49A5A]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Box inside Mobile Drawer */}
              <form onSubmit={(e) => { handleSearchSubmit(e); setIsMobileMenuOpen(false); }} className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Search jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#DED8CC] text-xs text-[#202522] placeholder:text-[#77736B] focus:outline-none"
                />
                <Search className="w-4 h-4 text-[#C49A5A] absolute left-3 top-2.5" />
              </form>

              {/* Mobile Navigation Links */}
              <nav className="space-y-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#202522]">
                <Link
                  to="/jewellery?newArrival=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 border-b border-[#DED8CC]/60 hover:text-[#C49A5A]"
                >
                  NEW ARRIVALS
                </Link>

                <div className="py-2 border-b border-[#DED8CC]/60 space-y-2">
                  <span className="text-[#C49A5A] text-[10px] font-bold tracking-widest block uppercase">
                    JEWELLERY CATEGORIES
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs normal-case text-[#77736B] pl-2">
                    <Link to="/jewellery/rings" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5A]">Rings</Link>
                    <Link to="/jewellery/necklaces" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5A]">Necklaces</Link>
                    <Link to="/jewellery/earrings" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5A]">Earrings</Link>
                    <Link to="/jewellery/bracelets" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5A]">Bracelets</Link>
                    <Link to="/jewellery?category=Bridal" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5A]">Bridal</Link>
                    <Link to="/jewellery?category=Men's" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5A]">Men's</Link>
                  </div>
                </div>

                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-[#DED8CC]/60 hover:text-[#C49A5A]"
                >
                  <span>SAVED WISHLIST</span>
                  {wishlist.length > 0 && (
                    <span className="bg-[#C49A5A] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/jewellery?collection=The Bridal Edit"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 border-b border-[#DED8CC]/60 hover:text-[#C49A5A]"
                >
                  COLLECTIONS
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 border-b border-[#DED8CC]/60 hover:text-[#C49A5A]"
                >
                  ABOUT AURÉLIA
                </Link>
              </nav>
            </div>

            {/* Mobile Footer Links */}
            <div className="pt-6 border-t border-[#DED8CC] space-y-3">
              <Link
                to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-[#102C24] text-[#F8F5EE] text-xs font-semibold uppercase tracking-widest py-3 hover:bg-[#C49A5A] transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> {user ? `My Account (${user.name})` : 'Client Sign In'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

