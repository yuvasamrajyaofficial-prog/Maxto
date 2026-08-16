// MAXTO App Interactive Logic

let cartItems = [
  { name: "Aashirvaad Atta 5kg", price: 249, qty: 1 },
  { name: "Amul Taaza Milk 1L", price: 56, qty: 2 },
  { name: "Surf Excel Matic 2kg", price: 189, qty: 1 },
];

// Open Specific Page
function openPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll(".page");
  pages.forEach((p) => p.classList.remove("active"));

  // Show target page
  const targetPage = document.getElementById(pageId + "-page");
  if (targetPage) {
    targetPage.classList.add("active");
    targetPage.scrollTop = 0;
  }

  // Update Header & Nav visibility
  const appHeader = document.getElementById("appHeader");
  const searchHeader = document.getElementById("searchHeader");
  const bottomNav = document.getElementById("bottomNav");
  const statusBar = document.getElementById("statusBar");

  const authPages = [
    "splash",
    "onboarding",
    "login",
    "register",
    "otp",
    "forgot-password",
  ];

  if (authPages.includes(pageId)) {
    appHeader.style.display = "none";
    searchHeader.style.display = "none";
    bottomNav.style.display = "none";
    if (pageId === "splash") {
      statusBar.classList.add("dark-theme");
    } else {
      statusBar.classList.remove("dark-theme");
    }
  } else {
    appHeader.style.display = "flex";
    searchHeader.style.display =
      pageId === "home" || pageId === "categories" || pageId === "products"
        ? "block"
        : "none";
    bottomNav.style.display = "flex";
    statusBar.classList.remove("dark-theme");
  }

  // Update Bottom Nav Active Icon
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => item.classList.remove("active"));

  if (pageId === "home") navItems[0]?.classList.add("active");
  if (pageId === "categories" || pageId === "products")
    navItems[1]?.classList.add("active");
  if (pageId === "orders" || pageId === "tracking")
    navItems[2]?.classList.add("active");
  if (pageId === "vip") navItems[3]?.classList.add("active");
  if (pageId === "account") navItems[4]?.classList.add("active");
}

// Add Item to Cart
function addToCart(name, price) {
  const existing = cartItems.find((item) => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ name, price, qty: 1 });
  }
  updateCartBadge();
  alert(`🛒 Added ${name} to your MAXTO cart!`);
}

// Update Cart Badge Count
function updateCartBadge() {
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartBadgeCount = document.getElementById("cartBadgeCount");
  const cartCount = document.getElementById("cartCount");

  if (cartBadgeCount) cartBadgeCount.innerText = totalQty;
  if (cartCount) cartCount.innerText = totalQty;
}

// Live Clock in Status Bar
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const clockEl = document.getElementById("clock");
  if (clockEl) clockEl.innerText = `${hours}:${minutes}`;
}

// Search Filter Handler
function handleSearch(query) {
  if (query.trim().length > 0) {
    openPage("products");
  }
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 10000);
  openPage("home");
});
