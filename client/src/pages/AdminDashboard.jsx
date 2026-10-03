import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  BarChart3,
  Clock,
  Search,
  LogOut,
  RefreshCw,
  Eye,
  CreditCard,
  Bell,
  ExternalLink,
  Copy,
  Truck,
  Gem,
  Award,
  Calendar,
  Settings,
  Database,
  ArrowUpRight,
  X,
  Menu,
  MoreVertical,
  ShoppingCart,
  Upload,
  Link2,
  FolderOpen,
  HardDrive,
  ShieldCheck,
  Check,
  ChevronDown,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { formatINR, useShop } from '../store/ShopContext';
import { seedProducts } from '../../../server/seed/seedData.js';

const STATUS_OPTIONS = [
  { value: 'pending', step: '1', label: 'Order Placed' },
  { value: 'confirmed', step: '2', label: 'Confirmed' },
  { value: 'crafting', step: '3', label: 'Crafting & Setting' },
  { value: 'quality_check', step: '4', label: 'Hallmark & QC' },
  { value: 'shipped', step: '5', label: 'Dispatched' },
  { value: 'delivered', step: '6', label: 'Delivered' }
];

function LuxuryStatusDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const currentOption = STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-amber-300 px-3.5 py-1.5 rounded-xl shadow-xs transition-all duration-150 text-xs font-medium text-stone-800 active:scale-95 outline-none"
      >
        <span className="font-semibold text-stone-800">{currentOption.step}. {currentOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl p-1.5 z-50 animate-tabFadeIn">
          <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-stone-400 tracking-wider border-b border-stone-100 mb-1">
            Change Stage
          </div>
          <div className="space-y-0.5">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 text-left select-none ${
                    isSelected
                      ? 'bg-amber-50 text-[#D96B27] font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-medium'
                  }`}
                >
                  <span>
                    <span className="font-mono text-stone-400 text-[11px] mr-1.5">{opt.step}.</span>
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D96B27] stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function LuxuryFilterDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const allFilterOptions = [
    { value: 'All', label: 'All Statuses' },
    ...STATUS_OPTIONS
  ];

  const current = allFilterOptions.find((o) => o.value === value) || allFilterOptions[0];

  return (
    <div className="relative inline-block text-left" ref={filterRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-300 px-3.5 py-2 rounded-xl shadow-xs transition-all text-xs font-semibold text-stone-800 active:scale-95 outline-none"
      >
        <span>{current.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl p-1.5 z-50 animate-tabFadeIn space-y-0.5">
          {allFilterOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all text-left ${
                  isSelected
                    ? 'bg-amber-50 text-[#D96B27] font-bold'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#D96B27]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CouponGreenLineChart({ data = [], trend = '+12% this month' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const counts = data.map((d) => d.count);
  const maxVal = Math.max(...counts, 10);
  const minVal = Math.min(...counts, 0);
  const range = maxVal - minVal || 10;

  const width = 160;
  const height = 44;
  const paddingX = 6;
  const paddingY = 6;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const points = data.map((item, idx) => {
    const x = paddingX + (idx / Math.max(1, data.length - 1)) * plotWidth;
    const y = height - paddingY - ((item.count - minVal) / range) * plotHeight;
    return { ...item, x, y };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`
    : '';

  return (
    <div className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 shadow-xs">
      {/* Left: Usage title + Green trend text */}
      <div className="select-none">
        <h4 className="font-bold text-stone-900 text-sm leading-tight">Usage</h4>
        <span className="text-emerald-600 font-semibold text-xs tracking-tight block mt-0.5">
          {trend}
        </span>
      </div>

      {/* Right: Green line graph sparkline with connected dots */}
      <div className="relative flex-1 max-w-[160px] h-11 flex items-center justify-end">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible select-none">
          <defs>
            <linearGradient id="greenLineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill under green line */}
          {areaD && <path d={areaD} fill="url(#greenLineGrad)" />}

          {/* Connected Green Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Plotted Circular Nodes on each data point */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <circle cx={pt.x} cy={pt.y} r="10" fill="transparent" />
                {isHovered && (
                  <circle cx={pt.x} cy={pt.y} r="6" fill="#10B981" fillOpacity="0.3" />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "4" : "2.5"}
                  fill={isHovered ? "#047857" : "#10B981"}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
                {isHovered && (
                  <g>
                    <rect
                      x={Math.max(0, Math.min(width - 50, pt.x - 25))}
                      y={Math.max(0, pt.y - 18)}
                      width="50"
                      height="15"
                      rx="3"
                      fill="#1C1917"
                    />
                    <text
                      x={Math.max(0, Math.min(width - 50, pt.x - 25)) + 25}
                      y={Math.max(0, pt.y - 18) + 11}
                      fill="#FFFFFF"
                      fontSize="8.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {pt.label ? `${pt.label}: ` : ''}{pt.count}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Navigation State
  const [activeTab, setActiveTab] = useState('coupons'); // overview | products | orders | coupons | customers | settings
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Data State
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([
    {
      _id: 'c1',
      code: 'VISHAL10',
      discountPercentage: 10,
      minOrder: 0,
      usageCount: 84,
      trend: '+12% this month',
      weeklyData: [
        { label: 'D1', count: 14 },
        { label: 'D2', count: 18 },
        { label: 'D3', count: 16 },
        { label: 'D4', count: 26 },
        { label: 'D5', count: 22 },
        { label: 'D6', count: 25 },
        { label: 'D7', count: 24 },
        { label: 'D8', count: 32 }
      ],
      active: true
    },
    {
      _id: 'c2',
      code: 'BRIDAL15',
      discountPercentage: 15,
      minOrder: 100000,
      usageCount: 29,
      trend: '+8% this month',
      weeklyData: [
        { label: 'D1', count: 4 },
        { label: 'D2', count: 6 },
        { label: 'D3', count: 5 },
        { label: 'D4', count: 10 },
        { label: 'D5', count: 8 },
        { label: 'D6', count: 11 },
        { label: 'D7', count: 9 },
        { label: 'D8', count: 14 }
      ],
      active: true
    },
    {
      _id: 'c3',
      code: 'SOLITAIRE5',
      discountPercentage: 5,
      minOrder: 50000,
      usageCount: 52,
      trend: '+18% this month',
      weeklyData: [
        { label: 'D1', count: 8 },
        { label: 'D2', count: 11 },
        { label: 'D3', count: 10 },
        { label: 'D4', count: 18 },
        { label: 'D5', count: 15 },
        { label: 'D6', count: 17 },
        { label: 'D7', count: 16 },
        { label: 'D8', count: 23 }
      ],
      active: true
    }
  ]);

  // Filtering & Search
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [chartMetric, setChartMetric] = useState('revenue');

  // Product Modal State & Image Upload Handling
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUploadType, setImageUploadType] = useState('device'); // device | url | gdrive
  const [gdriveInput, setGdriveInput] = useState('');
  const [imagePreviewInfo, setImagePreviewInfo] = useState({ name: '', size: '' });
  const fileInputRef = useRef(null);

  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    price: '',
    discountPrice: '',
    category: 'Rings',
    metal: '18K Gold',
    stone: 'Solitaire Diamond',
    stock: 12,
    images: '/assets/category_rings.jpg',
    description: ''
  });

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: 10, minOrder: 0 });

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Order Received', desc: 'Order #AUR-984210 placed for ₹48,900', time: '5m ago', unread: true },
    { id: 2, title: 'Hallmark Certificate Verified', desc: 'Batch #BH-8842 passed quality check', time: '1h ago', unread: true },
    { id: 3, title: 'Low Stock Alert', desc: 'Celeste Diamond Ring has only 3 units left', time: '3h ago', unread: false }
  ]);

  // Toast & Feedback
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code "${code}" copied to clipboard!`);
  };

  // Google Drive URL Parser
  const parseGoogleDriveUrl = (url) => {
    if (!url) return '';
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
  };

  // Local File Upload Reader
  const handleDeviceFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file (JPG, PNG, or WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      setProductForm((prev) => ({ ...prev, images: base64Url }));
      setImagePreviewInfo({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
      showToast(`Selected "${file.name}" from your device.`);
    };
    reader.readAsDataURL(file);
  };

  // Synchronize Data on Mount
  useEffect(() => {
    // 1. Fetch Analytics
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

    // 2. Fetch Products
    const localProds = JSON.parse(localStorage.getItem('aurelia_local_products') || '[]');
    const seedFormatted = seedProducts.map((p, i) => ({ ...p, _id: `mem_prod_${i + 1}` }));
    const baseMerged = [...localProds, ...seedFormatted];
    const uniqueBaseProds = baseMerged.filter((v, i, a) => a.findIndex((t) => t.sku === v.sku || t._id === v._id) === i);

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const merged = [...localProds, ...data];
          const unique = merged.filter((v, i, a) => a.findIndex((t) => t.sku === v.sku || t._id === v._id) === i);
          setProducts(unique);
        } else {
          setProducts(uniqueBaseProds);
        }
      })
      .catch(() => setProducts(uniqueBaseProds));

    // 3. Fetch Orders
    const localOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
    const seedOrders = [
      {
        _id: 'mem_order_1',
        orderNumber: 'AUR-984210',
        user: { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 99887 76655' },
        totalAmount: 48900,
        orderStatus: 'crafting',
        shippingAddress: 'Flat 402, Royal Palms, Bandra West, Mumbai 400050',
        items: [{ name: 'Celeste Diamond Ring', price: 48900, quantity: 1, metal: '18K Gold' }],
        createdAt: new Date().toISOString()
      },
      {
        _id: 'mem_order_2',
        orderNumber: 'AUR-882910',
        user: { name: 'Ananya Mehta', email: 'ananya@example.com', phone: '+91 98201 22334' },
        totalAmount: 125000,
        orderStatus: 'quality_check',
        shippingAddress: 'Villa 12, Golf Links, New Delhi 110003',
        items: [{ name: 'Royal Heritage Polki Necklace', price: 125000, quantity: 1, metal: '22K Gold' }],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: 'mem_order_3',
        orderNumber: 'AUR-773190',
        user: { name: 'Rohan Kapoor', email: 'rohan@example.com', phone: '+91 98112 33445' },
        totalAmount: 89000,
        orderStatus: 'shipped',
        shippingAddress: 'Penthouse 8, Jubilee Hills, Hyderabad 500033',
        items: [{ name: 'Emerald Cut Diamond Tennis Bracelet', price: 89000, quantity: 1, metal: '18K White Gold' }],
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        _id: 'mem_order_4',
        orderNumber: 'AUR-661029',
        user: { name: 'Dr. Meera Nambiar', email: 'meera.n@example.com', phone: '+91 94471 88990' },
        totalAmount: 195000,
        orderStatus: 'delivered',
        shippingAddress: '42 Richmond Road, Bangalore 560025',
        items: [{ name: 'Saffron Glow Kundan Bridal Choker', price: 195000, quantity: 1, metal: '24K Gold Plated' }],
        createdAt: new Date(Date.now() - 345600000).toISOString()
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

    // 4. Fetch Coupons
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCoupons(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const localOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
          const combined = [...localOrders, ...data];
          const unique = combined.filter((v, i, a) => a.findIndex((t) => t.orderNumber === v.orderNumber || t._id === v._id) === i);
          setOrders(unique);
        }
      })
      .catch(() => {});

    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Store data refreshed.');
    }, 500);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const finalImage =
      imageUploadType === 'gdrive'
        ? parseGoogleDriveUrl(gdriveInput) || productForm.images
        : productForm.images;

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
      stock: Number(productForm.stock),
      images: [finalImage || '/assets/category_rings.jpg'],
      slug: productForm.name.toLowerCase().replace(/\s+/g, '-')
    };

    try {
      if (editingProduct) {
        await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, _id: editingProduct._id })
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {}

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map((p) => (p._id === editingProduct._id ? { ...p, ...payload } : p));
      showToast(`Saved changes to "${payload.name}".`);
    } else {
      updatedProducts = [{ ...payload, _id: `prod_${Date.now()}` }, ...products];
      showToast(`Added "${payload.name}" to catalogue.`);
    }

    setProducts(updatedProducts);
    localStorage.setItem('aurelia_local_products', JSON.stringify(updatedProducts));

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    const payload = {
      code: newCoupon.code.trim().toUpperCase(),
      discountPercentage: Number(newCoupon.discountPercentage),
      minOrder: Number(newCoupon.minOrder),
      trend: '+0% new',
      usageCount: 0,
      active: true
    };

    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {}

    setCoupons([...coupons, { ...payload, _id: `c_${Date.now()}` }]);
    setIsCouponModalOpen(false);
    setNewCoupon({ code: '', discountPercentage: 10, minOrder: 0 });
    showToast(`Promo code "${newCoupon.code.toUpperCase()}" created.`);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus })
      });
    } catch (err) {}

    const updated = orders.map((o) => (o._id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('aurelia_local_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('aurelia_order_status_updated', { detail: { orderId, orderStatus: newStatus } }));
    showToast(`Order status updated to "${newStatus.replace(/_/g, ' ')}".`);
  };

  const handleDeleteProduct = async (productId, productName) => {
    try {
      await fetch(`/api/products?id=${productId}`, { method: 'DELETE' });
    } catch (err) {}
    const updated = products.filter((item) => item._id !== productId);
    setProducts(updated);
    localStorage.setItem('aurelia_local_products', JSON.stringify(updated));
    showToast(`Removed "${productName}".`);
  };

  // Filtered lists
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku?.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
      const matchesStock =
        stockFilter === 'All' ||
        (stockFilter === 'Low' && p.stock <= 5) ||
        (stockFilter === 'InStock' && p.stock > 5);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, productSearch, selectedCategoryFilter, stockFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Clean status badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'shipped':
      case 'out_for_delivery':
        return { label: 'Dispatched', dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'quality_check':
        return { label: 'Hallmarking & QC', dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'crafting':
        return { label: 'In Crafting', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'confirmed':
        return { label: 'Confirmed', dot: 'bg-cyan-500', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      default:
        return { label: 'Order Placed', dot: 'bg-stone-500', badge: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  };

  const stageCounts = useMemo(() => {
    const counts = { pending: 0, confirmed: 0, crafting: 0, quality_check: 0, shipped: 0, delivered: 0 };
    orders.forEach((o) => {
      if (counts[o.orderStatus] !== undefined) counts[o.orderStatus]++;
    });
    return counts;
  }, [orders]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Catalogue & Stock', icon: ShoppingBag, badge: products.length },
    { id: 'orders', label: 'Orders & Stages', icon: Package, badge: orders.length },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag, badge: coupons.length },
    { id: 'customers', label: 'Customers', icon: Users, badge: 28 },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#FBF9F5] text-[#1E2420] flex flex-col font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] bg-white border border-stone-200 text-stone-900 px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center gap-2.5 animate-fadeIn">
          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[#D96B27]">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* CLEAN LUXURY NAVBAR */}
      <header className="flex-shrink-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#EFEAE2] px-4 sm:px-8 flex items-center justify-between gap-4 shadow-sm z-40">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/vishal_jewellery_logo.png"
              alt="Vishal Jewellery"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <span className="font-serif text-base sm:text-lg font-bold tracking-wider text-[#1A201C] uppercase block leading-none">
                VISHAL JEWELLERY
              </span>
              <span className="text-[10px] text-stone-400 font-medium tracking-wider uppercase mt-1 block">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Actions & User (Standardized Uniform Buttons) */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* 1. View Store */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3.5 bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl transition-all font-semibold shadow-xs flex items-center gap-2 active:scale-95"
            title="View Live Store"
          >
            <Eye className="w-3.5 h-3.5 text-[#D96B27]" />
            <span>View Store</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </Link>

          {/* 2. Quick Add Product (Primary Accent CTA) */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setGdriveInput('');
              setImageUploadType('device');
              setProductForm({
                name: '',
                sku: `VSH-${Math.floor(100 + Math.random() * 900)}`,
                price: '',
                discountPrice: '',
                category: 'Rings',
                metal: '18K Gold',
                stone: 'Solitaire Diamond',
                stock: 10,
                images: '/assets/category_rings.jpg',
                description: ''
              });
              setIsProductModalOpen(true);
            }}
            className="h-9 px-3.5 bg-[#D96B27] hover:bg-[#C05619] text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          {/* 3. Notification Bell */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (window.notifTimer) clearTimeout(window.notifTimer);
              setIsNotificationOpen(true);
            }}
            onMouseLeave={() => {
              window.notifTimer = setTimeout(() => {
                setIsNotificationOpen(false);
              }, 250);
            }}
          >
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="h-9 w-9 bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl transition-all font-semibold shadow-xs flex items-center justify-center relative active:scale-95 outline-none"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#D96B27] rounded-full"></span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl p-4 z-50 animate-tabFadeIn space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-800">Notifications</span>
                    <span className="bg-amber-100 text-[#D96B27] font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                      {notifications.filter((n) => n.unread).length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setNotifications(notifications.map((n) => ({ ...n, unread: false })));
                        showToast('Marked all as read');
                      }}
                      className="text-[11px] text-[#D96B27] font-medium hover:underline"
                    >
                      Mark read
                    </button>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-stone-900">{n.title}</span>
                        <span className="text-[10px] text-stone-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-stone-200 hidden sm:block"></div>

          {/* 4. Refresh Store Data Button */}
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="h-9 px-3.5 bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl transition-all font-semibold shadow-xs flex items-center gap-2 active:scale-95"
            title="Refresh Store Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D96B27]' : 'text-stone-500'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* 5. Unified Admin & Sign Out Button in one single container */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="h-9 px-3.5 bg-[#FAF8F5] hover:bg-red-50 hover:border-red-200 border border-stone-200 text-stone-700 hover:text-red-600 rounded-xl transition-all font-semibold shadow-xs flex items-center gap-2 active:scale-95 group"
            title="Sign Out"
          >
            <span className="font-bold text-xs">Admin</span>
            <LogOut className="w-3.5 h-3.5 text-stone-400 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </header>

      {/* DASHBOARD LAYOUT - FIXED HEIGHT & ISOLATED SCROLL VIEW */}
      <div className="flex-1 flex overflow-hidden w-full h-[calc(100vh-64px)] relative">
        {/* MOBILE DRAWER OVERLAY */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden animate-fadeIn"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <aside
              className="w-64 h-full bg-white shadow-2xl p-4 flex flex-col justify-between animate-slideRight"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200">
                  <span className="text-xs font-bold text-stone-700">Navigation</span>
                  <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 text-stone-500 hover:text-stone-900">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`group relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs nav-item-smooth active:scale-[0.97] outline-none select-none ${
                        isActive
                          ? 'bg-[#FAF8F5] text-[#D96B27] font-bold shadow-sm ring-1 ring-amber-200/80'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-all duration-200 ease-out group-hover:scale-110 ${isActive ? 'text-[#D96B27] scale-105' : 'text-stone-400 group-hover:text-stone-700'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-200 ${isActive ? 'bg-amber-100 text-[#D96B27]' : 'bg-[#EFEAE2] text-stone-600'}`}>
                          {item.badge}
                        </span>
                      )}
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#D96B27] rounded-r-full transition-all duration-300 ease-out origin-center ${
                          isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-stone-200">
                <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-xs text-stone-500">
                  <div className="flex items-center justify-between font-bold text-stone-800 text-[11px]">
                    <span>BIS Hallmark 916</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">Verified Purity Standard</p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* DESKTOP PINNED SIDEBAR (100% LOCKED, STATIC, NON-DISPLACEABLE) */}
        <aside className="hidden md:flex flex-col justify-between w-60 flex-shrink-0 h-full bg-[#FAF8F5] border-r border-[#EFEAE2] p-4 select-none z-30">
          <div className="space-y-1.5 overflow-y-auto pr-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs nav-item-smooth active:scale-[0.97] outline-none select-none ${
                    isActive
                      ? 'bg-white text-[#D96B27] font-bold shadow-sm ring-1 ring-amber-200/80'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-all duration-200 ease-out group-hover:scale-110 ${isActive ? 'text-[#D96B27] scale-105' : 'text-stone-400 group-hover:text-stone-700'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-200 ${isActive ? 'bg-amber-100 text-[#D96B27]' : 'bg-[#EFEAE2] text-stone-600'}`}>
                      {item.badge}
                    </span>
                  )}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#D96B27] rounded-r-full transition-all duration-300 ease-out origin-center ${
                      isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Simple Bottom Card */}
          <div className="pt-4 border-t border-[#EFEAE2] text-xs text-stone-500">
            <div className="bg-white border border-stone-200 p-3 rounded-xl shadow-sm">
              <div className="flex items-center justify-between font-bold text-stone-800 text-[11px]">
                <span>BIS Hallmark 916</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Verified Purity Standard</p>
            </div>
          </div>
        </aside>

        {/* MAIN SCROLLABLE VIEWPORT (ONLY THIS CONTAINER SCROLLS) */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-4 sm:p-8 bg-[#FBF9F5] space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div key="overview" className="space-y-6 animate-tabFadeIn">
              {/* SHOPIFY-STYLE EXECUTIVE STORE ACTION PULSE */}
              <div className="bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF7F2] border border-[#EDE8DF] p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D96B27]">Store Operations Active</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                    Vishal Jewellery Executive Summary
                  </h2>
                  <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                    Store is running smoothly. You have <strong className="text-stone-900 font-semibold">{orders.length} orders</strong> in pipeline (<span className="text-amber-700 font-semibold">{stageCounts.crafting || 2} in workshop</span>, <span className="text-purple-700 font-semibold">{stageCounts.quality_check || 1} in Hallmark certification</span>), and <strong className="text-stone-900 font-semibold">{products.length} active catalogue items</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Package className="w-4 h-4 text-[#D96B27]" />
                    <span>View Orders ({orders.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setGdriveInput('');
                      setImageUploadType('device');
                      setProductForm({
                        name: '',
                        sku: `VSH-${Math.floor(100 + Math.random() * 900)}`,
                        price: '',
                        discountPrice: '',
                        category: 'Rings',
                        metal: '18K Gold',
                        stone: 'Solitaire Diamond',
                        stock: 10,
                        images: '/assets/category_rings.jpg',
                        description: ''
                      });
                      setIsProductModalOpen(true);
                    }}
                    className="bg-[#D96B27] hover:bg-[#C05619] text-white font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Jewellery</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#EDE8DF] p-5 rounded-2xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="text-xs font-bold uppercase text-stone-500">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#D96B27]" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-stone-900 block">
                    {formatINR(analytics?.totalRevenue || 2845000)}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    +18.4% this month
                  </span>
                </div>

                <div className="bg-white border border-[#EDE8DF] p-5 rounded-2xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="text-xs font-bold uppercase text-stone-500">Total Orders</span>
                    <Package className="w-4 h-4 text-[#D96B27]" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-stone-900 block">
                    {analytics?.totalOrders || orders.length}
                  </span>
                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                    {stageCounts.crafting} in crafting
                  </span>
                </div>

                <div className="bg-white border border-[#EDE8DF] p-5 rounded-2xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="text-xs font-bold uppercase text-stone-500">Average Order</span>
                    <CreditCard className="w-4 h-4 text-[#D96B27]" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-stone-900 block">
                    {formatINR(analytics?.avgOrderValue || 67738)}
                  </span>
                  <span className="text-[11px] text-stone-500 block">Across bridal & fine items</span>
                </div>

                <div className="bg-white border border-[#EDE8DF] p-5 rounded-2xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="text-xs font-bold uppercase text-stone-500">Customers</span>
                    <Users className="w-4 h-4 text-[#D96B27]" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-stone-900 block">
                    {analytics?.totalCustomers || 28}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    +4 new this week
                  </span>
                </div>
              </div>

              {/* 1-CLICK INTERACTIVE PIPELINE (CLICK ANY STAGE TO FILTER ORDERS) */}
              <div className="bg-white border border-[#EDE8DF] p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <div>
                    <span className="font-bold text-xs text-stone-800">Order Fulfillment Pipeline</span>
                    <span className="text-[11px] text-stone-400 ml-2 hidden sm:inline">• Click any stage to filter orders</span>
                  </div>
                  <button onClick={() => { setOrderStatusFilter('All'); setActiveTab('orders'); }} className="text-xs text-[#D96B27] font-bold hover:underline">
                    View All Orders &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                  <button
                    onClick={() => { setOrderStatusFilter('pending'); setActiveTab('orders'); }}
                    className="bg-stone-50 hover:bg-stone-100/90 border border-stone-200/80 p-3 rounded-xl text-center transition-all duration-150 active:scale-95 group text-left"
                    title="Filter: Order Placed"
                  >
                    <span className="text-stone-500 block text-[10px] font-medium group-hover:text-stone-900">1. Placed</span>
                    <strong className="text-base font-mono text-stone-900 block mt-0.5">{stageCounts.pending || 0}</strong>
                    <span className="text-[9px] text-stone-400 font-medium">New order</span>
                  </button>

                  <button
                    onClick={() => { setOrderStatusFilter('confirmed'); setActiveTab('orders'); }}
                    className="bg-cyan-50/50 hover:bg-cyan-50 border border-cyan-200/70 p-3 rounded-xl text-center transition-all duration-150 active:scale-95 group text-left"
                    title="Filter: Confirmed"
                  >
                    <span className="text-cyan-700 block text-[10px] font-medium">2. Confirmed</span>
                    <strong className="text-base font-mono text-cyan-800 block mt-0.5">{stageCounts.confirmed || 0}</strong>
                    <span className="text-[9px] text-cyan-600 font-medium">Verified</span>
                  </button>

                  <button
                    onClick={() => { setOrderStatusFilter('crafting'); setActiveTab('orders'); }}
                    className="bg-amber-50/60 hover:bg-amber-50 border border-amber-200/80 p-3 rounded-xl text-center transition-all duration-150 active:scale-95 group text-left"
                    title="Filter: In Crafting"
                  >
                    <span className="text-amber-800 block text-[10px] font-bold">3. Crafting</span>
                    <strong className="text-base font-mono text-amber-900 block mt-0.5">{stageCounts.crafting || 0}</strong>
                    <span className="text-[9px] text-amber-700 font-medium">In Workshop</span>
                  </button>

                  <button
                    onClick={() => { setOrderStatusFilter('quality_check'); setActiveTab('orders'); }}
                    className="bg-purple-50/60 hover:bg-purple-50 border border-purple-200/80 p-3 rounded-xl text-center transition-all duration-150 active:scale-95 group text-left"
                    title="Filter: Hallmark & QC"
                  >
                    <span className="text-purple-800 block text-[10px] font-bold">4. Hallmark & QC</span>
                    <strong className="text-base font-mono text-purple-900 block mt-0.5">{stageCounts.quality_check || 0}</strong>
                    <span className="text-[9px] text-purple-700 font-medium">BIS Testing</span>
                  </button>

                  <button
                    onClick={() => { setOrderStatusFilter('shipped'); setActiveTab('orders'); }}
                    className="bg-blue-50/60 hover:bg-blue-50 border border-blue-200/80 p-3 rounded-xl text-center transition-all duration-150 active:scale-95 group text-left"
                    title="Filter: Dispatched"
                  >
                    <span className="text-blue-800 block text-[10px] font-bold">5. Dispatched</span>
                    <strong className="text-base font-mono text-blue-900 block mt-0.5">{stageCounts.shipped || 0}</strong>
                    <span className="text-[9px] text-blue-700 font-medium">Insured Transit</span>
                  </button>

                  <button
                    onClick={() => { setOrderStatusFilter('delivered'); setActiveTab('orders'); }}
                    className="bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/80 p-3 rounded-xl text-center transition-all duration-150 active:scale-95 group text-left"
                    title="Filter: Delivered"
                  >
                    <span className="text-emerald-800 block text-[10px] font-bold">6. Delivered</span>
                    <strong className="text-base font-mono text-emerald-900 block mt-0.5">{stageCounts.delivered || 0}</strong>
                    <span className="text-[9px] text-emerald-700 font-medium">Completed</span>
                  </button>
                </div>
              </div>

              {/* Monthly Sales Chart & Category Mix */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-[#EDE8DF] p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">Monthly Sales Velocity</h3>
                    <div className="flex gap-1 bg-stone-100 p-1 rounded-xl text-xs">
                      <button
                        onClick={() => setChartMetric('revenue')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          chartMetric === 'revenue' ? 'bg-white text-[#D96B27] shadow-sm' : 'text-stone-500'
                        }`}
                      >
                        Revenue
                      </button>
                      <button
                        onClick={() => setChartMetric('orders')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          chartMetric === 'orders' ? 'bg-white text-[#D96B27] shadow-sm' : 'text-stone-500'
                        }`}
                      >
                        Orders
                      </button>
                    </div>
                  </div>

                  <div className="h-56 flex items-end justify-between gap-4 pt-4 px-2">
                    {(analytics?.salesTrend || []).map((bar) => {
                      const heightPercent =
                        chartMetric === 'revenue' ? (bar.revenue / 2000000) * 100 : (bar.orders / 35) * 100;
                      return (
                        <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="text-[10px] font-mono text-[#D96B27] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {chartMetric === 'revenue' ? formatINR(bar.revenue) : `${bar.orders} orders`}
                          </div>
                          <div className="w-full bg-stone-100 rounded-t-xl h-full flex items-end overflow-hidden">
                            <div
                              className="w-full bg-[#D96B27] rounded-t-lg transition-all duration-500"
                              style={{ height: `${heightPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-stone-500 font-bold">{bar.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-[#EDE8DF] p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
                    Category Breakdown
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1 font-medium">
                        <span>Rings & Solitaires</span>
                        <strong className="text-[#D96B27]">42%</strong>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#D96B27] h-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 font-medium">
                        <span>Necklaces & Sets</span>
                        <strong className="text-amber-600">28%</strong>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 font-medium">
                        <span>The Bridal Edit</span>
                        <strong className="text-purple-600">18%</strong>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 font-medium">
                        <span>Bracelets & Earrings</span>
                        <strong className="text-emerald-600">12%</strong>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SHOPIFY-STYLE: TOP PERFORMING PRODUCTS & LIVE RECENT ACTIVITY FEED */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Top Best Selling Products */}
                <div className="lg:col-span-7 bg-white border border-[#EDE8DF] p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Top Performing Jewellery</h3>
                      <p className="text-[11px] text-stone-400">Best-selling pieces ranked by client demand</p>
                    </div>
                    <button onClick={() => setActiveTab('products')} className="text-xs text-[#D96B27] font-bold hover:underline">
                      View Catalogue &rarr;
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {products.slice(0, 4).map((item, idx) => (
                      <div key={item._id || idx} className="flex items-center justify-between p-3 rounded-xl bg-stone-50/70 border border-stone-100 hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={Array.isArray(item.images) ? item.images[0] : item.images || '/assets/category_rings.jpg'}
                            alt={item.name}
                            className="w-11 h-11 object-cover rounded-xl border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{item.name}</span>
                            <span className="text-[10px] text-stone-500">{item.metal} • {item.stone}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-serif font-bold text-stone-900 block">{formatINR(item.discountPrice || item.price)}</span>
                          <span className={`text-[10px] font-bold ${item.stock > 5 ? 'text-emerald-700' : 'text-red-600'}`}>
                            {item.stock} in stock
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-Time Live Activity Stream */}
                <div className="lg:col-span-5 bg-white border border-[#EDE8DF] p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Live Activity Feed</h3>
                      <p className="text-[11px] text-stone-400">Real-time store & craftsmanship events</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-stone-800 block">Order Placed (#AUR-984210)</span>
                        <p className="text-[11px] text-stone-500">Priya Sharma ordered Celeste Diamond Ring (₹48,900)</p>
                        <span className="text-[10px] text-stone-400">5 mins ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-stone-800 block">Hallmark 916 Verified</span>
                        <p className="text-[11px] text-stone-500">Batch #BH-8842 passed purity testing</p>
                        <span className="text-[10px] text-stone-400">1 hour ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-stone-800 block">Dispatched to Hyderabad</span>
                        <p className="text-[11px] text-stone-500">Order #AUR-773190 handed to insured express courier</p>
                        <span className="text-[10px] text-stone-400">Yesterday</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div key="products" className="space-y-6 animate-tabFadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A201C]">
                    Product Catalogue ({products.length})
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Manage prices, descriptions, and stock quantities.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setGdriveInput('');
                    setImageUploadType('device');
                    setProductForm({
                      name: '',
                      sku: `VSH-${Math.floor(100 + Math.random() * 900)}`,
                      price: '',
                      discountPrice: '',
                      category: 'Rings',
                      metal: '18K Gold',
                      stone: 'Solitaire Diamond',
                      stock: 10,
                      images: '/assets/category_rings.jpg',
                      description: ''
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="bg-[#D96B27] hover:bg-[#C05619] text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between bg-white border border-[#EDE8DF] p-3.5 rounded-2xl shadow-sm">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search name or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#D96B27]"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  {['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bridal', "Men's"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-150 active:scale-95 whitespace-nowrap ${
                        selectedCategoryFilter === cat
                          ? 'bg-[#D96B27] text-white'
                          : 'bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-[#EDE8DF] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-800">
                    <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4 pl-6">Product</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-4 pl-6 flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-xl border border-stone-200"
                            />
                            <div>
                              <span className="font-bold text-stone-900 block">{p.name}</span>
                              <span className="text-[10px] text-stone-500">{p.metal} • {p.stone}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono font-semibold text-[#D96B27]">{p.sku}</td>
                          <td className="p-4">{p.category}</td>
                          <td className="p-4 font-serif font-bold text-stone-900">
                            {formatINR(p.discountPrice || p.price)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                p.stock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                              }`}
                            >
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setImageUploadType('url');
                                setGdriveInput('');
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
                              className="p-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg active:scale-95 transition-transform"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id, p.name)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg active:scale-95 transition-transform"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div key="orders" className="space-y-6 animate-tabFadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A201C]">
                    Orders & Fulfillment ({orders.length})
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Manage real-time crafting, hallmark certification, and shipping status.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search order ref or customer..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#D96B27]"
                    />
                  </div>
                  <LuxuryFilterDropdown
                    value={orderStatusFilter}
                    onChange={(val) => setOrderStatusFilter(val)}
                  />
                </div>
              </div>

              <div className="bg-white border border-[#EDE8DF] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-800">
                    <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4 pl-6">Order Ref</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Item</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.map((o) => {
                        const badge = getStatusBadge(o.orderStatus);
                        return (
                          <tr key={o._id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-4 pl-6 font-mono font-bold text-[#D96B27]">
                              {o.orderNumber}
                              <span className="block text-[10px] text-stone-400 font-sans font-normal">
                                {new Date(o.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold block">{o.user?.name || 'Customer'}</span>
                              <span className="text-[11px] text-stone-500">{o.user?.email}</span>
                            </td>
                            <td className="p-4">
                              {o.items?.[0]?.name}
                              {o.items?.length > 1 && ` (+${o.items.length - 1} more)`}
                            </td>
                            <td className="p-4 font-serif font-bold text-stone-900">
                              {formatINR(o.totalAmount)}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${badge.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                                {badge.label}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <LuxuryStatusDropdown
                                value={o.orderStatus}
                                onChange={(newStatus) => handleUpdateOrderStatus(o._id, newStatus)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COUPONS & DISCOUNTS */}
          {activeTab === 'coupons' && (
            <div key="coupons" className="space-y-6 animate-tabFadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A201C]">
                    Promotions & Discount Codes ({coupons.length})
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Create promo codes, set percentage deductions, and set minimum cart thresholds.
                  </p>
                </div>

                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="bg-[#D96B27] hover:bg-[#C05619] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Create Promo Code
                </button>
              </div>

              {/* 3-Column Coupon Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coupons.map((c) => (
                  <div
                    key={c._id}
                    className="bg-white border border-[#EDE8DF] rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D96B27]">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-stone-900">{c.code}</span>
                            <button
                              onClick={() => handleCopyCode(c.code)}
                              className="text-stone-400 hover:text-stone-800 p-1 active:scale-90 transition-transform"
                              title="Copy code"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] text-stone-400 block">Active Campaign</span>
                        </div>
                      </div>

                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {c.discountPercentage}% OFF
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Minimum Order:</span>
                        <strong className="text-stone-900">
                          {c.minOrder ? formatINR(c.minOrder) : 'No Minimum'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Total Redemptions:</span>
                        <strong className="text-[#D96B27] font-bold">{c.usageCount} times</strong>
                      </div>
                    </div>

                    {/* GREEN SPARKLINE GRAPH (MATCHING USER REFERENCE) */}
                    <CouponGreenLineChart data={c.weeklyData} trend={c.trend} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div key="customers" className="space-y-6 animate-tabFadeIn">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A201C]">
                  Customer Directory (28)
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Registered clients, loyalty tiers, and purchase history.
                </p>
              </div>

              <div className="bg-white border border-[#EDE8DF] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-800">
                    <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4 pl-6">Customer</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Tier</th>
                        <th className="p-4">Total Spend</th>
                        <th className="p-4 pr-6 text-right">Orders</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr className="hover:bg-stone-50 transition-colors">
                        <td className="p-4 pl-6 font-bold">Priya Sharma</td>
                        <td className="p-4 text-stone-600">priya@example.com</td>
                        <td className="p-4">
                          <span className="bg-amber-50 text-[#D97706] border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            SOLITAIRE CLUB
                          </span>
                        </td>
                        <td className="p-4 font-serif font-bold text-stone-900">₹1,73,900</td>
                        <td className="p-4 pr-6 text-right font-bold">3</td>
                      </tr>
                      <tr className="hover:bg-stone-50 transition-colors">
                        <td className="p-4 pl-6 font-bold">Ananya Mehta</td>
                        <td className="p-4 text-stone-600">ananya@example.com</td>
                        <td className="p-4">
                          <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            HERITAGE DIAMOND
                          </span>
                        </td>
                        <td className="p-4 font-serif font-bold text-stone-900">₹4,25,000</td>
                        <td className="p-4 pr-6 text-right font-bold">5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div key="settings" className="space-y-6 animate-tabFadeIn">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A201C]">
                  Store Settings
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Manage deployment connections, hallmarking parameters, and store currency.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#EDE8DF] p-5 rounded-2xl space-y-3 shadow-sm">
                  <h3 className="font-serif font-bold text-sm text-stone-900">Edge & Hosting</h3>
                  <div className="space-y-2 text-xs text-stone-600">
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span>Production URL</span>
                      <a href="https://diamante-jewellary.pages.dev" target="_blank" rel="noreferrer" className="text-[#D96B27] font-mono hover:underline">
                        diamante-jewellary.pages.dev
                      </a>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Currency</span>
                      <span className="font-bold text-stone-800">INR (₹)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#EDE8DF] p-5 rounded-2xl space-y-3 shadow-sm">
                  <h3 className="font-serif font-bold text-sm text-stone-900">Compliance & Hallmarking</h3>
                  <div className="space-y-2 text-xs text-stone-600">
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span>BIS Hallmark 916 Standard</span>
                      <span className="text-emerald-700 font-bold">Active</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Diamond Grading</span>
                      <span className="text-stone-800 font-bold">GIA / IGI Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT MODAL WITH DEVICE / URL / GDRIVE IMAGE OPTIONS */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 max-w-lg w-full p-6 space-y-4 rounded-3xl shadow-2xl animate-fadeIn max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 mb-1 font-bold">Title</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  placeholder="e.g. Celeste Solitaire Diamond Ring"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D96B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1 font-bold">SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono font-bold focus:outline-none focus:border-[#D96B27]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1 font-bold">Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none focus:border-[#D96B27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1 font-bold">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:border-[#D96B27] cursor-pointer"
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
                  <label className="block text-stone-700 mb-1 font-bold">Metal</label>
                  <select
                    value={productForm.metal}
                    onChange={(e) => setProductForm({ ...productForm, metal: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:border-[#D96B27] cursor-pointer"
                  >
                    <option value="18K Gold">18K Gold</option>
                    <option value="22K Gold">22K Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
              </div>

              {/* IMAGE UPLOAD SELECTOR: DEVICE / URL / GDRIVE */}
              <div className="space-y-2 border-t border-stone-100 pt-3">
                <label className="block text-stone-800 font-bold">Product Image</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setImageUploadType('device')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      imageUploadType === 'device' ? 'bg-white text-[#D96B27] shadow-sm' : 'text-stone-500'
                    }`}
                  >
                    From Device
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadType('url')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      imageUploadType === 'url' ? 'bg-white text-[#D96B27] shadow-sm' : 'text-stone-500'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadType('gdrive')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      imageUploadType === 'gdrive' ? 'bg-white text-[#D96B27] shadow-sm' : 'text-stone-500'
                    }`}
                  >
                    Google Drive
                  </button>
                </div>

                {imageUploadType === 'device' && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-amber-300 hover:border-[#D96B27] bg-amber-50/40 rounded-xl p-3.5 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleDeviceFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 text-[#D96B27] mx-auto mb-1" />
                    <span className="font-bold text-stone-800 block text-xs">Choose image from device</span>
                    <span className="text-[10px] text-stone-400">JPG, PNG, WEBP</span>
                  </div>
                )}

                {imageUploadType === 'url' && (
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={productForm.images}
                    onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono text-xs focus:outline-none focus:border-[#D96B27]"
                  />
                )}

                {imageUploadType === 'gdrive' && (
                  <input
                    type="text"
                    placeholder="Paste Google Drive shareable link..."
                    value={gdriveInput}
                    onChange={(e) => {
                      setGdriveInput(e.target.value);
                      const parsed = parseGoogleDriveUrl(e.target.value);
                      if (parsed) setProductForm({ ...productForm, images: parsed });
                    }}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono text-xs focus:outline-none focus:border-[#D96B27]"
                  />
                )}

                {productForm.images && (
                  <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 p-2 rounded-xl">
                    <img
                      src={productForm.images}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/category_rings.jpg';
                      }}
                      className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                    />
                    <span className="text-xs text-stone-700 font-medium">Image preview ready</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D96B27] hover:bg-[#C05619] text-white font-bold rounded-xl shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROMO CODE MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 max-w-md w-full p-6 space-y-4 rounded-3xl shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Create Promo Code</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 mb-1 font-bold">Code</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  required
                  placeholder="e.g. FESTIVE20"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 uppercase font-mono font-bold focus:outline-none focus:border-[#D96B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1 font-bold">Discount %</label>
                  <input
                    type="number"
                    value={newCoupon.discountPercentage}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })}
                    required
                    min="1"
                    max="90"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1 font-bold">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrder}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D96B27] hover:bg-[#C05619] text-white font-bold rounded-xl shadow-sm"
                >
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
