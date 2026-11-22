/**
 * DYNAMIC WEB – Interactive DHTML Effects
 * File: script.js
 * Description: Vanilla JavaScript handling DOM manipulation, event listeners,
 *              show/hide text, hover background color changes, and status synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. DOM Element References
  // =========================================================================

  // Body Element for Entire Webpage Background
  const pageBody = document.getElementById('page-body');

  // Text Toggle Elements
  const toggleText = document.getElementById('toggle-text');
  const btnShowText = document.getElementById('btn-show-text');
  const btnHideText = document.getElementById('btn-hide-text');
  const textStatusMsg = document.getElementById('text-status-msg');
  const textStatusDot = document.getElementById('text-status-dot');
  const messageContainer = document.getElementById('message-container');

  // Background Color Changer Elements
  const redSquare = document.getElementById('red-square');
  const blueSquare = document.getElementById('blue-square');
  const btnResetBg = document.getElementById('btn-reset-bg');
  const bgStatusMsg = document.getElementById('bg-status-msg');
  const colorSwatchPreview = document.getElementById('color-swatch-preview');

  // Status Panel Indicators
  const panelTextState = document.getElementById('panel-text-state');
  const panelTextDetail = document.getElementById('panel-text-detail');
  const panelBgState = document.getElementById('panel-bg-state');
  const panelBgDetail = document.getElementById('panel-bg-detail');

  // Sidebar Status Indicators
  const sideTextStatus = document.getElementById('side-text-status');
  const sideBgStatus = document.getElementById('side-bg-status');

  // Navigation & Mobile Drawer Elements
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');

  // =========================================================================
  // 2. Constants & Initial State
  // =========================================================================
  const COLOR_DEFAULT = '#f8fafc';
  const COLOR_LIGHT_RED = '#fee2e2';
  const COLOR_LIGHT_BLUE = '#e0f2fe';

  // Explicit initial state initialization: Text is hidden initially
  toggleText.style.display = 'none';
  updateTextStatus(false);
  updateBgStatus('Default', COLOR_DEFAULT);

  // =========================================================================
  // 3. Feature 1: Show & Hide Text (onclick Events)
  // =========================================================================

  /**
   * Updates text visibility status indicators across the webpage
   * @param {boolean} isVisible
   */
  function updateTextStatus(isVisible) {
    if (isVisible) {
      // Local section status
      if (textStatusMsg) textStatusMsg.textContent = 'Text is currently visible';
      if (textStatusDot) {
        textStatusDot.className = 'status-dot active';
      }

      // Interaction Status Panel card
      if (panelTextState) {
        panelTextState.textContent = 'Visible';
        panelTextState.className = 'state-pill state-visible';
      }
      if (panelTextDetail) {
        panelTextDetail.textContent = 'Paragraph is visible using style.display = "block".';
      }

      // Sidebar mini status
      if (sideTextStatus) {
        sideTextStatus.textContent = 'Visible';
        sideTextStatus.style.color = '#15803d';
      }

      if (messageContainer) {
        messageContainer.classList.add('has-content');
      }
    } else {
      // Local section status
      if (textStatusMsg) textStatusMsg.textContent = 'Text is currently hidden';
      if (textStatusDot) {
        textStatusDot.className = 'status-dot inactive';
      }

      // Interaction Status Panel card
      if (panelTextState) {
        panelTextState.textContent = 'Hidden';
        panelTextState.className = 'state-pill state-hidden';
      }
      if (panelTextDetail) {
        panelTextDetail.textContent = 'Paragraph is hidden using style.display = "none".';
      }

      // Sidebar mini status
      if (sideTextStatus) {
        sideTextStatus.textContent = 'Hidden';
        sideTextStatus.style.color = '#64748b';
      }

      if (messageContainer) {
        messageContainer.classList.remove('has-content');
      }
    }
  }

  /**
   * Displays the hidden paragraph
   */
  function showText() {
    toggleText.style.display = 'block';
    // Trigger smooth fade-in animation
    toggleText.classList.remove('hidden-state');
    toggleText.classList.add('visible-state');
    updateTextStatus(true);
  }

  /**
   * Completely hides the paragraph
   */
  function hideText() {
    toggleText.style.display = 'none';
    toggleText.classList.remove('visible-state');
    toggleText.classList.add('hidden-state');
    updateTextStatus(false);
  }

  // Event Listeners for Show and Hide Buttons
  if (btnShowText) {
    btnShowText.addEventListener('click', (e) => {
      e.preventDefault();
      showText();
    });
  }

  if (btnHideText) {
    btnHideText.addEventListener('click', (e) => {
      e.preventDefault();
      hideText();
    });
  }

  // =========================================================================
  // 4. Feature 2: Background Color Changer (mouseover & mouseout Events)
  // =========================================================================

  /**
   * Updates background status indicators across the webpage
   * @param {string} colorName ('Default', 'Red' / 'Light Red', 'Blue' / 'Light Blue')
   * @param {string} hexCode
   */
  function updateBgStatus(colorName, hexCode) {
    // Section status text & color swatch
    if (bgStatusMsg) bgStatusMsg.textContent = colorName;
    if (colorSwatchPreview) {
      colorSwatchPreview.style.backgroundColor = hexCode;
      colorSwatchPreview.style.borderColor = colorName === 'Default' ? '#cbd5e1' : hexCode;
    }

    // Interaction Status Panel card
    if (panelBgState) {
      panelBgState.textContent = colorName;
      if (colorName.includes('Red')) {
        panelBgState.className = 'state-pill state-red';
        if (panelBgDetail) panelBgDetail.textContent = 'Active: Light Red background shade (#fee2e2).';
      } else if (colorName.includes('Blue')) {
        panelBgState.className = 'state-pill state-blue';
        if (panelBgDetail) panelBgDetail.textContent = 'Active: Light Blue background shade (#e0f2fe).';
      } else {
        panelBgState.className = 'state-pill state-default';
        if (panelBgDetail) panelBgDetail.textContent = 'Active: Standard theme background (#f8fafc).';
      }
    }

    // Sidebar mini status
    if (sideBgStatus) {
      sideBgStatus.textContent = colorName;
      if (colorName.includes('Red')) {
        sideBgStatus.style.color = '#ef4444';
      } else if (colorName.includes('Blue')) {
        sideBgStatus.style.color = '#3b82f6';
      } else {
        sideBgStatus.style.color = '#0f172a';
      }
    }
  }

  /**
   * Applies background color to the entire webpage (document.body)
   * @param {string} color
   * @param {string} label
   */
  function applyPageBackground(color, label) {
    pageBody.style.backgroundColor = color;
    updateBgStatus(label, color);
  }

  /**
   * Restores original default background
   */
  function resetPageBackground() {
    pageBody.style.backgroundColor = COLOR_DEFAULT;
    updateBgStatus('Default', COLOR_DEFAULT);
  }

  // Mouseover and Mouseout for Red Square
  if (redSquare) {
    redSquare.addEventListener('mouseover', () => {
      applyPageBackground(COLOR_LIGHT_RED, 'Light Red');
    });

    redSquare.addEventListener('mouseout', () => {
      resetPageBackground();
    });

    // Support keyboard focus for accessibility
    redSquare.addEventListener('focus', () => {
      applyPageBackground(COLOR_LIGHT_RED, 'Light Red');
    });
    redSquare.addEventListener('blur', () => {
      resetPageBackground();
    });
  }

  // Mouseover and Mouseout for Blue Square
  if (blueSquare) {
    blueSquare.addEventListener('mouseover', () => {
      applyPageBackground(COLOR_LIGHT_BLUE, 'Light Blue');
    });

    blueSquare.addEventListener('mouseout', () => {
      resetPageBackground();
    });

    // Support keyboard focus for accessibility
    blueSquare.addEventListener('focus', () => {
      applyPageBackground(COLOR_LIGHT_BLUE, 'Light Blue');
    });
    blueSquare.addEventListener('blur', () => {
      resetPageBackground();
    });
  }

  // Reset Background Button Event
  if (btnResetBg) {
    btnResetBg.addEventListener('click', (e) => {
      e.preventDefault();
      resetPageBackground();
    });
  }

  // =========================================================================
  // 5. Sidebar Navigation & Active Scroll Tracking
  // =========================================================================

  // Smooth scroll and active link toggle
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });

          // Update active link immediately
          navLinks.forEach((l) => l.classList.remove('active'));
          this.classList.add('active');

          // Close mobile menu if open
          if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            mobileMenuBtn.classList.remove('open');
          }
        }
      }
    });
  });

  // Track scroll position to highlight active section in sidebar
  const sections = document.querySelectorAll('section.page-section');
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Mobile Hamburger Toggle
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      mobileMenuBtn.classList.toggle('open', isOpen);
    });

    // Close sidebar on document click outside sidebar
    document.addEventListener('click', (e) => {
      if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        sidebar.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
      }
    });
  }

  // Log successful initialization
  console.log('DYNAMIC WEB – Interactive DHTML Effects initialized successfully.');
});
