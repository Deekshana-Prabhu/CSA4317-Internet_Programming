/**
 * ============================================================================
 * SPORTIFY – College Sports Tournament Management
 * Main JavaScript Engine (Vanilla ES6+)
 * 
 * Features:
 *  - Sticky Navbar & Mobile Drawer
 *  - Active Section Scroll Spy
 *  - Animated Statistics Counters (IntersectionObserver)
 *  - Sports Details Modal Dialog with Pre-Fill Link
 *  - Participating Teams Dynamic Rendering & Filter
 *  - Schedule Table Search & Multi-Filter Engine
 *  - Comprehensive HTML5 Form Validation
 *  - LocalStorage Data Persistence for Team Registrations
 *  - Unique Registration ID Generator & Printable Confirmation Slip
 *  - Interactive Toast Notifications & Back-to-Top Button
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. DATA REPOSITORY: SPORTS SPECIFICATIONS
  // ==========================================================================
  const sportsData = {
    cricket: {
      name: 'T20 Cricket Championship',
      category: 'Outdoor Field Sport',
      icon: 'fa-baseball-bat-ball',
      format: 'T20 (20 Overs per side)',
      teamSize: '11 Active Players + 4 Substitutes',
      duration: 'approx. 3.5 Hours',
      venue: 'University Central Cricket Oval (Turf Pitch)',
      equipment: 'Leather balls provided; full batsman protective kit mandatory',
      rules: [
        'Standard ICC T20 bylaws adapted for inter-collegiate play.',
        'Maximum 4 overs per bowler.',
        'First 6 overs are mandatory powerplay with only 2 fielders outside 30-yard circle.',
        'In case of a tie, a mandatory Super Over will decide the winner.'
      ],
      coordinator: 'Prof. R. Malhotra (+91 98765 11001)'
    },
    football: {
      name: 'Collegiate Football League',
      category: 'Outdoor Field Sport',
      icon: 'fa-futbol',
      format: '11-a-side Knockout & League Stages',
      teamSize: '11 Active Players + 5 Substitutes',
      duration: '90 Minutes (Two 45-min halves + 15-min interval)',
      venue: 'North Stadium Turf Field',
      equipment: 'Shin guards and standard studs mandatory for all players',
      rules: [
        'Standard FIFA laws of the game apply with rolling substitutes.',
        'Maximum 5 substitutions allowed in 3 stoppage windows.',
        'Yellow and Red card disciplinary points will affect fair-play rankings.',
        'Knockout ties proceed to two 15-minute extra-time halves, followed by penalty shootout.'
      ],
      coordinator: 'Coach S. Fernandez (+91 98765 11002)'
    },
    basketball: {
      name: 'Basketball Slam Tournament',
      category: 'Indoor Court Sport',
      icon: 'fa-basketball',
      format: '5v5 Full Court Championship',
      teamSize: '5 Active Players + 5 Substitutes',
      duration: '4 Quarters of 10 Minutes each (FIBA Rules)',
      venue: 'Indoor Sports Complex – Wooden Court 1',
      equipment: 'Indoor non-marking basketball shoes mandatory; Spalding TF-1000 game ball',
      rules: [
        'Standard FIBA 24-second shot clock and 8-second backcourt violation rules.',
        'Player fouls out upon 5th personal foul.',
        'Bonus free throws awarded from 5th team foul per quarter.',
        'Overtime periods of 5 minutes until tie is resolved.'
      ],
      coordinator: 'Prof. David Vance (+91 98765 11003)'
    },
    volleyball: {
      name: 'Inter-Department Volleyball Clash',
      category: 'Indoor / Outdoor Court Sport',
      icon: 'fa-volleyball',
      format: 'Best of 5 Sets (Rally Scoring)',
      teamSize: '6 Active Players + 4 Substitutes',
      duration: 'Approx. 75 - 100 Minutes',
      venue: 'East Court & Indoor Pavilion',
      equipment: 'Mikasa V200W official tournament volleyball',
      rules: [
        'First 4 sets played to 25 points (must win by 2 points).',
        'Deciding 5th set played to 15 points.',
        'Libero player designated exclusively for back-row defensive play.',
        'Maximum 6 team substitutions permitted per set.'
      ],
      coordinator: 'Ms. Anita Deshmukh (+91 98765 11004)'
    },
    badminton: {
      name: 'Badminton Masters Cup',
      category: 'Indoor Racquet Sport',
      icon: 'fa-feather',
      format: 'Men & Women Singles & Doubles (Best of 3 sets)',
      teamSize: '1 Player (Singles) or 2 Players (Doubles) + 1 Sub',
      duration: '35 - 55 Minutes per match',
      venue: 'Badminton Complex (Synthetic Mat Courts)',
      equipment: 'Yonex feather tournament shuttles provided; non-marking gum sole shoes mandatory',
      rules: [
        'BWF standard 21-point rally scoring system.',
        'At 20-all, side which gains a 2-point lead wins, up to max 30 points.',
        'Intervals of 60 seconds at 11 points and 120 seconds between sets.'
      ],
      coordinator: 'Prof. K. Iyer (+91 98765 11005)'
    },
    'table-tennis': {
      name: 'Table Tennis Rapid Open',
      category: 'Indoor Table Sport',
      icon: 'fa-table-tennis-paddle-ball',
      format: 'Singles & Doubles Knockout (Best of 5 games)',
      teamSize: '1 Player (Singles) or 2 Players (Doubles)',
      duration: '25 - 40 Minutes per tie',
      venue: 'Recreation Hall (STIGA International Tables)',
      equipment: 'ITTF-approved 40+ 3-star white celluloid balls provided',
      rules: [
        'Games played to 11 points (must win by 2 points).',
        'Service alternates every 2 points, or every point during deuce.',
        'Two color rubbers (one red, one black) mandatory on paddles.'
      ],
      coordinator: 'Mr. Arvind Joshi (+91 98765 11006)'
    },
    kabaddi: {
      name: 'Kabaddi Premier Cup',
      category: 'Indoor Contact Sport',
      icon: 'fa-hand-fist',
      format: 'Pro-Kabaddi Rules on Synthetic Mat',
      teamSize: '7 Active Players + 5 Substitutes',
      duration: '40 Minutes (Two 20-min halves + 5-min break)',
      venue: 'Gymnasium Center Mat',
      equipment: 'Standard anti-skid ankle guards and team jerseys provided',
      rules: [
        '30-second raid clock with audible chant / buzzer.',
        'Do-or-Die raid rule triggered upon two successive empty raids.',
        'Super Tackle awards 2 points when defenders are 3 or fewer.',
        'All-Out awards 2 bonus points to the opposing team.'
      ],
      coordinator: 'Coach Devendra Yadav (+91 98765 11007)'
    },
    athletics: {
      name: 'Track & Field Athletics Championship',
      category: 'Outdoor Track Events',
      icon: 'fa-person-running',
      format: 'Heats, Semifinals & Grand Finals',
      teamSize: 'Individual Entries & 4-member Relay Squads',
      duration: 'Full Day Event (9:00 AM - 5:00 PM)',
      venue: 'Olympic 400m Synthetic Track & Field Arenas',
      equipment: 'Electronic laser timing systems; standard spikes (max 6mm) allowed',
      rules: [
        'Events include 100m, 200m, 400m, 800m, 4x100m relay, long jump, shot put.',
        'IAAF standard false start rule: one false start results in immediate disqualification.',
        'Baton exchange zone rules strictly monitored during relays.'
      ],
      coordinator: 'Dr. Priya Nair (+91 98765 11008)'
    }
  };

  // ==========================================================================
  // 2. STICKY NAVBAR & MOBILE NAVIGATION
  // ==========================================================================
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollPos > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  // Back to top smooth scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Hamburger Toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      });
    });

    // Close when clicking outside menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      }
    });
  }

  // Active section scroll spy
  const sections = document.querySelectorAll('section[id]');
  const observeSectionScroll = () => {
    const scrollPosition = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', observeSectionScroll, { passive: true });

  // ==========================================================================
  // 3. ANIMATED STATISTICS COUNTERS
  // ==========================================================================
  const counterCards = document.querySelectorAll('.stat-card');
  let countersAnimated = false;

  const animateCounter = (card) => {
    const targetValue = parseInt(card.getAttribute('data-counter'), 10);
    const counterElement = card.querySelector('.counter-value');
    if (!counterElement) return;

    let start = 0;
    const duration = 1800; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      // Ease out cubic
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(easeOutProgress * targetValue);

      counterElement.textContent = currentNumber;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counterElement.textContent = targetValue;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if ('IntersectionObserver' in window && counterCards.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          counterCards.forEach(card => animateCounter(card));
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    counterCards.forEach(card => counterObserver.observe(card));
  } else {
    // Fallback if IntersectionObserver not supported
    counterCards.forEach(card => animateCounter(card));
  }

  // ==========================================================================
  // 4. SPORTS CATEGORIES DETAILS MODAL
  // ==========================================================================
  const modalBackdrop = document.getElementById('sportModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');
  const modalRegisterActionBtn = document.getElementById('modalRegisterActionBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalTag = document.getElementById('modalTag');
  const modalIconBadge = document.getElementById('modalIconBadge');
  const modalBody = document.getElementById('modalBody');
  const viewSportButtons = document.querySelectorAll('.view-sport-btn');
  const sportDropdown = document.getElementById('sportCategory');

  let currentSelectedSportKey = '';

  const openSportModal = (sportKey) => {
    const data = sportsData[sportKey];
    if (!data) return;

    currentSelectedSportKey = sportKey;
    modalTitle.textContent = data.name;
    modalTag.textContent = data.category;
    modalIconBadge.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;

    const rulesHtml = data.rules.map(r => `<li><i class="fa-solid fa-angle-right text-accent"></i> ${r}</li>`).join('');

    modalBody.innerHTML = `
      <div class="modal-spec-grid">
        <div class="modal-spec-box">
          <span class="modal-spec-label"><i class="fa-solid fa-trophy"></i> Match Format</span>
          <p class="modal-spec-val">${data.format}</p>
        </div>
        <div class="modal-spec-box">
          <span class="modal-spec-label"><i class="fa-solid fa-users"></i> Squad Capacity</span>
          <p class="modal-spec-val">${data.teamSize}</p>
        </div>
        <div class="modal-spec-box">
          <span class="modal-spec-label"><i class="fa-solid fa-clock"></i> Match Duration</span>
          <p class="modal-spec-val">${data.duration}</p>
        </div>
        <div class="modal-spec-box">
          <span class="modal-spec-label"><i class="fa-solid fa-location-dot"></i> Venue Assigned</span>
          <p class="modal-spec-val">${data.venue}</p>
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--electric-blue); font-weight: 800;">
          <i class="fa-solid fa-circle-exclamation"></i> Tournament Bylaws & Guidelines
        </h4>
        <ul style="display:flex; flex-direction:column; gap:0.4rem; font-size:0.88rem; color:var(--text-light); margin-bottom:1rem;">
          ${rulesHtml}
        </ul>
      </div>

      <div style="background: rgba(0, 102, 255, 0.08); border: 1px solid rgba(0, 210, 255, 0.2); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
        <strong><i class="fa-solid fa-user-tie"></i> Discipline Coordinator:</strong> ${data.coordinator}
      </div>
    `;

    modalBackdrop.classList.add('show');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeSportModal = () => {
    modalBackdrop.classList.remove('show');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  viewSportButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sportKey = btn.getAttribute('data-sport');
      openSportModal(sportKey);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSportModal);
  if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeSportModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeSportModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('show')) {
      closeSportModal();
    }
  });

  // Modal Register CTA: Pre-select sport and scroll smoothly to registration form
  if (modalRegisterActionBtn) {
    modalRegisterActionBtn.addEventListener('click', (e) => {
      closeSportModal();
      if (currentSelectedSportKey && sportDropdown) {
        // Map sport key to select option
        const keyMap = {
          'cricket': 'Cricket',
          'football': 'Football',
          'basketball': 'Basketball',
          'volleyball': 'Volleyball',
          'badminton': 'Badminton',
          'table-tennis': 'Table Tennis',
          'kabaddi': 'Kabaddi',
          'athletics': 'Athletics'
        };
        const mappedOption = keyMap[currentSelectedSportKey];
        if (mappedOption) {
          sportDropdown.value = mappedOption;
        }
      }
    });
  }

  // ==========================================================================
  // 5. PARTICIPATING TEAMS FILTER & DYNAMIC RENDERING
  // ==========================================================================
  const teamFilterButtons = document.querySelectorAll('.teams-filter-bar .filter-btn');
  const teamsGrid = document.getElementById('teamsGrid');

  const filterTeams = (filterValue) => {
    const teamCards = teamsGrid.querySelectorAll('.team-card');
    teamCards.forEach(card => {
      const sport = card.getAttribute('data-sport');
      if (filterValue === 'all' || sport.toLowerCase() === filterValue.toLowerCase()) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  teamFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      teamFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      filterTeams(filter);
    });
  });

  // ==========================================================================
  // 6. TOURNAMENT SCHEDULE SEARCH & MULTI-FILTER
  // ==========================================================================
  const scheduleSearchInput = document.getElementById('scheduleSearchInput');
  const scheduleSportFilter = document.getElementById('scheduleSportFilter');
  const scheduleStatusFilter = document.getElementById('scheduleStatusFilter');
  const scheduleTableBody = document.getElementById('scheduleTableBody');
  const noScheduleMsg = document.getElementById('noScheduleMsg');

  const filterScheduleTable = () => {
    const searchQuery = scheduleSearchInput ? scheduleSearchInput.value.toLowerCase().trim() : '';
    const selectedSport = scheduleSportFilter ? scheduleSportFilter.value : 'all';
    const selectedStatus = scheduleStatusFilter ? scheduleStatusFilter.value : 'all';

    const rows = scheduleTableBody.querySelectorAll('.match-row');
    let visibleCount = 0;

    rows.forEach(row => {
      const sport = row.getAttribute('data-sport') || '';
      const status = row.getAttribute('data-status') || '';
      const rowText = row.textContent.toLowerCase();

      const matchesSearch = searchQuery === '' || rowText.includes(searchQuery);
      const matchesSport = selectedSport === 'all' || sport.toLowerCase() === selectedSport.toLowerCase();
      const matchesStatus = selectedStatus === 'all' || status.toLowerCase() === selectedStatus.toLowerCase();

      if (matchesSearch && matchesSport && matchesStatus) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (noScheduleMsg) {
      noScheduleMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  if (scheduleSearchInput) scheduleSearchInput.addEventListener('input', filterScheduleTable);
  if (scheduleSportFilter) scheduleSportFilter.addEventListener('change', filterScheduleTable);
  if (scheduleStatusFilter) scheduleStatusFilter.addEventListener('change', filterScheduleTable);

  // ==========================================================================
  // 7. TEAM REGISTRATION FORM & LOCALSTORAGE ENGINE
  // ==========================================================================
  const form = document.getElementById('teamRegistrationForm');
  const teamNameInput = document.getElementById('teamName');
  const collegeNameInput = document.getElementById('collegeName');
  const captainNameInput = document.getElementById('captainName');
  const emailInput = document.getElementById('emailAddress');
  const phoneInput = document.getElementById('phoneNumber');
  const selectSport = document.getElementById('sportCategory');
  const playerCountInput = document.getElementById('playerCount');
  const matchDateInput = document.getElementById('preferredDate');
  const membersInput = document.getElementById('teamMembers');
  const logoFileInput = document.getElementById('teamLogoFile');
  const clearLogoBtn = document.getElementById('clearLogoBtn');
  const logoPreviewContainer = document.getElementById('logoPreviewContainer');
  const logoPreviewImg = document.getElementById('logoPreviewImg');
  const additionalInfoInput = document.getElementById('additionalInfo');
  const termsCheckbox = document.getElementById('termsCheck');
  const resetFormBtn = document.getElementById('resetFormBtn');

  // Confirmation UI Elements
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  const registeredIdDisplay = document.getElementById('registeredIdDisplay');
  const panelPlaceholder = document.getElementById('panelPlaceholder');
  const confirmationSlip = document.getElementById('confirmationSlip');
  const confTimestamp = document.getElementById('confTimestamp');
  const confRegId = document.getElementById('confRegId');
  const confLogo = document.getElementById('confLogo');
  const confTeamName = document.getElementById('confTeamName');
  const confCollege = document.getElementById('confCollege');
  const confSport = document.getElementById('confSport');
  const confCaptain = document.getElementById('confCaptain');
  const confEmail = document.getElementById('confEmail');
  const confPhone = document.getElementById('confPhone');
  const confPlayers = document.getElementById('confPlayers');
  const confMatchDate = document.getElementById('confMatchDate');
  const confRoster = document.getElementById('confRoster');
  const printReceiptBtn = document.getElementById('printReceiptBtn');
  const viewNewTeamBtn = document.getElementById('viewNewTeamBtn');
  const storedList = document.getElementById('storedList');
  const storedCount = document.getElementById('storedCount');
  const clearStorageBtn = document.getElementById('clearStorageBtn');

  // Set minimum date for match date input to today
  if (matchDateInput) {
    const today = new Date().toISOString().split('T')[0];
    matchDateInput.setAttribute('min', today);
  }

  let uploadedLogoDataUrl = '';

  // Handle Logo Upload Preview
  if (logoFileInput) {
    logoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Please upload a valid image file (PNG, JPG, SVG).', 'error');
          logoFileInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedLogoDataUrl = event.target.result;
          logoPreviewImg.src = uploadedLogoDataUrl;
          logoPreviewContainer.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Clear logo preview
  if (clearLogoBtn) {
    clearLogoBtn.addEventListener('click', () => {
      uploadedLogoDataUrl = '';
      logoFileInput.value = '';
      logoPreviewImg.src = '';
      logoPreviewContainer.style.display = 'none';
    });
  }

  // Generate Unique Registration ID: SPT-2026-XXXXX
  const generateRegistrationId = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `SPT-2026-${randomNum}`;
  };

  // LocalStorage Helper Functions
  const STORAGE_KEY = 'sportify_registrations';

  const getStoredRegistrations = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Error reading localStorage:', err);
      return [];
    }
  };

  const saveRegistrationToStorage = (regData) => {
    try {
      const current = getStoredRegistrations();
      current.unshift(regData); // latest first
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (err) {
      console.error('Error writing to localStorage:', err);
    }
  };

  const removeRegistrationFromStorage = (regId) => {
    try {
      let current = getStoredRegistrations();
      current = current.filter(item => item.id !== regId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      renderStoredRegistrations();
      showToast(`Registration ${regId} removed.`, 'info');
    } catch (err) {
      console.error('Error deleting from localStorage:', err);
    }
  };

  // Display Submitted Confirmation Card
  const displayConfirmation = (data) => {
    if (panelPlaceholder) panelPlaceholder.style.display = 'none';
    if (confirmationSlip) {
      confirmationSlip.style.display = 'block';

      confTimestamp.textContent = data.timestamp;
      confRegId.textContent = data.id;
      confLogo.src = data.logoUrl || 'assets/images/team-apex.svg';
      confTeamName.textContent = data.teamName;
      confCollege.textContent = data.collegeName;
      confSport.textContent = data.sport;
      confCaptain.textContent = data.captain;
      confEmail.textContent = data.email;
      confPhone.textContent = data.phone;
      confPlayers.textContent = `${data.players} Athletes`;
      confMatchDate.textContent = data.matchDate;
      confRoster.textContent = data.members;
    }

    if (formSuccessAlert) {
      registeredIdDisplay.textContent = data.id;
      formSuccessAlert.style.display = 'flex';
      formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Render Stored Registrations in the side panel list
  const renderStoredRegistrations = () => {
    const list = getStoredRegistrations();
    if (storedCount) storedCount.textContent = list.length;
    if (!storedList) return;

    if (list.length === 0) {
      storedList.innerHTML = `<li class="empty-list-note">No stored submissions yet. Register a team!</li>`;
      return;
    }

    storedList.innerHTML = list.map(item => `
      <li class="stored-item" data-id="${item.id}">
        <div class="stored-item-info">
          <strong>${item.teamName} (${item.sport})</strong>
          <span>${item.id} &bull; ${item.captain}</span>
        </div>
        <div class="stored-item-actions">
          <button type="button" class="btn-icon-tiny view-stored-btn" title="View details" data-id="${item.id}">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button type="button" class="btn-icon-tiny delete-stored-btn" title="Delete record" data-id="${item.id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </li>
    `).join('');

    // Attach listeners to dynamically created view/delete buttons
    storedList.querySelectorAll('.view-stored-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = list.find(item => item.id === id);
        if (found) {
          displayConfirmation(found);
          showToast(`Displaying receipt for ${found.teamName}`, 'info');
        }
      });
    });

    storedList.querySelectorAll('.delete-stored-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        removeRegistrationFromStorage(id);
      });
    });
  };

  // Append Dynamic Team Card to Teams Grid
  const appendTeamToGrid = (regData) => {
    if (!teamsGrid) return;

    // Check if card with this team already exists
    const existing = teamsGrid.querySelector(`[data-reg-id="${regData.id}"]`);
    if (existing) return;

    const teamCard = document.createElement('article');
    teamCard.className = 'team-card animate-fade-up';
    teamCard.setAttribute('data-sport', regData.sport);
    teamCard.setAttribute('data-reg-id', regData.id);

    teamCard.innerHTML = `
      <div class="team-card-header">
        <div class="team-logo-box">
          <img src="${regData.logoUrl || 'assets/images/team-apex.svg'}" alt="${regData.teamName} Logo" class="team-logo-img">
        </div>
        <span class="team-status-badge status-registered"><i class="fa-solid fa-clock"></i> Registered</span>
      </div>
      <div class="team-info">
        <span class="team-sport-tag"><i class="fa-solid fa-trophy"></i> ${regData.sport}</span>
        <h3 class="team-title">${regData.teamName}</h3>
        <p class="team-college"><i class="fa-solid fa-building-columns"></i> ${regData.collegeName}</p>
        
        <div class="team-details-table">
          <div class="detail-row">
            <span class="detail-key">Captain:</span>
            <span class="detail-val">${regData.captain}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Squad Size:</span>
            <span class="detail-val"><i class="fa-solid fa-user-group"></i> ${regData.players} Players</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Reg ID:</span>
            <span class="detail-val" style="font-family:monospace; color:var(--neon-orange);">${regData.id}</span>
          </div>
        </div>
      </div>
    `;

    // Prepend after the existing teams
    teamsGrid.insertBefore(teamCard, teamsGrid.firstChild);
  };

  // Load existing registrations on startup into teams grid & confirmation side panel
  const initStoredData = () => {
    const list = getStoredRegistrations();
    renderStoredRegistrations();
    list.forEach(item => appendTeamToGrid(item));

    if (list.length > 0) {
      displayConfirmation(list[0]);
    }
  };

  initStoredData();

  // Clear all localStorage records
  if (clearStorageBtn) {
    clearStorageBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all locally saved team registrations?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderStoredRegistrations();
        if (panelPlaceholder) panelPlaceholder.style.display = 'flex';
        if (confirmationSlip) confirmationSlip.style.display = 'none';
        if (formSuccessAlert) formSuccessAlert.style.display = 'none';
        showToast('All saved registrations cleared.', 'info');
      }
    });
  }

  // Print slip action
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // View in Teams button action
  if (viewNewTeamBtn) {
    viewNewTeamBtn.addEventListener('click', () => {
      const teamsSection = document.getElementById('teams');
      if (teamsSection) {
        teamsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Form Field Validation Helper
  const validateField = (input, isValid) => {
    if (!isValid) {
      input.classList.add('is-invalid');
      return false;
    } else {
      input.classList.remove('is-invalid');
      return true;
    }
  };

  // Attach instant input listeners for real-time validation
  if (teamNameInput) {
    teamNameInput.addEventListener('input', () => {
      validateField(teamNameInput, teamNameInput.value.trim().length >= 3);
    });
  }

  if (collegeNameInput) {
    collegeNameInput.addEventListener('input', () => {
      validateField(collegeNameInput, collegeNameInput.value.trim().length >= 3);
    });
  }

  if (captainNameInput) {
    captainNameInput.addEventListener('input', () => {
      validateField(captainNameInput, captainNameInput.value.trim().length >= 3);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateField(emailInput, emailRegex.test(emailInput.value.trim()));
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      validateField(phoneInput, phoneDigits.length === 10);
    });
  }

  if (selectSport) {
    selectSport.addEventListener('change', () => {
      validateField(selectSport, selectSport.value !== '');
    });
  }

  if (playerCountInput) {
    playerCountInput.addEventListener('input', () => {
      const count = parseInt(playerCountInput.value, 10);
      validateField(playerCountInput, count >= 1 && count <= 25);
    });
  }

  if (matchDateInput) {
    matchDateInput.addEventListener('change', () => {
      validateField(matchDateInput, matchDateInput.value !== '');
    });
  }

  if (membersInput) {
    membersInput.addEventListener('input', () => {
      validateField(membersInput, membersInput.value.trim().length >= 5);
    });
  }

  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      validateField(termsCheckbox, termsCheckbox.checked);
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Run full form validation
      const isTeamNameValid = validateField(teamNameInput, teamNameInput.value.trim().length >= 3);
      const isCollegeValid = validateField(collegeNameInput, collegeNameInput.value.trim().length >= 3);
      const isCaptainValid = validateField(captainNameInput, captainNameInput.value.trim().length >= 3);
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));

      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      const isPhoneValid = validateField(phoneInput, phoneDigits.length === 10);

      const isSportValid = validateField(selectSport, selectSport.value !== '');
      
      const count = parseInt(playerCountInput.value, 10);
      const isCountValid = validateField(playerCountInput, count >= 1 && count <= 25);

      const isDateValid = validateField(matchDateInput, matchDateInput.value !== '');
      const isMembersValid = validateField(membersInput, membersInput.value.trim().length >= 5);
      const isTermsValid = validateField(termsCheckbox, termsCheckbox.checked);

      const isFormValid = isTeamNameValid && isCollegeValid && isCaptainValid &&
                          isEmailValid && isPhoneValid && isSportValid &&
                          isCountValid && isDateValid && isMembersValid && isTermsValid;

      if (!isFormValid) {
        showToast('Please fix all highlighted errors before submitting.', 'error');
        // Scroll to first invalid element
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
        return;
      }

      // Generate Registration Data Object
      const newRegId = generateRegistrationId();
      const now = new Date();
      const formattedTimestamp = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Fallback sporty logo based on sport category
      let fallbackLogo = 'assets/images/team-apex.svg';
      const sportKey = selectSport.value.toLowerCase();
      if (sportKey.includes('cricket')) fallbackLogo = 'assets/images/team-strikers.svg';
      else if (sportKey.includes('football')) fallbackLogo = 'assets/images/team-apex.svg';
      else if (sportKey.includes('basketball')) fallbackLogo = 'assets/images/team-thunderbolts.svg';
      else if (sportKey.includes('volleyball')) fallbackLogo = 'assets/images/team-spikers.svg';
      else if (sportKey.includes('badminton')) fallbackLogo = 'assets/images/team-smashers.svg';
      else if (sportKey.includes('kabaddi')) fallbackLogo = 'assets/images/team-cyber.svg';
      else if (sportKey.includes('athletics')) fallbackLogo = 'assets/images/team-velocity.svg';

      const registrationRecord = {
        id: newRegId,
        timestamp: formattedTimestamp,
        teamName: teamNameInput.value.trim(),
        collegeName: collegeNameInput.value.trim(),
        captain: captainNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneDigits,
        sport: selectSport.value,
        players: count,
        matchDate: matchDateInput.value,
        members: membersInput.value.trim(),
        logoUrl: uploadedLogoDataUrl || fallbackLogo,
        additionalInfo: additionalInfoInput ? additionalInfoInput.value.trim() : ''
      };

      // 1. Save to LocalStorage
      saveRegistrationToStorage(registrationRecord);

      // 2. Render in confirmation panel
      displayConfirmation(registrationRecord);

      // 3. Update Stored Registrations list
      renderStoredRegistrations();

      // 4. Dynamically append into Teams Grid
      appendTeamToGrid(registrationRecord);

      // 5. Show toast alert
      showToast(`Team "${registrationRecord.teamName}" registered with ID: ${newRegId}`, 'success');

      // 6. Reset Form & upload states
      form.reset();
      uploadedLogoDataUrl = '';
      if (logoPreviewContainer) logoPreviewContainer.style.display = 'none';
      if (logoPreviewImg) logoPreviewImg.src = '';

      // Clear any invalid classes
      form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    });
  }

  // Handle Form Reset Button
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      uploadedLogoDataUrl = '';
      if (logoPreviewContainer) logoPreviewContainer.style.display = 'none';
      if (logoPreviewImg) logoPreviewImg.src = '';
      showToast('Form fields cleared.', 'info');
    });
  }

  // ==========================================================================
  // 8. CONTACT FORM SIMULATION
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  const contactSuccessMsg = document.getElementById('contactSuccessMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const subject = document.getElementById('contactSubject');
      const message = document.getElementById('contactMessage');

      if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
        showToast('Please fill out all contact fields.', 'error');
        return;
      }

      if (contactSuccessMsg) {
        contactSuccessMsg.style.display = 'flex';
      }
      showToast('Your message has been sent to the athletic directorate!', 'success');
      contactForm.reset();

      setTimeout(() => {
        if (contactSuccessMsg) contactSuccessMsg.style.display = 'none';
      }, 5000);
    });
  }

  // ==========================================================================
  // 9. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;

    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

});
