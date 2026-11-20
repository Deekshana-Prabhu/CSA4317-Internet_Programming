/**
 * ============================================================================
 * WANDERLY – Explore Beyond Boundaries
 * Interactive Features & Responsive Behaviors
 * Pure Vanilla JavaScript (ES6+)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. STATE MANAGEMENT
     -------------------------------------------------------------------------- */
  const state = {
    favorites: new Set(),
    activeFilter: 'all',
    lightboxIndex: 0,
    galleryItems: []
  };

  // Safe localStorage helper for favorites
  const STORAGE_KEY = 'wanderly_saved_destinations';
  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          state.favorites = new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('LocalStorage not accessible, using in-memory state.', e);
    }
  };

  const saveFavorites = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state.favorites)));
    } catch (e) {
      console.warn('Unable to persist to localStorage.', e);
    }
  };

  /* --------------------------------------------------------------------------
     2. TOAST NOTIFICATION UTILITY
     -------------------------------------------------------------------------- */
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, type = 'info', duration = 3400) => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.setAttribute('role', 'status');

    // Icon based on type
    const icon = type === 'success' ? '✓ ' : type === 'error' ? '✕ ' : '✦ ';
    toast.textContent = `${icon}${message}`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, duration);
  };

  /* --------------------------------------------------------------------------
     3. HEADER & MOBILE NAVIGATION
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  // Sticky header with elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Open Mobile Drawer
  const openMobileMenu = () => {
    if (!mobileNavDrawer || !mobileOverlay) return;
    hamburgerBtn?.classList.add('active');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.classList.add('active');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileOverlay.classList.add('active');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  };

  // Close Mobile Drawer
  const closeMobileMenu = () => {
    if (!mobileNavDrawer || !mobileOverlay) return;
    hamburgerBtn?.classList.remove('active');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.classList.remove('active');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileOverlay.classList.remove('active');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburgerBtn?.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  drawerCloseBtn?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  // Close mobile drawer when any link is tapped
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer?.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  /* --------------------------------------------------------------------------
     4. ACTIVE NAVIGATION HIGHLIGHTING (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const trackedSections = document.querySelectorAll('section[id], header[id]');

  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (!id) return;

        // Update desktop links
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update mobile links
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  trackedSections.forEach(sec => navObserver.observe(sec));

  /* --------------------------------------------------------------------------
     5. HERO SEARCH INTERACTION
     -------------------------------------------------------------------------- */
  const heroSearchForm = document.getElementById('hero-search-form');
  const searchDestInput = document.getElementById('search-dest');
  const searchDateInput = document.getElementById('search-date');

  // Set minimum date to today
  if (searchDateInput) {
    const today = new Date().toISOString().split('T')[0];
    searchDateInput.min = today;
  }

  heroSearchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const destTerm = searchDestInput?.value.trim().toLowerCase() || '';

    // Scroll to popular destinations section
    const destSection = document.getElementById('destinations');
    if (destSection) {
      destSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (destTerm) {
      // Filter cards that match destination title or location
      filterDestinationsBySearch(destTerm);
      showToast(`Showing search results for "${searchDestInput.value.trim()}"`, 'info');
    } else {
      // Reset filter to all
      setActiveFilterButton('all');
      applyDestinationFilter('all');
      showToast('Exploring all handpicked destinations', 'info');
    }
  });

  /* --------------------------------------------------------------------------
     6. POPULAR DESTINATIONS: FILTERING & FAVORITES
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const destinationCards = document.querySelectorAll('.destination-card');
  const emptyState = document.getElementById('destinations-empty');
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  const favCounterBadge = document.getElementById('fav-counter-badge');
  const filterFavCount = document.getElementById('filter-fav-count');
  const headerFavBtn = document.getElementById('header-fav-btn');

  // Update Favorite Counts
  const updateFavoriteUI = () => {
    const count = state.favorites.size;
    if (favCounterBadge) favCounterBadge.textContent = count;
    if (filterFavCount) filterFavCount.textContent = count;

    // Update heart icons on cards
    destinationCards.forEach(card => {
      const cardId = card.getAttribute('data-id');
      const favBtn = card.querySelector('.fav-toggle-btn');
      if (!favBtn || !cardId) return;

      if (state.favorites.has(cardId)) {
        favBtn.classList.add('favorited');
        favBtn.setAttribute('aria-label', `Remove from favorites`);
      } else {
        favBtn.classList.remove('favorited');
        favBtn.setAttribute('aria-label', `Save to favorites`);
      }
    });
  };

  // Toggle favorite for an item
  const toggleFavorite = (cardId, destinationName) => {
    if (!cardId) return;

    if (state.favorites.has(cardId)) {
      state.favorites.delete(cardId);
      showToast(`Removed ${destinationName || 'destination'} from saved trips`);
    } else {
      state.favorites.add(cardId);
      showToast(`Saved ${destinationName || 'destination'} to your favorites!`, 'success');
    }

    saveFavorites();
    updateFavoriteUI();

    // If currently viewing favorites tab, re-filter
    if (state.activeFilter === 'favorites') {
      applyDestinationFilter('favorites');
    }
  };

  // Attach favorite listeners to destination cards
  destinationCards.forEach(card => {
    const favBtn = card.querySelector('.fav-toggle-btn');
    const cardId = card.getAttribute('data-id');
    const destName = card.getAttribute('data-name');

    favBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(cardId, destName);
    });
  });

  // Filter button active state helper
  const setActiveFilterButton = (filterKey) => {
    state.activeFilter = filterKey;
    filterButtons.forEach(btn => {
      if (btn.getAttribute('data-filter') === filterKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // Apply category filtering
  const applyDestinationFilter = (filterKey) => {
    let visibleCount = 0;

    destinationCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardId = card.getAttribute('data-id') || '';

      let shouldShow = false;

      if (filterKey === 'all') {
        shouldShow = true;
      } else if (filterKey === 'favorites') {
        shouldShow = state.favorites.has(cardId);
      } else {
        // checks if space-separated category includes filterKey
        const categories = cardCategory.toLowerCase().split(' ');
        shouldShow = categories.includes(filterKey.toLowerCase());
      }

      if (shouldShow) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
      }
    }
  };

  // Filter destinations by text search term
  const filterDestinationsBySearch = (term) => {
    let visibleCount = 0;
    state.activeFilter = 'search';

    // Clear active category buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));

    destinationCards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const desc = (card.querySelector('.card-desc')?.textContent || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();

      const matches = name.includes(term) || desc.includes(term) || category.includes(term);

      if (matches) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  // Filter buttons click handler
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterKey = btn.getAttribute('data-filter');
      if (!filterKey) return;

      setActiveFilterButton(filterKey);
      applyDestinationFilter(filterKey);
    });
  });

  // Reset filter button in empty state
  resetFilterBtn?.addEventListener('click', () => {
    setActiveFilterButton('all');
    applyDestinationFilter('all');
  });

  // Header Favorites Button click: filters directly to saved trips
  headerFavBtn?.addEventListener('click', () => {
    const destSection = document.getElementById('destinations');
    destSection?.scrollIntoView({ behavior: 'smooth' });
    setActiveFilterButton('favorites');
    applyDestinationFilter('favorites');

    if (state.favorites.size === 0) {
      showToast('You have not saved any destinations yet. Tap the heart icon on any card!', 'info');
    }
  });

  /* --------------------------------------------------------------------------
     7. "PLAN THIS TRIP" & EXPERIENCE CARD HOOKS
     -------------------------------------------------------------------------- */
  const plannerDestinationSelect = document.getElementById('planner-destination');
  const plannerSection = document.getElementById('planner');

  // Destination Card "Plan Trip" buttons
  const planTripBtns = document.querySelectorAll('.plan-trip-btn');
  planTripBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dest = btn.getAttribute('data-destination');
      if (plannerDestinationSelect && dest) {
        plannerDestinationSelect.value = dest;
      }
      plannerSection?.scrollIntoView({ behavior: 'smooth' });
      showToast(`Selected ${dest} in your travel planner!`, 'info');
    });
  });

  // Travel Experiences Cards "Explore Trips →" buttons
  const expLinks = document.querySelectorAll('.exp-link');
  expLinks.forEach(link => {
    link.addEventListener('click', () => {
      const filterKey = link.getAttribute('data-exp-filter');
      if (!filterKey) return;

      const destSection = document.getElementById('destinations');
      destSection?.scrollIntoView({ behavior: 'smooth' });

      setActiveFilterButton(filterKey);
      applyDestinationFilter(filterKey);
    });
  });

  // Footer destination links
  const footerDestLinks = document.querySelectorAll('.footer-dest-link');
  footerDestLinks.forEach(link => {
    link.addEventListener('click', () => {
      const destId = link.getAttribute('data-dest');
      const targetCard = document.querySelector(`.destination-card[data-id="${destId}"]`);

      setActiveFilterButton('all');
      applyDestinationFilter('all');

      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '2px solid var(--color-primary)';
        setTimeout(() => {
          targetCard.style.outline = '';
        }, 2200);
      }
    });
  });

  /* --------------------------------------------------------------------------
     8. IMAGE GALLERY & LIGHTBOX COMPONENT
     -------------------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxLocation = document.getElementById('lightbox-location');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxSpinner = document.getElementById('lightbox-spinner');

  // Collect gallery dataset
  state.galleryItems = Array.from(galleryItems).map(item => ({
    fullSrc: item.getAttribute('data-full') || item.querySelector('img')?.src,
    caption: item.getAttribute('data-caption') || '',
    location: item.getAttribute('data-location') || ''
  }));

  const showLightboxImage = (index) => {
    if (!state.galleryItems.length || index < 0 || index >= state.galleryItems.length) return;
    state.lightboxIndex = index;

    const data = state.galleryItems[index];

    if (lightboxSpinner) lightboxSpinner.style.display = 'block';
    if (lightboxImg) {
      lightboxImg.style.opacity = '0.3';
      lightboxImg.src = data.fullSrc;
      lightboxImg.alt = data.caption;

      lightboxImg.onload = () => {
        if (lightboxSpinner) lightboxSpinner.style.display = 'none';
        lightboxImg.style.opacity = '1';
      };
      lightboxImg.onerror = () => {
        if (lightboxSpinner) lightboxSpinner.style.display = 'none';
        lightboxImg.style.opacity = '1';
      };
    }

    if (lightboxLocation) lightboxLocation.textContent = data.location;
    if (lightboxTitle) lightboxTitle.textContent = data.caption;
    if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${state.galleryItems.length}`;
  };

  const openLightbox = (index) => {
    if (!lightboxModal) return;
    showLightboxImage(index);
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const nextLightboxImage = () => {
    const nextIdx = (state.lightboxIndex + 1) % state.galleryItems.length;
    showLightboxImage(nextIdx);
  };

  const prevLightboxImage = () => {
    const prevIdx = (state.lightboxIndex - 1 + state.galleryItems.length) % state.galleryItems.length;
    showLightboxImage(prevIdx);
  };

  // Gallery click handlers
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    });
  });

  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  lightboxNextBtn?.addEventListener('click', nextLightboxImage);
  lightboxPrevBtn?.addEventListener('click', prevLightboxImage);

  // Keyboard navigation for lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
  });

  /* --------------------------------------------------------------------------
     9. INTERACTIVE TRAVEL PLANNER FORM & SUMMARY GENERATOR
     -------------------------------------------------------------------------- */
  const plannerForm = document.getElementById('travel-planner-form');
  const departureInput = document.getElementById('planner-departure');
  const returnInput = document.getElementById('planner-return');
  const budgetRange = document.getElementById('planner-budget');
  const budgetDisplay = document.getElementById('budget-display');
  const plannerSummary = document.getElementById('planner-summary');
  const printSummaryBtn = document.getElementById('print-summary-btn');
  const resetSummaryBtn = document.getElementById('reset-summary-btn');

  // Set minimum departure date to today
  if (departureInput) {
    const today = new Date().toISOString().split('T')[0];
    departureInput.min = today;

    departureInput.addEventListener('change', () => {
      if (departureInput.value) {
        // Return date must be at least departure date or day after
        const deptDate = new Date(departureInput.value);
        deptDate.setDate(deptDate.getDate() + 1);
        const minReturn = deptDate.toISOString().split('T')[0];
        if (returnInput) {
          returnInput.min = minReturn;
          if (returnInput.value && returnInput.value <= departureInput.value) {
            returnInput.value = minReturn;
          }
        }
      }
    });
  }

  // Budget slider dynamic display
  budgetRange?.addEventListener('input', () => {
    const val = parseInt(budgetRange.value, 10);
    if (budgetDisplay) {
      budgetDisplay.textContent = `$${val.toLocaleString('en-US')}`;
    }
  });

  // Clear field error
  const clearError = (fieldId) => {
    const errEl = document.getElementById(`err-${fieldId}`);
    if (errEl) errEl.textContent = '';
  };

  const setError = (fieldId, msg) => {
    const errEl = document.getElementById(`err-${fieldId}`);
    if (errEl) errEl.textContent = msg;
  };

  // Form Validation & Submission
  plannerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error messages
    ['destination', 'departure', 'return', 'travelers', 'category'].forEach(clearError);

    // Validate Destination
    const dest = plannerDestinationSelect?.value;
    if (!dest) {
      setError('destination', 'Please select your desired travel sanctuary.');
      isValid = false;
    }

    // Validate Departure
    const dept = departureInput?.value;
    if (!dept) {
      setError('departure', 'Please specify your departure date.');
      isValid = false;
    }

    // Validate Return
    const ret = returnInput?.value;
    if (!ret) {
      setError('return', 'Please specify your return date.');
      isValid = false;
    } else if (dept && ret <= dept) {
      setError('return', 'Return date must be after departure date.');
      isValid = false;
    }

    if (!isValid) {
      showToast('Please fix highlighted errors in the travel form', 'error');
      return;
    }

    // Form is valid: Process values
    const travelersCount = parseInt(document.getElementById('planner-travelers')?.value || '2', 10);
    const category = document.getElementById('planner-category')?.value || '✨ Luxury Retreat';
    const budgetPerPerson = parseInt(budgetRange?.value || '2500', 10);
    const totalEst = budgetPerPerson * travelersCount;

    const accommodationRadio = document.querySelector('input[name="accommodation"]:checked');
    const accommodation = accommodationRadio ? accommodationRadio.value : '5-Star Luxury Resort';

    // Calculate Trip Duration
    const date1 = new Date(dept);
    const date2 = new Date(ret);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = Math.max(1, diffDays - 1);
    const durationText = `${diffDays} Days / ${nights} Nights`;

    // Format dates nicely
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const deptFormatted = date1.toLocaleDateString('en-US', options);
    const retFormatted = date2.toLocaleDateString('en-US', options);

    // Generate reference code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const refCode = `REF #WND-2026-${randomCode}`;

    // Populate Summary Card
    const summaryRef = document.getElementById('summary-ref');
    const summaryDest = document.getElementById('summary-destination');
    const summaryCat = document.getElementById('summary-category');
    const summaryDept = document.getElementById('summary-dept');
    const summaryRet = document.getElementById('summary-ret');
    const summaryDuration = document.getElementById('summary-duration');
    const summaryTravelers = document.getElementById('summary-travelers');
    const summaryStay = document.getElementById('summary-stay');
    const summaryBudget = document.getElementById('summary-total-budget');

    if (summaryRef) summaryRef.textContent = refCode;
    if (summaryDest) summaryDest.textContent = dest;
    if (summaryCat) summaryCat.textContent = category;
    if (summaryDept) summaryDept.textContent = deptFormatted;
    if (summaryRet) summaryRet.textContent = retFormatted;
    if (summaryDuration) summaryDuration.textContent = durationText;
    if (summaryTravelers) summaryTravelers.textContent = `${travelersCount} Traveler${travelersCount > 1 ? 's' : ''}`;
    if (summaryStay) summaryStay.textContent = accommodation;
    if (summaryBudget) summaryBudget.textContent = `$${totalEst.toLocaleString('en-US')} USD`;

    // Show summary card and scroll into view smoothly
    if (plannerSummary) {
      plannerSummary.style.display = 'block';
      plannerSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast('Your custom Wanderly travel blueprint is ready!', 'success');
  });

  // Print Summary Button
  printSummaryBtn?.addEventListener('click', () => {
    window.print();
  });

  // Reset Summary Button
  resetSummaryBtn?.addEventListener('click', () => {
    if (plannerSummary) plannerSummary.style.display = 'none';
    plannerForm?.reset();
    if (budgetDisplay) budgetDisplay.textContent = '$2,500';
    ['destination', 'departure', 'return', 'travelers', 'category'].forEach(clearError);
    plannerForm?.scrollIntoView({ behavior: 'smooth' });
    showToast('Travel planner reset. Ready for a new destination!');
  });

  /* --------------------------------------------------------------------------
     10. NEWSLETTER SUBSCRIPTION WITH VALIDATION
     -------------------------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterFeedback = document.getElementById('newsletter-feedback');
  const newsletterBtn = document.getElementById('newsletter-btn');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterEmail?.value.trim() || '';

    // Standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      if (newsletterFeedback) {
        newsletterFeedback.className = 'newsletter-feedback error';
        newsletterFeedback.textContent = 'Please enter a valid email address.';
      }
      return;
    }

    // Success simulation
    if (newsletterBtn) {
      newsletterBtn.disabled = true;
      newsletterBtn.textContent = 'Subscribed ✓';
    }

    if (newsletterFeedback) {
      newsletterFeedback.className = 'newsletter-feedback success';
      newsletterFeedback.textContent = `🎉 You are subscribed! We just sent your 2026 Wanderly Field Guide to ${email}.`;
    }

    showToast('Welcome to Wanderlust Weekly! $200 credit applied.', 'success');
  });

  /* --------------------------------------------------------------------------
     11. CONTACT FORM WITH VALIDATION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const contactName = document.getElementById('contact-name');
  const contactEmail = document.getElementById('contact-email');
  const contactMessage = document.getElementById('contact-message');
  const contactFeedback = document.getElementById('contact-feedback');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const cnameErr = document.getElementById('err-cname');
    const cemailErr = document.getElementById('err-cemail');
    const cmsgErr = document.getElementById('err-cmessage');

    if (cnameErr) cnameErr.textContent = '';
    if (cemailErr) cemailErr.textContent = '';
    if (cmsgErr) cmsgErr.textContent = '';

    if (!contactName?.value.trim()) {
      if (cnameErr) cnameErr.textContent = 'Please provide your full name.';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail?.value.trim() || !emailRegex.test(contactEmail.value.trim())) {
      if (cemailErr) cemailErr.textContent = 'Please enter a valid email address.';
      valid = false;
    }

    if (!contactMessage?.value.trim()) {
      if (cmsgErr) cmsgErr.textContent = 'Please include a message for our concierge.';
      valid = false;
    }

    if (!valid) return;

    if (contactSubmitBtn) {
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = 'Inquiry Dispatched ✓';
    }

    if (contactFeedback) {
      contactFeedback.className = 'contact-feedback success';
      contactFeedback.textContent = `Thank you, ${contactName.value.trim()}! Your dedicated concierge will connect with you within 2 hours.`;
    }

    showToast('Inquiry sent successfully to our 24/7 concierge!', 'success');
  });

  /* --------------------------------------------------------------------------
     12. SCROLL TO TOP FLOATING BUTTON
     -------------------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* --------------------------------------------------------------------------
     13. INITIALIZE APP
     -------------------------------------------------------------------------- */
  loadFavorites();
  updateFavoriteUI();
  applyDestinationFilter('all');

});
