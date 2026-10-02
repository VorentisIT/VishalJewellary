import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Rings', path: '/jewellery/rings', image: '/assets/category_rings.jpg' },
  { name: 'Necklaces', path: '/jewellery/necklaces', image: '/assets/category_necklaces.jpg' },
  { name: 'Earrings', path: '/jewellery/earrings', image: '/assets/category_earrings.jpg' },
  { name: 'Bracelets', path: '/jewellery/bracelets', image: '/assets/category_bracelets.jpg' },
  { name: 'Bridal', path: '/jewellery?category=Bridal', image: '/assets/category_bridal.jpg' },
  { name: "Men's", path: "/jewellery?category=Men's", image: '/assets/category_mens.jpg' }
];

export default function CategoryGrid() {
  // Triple the array for seamless infinite auto-sliding loop
  const infiniteCategories = [...categories, ...categories, ...categories];

  return (
    <section className="bg-[#F8F5EE] py-8 sm:py-10 border-b border-[#DED8CC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-5 space-y-1">
          <span className="text-[10px] font-semibold tracking-[0.28em] text-[#C49A5A] uppercase block font-sans">
            EXPLORE BY CATEGORY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#202522] font-normal">
            Discover pieces for every moment, every mood, every you.
          </h2>
        </div>

        {/* Continuous Auto-Sliding Infinite Track Constrained to Container */}
        <div className="w-full overflow-hidden rounded-sm">
          <div className="animate-slide-continuous flex gap-3.5 py-1">
            {infiniteCategories.map((cat, idx) => (
              <Link
                key={`${cat.name}-${idx}`}
                to={cat.path}
                className="w-[155px] sm:w-[185px] md:w-[200px] lg:w-[215px] flex-shrink-0 group relative bg-[#F4EFEA] border border-[#DED8CC] overflow-hidden rounded-sm flex flex-col justify-end shadow-sm hover:shadow-md transition-all duration-300 select-none"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-3 flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-white tracking-wide flex items-center gap-1 group-hover:text-[#D9BC86] transition-colors">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
