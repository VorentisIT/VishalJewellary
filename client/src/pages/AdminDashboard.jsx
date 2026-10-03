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

function KpiSparkline({
  color = '#D96B27',
  data = [10, 14, 18, 16, 22, 21, 26, 30],
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today'],
  formatValue = (val) => `${val}`
}) {
  const [hoverData, setHoverData] = useState(null);
  const containerRef = useRef(null);

  const width = 240;
  const height = 54;
  const padLeft = 6;
  const padRight = 8;
  const padTop = 8;
  const padBottom = 6;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => ({
    label: labels[idx] || `Point ${idx + 1}`,
    val,
    x: padLeft + (idx / Math.max(1, data.length - 1)) * plotW,
    y: padTop + plotH - ((val - min) / range) * plotH
  }));

  // Smooth cubic Bezier spline for luxury fluid sparklines
  const getCurvedPath = (pts) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 5.5;
      const cp1y = p1.y + (p2.y - p0.y) / 5.5;
      const cp2x = p2.x - (p3.x - p1.x) / 5.5;
      const cp2y = p2.y - (p3.y - p1.y) / 5.5;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const pathD = getCurvedPath(points);
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${padTop + plotH + 4} L ${points[0].x.toFixed(1)} ${padTop + plotH + 4} Z`;
  const gradId = `kpiGrad-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  const handlePointerMove = (e) => {
    if (!containerRef.current || points.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const svgX = (clientX / rect.width) * width;

    let closest = 0;
    let minDiff = Infinity;
    points.forEach((pt, i) => {
      const diff = Math.abs(pt.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });

    setHoverData({
      idx: closest,
      cursorX: clientX,
      cursorY: clientY,
      point: points[closest]
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-12 select-none cursor-crosshair"
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseLeave={() => setHoverData(null)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible pointer-events-none"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.38" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Filled Area */}
        <path d={areaD} fill={`url(#${gradId})`} />

        {/* Curve Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots along the line matching reference image */}
        {points.map((pt, idx) => {
          const isLast = idx === points.length - 1;
          return (
            <g key={idx}>
              {isLast && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7"
                  fill={color}
                  fillOpacity="0.25"
                />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isLast ? "4" : "3"}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth="1.8"
              />
            </g>
          );
        })}

        {/* Active hover vertical dashed guide line & glowing circle */}
        {hoverData && (
          <g className="pointer-events-none">
            <line
              x1={hoverData.point.x}
              y1={padTop - 4}
              x2={hoverData.point.x}
              y2={padTop + plotH}
              stroke={color}
              strokeDasharray="2 2"
              strokeWidth="1.2"
              strokeOpacity="0.9"
            />
            <circle
              cx={hoverData.point.x}
              cy={hoverData.point.y}
              r="5.5"
              fill={color}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Dynamic Floating Tooltip positioned right at cursor */}
      {hoverData && (
        <div
          className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-stone-900/95 backdrop-blur-xs text-white text-[9.5px] px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5 whitespace-nowrap border border-stone-700"
          style={{
            left: `${hoverData.cursorX}px`,
            top: `${Math.max(-10, hoverData.cursorY - 8)}px`
          }}
        >
          <span className="text-stone-300 font-sans font-medium">{hoverData.point.label}:</span>
          <span className="font-bold text-amber-400 font-mono">{formatValue(hoverData.point.val)}</span>
        </div>
      )}
    </div>
  );
}

function DashboardSelectDropdown({ value, options, onChange, minWidth = 'w-36' }) {
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

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[11px] font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 outline-none cursor-pointer"
      >
        <span>{current.label}</span>
        <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-stone-700' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-1.5 ${minWidth} bg-white border border-stone-200 rounded-xl shadow-xl p-1 z-50 animate-tabFadeIn space-y-0.5`}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left ${
                  isSelected
                    ? 'bg-amber-50 text-[#D96B27] font-bold'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3 h-3 text-[#D96B27]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const SALES_TIMEFRAME_DATA = {
  '6M': {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    revenue: [520000, 810000, 1050000, 1120000, 1280000, 1480000],
    orders: [14, 21, 28, 30, 35, 42],
    revenueMax: 2000000,
    ordersMax: 50,
    revenueYTicks: ['20L', '15L', '10L', '5L'],
    ordersYTicks: ['50', '35', '20', '10'],
    defaultHover: 5
  },
  '3M': {
    months: ['Apr', 'May', 'Jun'],
    revenue: [1120000, 1280000, 1480000],
    orders: [30, 35, 42],
    revenueMax: 2000000,
    ordersMax: 50,
    revenueYTicks: ['20L', '15L', '10L', '5L'],
    ordersYTicks: ['50', '35', '20', '10'],
    defaultHover: 2
  },
  '30D': {
    months: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    revenue: [280000, 390000, 410000, 400000],
    orders: [8, 11, 12, 11],
    revenueMax: 500000,
    ordersMax: 15,
    revenueYTicks: ['5L', '3.75L', '2.5L', '1.25L'],
    ordersYTicks: ['15', '11', '8', '4'],
    defaultHover: 3
  },
  '1Y': {
    months: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
    revenue: [1850000, 2400000, 2900000, 3400000, 3880000, 4200000],
    orders: [48, 62, 75, 89, 102, 118],
    revenueMax: 5000000,
    ordersMax: 140,
    revenueYTicks: ['50L', '37.5L', '25L', '12.5L'],
    ordersYTicks: ['140', '100', '60', '20'],
    defaultHover: 5
  }
};

function MonthlySalesVelocityChart({ metric = 'revenue', timeframe = '6M' }) {
  const currentSet = SALES_TIMEFRAME_DATA[timeframe] || SALES_TIMEFRAME_DATA['6M'];
  const [hoveredIdx, setHoveredIdx] = useState(currentSet.defaultHover);
  const svgRef = useRef(null);

  useEffect(() => {
    setHoveredIdx(currentSet.defaultHover);
  }, [timeframe, metric]);

  const months = currentSet.months;
  const data = metric === 'revenue' ? currentSet.revenue : currentSet.orders;
  const max = metric === 'revenue' ? currentSet.revenueMax : currentSet.ordersMax;
  const yTicks = metric === 'revenue' ? currentSet.revenueYTicks : currentSet.ordersYTicks;

  const width = 580;
  const height = 180;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 24;
  const padBottom = 30;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const points = data.map((val, idx) => ({
    label: months[idx],
    val,
    x: padLeft + (idx / Math.max(1, data.length - 1)) * plotW,
    y: padTop + plotH - (val / max) * plotH
  }));

  const pathD = points.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + plotH} L ${points[0].x} ${padTop + plotH} Z`;

  // Full-grid pointer tracking so hovering anywhere over the chart updates instantly
  const handlePointerMove = (e) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;

    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setHoveredIdx(closestIdx);
  };

  return (
    <div className="relative w-full overflow-visible">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none cursor-crosshair"
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
      >
        <defs>
          <linearGradient id="salesAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D96B27" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#D96B27" stopOpacity="0.0" />
          </linearGradient>
          <filter id="tooltipDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 1, 2, 3].map((i) => {
          const y = padTop + (i / 3) * plotH;
          return (
            <g key={i}>
              <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#F0EBE1" strokeDasharray="3 3" strokeWidth="1" />
              <text x={padLeft - 8} y={y + 3.5} fill="#A8A29E" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="end">
                {yTicks[i]}
              </text>
            </g>
          );
        })}

        {/* Translucent Area Fill */}
        <path d={areaD} fill="url(#salesAreaGrad)" />

        {/* Line Curve */}
        <path d={pathD} fill="none" stroke="#D96B27" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Full-height vertical slice hit areas across the entire grid */}
        {points.map((pt, idx) => {
          const colStep = points.length > 1 ? plotW / (points.length - 1) : plotW;
          const colX = idx === 0 ? padLeft : pt.x - colStep / 2;
          const colW = (idx === 0 || idx === points.length - 1) ? colStep / 2 + 10 : colStep;
          return (
            <rect
              key={`slice-${idx}`}
              x={colX}
              y={padTop - 10}
              width={colW}
              height={plotH + 20}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
            />
          );
        })}

        {/* Active Column Guide & Vertical Line */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <g className="pointer-events-none transition-all duration-150">
            <rect
              x={points[hoveredIdx].x - (plotW / Math.max(1, points.length - 1)) / 2}
              y={padTop}
              width={plotW / Math.max(1, points.length - 1)}
              height={plotH}
              fill="#D96B27"
              fillOpacity="0.04"
              rx="4"
            />
            <line
              x1={points[hoveredIdx].x}
              y1={padTop}
              x2={points[hoveredIdx].x}
              y2={padTop + plotH}
              stroke="#D96B27"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
          </g>
        )}

        {/* Data points & X-axis labels */}
        {points.map((pt, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)}>
              {/* Point glowing ring on hover */}
              {isHovered && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="9"
                  fill="#D96B27"
                  fillOpacity="0.25"
                />
              )}

              {/* Point circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? "5.5" : "3.5"}
                fill={isHovered ? "#B85517" : "#D96B27"}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? "2.5" : "2"}
                className="transition-all duration-150"
              />

              {/* X Axis Month Label */}
              <text
                x={pt.x}
                y={height - 6}
                fill={isHovered ? "#1C1917" : "#78716C"}
                fontSize={isHovered ? "10.5" : "10"}
                fontWeight={isHovered ? "bold" : "600"}
                textAnchor="middle"
                className="transition-colors duration-150"
              >
                {pt.label}
              </text>
            </g>
          );
        })}

        {/* Top-layer Floating Tooltip Badge with drop shadow */}
        {hoveredIdx !== null && points[hoveredIdx] && (() => {
          const pt = points[hoveredIdx];
          const tooltipW = 104;
          const tooltipH = 32;
          const tooltipX = Math.max(padLeft - 10, Math.min(width - padRight - tooltipW + 10, pt.x - tooltipW / 2));
          const tooltipY = Math.max(2, pt.y - tooltipH - 8);

          return (
            <g className="pointer-events-none transition-all duration-150" filter="url(#tooltipDropShadow)">
              <rect
                x={tooltipX}
                y={tooltipY}
                width={tooltipW}
                height={tooltipH}
                rx="8"
                fill="#FFFFFF"
                stroke="#E7E5E4"
                strokeWidth="1.2"
              />
              <circle
                cx={tooltipX + 13}
                cy={tooltipY + tooltipH / 2}
                r="3"
                fill="#D96B27"
              />
              <text
                x={tooltipX + 22}
                y={tooltipY + 12}
                fill="#78716C"
                fontSize="8.5"
                fontWeight="600"
              >
                {pt.label.includes('Q') || pt.label.includes('Week') ? pt.label : `${pt.label} 2026`}
              </text>
              <text
                x={tooltipX + 22}
                y={tooltipY + 24}
                fill="#1C1917"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {metric === 'revenue' ? formatINR(pt.val) : `${pt.val} orders`}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

const CATEGORY_TIMEFRAME_DATA = {
  this_month: {
    totalSales: '₹28.45L',
    categories: [
      { label: 'Rings & Solitaires', pct: 42, color: '#D96B27' },
      { label: 'Necklaces & Sets', pct: 28, color: '#EA580C' },
      { label: 'The Bridal Edit', pct: 18, color: '#A855F7' },
      { label: 'Bracelets & Earrings', pct: 12, color: '#10B981' }
    ]
  },
  last_month: {
    totalSales: '₹24.10L',
    categories: [
      { label: 'Rings & Solitaires', pct: 38, color: '#D96B27' },
      { label: 'Necklaces & Sets', pct: 32, color: '#EA580C' },
      { label: 'The Bridal Edit', pct: 16, color: '#A855F7' },
      { label: 'Bracelets & Earrings', pct: 14, color: '#10B981' }
    ]
  },
  last_quarter: {
    totalSales: '₹76.80L',
    categories: [
      { label: 'Rings & Solitaires', pct: 45, color: '#D96B27' },
      { label: 'Necklaces & Sets', pct: 26, color: '#EA580C' },
      { label: 'The Bridal Edit', pct: 19, color: '#A855F7' },
      { label: 'Bracelets & Earrings', pct: 10, color: '#10B981' }
    ]
  },
  all_time: {
    totalSales: '₹1.84Cr',
    categories: [
      { label: 'Rings & Solitaires', pct: 40, color: '#D96B27' },
      { label: 'Necklaces & Sets', pct: 30, color: '#EA580C' },
      { label: 'The Bridal Edit', pct: 18, color: '#A855F7' },
      { label: 'Bracelets & Earrings', pct: 12, color: '#10B981' }
    ]
  }
};

function CategoryDonutChart({ timeframe = 'this_month' }) {
  const currentSet = CATEGORY_TIMEFRAME_DATA[timeframe] || CATEGORY_TIMEFRAME_DATA.this_month;
  const categories = currentSet.categories;
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPct = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* SVG Donut */}
      <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90 select-none">
          {categories.map((cat, idx) => {
            const isHovered = hoveredCategory === idx;
            const strokeDasharray = `${(cat.pct / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPct / 100) * circumference);
            accumulatedPct += cat.pct;
            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                onMouseEnter={() => setHoveredCategory(idx)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="transition-all duration-200 cursor-pointer"
                opacity={hoveredCategory !== null && !isHovered ? 0.45 : 1}
              />
            );
          })}
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none transition-all">
          {hoveredCategory !== null ? (
            <>
              <span className="font-bold text-base text-stone-900 font-mono leading-tight">{categories[hoveredCategory].pct}%</span>
              <span className="text-[9px] text-[#D96B27] font-bold truncate max-w-[85px]">{categories[hoveredCategory].label}</span>
            </>
          ) : (
            <>
              <span className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-tight">{currentSet.totalSales}</span>
              <span className="text-[10px] text-stone-400 font-medium">Total Sales</span>
            </>
          )}
        </div>
      </div>

      {/* Legend with percentages matching reference */}
      <div className="flex-1 w-full space-y-2 text-xs">
        {categories.map((cat, idx) => {
          const isHovered = hoveredCategory === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCategory(idx)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                isHovered ? 'bg-stone-100 scale-[1.02]' : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform" style={{ backgroundColor: cat.color }} />
                <span className={`transition-colors ${isHovered ? 'font-bold text-stone-900' : 'text-stone-700 font-medium'}`}>
                  {cat.label}
                </span>
              </div>
              <span className="font-bold text-stone-900 font-mono">{cat.pct}%</span>
            </div>
          );
        })}
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
  const [activeTab, setActiveTab] = useState('overview'); // overview | products | orders | coupons | customers | settings
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
  const [salesTimeframe, setSalesTimeframe] = useState('6M');
  const [categoryTimeframe, setCategoryTimeframe] = useState('this_month');
  const [activityFilter, setActivityFilter] = useState('all');

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

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      const [oRes, pRes, aRes] = await Promise.allSettled([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/admin/analytics').then((r) => r.json())
      ]);

      if (oRes.status === 'fulfilled' && Array.isArray(oRes.value)) {
        const localOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
        const combined = [...localOrders, ...oRes.value];
        const unique = combined.filter((v, i, a) => a.findIndex((t) => t.orderNumber === v.orderNumber || t._id === v._id) === i);
        setOrders(unique);
      }
      if (pRes.status === 'fulfilled' && pRes.value.products) {
        setProducts(pRes.value.products);
      }
      if (aRes.status === 'fulfilled' && aRes.value) {
        setAnalytics(aRes.value);
      }
      showToast('Store data synchronized successfully');
    } catch (err) {
      console.error(err);
      showToast('Store data refreshed');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
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

  const SALES_TIMEFRAME_OPTIONS = [
    { value: '6M', label: 'Last 6 Months' },
    { value: '3M', label: 'Last 3 Months' },
    { value: '30D', label: 'Last 30 Days' },
    { value: '1Y', label: 'This Year (2026)' }
  ];

  const CATEGORY_TIMEFRAME_OPTIONS = [
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'all_time', label: 'All Time' }
  ];

  const ACTIVITY_FILTER_OPTIONS = [
    { value: 'all', label: 'All Activities' },
    { value: 'orders', label: 'Orders Placed' },
    { value: 'hallmark', label: 'Hallmark & QC' },
    { value: 'transit', label: 'Dispatches' },
    { value: 'store', label: 'Catalogue & Clients' }
  ];

  const ALL_ACTIVITIES = [
    { id: 1, type: 'orders', icon: ShoppingCart, iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100', title: 'Order Placed (#AUR-984210)', time: '5 mins ago', desc: 'Priya Sharma ordered Celeste Diamond Ring (₹48,900)' },
    { id: 2, type: 'hallmark', icon: ShieldCheck, iconBg: 'bg-purple-50 text-purple-700 border-purple-100', title: 'Hallmark 916 Verified', time: '1 hour ago', desc: 'Batch #BH-8842 passed purity testing' },
    { id: 3, type: 'transit', icon: Truck, iconBg: 'bg-blue-50 text-blue-700 border-blue-100', title: 'Dispatched to Hyderabad', time: 'Yesterday', desc: 'Order #AUR-773190 handed to insured express courier' },
    { id: 4, type: 'store', icon: Package, iconBg: 'bg-orange-50 text-orange-700 border-orange-100', title: 'New Jewellery Added', time: '2 days ago', desc: 'Solara Gold Bracelet added to catalogue' },
    { id: 5, type: 'store', icon: Users, iconBg: 'bg-pink-50 text-pink-700 border-pink-100', title: 'New Customer Registered', time: '2 days ago', desc: 'Anita Verma joined the store' }
  ];

  const filteredActivities = ALL_ACTIVITIES.filter((a) => {
    if (activityFilter === 'all') return true;
    return a.type === activityFilter;
  });

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-white text-[#1E2420] flex flex-col font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] bg-white border border-stone-200 text-stone-900 px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center gap-2.5 animate-fadeIn">
          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[#D96B27]">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* CLEAN LUXURY NAVBAR MATCHING REFERENCE */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between gap-4 shadow-xs z-40">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 group" title="Vishal Jewellery - Go to Home">
            <img
              src="/assets/vishal_jewellery_logo.png"
              alt="Vishal Jewellery"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Center: Global Search Bar matching reference image */}
        <div className="hidden md:flex items-center gap-2 bg-[#FAFAFA] border border-stone-200 rounded-2xl px-3.5 py-1.5 w-72 lg:w-96 text-xs text-stone-500 shadow-xs focus-within:border-amber-400 focus-within:bg-white transition-all">
          <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="bg-transparent outline-none w-full text-xs text-stone-800 placeholder-stone-400"
          />
          <kbd className="text-[10px] font-mono text-stone-400 bg-white border border-stone-200 px-1.5 py-0.5 rounded shadow-2xs select-none">
            /
          </kbd>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 text-xs">
          {/* 1. View Live Store */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl transition-all font-semibold shadow-xs flex items-center gap-2 active:scale-95"
            title="View Live Store"
          >
            <Eye className="w-3.5 h-3.5 text-[#D96B27]" />
            <span className="hidden sm:inline">View Store</span>
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
            className="h-9 px-3.5 sm:px-4 bg-[#D96B27] hover:bg-[#C05619] text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          {/* 3. Live Sync / Refresh Button */}
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="h-9 px-2.5 sm:px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl transition-all font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
            title="Sync live data from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-600 ${isRefreshing ? 'animate-spin text-[#D96B27]' : ''}`} />
            <span className="hidden md:inline font-medium text-[11px]">{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* 4. Notification Bell */}
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
              className="h-9 w-9 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl transition-all font-semibold shadow-xs flex items-center justify-center relative active:scale-95 outline-none cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D96B27] text-white text-[9px] font-bold rounded-full flex items-center justify-center">1</span>
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
                      className="text-[11px] text-[#D96B27] font-medium hover:underline cursor-pointer"
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

          {/* 5. Admin Sign Out Button */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="h-9 px-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl transition-all font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer text-xs"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 text-stone-500 hover:text-[#D96B27]" />
            <span className="font-semibold text-stone-800">Admin</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD LAYOUT - FIXED HEIGHT & ISOLATED SCROLL VIEW */}
      <div className="flex-1 flex overflow-hidden w-full h-[calc(100vh-64px)] relative">
        {/* DESKTOP PINNED CATEGORIZED SIDEBAR MATCHING REFERENCE */}
        <aside className="hidden md:flex flex-col justify-between w-64 flex-shrink-0 h-full bg-white border-r border-stone-200 p-4 select-none z-30">
          <div className="space-y-4 overflow-y-auto pr-0.5">
            {/* 1. TOP FEATURED ITEM: Dashboard */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors duration-150 outline-none select-none cursor-pointer border ${
                activeTab === 'overview'
                  ? 'bg-stone-100 text-[#D96B27] font-bold border-stone-200 shadow-2xs'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium'
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#D96B27] rounded-r-md transition-opacity duration-150 ${
                  activeTab === 'overview' ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-[#D96B27]' : 'text-stone-400'}`} />
              <span>Dashboard</span>
            </button>

            {/* 2. STORE & INVENTORY ITEMS */}
            <div className="space-y-1">
              {[
                { id: 'products', label: 'Catalogue & Stock', icon: ShoppingBag, badge: products.length },
                { id: 'orders', label: 'Orders & Stages', icon: Package, badge: orders.length },
                { id: 'coupons', label: 'Coupons & Offers', icon: Tag, badge: coupons.length },
                { id: 'customers', label: 'Customers', icon: Users, badge: 28 }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors duration-150 outline-none select-none cursor-pointer border ${
                      isActive
                        ? 'bg-stone-100 text-[#D96B27] font-bold border-stone-200 shadow-2xs'
                        : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium'
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#D96B27] rounded-r-md transition-opacity duration-150 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D96B27]' : 'text-stone-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isActive ? 'bg-amber-100 text-[#D96B27]' : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 3. SETTINGS */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('settings')}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors duration-150 outline-none select-none cursor-pointer border ${
                  activeTab === 'settings'
                    ? 'bg-stone-100 text-[#D96B27] font-bold border-stone-200 shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium'
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#D96B27] rounded-r-md transition-opacity duration-150 ${
                    activeTab === 'settings' ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'settings' ? 'text-[#D96B27]' : 'text-stone-400'}`} />
                <span>Store Settings</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN SCROLLABLE VIEWPORT (ONLY THIS CONTAINER SCROLLS) */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-4 sm:p-7 bg-white space-y-6">
          {/* TAB 1: OVERVIEW (EXACT PIXEL-PERFECT RECONSTRUCTION OF REFERENCE) */}
          {activeTab === 'overview' && (
            <div key="overview" className="space-y-6 animate-tabFadeIn">
              {/* HERO: EXECUTIVE STORE SUMMARY BANNER WITH LUXURY JEWELLERY SHOWCASE */}
              <div className="relative overflow-hidden bg-white border border-stone-200 p-6 sm:p-7 rounded-3xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Background Jewellery Image with Soft Gradient Mask */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 md:opacity-90 pointer-events-none overflow-hidden hidden sm:block">
                  <img
                    src="/assets/category_rings.jpg"
                    alt="Fine Jewellery"
                    className="w-full h-full object-cover object-center mix-blend-multiply filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                </div>

                <div className="relative z-10 space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D96B27] bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-md">
                      STORE OPERATIONS ACTIVE
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    Vishal Jewellery Executive Summary
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Store is running smoothly. You have <strong className="text-stone-900 font-semibold">{orders.length} orders</strong> in pipeline (<span className="text-stone-800 font-semibold">{stageCounts.crafting || 1} in workshop</span>, <span className="text-stone-800 font-semibold">{stageCounts.quality_check || 1} in Hallmark certification</span>), and <strong className="text-stone-900 font-semibold">{products.length} active catalogue items</strong>.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-3 text-xs shrink-0">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="h-10 px-4 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
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
                    className="h-10 px-4 bg-[#D96B27] hover:bg-[#C05619] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Jewellery</span>
                  </button>
                </div>
              </div>

              {/* 4 LUXURY METRIC KPI CARDS - PIXEL-PERFECT TO REFERENCE DESIGN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Card 1: Total Revenue */}
                <div className="relative overflow-hidden rounded-[24px] p-5 sm:p-6 bg-gradient-to-b from-[#FFFDFC] via-[#FFF8F3] to-[#FFF1E6] border border-[#FFEDD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  {/* Subtle Ring Watermark Illustration in Bottom Right */}
                  <div className="absolute right-1 bottom-1 w-24 h-24 opacity-[0.14] pointer-events-none flex items-center justify-center">
                    <svg viewBox="0 0 100 100" fill="none" stroke="#EA580C" strokeWidth="2.5" className="w-full h-full">
                      <circle cx="42" cy="54" r="26" />
                      <circle cx="62" cy="46" r="24" />
                      <polygon points="62,16 66,22 58,22" fill="#EA580C" />
                    </svg>
                  </div>

                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-stone-700 block">
                        TOTAL REVENUE
                      </span>
                      <span className="text-[11px] text-stone-400 font-normal mt-0.5 block">
                        All store sales
                      </span>
                    </div>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFE8D6] text-[#EA580C] flex items-center justify-center font-serif font-bold text-lg shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                      ₹
                    </div>
                  </div>

                  <div className="relative z-10 my-2 space-y-1.5">
                    <div className="text-[26px] sm:text-[30px] font-extrabold text-stone-900 tracking-tight leading-none font-sans">
                      {formatINR(analytics?.totalRevenue || 2845000)}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#137333] bg-[#EAF7EE] border border-[#CEEAD6] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <span>↑ 18.4%</span>
                        <span className="font-normal text-stone-500">this month</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-1 -mx-2 -mb-2">
                    <KpiSparkline
                      color="#EA580C"
                      data={[12, 16, 21, 19, 25, 24, 32, 40]}
                      labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today']}
                      formatValue={(v) => `₹${v}L`}
                    />
                  </div>
                </div>

                {/* Card 2: Total Orders */}
                <div className="relative overflow-hidden rounded-[24px] p-5 sm:p-6 bg-gradient-to-b from-[#FFFEFA] via-[#FFFBF2] to-[#FFF4E5] border border-[#FEF3C7] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  {/* Shopping Bag Watermark */}
                  <div className="absolute right-1 bottom-1 w-22 h-22 opacity-[0.12] pointer-events-none flex items-center justify-center">
                    <ShoppingBag className="w-20 h-20 text-[#D97706]" strokeWidth={1.8} />
                  </div>

                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-stone-700 block">
                        TOTAL ORDERS
                      </span>
                      <span className="text-[11px] text-stone-400 font-normal mt-0.5 block">
                        Customer purchases
                      </span>
                    </div>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-base shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10 my-2 space-y-1.5">
                    <div className="text-[26px] sm:text-[30px] font-extrabold text-stone-900 tracking-tight leading-none font-sans">
                      {analytics?.totalOrders || orders.length || 42}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse inline-block" />
                        <span>1 in crafting</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-1 -mx-2 -mb-2">
                    <KpiSparkline
                      color="#EA580C"
                      data={[10, 14, 20, 18, 25, 23, 30, 38]}
                      labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today']}
                      formatValue={(v) => `${v} orders`}
                    />
                  </div>
                </div>

                {/* Card 3: Average Order */}
                <div className="relative overflow-hidden rounded-[24px] p-5 sm:p-6 bg-gradient-to-b from-[#FCFAFF] via-[#FAF5FF] to-[#F3E8FF] border border-[#EDE9FE] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  {/* Faceted Diamond Watermark */}
                  <div className="absolute right-1 bottom-1 w-22 h-22 opacity-[0.13] pointer-events-none flex items-center justify-center">
                    <Gem className="w-20 h-20 text-[#7C3AED]" strokeWidth={1.8} />
                  </div>

                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-stone-700 block">
                        AVERAGE ORDER
                      </span>
                      <span className="text-[11px] text-stone-400 font-normal mt-0.5 block">
                        Ticket size
                      </span>
                    </div>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-base shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10 my-2 space-y-1.5">
                    <div className="text-[26px] sm:text-[30px] font-extrabold text-stone-900 tracking-tight leading-none font-sans">
                      {formatINR(analytics?.avgOrderValue || 67738)}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#6B21A8] bg-[#F3E8FF] border border-[#E9D5FF] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-[#7C3AED]" />
                        <span>Bridal & Solitaires</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-1 -mx-2 -mb-2">
                    <KpiSparkline
                      color="#7C3AED"
                      data={[28, 35, 42, 39, 48, 45, 54, 62]}
                      labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today']}
                      formatValue={(v) => `₹${v},000`}
                    />
                  </div>
                </div>

                {/* Card 4: Customers */}
                <div className="relative overflow-hidden rounded-[24px] p-5 sm:p-6 bg-gradient-to-b from-[#FAFEFB] via-[#F0FDF4] to-[#DCFCE7] border border-[#DCFCE7] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  {/* Users Watermark */}
                  <div className="absolute right-1 bottom-1 w-22 h-22 opacity-[0.12] pointer-events-none flex items-center justify-center">
                    <Users className="w-20 h-20 text-[#059669]" strokeWidth={1.8} />
                  </div>

                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-stone-700 block">
                        CUSTOMERS
                      </span>
                      <span className="text-[11px] text-stone-400 font-normal mt-0.5 block">
                        Registered buyers
                      </span>
                    </div>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center text-base shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10 my-2 space-y-1.5">
                    <div className="text-[26px] sm:text-[30px] font-extrabold text-stone-900 tracking-tight leading-none font-sans">
                      {analytics?.totalCustomers || 28}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#137333] bg-[#EAF7EE] border border-[#CEEAD6] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <span>↑ +4 new</span>
                        <span className="font-normal text-stone-500">this week</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-1 -mx-2 -mb-2">
                    <KpiSparkline
                      color="#059669"
                      data={[10, 14, 18, 16, 22, 25, 27, 34]}
                      labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today']}
                      formatValue={(v) => `${v} users`}
                    />
                  </div>
                </div>
              </div>

              {/* ORDER FULFILMENT PIPELINE (STEPPER CARDS WITH CHEVRONS) */}
              <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs space-y-3.5">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#D96B27]" />
                    <span className="font-bold text-xs text-stone-800">Order Fulfilment Pipeline</span>
                    <span className="text-[11px] text-stone-400 hidden sm:inline">• Click any stage to filter orders</span>
                  </div>
                  <button onClick={() => { setOrderStatusFilter('All'); setActiveTab('orders'); }} className="text-xs text-[#D96B27] font-bold hover:underline flex items-center gap-1 cursor-pointer">
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  {/* Stage 1: Placed */}
                  <button
                    onClick={() => { setOrderStatusFilter('pending'); setActiveTab('orders'); }}
                    className="bg-white hover:bg-stone-50 border border-stone-200 p-3 rounded-xl text-left transition-all active:scale-95 group relative cursor-pointer"
                  >
                    <span className="text-stone-500 block text-[10px] font-medium">1. Placed</span>
                    <strong className="text-lg font-mono text-stone-900 block my-0.5">{stageCounts.pending || 1}</strong>
                    <span className="text-[9px] text-stone-400 font-medium">New order</span>
                  </button>

                  {/* Stage 2: Confirmed */}
                  <button
                    onClick={() => { setOrderStatusFilter('confirmed'); setActiveTab('orders'); }}
                    className="bg-white hover:bg-stone-50 border border-stone-200 p-3 rounded-xl text-left transition-all active:scale-95 group cursor-pointer"
                  >
                    <span className="text-cyan-700 block text-[10px] font-bold">2. Confirmed</span>
                    <strong className="text-lg font-mono text-stone-900 block my-0.5">{stageCounts.confirmed || 0}</strong>
                    <span className="text-[9px] text-cyan-600 font-medium">Verified</span>
                  </button>

                  {/* Stage 3: Crafting */}
                  <button
                    onClick={() => { setOrderStatusFilter('crafting'); setActiveTab('orders'); }}
                    className="bg-white hover:bg-stone-50 border border-stone-200 p-3 rounded-xl text-left transition-all active:scale-95 group cursor-pointer"
                  >
                    <span className="text-amber-800 block text-[10px] font-bold">3. Crafting</span>
                    <strong className="text-lg font-mono text-stone-900 block my-0.5">{stageCounts.crafting || 1}</strong>
                    <span className="text-[9px] text-amber-700 font-medium">In Workshop</span>
                  </button>

                  {/* Stage 4: Hallmark & QC */}
                  <button
                    onClick={() => { setOrderStatusFilter('quality_check'); setActiveTab('orders'); }}
                    className="bg-white hover:bg-stone-50 border border-stone-200 p-3 rounded-xl text-left transition-all active:scale-95 group cursor-pointer"
                  >
                    <span className="text-purple-800 block text-[10px] font-bold">4. Hallmark & QC</span>
                    <strong className="text-lg font-mono text-stone-900 block my-0.5">{stageCounts.quality_check || 1}</strong>
                    <span className="text-[9px] text-purple-700 font-medium">BIS Testing</span>
                  </button>

                  {/* Stage 5: Dispatched */}
                  <button
                    onClick={() => { setOrderStatusFilter('shipped'); setActiveTab('orders'); }}
                    className="bg-white hover:bg-stone-50 border border-stone-200 p-3 rounded-xl text-left transition-all active:scale-95 group cursor-pointer"
                  >
                    <span className="text-blue-800 block text-[10px] font-bold">5. Dispatched</span>
                    <strong className="text-lg font-mono text-stone-900 block my-0.5">{stageCounts.shipped || 1}</strong>
                    <span className="text-[9px] text-blue-700 font-medium">Insured Transit</span>
                  </button>

                  {/* Stage 6: Delivered */}
                  <button
                    onClick={() => { setOrderStatusFilter('delivered'); setActiveTab('orders'); }}
                    className="bg-white hover:bg-stone-50 border border-stone-200 p-3 rounded-xl text-left transition-all active:scale-95 group cursor-pointer"
                  >
                    <span className="text-emerald-800 block text-[10px] font-bold">6. Delivered</span>
                    <strong className="text-lg font-mono text-stone-900 block my-0.5">{stageCounts.delivered || 1}</strong>
                    <span className="text-[9px] text-emerald-700 font-medium">Completed</span>
                  </button>
                </div>
              </div>

              {/* TWO ANALYTICS PANELS: MONTHLY SALES VELOCITY & CATEGORY BREAKDOWN */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left (8 cols): Monthly Sales Velocity Chart */}
                <div id="sales-velocity-section" className="lg:col-span-8 bg-white border border-stone-200 p-6 rounded-2xl shadow-xs space-y-4 scroll-mt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Monthly Sales Velocity</h3>
                      <p className="text-[11px] text-stone-400">Track your revenue and orders growth</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                        <button
                          onClick={() => setChartMetric('revenue')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            chartMetric === 'revenue' ? 'bg-[#D96B27] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          Revenue
                        </button>
                        <button
                          onClick={() => setChartMetric('orders')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            chartMetric === 'orders' ? 'bg-[#D96B27] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          Orders
                        </button>
                      </div>

                      {/* Interactive Timeframe Dropdown */}
                      <DashboardSelectDropdown
                        value={salesTimeframe}
                        options={SALES_TIMEFRAME_OPTIONS}
                        onChange={setSalesTimeframe}
                        minWidth="w-36"
                      />
                    </div>
                  </div>

                  <MonthlySalesVelocityChart metric={chartMetric} timeframe={salesTimeframe} />
                </div>

                {/* Right (4 cols): Category Breakdown Donut Chart */}
                <div className="lg:col-span-4 bg-white border border-stone-200 p-6 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Category Breakdown</h3>
                      <p className="text-[11px] text-stone-400">Sales distribution by category</p>
                    </div>
                    {/* Interactive Category Timeframe Dropdown */}
                    <DashboardSelectDropdown
                      value={categoryTimeframe}
                      options={CATEGORY_TIMEFRAME_OPTIONS}
                      onChange={setCategoryTimeframe}
                      minWidth="w-32"
                    />
                  </div>

                  <CategoryDonutChart timeframe={categoryTimeframe} />
                </div>
              </div>

              {/* BOTTOM ROW: TOP PERFORMING JEWELLERY & LIVE ACTIVITY FEED */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left (7 cols): Top Best Selling Products */}
                <div className="lg:col-span-7 bg-white border border-stone-200 p-6 rounded-2xl shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Top Performing Jewellery</h3>
                      <p className="text-[11px] text-stone-400">Best-selling pieces ranked by client demand</p>
                    </div>
                    <button onClick={() => setActiveTab('products')} className="text-xs text-[#D96B27] font-bold hover:underline cursor-pointer">
                      View Catalogue &rarr;
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-stone-400 uppercase text-[10px] font-bold border-b border-stone-100 pb-2">
                          <th className="pb-2 font-mono">#</th>
                          <th className="pb-2">Product</th>
                          <th className="pb-2">Category</th>
                          <th className="pb-2">Price</th>
                          <th className="pb-2">Stock</th>
                          <th className="pb-2 text-right">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {[
                          { id: 1, name: 'Celeste Diamond Ring', metal: '18K Gold • Solitaire Diamond', category: 'Rings', catColor: 'bg-amber-50 text-amber-800 border-amber-200', price: 44900, stock: '12 in stock', trend: '↑ 12%' },
                          { id: 2, name: 'Aurelia Gold Necklace', metal: '18K Gold • Natural Diamond', category: 'Necklaces', catColor: 'bg-orange-50 text-orange-800 border-orange-200', price: 69900, stock: '8 in stock', trend: '↑ 8%' },
                          { id: 3, name: 'Élan Diamond Earrings', metal: '18K Gold • Natural Diamond', category: 'Earrings', catColor: 'bg-purple-50 text-purple-800 border-purple-200', price: 52000, stock: '15 in stock', trend: '↑ 15%' },
                          { id: 4, name: 'Solara Gold Bracelet', metal: '18K Gold • Natural Diamond', category: 'Bracelets', catColor: 'bg-emerald-50 text-emerald-800 border-emerald-200', price: 58900, stock: '7 in stock', trend: '↑ 10%' }
                        ].map((item) => (
                          <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3 font-mono font-bold text-stone-400">{item.id}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src="/assets/category_rings.jpg"
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded-xl border border-stone-200"
                                />
                                <div>
                                  <span className="font-bold text-stone-900 block">{item.name}</span>
                                  <span className="text-[10px] text-stone-500">{item.metal}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.catColor}`}>
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 font-serif font-bold text-stone-900">
                              {formatINR(item.price)}
                            </td>
                            <td className="py-3 font-semibold text-emerald-700">
                              {item.stock}
                            </td>
                            <td className="py-3 text-right font-bold text-emerald-600">
                              {item.trend}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right (5 cols): Real-Time Live Activity Stream */}
                <div className="lg:col-span-5 bg-white border border-stone-200 p-6 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-stone-900">Live Activity Feed</h3>
                        <p className="text-[11px] text-stone-400">Real-time store & craftsmanship events</p>
                      </div>
                      {/* Interactive Activity Filter Dropdown */}
                      <DashboardSelectDropdown
                        value={activityFilter}
                        options={ACTIVITY_FILTER_OPTIONS}
                        onChange={setActivityFilter}
                        minWidth="w-40"
                      />
                    </div>

                    <div className="space-y-4 pt-3 text-xs">
                      {filteredActivities.length === 0 ? (
                        <div className="text-center py-6 text-stone-400">
                          No events in this category yet.
                        </div>
                      ) : (
                        filteredActivities.map((act) => {
                          const Icon = act.icon;
                          return (
                            <div key={act.id} className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full ${act.iconBg} flex items-center justify-center shrink-0 border`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-baseline">
                                  <span className="font-bold text-stone-900">{act.title}</span>
                                  <span className="text-[10px] text-stone-400">{act.time}</span>
                                </div>
                                <p className="text-[11px] text-stone-500 mt-0.5">{act.desc}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all active:scale-95 text-center mt-2 cursor-pointer"
                  >
                    View All Activity &rarr;
                  </button>
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
            <div id="marketing-promotions-section" key="coupons" className="space-y-6 animate-tabFadeIn scroll-mt-6">
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
