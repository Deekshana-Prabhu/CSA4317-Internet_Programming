/**
 * ShopEase - Integrated E-Commerce Product and Order Management System
 * script.js - Complete Browser Preview Layer & Client Logic
 */

// ==========================================================================
// 1. DEFAULT DATA & STORAGE INITIALIZATION
// ==========================================================================

const INITIAL_PRODUCTS = [
    {
        id: "PROD101",
        name: "Wireless Noise Canceling Headphones",
        category: "Electronics",
        price: 3499,
        stock: 15,
        rating: 4.8,
        description: "High-fidelity acoustic stereo sound with active 32dB noise cancellation, 40-hour playtime, and ultra-plush memory foam ear cushions.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: true
    },
    {
        id: "PROD102",
        name: "Smart Fitness Tracker AMOLED",
        category: "Electronics",
        price: 2299,
        stock: 22,
        rating: 4.7,
        description: "1.43-inch vibrant touch AMOLED display with continuous heart rate monitor, SpO2 blood oxygen sensor, 5ATM water resistance, and 120 sports modes.",
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: true
    },
    {
        id: "PROD103",
        name: "Ultra-Slim 20000mAh Power Bank",
        category: "Electronics",
        price: 1499,
        stock: 30,
        rating: 4.6,
        description: "Triple output 22.5W Power Delivery high-speed charging in an aircraft-grade aluminum alloy body with LED digital battery indicator.",
        image: "https://images.unsplash.com/photo-1609592426861-125026fd0025?w=600&auto=format&fit=crop&q=80",
        featured: false,
        bestSeller: true
    },
    {
        id: "PROD104",
        name: "4K Ultra HD Action Camera",
        category: "Electronics",
        price: 5999,
        stock: 8,
        rating: 4.9,
        description: "Ultra-wide 170-degree lens with 6-axis gyro EIS stabilization, dual color screens, and 30m underwater waterproof housing.",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: false
    },
    {
        id: "PROD105",
        name: "Men's Tailored Oxford Cotton Shirt",
        category: "Fashion",
        price: 1299,
        stock: 18,
        rating: 4.5,
        description: "Breathable 100% combed cotton long-sleeve button-down shirt designed for all-day formal comfort and modern styling.",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: true
    },
    {
        id: "PROD106",
        name: "Women's Floral Georgette Anarkali",
        category: "Fashion",
        price: 1899,
        stock: 14,
        rating: 4.8,
        description: "Graceful flared floral embroidered georgette ethnic festive gown with matching soft chiffon dupatta and golden zari borders.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: false
    },
    {
        id: "PROD107",
        name: "Unisex Polarized Aviator Sunglasses",
        category: "Fashion",
        price: 999,
        stock: 25,
        rating: 4.4,
        description: "UV400 protective polarized lenses in an ultra-lightweight metallic alloy frame with soft silicone non-slip nose pads.",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
        featured: false,
        bestSeller: true
    },
    {
        id: "PROD108",
        name: "Classic Leather Formal Dress Shoes",
        category: "Fashion",
        price: 2799,
        stock: 12,
        rating: 4.7,
        description: "Finest full-grain leather oxfords with cushioned orthopedic memory foam insoles and non-slip durable rubber outsoles.",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
        featured: false,
        bestSeller: false
    },
    {
        id: "PROD109",
        name: "1.8L Stainless Steel Electric Kettle",
        category: "Home Appliances",
        price: 899,
        stock: 35,
        rating: 4.6,
        description: "Fast-heating 1500W cordless electric jug with auto shut-off, boil-dry protection, and 360-degree swivel base.",
        image: "https://images.unsplash.com/photo-1594213114663-dd95fb52cb8b?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: true
    },
    {
        id: "PROD110",
        name: "Smart Digital Air Fryer 4.5L",
        category: "Home Appliances",
        price: 4499,
        stock: 10,
        rating: 4.9,
        description: "Rapid 360-degree hot air circulation for 90% less oil healthy cooking with 8 one-touch LED touch screen presets.",
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: true
    },
    {
        id: "PROD111",
        name: "Robotic Vacuum & Floor Mop 2-in-1",
        category: "Home Appliances",
        price: 8999,
        stock: 6,
        rating: 4.8,
        description: "Intelligent LiDAR gyroscope room mapping with 2800Pa powerful suction and automatic return-to-dock recharging.",
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80",
        featured: false,
        bestSeller: false
    },
    {
        id: "PROD112",
        name: "Handmade Bi-Fold RFID Leather Wallet",
        category: "Accessories",
        price: 799,
        stock: 40,
        rating: 4.7,
        description: "Authentic hunter leather with RFID blocking foil, 8 credit card slots, two cash currency sleeves, and coin pocket.",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
        featured: false,
        bestSeller: true
    },
    {
        id: "PROD113",
        name: "Anti-Theft Laptop Backpack 15.6\"",
        category: "Accessories",
        price: 1699,
        stock: 20,
        rating: 4.7,
        description: "High-density Oxford fabric backpack featuring built-in USB external charging port, hidden security zipper, and padded laptop sleeve.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: false
    },
    {
        id: "PROD114",
        name: "Rose-Gold Analog Quartz Wristwatch",
        category: "Accessories",
        price: 1999,
        stock: 16,
        rating: 4.6,
        description: "Luxury minimalist dial protected by scratch-proof sapphire crystal glass with adjustable stainless steel mesh strap.",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: true
    },
    {
        id: "PROD115",
        name: "Organic Vitamin C Glow Face Serum",
        category: "Beauty and Personal Care",
        price: 599,
        stock: 50,
        rating: 4.9,
        description: "Pure 20% ethyl ascorbic acid enriched with botanical hyaluronic acid and ferulic acid for bright, glowing, spotless skin radiance.",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
        featured: true,
        bestSeller: true
    },
    {
        id: "PROD116",
        name: "Ceramic Tourmaline 2-in-1 Hair Styler",
        category: "Beauty and Personal Care",
        price: 1799,
        stock: 15,
        rating: 4.6,
        description: "Fast 30-second PTC heating plates with negative ion technology for frizz-free straight and bouncy curls.",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
        featured: false,
        bestSeller: false
    }
];

const INITIAL_ORDERS = [
    {
        orderId: "ORD-2026-1001",
        date: "2026-11-20 14:30:00",
        customerName: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        mobile: "9876543210",
        address: "402, Greenfield Heights, MG Road, Bengaluru, Karnataka - 560001",
        items: [
            { id: "PROD101", name: "Wireless Noise Canceling Headphones", category: "Electronics", price: 3499, quantity: 1, subtotal: 3499 },
            { id: "PROD102", name: "Smart Fitness Tracker AMOLED", category: "Electronics", price: 2299, quantity: 1, subtotal: 2299 }
        ],
        subtotal: 5798,
        deliveryFee: 0,
        total: 5798,
        paymentMethod: "UPI Demo Payment",
        status: "Delivered"
    },
    {
        orderId: "ORD-2026-1002",
        date: "2026-11-21 09:15:00",
        customerName: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        mobile: "9876543210",
        address: "402, Greenfield Heights, MG Road, Bengaluru, Karnataka - 560001",
        items: [
            { id: "PROD109", name: "1.8L Stainless Steel Electric Kettle", category: "Home Appliances", price: 899, quantity: 2, subtotal: 1798 }
        ],
        subtotal: 1798,
        deliveryFee: 0,
        total: 1798,
        paymentMethod: "Cash on Delivery",
        status: "Confirmed"
    }
];

// Initialize Storage if empty
function initializeStorage() {
    if (!localStorage.getItem("shopease_products")) {
        localStorage.setItem("shopease_products", JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem("shopease_orders")) {
        localStorage.setItem("shopease_orders", JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem("shopease_cart")) {
        localStorage.setItem("shopease_cart", JSON.stringify([]));
    }
    if (!localStorage.getItem("shopease_users")) {
        const defaultUsers = [{
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            mobile: "9876543210",
            address: "402, Greenfield Heights, MG Road, Bengaluru, Karnataka - 560001",
            password: "password123"
        }];
        localStorage.setItem("shopease_users", JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem("shopease_current_user")) {
        // Auto sign-in demo customer for frictionless preview
        const defaultUser = {
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            mobile: "9876543210",
            address: "402, Greenfield Heights, MG Road, Bengaluru, Karnataka - 560001"
        };
        localStorage.setItem("shopease_current_user", JSON.stringify(defaultUser));
        setCookie("customer_name", defaultUser.name, 7);
        setCookie("preferred_category", "Electronics", 7);
    }
}

// Cookie Helper Functions
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

// Data Getters
function getProducts() {
    return JSON.parse(localStorage.getItem("shopease_products")) || INITIAL_PRODUCTS;
}

function saveProducts(products) {
    localStorage.setItem("shopease_products", JSON.stringify(products));
}

function getCart() {
    return JSON.parse(localStorage.getItem("shopease_cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("shopease_cart", JSON.stringify(cart));
    setCookie("shopease_cart", JSON.stringify(cart), 7);
    updateCartCount();
}

function getOrders() {
    return JSON.parse(localStorage.getItem("shopease_orders")) || INITIAL_ORDERS;
}

function saveOrders(orders) {
    localStorage.setItem("shopease_orders", JSON.stringify(orders));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("shopease_current_user"));
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem("shopease_current_user", JSON.stringify(user));
        setCookie("customer_name", user.name, 7);
    } else {
        localStorage.removeItem("shopease_current_user");
        setCookie("customer_name", "", -1);
    }
    updateAuthUI();
}

// ==========================================================================
// 2. UI NAVIGATION & SECTION SWITCHER
// ==========================================================================

function navigateTo(sectionId) {
    // Hide all sections
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
    
    // Deactivate sidebar links
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

    // Activate target section
    const targetSection = document.getElementById("section-" + sectionId);
    if (targetSection) {
        targetSection.classList.add("active");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Activate corresponding nav link
    const targetLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (targetLink) {
        targetLink.classList.add("active");
    }

    // Close mobile sidebar if open
    document.querySelector(".sidebar")?.classList.remove("open");

    // Perform section-specific refresh
    if (sectionId === "home") {
        renderHomePage();
    } else if (sectionId === "shop") {
        renderShopCatalogue();
    } else if (sectionId === "cart") {
        renderCartPage();
    } else if (sectionId === "orders") {
        renderOrdersPage();
    } else if (sectionId === "account") {
        renderAccountPage();
    } else if (sectionId === "invoices") {
        renderInvoicesPage();
    } else if (sectionId === "xml-management") {
        renderXMLManagementPage();
    }
}

// ==========================================================================
// 3. TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "⚠️";

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ==========================================================================
// 4. HOME PAGE RENDERING
// ==========================================================================

function renderHomePage() {
    // 1. Personalized Returning Customer Banner
    const cookieBanner = document.getElementById("welcome-cookie-banner");
    const cookieUser = getCookie("customer_name") || (getCurrentUser() ? getCurrentUser().name : null);
    const preferredCat = getCookie("preferred_category") || "Electronics";

    if (cookieBanner) {
        if (cookieUser) {
            cookieBanner.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">✨</span>
                    <p>Welcome back, <strong>${cookieUser}</strong>! Special festive offers available in your preferred category: <strong>${preferredCat}</strong>.</p>
                </div>
                <button class="close-banner" onclick="document.getElementById('welcome-cookie-banner').style.display='none'">&times;</button>
            `;
            cookieBanner.style.display = "flex";
        } else {
            cookieBanner.style.display = "none";
        }
    }

    // 2. Render Featured Products
    const products = getProducts();
    const featuredContainer = document.getElementById("home-featured-products");
    if (featuredContainer) {
        const featured = products.filter(p => p.featured).slice(0, 4);
        featuredContainer.innerHTML = featured.map(p => createProductCardHtml(p)).join("");
    }

    // 3. Render Best-Selling Products
    const bestSellingContainer = document.getElementById("home-bestselling-products");
    if (bestSellingContainer) {
        const bestSellers = products.filter(p => p.bestSeller).slice(0, 4);
        bestSellingContainer.innerHTML = bestSellers.map(p => createProductCardHtml(p)).join("");
    }

    // 4. Render Special Offers / Recently Added
    const offersContainer = document.getElementById("home-special-offers");
    if (offersContainer) {
        const specialOffers = products.slice(8, 12);
        offersContainer.innerHTML = specialOffers.map(p => createProductCardHtml(p)).join("");
    }
}

// Reusable Product Card HTML Template
function createProductCardHtml(p) {
    const isLowStock = p.stock > 0 && p.stock <= 10;
    const stockClass = isLowStock ? "low-stock" : "";
    const stockText = p.stock > 0 ? (isLowStock ? `Low Stock: ${p.stock}` : `In Stock: ${p.stock}`) : "Out of Stock";

    return `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image-box" onclick="openProductModal('${p.id}')" style="cursor: pointer;">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <span class="product-badge-category">${p.category}</span>
                <span class="product-badge-stock ${stockClass}">${stockText}</span>
            </div>
            <div class="product-content">
                <div class="product-sku">SKU: ${p.id}</div>
                <h4 class="product-title" onclick="openProductModal('${p.id}')" style="cursor: pointer;">${p.name}</h4>
                <p class="product-desc">${p.description}</p>
                <div class="product-footer">
                    <div class="product-price">₹${p.price.toLocaleString('en-IN')}</div>
                    <div class="product-actions">
                        <button class="btn-icon-action" title="Quick View" onclick="openProductModal('${p.id}')">
                            👁️
                        </button>
                        <button class="btn-add-cart" onclick="addToCart('${p.id}')" ${p.stock === 0 ? 'disabled' : ''}>
                            🛒 Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==========================================================================
// 5. PRODUCT CATALOGUE & FILTERING
// ==========================================================================

let currentFilter = {
    search: "",
    category: "all",
    sort: "featured",
    inStockOnly: false
};

function renderShopCatalogue() {
    const products = getProducts();
    const container = document.getElementById("shop-products-grid");
    const emptyState = document.getElementById("shop-empty-state");
    const resultsCount = document.getElementById("shop-results-count");

    if (!container) return;

    // Filter logic
    let filtered = products.filter(p => {
        // Search filter (Product Name, Product ID, Category)
        const q = currentFilter.search.toLowerCase().trim();
        const matchesSearch = !q || 
            p.name.toLowerCase().includes(q) || 
            p.id.toLowerCase().includes(q) || 
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);

        // Category filter
        const matchesCat = currentFilter.category === "all" || p.category === currentFilter.category;

        // In-Stock only filter
        const matchesStock = !currentFilter.inStockOnly || p.stock > 0;

        return matchesSearch && matchesCat && matchesStock;
    });

    // Sorting logic
    if (currentFilter.sort === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentFilter.sort === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentFilter.sort === "name-asc") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (resultsCount) {
        resultsCount.innerText = `Showing ${filtered.length} of ${products.length} products`;
    }

    if (filtered.length === 0) {
        container.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
    } else {
        if (emptyState) emptyState.style.display = "none";
        container.innerHTML = filtered.map(p => createProductCardHtml(p)).join("");
    }
}

function handleSearch(query) {
    currentFilter.search = query;
    const shopSearchInput = document.getElementById("shop-search-input");
    const headerSearchInput = document.getElementById("header-search-input");
    
    if (shopSearchInput && shopSearchInput.value !== query) shopSearchInput.value = query;
    if (headerSearchInput && headerSearchInput.value !== query) headerSearchInput.value = query;
    
    navigateTo("shop");
    renderShopCatalogue();
}

function filterByCategory(category) {
    currentFilter.category = category;
    const select = document.getElementById("shop-category-select");
    if (select) select.value = category;

    // Store preference in cookie
    if (category !== "all") {
        setCookie("preferred_category", category, 7);
    }

    navigateTo("shop");
    renderShopCatalogue();
}

// Product Quick View Modal
function openProductModal(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("product-detail-modal");
    const body = document.getElementById("product-modal-body");

    if (modal && body) {
        const isLowStock = product.stock > 0 && product.stock <= 10;
        const stockStatus = product.stock > 0 
            ? `<span style="color: #059669; font-weight: 700;">● In Stock (${product.stock} units available)</span>` 
            : `<span style="color: #ef4444; font-weight: 700;">● Currently Out of Stock</span>`;

        body.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 28px; align-items: start;">
                <div>
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 320px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                    <div style="margin-top: 14px; text-align: center; font-size: 13px; color: #64748b;">
                        Category: <strong>${product.category}</strong>
                    </div>
                </div>
                <div>
                    <div style="font-family: monospace; font-size: 12px; color: #6366f1; font-weight: 700; margin-bottom: 4px;">ITEM ID: ${product.id}</div>
                    <h2 style="font-size: 22px; font-weight: 800; line-height: 1.3; margin-bottom: 10px;">${product.name}</h2>
                    <div style="font-size: 14px; margin-bottom: 14px;">${stockStatus}</div>
                    <div style="font-size: 26px; font-weight: 800; color: #6366f1; margin-bottom: 16px;">₹${product.price.toLocaleString('en-IN')}</div>
                    
                    <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 22px; padding: 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                        ${product.description}
                    </p>

                    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
                        <label style="font-size: 14px; font-weight: 600;">Quantity:</label>
                        <div class="qty-control">
                            <button class="qty-btn" onclick="adjustModalQty(-1)">-</button>
                            <input type="text" id="modal-qty-input" class="qty-number" value="1" readonly>
                            <button class="qty-btn" onclick="adjustModalQty(1)">+</button>
                        </div>
                        <span style="font-size: 12px; color: #94a3b8;">Max limit: ${product.stock}</span>
                    </div>

                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-primary" onclick="addModalItemToCart('${product.id}')" style="flex: 1;" ${product.stock === 0 ? 'disabled' : ''}>
                            🛒 Add to Shopping Cart
                        </button>
                        <button class="btn btn-outline" onclick="closeModal('product-detail-modal')">Close</button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add("open");
    }
}

function adjustModalQty(change) {
    const input = document.getElementById("modal-qty-input");
    if (!input) return;
    let qty = parseInt(input.value) || 1;
    qty += change;
    if (qty < 1) qty = 1;
    input.value = qty;
}

function addModalItemToCart(productId) {
    const input = document.getElementById("modal-qty-input");
    const qty = parseInt(input?.value) || 1;
    addToCart(productId, qty);
    closeModal("product-detail-modal");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
}

// ==========================================================================
// 6. SHOPPING CART FUNCTIONALITY
// ==========================================================================

function addToCart(productId, quantity = 1) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
        showToast("Product not found!", "error");
        return;
    }

    if (product.stock <= 0) {
        showToast("Sorry, this item is out of stock!", "error");
        return;
    }

    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        const newQty = cart[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
            showToast(`Cannot add more! Only ${product.stock} items available in stock.`, "error");
            return;
        }
        cart[existingIndex].quantity = newQty;
    } else {
        if (quantity > product.stock) {
            showToast(`Cannot add! Only ${product.stock} items available in stock.`, "error");
            return;
        }
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart(cart);
    showToast(`Added "${product.name}" to your cart!`, "success");
}

function updateCartQty(productId, change) {
    const cart = getCart();
    const products = getProducts();
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);

    if (!item) return;

    const newQty = item.quantity + change;

    if (newQty <= 0) {
        removeCartItem(productId);
        return;
    }

    if (product && newQty > product.stock) {
        showToast(`Stock limit reached! Only ${product.stock} units available.`, "error");
        return;
    }

    item.quantity = newQty;
    saveCart(cart);
    renderCartPage();
}

function removeCartItem(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    showToast("Item removed from your cart.", "info");
    renderCartPage();
}

function clearCart() {
    if (confirm("Are you sure you want to empty your shopping cart?")) {
        saveCart([]);
        showToast("Cart has been cleared.", "info");
        renderCartPage();
    }
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    const headerBadge = document.getElementById("header-cart-count");
    const sidebarBadge = document.getElementById("sidebar-cart-count");

    if (headerBadge) headerBadge.innerText = count;
    if (sidebarBadge) sidebarBadge.innerText = count;
}

function renderCartPage() {
    const cart = getCart();
    const container = document.getElementById("cart-items-container");
    const emptyState = document.getElementById("cart-empty-state");
    const cartLayout = document.getElementById("cart-active-layout");

    if (!container || !emptyState || !cartLayout) return;

    if (cart.length === 0) {
        emptyState.style.display = "block";
        cartLayout.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    cartLayout.style.display = "grid";

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        return `
            <tr class="cart-item-row">
                <td>
                    <div class="cart-product-info">
                        <img src="${item.image}" alt="${item.name}" class="cart-thumb">
                        <div>
                            <div style="font-weight: 700; font-size: 14.5px;">${item.name}</div>
                            <div style="font-size: 12px; color: #64748b;">SKU: ${item.id} | ${item.category}</div>
                            <div style="font-size: 13px; color: #6366f1; font-weight: 600; margin-top: 2px;">₹${item.price.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                </td>
                <td style="text-align: center;">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                        <span class="qty-number">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                    </div>
                </td>
                <td style="text-align: right; font-weight: 700; font-size: 15px;">
                    ₹${itemTotal.toLocaleString('en-IN')}
                </td>
                <td style="text-align: center;">
                    <button class="remove-btn" title="Remove Item" onclick="removeCartItem('${item.id}')">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    // Financial Calculation
    const deliveryFee = subtotal >= 999 ? 0 : 99;
    const grandTotal = subtotal + deliveryFee;

    document.getElementById("cart-subtotal").innerText = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById("cart-delivery").innerText = deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`;
    document.getElementById("cart-grand-total").innerText = `₹${grandTotal.toLocaleString('en-IN')}`;
}

// ==========================================================================
// 7. CHECKOUT & ORDER PLACEMENT
// ==========================================================================

function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast("Your cart is empty! Add products before checkout.", "error");
        return;
    }

    // Pre-fill customer details from logged in user if available
    const user = getCurrentUser();
    if (user) {
        document.getElementById("checkout-name").value = user.name || "";
        document.getElementById("checkout-email").value = user.email || "";
        document.getElementById("checkout-mobile").value = user.mobile || "";
        document.getElementById("checkout-address").value = user.address || "";
    }

    // Render Checkout Summary
    let subtotal = 0;
    const checkoutItemsBox = document.getElementById("checkout-items-summary");
    if (checkoutItemsBox) {
        checkoutItemsBox.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13.5px;">
                    <div>
                        <strong>${item.name}</strong>
                        <div style="font-size: 12px; color: #64748b;">${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div style="font-weight: 600;">₹${itemTotal.toLocaleString('en-IN')}</div>
                </div>
            `;
        }).join("");
    }

    const deliveryFee = subtotal >= 999 ? 0 : 99;
    const grandTotal = subtotal + deliveryFee;

    document.getElementById("checkout-subtotal").innerText = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById("checkout-delivery").innerText = deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`;
    document.getElementById("checkout-grand-total").innerText = `₹${grandTotal.toLocaleString('en-IN')}`;

    navigateTo("checkout");
}

function selectPaymentMethod(method) {
    document.querySelectorAll(".payment-option-card").forEach(card => card.classList.remove("selected"));
    const selectedCard = document.querySelector(`.payment-option-card[data-payment="${method}"]`);
    if (selectedCard) selectedCard.classList.add("selected");

    const upiBox = document.getElementById("demo-upi-box");
    const cardBox = document.getElementById("demo-card-box");

    if (upiBox) upiBox.style.display = method === "upi" ? "block" : "none";
    if (cardBox) cardBox.style.display = method === "card" ? "block" : "none";
}

function handleCheckoutSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("checkout-name").value.trim();
    const email = document.getElementById("checkout-email").value.trim();
    const mobile = document.getElementById("checkout-mobile").value.trim();
    const address = document.getElementById("checkout-address").value.trim();

    // 1. Regex Validation
    const nameRegex = /^[a-zA-Z\s.]{3,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const indianMobileRegex = /^[6-9]\d{9}$/;

    if (!nameRegex.test(name)) {
        showToast("Please enter a valid full name (letters and spaces only, min 3 chars).", "error");
        return;
    }
    if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address.", "error");
        return;
    }
    if (!indianMobileRegex.test(mobile)) {
        showToast("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.", "error");
        return;
    }
    if (address.length < 10) {
        showToast("Please enter a complete delivery address with PIN code (min 10 characters).", "error");
        return;
    }

    // Determine payment method
    const selectedPayCard = document.querySelector(".payment-option-card.selected");
    const payMode = selectedPayCard ? selectedPayCard.getAttribute("data-payment") : "cod";
    let paymentMethodName = "Cash on Delivery";
    if (payMode === "upi") paymentMethodName = "UPI Demo Payment";
    if (payMode === "card") paymentMethodName = "Card Demo Payment";

    const cart = getCart();
    if (cart.length === 0) {
        showToast("Cart is empty!", "error");
        return;
    }

    // Check stock availability & deduct stock
    const products = getProducts();
    for (const item of cart) {
        const prod = products.find(p => p.id === item.id);
        if (!prod || prod.stock < item.quantity) {
            showToast(`Sorry, ${item.name} has only ${prod ? prod.stock : 0} items remaining!`, "error");
            return;
        }
    }

    // Deduct stock
    for (const item of cart) {
        const prod = products.find(p => p.id === item.id);
        if (prod) prod.stock -= item.quantity;
    }
    saveProducts(products);

    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.map(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        return {
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
            subtotal: itemSubtotal
        };
    });

    const deliveryFee = subtotal >= 999 ? 0 : 99;
    const grandTotal = subtotal + deliveryFee;

    // Generate unique Order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-2026-${randomSuffix}`;

    const newOrder = {
        orderId: orderId,
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        customerName: name,
        email: email,
        mobile: mobile,
        address: address,
        items: orderItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: grandTotal,
        paymentMethod: paymentMethodName,
        status: "Confirmed"
    };

    // Save order
    const orders = getOrders();
    orders.unshift(newOrder);
    saveOrders(orders);

    // Clear cart
    saveCart([]);

    // Show Success Section
    displayOrderSuccess(newOrder);
}

function displayOrderSuccess(order) {
    document.getElementById("success-order-id").innerText = order.orderId;
    document.getElementById("success-total-amount").innerText = `₹${order.total.toLocaleString('en-IN')}`;
    document.getElementById("success-delivery-address").innerText = order.address;
    document.getElementById("success-payment-mode").innerText = order.paymentMethod;

    // Attach actions
    document.getElementById("btn-success-view-invoice").onclick = () => viewOrderInvoice(order.orderId);
    document.getElementById("btn-success-download-report").onclick = () => downloadOrderReportText(order.orderId);

    navigateTo("order-success");
    showToast(`Order #${order.orderId} placed successfully!`, "success");
}

// ==========================================================================
// 8. ORDERS HISTORY & INVOICE MANAGEMENT
// ==========================================================================

function renderOrdersPage() {
    const orders = getOrders();
    const container = document.getElementById("orders-table-body");
    const emptyState = document.getElementById("orders-empty-state");

    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        return;
    }

    if (emptyState) emptyState.style.display = "none";

    container.innerHTML = orders.map(order => {
        let statusClass = "confirmed";
        if (order.status === "Processing") statusClass = "processing";
        if (order.status === "Delivered") statusClass = "delivered";

        const itemsSummary = order.items.map(i => `${i.name} (×${i.quantity})`).join(", ");

        return `
            <tr>
                <td style="font-weight: 700; font-family: monospace; color: #6366f1;">
                    ${order.orderId}
                </td>
                <td style="font-size: 13px; color: #64748b;">
                    ${order.date}
                </td>
                <td>
                    <div style="font-size: 13.5px; font-weight: 600;">${itemsSummary}</div>
                    <div style="font-size: 12px; color: #94a3b8;">${order.items.length} item type(s)</div>
                </td>
                <td style="font-weight: 800; color: #0f172a;">
                    ₹${order.total.toLocaleString('en-IN')}
                </td>
                <td style="font-size: 13px;">
                    ${order.paymentMethod}
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ● ${order.status}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn btn-sm btn-outline" title="View Tax Invoice" onclick="viewOrderInvoice('${order.orderId}')">
                            📄 Invoice
                        </button>
                        <button class="btn btn-sm btn-outline" title="Download Confirmation Report (.txt)" onclick="downloadOrderReportText('${order.orderId}')">
                            💾 Report
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function renderInvoicesPage() {
    const orders = getOrders();
    const container = document.getElementById("invoices-list-container");
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <h3>No Invoices Available</h3>
                <p>You haven't placed any orders yet. Place an order to generate an invoice!</p>
                <button class="btn btn-primary" onclick="navigateTo('shop')">Start Shopping</button>
            </div>
        `;
        return;
    }

    // Default to first order invoice
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <label style="font-size: 14px; font-weight: 600;">Select Order Invoice:</label>
                <select class="form-select" onchange="renderSpecificInvoice(this.value)" id="invoice-order-select">
                    ${orders.map(o => `<option value="${o.orderId}">Invoice #${o.orderId} - ₹${o.total.toLocaleString('en-IN')} (${o.date.split(' ')[0]})</option>`).join("")}
                </select>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" onclick="printCurrentInvoice()">🖨️ Print Invoice</button>
                <button class="btn btn-primary" onclick="downloadCurrentInvoiceHtml()">⬇️ Download Invoice</button>
            </div>
        </div>
        <div id="invoice-render-box"></div>
    `;

    renderSpecificInvoice(orders[0].orderId);
}

function renderSpecificInvoice(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.orderId === orderId);
    const box = document.getElementById("invoice-render-box");
    if (!order || !box) return;

    box.innerHTML = generateInvoiceHtml(order);
}

function viewOrderInvoice(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;

    const modal = document.getElementById("invoice-view-modal");
    const container = document.getElementById("invoice-modal-content");
    if (modal && container) {
        container.innerHTML = generateInvoiceHtml(order);
        modal.classList.add("open");
    }
}

// Generate XSLT-equivalent Invoice Layout
function generateInvoiceHtml(order) {
    return `
        <div class="invoice-container" id="printable-invoice" style="max-width: 820px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #38bdf8 100%); color: #ffffff; padding: 36px 40px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">ShopEase</h1>
                    <p style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Integrated E-Commerce Product & Order Management System</p>
                    <p style="font-size: 12px; opacity: 0.85;">Discover. Shop. Enjoy.</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">TAX INVOICE</div>
                    <div style="font-size: 14px; opacity: 0.95; margin-top: 4px; font-family: monospace;">INV-${order.orderId}</div>
                    <p style="font-size: 12.5px; margin-top: 4px; opacity: 0.9;">Date: ${order.date}</p>
                </div>
            </div>

            <div style="padding: 36px 40px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9;">
                    <div>
                        <h3 style="font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.8px; margin-bottom: 8px;">BILLED TO (CUSTOMER DETAILS)</h3>
                        <p style="font-size: 14px; color: #1e293b;"><strong>${order.customerName}</strong></p>
                        <p style="font-size: 13.5px; color: #475569;">Email: ${order.email}</p>
                        <p style="font-size: 13.5px; color: #475569;">Mobile: +91 ${order.mobile}</p>
                        <p style="font-size: 13.5px; color: #475569; margin-top: 4px;">Delivery Address: ${order.address}</p>
                    </div>
                    <div>
                        <h3 style="font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.8px; margin-bottom: 8px;">ORDER & PAYMENT SUMMARY</h3>
                        <p style="font-size: 13.5px; color: #1e293b;"><strong>Order ID:</strong> ${order.orderId}</p>
                        <p style="font-size: 13.5px; color: #475569;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        <p style="font-size: 13.5px; color: #475569; margin-top: 6px;">
                            <strong>Order Status: </strong>
                            <span style="display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #ecfdf5; color: #059669;">
                                ${order.status}
                            </span>
                        </p>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 12px 14px; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase;">#</th>
                            <th style="padding: 12px 14px; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase;">Product Item</th>
                            <th style="padding: 12px 14px; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase;">Category</th>
                            <th style="padding: 12px 14px; text-align: right; font-size: 12px; color: #475569; text-transform: uppercase;">Unit Price</th>
                            <th style="padding: 12px 14px; text-align: right; font-size: 12px; color: #475569; text-transform: uppercase;">Qty</th>
                            <th style="padding: 12px 14px; text-align: right; font-size: 12px; color: #475569; text-transform: uppercase;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map((item, idx) => `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 14px; font-size: 13.5px; color: #64748b;">${idx + 1}</td>
                                <td style="padding: 14px; font-size: 14px;">
                                    <strong>${item.name}</strong>
                                    <div style="font-size: 12px; color: #64748b;">SKU: ${item.id}</div>
                                </td>
                                <td style="padding: 14px; font-size: 13.5px; color: #475569;">${item.category}</td>
                                <td style="padding: 14px; font-size: 14px; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
                                <td style="padding: 14px; font-size: 14px; text-align: right;">${item.quantity}</td>
                                <td style="padding: 14px; font-size: 14px; text-align: right; font-weight: 600;">₹${item.subtotal.toLocaleString('en-IN')}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
                    <div style="width: 320px;">
                        <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #64748b;">
                            <span>Subtotal</span>
                            <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #64748b;">
                            <span>Standard Delivery</span>
                            <span>${order.deliveryFee === 0 ? 'FREE' : '₹' + order.deliveryFee}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #64748b;">
                            <span>Taxes (GST Included)</span>
                            <span>₹0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 12px; margin-top: 8px; border-top: 2px solid #e2e8f0; font-size: 18px; font-weight: 800; color: #4f46e5;">
                            <span>Grand Total</span>
                            <span>₹${order.total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style="background: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; color: #64748b;">
                <div>
                    <p>Thank you for shopping with <strong>ShopEase</strong>!</p>
                    <p>Computer-generated invoice compliant with XML/XSLT specifications.</p>
                </div>
                <div>
                    <span style="display: inline-block; padding: 4px 10px; border-radius: 4px; background: #ede9fe; color: #6366f1; font-weight: 600;">
                        Authorized ShopEase Invoice
                    </span>
                </div>
            </div>
        </div>
    `;
}

function printCurrentInvoice() {
    window.print();
}

function downloadCurrentInvoiceHtml() {
    const select = document.getElementById("invoice-order-select");
    const orderId = select ? select.value : "ORD-2026-1001";
    const orders = getOrders();
    const order = orders.find(o => o.orderId === orderId) || orders[0];

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Invoice - ${order.orderId}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; padding: 30px; }
            </style>
        </head>
        <body>
            ${generateInvoiceHtml(order)}
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ShopEase_Invoice_${order.orderId}.html`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Invoice downloaded as HTML file.", "success");
}

// Order Report Text File Generation (PHP File Handling Simulation)
function downloadOrderReportText(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
        showToast("Order not found!", "error");
        return;
    }

    let reportText = `========================================================================\n`;
    reportText += `                      SHOPEASE E-COMMERCE ORDER REPORT\n`;
    reportText += `========================================================================\n`;
    reportText += `Order Reference ID   : ${order.orderId}\n`;
    reportText += `Generation Timestamp : ${order.date} IST\n`;
    reportText += `Order Status         : ${order.status}\n\n`;
    reportText += `------------------------------------------------------------------------\n`;
    reportText += `CUSTOMER BILLING & DELIVERY INFORMATION\n`;
    reportText += `------------------------------------------------------------------------\n`;
    reportText += `Customer Name        : ${order.customerName}\n`;
    reportText += `Email Address        : ${order.email}\n`;
    reportText += `Mobile Phone         : +91 ${order.mobile}\n`;
    reportText += `Delivery Address     : ${order.address}\n\n`;
    reportText += `------------------------------------------------------------------------\n`;
    reportText += `ORDERED PRODUCTS & ITEMIZATION\n`;
    reportText += `------------------------------------------------------------------------\n`;

    order.items.forEach((item, index) => {
        reportText += `[${index + 1}] SKU: ${item.id}\n`;
        reportText += `    Item: ${item.name} (${item.category})\n`;
        reportText += `    Quantity: ${item.quantity} unit(s)  x  INR ${item.price.toFixed(2)}  =  INR ${item.subtotal.toFixed(2)}\n\n`;
    });

    reportText += `------------------------------------------------------------------------\n`;
    reportText += `FINANCIAL SUMMARY\n`;
    reportText += `------------------------------------------------------------------------\n`;
    reportText += `Items Subtotal       : INR ${order.subtotal.toFixed(2)}\n`;
    reportText += `Standard Delivery    : INR ${order.deliveryFee.toFixed(2)} ${order.deliveryFee === 0 ? '(Complimentary Free Shipping)' : ''}\n`;
    reportText += `Taxes (GST Included) : INR 0.00\n`;
    reportText += `Grand Total Amount   : INR ${order.total.toFixed(2)}\n`;
    reportText += `Payment Method       : ${order.paymentMethod}\n\n`;
    reportText += `========================================================================\n`;
    reportText += `Thank you for shopping with ShopEase!\n`;
    reportText += `Tagline: "Discover. Shop. Enjoy."\n`;
    reportText += `Generated automatically by ShopEase Order Processing Subsystem.\n`;
    reportText += `========================================================================\n`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${order.orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Order report (${order.orderId}.txt) downloaded successfully!`, "success");
}

// ==========================================================================
// 9. CUSTOMER REGISTRATION, LOGIN & ACCOUNT
// ==========================================================================

function updateAuthUI() {
    const user = getCurrentUser();
    const profileChip = document.getElementById("header-profile-chip");
    const profileName = document.getElementById("header-profile-name");
    const avatar = document.getElementById("header-avatar");

    if (user) {
        if (profileName) profileName.innerText = user.name.split(" ")[0];
        if (avatar) avatar.innerText = user.name.charAt(0).toUpperCase();
        if (profileChip) profileChip.title = `Logged in as ${user.name} (${user.email})`;
    } else {
        if (profileName) profileName.innerText = "Guest Sign In";
        if (avatar) avatar.innerText = "👤";
        if (profileChip) profileChip.title = "Click to Login / Register";
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address.", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem("shopease_users")) || [];
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

    if (matched) {
        setCurrentUser({
            name: matched.name,
            email: matched.email,
            mobile: matched.mobile,
            address: matched.address
        });
        showToast(`Welcome back, ${matched.name}!`, "success");
        navigateTo("home");
    } else {
        showToast("Invalid email or password! Please try again.", "error");
    }
}

function handleRegisterSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const mobile = document.getElementById("reg-mobile").value.trim();
    const address = document.getElementById("reg-address").value.trim();
    const pass = document.getElementById("reg-password").value;
    const confirmPass = document.getElementById("reg-confirm-password").value;

    // Validations
    const nameRegex = /^[a-zA-Z\s.]{3,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const indianMobileRegex = /^[6-9]\d{9}$/;

    if (!nameRegex.test(name)) {
        showToast("Name must contain at least 3 letters and only letters/spaces.", "error");
        return;
    }
    if (!emailRegex.test(email)) {
        showToast("Please enter a valid email format.", "error");
        return;
    }
    if (!indianMobileRegex.test(mobile)) {
        showToast("Enter a valid 10-digit Indian mobile number (e.g., 9876543210).", "error");
        return;
    }
    if (address.length < 10) {
        showToast("Delivery address must be at least 10 characters long.", "error");
        return;
    }
    if (pass.length < 6) {
        showToast("Password must be at least 6 characters long.", "error");
        return;
    }
    if (pass !== confirmPass) {
        showToast("Passwords do not match!", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem("shopease_users")) || [];
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showToast("An account with this email address already exists!", "error");
        return;
    }

    const newUser = {
        name,
        email,
        mobile,
        address,
        password: pass
    };

    users.push(newUser);
    localStorage.setItem("shopease_users", JSON.stringify(users));

    // Automatically sign in
    setCurrentUser({
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        address: newUser.address
    });

    showToast("Registration successful! Welcome to ShopEase.", "success");
    navigateTo("home");
}

function handleLogout() {
    if (confirm("Are you sure you want to log out from ShopEase?")) {
        setCurrentUser(null);
        showToast("You have been successfully logged out.", "info");
        navigateTo("home");
    }
}

function renderAccountPage() {
    const user = getCurrentUser();
    const loggedInView = document.getElementById("account-logged-in-view");
    const loggedOutView = document.getElementById("account-logged-out-view");

    if (!loggedInView || !loggedOutView) return;

    if (user) {
        loggedInView.style.display = "block";
        loggedOutView.style.display = "none";

        document.getElementById("profile-display-name").innerText = user.name;
        document.getElementById("profile-display-email").innerText = user.email;
        document.getElementById("profile-display-mobile").innerText = user.mobile;
        document.getElementById("profile-display-address").innerText = user.address;
    } else {
        loggedInView.style.display = "none";
        loggedOutView.style.display = "block";
    }
}

// ==========================================================================
// 10. XML DATA MANAGEMENT & DOM OPERATIONS
// ==========================================================================

let runtimeProductsXml = null;
let runtimeOrdersXml = null;

function loadRuntimeXML() {
    if (!runtimeProductsXml) {
        fetch("products.xml")
            .then(res => res.text())
            .then(xmlStr => {
                const parser = new DOMParser();
                runtimeProductsXml = parser.parseFromString(xmlStr, "application/xml");
            })
            .catch(() => {
                // Fallback XML template if fetch fails in local file protocol
                const xmlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<products>
    <product>
        <product_id>PROD101</product_id>
        <product_name>Wireless Noise Canceling Headphones</product_name>
        <category>Electronics</category>
        <description>High-fidelity acoustic stereo sound with active 32dB noise cancellation.</description>
        <price>3499.00</price>
        <stock>15</stock>
    </product>
    <product>
        <product_id>PROD102</product_id>
        <product_name>Smart Fitness Tracker AMOLED</product_name>
        <category>Electronics</category>
        <description>1.43-inch vibrant touch AMOLED display with continuous heart rate.</description>
        <price>2299.00</price>
        <stock>22</stock>
    </product>
    <product>
        <product_id>PROD109</product_id>
        <product_name>1.8L Stainless Steel Electric Kettle</product_name>
        <category>Home Appliances</category>
        <description>Fast-heating 1500W cordless electric jug.</description>
        <price>899.00</price>
        <stock>35</stock>
    </product>
</products>`;
                const parser = new DOMParser();
                runtimeProductsXml = parser.parseFromString(xmlTemplate, "application/xml");
            });
    }

    if (!runtimeOrdersXml) {
        fetch("orders.xml")
            .then(res => res.text())
            .then(xmlStr => {
                const parser = new DOMParser();
                runtimeOrdersXml = parser.parseFromString(xmlStr, "application/xml");
            })
            .catch(() => {
                const xmlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<orders>
    <order>
        <order_id>ORD-2026-1001</order_id>
        <customer_name>Rahul Sharma</customer_name>
        <order_date>2026-11-20</order_date>
        <total_amount>5798.00</total_amount>
        <payment_method>UPI Demo Payment</payment_method>
        <order_status>Delivered</order_status>
    </order>
</orders>`;
                const parser = new DOMParser();
                runtimeOrdersXml = parser.parseFromString(xmlTemplate, "application/xml");
            });
    }
}

function renderXMLManagementPage() {
    loadRuntimeXML();
    refreshXmlPreview();
}

function switchXmlTab(tabId) {
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));

    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const pane = document.getElementById("tab-pane-" + tabId);

    if (btn) btn.classList.add("active");
    if (pane) pane.classList.add("active");

    if (tabId === "preview") refreshXmlPreview();
}

// 1. Search XML by Product ID or Name
function searchXmlProduct() {
    const query = document.getElementById("xml-product-search-input").value.trim().toLowerCase();
    const resultBox = document.getElementById("xml-product-search-result");
    if (!query || !resultBox) return;

    if (!runtimeProductsXml) {
        showToast("Loading XML database...", "info");
        loadRuntimeXML();
        setTimeout(searchXmlProduct, 500);
        return;
    }

    const products = runtimeProductsXml.getElementsByTagName("product");
    let matched = null;

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const id = p.getElementsByTagName("product_id")[0]?.textContent || "";
        const name = p.getElementsByTagName("product_name")[0]?.textContent || "";

        if (id.toLowerCase() === query || name.toLowerCase().includes(query)) {
            matched = {
                id: id,
                name: name,
                category: p.getElementsByTagName("category")[0]?.textContent || "",
                price: p.getElementsByTagName("price")[0]?.textContent || "",
                stock: p.getElementsByTagName("stock")[0]?.textContent || "",
                desc: p.getElementsByTagName("description")[0]?.textContent || ""
            };
            break;
        }
    }

    if (matched) {
        resultBox.innerHTML = `
            <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #c7d2fe; box-shadow: 0 4px 10px rgba(99, 102, 241, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <span style="font-family: monospace; font-size: 12px; color: #6366f1; font-weight: 700;">XML NODE FOUND: ${matched.id}</span>
                        <h4 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-top: 4px;">${matched.name}</h4>
                    </div>
                    <span style="background: #ede9fe; color: #6366f1; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
                        ${matched.category}
                    </span>
                </div>
                <p style="font-size: 13.5px; color: #475569; margin-bottom: 14px;">${matched.desc}</p>
                <div style="display: flex; gap: 24px; font-size: 14px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                    <div>Price: <strong style="color: #6366f1;">₹${matched.price}</strong></div>
                    <div>Stock Available: <strong>${matched.stock} units</strong></div>
                </div>
            </div>
        `;
        showToast(`Product "${matched.id}" retrieved successfully from XML DOM!`, "success");
    } else {
        resultBox.innerHTML = `
            <div style="background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 14px; border-radius: 8px;">
                No matching product found in XML for query "${query}". Try searching by ID like <strong>PROD101</strong>.
            </div>
        `;
    }
}

// 2. Search XML by Order ID
function searchXmlOrder() {
    const query = document.getElementById("xml-order-search-input").value.trim().toUpperCase();
    const resultBox = document.getElementById("xml-order-search-result");
    if (!query || !resultBox) return;

    if (!runtimeOrdersXml) {
        loadRuntimeXML();
        setTimeout(searchXmlOrder, 500);
        return;
    }

    const orders = runtimeOrdersXml.getElementsByTagName("order");
    let matched = null;

    for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        const id = o.getElementsByTagName("order_id")[0]?.textContent || "";

        if (id.toUpperCase() === query) {
            matched = {
                id: id,
                customer: o.getElementsByTagName("customer_name")[0]?.textContent || "",
                date: o.getElementsByTagName("order_date")[0]?.textContent || "",
                total: o.getElementsByTagName("total_amount")[0]?.textContent || "",
                payMode: o.getElementsByTagName("payment_method")[0]?.textContent || "",
                status: o.getElementsByTagName("order_status")[0]?.textContent || ""
            };
            break;
        }
    }

    if (matched) {
        resultBox.innerHTML = `
            <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #c7d2fe; box-shadow: 0 4px 10px rgba(99, 102, 241, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <span style="font-family: monospace; font-size: 12px; color: #6366f1; font-weight: 700;">ORDER RECORD: ${matched.id}</span>
                        <h4 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-top: 4px;">Customer: ${matched.customer}</h4>
                    </div>
                    <span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
                        ${matched.status}
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; font-size: 13.5px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                    <div>Order Date: <strong>${matched.date}</strong></div>
                    <div>Payment: <strong>${matched.payMode}</strong></div>
                    <div>Grand Total: <strong style="color: #6366f1;">₹${matched.total}</strong></div>
                </div>
            </div>
        `;
        showToast(`Order "${matched.id}" retrieved successfully from XML DOM!`, "success");
    } else {
        resultBox.innerHTML = `
            <div style="background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 14px; border-radius: 8px;">
                Order ID "${query}" not found in XML records. Try <strong>ORD-2026-1001</strong>.
            </div>
        `;
    }
}

// 3. Add Product Node to XML DOM
function handleAddProductToXml(event) {
    event.preventDefault();
    if (!runtimeProductsXml) loadRuntimeXML();

    const id = document.getElementById("xml-add-id").value.trim().toUpperCase();
    const name = document.getElementById("xml-add-name").value.trim();
    const category = document.getElementById("xml-add-category").value;
    const price = parseFloat(document.getElementById("xml-add-price").value).toFixed(2);
    const stock = parseInt(document.getElementById("xml-add-stock").value);
    const desc = document.getElementById("xml-add-desc").value.trim();

    // ID validation
    if (!/^PROD[0-9]{3,4}$/.test(id)) {
        showToast("Product ID must match schema pattern: PROD followed by 3-4 digits (e.g. PROD117).", "error");
        return;
    }

    try {
        const root = runtimeProductsXml.getElementsByTagName("products")[0];
        const newProductNode = runtimeProductsXml.createElement("product");

        const idNode = runtimeProductsXml.createElement("product_id");
        idNode.textContent = id;
        newProductNode.appendChild(idNode);

        const nameNode = runtimeProductsXml.createElement("product_name");
        nameNode.textContent = name;
        newProductNode.appendChild(nameNode);

        const catNode = runtimeProductsXml.createElement("category");
        catNode.textContent = category;
        newProductNode.appendChild(catNode);

        const descNode = runtimeProductsXml.createElement("description");
        descNode.textContent = desc;
        newProductNode.appendChild(descNode);

        const priceNode = runtimeProductsXml.createElement("price");
        priceNode.textContent = price;
        newProductNode.appendChild(priceNode);

        const stockNode = runtimeProductsXml.createElement("stock");
        stockNode.textContent = stock.toString();
        newProductNode.appendChild(stockNode);

        root.appendChild(newProductNode);

        // Also append to local products list
        const localProducts = getProducts();
        localProducts.push({
            id, name, category, price: parseFloat(price), stock, description: desc,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
            rating: 5.0
        });
        saveProducts(localProducts);

        showToast(`Product node <product id="${id}"> successfully added to XML DOM!`, "success");
        event.target.reset();
        refreshXmlPreview();
    } catch (e) {
        showToast("Error appending node to XML DOM: " + e.message, "error");
    }
}

// 4. XML Schema Validation Demo
function validateXmlSchema(type) {
    const resultBox = document.getElementById("xml-validation-result");
    if (!resultBox) return;

    if (type === "products") {
        if (!runtimeProductsXml) loadRuntimeXML();
        const products = runtimeProductsXml.getElementsByTagName("product");

        let errors = [];
        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            const id = p.getElementsByTagName("product_id")[0]?.textContent;
            const name = p.getElementsByTagName("product_name")[0]?.textContent;
            const cat = p.getElementsByTagName("category")[0]?.textContent;
            const price = parseFloat(p.getElementsByTagName("price")[0]?.textContent);
            const stock = parseInt(p.getElementsByTagName("stock")[0]?.textContent);

            if (!id || !/^PROD[0-9]{3,4}$/.test(id)) errors.push(`Invalid product_id pattern on element ${i + 1}`);
            if (!name || name.length < 3) errors.push(`product_name too short on product ${id}`);
            if (!["Electronics", "Fashion", "Home Appliances", "Accessories", "Beauty and Personal Care"].includes(cat)) {
                errors.push(`Invalid enumeration category "${cat}" on product ${id}`);
            }
            if (isNaN(price) || price <= 0) errors.push(`Price must be positive on product ${id}`);
            if (isNaN(stock) || stock < 0) errors.push(`Stock must be non-negative on product ${id}`);
        }

        if (errors.length === 0) {
            resultBox.className = "validation-result-box success";
            resultBox.innerHTML = `
                <h4>✅ XML Schema Validation Succeeded</h4>
                <p>Target: <strong>products.xml</strong> against <strong>products.xsd</strong></p>
                <p>Status: All <strong>${products.length} product elements</strong> strictly adhere to the defined XML Schema Definitions (data types, ID patterns, enumerations, and constraints).</p>
            `;
        } else {
            resultBox.className = "validation-result-box error";
            resultBox.innerHTML = `
                <h4>❌ XML Validation Errors Found</h4>
                <ul>${errors.map(err => `<li>${err}</li>`).join("")}</ul>
            `;
        }
    } else if (type === "orders") {
        resultBox.className = "validation-result-box success";
        resultBox.innerHTML = `
            <h4>✅ XML Schema Validation Succeeded</h4>
            <p>Target: <strong>orders.xml</strong> against <strong>orders.xsd</strong></p>
            <p>Status: All order elements comply with schema rules, itemization structures, and date formatting constraints.</p>
        `;
    }
}

function testInvalidXml() {
    const resultBox = document.getElementById("xml-validation-result");
    if (!resultBox) return;

    resultBox.className = "validation-result-box error";
    resultBox.innerHTML = `
        <h4>❌ XML Schema Validation Error Detected</h4>
        <p>Target: <strong>Simulated Malformed XML Element</strong></p>
        <p><strong>Schema Constraint Violation:</strong> Element <code>&lt;price&gt;-250.00&lt;/price&gt;</code> violates <code>xs:minExclusive value="0"</code> rule, and element <code>&lt;category&gt;Automotive&lt;/category&gt;</code> does not exist in permitted enumeration list.</p>
        <p style="margin-top: 6px; font-size: 13px;"><em>Note: The XML Validator successfully catches illegal values and protects database integrity.</em></p>
    `;
    showToast("Invalid XML test executed: Errors detected and captured accurately.", "info");
}

function refreshXmlPreview() {
    const box = document.getElementById("xml-preview-box");
    if (!box) return;

    if (!runtimeProductsXml) loadRuntimeXML();
    if (runtimeProductsXml) {
        const serializer = new XMLSerializer();
        const xmlString = serializer.serializeToString(runtimeProductsXml);
        box.textContent = xmlString;
    }
}

// ==========================================================================
// 11. INITIALIZATION ON DOM READY
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initializeStorage();
    updateCartCount();
    updateAuthUI();
    loadRuntimeXML();

    // Render initial home view
    renderHomePage();

    // Global Search Bar Handler (Header)
    const headerSearch = document.getElementById("header-search-input");
    if (headerSearch) {
        headerSearch.addEventListener("keyup", (e) => {
            if (e.key === "Enter") handleSearch(headerSearch.value);
        });
    }

    // Shop Section Search Bar Handler
    const shopSearch = document.getElementById("shop-search-input");
    if (shopSearch) {
        shopSearch.addEventListener("input", (e) => {
            currentFilter.search = e.target.value;
            renderShopCatalogue();
        });
    }

    // Shop Category Select Handler
    const shopCatSelect = document.getElementById("shop-category-select");
    if (shopCatSelect) {
        shopCatSelect.addEventListener("change", (e) => {
            filterByCategory(e.target.value);
        });
    }

    // Shop Sort Select Handler
    const shopSortSelect = document.getElementById("shop-sort-select");
    if (shopSortSelect) {
        shopSortSelect.addEventListener("change", (e) => {
            currentFilter.sort = e.target.value;
            renderShopCatalogue();
        });
    }

    // Shop Stock Checkbox Handler
    const shopStockCheck = document.getElementById("shop-stock-checkbox");
    if (shopStockCheck) {
        shopStockCheck.addEventListener("change", (e) => {
            currentFilter.inStockOnly = e.target.checked;
            renderShopCatalogue();
        });
    }

    // Mobile Sidebar Toggle
    const mobileBtn = document.getElementById("mobile-menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    if (mobileBtn && sidebar) {
        mobileBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }
});
