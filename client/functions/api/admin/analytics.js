// Cloudflare Pages Serverless Function: /api/admin/analytics

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestGet() {
  return jsonResponse({
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
}
