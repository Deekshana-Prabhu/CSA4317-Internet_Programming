/**
 * TECH EXPLORER – Web Design & HTTP Communication
 * Interactive Engine & Simulation Controller
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // 1. MOBILE NAVIGATION & BACKDROP CONTROLS
  // -------------------------------------------------------------------------
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileNav() {
    sidebar.classList.add('mobile-open');
    sidebarBackdrop.classList.add('active');
    menuToggleBtn.classList.add('open');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    sidebar.classList.remove('mobile-open');
    sidebarBackdrop.classList.remove('active');
    menuToggleBtn.classList.remove('open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('mobile-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileNav);
  }

  // Close mobile sidebar on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileNav();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 2. SCROLLSPY (ACTIVE NAVIGATION HIGHLIGHT)
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // -------------------------------------------------------------------------
  // 3. FLOATING BACK-TO-TOP BUTTON
  // -------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');

  function toggleBackToTop() {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. CODE BLOCK COPY FUNCTIONALITY
  // -------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-target');
      const codeElement = document.getElementById(targetId);

      if (codeElement) {
        const textToCopy = codeElement.innerText;
        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Copied!</span>
          `;
          btn.style.borderColor = '#10b981';
          btn.style.color = '#34d399';

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2000);
        } catch (err) {
          console.warn('Clipboard write failed, using fallback:', err);
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 5. INTERACTIVE HTTP SIMULATOR ENGINE
  // -------------------------------------------------------------------------
  const btnRun = document.getElementById('btnRunSimulator');
  const btnReset = document.getElementById('btnResetSimulator');
  const btnClearLog = document.getElementById('btnClearLog');

  // Simulator Nodes
  const actorClient = document.getElementById('actorClient');
  const actorServer = document.getElementById('actorServer');
  const clientStateBadge = document.getElementById('clientStateBadge');
  const serverStateBadge = document.getElementById('serverStateBadge');
  const animatedPacket = document.getElementById('animatedPacket');
  const packetText = document.getElementById('packetText');
  const channelStatusText = document.getElementById('channelStatusText');

  // Progress Bar
  const progressFillBar = document.getElementById('progressFillBar');
  const progressPercentText = document.getElementById('progressPercentText');
  const progressStatusTitle = document.getElementById('progressStatusTitle');

  // Stages Cards
  const stageCard1 = document.getElementById('stageCard1');
  const stageCard2 = document.getElementById('stageCard2');
  const stageCard3 = document.getElementById('stageCard3');
  const stageState1 = document.getElementById('stageState1');
  const stageState2 = document.getElementById('stageState2');
  const stageState3 = document.getElementById('stageState3');
  const stageOutput1 = document.getElementById('stageOutput1');
  const stageOutput2 = document.getElementById('stageOutput2');
  const stageOutput3 = document.getElementById('stageOutput3');

  // Event Log & Render Preview
  const logStream = document.getElementById('logStream');
  const simRenderResult = document.getElementById('simRenderResult');

  let isSimulating = false;
  let simTimeouts = [];

  // Helper: Append entry to live terminal log
  function addLog(message, type = 'info') {
    const now = new Date();
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    const timestamp = `[${mm}:${ss}.${ms}]`;

    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="log-time">${timestamp}</span> ${message}`;
    logStream.appendChild(entry);
    logStream.scrollTop = logStream.scrollHeight;
  }

  // Update progress bar helper
  function setProgress(percent, label) {
    progressFillBar.style.width = `${percent}%`;
    progressPercentText.innerText = `${percent}%`;
    if (label) progressStatusTitle.innerText = label;
  }

  // Reset simulator state
  function resetSimulation() {
    // Clear timeouts
    simTimeouts.forEach(t => clearTimeout(t));
    simTimeouts = [];
    isSimulating = false;

    // Reset Buttons
    btnRun.disabled = false;
    btnRun.style.opacity = '1';

    // Reset Client / Server Cards
    actorClient.classList.remove('active');
    actorServer.classList.remove('active');
    clientStateBadge.className = 'actor-badge';
    clientStateBadge.innerText = 'Ready';
    serverStateBadge.className = 'actor-badge';
    serverStateBadge.innerText = 'Listening';

    // Reset Animated Packet
    animatedPacket.className = 'animated-packet';
    animatedPacket.style.opacity = '0';
    packetText.innerText = 'HTTP GET';
    channelStatusText.innerText = "Channel Idle - Click 'Load Webpage' to start";

    // Reset Progress
    setProgress(0, 'Ready to simulate');

    // Reset Stages
    [stageCard1, stageCard2, stageCard3].forEach(c => c.className = 'sim-stage-card');
    stageState1.innerText = 'Waiting';
    stageState2.innerText = 'Waiting';
    stageState3.innerText = 'Waiting';
    stageOutput1.innerText = 'Waiting to trigger...';
    stageOutput2.innerText = 'Waiting for request...';
    stageOutput3.innerText = 'Waiting for response...';

    // Hide Render Window
    simRenderResult.classList.remove('visible');

    addLog('Simulation reset to initial state.', 'info');
  }

  // Run the full simulation sequence
  function runSimulation() {
    if (isSimulating) return;
    isSimulating = true;
    btnRun.disabled = true;
    btnRun.style.opacity = '0.6';

    // Clear previous render result
    simRenderResult.classList.remove('visible');

    // Phase 1: DNS & Connection Initialization (0ms)
    setProgress(15, 'Resolving DNS & Opening TCP Connection...');
    actorClient.classList.add('active');
    clientStateBadge.className = 'actor-badge working';
    clientStateBadge.innerText = 'Connecting';
    stageCard1.classList.add('active');
    stageState1.innerText = 'In Progress';
    stageOutput1.innerText = 'Querying DNS: techexplorer.edu ➔ 93.184.216.34...';

    addLog('Initiating DNS resolution for host "techexplorer.edu"...', 'req');

    simTimeouts.push(setTimeout(() => {
      addLog('DNS IP resolved: 93.184.216.34. Initiating TCP 3-Way Handshake (SYN ➔ SYN-ACK ➔ ACK)...', 'req');
      stageOutput1.innerText = 'TCP Handshake OK. TLS 1.3 negotiated on Port 443.';
    }, 600));

    // Phase 2: Sending HTTP GET Request Packet (1200ms)
    simTimeouts.push(setTimeout(() => {
      setProgress(35, 'Sending HTTP GET /welcome.html Request...');
      clientStateBadge.innerText = 'Sending GET';
      channelStatusText.innerText = 'Transmitting packet: GET /welcome.html HTTP/1.1';
      
      packetText.innerText = 'GET /welcome.html';
      animatedPacket.className = 'animated-packet travel-request';

      addLog('Dispatched: GET /welcome.html HTTP/1.1 (Host: techexplorer.edu, Accept: text/html)', 'req');
      stageOutput1.innerText = 'HTTP GET Request packet dispatched over network socket.';
    }, 1200));

    // Phase 3: Server Receives & Processes Request (2600ms)
    simTimeouts.push(setTimeout(() => {
      setProgress(60, 'Server Processing Request...');
      stageCard1.classList.remove('active');
      stageCard1.classList.add('completed');
      stageState1.innerText = 'Done ✓';

      actorClient.classList.remove('active');
      clientStateBadge.innerText = 'Awaiting Resp';
      actorServer.classList.add('active');
      serverStateBadge.className = 'actor-badge working';
      serverStateBadge.innerText = 'Processing';

      stageCard2.classList.add('active');
      stageState2.innerText = 'In Progress';
      stageOutput2.innerText = 'Matching route /welcome.html; loading HTML content...';

      channelStatusText.innerText = 'Server processing: Assembling status headers and response body';
      addLog('Server 93.184.216.34 received request. Route matched: /welcome.html.', 'srv');

      simTimeouts.push(setTimeout(() => {
        addLog('Server status: 200 OK generated. Headers attached: Content-Type: text/html, Content-Length: 1256.', 'srv');
        stageOutput2.innerText = 'Status 200 OK prepared. Packaging 1.25 KB HTML payload.';
      }, 700));

    }, 2600));

    // Phase 4: Server Dispatches HTTP Response (3900ms)
    simTimeouts.push(setTimeout(() => {
      setProgress(85, 'Server Returning HTTP 200 OK Response...');
      stageCard2.classList.remove('active');
      stageCard2.classList.add('completed');
      stageState2.innerText = 'Done ✓';

      serverStateBadge.className = 'actor-badge success';
      serverStateBadge.innerText = '200 OK Sent';

      packetText.innerText = '200 OK (text/html)';
      animatedPacket.className = 'animated-packet travel-response';
      channelStatusText.innerText = 'Streaming response: HTTP/1.1 200 OK (1,256 bytes HTML)';

      addLog('Transmitting: HTTP/1.1 200 OK (Content-Type: text/html, 1256 bytes) to client.', 'res');

      stageCard3.classList.add('active');
      stageState3.innerText = 'Receiving';
      stageOutput3.innerText = 'Streaming HTML stream; building DOM & CSSOM trees...';
    }, 3900));

    // Phase 5: Browser Render & Page Display (5300ms)
    simTimeouts.push(setTimeout(() => {
      setProgress(100, 'Webpage Loaded & Rendered Successfully!');
      actorServer.classList.remove('active');
      actorClient.classList.add('active');
      clientStateBadge.className = 'actor-badge success';
      clientStateBadge.innerText = 'Page Rendered';

      channelStatusText.innerText = 'Transaction completed successfully (Total latency: 48ms)';

      stageCard3.classList.remove('active');
      stageCard3.classList.add('completed');
      stageState3.innerText = 'Done ✓';
      stageOutput3.innerText = 'DOM, CSSOM and scripts executed cleanly in 12ms.';

      addLog('Client parsed HTML token stream. Constructed DOM Tree and CSSOM rules.', 'res');
      addLog('Layout computed. Pixels painted to screen buffer. DOMContentLoaded completed!', 'done');
      addLog('★ Webpage load successful: https://techexplorer.edu/welcome.html (Status: 200 OK)', 'done');

      // Reveal Final Webpage Render Result
      simRenderResult.classList.add('visible');
      simRenderResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Re-enable button
      isSimulating = false;
      btnRun.disabled = false;
      btnRun.style.opacity = '1';
    }, 5300));
  }

  // Event Listeners for Simulator
  if (btnRun) {
    btnRun.addEventListener('click', runSimulation);
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetSimulation);
  }

  if (btnClearLog) {
    btnClearLog.addEventListener('click', () => {
      logStream.innerHTML = '';
      addLog('Terminal stream cleared by user.', 'info');
    });
  }

});
