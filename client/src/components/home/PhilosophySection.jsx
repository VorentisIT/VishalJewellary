import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PhilosophySection() {
  return (
    <section className="bg-ivory-paper py-6 sm:py-8 border-b border-warm-border overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-4xl mx-auto px-4 text-center space-y-3"
      >
        <span className="text-[10px] font-semibold tracking-[0.3em] text-[#D96B27] uppercase block">
          OUR PHILOSOPHY
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-tight">
          Designed for the moments that deserve to be remembered.
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto leading-relaxed font-light">
          At VISHAL JEWELLERY, we create more than fine jewellery. We craft timeless heirlooms that celebrate love, strength, and every chapter of your unique story.
        </p>
        <div className="pt-2">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-charcoal hover:text-[#D96B27] transition-colors border-b border-[#D96B27] pb-1"
          >
            Discover Our Story
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
