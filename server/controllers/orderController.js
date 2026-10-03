import Order from '../models/Order.js';
import mongoose from 'mongoose';
import { inMemoryOrders } from '../server.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, discount, shippingFee, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street) {
      return res.status(400).json({ message: 'Valid shipping address is required' });
    }

    const orderNumber = 'AUR-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = 'AUR-EX-' + Math.floor(100000 + Math.random() * 900000);

    const now = new Date();
    const initialTimeline = [
      { status: 'pending', label: 'Order Placed', description: 'Your order has been placed successfully.', date: now, isCompleted: true },
      { status: 'confirmed', label: 'Confirmed', description: 'Order confirmed & sent to artisan studio.', date: new Date(now.getTime() + 1000 * 60 * 30), isCompleted: true },
      { status: 'crafting', label: 'Crafting & Setting', description: 'Master goldsmith setting gemstones.', date: null, isCompleted: false },
      { status: 'quality_check', label: 'Quality & BIS Hallmark', description: 'IGI Diamond & BIS Hallmarking inspection.', date: null, isCompleted: false },
      { status: 'shipped', label: 'Insured Shipping', description: 'Handed to premium courier partner.', date: null, isCompleted: false },
      { status: 'out_for_delivery', label: 'Out for Delivery', description: 'Valuable delivery associate en route.', date: null, isCompleted: false },
      { status: 'delivered', label: 'Delivered', description: 'Hand delivered to your doorstep.', date: null, isCompleted: false }
    ];

    const orderPayload = {
      orderNumber,
      user: req.user ? req.user._id : 'mem_user_guest',
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'Online Payment',
      paymentStatus: 'completed',
      trackingNumber,
      orderStatus: 'confirmed',
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      shippingFee: Number(shippingFee) || 0,
      totalAmount: Number(totalAmount) || 0,
      timeline: initialTimeline
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const order = new Order(orderPayload);
        const createdOrder = await order.save();
        return res.status(201).json(createdOrder);
      } catch (dbErr) {
        // Fallback if db write times out
      }
    }

    const memoryOrder = {
      _id: `mem_order_${Date.now()}`,
      ...orderPayload,
      createdAt: new Date().toISOString()
    };
    inMemoryOrders.unshift(memoryOrder);
    res.status(201).json(memoryOrder);
  } catch (error) {
    res.status(500).json({ message: 'Unable to process order. Please verify your details and try again.' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        return res.json(orders);
      } catch (err) {}
    }

    const filtered = (inMemoryOrders || []).filter(o => !o.user || o.user.toString() === userId.toString());
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve your orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        order = await Order.findById(id).populate('user', 'name email');
      } catch (err) {}
    }

    if (!order && inMemoryOrders) {
      order = inMemoryOrders.find(o => o._id === id || o.orderNumber === id);
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Access control: Only order owner or admin/staff may view order details
    const currentUserId = req.user ? req.user._id.toString() : '';
    const orderUserId = order.user ? (order.user._id ? order.user._id.toString() : order.user.toString()) : '';
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'staff');

    if (!isAdmin && orderUserId && orderUserId !== currentUserId) {
      return res.status(403).json({ message: 'Access denied: You do not have permission to view this order.' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve order details' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        return res.json(orders);
      } catch (err) {}
    }
    res.json(inMemoryOrders || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders list' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const order = await Order.findById(id);
      if (order) {
        if (orderStatus) order.orderStatus = orderStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        const statusOrderKeys = ['pending', 'confirmed', 'crafting', 'quality_check', 'shipped', 'out_for_delivery', 'delivered'];
        const currentIndex = statusOrderKeys.indexOf(order.orderStatus);

        order.timeline.forEach((step, idx) => {
          if (idx <= currentIndex) {
            step.isCompleted = true;
            if (!step.date) step.date = new Date();
          }
        });

        const updatedOrder = await order.save();
        return res.json(updatedOrder);
      }
    }

    // In-memory fallback
    const memOrder = (inMemoryOrders || []).find(o => o._id === id || o.orderNumber === id);
    if (memOrder) {
      if (orderStatus) memOrder.orderStatus = orderStatus;
      if (trackingNumber) memOrder.trackingNumber = trackingNumber;
      return res.json(memOrder);
    }

    return res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

