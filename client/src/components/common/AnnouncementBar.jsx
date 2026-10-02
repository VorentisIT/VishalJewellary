import React from 'react';

const announcements = [
  "✦ Trusted by 50,000+ Happy Clients",
  "100% BIS Hallmarked Solid Gold",
  "IGI & GIA Certified Natural Diamonds",
  "Complimentary Insured Express Shipping Above ₹25,000",
  "15-Day Hassle-Free Returns & Lifetime Exchange",
  "Certified Authentic Jewellery"
];

export default function AnnouncementBar() {
  return (
    <div className="bg-[#102C24] text-[#F8F5EE] text-[11px] font-sans py-2 border-b border-[#0A1D18] overflow-hidden select-none">
      <div className="flex items-center overflow-hidden">
        {/* Infinite Continuous Marquee Banner */}
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10 text-[10px] sm:text-[11px] tracking-widest uppercase font-medium">
          {[...announcements, ...announcements, ...announcements, ...announcements].map((text, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span className="text-[#E87D3E]">✦</span>
              <span className={text.includes('Shipping') ? 'text-[#E87D3E] font-semibold' : 'text-[#F8F5EE]/90'}>
                {text.replace(/^✦\s*/, '')}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


