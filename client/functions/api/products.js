// Cloudflare Pages Serverless Function: GET /api/products
// Master product catalogue edge endpoint

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const category = url.searchParams.get("category");
  const metal = url.searchParams.get("metal");
  const stone = url.searchParams.get("stone");
  const search = url.searchParams.get("search");

  // Sample production seed pool
  const products = [
    {
      _id: "card_ring_1",
      sku: "VSH-RNG-001",
      name: "Celeste Solitaire Diamond Ring",
      slug: "celeste-solitaire-diamond-ring",
      category: "Rings",
      metal: "18K Gold",
      stone: "Solitaire Diamond",
      price: 68900,
      discountPrice: 58500,
      rating: 4.9,
      reviewsCount: 64,
      images: ["/assets/category_rings.jpg", "/assets/hero_solitaire_lux.jpg"],
      description: "A breathtaking 1.2 carat brilliant-cut solitaire diamond set in handcrafted 18K yellow gold band."
    },
    {
      _id: "card_bdl_1",
      sku: "VSH-BDL-001",
      name: "Maharani Polki & Colombian Emerald Bridal Set",
      slug: "maharani-polki-colombian-emerald-bridal-set",
      category: "Bridal",
      metal: "22K Gold",
      stone: "Polki",
      price: 485000,
      discountPrice: 435000,
      rating: 5.0,
      reviewsCount: 38,
      images: ["/assets/editorial_bridal.jpg", "/assets/category_bridal.jpg", "/assets/hero_bridal_royal.jpg"],
      description: "A regal royal choker set handcrafted in 22K hallmarked gold with uncut syndicate polki diamonds and glowing Zambian emerald drops."
    },
    {
      _id: "card_men_1",
      sku: "VSH-MEN-001",
      name: "Vanguard Platinum & Diamond Men's Kada",
      slug: "vanguard-platinum-diamond-mens-kada",
      category: "Men's",
      metal: "Platinum",
      stone: "Solitaire Diamond",
      price: 185000,
      discountPrice: 165000,
      rating: 5.0,
      reviewsCount: 34,
      images: ["/assets/category_mens.jpg", "/assets/category_bracelets.jpg"],
      description: "Substantial solid 950 platinum kada accented with channel-set princess-cut natural diamonds for modern gentlemen."
    }
  ];

  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase().replace(/[^a-z]/g, '') === category.toLowerCase().replace(/[^a-z]/g, ''));
  }
  if (metal) {
    filtered = filtered.filter(p => p.metal.toLowerCase().includes(metal.toLowerCase()));
  }
  if (stone) {
    filtered = filtered.filter(p => p.stone.toLowerCase().includes(stone.toLowerCase()));
  }
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
  }

  return new Response(JSON.stringify(filtered), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60"
    }
  });
}
