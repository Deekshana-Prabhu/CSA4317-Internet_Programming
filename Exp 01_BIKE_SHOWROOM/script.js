/**
 * VELOCITY – SMART BIKE SHOWROOM
 * script.js - Core Application Controller & UI Logic
 * Interacts directly with database.js (VelocityDB)
 */

(function () {
  'use strict';

  // Application State
  const AppState = {
    activeBrand: 'All',
    searchQuery: '',
    priceFilter: 'all',
    engineFilter: 'all',
    mileageFilter: 'all',
    sortOption: 'featured',
    currentView: 'home', // 'home', 'brand', 'wishlist', 'bookings', 'admin', 'reviews', 'showroom'
    comparedBikes: [], // Array of bike IDs (max 3)
    currentBookingBike: null,
    currentPaymentMethod: 'UPI',
    adminLoggedIn: false,
    editingBikeId: null
  };

  // DOM Elements Cache
  const UI = {};

  // Initialize Application
  document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initEventListeners();
    handleUrlHashRouting();
    updateHeaderCounters();
    renderBrandsSidebar();
    renderMainView();
  });

  function initElements() {
    UI.leftFrame = document.getElementById('leftFrame');
    UI.rightFrame = document.getElementById('rightFrame');
    UI.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    UI.brandNavList = document.getElementById('brandNavList');
    UI.mainViewContainer = document.getElementById('mainViewContainer');
    UI.heroSection = document.getElementById('heroSection');
    UI.filterSection = document.getElementById('filterSection');
    UI.searchInput = document.getElementById('searchInput');
    UI.filterBrand = document.getElementById('filterBrand');
    UI.filterPrice = document.getElementById('filterPrice');
    UI.filterEngine = document.getElementById('filterEngine');
    UI.filterMileage = document.getElementById('filterMileage');
    UI.sortSelect = document.getElementById('sortSelect');
    UI.clearFiltersBtn = document.getElementById('clearFiltersBtn');
    UI.resultsCount = document.getElementById('resultsCount');
    
    // Header Navigation buttons
    UI.navHome = document.getElementById('navHome');
    UI.navBikes = document.getElementById('navBikes');
    UI.navWishlist = document.getElementById('navWishlist');
    UI.navBookings = document.getElementById('navBookings');
    UI.navAdmin = document.getElementById('navAdmin');
    UI.wishlistBadge = document.getElementById('wishlistBadge');
    UI.compareBadge = document.getElementById('compareBadge');
    UI.bookingsBadge = document.getElementById('bookingsBadge');

    // Compare Drawer
    UI.compareDrawer = document.getElementById('compareDrawer');
    UI.compareItemsContainer = document.getElementById('compareItemsContainer');
    UI.compareTriggerBtn = document.getElementById('compareTriggerBtn');
    UI.clearCompareBtn = document.getElementById('clearCompareBtn');

    // Modals
    UI.bookingModal = document.getElementById('bookingModal');
    UI.testRideModal = document.getElementById('testRideModal');
    UI.receiptModal = document.getElementById('receiptModal');
    UI.compareModal = document.getElementById('compareModal');
    UI.adminLoginModal = document.getElementById('adminLoginModal');
    UI.bikeFormModal = document.getElementById('bikeFormModal');
    UI.toastContainer = document.getElementById('toastContainer');
  }

  function initEventListeners() {
    // Mobile sidebar toggle
    if (UI.mobileMenuToggle) {
      UI.mobileMenuToggle.addEventListener('click', () => {
        UI.leftFrame.classList.toggle('mobile-open');
      });
    }

    // Top Navigation Links
    if (UI.navHome) UI.navHome.addEventListener('click', (e) => { e.preventDefault(); setView('home'); });
    if (UI.navBikes) UI.navBikes.addEventListener('click', (e) => { e.preventDefault(); AppState.activeBrand = 'All'; setView('brand'); });
    if (UI.navWishlist) UI.navWishlist.addEventListener('click', (e) => { e.preventDefault(); setView('wishlist'); });
    if (UI.navBookings) UI.navBookings.addEventListener('click', (e) => { e.preventDefault(); setView('bookings'); });
    if (UI.navAdmin) UI.navAdmin.addEventListener('click', (e) => { e.preventDefault(); handleAdminNavClick(); });

    // Search and Filters
    if (UI.searchInput) {
      UI.searchInput.addEventListener('input', (e) => {
        AppState.searchQuery = e.target.value.trim().toLowerCase();
        renderFilteredBikes();
      });
    }
    if (UI.filterPrice) {
      UI.filterPrice.addEventListener('change', (e) => {
        AppState.priceFilter = e.target.value;
        renderFilteredBikes();
      });
    }
    if (UI.filterEngine) {
      UI.filterEngine.addEventListener('change', (e) => {
        AppState.engineFilter = e.target.value;
        renderFilteredBikes();
      });
    }
    if (UI.filterMileage) {
      UI.filterMileage.addEventListener('change', (e) => {
        AppState.mileageFilter = e.target.value;
        renderFilteredBikes();
      });
    }
    if (UI.sortSelect) {
      UI.sortSelect.addEventListener('change', (e) => {
        AppState.sortOption = e.target.value;
        renderFilteredBikes();
      });
    }
    if (UI.clearFiltersBtn) {
      UI.clearFiltersBtn.addEventListener('click', () => {
        resetFilters();
      });
    }

    // Compare Drawer Actions
    if (UI.compareTriggerBtn) {
      UI.compareTriggerBtn.addEventListener('click', () => {
        openCompareModal();
      });
    }
    if (UI.clearCompareBtn) {
      UI.clearCompareBtn.addEventListener('click', () => {
        AppState.comparedBikes = [];
        updateCompareDrawer();
        renderFilteredBikes();
        showToast('Comparison list cleared', 'info');
      });
    }

    // Modal Close buttons (any element with .modal-close-btn or clicking overlay)
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close-btn')) {
          closeAllModals();
        }
      });
    });

    // Booking Form Submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    // Payment Tab Selector in Booking Modal
    document.querySelectorAll('.payment-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const method = btn.getAttribute('data-method');
        selectPaymentMethod(method);
      });
    });

    // Test Ride Form Submission
    const testRideForm = document.getElementById('testRideForm');
    if (testRideForm) {
      testRideForm.addEventListener('submit', handleTestRideSubmit);
    }

    // Admin Login Form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', handleAdminLoginSubmit);
    }
    const demoLoginFillBtn = document.getElementById('demoLoginFillBtn');
    if (demoLoginFillBtn) {
      demoLoginFillBtn.addEventListener('click', () => {
        document.getElementById('adminUsername').value = 'admin';
        document.getElementById('adminPassword').value = 'velocity';
        handleAdminLoginSubmit(new Event('submit'));
      });
    }

    // Admin Add/Edit Bike Form
    const bikeAdminForm = document.getElementById('bikeAdminForm');
    if (bikeAdminForm) {
      bikeAdminForm.addEventListener('submit', handleBikeAdminSubmit);
    }

    // Receipt print & download buttons
    const btnPrintReceipt = document.getElementById('btnPrintReceipt');
    if (btnPrintReceipt) {
      btnPrintReceipt.addEventListener('click', () => {
        window.print();
      });
    }
    const btnDownloadReceipt = document.getElementById('btnDownloadReceipt');
    if (btnDownloadReceipt) {
      btnDownloadReceipt.addEventListener('click', () => {
        downloadReceiptPDF();
      });
    }

    // Listen to hash changes for browser back/forward
    window.addEventListener('hashchange', handleUrlHashRouting);
  }

  // Hash-based routing
  function handleUrlHashRouting() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      setView('home');
      return;
    }
    if (hash.startsWith('brand-')) {
      const brandClean = hash.replace('brand-', '').replace(/-/g, ' ');
      const brands = VelocityDB.getBrandsList();
      const matched = brands.find(b => b.toLowerCase() === brandClean.toLowerCase());
      if (matched) {
        AppState.activeBrand = matched;
        setView('brand');
      } else {
        setView('home');
      }
    } else if (hash === 'all-bikes') {
      AppState.activeBrand = 'All';
      setView('brand');
    } else if (hash === 'wishlist') {
      setView('wishlist');
    } else if (hash === 'bookings') {
      setView('bookings');
    } else if (hash === 'admin') {
      handleAdminNavClick();
    } else if (hash === 'reviews') {
      setView('reviews');
    } else if (hash === 'showroom') {
      setView('showroom');
    } else if (hash === 'compare') {
      openCompareModal();
    }
  }

  function setView(viewName) {
    AppState.currentView = viewName;
    updateActiveNavPill(viewName);
    
    // Close mobile menu if open
    if (UI.leftFrame) UI.leftFrame.classList.remove('mobile-open');

    // Toggle hero and filter bars based on view
    if (viewName === 'home') {
      if (UI.heroSection) UI.heroSection.style.display = 'flex';
      if (UI.filterSection) UI.filterSection.style.display = 'flex';
      renderHomePage();
    } else if (viewName === 'brand') {
      if (UI.heroSection) UI.heroSection.style.display = 'none';
      if (UI.filterSection) UI.filterSection.style.display = 'flex';
      renderFilteredBikes();
    } else {
      if (UI.heroSection) UI.heroSection.style.display = 'none';
      if (UI.filterSection) UI.filterSection.style.display = 'none';
      if (viewName === 'wishlist') renderWishlistView();
      else if (viewName === 'bookings') renderBookingsView();
      else if (viewName === 'admin') renderAdminView();
      else if (viewName === 'reviews') renderReviewsView();
      else if (viewName === 'showroom') renderShowroomView();
    }

    // Scroll right frame to top
    if (UI.rightFrame) UI.rightFrame.scrollTop = 0;
  }

  function updateActiveNavPill(viewName) {
    document.querySelectorAll('.nav-pill-btn').forEach(btn => btn.classList.remove('active'));
    if (viewName === 'home' && UI.navHome) UI.navHome.classList.add('active');
    if (viewName === 'brand' && UI.navBikes) UI.navBikes.classList.add('active');
    if (viewName === 'wishlist' && UI.navWishlist) UI.navWishlist.classList.add('active');
    if (viewName === 'bookings' && UI.navBookings) UI.navBookings.classList.add('active');
    if (viewName === 'admin' && UI.navAdmin) UI.navAdmin.classList.add('active');
  }

  function updateHeaderCounters() {
    const wishlist = VelocityDB.getWishlist();
    if (UI.wishlistBadge) UI.wishlistBadge.textContent = wishlist.length;

    if (UI.compareBadge) UI.compareBadge.textContent = AppState.comparedBikes.length;

    const bookings = VelocityDB.getBookings();
    if (UI.bookingsBadge) UI.bookingsBadge.textContent = bookings.length;
  }

  // --- 1. LEFT FRAME: BRANDS SIDEBAR RENDERING ---
  function renderBrandsSidebar() {
    if (!UI.brandNavList) return;
    const brands = VelocityDB.getBrandsList();
    const allBikes = VelocityDB.getBikes();

    let html = `
      <li class="brand-nav-item">
        <a href="#all-bikes" class="${AppState.activeBrand === 'All' && AppState.currentView === 'brand' ? 'active' : ''}" data-brand="All">
          <span class="brand-item-meta">
            <span class="brand-logo-badge"><i class="fa-solid fa-motorcycle"></i></span>
            <span>All Showroom Bikes</span>
          </span>
          <span class="brand-count-badge">${allBikes.length}</span>
        </a>
      </li>
    `;

    brands.forEach(brand => {
      const count = allBikes.filter(b => b.brand === brand).length;
      const isActive = AppState.activeBrand === brand && AppState.currentView === 'brand';
      const slug = brand.toLowerCase().replace(/\s+/g, '-');
      html += `
        <li class="brand-nav-item">
          <a href="#brand-${slug}" class="${isActive ? 'active' : ''}" data-brand="${brand}">
            <span class="brand-item-meta">
              <span class="brand-logo-badge">${brand.charAt(0)}</span>
              <span>${brand}</span>
            </span>
            <span class="brand-count-badge">${count}</span>
          </a>
        </li>
      `;
    });

    UI.brandNavList.innerHTML = html;

    // Attach click events to brand hyperlinks
    UI.brandNavList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedBrand = link.getAttribute('data-brand');
        AppState.activeBrand = selectedBrand;
        setView('brand');
        renderBrandsSidebar();
      });
    });
  }

  // --- 2. RIGHT FRAME: HOME PAGE VIEW ---
  function renderHomePage() {
    const bikes = VelocityDB.getBikes();
    const featuredBikes = bikes.filter(b => b.featured).slice(0, 4);
    const popularBikes = bikes.filter(b => b.popular).slice(0, 4);
    const reviews = VelocityDB.getReviews().slice(0, 3);
    const avgRating = VelocityDB.getAverageRating();

    let html = `
      <!-- Featured Bikes Section -->
      <div class="main-view-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Featured Superbikes & Cruisers</h2>
            <p class="section-subtitle">Hand-picked flagship machines available for immediate delivery & test ride</p>
          </div>
          <button class="btn-secondary" id="btnExploreAllBikes">
            <span>View All Bikes</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div class="bikes-grid" id="featuredGrid">
          ${featuredBikes.map(b => createBikeCardHTML(b)).join('')}
        </div>
      </div>

      <!-- Special Offers & Finance Schemes Banner -->
      <div style="padding: 0 32px; margin-bottom: 32px;">
        <div style="background: linear-gradient(135deg, #1e2530 0%, #151a22 100%); border: 1px solid var(--accent-orange); border-radius: var(--radius-lg); padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
          <div>
            <span style="background: var(--accent-orange); color: #fff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">Festival Season Benefit</span>
            <h3 style="font-family: var(--font-heading); font-size: 22px; color: #fff; margin-top: 8px;">0% Processing Fee & ₹ 10,000 Exchange Bonus</h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Pre-book your favorite motorcycle today with an easy ₹ 5,000 token advance. Simulated Instant Approval.</p>
          </div>
          <button class="btn-primary" id="btnPrebookPromo">
            <i class="fa-solid fa-bolt"></i>
            <span>Book Instant Test Ride</span>
          </button>
        </div>
      </div>

      <!-- Popular Bikes Section -->
      <div class="main-view-container" style="padding-top: 0;">
        <div class="section-header">
          <div>
            <h2 class="section-title">Trending & Most Popular Models</h2>
            <p class="section-subtitle">Top-rated motorcycles chosen by passionate riders across India</p>
          </div>
        </div>
        <div class="bikes-grid" id="popularGrid">
          ${popularBikes.map(b => createBikeCardHTML(b)).join('')}
        </div>
      </div>

      <!-- Customer Testimonials Section -->
      <div style="background: var(--bg-secondary); border-top: 1px solid var(--border-subtle); padding: 40px 32px;">
        <div class="section-header">
          <div>
            <h2 class="section-title">Rider Experiences & Reviews</h2>
            <p class="section-subtitle">Overall Showroom Rating: ⭐ <strong style="color: #fff;">${avgRating.average} / 5.0</strong> based on verified rider feedback</p>
          </div>
          <button class="btn-secondary" id="btnWriteReviewHome">
            <i class="fa-solid fa-pen-to-square"></i>
            <span>Write a Review</span>
          </button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 20px;">
          ${reviews.map(r => `
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: 700; color: #fff; font-size: 14px;">${escapeHtml(r.customerName)}</span>
                <span style="color: var(--accent-gold); font-size: 12px;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p style="font-size: 12px; color: var(--accent-orange); font-weight: 600; margin-bottom: 8px;">${escapeHtml(r.bikeModel)}</p>
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">"${escapeHtml(r.comment)}"</p>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 14px; font-size: 11px; color: var(--text-muted);">
                <span><i class="fa-solid fa-circle-check" style="color: var(--accent-green);"></i> Verified Rider</span>
                <span>${r.date}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    UI.mainViewContainer.innerHTML = html;
    attachCardActionListeners(UI.mainViewContainer);

    // Banner CTA buttons
    const btnExploreAllBikes = document.getElementById('btnExploreAllBikes');
    if (btnExploreAllBikes) {
      btnExploreAllBikes.addEventListener('click', () => {
        AppState.activeBrand = 'All';
        setView('brand');
      });
    }
    const btnPrebookPromo = document.getElementById('btnPrebookPromo');
    if (btnPrebookPromo) {
      btnPrebookPromo.addEventListener('click', () => {
        const sampleBike = bikes[0];
        openTestRideModal(sampleBike);
      });
    }
    const btnWriteReviewHome = document.getElementById('btnWriteReviewHome');
    if (btnWriteReviewHome) {
      btnWriteReviewHome.addEventListener('click', () => {
        setView('reviews');
      });
    }
  }

  // --- 3. RIGHT FRAME: FILTERED BIKES SHOWCASE ---
  function renderFilteredBikes() {
    let bikes = VelocityDB.getBikes();

    // 1. Filter by Brand
    if (AppState.activeBrand && AppState.activeBrand !== 'All') {
      bikes = bikes.filter(b => b.brand.toLowerCase() === AppState.activeBrand.toLowerCase());
    }

    // 2. Filter by Search Query
    if (AppState.searchQuery) {
      bikes = bikes.filter(b => 
        b.model.toLowerCase().includes(AppState.searchQuery) ||
        b.brand.toLowerCase().includes(AppState.searchQuery) ||
        b.category.toLowerCase().includes(AppState.searchQuery) ||
        b.engine.toLowerCase().includes(AppState.searchQuery)
      );
    }

    // 3. Filter by Price Range
    if (AppState.priceFilter !== 'all') {
      if (AppState.priceFilter === 'under-150k') bikes = bikes.filter(b => b.price < 150000);
      else if (AppState.priceFilter === '150k-300k') bikes = bikes.filter(b => b.price >= 150000 && b.price <= 300000);
      else if (AppState.priceFilter === '300k-600k') bikes = bikes.filter(b => b.price > 300000 && b.price <= 600000);
      else if (AppState.priceFilter === 'above-600k') bikes = bikes.filter(b => b.price > 600000);
    }

    // 4. Filter by Engine Capacity
    if (AppState.engineFilter !== 'all') {
      if (AppState.engineFilter === 'upto-160') bikes = bikes.filter(b => b.engineValue <= 160);
      else if (AppState.engineFilter === '160-350') bikes = bikes.filter(b => b.engineValue > 160 && b.engineValue <= 350);
      else if (AppState.engineFilter === '350-500') bikes = bikes.filter(b => b.engineValue > 350 && b.engineValue <= 500);
      else if (AppState.engineFilter === 'above-500') bikes = bikes.filter(b => b.engineValue > 500);
    }

    // 5. Filter by Mileage
    if (AppState.mileageFilter !== 'all') {
      const minM = parseFloat(AppState.mileageFilter);
      if (!isNaN(minM)) {
        bikes = bikes.filter(b => b.mileageValue >= minM);
      }
    }

    // 6. Sorting
    if (AppState.sortOption === 'price-low') {
      bikes.sort((a, b) => a.price - b.price);
    } else if (AppState.sortOption === 'price-high') {
      bikes.sort((a, b) => b.price - a.price);
    } else if (AppState.sortOption === 'name') {
      bikes.sort((a, b) => a.model.localeCompare(b.model));
    } else if (AppState.sortOption === 'mileage') {
      bikes.sort((a, b) => b.mileageValue - a.mileageValue);
    } else {
      // 'featured'
      bikes.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // Update result counter
    if (UI.resultsCount) {
      UI.resultsCount.textContent = `Showing ${bikes.length} ${bikes.length === 1 ? 'Motorcycle' : 'Motorcycles'}`;
    }

    let headerTitle = AppState.activeBrand === 'All' ? 'All Showroom Bikes' : `${AppState.activeBrand} Motorcycles`;
    let headerDesc = AppState.activeBrand === 'All' 
      ? 'Explore our multi-brand collection with real-time specs and direct booking' 
      : `Complete model line-up of official ${AppState.activeBrand} motorcycles`;

    let html = `
      <div class="main-view-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">${escapeHtml(headerTitle)}</h2>
            <p class="section-subtitle">${escapeHtml(headerDesc)}</p>
          </div>
        </div>
        ${bikes.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
            <i class="fa-solid fa-motorcycle" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
            <h3 style="font-size: 18px; color: #fff; margin-bottom: 8px;">No Motorcycles Match Your Filters</h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">Try adjusting your search criteria, price range or engine capacity filters.</p>
            <button class="btn-secondary" id="btnResetFiltersEmpty">Reset All Filters</button>
          </div>
        ` : `
          <div class="bikes-grid">
            ${bikes.map(b => createBikeCardHTML(b)).join('')}
          </div>
        `}
      </div>
    `;

    UI.mainViewContainer.innerHTML = html;
    attachCardActionListeners(UI.mainViewContainer);

    const btnResetFiltersEmpty = document.getElementById('btnResetFiltersEmpty');
    if (btnResetFiltersEmpty) {
      btnResetFiltersEmpty.addEventListener('click', resetFilters);
    }
  }

  function resetFilters() {
    AppState.searchQuery = '';
    AppState.priceFilter = 'all';
    AppState.engineFilter = 'all';
    AppState.mileageFilter = 'all';
    AppState.sortOption = 'featured';

    if (UI.searchInput) UI.searchInput.value = '';
    if (UI.filterPrice) UI.filterPrice.value = 'all';
    if (UI.filterEngine) UI.filterEngine.value = 'all';
    if (UI.filterMileage) UI.filterMileage.value = 'all';
    if (UI.sortSelect) UI.sortSelect.value = 'featured';

    renderFilteredBikes();
    showToast('Filters reset to default', 'info');
  }

  // --- 4. BIKE CARD HTML GENERATOR ---
  function createBikeCardHTML(bike) {
    const isWishlisted = VelocityDB.isInWishlist(bike.id);
    const isCompared = AppState.comparedBikes.includes(bike.id);
    const formattedPrice = VelocityDB.formatINR(bike.price);

    return `
      <div class="bike-card" data-bike-id="${bike.id}">
        <div class="bike-card-image-wrap">
          <img src="${bike.image}" alt="${escapeHtml(bike.model)}" class="bike-card-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'">
          
          <div class="bike-card-badges">
            <span class="badge-tag brand">${escapeHtml(bike.brand)}</span>
            ${bike.featured ? `<span class="badge-tag featured">Featured</span>` : ''}
            ${bike.popular ? `<span class="badge-tag popular">Popular</span>` : ''}
            ${!bike.inStock ? `<span class="badge-tag stock-out">Out of Stock</span>` : ''}
          </div>

          <div class="card-quick-actions">
            <button class="icon-circle-btn btn-wishlist-toggle ${isWishlisted ? 'wishlist-active' : ''}" title="Add to Favourites" data-bike-id="${bike.id}">
              <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>
        </div>

        <div class="bike-card-body">
          <div class="bike-title-row">
            <h3 class="bike-model-name">${escapeHtml(bike.model)}</h3>
            <p class="bike-tagline-text">${escapeHtml(bike.tagline || bike.category)}</p>
          </div>

          <div class="bike-specs-grid">
            <div class="spec-cell">
              <div class="spec-label">Engine</div>
              <div class="spec-val">${escapeHtml(bike.engine)}</div>
            </div>
            <div class="spec-cell">
              <div class="spec-label">Mileage</div>
              <div class="spec-val">${escapeHtml(bike.mileage)}</div>
            </div>
            <div class="spec-cell">
              <div class="spec-label">Power</div>
              <div class="spec-val">${escapeHtml(bike.power.split('@')[0])}</div>
            </div>
          </div>

          <div class="bike-color-swatches">
            <span class="swatch-label">Colours:</span>
            ${bike.colors.map(c => `
              <span class="color-swatch-circle" style="background-color: ${c.hex};" title="${escapeHtml(c.name)}"></span>
            `).join('')}
          </div>

          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">
            ${escapeHtml(bike.description)}
          </p>

          <div class="bike-price-box">
            <div>
              <span class="price-indicative-label">Indicative Ex-Showroom</span>
              <div class="price-figure">${formattedPrice}*</div>
            </div>
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">${escapeHtml(bike.transmission)}</span>
          </div>

          <div class="card-button-row">
            <button class="btn-card-action btn-book-now" data-bike-id="${bike.id}">
              <i class="fa-solid fa-bolt"></i>
              <span>Book Now</span>
            </button>
            <button class="btn-card-action btn-test-ride" data-bike-id="${bike.id}">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Test Ride</span>
            </button>
            <button class="btn-card-action btn-compare-toggle ${isCompared ? 'compared' : ''}" data-bike-id="${bike.id}">
              <i class="fa-solid fa-code-compare"></i>
              <span>${isCompared ? 'Remove from Compare' : '+ Add to Compare'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Attach dynamic event listeners to bike cards
  function attachCardActionListeners(container) {
    if (!container) return;

    // Wishlist Toggle
    container.querySelectorAll('.btn-wishlist-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bikeId = btn.getAttribute('data-bike-id');
        const res = VelocityDB.toggleWishlist(bikeId);
        updateHeaderCounters();
        
        // Update UI button icon
        const icon = btn.querySelector('i');
        if (res.inWishlist) {
          btn.classList.add('wishlist-active');
          icon.className = 'fa-solid fa-heart';
          showToast('Added to your Favourites', 'success');
        } else {
          btn.classList.remove('wishlist-active');
          icon.className = 'fa-regular fa-heart';
          showToast('Removed from Favourites', 'info');
        }

        // If we are on wishlist view, re-render
        if (AppState.currentView === 'wishlist') {
          renderWishlistView();
        }
      });
    });

    // Compare Toggle
    container.querySelectorAll('.btn-compare-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bikeId = btn.getAttribute('data-bike-id');
        toggleCompareBike(bikeId);
      });
    });

    // Book Now button
    container.querySelectorAll('.btn-book-now').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bikeId = btn.getAttribute('data-bike-id');
        const bike = VelocityDB.getBikeById(bikeId);
        if (bike) openBookingModal(bike);
      });
    });

    // Test Ride button
    container.querySelectorAll('.btn-test-ride').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bikeId = btn.getAttribute('data-bike-id');
        const bike = VelocityDB.getBikeById(bikeId);
        if (bike) openTestRideModal(bike);
      });
    });
  }

  // --- 5. BIKE COMPARISON SYSTEM ---
  function toggleCompareBike(bikeId) {
    const idx = AppState.comparedBikes.indexOf(bikeId);
    if (idx >= 0) {
      AppState.comparedBikes.splice(idx, 1);
      showToast('Bike removed from comparison', 'info');
    } else {
      if (AppState.comparedBikes.length >= 3) {
        showToast('You can compare a maximum of 3 bikes simultaneously', 'error');
        return;
      }
      AppState.comparedBikes.push(bikeId);
      showToast('Bike added to comparison list', 'success');
    }

    updateCompareDrawer();
    updateHeaderCounters();
    renderFilteredBikes();
  }

  function updateCompareDrawer() {
    if (!UI.compareDrawer || !UI.compareItemsContainer) return;

    if (AppState.comparedBikes.length === 0) {
      UI.compareDrawer.classList.remove('active');
      return;
    }

    UI.compareDrawer.classList.add('active');
    const bikes = AppState.comparedBikes.map(id => VelocityDB.getBikeById(id)).filter(Boolean);

    let html = bikes.map(b => `
      <div class="compare-bar-item">
        <img src="${b.image}" alt="${escapeHtml(b.model)}" style="width: 28px; height: 28px; border-radius: 4px; object-fit: cover;">
        <span>${escapeHtml(b.model)}</span>
        <span class="btn-remove" data-remove-id="${b.id}" title="Remove"><i class="fa-solid fa-xmark"></i></span>
      </div>
    `).join('');

    UI.compareItemsContainer.innerHTML = html;

    UI.compareItemsContainer.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const remId = btn.getAttribute('data-remove-id');
        toggleCompareBike(remId);
      });
    });
  }

  function openCompareModal() {
    if (AppState.comparedBikes.length < 2) {
      showToast('Please select at least 2 bikes to compare specifications', 'error');
      return;
    }

    const bikes = AppState.comparedBikes.map(id => VelocityDB.getBikeById(id)).filter(Boolean);
    const modalBody = document.getElementById('compareModalBody');
    if (!modalBody) return;

    let html = `
      <table class="compare-matrix-table">
        <thead>
          <tr>
            <th>Specification</th>
            ${bikes.map(b => `
              <th>
                <div style="text-align: center;">
                  <img src="${b.image}" alt="${escapeHtml(b.model)}" style="width: 100px; height: 70px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;">
                  <div style="font-size: 14px; color: #fff; font-weight: 800;">${escapeHtml(b.model)}</div>
                  <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(b.brand)}</div>
                </div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Indicative Price</th>
            ${bikes.map(b => `<td style="font-weight: 800; color: var(--accent-orange);">${VelocityDB.formatINR(b.price)}*</td>`).join('')}
          </tr>
          <tr>
            <th>Engine Displacement</th>
            ${bikes.map(b => `<td><strong>${escapeHtml(b.engine)}</strong></td>`).join('')}
          </tr>
          <tr>
            <th>Certified Mileage</th>
            ${bikes.map(b => `<td><strong>${escapeHtml(b.mileage)}</strong></td>`).join('')}
          </tr>
          <tr>
            <th>Max Power</th>
            ${bikes.map(b => `<td>${escapeHtml(b.power)}</td>`).join('')}
          </tr>
          <tr>
            <th>Max Torque</th>
            ${bikes.map(b => `<td>${escapeHtml(b.torque)}</td>`).join('')}
          </tr>
          <tr>
            <th>Transmission</th>
            ${bikes.map(b => `<td>${escapeHtml(b.transmission)}</td>`).join('')}
          </tr>
          <tr>
            <th>Fuel Tank Capacity</th>
            ${bikes.map(b => `<td>${escapeHtml(b.fuelCapacity)}</td>`).join('')}
          </tr>
          <tr>
            <th>Kerb Weight</th>
            ${bikes.map(b => `<td>${escapeHtml(b.kerbWeight)}</td>`).join('')}
          </tr>
          <tr>
            <th>Top Speed</th>
            ${bikes.map(b => `<td>${escapeHtml(b.topSpeed)}</td>`).join('')}
          </tr>
          <tr>
            <th>Braking & Safety</th>
            ${bikes.map(b => `<td>${escapeHtml(b.brakes)}</td>`).join('')}
          </tr>
          <tr>
            <th>Action</th>
            ${bikes.map(b => `
              <td>
                <button class="btn-card-action btn-book-now" style="width: 100%;" data-compare-book="${b.id}">
                  <i class="fa-solid fa-bolt"></i> Book This Bike
                </button>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    `;

    modalBody.innerHTML = html;

    modalBody.querySelectorAll('[data-compare-book]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-compare-book');
        const b = VelocityDB.getBikeById(id);
        closeAllModals();
        if (b) openBookingModal(b);
      });
    });

    if (UI.compareModal) UI.compareModal.classList.add('active');
  }

  // --- 6. BIKE BOOKING & PAYMENT GATEWAY FLOW ---
  function openBookingModal(bike) {
    AppState.currentBookingBike = bike;
    AppState.currentPaymentMethod = 'UPI';

    const bikeSummary = document.getElementById('bookingBikeSummary');
    if (bikeSummary) {
      bikeSummary.innerHTML = `
        <div style="display: flex; gap: 16px; align-items: center; background: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
          <img src="${bike.image}" alt="${escapeHtml(bike.model)}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 6px;">
          <div style="flex: 1;">
            <span style="font-size: 11px; color: var(--accent-orange); font-weight: 700; text-transform: uppercase;">${escapeHtml(bike.brand)}</span>
            <h4 style="font-family: var(--font-heading); font-size: 16px; color: #fff;">${escapeHtml(bike.model)}</h4>
            <div style="font-size: 13px; font-weight: 700; color: #fff;">Ex-Showroom: <span style="color: var(--accent-orange);">${VelocityDB.formatINR(bike.price)}</span></div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Booking Token</span>
            <div style="font-size: 18px; font-weight: 900; color: var(--accent-green);">₹ 5,000</div>
          </div>
        </div>
      `;
    }

    // Populate Color select options
    const colorSelect = document.getElementById('bookingColor');
    if (colorSelect && bike.colors) {
      colorSelect.innerHTML = bike.colors.map(c => `
        <option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>
      `).join('');
    }

    // Set minimum preferred date to tomorrow
    const dateInput = document.getElementById('bookingDeliveryDate');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    selectPaymentMethod('UPI');

    if (UI.bookingModal) UI.bookingModal.classList.add('active');
  }

  function selectPaymentMethod(method) {
    AppState.currentPaymentMethod = method;
    document.querySelectorAll('.payment-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-method') === method);
    });

    const paymentContainer = document.getElementById('paymentMethodDetailsContainer');
    if (!paymentContainer) return;

    if (method === 'UPI') {
      paymentContainer.innerHTML = `
        <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 16px;">
          <div style="background: #fff; padding: 8px; border-radius: 6px; text-align: center;">
            <i class="fa-solid fa-qrcode" style="font-size: 54px; color: #000;"></i>
            <div style="font-size: 9px; color: #444; font-weight: 800; margin-top: 2px;">SCAN DEMO QR</div>
          </div>
          <div style="flex: 1;">
            <label class="form-label">Simulated UPI ID / VPA <span class="req">*</span></label>
            <input type="text" class="form-control" id="upiInput" value="rider@okaxis" placeholder="username@upi" required>
            <div class="form-help-text">Simulated Google Pay / PhonePe / Paytm token verification.</div>
          </div>
        </div>
      `;
    } else if (method === 'Card') {
      paymentContainer.innerHTML = `
        <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 10px;">
          <div>
            <label class="form-label">Card Number <span class="req">*</span></label>
            <input type="text" class="form-control" id="cardNumberInput" maxlength="19" value="4532 •••• •••• 8891" placeholder="4532 0000 0000 0000" required>
          </div>
          <div class="form-row-2">
            <div>
              <label class="form-label">Valid Thru <span class="req">*</span></label>
              <input type="text" class="form-control" maxlength="5" value="12/28" placeholder="MM/YY" required>
            </div>
            <div>
              <label class="form-label">CVV <span class="req">*</span></label>
              <input type="password" class="form-control" maxlength="3" value="789" placeholder="123" required>
            </div>
          </div>
        </div>
      `;
    } else {
      // Cash at Showroom
      paymentContainer.innerHTML = `
        <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; gap: 12px; color: var(--accent-green); font-size: 14px; font-weight: 700; margin-bottom: 6px;">
            <i class="fa-solid fa-money-bill-wave"></i>
            <span>Pay ₹ 5,000 Advance at Showroom Counter</span>
          </div>
          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
            Your booking will be reserved for 48 hours. Present your generated Digital Receipt at the Velocity Cashier Desk to finalize registration.
          </p>
        </div>
      `;
    }
  }

  function handleBookingSubmit(e) {
    e.preventDefault();
    if (!AppState.currentBookingBike) return;

    const name = document.getElementById('bookingName').value.trim();
    const mobile = document.getElementById('bookingMobile').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const color = document.getElementById('bookingColor').value;
    const deliveryDate = document.getElementById('bookingDeliveryDate').value;

    // Validation
    if (!name || name.length < 2) {
      showToast('Please enter a valid customer name', 'error');
      return;
    }
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      showToast('Please enter a valid 10-digit Indian mobile number', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    const bookingPayload = {
      customerName: name,
      mobile: mobile,
      email: email,
      bikeId: AppState.currentBookingBike.id,
      bikeModel: AppState.currentBookingBike.model,
      bikeBrand: AppState.currentBookingBike.brand,
      bikePrice: AppState.currentBookingBike.price,
      selectedColor: color,
      preferredDeliveryDate: deliveryDate,
      bookingAmount: 5000,
      paymentMethod: `Demo ${AppState.currentPaymentMethod}`,
      paymentRef: `TXN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`
    };

    const newBooking = VelocityDB.saveBooking(bookingPayload);
    updateHeaderCounters();
    closeAllModals();

    showToast(`Booking Successful! ID: ${newBooking.bookingId}`, 'success');
    openReceiptModal(newBooking);
  }

  // --- 7. DIGITAL BOOKING RECEIPT MODAL ---
  function openReceiptModal(booking) {
    const modalBody = document.getElementById('receiptModalBody');
    if (!modalBody) return;

    const formattedPrice = VelocityDB.formatINR(booking.bikePrice);
    const formattedToken = VelocityDB.formatINR(booking.bookingAmount);
    const balanceAmount = VelocityDB.formatINR(booking.bikePrice - booking.bookingAmount);

    let html = `
      <div class="receipt-paper" id="printableReceiptArea">
        <div class="receipt-watermark">ACADEMIC DEMO</div>
        
        <div class="receipt-header-row">
          <div class="receipt-logo-title">
            <h2>VELOCITY <span>SHOWROOM</span></h2>
            <p>Authorized Multi-Brand Two-Wheeler Experience Center</p>
            <div style="font-size: 11px; color: #4b5563; margin-top: 4px;">
              Velocity Hub, 100 Ft Road, Indiranagar, Bengaluru - 560038 | GSTIN: 29AABCV9823M1Z9
            </div>
          </div>
          <div class="receipt-meta-right">
            <div><strong>Receipt No:</strong> ${escapeHtml(booking.receiptNo)}</div>
            <div><strong>Booking ID:</strong> <span style="color: var(--accent-red); font-weight: 800;">${escapeHtml(booking.bookingId)}</span></div>
            <div><strong>Date:</strong> ${booking.bookingDate || new Date().toISOString().split('T')[0]}</div>
            <span class="receipt-badge-status">${escapeHtml(booking.status)}</span>
          </div>
        </div>

        <div class="receipt-grid-details">
          <div class="receipt-box">
            <h4>Customer Information</h4>
            <div><strong>Name:</strong> ${escapeHtml(booking.customerName)}</div>
            <div><strong>Contact:</strong> +91 ${escapeHtml(booking.mobile)}</div>
            <div><strong>Email:</strong> ${escapeHtml(booking.email)}</div>
            <div><strong>Target Delivery:</strong> ${escapeHtml(booking.preferredDeliveryDate || 'Within 15 Days')}</div>
          </div>
          <div class="receipt-box">
            <h4>Motorcycle Specification</h4>
            <div><strong>Brand & Model:</strong> ${escapeHtml(booking.bikeBrand)} - ${escapeHtml(booking.bikeModel)}</div>
            <div><strong>Selected Shade:</strong> ${escapeHtml(booking.selectedColor)}</div>
            <div><strong>Ex-Showroom Price:</strong> ${formattedPrice}*</div>
            <div><strong>Payment Mode:</strong> ${escapeHtml(booking.paymentMethod)}</div>
          </div>
        </div>

        <table class="receipt-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Rate / Unit</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Advance Token Booking Deposit</strong><br>
                <span style="font-size: 11px; color: #6b7280;">Reservation fee for ${escapeHtml(booking.bikeModel)} (Color: ${escapeHtml(booking.selectedColor)})</span>
              </td>
              <td>1 Unit</td>
              <td style="text-align: right;">${formattedToken}</td>
            </tr>
            <tr>
              <td>
                <strong>Simulated Payment Reference</strong><br>
                <span style="font-size: 11px; color: #6b7280;">Transaction Ref: ${escapeHtml(booking.paymentRef)} (${escapeHtml(booking.paymentStatus)})</span>
              </td>
              <td>Verified</td>
              <td style="text-align: right; color: #15803d; font-weight: 700;">PAID (DEMO)</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">Total Booking Token Paid</td>
              <td style="text-align: right; color: var(--accent-red);">${formattedToken}</td>
            </tr>
            <tr>
              <td colspan="2" style="font-size: 12px; color: #4b5563;">Estimated Balance Due at Vehicle Registration</td>
              <td style="text-align: right; font-weight: 700; color: #374151;">${balanceAmount}*</td>
            </tr>
          </tbody>
        </table>

        <div class="receipt-footer-notes">
          <strong>Terms & Conditions of Reservation:</strong>
          <ol style="margin-left: 18px; margin-top: 4px; font-size: 10px; color: #6b7280;">
            <li>This document is generated by VELOCITY Smart Bike Showroom as an academic demonstration of booking and billing workflows. No actual financial debit has taken place.</li>
            <li>Vehicle allocation is subject to factory stock dispatch and standard RTO registration procedures.</li>
            <li>Token amount is 100% refundable upon cancellation prior to vehicle invoicing.</li>
            <li>For any query, quote Booking ID <strong>${escapeHtml(booking.bookingId)}</strong> at velocity-support@smartbikes.demo.</li>
          </ol>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 16px;">
            <div style="font-size: 10px; color: #9ca3af;">Digitally Signed & Validated • VELOCITY System v1.0</div>
            <div style="text-align: center; border-top: 1px solid #9ca3af; padding-top: 4px; width: 140px; font-size: 11px; font-weight: 700;">Authorized Signatory</div>
          </div>
        </div>
      </div>
    `;

    modalBody.innerHTML = html;
    if (UI.receiptModal) UI.receiptModal.classList.add('active');
  }

  function downloadReceiptPDF() {
    const printableArea = document.getElementById('printableReceiptArea');
    if (!printableArea) return;

    if (typeof window.html2pdf === 'function') {
      showToast('Generating official PDF receipt...', 'info');
      const opt = {
        margin: 10,
        filename: 'Velocity_Booking_Receipt.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().from(printableArea).set(opt).save().then(() => {
        showToast('Receipt PDF downloaded successfully!', 'success');
      }).catch(err => {
        console.error(err);
        window.print();
      });
    } else {
      // Direct print-to-pdf fallback
      window.print();
    }
  }

  // --- 8. TEST RIDE BOOKING SYSTEM ---
  function openTestRideModal(bike) {
    const bikeSummary = document.getElementById('testRideBikeSummary');
    if (bikeSummary) {
      bikeSummary.innerHTML = `
        <div style="display: flex; gap: 14px; align-items: center; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 16px;">
          <img src="${bike.image}" alt="${escapeHtml(bike.model)}" style="width: 70px; height: 50px; object-fit: cover; border-radius: 4px;">
          <div>
            <span style="font-size: 10px; color: var(--accent-orange); font-weight: 700; text-transform: uppercase;">${escapeHtml(bike.brand)}</span>
            <h4 style="font-family: var(--font-heading); font-size: 15px; color: #fff;">${escapeHtml(bike.model)}</h4>
            <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(bike.engine)} • ${escapeHtml(bike.power.split('@')[0])}</div>
          </div>
        </div>
      `;
    }

    const testRideBikeId = document.getElementById('testRideBikeId');
    if (testRideBikeId) testRideBikeId.value = bike.id;

    // Set date min to today
    const dateInput = document.getElementById('testRideDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    if (UI.testRideModal) UI.testRideModal.classList.add('active');
  }

  function handleTestRideSubmit(e) {
    e.preventDefault();
    const bikeId = document.getElementById('testRideBikeId').value;
    const bike = VelocityDB.getBikeById(bikeId);
    if (!bike) return;

    const name = document.getElementById('testRideName').value.trim();
    const mobile = document.getElementById('testRideMobile').value.trim();
    const email = document.getElementById('testRideEmail').value.trim();
    const date = document.getElementById('testRideDate').value;
    const slot = document.getElementById('testRideSlot').value;
    const licenseCheck = document.getElementById('testRideLicense').checked;

    if (!name || name.length < 2) {
      showToast('Please enter customer full name', 'error');
      return;
    }
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      showToast('Please enter a valid 10-digit Indian mobile number', 'error');
      return;
    }
    if (!licenseCheck) {
      showToast('Valid driving license is mandatory for test ride confirmation', 'error');
      return;
    }

    const testRide = VelocityDB.saveTestRide({
      customerName: name,
      mobile: mobile,
      email: email,
      bikeId: bike.id,
      bikeModel: bike.model,
      bikeBrand: bike.brand,
      preferredDate: date,
      timeSlot: slot,
      hasLicense: licenseCheck
    });

    closeAllModals();
    showToast(`Test Ride Reserved! Confirmation ID: ${testRide.testRideId}`, 'success');
  }

  // --- 9. MY BOOKINGS & DIGITAL RECEIPTS VIEW ---
  function renderBookingsView() {
    const bookings = VelocityDB.getBookings();

    let html = `
      <div class="main-view-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">My Bookings & Receipts</h2>
            <p class="section-subtitle">Track your motorcycle reservations, view digital invoices, and cancel anytime</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <input type="text" id="bookingSearchInput" class="form-control" placeholder="Search by Booking ID or Name..." style="width: 260px;">
          </div>
        </div>

        ${bookings.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
            <i class="fa-solid fa-file-invoice" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
            <h3 style="font-size: 18px; color: #fff; margin-bottom: 8px;">No Bookings Recorded Yet</h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">Explore our brand catalog and pre-book your dream bike with a simulated token deposit.</p>
            <button class="btn-primary" id="btnBookingsExplore">Explore Bikes</button>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 16px;" id="bookingsListContainer">
            ${bookings.map(b => createBookingRowHTML(b)).join('')}
          </div>
        `}
      </div>
    `;

    UI.mainViewContainer.innerHTML = html;

    const btnBookingsExplore = document.getElementById('btnBookingsExplore');
    if (btnBookingsExplore) {
      btnBookingsExplore.addEventListener('click', () => {
        AppState.activeBrand = 'All';
        setView('brand');
      });
    }

    // Search filter for bookings
    const bookingSearchInput = document.getElementById('bookingSearchInput');
    if (bookingSearchInput) {
      bookingSearchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = VelocityDB.getBookings().filter(b => 
          b.bookingId.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.bikeModel.toLowerCase().includes(q)
        );
        const container = document.getElementById('bookingsListContainer');
        if (container) {
          container.innerHTML = filtered.map(b => createBookingRowHTML(b)).join('');
          attachBookingRowListeners(container);
        }
      });
    }

    attachBookingRowListeners(UI.mainViewContainer);
  }

  function createBookingRowHTML(b) {
    const isCancelled = b.status === 'Cancelled';
    return `
      <div class="stat-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid ${isCancelled ? 'var(--accent-red)' : 'var(--accent-green)'};">
        <div style="display: flex; gap: 16px; align-items: center;">
          <div class="stat-icon" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-green);">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-family: var(--font-heading); font-size: 16px; color: #fff; font-weight: 800;">${escapeHtml(b.bookingId)}</span>
              <span class="badge-tag" style="background: ${isCancelled ? 'rgba(230,57,70,0.2)' : 'rgba(16,185,129,0.2)'}; color: ${isCancelled ? 'var(--accent-red)' : 'var(--accent-green)'}; font-size: 11px;">${escapeHtml(b.status)}</span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: var(--accent-orange); margin-top: 4px;">${escapeHtml(b.bikeModel)} (${escapeHtml(b.selectedColor)})</div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
              Customer: <strong>${escapeHtml(b.customerName)}</strong> (+91 ${escapeHtml(b.mobile)}) • Token: <strong>${VelocityDB.formatINR(b.bookingAmount)}</strong>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="btn-secondary btn-view-receipt" data-booking-id="${b.bookingId}">
            <i class="fa-solid fa-file-invoice"></i> View Receipt
          </button>
          ${!isCancelled ? `
            <button class="btn-table-action delete btn-cancel-booking" data-booking-id="${b.bookingId}" style="padding: 10px 14px;">
              <i class="fa-solid fa-ban"></i> Cancel Booking
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  function attachBookingRowListeners(container) {
    if (!container) return;

    container.querySelectorAll('.btn-view-receipt').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-booking-id');
        const booking = VelocityDB.getBookingById(id);
        if (booking) openReceiptModal(booking);
      });
    });

    container.querySelectorAll('.btn-cancel-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-booking-id');
        if (confirm(`Are you sure you want to cancel booking ${id}? Your ₹ 5,000 demo advance token will be credited back.`)) {
          VelocityDB.cancelBooking(id);
          showToast(`Booking ${id} has been cancelled`, 'info');
          renderBookingsView();
        }
      });
    });
  }

  // --- 10. WISHLIST VIEW ---
  function renderWishlistView() {
    const wishlistIds = VelocityDB.getWishlist();
    const allBikes = VelocityDB.getBikes();
    const wishBikes = allBikes.filter(b => wishlistIds.includes(b.id));

    let html = `
      <div class="main-view-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">My Saved Favourites (${wishBikes.length})</h2>
            <p class="section-subtitle">Motorcycles you've bookmarked for future comparison or booking</p>
          </div>
        </div>

        ${wishBikes.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
            <i class="fa-solid fa-heart" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
            <h3 style="font-size: 18px; color: #fff; margin-bottom: 8px;">Your Wishlist is Empty</h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">Click the heart icon on any motorcycle card to save it here.</p>
            <button class="btn-primary" id="btnWishlistExplore">Explore Bikes</button>
          </div>
        ` : `
          <div class="bikes-grid">
            ${wishBikes.map(b => createBikeCardHTML(b)).join('')}
          </div>
        `}
      </div>
    `;

    UI.mainViewContainer.innerHTML = html;
    attachCardActionListeners(UI.mainViewContainer);

    const btnWishlistExplore = document.getElementById('btnWishlistExplore');
    if (btnWishlistExplore) {
      btnWishlistExplore.addEventListener('click', () => {
        AppState.activeBrand = 'All';
        setView('brand');
      });
    }
  }

  // --- 11. CUSTOMER REVIEWS VIEW ---
  function renderReviewsView() {
    const reviews = VelocityDB.getReviews();
    const avgData = VelocityDB.getAverageRating();
    const bikes = VelocityDB.getBikes();

    let html = `
      <div class="main-view-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Customer Feedback & Ratings</h2>
            <p class="section-subtitle">Read genuine owner reviews or share your own experience with Velocity Showroom</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 28px; margin-bottom: 40px;">
          <!-- Review Form Box -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px;">
            <h3 style="font-family: var(--font-heading); font-size: 18px; color: #fff; margin-bottom: 16px;">
              <i class="fa-solid fa-pen-nib" style="color: var(--accent-orange);"></i> Write a Rider Review
            </h3>
            <form id="riderReviewForm">
              <div class="form-group">
                <label class="form-label">Your Name <span class="req">*</span></label>
                <input type="text" class="form-control" id="revAuthor" placeholder="e.g. Vikram Malhotra" required>
              </div>
              <div class="form-group">
                <label class="form-label">Select Bike Owned / Tested <span class="req">*</span></label>
                <select class="form-control custom-select" id="revBikeModel" required>
                  ${bikes.map(b => `<option value="${escapeHtml(b.brand + ' ' + b.model)}">${escapeHtml(b.brand + ' - ' + b.model)}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Rating <span class="req">*</span></label>
                <select class="form-control custom-select" id="revRating">
                  <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                  <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value="3">⭐⭐⭐ (3 - Average)</option>
                  <option value="2">⭐⭐ (2 - Below Expectations)</option>
                  <option value="1">⭐ (1 - Unsatisfactory)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Your Review & Comments <span class="req">*</span></label>
                <textarea class="form-control" id="revComment" rows="3" placeholder="Share your experience regarding delivery, test ride, and performance..." required></textarea>
              </div>
              <button type="submit" class="btn-primary" style="width: 100%;">
                <i class="fa-solid fa-paper-plane"></i> Submit Feedback
              </button>
            </form>
          </div>

          <!-- Overall Score Summary -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <div style="font-family: var(--font-heading); font-size: 64px; font-weight: 900; color: #fff; line-height: 1;">
              ${avgData.average}
            </div>
            <div style="color: var(--accent-gold); font-size: 24px; margin: 8px 0;">★★★★★</div>
            <p style="font-size: 14px; color: var(--text-secondary);">Average rating across <strong>${avgData.count}</strong> customer submissions</p>
            <div style="width: 100%; max-width: 320px; margin-top: 20px; font-size: 12px; color: var(--text-muted); line-height: 1.6;">
              ✓ 100% Verified Customers<br>
              ✓ Direct Dealership Testimonials<br>
              ✓ Official Quality Benchmark
            </div>
          </div>
        </div>

        <!-- Reviews List -->
        <h3 style="font-family: var(--font-heading); font-size: 20px; color: #fff; margin-bottom: 16px;">All Reviews</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;">
          ${reviews.map(r => `
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-weight: 700; color: #fff; font-size: 14px;">${escapeHtml(r.customerName)}</span>
                <span style="color: var(--accent-gold); font-size: 13px;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
              </div>
              <div style="font-size: 12px; color: var(--accent-orange); font-weight: 600; margin-bottom: 8px;">${escapeHtml(r.bikeModel)}</div>
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">"${escapeHtml(r.comment)}"</p>
              <div style="margin-top: 14px; font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;">
                <span><i class="fa-solid fa-circle-check" style="color: var(--accent-green);"></i> Verified Buyer</span>
                <span>${r.date}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    UI.mainViewContainer.innerHTML = html;

    const riderReviewForm = document.getElementById('riderReviewForm');
    if (riderReviewForm) {
      riderReviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('revAuthor').value.trim();
        const bikeModel = document.getElementById('revBikeModel').value;
        const rating = parseInt(document.getElementById('revRating').value, 10);
        const comment = document.getElementById('revComment').value.trim();

        if (!author || !comment) {
          showToast('Please fill all review fields', 'error');
          return;
        }

        VelocityDB.saveReview({
          customerName: author,
          bikeModel: bikeModel,
          rating: rating,
          comment: comment,
          verifiedBuyer: true
        });

        showToast('Thank you! Your review has been published.', 'success');
        renderReviewsView();
      });
    }
  }

  // --- 12. SHOWROOM INFORMATION & INQUIRY VIEW ---
  function renderShowroomView() {
    let html = `
      <div class="main-view-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Showroom Experience Center</h2>
            <p class="section-subtitle">Visit our flagship interactive facility or send us an inquiry</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 32px;">
          <!-- Showroom Highlights & Timing -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px;">
            <h3 style="font-family: var(--font-heading); font-size: 20px; color: #fff; margin-bottom: 16px;">
              <i class="fa-solid fa-location-dot" style="color: var(--accent-red);"></i> VELOCITY Headquarters
            </h3>
            <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
              Velocity Hub, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka - 560038
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; font-size: 13px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fa-solid fa-phone" style="color: var(--accent-orange); width: 18px;"></i>
                <span>Direct Sales Hotline: <strong>+91 (080) 4920-8800 / +91 98765 43210</strong></span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fa-solid fa-envelope" style="color: var(--accent-orange); width: 18px;"></i>
                <span>Official Inquiries: <strong>showroom@velocitybikes.demo</strong></span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fa-solid fa-clock" style="color: var(--accent-orange); width: 18px;"></i>
                <span>Mon – Sat: <strong>9:00 AM – 8:30 PM</strong> | Sun: <strong>10:00 AM – 6:00 PM</strong></span>
              </div>
            </div>

            <h4 style="font-size: 13px; text-transform: uppercase; color: var(--accent-orange); font-weight: 800; margin-bottom: 12px;">
              Showroom Infrastructure Amenities
            </h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--text-secondary);">
              <li>✓ Dyno Performance Diagnostics Bay</li>
              <li>✓ Dedicated Test Track & Riding Gear Lounge</li>
              <li>✓ Quick Token Delivery Counter with Digital Sign-off</li>
              <li>✓ Coffee & Refreshments Riders Cafe</li>
            </ul>

            <div style="margin-top: 24px;">
              <a href="https://maps.google.com" target="_blank" class="btn-secondary" style="width: 100%; justify-content: center;">
                <i class="fa-solid fa-map-location-dot"></i> Open in Google Maps
              </a>
            </div>
          </div>

          <!-- Quick Inquiry Form -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px;">
            <h3 style="font-family: var(--font-heading); font-size: 20px; color: #fff; margin-bottom: 16px;">
              <i class="fa-solid fa-paper-plane" style="color: var(--accent-orange);"></i> Send an Inquiry
            </h3>
            <form id="showroomInquiryForm">
              <div class="form-group">
                <label class="form-label">Your Name <span class="req">*</span></label>
                <input type="text" class="form-control" id="inqName" placeholder="e.g. Karthik Nair" required>
              </div>
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">Phone <span class="req">*</span></label>
                  <input type="tel" class="form-control" id="inqPhone" placeholder="10-digit mobile" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email <span class="req">*</span></label>
                  <input type="email" class="form-control" id="inqEmail" placeholder="your@email.com" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Subject</label>
                <input type="text" class="form-control" id="inqSubject" placeholder="e.g. Delivery timeline for Kawasaki ZX-10R">
              </div>
              <div class="form-group">
                <label class="form-label">Message Details <span class="req">*</span></label>
                <textarea class="form-control" id="inqMessage" rows="3" placeholder="Tell us your requirements, exchange inquiry, or accessory queries..." required></textarea>
              </div>
              <button type="submit" class="btn-primary" style="width: 100%;">
                <i class="fa-solid fa-envelope-circle-check"></i> Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    UI.mainViewContainer.innerHTML = html;

    const showroomInquiryForm = document.getElementById('showroomInquiryForm');
    if (showroomInquiryForm) {
      showroomInquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('inqName').value.trim();
        const phone = document.getElementById('inqPhone').value.trim();
        const email = document.getElementById('inqEmail').value.trim();
        const subject = document.getElementById('inqSubject').value.trim();
        const msg = document.getElementById('inqMessage').value.trim();

        VelocityDB.saveInquiry({
          name: name,
          phone: phone,
          email: email,
          subject: subject,
          message: msg
        });

        showToast('Inquiry recorded! Our showroom advisor will reach out shortly.', 'success');
        showroomInquiryForm.reset();
      });
    }
  }

  // --- 13. ADMIN SECTION & INVENTORY MANAGEMENT ---
  function handleAdminNavClick() {
    if (AppState.adminLoggedIn) {
      setView('admin');
    } else {
      openAdminLoginModal();
    }
  }

  function openAdminLoginModal() {
    if (UI.adminLoginModal) UI.adminLoginModal.classList.add('active');
  }

  function handleAdminLoginSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value.trim();

    if (u === 'admin' && p === 'velocity') {
      AppState.adminLoggedIn = true;
      closeAllModals();
      showToast('Admin Authentication Successful (Demo Mode)', 'success');
      setView('admin');
    } else {
      showToast('Invalid credentials. Use admin / velocity', 'error');
    }
  }

  function renderAdminView() {
    const bikes = VelocityDB.getBikes();
    const bookings = VelocityDB.getBookings();
    const testRides = VelocityDB.getTestRides();
    const inquiries = VelocityDB.getInquiries();

    const pendingBookings = bookings.filter(b => b.status === 'Pending Verification' || b.status === 'Confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Delivered').length;
    const totalRevenueSimulated = bookings.reduce((sum, b) => sum + (b.bookingAmount || 5000), 0);

    let html = `
      <div class="main-view-container">
        <div class="section-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge-tag featured" style="font-size: 10px;">Authenticated Admin</span>
              <h2 class="section-title">Showroom Management Console</h2>
            </div>
            <p class="section-subtitle">Real-time inventory control, bookings registry, and customer operations</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-primary" id="btnAdminAddBike">
              <i class="fa-solid fa-plus"></i> Add New Bike
            </button>
            <button class="btn-secondary" id="btnResetDatabaseDefaults">
              <i class="fa-solid fa-rotate-left"></i> Reset DB
            </button>
            <button class="btn-table-action delete" id="btnAdminLogout" style="padding: 10px 14px;">
              <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>

        <!-- KPI Metrics Grid -->
        <div class="admin-stats-grid">
          <div class="stat-card">
            <div class="stat-icon"><i class="fa-solid fa-motorcycle"></i></div>
            <div class="stat-info">
              <h4>Total Bike Models</h4>
              <div class="stat-value">${bikes.length}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="color: var(--accent-orange); background: rgba(255,107,53,0.15);"><i class="fa-solid fa-file-invoice-dollar"></i></div>
            <div class="stat-info">
              <h4>Total Bookings</h4>
              <div class="stat-value">${bookings.length}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="color: var(--accent-green); background: rgba(16,185,129,0.15);"><i class="fa-solid fa-circle-check"></i></div>
            <div class="stat-info">
              <h4>Active Bookings</h4>
              <div class="stat-value">${pendingBookings}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="color: var(--accent-cyan); background: rgba(6,182,212,0.15);"><i class="fa-solid fa-calendar-check"></i></div>
            <div class="stat-info">
              <h4>Test Rides Scheduled</h4>
              <div class="stat-value">${testRides.length}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="color: var(--accent-gold); background: rgba(245,158,11,0.15);"><i class="fa-solid fa-coins"></i></div>
            <div class="stat-info">
              <h4>Demo Token Pool</h4>
              <div class="stat-value">${VelocityDB.formatINR(totalRevenueSimulated)}</div>
            </div>
          </div>
        </div>

        <!-- Inventory Table -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-family: var(--font-heading); font-size: 18px; color: #fff;">
              <i class="fa-solid fa-warehouse" style="color: var(--accent-orange);"></i> Bike Inventory Management (${bikes.length})
            </h3>
          </div>
          <div style="overflow-x: auto;">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Model & Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Engine</th>
                  <th>Mileage</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${bikes.map(b => `
                  <tr>
                    <td>
                      <img src="${b.image}" alt="${escapeHtml(b.model)}" style="width: 50px; height: 36px; object-fit: cover; border-radius: 4px;">
                    </td>
                    <td>
                      <strong>${escapeHtml(b.model)}</strong>
                      <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(b.brand)}</div>
                    </td>
                    <td>${escapeHtml(b.category)}</td>
                    <td style="color: var(--accent-orange); font-weight: 700;">${VelocityDB.formatINR(b.price)}</td>
                    <td>${escapeHtml(b.engine)}</td>
                    <td>${escapeHtml(b.mileage)}</td>
                    <td>
                      <button class="btn-table-action btn-toggle-stock" data-bike-id="${b.id}" style="color: ${b.inStock ? 'var(--accent-green)' : 'var(--text-muted)'};">
                        ${b.inStock ? '● In Stock' : '○ Out of Stock'}
                      </button>
                    </td>
                    <td>
                      <button class="btn-table-action btn-edit-bike" data-bike-id="${b.id}" title="Edit Bike"><i class="fa-solid fa-pen"></i></button>
                      <button class="btn-table-action delete btn-delete-bike" data-bike-id="${b.id}" title="Delete Bike"><i class="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bookings Management Table -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px;">
          <h3 style="font-family: var(--font-heading); font-size: 18px; color: #fff; margin-bottom: 14px;">
            <i class="fa-solid fa-list-check" style="color: var(--accent-red);"></i> Customer Bookings Registry (${bookings.length})
          </h3>
          <div style="overflow-x: auto;">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Bike Model</th>
                  <th>Token Paid</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${bookings.map(b => `
                  <tr>
                    <td><strong>${escapeHtml(b.bookingId)}</strong></td>
                    <td>
                      <div>${escapeHtml(b.customerName)}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">+91 ${escapeHtml(b.mobile)}</div>
                    </td>
                    <td>${escapeHtml(b.bikeModel)}</td>
                    <td style="color: var(--accent-green); font-weight: 700;">${VelocityDB.formatINR(b.bookingAmount)}</td>
                    <td>${b.bookingDate}</td>
                    <td>
                      <select class="custom-select admin-status-select" data-booking-id="${b.bookingId}" style="padding: 4px 8px; font-size: 11px;">
                        <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="Pending Verification" ${b.status === 'Pending Verification' ? 'selected' : ''}>Pending Verification</option>
                        <option value="Delivered" ${b.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button class="btn-table-action btn-admin-view-receipt" data-booking-id="${b.bookingId}" title="View Receipt">
                        <i class="fa-solid fa-receipt"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    UI.mainViewContainer.innerHTML = html;

    // Attach Admin Action Listeners
    const btnAdminAddBike = document.getElementById('btnAdminAddBike');
    if (btnAdminAddBike) {
      btnAdminAddBike.addEventListener('click', () => openBikeFormModal(null));
    }

    const btnResetDatabaseDefaults = document.getElementById('btnResetDatabaseDefaults');
    if (btnResetDatabaseDefaults) {
      btnResetDatabaseDefaults.addEventListener('click', () => {
        if (confirm('Reset entire Velocity database back to initial sample showroom records? This will refresh all 36 bikes and demo bookings.')) {
          VelocityDB.resetToDefaults();
          showToast('Database reset to defaults', 'success');
          renderBrandsSidebar();
          renderAdminView();
          updateHeaderCounters();
        }
      });
    }

    const btnAdminLogout = document.getElementById('btnAdminLogout');
    if (btnAdminLogout) {
      btnAdminLogout.addEventListener('click', () => {
        AppState.adminLoggedIn = false;
        showToast('Logged out of Admin Console', 'info');
        setView('home');
      });
    }

    // Toggle stock
    UI.mainViewContainer.querySelectorAll('.btn-toggle-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-bike-id');
        VelocityDB.toggleBikeAvailability(id);
        renderAdminView();
      });
    });

    // Edit bike
    UI.mainViewContainer.querySelectorAll('.btn-edit-bike').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-bike-id');
        const bike = VelocityDB.getBikeById(id);
        if (bike) openBikeFormModal(bike);
      });
    });

    // Delete bike
    UI.mainViewContainer.querySelectorAll('.btn-delete-bike').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-bike-id');
        if (confirm('Are you sure you want to delete this bike from the showroom inventory?')) {
          VelocityDB.deleteBike(id);
          showToast('Bike deleted from inventory', 'info');
          renderBrandsSidebar();
          renderAdminView();
        }
      });
    });

    // Booking Status Change
    UI.mainViewContainer.querySelectorAll('.admin-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.getAttribute('data-booking-id');
        const newStatus = e.target.value;
        VelocityDB.updateBookingStatus(id, newStatus);
        showToast(`Booking ${id} status updated to ${newStatus}`, 'success');
      });
    });

    // Admin view receipt
    UI.mainViewContainer.querySelectorAll('.btn-admin-view-receipt').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-booking-id');
        const b = VelocityDB.getBookingById(id);
        if (b) openReceiptModal(b);
      });
    });
  }

  // Admin Add/Edit Bike Modal
  function openBikeFormModal(bike) {
    AppState.editingBikeId = bike ? bike.id : null;
    const modalTitle = document.getElementById('bikeFormModalTitle');
    if (modalTitle) {
      modalTitle.textContent = bike ? `Edit Bike: ${bike.model}` : 'Add New Showroom Bike';
    }

    const form = document.getElementById('bikeAdminForm');
    if (!form) return;

    document.getElementById('bikeFormBrand').value = bike ? bike.brand : 'Royal Enfield';
    document.getElementById('bikeFormModel').value = bike ? bike.model : '';
    document.getElementById('bikeFormCategory').value = bike ? bike.category : 'Roadster';
    document.getElementById('bikeFormPrice').value = bike ? bike.price : '';
    document.getElementById('bikeFormEngine').value = bike ? bike.engine : '350 cc';
    document.getElementById('bikeFormMileage').value = bike ? bike.mileage : '35 kmpl';
    document.getElementById('bikeFormPower').value = bike ? bike.power : '20 bhp @ 6000 rpm';
    document.getElementById('bikeFormTransmission').value = bike ? bike.transmission : '5-Speed Manual';
    document.getElementById('bikeFormFuel').value = bike ? bike.fuelType : 'Petrol (E20 Ready)';
    document.getElementById('bikeFormImage').value = bike ? bike.image : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';
    document.getElementById('bikeFormDesc').value = bike ? bike.description : '';

    if (UI.bikeFormModal) UI.bikeFormModal.classList.add('active');
  }

  function handleBikeAdminSubmit(e) {
    e.preventDefault();
    const brand = document.getElementById('bikeFormBrand').value;
    const model = document.getElementById('bikeFormModel').value.trim();
    const category = document.getElementById('bikeFormCategory').value.trim();
    const price = parseFloat(document.getElementById('bikeFormPrice').value);
    const engine = document.getElementById('bikeFormEngine').value.trim();
    const mileage = document.getElementById('bikeFormMileage').value.trim();
    const power = document.getElementById('bikeFormPower').value.trim();
    const transmission = document.getElementById('bikeFormTransmission').value.trim();
    const fuel = document.getElementById('bikeFormFuel').value.trim();
    const image = document.getElementById('bikeFormImage').value.trim();
    const desc = document.getElementById('bikeFormDesc').value.trim();

    if (!model || isNaN(price)) {
      showToast('Please specify valid model name and price', 'error');
      return;
    }

    const engineVal = parseFloat(engine.replace(/[^\d.]/g, '')) || 300;
    const mileageVal = parseFloat(mileage.replace(/[^\d.]/g, '')) || 30;

    const bikePayload = {
      id: AppState.editingBikeId || ('bike-' + Date.now()),
      brand: brand,
      model: model,
      category: category || 'Sports',
      price: price,
      engine: engine,
      engineValue: engineVal,
      mileage: mileage,
      mileageValue: mileageVal,
      power: power,
      torque: '25 Nm @ 4000 rpm',
      transmission: transmission,
      fuelType: fuel,
      fuelCapacity: '13 Litres',
      kerbWeight: '170 kg',
      topSpeed: '130 km/h',
      brakes: 'Dual Channel ABS',
      colors: [
        { name: 'Metallic Black', hex: '#111111' },
        { name: 'Racing Red', hex: '#e63946' }
      ],
      image: image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      inStock: true,
      tagline: `${model} by ${brand}`,
      description: desc || `${model} engineered with advanced performance features.`
    };

    VelocityDB.saveBike(bikePayload);
    closeAllModals();
    showToast(`Bike ${model} saved successfully!`, 'success');

    renderBrandsSidebar();
    renderAdminView();
  }

  // --- 14. GENERAL UTILITIES & HELPERS ---
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  function showToast(message, type = 'info') {
    if (!UI.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-circle-check';
    else if (type === 'error') iconClass = 'fa-circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    UI.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderMainView() {
    renderHomePage();
  }

  // Export globally for frames or external invocations
  window.VelocityApp = {
    AppState: AppState,
    setView: setView,
    openBookingModal: openBookingModal,
    openTestRideModal: openTestRideModal,
    showToast: showToast
  };

})();
