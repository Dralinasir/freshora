// src/app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  Menu,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  oldPrice?: number;
  emoji: string;
  badge?: string;
  stock: number;
  description: string;
};

type CartLine = {
  productId: string;
  quantity: number;
};

const categories = [
  { name: "Fruits & Vegetables", emoji: "🥑", count: "Fresh daily" },
  { name: "Dairy & Eggs", emoji: "🥛", count: "Farm fresh" },
  { name: "Rice & Pulses", emoji: "🌾", count: "Pantry staples" },
  { name: "Oil & Spices", emoji: "🫒", count: "Kitchen basics" },
  { name: "Snacks & Drinks", emoji: "🥤", count: "For every mood" },
  { name: "Home Essentials", emoji: "🧼", count: "Everyday care" },
];

const products: Product[] = [
  {
    id: "p1",
    name: "Fresh Red Apples",
    category: "Fruits & Vegetables",
    size: "1 kg",
    price: 420,
    oldPrice: 480,
    emoji: "🍎",
    badge: "Save 13%",
    stock: 35,
    description: "Crisp, sweet apples for everyday snacking.",
  },
  {
    id: "p2",
    name: "Organic Bananas",
    category: "Fruits & Vegetables",
    size: "1 dozen",
    price: 230,
    emoji: "🍌",
    stock: 42,
    description: "Naturally sweet bananas for breakfast and snacks.",
  },
  {
    id: "p3",
    name: "Farm Fresh Tomatoes",
    category: "Fruits & Vegetables",
    size: "1 kg",
    price: 160,
    oldPrice: 190,
    emoji: "🍅",
    badge: "Popular",
    stock: 28,
    description: "Juicy tomatoes for salads, curries and sauces.",
  },
  {
    id: "p4",
    name: "Green Avocados",
    category: "Fruits & Vegetables",
    size: "2 pieces",
    price: 390,
    emoji: "🥑",
    stock: 12,
    description: "Creamy avocados for toast and salads.",
  },
  {
    id: "p5",
    name: "Farm Fresh Milk",
    category: "Dairy & Eggs",
    size: "1 litre",
    price: 250,
    emoji: "🥛",
    badge: "Daily pick",
    stock: 50,
    description: "A chilled dairy staple for everyday meals.",
  },
  {
    id: "p6",
    name: "Free Range Eggs",
    category: "Dairy & Eggs",
    size: "12 pack",
    price: 360,
    emoji: "🥚",
    stock: 30,
    description: "Eggs for breakfast, baking and cooking.",
  },
  {
    id: "p7",
    name: "Premium Basmati Rice",
    category: "Rice & Pulses",
    size: "1 kg",
    price: 390,
    oldPrice: 430,
    emoji: "🍚",
    badge: "Save 9%",
    stock: 65,
    description: "Long-grain basmati rice for biryani and pulao.",
  },
  {
    id: "p8",
    name: "Red Lentils (Masoor)",
    category: "Rice & Pulses",
    size: "1 kg",
    price: 285,
    emoji: "🫘",
    stock: 48,
    description: "A pantry essential for comforting daal.",
  },
  {
    id: "p9",
    name: "Extra Virgin Olive Oil",
    category: "Oil & Spices",
    size: "500 ml",
    price: 1150,
    emoji: "🫒",
    stock: 18,
    description: "Olive oil for dressings and everyday cooking.",
  },
  {
    id: "p10",
    name: "Ground Turmeric",
    category: "Oil & Spices",
    size: "100 g",
    price: 120,
    emoji: "🟡",
    stock: 70,
    description: "Aromatic turmeric for adding colour and flavour.",
  },
  {
    id: "p11",
    name: "Orange Juice",
    category: "Snacks & Drinks",
    size: "1 litre",
    price: 310,
    emoji: "🧃",
    stock: 24,
    description: "A refreshing citrus drink for any time.",
  },
  {
    id: "p12",
    name: "Potato Crisps",
    category: "Snacks & Drinks",
    size: "150 g",
    price: 180,
    emoji: "🥔",
    stock: 36,
    description: "Crunchy potato crisps for snack breaks.",
  },
  {
    id: "p13",
    name: "Dishwashing Liquid",
    category: "Home Essentials",
    size: "500 ml",
    price: 280,
    emoji: "🧴",
    stock: 20,
    description: "An everyday essential for cleaning dishes.",
  },
  {
    id: "p14",
    name: "Laundry Detergent",
    category: "Home Essentials",
    size: "1 kg",
    price: 520,
    emoji: "🧺",
    stock: 15,
    description: "Laundry detergent for everyday clothes washing.",
  },
  {
    id: "p15",
    name: "Fresh Spinach",
    category: "Fruits & Vegetables",
    size: "1 bunch",
    price: 90,
    emoji: "🥬",
    stock: 17,
    description: "Leafy greens for saag, soups and salads.",
  },
  {
    id: "p16",
    name: "Whole Wheat Flour",
    category: "Rice & Pulses",
    size: "5 kg",
    price: 790,
    emoji: "🌾",
    stock: 40,
    description: "Whole wheat flour for everyday roti and chapati.",
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Products");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("freshora-cart");
      const savedWishlist = localStorage.getItem("freshora-wishlist");

      if (savedCart) setCart(JSON.parse(savedCart) as CartLine[]);
      if (savedWishlist)
        setWishlist(JSON.parse(savedWishlist) as string[]);
    } catch {
      // Ignore invalid browser storage.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("freshora-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("freshora-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          category === "All Products" ||
          product.category === category;

        const term = query.trim().toLowerCase();

        const matchesSearch =
          !term ||
          `${product.name} ${product.category} ${product.description}`
            .toLowerCase()
            .includes(term);

        return matchesCategory && matchesSearch;
      }),
    [category, query],
  );

  const cartDetails = cart
    .map((line) => {
      const product = products.find(
        (item) => item.id === line.productId,
      );

      return product
        ? { ...product, quantity: line.quantity }
        : null;
    })
    .filter(
      (
        item,
      ): item is Product & { quantity: number } => item !== null,
    );

  const cartCount = cartDetails.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const subtotal = cartDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function addToCart(product: Product) {
    if (product.stock < 1) return;

    setCart((current) => {
      const existing = current.find(
        (item) => item.productId === product.id,
      );

      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock,
                ),
              }
            : item,
        );
      }

      return [
        ...current,
        { productId: product.id, quantity: 1 },
      ];
    });

    setCheckoutMessage("");
  }

  function updateQuantity(id: string, delta: number) {
    const product = products.find((item) => item.id === id);

    setCart((current) =>
      current
        .map((item) =>
          item.productId === id
            ? {
                ...item,
                quantity: Math.min(
                  product?.stock ?? 99,
                  item.quantity + delta,
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function toggleWishlist(id: string) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }

    setNewsletterMessage(
      "Thank you! Connect an email service to enable subscriptions.",
    );
    setEmail("");
  }

   
async function placeOrder() {
  if (!cartDetails.length) return;

  const getInput = (id: string) =>
    document.getElementById(id) as HTMLInputElement | null;

  const customerName =
    getInput("checkout-name")?.value.trim() ?? "";
  const phone =
    getInput("checkout-phone")?.value.trim() ?? "";
  const address =
    getInput("checkout-address")?.value.trim() ?? "";
  const city =
    getInput("checkout-city")?.value.trim() ?? "";
  const notes =
    getInput("checkout-notes")?.value.trim() ?? "";

  if (!customerName || !phone || !address || !city) {
    setCheckoutMessage(
      "Please enter your name, phone number, address and city."
    );
    return;
  }

  setCheckoutLoading(true);
  setCheckoutMessage("");

  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName,
        phone,
        address,
        city,
        notes,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Unable to place your order."
      );
    }

    setCheckoutMessage(
      `Order placed successfully! Order number: ${result.orderNumber}. Payment: Cash on Delivery.`
    );

    setCart([]);
    localStorage.removeItem("freshora-cart");
  } catch (error) {
    setCheckoutMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setCheckoutLoading(false);
  }
}


  return (
    <>
      <div className="topbar">
        Fresh picks, everyday value — grocery essentials for your home
      </div>

      <header className="header">
        <div className="container header-inner">
          <a className="logo" href="#" aria-label="Freshora home">
            <span className="logo-mark">
              <Leaf size={22} />
            </span>
            freshora<span className="logo-dot">.</span>
          </a>

          <form
            className="search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              document
                .getElementById("shop")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Search size={18} />
            <input
              aria-label="Search groceries"
              placeholder="Search fruits, milk, rice..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="icon-button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={16} />
              </button>
            )}
          </form>

          <div className="header-actions">
            <button
              className="text-action"
              onClick={() =>
                document
                  .getElementById("shop")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Heart size={19} />
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="cart-pill">{wishlist.length}</span>
              )}
            </button>

            <button
              className="text-action"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={19} />
              <span>Cart</span>
              <span className="cart-pill">{cartCount}</span>
            </button>

            <button
              className="icon-button mobile-toggle"
              aria-label="Toggle mobile menu"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Menu size={21} />
            </button>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <div className="container nav-inner">
            <a href="#categories">
              Shop by category <ChevronDown size={13} />
            </a>
            <a
              href="#shop"
              onClick={() => setCategory("All Products")}
            >
              All products
            </a>
            <a
              href="#shop"
              onClick={() => setCategory("Fruits & Vegetables")}
            >
              Fresh produce
            </a>
            <a
              href="#shop"
              onClick={() => setCategory("Dairy & Eggs")}
            >
              Dairy & eggs
            </a>
            <a
              href="#shop"
              onClick={() => setCategory("Rice & Pulses")}
            >
              Pantry staples
            </a>
            <a href="#offers">Offers</a>
          </div>
        </nav>

        {mobileMenu && (
          <div className="container mobile-menu">
            <a href="#categories" onClick={() => setMobileMenu(false)}>
              Categories
            </a>
            <a href="#shop" onClick={() => setMobileMenu(false)}>
              Shop all
            </a>
            <a href="#faq" onClick={() => setMobileMenu(false)}>
              FAQs
            </a>
          </div>
        )}
      </header>

      <main>
        <div className="container">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="eyebrow">Good food, good days</div>

              <h1 id="hero-title">Freshness for every day.</h1>

              <p>
                Your everyday grocery essentials, thoughtfully picked
                and ready for your kitchen. Shop fresh favourites and
                pantry must-haves in one place.
              </p>

              <a className="btn btn-primary" href="#shop">
                Shop groceries <ArrowRight size={17} />
              </a>

              <div className="hero-caption">
                Fresh choices. Clear prices. Everyday essentials.
              </div>
            </div>

            <div className="hero-visual">
              <img
                className="hero-photo"
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=85"
                alt="Fresh vegetables at a grocery market"
              />

              <div className="hero-note">
                <strong>🥬 Fresh picks</strong>
                <span>For your everyday table</span>
              </div>
            </div>
          </section>

          <section className="benefits" aria-label="Store features">
            <div className="benefit">
              <div className="benefit-icon">
                <Truck size={20} />
              </div>
              <div>
                <strong>Delivery options</strong>
                <span>Based on your area</span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong>Secure shopping</strong>
                <span>Checkout setup required</span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                <PackageCheck size={20} />
              </div>
              <div>
                <strong>Carefully packed</strong>
                <span>Everyday essentials</span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                <Check size={20} />
              </div>
              <div>
                <strong>Easy browsing</strong>
                <span>Shop at your own pace</span>
              </div>
            </div>
          </section>

          <section className="section" id="categories">
            <div className="section-heading">
              <div>
                <h2>Shop by category</h2>
                <p>Find the things you need, a little faster.</p>
              </div>

              <a
                className="link-green"
                href="#shop"
                onClick={() => setCategory("All Products")}
              >
                Explore all <ArrowRight size={14} />
              </a>
            </div>

            <div className="categories">
              {categories.map((item) => (
                <button
                  className="category-card"
                  key={item.name}
                  onClick={() => {
                    setCategory(item.name);
                    document
                      .getElementById("shop")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div className="category-emoji">{item.emoji}</div>
                  <strong>{item.name}</strong>
                  <span>{item.count}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="section" id="shop">
            <div className="section-heading">
              <div>
                <h2>
                  {query
                    ? "Search results"
                    : category === "All Products"
                      ? "Popular picks"
                      : category}
                </h2>
                <p>
                  {filteredProducts.length} products · Prices in PKR
                </p>
              </div>

              <button
                className="link-green reset-button"
                onClick={() => {
                  setCategory("All Products");
                  setQuery("");
                }}
              >
                View all <ArrowRight size={14} />
              </button>
            </div>

            <div className="filter-row">
              {[
                "All Products",
                ...categories.map((item) => item.name),
              ].map((name) => (
                <button
                  key={name}
                  className={`chip ${category === name ? "active" : ""}`}
                  onClick={() => setCategory(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap">
                      <span
                        className="product-emoji"
                        aria-hidden="true"
                      >
                        {product.emoji}
                      </span>

                      {product.badge && (
                        <span className="tag">{product.badge}</span>
                      )}

                      <button
                        className="wish"
                        aria-label={
                          wishlist.includes(product.id)
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart
                          size={17}
                          fill={
                            wishlist.includes(product.id)
                              ? "#247447"
                              : "none"
                          }
                          color={
                            wishlist.includes(product.id)
                              ? "#247447"
                              : "currentColor"
                          }
                        />
                      </button>
                    </div>

                    <div className="product-category">
                      {product.category}
                    </div>

                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-size">
                      {product.size} ·{" "}
                      {product.stock > 0 ? "In stock" : "Out of stock"}
                    </div>

                    <div className="product-bottom">
                      <div>
                        <span className="price">
                          {money(product.price)}
                        </span>

                        {product.oldPrice && (
                          <span className="old-price">
                            {money(product.oldPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        className="add-btn"
                        disabled={product.stock < 1}
                        aria-label={`Add ${product.name} to cart`}
                        onClick={() => addToCart(product)}
                      >
                        +
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty">
                <span>🔎</span>
                <strong>No products found</strong>
                <p>Try another search or reset the filters.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setQuery("");
                    setCategory("All Products");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <section className="promo" id="offers">
            <div>
              <div className="eyebrow">Your kitchen favourites</div>
              <h2>Stock up on the good stuff.</h2>
              <p>
                Build your basket with everyday staples and fresh picks.
              </p>
              <a
                className="btn btn-primary"
                style={{ marginTop: 18 }}
                href="#shop"
              >
                Browse the shop <ArrowRight size={16} />
              </a>
            </div>

            <div className="promo-art" aria-hidden="true">
              🥑 🍋 🥬
            </div>
          </section>

          <section className="newsletter">
            <div>
              <h2>A little freshness in your inbox.</h2>
              <p>
                Sign up for store news and offers. Unsubscribe anytime.
              </p>
            </div>

            <div className="newsletter-right">
              <form className="newsletter-form" onSubmit={subscribe}>
                <input
                  type="email"
                  aria-label="Email address for newsletter"
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <button className="btn btn-primary" type="submit">
                  Sign up
                </button>
              </form>

              {newsletterMessage && (
                <p className="form-message" role="status">
                  {newsletterMessage}
                </p>
              )}
            </div>
          </section>

          <section className="section" id="faq">
            <div className="section-heading">
              <div>
                <h2>Frequently asked questions</h2>
                <p>Helpful details before you fill your basket.</p>
              </div>
            </div>

            <div className="faq-grid">
              <details className="faq-item">
                <summary>Where do you deliver?</summary>
                <p>
                  Delivery areas and fees must be configured for your
                  business before launch.
                </p>
              </details>

              <details className="faq-item">
                <summary>Which payment methods are available?</summary>
                <p>
                  Cash on delivery can be enabled after order processing
                  is connected. Online payments require a configured
                  payment provider.
                </p>
              </details>

              <details className="faq-item">
                <summary>Can I return an item?</summary>
                <p>
                  Publish a return policy that matches your products
                  and local requirements before accepting orders.
                </p>
              </details>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="logo footer-logo" href="#">
                <span className="logo-mark">
                  <Leaf size={22} />
                </span>
                freshora<span className="logo-dot">.</span>
              </a>

              <p>
                Everyday groceries, made simpler. Update contact,
                delivery and policy details before launching your store.
              </p>
            </div>

            <div>
              <h4>Shop</h4>
              <div className="footer-links">
                <a href="#shop">All products</a>
                <a href="#categories">Categories</a>
                <a href="#offers">Offers</a>
              </div>
            </div>

            <div>
              <h4>Customer care</h4>
              <div className="footer-links">
                <a href="#faq">FAQs</a>
                <a href="#faq">Shipping & delivery</a>
                <a href="#faq">Returns & refunds</a>
              </div>
            </div>

            <div>
              <h4>Get in touch</h4>
              <p>Pakistan · Prices in PKR</p>
              <a href="mailto:hello@example.com">
                hello@example.com
              </a>
            </div>
          </div>

          <div className="copyright">
            © {new Date().getFullYear()} Freshora. Demonstration storefront.
          </div>
        </div>
      </footer>

      {cartOpen && (
        <div
          className="cart-panel"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setCartOpen(false);
            }
          }}
        >
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-heading"
          >
            <div className="cart-title">
              <h2 id="cart-heading">Your basket ({cartCount})</h2>
              <button
                className="icon-button close-button"
                aria-label="Close basket"
                onClick={() => setCartOpen(false)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="cart-items">
              {cartDetails.length > 0 ? (
                cartDetails.map((item) => (
                  <div className="cart-line" key={item.id}>
                    <div className="cart-thumb">{item.emoji}</div>

                    <div className="cart-line-main">
                      <strong>{item.name}</strong>
                      <small>
                        {item.size} · {money(item.price)}
                      </small>

                      <div className="qty">
                        <button
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          aria-label={`Increase ${item.name} quantity`}
                          disabled={item.quantity >= item.stock}
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>

                        <button
                          className="remove-button"
                          onClick={() =>
                            setCart((current) =>
                              current.filter(
                                (line) => line.productId !== item.id,
                              ),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <strong>{money(item.price * item.quantity)}</strong>
                  </div>
                ))
              ) : (
                <div className="empty">
                  <span>🛍️</span>
                  <strong>Your basket is waiting</strong>
                  <p>Add a few everyday favourites to get started.</p>
                </div>
              )}
            </div>

            <div className="cart-total">
              <div className="total-line">
                <span>Subtotal</span>
                <strong>{money(subtotal)}</strong>
              </div>

              <div className="total-line">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="total-line final">
                <span>Estimated total</span>
                <span>{money(subtotal)}</span>
              </div>

<div className="checkout-fields">
  <h3>Delivery details</h3>

  <input
    id="checkout-name"
    type="text"
    placeholder="Your full name"
    aria-label="Your full name"
    autoComplete="name"
    required
  />

  <input
    id="checkout-phone"
    type="tel"
    placeholder="Phone number"
    aria-label="Phone number"
    autoComplete="tel"
    required
  />

  <input
    id="checkout-address"
    type="text"
    placeholder="Full delivery address"
    aria-label="Full delivery address"
    autoComplete="street-address"
    required
  />

  <input
    id="checkout-city"
    type="text"
    placeholder="City"
    aria-label="City"
    autoComplete="address-level2"
    required
  />

  <input
    id="checkout-notes"
    type="text"
    placeholder="Order notes (optional)"
    aria-label="Order notes"
  />

  <p>Payment method: Cash on Delivery</p>
</div>

              {checkoutMessage && (
                <div className="notice" role="status">
                  {checkoutMessage}
                </div>
              )}

              
<button
  className="btn btn-primary checkout-button"
  disabled={!cartDetails.length || checkoutLoading}
  onClick={placeOrder}
>
  {checkoutLoading ? "Placing order..." : "Place COD order"}
  <ArrowRight size={16} />
</button>

<p className="checkout-disclaimer">
  Pay cash when your groceries are delivered.
</p>

            </div>
          </aside>
        </div>
      )}
    </>
  );
}