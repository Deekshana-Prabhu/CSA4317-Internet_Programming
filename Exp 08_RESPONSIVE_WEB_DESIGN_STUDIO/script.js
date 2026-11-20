/**
 * ============================================================================
 * RESPONSIVE WEB DESIGN – INTERACTIVE APPLICATION JAVASCRIPT
 * Aura Design Studio • Layout Engineering Masterclass
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. Toast Notification System
  // ==========================================================================
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message = 'Copied to clipboard!') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ==========================================================================
  // 2. Sidebar Navigation & ScrollSpy
  // ==========================================================================
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const sections = document.querySelectorAll('.page-section');
  const liveViewportWidth = document.getElementById('liveViewportWidth');

  // Mobile menu toggle
  if (mobileMenuToggle && sidebar && sidebarBackdrop) {
    mobileMenuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarBackdrop.classList.toggle('active');
    });

    sidebarBackdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarBackdrop.classList.remove('active');
    });

    // Close sidebar when clicking a link on mobile
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove('open');
          sidebarBackdrop.classList.remove('active');
        }
      });
    });
  }

  // Update live window width indicator
  function updateWindowWidthIndicator() {
    if (!liveViewportWidth) return;
    const width = window.innerWidth;
    let label = 'Desktop';
    if (width <= 640) label = 'Mobile';
    else if (width <= 1024) label = 'Tablet';
    liveViewportWidth.textContent = `${width}px Viewport (${label})`;
  }

  window.addEventListener('resize', updateWindowWidthIndicator);
  updateWindowWidthIndicator();

  // ScrollSpy with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));


  // ==========================================================================
  // 2.5 Home Section Live Adaptive Preview Controls
  // ==========================================================================
  const homePreviewFrame = document.getElementById('homePreviewFrame');
  const homeWidthSlider = document.getElementById('homeWidthSlider');
  const homeWidthBadge = document.getElementById('homeWidthBadge');
  const homeDeviceButtons = document.querySelectorAll('[data-home-width]');

  function updateHomePreview(width) {
    if (!homePreviewFrame) return;
    homePreviewFrame.style.width = `${width}px`;
    if (homeWidthBadge) homeWidthBadge.textContent = `${width}px`;
    if (homeWidthSlider) homeWidthSlider.value = width;

    homePreviewFrame.classList.remove('state-tablet', 'state-mobile');
    if (width <= 480) {
      homePreviewFrame.classList.add('state-mobile');
    } else if (width <= 768) {
      homePreviewFrame.classList.add('state-tablet');
    }
  }

  homeDeviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      homeDeviceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const w = parseInt(btn.getAttribute('data-home-width'), 10);
      updateHomePreview(w);
    });
  });

  if (homeWidthSlider) {
    homeWidthSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      homeDeviceButtons.forEach(b => {
        b.classList.toggle('active', parseInt(b.getAttribute('data-home-width'), 10) === val);
      });
      updateHomePreview(val);
    });
  }


  // ==========================================================================
  // 3. Section 2: Fixed Layout Interactive Controls
  // ==========================================================================
  const fixedDemoContainer = document.getElementById('fixedDemoContainer');
  const fixedViewportFrame = document.getElementById('fixedViewportFrame');
  const fixedWidthSlider = document.getElementById('fixedWidthSlider');
  const fixedWidthBadge = document.getElementById('fixedWidthBadge');
  const fixedCssWidth = document.getElementById('fixedCssWidth');
  const fixedOverflowAlert = document.getElementById('fixedOverflowAlert');
  const fixedWidthButtons = document.querySelectorAll('[data-fixed-width]');
  const fixedFrameDisplay = document.getElementById('fixedFrameWidthDisplay');

  let currentFixedContainerWidth = 960;
  let currentSimulatedFrameWidth = 1200;

  function updateFixedLayout() {
    if (!fixedDemoContainer || !fixedViewportFrame) return;

    // Apply width to fixed container
    fixedDemoContainer.style.width = `${currentFixedContainerWidth}px`;
    if (fixedWidthBadge) fixedWidthBadge.textContent = `${currentFixedContainerWidth}px`;
    if (fixedCssWidth) fixedCssWidth.textContent = `${currentFixedContainerWidth}px`;
    if (fixedWidthSlider) fixedWidthSlider.value = currentFixedContainerWidth;

    // Check overflow
    const hasOverflow = currentFixedContainerWidth > currentSimulatedFrameWidth;
    if (fixedOverflowAlert) {
      if (hasOverflow) {
        fixedOverflowAlert.classList.add('visible');
        fixedOverflowAlert.querySelector('span').textContent = 
          `Horizontal Overflow Detected! Screen (${currentSimulatedFrameWidth}px) is smaller than the ${currentFixedContainerWidth}px fixed container. Content is clipped.`;
      } else {
        fixedOverflowAlert.classList.remove('visible');
      }
    }
  }

  // Width Buttons
  fixedWidthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      fixedWidthButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFixedContainerWidth = parseInt(btn.getAttribute('data-fixed-width'), 10);
      updateFixedLayout();
    });
  });

  // Width Slider
  if (fixedWidthSlider) {
    fixedWidthSlider.addEventListener('input', (e) => {
      currentFixedContainerWidth = parseInt(e.target.value, 10);
      fixedWidthButtons.forEach(b => {
        b.classList.toggle('active', parseInt(b.getAttribute('data-fixed-width'), 10) === currentFixedContainerWidth);
      });
      updateFixedLayout();
    });
  }

  // Screen View Simulation Buttons for Fixed Section
  const btnSetMobile = document.getElementById('setFixedViewMobile');
  const btnSetTablet = document.getElementById('setFixedViewTablet');
  const btnSetDesktop = document.getElementById('setFixedViewDesktop');

  function setFixedFrameWidth(width, activeBtn) {
    currentSimulatedFrameWidth = width;
    fixedViewportFrame.style.maxWidth = `${width}px`;
    if (fixedFrameDisplay) fixedFrameDisplay.textContent = `${width}px`;
    [btnSetMobile, btnSetTablet, btnSetDesktop].forEach(b => b?.classList.remove('active'));
    activeBtn?.classList.add('active');
    updateFixedLayout();
  }

  btnSetMobile?.addEventListener('click', () => setFixedFrameWidth(375, btnSetMobile));
  btnSetTablet?.addEventListener('click', () => setFixedFrameWidth(768, btnSetTablet));
  btnSetDesktop?.addEventListener('click', () => setFixedFrameWidth(1200, btnSetDesktop));

  updateFixedLayout();


  // ==========================================================================
  // 4. Section 3: Fluid Layout Interactive Controls
  // ==========================================================================
  const fluidDemoContainer = document.getElementById('fluidDemoContainer');
  const fluidWidthSlider = document.getElementById('fluidWidthSlider');
  const fluidWidthBadge = document.getElementById('fluidWidthBadge');
  const fluidMaxWidthToggle = document.getElementById('fluidMaxWidthToggle');
  const fluidLeftCalculated = document.getElementById('fluidLeftCalculated');
  const fluidCenterCalculated = document.getElementById('fluidCenterCalculated');
  const fluidRightCalculated = document.getElementById('fluidRightCalculated');

  function updateFluidMetrics(width) {
    if (!fluidDemoContainer) return;
    fluidDemoContainer.style.width = `${width}px`;
    if (fluidWidthBadge) fluidWidthBadge.textContent = `${width}px`;

    // Calculate computed pixel widths based on 25% / 50% / 25%
    // Deduct inner padding (40px) and column gaps (32px)
    const effectiveWidth = Math.max(width - 72, 100);
    const leftWidth = Math.round(effectiveWidth * 0.25);
    const centerWidth = Math.round(effectiveWidth * 0.50);
    const rightWidth = Math.round(effectiveWidth * 0.25);

    if (fluidLeftCalculated) fluidLeftCalculated.textContent = `Computed: ~${leftWidth}px`;
    if (fluidCenterCalculated) fluidCenterCalculated.textContent = `Computed: ~${centerWidth}px`;
    if (fluidRightCalculated) fluidRightCalculated.textContent = `Computed: ~${rightWidth}px`;
  }

  if (fluidWidthSlider) {
    fluidWidthSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      updateFluidMetrics(val);
    });
    updateFluidMetrics(parseInt(fluidWidthSlider.value, 10));
  }

  if (fluidMaxWidthToggle) {
    fluidMaxWidthToggle.addEventListener('change', (e) => {
      if (fluidDemoContainer) {
        fluidDemoContainer.style.maxWidth = e.target.checked ? '1100px' : 'none';
      }
    });
  }


  // ==========================================================================
  // 5. Section 4: Responsive Breakpoint Simulator
  // ==========================================================================
  const responsiveDemoFrame = document.getElementById('responsiveDemoFrame');
  const responsiveWidthSlider = document.getElementById('responsiveWidthSlider');
  const responsiveWidthBadge = document.getElementById('responsiveWidthBadge');
  const bpMobile = document.getElementById('bpMobileIndicator');
  const bpTablet = document.getElementById('bpTabletIndicator');
  const bpDesktop = document.getElementById('bpDesktopIndicator');
  const activeRulePill = document.getElementById('activeRulePill');
  const presetBtns = document.querySelectorAll('.preset-btn');

  function updateResponsiveSimulator(width) {
    if (!responsiveDemoFrame) return;
    responsiveDemoFrame.style.width = `${width}px`;
    if (responsiveWidthBadge) responsiveWidthBadge.textContent = `${width}px`;
    if (responsiveWidthSlider) responsiveWidthSlider.value = width;

    // Reset state classes
    responsiveDemoFrame.classList.remove('is-mobile', 'is-tablet', 'is-desktop');
    bpMobile?.classList.remove('active');
    bpTablet?.classList.remove('active');
    bpDesktop?.classList.remove('active');

    // Determine Breakpoint
    if (width <= 640) {
      responsiveDemoFrame.classList.add('is-mobile');
      bpMobile?.classList.add('active');
      if (activeRulePill) {
        activeRulePill.innerHTML = `Active Rule: <code>@media (max-width: 640px)</code> [Mobile Reflow]`;
      }
    } else if (width <= 1024) {
      responsiveDemoFrame.classList.add('is-tablet');
      bpTablet?.classList.add('active');
      if (activeRulePill) {
        activeRulePill.innerHTML = `Active Rule: <code>@media (min-width: 641px) and (max-width: 1024px)</code> [Tablet 2-Col]`;
      }
    } else {
      responsiveDemoFrame.classList.add('is-desktop');
      bpDesktop?.classList.add('active');
      if (activeRulePill) {
        activeRulePill.innerHTML = `Active Rule: <code>@media (min-width: 1025px)</code> [Desktop 3-Col]`;
      }
    }
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const width = parseInt(btn.getAttribute('data-width'), 10);
      updateResponsiveSimulator(width);
    });
  });

  if (responsiveWidthSlider) {
    responsiveWidthSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      presetBtns.forEach(b => {
        b.classList.toggle('active', parseInt(b.getAttribute('data-width'), 10) === val);
      });
      updateResponsiveSimulator(val);
    });
    updateResponsiveSimulator(1100);
  }


  // ==========================================================================
  // 6. Section 5: CSS Flexbox Playground
  // ==========================================================================
  const flexCanvas = document.getElementById('flexCanvas');
  const flexCodeOutput = document.getElementById('flexCodeOutput');
  const flexAxisHint = document.getElementById('flexAxisHint');
  const flexItemCountBadge = document.getElementById('flexItemCountBadge');
  const addFlexItemBtn = document.getElementById('addFlexItemBtn');
  const removeFlexItemBtn = document.getElementById('removeFlexItemBtn');
  const resetFlexboxBtn = document.getElementById('resetFlexboxBtn');
  const copyFlexCssBtn = document.getElementById('copyFlexCssBtn');

  const flexState = {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    gap: '16px',
    itemCount: 4
  };

  function updateFlexboxPlayground() {
    if (!flexCanvas) return;

    // Apply styles to canvas
    flexCanvas.style.flexDirection = flexState.flexDirection;
    flexCanvas.style.justifyContent = flexState.justifyContent;
    flexCanvas.style.alignItems = flexState.alignItems;
    flexCanvas.style.flexWrap = flexState.flexWrap;
    flexCanvas.style.gap = flexState.gap;

    // Axis Hint
    const isRow = flexState.flexDirection.startsWith('row');
    if (flexAxisHint) {
      flexAxisHint.textContent = isRow 
        ? `Main Axis: Horizontal (${flexState.flexDirection}) • Cross Axis: Vertical`
        : `Main Axis: Vertical (${flexState.flexDirection}) • Cross Axis: Horizontal`;
    }

    // Code output
    if (flexCodeOutput) {
      flexCodeOutput.innerHTML = `<code>.container {
  display: flex;
  flex-direction: ${flexState.flexDirection};
  justify-content: ${flexState.justifyContent};
  align-items: ${flexState.alignItems};
  flex-wrap: ${flexState.flexWrap};
  gap: ${flexState.gap};
}</code>`;
    }

    // Sync button active states
    document.querySelectorAll('[data-prop]').forEach(btn => {
      const prop = btn.getAttribute('data-prop');
      const val = btn.getAttribute('data-val');
      btn.classList.toggle('active', flexState[prop] === val);
    });

    if (flexItemCountBadge) {
      flexItemCountBadge.textContent = `${flexState.itemCount} Items`;
    }
  }

  // Handle flex control clicks
  document.querySelectorAll('[data-prop]').forEach(btn => {
    btn.addEventListener('click', () => {
      const prop = btn.getAttribute('data-prop');
      const val = btn.getAttribute('data-val');
      if (prop && val) {
        flexState[prop] = val;
        updateFlexboxPlayground();
      }
    });
  });

  // Add / Remove Flex Items
  addFlexItemBtn?.addEventListener('click', () => {
    if (flexState.itemCount >= 10) return;
    flexState.itemCount++;
    const newItem = document.createElement('div');
    newItem.className = 'flex-box-item';
    newItem.setAttribute('data-item', flexState.itemCount);
    newItem.innerHTML = `
      <span class="item-id">Item ${flexState.itemCount}</span>
      <span class="item-size">flex-grow: 0</span>
    `;
    flexCanvas.appendChild(newItem);
    updateFlexboxPlayground();
  });

  removeFlexItemBtn?.addEventListener('click', () => {
    if (flexState.itemCount <= 2) return;
    const items = flexCanvas.querySelectorAll('.flex-box-item');
    if (items.length > 0) {
      items[items.length - 1].remove();
      flexState.itemCount--;
      updateFlexboxPlayground();
    }
  });

  resetFlexboxBtn?.addEventListener('click', () => {
    flexState.flexDirection = 'row';
    flexState.justifyContent = 'flex-start';
    flexState.alignItems = 'stretch';
    flexState.flexWrap = 'wrap';
    flexState.gap = '16px';
    updateFlexboxPlayground();
    showToast('Flexbox properties reset to defaults');
  });

  copyFlexCssBtn?.addEventListener('click', () => {
    const cssText = `.container {\n  display: flex;\n  flex-direction: ${flexState.flexDirection};\n  justify-content: ${flexState.justifyContent};\n  align-items: ${flexState.alignItems};\n  flex-wrap: ${flexState.flexWrap};\n  gap: ${flexState.gap};\n}`;
    navigator.clipboard.writeText(cssText).then(() => {
      showToast('Flexbox CSS copied to clipboard!');
    });
  });

  updateFlexboxPlayground();


  // ==========================================================================
  // 7. Section 6: CSS Grid Playground
  // ==========================================================================
  const gridCanvas = document.getElementById('gridCanvas');
  const gridCodeOutput = document.getElementById('gridCodeOutput');
  const gridTrackHint = document.getElementById('gridTrackHint');
  const gridItemCountBadge = document.getElementById('gridItemCountBadge');
  const addGridItemBtn = document.getElementById('addGridItemBtn');
  const removeGridItemBtn = document.getElementById('removeGridItemBtn');
  const resetGridBtn = document.getElementById('resetGridBtn');
  const copyGridCssBtn = document.getElementById('copyGridCssBtn');

  const gridState = {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    gridAutoRows: '110px',
    itemCount: 6
  };

  function updateGridPlayground() {
    if (!gridCanvas) return;

    // Apply styles
    gridCanvas.style.gridTemplateColumns = gridState.gridTemplateColumns;
    gridCanvas.style.gap = gridState.gap;
    gridCanvas.style.gridAutoRows = gridState.gridAutoRows;

    // Track Hint
    if (gridTrackHint) {
      gridTrackHint.textContent = `Columns: ${gridState.gridTemplateColumns} • Gap: ${gridState.gap} • Rows: ${gridState.gridAutoRows}`;
    }

    // Code output
    if (gridCodeOutput) {
      gridCodeOutput.innerHTML = `<code>.grid-container {
  display: grid;
  grid-template-columns: ${gridState.gridTemplateColumns};
  grid-auto-rows: ${gridState.gridAutoRows};
  gap: ${gridState.gap};
}</code>`;
    }

    // Update active states
    document.querySelectorAll('[data-grid-cols]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-grid-cols') === gridState.gridTemplateColumns);
    });
    document.querySelectorAll('[data-gap]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-gap') === gridState.gap);
    });
    document.querySelectorAll('[data-row-height]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-row-height') === gridState.gridAutoRows);
    });

    if (gridItemCountBadge) {
      gridItemCountBadge.textContent = `${gridState.itemCount} Items`;
    }
  }

  // Column Presets
  document.querySelectorAll('[data-grid-cols]').forEach(btn => {
    btn.addEventListener('click', () => {
      gridState.gridTemplateColumns = btn.getAttribute('data-grid-cols');
      updateGridPlayground();
    });
  });

  // Gap Presets
  document.querySelectorAll('[data-gap]').forEach(btn => {
    btn.addEventListener('click', () => {
      gridState.gap = btn.getAttribute('data-gap');
      updateGridPlayground();
    });
  });

  // Row Height Presets
  document.querySelectorAll('[data-row-height]').forEach(btn => {
    btn.addEventListener('click', () => {
      gridState.gridAutoRows = btn.getAttribute('data-row-height');
      updateGridPlayground();
    });
  });

  // Add / Remove Grid Items
  addGridItemBtn?.addEventListener('click', () => {
    if (gridState.itemCount >= 12) return;
    gridState.itemCount++;
    const newItem = document.createElement('div');
    newItem.className = 'grid-box-item';
    newItem.setAttribute('data-grid-id', gridState.itemCount);
    newItem.innerHTML = `
      <span class="grid-num">Cell ${gridState.itemCount}</span>
      <span class="grid-meta">1fr</span>
    `;
    gridCanvas.appendChild(newItem);
    updateGridPlayground();
  });

  removeGridItemBtn?.addEventListener('click', () => {
    if (gridState.itemCount <= 2) return;
    const items = gridCanvas.querySelectorAll('.grid-box-item');
    if (items.length > 0) {
      items[items.length - 1].remove();
      gridState.itemCount--;
      updateGridPlayground();
    }
  });

  resetGridBtn?.addEventListener('click', () => {
    gridState.gridTemplateColumns = 'repeat(3, 1fr)';
    gridState.gap = '16px';
    gridState.gridAutoRows = '110px';
    updateGridPlayground();
    showToast('Grid properties reset to defaults');
  });

  copyGridCssBtn?.addEventListener('click', () => {
    const cssText = `.grid-container {\n  display: grid;\n  grid-template-columns: ${gridState.gridTemplateColumns};\n  grid-auto-rows: ${gridState.gridAutoRows};\n  gap: ${gridState.gap};\n}`;
    navigator.clipboard.writeText(cssText).then(() => {
      showToast('Grid CSS copied to clipboard!');
    });
  });

  updateGridPlayground();


  // ==========================================================================
  // 8. Section 7: Responsive Playground Simulator
  // ==========================================================================
  const simFrame = document.getElementById('simResizableFrame');
  const simSlider = document.getElementById('simWidthSlider');
  const simReadout = document.getElementById('simWidthReadout');
  const browserMetaBadge = document.getElementById('browserMetaBadge');
  const simBtns = document.querySelectorAll('.sim-btn');
  const simMobileMenuToggle = document.getElementById('simMobileMenuToggle');
  const simMobileDrawer = document.getElementById('simMobileDrawer');

  function updateSimulatorFrame(width) {
    if (!simFrame) return;

    if (typeof width === 'string' && width === '100%') {
      simFrame.style.width = '100%';
      const currentWidth = simFrame.offsetWidth || 1140;
      if (simReadout) simReadout.textContent = `100% (${currentWidth}px)`;
      if (simSlider) simSlider.value = currentWidth;
      applySimulatorState(currentWidth);
      return;
    }

    const numWidth = typeof width === 'number' ? width : parseInt(width, 10);
    simFrame.style.width = `${numWidth}px`;
    if (simReadout) simReadout.textContent = `${numWidth}px`;
    if (simSlider) simSlider.value = numWidth;
    applySimulatorState(numWidth);
  }

  function applySimulatorState(width) {
    simFrame.classList.remove('state-tablet', 'state-mobile');
    let label = 'DESKTOP VIEW';

    if (width <= 480) {
      simFrame.classList.add('state-mobile');
      label = 'MOBILE VIEW';
    } else if (width <= 820) {
      simFrame.classList.add('state-tablet');
      label = 'TABLET VIEW';
    }

    if (browserMetaBadge) {
      browserMetaBadge.innerHTML = `<span class="mode-tag">${label}</span> &bull; ${width}px`;
    }
  }

  simBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      simBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetWidth = btn.getAttribute('data-sim-width');
      updateSimulatorFrame(targetWidth);
    });
  });

  if (simSlider) {
    simSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      simBtns.forEach(b => {
        const btnVal = b.getAttribute('data-sim-width');
        b.classList.toggle('active', parseInt(btnVal, 10) === val);
      });
      updateSimulatorFrame(val);
    });
  }

  // Simulator mobile drawer toggle
  if (simMobileMenuToggle && simMobileDrawer) {
    simMobileMenuToggle.addEventListener('click', () => {
      simMobileDrawer.classList.toggle('open');
    });
  }


  // ==========================================================================
  // 8.5 Section 8: Comparison Matrix Interactive Column Filter
  // ==========================================================================
  const comparisonTable = document.querySelector('.comparison-table');
  const comparisonFilterBtns = document.querySelectorAll('#comparisonFilterGroup [data-highlight]');

  comparisonFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      comparisonFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const highlight = btn.getAttribute('data-highlight');

      if (comparisonTable) {
        comparisonTable.classList.remove('highlight-fixed-mode', 'highlight-fluid-mode', 'highlight-resp-mode');
        if (highlight === 'fixed') {
          comparisonTable.classList.add('highlight-fixed-mode');
        } else if (highlight === 'fluid') {
          comparisonTable.classList.add('highlight-fluid-mode');
        } else if (highlight === 'resp') {
          comparisonTable.classList.add('highlight-resp-mode');
        }
      }
    });
  });


  // ==========================================================================
  // 9. Section 9: Code Examples Tabs & Copy Buttons
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.code-tab-btn');
  const tabPanes = document.querySelectorAll('.code-tab-pane');
  const copyCodeButtons = document.querySelectorAll('.copy-code-btn');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  copyCodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const codeElem = document.getElementById(targetId);
      if (codeElem) {
        navigator.clipboard.writeText(codeElem.textContent).then(() => {
          showToast('Code snippet copied to clipboard!');
        });
      }
    });
  });


  // ==========================================================================
  // 10. Section 10: Interactive Knowledge Check Quiz
  // ==========================================================================
  const quizItems = document.querySelectorAll('.quiz-item');

  quizItems.forEach(item => {
    const options = item.querySelectorAll('.quiz-opt');
    const feedback = item.querySelector('.quiz-feedback');

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        // Clear previous state for this question
        options.forEach(o => o.classList.remove('correct', 'wrong'));
        const isCorrect = opt.getAttribute('data-answer') === 'correct';

        if (isCorrect) {
          opt.classList.add('correct');
          if (feedback) {
            feedback.className = 'quiz-feedback success';
            feedback.textContent = '✓ Correct! Excellent grasp of layout architecture.';
          }
        } else {
          opt.classList.add('wrong');
          // Highlight the right one too
          const correctBtn = item.querySelector('[data-answer="correct"]');
          correctBtn?.classList.add('correct');
          if (feedback) {
            feedback.className = 'quiz-feedback error';
            feedback.textContent = '✕ Incorrect. The highlighted option is the correct answer.';
          }
        }
      });
    });
  });


  // ==========================================================================
  // 11. Back to Top Button
  // ==========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

});
