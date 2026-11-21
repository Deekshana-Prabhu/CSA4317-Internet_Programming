/**
 * DYNAMIC FX – Interactive DHTML Playground
 * Vanilla JavaScript Implementation (script.js)
 * Features:
 *   1. Interactive Background Color Changer (mouseover / mouseout)
 *   2. Window Shake Animation (Start / Stop with state tracking)
 *   3. Real-Time Interaction Status Updates
 *   4. Responsive Sidebar & Smooth Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     DOM Element References
     ========================================================================== */
  const pageBody = document.getElementById('page-body');
  const shakeContainer = document.getElementById('shake-container');

  // Background Color Changer elements
  const redSquare = document.getElementById('red-square');
  const blueSquare = document.getElementById('blue-square');
  const greenSquare = document.getElementById('green-square');
  const colorStatusText = document.getElementById('color-status-text');
  const resetBgBtn = document.getElementById('reset-bg-btn');

  // Window Shake Animation elements
  const startShakeBtn = document.getElementById('start-shake-btn');
  const stopShakeBtn = document.getElementById('stop-shake-btn');
  const shakeStatusText = document.getElementById('shake-status-text');
  const shakeIndicatorBadge = document.getElementById('shake-indicator-badge');

  // Interaction Status Dashboard elements
  const currentBgStatus = document.getElementById('current-bg-status');
  const currentBgHex = document.getElementById('current-bg-hex');
  const shakeCardStatus = document.getElementById('shake-card-status');
  const shakeCardDetail = document.getElementById('shake-card-detail');

  // Navigation elements
  const navLinks = document.querySelectorAll('.nav-link');
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const exploreBtn = document.getElementById('explore-btn');

  /* ==========================================================================
     State Management
     ========================================================================== */
  let isShaking = false;

  /* ==========================================================================
     1. Background Color Changer (mouseover / mouseout)
     ========================================================================== */

  /**
   * Applies the selected background theme and updates status indicators
   * @param {string} themeClass - CSS class for the background ('theme-red', 'theme-blue', 'theme-green', or null)
   * @param {string} statusMsg - Status message to display in the demo card
   * @param {string} cardTitle - Display title in the status dashboard
   * @param {string} hexCode - Color code representation
   */
  function setPageBackground(themeClass, statusMsg, cardTitle, hexCode) {
    // Remove any previously active theme classes
    pageBody.classList.remove('theme-red', 'theme-blue', 'theme-green');

    if (themeClass) {
      pageBody.classList.add(themeClass);
    }

    // Update live status message in color changer card
    if (colorStatusText) {
      colorStatusText.textContent = statusMsg;
    }

    // Update Interaction Status Dashboard
    if (currentBgStatus && currentBgHex) {
      currentBgStatus.textContent = cardTitle;
      currentBgHex.textContent = hexCode;
    }
  }

  /**
   * Restores original default background and resets status
   */
  function restoreDefaultBackground() {
    setPageBackground(
      null,
      'Original background restored',
      'Default Gradient',
      'Original state (#f8faff)'
    );
  }

  // --- RED SQUARE: mouseover & mouseout ---
  if (redSquare) {
    redSquare.addEventListener('mouseover', () => {
      setPageBackground(
        'theme-red',
        'Red color selected',
        'Light Red Theme',
        'Shade: #fee2e2'
      );
    });

    redSquare.addEventListener('mouseout', () => {
      restoreDefaultBackground();
    });
  }

  // --- BLUE SQUARE: mouseover & mouseout ---
  if (blueSquare) {
    blueSquare.addEventListener('mouseover', () => {
      setPageBackground(
        'theme-blue',
        'Blue color selected',
        'Light Blue Theme',
        'Shade: #e0f2fe'
      );
    });

    blueSquare.addEventListener('mouseout', () => {
      restoreDefaultBackground();
    });
  }

  // --- GREEN SQUARE: mouseover & mouseout ---
  if (greenSquare) {
    greenSquare.addEventListener('mouseover', () => {
      setPageBackground(
        'theme-green',
        'Green color selected',
        'Light Green Theme',
        'Shade: #dcfce7'
      );
    });

    greenSquare.addEventListener('mouseout', () => {
      restoreDefaultBackground();
    });
  }

  // --- Reset Background Button ---
  if (resetBgBtn) {
    resetBgBtn.addEventListener('click', () => {
      restoreDefaultBackground();
      if (colorStatusText) {
        colorStatusText.textContent = 'Background reset to default';
      }
    });
  }

  /* ==========================================================================
     2. Window Shake Animation (Continuous & Controllable)
     ========================================================================== */

  /**
   * Starts the continuous window shake animation
   */
  function startShakeAnimation() {
    // Prevent multiple animations from stacking
    if (isShaking) {
      return;
    }

    isShaking = true;

    // Apply shake animation class to the main demonstration container
    if (shakeContainer) {
      shakeContainer.classList.add('is-shaking');
    }

    // Update shake section visual badge
    if (shakeIndicatorBadge && shakeStatusText) {
      shakeIndicatorBadge.className = 'badge badge-running';
      shakeStatusText.textContent = 'Animation Running';
    }

    // Update interaction status card
    if (shakeCardStatus && shakeCardDetail) {
      shakeCardStatus.innerHTML = '<span class="badge badge-running"><span class="status-dot"></span> Animation Running</span>';
      shakeCardDetail.textContent = 'Continuous oscillation active (0.38s loop)';
    }

    // Update button states for better visual feedback
    if (startShakeBtn) {
      startShakeBtn.style.opacity = '0.7';
      startShakeBtn.style.pointerEvents = 'none';
    }
    if (stopShakeBtn) {
      stopShakeBtn.style.opacity = '1';
      stopShakeBtn.style.pointerEvents = 'auto';
    }
  }

  /**
   * Immediately stops the window shake animation and restores default position
   */
  function stopShakeAnimation() {
    isShaking = false;

    // Remove animation class
    if (shakeContainer) {
      shakeContainer.classList.remove('is-shaking');
    }

    // Update shake section visual badge
    if (shakeIndicatorBadge && shakeStatusText) {
      shakeIndicatorBadge.className = 'badge badge-stopped';
      shakeStatusText.textContent = 'Animation Stopped';
    }

    // Update interaction status card
    if (shakeCardStatus && shakeCardDetail) {
      shakeCardStatus.innerHTML = '<span class="badge badge-stopped"><span class="status-dot"></span> Animation Stopped</span>';
      shakeCardDetail.textContent = 'Container at rest';
    }

    // Reset button states
    if (startShakeBtn) {
      startShakeBtn.style.opacity = '1';
      startShakeBtn.style.pointerEvents = 'auto';
    }
  }

  // Event Listeners for Start and Stop Shaking
  if (startShakeBtn) {
    startShakeBtn.addEventListener('click', startShakeAnimation);
  }

  if (stopShakeBtn) {
    stopShakeBtn.addEventListener('click', stopShakeAnimation);
  }

  /* ==========================================================================
     3. Smooth Navigation & Active Link Highlighting
     ========================================================================== */

  // Smooth scroll for Explore Features button
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('color-changer');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Smooth scroll and active state for sidebar links
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }

        // Close mobile sidebar on link click
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
        }

        // Update active class
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        sidebar.classList.remove('open');
      }
    });
  }

  // Active navigation highlight based on scroll position
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
});
