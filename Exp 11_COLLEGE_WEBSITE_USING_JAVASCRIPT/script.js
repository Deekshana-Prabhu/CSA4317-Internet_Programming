/**
 * CAMPUS INTERACTIVE – JavaScript Events Demonstration
 * Technologies: HTML5, CSS3, Vanilla JavaScript (ES6+)
 * Events Demonstrated: onclick, mouseover, mouseout, scroll, DOMContentLoaded
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. DOM Element Selectors
  // =========================================================================

  // Paragraph Customization Elements
  const targetParagraph = document.getElementById('customParagraph');
  const paragraphContainer = document.getElementById('customParagraphContainer');
  const statusBanner = document.getElementById('statusBanner');
  const statusMessage = document.getElementById('statusMessage');
  const paragraphIndicator = document.getElementById('paragraphIndicator');

  // Control Buttons
  const btnFontStyle = document.getElementById('btnFontStyle');
  const btnTextColor = document.getElementById('btnTextColor');
  const btnBgColor = document.getElementById('btnBgColor');
  const btnFontSize = document.getElementById('btnFontSize');
  const btnResetStyle = document.getElementById('btnResetStyle');

  // Word Highlighting Elements
  const interactiveWords = document.querySelectorAll('.interactive-word');
  const hoverStatusText = document.getElementById('hoverStatusText');

  // Live Activity Monitor Elements
  const dispFontStyle = document.getElementById('dispFontStyle');
  const dispTextColor = document.getElementById('dispTextColor');
  const textColorSwatch = document.getElementById('textColorSwatch');
  const dispBgColor = document.getElementById('dispBgColor');
  const bgColorSwatch = document.getElementById('bgColorSwatch');
  const dispHoverCount = document.getElementById('dispHoverCount');
  const dispHoveredWords = document.getElementById('dispHoveredWords');

  // Navigation & Mobile Menu Elements
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');
  const campusImg = document.getElementById('campusImg');

  // =========================================================================
  // 2. Styling Data & State Configuration
  // =========================================================================

  // Font Styles List
  const fontStyles = [
    { name: 'Segoe UI / System', family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    { name: 'Georgia Serif', family: "Georgia, 'Times New Roman', Times, serif" },
    { name: 'Trebuchet MS Clean', family: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif" },
    { name: 'Courier Monospace', family: "'Courier New', Courier, monospace" },
    { name: 'Palatino Linotype', family: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
    { name: 'Verdana Sans', family: "Verdana, Geneva, Tahoma, sans-serif" }
  ];

  // Text Colors List
  const textColors = [
    { name: 'Slate Navy', hex: '#1e293b' },
    { name: 'Ocean Teal', hex: '#0f766e' },
    { name: 'Auburn Crimson', hex: '#7c2d12' },
    { name: 'Royal Indigo', hex: '#4338ca' },
    { name: 'Forest Emerald', hex: '#15803d' },
    { name: 'Classic Navy', hex: '#0f2b5c' }
  ];

  // Background Colors List
  const bgColors = [
    { name: 'Soft Slate', hex: '#f8fafc' },
    { name: 'Sky Blue Tint', hex: '#e0f2fe' },
    { name: 'Warm Amber Tint', hex: '#fef3c7' },
    { name: 'Mint Pastel Tint', hex: '#dcfce7' },
    { name: 'Lavender Tint', hex: '#f3e8ff' },
    { name: 'Pure White', hex: '#ffffff' }
  ];

  // Font Sizes List
  const fontSizes = [
    { label: 'Normal (1.10rem / 17.6px)', value: '1.1rem' },
    { label: 'Medium (1.25rem / 20.0px)', value: '1.25rem' },
    { label: 'Large (1.40rem / 22.4px)', value: '1.4rem' },
    { label: 'Extra Large (1.55rem / 24.8px)', value: '1.55rem' }
  ];

  // State Trackers
  let currentFontIdx = 0;
  let currentColorIdx = 0;
  let currentBgIdx = 0;
  let currentSizeIdx = 0;

  // Active Highlighted Words Set
  const activeHoveredWords = new Set();

  // =========================================================================
  // 3. Helper Functions
  // =========================================================================

  /**
   * Updates the status banner with visual animation
   * @param {string} msg Text to display in status notification
   */
  function showStatus(msg) {
    if (!statusMessage || !statusBanner) return;
    statusMessage.textContent = msg;
    statusBanner.classList.remove('highlight-pulse');
    // Trigger reflow to restart animation
    void statusBanner.offsetWidth;
    statusBanner.classList.add('highlight-pulse');
  }

  /**
   * Updates the Live Activity Card (Dashboard) metrics
   */
  function updateActivityMonitor() {
    // 1. Font Style Metric
    if (dispFontStyle) {
      dispFontStyle.textContent = fontStyles[currentFontIdx].name;
    }

    // 2. Text Color Metric
    if (dispTextColor && textColorSwatch) {
      const col = textColors[currentColorIdx];
      dispTextColor.textContent = `${col.name} (${col.hex})`;
      textColorSwatch.style.backgroundColor = col.hex;
    }

    // 3. Background Color Metric
    if (dispBgColor && bgColorSwatch) {
      const bg = bgColors[currentBgIdx];
      dispBgColor.textContent = `${bg.name} (${bg.hex})`;
      bgColorSwatch.style.backgroundColor = bg.hex;
    }

    // 4. Highlighted Words Metric
    if (dispHoverCount && dispHoveredWords) {
      const count = activeHoveredWords.size;
      dispHoverCount.textContent = `${count} Active`;
      if (count > 0) {
        dispHoverCount.classList.add('active');
        dispHoveredWords.textContent = Array.from(activeHoveredWords).join(', ');
      } else {
        dispHoverCount.classList.remove('active');
        dispHoveredWords.textContent = 'None hovered';
      }
    }

    // Update paragraph header badge
    if (paragraphIndicator) {
      const isCustomized = (currentFontIdx !== 0 || currentColorIdx !== 0 || currentBgIdx !== 0 || currentSizeIdx !== 0);
      paragraphIndicator.textContent = isCustomized ? 'Customized' : 'Normal Style';
      paragraphIndicator.style.backgroundColor = isCustomized ? '#dbeafe' : '#e2e8f0';
      paragraphIndicator.style.color = isCustomized ? '#0284c7' : '#475569';
    }
  }

  // =========================================================================
  // 4. Feature 1: Paragraph Appearance Changer (onclick events)
  // =========================================================================

  /**
   * a) Change Font Style
   */
  if (btnFontStyle && targetParagraph) {
    btnFontStyle.addEventListener('click', () => {
      currentFontIdx = (currentFontIdx + 1) % fontStyles.length;
      const selectedFont = fontStyles[currentFontIdx];
      targetParagraph.style.fontFamily = selectedFont.family;
      showStatus(`Font Style changed to "${selectedFont.name}"`);
      updateActivityMonitor();
    });
  }

  /**
   * b) Change Text Color
   */
  if (btnTextColor && targetParagraph) {
    btnTextColor.addEventListener('click', () => {
      currentColorIdx = (currentColorIdx + 1) % textColors.length;
      const selectedColor = textColors[currentColorIdx];
      targetParagraph.style.color = selectedColor.hex;
      showStatus(`Text Color changed to ${selectedColor.name} (${selectedColor.hex})`);
      updateActivityMonitor();
    });
  }

  /**
   * c) Change Background
   */
  if (btnBgColor && paragraphContainer) {
    btnBgColor.addEventListener('click', () => {
      currentBgIdx = (currentBgIdx + 1) % bgColors.length;
      const selectedBg = bgColors[currentBgIdx];
      paragraphContainer.style.backgroundColor = selectedBg.hex;
      showStatus(`Paragraph Background changed to ${selectedBg.name} (${selectedBg.hex})`);
      updateActivityMonitor();
    });
  }

  /**
   * d) Increase Font Size
   */
  if (btnFontSize && targetParagraph) {
    btnFontSize.addEventListener('click', () => {
      currentSizeIdx = (currentSizeIdx + 1) % fontSizes.length;
      const selectedSize = fontSizes[currentSizeIdx];
      targetParagraph.style.fontSize = selectedSize.value;
      showStatus(`Font Size updated to ${selectedSize.label}`);
      updateActivityMonitor();
    });
  }

  /**
   * e) Reset Appearance
   */
  if (btnResetStyle && targetParagraph && paragraphContainer) {
    btnResetStyle.addEventListener('click', () => {
      currentFontIdx = 0;
      currentColorIdx = 0;
      currentBgIdx = 0;
      currentSizeIdx = 0;

      targetParagraph.style.fontFamily = fontStyles[0].family;
      targetParagraph.style.color = textColors[0].hex;
      paragraphContainer.style.backgroundColor = bgColors[0].hex;
      targetParagraph.style.fontSize = fontSizes[0].value;

      showStatus('Paragraph appearance restored to default styles.');
      updateActivityMonitor();
    });
  }

  // =========================================================================
  // 5. Feature 2: Mouse Hover Word Highlighting (mouseover & mouseout events)
  // =========================================================================

  interactiveWords.forEach((wordElement) => {
    const wordText = wordElement.getAttribute('data-word') || wordElement.textContent.trim();

    // mouseover event: Mouse enters the word
    wordElement.addEventListener('mouseover', () => {
      wordElement.classList.add('highlighted');
      activeHoveredWords.add(wordText);

      if (hoverStatusText) {
        hoverStatusText.innerHTML = `Mouse Entered: <strong>"${wordText}"</strong> highlighted via <code>mouseover</code> event.`;
      }
      updateActivityMonitor();
    });

    // mouseout event: Mouse leaves the word
    wordElement.addEventListener('mouseout', () => {
      wordElement.classList.remove('highlighted');
      activeHoveredWords.delete(wordText);

      if (hoverStatusText) {
        if (activeHoveredWords.size > 0) {
          const remaining = Array.from(activeHoveredWords).join(', ');
          hoverStatusText.innerHTML = `Still hovering on: <strong>${remaining}</strong>`;
        } else {
          hoverStatusText.innerHTML = `Mouse Left: <strong>"${wordText}"</strong> restored via <code>mouseout</code> event.`;
        }
      }
      updateActivityMonitor();
    });

    // Keyboard Accessibility (focus and blur support)
    wordElement.addEventListener('focus', () => {
      wordElement.classList.add('highlighted');
      activeHoveredWords.add(wordText);
      updateActivityMonitor();
    });

    wordElement.addEventListener('blur', () => {
      wordElement.classList.remove('highlighted');
      activeHoveredWords.delete(wordText);
      updateActivityMonitor();
    });
  });

  // =========================================================================
  // 6. Navigation, Smooth Scroll & Scrollspy
  // =========================================================================

  // Mobile Menu Toggle
  if (menuToggle && sidebar && sidebarOverlay) {
    const toggleMenu = () => {
      const isOpen = sidebar.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      sidebarOverlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);
    sidebarOverlay.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links on mobile
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  }

  // Active Link Highlight on Scroll (Scrollspy)
  const navSectionMap = [
    { id: 'home', link: document.getElementById('nav-home') },
    { id: 'paragraph-changer', link: document.getElementById('nav-paragraph') },
    { id: 'word-highlighting', link: document.getElementById('nav-words') },
    { id: 'activity-monitor', link: document.getElementById('nav-monitor') },
    { id: 'how-it-works', link: document.getElementById('nav-how') }
  ];

  function handleScrollSpy() {
    const scrollPosition = window.scrollY + 160;

    navSectionMap.forEach(({ id, link }) => {
      const section = document.getElementById(id);
      if (section && link) {
        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          navLinks.forEach((n) => n.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  // Fallback image handler: If Unsplash fails or offline, provide styled SVG campus banner
  if (campusImg) {
    campusImg.addEventListener('error', () => {
      campusImg.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20600%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22sky%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230284c7%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%230f2b5c%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22url(%23sky)%22%2F%3E%3Cg%20fill%3D%22%23ffffff%22%20opacity%3D%220.15%22%3E%3Cpolygon%20points%3D%22400%2C120%20150%2C260%20650%2C260%22%2F%3E%3Crect%20x%3D%22200%22%20y%3D%22260%22%20width%3D%22400%22%20height%3D%22220%22%2F%3E%3Crect%20x%3D%22240%22%20y%3D%22280%22%20width%3D%2240%22%20height%3D%22180%22%20fill%3D%22%23ffffff%22%2F%3E%3Crect%20x%3D%22320%22%20y%3D%22280%22%20width%3D%2240%22%20height%3D%22180%22%20fill%3D%22%23ffffff%22%2F%3E%3Crect%20x%3D%22440%22%20y%3D%22280%22%20width%3D%2240%22%20height%3D%22180%22%20fill%3D%22%23ffffff%22%2F%3E%3Crect%20x%3D%22520%22%20y%3D%22280%22%20width%3D%2240%22%20height%3D%22180%22%20fill%3D%22%23ffffff%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%22400%22%20y%3D%22530%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%3ECAMPUS%20INTERACTIVE%3C%2Ftext%3E%3C%2Fsvg%3E';
    });
  }

  // =========================================================================
  // 7. Initial Initialization
  // =========================================================================
  updateActivityMonitor();
  console.log('Campus Interactive loaded successfully with JavaScript Events!');
});
