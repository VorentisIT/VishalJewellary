import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CollectionEditorial() {
  return (
    <section className="bg-[#F8F5EE] py-8 sm:py-10 border-b border-[#DED8CC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#DED8CC] shadow-xl overflow-hidden rounded-sm"
        >
          
          {/* Left Column: Large Bridal Photography */}
          <div className="lg:col-span-6 image-zoom-container relative min-h-[420px] lg:min-h-[500px]">
            <img
              src="/assets/editorial_bridal.jpg"
              alt="The Bridal Edit Luxury Photography"
              className="w-full h-full object-cover"
            />
            {/* Watch Our Story Pill */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Playing Vishal Jewellery Bridal Story video...")}
              className="absolute bottom-6 left-6 z-10 bg-black/50 backdrop-blur-md border border-white/30 text-white text-[10px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black/70 transition-colors"
            >
              <Play className="w-3 h-3 fill-white text-white" /> WATCH OUR STORY
            </motion.button>
          </div>

          {/* Right Column: Deep Forest Green Card */}
          <div className="lg:col-span-6 bg-[#102C24] text-[#F8F5EE] p-8 lg:p-14 flex flex-col justify-between relative">
            
            {/* Subtle Botanical Vector Illustration in Top Right */}
            <svg
              className="absolute top-4 right-4 w-32 h-32 text-[#C49A5A]/25 pointer-events-none stroke-current fill-none"
              viewBox="0 0 100 100"
              strokeWidth="1"
            >
              <path d="M 20 90 Q 50 30 90 10 M 30 80 Q 60 50 80 35 M 50 95 Q 75 55 95 45" />
              <circle cx="90" cy="10" r="2.5" className="fill-[#C49A5A]/40" />
            </svg>

            <div className="space-y-6 relative z-10 my-auto">
              <div className="text-[10px] font-semibold tracking-[0.3em] text-[#C49A5A] uppercase flex items-center gap-2 font-sans">
                <span>THE BRIDAL EDIT</span>
                <span>—</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F5EE] font-normal leading-tight">
                Timeless pieces for beginnings worth celebrating.
              </h2>

              <p className="text-xs sm:text-sm text-[#F8F5EE]/80 leading-relaxed font-light max-w-md">
                From the first look to forever, explore our bridal collection crafted for life's most beautiful moments.
              </p>

              <div className="pt-2">
                <Link
                  to="/jewellery?category=Bridal"
                  className="inline-flex items-center gap-3 bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:bg-[#B85517] transition-all shadow-md shadow-[#D96B27]/25"
                >
                  EXPLORE BRIDAL
                </Link>
              </div>
            </div>

            {/* Bottom Right Vertical Text Watermark */}
            <div className="pt-6 text-right text-[8px] uppercase tracking-[0.35em] text-[#C49A5A]/50 font-serif">
              L O V E • T R A D I T I O N • F O R E V E R
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
