// MAXTO Smart Supermarket - Full Working Application Engine

// Global State
const appState = {
  isVip: false,
  userLocation: 'Station Road, Talikoti',
  appliedCoupon: null,
  cart: [
    { id: '1', name: 'Aashirvaad Superior MP Atta 5kg', price: 249, originalPrice: 339, weight: '5 kg', img: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=300&q=80', qty: 1, category: 'rice' },
    { id: '2', name: 'Amul Taaza Toned Milk 1L', price: 56, originalPrice: 64, weight: '1 L Pouch', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80', qty: 2, category: 'dairy' },
    { id: '3', name: 'Surf Excel Matic Top Load 2kg', price: 189, originalPrice: 275, weight: '2 kg Pack', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80', qty: 1, category: 'home' }
  ],
  products: [
    { id: '1', name: 'Aashirvaad Superior MP Atta 5kg', price: 249, originalPrice: 339, weight: '5 kg • 100% Atta', img: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=300&q=80', category: 'rice', rating: '4.6' },
    { id: '2', name: 'Amul Taaza Toned Milk 1L', price: 56, originalPrice: 64, weight: '1 Liter Pouch', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80', category: 'dairy', rating: '4.8' },
    { id: '3', name: 'Surf Excel Matic Top Load 2kg', price: 189, originalPrice: 275, weight: '2 kg Pack', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80', category: 'home', rating: '4.7' },
    { id: '4', name: 'Fortune Sunlite Sunflower Oil 1L', price: 139, originalPrice: 174, weight: '1 Liter Pouch', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80', category: 'rice', rating: '4.5' },
    { id: '5', name: 'Tata Sampann Unpolished Toor Dal 1kg', price: 148, originalPrice: 180, weight: '1 kg Pack', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', category: 'rice', rating: '4.6' },
    { id: '6', name: 'Amul Butter 500g', price: 275, originalPrice: 290, weight: '500g Pack', img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80', category: 'dairy', rating: '4.9' },
    { id: '7', name: 'Britannia Good Day Biscuits 200g', price: 25, originalPrice: 30, weight: '200g Pack', img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80', category: 'snacks', rating: '4.4' },
    { id: '8', name: 'Cadbury Dairy Milk Silk 150g', price: 165, originalPrice: 175, weight: '150g Bar', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=300&q=80', category: 'snacks', rating: '4.9' }
  ],
  trackingStep: 2 // 0: Confirmed, 1: Packed, 2: Out for Delivery, 3: Delivered
};

// Page Switcher Engine
function openPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  const targetPage = document.getElementById(pageId + '-page');
  if (targetPage) {
    targetPage.classList.add('active');
    targetPage.scrollTop = 0;
  }

  // Header & Navigation visibility logic
  const appHeader = document.getElementById('appHeader');
  const searchHeader = document.getElementById('searchHeader');
  const bottomNav = document.getElementById('bottomNav');
  const statusBar = document.getElementById('statusBar');

  const fullScreenPages = ['splash', 'onboarding', 'login', 'register', 'otp', 'forgot-password'];
  
  if (fullScreenPages.includes(pageId)) {
    if (appHeader) appHeader.style.display = 'none';
    if (searchHeader) searchHeader.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';
    if (pageId === 'splash') {
      statusBar?.classList.add('dark-theme');
    } else {
      statusBar?.classList.remove('dark-theme');
    }
  } else {
    if (appHeader) appHeader.style.display = 'flex';
    if (searchHeader) searchHeader.style.display = (pageId === 'home' || pageId === 'categories' || pageId === 'products') ? 'block' : 'none';
    if (bottomNav) bottomNav.style.display = 'flex';
    if (statusBar) statusBar.classList.remove('dark-theme');
  }

  // Bottom Nav Icon Highlight
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  if (pageId === 'home') navItems[0]?.classList.add('active');
  if (pageId === 'categories' || pageId === 'products') navItems[1]?.classList.add('active');
  if (pageId === 'orders' || pageId === 'tracking') navItems[2]?.classList.add('active');
  if (pageId === 'vip') navItems[3]?.classList.add('active');
  if (pageId === 'account') navItems[4]?.classList.add('active');

  // Page Specific Render Updates
  if (pageId === 'cart') renderCartPage();
  if (pageId === 'products') renderProductList();
}

// Render Products Engine
function renderProductList(categoryFilter = null) {
  const container = document.getElementById('productListContainer');
  if (!container) return;

  let filtered = appState.products;
  if (categoryFilter) {
    filtered = appState.products.filter(p => p.category === categoryFilter);
  }

  container.innerHTML = filtered.map(p => {
    const finalPrice = appState.isVip ? Math.round(p.price * 0.96) : p.price;
    return `
      <div class="card" style="display: flex; gap: 12px; align-items: center;">
        <img src="${p.img}" style="width: 80px; height: 80px; object-fit: contain;">
        <div style="flex: 1;">
          <h4 style="font-size: 13px; font-weight: 700;">${p.name}</h4>
          <p style="font-size: 11px; color: var(--text-muted);">${p.weight} • ★ ${p.rating}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span style="font-size: 15px; font-weight: 800; color: var(--primary-color);">
              ₹${finalPrice} <s style="font-size: 11px; color: var(--text-light);">₹${p.originalPrice}</s>
              ${appState.isVip ? '<span style="font-size: 9px; background: var(--accent-gold); padding: 1px 4px; border-radius: 3px; color: black;">VIP 4% OFF</span>' : ''}
            </span>
            <button class="add-btn" onclick="addToCartById('${p.id}')">+ ADD</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Cart Engine Functions
function addToCartById(id) {
  const prod = appState.products.find(p => p.id === id);
  if (!prod) return;

  const existing = appState.cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    appState.cart.push({ ...prod, qty: 1 });
  }
  updateCartUI();
  showToast(`🛒 Added "${prod.name}" to MAXTO cart!`);
}

function changeCartQty(id, delta) {
  const item = appState.cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    appState.cart = appState.cart.filter(i => i.id !== id);
  }
  renderCartPage();
  updateCartUI();
}

function updateCartUI() {
  const totalItems = appState.cart.reduce((sum, i) => sum + i.qty, 0);
  const badgeCount = document.getElementById('cartBadgeCount');
  const cartCount = document.getElementById('cartCount');
  if (badgeCount) badgeCount.innerText = totalItems;
  if (cartCount) cartCount.innerText = totalItems;
}

function renderCartPage() {
  const listContainer = document.getElementById('cartItemsList');
  if (!listContainer) return;

  if (appState.cart.length === 0) {
    listContainer.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">Your MAXTO cart is empty. Add products from store!</div>`;
    updateBillBreakup(0);
    return;
  }

  listContainer.innerHTML = appState.cart.map(item => {
    const itemPrice = appState.isVip ? Math.round(item.price * 0.96) : item.price;
    return `
      <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="flex: 1; padding-right: 8px;">
          <h4 style="font-size: 13px; font-weight: 700;">${item.name}</h4>
          <span style="font-size: 13px; font-weight: 800; color: var(--primary-color);">₹${itemPrice * item.qty}</span>
          <span style="font-size: 11px; color: var(--text-muted);"> (₹${itemPrice} x ${item.qty})</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; background: #F1F5F9; padding: 4px 8px; border-radius: 8px;">
          <button style="border: none; background: transparent; font-weight: 800; width: 24px; cursor: pointer;" onclick="changeCartQty('${item.id}', -1)">-</button>
          <span style="font-weight: 800; font-size: 13px;">${item.qty}</span>
          <button style="border: none; background: transparent; font-weight: 800; width: 24px; cursor: pointer;" onclick="changeCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  const subtotal = appState.cart.reduce((sum, item) => {
    const price = appState.isVip ? Math.round(item.price * 0.96) : item.price;
    return sum + (price * item.qty);
  }, 0);

  updateBillBreakup(subtotal);
}

function updateBillBreakup(subtotal) {
  const isFreeMilkEligible = subtotal >= 500 || appState.isVip;
  const milkBanner = document.getElementById('cartMilkBanner');
  if (milkBanner) {
    if (isFreeMilkEligible) {
      milkBanner.style.display = 'flex';
      milkBanner.innerHTML = `
        <i class="fa-solid fa-gift" style="font-size: 24px; color: var(--success-green);"></i>
        <div>
          <h4 style="font-size: 12px; color: #065F46;">Yay! 500ml FREE Amul Milk Unlocked!</h4>
          <p style="font-size: 11px; color: #047857;">Included automatically with your ₹${subtotal} Talikoti order.</p>
        </div>
      `;
    } else {
      milkBanner.style.display = 'flex';
      milkBanner.innerHTML = `
        <i class="fa-solid fa-bottle-droplet" style="font-size: 24px; color: var(--accent-gold);"></i>
        <div>
          <h4 style="font-size: 12px; color: #92400E;">Add ₹${500 - subtotal} more for FREE Milk!</h4>
          <p style="font-size: 11px; color: #B45309;">Non-VIP launch offer: Free 500ml Amul Milk on ₹500+ orders.</p>
        </div>
      `;
    }
  }

  let discount = appState.appliedCoupon ? 50 : 0;
  let finalToPay = Math.max(0, subtotal - discount);

  const subtotalEl = document.getElementById('billSubtotal');
  const discountEl = document.getElementById('billDiscount');
  const toPayEl = document.getElementById('billToPay');
  const checkoutPayBtn = document.getElementById('checkoutPayBtn');

  if (subtotalEl) subtotalEl.innerText = '₹' + subtotal;
  if (discountEl) discountEl.innerText = '-₹' + discount;
  if (toPayEl) toPayEl.innerText = '₹' + finalToPay;
  if (checkoutPayBtn) checkoutPayBtn.innerText = 'Place Order (₹' + finalToPay + ')';
}

function applyCoupon() {
  const code = prompt("Enter Coupon Code (Try: MAXTO10):", "MAXTO10");
  if (code && code.toUpperCase() === "MAXTO10") {
    appState.appliedCoupon = "MAXTO10";
    showToast("🎉 Coupon MAXTO10 Applied! ₹50 Discount!");
    renderCartPage();
  } else if (code) {
    alert("Invalid Coupon Code!");
  }
}

// Toast Alert System
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--text-dark);
      color: white;
      padding: 10px 18px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
    `;
    document.querySelector('.app-container').appendChild(toast);
  }
  toast.innerText = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// Interactive Order Placement Simulation
function placeOrder() {
  alert("🎉 Order Successfully Placed with MAXTO Supermarket, Talikoti!");
  appState.cart = [];
  updateCartUI();
  openPage('tracking');

  // Simulate Live Tracking Progress
  let step = 0;
  const trackerItems = document.querySelectorAll('.step-item');
  const interval = setInterval(() => {
    if (step < trackerItems.length) {
      trackerItems[step].classList.add('completed');
      step++;
    } else {
      clearInterval(interval);
    }
  }, 4000);
}

// Live Clock in Status Bar
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const clockEl = document.getElementById('clock');
  if (clockEl) clockEl.innerText = `${hours}:${minutes}`;
}

// Real-Time Search Handler
function handleSearch(query) {
  if (query.trim().length > 0) {
    openPage('products');
    const container = document.getElementById('productListContainer');
    if (!container) return;

    const filtered = appState.products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 30px; color: var(--text-muted);">No products found for "${query}" in Talikoti store.</div>`;
    } else {
      container.innerHTML = filtered.map(p => `
        <div class="card" style="display: flex; gap: 12px; align-items: center;">
          <img src="${p.img}" style="width: 80px; height: 80px; object-fit: contain;">
          <div style="flex: 1;">
            <h4 style="font-size: 13px; font-weight: 700;">${p.name}</h4>
            <p style="font-size: 11px; color: var(--text-muted);">${p.weight}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span style="font-size: 15px; font-weight: 800; color: var(--primary-color);">₹${p.price}</span>
              <button class="add-btn" onclick="addToCartById('${p.id}')">+ ADD</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

// Initialize Application Engine
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 10000);
  updateCartUI();
  openPage('home');
});
