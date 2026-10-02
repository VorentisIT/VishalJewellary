import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function JewelleryFinder() {
  const [occasion, setOccasion] = useState('');
  const [style, setStyle] = useState('');
  const [metal, setMetal] = useState('');
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  const handleFindPiece = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (metal) params.set('metal', metal);
    if (occasion) params.set('occasion', occasion === 'Wedding' ? 'Bridal & Wedding' : occasion === 'Everyday' ? 'Everyday Luxury' : occasion === 'Gift' ? 'Gifting' : occasion);
    if (budget === 'Under ₹25K') params.set('maxPrice', '25000');
    if (budget === '₹25K–₹50K') { params.set('minPrice', '25000'); params.set('maxPrice', '50000'); }
    if (budget === '₹50K–₹1L') { params.set('minPrice', '50000'); params.set('maxPrice', '100000'); }
    if (budget === '₹1L+') params.set('minPrice', '100000');

    navigate(`/jewellery?${params.toString()}`);
  };

  return (
    <section className="bg-[#F5EFE6] py-8 sm:py-10 border-b border-[#DED8CC] relative overflow-hidden">
      
      {/* Left Botanical Leaves SVG Decor */}
      <svg
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-44 h-64 text-[#102C24]/15 pointer-events-none stroke-current fill-none hidden md:block"
        viewBox="0 0 100 150"
        strokeWidth="1"
      >
        <path d="M 10 150 Q 55 75 90 10 M 20 120 Q 50 60 80 20 M 40 140 Q 70 80 95 30" />
        <path d="M 15 130 C 35 110 45 90 25 70 C 45 70 65 50 45 30" />
      </svg>

      {/* Right Botanical Leaves SVG Decor */}
      <svg
        className="absolute -right-6 top-1/2 -translate-y-1/2 w-44 h-64 text-[#102C24]/15 pointer-events-none stroke-current fill-none hidden md:block"
        viewBox="0 0 100 150"
        strokeWidth="1"
      >
        <path d="M 90 150 Q 45 75 10 10 M 80 120 Q 50 60 20 20 M 60 140 Q 30 80 5 30" />
        <path d="M 85 130 C 65 110 55 90 75 70 C 55 70 35 50 55 30" />
      </svg>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-xl mx-auto mb-6 space-y-1">
          <span className="text-[10px] font-semibold tracking-[0.28em] text-[#C49A5A] uppercase block font-sans">
            A MORE PERSONAL WAY TO SHOP
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#202522] font-normal">
            Find Your Perfect Piece
          </h2>
          <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed font-light">
            Answer a few questions and we'll curate jewellery that matches your story.
          </p>
        </div>

        {/* 4 Selectors Row */}
        <form onSubmit={handleFindPiece} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            <div className="relative">
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-white border border-[#DED8CC] p-3.5 pr-8 text-xs text-[#202522] focus:outline-none appearance-none font-sans cursor-pointer shadow-sm rounded-sm"
              >
                <option value="">What's the occasion?</option>
                <option value="Engagement">Engagement</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Everyday">Everyday</option>
                <option value="Gift">Gifting</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#C49A5A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-white border border-[#DED8CC] p-3.5 pr-8 text-xs text-[#202522] focus:outline-none appearance-none font-sans cursor-pointer shadow-sm rounded-sm"
              >
                <option value="">Preferred style?</option>
                <option value="Minimal">Minimal</option>
                <option value="Classic">Classic</option>
                <option value="Statement">Statement</option>
                <option value="Contemporary">Contemporary</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#C49A5A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={metal}
                onChange={(e) => setMetal(e.target.value)}
                className="w-full bg-white border border-[#DED8CC] p-3.5 pr-8 text-xs text-[#202522] focus:outline-none appearance-none font-sans cursor-pointer shadow-sm rounded-sm"
              >
                <option value="">Preferred metal?</option>
                <option value="18K Gold">Gold</option>
                <option value="Rose Gold">Rose Gold</option>
                <option value="White Gold">White Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#C49A5A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-white border border-[#DED8CC] p-3.5 pr-8 text-xs text-[#202522] focus:outline-none appearance-none font-sans cursor-pointer shadow-sm rounded-sm"
              >
                <option value="">Your budget?</option>
                <option value="Under ₹25K">Under ₹25,000</option>
                <option value="₹25K–₹50K">₹25,000 – ₹50,000</option>
                <option value="₹50K–₹1L">₹50,000 – ₹1,00,000</option>
                <option value="₹1L+">₹1,00,000+</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#C49A5A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

          {/* CTA Submit Button */}
          <div className="text-center pt-2">
            <button
              type="submit"
              className="bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest px-10 py-3.5 hover:bg-[#B85517] transition-all inline-flex items-center gap-3 shadow-md shadow-[#D96B27]/25"
            >
              SHOW RECOMMENDED PIECES
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}
