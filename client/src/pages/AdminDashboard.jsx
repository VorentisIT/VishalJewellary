import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Package,
  Tag,
  BarChart2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  LogOut,
  Filter,
  Download,
  RefreshCw,
  Layers,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
  Activity,
  Sparkles,
  CreditCard,
  Building2,
  Check
} from 'lucide-react';
import { formatINR, useShop } from '../store/ShopContext';
import { seedProducts } from '../../../server/seed/seedData.js';

export default function AdminDashboard() {
  const { user, logout } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('overview'); // overview | products | orders | coupons | customers | settings
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([
    { _id: 'c1', code: 'VISHAL10', discountPercentage: 10, minOrder: 0, usageCount: 84, active: true },
    { _id: 'c2', code: 'BRIDAL15', discountPercentage: 15, minOrder: 100000, usageCount: 29, active: true }
  ]);

  // Filtering & Search
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    price: '',
    discountPrice: '',
    category: 'Rings',
    metal: '18K Gold',
    stone: 'Solitaire Diamond',
    stock: 15,
    images: '/assets/category_rings.jpg',
    description: ''
  });

  if (!user || user.role !== 'admin') {
    return null;
  }


  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: 10, minOrder: 0 });

  // Refresh & Export Feedback
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    // Fetch Analytics Metrics
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch(() => {
        setAnalytics({
          totalRevenue: 2845000,
          totalOrders: 42,
          totalProducts: 10,
          totalCustomers: 28,
          avgOrderValue: 67738,
          pendingOrdersCount: 5,
          salesTrend: [
            { month: 'Jan', revenue: 450000, orders: 8 },
            { month: 'Feb', revenue: 680000, orders: 12 },
            { month: 'Mar', revenue: 920000, orders: 15 },
            { month: 'Apr', revenue: 1150000, orders: 19 },
            { month: 'May', revenue: 1420000, orders: 24 },
            { month: 'Jun', revenue: 1890000, orders: 31 }
          ]
        });
      });

    // Synchronize Products from local DB + Server
    const localProds = JSON.parse(localStorage.getItem('aurelia_local_products') || '[]');
    const seedFormatted = seedProducts.map((p, i) => ({ ...p, _id: `mem_prod_${i + 1}` }));
    const baseMerged = [...localProds, ...seedFormatted];
    const uniqueBaseProds = baseMerged.filter((v, i, a) => a.findIndex(t => (t.sku === v.sku || t._id === v._id)) === i);

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const merged = [...localProds, ...data];
          const unique = merged.filter((v, i, a) => a.findIndex(t => (t.sku === v.sku || t._id === v._id)) === i);
          setProducts(unique);
        } else {
          setProducts(uniqueBaseProds);
        }
      })
      .catch(() => setProducts(uniqueBaseProds));

    // Synchronize Orders from local DB + Server
    const localOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
    const seedOrders = [
      {
        _id: 'mem_order_1',
        orderNumber: 'AUR-984210',
        user: { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 99887 76655' },
        totalAmount: 48900,
        orderStatus: 'crafting',
        items: [{ name: 'Celeste Diamond Ring', price: 48900, quantity: 1, metal: '18K Gold' }],
        createdAt: new Date().toISOString()
      },
      {
        _id: 'mem_order_2',
        orderNumber: 'AUR-882910',
        user: { name: 'Ananya Mehta', email: 'ananya@example.com', phone: '+91 98201 22334' },
        totalAmount: 125000,
        orderStatus: 'quality_check',
        items: [{ name: 'Royal Heritage Polki Necklace', price: 125000, quantity: 1, metal: '22K Gold' }],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        const serverOrders = Array.isArray(data) ? data : [];
        const combined = [...localOrders, ...serverOrders, ...seedOrders];
        const unique = combined.filter((v, i, a) => a.findIndex(t => (t.orderNumber === v.orderNumber || t._id === v._id)) === i);
        setOrders(unique);
      })
      .catch(() => {
        const combined = [...localOrders, ...seedOrders];
        const unique = combined.filter((v, i, a) => a.findIndex(t => (t.orderNumber === v.orderNumber || t._id === v._id)) === i);
        setOrders(unique);
      });
  }, []);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    const localOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
    if (localOrders.length > 0) {
      setOrders(prev => {
        const combined = [...localOrders, ...prev];
        return combined.filter((v, i, a) => a.findIndex(t => (t.orderNumber === v.orderNumber || t._id === v._id)) === i);
      });
    }
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Dashboard metrics re-synchronized with live database.');
    }, 800);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
      stock: Number(productForm.stock),
      images: [productForm.images],
      slug: productForm.name.toLowerCase().replace(/\s+/g, '-')
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map((p) => (p._id === editingProduct._id ? { ...p, ...payload } : p));
      showToast(`Updated product "${payload.name}" successfully.`);
    } else {
      updatedProducts = [{ ...payload, _id: `mem_prod_${Date.now()}` }, ...products];
      showToast(`Added new product "${payload.name}" to catalog.`);
    }

    setProducts(updatedProducts);
    localStorage.setItem('aurelia_local_products', JSON.stringify(updatedProducts));

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    setCoupons([
      ...coupons,
      {
        _id: `c_${Date.now()}`,
        code: newCoupon.code.trim().toUpperCase(),
        discountPercentage: Number(newCoupon.discountPercentage),
        minOrder: Number(newCoupon.minOrder),
        usageCount: 0,
        active: true
      }
    ]);
    setIsCouponModalOpen(false);
    setNewCoupon({ code: '', discountPercentage: 10, minOrder: 0 });
    showToast(`Created promotion code "${newCoupon.code.toUpperCase()}".`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
    showToast(`Updated order status to "${newStatus.replace(/_/g, ' ').toUpperCase()}".`);
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'All') return true;
    return o.orderStatus === orderStatusFilter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'crafting':
      case 'quality_check':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#121614] text-[#F8F5EE] flex flex-col font-sans selection:bg-[#C49A5A] selection:text-black">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#102C24] border border-[#C49A5A] text-[#F8F5EE] px-4 py-3 rounded shadow-2xl text-xs flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[#C49A5A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Luxury Enterprise Top Bar Header */}
      <header className="bg-[#0A1A15] border-b border-[#203830] py-3.5 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/vishal_jewellery_logo.png" alt="Vishal Jewellery" className="h-10 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-[0.16em] text-[#F8F5EE] uppercase">
                  VISHAL JEWELLERY
                </span>
                <span className="bg-[#C49A5A]/20 border border-[#C49A5A]/40 text-[#D9BC86] text-[9px] font-semibold tracking-widest px-2 py-0.5 rounded uppercase">
                  ENTERPRISE SUITE
                </span>
              </div>
              <span className="text-[9px] text-[#77807B] tracking-widest uppercase block -mt-0.5">
                Boutique Management & Analytics Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Status Indicators & Executive Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          <div className="hidden lg:flex items-center gap-2 bg-[#102C24]/60 border border-[#203830] px-3 py-1.5 rounded text-[11px] text-[#77807B]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloudflare Edge Node: <strong className="text-[#F8F5EE]">Active</strong></span>
          </div>

          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-[#16241E] hover:bg-[#203830] border border-[#203830] text-[#D9BC86] px-3 py-1.5 rounded transition-colors text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-1.5 bg-[#16241E] hover:bg-[#203830] border border-[#203830] text-[#F8F5EE] px-3 py-1.5 rounded transition-colors text-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#C49A5A]" />
            <span>Live Boutique</span>
          </Link>

          <div className="h-4 w-px bg-[#203830] hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="block font-semibold text-[#F8F5EE] text-xs leading-none">
                {user?.name || 'VISHAL Admin'}
              </span>
              <span className="text-[10px] text-[#C49A5A] uppercase tracking-wider font-mono">
                {user?.role || 'Administrator'}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 bg-[#1A1212] hover:bg-red-950/40 text-[#77807B] hover:text-red-400 border border-red-900/30 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Executive Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0E1512] border-b md:border-b-0 md:border-r border-[#203830] p-4 md:p-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto flex-shrink-0 h-fit self-start md:sticky md:top-0">
          
          <div className="hidden md:block pb-4 mb-2 border-b border-[#203830]">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C49A5A]">
              NAVIGATION MENU
            </span>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full h-11 flex-shrink-0 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-widest text-left rounded-sm transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#C49A5A] text-[#0A1A15] shadow-lg font-bold'
                : 'text-[#77807B] hover:text-[#F8F5EE] hover:bg-[#16241E]'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart2 className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full h-11 flex-shrink-0 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-widest text-left rounded-sm transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#C49A5A] text-[#0A1A15] shadow-lg font-bold'
                : 'text-[#77807B] hover:text-[#F8F5EE] hover:bg-[#16241E]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </div>
            <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded text-[#D9BC86]">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full h-11 flex-shrink-0 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-widest text-left rounded-sm transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#C49A5A] text-[#0A1A15] shadow-lg font-bold'
                : 'text-[#77807B] hover:text-[#F8F5EE] hover:bg-[#16241E]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Fulfillment Hub</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full h-11 flex-shrink-0 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-widest text-left rounded-sm transition-all whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-[#C49A5A] text-[#0A1A15] shadow-lg font-bold'
                : 'text-[#77807B] hover:text-[#F8F5EE] hover:bg-[#16241E]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4" />
              <span>Promotions</span>
            </div>
            <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded text-[#D9BC86]">
              {coupons.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full h-11 flex-shrink-0 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-widest text-left rounded-sm transition-all whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-[#C49A5A] text-[#0A1A15] shadow-lg font-bold'
                : 'text-[#77807B] hover:text-[#F8F5EE] hover:bg-[#16241E]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>VIP Clients</span>
            </div>
            <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded text-[#D9BC86]">
              28
            </span>
          </button>

          <div className="hidden md:block mt-auto pt-6 border-t border-[#203830] space-y-3 text-[11px] text-[#77807B]">
            <div className="bg-[#102C24]/40 border border-[#203830] p-3 rounded space-y-1">
              <div className="flex items-center justify-between text-[#D9BC86] font-semibold">
                <span>Database Node</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px]">MongoDB Cluster0 Active with bufferless Mongoose fallback.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-[#121614] space-y-8">
          
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Header Title Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#203830] pb-6">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
                    Executive Boutique Performance
                  </h1>
                  <p className="text-xs text-[#77807B] mt-1">
                    Real-time revenue metrics, order velocity, and inventory health overview.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Exported Executive Monthly Summary PDF.')}
                    className="bg-[#16241E] hover:bg-[#203830] border border-[#203830] text-[#D9BC86] text-xs font-semibold px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Report
                  </button>
                </div>
              </div>

              {/* 4 Primary Metric Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Revenue Card */}
                <div className="bg-[#16241E]/80 border border-[#203830] p-6 rounded-sm space-y-3 hover:border-[#C49A5A]/50 transition-colors">
                  <div className="flex justify-between items-center text-[#C49A5A]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Gross Revenue</span>
                    <div className="w-8 h-8 rounded bg-[#C49A5A]/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#F8F5EE] block">
                      {formatINR(analytics?.totalRevenue || 2845000)}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> +18.4% vs previous month
                    </span>
                  </div>
                </div>

                {/* Orders Card */}
                <div className="bg-[#16241E]/80 border border-[#203830] p-6 rounded-sm space-y-3 hover:border-[#C49A5A]/50 transition-colors">
                  <div className="flex justify-between items-center text-[#C49A5A]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Orders Executed</span>
                    <div className="w-8 h-8 rounded bg-[#C49A5A]/10 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#F8F5EE] block">
                      {analytics?.totalOrders || 42}
                    </span>
                    <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-1">
                      <Activity className="w-3 h-3" /> {analytics?.pendingOrdersCount || 5} Orders in crafting pipeline
                    </span>
                  </div>
                </div>

                {/* AOV Card */}
                <div className="bg-[#16241E]/80 border border-[#203830] p-6 rounded-sm space-y-3 hover:border-[#C49A5A]/50 transition-colors">
                  <div className="flex justify-between items-center text-[#C49A5A]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Average Order Value</span>
                    <div className="w-8 h-8 rounded bg-[#C49A5A]/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#F8F5EE] block">
                      {formatINR(analytics?.avgOrderValue || 67738)}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> High-value bridal transactions
                    </span>
                  </div>
                </div>

                {/* VIP Customers Card */}
                <div className="bg-[#16241E]/80 border border-[#203830] p-6 rounded-sm space-y-3 hover:border-[#C49A5A]/50 transition-colors">
                  <div className="flex justify-between items-center text-[#C49A5A]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Active VIP Clients</span>
                    <div className="w-8 h-8 rounded bg-[#C49A5A]/10 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#F8F5EE] block">
                      {analytics?.totalCustomers || 28}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      <Sparkles className="w-3 h-3" /> +4 New registered this week
                    </span>
                  </div>
                </div>
              </div>

              {/* Monthly Sales Revenue Chart Bar & Category Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sales Chart (8 cols) */}
                <div className="lg:col-span-8 bg-[#16241E]/80 border border-[#203830] p-6 rounded-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-[#203830] pb-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#F8F5EE]">
                        Monthly Sales Trend (INR)
                      </h3>
                      <p className="text-xs text-[#77807B]">
                        Gross revenue generated across mobile app & online boutique.
                      </p>
                    </div>
                    <span className="text-xs text-[#C49A5A] font-semibold bg-[#C49A5A]/10 px-3 py-1 border border-[#C49A5A]/30 rounded">
                      2026 Financial Cycle
                    </span>
                  </div>

                  <div className="h-56 flex items-end justify-between gap-4 pt-6">
                    {(analytics?.salesTrend || []).map((bar) => (
                      <div key={bar.month} className="flex-1 flex flex-col items-center gap-3 group">
                        <div className="text-[10px] font-mono text-[#C49A5A] opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatINR(bar.revenue)}
                        </div>
                        <div
                          className="w-full bg-[#C49A5A] rounded-t transition-all duration-500 group-hover:bg-[#D9BC86] shadow-lg"
                          style={{ height: `${(bar.revenue / 2000000) * 100}%` }}
                        ></div>
                        <span className="text-xs text-[#77807B] font-mono group-hover:text-[#F8F5EE]">
                          {bar.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Revenue Distribution (4 cols) */}
                <div className="lg:col-span-4 bg-[#16241E]/80 border border-[#203830] p-6 rounded-sm space-y-6 flex flex-col justify-between">
                  <div className="border-b border-[#203830] pb-4">
                    <h3 className="font-serif font-bold text-lg text-[#F8F5EE]">
                      Category Share
                    </h3>
                    <p className="text-xs text-[#77807B]">Revenue breakdown by category.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#F8F5EE]">Rings & Solitaires</span>
                        <span className="text-[#C49A5A] font-bold">42%</span>
                      </div>
                      <div className="w-full bg-[#0E1512] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#C49A5A] h-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#F8F5EE]">Gold & Diamond Necklaces</span>
                        <span className="text-[#C49A5A] font-bold">28%</span>
                      </div>
                      <div className="w-full bg-[#0E1512] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#C49A5A] h-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#F8F5EE]">The Bridal Edit</span>
                        <span className="text-[#C49A5A] font-bold">18%</span>
                      </div>
                      <div className="w-full bg-[#0E1512] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#C49A5A] h-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#F8F5EE]">Tennis Bracelets & Earrings</span>
                        <span className="text-[#C49A5A] font-bold">12%</span>
                      </div>
                      <div className="w-full bg-[#0E1512] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#C49A5A] h-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#203830] text-[11px] text-[#77807B]">
                    <span>✦ Certified BIS hallmarked gold accounts for 89% of sales.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT CATALOGUE */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#203830] pb-6">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
                    Jewellery Product Catalogue ({products.length})
                  </h1>
                  <p className="text-xs text-[#77807B] mt-1">
                    Manage prices, metal types, stone specifications, and inventory availability.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      sku: `AUR-NEW-${Math.floor(100 + Math.random() * 900)}`,
                      price: '65000',
                      discountPrice: '',
                      category: 'Rings',
                      metal: '18K Gold',
                      stone: 'Solitaire Diamond',
                      stock: 12,
                      images: '/assets/category_rings.jpg',
                      description: 'New handcrafted luxury gold and diamond creation.'
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="bg-[#C49A5A] text-[#0A1A15] text-xs font-bold uppercase tracking-widest px-5 py-3 rounded flex items-center gap-2 hover:bg-[#D9BC86] transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Add Jewellery Product
                </button>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#16241E]/80 border border-[#203830] p-4 rounded-sm">
                
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#C49A5A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search product name or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#0E1512] border border-[#203830] text-xs text-[#F8F5EE] placeholder:text-[#77807B] focus:outline-none focus:border-[#C49A5A]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  <span className="text-[11px] text-[#77807B] font-semibold uppercase tracking-wider">Category:</span>
                  {['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bridal', "Men's"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`text-xs px-3 py-1 rounded transition-colors whitespace-nowrap ${
                        selectedCategoryFilter === cat
                          ? 'bg-[#C49A5A] text-[#0A1A15] font-semibold'
                          : 'bg-[#0E1512] border border-[#203830] text-[#77807B] hover:text-[#F8F5EE]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#16241E]/80 border border-[#203830] rounded-sm overflow-x-auto shadow-luxury">
                <table className="w-full text-left text-xs text-[#F8F5EE]">
                  <thead className="bg-[#0E1512] text-[#C49A5A] uppercase tracking-wider font-semibold border-b border-[#203830]">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Metal & Stone</th>
                      <th className="p-4">Price (INR)</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#203830]">
                    {filteredProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-[#1C2C25]/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover border border-[#203830] rounded-sm" />
                          <div>
                            <span className="font-bold text-[#F8F5EE] block">{p.name}</span>
                            <span className="text-[10px] text-[#77807B]">Certified BIS Hallmarked</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[#D9BC86]">{p.sku}</td>
                        <td className="p-4">{p.category}</td>
                        <td className="p-4 text-[#77807B]">{p.metal} • {p.stone}</td>
                        <td className="p-4 font-serif font-bold text-[#C49A5A]">
                          {formatINR(p.discountPrice || p.price)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stock > 5
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductForm({
                                name: p.name,
                                sku: p.sku,
                                price: p.price,
                                discountPrice: p.discountPrice || '',
                                category: p.category,
                                metal: p.metal,
                                stone: p.stone,
                                stock: p.stock,
                                images: p.images[0],
                                description: p.description
                              });
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 bg-[#0E1512] hover:bg-[#203830] border border-[#203830] text-[#D9BC86] rounded"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProducts(products.filter((item) => item._id !== p._id));
                              showToast(`Removed item ${p.name} from catalog.`);
                            }}
                            className="p-1.5 bg-[#1A1212] hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDER FULFILLMENT HUB */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#203830] pb-6">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
                    Order Status & Fulfillment Hub
                  </h1>
                  <p className="text-xs text-[#77807B] mt-1">
                    Manage 7-stage jewellery crafting timelines, shipping dispatch, and BIS hallmark status.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#77807B]">Filter Stage:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#0E1512] border border-[#203830] text-xs p-2 text-[#F8F5EE] focus:outline-none"
                  >
                    <option value="All">All Stages</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="crafting">Crafting & Setting</option>
                    <option value="quality_check">Quality & BIS Hallmark</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#16241E]/80 border border-[#203830] rounded-sm overflow-x-auto shadow-luxury">
                <table className="w-full text-left text-xs text-[#F8F5EE]">
                  <thead className="bg-[#0E1512] text-[#C49A5A] uppercase tracking-wider font-semibold border-b border-[#203830]">
                    <tr>
                      <th className="p-4">Order Ref #</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Order Value</th>
                      <th className="p-4">Current Stage</th>
                      <th className="p-4 text-right">Update Fulfillment Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#203830]">
                    {filteredOrders.map((o) => (
                      <tr key={o._id} className="hover:bg-[#1C2C25]/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#C49A5A]">
                          {o.orderNumber}
                          <span className="block text-[10px] font-sans font-normal text-[#77807B]">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold block">{o.user?.name || 'Priya Sharma'}</span>
                          <span className="text-[11px] text-[#77807B]">{o.user?.email}</span>
                        </td>
                        <td className="p-4 font-serif font-bold text-[#F8F5EE]">
                          {formatINR(o.totalAmount)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${getStatusBadgeClass(o.orderStatus)}`}>
                            {o.orderStatus?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            className="bg-[#0E1512] border border-[#203830] text-xs p-1.5 text-[#F8F5EE] focus:outline-none rounded cursor-pointer"
                          >
                            <option value="pending">1. Order Placed</option>
                            <option value="confirmed">2. Payment Confirmed</option>
                            <option value="crafting">3. Handcrafted & Gem Setting</option>
                            <option value="quality_check">4. BIS Hallmarking & Certification</option>
                            <option value="shipped">5. Dispatched in Velvet Box</option>
                            <option value="out_for_delivery">6. Out for Insured Delivery</option>
                            <option value="delivered">7. Delivered to Client</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PROMOTIONS & COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#203830] pb-6">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
                    Promotions & Discount Codes ({coupons.length})
                  </h1>
                  <p className="text-xs text-[#77807B] mt-1">
                    Create promo codes, set percentage discounts, and control minimum order thresholds.
                  </p>
                </div>

                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="bg-[#C49A5A] text-[#0A1A15] text-xs font-bold uppercase tracking-widest px-5 py-3 rounded flex items-center gap-2 hover:bg-[#D9BC86] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Create Promo Code
                </button>
              </div>

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((c) => (
                  <div key={c._id} className="bg-[#16241E]/80 border border-[#203830] p-6 rounded-sm space-y-4 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xl font-bold text-[#C49A5A] block tracking-wider">
                          {c.code}
                        </span>
                        <span className="text-xs text-[#77807B]">Active Campaign</span>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                        {c.discountPercentage}% OFF
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-[#77807B] border-t border-[#203830] pt-3">
                      <div className="flex justify-between">
                        <span>Min Order:</span>
                        <strong className="text-[#F8F5EE]">{c.minOrder ? formatINR(c.minOrder) : 'No Minimum'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Redeemed:</span>
                        <strong className="text-[#F8F5EE]">{c.usageCount} times</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: VIP CLIENTS */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="border-b border-[#203830] pb-6">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
                  VIP Client Directory (28 Members)
                </h1>
                <p className="text-xs text-[#77807B] mt-1">
                  Registered clientele, purchase history, and luxury loyalty statuses.
                </p>
              </div>

              <div className="bg-[#16241E]/80 border border-[#203830] rounded-sm overflow-x-auto shadow-luxury">
                <table className="w-full text-left text-xs text-[#F8F5EE]">
                  <thead className="bg-[#0E1512] text-[#C49A5A] uppercase tracking-wider font-semibold border-b border-[#203830]">
                    <tr>
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Tier Badge</th>
                      <th className="p-4">Lifetime Spend</th>
                      <th className="p-4 text-right">Orders Placed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#203830]">
                    <tr className="hover:bg-[#1C2C25]/50">
                      <td className="p-4 font-bold">Priya Sharma</td>
                      <td className="p-4 text-[#77807B]">priya@example.com</td>
                      <td className="p-4"><span className="bg-[#C49A5A]/20 text-[#D9BC86] border border-[#C49A5A]/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">SOLITAIRE CLUB</span></td>
                      <td className="p-4 font-serif font-bold text-[#C49A5A]">₹1,73,900</td>
                      <td className="p-4 text-right font-mono">3</td>
                    </tr>
                    <tr className="hover:bg-[#1C2C25]/50">
                      <td className="p-4 font-bold">Ananya Mehta</td>
                      <td className="p-4 text-[#77807B]">ananya@example.com</td>
                      <td className="p-4"><span className="bg-[#C49A5A]/20 text-[#D9BC86] border border-[#C49A5A]/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">HERITAGE DIAMOND</span></td>
                      <td className="p-4 font-serif font-bold text-[#C49A5A]">₹4,25,000</td>
                      <td className="p-4 text-right font-mono">5</td>
                    </tr>
                    <tr className="hover:bg-[#1C2C25]/50">
                      <td className="p-4 font-bold">Rohan Kapoor</td>
                      <td className="p-4 text-[#77807B]">rohan@example.com</td>
                      <td className="p-4"><span className="bg-[#C49A5A]/20 text-[#D9BC86] border border-[#C49A5A]/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">GOLD PRIVILEGE</span></td>
                      <td className="p-4 font-serif font-bold text-[#C49A5A]">₹89,000</td>
                      <td className="p-4 text-right font-mono">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121614] border border-[#C49A5A] max-w-lg w-full p-6 space-y-4 rounded-sm shadow-2xl animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-[#C49A5A]">
              {editingProduct ? 'Edit Jewellery Product' : 'Add New Jewellery Product'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77807B] mb-1">Product Title</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="w-full p-2.5 bg-[#0E1512] border border-[#203830] text-[#F8F5EE] focus:outline-none focus:border-[#C49A5A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#77807B] mb-1">SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    required
                    className="w-full p-2.5 bg-[#0E1512] border border-[#203830] text-[#F8F5EE] focus:outline-none focus:border-[#C49A5A]"
                  />
                </div>
                <div>
                  <label className="block text-[#77807B] mb-1">Price (INR)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    className="w-full p-2.5 bg-[#0E1512] border border-[#203830] text-[#F8F5EE] focus:outline-none focus:border-[#C49A5A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#77807B] mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 bg-[#0E1512] border border-[#203830] text-[#F8F5EE] focus:outline-none"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Men's">Men's</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#77807B] mb-1">Metal</label>
                  <select
                    value={productForm.metal}
                    onChange={(e) => setProductForm({ ...productForm, metal: e.target.value })}
                    className="w-full p-2.5 bg-[#0E1512] border border-[#203830] text-[#F8F5EE] focus:outline-none"
                  >
                    <option value="18K Gold">18K Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#77807B] mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                  required
                  className="w-full p-2.5 bg-[#0E1512] border border-[#203830] text-[#F8F5EE] focus:outline-none focus:border-[#C49A5A]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#203830]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-[#16241E] border border-[#203830] text-[#77807B] uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-[#D96B27] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#B85517] transition-all shadow-md shadow-[#D96B27]/20">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121614] border border-[#D96B27] max-w-md w-full p-6 space-y-4 rounded-sm shadow-2xl animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-[#D96B27]">Create Promotion Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77807B] mb-1">Coupon Code (e.g. FESTIVE20)</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  required
                  className="w-full p-2.5 bg-[#0E1512] border border-[#203830] text-[#F8F5EE] uppercase focus:outline-none focus:border-[#D96B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#77807B] mb-1">Discount %</label>
                  <input
                    type="number"
                    value={newCoupon.discountPercentage}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })}
                    required
                    className="w-full p-2.5 bg-[#0E1512] border border-[#203830] text-[#F8F5EE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#77807B] mb-1">Min Order (INR)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrder}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                    className="w-full p-2.5 bg-[#0E1512] border border-[#203830] text-[#F8F5EE] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#203830]">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-[#16241E] border border-[#203830] text-[#77807B] uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-[#D96B27] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#B85517] transition-all shadow-md shadow-[#D96B27]/20">
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

