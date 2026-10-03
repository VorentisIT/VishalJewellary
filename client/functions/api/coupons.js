// Cloudflare Pages Serverless Function: /api/coupons

const DEFAULT_COUPONS = [
  {
    _id: "c1",
    code: "VISHAL10",
    discountPercentage: 10,
    minOrder: 0,
    usageCount: 84,
    trend: "+12% this month",
    active: true
  },
  {
    _id: "c2",
    code: "BRIDAL15",
    discountPercentage: 15,
    minOrder: 100000,
    usageCount: 29,
    trend: "+8% this month",
    active: true
  },
  {
    _id: "c3",
    code: "SOLITAIRE5",
    discountPercentage: 5,
    minOrder: 50000,
    usageCount: 52,
    trend: "+18% this month",
    active: true
  }
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestGet() {
  return jsonResponse(DEFAULT_COUPONS);
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const newCoupon = {
      ...body,
      _id: `c_${Date.now()}`,
      usageCount: 0,
      active: true
    };
    return jsonResponse({ success: true, coupon: newCoupon }, 201);
  } catch (err) {
    return jsonResponse({ error: "Invalid coupon data" }, 400);
  }
}
