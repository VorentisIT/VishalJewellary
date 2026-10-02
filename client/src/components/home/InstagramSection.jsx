import React from 'react';
import { Instagram } from 'lucide-react';

const instaImages = [
  '/assets/category_necklaces.jpg',
  '/assets/hero_lifestyle.jpg',
  '/assets/category_rings.jpg',
  '/assets/craftsmanship.jpg',
  '/assets/category_earrings.jpg',
  '/assets/editorial_bridal.jpg',
  '/assets/category_bracelets.jpg'
];

export default function InstagramSection() {
  return (
    <section className="bg-[#102C24] text-[#F8F5EE] py-8 sm:py-10 border-b border-[#0A1D18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-4">
          <span className="text-[10px] font-bold tracking-[0.28em] text-[#C49A5A] uppercase block font-sans mb-1">
            FOLLOW THE STORY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            @aureliajewellery
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* 7 Image Thumbnails Grid */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {instaImages.map((img, idx) => (
              <a
                key={idx}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="aspect-square bg-[#173D32] border border-white/10 overflow-hidden image-zoom-container block group relative rounded-sm"
              >
                <img src={img} alt={`Instagram photo ${idx}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#102C24]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-[#C49A5A]" />
                </div>
              </a>
            ))}
          </div>

          {/* Right Text Box */}
          <div className="lg:col-span-3 space-y-3 text-left lg:text-right border-l lg:border-l-0 lg:border-r border-[#C49A5A]/30 pl-4 lg:pl-0 lg:pr-4">
            <h3 className="font-serif text-lg italic text-[#F8F5EE] font-light">
              Beauty lives in your moments.
            </h3>
            
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 bg-[#173D32] border border-[#C49A5A]/40 text-[#D9BC86] text-[10px] font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full hover:bg-[#C49A5A] hover:text-white transition-colors"
            >
              Tag us to be featured
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
