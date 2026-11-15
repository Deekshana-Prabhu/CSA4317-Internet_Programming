/**
 * ========================================================
 * TECHNOVA - Electronics Store
 * Comprehensive JavaScript Engine
 * Handles: Product Rendering, Live Filtering & Search,
 * LocalStorage Shopping Cart, Enquiry Validation & Confirmation,
 * Interactive Product Comparison Table, Countdown Timer & Animations
 * ========================================================
 */

// 1. PRODUCT DATABASE (14 Premium Electronic Devices)
const productsData = [
  {
    id: 'prod-1',
    name: 'Apple iPhone 16',
    brand: 'Apple',
    category: 'smartphones',
    categoryName: 'Smartphones',
    price: 79999,
    originalPrice: 89999,
    discount: 11,
    rating: 4.9,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/iphone-16.svg',
    shortSpec: 'A18 Bionic Chip • 128GB Storage • 48MP Fusion Camera • Super Retina XDR',
    fullSpecs: {
      processor: 'Apple A18 Bionic (3nm)',
      ram: '8 GB LPDDR5X',
      storage: '128 GB NVMe',
      display: '6.1-inch Super Retina XDR OLED (120Hz ProMotion)',
      battery: '3561 mAh (Fast Wireless MagSafe)',
      camera: '48MP Main + 12MP Ultra-Wide with 4K Dolby Vision',
      os: 'iOS 18 with Apple Intelligence',
      warranty: '1 Year Apple Official Warranty'
    },
    badge: 'Bestseller',
    featured: true,
    isOffer: true
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy S25',
    brand: 'Samsung',
    category: 'smartphones',
    categoryName: 'Smartphones',
    price: 84999,
    originalPrice: 94999,
    discount: 10,
    rating: 4.8,
    reviewsCount: 980,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/galaxy-s25.svg',
    shortSpec: 'Snapdragon 8 Elite • 12GB RAM • 256GB • Dynamic AMOLED 2X 120Hz',
    fullSpecs: {
      processor: 'Snapdragon 8 Elite Mobile Platform',
      ram: '12 GB LPDDR5X',
      storage: '256 GB UFS 4.0',
      display: '6.2-inch Dynamic AMOLED 2X, 2600 nits Peak',
      battery: '4000 mAh (45W Super Fast Charging)',
      camera: '50MP OIS + 12MP Ultra-wide + 10MP Telephoto 3x',
      os: 'Android 15, One UI 7.0 (Galaxy AI)',
      warranty: '1 Year Manufacturer Warranty'
    },
    badge: 'Flagship',
    featured: true,
    isOffer: false
  },
  {
    id: 'prod-3',
    name: 'OnePlus 13',
    brand: 'OnePlus',
    category: 'smartphones',
    categoryName: 'Smartphones',
    price: 64999,
    originalPrice: 69999,
    discount: 7,
    rating: 4.7,
    reviewsCount: 650,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/oneplus-13.svg',
    shortSpec: 'Snapdragon 8 Elite • 16GB RAM • 6000mAh Battery • Hasselblad Camera',
    fullSpecs: {
      processor: 'Snapdragon 8 Elite 3nm',
      ram: '16 GB LPDDR5X',
      storage: '256 GB UFS 4.0',
      display: '6.82-inch 2K Oriental LTPO AMOLED 120Hz',
      battery: '6000 mAh Glacier Battery (100W SUPERVOOC)',
      camera: '50MP Sony LYT-808 + 50MP Periscope 3X + 50MP UW',
      os: 'OxygenOS 15 based on Android 15',
      warranty: '1 Year Brand Warranty'
    },
    badge: 'Performance King',
    featured: true,
    isOffer: true
  },
  {
    id: 'prod-4',
    name: 'MacBook Air M4',
    brand: 'Apple',
    category: 'laptops',
    categoryName: 'Laptops',
    price: 114900,
    originalPrice: 124900,
    discount: 8,
    rating: 4.9,
    reviewsCount: 820,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/macbook-air-m4.svg',
    shortSpec: 'Apple M4 Chip (10-Core GPU) • 16GB Unified RAM • 512GB SSD • Liquid Retina',
    fullSpecs: {
      processor: 'Apple M4 Chip (8-core CPU / 10-core GPU)',
      ram: '16 GB Unified Memory',
      storage: '512 GB High-Speed NVMe SSD',
      display: '13.6-inch Liquid Retina Display with True Tone',
      battery: '52.6 Wh Lithium-Polymer (Up to 18 Hours Battery)',
      camera: '1080p FaceTime HD Camera with Center Stage',
      os: 'macOS Sequoia with Apple Intelligence',
      warranty: '1 Year Apple International Warranty'
    },
    badge: 'Top Pick',
    featured: true,
    isOffer: false
  },
  {
    id: 'prod-5',
    name: 'HP Pavilion 15 Laptop',
    brand: 'HP',
    category: 'laptops',
    categoryName: 'Laptops',
    price: 68500,
    originalPrice: 79990,
    discount: 14,
    rating: 4.5,
    reviewsCount: 430,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/hp-pavilion.svg',
    shortSpec: 'Intel Core i7 13th Gen • 16GB DDR5 • 1TB NVMe SSD • 15.6" FHD IPS',
    fullSpecs: {
      processor: 'Intel Core i7-1355U 13th Gen (Up to 5.0 GHz)',
      ram: '16 GB DDR5 5200MHz RAM',
      storage: '1 TB PCIe NVMe M.2 SSD',
      display: '15.6-inch Full HD IPS Anti-glare Micro-edge',
      battery: '3-cell 41 Wh Li-ion (Fast charge 50% in 45 min)',
      camera: 'HP True Vision 720p HD with Dual Array Mics',
      os: 'Windows 11 Home + MS Office Home & Student',
      warranty: '1 Year Onsite Warranty from HP'
    },
    badge: 'Great Value',
    featured: true,
    isOffer: true
  },
  {
    id: 'prod-6',
    name: 'Dell Inspiron 15 Laptop',
    brand: 'Dell',
    category: 'laptops',
    categoryName: 'Laptops',
    price: 62990,
    originalPrice: 74500,
    discount: 15,
    rating: 4.6,
    reviewsCount: 510,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/dell-inspiron.svg',
    shortSpec: 'AMD Ryzen 7 7730U • 16GB RAM • 512GB SSD • 15.6" 120Hz Display',
    fullSpecs: {
      processor: 'AMD Ryzen 7 7730U 8-Core / 16-Thread',
      ram: '16 GB DDR4 3200MHz',
      storage: '512 GB M.2 PCIe NVMe Solid State Drive',
      display: '15.6-inch FHD (1920x1080) 120Hz Anti-Glare WVA',
      battery: '4-Cell 54 Wh Integrated Battery',
      camera: 'FHD RGB Camera with Privacy Shutter',
      os: 'Windows 11 Home 64-bit Edition',
      warranty: '1 Year Premium Onsite Support'
    },
    badge: 'Trending',
    featured: true,
    isOffer: false
  },
  {
    id: 'prod-7',
    name: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    category: 'headphones',
    categoryName: 'Headphones',
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    rating: 4.8,
    reviewsCount: 1150,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/sony-wh1000xm5.svg',
    shortSpec: 'Industry-Leading ANC • Auto NC Optimizer • 30hr Battery • Hi-Res LDAC',
    fullSpecs: {
      processor: 'Dual HD Noise Cancelling Processor QN1 + V1',
      ram: 'Embedded DSP Audio Engine',
      storage: 'Onboard Settings Profile Memory',
      display: 'LED Status Indicators & Touch Sensor Surface',
      battery: 'Up to 30 Hours (3 min charge = 3 hours playback)',
      camera: 'N/A (4 Beamforming Microphones with AI Noise Filter)',
      os: 'Compatible with Sony Headphones Connect (iOS/Android)',
      warranty: '1 Year Brand Warranty'
    },
    badge: 'Editor Choice',
    featured: true,
    isOffer: true
  },
  {
    id: 'prod-8',
    name: 'Apple AirPods Pro (2nd Gen)',
    brand: 'Apple',
    category: 'headphones',
    categoryName: 'Headphones',
    price: 22900,
    originalPrice: 24900,
    discount: 8,
    rating: 4.9,
    reviewsCount: 2100,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/airpods-pro.svg',
    shortSpec: 'H2 Chip • Active Noise Cancellation • Adaptive Audio • MagSafe USB-C',
    fullSpecs: {
      processor: 'Apple H2 Headphone Chip + U1 Chip in Case',
      ram: 'Custom Embedded Audio Co-processor',
      storage: 'Hardware Firmware Storage',
      display: 'N/A (Acoustic Venting & Touch Stems)',
      battery: 'Up to 6 Hours listening (30 Hours with Case)',
      camera: 'Dual Optical Sensors & Voice Accelerometers',
      os: 'Seamless Apple Ecosystem & Bluetooth 5.3 Universal',
      warranty: '1 Year Apple Warranty'
    },
    badge: 'Popular',
    featured: true,
    isOffer: false
  },
  {
    id: 'prod-9',
    name: 'Samsung Galaxy Watch 7',
    brand: 'Samsung',
    category: 'watches',
    categoryName: 'Smart Watches',
    price: 27999,
    originalPrice: 32999,
    discount: 15,
    rating: 4.7,
    reviewsCount: 340,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/galaxy-watch7.svg',
    shortSpec: '3nm Exynos W1000 • BioActive Sensor • Dual-Frequency GPS • Sapphire Glass',
    fullSpecs: {
      processor: 'Exynos W1000 (3nm Penta-core AP)',
      ram: '2 GB RAM',
      storage: '32 GB Internal Storage',
      display: '1.5-inch Super AMOLED (480x480), Always-on Display',
      battery: '425 mAh (WPC-based Wireless Fast Charging)',
      camera: 'N/A (Optical Heart Rate, ECG, BIA Sensors)',
      os: 'Wear OS 5 Powered by Samsung (One UI 6 Watch)',
      warranty: '1 Year Samsung Warranty'
    },
    badge: 'Smart Fitness',
    featured: true,
    isOffer: true
  },
  {
    id: 'prod-10',
    name: 'Apple iPad Air (M2)',
    brand: 'Apple',
    category: 'tablets',
    categoryName: 'Tablets',
    price: 59900,
    originalPrice: 64900,
    discount: 8,
    rating: 4.8,
    reviewsCount: 720,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/ipad-air.svg',
    shortSpec: 'Apple M2 Chip • 11" Liquid Retina Display • 128GB • Apple Pencil Pro Ready',
    fullSpecs: {
      processor: 'Apple M2 Chip (8-core CPU / 9-core GPU / 16-core NE)',
      ram: '8 GB High-speed RAM',
      storage: '128 GB Flash Storage',
      display: '11-inch Liquid Retina Display with P3 Wide Color',
      battery: '28.93 Wh rechargeable Li-Polymer (10 Hours)',
      camera: '12MP Wide Back Camera + Landscape 12MP Ultra-Wide',
      os: 'iPadOS 18 with Stage Manager & Apple Intelligence',
      warranty: '1 Year Apple Official Warranty'
    },
    badge: 'Creative Power',
    featured: true,
    isOffer: false
  },
  {
    id: 'prod-11',
    name: 'Canon EOS R50 Mirrorless Camera',
    brand: 'Canon',
    category: 'cameras',
    categoryName: 'Cameras',
    price: 58990,
    originalPrice: 68995,
    discount: 14,
    rating: 4.7,
    reviewsCount: 280,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/canon-eos-r50.svg',
    shortSpec: '24.2MP APS-C • 4K 30p Uncropped • Dual Pixel CMOS AF II • RF-S 18-45mm',
    fullSpecs: {
      processor: 'DIGIC X Image Processor',
      ram: 'High-speed image processing buffer',
      storage: 'SD / SDHC / SDXC (UHS-I compatible)',
      display: '2.95-inch Vari-angle Touchscreen LCD (1.04M dots)',
      battery: 'LP-E17 Rechargeable Li-ion (Approx 440 shots)',
      camera: '24.2 Megapixel APS-C CMOS Sensor with Dual Pixel AF',
      os: 'Canon EOS System Firmware with Wi-Fi & Bluetooth',
      warranty: '2 Years Canon India Warranty'
    },
    badge: 'Creator Choice',
    featured: true,
    isOffer: true
  },
  {
    id: 'prod-12',
    name: 'JBL Charge 5 Bluetooth Speaker',
    brand: 'JBL',
    category: 'speakers',
    categoryName: 'Speakers',
    price: 14999,
    originalPrice: 18999,
    discount: 21,
    rating: 4.7,
    reviewsCount: 1890,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/jbl-charge5.svg',
    shortSpec: 'Bold JBL Pro Sound • IP67 Waterproof & Dustproof • 20hr Playtime • Powerbank',
    fullSpecs: {
      processor: 'JBL PartyBoost DSP Controller',
      ram: 'Embedded Audio Processor',
      storage: 'Bluetooth Device Memory Profile',
      display: 'LED Battery Fuel Gauge',
      battery: '7500 mAh Li-ion Polymer (20 Hours Playtime)',
      camera: 'N/A (Built-in USB-A Powerbank for phone charging)',
      os: 'JBL Portable App Compatible',
      warranty: '1 Year Harman Brand Warranty'
    },
    badge: 'Hot Deal',
    featured: true,
    isOffer: true
  },
  {
    id: 'prod-13',
    name: 'Razer BlackWidow V4 Gaming Keyboard',
    brand: 'Razer',
    category: 'gaming',
    categoryName: 'Gaming Accessories',
    price: 12499,
    originalPrice: 15999,
    discount: 22,
    rating: 4.8,
    reviewsCount: 460,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/razer-keyboard.svg',
    shortSpec: 'Razer Green Mechanical Switches • Chroma RGB • 6 Dedicated Macro Keys',
    fullSpecs: {
      processor: '8000Hz HyperPolling USB Controller',
      ram: 'Hybrid On-board Storage (up to 5 profiles)',
      storage: 'Integrated Cloud & Hardware Memory',
      display: 'Per-key Chroma RGB Illumination with 2-side underglow',
      battery: 'Wired Detachable Type-C Braided Cable',
      camera: 'N/A (Plush Leatherette Magnetic Wrist Rest included)',
      os: 'Razer Synapse 3 Enabled (Windows 10/11)',
      warranty: '2 Years Manufacturer Warranty'
    },
    badge: 'Gamer Elite',
    featured: false,
    isOffer: true
  },
  {
    id: 'prod-14',
    name: 'Logitech G502 X PLUS Gaming Mouse',
    brand: 'Logitech',
    category: 'gaming',
    categoryName: 'Gaming Accessories',
    price: 11995,
    originalPrice: 14995,
    discount: 20,
    rating: 4.9,
    reviewsCount: 780,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/logitech-mouse.svg',
    shortSpec: 'LIGHTFORCE Optical Switches • HERO 25K Sensor • LIGHTSPEED Wireless RGB',
    fullSpecs: {
      processor: '32-bit ARM High-Performance Microprocessor',
      ram: '5 Onboard Memory Profiles',
      storage: 'Hardware Profile Storage',
      display: '8-Zone LIGHTSYNC RGB Lighting with Active Play Detection',
      battery: 'Rechargeable (Up to 120 Hours with RGB Off)',
      camera: 'HERO 25K Sub-Micron Optical Gaming Sensor',
      os: 'Logitech G HUB Software Support',
      warranty: '2 Years Limited Hardware Warranty'
    },
    badge: 'Pro Gaming',
    featured: false,
    isOffer: true
  }
];

// Helper: Format currency in Indian Rupees format (₹)
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// 2. STATE MANAGEMENT
let cart = [];
let currentCategoryFilter = 'all';
let currentBrandFilter = 'all';
let currentSort = 'featured';
let currentSearchTerm = '';

// Load cart from localStorage
function initCartFromStorage() {
  try {
    const savedCart = localStorage.getItem('technova_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (err) {
    console.error('Error loading cart from storage', err);
    cart = [];
  }
  updateCartBadge();
  renderCartDrawer();
}

// Save cart to localStorage
function saveCartToStorage() {
  try {
    localStorage.setItem('technova_cart', JSON.stringify(cart));
  } catch (err) {
    console.error('Error saving cart to storage', err);
  }
  updateCartBadge();
  renderCartDrawer();
}

// 3. PRODUCT RENDERING & CARD GENERATION
function renderProducts(productsToRender) {
  const container = document.getElementById('products-grid');
  const countDisplay = document.getElementById('products-count');
  const emptyState = document.getElementById('products-empty-state');

  if (!container) return;

  if (countDisplay) {
    countDisplay.textContent = `Showing ${productsToRender.length} of ${productsData.length} products`;
  }

  if (productsToRender.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  let html = '';
  productsToRender.forEach(p => {
    // Generate star rating string
    const fullStars = Math.floor(p.rating);
    const halfStar = (p.rating % 1) >= 0.5;
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<span class="star filled">★</span>';
    }
    if (halfStar) {
      starsHtml += '<span class="star half">★</span>';
    }
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<span class="star empty">☆</span>';
    }

    html += `
      <article class="product-card" data-id="${p.id}" data-category="${p.category}" data-brand="${p.brand}">
        <div class="product-card-header">
          <span class="product-badge">${p.badge || 'Official'}</span>
          <span class="discount-pill">${p.discount}% OFF</span>
        </div>
        
        <div class="product-image-wrap" onclick="openProductModal('${p.id}')">
          <img 
            src="${p.image}" 
            alt="${p.name}" 
            class="product-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='${p.fallbackImage}'"
          />
          <button class="quick-view-btn" type="button" aria-label="Quick View ${p.name}">
            <span>Quick View</span>
          </button>
        </div>

        <div class="product-card-body">
          <div class="product-brand-category">
            <span class="product-brand">${p.brand}</span>
            <span class="bullet-dot">•</span>
            <span class="product-category-name">${p.categoryName}</span>
          </div>

          <h3 class="product-title" onclick="openProductModal('${p.id}')" title="${p.name}">${p.name}</h3>

          <div class="product-rating">
            <div class="stars">${starsHtml}</div>
            <span class="rating-number">${p.rating}</span>
            <span class="reviews-count">(${p.reviewsCount.toLocaleString()})</span>
          </div>

          <p class="product-spec-preview" title="${p.shortSpec}">${p.shortSpec}</p>

          <div class="product-pricing">
            <span class="current-price">${formatCurrency(p.price)}</span>
            <span class="original-price">${formatCurrency(p.originalPrice)}</span>
            <span class="savings">Save ${formatCurrency(p.originalPrice - p.price)}</span>
          </div>
        </div>

        <div class="product-card-footer">
          <div class="action-buttons-group">
            <button type="button" class="btn btn-outline-info btn-sm view-details-btn" onclick="openProductModal('${p.id}')">
              <span>View Details</span>
            </button>
            <button type="button" class="btn btn-primary btn-sm add-to-cart-btn" onclick="addToCart('${p.id}')">
              <span class="btn-icon">🛒</span>
              <span>Add to Cart</span>
            </button>
          </div>
          <button type="button" class="btn btn-enquiry btn-block enquiry-trigger-btn" onclick="prefillEnquiry('${p.id}')">
            <span>Send Product Enquiry →</span>
          </button>
        </div>
      </article>
    `;
  });

  container.innerHTML = html;
}

// 4. FILTERING, SEARCHING & SORTING LOGIC
function applyFiltersAndSorting() {
  let filtered = [...productsData];

  // Category filter
  if (currentCategoryFilter !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategoryFilter);
  }

  // Brand filter
  if (currentBrandFilter !== 'all') {
    filtered = filtered.filter(p => p.brand.toLowerCase() === currentBrandFilter.toLowerCase());
  }

  // Search filter
  if (currentSearchTerm.trim() !== '') {
    const q = currentSearchTerm.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.shortSpec.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (currentSort === 'discount') {
    filtered.sort((a, b) => b.discount - a.discount);
  } else {
    // Default / Featured sort
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  renderProducts(filtered);
}

// Category selection handler (from Category Cards or Filter Pills)
function selectCategory(categoryKey) {
  currentCategoryFilter = categoryKey;

  // Update Category Pills UI in filter bar
  const pills = document.querySelectorAll('.category-filter-btn');
  pills.forEach(pill => {
    if (pill.getAttribute('data-category') === categoryKey) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  applyFiltersAndSorting();

  // Smooth scroll to products section
  const productsSection = document.getElementById('products');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Reset all filters
function resetFilters() {
  currentCategoryFilter = 'all';
  currentBrandFilter = 'all';
  currentSort = 'featured';
  currentSearchTerm = '';

  const searchInput = document.getElementById('product-search-input');
  const navSearchInput = document.getElementById('nav-search-input');
  const brandSelect = document.getElementById('brand-filter-select');
  const sortSelect = document.getElementById('sort-select');

  if (searchInput) searchInput.value = '';
  if (navSearchInput) navSearchInput.value = '';
  if (brandSelect) brandSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'featured';

  // Reset category pills
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-category') === 'all') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  applyFiltersAndSorting();
  showToast('Filters reset to default view', 'info');
}

// 5. SHOPPING CART LOGIC
function addToCart(productId, qty = 1) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      fallbackImage: product.fallbackImage,
      quantity: qty
    });
  }

  saveCartToStorage();
  showToast(`Added "${product.name}" to your cart!`, 'success');

  // Trigger pulse effect on cart icon
  const cartIconBtn = document.getElementById('cart-toggle-btn');
  if (cartIconBtn) {
    cartIconBtn.classList.add('pulse-glow');
    setTimeout(() => cartIconBtn.classList.remove('pulse-glow'), 600);
  }
}

function updateCartQuantity(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      const removedName = cart[itemIndex].name;
      cart.splice(itemIndex, 1);
      showToast(`Removed "${removedName}" from cart`, 'info');
    }
    saveCartToStorage();
  }
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    const removedName = cart[itemIndex].name;
    cart.splice(itemIndex, 1);
    saveCartToStorage();
    showToast(`Removed "${removedName}" from cart`, 'info');
  }
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm('Are you sure you want to clear your shopping cart?')) {
    cart = [];
    saveCartToStorage();
    showToast('Cart cleared successfully', 'info');
  }
}

function updateCartBadge() {
  const countBadge = document.getElementById('cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  if (countBadge) {
    countBadge.textContent = totalItems;
    countBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }
}

function renderCartDrawer() {
  const itemsContainer = document.getElementById('cart-items-container');
  const emptyView = document.getElementById('cart-empty-view');
  const footerEl = document.getElementById('cart-drawer-footer');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalSavingsEl = document.getElementById('cart-savings');
  const grandTotalEl = document.getElementById('cart-grand-total');

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '';
    if (emptyView) emptyView.style.display = 'flex';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (emptyView) emptyView.style.display = 'none';
  if (footerEl) footerEl.style.display = 'block';

  let subtotal = 0;
  let totalSavings = 0;
  let html = '';

  cart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    const itemSavings = (item.originalPrice - item.price) * item.quantity;
    subtotal += itemSubtotal;
    totalSavings += itemSavings;

    html += `
      <div class="cart-item-row" data-id="${item.id}">
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          class="cart-item-img"
          onerror="this.onerror=null; this.src='${item.fallbackImage}'"
        />
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-brand">${item.brand}</span>
          <div class="cart-item-price-unit">${formatCurrency(item.price)} each</div>
          
          <div class="cart-item-controls">
            <div class="quantity-stepper">
              <button type="button" class="stepper-btn minus" onclick="updateCartQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
              <span class="stepper-value">${item.quantity}</span>
              <button type="button" class="stepper-btn plus" onclick="updateCartQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="cart-item-remove-btn" onclick="removeFromCart('${item.id}')" title="Remove item">
              <span>✕ Remove</span>
            </button>
          </div>
        </div>
        <div class="cart-item-total">
          <span class="cart-item-total-price">${formatCurrency(itemSubtotal)}</span>
        </div>
      </div>
    `;
  });

  itemsContainer.innerHTML = html;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (totalSavingsEl) totalSavingsEl.textContent = formatCurrency(totalSavings);
  if (grandTotalEl) grandTotalEl.textContent = formatCurrency(subtotal);
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('modal-backdrop');
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('modal-backdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

// Convert cart to enquiry
function checkoutCartAsEnquiry() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }

  closeCartDrawer();
  
  // Create summary text for enquiry message
  const itemsList = cart.map(i => `${i.name} (Qty: ${i.quantity}, Price: ${formatCurrency(i.price * i.quantity)})`).join('\n• ');
  const totalAmount = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  
  const enquiryProductSelect = document.getElementById('enquiry-product');
  const enquiryTypeSelect = document.getElementById('enquiry-type');
  const enquiryQtyInput = document.getElementById('enquiry-qty');
  const enquiryMessage = document.getElementById('enquiry-message');

  if (enquiryProductSelect) enquiryProductSelect.value = 'Multiple Products (From Cart)';
  if (enquiryTypeSelect) enquiryTypeSelect.value = 'Price Details';
  if (enquiryQtyInput) enquiryQtyInput.value = cart.reduce((sum, i) => sum + i.quantity, 0);
  if (enquiryMessage) {
    enquiryMessage.value = `Order Enquiry for items in cart:\n• ${itemsList}\n\nEstimated Total: ${formatCurrency(totalAmount)}\nPlease share availability and corporate discounts.`;
  }

  const enquirySection = document.getElementById('enquiry');
  if (enquirySection) {
    enquirySection.scrollIntoView({ behavior: 'smooth' });
  }

  showToast('Cart converted to enquiry form details!', 'success');
}

// 6. PRODUCT DETAILS MODAL
function openProductModal(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-detail-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (!modal) return;

  // Star ratings
  const fullStars = Math.floor(product.rating);
  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) starsHtml += '★';
  for (let i = fullStars; i < 5; i++) starsHtml += '☆';

  document.getElementById('modal-prod-img').src = product.image;
  document.getElementById('modal-prod-img').onerror = function() {
    this.onerror = null;
    this.src = product.fallbackImage;
  };
  document.getElementById('modal-prod-title').textContent = product.name;
  document.getElementById('modal-prod-brand').textContent = product.brand;
  document.getElementById('modal-prod-category').textContent = product.categoryName;
  document.getElementById('modal-prod-stars').textContent = starsHtml;
  document.getElementById('modal-prod-rating-val').textContent = `${product.rating} / 5.0 (${product.reviewsCount} verified reviews)`;
  document.getElementById('modal-prod-price').textContent = formatCurrency(product.price);
  document.getElementById('modal-prod-original').textContent = formatCurrency(product.originalPrice);
  document.getElementById('modal-prod-discount').textContent = `${product.discount}% OFF`;
  document.getElementById('modal-prod-spec').textContent = product.shortSpec;

  // Detailed Specs Table
  const specsTbody = document.getElementById('modal-prod-specs-body');
  if (specsTbody) {
    specsTbody.innerHTML = `
      <tr><th>Processor / Chip</th><td>${product.fullSpecs.processor}</td></tr>
      <tr><th>RAM & Memory</th><td>${product.fullSpecs.ram}</td></tr>
      <tr><th>Internal Storage</th><td>${product.fullSpecs.storage}</td></tr>
      <tr><th>Display Specification</th><td>${product.fullSpecs.display}</td></tr>
      <tr><th>Battery & Power</th><td>${product.fullSpecs.battery}</td></tr>
      <tr><th>Camera / Optical Sensors</th><td>${product.fullSpecs.camera}</td></tr>
      <tr><th>Operating System / Software</th><td>${product.fullSpecs.os}</td></tr>
      <tr><th>Standard Warranty</th><td>${product.fullSpecs.warranty}</td></tr>
    `;
  }

  // Buttons inside modal
  const addBtn = document.getElementById('modal-add-to-cart');
  if (addBtn) {
    addBtn.onclick = function() {
      const qtyInput = document.getElementById('modal-qty-input');
      const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      addToCart(product.id, qty);
      closeProductModal();
    };
  }

  const enqBtn = document.getElementById('modal-send-enquiry');
  if (enqBtn) {
    enqBtn.onclick = function() {
      closeProductModal();
      prefillEnquiry(product.id);
    };
  }

  modal.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('product-detail-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (modal) modal.classList.remove('open');
  if (backdrop && !document.getElementById('cart-drawer')?.classList.contains('open')) {
    backdrop.classList.remove('active');
  }
  document.body.style.overflow = '';
}

// 7. PREFILL ENQUIRY FORM FROM ANY CARD
function prefillEnquiry(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const select = document.getElementById('enquiry-product');
  if (select) {
    select.value = product.name;
  }

  const enquirySection = document.getElementById('enquiry');
  if (enquirySection) {
    enquirySection.scrollIntoView({ behavior: 'smooth' });
  }

  const nameInput = document.getElementById('enquiry-name');
  if (nameInput) {
    setTimeout(() => nameInput.focus(), 500);
  }

  showToast(`Enquiry form pre-selected with "${product.name}"`, 'info');
}

// 8. ENQUIRY FORM VALIDATION, SUBMISSION & RECEIPT MODAL
function initEnquiryForm() {
  const form = document.getElementById('customer-enquiry-form');
  const productSelect = document.getElementById('enquiry-product');

  // Populate product dropdown dynamically with all 14 products
  if (productSelect) {
    let optionsHtml = '<option value="" disabled selected>-- Select a Product from our Store --</option>';
    productsData.forEach(p => {
      optionsHtml += `<option value="${p.name}">${p.name} (${p.brand} - ${formatCurrency(p.price)})</option>`;
    });
    optionsHtml += '<option value="Multiple Products (From Cart)">Multiple Products (From Cart)</option>';
    optionsHtml += '<option value="General Electronics Inquiry">General Electronics / Custom Order</option>';
    productSelect.innerHTML = optionsHtml;
  }

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('enquiry-name').value.trim();
    const email = document.getElementById('enquiry-email').value.trim();
    const phone = document.getElementById('enquiry-phone').value.trim();
    const product = document.getElementById('enquiry-product').value;
    const type = document.getElementById('enquiry-type').value;
    const qty = document.getElementById('enquiry-qty').value;
    const method = document.getElementById('enquiry-method').value;
    const message = document.getElementById('enquiry-message').value.trim();

    // Validations
    if (!name || !email || !phone || !product || !type || !qty) {
      showToast('Please fill in all mandatory required fields.', 'error');
      return;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
      showToast('Please provide a valid 10-digit mobile number.', 'error');
      document.getElementById('enquiry-phone').focus();
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please provide a valid email address.', 'error');
      document.getElementById('enquiry-email').focus();
      return;
    }

    // Generate Unique Enquiry ID: TECH-ENQ-2026-XXXXX
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const enquiryId = `TECH-ENQ-2026-${randomDigits}`;
    const timestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const enquiryRecord = {
      id: enquiryId,
      timestamp,
      customerName: name,
      email,
      phone,
      product,
      enquiryType: type,
      quantity: qty,
      preferredContact: method,
      message: message || 'N/A'
    };

    // Save to localStorage
    try {
      const storedEnquiries = JSON.parse(localStorage.getItem('technova_enquiries') || '[]');
      storedEnquiries.push(enquiryRecord);
      localStorage.setItem('technova_enquiries', JSON.stringify(storedEnquiries));
    } catch (err) {
      console.error('Error saving enquiry to localStorage', err);
    }

    // Display confirmation dialog showing ONLY submitted details
    displayEnquiryConfirmation(enquiryRecord);

    // Reset the form
    form.reset();
  });
}

// Display dedicated receipt modal showing ONLY the submitted details and enquiry ID
function displayEnquiryConfirmation(record) {
  const modal = document.getElementById('enquiry-confirmation-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (!modal) return;

  document.getElementById('conf-enquiry-id').textContent = record.id;
  document.getElementById('conf-timestamp').textContent = record.timestamp;
  document.getElementById('conf-name').textContent = record.customerName;
  document.getElementById('conf-email').textContent = record.email;
  document.getElementById('conf-phone').textContent = record.phone;
  document.getElementById('conf-product').textContent = record.product;
  document.getElementById('conf-type').textContent = record.enquiryType;
  document.getElementById('conf-qty').textContent = record.quantity;
  document.getElementById('conf-method').textContent = record.preferredContact;
  document.getElementById('conf-message').textContent = record.message;

  modal.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEnquiryConfirmation() {
  const modal = document.getElementById('enquiry-confirmation-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (modal) modal.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

// Print enquiry receipt
function printEnquiryReceipt() {
  window.print();
}

// 9. PRODUCT COMPARISON TABLE (DYNAMIC OR DEFAULT 4 FLAGSHIP PRODUCTS)
const comparisonProductIds = ['prod-1', 'prod-2', 'prod-4', 'prod-6'];

function renderComparisonTable() {
  const tbody = document.getElementById('comparison-tbody');
  if (!tbody) return;

  const compareList = comparisonProductIds
    .map(id => productsData.find(p => p.id === id))
    .filter(Boolean);

  let html = '';
  compareList.forEach(p => {
    html += `
      <tr>
        <td class="product-identity-cell">
          <div class="compare-product-info">
            <img 
              src="${p.image}" 
              alt="${p.name}" 
              class="compare-thumb"
              onerror="this.onerror=null; this.src='${p.fallbackImage}'"
            />
            <div>
              <strong class="compare-name">${p.name}</strong>
              <span class="compare-category">${p.categoryName}</span>
            </div>
          </div>
        </td>
        <td><span class="brand-tag">${p.brand}</span></td>
        <td>${p.fullSpecs.processor}</td>
        <td>${p.fullSpecs.ram}</td>
        <td>${p.fullSpecs.storage}</td>
        <td>${p.fullSpecs.display}</td>
        <td>${p.fullSpecs.battery}</td>
        <td class="compare-price-cell">
          <strong>${formatCurrency(p.price)}</strong>
          <small class="strikethrough">${formatCurrency(p.originalPrice)}</small>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// 10. PROMOTIONAL COUNTDOWN TIMER
function initCountdownTimer() {
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-minutes');
  const secsEl = document.getElementById('timer-seconds');

  if (!hoursEl || !minsEl || !secsEl) return;

  // Set deal duration: 18 hours, 45 mins from current time
  let totalSeconds = (18 * 3600) + (45 * 60) + 30;

  function updateTimer() {
    if (totalSeconds <= 0) {
      totalSeconds = 24 * 3600; // Reset for demo continuity
    }

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');

    totalSeconds--;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// 11. ANIMATED STATISTICS COUNTER
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 2000;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// 12. TOAST NOTIFICATION UTILITY
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'warning') icon = '⚠️';
  if (type === 'error') icon = '✕';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('visible'), 20);

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// 13. DOM READY INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  console.log('TECHNOVA Electronics Store initialized.');

  // Initialize Cart
  initCartFromStorage();

  // Initial Product Render
  renderProducts(productsData);

  // Comparison Table
  renderComparisonTable();

  // Enquiry Form
  initEnquiryForm();

  // Countdown Timer
  initCountdownTimer();

  // Animated Statistics
  initAnimatedCounters();

  // Navbar Sticky Scroll Effect
  const navbar = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('nav-scrolled');
    } else {
      navbar?.classList.remove('nav-scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('nav-open');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('nav-open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // Cart Button
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const backdrop = document.getElementById('modal-backdrop');

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeCartDrawer();
      closeProductModal();
      closeEnquiryConfirmation();
    });
  }

  // Category Filter Pills
  document.querySelectorAll('.category-filter-btn').forEach(button => {
    button.addEventListener('click', function() {
      const cat = this.getAttribute('data-category');
      selectCategory(cat);
    });
  });

  // Category Cards in Categories Section
  document.querySelectorAll('.category-explore-btn, .category-card').forEach(item => {
    item.addEventListener('click', function(e) {
      // Find closest card's category key
      const card = this.closest('.category-card');
      if (card) {
        const catKey = card.getAttribute('data-category');
        selectCategory(catKey);
      }
    });
  });

  // Search Inputs
  const searchInput = document.getElementById('product-search-input');
  const navSearchInput = document.getElementById('nav-search-input');

  function handleSearch(term) {
    currentSearchTerm = term;
    applyFiltersAndSorting();
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }

  if (navSearchInput) {
    navSearchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
      if (searchInput) searchInput.value = e.target.value;
      const productsSection = document.getElementById('products');
      if (productsSection && window.scrollY < productsSection.offsetTop - 200) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Brand Filter
  const brandSelect = document.getElementById('brand-filter-select');
  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      currentBrandFilter = e.target.value;
      applyFiltersAndSorting();
    });
  }

  // Sort Select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndSorting();
    });
  }

  // Reset Filters Button
  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeProductModal();
      closeEnquiryConfirmation();
    }
  });
});
