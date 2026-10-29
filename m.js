
const products = [
  {
    id: 1, name: "Studio Wireless Headphones",
    category: "Electronics", price: 6499, oldPrice: 7999,
    rating: "4.8", badge: "BESTSELLER", emoji: "🎧",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2, name: "Classic Everyday Sneakers",
    category: "Fashion", price: 4299, oldPrice: 5499,
    rating: "4.7", badge: "POPULAR", emoji: "👟",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3, name: "Minimal Wrist Watch",
    category: "Accessories", price: 3599, oldPrice: 4499,
    rating: "4.6", badge: "NEW", emoji: "⌚",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4, name: "Modern Desk Lamp",
    category: "Home", price: 2899, oldPrice: 3499,
    rating: "4.5", badge: "TRENDING", emoji: "💡",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5, name: "Premium Everyday Backpack",
    category: "Fashion", price: 3199, oldPrice: 3999,
    rating: "4.7", badge: "POPULAR", emoji: "🎒",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6, name: "Portable Bluetooth Speaker",
    category: "Electronics", price: 4999, oldPrice: 5999,
    rating: "4.8", badge: "TOP PICK", emoji: "🔊",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7, name: "Signature Fragrance Bottle",
    category: "Accessories", price: 2599, oldPrice: 3299,
    rating: "4.4", badge: "NEW", emoji: "🧴",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8, name: "Soft Cushion Collection",
    category: "Home", price: 1899, oldPrice: 2399,
    rating: "4.6", badge: "COZY PICK", emoji: "🛋️",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9, name: "Smart Fitness Watch",
    category: "Electronics", price: 7999, oldPrice: 9499,
    rating: "4.7", badge: "BESTSELLER", emoji: "⌚",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10, name: "Everyday Crossbody Bag",
    category: "Fashion", price: 2799, oldPrice: 3499,
    rating: "4.5", badge: "STYLE PICK", emoji: "👜",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11, name: "Ceramic Coffee Mug",
    category: "Home", price: 899, oldPrice: 1199,
    rating: "4.6", badge: "DAILY PICK", emoji: "☕",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12, name: "Modern Sunglasses",
    category: "Accessories", price: 1599, oldPrice: 2199,
    rating: "4.5", badge: "TRENDING", emoji: "🕶️",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  }
];

const $ = (selector) => document.querySelector(selector);

const productGrid = $("#productGrid");
const emptyState = $("#emptyState");
const searchInput = $("#searchInput");
const sortSelect = $("#sortSelect");
const overlay = $("#overlay");
const cartDrawer = $("#cartDrawer");
const checkoutModal = $("#checkoutModal");
const cartItems = $("#cartItems");
const toast = $("#toast");

let activeCategory = "All";
let searchTerm = "";
let wishlistOnly = false;
let cart = {};
let wishlist = new Set();
let toastTimer;

const money = (amount) =>
  "Rs. " + amount.toLocaleString("en-PK");

function notify(text) {
  toast.textContent = text;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// Product rendering
function renderProducts() {
  let list = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const searchable =
      `${product.name} ${product.category}`.toLowerCase();

    const matchesSearch = searchable.includes(searchTerm);
    const matchesWishlist =
      !wishlistOnly || wishlist.has(product.id);

    return matchesCategory && matchesSearch && matchesWishlist;
  });

  if (sortSelect.value === "low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "high") {
    list.sort((a, b) => b.price - a.price);
  } else if (sortSelect.value === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  $("#resultsCount").textContent =
    `${list.length} products found`;

  productGrid.hidden = list.length === 0;
  emptyState.hidden = list.length !== 0;

  productGrid.innerHTML = list.map((product) => `
    <article class="product-card">
      <div class="product-visual">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none';this.parentElement.style.background='#eaf1ff';this.parentElement.insertAdjacentHTML('beforeend','<span style=&quot;display:grid;place-items:center;height:100%;font-size:60px&quot;>${product.emoji}</span>')"
        >
        <span class="product-badge">${product.badge}</span>
        <button
          class="wish-btn ${wishlist.has(product.id) ? "active" : ""}"
          data-wish="${product.id}"
          aria-label="${wishlist.has(product.id) ? "Remove from" : "Add to"} wishlist"
          aria-pressed="${wishlist.has(product.id)}"
        >${wishlist.has(product.id) ? "♥" : "♡"}</button>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="rating">★ ★ ★ ★ ★ <span>${product.rating} / 5</span></div>

        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" data-add="${product.id}">
            ${cart[product.id] ? `Add + (${cart[product.id]})` : "+ Add"}
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function updateCategoryUI() {
  document.querySelectorAll("[data-category]").forEach((button) => {
    const active =
      button.dataset.category === activeCategory;

    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setCategory(category) {
  activeCategory = category;
  updateCategoryUI();
  renderProducts();
}

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
});

$("#searchBtn").addEventListener("click", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
  $("#shopSection").scrollIntoView({ behavior: "smooth" });
});

sortSelect.addEventListener("change", renderProducts);

$("#clearFilters").addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  wishlistOnly = false;
  setCategory("All");
  renderProducts();
});

$("#resetSearch").addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  wishlistOnly = false;
  setCategory("All");
  renderProducts();
});

$("#shopNow").addEventListener("click", () => {
  $("#shopSection").scrollIntoView({ behavior: "smooth" });
});

// Wishlist
function updateWishlistCount() {
  $("#wishlistCount").textContent = wishlist.size;
}

function toggleWishlist(id) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    notify("Removed from your wishlist.");
  } else {
    wishlist.add(id);
    notify("Added to your wishlist ♥");
  }

  updateWishlistCount();
  renderProducts();
}

$("#wishlistBtn").addEventListener("click", () => {
  wishlistOnly = !wishlistOnly;

  if (wishlistOnly) {
    searchInput.value = "";
    searchTerm = "";
    setCategory("All");
    $("#wishlistBtn").querySelector("span").textContent = "Saved";
    notify("Showing your wishlist.");
  } else {
    $("#wishlistBtn").querySelector("span").textContent = "Wishlist";
    renderProducts();
  }

  renderProducts();
  $("#shopSection").scrollIntoView({ behavior: "smooth" });
});

// Cart operations
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  renderProducts();
  notify("Added to your cart!");
}

function changeQuantity(id, amount) {
  const next = (cart[id] || 0) + amount;

  if (next <= 0) {
    delete cart[id];
  } else {
    cart[id] = next;
  }

  updateCart();
  renderProducts();
}

function removeFromCart(id) {
  delete cart[id];
  updateCart();
  renderProducts();
  notify("Item removed from cart.");
}

function getCartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function getSubtotal() {
  return products.reduce(
    (sum, product) =>
      sum + product.price * (cart[product.id] || 0),
    0
  );
}

function updateCart() {
  const count = getCartCount();
  const subtotal = getSubtotal();

  $("#cartCount").textContent = count;
  $("#drawerCartCount").textContent = `(${count})`;
  $("#subtotal").textContent = money(subtotal);
  $("#checkoutTotal").textContent = money(subtotal);

  const items = products.filter((product) => cart[product.id]);

  if (!items.length) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div style="font-size:38px;margin-bottom:12px">🛒</div>
        <strong>Your cart is waiting.</strong>
        <p style="margin-top:8px">Add something you love.</p>
      </div>`;
    $("#checkoutBtn").disabled = true;
    $("#checkoutBtn").style.opacity = ".5";
  } else {
    $("#checkoutBtn").disabled = false;
    $("#checkoutBtn").style.opacity = "1";

    cartItems.innerHTML = items.map((product) => `
      <div class="cart-row">
        <img src="${product.image}" alt="${product.name}"
          onerror="this.style.visibility='hidden'">
        <div>
          <h4>${product.name}</h4>
          <p class="cart-price">${money(product.price)}</p>
          <div class="quantity-controls">
            <button data-minus="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${cart[product.id]}</span>
            <button data-plus="${product.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-btn" data-remove="${product.id}"
          aria-label="Remove ${product.name}">×</button>
      </div>
    `).join("");
  }

  $("#checkoutTotal").textContent = money(subtotal);
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  $("#closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Checkout demo
function openCheckout() {
  if (!getCartCount()) {
    notify("Your cart is empty.");
    return;
  }

  closeCart();
  $("#checkoutContent").hidden = false;
  $("#orderSuccess").hidden = true;
  $("#checkoutMessage").textContent = "";
  checkoutModal.hidden = false;
  overlay.classList.add("open");
  document.body.classList.add("locked");
  $("#customerName").focus();
}

function closeCheckout() {
  checkoutModal.hidden = true;
  overlay.classList.remove("open");
  document.body.classList.remove("locked");
}

$("#checkoutBtn").addEventListener("click", openCheckout);
$("#closeCheckout").addEventListener("click", closeCheckout);

$("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();

  if (!getCartCount()) {
    $("#checkoutMessage").textContent = "Your cart is empty.";
    return;
  }

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  const orderNumber =
    "CQ-" + Date.now().toString().slice(-7);

  const name = $("#customerName").value.trim();
  const total = money(getSubtotal());

  $("#checkoutContent").hidden = true;
  $("#orderSuccess").hidden = false;

  $("#successDetails").textContent =
    `Thank you, ${name}! Your demo order ${orderNumber} ` +
    `has a total of ${total}. No real order or payment was processed.`;

  // Clear cart after the demo order preview.
  cart = {};
  updateCart();
  renderProducts();
});

$("#finishOrder").addEventListener("click", () => {
  closeCheckout();
  $("#checkoutForm").reset();
  $("#shopSection").scrollIntoView({ behavior: "smooth" });
  notify("Thanks for exploring CARTIQ!");
});

// Close drawers using Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeCheckout();
  }
});

// Event delegation for product and cart buttons
document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  const wish = event.target.closest("[data-wish]");
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");

  if (add) addToCart(Number(add.dataset.add));
  if (wish) toggleWishlist(Number(wish.dataset.wish));
  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
  if (remove) removeFromCart(Number(remove.dataset.remove));
});

// Newsletter demo
$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = $("#newsletterEmail").value.trim();

  if (!email) return;

  $("#newsletterMessage").textContent =
    "Thanks! Newsletter signup demo completed.";

  event.currentTarget.reset();
});

// Initial page state
renderProducts();
updateCart();
updateWishlistCount();
updateCategoryUI();
// m.js — basic local persistence

const STORAGE_KEYS = {
  cart: "cartiq_cart_v1",
  wishlist: "cartiq_wishlist_v1"
};

function readStoredJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveCart() {
  localStorage.setItem(
    STORAGE_KEYS.cart,
    JSON.stringify(cart)
  );
}

function saveWishlist() {
  localStorage.setItem(
    STORAGE_KEYS.wishlist,
    JSON.stringify([...wishlist])
  );
}