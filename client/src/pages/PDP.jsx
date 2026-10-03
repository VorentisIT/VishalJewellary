import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ShieldCheck, Award, Truck, Star, Check, HelpCircle } from 'lucide-react';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { useShop, formatINR } from '../store/ShopContext';
import { catalogueProducts } from '../data/catalogueData';
import { seedProducts } from '../../../server/seed/seedData.js';

export default function PDP() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedMetal, setSelectedMetal] = useState('18K Gold');
  const [selectedSize, setSelectedSize] = useState('7');
  const [activeTab, setActiveTab] = useState('specifications');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    const localProds = JSON.parse(localStorage.getItem('aurelia_local_products') || '[]');
    const allProducts = [
      ...catalogueProducts,
      ...localProds,
      ...seedProducts.map((p, i) => ({ ...p, _id: `mem_prod_${i + 1}` }))
    ];

    const findMatch = (id) => {
      if (!id) return allProducts[0];
      const normalized = decodeURIComponent(id).toLowerCase().trim();
      return allProducts.find((p) => 
        (p.slug && p.slug.toLowerCase() === normalized) ||
        (p.sku && p.sku.toLowerCase() === normalized) ||
        (p._id && String(p._id).toLowerCase() === normalized) ||
        (p.name && p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === normalized)
      ) || allProducts.find(p => p.name && p.name.toLowerCase().includes(normalized)) || allProducts[0];
    };

    fetch(`/api/products/${identifier}`)
      .then((res) => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then((data) => {
        if (data && data.name) {
          setProduct(data);
          setSelectedImage(data.images && data.images[0] ? data.images[0] : '/assets/category_rings.jpg');
        } else {
          const match = findMatch(identifier);
          setProduct(match);
          setSelectedImage(match.images && match.images[0] ? match.images[0] : '/assets/category_rings.jpg');
        }
      })
      .catch(() => {
        const match = findMatch(identifier);
        setProduct(match);
        setSelectedImage(match.images && match.images[0] ? match.images[0] : '/assets/category_rings.jpg');
      });
  }, [identifier]);

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="font-serif text-xl text-charcoal">Loading luxury piece...</p>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const emiMonthly = Math.round((product.discountPrice || product.price) / 12);

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-warm-gray mb-8 space-x-2">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link to={`/jewellery?category=${encodeURIComponent(product.category || 'All')}`} className="hover:text-gold">{product.category}</Link>
          <span>/</span>
          <span className="text-charcoal font-medium">{product.name}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-ivory-paper border border-warm-border p-4 shadow-luxury image-zoom-container flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[450px] sm:h-[550px] object-cover rounded-sm"
              />
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {(product.images && product.images.length > 0 ? product.images : [selectedImage]).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 border flex-shrink-0 bg-ivory-paper ${
                    selectedImage === img ? 'border-gold ring-1 ring-gold' : 'border-warm-border opacity-70 hover:opacity-100'
                  } transition-all`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Specifications & Purchasing Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
                {product.category} • {product.collectionName || 'Diamond Essentials'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">{product.name}</h1>
              <p className="text-xs text-warm-gray mt-1">SKU: {product.sku}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold" />
                  ))}
                </div>
                <span className="text-xs text-charcoal font-semibold">{product.rating || 4.9}</span>
                <span className="text-xs text-warm-gray">({product.reviewsCount || 18} Reviews)</span>
              </div>
            </div>

            {/* Price & EMI Box */}
            <div className="p-4 bg-ivory-paper border border-warm-border space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-charcoal">
                  {formatINR(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-base text-warm-gray line-through">
                    {formatINR(product.price)}
                  </span>
                )}
                {product.discountPrice && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Save {formatINR(product.price - product.discountPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-muted">
                Or <strong>{formatINR(emiMonthly)}/month</strong> with 0% interest EMI options. Taxes included.
              </p>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed font-light">
              {product.description}
            </p>

            {/* Metal Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal block">
                Precious Metal: <span className="text-gold">{selectedMetal}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['18K Gold', 'Rose Gold', 'White Gold', 'Platinum'].map((metal) => (
                  <button
                    key={metal}
                    onClick={() => setSelectedMetal(metal)}
                    className={`text-xs px-4 py-2 border transition-colors ${
                      selectedMetal === metal
                        ? 'border-gold bg-gold-light text-charcoal font-semibold'
                        : 'border-warm-border text-charcoal hover:border-gold'
                    }`}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                  Ring Size: <span className="text-gold">{selectedSize}</span>
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-gold hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Size Guide
                </button>
              </div>
              <div className="flex gap-2">
                {(product.sizes || ['6', '7', '8', '9', '10']).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 border text-xs font-semibold flex items-center justify-center transition-colors ${
                      selectedSize === size
                        ? 'border-gold bg-gold text-white font-bold'
                        : 'border-warm-border text-charcoal hover:border-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4 border-t border-warm-border">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(product, 1, selectedSize, selectedMetal)}
                  className="flex-1 bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest py-4 hover:bg-[#B85517] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D96B27]/25"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Bag
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      addToCart(product, 1, selectedSize, selectedMetal);
                      navigate('/checkout');
                    }}
                    className="flex-1 sm:flex-none bg-transparent border border-[#D96B27] text-[#D96B27] text-xs font-semibold uppercase tracking-widest px-6 py-4 hover:bg-[#D96B27] hover:text-white transition-all text-center shadow-sm"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-4 border border-warm-border hover:border-[#D96B27] transition-colors flex items-center justify-center"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-charcoal'}`} />
                  </button>
                </div>
              </div>

              {/* Guarantees List */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-warm-border text-xs text-warm-gray">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>100% BIS Hallmarked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold" />
                  <span>IGI/GIA Diamond Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold" />
                  <span>Complimentary Insured Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-gold" />
                  <span>Lifetime Exchange Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Specs Tabs */}
        <div className="border border-warm-border bg-white p-6 sm:p-10 mb-16 shadow-luxury">
          <div className="flex border-b border-warm-border gap-8 mb-6 overflow-x-auto text-xs font-semibold uppercase tracking-widest">
            <button
              onClick={() => setActiveTab('specifications')}
              className={`pb-3 ${activeTab === 'specifications' ? 'border-b-2 border-gold text-charcoal' : 'text-warm-gray hover:text-charcoal'}`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`pb-3 ${activeTab === 'materials' ? 'border-b-2 border-gold text-charcoal' : 'text-warm-gray hover:text-charcoal'}`}
            >
              Materials & Purity
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 ${activeTab === 'shipping' ? 'border-b-2 border-gold text-charcoal' : 'text-warm-gray hover:text-charcoal'}`}
            >
              Insured Shipping & Returns
            </button>
          </div>

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="flex justify-between py-2 border-b border-warm-border">
                <span className="text-warm-gray">Karatage</span>
                <span className="font-semibold">{product.specifications?.karatage || '18K (750 Solid Gold)'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-warm-border">
                <span className="text-warm-gray">Diamond Clarity</span>
                <span className="font-semibold">{product.specifications?.diamondClarity || 'VVS1 - VVS2'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-warm-border">
                <span className="text-warm-gray">Diamond Color</span>
                <span className="font-semibold">{product.specifications?.diamondColor || 'E-F Colorless'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-warm-border">
                <span className="text-warm-gray">Certification</span>
                <span className="font-semibold">{product.specifications?.certification || 'IGI Certified & BIS Hallmarked'}</span>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <p className="text-xs text-charcoal-muted leading-relaxed font-light">
              Crafted in solid 18K Yellow Gold with conflict-free natural diamonds. Certified for purity by the Bureau of Indian Standards (BIS) and individually authenticated with a unique laser-engraved serial number.
            </p>
          )}

          {activeTab === 'shipping' && (
            <p className="text-xs text-charcoal-muted leading-relaxed font-light">
              Delivered in AURÉLIA velvet signature gift packaging. Fully insured shipment with tamper-evident security seal. 15-day complimentary exchange & hassle-free return policy.
            </p>
          )}
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
