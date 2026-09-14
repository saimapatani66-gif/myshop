/* =========================================================
   MY SHOP - Main JavaScript
   Search • Categories • Cart • LocalStorage • Login • Checkout
   ========================================================= */

"use strict";

/* -----------------------------
   Products
   ----------------------------- */

window.products = [
  {
    id: 1,
    name: "Premium T-Shirt",
    category: "Fashion",
    price: 1500,
    icon: "👕",
    desc: "Comfortable premium cotton T-shirt for everyday wear."
  },
  {
    id: 2,
    name: "Sports Running Shoes",
    category: "Shoes",
    price: 3500,
    icon: "👟",
    desc: "Lightweight and comfortable shoes for sports and daily use."
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2500,
    icon: "🎧",
    desc: "Enjoy clear sound and wireless music anywhere."
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "Accessories",
    price: 4500,
    icon: "⌚",
    desc: "Stylish smart watch for everyday activities and fitness."
  }
];

/* Make products available to the existing inline code */
const products = window.products;


/* -----------------------------
   Cart
   ----------------------------- */

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("myshopCart")) || [];
} catch (error) {
  cart = [];
}


/* -----------------------------
   Helper Functions
   ----------------------------- */

function money(amount) {
  return "Rs " + Number(amount).toLocaleString("en-PK");
}

function saveCart() {
  localStorage.setItem("myshopCart", JSON.stringify(cart));
}

function $(selector) {
  return document.querySelector(selector);
}


/* -----------------------------
   Toast
   ----------------------------- */

function toast(message) {
  const box = $("#toast");

  if (!box) return;

  box.textContent = message;
  box.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    box.classList.remove("show");
  }, 2500);
}


/* -----------------------------
   Product Rendering
   ----------------------------- */

function renderProducts(list) {
  const grid = $("#productGrid");
  const empty = $("#emptyState");

  if (!grid) return;

  grid.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  list.forEach(product => {
    const card = document.createElement("article");

    card.className = "product";

    card.innerHTML = `
      <div class="product-img" aria-hidden="true">
        ${product.icon || "🛍️"}
      </div>

      <div class="product-body">
        <div class="product-meta">
          <span>${product.category}</span>
        </div>

        <h3>${product.name}</h3>

        <p class="desc">
          ${product.desc || "Quality product at a great price."}
        </p>

        <div class="product-bottom">
          <strong class="price">${money(product.price)}</strong>

          <button
            class="add"
            type="button"
            data-add="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  grid.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.add));
    });
  });
}


/* -----------------------------
   Find Product
   ----------------------------- */

function getProduct(id) {
  return products.find(product => Number(product.id) === Number(id));
}


/* -----------------------------
   Add To Cart
   ----------------------------- */

function addToCart(id) {
  const product = getProduct(id);

  if (!product) {
    toast("Product not found.");
    return;
  }

  const existing = cart.find(item => Number(item.id) === Number(id));

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      icon: product.icon,
      qty: 1
    });
  }

  saveCart();
  updateCart();

  toast(product.name + " added to cart.");
}


/* -----------------------------
   Cart Update
   ----------------------------- */
