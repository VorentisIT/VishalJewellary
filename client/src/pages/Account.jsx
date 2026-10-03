import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import Login from './Login';
import { useShop, formatINR } from '../store/ShopContext';

export default function Account() {
  const { user, logout, wishlist } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);

  const loadAccountOrders = () => {
    const localOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
    const seedOrders = [
      {
        _id: 'mem_order_1',
        orderNumber: 'AUR-984210',
        createdAt: new Date().toISOString(),
        totalAmount: 48900,
        orderStatus: 'crafting',
        items: [
          {
            name: 'Celeste Diamond Ring',
            price: 48900,
            quantity: 1,
            selectedMetal: '18K Gold',
            image: '/assets/category_rings.jpg'
          }
        ]
      }
    ];

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        const serverOrders = Array.isArray(data) ? data : [];
        const combined = [...localOrders, ...serverOrders, ...seedOrders];
        const unique = combined.filter((v, i, a) => a.findIndex((t) => t.orderNumber === v.orderNumber || t._id === v._id) === i);
        setOrders(unique);
      })
      .catch(() => {
        const combined = [...localOrders, ...seedOrders];
        const unique = combined.filter((v, i, a) => a.findIndex((t) => t.orderNumber === v.orderNumber || t._id === v._id) === i);
        setOrders(unique);
      });
  };

  useEffect(() => {
    if (user) {
      loadAccountOrders();

      const handleUpdate = () => {
        loadAccountOrders();
      };

      window.addEventListener('storage', handleUpdate);
      window.addEventListener('aurelia_order_status_updated', handleUpdate);

      return () => {
        window.removeEventListener('storage', handleUpdate);
        window.removeEventListener('aurelia_order_status_updated', handleUpdate);
      };
    }
  }, [user]);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#202522] font-sans flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Account Header Banner */}
        <div className="bg-white border border-[#DED8CC] p-6 sm:p-8 shadow-md mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#102C24] text-[#C49A5A] font-serif font-bold text-2xl rounded-full flex items-center justify-center">
              {user ? user.name.charAt(0) : 'A'}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#202522]">
                Welcome, {user.name}
              </h1>
              <p className="text-xs text-[#77736B]">{user.email} • Role: <strong className="text-[#C49A5A] uppercase">{user.role}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest px-4 py-2.5 hover:bg-[#B85517] transition-all shadow-sm"
              >
                Go to Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#77736B] hover:text-red-600 transition-colors border border-[#DED8CC] px-4 py-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Account Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs Navigation */}
          <div className="lg:col-span-3 space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 p-3 text-xs font-semibold uppercase tracking-widest text-left border transition-colors ${
                activeTab === 'orders' ? 'border-[#D96B27] bg-[#D96B27]/10 text-[#D96B27] font-bold' : 'border-[#DED8CC] text-[#77736B] hover:text-[#202522]'
              }`}
            >
              <Package className="w-4 h-4 text-[#D96B27]" /> Orders & Tracking
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center gap-3 p-3 text-xs font-semibold uppercase tracking-widest text-left border transition-colors ${
                activeTab === 'wishlist' ? 'border-[#D96B27] bg-[#D96B27]/10 text-[#D96B27] font-bold' : 'border-[#DED8CC] text-[#77736B] hover:text-[#202522]'
              }`}
            >
              <Heart className="w-4 h-4 text-[#D96B27]" /> Saved Wishlist ({wishlist.length})
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 p-3 text-xs font-semibold uppercase tracking-widest text-left border transition-colors ${
                activeTab === 'addresses' ? 'border-[#D96B27] bg-[#D96B27]/10 text-[#D96B27] font-bold' : 'border-[#DED8CC] text-[#77736B] hover:text-[#202522]'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#D96B27]" /> Saved Addresses
            </button>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-9">
            
            {activeTab === 'orders' && (
              <div className="bg-white border border-[#DED8CC] p-6 shadow-md space-y-6">
                <h3 className="font-serif font-bold text-xl text-[#202522] border-b border-[#DED8CC] pb-3">Your Order History</h3>

                {orders.length === 0 ? (
                  <p className="text-xs text-[#77736B] py-8 text-center">No orders placed yet.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="border border-[#DED8CC] p-4 bg-[#F8F5EE] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-b border-[#DED8CC] pb-3 gap-2">
                        <div>
                          <span className="font-bold text-[#202522]">Order #{order.orderNumber}</span>
                          <span className="text-[#77736B] ml-2">• {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-[#202522]">{formatINR(order.totalAmount)}</span>
                          <span className="bg-[#D96B27]/10 text-[#D96B27] font-bold px-2.5 py-0.5 rounded-full uppercase text-[10px] tracking-wider">
                            {order.orderStatus ? order.orderStatus.replace(/_/g, ' ') : 'Placed'}
                          </span>
                        </div>
                      </div>

                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center text-xs">
                          <img src={item.image || '/assets/category_rings.jpg'} alt={item.name} className="w-14 h-14 object-cover border" />
                          <div className="flex-1">
                            <h4 className="font-serif font-bold text-[#202522]">{item.name}</h4>
                            <p className="text-[#77736B]">{item.selectedMetal} • Qty {item.quantity}</p>
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 text-right">
                        <Link
                          to={`/order-tracking/${order.orderNumber || order._id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D96B27] hover:underline uppercase tracking-wider"
                        >
                          View Live 7-Step Timeline <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white border border-[#DED8CC] p-6 shadow-md">
                <h3 className="font-serif font-bold text-xl text-[#202522] border-b border-[#DED8CC] pb-3 mb-6">Your Saved Wishlist</h3>
                {wishlist.length === 0 ? (
                  <p className="text-xs text-[#77736B] py-8 text-center">Your wishlist is currently empty.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((product) => (
                      <div key={product._id} className="border p-3 flex gap-3 items-center">
                        <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover border" />
                        <div className="flex-1">
                          <h4 className="font-serif font-bold text-sm text-[#202522]">{product.name}</h4>
                          <span className="font-serif font-bold text-xs text-[#202522] block">{formatINR(product.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white border border-[#DED8CC] p-6 shadow-md space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#202522] border-b border-[#DED8CC] pb-3">Default Address</h3>
                <div className="border border-[#C49A5A] bg-[#EFE7D8] p-4 text-xs space-y-1">
                  <p className="font-bold text-[#202522]">{user.name} (Default)</p>
                  <p className="text-[#77736B]">45 Lotus Boulevard, Worli</p>
                  <p className="text-[#77736B]">Mumbai, Maharashtra - 400018</p>
                  <p className="text-[#77736B]">Phone: +91 99887 76655</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
