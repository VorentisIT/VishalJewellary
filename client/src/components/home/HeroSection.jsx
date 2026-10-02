import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, RefreshCw, Gift, Award, Sparkles } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    image: '/assets/hero_saffron_gold_solitaire.jpg',
    headingStart: 'Brilliance That',
    headingItalic: 'Defines',
    headingEnd: 'True Perfection.',
    subtext: 'Masterfully faceted radiant solitaire diamonds set in handcrafted 18K warm yellow gold.'
  },
  {
    id: 2,
    image: '/assets/hero_saffron_amber_necklace.jpg',
    headingStart: 'Heirlooms For',
    headingItalic: 'Beginnings',
    headingEnd: 'Worth Celebrating.',
    subtext: 'Grand 22K solid gold bridal chokers adorned with vibrant saffron gemstones and uncut polki diamonds.'
  },
  {
    id: 3,
    image: '/assets/hero_emerald_suite.jpg',
    headingStart: 'Jewellery Made to',
    headingItalic: 'Become',
    headingEnd: 'Part of Your Story.',
    subtext: 'Zambian emerald pendants and timeless brilliant cut diamonds designed for life’s milestone moments.'
  },
  {
    id: 4,
    image: '/assets/hero_royal_polki.jpg',
    headingStart: 'Crafted With Intention.',
    headingItalic: 'Worn With',
    headingEnd: 'Timeless Meaning.',
    subtext: 'Certified 18K & 22K hallmarked gold creations designed with uncompromising artisanal precision.'
  }
];

const servicePromises = [
  { icon: ShieldCheck, title: 'Certified Hallmarked Gold' },
  { icon: Truck, title: 'Free Insured Express Delivery' },
  { icon: RefreshCw, title: '15-Day Return & Lifetime Exchange' },
  { icon: Gift, title: 'Luxury Velvet Gift Packaging' },
  { icon: Award, title: '100% GIA & IGI Certified' },
  { icon: Sparkles, title: 'Handcrafted by Master Artisans' }
];

export default function HeroSection() {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-slide loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentIdx];

  // Quadruple promises for seamless continuous infinite slide
  const infinitePromises = [
    ...servicePromises,
    ...servicePromises,
    ...servicePromises,
    ...servicePromises
  ];

  return (
    <section className="relative w-full bg-[#F8F5EE] border-b border-[#DED8CC] flex items-center overflow-hidden lg:min-h-[560px]">
      
      {/* 1. Full-Width Background Cover Image Slider */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.image}
            src={slide.image}
            alt={slide.headingStart}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="w-full h-full object-cover object-[75%_center] sm:object-right md:object-right lg:object-[center_right] select-none"
          />
        </AnimatePresence>

        {/* Soft luxury gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5EE] via-[#F8F5EE]/85 to-transparent md:bg-gradient-to-r md:from-[#F8F5EE] md:via-[#F8F5EE]/85 md:to-transparent w-full md:w-[62%] lg:w-[54%] z-10 pointer-events-none" />
      </div>

      {/* 2. Foreground Editorial Content with Zero Excess Bottom Gap */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-28 pb-4 sm:pb-6">
        <div className="max-w-xl space-y-4 sm:space-y-5 text-left">

          {/* Main Headline & Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-3.5 sm:space-y-5 mt-4 sm:mt-6 lg:mt-8"
            >
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[3.3rem] font-normal leading-[1.2] sm:leading-[1.24] lg:leading-[1.28] text-[#202522] tracking-tight">
                {slide.headingStart} <br />
                <span className="italic font-serif font-light text-[#D96B27]">{slide.headingItalic}</span> {slide.headingEnd}
              </h1>

              <p className="text-xs sm:text-sm text-[#77736B] max-w-md leading-relaxed sm:leading-loose font-sans font-light">
                {slide.subtext}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/jewellery"
                className="w-full bg-[#D96B27] text-white text-[11px] font-semibold uppercase tracking-widest px-7 py-3.5 hover:bg-[#B85517] transition-all flex items-center justify-center shadow-md shadow-[#D96B27]/25 text-center"
              >
                SHOP THE COLLECTION
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/jewellery?newArrival=true"
                className="w-full bg-white/90 backdrop-blur-sm border border-[#D96B27] text-[#D96B27] text-[11px] font-semibold uppercase tracking-widest px-6 py-3.5 hover:bg-[#D96B27] hover:text-white transition-all text-center shadow-sm block"
              >
                EXPLORE NEW ARRIVALS
              </Link>
            </motion.div>
          </div>

          {/* Automatic Horizontally Sliding Service Promises with Increased Icon Height */}
          <div className="pt-3.5 border-t border-[#DED8CC] w-full overflow-hidden">
            <div className="animate-slide-continuous flex items-center gap-8 py-1 select-none">
              {infinitePromises.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 whitespace-nowrap text-xs text-[#202522] font-medium transition-colors"
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#D96B27] flex-shrink-0" />
                    <span className="tracking-wide text-[11px] sm:text-xs">{item.title}</span>
                    <span className="text-[#D96B27]/40 text-xs ml-4">✦</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Right-Side Hallmark Badge */}
      <div className="hidden lg:block absolute bottom-5 right-8 z-20 bg-charcoal/80 backdrop-blur-md px-4 py-2 border border-white/20 text-ivory text-left shadow-2xl">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#D96B27] block">
          Certified Handcrafted Fine Jewellery
        </span>
        <span className="font-serif text-xs text-white block">
          BIS Hallmarked • GIA & IGI Certified
        </span>
      </div>

    </section>
  );
}
