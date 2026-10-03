import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Truck,
  Award,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Mail,
  Phone,
  CreditCard,
  Gem,
  Eye
} from 'lucide-react';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import Login from './Login';
import { useShop, formatINR } from '../store/ShopContext';

export default function Account() {
  const { user, logout, wishlist, addToCart } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 'addr_1',
      tag: 'Home (Primary)',
      name: user?.name || 'Valued Collector',
      street: '45 Lotus Boulevard, Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400018',
      phone: '+91 99887 76655',
      isDefault: true
    },
    {
      id: 'addr_2',
      tag: 'Office',
      name: user?.name || 'Valued Collector',
      street: 'Tower 4, Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400051',
      phone: '+91 99887 76655',
      isDefault: false
    }
  ]);

  const loadAccountOrders = () => {
    const localOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
    const adminOrders = JSON.parse(localStorage.getItem('vishal_admin_orders') || '[]');
    const seedOrders = [
      {
        _id: 'mem_order_1',
        orderNumber: 'AUR-984210',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        totalAmount: 48900,
        orderStatus: 'crafting',
        estimatedDelivery: '3 - 5 Business Days',
        items: [
          {
            name: 'Celeste Diamond Solitaire Ring',
            price: 48900,
            quantity: 1,
            selectedMetal: '18K Rose Gold',
            selectedSize: '7',
            image: '/assets/category_rings.jpg'
          }
        ]
      },
      {
        _id: 'mem_order_2',
        orderNumber: 'AUR-871239',
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
        totalAmount: 115000,
        orderStatus: 'delivered',
        estimatedDelivery: 'Delivered',
        items: [
          {
            name: 'Royal Heritage Emerald Choker',
            price: 115000,
            quantity: 1,
            selectedMetal: '22K Yellow Gold',
            selectedSize: 'Standard',
            image: '/assets/category_necklaces.jpg'
          }
        ]
      }
    ];

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        const serverOrders = Array.isArray(data) ? data : [];
        const combined = [...localOrders, ...adminOrders, ...serverOrders, ...seedOrders];
        const unique = combined.filter((v, i, a) => a.findIndex((t) => (t.orderNumber && t.orderNumber === v.orderNumber) || (t._id && t._id === v._id)) === i);
        setOrders(unique);
      })
      .catch(() => {
        const combined = [...localOrders, ...adminOrders, ...seedOrders];
        const unique = combined.filter((v, i, a) => a.findIndex((t) => (t.orderNumber && t.orderNumber === v.orderNumber) || (t._id && t._id === v._id)) === i);
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

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Delivered
          </span>
        );
      case 'shipped':
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            Out for Delivery
          </span>
        );
      case 'crafting':
      case 'quality_check':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            In Atelier & Setting
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            Order Confirmed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans flex flex-col justify-between selection:bg-[#D96B27]/20 selection:text-[#D96B27]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* LUXURY WELCOME BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-[#1C1814] to-stone-900 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-stone-800 mb-8">
          {/* Subtle Ambient Glows */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#D96B27]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Identity */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#D96B27] via-amber-500 to-[#9E4514] p-0.5 shadow-lg">
                  <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold text-amber-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'V'}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#137333] border-2 border-stone-900 flex items-center justify-center text-[10px] text-white">
                  ✓
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    <Sparkles className="w-3 h-3" /> Privilege Collector
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1 flex items-center gap-2 flex-wrap">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span className="text-stone-300">Client ID: #{user.userId || user._id || 'AUR-001'}</span>
                </p>
              </div>
            </div>

            {/* Quick KPI Stats & Actions */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2.5 text-center min-w-[85px]">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Orders</span>
                <span className="text-lg font-bold text-white font-serif">{orders.length}</span>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2.5 text-center min-w-[85px]">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Wishlist</span>
                <span className="text-lg font-bold text-amber-300 font-serif">{wishlist.length}</span>
              </div>

              <div className="flex items-center gap-2 pl-2">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="h-10 px-4 bg-gradient-to-r from-[#D96B27] to-[#B85517] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Admin Panel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="h-10 px-4 bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION TABS & CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Navigation Sidebar Cards */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-2 shadow-xs space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#D96B27] to-[#C05619] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Orders & Delivery</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-gradient-to-r from-[#D96B27] to-[#C05619] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <span>Saved Heirlooms</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {wishlist.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-gradient-to-r from-[#D96B27] to-[#C05619] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {savedAddresses.length}
                </span>
              </button>
            </div>

            {/* BIS Hallmark Trust Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/80 rounded-2xl p-4.5 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#D96B27]" />
                <span>100% Certified Assurance</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                All jewellery pieces delivered are BIS Hallmark certified with laser engraved purity seals and insured courier transit.
              </p>
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB 1: ORDERS & TRACKING */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-stone-900">Your Orders & History</h2>
                    <p className="text-xs text-stone-500">Track current crafting stages, insured shipments, and receipts.</p>
                  </div>
                  <Link
                    to="/catalogue"
                    className="text-xs font-bold text-[#D96B27] hover:underline flex items-center gap-1"
                  >
                    <span>Browse Collection</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-800">No Orders Yet</h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      You haven't ordered any heirlooms yet. Explore our handcrafted gold and solitaire diamond collections.
                    </p>
                    <Link
                      to="/catalogue"
                      className="inline-flex items-center gap-2 bg-[#D96B27] hover:bg-[#B85517] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      <span>Explore Catalogue</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order._id || order.orderNumber}
                      className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-300 p-5 sm:p-6 space-y-5"
                    >
                      {/* Order Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-stone-900">
                              Order #{order.orderNumber || order._id}
                            </span>
                            {getStatusBadge(order.orderStatus)}
                          </div>
                          <p className="text-xs text-stone-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 sm:text-right">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Amount</span>
                            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                              {formatINR(order.totalAmount || 48900)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="divide-y divide-stone-100">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={item.image || '/assets/category_rings.jpg'}
                                alt={item.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-stone-200 shrink-0 shadow-2xs"
                              />
                              <div>
                                <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-stone-500 mt-0.5">
                                  {item.selectedMetal || '18K Gold'} • Size: {item.selectedSize || 'Standard'} • Qty: {item.quantity || 1}
                                </p>
                                <span className="text-xs font-serif font-bold text-[#D96B27] mt-1 block">
                                  {formatINR(item.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Live Tracking Link */}
                      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-stone-500">
                          <Truck className="w-4 h-4 text-[#D96B27]" />
                          <span>Estimated Delivery: <strong className="text-stone-800">{order.estimatedDelivery || '3 - 5 Business Days'}</strong></span>
                        </div>

                        <Link
                          to={`/order-tracking/${order.orderNumber || order._id}`}
                          className="inline-flex items-center justify-center gap-2 bg-[#D96B27]/10 hover:bg-[#D96B27] text-[#D96B27] hover:text-white font-bold px-4 py-2 rounded-xl transition-all duration-200 border border-[#D96B27]/30"
                        >
                          <span>Live 7-Stage Tracker & Certificate</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: SAVED WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900">Saved Wishlist & Heirlooms</h2>
                  <p className="text-xs text-stone-500">Curate and save your preferred solitaire diamonds and fine jewellery pieces.</p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-800">Your Wishlist is Empty</h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Click the heart icon on any design while browsing to keep it saved in your private heirloom vault.
                    </p>
                    <Link
                      to="/catalogue"
                      className="inline-flex items-center gap-2 bg-[#D96B27] hover:bg-[#B85517] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all"
                    >
                      <span>Explore Catalogue</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((product) => (
                      <div
                        key={product._id}
                        className="rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                      >
                        <div className="relative aspect-square overflow-hidden bg-stone-100">
                          <img
                            src={product.images?.[0] || '/assets/category_rings.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                              {product.category || 'Fine Jewellery'}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-stone-900 mt-1.5 line-clamp-1">
                              {product.name}
                            </h4>
                            <span className="font-serif font-bold text-base text-stone-900 block mt-1">
                              {formatINR(product.price)}
                            </span>
                          </div>

                          <div className="pt-2 flex gap-2">
                            <button
                              onClick={() => addToCart && addToCart(product, 1, 'Standard', product.metal || '18K Gold')}
                              className="flex-1 bg-[#D96B27] hover:bg-[#B85517] text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </button>
                            <Link
                              to={`/product/${product.slug || product._id}`}
                              className="px-3 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 text-xs font-semibold flex items-center justify-center"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-stone-900">Saved Delivery Addresses</h2>
                    <p className="text-xs text-stone-500">Manage insured delivery destinations for your orders.</p>
                  </div>
                  <button
                    onClick={() => alert('Add new address modal opened')}
                    className="h-9 px-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
                        addr.isDefault
                          ? 'border-[#D96B27] bg-gradient-to-br from-[#FFFDFC] to-[#FFF7ED] shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{addr.tag}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-[#D96B27] bg-[#D96B27]/10 px-2.5 py-0.5 rounded-full border border-[#D96B27]/20">
                            Default Address
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-600 space-y-1">
                        <p className="font-bold text-stone-900">{addr.name}</p>
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                        <p className="flex items-center gap-1 text-stone-500 pt-1">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{addr.phone}</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <button className="text-[#D96B27] font-bold hover:underline cursor-pointer">Edit</button>
                        {!addr.isDefault && (
                          <button
                            onClick={() => {
                              setSavedAddresses((prev) =>
                                prev.map((a) => ({ ...a, isDefault: a.id === addr.id }))
                              );
                            }}
                            className="text-stone-500 hover:text-stone-800 cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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
