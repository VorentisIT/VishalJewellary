import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function StorySection() {
  const panels = [
    {
      img: '/assets/craftsmanship.jpg',
      title: 'Skilled Artisans',
      subtitle: 'Generations of expertise'
    },
    {
      img: '/assets/category_rings.jpg',
      title: 'Premium Materials',
      subtitle: 'Ethically sourced'
    },
    {
      img: '/assets/sketch_design.jpg',
      title: 'Timeless Designs',
      subtitle: 'Classics for tomorrow'
    }
  ];

  return (
    <section className="bg-[#F8F5EE] py-8 sm:py-10 border-b border-[#DED8CC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-5"
          >
            <span className="text-[10px] font-semibold tracking-[0.28em] text-[#D96B27] uppercase block font-sans">
              HERITAGE & CRAFTSMANSHIP
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#202522] font-normal leading-tight">
              Crafted With Intention. <br />Worn With Meaning.
            </h2>

            <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed font-light max-w-md">
              Every piece is a blend of traditional artistry and modern design, created with the finest materials and an uncompromising eye for detail.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D96B27] border-b border-[#D96B27] pb-0.5 hover:text-[#B85517] transition-colors"
              >
                OUR CRAFTSMANSHIP
              </Link>
            </div>
          </motion.div>

          {/* Right Column: 3 Image Panels with Staggered Framer Motion */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-3.5">
            {panels.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="space-y-2 text-left group cursor-pointer"
              >
                <div className="aspect-[3/4] bg-[#F4EFEA] border border-[#DED8CC] overflow-hidden image-zoom-container rounded-sm shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#202522] block font-serif group-hover:text-[#D96B27] transition-colors">
                    {p.title}
                  </span>
                  <span className="text-[10px] text-[#77736B] block">{p.subtitle}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
