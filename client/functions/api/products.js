// Cloudflare Pages Serverless Function: /api/products
// Master product catalogue CRUD endpoint

const DEFAULT_PRODUCTS = [
  {
    _id: "prod_1",
    sku: "VSH-RNG-001",
    name: "Celeste Solitaire Diamond Ring",
    slug: "celeste-solitaire-diamond-ring",
    category: "Rings",
    metal: "18K Gold",
    stone: "Solitaire Diamond",
    price: 68900,
    discountPrice: 58500,
    stock: 15,
    rating: 4.9,
    reviewsCount: 64,
    images: ["/assets/category_rings.jpg", "/assets/hero_solitaire_lux.jpg"],
    description: "A breathtaking 1.2 carat brilliant-cut solitaire diamond set in handcrafted 18K yellow gold band."
  },
  {
    _id: "prod_2",
    sku: "VSH-BDL-001",
    name: "Maharani Polki & Colombian Emerald Bridal Set",
    slug: "maharani-polki-colombian-emerald-bridal-set",
    category: "Bridal",
    metal: "22K Gold",
    stone: "Polki",
    price: 485000,
    discountPrice: 435000,
    stock: 4,
    rating: 5.0,
    reviewsCount: 38,
    images: ["/assets/editorial_bridal.jpg", "/assets/category_bridal.jpg", "/assets/hero_bridal_royal.jpg"],
    description: "A regal royal choker set handcrafted in 22K hallmarked gold with uncut syndicate polki diamonds and glowing Zambian emerald drops."
  },
  {
    _id: "prod_3",
    sku: "VSH-MEN-001",
    name: "Vanguard Platinum & Diamond Men's Kada",
    slug: "vanguard-platinum-diamond-mens-kada",
    category: "Men's",
    metal: "Platinum",
    stone: "Solitaire Diamond",
    price: 185000,
    discountPrice: 165000,
    stock: 8,
    rating: 5.0,
    reviewsCount: 34,
    images: ["/assets/category_mens.jpg", "/assets/category_bracelets.jpg"],
    description: "Substantial solid 950 platinum kada accented with channel-set princess-cut natural diamonds for modern gentlemen."
  },
  {
    _id: "prod_4",
    sku: "VSH-NCK-001",
    name: "Royal Heritage Polki Necklace",
    slug: "royal-heritage-polki-necklace",
    category: "Necklaces",
    metal: "22K Gold",
    stone: "Polki",
    price: 125000,
    discountPrice: 112000,
    stock: 6,
    rating: 4.9,
    reviewsCount: 45,
    images: ["/assets/hero_royal_polki.jpg", "/assets/category_necklaces.jpg"],
    description: "Handcrafted 22K BIS hallmarked gold polki choker with heritage filigree work."
  },
  {
    _id: "prod_5",
    sku: "VSH-BRC-001",
    name: "Emerald Cut Diamond Tennis Bracelet",
    slug: "emerald-cut-diamond-tennis-bracelet",
    category: "Bracelets",
    metal: "18K White Gold",
    stone: "Diamond",
    price: 89000,
    discountPrice: 79900,
    stock: 12,
    rating: 4.8,
    reviewsCount: 29,
    images: ["/assets/category_bracelets.jpg"],
    description: "Endless line of perfectly matched emerald-cut certified diamonds."
  }
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");

  let result = [...DEFAULT_PRODUCTS];

  if (category && category !== "All") {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }

  return jsonResponse(result);
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const newProduct = {
      ...body,
      _id: body._id || `prod_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return jsonResponse({ success: true, product: newProduct }, 201);
  } catch (err) {
    return jsonResponse({ error: "Invalid product data" }, 400);
  }
}

export async function onRequestPut(context) {
  try {
    const body = await context.request.json();
    return jsonResponse({ success: true, product: body });
  } catch (err) {
    return jsonResponse({ error: "Update failed" }, 400);
  }
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");
  return jsonResponse({ success: true, deletedId: id });
}
