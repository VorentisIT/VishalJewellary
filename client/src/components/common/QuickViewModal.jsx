import React, { useState } from 'react';
import { X, Heart, ShieldCheck, ShoppingBag, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop, formatINR } from '../../store/ShopContext';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } = useShop();
  const [selectedSize, setSelectedSize] = useState('7');
  const [selectedMetal, setSelectedMetal] = useState('18K Gold');

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const inWishlist = isInWishlist(product._id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
        />

        {/* Modal Window Scale & Rise */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-ivory border border-warm-border max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl relative p-6 grid grid-cols-1 md:grid-cols-2 gap-8 z-10"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 text-charcoal hover:text-[#D96B27] p-1 transition-colors"
            aria-label="Close Quick View"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Product Image */}
          <div className="bg-ivory-paper border border-warm-border p-4 flex items-center justify-center rounded-sm">
            <img
              src={product.images && product.images[0] ? product.images[0] : '/assets/category_rings.jpg'}
              alt={product.name}
              className="w-full h-80 object-cover rounded-sm"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#D96B27] block mb-1">
                {product.category} • {product.collectionName || 'Everyday Gold'}
              </span>
              <h2 className="font-serif text-2xl font-bold text-charcoal">{product.name}</h2>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-[#D96B27]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D96B27]" />
                  ))}
                </div>
                <span className="text-xs text-warm-gray font-medium">4.9 (24 Reviews)</span>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-2xl font-bold text-charcoal">
                  {formatINR(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-warm-gray line-through">
                    {formatINR(product.price)}
                  </span>
                )}
              </div>

              <p className="text-xs text-charcoal-muted leading-relaxed mt-3">
                {product.description}
              </p>

              {/* Metal Selector */}
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal block mb-2">Metal</label>
                <div className="flex gap-2">
                  {['18K Gold', 'Rose Gold', 'White Gold', 'Platinum'].map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={`text-xs px-3 py-1.5 border ${
                        selectedMetal === metal
                          ? 'border-[#D96B27] bg-[#D96B27]/10 text-[#D96B27] font-semibold'
                          : 'border-warm-border text-charcoal-muted hover:border-[#D96B27]'
                      } transition-colors`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ring / Size Selector */}
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal block mb-2">Size</label>
                <div className="flex gap-2">
                  {['6', '7', '8', '9', '10'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 border text-xs flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-[#D96B27] bg-[#D96B27] text-white font-bold'
                          : 'border-warm-border text-charcoal hover:border-[#D96B27]'
                      } transition-colors`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-warm-border">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addToCart(product, 1, selectedSize, selectedMetal);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest py-3 hover:bg-[#B85517] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#D96B27]/20"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Bag
                </button>
                
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 border border-warm-border hover:border-[#D96B27] transition-colors ${
                    inWishlist ? 'text-red-500 fill-red-500' : 'text-charcoal'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-warm-gray">
                <ShieldCheck className="w-4 h-4 text-[#D96B27]" />
                <span>BIS Hallmarked • Free Express Insured Shipping</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
