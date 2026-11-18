/**
 * SHOPZONE - Client Data & State Manager
 * Emulates the MySQL database and Servlets via localStorage so the site can be
 * opened directly via file:/// (double-clicking index.html) or via localhost server.
 */

// Initial products matching shopping_db.sql
const DEFAULT_PRODUCTS = [
  { id: 'P101', name: 'Wireless Headphones', category: 'Electronics', description: 'High-fidelity audio with active noise cancellation, deep bass, and up to 30-hour battery life.', price: 1500.00, stock: 25, image: 'images/products/headphones.svg' },
  { id: 'P102', name: 'Smart Watch', category: 'Electronics', description: 'Vibrant AMOLED touch display with real-time heart rate sensor, fitness tracker, and water resistance.', price: 2500.00, stock: 18, image: 'images/products/smartwatch.svg' },
  { id: 'P103', name: 'Laptop', category: 'Electronics', description: 'High performance 15.6-inch FHD display laptop powered by Intel Core i5 with 16GB RAM and 512GB SSD.', price: 45000.00, stock: 10, image: 'images/products/laptop.svg' },
  { id: 'P104', name: 'Backpack', category: 'Accessories', description: 'Durable, water-resistant travel & urban laptop backpack with multi-layer compartments and USB charging port.', price: 999.00, stock: 35, image: 'images/products/backpack.svg' },
  { id: 'P105', name: 'Bluetooth Speaker', category: 'Electronics', description: 'Portable 360-degree wireless speaker with dual bass radiators, IPX7 waterproof rating, and 12-hour playtime.', price: 1200.00, stock: 20, image: 'images/products/speaker.svg' },
  { id: 'P106', name: 'Running Shoes', category: 'Fashion', description: 'Ultra-lightweight breathable athletic shoes with responsive air-cushioned soles for maximum comfort.', price: 1800.00, stock: 30, image: 'images/products/shoes.svg' },
  { id: 'P107', name: 'Smartphone', category: 'Electronics', description: '6.5-inch Super AMOLED 120Hz display, 5G enabled, 50MP triple camera system, and 5000mAh battery.', price: 15000.00, stock: 15, image: 'images/products/smartphone.svg' },
  { id: 'P108', name: 'Keyboard', category: 'Electronics', description: 'Ergonomic mechanical gaming keyboard with responsive tactile switches and customizable dynamic RGB lighting.', price: 850.00, stock: 40, image: 'images/products/keyboard.svg' },
  { id: 'P109', name: 'Microwave Oven', category: 'Home Appliances', description: 'Multi-stage convection microwave oven with auto-cook recipes, grill mode, and child safety lock.', price: 6499.00, stock: 12, image: 'images/products/microwave.svg' },
  { id: 'P110', name: 'Coffee Maker', category: 'Home Appliances', description: 'Automatic programmable drip coffee maker with high-durability thermal carafe and keep-warm plate.', price: 3200.00, stock: 14, image: 'images/products/coffeemaker.svg' },
  { id: 'P111', name: 'Java Programming Guide', category: 'Books', description: 'Complete reference and definitive guide to Java, Object-Oriented Architecture, Servlets, and JDBC.', price: 750.00, stock: 50, image: 'images/products/book_java.svg' },
  { id: 'P112', name: 'Clean Code Handbook', category: 'Books', description: 'Renowned software engineering manual focused on agile craftsmanship, refactoring, and code readability.', price: 1100.00, stock: 35, image: 'images/products/book_code.svg' },
  { id: 'P113', name: 'Leather Wallet', category: 'Accessories', description: 'Handcrafted genuine top-grain leather bi-fold wallet featuring RFID protection and sleek slim profile.', price: 1299.00, stock: 45, image: 'images/products/wallet.svg' },
  { id: 'P114', name: 'Cotton Casual Shirt', category: 'Fashion', description: 'Premium 100% breathable organic cotton slim-fit button-down casual shirt for all-season styling.', price: 1250.00, stock: 28, image: 'images/products/shirt.svg' }
];

const DEFAULT_CUSTOMERS = [
  { id: 'CUST1001', name: 'Rahul Sharma', email: 'rahul@example.com', mobile: '9876543210', password: 'password123', address: 'Flat 402, Sunshine Heights, MG Road, Bengaluru, Karnataka - 560001' },
  { id: 'CUST1002', name: 'Priya Patel', email: 'priya@example.com', mobile: '9812345678', password: 'priya123', address: '12, Shanti Kunj, Near Civil Lines, Jaipur, Rajasthan - 302006' }
];

const DEFAULT_ORDERS = [
  {
    orderId: 'ORD-20261118-1001',
    customerId: 'CUST1001',
    customerName: 'Rahul Sharma',
    mobile: '9876543210',
    deliveryAddress: 'Flat 402, Sunshine Heights, MG Road, Bengaluru, Karnataka - 560001',
    paymentMethod: 'UPI',
    orderDate: '15 Nov 2026, 04:30 PM',
    orderStatus: 'Delivered',
    totalAmount: 4000.00,
    items: [
      { productId: 'P101', productName: 'Wireless Headphones', productImage: 'images/products/headphones.svg', price: 1500.00, quantity: 1, subtotal: 1500.00 },
      { productId: 'P102', productName: 'Smart Watch', productImage: 'images/products/smartwatch.svg', price: 2500.00, quantity: 1, subtotal: 2500.00 }
    ]
  },
  {
    orderId: 'ORD-20261118-1002',
    customerId: 'CUST1001',
    customerName: 'Rahul Sharma',
    mobile: '9876543210',
    deliveryAddress: 'Flat 402, Sunshine Heights, MG Road, Bengaluru, Karnataka - 560001',
    paymentMethod: 'Cash on Delivery',
    orderDate: '17 Nov 2026, 11:15 AM',
    orderStatus: 'Shipped',
    totalAmount: 999.00,
    items: [
      { productId: 'P104', productName: 'Backpack', productImage: 'images/products/backpack.svg', price: 999.00, quantity: 1, subtotal: 999.00 }
    ]
  }
];

// Initialize DB in localStorage
function initStore() {
  if (!localStorage.getItem('sz_products')) {
    localStorage.setItem('sz_products', JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem('sz_customers')) {
    localStorage.setItem('sz_customers', JSON.stringify(DEFAULT_CUSTOMERS));
  }
  if (!localStorage.getItem('sz_orders')) {
    localStorage.setItem('sz_orders', JSON.stringify(DEFAULT_ORDERS));
  }
  if (!localStorage.getItem('sz_cart')) {
    localStorage.setItem('sz_cart', JSON.stringify([]));
  }
  // Default login as Rahul Sharma for instant ready-to-test experience
  if (!sessionStorage.getItem('sz_user') && !localStorage.getItem('sz_user_logged_out')) {
    sessionStorage.setItem('sz_user', JSON.stringify(DEFAULT_CUSTOMERS[0]));
  }
}

// Data Access
const ShopDB = {
  getProducts: () => JSON.parse(localStorage.getItem('sz_products') || '[]'),
  getProductById: (id) => ShopDB.getProducts().find(p => p.id === id),
  saveProducts: (products) => localStorage.setItem('sz_products', JSON.stringify(products)),
  
  getCart: () => JSON.parse(localStorage.getItem('sz_cart') || '[]'),
  saveCart: (cart) => {
    localStorage.setItem('sz_cart', JSON.stringify(cart));
    ShopDB.updateCartBadge();
  },
  
  getCartCount: () => {
    const cart = ShopDB.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartTotal: () => {
    const cart = ShopDB.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  addToCart: (productId, quantity = 1) => {
    const product = ShopDB.getProductById(productId);
    if (!product) return { success: false, message: 'Product not found!' };
    
    const cart = ShopDB.getCart();
    const existing = cart.find(item => item.productId === productId);
    const currentQty = existing ? existing.quantity : 0;
    const newQty = currentQty + quantity;

    if (newQty > product.stock) {
      return { 
        success: false, 
        message: `Cannot add ${quantity} more item(s). Available stock is only ${product.stock} (you have ${currentQty} in cart).` 
      };
    }

    if (existing) {
      existing.quantity = newQty;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity: quantity
      });
    }

    ShopDB.saveCart(cart);
    return { success: true, message: `Added ${quantity}x "${product.name}" to your cart!` };
  },

  updateCartQty: (productId, newQty) => {
    const product = ShopDB.getProductById(productId);
    const cart = ShopDB.getCart();
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    if (newQty <= 0) {
      return ShopDB.removeFromCart(productId);
    }

    if (product && newQty > product.stock) {
      item.quantity = product.stock;
      ShopDB.saveCart(cart);
      return { adjusted: true, max: product.stock };
    }

    item.quantity = newQty;
    ShopDB.saveCart(cart);
    return { adjusted: false };
  },

  removeFromCart: (productId) => {
    let cart = ShopDB.getCart();
    cart = cart.filter(i => i.productId !== productId);
    ShopDB.saveCart(cart);
  },

  clearCart: () => {
    ShopDB.saveCart([]);
  },

  getUser: () => {
    const user = sessionStorage.getItem('sz_user');
    return user ? JSON.parse(user) : null;
  },

  login: (email, password) => {
    const customers = JSON.parse(localStorage.getItem('sz_customers') || '[]');
    const match = customers.find(c => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password);
    if (match) {
      sessionStorage.setItem('sz_user', JSON.stringify(match));
      localStorage.removeItem('sz_user_logged_out');
      return { success: true, user: match };
    }
    return { success: false, message: 'Invalid email address or password.' };
  },

  logout: () => {
    sessionStorage.removeItem('sz_user');
    localStorage.setItem('sz_user_logged_out', 'true');
  },

  register: (data) => {
    const customers = JSON.parse(localStorage.getItem('sz_customers') || '[]');
    if (customers.some(c => c.email.toLowerCase() === data.email.trim().toLowerCase())) {
      return { success: false, message: `An account with email "${data.email}" already exists!` };
    }
    const newId = 'CUST' + (1001 + customers.length);
    const newCustomer = { id: newId, ...data };
    customers.push(newCustomer);
    localStorage.setItem('sz_customers', JSON.stringify(customers));
    return { success: true, customer: newCustomer };
  },

  placeOrder: (deliveryData) => {
    const cart = ShopDB.getCart();
    if (!cart || cart.length === 0) return { success: false, message: 'Cart is empty!' };

    const products = ShopDB.getProducts();

    // Stock check
    for (const item of cart) {
      const p = products.find(prod => prod.id === item.productId);
      if (!p || p.stock < item.quantity) {
        return { success: false, message: `Insufficient stock for ${item.name}! Available: ${p ? p.stock : 0}` };
      }
    }

    // Deduct stock
    for (const item of cart) {
      const p = products.find(prod => prod.id === item.productId);
      p.stock -= item.quantity;
    }
    ShopDB.saveProducts(products);

    // Create Order
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomSuffix}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
                          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newOrder = {
      orderId: orderId,
      customerId: deliveryData.customerId,
      customerName: deliveryData.customerName,
      mobile: deliveryData.mobile,
      deliveryAddress: deliveryData.deliveryAddress,
      paymentMethod: deliveryData.paymentMethod,
      orderDate: formattedDate,
      orderStatus: 'Confirmed',
      totalAmount: ShopDB.getCartTotal(),
      items: cart.map(i => ({
        productId: i.productId,
        productName: i.name,
        productImage: i.image,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity
      }))
    };

    const orders = JSON.parse(localStorage.getItem('sz_orders') || '[]');
    orders.unshift(newOrder);
    localStorage.setItem('sz_orders', JSON.stringify(orders));
    sessionStorage.setItem('sz_last_order', JSON.stringify(newOrder));
    ShopDB.clearCart();

    return { success: true, order: newOrder };
  },

  getOrdersForUser: (customerId) => {
    const orders = JSON.parse(localStorage.getItem('sz_orders') || '[]');
    if (!customerId) return orders;
    return orders.filter(o => o.customerId === customerId);
  },

  updateCartBadge: () => {
    const count = ShopDB.getCartCount();
    document.querySelectorAll('.header-cart-count, .nav-badge').forEach(badge => {
      badge.textContent = count;
    });
  }
};

// Auto-run on page load
initStore();
document.addEventListener('DOMContentLoaded', () => {
  ShopDB.updateCartBadge();
  renderSidebarUser();
});

function renderSidebarUser() {
  const footer = document.querySelector('.sidebar-footer');
  if (!footer) return;

  const user = ShopDB.getUser();
  if (user) {
    footer.innerHTML = `
      <div class="customer-card">
        <div class="customer-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div class="customer-meta">
          <div class="name">${user.name}</div>
          <span class="id-badge">${user.id}</span>
        </div>
        <a href="javascript:void(0)" onclick="handleLogout()" class="btn-logout" title="Log Out">🚪</a>
      </div>
    `;
  } else {
    footer.innerHTML = `
      <div class="auth-button-group">
        <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
        <a href="register.html" class="btn btn-primary btn-sm">Register</a>
      </div>
    `;
  }
}

function handleLogout() {
  ShopDB.logout();
  alert('You have logged out.');
  window.location.href = 'login.html';
}

function showToast(msg, type = 'success') {
  const existing = document.querySelector('.alert');
  if (existing) existing.remove();

  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = (type === 'success' ? '✅ ' : '⚠️ ') + msg;
  const canvas = document.querySelector('.content-canvas');
  if (canvas) {
    canvas.insertBefore(alert, canvas.firstChild);
    setTimeout(() => alert.remove(), 4000);
  } else {
    alert(msg);
  }
}
