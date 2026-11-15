/**
 * WANDERLUST – EXPLORE THE WORLD
 * Master JavaScript Controller
 * Complete interactive booking system, validations, dynamic cost calculations,
 * localStorage persistence, print handler, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Data Store & Catalog
  // --------------------------------------------------------------------------
  const packageCatalog = {
    'ooty-escape': {
      id: 'ooty-escape',
      name: 'Ooty Weekend Escape',
      destination: 'Ooty, Tamil Nadu',
      destinationKey: 'ooty',
      basePrice: 14999,
      durationDays: 3,
      durationNights: 2,
      durationText: '3 Days / 2 Nights',
      accommodation: 'Heritage Nilgiri Resort (4-Star)',
      transport: 'AC Tourist Coach / Private Cab',
      activities: 'Tea Garden Walk, Doddabetta Peak, Toy Train Ride, Ooty Lake Boating',
      type: 'hill'
    },
    'kerala-backwater': {
      id: 'kerala-backwater',
      name: 'Kerala Backwater Experience',
      destination: 'Alleppey & Kumarakom, Kerala',
      destinationKey: 'kerala',
      basePrice: 22500,
      durationDays: 5,
      durationNights: 4,
      durationText: '5 Days / 4 Nights',
      accommodation: 'Luxury Lake Resort & Private Houseboat',
      transport: 'Private AC Sedan & Motorized Houseboat',
      activities: 'Lagoon Cruise, Kathakali Dance, Spice Plantation Tour, Ayurvedic Spa',
      type: 'beach'
    },
    'goa-holiday': {
      id: 'goa-holiday',
      name: 'Goa Beach Holiday',
      destination: 'North & South Goa',
      destinationKey: 'goa',
      basePrice: 16800,
      durationDays: 4,
      durationNights: 3,
      durationText: '4 Days / 3 Nights',
      accommodation: 'Beachfront 4-Star Resort',
      transport: 'Airport Transfers & Private Sightseeing Cab',
      activities: 'Scuba Diving, Parasailing, Sunset Cruise, Fort Aguada Tour',
      type: 'beach'
    },
    'manali-adventure': {
      id: 'manali-adventure',
      name: 'Manali Adventure Trip',
      destination: 'Manali, Himachal Pradesh',
      destinationKey: 'manali',
      basePrice: 24999,
      durationDays: 6,
      durationNights: 5,
      durationText: '6 Days / 5 Nights',
      accommodation: 'Snow Valley Alpine Chalet',
      transport: 'Volvo Bus from Delhi & Private 4x4 Cab',
      activities: 'Solang Valley Paragliding, Rohtang Pass Snow Trek, River Rafting, Mall Road',
      type: 'hill'
    },
    'jaipur-heritage': {
      id: 'jaipur-heritage',
      name: 'Jaipur Heritage Tour',
      destination: 'Jaipur, Rajasthan',
      destinationKey: 'jaipur',
      basePrice: 18200,
      durationDays: 4,
      durationNights: 3,
      durationText: '4 Days / 3 Nights',
      accommodation: 'Haveli Heritage Palace',
      transport: 'Private AC Chauffeur Driven Cab',
      activities: 'Amber Fort Elephant Ride, City Palace Tour, Hawa Mahal, Chokhi Dhani Dinner',
      type: 'heritage'
    },
    'bali-vacation': {
      id: 'bali-vacation',
      name: 'Bali Tropical Vacation',
      destination: 'Ubud & Kuta, Bali',
      destinationKey: 'bali',
      basePrice: 48500,
      durationDays: 7,
      durationNights: 6,
      durationText: '7 Days / 6 Nights',
      accommodation: 'Private Pool Villa & Ocean Resort',
      transport: 'Private Luxury Van & Airport Transfers',
      activities: 'Tanah Lot Sunset, Tegallalang Rice Terrace, Uluwatu Fire Dance, Snorkeling',
      type: 'international'
    }
  };

  const destinationDetails = {
    'ooty': {
      title: 'Ooty (Udhagamandalam)',
      location: 'Nilgiris, Tamil Nadu, India',
      img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      fallbackImg: 'assets/images/ooty.svg',
      bestTime: 'October to June',
      startingPrice: '₹14,999',
      overview: 'Perched at 2,240 meters above sea level amidst the blue Nilgiri Mountains, Ooty is famed for its lush rolling tea estates, colonial-era architecture, vibrant botanical gardens, and the UNESCO World Heritage Nilgiri Mountain Railway toy train.',
      highlights: ['Nilgiri Mountain Railway', 'Botanical & Rose Gardens', 'Doddabetta Peak Viewpoint', 'Pykara Lake & Waterfalls', 'Tea Museum & Factory Tours'],
      packageKey: 'ooty-escape'
    },
    'kodaikanal': {
      title: 'Kodaikanal',
      location: 'Dindigul, Tamil Nadu, India',
      img: 'https://images.unsplash.com/photo-1626014303757-6564477318f7?auto=format&fit=crop&w=800&q=80',
      fallbackImg: 'assets/images/kodaikanal.svg',
      bestTime: 'September to May',
      startingPrice: '₹13,500',
      overview: 'Known as the "Princess of Hill Stations", Kodaikanal features misty cliffs, pine forest trails, cascading waterfalls, and the magnificent star-shaped Kodaikanal Lake surrounded by hills.',
      highlights: ['Kodaikanal Star Lake Boating', 'Pillar Rocks & Guna Caves', 'Coaker’s Walk Cloud View', 'Pine Forest Trails', 'Silver Cascade Waterfalls'],
      packageKey: 'ooty-escape'
    },
    'goa': {
      title: 'Goa',
      location: 'Western Coast, India',
      img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      fallbackImg: 'assets/images/goa.svg',
      bestTime: 'November to February',
      startingPrice: '₹16,800',
      overview: 'India’s premier beach haven combines golden tropical shores, emerald palm groves, centuries-old Portuguese cathedrals, thrilling water sports, and pulsating beach nightlife.',
      highlights: ['Baga & Calangute Beaches', 'Fort Aguada & Lighthouse', 'Dudhsagar Waterfalls Trek', 'Mandovi River Sunset Cruise', 'Old Goa Basilica of Bom Jesus'],
      packageKey: 'goa-holiday'
    },
    'manali': {
      title: 'Manali',
      location: 'Kullu Valley, Himachal Pradesh, India',
      img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
      fallbackImg: 'assets/images/manali.svg',
      bestTime: 'October to June',
      startingPrice: '₹24,999',
      overview: 'Nestled on the banks of the Beas River, Manali offers breathtaking vistas of snow-capped Himalayan ranges, alpine meadows, adrenaline-pumping ski slopes, and ancient pine forests.',
      highlights: ['Solang Valley Paragliding & Zorbing', 'Rohtang Pass Snow Excursion', 'Hadimba Devi Ancient Temple', 'Jogini Waterfall Hike', 'Old Manali Bohemian Cafes'],
      packageKey: 'manali-adventure'
    },
    'kerala': {
      title: 'Kerala',
      location: 'God’s Own Country, India',
      img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      fallbackImg: 'assets/images/kerala.svg',
      bestTime: 'September to March',
      startingPrice: '₹22,500',
      overview: 'A tropical paradise celebrated for its tranquil backwaters, traditional Kettuvallam houseboats, fragrant spice gardens, tea hills of Munnar, and authentic Ayurvedic therapies.',
      highlights: ['Alleppey Backwater Houseboat Stay', 'Munnar Tea Plantation Estates', 'Periyar Wildlife Sanctuary', 'Athirappilly Waterfalls', 'Traditional Kathakali Performance'],
      packageKey: 'kerala-backwater'
    },
    'jaipur': {
      title: 'Jaipur',
      location: 'The Pink City, Rajasthan, India',
      img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      fallbackImg: 'assets/images/jaipur.svg',
      bestTime: 'October to March',
      startingPrice: '₹18,200',
      overview: 'The royal capital of Rajasthan, steeped in Rajput bravery and splendor, showcases honeycomb pink stone palaces, formidable hilltop fortresses, and bustling artisan bazaars.',
      highlights: ['Amber Palace & Jaigarh Fort', 'Hawa Mahal (Palace of Winds)', 'City Palace & Jantar Mantar Observatory', 'Nahargarh Sunset Point', 'Authentic Rajasthani Thali Dining'],
      packageKey: 'jaipur-heritage'
    },
    'bali': {
      title: 'Bali',
      location: 'Island of the Gods, Indonesia',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      fallbackImg: 'assets/images/bali.svg',
      bestTime: 'April to October',
      startingPrice: '₹48,500',
      overview: 'A mesmerizing archipelago jewel that seamlessly blends sacred sea temples, lush emerald rice terraces, world-class surf breaks, cultural artisan villages, and luxurious cliffside retreats.',
      highlights: ['Tanah Lot & Uluwatu Cliff Temples', 'Tegallalang Cascading Rice Terraces', 'Mount Batur Sunrise Trek', 'Nusa Penida Island Tour', 'Traditional Kecak Fire Dance'],
      packageKey: 'bali-vacation'
    },
    'maldives': {
      title: 'Maldives',
      location: 'Indian Ocean Atolls',
      img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      fallbackImg: 'assets/images/maldives.svg',
      bestTime: 'November to April',
      startingPrice: '₹62,000',
      overview: 'The ultimate tropical sanctuary boasting crystalline turquoise lagoons, vibrant coral atolls, private overwater villas, and world-class marine scuba adventures.',
      highlights: ['Overwater Bungalow Experience', 'Whale Shark & Manta Ray Snorkeling', 'Sunset Dolphin Cruises', 'Submarine & Scuba Diving', 'Private Sandbank Dining'],
      packageKey: 'bali-vacation'
    }
  };

  const attractionsByDest = {
    'ooty': [
      { name: 'Doddabetta Peak', desc: 'Highest point in the Nilgiri Mountains (2,637 m) offering panoramic vistas.' },
      { name: 'Ooty Botanical Gardens', desc: 'Lush 55-acre garden established in 1848 with rare exotic flora.' },
      { name: 'Nilgiri Mountain Railway', desc: 'Heritage steam toy train journey through tunnels and tea valleys.' },
      { name: 'Pykara Falls & Lake', desc: 'Scenic waterfalls and speedboating surrounded by pine forests.' }
    ],
    'goa': [
      { name: 'Baga & Calangute Beaches', desc: 'Famous coastline for parasailing, beach shacks, and watersports.' },
      { name: 'Fort Aguada & Lighthouse', desc: '17th-century Portuguese fortress overlooking the Arabian Sea.' },
      { name: 'Dudhsagar Waterfalls', desc: 'Spectacular four-tiered waterfall cascading down 310 meters.' },
      { name: 'Basilica of Bom Jesus', desc: 'UNESCO World Heritage church containing the sacred relics of St. Francis Xavier.' }
    ],
    'kerala': [
      { name: 'Alleppey Backwaters', desc: 'Network of tranquil canals, lagoons, and traditional houseboat cruises.' },
      { name: 'Athirappilly Waterfalls', desc: 'The "Niagara of India", thunderous falls cascading through lush rainforest.' },
      { name: 'Eravikulam National Park', desc: 'Sanctuary of the endangered Nilgiri Tahr and rolling tea hills of Munnar.' },
      { name: 'Periyar Lake & Reserve', desc: 'Boating safari amidst elephants, tigers, and exotic bird sanctuaries.' }
    ],
    'manali': [
      { name: 'Solang Valley', desc: 'Adventure central for paragliding, zorbing, and winter snow skiing.' },
      { name: 'Rohtang Pass', desc: 'High mountain pass (3,978 m) connecting Kullu and Spiti valleys with year-round snow.' },
      { name: 'Hadimba Devi Temple', desc: 'Historic wooden pagoda-style temple surrounded by majestic cedar forest.' },
      { name: 'Jogini Waterfalls', desc: 'Picturesque trekking route through apple orchards and pine cliffs.' }
    ],
    'jaipur': [
      { name: 'Amber Palace & Fort', desc: 'Majestic hilltop fort featuring the glittering Sheesh Mahal (Mirror Palace).' },
      { name: 'Hawa Mahal', desc: 'Iconic 5-storey pink sandstone facade with 953 ornate latticed jharokhas.' },
      { name: 'City Palace & Museum', desc: 'Royal residence blending Rajput, Mughal, and European architecture.' },
      { name: 'Nahargarh Fort', desc: 'Defensive ridge fortress with sunset vistas overlooking the Pink City.' }
    ],
    'bali': [
      { name: 'Tanah Lot Temple', desc: 'Ancient Hindu pilgrimage temple perched upon a dramatic ocean rock.' },
      { name: 'Tegallalang Rice Terraces', desc: 'Famous stepped valley irrigation system surrounded by tropical palms.' },
      { name: 'Uluwatu Sunset Temple', desc: 'Cliffside sea temple accompanied by nightly cliff-edge Kecak fire dance.' },
      { name: 'Sacred Monkey Forest', desc: 'Sanctuary in Ubud home to hundreds of Balinese long-tailed macaques.' }
    ]
  };

  // --------------------------------------------------------------------------
  // DOM Elements
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Stats Counters
  const statNumbers = document.querySelectorAll('.stat-number');

  // Destination Search & Filter
  const destinationSearchInput = document.getElementById('dest-search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const destinationCards = document.querySelectorAll('.destination-card');

  // Hero Quick Search
  const heroSearchForm = document.getElementById('hero-search-form');
  const heroWhereInput = document.getElementById('hero-search-where');
  const heroTypeSelect = document.getElementById('hero-search-type');

  // Package Filter
  const packagePriceSelect = document.getElementById('package-price-filter');
  const packageCards = document.querySelectorAll('.package-card');

  // Booking Form & Inputs
  const bookingForm = document.getElementById('travel-booking-form');
  const inputFullName = document.getElementById('full-name');
  const inputEmail = document.getElementById('email-address');
  const inputPhone = document.getElementById('phone-number');
  const selectDestination = document.getElementById('select-destination');
  const selectPackage = document.getElementById('select-package');
  const inputStartDate = document.getElementById('travel-start-date');
  const inputEndDate = document.getElementById('travel-end-date');
  const inputAdults = document.getElementById('num-adults');
  const inputChildren = document.getElementById('num-children');
  const hotelRadioInputs = document.querySelectorAll('input[name="hotel_preference"]');
  const transportRadioInputs = document.querySelectorAll('input[name="transport_preference"]');
  const inputPromoCode = document.getElementById('promo-code-input');
  const btnApplyPromo = document.getElementById('btn-apply-promo');
  const inputSpecialReq = document.getElementById('special-requirements');
  const checkTerms = document.getElementById('terms-checkbox');

  // Booking Calculator Summary Elements
  const summaryPackageName = document.getElementById('calc-package-name');
  const summaryBaseCost = document.getElementById('calc-base-cost');
  const summaryTravellersCount = document.getElementById('calc-travellers-count');
  const summaryHotelUpgrade = document.getElementById('calc-hotel-upgrade');
  const summaryTransportAddon = document.getElementById('calc-transport-addon');
  const summaryDiscountRow = document.getElementById('calc-discount-row');
  const summaryDiscountAmount = document.getElementById('calc-discount-amount');
  const summaryTotalAmount = document.getElementById('calc-total-amount');

  // Booking Confirmation Section
  const confirmationSection = document.getElementById('confirmation-section');
  const slipBookingId = document.getElementById('slip-booking-id');
  const slipDateIssued = document.getElementById('slip-date-issued');
  const slipCustomerName = document.getElementById('slip-customer-name');
  const slipContactDetails = document.getElementById('slip-contact-details');
  const slipDestination = document.getElementById('slip-destination');
  const slipSelectedPackage = document.getElementById('slip-selected-package');
  const slipTravelDates = document.getElementById('slip-travel-dates');
  const slipTravellers = document.getElementById('slip-travellers');
  const slipHotelPref = document.getElementById('slip-hotel-pref');
  const slipTransportPref = document.getElementById('slip-transport-pref');
  const slipTotalAmount = document.getElementById('slip-total-amount');
  const slipStatus = document.getElementById('slip-status');
  const btnPrintConfirmation = document.getElementById('btn-print-confirmation');

  // Saved Booking Notice
  const savedBookingNotice = document.getElementById('saved-booking-notice');
  const savedBookingIdSpan = document.getElementById('saved-booking-id-span');
  const btnLoadSavedBooking = document.getElementById('btn-load-saved-booking');

  // Modal
  const destModal = document.getElementById('destination-modal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalBody = document.getElementById('modal-body-content');

  // Toast
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  // State
  let activePromoDiscount = 0; // percentage or flat amount
  let activePromoType = 'none'; // 'percent' or 'flat'
  let activePromoCode = '';

  // --------------------------------------------------------------------------
  // 1. Navigation Sticky & Smooth Scroll Spy
  // --------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy: highlight active nav item
    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id], footer[id]');
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu on clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 2. Animated Statistics Counters
  // --------------------------------------------------------------------------
  let countersAnimated = false;
  const statsSection = document.querySelector('.stats-section');

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.innerHTML = `${currentVal.toLocaleString()}<span class="plus">+</span>`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.innerHTML = `${target.toLocaleString()}<span class="plus">+</span>`;
        }
      }
      requestAnimationFrame(update);
    });
  }

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 3. Destination Filter & Search
  // --------------------------------------------------------------------------
  function filterDestinations() {
    const searchQuery = (destinationSearchInput ? destinationSearchInput.value : '').toLowerCase().trim();
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const selectedCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    destinationCards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const location = (card.getAttribute('data-location') || '').toLowerCase();
      const category = card.getAttribute('data-category') || '';

      const matchesSearch = !searchQuery || name.includes(searchQuery) || location.includes(searchQuery);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  }

  if (destinationSearchInput) {
    destinationSearchInput.addEventListener('input', filterDestinations);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterDestinations();
    });
  });

  // Hero Quick Search integration
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const whereVal = heroWhereInput.value.trim();
      const typeVal = heroTypeSelect.value;

      if (destinationSearchInput && whereVal) {
        destinationSearchInput.value = whereVal;
      }

      if (typeVal && typeVal !== 'all') {
        filterButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === typeVal) {
            btn.click();
          }
        });
      } else {
        filterDestinations();
      }

      const destSection = document.getElementById('destinations');
      if (destSection) {
        destSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Explore Destination Modal
  // --------------------------------------------------------------------------
  document.querySelectorAll('.btn-explore-dest').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const destKey = btn.getAttribute('data-dest');
      const data = destinationDetails[destKey];
      if (!data) return;

      modalBody.innerHTML = `
        <div class="modal-dest-content">
          <div style="position: relative; height: 260px; border-radius: 16px; overflow: hidden; margin-bottom: 1.5rem;">
            <img src="${data.img}" onerror="this.onerror=null; this.src='${data.fallbackImg}'" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; bottom: 12px; left: 16px; background: rgba(12,36,97,0.85); color: #fff; padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem;">
              Starting from ${data.startingPrice}
            </div>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--color-ocean-deep); margin-bottom: 0.25rem;">
            ${data.title}
          </h3>
          <p style="color: var(--color-tropical-green); font-weight: 700; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1rem;">
            <i class="fas fa-map-marker-alt"></i> ${data.location}
          </p>
          <div style="background: var(--color-sky-subtle); padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1.25rem; font-size: 0.9rem; color: var(--color-ocean-primary); font-weight: 600;">
            <i class="fas fa-calendar-alt"></i> Best Time to Visit: ${data.bestTime}
          </div>
          <p style="color: var(--color-gray-600); line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.95rem;">
            ${data.overview}
          </p>
          <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--color-ocean-deep); margin-bottom: 0.75rem;">
            Top Attractions & Highlights:
          </h4>
          <ul style="list-style: none; padding-left: 0; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
            ${data.highlights.map(h => `<li style="font-size: 0.92rem; display: flex; align-items: center; gap: 0.5rem; color: var(--color-gray-800);"><i class="fas fa-check-circle" style="color: var(--color-tropical-green);"></i> ${h}</li>`).join('')}
          </ul>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <button class="btn-primary btn-modal-book" data-package="${data.packageKey}" data-dest="${destKey}" style="flex: 2; justify-content: center;">
              <i class="fas fa-calendar-check"></i> Book Trip to ${data.title}
            </button>
            <button class="btn-outline modal-close-action" style="flex: 1; justify-content: center; color: var(--color-ocean-deep); border-color: var(--color-gray-300);">
              Close
            </button>
          </div>
        </div>
      `;

      destModal.classList.add('active');

      // Bind modal inner buttons
      modalBody.querySelector('.btn-modal-book').addEventListener('click', (ev) => {
        const pkg = ev.currentTarget.getAttribute('data-package');
        const dest = ev.currentTarget.getAttribute('data-dest');
        destModal.classList.remove('active');
        selectDestinationAndPackage(dest, pkg);
      });

      modalBody.querySelector('.modal-close-action').addEventListener('click', () => {
        destModal.classList.remove('active');
      });
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      destModal.classList.remove('active');
    });
  }

  if (destModal) {
    destModal.addEventListener('click', (e) => {
      if (e.target === destModal) {
        destModal.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Package Filter
  // --------------------------------------------------------------------------
  if (packagePriceSelect) {
    packagePriceSelect.addEventListener('change', () => {
      const selected = packagePriceSelect.value;
      packageCards.forEach(card => {
        const price = parseInt(card.getAttribute('data-price'), 10);
        let show = true;
        if (selected === 'budget') {
          show = price < 18000;
        } else if (selected === 'premium') {
          show = price >= 18000 && price <= 30000;
        } else if (selected === 'luxury') {
          show = price > 30000;
        }
        card.style.display = show ? 'flex' : 'none';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Direct Package Booking Handler ("Book Package" buttons)
  // --------------------------------------------------------------------------
  function selectDestinationAndPackage(destKey, pkgKey) {
    if (selectDestination && destKey) {
      selectDestination.value = destKey;
    }
    if (selectPackage && pkgKey) {
      selectPackage.value = pkgKey;
    }
    calculateBookingEstimate();
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Selected: ${packageCatalog[pkgKey] ? packageCatalog[pkgKey].name : 'Package'}`);
  }

  document.querySelectorAll('.btn-book-package').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkgId = btn.getAttribute('data-package');
      const pkgData = packageCatalog[pkgId];
      if (pkgData) {
        selectDestinationAndPackage(pkgData.destinationKey, pkgId);
      }
    });
  });

  // Hotel "View Hotel" button to pre-select
  document.querySelectorAll('.btn-view-hotel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dest = btn.getAttribute('data-dest');
      const hotelPref = btn.getAttribute('data-hotel-pref') || 'deluxe';

      if (selectDestination && dest) {
        selectDestination.value = dest;
        // Find matching package
        for (const [key, pkg] of Object.entries(packageCatalog)) {
          if (pkg.destinationKey === dest) {
            selectPackage.value = key;
            break;
          }
        }
      }

      hotelRadioInputs.forEach(r => {
        if (r.value === hotelPref) r.checked = true;
      });

      calculateBookingEstimate();
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
      showToast('Hotel selection applied to booking planner!');
    });
  });

  // --------------------------------------------------------------------------
  // 7. Tourist Attractions Tabs Dynamic Swapping
  // --------------------------------------------------------------------------
  const attractionTabs = document.querySelectorAll('.tab-pill');
  const attractionsListContainer = document.getElementById('dynamic-attractions-list');

  function renderAttractions(destKey) {
    if (!attractionsListContainer) return;
    const items = attractionsByDest[destKey] || attractionsByDest['ooty'];
    attractionsListContainer.innerHTML = items.map((item, idx) => `
      <li class="attraction-item">
        <span class="attraction-num">${idx + 1}</span>
        <div class="attraction-details">
          <div class="attraction-name">${item.name}</div>
          <div class="attraction-desc">${item.desc}</div>
        </div>
      </li>
    `).join('');
  }

  attractionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      attractionTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const dest = tab.getAttribute('data-dest');
      renderAttractions(dest);
    });
  });

  // Initial render
  renderAttractions('ooty');

  // --------------------------------------------------------------------------
  // 8. Special Offers & Promo Codes
  // --------------------------------------------------------------------------
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Promo code "${code}" copied to clipboard!`);
        }).catch(() => {
          showToast(`Promo code: ${code}`);
        });
      } else {
        showToast(`Promo code: ${code}`);
      }

      if (inputPromoCode) {
        inputPromoCode.value = code;
        applyPromoCode(code);
      }
    });
  });

  document.querySelectorAll('.btn-claim-offer').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkg = btn.getAttribute('data-package');
      const code = btn.getAttribute('data-code');

      if (pkg && packageCatalog[pkg]) {
        selectDestinationAndPackage(packageCatalog[pkg].destinationKey, pkg);
      }
      if (code && inputPromoCode) {
        inputPromoCode.value = code;
        applyPromoCode(code);
      }
      const bookingSec = document.getElementById('booking');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  function applyPromoCode(rawCode) {
    const code = (rawCode || (inputPromoCode ? inputPromoCode.value : '')).trim().toUpperCase();
    if (!code) return;

    if (code === 'SUMMER30') {
      activePromoDiscount = 30;
      activePromoType = 'percent';
      activePromoCode = code;
      showToast('Special Summer Offer: 30% Discount Applied!');
    } else if (code === 'EARLYBIRD') {
      activePromoDiscount = 5000;
      activePromoType = 'flat';
      activePromoCode = code;
      showToast('Early Bird Discount: Flat ₹5,000 OFF Applied!');
    } else if (code === 'HONEYMOON') {
      activePromoDiscount = 20;
      activePromoType = 'percent';
      activePromoCode = code;
      showToast('Honeymoon Offer: 20% Discount Applied!');
    } else if (code === 'FAMILYFUN') {
      activePromoDiscount = 15;
      activePromoType = 'percent';
      activePromoCode = code;
      showToast('Family Package: 15% Discount Applied!');
    } else if (code === 'ADVENTURE20') {
      activePromoDiscount = 20;
      activePromoType = 'percent';
      activePromoCode = code;
      showToast('Adventure Travel: 20% Discount Applied!');
    } else {
      showToast('Invalid promo code. Please check and try again.');
      activePromoDiscount = 0;
      activePromoType = 'none';
      activePromoCode = '';
    }
    calculateBookingEstimate();
  }

  if (btnApplyPromo) {
    btnApplyPromo.addEventListener('click', () => {
      applyPromoCode();
    });
  }

  // --------------------------------------------------------------------------
  // 9. Dynamic Booking Cost Calculator
  // --------------------------------------------------------------------------
  // Hotel Upgrades (per person)
  const hotelCosts = {
    'standard': 0,
    'deluxe': 2500,
    'luxury': 6000
  };

  // Transport Add-ons (per person)
  const transportCosts = {
    'bus': 0,
    'train': 1200,
    'flight': 6500,
    'cab': 3000
  };

  function getSelectedHotel() {
    let selected = 'deluxe';
    hotelRadioInputs.forEach(r => {
      if (r.checked) selected = r.value;
    });
    return selected;
  }

  function getSelectedTransport() {
    let selected = 'cab';
    transportRadioInputs.forEach(r => {
      if (r.checked) selected = r.value;
    });
    return selected;
  }

  function calculateBookingEstimate() {
    const pkgId = selectPackage ? selectPackage.value : '';
    const pkg = packageCatalog[pkgId] || packageCatalog['ooty-escape'];

    const adults = Math.max(1, parseInt(inputAdults ? inputAdults.value : 1, 10) || 1);
    const children = Math.max(0, parseInt(inputChildren ? inputChildren.value : 0, 10) || 0);

    const basePkgRate = pkg.basePrice;
    // Children pay 50% base fare
    const baseAdultTotal = basePkgRate * adults;
    const baseChildTotal = (basePkgRate * 0.5) * children;
    const totalBase = baseAdultTotal + baseChildTotal;

    const totalTravellers = adults + children;

    const hotelChoice = getSelectedHotel();
    const hotelUpgradePerPerson = hotelCosts[hotelChoice] || 0;
    const totalHotelUpgrade = hotelUpgradePerPerson * totalTravellers;

    const transportChoice = getSelectedTransport();
    const transportAddonPerPerson = transportCosts[transportChoice] || 0;
    const totalTransport = transportAddonPerPerson * totalTravellers;

    const subTotal = totalBase + totalHotelUpgrade + totalTransport;

    // Calculate Discount
    let discount = 0;
    if (activePromoType === 'percent') {
      discount = Math.round(subTotal * (activePromoDiscount / 100));
    } else if (activePromoType === 'flat') {
      discount = activePromoDiscount;
    }

    const estimatedTotal = Math.max(0, subTotal - discount);

    // Update Summary Sidebar in real-time
    if (summaryPackageName) summaryPackageName.textContent = pkg.name;
    if (summaryBaseCost) summaryBaseCost.textContent = `₹${totalBase.toLocaleString('en-IN')}`;
    if (summaryTravellersCount) {
      summaryTravellersCount.textContent = `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`;
    }
    if (summaryHotelUpgrade) summaryHotelUpgrade.textContent = `+ ₹${totalHotelUpgrade.toLocaleString('en-IN')}`;
    if (summaryTransportAddon) summaryTransportAddon.textContent = `+ ₹${totalTransport.toLocaleString('en-IN')}`;

    if (summaryDiscountRow && summaryDiscountAmount) {
      if (discount > 0) {
        summaryDiscountRow.style.display = 'flex';
        summaryDiscountAmount.textContent = `- ₹${discount.toLocaleString('en-IN')} (${activePromoCode})`;
      } else {
        summaryDiscountRow.style.display = 'none';
      }
    }

    if (summaryTotalAmount) {
      summaryTotalAmount.textContent = `₹${estimatedTotal.toLocaleString('en-IN')}`;
    }

    return {
      pkg,
      adults,
      children,
      totalTravellers,
      hotelChoice,
      transportChoice,
      totalBase,
      totalHotelUpgrade,
      totalTransport,
      discount,
      estimatedTotal
    };
  }

  // Set min dates for start and end dates
  const today = new Date().toISOString().split('T')[0];
  if (inputStartDate) {
    inputStartDate.min = today;
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    inputStartDate.value = tomorrow.toISOString().split('T')[0];
  }

  if (inputEndDate && inputStartDate) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    inputEndDate.min = inputStartDate.value || today;
    inputEndDate.value = nextWeek.toISOString().split('T')[0];
  }

  // Listeners for live price updates
  if (selectDestination) {
    selectDestination.addEventListener('change', () => {
      const dest = selectDestination.value;
      // Auto pick first matching package
      for (const [key, pkg] of Object.entries(packageCatalog)) {
        if (pkg.destinationKey === dest) {
          selectPackage.value = key;
          break;
        }
      }
      calculateBookingEstimate();
    });
  }

  if (selectPackage) selectPackage.addEventListener('change', calculateBookingEstimate);
  if (inputAdults) inputAdults.addEventListener('input', calculateBookingEstimate);
  if (inputChildren) inputChildren.addEventListener('input', calculateBookingEstimate);

  hotelRadioInputs.forEach(r => r.addEventListener('change', calculateBookingEstimate));
  transportRadioInputs.forEach(r => r.addEventListener('change', calculateBookingEstimate));

  if (inputStartDate) {
    inputStartDate.addEventListener('change', () => {
      if (inputEndDate) {
        inputEndDate.min = inputStartDate.value;
        if (inputEndDate.value && inputEndDate.value <= inputStartDate.value) {
          const nextDay = new Date(inputStartDate.value);
          nextDay.setDate(nextDay.getDate() + 3);
          inputEndDate.value = nextDay.toISOString().split('T')[0];
        }
      }
    });
  }

  // Run initial calculation
  calculateBookingEstimate();

  // --------------------------------------------------------------------------
  // 10. Travel Booking Form Validation & Submission
  // --------------------------------------------------------------------------
  function validateBookingForm() {
    let isValid = true;

    // Full name
    if (!inputFullName.value || inputFullName.value.trim().length < 3) {
      inputFullName.classList.add('is-invalid');
      isValid = false;
    } else {
      inputFullName.classList.remove('is-invalid');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputEmail.value || !emailRegex.test(inputEmail.value.trim())) {
      inputEmail.classList.add('is-invalid');
      isValid = false;
    } else {
      inputEmail.classList.remove('is-invalid');
    }

    // Phone
    const phoneRegex = /^[0-9+\s\-()]{10,15}$/;
    if (!inputPhone.value || !phoneRegex.test(inputPhone.value.trim())) {
      inputPhone.classList.add('is-invalid');
      isValid = false;
    } else {
      inputPhone.classList.remove('is-invalid');
    }

    // Destination & Package
    if (!selectDestination.value) {
      selectDestination.classList.add('is-invalid');
      isValid = false;
    } else {
      selectDestination.classList.remove('is-invalid');
    }

    if (!selectPackage.value) {
      selectPackage.classList.add('is-invalid');
      isValid = false;
    } else {
      selectPackage.classList.remove('is-invalid');
    }

    // Dates
    if (!inputStartDate.value) {
      inputStartDate.classList.add('is-invalid');
      isValid = false;
    } else {
      inputStartDate.classList.remove('is-invalid');
    }

    if (!inputEndDate.value || (inputStartDate.value && inputEndDate.value <= inputStartDate.value)) {
      inputEndDate.classList.add('is-invalid');
      isValid = false;
    } else {
      inputEndDate.classList.remove('is-invalid');
    }

    // Adults
    const adults = parseInt(inputAdults.value, 10);
    if (isNaN(adults) || adults < 1) {
      inputAdults.classList.add('is-invalid');
      isValid = false;
    } else {
      inputAdults.classList.remove('is-invalid');
    }

    // Terms
    if (!checkTerms.checked) {
      checkTerms.classList.add('is-invalid');
      isValid = false;
    } else {
      checkTerms.classList.remove('is-invalid');
    }

    return isValid;
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateBookingForm()) {
        showToast('Please correct the highlighted fields before submitting.');
        return;
      }

      // Calculate final pricing
      const calcData = calculateBookingEstimate();

      // Generate Unique Booking ID
      const timestamp = new Date().getFullYear();
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const bookingId = `WND-${timestamp}-${randomDigits}`;

      const bookingRecord = {
        bookingId: bookingId,
        dateIssued: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        customerName: inputFullName.value.trim(),
        email: inputEmail.value.trim(),
        phone: inputPhone.value.trim(),
        destination: selectDestination.options[selectDestination.selectedIndex].text,
        packageId: calcData.pkg.id,
        packageName: calcData.pkg.name,
        startDate: inputStartDate.value,
        endDate: inputEndDate.value,
        adults: calcData.adults,
        children: calcData.children,
        totalTravellers: calcData.totalTravellers,
        hotelPreference: calcData.hotelChoice.toUpperCase(),
        transportPreference: calcData.transportChoice.toUpperCase(),
        specialRequirements: inputSpecialReq ? inputSpecialReq.value.trim() : '',
        totalEstimatedAmount: `₹${calcData.estimatedTotal.toLocaleString('en-IN')}`,
        status: 'CONFIRMED & VERIFIED'
      };

      // Save to localStorage
      try {
        localStorage.setItem('wanderlust_latest_booking', JSON.stringify(bookingRecord));
        // Keep history as well
        const allBookings = JSON.parse(localStorage.getItem('wanderlust_all_bookings') || '[]');
        allBookings.unshift(bookingRecord);
        localStorage.setItem('wanderlust_all_bookings', JSON.stringify(allBookings.slice(0, 10)));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      // Display Booking Confirmation Slip
      renderBookingConfirmation(bookingRecord);

      // Scroll smoothly to confirmation section
      confirmationSection.classList.add('active');
      confirmationSection.scrollIntoView({ behavior: 'smooth' });

      showToast(`Booking Successful! Your ID is ${bookingId}`);
    });

    // Reset button
    const btnReset = document.querySelector('.btn-reset-form');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        setTimeout(calculateBookingEstimate, 50);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 11. Render Booking Confirmation Slip
  // --------------------------------------------------------------------------
  function renderBookingConfirmation(data) {
    if (!confirmationSection) return;

    if (slipBookingId) slipBookingId.textContent = data.bookingId;
    if (slipDateIssued) slipDateIssued.textContent = `Issued: ${data.dateIssued}`;
    if (slipCustomerName) slipCustomerName.textContent = data.customerName;
    if (slipContactDetails) slipContactDetails.textContent = `${data.email} | ${data.phone}`;
    if (slipDestination) slipDestination.textContent = data.destination;
    if (slipSelectedPackage) slipSelectedPackage.textContent = data.packageName;

    // Format dates nicely
    const startFormatted = new Date(data.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const endFormatted = new Date(data.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (slipTravelDates) slipTravelDates.textContent = `${startFormatted} to ${endFormatted}`;

    if (slipTravellers) {
      slipTravellers.textContent = `${data.adults} Adult${data.adults > 1 ? 's' : ''}${data.children > 0 ? `, ${data.children} Child${data.children > 1 ? 'ren' : ''}` : ''} (Total: ${data.totalTravellers})`;
    }

    if (slipHotelPref) slipHotelPref.textContent = `${data.hotelPreference} CLASS`;
    if (slipTransportPref) slipTransportPref.textContent = `${data.transportPreference}`;
    if (slipTotalAmount) slipTotalAmount.textContent = data.totalEstimatedAmount;
    if (slipStatus) slipStatus.textContent = data.status;

    confirmationSection.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // 12. Print Handler (Prints ONLY the single confirmation slip!)
  // --------------------------------------------------------------------------
  if (btnPrintConfirmation) {
    btnPrintConfirmation.addEventListener('click', () => {
      window.print();
    });
  }

  // --------------------------------------------------------------------------
  // 13. Check & Restore Booking from localStorage on Load
  // --------------------------------------------------------------------------
  try {
    const saved = localStorage.getItem('wanderlust_latest_booking');
    if (saved) {
      const record = JSON.parse(saved);
      if (savedBookingNotice && savedBookingIdSpan) {
        savedBookingIdSpan.textContent = record.bookingId;
        savedBookingNotice.classList.add('show');

        if (btnLoadSavedBooking) {
          btnLoadSavedBooking.addEventListener('click', () => {
            renderBookingConfirmation(record);
            confirmationSection.scrollIntoView({ behavior: 'smooth' });
            showToast(`Loaded saved booking: ${record.bookingId}`);
          });
        }
      }
    }
  } catch (err) {
    console.warn('LocalStorage retrieval error:', err);
  }

  // --------------------------------------------------------------------------
  // 14. HTTP Client-Server Interactive Simulation
  // --------------------------------------------------------------------------
  const btnSimulateHttp = document.getElementById('btn-simulate-http');
  const simStatus = document.getElementById('http-sim-status');

  if (btnSimulateHttp) {
    btnSimulateHttp.addEventListener('click', () => {
      btnSimulateHttp.disabled = true;
      btnSimulateHttp.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Simulating HTTP Communication...';
      if (simStatus) {
        simStatus.textContent = 'Step 1/8: Client initiates HTTP GET /index.html';
        simStatus.style.color = 'var(--color-ocean-primary)';
      }

      const steps = [
        'Step 1: Browser (Client) opens connection to server DNS...',
        'Step 2: Browser issues HTTP/1.1 GET request with headers...',
        'Step 3: Web Server processes request and retrieves resources...',
        'Step 4: Server responds with HTTP 200 OK + HTML, CSS & JS bundle...',
        'Step 5: Client DOM parser builds DOM & CSSOM trees and renders UI...',
        'Step 6: User submits booking form payload -> HTTP POST /api/book...',
        'Step 7: Server validates booking, queries database, reserves seats...',
        'Step 8: Server responds HTTP 201 Created with unique Booking Voucher!'
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          if (simStatus) simStatus.textContent = steps[currentStep];
          currentStep++;
        } else {
          clearInterval(interval);
          btnSimulateHttp.disabled = false;
          btnSimulateHttp.innerHTML = '<i class="fas fa-play"></i> Re-Run HTTP Communication Simulation';
          if (simStatus) {
            simStatus.textContent = '✅ Full HTTP Client-Server Handshake & Booking Lifecycle Completed!';
            simStatus.style.color = 'var(--color-tropical-green)';
          }
          showToast('HTTP 8-Step Lifecycle Simulation Completed!');
        }
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 15. Newsletter Subscription Handler
  // --------------------------------------------------------------------------
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast(`Thank you! Subscription confirmed for ${emailInput.value.trim()}`);
        emailInput.value = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 16. Toast Utility Function
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(msg) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4000);
  }
});
