/**
 * HTML5 EVOLVE – Interactive Educational Application
 * Vanilla ES6+ JavaScript
 * Zero external libraries or frameworks required.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Toast Notification Utility
  // =========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info', duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.25s ease-out forwards';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, duration);
  }

  // =========================================================================
  // 2. Mobile Sidebar & Navigation Active Highlighting
  // =========================================================================
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const appSidebar = document.getElementById('appSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.content-section');

  function toggleSidebar(open) {
    if (!appSidebar || !sidebarOverlay) return;
    const shouldOpen = open !== undefined ? open : !appSidebar.classList.contains('sidebar-open');
    if (shouldOpen) {
      appSidebar.classList.add('sidebar-open');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      appSidebar.classList.remove('sidebar-open');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => toggleSidebar());
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
  }

  // Close sidebar on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        toggleSidebar(false);
      }
    });
  });

  // IntersectionObserver for active section highlighting
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('data-target') === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  } else {
    // Scroll fallback
    window.addEventListener('scroll', () => {
      let currentSection = '';
      const scrollPos = window.pageYOffset + 200;
      sections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
          currentSection = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        if (link.getAttribute('data-target') === currentSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });
  }

  // Back to Top Button
  const btnBackToTop = document.getElementById('btnBackToTop');
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 3. Code Copy Buttons with Fallback
  // =========================================================================
  const copyButtons = document.querySelectorAll('[data-copy-target]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const codeText = targetElement.innerText || targetElement.textContent;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(codeText);
        } else {
          // Fallback for non-secure / file:// protocols
          const textArea = document.createElement('textarea');
          textArea.value = codeText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
        btn.style.backgroundColor = 'var(--color-success)';
        btn.style.color = '#ffffff';

        showToast('Code copied to clipboard!', 'success', 2000);

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        showToast('Unable to copy code automatically', 'info', 2000);
      }
    });
  });

  // =========================================================================
  // 4. Interactive Wireframe Semantic Inspector
  // =========================================================================
  const wireframeBlocks = document.querySelectorAll('.wf-block');
  const inspectorTag = document.getElementById('inspectorTag');
  const inspectorTitle = document.getElementById('inspectorTitle');
  const inspectorDesc = document.getElementById('inspectorDesc');
  const inspectorAria = document.getElementById('inspectorAria');
  const inspectorSeo = document.getElementById('inspectorSeo');
  const inspectorParent = document.getElementById('inspectorParent');

  const semanticData = {
    header: {
      tag: '<header>',
      title: 'Page / Section Header Landmark',
      desc: 'The <header> element represents introductory content, usually holding a group of introductory or navigational aids. It may contain a heading element, a logo, search form, or author name.',
      aria: 'role="banner" (when direct child of <body>)',
      seo: 'Critical: Tells search engines where brand identity and top-level hierarchy begin.',
      parent: '<body>, <article>, <section>, <aside>'
    },
    nav: {
      tag: '<nav>',
      title: 'Navigation Section Landmark',
      desc: 'The <nav> element designates a section of major navigational links. Assistive technologies allow screen reader users to skip past or jump directly into this block.',
      aria: 'role="navigation"',
      seo: 'High: Clarifies core site architecture and internal link crawl pathways.',
      parent: '<body>, <header>, <footer>'
    },
    main: {
      tag: '<main>',
      title: 'Main Content Area Landmark',
      desc: 'The <main> element encapsulates the dominant, non-repeating content unique to the document. There must not be more than one visible <main> element per HTML page.',
      aria: 'role="main"',
      seo: 'Essential: Designates the primary authoritative topic for web indexers.',
      parent: '<body>'
    },
    section: {
      tag: '<section>',
      title: 'Thematic Grouping Landmark',
      desc: 'The <section> element represents a standalone thematic grouping of content, typically accompanied by its own heading. Use it to divide long documents into logical chapters or modules.',
      aria: 'role="region" (when accessible name is provided)',
      seo: 'High: Helps search engines segment long pages into granular topical sections.',
      parent: '<body>, <main>, <article>'
    },
    article: {
      tag: '<article>',
      title: 'Self-Contained Content Landmark',
      desc: 'The <article> element represents a self-contained composition intended to be independently distributable or reusable (e.g., blog post, news story, forum comment, or product card).',
      aria: 'role="article"',
      seo: 'Essential: Frequently syndicated via RSS feeds and Google Discover highlights.',
      parent: '<body>, <main>, <section>'
    },
    aside: {
      tag: '<aside>',
      title: 'Complementary Sidebar Landmark',
      desc: 'The <aside> element represents a portion of a document whose content is only indirectly related to the main content (e.g. sidebars, callout boxes, related links, advertising).',
      aria: 'role="complementary"',
      seo: 'Moderate: Informs bots that enclosed content is secondary context.',
      parent: '<body>, <main>, <article>, <section>'
    },
    footer: {
      tag: '<footer>',
      title: 'Page / Section Footer Landmark',
      desc: 'The <footer> element contains concluding information regarding its nearest ancestor section or root document: author attribution, copyright data, legal links, or back-to-top anchors.',
      aria: 'role="contentinfo" (when child of <body>)',
      seo: 'High: Establishes publisher legitimacy, copyrights, and sitemap references.',
      parent: '<body>, <article>, <section>, <aside>'
    }
  };

  function updateInspector(tagKey) {
    const data = semanticData[tagKey];
    if (!data || !inspectorTag) return;

    inspectorTag.textContent = data.tag;
    inspectorTitle.textContent = data.title;
    inspectorDesc.textContent = data.desc;
    inspectorAria.textContent = data.aria;
    inspectorSeo.textContent = data.seo;
    inspectorParent.textContent = data.parent;

    wireframeBlocks.forEach(b => b.classList.remove('active'));
    const matched = document.querySelectorAll(`.wf-block[data-tag="${tagKey}"]`);
    matched.forEach(m => m.classList.add('active'));
  }

  wireframeBlocks.forEach(block => {
    block.addEventListener('click', (e) => {
      e.stopPropagation();
      const tag = block.getAttribute('data-tag');
      if (tag) updateInspector(tag);
    });

    block.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const tag = block.getAttribute('data-tag');
        if (tag) updateInspector(tag);
      }
    });
  });

  // =========================================================================
  // 5. Native Audio Demonstration (Offline Synthetic Tone Generator)
  // =========================================================================
  const nativeAudioPlayer = document.getElementById('nativeAudioPlayer');
  const btnPlayChime = document.getElementById('btnPlayChime');
  const btnPlayChord = document.getElementById('btnPlayChord');

  // Generate an offline synthetic WAV audio data URL to feed <audio controls>
  function createSyntheticWavDataUri(freq = 440, duration = 1.0) {
    const sampleRate = 8000;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples);
    const view = new DataView(buffer);

    // Write WAV header
    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate, true);
    view.setUint16(32, 1, true);
    view.setUint16(34, 8, true); // 8-bit
    writeString(36, 'data');
    view.setUint32(40, numSamples, true);

    // Audio samples: simple decay envelope
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.max(0, 1 - (t / duration));
      const sample = Math.sin(2 * Math.PI * freq * t) * envelope;
      view.setUint8(44 + i, Math.floor((sample + 1) * 127.5));
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  // Preload a gentle C chime into the native <audio> player
  try {
    const initialWavUrl = createSyntheticWavDataUri(523.25, 1.2); // C5
    if (nativeAudioPlayer) {
      nativeAudioPlayer.src = initialWavUrl;
    }
  } catch (e) {
    // Graceful fallback
  }

  // Web Audio Synth for live button tests
  function playSynthTone(notes = [440], duration = 0.8) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        showToast('Web Audio not supported in this browser version', 'info');
        return;
      }
      const ctx = new AudioContext();
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + (idx * 0.08));
        osc.stop(ctx.currentTime + duration + (idx * 0.08));
      });
      showToast('Playing synthetic HTML5 Web Audio tone...', 'info', 1500);
    } catch (err) {
      showToast('Audio playback initiated.', 'info', 1500);
    }
  }

  if (btnPlayChime) {
    btnPlayChime.addEventListener('click', () => {
      // C5, E5, G5 chime
      playSynthTone([523.25, 659.25, 783.99], 1.0);
    });
  }

  if (btnPlayChord) {
    btnPlayChord.addEventListener('click', () => {
      // Major 7th chord: C4, E4, G4, B4
      playSynthTone([261.63, 329.63, 392.00, 493.88], 1.4);
    });
  }

  // =========================================================================
  // 6. Simulated HTML5 Video Player (Canvas Rendered)
  // =========================================================================
  const videoCanvas = document.getElementById('videoCanvas');
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const scrubberFill = document.getElementById('scrubberFill');
  const videoTime = document.getElementById('videoTime');
  const playIcon = document.getElementById('playIcon');

  let isVideoPlaying = false;
  let videoCurrentTime = 0;
  const videoTotalDuration = 10; // seconds
  let videoAnimationId = null;

  function renderVideoFrame(ctx, time) {
    const width = videoCanvas.width;
    const height = videoCanvas.height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Animated rotating circles
    const cx = width / 2;
    const cy = height / 2;
    const angle = (time * 1.5) % (Math.PI * 2);

    // Orbit 1
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Planet
    const px = cx + Math.cos(angle) * 60;
    const py = cy + Math.sin(angle) * 60;
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Center badge
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#2563eb';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HTML5', cx, cy - 6);
    ctx.font = '10px monospace';
    ctx.fillText('VIDEO', cx, cy + 8);

    // Wave at bottom
    ctx.beginPath();
    ctx.moveTo(0, height - 20);
    for (let x = 0; x < width; x += 5) {
      const y = height - 20 + Math.sin((x * 0.05) + (time * 4)) * 8;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fillStyle = 'rgba(124, 58, 237, 0.4)';
    ctx.fill();
  }

  function tickVideo() {
    if (!videoCanvas) return;
    const ctx = videoCanvas.getContext('2d');
    videoCurrentTime += 0.03;

    if (videoCurrentTime >= videoTotalDuration) {
      videoCurrentTime = 0;
    }

    renderVideoFrame(ctx, videoCurrentTime);

    // Update scrubber & time
    const pct = (videoCurrentTime / videoTotalDuration) * 100;
    if (scrubberFill) scrubberFill.style.width = `${pct}%`;
    if (videoTime) {
      const curSec = Math.floor(videoCurrentTime);
      videoTime.textContent = `00:0${curSec} / 00:10`;
    }

    if (isVideoPlaying) {
      videoAnimationId = requestAnimationFrame(tickVideo);
    }
  }

  // Initial render
  if (videoCanvas) {
    const ctx = videoCanvas.getContext('2d');
    renderVideoFrame(ctx, 0);
  }

  if (videoPlayBtn) {
    videoPlayBtn.addEventListener('click', () => {
      isVideoPlaying = !isVideoPlaying;
      if (isVideoPlaying) {
        if (playIcon) {
          playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
        }
        tickVideo();
      } else {
        if (playIcon) {
          playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
        }
        if (videoAnimationId) cancelAnimationFrame(videoAnimationId);
      }
    });
  }

  // =========================================================================
  // 7. Interactive Live Canvas Tool
  // =========================================================================
  const interactiveCanvas = document.getElementById('interactiveCanvas');
  const btnCanvasWaves = document.getElementById('btnCanvasWaves');
  const btnCanvasParticles = document.getElementById('btnCanvasParticles');
  const btnCanvasDraw = document.getElementById('btnCanvasDraw');
  const btnCanvasClear = document.getElementById('btnCanvasClear');

  let canvasMode = 'waves'; // 'waves', 'particles', 'draw'
  let canvasAnimId = null;
  let waveTime = 0;

  // Particle system state
  const particles = [];
  const numParticles = 30;

  function initParticles() {
    particles.length = 0;
    const w = interactiveCanvas.width;
    const h = interactiveCanvas.height;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2.5 + 1.5
      });
    }
  }

  function loopCanvas() {
    if (!interactiveCanvas) return;
    const ctx = interactiveCanvas.getContext('2d');
    const w = interactiveCanvas.width;
    const h = interactiveCanvas.height;

    if (canvasMode === 'waves') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      waveTime += 0.04;

      // Draw 3 layered waves
      const waveConfigs = [
        { color: 'rgba(37, 99, 235, 0.4)', amp: 20, freq: 0.02, speed: 1.0 },
        { color: 'rgba(124, 58, 237, 0.4)', amp: 16, freq: 0.025, speed: -1.2 },
        { color: 'rgba(6, 182, 212, 0.5)', amp: 12, freq: 0.03, speed: 1.5 }
      ];

      waveConfigs.forEach(cfg => {
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        for (let x = 0; x <= w; x += 4) {
          const y = (h / 2) + Math.sin((x * cfg.freq) + (waveTime * cfg.speed)) * cfg.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fillStyle = cfg.color;
        ctx.fill();
      });

      canvasAnimId = requestAnimationFrame(loopCanvas);
    } else if (canvasMode === 'particles') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${1 - dist / 60})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      canvasAnimId = requestAnimationFrame(loopCanvas);
    }
  }

  function setCanvasMode(mode) {
    canvasMode = mode;
    if (canvasAnimId) cancelAnimationFrame(canvasAnimId);

    [btnCanvasWaves, btnCanvasParticles, btnCanvasDraw].forEach(b => {
      if (b) b.classList.remove('active');
    });

    if (mode === 'waves') {
      btnCanvasWaves.classList.add('active');
      loopCanvas();
    } else if (mode === 'particles') {
      btnCanvasParticles.classList.add('active');
      initParticles();
      loopCanvas();
    } else if (mode === 'draw') {
      btnCanvasDraw.classList.add('active');
      const ctx = interactiveCanvas.getContext('2d');
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, interactiveCanvas.width, interactiveCanvas.height);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Click & Drag mouse to draw on HTML5 Canvas surface', interactiveCanvas.width / 2, interactiveCanvas.height / 2);
    }
  }

  // Mouse drawing listeners
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  if (interactiveCanvas) {
    interactiveCanvas.addEventListener('mousedown', (e) => {
      if (canvasMode !== 'draw') return;
      isDrawing = true;
      const rect = interactiveCanvas.getBoundingClientRect();
      const scaleX = interactiveCanvas.width / rect.width;
      const scaleY = interactiveCanvas.height / rect.height;
      lastX = (e.clientX - rect.left) * scaleX;
      lastY = (e.clientY - rect.top) * scaleY;
    });

    interactiveCanvas.addEventListener('mousemove', (e) => {
      if (!isDrawing || canvasMode !== 'draw') return;
      const ctx = interactiveCanvas.getContext('2d');
      const rect = interactiveCanvas.getBoundingClientRect();
      const scaleX = interactiveCanvas.width / rect.width;
      const scaleY = interactiveCanvas.height / rect.height;
      const curX = (e.clientX - rect.left) * scaleX;
      const curY = (e.clientY - rect.top) * scaleY;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(curX, curY);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      lastX = curX;
      lastY = curY;
    });

    window.addEventListener('mouseup', () => { isDrawing = false; });
  }

  if (btnCanvasWaves) btnCanvasWaves.addEventListener('click', () => setCanvasMode('waves'));
  if (btnCanvasParticles) btnCanvasParticles.addEventListener('click', () => setCanvasMode('particles'));
  if (btnCanvasDraw) btnCanvasDraw.addEventListener('click', () => setCanvasMode('draw'));
  if (btnCanvasClear) {
    btnCanvasClear.addEventListener('click', () => {
      const ctx = interactiveCanvas.getContext('2d');
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, interactiveCanvas.width, interactiveCanvas.height);
      showToast('Canvas cleared', 'info', 1500);
    });
  }

  // Start wave canvas on load
  if (interactiveCanvas) loopCanvas();

  // =========================================================================
  // 8. Interactive Inline SVG Customization
  // =========================================================================
  const interactiveSvg = document.getElementById('interactiveSvg');
  const btnSvgTheme1 = document.getElementById('btnSvgTheme1');
  const btnSvgTheme2 = document.getElementById('btnSvgTheme2');
  const btnSvgAnimate = document.getElementById('btnSvgAnimate');
  const svgStop1 = document.getElementById('svgStop1');
  const svgStop2 = document.getElementById('svgStop2');

  if (btnSvgTheme1 && svgStop1 && svgStop2) {
    btnSvgTheme1.addEventListener('click', () => {
      svgStop1.setAttribute('stop-color', '#2563eb');
      svgStop2.setAttribute('stop-color', '#06b6d4');
      showToast('SVG color palette updated: Cyan & Blue', 'info', 1500);
    });
  }

  if (btnSvgTheme2 && svgStop1 && svgStop2) {
    btnSvgTheme2.addEventListener('click', () => {
      svgStop1.setAttribute('stop-color', '#7c3aed');
      svgStop2.setAttribute('stop-color', '#ec4899');
      showToast('SVG color palette updated: Purple & Pink', 'info', 1500);
    });
  }

  if (btnSvgAnimate && interactiveSvg) {
    btnSvgAnimate.addEventListener('click', () => {
      interactiveSvg.style.transform = 'scale(1.08)';
      setTimeout(() => {
        interactiveSvg.style.transform = 'scale(1)';
      }, 400);
    });
  }

  // =========================================================================
  // 9. LocalStorage Live Playground
  // =========================================================================
  const storageKey = document.getElementById('storageKey');
  const storageValue = document.getElementById('storageValue');
  const btnSaveStorage = document.getElementById('btnSaveStorage');
  const btnRefreshStorage = document.getElementById('btnRefreshStorage');
  const btnClearStorage = document.getElementById('btnClearStorage');
  const storageDisplayBox = document.getElementById('storageDisplayBox');

  const DEMO_STORAGE_PREFIX = 'html5_evolve_';

  function renderStoredItems() {
    if (!storageDisplayBox) return;
    try {
      storageDisplayBox.innerHTML = '';
      let count = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(DEMO_STORAGE_PREFIX)) {
          count++;
          const cleanKey = k.replace(DEMO_STORAGE_PREFIX, '');
          const val = localStorage.getItem(k);

          const itemRow = document.createElement('div');
          itemRow.className = 'storage-item-row';
          itemRow.innerHTML = `
            <span><strong>${cleanKey}:</strong> <code>${val}</code></span>
            <button class="btn-copy-mini" data-del-key="${k}" style="padding:0.1rem 0.4rem;font-size:0.68rem;background:#ef4444;">Del</button>
          `;
          storageDisplayBox.appendChild(itemRow);
        }
      }

      if (count === 0) {
        storageDisplayBox.innerHTML = '<span class="storage-empty-text">No custom data stored yet. Type a key &amp; value above!</span>';
      }

      // Wire delete buttons
      const delButtons = storageDisplayBox.querySelectorAll('[data-del-key]');
      delButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const keyToDelete = btn.getAttribute('data-del-key');
          localStorage.removeItem(keyToDelete);
          renderStoredItems();
          showToast('Item deleted from localStorage', 'info', 1500);
        });
      });
    } catch (e) {
      storageDisplayBox.innerHTML = '<span class="storage-empty-text text-danger">Local storage unavailable (restricted in current browser mode).</span>';
    }
  }

  if (btnSaveStorage) {
    btnSaveStorage.addEventListener('click', () => {
      const k = storageKey.value.trim();
      const v = storageValue.value.trim();
      if (!k || !v) {
        showToast('Please provide both a key and a value!', 'info');
        return;
      }
      try {
        localStorage.setItem(DEMO_STORAGE_PREFIX + k, v);
        storageKey.value = '';
        storageValue.value = '';
        renderStoredItems();
        showToast(`Saved "${k}" into localStorage!`, 'success', 2000);
      } catch (e) {
        showToast('Failed to save to localStorage.', 'info');
      }
    });
  }

  if (btnRefreshStorage) {
    btnRefreshStorage.addEventListener('click', () => {
      renderStoredItems();
      showToast('Storage view updated', 'info', 1500);
    });
  }

  if (btnClearStorage) {
    btnClearStorage.addEventListener('click', () => {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(DEMO_STORAGE_PREFIX)) keysToRemove.push(k);
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        renderStoredItems();
        showToast('Demo storage records cleared', 'info', 1500);
      } catch (e) {
        // Fallback
      }
    });
  }

  renderStoredItems();

  // =========================================================================
  // 10. Geolocation API Demo
  // =========================================================================
  const btnGetLocation = document.getElementById('btnGetLocation');
  const geoOutput = document.getElementById('geoOutput');

  if (btnGetLocation && geoOutput) {
    btnGetLocation.addEventListener('click', () => {
      if (!('geolocation' in navigator)) {
        geoOutput.textContent = 'Geolocation API not supported in this browser.';
        return;
      }

      geoOutput.textContent = 'Querying navigator.geolocation... (Awaiting user permission)';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lon = position.coords.longitude.toFixed(4);
          const accuracy = position.coords.accuracy.toFixed(1);
          geoOutput.innerHTML = `<strong>Success:</strong> Latitude: ${lat}°, Longitude: ${lon}° (Accuracy: ±${accuracy}m)`;
          showToast('Geolocation successfully acquired via HTML5 API!', 'success', 2500);
        },
        (error) => {
          let errorMsg = 'Error retrieving coordinates.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Permission denied by user or file:// protocol security restrictions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Position information unavailable on current network.';
              break;
            case error.TIMEOUT:
              errorMsg = 'Geolocation request timed out.';
              break;
          }
          geoOutput.innerHTML = `<span class="text-danger">Notice:</span> ${errorMsg}`;
          showToast('Geolocation inquiry completed.', 'info', 2000);
        },
        { timeout: 7000 }
      );
    });
  }

  // =========================================================================
  // 11. HTML5 Drag and Drop API Demo
  // =========================================================================
  const dndItems = document.querySelectorAll('.dnd-item');
  const dndTargetZone = document.getElementById('dndTargetZone');
  const dndSourceZone = document.getElementById('dndSourceZone');

  const modernTransmutations = {
    'dndItem1': { text: '<!DOCTYPE html> (Clean Doctype)', color: 'var(--color-primary)' },
    'dndItem2': { text: '<video> Tag (Native Media)', color: 'var(--color-purple)' },
    'dndItem3': { text: 'localStorage API (5-10MB)', color: 'var(--color-cyan)' }
  };

  dndItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.id);
      e.dataTransfer.effectAllowed = 'move';
      item.style.opacity = '0.5';
    });

    item.addEventListener('dragend', () => {
      item.style.opacity = '1';
    });
  });

  if (dndTargetZone) {
    dndTargetZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      dndTargetZone.classList.add('drag-over');
    });

    dndTargetZone.addEventListener('dragleave', () => {
      dndTargetZone.classList.remove('drag-over');
    });

    dndTargetZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dndTargetZone.classList.remove('drag-over');
      const itemId = e.dataTransfer.getData('text/plain');
      const draggedElement = document.getElementById(itemId);

      if (draggedElement && dndTargetZone.contains(draggedElement) === false) {
        // Modernize item appearance
        const info = modernTransmutations[itemId];
        if (info) {
          draggedElement.textContent = `✓ Modernized: ${info.text}`;
          draggedElement.style.backgroundColor = '#dcfce7';
          draggedElement.style.color = '#15803d';
          draggedElement.style.borderColor = '#86efac';
        }

        // Remove placeholder if present
        const placeholder = dndTargetZone.querySelector('.dnd-placeholder');
        if (placeholder) placeholder.style.display = 'none';

        dndTargetZone.appendChild(draggedElement);
        showToast('Module modernized through HTML5 Drag & Drop!', 'success', 2000);
      }
    });
  }

  // =========================================================================
  // 12. Form C: Full-Spectrum Interactive Registration Showcase Form
  // =========================================================================
  const showcaseForm = document.getElementById('showcaseForm');
  const scRange = document.getElementById('scRange');
  const rangeValueDisplay = document.getElementById('rangeValueDisplay');
  const scColor = document.getElementById('scColor');
  const colorHexDisplay = document.getElementById('colorHexDisplay');
  const scNotes = document.getElementById('scNotes');
  const charCount = document.getElementById('charCount');
  const formAlertBox = document.getElementById('formAlertBox');
  const showcaseConfirmation = document.getElementById('showcaseConfirmation');
  const confDetailsGrid = document.getElementById('confDetailsGrid');
  const btnEditSubmission = document.getElementById('btnEditSubmission');

  // Live range display
  if (scRange && rangeValueDisplay) {
    scRange.addEventListener('input', () => {
      rangeValueDisplay.textContent = `${scRange.value}%`;
    });
  }

  // Live color picker display
  if (scColor && colorHexDisplay) {
    scColor.addEventListener('input', () => {
      colorHexDisplay.textContent = scColor.value;
      colorHexDisplay.style.color = scColor.value;
    });
  }

  // Textarea counter
  if (scNotes && charCount) {
    scNotes.addEventListener('input', () => {
      charCount.textContent = scNotes.value.length;
    });
  }

  // Form Submission & Native HTML5 Constraint Testing
  if (showcaseForm) {
    showcaseForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check validity using native HTML5 constraint API
      if (!showcaseForm.checkValidity()) {
        // Collect invalid fields
        const invalidFields = [];
        const elements = showcaseForm.elements;

        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.willValidate && !el.checkValidity()) {
            el.classList.add('is-invalid');
            invalidFields.push(el.getAttribute('placeholder') || el.name || el.id);
          } else if (el.willValidate) {
            el.classList.remove('is-invalid');
            el.classList.add('is-valid');
          }
        }

        formAlertBox.className = 'form-alert-box alert-danger';
        formAlertBox.style.display = 'block';
        formAlertBox.innerHTML = `<strong>Validation Failed:</strong> Please correct mandatory HTML5 constraints on: ${invalidFields.slice(0, 3).join(', ')}${invalidFields.length > 3 ? '...' : ''}`;
        showToast('Please fulfill all HTML5 form constraints', 'info', 2500);

        // Native browser UI tooltip prompt
        showcaseForm.reportValidity();
        return;
      }

      // Valid Form Flow
      formAlertBox.style.display = 'none';

      // Gather form values
      const formData = new FormData(showcaseForm);
      const skillsSelected = [];
      showcaseForm.querySelectorAll('input[name="skills"]:checked').forEach(chk => {
        skillsSelected.push(chk.value);
      });

      const summary = [
        { label: 'Full Name', value: formData.get('fullName') || 'N/A' },
        { label: 'Email', value: formData.get('email') || 'N/A' },
        { label: 'Phone Number', value: formData.get('phone') || 'N/A' },
        { label: 'Start Date', value: formData.get('startDate') || 'N/A' },
        { label: 'Experience Years', value: `${formData.get('experienceYears')} Years` },
        { label: 'Primary Role', value: formData.get('role') || 'N/A' },
        { label: 'Skill Slider', value: `${formData.get('skillRange')}%` },
        { label: 'Accent Color', value: formData.get('themeColor') || 'N/A' },
        { label: 'Architecture Level', value: formData.get('archLevel') || 'N/A' },
        { label: 'Selected Skills', value: skillsSelected.join(', ') || 'None selected' },
        { label: 'Website / URL', value: formData.get('website') || 'Not specified' },
        { label: 'Project Notes', value: formData.get('projectNotes') || 'No additional notes provided' }
      ];

      // Populate confirmation grid
      if (confDetailsGrid) {
        confDetailsGrid.innerHTML = summary.map(item => `
          <div class="conf-item">
            <span class="conf-label">${item.label}</span>
            <span class="conf-value">${item.value}</span>
          </div>
        `).join('');
      }

      showcaseConfirmation.style.display = 'block';
      showcaseConfirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      showToast('Form successfully validated with HTML5 constraints!', 'success', 3000);
    });

    showcaseForm.addEventListener('reset', () => {
      formAlertBox.style.display = 'none';
      showcaseConfirmation.style.display = 'none';
      if (charCount) charCount.textContent = '0';
      if (rangeValueDisplay) rangeValueDisplay.textContent = '75%';
      const inputs = showcaseForm.querySelectorAll('.form-control, .form-select');
      inputs.forEach(i => {
        i.classList.remove('is-invalid');
        i.classList.remove('is-valid');
      });
      showToast('Form fields reset to default', 'info', 1500);
    });
  }

  if (btnEditSubmission) {
    btnEditSubmission.addEventListener('click', () => {
      showcaseConfirmation.style.display = 'none';
      showcaseForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // =========================================================================
  // 13. Question 3: Modernized Enterprise Registration Form
  // =========================================================================
  const modernizedRegForm = document.getElementById('modernizedRegForm');
  const mrAlertBox = document.getElementById('mrAlertBox');
  const modernizedConfirmation = document.getElementById('modernizedConfirmation');
  const mrSummaryGrid = document.getElementById('mrSummaryGrid');
  const btnModernizedResetNew = document.getElementById('btnModernizedResetNew');

  if (modernizedRegForm) {
    modernizedRegForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!modernizedRegForm.checkValidity()) {
        mrAlertBox.className = 'form-alert-box alert-danger';
        mrAlertBox.style.display = 'block';
        mrAlertBox.innerHTML = '<strong>Validation Error:</strong> All asterisked (*) fields must be valid before submission.';
        modernizedRegForm.reportValidity();
        return;
      }

      mrAlertBox.style.display = 'none';

      const fd = new FormData(modernizedRegForm);
      const mrSummary = [
        { label: 'Applicant Name', value: fd.get('applicantName') },
        { label: 'Corporate Email', value: fd.get('applicantEmail') },
        { label: 'Phone Number', value: fd.get('applicantPhone') },
        { label: 'Onboarding Date', value: fd.get('applicantDate') },
        { label: 'Assigned Department', value: fd.get('applicantDepartment') },
        { label: 'Security Password', value: '•••••••• (8+ chars verified)' }
      ];

      if (mrSummaryGrid) {
        mrSummaryGrid.innerHTML = mrSummary.map(s => `
          <div class="conf-item">
            <span class="conf-label">${s.label}</span>
            <span class="conf-value">${s.value}</span>
          </div>
        `).join('');
      }

      modernizedConfirmation.style.display = 'block';
      modernizedConfirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      showToast('Modernized application record successfully recorded!', 'success', 3000);
    });
  }

  if (btnModernizedResetNew) {
    btnModernizedResetNew.addEventListener('click', () => {
      modernizedRegForm.reset();
      modernizedConfirmation.style.display = 'none';
      modernizedRegForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Ready for new applicant registration entry.', 'info', 1500);
    });
  }

  // =========================================================================
  // 14. HTML5 Knowledge Assessment Quiz
  // =========================================================================
  const quizContainer = document.getElementById('quizContainer');
  const currentScoreDisplay = document.getElementById('currentScoreDisplay');
  const totalQuestionsDisplay = document.getElementById('totalQuestionsDisplay');
  const quizResultBanner = document.getElementById('quizResultBanner');
  const resultScoreCircle = document.getElementById('resultScoreCircle');
  const resultHeading = document.getElementById('resultHeading');
  const resultDesc = document.getElementById('resultDesc');
  const btnRestartQuiz = document.getElementById('btnRestartQuiz');

  const quizExplanations = [
    {
      correctText: 'Correct! <!DOCTYPE html> is the concise, case-insensitive HTML5 declaration that places all modern browsers directly into standard standards mode.',
      wrongText: 'Incorrect. HTML5 does not use lengthy SGML/XML DTD URLs. The standardized syntax is simply <!DOCTYPE html>.'
    },
    {
      correctText: 'Correct! Semantic landmarks explicitly communicate page hierarchy to screen readers, SEO spiders, and human developers.',
      wrongText: 'Incorrect. Semantic tags do not add styling; their primary goal is semantic clarity, a11y navigation, and SEO landmarks.'
    },
    {
      correctText: 'Correct! The required attribute is a native declarative boolean constraint built into HTML5 form validation.',
      wrongText: 'Incorrect. The standardized HTML5 keyword is required (e.g. <input type="text" required>).'
    },
    {
      correctText: 'Correct! HTML5 video and audio play natively without any closed binary runtime or security vulnerabilities.',
      wrongText: 'Incorrect. HTML5 media was explicitly designed to obsolete third-party plugins like Flash and Silverlight.'
    },
    {
      correctText: 'Correct! localStorage provides 5–10MB of persistent storage that never gets transmitted across the wire with HTTP request headers.',
      wrongText: 'Incorrect. Cookies are capped at 4KB and transmitted on every HTTP request; localStorage provides 5-10MB purely client-side.'
    }
  ];

  let currentScore = 0;
  let questionsAnswered = 0;
  const totalQuestions = 5;

  if (totalQuestionsDisplay) {
    totalQuestionsDisplay.textContent = totalQuestions;
  }

  const questionItems = document.querySelectorAll('.quiz-question-item');

  questionItems.forEach(item => {
    const qIndex = parseInt(item.getAttribute('data-q-index'), 10);
    const options = item.querySelectorAll('.q-option-btn');
    const feedbackBox = item.querySelector('.q-feedback');

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';

        // Disable all options in this question
        options.forEach(b => {
          b.disabled = true;
          if (b.getAttribute('data-correct') === 'true') {
            b.classList.add('opt-correct');
          }
        });

        if (isCorrect) {
          btn.classList.add('opt-correct');
          currentScore++;
          if (currentScoreDisplay) currentScoreDisplay.textContent = currentScore;
          feedbackBox.className = 'q-feedback fb-correct';
          feedbackBox.textContent = quizExplanations[qIndex].correctText;
        } else {
          btn.classList.add('opt-wrong');
          feedbackBox.className = 'q-feedback fb-wrong';
          feedbackBox.textContent = quizExplanations[qIndex].wrongText;
        }

        feedbackBox.style.display = 'block';
        questionsAnswered++;

        // Check if quiz finished
        if (questionsAnswered === totalQuestions) {
          const scorePercent = Math.round((currentScore / totalQuestions) * 100);
          if (resultScoreCircle) resultScoreCircle.textContent = `${scorePercent}%`;

          if (scorePercent === 100) {
            resultHeading.textContent = 'Flawless Score! HTML5 Expert';
            resultDesc.textContent = 'You answered every question correctly, proving complete mastery of modern HTML5 architecture!';
          } else if (scorePercent >= 60) {
            resultHeading.textContent = 'Well Done! Solid Understanding';
            resultDesc.textContent = 'You have a good grasp of HTML5 modernization principles and legacy differences.';
          } else {
            resultHeading.textContent = 'Good Effort! Keep Reviewing';
            resultDesc.textContent = 'Review the comparison table and feature modules above, then try the assessment again.';
          }

          if (quizResultBanner) {
            quizResultBanner.style.display = 'block';
            quizResultBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    });
  });

  if (btnRestartQuiz) {
    btnRestartQuiz.addEventListener('click', () => {
      currentScore = 0;
      questionsAnswered = 0;
      if (currentScoreDisplay) currentScoreDisplay.textContent = '0';
      if (quizResultBanner) quizResultBanner.style.display = 'none';

      questionItems.forEach(item => {
        const options = item.querySelectorAll('.q-option-btn');
        const feedbackBox = item.querySelector('.q-feedback');
        options.forEach(b => {
          b.disabled = false;
          b.classList.remove('opt-correct', 'opt-wrong');
        });
        if (feedbackBox) feedbackBox.style.display = 'none';
      });

      quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Assessment restarted. Good luck!', 'info', 2000);
    });
  }

  // =========================================================================
  // 15. Interactive Modernization Checklist
  // =========================================================================
  const chkTasks = document.querySelectorAll('.chk-task');
  const checklistProgressFill = document.getElementById('checklistProgressFill');
  const checklistProgressText = document.getElementById('checklistProgressText');
  const btnCheckAll = document.getElementById('btnCheckAll');
  const btnUncheckAll = document.getElementById('btnUncheckAll');

  function updateChecklistProgress() {
    let completed = 0;
    chkTasks.forEach(task => {
      const parentLabel = task.closest('.checklist-item');
      if (task.checked) {
        completed++;
        if (parentLabel) parentLabel.classList.add('item-completed');
      } else {
        if (parentLabel) parentLabel.classList.remove('item-completed');
      }
    });

    const percent = Math.round((completed / chkTasks.length) * 100);
    if (checklistProgressFill) checklistProgressFill.style.width = `${percent}%`;
    if (checklistProgressText) checklistProgressText.textContent = `${percent}% Modernization Complete (${completed}/${chkTasks.length})`;
  }

  chkTasks.forEach(task => {
    task.addEventListener('change', () => {
      updateChecklistProgress();
    });
  });

  if (btnCheckAll) {
    btnCheckAll.addEventListener('click', () => {
      chkTasks.forEach(task => { task.checked = true; });
      updateChecklistProgress();
      showToast('All modernization checklist items marked complete!', 'success', 2000);
    });
  }

  if (btnUncheckAll) {
    btnUncheckAll.addEventListener('click', () => {
      chkTasks.forEach(task => { task.checked = false; });
      updateChecklistProgress();
      showToast('Checklist reset', 'info', 1500);
    });
  }

  // =========================================================================
  // 16. Expandable Accordions
  // =========================================================================
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('open');

      // Close other accordions for clean single-view accordion
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherTrigger = otherItem.querySelector('.accordion-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });

  // Welcome message toast
  setTimeout(() => {
    showToast('Welcome to HTML5 EVOLVE – Interactive Modernization Portal', 'info', 3000);
  }, 600);
});
