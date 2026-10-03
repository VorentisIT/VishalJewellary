import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, Heart, Eye, ShoppingBag, X } from 'lucide-react';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import QuickViewModal from '../components/common/QuickViewModal';
import CartDrawer from '../components/cart/CartDrawer';
import { useShop, formatINR } from '../store/ShopContext';
import { catalogueProducts } from '../data/catalogueData';
import { seedProducts } from '../../../server/seed/seedData.js';

export default function PLP() {
  const { categoryParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useShop();

  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Present Filter States
  const queryCategory = searchParams.get('category');
  const collectionParam = searchParams.get('collection');
  const currentCategory = categoryParam || queryCategory;
  const activeCategory = currentCategory ? currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1) : '';
  const selectedMetal = searchParams.get('metal') || '';
  const selectedStone = searchParams.get('stone') || '';
  const sortOption = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const categories = ['Bridal', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Solitaires', "Men's"];
  const metals = ['18K Gold', '22K Gold', 'Rose Gold', 'White Gold', 'Platinum'];
  const stones = ['Solitaire Diamond', 'Natural Diamond', 'Polki', 'Emerald', 'Sapphire'];

  useEffect(() => {
    let url = '/api/products?';
    if (activeCategory) url += `category=${encodeURIComponent(activeCategory)}&`;
    if (selectedMetal) url += `metal=${encodeURIComponent(selectedMetal)}&`;
    if (selectedStone) url += `stone=${encodeURIComponent(selectedStone)}&`;
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (minPrice) url += `minPrice=${minPrice}&`;
    if (maxPrice) url += `maxPrice=${maxPrice}&`;
    if (sortOption) url += `sort=${sortOption}&`;

    const localProds = JSON.parse(localStorage.getItem('aurelia_local_products') || '[]');
    const allFallback = [
      ...catalogueProducts,
      ...localProds,
      ...seedProducts.map((p, i) => ({ ...p, _id: `mem_prod_${i + 1}` }))
    ];
    const uniqueBase = allFallback.filter((v, i, a) => a.findIndex(t => (t.sku === v.sku || t._id === v._id)) === i);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let pool = (Array.isArray(data) && data.length > 0) ? [...data, ...catalogueProducts] : uniqueBase;
        filterAndSet(pool);
      })
      .catch(() => {
        filterAndSet(uniqueBase);
      });
  }, [activeCategory, collectionParam, selectedMetal, selectedStone, searchQuery, minPrice, maxPrice, sortOption]);

  const filterAndSet = (items) => {
    let filtered = [...items];
    if (activeCategory) {
      const catNorm = activeCategory.toLowerCase().replace(/[^a-z]/g, '');
      filtered = filtered.filter(p => {
        if (!p.category) return false;
        const pNorm = p.category.toLowerCase().replace(/[^a-z]/g, '');
        return pNorm === catNorm || p.category.toLowerCase() === activeCategory.toLowerCase();
      });
    }
    if (collectionParam) {
      if (collectionParam.toLowerCase().includes('bridal')) {
        filtered = filtered.filter(p => 
          (p.category && p.category.toLowerCase() === 'bridal') ||
          p.name.toLowerCase().includes('bridal') ||
          p.description?.toLowerCase().includes('bridal')
        );
      } else {
        filtered = filtered.filter(p => 
          p.collection?.toLowerCase() === collectionParam.toLowerCase() ||
          p.name.toLowerCase().includes(collectionParam.toLowerCase())
        );
      }
    }
    if (selectedMetal) {
      filtered = filtered.filter(p => p.metal && (p.metal === selectedMetal || p.metal.includes(selectedMetal)));
    }
    if (selectedStone) {
      filtered = filtered.filter(p => p.stone && (p.stone === selectedStone || p.stone.toLowerCase().includes(selectedStone.toLowerCase())));
    }
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (minPrice) {
      filtered = filtered.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
    }

    if (sortOption === 'price-low') {
      filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortOption === 'price-high') {
      filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortOption === 'rating') {
      filtered.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    }

    setProducts(filtered);
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Header Breadcrumbs & Title */}
        <div className="mb-6 pb-6 border-b border-warm-border">
          <nav className="text-xs text-warm-gray mb-2 space-x-2">
            <Link to="/" className="hover:text-[#D96B27] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-charcoal font-medium">{collectionParam || activeCategory || 'All Jewellery'}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              {collectionParam ? collectionParam : activeCategory ? `${activeCategory} Collection` : 'Fine Jewellery Catalogue'}
            </h1>
            <p className="text-xs text-charcoal-muted">
              Showing {products.length} certified pieces
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap justify-between items-center bg-ivory-paper border border-warm-border p-4 mb-8 gap-4">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-charcoal hover:text-[#D96B27] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D96B27]" /> 
            <span>Filter & Refine</span>
          </button>

          {/* Metal Filter Pills */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] font-semibold text-warm-gray uppercase tracking-wider">Metal:</span>
            {['', ...metals].map((metal) => (
              <button
                key={metal}
                onClick={() => updateFilter('metal', metal)}
                className={`text-xs px-3 py-1 border transition-colors ${
                  (selectedMetal === metal || (!selectedMetal && !metal))
                    ? 'border-[#D96B27] bg-[#D96B27] text-white font-semibold shadow-sm'
                    : 'bg-white border-warm-border text-charcoal hover:border-[#D96B27]'
                }`}
              >
                {metal || 'All Metals'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-white border border-warm-border text-xs text-charcoal py-1.5 px-3 focus:outline-none font-serif cursor-pointer shadow-sm"
            >
              <option value="newest">Sort By: New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Grid / List Switcher */}
            <div className="hidden sm:flex border border-warm-border bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[#D96B27] text-white' : 'text-charcoal'}`}
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[#D96B27] text-white' : 'text-charcoal'}`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Catalog Display */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-ivory-paper border border-warm-border space-y-4">
            <p className="font-serif text-xl text-charcoal">No jewellery pieces match your selected filters.</p>
            <button
              onClick={clearAllFilters}
              className="bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-[#B85517] transition-colors shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const inWishlist = isInWishlist(product._id);
              return (
                <div
                  key={product._id}
                  className="group bg-white border border-warm-border p-4 flex flex-col justify-between hover:shadow-luxury hover:border-[#D96B27]/40 transition-all duration-300 relative"
                >
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-charcoal hover:text-[#D96B27] transition-colors shadow-sm"
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'text-red-500 fill-red-500' : ''}`} />
                  </button>

                  <div className="aspect-square bg-ivory-paper overflow-hidden relative mb-4 flex items-center justify-center">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : '/assets/category_rings.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-charcoal/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="flex-1 bg-ivory text-charcoal text-[10px] font-semibold uppercase tracking-widest py-2 hover:bg-[#D96B27] hover:text-white transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Quick View
                      </button>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="bg-[#D96B27] text-white p-2 hover:bg-[#B85517] transition-colors"
                        title="Add to bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link to={`/product/${product.slug || product._id}`}>
                      <h3 className="font-serif font-bold text-base text-charcoal group-hover:text-[#D96B27] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-warm-gray">
                      {product.metal} • {product.stone || 'Fine Diamond'}
                    </p>
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="font-serif font-bold text-sm text-charcoal">
                        {formatINR(product.discountPrice || product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-warm-gray line-through">
                          {formatINR(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-warm-border p-4 flex flex-col sm:flex-row items-center gap-6 hover:shadow-luxury hover:border-[#D96B27]/40 transition-all"
              >
                <img
                  src={product.images && product.images[0] ? product.images[0] : '/assets/category_rings.jpg'}
                  alt={product.name}
                  className="w-32 h-32 object-cover bg-ivory-paper border border-warm-border flex-shrink-0"
                />
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h3 className="font-serif font-bold text-xl text-charcoal">{product.name}</h3>
                  <p className="text-xs text-warm-gray">{product.description}</p>
                  <span className="text-xs text-[#D96B27] font-semibold uppercase tracking-widest block">
                    {product.metal} • {product.stone || 'Fine Diamond'} • BIS Hallmarked
                  </span>
                </div>
                <div className="text-center sm:text-right space-y-3 flex-shrink-0">
                  <span className="font-serif font-bold text-xl text-charcoal block">
                    {formatINR(product.discountPrice || product.price)}
                  </span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="bg-[#D96B27] text-white text-xs uppercase tracking-widest px-6 py-2.5 hover:bg-[#B85517] transition-colors font-semibold shadow-sm"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Filter Sidebar Drawer with Present Filters */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex justify-start animate-fadeIn">
          <div className="bg-ivory w-full max-w-xs h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-warm-border mb-6">
                <h3 className="font-serif font-bold text-lg text-charcoal uppercase tracking-wider">Refine Selection</h3>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-1 hover:text-[#D96B27] transition-colors">
                  <X className="w-5 h-5 text-charcoal" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D96B27] mb-2">Category</h4>
                {['', ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', activeCategory === cat ? '' : cat)}
                    className={`block w-full text-left text-xs py-1.5 px-2 transition-colors ${
                      (activeCategory === cat || (!activeCategory && !cat)) 
                        ? 'bg-[#D96B27] text-white font-semibold' 
                        : 'text-charcoal hover:text-[#D96B27]'
                    }`}
                  >
                    {cat || 'All Categories'}
                  </button>
                ))}
              </div>

              {/* Metal Filter */}
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D96B27] mb-2">Metal</h4>
                {['', ...metals].map((metal) => (
                  <button
                    key={metal}
                    onClick={() => updateFilter('metal', selectedMetal === metal ? '' : metal)}
                    className={`block w-full text-left text-xs py-1.5 px-2 transition-colors ${
                      (selectedMetal === metal || (!selectedMetal && !metal)) 
                        ? 'bg-[#D96B27] text-white font-semibold' 
                        : 'text-charcoal hover:text-[#D96B27]'
                    }`}
                  >
                    {metal || 'All Metals'}
                  </button>
                ))}
              </div>

              {/* Gemstone Filter */}
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D96B27] mb-2">Gemstone</h4>
                {['', ...stones].map((stone) => (
                  <button
                    key={stone}
                    onClick={() => updateFilter('stone', selectedStone === stone ? '' : stone)}
                    className={`block w-full text-left text-xs py-1.5 px-2 transition-colors ${
                      (selectedStone === stone || (!selectedStone && !stone)) 
                        ? 'bg-[#D96B27] text-white font-semibold' 
                        : 'text-charcoal hover:text-[#D96B27]'
                    }`}
                  >
                    {stone || 'All Gemstones'}
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D96B27]">Budget Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-1/2 p-2 bg-white border border-warm-border text-xs focus:outline-none focus:border-[#D96B27]"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-1/2 p-2 bg-white border border-warm-border text-xs focus:outline-none focus:border-[#D96B27]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-warm-border">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full bg-[#D96B27] text-white text-xs uppercase tracking-widest py-3 font-semibold hover:bg-[#B85517] transition-colors shadow-sm"
              >
                View {products.length} Pieces
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsFilterDrawerOpen(false);
                }}
                className="w-full bg-warm-border text-charcoal text-xs uppercase tracking-widest py-2.5 font-semibold hover:bg-charcoal hover:text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <QuickViewModal />
      <CartDrawer />
    </div>
  );
}
