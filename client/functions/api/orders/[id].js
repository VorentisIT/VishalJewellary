// Cloudflare Pages Serverless Function: /api/orders/[id]

export async function onRequestGet(context) {
  const id = context.params.id;
  
  // Forward to /api/orders?id=...
  const url = new URL(context.request.url);
  const targetUrl = `${url.origin}/api/orders?id=${encodeURIComponent(id)}`;
  
  const res = await fetch(targetUrl);
  const data = await res.json();
  
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function onRequestPatch(context) {
  const id = context.params.id;
  const body = await context.request.json();
  
  const url = new URL(context.request.url);
  const targetUrl = `${url.origin}/api/orders`;
  
  const res = await fetch(targetUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: id, orderStatus: body.orderStatus })
  });
  
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
