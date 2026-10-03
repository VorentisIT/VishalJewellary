import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Truck, ShieldCheck, Gem, Package, Home } from 'lucide-react';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { formatINR } from '../store/ShopContext';

const steps = [
  { id: 'pending', label: 'Order Placed', desc: 'Order received & payment confirmed.', icon: CheckCircle2 },
  { id: 'confirmed', label: 'Confirmed', desc: 'Order verified by concierge team.', icon: CheckCircle2 },
  { id: 'crafting', label: 'Crafting & Setting', desc: 'Master goldsmith setting gemstones.', icon: Gem },
  { id: 'quality_check', label: 'Quality & BIS Hallmark', desc: 'Microscopic inspection & BIS Hallmarking.', icon: ShieldCheck },
  { id: 'shipped', label: 'Insured Shipping', desc: 'Handed to express courier pouch.', icon: Package },
  { id: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier associate en route to doorstep.', icon: Truck },
  { id: 'delivered', label: 'Delivered', desc: 'Hand delivered to recipient.', icon: Home }
];

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  const loadOrderData = () => {
    // 1. Try to find in localStorage
    const localOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
    const match = localOrders.find((o) => o._id === orderId || o.orderNumber === orderId);

    if (match) {
      setOrder(match);
      return;
    }

    // 2. Try fetching from /api/orders
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        const allOrders = Array.isArray(data) ? data : [];
        const serverMatch = allOrders.find((o) => o._id === orderId || o.orderNumber === orderId);

        if (serverMatch) {
          setOrder(serverMatch);
        } else if (localOrders.length > 0) {
          setOrder(localOrders[0]);
        } else {
          // Fallback Default Order
          setOrder({
            _id: orderId || 'AUR-984210',
            orderNumber: orderId || 'AUR-984210',
            trackingNumber: 'AUR-EX-887412',
            orderStatus: 'crafting',
            createdAt: new Date().toISOString(),
            totalAmount: 48900,
            items: [
              {
                name: 'Celeste Diamond Ring',
                price: 48900,
                quantity: 1,
                selectedMetal: '18K Gold',
                selectedSize: '7',
                image: '/assets/category_rings.jpg'
              }
            ],
            shippingAddress: {
              fullName: 'Priya Sharma',
              street: '45 Lotus Boulevard, Worli',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400018'
            }
          });
        }
      })
      .catch(() => {
        if (localOrders.length > 0) {
          setOrder(localOrders[0]);
        } else {
          setOrder({
            _id: orderId || 'AUR-984210',
            orderNumber: orderId || 'AUR-984210',
            trackingNumber: 'AUR-EX-887412',
            orderStatus: 'crafting',
            createdAt: new Date().toISOString(),
            totalAmount: 48900,
            items: [
              {
                name: 'Celeste Diamond Ring',
                price: 48900,
                quantity: 1,
                selectedMetal: '18K Gold',
                selectedSize: '7',
                image: '/assets/category_rings.jpg'
              }
            ],
            shippingAddress: {
              fullName: 'Priya Sharma',
              street: '45 Lotus Boulevard, Worli',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400018'
            }
          });
        }
      });
  };

  useEffect(() => {
    loadOrderData();

    // Listen for real-time status updates from Admin Dashboard
    const handleUpdate = () => {
      loadOrderData();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('aurelia_order_status_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('aurelia_order_status_updated', handleUpdate);
    };
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F5EE] flex items-center justify-center">
        <p className="font-serif text-xl text-[#102C24]">Loading live order status...</p>
      </div>
    );
  }

  const currentStatusIndex = steps.findIndex((s) => s.id === order.orderStatus);
  const activeIdx = currentStatusIndex > -1 ? currentStatusIndex : 2; // Default to 'crafting' for demo

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <Link to="/account" className="inline-flex items-center gap-2 text-xs font-medium text-warm-gray hover:text-gold mb-6">
          Back to Account Orders
        </Link>

        {/* Order Header Info */}
        <div className="bg-white border border-warm-border p-6 shadow-luxury mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold block">
              LIVE CRAFTSMANSHIP & SHIPPING TRACKER
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-warm-gray mt-1">
              AWB Tracking ID: <strong className="text-charcoal font-mono">{order.trackingNumber}</strong>
            </p>
          </div>

          <div className="bg-gold-light border border-gold-border px-4 py-2 text-right rounded-sm">
            <span className="text-[10px] uppercase font-semibold text-charcoal block">Current Status</span>
            <span className="font-serif text-lg font-bold text-gold capitalize">
              {steps[activeIdx]?.label || 'Crafting in Progress'}
            </span>
          </div>
        </div>

        {/* Visual Timeline Bar */}
        <div className="bg-white border border-warm-border p-6 sm:p-10 shadow-luxury mb-8">
          <h3 className="font-serif font-bold text-lg text-charcoal mb-8 border-b border-warm-border pb-3">
            7-Stage Production & Logistics Timeline
          </h3>

          <div className="relative">
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-warm-border before:z-0">
              {steps.map((step, idx) => {
                const isCompleted = idx <= activeIdx;
                const isCurrent = idx === activeIdx;
                const IconComponent = step.icon;

                return (
                  <div key={step.id} className="relative z-10 flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border text-xs transition-colors ${
                        isCurrent
                          ? 'bg-gold text-white border-gold ring-4 ring-gold/20 font-bold'
                          : isCompleted
                          ? 'bg-charcoal text-ivory border-charcoal'
                          : 'bg-ivory-paper text-warm-gray border-warm-border'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`font-serif font-bold text-base ${isCompleted ? 'text-charcoal' : 'text-warm-gray'}`}>
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            Active Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-muted mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details & Items Card */}
        <div className="bg-white border border-warm-border p-6 shadow-luxury grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <h4 className="font-serif font-bold text-sm text-charcoal border-b border-warm-border pb-2 mb-3">Item Details</h4>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img src={item.image || '/assets/category_rings.jpg'} alt={item.name} className="w-12 h-12 object-cover border" />
                <div>
                  <h5 className="font-bold text-charcoal">{item.name}</h5>
                  <p className="text-warm-gray">{item.selectedMetal} • Size {item.selectedSize} • Qty {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-serif font-bold text-sm text-charcoal border-b border-warm-border pb-2 mb-3">Delivery Destination</h4>
            <p className="font-semibold text-charcoal">{order.shippingAddress?.fullName}</p>
            <p className="text-warm-gray">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
            <p className="text-warm-gray">{order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
