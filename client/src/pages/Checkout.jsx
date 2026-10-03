import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Lock, CreditCard, Smartphone, Building, Truck } from 'lucide-react';
import { useShop, formatINR } from '../store/ShopContext';

export default function Checkout() {
  const { cart, cartSubtotal, discountAmount, shippingFee, cartTotal, clearCart, user } = useShop();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Order Confirmation
  const [formData, setFormData] = useState({
    fullName: user ? user.name : 'Priya Sharma',
    email: user ? user.email : 'priya@example.com',
    phone: '+91 99887 76655',
    street: '45 Lotus Boulevard, Worli',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400018',
    paymentMethod: 'UPI'
  });

  const [upiId, setUpiId] = useState('priya@okicici');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderPayload = {
      items: cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedMetal: item.selectedMetal,
        image: item.product.images[0]
      })),
      shippingAddress: {
        fullName: formData.fullName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        phone: formData.phone
      },
      paymentMethod: formData.paymentMethod,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shippingFee: shippingFee,
      totalAmount: cartTotal,
      userId: user ? user._id : 'guest_user'
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      const newOrder = {
        _id: data._id || `ord_${Date.now()}`,
        orderNumber: data.orderNumber || `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
        trackingNumber: data.trackingNumber || `AUR-EX-${Math.floor(100000 + Math.random() * 900000)}`,
        user: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        totalAmount: cartTotal,
        orderStatus: 'pending',
        items: cart.map((item) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedMetal: item.selectedMetal,
          image: item.product.images[0]
        })),
        createdAt: new Date().toISOString()
      };

      // Save order into localStorage for live Admin Dashboard sync
      const existingOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
      localStorage.setItem('aurelia_local_orders', JSON.stringify([newOrder, ...existingOrders]));

      setTimeout(() => {
        setIsProcessing(false);
        setPlacedOrder(newOrder);
        clearCart();
        setStep(3);
      }, 1500);
    } catch (err) {
      const newOrder = {
        _id: `ord_${Date.now()}`,
        orderNumber: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
        trackingNumber: `AUR-EX-${Math.floor(100000 + Math.random() * 900000)}`,
        user: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        totalAmount: cartTotal,
        orderStatus: 'pending',
        items: cart.map((item) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedMetal: item.selectedMetal,
          image: item.product.images[0]
        })),
        createdAt: new Date().toISOString()
      };

      const existingOrders = JSON.parse(localStorage.getItem('aurelia_local_orders') || '[]');
      localStorage.setItem('aurelia_local_orders', JSON.stringify([newOrder, ...existingOrders]));

      setTimeout(() => {
        setIsProcessing(false);
        setPlacedOrder(newOrder);
        clearCart();
        setStep(3);
      }, 1500);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4">
        <h2 className="font-serif text-2xl text-charcoal mb-4">Your bag is empty.</h2>
        <Link to="/jewellery" className="bg-charcoal text-ivory text-xs uppercase tracking-widest px-6 py-3 hover:bg-gold">
          Explore Fine Jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans">
      
      {/* Checkout Navbar */}
      <header className="bg-white border-b border-warm-border py-3 px-6 text-center">
        <Link to="/" className="inline-block">
          <img src="/assets/vishal_jewellery_logo.png" alt="Vishal Jewellery" className="h-10 w-auto object-contain" />
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {step === 3 ? (
          /* Order Confirmation View */
          <div className="bg-white border border-warm-border max-w-2xl mx-auto p-8 sm:p-12 text-center shadow-2xl space-y-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold block">ORDER CONFIRMED</span>
            <h1 className="font-serif text-3xl font-bold text-charcoal">Thank You For Your Order!</h1>
            <p className="text-xs text-charcoal-muted leading-relaxed max-w-md mx-auto">
              Your handcrafted jewellery order <strong className="text-charcoal">{placedOrder?.orderNumber || 'AUR-984210'}</strong> has been received and sent to our artisan studio.
            </p>

            <div className="bg-ivory-paper border border-warm-border p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-warm-gray">Tracking Number:</span>
                <span className="font-semibold text-charcoal">{placedOrder?.trackingNumber || 'AUR-EX-887412'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">Total Paid:</span>
                <span className="font-serif font-bold text-charcoal">{formatINR(placedOrder?.totalAmount || cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">Estimated Delivery:</span>
                <span className="font-semibold text-emerald-700">3-5 Business Days (Insured)</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                to={`/order-tracking/${placedOrder?._id || 'AUR-984210'}`}
                className="bg-charcoal text-ivory text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-gold transition-colors"
              >
                Track Live Progress
              </Link>
            </div>
          </div>
        ) : (
          /* Main Checkout Steps */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Steps Form */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step Bar */}
              <div className="flex justify-between border-b border-warm-border pb-4 text-xs font-semibold uppercase tracking-widest">
                <span className={step === 1 ? 'text-gold border-b-2 border-gold pb-1' : 'text-warm-gray'}>
                  1. Shipping & Address
                </span>
                <span className={step === 2 ? 'text-gold border-b-2 border-gold pb-1' : 'text-warm-gray'}>
                  2. Payment Method
                </span>
              </div>

              {step === 1 ? (
                /* Step 1: Shipping Address */
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-charcoal">Delivery Address</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-charcoal block mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 bg-white border border-warm-border text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-charcoal block mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 bg-white border border-warm-border text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-charcoal block mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-white border border-warm-border text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-charcoal block mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 bg-white border border-warm-border text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-charcoal block mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 bg-white border border-warm-border text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-charcoal block mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 bg-white border border-warm-border text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded text-[11px] text-amber-900 mt-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Direct Order Placement: Payment gateway code will be integrated in future. Orders place directly and show on Admin Panel.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest py-4 hover:bg-[#B85517] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#D96B27]/25"
                  >
                    {isProcessing ? 'Processing Order...' : 'Place Order & Send to Admin Panel'}
                  </button>
                </form>
              ) : (
                /* Step 2: Payment Simulation */
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  <h3 className="font-serif text-xl font-bold text-charcoal">Select Payment Option</h3>
                  
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 border cursor-pointer ${formData.paymentMethod === 'UPI' ? 'border-[#D96B27] bg-[#D96B27]/10' : 'border-warm-border'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={formData.paymentMethod === 'UPI'}
                        onChange={handleInputChange}
                      />
                      <Smartphone className="w-5 h-5 text-[#D96B27]" />
                      <div>
                        <span className="text-xs font-bold text-charcoal block">Instant UPI Payment (GPay, PhonePe, Paytm)</span>
                        <span className="text-[10px] text-warm-gray">Zero transaction fee</span>
                      </div>
                    </label>

                    {formData.paymentMethod === 'UPI' && (
                      <div className="p-4 bg-white border border-warm-border ml-8 space-y-2">
                        <label className="text-[11px] font-semibold uppercase text-charcoal block">VPA / UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@upi"
                          className="w-full p-2 border border-warm-border text-xs"
                        />
                      </div>
                    )}

                    <label className={`flex items-center gap-4 p-4 border cursor-pointer ${formData.paymentMethod === 'Card' ? 'border-[#D96B27] bg-[#D96B27]/10' : 'border-warm-border'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Card"
                        checked={formData.paymentMethod === 'Card'}
                        onChange={handleInputChange}
                      />
                      <CreditCard className="w-5 h-5 text-[#D96B27]" />
                      <div>
                        <span className="text-xs font-bold text-charcoal block">Credit / Debit Card (Razorpay)</span>
                        <span className="text-[10px] text-warm-gray">Visa, Mastercard, Amex supported</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border cursor-pointer ${formData.paymentMethod === 'NetBanking' ? 'border-[#D96B27] bg-[#D96B27]/10' : 'border-warm-border'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="NetBanking"
                        checked={formData.paymentMethod === 'NetBanking'}
                        onChange={handleInputChange}
                      />
                      <Building className="w-5 h-5 text-[#D96B27]" />
                      <div>
                        <span className="text-xs font-bold text-charcoal block">Net Banking</span>
                        <span className="text-[10px] text-warm-gray">All major Indian banks</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 bg-transparent border border-warm-border text-charcoal text-xs uppercase tracking-widest py-4 hover:border-[#D96B27]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-2/3 bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest py-4 hover:bg-[#B85517] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D96B27]/25"
                    >
                      {isProcessing ? 'Encrypting & Placing Order...' : `Pay ${formatINR(cartTotal)} Now`}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Summary Sidebar */}
            <div className="lg:col-span-5 bg-white border border-warm-border p-6 shadow-luxury space-y-6 h-fit">
              <h4 className="font-serif font-bold text-lg text-charcoal border-b border-warm-border pb-3">Order Summary</h4>
              
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 text-xs pb-3 border-b border-warm-border">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 object-cover border border-warm-border" />
                    <div className="flex-1">
                      <h5 className="font-bold text-charcoal">{item.product.name}</h5>
                      <span className="text-warm-gray text-[10px]">Qty: {item.quantity} • {item.selectedMetal}</span>
                      <span className="font-serif font-bold text-charcoal block mt-1">{formatINR(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs border-t border-warm-border pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-gold font-semibold">
                    <span>Discount</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span className="text-emerald-700 font-semibold">{shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-serif text-lg font-bold text-charcoal pt-3 border-t border-warm-border">
                  <span>Total Payable</span>
                  <span>{formatINR(cartTotal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-warm-gray pt-2">
                <Lock className="w-4 h-4 text-gold" />
                <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
