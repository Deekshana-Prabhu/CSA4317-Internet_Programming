/**
 * ============================================================================
 * AuraNest - Online Shopping Cart System
 * Technology: HTML5, CSS3, Vanilla JavaScript (ES6+)
 * Key Features:
 *   - AJAX Fetch API & JSON.parse for product data retrieval
 *   - JavaScript objects for catalog and cart data management
 *   - DOM Manipulation & DHTML for real-time reactive cart updates
 *   - Regular Expression (/^[1-9]\d*$/) for strict quantity validation
 *   - JavaScript Math methods for accurate currency and discount calculations
 *   - Search, category filtering, sorting, checkout & order confirmation
 * ============================================================================
 */

// Strict mode for cleaner and safer JavaScript execution
'use strict';

/* ==========================================================================
   1. REGULAR EXPRESSIONS & CONSTANTS
   ========================================================================== */

/**
 * Regular Expression strictly validating positive whole numbers:
 * - Must start with digits 1-9 (prevents leading zeros like '01' and zero '0')
 * - Followed by zero or more digits (\d*)
 * - Disallows negative signs, decimals, letters, whitespace, and special characters.
 */
const REGEX_POSITIVE_INTEGER = /^[1-9]\d*$/;

/**
 * Form field Regular Expressions for Checkout Validation
 */
const REGEX_NAME = /^[a-zA-Z\s]{2,50}$/;
const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGEX_PHONE = /^[\d\s()+-]{7,20}$/;
const REGEX_ZIP = /^\d{5}(-\d{4})?$|^[a-zA-Z0-9\s-]{3,10}$/;

// Sales Tax Rate (8%) & Free Shipping Threshold ($50.00)
const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50.00;
const STANDARD_SHIPPING_FEE = 5.00;

// Local Storage Keys
const STORAGE_CART_KEY = 'auranest_cart_v1';

/* ==========================================================================
   2. APPLICATION STATE
   ========================================================================== */

// All loaded products from products.json
let allProducts = [];

// Shopping Cart array storing JavaScript objects:
// [{ id, name, price, discount, quantity, image, category, inStock }]
let cart = [];

// Filter & Search states
let activeCategory = 'all';
let searchQuery = '';
let stockOnlyFilter = false;
let currentSort = 'featured';

// Promo Code state
let activePromoCode = null; // 'PASTEL10' provides extra 10% off

// Fallback embedded catalog in case local browser file:// origin prohibits AJAX fetch
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Aura Minimalist Ceramic Desk Lamp",
    category: "Home Decor",
    price: 68.00,
    discount: 15,
    rating: 4.9,
    reviewsCount: 142,
    inStock: 12,
    description: "Warm ambient glow with smooth touch dimmer, crafted from matte stoneware ceramic in a calming soft sage tone.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "CloudSoft Organic Throw Blanket",
    category: "Home Decor",
    price: 54.00,
    discount: 20,
    rating: 4.8,
    reviewsCount: 98,
    inStock: 20,
    description: "Ultra-plush breathable woven organic cotton throw in gentle blush peach for cozy lounging.",
    image: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Nordic Pastel French Press Coffee Maker",
    category: "Kitchen & Dining",
    price: 42.00,
    discount: 10,
    rating: 4.7,
    reviewsCount: 86,
    inStock: 15,
    description: "Double-walled borosilicate glass with heat-resistant matte lavender sleeve and stainless steel mesh filter.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Botanical Ultrasonic Mist Diffuser",
    category: "Wellness",
    price: 38.00,
    discount: 25,
    rating: 4.9,
    reviewsCount: 215,
    inStock: 8,
    description: "Whisper-quiet essential oil diffuser with soft 7-color LED ambient glow and natural wood grain accents.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Pastel Matte Ceramic Mug Set (4-Pack)",
    category: "Kitchen & Dining",
    price: 34.00,
    discount: 0,
    rating: 4.6,
    reviewsCount: 64,
    inStock: 25,
    description: "Handcrafted durable stoneware mugs in soothing pastel glazes: matcha, peach, lilac, and creamy butter.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Aura Sound Pure ANC Wireless Earbuds",
    category: "Tech & Audio",
    price: 89.00,
    discount: 30,
    rating: 4.8,
    reviewsCount: 320,
    inStock: 14,
    description: "Active noise cancelling with 32-hour battery life, IPX5 water resistance, and wireless charging case in powder blue.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Relaxed French Linen Loungewear Shirt",
    category: "Apparel",
    price: 58.00,
    discount: 18,
    rating: 4.7,
    reviewsCount: 110,
    inStock: 18,
    description: "Breathable 100% Normandy washed linen button-up shirt tailored with relaxed seams in serene seafoam.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Sculptural Wavy Glass Flower Vase",
    category: "Home Decor",
    price: 36.00,
    discount: 15,
    rating: 4.9,
    reviewsCount: 73,
    inStock: 10,
    description: "Artisanal hand-blown translucent fluted glass vase that catches and gently refracts morning light.",
    image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Rose Quartz Gua Sha & Facial Roller Set",
    category: "Wellness",
    price: 28.00,
    discount: 20,
    rating: 4.8,
    reviewsCount: 184,
    inStock: 30,
    description: "Authentic natural Brazilian rose quartz stones for soothing facial massage, tension release, and skin radiance.",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Minimalist Bamboo Desktop Organizer",
    category: "Home Decor",
    price: 32.00,
    discount: 12,
    rating: 4.5,
    reviewsCount: 52,
    inStock: 16,
    description: "Modular compartments made from sustainable natural bamboo for pens, notes, smartphone, and desk essentials.",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Hand-Poured Botanical Soy Wax Candle",
    category: "Wellness",
    price: 24.00,
    discount: 15,
    rating: 4.9,
    reviewsCount: 147,
    inStock: 22,
    description: "Clean-burning soy wax infused with essential oils of white tea, sage, and sweet fig with crackling wood wick.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Ergonomic Memory Foam Contour Pillow",
    category: "Wellness",
    price: 46.00,
    discount: 22,
    rating: 4.7,
    reviewsCount: 89,
    inStock: 14,
    description: "Orthopedic slow-rebound memory foam support pillow with breathable pastel lilac bamboo fiber casing.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80"
  }
];

/* ==========================================================================
   3. DOM ELEMENT REFERENCES
   ========================================================================== */

const DOM = {
  // Products Grid & States
  productsGrid: document.getElementById('products-grid'),
  loadingState: document.getElementById('loading-state'),
  errorState: document.getElementById('error-state'),
  errorMessage: document.getElementById('error-message'),
  emptyState: document.getElementById('empty-state'),
  resultsCount: document.getElementById('results-count'),
  activeFilterIndicator: document.getElementById('active-filter-indicator'),
  activeFilterName: document.getElementById('active-filter-name'),
  resetFilterBtn: document.getElementById('reset-filter-btn'),
  clearAllFiltersBtn: document.getElementById('clear-all-filters-btn'),
  retryFetchBtn: document.getElementById('retry-fetch-btn'),
  loadFallbackBtn: document.getElementById('load-fallback-btn'),
  reloadDataBtn: document.getElementById('reload-data-btn'),

  // Fallback Notice Banner
  fallbackNoticeBanner: document.getElementById('fallback-notice-banner'),
  fallbackNoticeDesc: document.getElementById('fallback-notice-desc'),
  bannerRetryBtn: document.getElementById('banner-retry-btn'),

  // Filters & Search
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  categoryNav: document.getElementById('category-nav'),
  sortSelect: document.getElementById('sort-select'),
  stockOnlyCheckbox: document.getElementById('stock-only-checkbox'),

  // Cart Drawer
  cartDrawer: document.getElementById('cart-drawer'),
  cartOverlay: document.getElementById('cart-drawer-overlay'),
  cartToggleBtn: document.getElementById('cart-toggle-btn'),
  cartCloseBtn: document.getElementById('cart-close-btn'),
  cartBadge: document.getElementById('cart-badge'),
  cartTriggerTotal: document.getElementById('cart-trigger-total'),
  cartItemsCountText: document.getElementById('cart-items-count-text'),
  cartItemsList: document.getElementById('cart-items-list'),
  cartEmptyView: document.getElementById('cart-empty-view'),
  cartStartShoppingBtn: document.getElementById('cart-start-shopping-btn'),
  clearCartBtn: document.getElementById('clear-cart-btn'),

  // Shipping Progress
  shippingProgressMsg: document.getElementById('shipping-progress-msg'),
  shippingProgressBar: document.getElementById('shipping-progress-bar'),

  // Promo Code
  promoCodeInput: document.getElementById('promo-code-input'),
  applyPromoBtn: document.getElementById('apply-promo-btn'),
  promoStatusMsg: document.getElementById('promo-status-msg'),
  promoDiscountRow: document.getElementById('promo-discount-row'),
  activePromoTag: document.getElementById('active-promo-tag'),
  cartPromoDiscount: document.getElementById('cart-promo-discount'),

  // Cart Calculations
  cartGrossSubtotal: document.getElementById('cart-gross-subtotal'),
  cartTotalSavings: document.getElementById('cart-total-savings'),
  cartTaxAmount: document.getElementById('cart-tax-amount'),
  cartShippingFee: document.getElementById('cart-shipping-fee'),
  cartGrandTotal: document.getElementById('cart-grand-total'),
  openCheckoutBtn: document.getElementById('open-checkout-btn'),

  // Checkout Modal
  checkoutModal: document.getElementById('checkout-modal'),
  checkoutCloseBtn: document.getElementById('checkout-close-btn'),
  cancelCheckoutBtn: document.getElementById('cancel-checkout-btn'),
  checkoutForm: document.getElementById('checkout-form'),
  placeOrderBtn: document.getElementById('place-order-btn'),
  checkoutMiniItems: document.getElementById('checkout-mini-items'),
  checkoutItemsSummaryCount: document.getElementById('checkout-items-summary-count'),
  checkoutSubtotal: document.getElementById('checkout-subtotal'),
  checkoutSavings: document.getElementById('checkout-savings'),
  checkoutShipping: document.getElementById('checkout-shipping'),
  checkoutTax: document.getElementById('checkout-tax'),
  checkoutGrandTotal: document.getElementById('checkout-grand-total'),
  cardFieldsContainer: document.getElementById('card-fields-container'),

  // Order Confirmation Modal
  confirmationModal: document.getElementById('confirmation-modal'),
  receiptOrderId: document.getElementById('receipt-order-id'),
  receiptOrderDate: document.getElementById('receipt-order-date'),
  receiptCustName: document.getElementById('receipt-cust-name'),
  receiptCustAddress: document.getElementById('receipt-cust-address'),
  receiptPaymentMethod: document.getElementById('receipt-payment-method'),
  receiptItemsList: document.getElementById('receipt-items-list'),
  receiptSubtotal: document.getElementById('receipt-subtotal'),
  receiptSavings: document.getElementById('receipt-savings'),
  receiptShipping: document.getElementById('receipt-shipping'),
  receiptTax: document.getElementById('receipt-tax'),
  receiptGrandTotal: document.getElementById('receipt-grand-total'),
  printReceiptBtn: document.getElementById('print-receipt-btn'),
  confirmationContinueBtn: document.getElementById('confirmation-continue-btn'),

  // Quick View Modal
  quickviewModal: document.getElementById('quickview-modal'),
  quickviewCloseBtn: document.getElementById('quickview-close-btn'),
  quickviewContent: document.getElementById('quickview-content'),

  // Toast Container
  toastContainer: document.getElementById('toast-container')
};

/* ==========================================================================
   4. MATHEMATICAL CALCULATION FUNCTIONS (Using JavaScript Math Methods)
   ========================================================================== */

/**
 * Rounds a floating number to 2 decimal places using JavaScript Math.round
 * and Number.EPSILON to avoid binary floating-point rounding inaccuracies.
 * @param {number} num - The raw number to round
 * @returns {number} - Accurately rounded float to 2 decimal places
 */
function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates discount amount for a single unit using Math.round:
 * discountAmount = Math.round((originalPrice * discountPercent / 100) * 100) / 100
 * @param {number} price - Original product price
 * @param {number} discountPercent - Discount percentage (e.g. 15 for 15%)
 * @returns {number} - Discount amount per unit
 */
function calculateUnitDiscount(price, discountPercent) {
  if (!discountPercent || discountPercent <= 0) return 0.00;
  const rawDiscount = price * (discountPercent / 100);
  return roundToTwo(rawDiscount);
}

/**
 * Calculates discounted unit price using Math.max to prevent negative amounts:
 * discountedPrice = Math.max(0, originalPrice - unitDiscount)
 * @param {number} price - Original product price
 * @param {number} discountPercent - Discount percentage
 * @returns {number} - Final unit price after discount
 */
function calculateDiscountedUnitPrice(price, discountPercent) {
  const unitDiscount = calculateUnitDiscount(price, discountPercent);
  return Math.max(0, roundToTwo(price - unitDiscount));
}

/**
 * Computes all cart monetary totals dynamically using JavaScript Math methods.
 * Calculates:
 *   - Total item quantity count
 *   - Gross subtotal before discounts
 *   - Total savings from product discounts + promo codes
 *   - Net subtotal
 *   - Estimated shipping fee ($0.00 if netSubtotal >= $50, else $5.00)
 *   - Sales tax (8% on net subtotal)
 *   - Grand total = Net Subtotal + Shipping + Tax
 * @returns {Object} - Object containing all calculated financial figures
 */
function computeCartFinancials() {
  let totalItemsCount = 0;
  let grossSubtotal = 0;
  let productSavings = 0;
  let netSubtotal = 0;

  cart.forEach(item => {
    totalItemsCount += item.quantity;

    // Gross subtotal for item using Math.round
    const itemGross = roundToTwo(item.price * item.quantity);
    grossSubtotal = roundToTwo(grossSubtotal + itemGross);

    // Unit discount and item total savings
    const unitDiscount = calculateUnitDiscount(item.price, item.discount);
    const itemDiscountTotal = roundToTwo(unitDiscount * item.quantity);
    productSavings = roundToTwo(productSavings + itemDiscountTotal);

    // Discounted unit price and item net subtotal
    const unitDiscountedPrice = calculateDiscountedUnitPrice(item.price, item.discount);
    const itemNet = roundToTwo(unitDiscountedPrice * item.quantity);
    netSubtotal = roundToTwo(netSubtotal + itemNet);
  });

  // Calculate Promo Code Discount if valid code is active
  let promoSavings = 0;
  if (activePromoCode === 'PASTEL10' && netSubtotal > 0) {
    // 10% additional discount on net subtotal
    promoSavings = roundToTwo(netSubtotal * 0.10);
  }

  // Adjusted subtotal after promo code
  const adjustedNetSubtotal = Math.max(0, roundToTwo(netSubtotal - promoSavings));
  const totalCombinedSavings = roundToTwo(productSavings + promoSavings);

  // Shipping calculation
  let shippingFee = 0;
  let neededForFreeShipping = 0;

  if (totalItemsCount === 0) {
    shippingFee = 0;
    neededForFreeShipping = FREE_SHIPPING_THRESHOLD;
  } else if (adjustedNetSubtotal >= FREE_SHIPPING_THRESHOLD) {
    shippingFee = 0;
    neededForFreeShipping = 0;
  } else {
    shippingFee = STANDARD_SHIPPING_FEE;
    neededForFreeShipping = Math.max(0, roundToTwo(FREE_SHIPPING_THRESHOLD - adjustedNetSubtotal));
  }

  // Tax calculation (8% tax rate)
  const taxAmount = totalItemsCount > 0 ? roundToTwo(adjustedNetSubtotal * TAX_RATE) : 0;

  // Grand Total calculation using Math.round
  const grandTotal = totalItemsCount > 0 
    ? roundToTwo(adjustedNetSubtotal + shippingFee + taxAmount) 
    : 0;

  return {
    totalItemsCount,
    grossSubtotal,
    productSavings,
    promoSavings,
    totalCombinedSavings,
    netSubtotal: adjustedNetSubtotal,
    shippingFee,
    taxAmount,
    grandTotal,
    neededForFreeShipping
  };
}

/**
 * Formats a numeric value into a USD currency string ($XX.XX)
 * @param {number} val - Amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(val) {
  return `$${Number(val || 0).toFixed(2)}`;
}

/* ==========================================================================
   5. REGULAR EXPRESSION QUANTITY VALIDATION
   ========================================================================== */

/**
 * Validates a quantity string against REGEX_POSITIVE_INTEGER (/^[1-9]\d*$/).
 * Strictly requires positive whole numbers (1, 2, 3, etc.).
 * @param {string|number} rawValue - The input string to test
 * @returns {boolean} - True if strictly a positive integer, false otherwise
 */
function validateQuantityWithRegex(rawValue) {
  if (rawValue === null || rawValue === undefined) return false;
  const str = String(rawValue).trim();
  return REGEX_POSITIVE_INTEGER.test(str);
}

/* ==========================================================================
   6. AJAX DATA RETRIEVAL (Fetch API & JSON.parse)
   ========================================================================== */

/**
 * Loads products from local products.json using the Fetch API with relative path './products.json'.
 * Processes the response using JSON.parse as specified in requirements.
 * Displays loading indicators and handles errors gracefully.
 *
 * If the AJAX fetch fails (e.g., when launched directly via file:// where browsers restrict AJAX),
 * it automatically loads the embedded fallback catalog with all 12 products and displays
 * an informative notice banner with a functional Retry button.
 *
 * @param {boolean} isManualRetry - Whether this was initiated by a user click on Retry / Sync
 */
async function loadProductsViaAJAX(isManualRetry = false) {
  setLoadingState(true);
  setErrorState(false);

  try {
    // Implement AJAX using Fetch API with explicit relative path './products.json'
    const response = await fetch('./products.json', { cache: 'no-cache' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch ./products.json`);
    }

    // Retrieve response as raw text then process with JSON.parse
    const responseText = await response.text();
    const parsedData = JSON.parse(responseText);

    // Validate that parsedData is a valid array
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      throw new Error('Invalid JSON structure: expected non-empty array of products.');
    }

    // Populate allProducts JavaScript objects from server JSON response
    allProducts = parsedData.map(item => ({
      id: Number(item.id),
      name: String(item.name),
      category: String(item.category),
      price: Number(item.price),
      discount: Number(item.discount),
      rating: Number(item.rating || 5.0),
      reviewsCount: Number(item.reviewsCount || 0),
      inStock: Number(item.inStock || 10),
      description: String(item.description),
      image: String(item.image)
    }));

    // Hide fallback banner if active
    showFallbackNotice(false);

    applyFiltersAndRender();
    showToast('Catalog loaded successfully via AJAX Fetch!', 'success');
  } catch (error) {
    console.warn('AJAX Fetch failed (browser security restriction on local file:// origin):', error);

    // AUTOMATIC FALLBACK: Automatically load embedded fallback catalog instead of showing a blank product section
    loadFallbackCatalog(false);

    // Display the small notice banner indicating fallback data is in use
    showFallbackNotice(true, error.message);

    if (isManualRetry) {
      showToast('AJAX fetch restricted by browser on file://. Running on fallback data. Use VS Code Live Server for live AJAX.', 'error');
    } else {
      showToast('Loaded fallback catalog (VS Code Live Server required for AJAX).', 'info');
    }
  } finally {
    setLoadingState(false);
  }
}

/**
 * Loads the embedded fallback product catalog so the application is 100%
 * functional even when opened directly via file:// protocol without an HTTP server.
 * Contains identical product data, images, prices, discounts, and IDs as products.json.
 * @param {boolean} showToastAlert
 */
function loadFallbackCatalog(showToastAlert = true) {
  allProducts = JSON.parse(JSON.stringify(FALLBACK_PRODUCTS));
  setErrorState(false);
  applyFiltersAndRender();
  if (showToastAlert) {
    showToast('Loaded embedded catalog successfully!', 'info');
  }
}

/**
 * Toggles the fallback notice banner indicating fallback data is active
 * @param {boolean} show 
 * @param {string} errorDetail 
 */
function showFallbackNotice(show, errorDetail = '') {
  if (DOM.fallbackNoticeBanner) {
    if (show) {
      DOM.fallbackNoticeBanner.classList.remove('hidden');
      if (DOM.fallbackNoticeDesc && errorDetail) {
        DOM.fallbackNoticeDesc.innerHTML = `Direct AJAX <code>fetch('./products.json')</code> is restricted by browser security when opening files via <code>file://</code> (${escapeHtml(errorDetail)}). ` +
          `Use <strong>VS Code Live Server</strong> (or another local HTTP server) for genuine AJAX testing.`;
      }
    } else {
      DOM.fallbackNoticeBanner.classList.add('hidden');
    }
  }
}

/**
 * Controls visibility of loading spinner
 */
function setLoadingState(isLoading) {
  if (isLoading) {
    DOM.loadingState.classList.remove('hidden');
    if (allProducts.length === 0) {
      DOM.productsGrid.classList.add('hidden');
    }
    DOM.emptyState.classList.add('hidden');
    DOM.errorState.classList.add('hidden');
  } else {
    DOM.loadingState.classList.add('hidden');
  }
}

/**
 * Controls visibility of error banner (used if catastrophic failure occurs)
 */
function setErrorState(isError, customMsg = '') {
  if (isError) {
    DOM.errorState.classList.remove('hidden');
    DOM.productsGrid.classList.add('hidden');
    DOM.emptyState.classList.add('hidden');
    if (customMsg) {
      DOM.errorMessage.innerHTML = `<strong>Error Details:</strong> ${escapeHtml(customMsg)}<br><br>` +
        `<em>Note: If you opened this file directly via <code>file://</code>, modern browsers restrict local AJAX. ` +
        `Launch with VS Code Live Server or click "Load Embedded Catalog" to test immediately.</em>`;
    }
  } else {
    DOM.errorState.classList.add('hidden');
  }
}

/* ==========================================================================
   7. PRODUCT CATALOG RENDERING & DOM MANIPULATION
   ========================================================================== */

/**
 * Filters and sorts allProducts based on user controls, then renders the grid.
 */
function applyFiltersAndRender() {
  let filtered = [...allProducts];

  // 1. Category Filter
  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
  }

  // 2. Search Query Filter
  if (searchQuery.trim() !== '') {
    const query = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  // 3. In-Stock Filter
  if (stockOnlyFilter) {
    filtered = filtered.filter(p => p.inStock > 0);
  }

  // 4. Sorting
  switch (currentSort) {
    case 'price-asc':
      filtered.sort((a, b) => {
        const pA = calculateDiscountedUnitPrice(a.price, a.discount);
        const pB = calculateDiscountedUnitPrice(b.price, b.discount);
        return pA - pB;
      });
      break;
    case 'price-desc':
      filtered.sort((a, b) => {
        const pA = calculateDiscountedUnitPrice(a.price, a.discount);
        const pB = calculateDiscountedUnitPrice(b.price, b.discount);
        return pB - pA;
      });
      break;
    case 'discount-desc':
      filtered.sort((a, b) => b.discount - a.discount);
      break;
    case 'rating-desc':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      filtered.sort((a, b) => a.id - b.id);
      break;
  }

  // Update Result Count Meta
  DOM.resultsCount.textContent = `Showing ${filtered.length} item${filtered.length === 1 ? '' : 's'}`;

  // Update Active Filter Tag Indicator
  if (activeCategory !== 'all' || searchQuery.trim() !== '' || stockOnlyFilter) {
    let label = [];
    if (activeCategory !== 'all') label.push(activeCategory);
    if (searchQuery.trim() !== '') label.push(`"${searchQuery}"`);
    if (stockOnlyFilter) label.push('In Stock');
    DOM.activeFilterName.textContent = label.join(' + ');
    DOM.activeFilterIndicator.classList.remove('hidden');
  } else {
    DOM.activeFilterIndicator.classList.add('hidden');
  }

  // Render Grid or Empty State
  renderProductGrid(filtered);
}

/**
 * Generates dynamic DOM elements for the filtered product items.
 * @param {Array} productsList - Products to render
 */
function renderProductGrid(productsList) {
  // Clear existing items
  DOM.productsGrid.innerHTML = '';

  if (productsList.length === 0) {
    DOM.productsGrid.classList.add('hidden');
    DOM.emptyState.classList.remove('hidden');
    return;
  }

  DOM.emptyState.classList.add('hidden');
  DOM.productsGrid.classList.remove('hidden');

  const fragment = document.createDocumentFragment();

  productsList.forEach(product => {
    // Mathematical discount computations
    const discountedPrice = calculateDiscountedUnitPrice(product.price, product.discount);
    const unitDiscountAmount = calculateUnitDiscount(product.price, product.discount);
    const hasDiscount = product.discount > 0;

    // Check if item is already in cart to display count
    const cartItem = cart.find(item => item.id === product.id);
    const inCartQty = cartItem ? cartItem.quantity : 0;

    // Product Card Container
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = product.id;

    // Generate Star Rating HTML
    const fullStars = Math.floor(product.rating);
    let starsHtml = '★'.repeat(fullStars) + (product.rating % 1 >= 0.5 ? '½' : '');

    card.innerHTML = `
      <div class="card-image-wrap">
        <img 
          src="${escapeHtml(product.image)}" 
          alt="${escapeHtml(product.name)}" 
          class="card-image"
          loading="lazy"
          onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'225\\' viewBox=\\'0 0 300 225\\'><rect width=\\'300\\' height=\\'225\\' fill=\\'%23FFEBE1\\'/><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%23D96B43\\'>${escapeHtml(product.name)}</text></svg>';"
        >
        <div class="card-badges">
          ${hasDiscount ? `<span class="badge-tag discount-tag">-${product.discount}% OFF</span>` : `<span></span>`}
          <span class="badge-tag stock-tag ${product.inStock <= 5 ? 'low-stock' : ''}">
            ${product.inStock <= 5 ? `Only ${product.inStock} left` : 'In Stock'}
          </span>
        </div>
        <button class="quick-view-overlay-btn" data-action="quickview" data-id="${product.id}" title="Quick View">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Quick View
        </button>
      </div>

      <div class="card-body">
        <span class="card-category">${escapeHtml(product.category)}</span>
        <h3 class="card-title" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>

        <div class="card-rating-row">
          <span class="star-rating">${starsHtml}</span>
          <span class="rating-score">${product.rating.toFixed(1)}</span>
          <span class="rating-count">(${product.reviewsCount})</span>
        </div>

        <p class="card-desc">${escapeHtml(product.description)}</p>

        <div class="card-pricing-row">
          <div class="pricing-group">
            <span class="price-current">${formatCurrency(discountedPrice)}</span>
            ${hasDiscount ? `<span class="price-original">${formatCurrency(product.price)}</span>` : ''}
          </div>
          ${hasDiscount ? `<span class="savings-pill">Save ${formatCurrency(unitDiscountAmount)}</span>` : ''}
        </div>

        <button 
          class="btn-add-to-cart ${inCartQty > 0 ? 'added' : ''}" 
          data-action="add-to-cart" 
          data-id="${product.id}"
          aria-label="Add ${escapeHtml(product.name)} to cart"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span class="add-btn-text">${inCartQty > 0 ? `In Cart (${inCartQty}) +` : 'Add to Cart'}</span>
        </button>
      </div>
    `;

    fragment.appendChild(card);
  });

  DOM.productsGrid.appendChild(fragment);
}

/* ==========================================================================
   8. SHOPPING CART DHTML & DYNAMIC UPDATES
   ========================================================================== */

/**
 * Adds a product to the cart JavaScript object array.
 * If product exists, increments quantity.
 * If not, creates a new cart item object.
 * @param {number} productId - The ID of product to add
 * @param {number} addQty - Amount to add (defaults to 1)
 */
function addToCart(productId, addQty = 1) {
  const product = allProducts.find(p => p.id === Number(productId));
  if (!product) {
    showToast('Product not found!', 'error');
    return;
  }

  // Find if already exists in cart array
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex > -1) {
    // Increase quantity
    cart[existingIndex].quantity += addQty;
  } else {
    // Create new cart item JavaScript Object
    const newCartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      quantity: addQty,
      image: product.image,
      category: product.category,
      inStock: product.inStock
    };
    cart.push(newCartItem);
  }

  // Save to localStorage & trigger DHTML update
  saveCartToStorage();
  updateCartDHTML();

  // Visual button bump and feedback
  bumpCartBadge();
  showToast(`Added "${product.name}" to cart!`, 'success');

  // Re-render product grid to reflect updated "In Cart" count
  applyFiltersAndRender();
}

/**
 * Removes a product completely from the cart.
 * @param {number} productId - The ID of product to remove
 */
function removeFromCart(productId) {
  const itemIndex = cart.findIndex(item => item.id === Number(productId));
  if (itemIndex > -1) {
    const removedName = cart[itemIndex].name;
    cart.splice(itemIndex, 1);
    saveCartToStorage();
    updateCartDHTML();
    applyFiltersAndRender();
    showToast(`Removed "${removedName}" from cart.`, 'info');
  }
}

/**
 * Updates an item's quantity directly with Regular Expression validation.
 * @param {number} productId - The ID of the product
 * @param {string|number} rawQuantity - Input to validate & set
 * @param {HTMLElement} inputEl - The input element (for error styling feedback)
 */
function updateCartItemQuantity(productId, rawQuantity, inputEl = null) {
  const item = cart.find(i => i.id === Number(productId));
  if (!item) return;

  const stepper = inputEl ? inputEl.closest('.qty-stepper') : null;
  const errorMsgEl = inputEl ? inputEl.parentElement.nextElementSibling : null;

  // Validate using Regular Expression: strictly positive whole numbers
  if (!validateQuantityWithRegex(rawQuantity)) {
    // Invalid input: display error styling and message
    if (stepper) stepper.classList.add('invalid');
    if (errorMsgEl) {
      errorMsgEl.textContent = 'Enter positive whole number (1, 2, 3...)';
      errorMsgEl.classList.remove('hidden');
    }
    showToast(`Invalid quantity: "${rawQuantity}". Please enter a positive whole number.`, 'error');
    return false;
  }

  // Clear any existing error state
  if (stepper) stepper.classList.remove('invalid');
  if (errorMsgEl) {
    errorMsgEl.textContent = '';
    errorMsgEl.classList.add('hidden');
  }

  const newQty = parseInt(String(rawQuantity).trim(), 10);

  // Check against available stock
  if (newQty > item.inStock) {
    showToast(`Only ${item.inStock} units available in stock. Capped to ${item.inStock}.`, 'info');
    item.quantity = item.inStock;
    if (inputEl) inputEl.value = item.inStock;
  } else {
    item.quantity = newQty;
  }

  saveCartToStorage();
  updateCartDHTML();
  applyFiltersAndRender();
  return true;
}

/**
 * Increments quantity of an item by 1
 * @param {number} productId 
 */
function incrementCartItem(productId) {
  const item = cart.find(i => i.id === Number(productId));
  if (item) {
    if (item.quantity >= item.inStock) {
      showToast(`Cannot add more. Reached maximum available stock (${item.inStock}).`, 'info');
      return;
    }
    item.quantity += 1;
    saveCartToStorage();
    updateCartDHTML();
    applyFiltersAndRender();
  }
}

/**
 * Decrements quantity of an item by 1.
 * If quantity is 1, confirms or removes the item.
 * @param {number} productId 
 */
function decrementCartItem(productId) {
  const item = cart.find(i => i.id === Number(productId));
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
    saveCartToStorage();
    updateCartDHTML();
    applyFiltersAndRender();
  } else {
    // If quantity reaches 0, remove item
    removeFromCart(productId);
  }
}

/**
 * Clears the entire cart after user confirmation.
 */
function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  saveCartToStorage();
  updateCartDHTML();
  applyFiltersAndRender();
  showToast('Shopping cart has been cleared.', 'info');
}

/**
 * DHTML Core Updater: Instantly updates all cart views, items, badges,
 * and calculations dynamically without reloading the webpage.
 */
function updateCartDHTML() {
  const fin = computeCartFinancials();

  // 1. Update Header Live Cart Badge & Trigger Total
  DOM.cartBadge.textContent = fin.totalItemsCount;
  DOM.cartTriggerTotal.textContent = formatCurrency(fin.grandTotal);
  DOM.cartItemsCountText.textContent = `${fin.totalItemsCount} item${fin.totalItemsCount === 1 ? '' : 's'} in cart`;

  // 2. Free Shipping Progress Bar & Message
  if (fin.totalItemsCount === 0) {
    DOM.shippingProgressMsg.innerHTML = `Add <strong>${formatCurrency(FREE_SHIPPING_THRESHOLD)}</strong> more to unlock <strong>FREE Shipping!</strong>`;
    DOM.shippingProgressBar.style.width = '0%';
  } else if (fin.neededForFreeShipping === 0) {
    DOM.shippingProgressMsg.innerHTML = `🎉 <strong>Congratulations!</strong> You qualify for <strong>FREE Shipping!</strong>`;
    DOM.shippingProgressBar.style.width = '100%';
  } else {
    const percent = Math.min(100, Math.floor(((FREE_SHIPPING_THRESHOLD - fin.neededForFreeShipping) / FREE_SHIPPING_THRESHOLD) * 100));
    DOM.shippingProgressMsg.innerHTML = `Add <strong>${formatCurrency(fin.neededForFreeShipping)}</strong> more to unlock <strong>FREE Shipping!</strong>`;
    DOM.shippingProgressBar.style.width = `${percent}%`;
  }

  // 3. Render Cart Item Cards or Empty State
  if (cart.length === 0) {
    DOM.cartEmptyView.classList.remove('hidden');
    DOM.cartItemsList.classList.add('hidden');
    DOM.openCheckoutBtn.disabled = true;
    DOM.clearCartBtn.disabled = true;
  } else {
    DOM.cartEmptyView.classList.add('hidden');
    DOM.cartItemsList.classList.remove('hidden');
    DOM.openCheckoutBtn.disabled = false;
    DOM.clearCartBtn.disabled = false;
    renderCartDrawerItems();
  }

  // 4. Update Financial Totals in Cart Footer
  DOM.cartGrossSubtotal.textContent = formatCurrency(fin.grossSubtotal);
  DOM.cartTotalSavings.textContent = `-${formatCurrency(fin.productSavings)}`;
  
  // Promo code row
  if (fin.promoSavings > 0) {
    DOM.promoDiscountRow.classList.remove('hidden');
    DOM.activePromoTag.textContent = activePromoCode;
    DOM.cartPromoDiscount.textContent = `-${formatCurrency(fin.promoSavings)}`;
  } else {
    DOM.promoDiscountRow.classList.add('hidden');
  }

  DOM.cartTaxAmount.textContent = formatCurrency(fin.taxAmount);
  DOM.cartShippingFee.textContent = fin.shippingFee === 0 ? 'FREE' : formatCurrency(fin.shippingFee);
  DOM.cartGrandTotal.textContent = formatCurrency(fin.grandTotal);

  // 5. Update Checkout Modal Summary if Checkout is active
  updateCheckoutModalSummary(fin);
}

/**
 * Renders each item in the cart drawer using dynamic DOM manipulation.
 */
function renderCartDrawerItems() {
  DOM.cartItemsList.innerHTML = '';
  const fragment = document.createDocumentFragment();

  cart.forEach(item => {
    const unitDiscount = calculateUnitDiscount(item.price, item.discount);
    const unitDiscountedPrice = calculateDiscountedUnitPrice(item.price, item.discount);
    const itemSubtotal = roundToTwo(unitDiscountedPrice * item.quantity);
    const itemTotalSavings = roundToTwo(unitDiscount * item.quantity);
    const hasDiscount = item.discount > 0;

    const itemCard = document.createElement('div');
    itemCard.className = 'cart-item-card';
    itemCard.dataset.id = item.id;

    itemCard.innerHTML = `
      <img 
        src="${escapeHtml(item.image)}" 
        alt="${escapeHtml(item.name)}" 
        class="cart-item-thumb"
        onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\'><rect width=\\'80\\' height=\\'80\\' fill=\\'%23FFEBE1\\'/></svg>';"
      >
      <div class="cart-item-details">
        <div class="cart-item-header">
          <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
          <button class="cart-item-remove-btn" data-action="remove" data-id="${item.id}" title="Remove item" aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
            </svg>
          </button>
        </div>

        <div class="cart-item-meta">${escapeHtml(item.category)}</div>

        <div class="cart-item-unit-pricing">
          <span class="cart-unit-discounted">${formatCurrency(unitDiscountedPrice)}</span>
          ${hasDiscount ? `<span class="cart-unit-original">${formatCurrency(item.price)}</span>` : ''}
          ${hasDiscount ? `<span class="cart-unit-badge">-${item.discount}%</span>` : ''}
        </div>

        <div class="cart-item-actions">
          <div class="qty-wrapper">
            <div class="qty-stepper">
              <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">-</button>
              <input 
                type="text" 
                class="qty-input" 
                data-action="qty-input" 
                data-id="${item.id}" 
                value="${item.quantity}"
                aria-label="Quantity for ${escapeHtml(item.name)}"
              >
              <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <div class="qty-error-msg hidden" id="qty-err-${item.id}"></div>
          </div>

          <div class="cart-item-subtotal">
            ${formatCurrency(itemSubtotal)}
          </div>
        </div>
      </div>
    `;

    fragment.appendChild(itemCard);
  });

  DOM.cartItemsList.appendChild(fragment);
}

/**
 * Animates the cart badge with a spring bump
 */
function bumpCartBadge() {
  DOM.cartBadge.classList.remove('bump');
  void DOM.cartBadge.offsetWidth; // Force reflow
  DOM.cartBadge.classList.add('bump');
}

/* ==========================================================================
   9. PROMO CODE APPLICATION
   ========================================================================== */

function applyPromoCode() {
  const code = DOM.promoCodeInput.value.trim().toUpperCase();

  if (!code) {
    showPromoStatus('Please enter a promo code.', 'error');
    return;
  }

  if (code === 'PASTEL10') {
    activePromoCode = 'PASTEL10';
    showPromoStatus('Promo code PASTEL10 applied! Extra 10% discount added.', 'success');
    showToast('Promo code PASTEL10 applied!', 'success');
    updateCartDHTML();
  } else {
    showPromoStatus(`Code "${code}" is invalid or expired. Try PASTEL10.`, 'error');
  }
}

function showPromoStatus(msg, type) {
  DOM.promoStatusMsg.textContent = msg;
  DOM.promoStatusMsg.className = `promo-status-msg ${type}`;
  DOM.promoStatusMsg.classList.remove('hidden');
}

/* ==========================================================================
   10. CHECKOUT MODAL & ORDER PLACEMENT VALIDATION
   ========================================================================== */

/**
 * Updates mini items list and breakdown in checkout modal
 */
function updateCheckoutModalSummary(fin) {
  DOM.checkoutItemsSummaryCount.textContent = `${fin.totalItemsCount} item${fin.totalItemsCount === 1 ? '' : 's'}`;
  DOM.checkoutMiniItems.innerHTML = '';

  cart.forEach(item => {
    const unitPrice = calculateDiscountedUnitPrice(item.price, item.discount);
    const itemTotal = roundToTwo(unitPrice * item.quantity);

    const row = document.createElement('div');
    row.className = 'mini-item-row';
    row.innerHTML = `
      <span class="mini-item-name">
        <span class="mini-item-qty">${item.quantity}x</span>
        ${escapeHtml(item.name)}
      </span>
      <span class="mini-item-price">${formatCurrency(itemTotal)}</span>
    `;
    DOM.checkoutMiniItems.appendChild(row);
  });

  DOM.checkoutSubtotal.textContent = formatCurrency(fin.grossSubtotal);
  DOM.checkoutSavings.textContent = `-${formatCurrency(fin.totalCombinedSavings)}`;
  DOM.checkoutShipping.textContent = fin.shippingFee === 0 ? 'FREE' : formatCurrency(fin.shippingFee);
  DOM.checkoutTax.textContent = formatCurrency(fin.taxAmount);
  DOM.checkoutGrandTotal.textContent = formatCurrency(fin.grandTotal);
}

/**
 * Validates checkout form fields using Regular Expressions and required checks
 */
function validateCheckoutForm() {
  const nameInput = document.getElementById('cust-name');
  const emailInput = document.getElementById('cust-email');
  const phoneInput = document.getElementById('cust-phone');
  const addressInput = document.getElementById('cust-address');
  const cityInput = document.getElementById('cust-city');
  const zipInput = document.getElementById('cust-zip');

  let isValid = true;

  // 1. Name validation (at least 2 letters, regex)
  if (!REGEX_NAME.test(nameInput.value.trim())) {
    showFieldError(nameInput, 'cust-name-error');
    isValid = false;
  } else {
    clearFieldError(nameInput, 'cust-name-error');
  }

  // 2. Email validation (email regex)
  if (!REGEX_EMAIL.test(emailInput.value.trim())) {
    showFieldError(emailInput, 'cust-email-error');
    isValid = false;
  } else {
    clearFieldError(emailInput, 'cust-email-error');
  }

  // 3. Phone validation (phone regex)
  if (!REGEX_PHONE.test(phoneInput.value.trim())) {
    showFieldError(phoneInput, 'cust-phone-error');
    isValid = false;
  } else {
    clearFieldError(phoneInput, 'cust-phone-error');
  }

  // 4. Address validation (required, min 5 chars)
  if (addressInput.value.trim().length < 5) {
    showFieldError(addressInput, 'cust-address-error');
    isValid = false;
  } else {
    clearFieldError(addressInput, 'cust-address-error');
  }

  // 5. City validation (required, min 2 chars)
  if (cityInput.value.trim().length < 2) {
    showFieldError(cityInput, 'cust-city-error');
    isValid = false;
  } else {
    clearFieldError(cityInput, 'cust-city-error');
  }

  // 6. Zip validation (regex)
  if (!REGEX_ZIP.test(zipInput.value.trim())) {
    showFieldError(zipInput, 'cust-zip-error');
    isValid = false;
  } else {
    clearFieldError(zipInput, 'cust-zip-error');
  }

  return isValid;
}

function showFieldError(input, errorId) {
  input.classList.add('input-error');
  const err = document.getElementById(errorId);
  if (err) err.classList.add('show');
}

function clearFieldError(input, errorId) {
  input.classList.remove('input-error');
  const err = document.getElementById(errorId);
  if (err) err.classList.remove('show');
}

/**
 * Handles Place Order submission
 */
function handlePlaceOrder(e) {
  e.preventDefault();

  if (cart.length === 0) {
    showToast('Your shopping cart is empty!', 'error');
    return;
  }

  if (!validateCheckoutForm()) {
    showToast('Please correct the highlighted form errors.', 'error');
    return;
  }

  // Show simulated placing order spinner
  const submitBtn = DOM.placeOrderBtn;
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');

  submitBtn.disabled = true;
  btnText.textContent = 'Processing Order...';
  btnSpinner.classList.remove('hidden');

  setTimeout(() => {
    // Generate order confirmation details
    const orderData = generateOrderConfirmation();

    // Reset button
    submitBtn.disabled = false;
    btnText.textContent = 'Place Order & Pay';
    btnSpinner.classList.add('hidden');

    // Close checkout modal & open confirmation modal
    DOM.checkoutModal.classList.add('hidden');
    displayOrderConfirmationModal(orderData);

    // Empty cart and clear state
    cart = [];
    activePromoCode = null;
    DOM.promoCodeInput.value = '';
    DOM.promoStatusMsg.classList.add('hidden');
    saveCartToStorage();
    updateCartDHTML();
    applyFiltersAndRender();

    showToast('Order placed successfully! Thank you.', 'success');
  }, 750);
}

/**
 * Generates an order receipt record
 */
function generateOrderConfirmation() {
  const fin = computeCartFinancials();
  const name = document.getElementById('cust-name').value.trim();
  const email = document.getElementById('cust-email').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const city = document.getElementById('cust-city').value.trim();
  const zip = document.getElementById('cust-zip').value.trim();

  // Payment method
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
  let paymentMethod = 'Credit / Debit Card';
  if (paymentMethodInput) {
    if (paymentMethodInput.value === 'paypal') paymentMethod = 'PayPal Mock';
    if (paymentMethodInput.value === 'cod') paymentMethod = 'Cash on Delivery';
  }

  // Generate unique Order ID using Math.floor & Math.random
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const orderId = `#AN-${randomNum}`;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    orderId,
    dateFormatted,
    name,
    email,
    fullAddress: `${address}, ${city}, ZIP ${zip}`,
    paymentMethod,
    items: JSON.parse(JSON.stringify(cart)),
    financials: fin
  };
}

/**
 * Populates and displays the Order Confirmation Modal
 */
function displayOrderConfirmationModal(order) {
  DOM.receiptOrderId.textContent = order.orderId;
  DOM.receiptOrderDate.textContent = order.dateFormatted;
  DOM.receiptCustName.textContent = `${order.name} (${order.email})`;
  DOM.receiptCustAddress.textContent = order.fullAddress;
  DOM.receiptPaymentMethod.textContent = order.paymentMethod;

  DOM.receiptItemsList.innerHTML = '';
  order.items.forEach(item => {
    const discountedPrice = calculateDiscountedUnitPrice(item.price, item.discount);
    const itemSubtotal = roundToTwo(discountedPrice * item.quantity);

    const row = document.createElement('div');
    row.className = 'receipt-item-row';
    row.innerHTML = `
      <span>${escapeHtml(item.name)}</span>
      <span class="align-center">${item.quantity}</span>
      <span class="align-right">${formatCurrency(itemSubtotal)}</span>
    `;
    DOM.receiptItemsList.appendChild(row);
  });

  DOM.receiptSubtotal.textContent = formatCurrency(order.financials.grossSubtotal);
  DOM.receiptSavings.textContent = `-${formatCurrency(order.financials.totalCombinedSavings)}`;
  DOM.receiptShipping.textContent = order.financials.shippingFee === 0 ? 'FREE' : formatCurrency(order.financials.shippingFee);
  DOM.receiptTax.textContent = formatCurrency(order.financials.taxAmount);
  DOM.receiptGrandTotal.textContent = formatCurrency(order.financials.grandTotal);

  DOM.confirmationModal.classList.remove('hidden');
}

/* ==========================================================================
   11. QUICK VIEW MODAL
   ========================================================================== */

/**
 * Displays full product details and allows quick adding with customized quantity
 * @param {number} productId 
 */
function openQuickView(productId) {
  const product = allProducts.find(p => p.id === Number(productId));
  if (!product) return;

  const discountedPrice = calculateDiscountedUnitPrice(product.price, product.discount);
  const unitDiscount = calculateUnitDiscount(product.price, product.discount);
  const hasDiscount = product.discount > 0;

  DOM.quickviewContent.innerHTML = `
    <div class="qv-image-wrap">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="qv-image">
    </div>
    <div class="qv-info">
      <span class="qv-category">${escapeHtml(product.category)}</span>
      <h2 class="qv-title">${escapeHtml(product.name)}</h2>

      <div class="card-rating-row" style="margin-bottom: 12px;">
        <span class="star-rating">${'★'.repeat(Math.floor(product.rating))}</span>
        <span class="rating-score">${product.rating.toFixed(1)}</span>
        <span class="rating-count">(${product.reviewsCount} customer reviews)</span>
      </div>

      <div class="qv-pricing">
        <span class="qv-price">${formatCurrency(discountedPrice)}</span>
        ${hasDiscount ? `<span class="price-original">${formatCurrency(product.price)}</span>` : ''}
        ${hasDiscount ? `<span class="savings-pill">Save ${formatCurrency(unitDiscount)} (${product.discount}%)</span>` : ''}
      </div>

      <p class="qv-desc">${escapeHtml(product.description)}</p>

      <div class="qv-actions">
        <div class="qty-stepper">
          <button class="qty-btn" id="qv-qty-minus">-</button>
          <input type="text" class="qty-input" id="qv-qty-input" value="1" maxlength="3">
          <button class="qty-btn" id="qv-qty-plus">+</button>
        </div>
        <button class="btn btn-primary" id="qv-add-cart-btn" style="flex:1;">
          Add to Cart
        </button>
      </div>
      <div id="qv-qty-err" class="qty-error-msg hidden" style="margin-top: 6px;"></div>
    </div>
  `;

  // Quick View Quantity handlers with Regular Expression validation
  const qvInput = document.getElementById('qv-qty-input');
  const qvMinus = document.getElementById('qv-qty-minus');
  const qvPlus = document.getElementById('qv-qty-plus');
  const qvAddBtn = document.getElementById('qv-add-cart-btn');
  const qvErr = document.getElementById('qv-qty-err');

  qvMinus.addEventListener('click', () => {
    let current = parseInt(qvInput.value, 10) || 1;
    if (current > 1) {
      qvInput.value = current - 1;
      qvErr.classList.add('hidden');
    }
  });

  qvPlus.addEventListener('click', () => {
    let current = parseInt(qvInput.value, 10) || 1;
    if (current < product.inStock) {
      qvInput.value = current + 1;
      qvErr.classList.add('hidden');
    } else {
      showToast(`Only ${product.inStock} units available in stock.`, 'info');
    }
  });

  qvInput.addEventListener('input', () => {
    if (!validateQuantityWithRegex(qvInput.value)) {
      qvErr.textContent = 'Please enter a positive whole number (1, 2, 3...)';
      qvErr.classList.remove('hidden');
    } else {
      qvErr.classList.add('hidden');
    }
  });

  qvAddBtn.addEventListener('click', () => {
    if (!validateQuantityWithRegex(qvInput.value)) {
      qvErr.textContent = 'Invalid quantity! Only positive integers accepted.';
      qvErr.classList.remove('hidden');
      return;
    }
    const qty = parseInt(qvInput.value.trim(), 10);
    addToCart(product.id, qty);
    DOM.quickviewModal.classList.add('hidden');
  });

  DOM.quickviewModal.classList.remove('hidden');
}

/* ==========================================================================
   12. TOAST NOTIFICATION SYSTEM
   ========================================================================== */

/**
 * Creates and displays a floating pastel notification toast
 * @param {string} message - Notification text
 * @param {'success'|'error'|'info'} type - Toast type
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '🌸';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '⚠️';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  // Auto-remove after 3.5s
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/* ==========================================================================
   13. LOCAL STORAGE PERSISTENCE
   ========================================================================== */

function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_CART_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cart = parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
    cart = [];
  }
}

/* ==========================================================================
   14. SECURITY & UTILITY HELPERS
   ========================================================================== */

/**
 * Escapes unsafe characters to prevent XSS in dynamic HTML injections
 * @param {string} str 
 * @returns {string} 
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   15. EVENT LISTENERS & INITIALIZATION
   ========================================================================== */

function bindEventListeners() {
  // 1. Search Bar Listeners
  DOM.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchQuery.trim().length > 0) {
      DOM.searchClearBtn.classList.remove('hidden');
    } else {
      DOM.searchClearBtn.classList.add('hidden');
    }
    applyFiltersAndRender();
  });

  DOM.searchClearBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    searchQuery = '';
    DOM.searchClearBtn.classList.add('hidden');
    DOM.searchInput.focus();
    applyFiltersAndRender();
  });

  // 2. Category Filter Pills
  DOM.categoryNav.addEventListener('click', (e) => {
    const pill = e.target.closest('.category-pill');
    if (!pill) return;

    document.querySelectorAll('.category-pill').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    pill.classList.add('active');
    pill.setAttribute('aria-selected', 'true');
    activeCategory = pill.dataset.category;
    applyFiltersAndRender();
  });

  // 3. Sort & In-Stock Filters
  DOM.sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFiltersAndRender();
  });

  DOM.stockOnlyCheckbox.addEventListener('change', (e) => {
    stockOnlyFilter = e.target.checked;
    applyFiltersAndRender();
  });

  // 4. Reset Filter Buttons
  DOM.resetFilterBtn.addEventListener('click', resetAllFilters);
  DOM.clearAllFiltersBtn.addEventListener('click', resetAllFilters);

  // 5. AJAX Reload and Fallback Buttons
  if (DOM.reloadDataBtn) {
    DOM.reloadDataBtn.addEventListener('click', () => {
      loadProductsViaAJAX(true);
    });
  }

  if (DOM.retryFetchBtn) {
    DOM.retryFetchBtn.addEventListener('click', () => {
      loadProductsViaAJAX(true);
    });
  }

  if (DOM.bannerRetryBtn) {
    DOM.bannerRetryBtn.addEventListener('click', () => {
      loadProductsViaAJAX(true);
    });
  }

  if (DOM.loadFallbackBtn) {
    DOM.loadFallbackBtn.addEventListener('click', () => {
      loadFallbackCatalog(true);
    });
  }

  // 6. Cart Drawer Toggle Buttons
  DOM.cartToggleBtn.addEventListener('click', () => {
    openCartDrawer();
  });

  DOM.cartCloseBtn.addEventListener('click', () => {
    closeCartDrawer();
  });

  DOM.cartOverlay.addEventListener('click', () => {
    closeCartDrawer();
  });

  DOM.cartStartShoppingBtn.addEventListener('click', () => {
    closeCartDrawer();
  });

  DOM.clearCartBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all items from your cart?')) {
      clearCart();
    }
  });

  // 7. Dynamic Click Delegation for Product Grid (Add to cart & Quick View)
  DOM.productsGrid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-action="add-to-cart"]');
    if (addBtn) {
      const prodId = addBtn.dataset.id;
      addToCart(prodId, 1);
      return;
    }

    const qvBtn = e.target.closest('[data-action="quickview"]');
    if (qvBtn) {
      const prodId = qvBtn.dataset.id;
      openQuickView(prodId);
      return;
    }
  });

  // 8. Dynamic Click & Input Delegation inside Cart Items List
  DOM.cartItemsList.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-action="remove"]');
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.id);
      return;
    }

    const increaseBtn = e.target.closest('[data-action="increase"]');
    if (increaseBtn) {
      incrementCartItem(increaseBtn.dataset.id);
      return;
    }

    const decreaseBtn = e.target.closest('[data-action="decrease"]');
    if (decreaseBtn) {
      decrementCartItem(decreaseBtn.dataset.id);
      return;
    }
  });

  // Cart item quantity input with Regular Expression validation
  DOM.cartItemsList.addEventListener('input', (e) => {
    if (e.target.dataset.action === 'qty-input') {
      const input = e.target;
      const prodId = input.dataset.id;
      updateCartItemQuantity(prodId, input.value, input);
    }
  });

  DOM.cartItemsList.addEventListener('blur', (e) => {
    if (e.target.dataset.action === 'qty-input') {
      const input = e.target;
      const prodId = input.dataset.id;
      // If left invalid on blur, reset input to actual item quantity
      if (!validateQuantityWithRegex(input.value)) {
        const item = cart.find(i => i.id === Number(prodId));
        if (item) {
          input.value = item.quantity;
          updateCartItemQuantity(prodId, item.quantity, input);
        }
      }
    }
  }, true);

  // 9. Promo Code Button
  DOM.applyPromoBtn.addEventListener('click', applyPromoCode);
  DOM.promoCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyPromoCode();
    }
  });

  // 10. Checkout Modal Controls
  DOM.openCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your cart is empty. Add products to proceed.', 'error');
      return;
    }
    closeCartDrawer();
    DOM.checkoutModal.classList.remove('hidden');
  });

  DOM.checkoutCloseBtn.addEventListener('click', () => {
    DOM.checkoutModal.classList.add('hidden');
  });

  DOM.cancelCheckoutBtn.addEventListener('click', () => {
    DOM.checkoutModal.classList.add('hidden');
    openCartDrawer();
  });

  DOM.checkoutForm.addEventListener('submit', handlePlaceOrder);

  // Payment Option selection radio styling
  document.querySelectorAll('.payment-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
      e.target.closest('.payment-option').classList.add('selected');
      if (e.target.value === 'card') {
        DOM.cardFieldsContainer.classList.remove('hidden');
      } else {
        DOM.cardFieldsContainer.classList.add('hidden');
      }
    });
  });

  // 11. Confirmation Modal Buttons
  DOM.confirmationContinueBtn.addEventListener('click', () => {
    DOM.confirmationModal.classList.add('hidden');
  });

  DOM.printReceiptBtn.addEventListener('click', () => {
    window.print();
  });

  // 12. Quick View Modal Close
  DOM.quickviewCloseBtn.addEventListener('click', () => {
    DOM.quickviewModal.classList.add('hidden');
  });

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === DOM.checkoutModal) DOM.checkoutModal.classList.add('hidden');
    if (e.target === DOM.confirmationModal) DOM.confirmationModal.classList.add('hidden');
    if (e.target === DOM.quickviewModal) DOM.quickviewModal.classList.add('hidden');
  });

  // Footer category links quick jump
  document.querySelectorAll('[data-cat-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCat = link.dataset.catLink;
      const pill = Array.from(document.querySelectorAll('.category-pill'))
        .find(p => p.dataset.category.toLowerCase() === targetCat.toLowerCase());
      if (pill) {
        pill.click();
        window.scrollTo({ top: DOM.categoryNav.offsetTop - 100, behavior: 'smooth' });
      }
    });
  });
}

function openCartDrawer() {
  DOM.cartDrawer.classList.add('open');
  DOM.cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  DOM.cartDrawer.classList.remove('open');
  DOM.cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

function resetAllFilters() {
  activeCategory = 'all';
  searchQuery = '';
  stockOnlyFilter = false;
  currentSort = 'featured';

  DOM.searchInput.value = '';
  DOM.searchClearBtn.classList.add('hidden');
  DOM.stockOnlyCheckbox.checked = false;
  DOM.sortSelect.value = 'featured';

  document.querySelectorAll('.category-pill').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  const allPill = document.querySelector('.category-pill[data-category="all"]');
  if (allPill) {
    allPill.classList.add('active');
    allPill.setAttribute('aria-selected', 'true');
  }

  applyFiltersAndRender();
}

/* ==========================================================================
   16. APPLICATION BOOTSTRAP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Bind all interactive event listeners
  bindEventListeners();

  // Load existing cart from storage if available
  loadCartFromStorage();

  // Initial DHTML Cart sync
  updateCartDHTML();

  // Retrieve products using AJAX Fetch from products.json
  loadProductsViaAJAX();
});
