// Cloudflare Pages Serverless Function: /api/orders

let ordersStore = [
  {
    _id: "order_1",
    orderNumber: "AUR-984210",
    user: { name: "Priya Sharma", email: "priya@example.com", phone: "+91 99887 76655" },
    totalAmount: 48900,
    orderStatus: "crafting",
    shippingAddress: "Flat 402, Royal Palms, Bandra West, Mumbai 400050",
    items: [{ name: "Celeste Diamond Ring", price: 48900, quantity: 1, metal: "18K Gold", image: "/assets/category_rings.jpg" }],
    createdAt: new Date().toISOString()
  },
  {
    _id: "order_2",
    orderNumber: "AUR-882910",
    user: { name: "Ananya Mehta", email: "ananya@example.com", phone: "+91 98201 22334" },
    totalAmount: 125000,
    orderStatus: "quality_check",
    shippingAddress: "Villa 12, Golf Links, New Delhi 110003",
    items: [{ name: "Royal Heritage Polki Necklace", price: 125000, quantity: 1, metal: "22K Gold", image: "/assets/category_necklaces.jpg" }],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: "order_3",
    orderNumber: "AUR-773190",
    user: { name: "Rohan Kapoor", email: "rohan@example.com", phone: "+91 98112 33445" },
    totalAmount: 89000,
    orderStatus: "shipped",
    shippingAddress: "Penthouse 8, Jubilee Hills, Hyderabad 500033",
    items: [{ name: "Emerald Cut Diamond Tennis Bracelet", price: 89000, quantity: 1, metal: "18K White Gold", image: "/assets/category_bracelets.jpg" }],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: "order_4",
    orderNumber: "AUR-661029",
    user: { name: "Dr. Meera Nambiar", email: "meera.n@example.com", phone: "+91 94471 88990" },
    totalAmount: 195000,
    orderStatus: "delivered",
    shippingAddress: "42 Richmond Road, Bangalore 560025",
    items: [{ name: "Saffron Glow Kundan Bridal Choker", price: 195000, quantity: 1, metal: "24K Gold Plated", image: "/assets/category_bridal.jpg" }],
    createdAt: new Date(Date.now() - 345600000).toISOString()
  }
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id") || url.searchParams.get("orderNumber");

  if (id) {
    const found = ordersStore.find((o) => o._id === id || o.orderNumber === id);
    if (found) return jsonResponse(found);
  }

  return jsonResponse(ordersStore);
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const newOrder = {
      ...body,
      _id: body._id || `order_${Date.now()}`,
      orderNumber: body.orderNumber || `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
      orderStatus: body.orderStatus || 'pending',
      createdAt: new Date().toISOString()
    };
    ordersStore = [newOrder, ...ordersStore];
    return jsonResponse({ success: true, order: newOrder }, 201);
  } catch (err) {
    return jsonResponse({ error: "Invalid order data" }, 400);
  }
}

export async function onRequestPatch(context) {
  try {
    const body = await context.request.json();
    const { orderId, orderStatus } = body;

    if (!orderId || !orderStatus) {
      return jsonResponse({ error: "Missing orderId or orderStatus" }, 400);
    }

    let updatedOrder = null;
    ordersStore = ordersStore.map((o) => {
      if (o._id === orderId || o.orderNumber === orderId) {
        updatedOrder = { ...o, orderStatus };
        return updatedOrder;
      }
      return o;
    });

    return jsonResponse({ success: true, order: updatedOrder || { orderId, orderStatus } });
  } catch (err) {
    return jsonResponse({ error: "Update failed" }, 400);
  }
}

