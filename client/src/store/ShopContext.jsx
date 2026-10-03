import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const parseJwt = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const createJwtToken = (payload, expiresInSeconds = 86400) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const nowSec = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: nowSec,
    exp: nowSec + expiresInSeconds
  };
  
  const b64Url = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedHeader = b64Url(header);
  const encodedPayload = b64Url(fullPayload);
  const mockSignature = b64Url({ sig: 'vishal_jwt_sec_' + fullPayload.exp });
  
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

export const ShopProvider = ({ children }) => {
  // Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('vishal_cart') || localStorage.getItem('aurelia_cart');
    return saved ? JSON.parse(saved) : [
      {
        _id: 'cart_item_1',
        product: {
          _id: 'mem_prod_1',
          name: 'Celeste Diamond Ring',
          slug: 'celeste-diamond-ring',
          price: 48900,
          metal: '18K Gold',
          images: ['/assets/category_rings.jpg'],
          category: 'Rings'
        },
        quantity: 1,
        selectedSize: '7',
        selectedMetal: '18K Gold'
      }
    ];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('vishal_wishlist') || localStorage.getItem('aurelia_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Auth User State with Session Expiry Check on initialization
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vishal_user') || localStorage.getItem('aurelia_user');
    if (!saved) return null;
    try {
      const parsedUser = JSON.parse(saved);
      let expiresAt = parsedUser.expiresAt;
      if (parsedUser.token) {
        const decoded = parseJwt(parsedUser.token);
        if (decoded && decoded.exp) {
          expiresAt = decoded.exp * 1000;
        }
      }
      if (expiresAt && Date.now() >= expiresAt) {
        localStorage.removeItem('vishal_user');
        localStorage.removeItem('aurelia_user');
        return null;
      }
      return parsedUser;
    } catch (e) {
      return null;
    }
  });

  // Applied Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Quick View Modal Product
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Is Cart Drawer Open
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('vishal_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vishal_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('vishal_user');
      localStorage.removeItem('aurelia_user');
      return;
    }

    // Validate JWT token expiry
    let expiresAt = user.expiresAt;
    if (user.token) {
      const decoded = parseJwt(user.token);
      if (decoded && decoded.exp) {
        expiresAt = decoded.exp * 1000;
      }
    }

    const now = Date.now();
    if (expiresAt && now >= expiresAt) {
      setUser(null);
      localStorage.removeItem('vishal_user');
      localStorage.removeItem('aurelia_user');
      setSessionExpiredMsg('Your session has expired. Please sign in to continue.');
      return;
    }

    localStorage.setItem('vishal_user', JSON.stringify(user));
    localStorage.setItem('aurelia_user', JSON.stringify(user));

    // Schedule real-time auto-logout timer for remaining token life
    if (expiresAt) {
      const remainingTime = expiresAt - now;
      const timer = setTimeout(() => {
        setUser(null);
        localStorage.removeItem('vishal_user');
        localStorage.removeItem('aurelia_user');
        setSessionExpiredMsg('Your session has expired. Please sign in to continue.');
      }, Math.max(1000, remainingTime));

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Tab switch & focus check for session expiration
  useEffect(() => {
    const checkExpiryOnFocus = () => {
      const savedUserStr = localStorage.getItem('vishal_user') || localStorage.getItem('aurelia_user');
      if (savedUserStr) {
        try {
          const savedUser = JSON.parse(savedUserStr);
          let expiresAt = savedUser.expiresAt;
          if (savedUser.token) {
            const decoded = parseJwt(savedUser.token);
            if (decoded && decoded.exp) {
              expiresAt = decoded.exp * 1000;
            }
          }
          if (expiresAt && Date.now() >= expiresAt) {
            setUser(null);
            localStorage.removeItem('vishal_user');
            localStorage.removeItem('aurelia_user');
            setSessionExpiredMsg('Your session has expired. Please sign in again.');
          }
        } catch (e) {}
      }
    };

    window.addEventListener('focus', checkExpiryOnFocus);
    document.addEventListener('visibilitychange', checkExpiryOnFocus);
    return () => {
      window.removeEventListener('focus', checkExpiryOnFocus);
      document.removeEventListener('visibilitychange', checkExpiryOnFocus);
    };
  }, []);

  // Cart Functions
  const addToCart = (product, quantity = 1, selectedSize = '7', selectedMetal = '18K Gold') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product._id === product._id && item.selectedSize === selectedSize && item.selectedMetal === selectedMetal
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          _id: `cart_${Date.now()}`,
          product,
          quantity,
          selectedSize,
          selectedMetal
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item._id !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p._id === productId);
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 25000;
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 500;
  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercentage) / 100 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // User Auth
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aurelia_user');
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        shippingFee,
        discountAmount,
        cartTotal,
        freeShippingThreshold,
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        login,
        logout,
        appliedCoupon,
        setAppliedCoupon,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        sessionExpiredMsg,
        setSessionExpiredMsg
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
