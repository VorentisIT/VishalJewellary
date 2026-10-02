import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  Gift, 
  Sparkles, 
  Check, 
  ArrowRight, 
  HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop, formatINR } from '../../store/ShopContext';
import { crossSellAddons } from '../../data/catalogueData';

export default function CartDrawer() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    freeShippingThreshold,
    shippingFee,
    discountAmount,
    cartTotal,
    appliedCoupon,
    setAppliedCoupon,
    isCartOpen,
    setIsCartOpen
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [activeAddonCategory, setActiveAddonCategory] = useState('All');
  const [isGiftWrapSelected, setIsGiftWrapSelected] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [showGiftNoteInput, setShowGiftNoteInput] = useState(false);
  
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const progress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const availableCoupons = [
    { code: 'AURELIA10', label: '10% OFF', desc: 'On all fine jewellery orders', min: 0, pct: 10 },
    { code: 'BRIDAL15', label: '15% OFF', desc: 'Orders above ₹1,00,000', min: 100000, pct: 15 },
    { code: 'GOLDEN5', label: '5% INSTANT', desc: 'Extra discount on gold pieces', min: 0, pct: 5 }
  ];

  const handleApplyCouponCode = (code) => {
    setCouponError('');
    setCouponSuccess('');
    const codeClean = code.trim().toUpperCase();

    if (codeClean === 'AURELIA10') {
      setAppliedCoupon({ code: 'AURELIA10', discountPercentage: 10 });
      setCouponSuccess('10% Luxury discount applied!');
      setCouponCode('AURELIA10');
    } else if (codeClean === 'BRIDAL15') {
      if (cartSubtotal >= 100000) {
        setAppliedCoupon({ code: 'BRIDAL15', discountPercentage: 15 });
        setCouponSuccess('15% Bridal Edit discount applied!');
        setCouponCode('BRIDAL15');
      } else {
        setCouponError('BRIDAL15 requires a minimum cart value of ₹1,00,000.');
      }
    } else if (codeClean === 'GOLDEN5') {
      setAppliedCoupon({ code: 'GOLDEN5', discountPercentage: 5 });
      setCouponSuccess('5% Instant gold savings applied!');
      setCouponCode('GOLDEN5');
    } else {
      setCouponError('Invalid coupon code.');
    }
  };

  const handleManualCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    handleApplyCouponCode(couponCode);
  };

  const addonCategories = ['All', 'Matching Earrings', 'Ring Care', 'Chains', 'Velvet Boxes'];
  const filteredAddons = activeAddonCategory === 'All' 
    ? crossSellAddons 
    : crossSellAddons.filter(item => item.category === activeAddonCategory);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
        />

        {/* Drawer Slide-in from Right */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="bg-ivory w-full max-w-md h-full shadow-2xl flex flex-col justify-between relative z-10"
        >
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-warm-border">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#D96B27]" />
                <h3 className="font-serif text-xl font-bold uppercase tracking-widest text-charcoal">
                  Your Shopping Bag ({cart.reduce((total, it) => total + it.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-charcoal hover:text-[#D96B27] transition-colors"
                aria-label="Close Shopping Bag"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Complimentary Shipping Progress */}
            <div className="mt-4 bg-ivory-paper p-3 border border-warm-border rounded-sm">
              <div className="flex justify-between text-xs font-medium text-charcoal mb-1">
                {remainingForFreeShipping > 0 ? (
                  <span>Add <strong className="text-[#D96B27] font-bold">{formatINR(remainingForFreeShipping)}</strong> more for <strong>Free Insured Shipping</strong></span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" /> You've unlocked Complimentary Express Insured Shipping!
                  </span>
                )}
              </div>
              <div className="w-full bg-warm-border h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#D96B27] h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-warm-gray mx-auto stroke-1" />
                <h4 className="font-serif text-xl text-charcoal font-normal">Your shopping bag is empty</h4>
                <p className="text-xs text-warm-gray max-w-xs mx-auto">
                  Discover handcrafted heirloom diamond solitaires, gold necklaces, and certified bridal suites.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/jewellery');
                    }}
                    className="bg-[#D96B27] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 hover:bg-[#B85517] transition-colors shadow-sm"
                  >
                    Explore Fine Jewellery
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-4 pb-4 border-b border-warm-border">
                      <img
                        src={item.product.images && item.product.images[0] ? item.product.images[0] : '/assets/category_rings.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover bg-ivory-paper border border-warm-border flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif font-bold text-sm text-charcoal line-clamp-1">{item.product.name}</h4>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-warm-gray hover:text-red-500 p-1 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[11px] text-warm-gray mt-0.5">
                            Metal: {item.selectedMetal || item.product.metal} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-warm-border bg-white">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="p-1 hover:bg-warm-border text-charcoal transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-1 hover:bg-warm-border text-charcoal transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-serif font-bold text-sm text-charcoal">
                            {formatINR((item.product.discountPrice || item.product.price) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gift Wrap & Personalized Message Option */}
                <div className="p-3.5 bg-ivory-paper border border-warm-border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal">
                      <input
                        type="checkbox"
                        checked={isGiftWrapSelected}
                        onChange={(e) => setIsGiftWrapSelected(e.target.checked)}
                        className="accent-[#D96B27] w-4 h-4"
                      />
                      <Gift className="w-3.5 h-3.5 text-[#D96B27]" />
                      <span>Add Complimentary Luxury Gift Packaging</span>
                    </label>
                  </div>

                  {isGiftWrapSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2 border-t border-warm-border space-y-2"
                    >
                      <button
                        type="button"
                        onClick={() => setShowGiftNoteInput(!showGiftNoteInput)}
                        className="text-[11px] text-[#D96B27] font-semibold hover:underline"
                      >
                        {showGiftNoteInput ? '− Hide message note' : '+ Add personal message card'}
                      </button>
                      {showGiftNoteInput && (
                        <textarea
                          placeholder="Write your personal heartfelt message here..."
                          value={giftNote}
                          onChange={(e) => setGiftNote(e.target.value)}
                          maxLength={150}
                          rows={2}
                          className="w-full p-2 bg-white border border-warm-border text-xs focus:outline-none focus:border-[#D96B27] resize-none"
                        />
                      )}
                    </motion.div>
                  )}
                </div>

                {/* "Complete Your Look" Cross-sell Filter Section */}
                <div className="pt-2 border-t border-warm-border space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" /> Complete Your Look
                    </h4>
                    <span className="text-[10px] text-warm-gray uppercase">Add-ons</span>
                  </div>

                  {/* Addon Filter Tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {addonCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveAddonCategory(cat)}
                        className={`text-[10px] px-2.5 py-1 whitespace-nowrap uppercase tracking-wider font-semibold border transition-all ${
                          activeAddonCategory === cat
                            ? 'bg-[#D96B27] border-[#D96B27] text-white'
                            : 'bg-white border-warm-border text-charcoal hover:border-[#D96B27]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Addon Items Grid */}
                  <div className="space-y-2">
                    {filteredAddons.map((addon) => (
                      <div
                        key={addon._id}
                        className="flex items-center justify-between p-2.5 bg-white border border-warm-border hover:border-[#D96B27]/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={addon.image}
                            alt={addon.name}
                            className="w-12 h-12 object-cover bg-ivory-paper border border-warm-border flex-shrink-0"
                          />
                          <div>
                            <h5 className="font-serif font-bold text-xs text-charcoal">{addon.name}</h5>
                            <span className="text-xs text-[#D96B27] font-semibold">{formatINR(addon.price)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            addToCart({
                              _id: addon._id,
                              name: addon.name,
                              price: addon.price,
                              images: [addon.image],
                              metal: '18K Gold',
                              category: addon.category
                            }, 1);
                          }}
                          className="bg-ivory border border-[#D96B27] text-[#D96B27] hover:bg-[#D96B27] hover:text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-ivory-paper border-t border-warm-border space-y-4">
              
              {/* 1-Click Available Discount Coupons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-warm-gray">Available Promo Codes</span>
                  {appliedCoupon && (
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponSuccess('');
                      }}
                      className="text-[10px] text-red-600 hover:underline font-semibold"
                    >
                      Remove ({appliedCoupon.code})
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {availableCoupons.map((c) => {
                    const isApplied = appliedCoupon?.code === c.code;
                    return (
                      <button
                        key={c.code}
                        onClick={() => handleApplyCouponCode(c.code)}
                        className={`text-[10px] px-2.5 py-1.5 border font-semibold flex items-center gap-1 transition-all whitespace-nowrap ${
                          isApplied
                            ? 'bg-[#D96B27] border-[#D96B27] text-white'
                            : 'bg-white border-warm-border text-charcoal hover:border-[#D96B27]'
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        <span>{c.code} ({c.label})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual Coupon Input Form */}
              <form onSubmit={handleManualCouponSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-warm-gray absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Enter Promo Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-warm-border text-xs text-charcoal placeholder:text-warm-gray focus:outline-none uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#D96B27] text-white text-xs px-4 uppercase tracking-widest font-semibold hover:bg-[#B85517] transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-700 font-semibold">{couponSuccess}</p>}

              {/* Calculations Breakdown */}
              <div className="space-y-1.5 text-xs text-charcoal-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(cartSubtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#D96B27] font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : formatINR(shippingFee)}</span>
                </div>
                {isGiftWrapSelected && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Luxury Gift Packaging</span>
                    <span>FREE</span>
                  </div>
                )}
                <div className="flex justify-between font-serif text-base font-bold text-charcoal pt-2 border-t border-warm-border">
                  <span>Total Amount</span>
                  <span className="text-lg text-charcoal">{formatINR(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest py-3.5 hover:bg-[#B85517] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D96B27]/20"
              >
                Proceed to Secure Checkout
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-warm-gray">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D96B27]" />
                <span>100% Insured Delivery • Encrypted 256-Bit Checkout</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
