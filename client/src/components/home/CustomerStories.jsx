import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerStories() {
  const photos = [
    { src: '/assets/category_rings.jpg', alt: 'Customer Solitaire Ring' },
    { src: '/assets/category_necklaces.jpg', alt: 'Customer Gold Necklace' },
    { src: '/assets/packaging_box.jpg', alt: 'Aurélia Luxury Packaging' },
    { src: '/assets/category_bracelets.jpg', alt: 'Customer Diamond Bracelet' }
  ];

  return (
    <section className="bg-ivory py-8 sm:py-10 border-b border-warm-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-6"
        >
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D96B27] uppercase block mb-1">
              KIND WORDS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              What Our Customers Say
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -4 }}
            className="lg:col-span-5 bg-ivory-paper border border-warm-border p-8 shadow-sm space-y-4 relative rounded-sm"
          >
            <Quote className="w-8 h-8 text-[#D96B27]/40 stroke-[1]" />
            <p className="font-serif text-lg text-charcoal italic leading-relaxed">
              "Every detail felt thoughtful, from the packaging to the piece itself. Aurélia has become my go-to for meaningful jewellery."
            </p>
            
            <div className="pt-2 border-t border-warm-border flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-charcoal block">Priya S.</span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 fill-emerald-700 text-white" /> Verified Purchase
                </span>
              </div>
              <div className="flex text-[#D96B27]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D96B27]" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Customer Photo Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="aspect-square bg-ivory-paper border border-warm-border overflow-hidden image-zoom-container rounded-sm shadow-sm cursor-pointer"
              >
                <img src={p.src} alt={p.alt} className="w-full h-full object-cover pointer-events-none" />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
