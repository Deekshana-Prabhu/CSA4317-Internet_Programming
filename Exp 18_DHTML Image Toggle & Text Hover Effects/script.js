/**
 * ==========================================================================
 * INTERACTIFY – Interactive DHTML Experience
 * Script: script.js (Vanilla JavaScript / DHTML)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DATA & CONSTANTS: IMAGE DEFINITIONS (With SVG Fallbacks for 100% Reliability)
  // --------------------------------------------------------------------------
  
  // Vector SVG fallbacks to guarantee 0 broken images even offline
  const SVG_DAY_FALLBACK = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="60%" stop-color="#bae6fd"/>
          <stop offset="100%" stop-color="#fef08a"/>
        </linearGradient>
        <linearGradient id="mtnGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#475569"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
        <linearGradient id="mtnGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#16a34a"/>
          <stop offset="100%" stop-color="#14532d"/>
        </linearGradient>
        <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#skyGrad)"/>
      <circle cx="950" cy="140" r="60" fill="#facc15" filter="drop-shadow(0 0 25px rgba(250, 204, 21, 0.8))"/>
      <polygon points="150,220 380,500 0,500" fill="url(#mtnGrad1)"/>
      <polygon points="500,160 850,520 200,520" fill="url(#mtnGrad1)"/>
      <polygon points="850,240 1150,520 600,520" fill="url(#mtnGrad1)"/>
      <polygon points="-50,380 400,675 -100,675" fill="url(#mtnGrad2)"/>
      <polygon points="800,360 1300,675 500,675" fill="url(#mtnGrad2)"/>
      <rect y="500" width="1200" height="175" fill="url(#lakeGrad)"/>
      <text x="600" y="600" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="2">☀️ BEAUTIFUL DAYTIME NATURE LANDSCAPE</text>
    </svg>
  `);

  const SVG_NIGHT_FALLBACK = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      <defs>
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#050814"/>
          <stop offset="60%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="nightMtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#090d16"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#nightSky)"/>
      <!-- Moon -->
      <circle cx="280" cy="150" r="50" fill="#f8fafc" filter="drop-shadow(0 0 30px rgba(248, 250, 252, 0.9))"/>
      <circle cx="300" cy="140" r="45" fill="#0c1020"/>
      <!-- Stars -->
      <circle cx="120" cy="80" r="2" fill="#fff"/><circle cx="200" cy="220" r="2.5" fill="#fff"/>
      <circle cx="450" cy="100" r="2" fill="#fff"/><circle cx="580" cy="60" r="3" fill="#fff"/>
      <circle cx="720" cy="150" r="2" fill="#fff"/><circle cx="850" cy="90" r="3" fill="#fff"/>
      <circle cx="980" cy="180" r="2" fill="#fff"/><circle cx="1100" cy="110" r="2.5" fill="#fff"/>
      <polygon points="450,200 800,580 150,580" fill="url(#nightMtn)"/>
      <polygon points="850,220 1200,580 550,580" fill="url(#nightMtn)"/>
      <polygon points="120,280 480,600 -100,600" fill="url(#nightMtn)"/>
      <rect y="540" width="1200" height="135" fill="#070a13"/>
      <text x="600" y="620" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="700" fill="#a5b4fc" text-anchor="middle" letter-spacing="2">🌙 SERENE NIGHT SKY WITH MOON &amp; STARS</text>
    </svg>
  `);

  const imageData = {
    day: {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      fallback: SVG_DAY_FALLBACK,
      alt: "Beautiful green nature landscape during daytime with lush forest, lake and mountains",
      statusText: "Day Image Displayed",
      badgeText: "Day",
      badgeClass: "day",
      themeIcon: "☀️",
      themeText: "Day Mode",
      statusDesc: "Day landscape active",
      dotClass: ""
    },
    night: {
      url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      fallback: SVG_NIGHT_FALLBACK,
      alt: "Beautiful night landscape with starry sky, snow-capped mountains and cosmic glow",
      statusText: "Night Image Displayed",
      badgeText: "Night",
      badgeClass: "night",
      themeIcon: "🌙",
      themeText: "Night Mode",
      statusDesc: "Night starry sky active",
      dotClass: "night-dot"
    }
  };

  // State tracker: 'day' | 'night'
  let currentImageKey = 'day';
  let isImageTransitioning = false;

  // --------------------------------------------------------------------------
  // 2. DOM ELEMENT REFERENCES
  // --------------------------------------------------------------------------
  
  // Image toggle elements
  const toggleImage = document.getElementById('toggleImage');
  const imageFrame = document.getElementById('imageFrame');
  const changeImageBtn = document.getElementById('changeImageBtn');
  const imageStatusMessage = document.getElementById('imageStatusMessage');
  const imageStateDot = document.getElementById('imageStateDot');
  const themeTagIcon = document.getElementById('themeTagIcon');
  const themeTagText = document.getElementById('themeTagText');

  // Status panel elements
  const imageStatusBadge = document.getElementById('imageStatusBadge');
  const imageStatusDesc = document.getElementById('imageStatusDesc');
  const statusImageIcon = document.getElementById('statusImageIcon');
  
  const textStatusBadge = document.getElementById('textStatusBadge');
  const textStatusDesc = document.getElementById('textStatusDesc');
  const statusTextIcon = document.getElementById('statusTextIcon');

  // Text hover elements
  const hoverParagraphBox = document.getElementById('hoverParagraphBox');
  const interactiveParagraph = document.getElementById('interactiveParagraph');
  const resetStyleBtn = document.getElementById('resetStyleBtn');
  const effectChips = document.querySelectorAll('.effect-chip');

  // Navigation elements
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // --------------------------------------------------------------------------
  // 3. IMAGE ERROR HANDLING (PREVENT BROKEN IMAGES)
  // --------------------------------------------------------------------------
  if (toggleImage) {
    toggleImage.addEventListener('error', function() {
      console.warn(`Online image failed to load, switching to robust SVG illustration fallback for: ${currentImageKey}`);
      this.src = imageData[currentImageKey].fallback;
    });
  }

  // --------------------------------------------------------------------------
  // 4. IMAGE TOGGLE FUNCTIONALITY (DHTML ONCLICK)
  // --------------------------------------------------------------------------
  function toggleImageAction() {
    if (isImageTransitioning) return; // Prevent spam clicking during transition
    isImageTransitioning = true;

    // Toggle key
    currentImageKey = (currentImageKey === 'day') ? 'night' : 'day';
    const target = imageData[currentImageKey];

    // Smooth DHTML fade-out
    toggleImage.classList.remove('fade-in');
    toggleImage.classList.add('fade-out');

    setTimeout(() => {
      // DHTML Property Manipulation
      toggleImage.src = target.url;
      toggleImage.alt = target.alt;

      // Update Local Image Card UI
      imageStatusMessage.textContent = target.statusText;
      themeTagIcon.textContent = target.themeIcon;
      themeTagText.textContent = target.themeText;

      if (target.dotClass) {
        imageStateDot.classList.add(target.dotClass);
      } else {
        imageStateDot.className = 'status-indicator-dot';
      }

      // Update Interaction Status Panel
      imageStatusBadge.textContent = target.badgeText;
      imageStatusBadge.className = `status-badge ${target.badgeClass}`;
      imageStatusDesc.textContent = target.statusDesc;
      statusImageIcon.textContent = target.themeIcon;

      // Fade back in
      toggleImage.classList.remove('fade-out');
      toggleImage.classList.add('fade-in');

      isImageTransitioning = false;
    }, 250);
  }

  // Attach onclick event listeners
  if (imageFrame) {
    imageFrame.addEventListener('click', toggleImageAction);
    // Keyboard accessibility (Enter / Space)
    imageFrame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleImageAction();
      }
    });
  }

  if (changeImageBtn) {
    changeImageBtn.addEventListener('click', toggleImageAction);
  }

  // --------------------------------------------------------------------------
  // 5. TEXT HOVER EFFECT FUNCTIONALITY (DHTML MOUSEOVER & MOUSEOUT)
  // --------------------------------------------------------------------------
  
  // Apply hover styling
  function applyTextHoverEffect() {
    // 1. DHTML Style Modification
    interactiveParagraph.style.color = '#7c3aed'; // Purple/Blue accent
    interactiveParagraph.style.fontStyle = 'italic';
    interactiveParagraph.style.fontWeight = '700';
    interactiveParagraph.style.textShadow = '0 2px 10px rgba(124, 58, 237, 0.28)';
    
    // Add class for additional styling enhancements
    interactiveParagraph.classList.add('hover-transformed');

    // 2. Update Live Interaction Status Panel
    textStatusBadge.textContent = 'Hover Active';
    textStatusBadge.className = 'status-badge hover-active';
    textStatusDesc.textContent = 'Interactive styles applied';
    statusTextIcon.textContent = '🎨';

    // 3. Highlight Effect Chips
    effectChips.forEach(chip => chip.classList.add('active'));
  }

  // Restore original default styling
  function restoreTextDefaultEffect() {
    // 1. DHTML Style Restoration
    interactiveParagraph.style.color = '';
    interactiveParagraph.style.fontStyle = '';
    interactiveParagraph.style.fontWeight = '';
    interactiveParagraph.style.textShadow = '';

    interactiveParagraph.classList.remove('hover-transformed');

    // 2. Update Live Interaction Status Panel
    textStatusBadge.textContent = 'Normal';
    textStatusBadge.className = 'status-badge normal';
    textStatusDesc.textContent = 'Default typography active';
    statusTextIcon.textContent = '✨';

    // 3. Reset Effect Chips
    effectChips.forEach(chip => chip.classList.remove('active'));
  }

  // Event Listeners for mouseover & mouseout
  if (hoverParagraphBox) {
    hoverParagraphBox.addEventListener('mouseover', applyTextHoverEffect);
    hoverParagraphBox.addEventListener('mouseout', restoreTextDefaultEffect);

    // Touch support for mobile devices
    hoverParagraphBox.addEventListener('touchstart', (e) => {
      applyTextHoverEffect();
    }, { passive: true });
  }

  // Reset Style Button Handler
  if (resetStyleBtn) {
    resetStyleBtn.addEventListener('click', () => {
      restoreTextDefaultEffect();

      // Visual feedback button press
      const originalText = resetStyleBtn.innerHTML;
      resetStyleBtn.innerHTML = `<span>✓ Reset Done!</span>`;
      resetStyleBtn.style.background = '#ede9fe';
      
      setTimeout(() => {
        resetStyleBtn.innerHTML = originalText;
        resetStyleBtn.style.background = '';
      }, 1000);
    });
  }

  // --------------------------------------------------------------------------
  // 6. SIDEBAR NAVIGATION & SMOOTH SCROLL TRACKING
  // --------------------------------------------------------------------------
  
  // Mobile drawer navigation toggle
  function toggleMobileNav() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', toggleMobileNav);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', toggleMobileNav);
  }

  // Close mobile sidebar when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Active navigation link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNavOnScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

  console.log('INTERACTIFY DHTML Engine initialized successfully.');
});
