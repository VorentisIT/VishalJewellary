import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#102C24] text-[#F8F5EE] pt-10 pb-6 border-t border-[#0A1D18] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-[#173D32]">
          
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4 pr-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-[#F8F5EE] uppercase block">
                AURÉLIA
              </span>
              <span className="text-[8px] font-semibold tracking-[0.35em] text-[#C49A5A] uppercase block -mt-1">
                FINE JEWELLERY
              </span>
            </Link>
            
            <p className="text-xs text-[#F8F5EE]/70 leading-relaxed max-w-sm font-light">
              Jewellery for life’s most meaningful moments. Thoughtfully designed. Beautifully crafted. Always yours.
            </p>

            <div className="flex items-center space-x-4 pt-2 text-[#C49A5A]">
              <a href="#instagram" className="hover:text-[#F8F5EE] transition-colors" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="#facebook" className="hover:text-[#F8F5EE] transition-colors" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="#pinterest" className="hover:text-[#F8F5EE] transition-colors" aria-label="Pinterest"><Globe className="w-4 h-4" /></a>
              <a href="#youtube" className="hover:text-[#F8F5EE] transition-colors" aria-label="Youtube"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Column 1: SHOP */}
          <div>
            <h4 className="font-serif text-xs font-bold tracking-widest uppercase text-[#C49A5A] mb-4">SHOP</h4>
            <ul className="space-y-2 text-xs text-[#F8F5EE]/80">
              <li><Link to="/jewellery/rings" className="hover:text-[#C49A5A] transition-colors">Rings</Link></li>
              <li><Link to="/jewellery/necklaces" className="hover:text-[#C49A5A] transition-colors">Necklaces</Link></li>
              <li><Link to="/jewellery/earrings" className="hover:text-[#C49A5A] transition-colors">Earrings</Link></li>
              <li><Link to="/jewellery/bracelets" className="hover:text-[#C49A5A] transition-colors">Bracelets</Link></li>
              <li><Link to="/jewellery?category=Bridal" className="hover:text-[#C49A5A] transition-colors">Bridal</Link></li>
              <li><Link to="/jewellery?category=Men's" className="hover:text-[#C49A5A] transition-colors">Men's</Link></li>
              <li><Link to="/jewellery" className="hover:text-[#C49A5A] transition-colors">All Collections</Link></li>
            </ul>
          </div>

          {/* Column 2: CUSTOMER CARE */}
          <div>
            <h4 className="font-serif text-xs font-bold tracking-widest uppercase text-[#C49A5A] mb-4">CUSTOMER CARE</h4>
            <ul className="space-y-2 text-xs text-[#F8F5EE]/80">
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Size Guide</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Jewellery Care</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 3: ABOUT */}
          <div>
            <h4 className="font-serif text-xs font-bold tracking-widest uppercase text-[#C49A5A] mb-4">ABOUT</h4>
            <ul className="space-y-2 text-xs text-[#F8F5EE]/80">
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Our Story</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Craftsmanship</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Sustainability</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Journal</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Careers</Link></li>
              <li><Link to="/about" className="hover:text-[#C49A5A] transition-colors">Stores</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-[#F8F5EE]/60 gap-4">
          <p>© 2026 Aurélia Fine Jewellery. All rights reserved.</p>
          
          <div className="flex space-x-6">
            <a href="#privacy" className="hover:text-[#C49A5A]">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#C49A5A]">Terms of Service</a>
            <a href="#cookies" className="hover:text-[#C49A5A]">Cookies</a>
          </div>

          <div className="flex items-center text-[11px] text-[#F8F5EE]/70">
            <span>Developed by <a href="https://vorentis-it.com" target="_blank" rel="noopener noreferrer" className="text-[#C49A5A] hover:text-[#F8F5EE] font-medium transition-colors">vorentis-it.com</a></span>
          </div>
        </div>

      </div>
    </footer>
  );
}
