import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { useShop, formatINR } from '../store/ShopContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-8 border-b border-warm-border pb-6">
          <span className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase block mb-1">
            SAVED HEIRLOOMS
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Your Wishlist ({wishlist.length})</h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-ivory-paper border border-warm-border space-y-4">
            <Heart className="w-12 h-12 text-warm-gray mx-auto stroke-1" />
            <p className="font-serif text-xl text-charcoal">Your wishlist is currently empty.</p>
            <Link
              to="/jewellery"
              className="inline-block bg-[#D96B27] text-white text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#B85517] transition-all shadow-md shadow-[#D96B27]/20"
            >
              Explore Fine Jewellery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white border border-warm-border p-4 flex flex-col justify-between shadow-sm">
                <div className="aspect-square bg-ivory-paper overflow-hidden mb-4">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-base text-charcoal">{product.name}</h3>
                  <span className="font-serif font-bold text-sm text-charcoal block">{formatINR(product.price)}</span>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="flex-1 bg-[#D96B27] text-white text-xs uppercase tracking-widest py-2.5 hover:bg-[#B85517] transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-2.5 border border-warm-border text-warm-gray hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
