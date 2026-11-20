/**
 * LAMP vs WAMP Educational Website - JavaScript Functionality (script.js)
 * Clean, vanilla JavaScript implementing all interactive requirements.
 */

// Global state tracking
const state = {
  currentLinuxStep: 1,
  totalLinuxSteps: 5,
  currentQuizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  userAnswers: []
};

/* ==========================================================================
   1. DOM Content Loaded Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initScrollSpy();
  initReadingProgress();
  initBackToTop();
  loadQuizQuestion(0);
});

/* ==========================================================================
   2. Responsive Sidebar & Mobile Drawer Handling
   ========================================================================== */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sidebar || !toggleBtn || !overlay) return;

  function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

  toggleBtn.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Close sidebar on mobile when a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        closeSidebar();
      }
    });
  });
}

/* ==========================================================================
   3. ScrollSpy & Sidebar Active State Syncing
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   4. Reading Scroll Progress Bar
   ========================================================================== */
function initReadingProgress() {
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = docHeight > 0 ? scrollTop / docHeight : 0;
    const percent = Math.min(100, Math.max(0, Math.round(scrollFraction * 100)));

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;
  });
}

/* ==========================================================================
   5. Back to Top Floating Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   6. Toast Notifications & Clipboard Copy Helper
   ========================================================================== */
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toastIcon.textContent = isSuccess ? '\u2713' : '\u2139';
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function copyCode(buttonElement, codeElementId) {
  const codeEl = document.getElementById(codeElementId);
  if (!codeEl) return;

  const textToCopy = codeEl.innerText || codeEl.textContent;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      triggerCopySuccess(buttonElement);
    }).catch(() => {
      fallbackCopy(textToCopy, buttonElement);
    });
  } else {
    fallbackCopy(textToCopy, buttonElement);
  }
}

function fallbackCopy(text, buttonElement) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    triggerCopySuccess(buttonElement);
  } catch (err) {
    showToast('Failed to copy code to clipboard', false);
  } finally {
    document.body.removeChild(textArea);
  }
}

function triggerCopySuccess(buttonElement) {
  const originalHtml = buttonElement.innerHTML;
  buttonElement.innerHTML = `
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>Copied!</span>
  `;
  buttonElement.style.background = '#10b981';
  buttonElement.style.borderColor = '#10b981';

  showToast('Code snippet copied to clipboard!');

  setTimeout(() => {
    buttonElement.innerHTML = originalHtml;
    buttonElement.style.background = '';
    buttonElement.style.borderColor = '';
  }, 2200);
}

/* ==========================================================================
   7. Component Details Modal Data & Controller
   ========================================================================== */
const componentData = {
  linux: {
    badge: 'L',
    title: 'Linux Operating System',
    category: 'Foundational OS Kernel',
    html: `
      <p>Linux is the open-source, Unix-like operating system kernel created by Linus Torvalds in 1991. In LAMP, it serves as the rock-solid substrate handling CPU scheduling, memory management, and network I/O.</p>
      <h5>Why Linux Dominates Servers:</h5>
      <ul>
        <li><strong>Process Isolation:</strong> Strict user/group permissions (e.g. <code>www-data</code> user) prevents malicious scripts from accessing system files.</li>
        <li><strong>Headless Efficiency:</strong> Operates entirely without a desktop graphical user interface (GUI), allocating 99% of CPU and RAM directly to web services.</li>
        <li><strong>Package Ecosystem:</strong> Reliable updates through package managers like <code>apt</code> (Ubuntu/Debian) and <code>dnf/yum</code> (RHEL/CentOS).</li>
        <li><strong>Case-Sensitive Ext4 Filesystem:</strong> Guarantees that file references in code match disk files with strict precision.</li>
      </ul>
      <h5>Common Server Distributions:</h5>
      <p>Ubuntu Server, Debian GNU/Linux, Red Hat Enterprise Linux (RHEL), AlmaLinux, Rocky Linux, Alpine Linux.</p>
    `
  },
  apache: {
    badge: 'A',
    title: 'Apache HTTP Server (httpd)',
    category: 'Web Server Daemon',
    html: `
      <p>The Apache HTTP Server, developed by the Apache Software Foundation, has been one of the most popular web servers on the internet since 1996.</p>
      <h5>Core Architecture &amp; Modules:</h5>
      <ul>
        <li><strong>Multi-Processing Modules (MPMs):</strong> Supports <code>event</code> and <code>worker</code> models for asynchronous, high-concurrency connection handling.</li>
        <li><strong>Decentralized Configuration (.htaccess):</strong> Allows per-directory overrides for URL rewriting, authentication, and HTTP headers without restarting the server.</li>
        <li><strong>Virtual Hosts (VHosts):</strong> Enables hosting dozens of distinct domain names on a single physical server IP address.</li>
        <li><strong>SSL/TLS Acceleration:</strong> Built-in <code>mod_ssl</code> provides secure HTTPS communications via OpenSSL.</li>
      </ul>
      <h5>Important Configuration Paths:</h5>
      <p>Main Config: <code>/etc/apache2/apache2.conf</code><br>Virtual Hosts: <code>/etc/apache2/sites-available/000-default.conf</code><br>Service Command: <code>sudo systemctl restart apache2</code></p>
    `
  },
  mysql: {
    badge: 'M',
    title: 'MySQL Relational Database',
    category: 'Database Management System (RDBMS)',
    html: `
      <p>MySQL is the world's most popular open-source relational database management system, using Structured Query Language (SQL) to store, manipulate, and retrieve application data.</p>
      <h5>Key Enterprise Capabilities:</h5>
      <ul>
        <li><strong>InnoDB Storage Engine:</strong> Full ACID (Atomicity, Consistency, Isolation, Durability) transaction compliance, foreign key constraints, and row-level locking.</li>
        <li><strong>High-Speed Indexing:</strong> B-Tree and hash indexing algorithms deliver sub-millisecond query responses across millions of rows.</li>
        <li><strong>Replication &amp; High Availability:</strong> Master-slave and group replication allow effortless database clustering and zero-downtime backups.</li>
      </ul>
      <h5>Standard Service Details:</h5>
      <p>Default Port: <code>3306</code><br>Socket: <code>/var/run/mysqld/mysqld.sock</code><br>Terminal CLI: <code>mysql -u root -p</code></p>
    `
  },
  php: {
    badge: 'P',
    title: 'PHP (Hypertext Preprocessor)',
    category: 'Server-Side Scripting Language',
    html: `
      <p>PHP is an expressive, widely used open-source scripting language designed especially for web development that can be embedded directly into HTML.</p>
      <h5>How PHP Executes:</h5>
      <ul>
        <li><strong>Zend Engine 3:</strong> Compiles human-readable PHP code into intermediate bytecode (Opcache) which is executed by the virtual machine at near-native speed.</li>
        <li><strong>Seamless DB Drivers:</strong> Built-in PDO (PHP Data Objects) and MySQLi extensions offer parameterized, SQL-injection-proof database query APIs.</li>
        <li><strong>Modern Features:</strong> Modern PHP (8.1 - 8.3+) features strict types, JIT (Just-In-Time) compilation, attributes, enums, fibers for concurrency, and readonly classes.</li>
      </ul>
      <h5>Configuration &amp; Extensions:</h5>
      <p>Config file: <code>/etc/php/8.x/apache2/php.ini</code><br>CLI binary: <code>/usr/bin/php</code></p>
    `
  },
  windows: {
    badge: 'W',
    title: 'Microsoft Windows (WAMP)',
    category: 'Client Operating System',
    html: `
      <p>Microsoft Windows (Windows 10 / 11) is the desktop environment hosting the WAMP software stack. It provides a familiar graphical interface and wide hardware compatibility.</p>
      <h5>Characteristics in WAMP:</h5>
      <ul>
        <li><strong>NTFS Filesystem:</strong> File and directory names are case-insensitive (e.g. <code>index.php</code> and <code>INDEX.PHP</code> point to the identical file on disk).</li>
        <li><strong>Desktop Integration:</strong> Web root folders can be opened directly inside Visual Studio Code, Notepad++, or Windows File Explorer.</li>
        <li><strong>Service Control Manager:</strong> Apache and MySQL run as registered Windows Services controlled via the System Tray.</li>
      </ul>
    `
  },
  'apache-win': {
    badge: 'A',
    title: 'Apache for Windows',
    category: 'Windows Ported Web Server',
    html: `
      <p>Apache HTTP Server compiled as a native 64-bit Windows binary. Instead of the Linux forking model, it utilizes the <code>mpm_winnt</code> multi-threaded worker model.</p>
      <h5>Windows Specific Notes:</h5>
      <ul>
        <li><strong>Service Name:</strong> Registered under <code>wampapache64</code> in Windows Services (<code>services.msc</code>).</li>
        <li><strong>Default Port Conflicts:</strong> Port 80 may frequently conflict with Windows IIS, Skype, or World Wide Web Publishing Service. WampServer includes a 1-click port changer (e.g. to port 8080).</li>
        <li><strong>Config Location:</strong> <code>C:\\wamp64\\bin\\apache\\apache2.4.x\\conf\\httpd.conf</code></li>
      </ul>
    `
  },
  'mysql-win': {
    badge: 'M',
    title: 'MySQL &amp; MariaDB on Windows',
    category: 'Dual Windows Database Services',
    html: `
      <p>WampServer packages both MySQL and MariaDB databases simultaneously, allowing developers to test both database branches locally.</p>
      <h5>Default Configuration:</h5>
      <ul>
        <li><strong>MySQL Port:</strong> 3306 (Service: <code>wampmysqld64</code>)</li>
        <li><strong>MariaDB Port:</strong> 3307 (Service: <code>wampmariadb64</code>)</li>
        <li><strong>Root Credentials:</strong> Default user is <code>root</code> with no password (empty string).</li>
        <li><strong>phpMyAdmin:</strong> Pre-installed and reachable at <code>http://localhost/phpmyadmin</code> for visual SQL database management.</li>
      </ul>
    `
  },
  'php-win': {
    badge: 'P',
    title: 'PHP for Windows (Thread-Safe)',
    category: 'Multi-Version Windows Binary',
    html: `
      <p>WampServer ships with Thread-Safe (TS) compiled PHP binaries specifically matched to the Apache <code>mpm_winnt</code> architecture.</p>
      <h5>Multi-Version Switching:</h5>
      <ul>
        <li>Developers can switch between PHP 7.4, 8.0, 8.1, 8.2, and 8.3 directly from the WampServer tray menu without modifying environment variables manually.</li>
        <li>Config file used by Apache: <code>C:\\wamp64\\bin\\apache\\apacheX.Y\\bin\\php.ini</code> (symbolically linked from <code>phpForApache.ini</code>).</li>
      </ul>
    `
  }
};

function openComponentModal(key) {
  const data = componentData[key];
  if (!data) return;

  const modal = document.getElementById('componentModal');
  const badge = document.getElementById('modalBadge');
  const title = document.getElementById('modalTitle');
  const category = document.getElementById('modalCategory');
  const body = document.getElementById('modalBody');

  if (modal && badge && title && category && body) {
    badge.textContent = data.badge;
    title.textContent = data.title;
    category.textContent = data.category;
    body.innerHTML = data.html;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeComponentModal() {
  const modal = document.getElementById('componentModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal when clicking outside the box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('componentModal');
  if (modal && e.target === modal) {
    closeComponentModal();
  }
});

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeComponentModal();
  }
});

/* ==========================================================================
   8. WampServer Interactive Tray Status Simulator
   ========================================================================== */
function setWampState(color) {
  const trayIcon = document.getElementById('wampTrayIcon');
  const trayStatusText = document.getElementById('trayStatusText');
  const trayStatusDetails = document.getElementById('trayStatusDetails');

  if (!trayIcon || !trayStatusText || !trayStatusDetails) return;

  // Clear current color classes
  trayIcon.classList.remove('tray-green', 'tray-orange', 'tray-red');
  trayStatusText.classList.remove('status-online', 'status-partial', 'status-offline');

  if (color === 'green') {
    trayIcon.classList.add('tray-green');
    trayStatusText.classList.add('status-online');
    trayStatusText.textContent = 'All Services Running (Green)';
    trayStatusDetails.textContent = 'Apache is active on Port 80. MySQL is active on Port 3306. Ready for local browser requests at http://localhost.';
    showToast('WampServer: All local services online (Green)');
  } else if (color === 'orange') {
    trayIcon.classList.add('tray-orange');
    trayStatusText.classList.add('status-partial');
    trayStatusText.textContent = 'Partial / 1 Service Stopped (Orange)';
    trayStatusDetails.textContent = 'Warning: 1 of 2 services is offline. Commonly caused by an Apache Port 80 conflict with Skype or Windows IIS, or MySQL crash.';
    showToast('WampServer: 1 service stopped (Orange)', false);
  } else if (color === 'red') {
    trayIcon.classList.add('tray-red');
    trayStatusText.classList.add('status-offline');
    trayStatusText.textContent = 'All Services Stopped (Red)';
    trayStatusDetails.textContent = 'All server daemons are offline. Apache and MySQL are idle. Browser requests to http://localhost will return ERR_CONNECTION_REFUSED.';
    showToast('WampServer: All services stopped (Red)', false);
  }
}

/* ==========================================================================
   9. Architecture Tab Switcher & Flow Tracer
   ========================================================================== */
function switchArchTab(type) {
  const buttons = document.querySelectorAll('.tab-control-bar .tab-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-arch') === type);
  });

  const serverTitle = document.getElementById('archServerTitle');
  const serverDesc = document.getElementById('archServerDesc');
  const serverMeta = document.getElementById('archServerMeta');
  const phpMeta = document.getElementById('archPhpMeta');
  const dbTitle = document.getElementById('archDbTitle');
  const dbDesc = document.getElementById('archDbDesc');
  const dbMeta = document.getElementById('archDbMeta');

  if (type === 'lamp') {
    if (serverTitle) serverTitle.textContent = 'Apache HTTP Server (Linux)';
    if (serverDesc) serverDesc.textContent = 'Event / Worker MPM daemon listening on port 80/443. Manages .htaccess and virtual hosts.';
    if (serverMeta) serverMeta.textContent = 'Process: /usr/sbin/apache2';
    if (phpMeta) phpMeta.textContent = 'mod_php / php-fpm (Linux POSIX)';
    if (dbTitle) dbTitle.textContent = 'MySQL Database Server';
    if (dbDesc) dbDesc.textContent = 'Linux mysqld daemon managing InnoDB relational tables with POSIX privileges.';
    if (dbMeta) dbMeta.textContent = 'TCP Port 3306 (InnoDB Engine)';
    showToast('Architecture switched to LAMP (Linux Production)');
  } else {
    if (serverTitle) serverTitle.textContent = 'Apache on Windows (wampapache64)';
    if (serverDesc) serverDesc.textContent = 'Windows ported Apache running under mpm_winnt multi-threaded service model.';
    if (serverMeta) serverMeta.textContent = 'Service: wampapache64 (C:\\wamp64)';
    if (phpMeta) phpMeta.textContent = 'Thread-Safe PHP (phpForApache.ini)';
    if (dbTitle) dbTitle.textContent = 'MySQL / MariaDB on Windows';
    if (dbDesc) dbDesc.textContent = 'Windows background service wampmysqld64 with web-based phpMyAdmin UI.';
    if (dbMeta) dbMeta.textContent = 'Port 3306 (MySQL) & 3307 (MariaDB)';
    showToast('Architecture switched to WAMP (Windows Dev)');
  }
}

let isTracing = false;
function startArchitectureTrace() {
  if (isTracing) return;
  isTracing = true;

  const btn = document.getElementById('traceFlowBtn');
  const statusPill = document.getElementById('traceStatusPill');
  const nodes = [
    document.getElementById('nodeClient'),
    document.getElementById('nodeApache'),
    document.getElementById('nodePhp'),
    document.getElementById('nodeMysql')
  ];
  const packets = [
    document.getElementById('packet1'),
    document.getElementById('packet2'),
    document.getElementById('packet3')
  ];

  if (btn) btn.disabled = true;

  // Clear previous active states
  nodes.forEach(n => n && n.classList.remove('active-trace'));
  packets.forEach(p => p && p.classList.remove('running'));

  const steps = [
    {
      msg: 'Step 1: Browser initiates HTTP GET request for index.php to Apache Web Server (Port 80)',
      activeNodeIndex: 0,
      packetIndex: 0
    },
    {
      msg: 'Step 2: Apache intercepts request, checks VirtualHost, and hands off execution to PHP engine',
      activeNodeIndex: 1,
      packetIndex: 1
    },
    {
      msg: 'Step 3: PHP executes code, constructs SQL query, and sends request to MySQL via PDO (Port 3306)',
      activeNodeIndex: 2,
      packetIndex: 2
    },
    {
      msg: 'Step 4: MySQL queries InnoDB storage tables and returns relational records back to PHP',
      activeNodeIndex: 3,
      packetIndex: 2
    },
    {
      msg: 'Step 5: PHP compiles records into complete HTML markup and streams it back to Apache',
      activeNodeIndex: 2,
      packetIndex: 1
    },
    {
      msg: 'Step 6: Apache wraps HTML in HTTP 200 OK headers and transmits rendered page to Browser!',
      activeNodeIndex: 1,
      packetIndex: 0
    }
  ];

  let currentStep = 0;

  function runNextStep() {
    if (currentStep < steps.length) {
      const s = steps[currentStep];
      if (statusPill) statusPill.textContent = s.msg;

      nodes.forEach((n, idx) => {
        if (n) n.classList.toggle('active-trace', idx === s.activeNodeIndex);
      });

      packets.forEach((p, idx) => {
        if (p) p.classList.toggle('running', idx === s.packetIndex);
      });

      currentStep++;
      setTimeout(runNextStep, 1500);
    } else {
      if (statusPill) statusPill.textContent = '\u2713 Flow Completed! Browser successfully received and rendered the webpage.';
      nodes.forEach(n => n && n.classList.remove('active-trace'));
      packets.forEach(p => p && p.classList.remove('running'));
      if (btn) btn.disabled = false;
      isTracing = false;
      showToast('Architecture request trace completed successfully!');
    }
  }

  runNextStep();
}

/* ==========================================================================
   10. Comparison Table Filtering
   ========================================================================== */
function filterComparison(category) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === category);
  });

  const rows = document.querySelectorAll('#comparisonTable tbody tr');
  rows.forEach(row => {
    if (category === 'all') {
      row.style.display = '';
    } else {
      const rowCat = row.getAttribute('data-category');
      row.style.display = (rowCat === category) ? '' : 'none';
    }
  });
}

/* ==========================================================================
   11. Linux Installation Stepper (LAMP)
   ========================================================================== */
function updateLinuxStepperUI() {
  const navButtons = document.querySelectorAll('#linuxStepNav .step-nav-btn');
  navButtons.forEach(btn => {
    const stepNum = parseInt(btn.getAttribute('data-step'), 10);
    btn.classList.toggle('active', stepNum === state.currentLinuxStep);
  });

  // Switch panels
  for (let i = 1; i <= state.totalLinuxSteps; i++) {
    const panel = document.getElementById(`linuxStep${i}`);
    if (panel) {
      panel.classList.toggle('active', i === state.currentLinuxStep);
    }
  }

  // Update dots indicator
  const dots = document.querySelectorAll('#linuxDots .dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index + 1 === state.currentLinuxStep);
  });

  // Update buttons state
  const prevBtn = document.getElementById('prevLinuxStepBtn');
  const nextBtn = document.getElementById('nextLinuxStepBtn');

  if (prevBtn) prevBtn.disabled = (state.currentLinuxStep === 1);
  if (nextBtn) {
    if (state.currentLinuxStep === state.totalLinuxSteps) {
      nextBtn.innerHTML = 'Finish &amp; Verify \u2713';
    } else {
      nextBtn.innerHTML = 'Next Step &rarr;';
    }
  }
}

function jumpLinuxStep(stepNumber) {
  state.currentLinuxStep = stepNumber;
  updateLinuxStepperUI();
}

function nextLinuxStep() {
  if (state.currentLinuxStep < state.totalLinuxSteps) {
    state.currentLinuxStep++;
    updateLinuxStepperUI();
  } else {
    showToast('You have completed all LAMP installation steps!');
  }
}

function prevLinuxStep() {
  if (state.currentLinuxStep > 1) {
    state.currentLinuxStep--;
    updateLinuxStepperUI();
  }
}

/* ==========================================================================
   12. Interactive Apache Request Lifecycle Simulator
   ========================================================================== */
let isApacheSimRunning = false;

function addSimLog(text, type = 'step') {
  const logBox = document.getElementById('simLogBox');
  if (!logBox) return;

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

  const line = document.createElement('div');
  line.className = `log-line log-${type}`;
  line.textContent = `[${timeStr}] ${text}`;

  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

function clearSimLog() {
  const logBox = document.getElementById('simLogBox');
  if (logBox) {
    logBox.innerHTML = '<div class="log-line log-system">[SYSTEM] Log cleared. Ready for next request simulation.</div>';
  }
}

function runApacheSim(type) {
  if (isApacheSimRunning) return;
  isApacheSimRunning = true;

  const steps = [
    document.getElementById('pipeStep1'),
    document.getElementById('pipeStep2'),
    document.getElementById('pipeStep3'),
    document.getElementById('pipeStep4'),
    document.getElementById('pipeStep5')
  ];

  const btnStatic = document.getElementById('simStaticBtn');
  const btnDynamic = document.getElementById('simDynamicBtn');
  if (btnStatic) btnStatic.disabled = true;
  if (btnDynamic) btnDynamic.disabled = true;

  steps.forEach(s => s && s.classList.remove('active'));

  if (type === 'static') {
    addSimLog('Initiating STATIC HTTP GET /styles/main.css ...', 'system');

    setTimeout(() => {
      if (steps[0]) steps[0].classList.add('active');
      addSimLog('Client: Browser initiates TCP connection on port 80 for static asset', 'step');
    }, 200);

    setTimeout(() => {
      if (steps[0]) steps[0].classList.remove('active');
      if (steps[1]) steps[1].classList.add('active');
      addSimLog('Apache: Matches document root (/var/www/html/styles/main.css). Bypasses PHP engine completely!', 'step');
    }, 1100);

    setTimeout(() => {
      if (steps[1]) steps[1].classList.remove('active');
      if (steps[4]) steps[4].classList.add('active');
      addSimLog('Apache: Emits HTTP 200 OK + Content-Type: text/css. Streams static byte buffer directly to browser.', 'success');
    }, 2000);

    setTimeout(() => {
      if (steps[4]) steps[4].classList.remove('active');
      addSimLog('Client: Browser parses CSS styles and renders UI. (Total latency: 14ms)', 'success');
      if (btnStatic) btnStatic.disabled = false;
      if (btnDynamic) btnDynamic.disabled = false;
      isApacheSimRunning = false;
      showToast('Static request simulation complete!');
    }, 3000);

  } else {
    // Dynamic request
    addSimLog('Initiating DYNAMIC HTTP GET /users.php?dept=engineering ...', 'system');

    setTimeout(() => {
      if (steps[0]) steps[0].classList.add('active');
      addSimLog('Client: Browser dispatches HTTP GET request with query parameters', 'step');
    }, 200);

    setTimeout(() => {
      if (steps[0]) steps[0].classList.remove('active');
      if (steps[1]) steps[1].classList.add('active');
      addSimLog('Apache: Inspects request -> recognizes .php extension -> delegates to mod_php / php-fpm handler', 'step');
    }, 1100);

    setTimeout(() => {
      if (steps[1]) steps[1].classList.remove('active');
      if (steps[2]) steps[2].classList.add('active');
      addSimLog('PHP: Zend Engine compiles users.php into bytecode. Parses session & instantiates PDO MySQL connection', 'step');
    }, 2000);

    setTimeout(() => {
      if (steps[2]) steps[2].classList.remove('active');
      if (steps[3]) steps[3].classList.add('active');
      addSimLog('MySQL: Executes "SELECT * FROM users WHERE active = 1" on Port 3306 -> returns 3 rows', 'db');
    }, 2900);

    setTimeout(() => {
      if (steps[3]) steps[3].classList.remove('active');
      if (steps[2]) steps[2].classList.add('active');
      addSimLog('PHP: Receives dataset, loops through associative array, renders complete HTML markup string', 'step');
    }, 3800);

    setTimeout(() => {
      if (steps[2]) steps[2].classList.remove('active');
      if (steps[4]) steps[4].classList.add('active');
      addSimLog('Apache: Attaches HTTP 200 OK headers + Gzip compression -> streams rendered HTML to client', 'success');
    }, 4700);

    setTimeout(() => {
      if (steps[4]) steps[4].classList.remove('active');
      addSimLog('Client: Browser constructs DOM and paints table to screen. (Total latency: 42ms)', 'success');
      if (btnStatic) btnStatic.disabled = false;
      if (btnDynamic) btnDynamic.disabled = false;
      isApacheSimRunning = false;
      showToast('Dynamic request simulation complete!');
    }, 5600);
  }
}

/* ==========================================================================
   13. Practical Examples Code Tabs & Live Preview
   ========================================================================== */
function switchCodeTab(tabId) {
  const tabBtns = document.querySelectorAll('.code-tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  const tabPanels = document.querySelectorAll('.code-tab-content');
  tabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.getAttribute('id') === `tabContent-${tabId}`);
  });
}

function triggerSimulatedDbRun() {
  const tableBody = document.getElementById('simTableBody');
  if (!tableBody) return;

  // Visual reload animation
  tableBody.style.opacity = '0.3';
  showToast('Executing simulated PDO SQL Query...');

  setTimeout(() => {
    const demoData = [
      { id: 101, name: 'Ada Lovelace', email: 'ada@computing.org', role: 'Chief Architect' },
      { id: 102, name: 'Alan Turing', email: 'alan@bletchley.ac.uk', role: 'Security Fellow' },
      { id: 103, name: 'Grace Hopper', email: 'grace@navy.mil', role: 'Systems Pioneer' },
      { id: 104, name: 'Linus Torvalds', email: 'torvalds@kernel.org', role: 'Kernel Lead' }
    ];

    let rowsHtml = '';
    demoData.forEach(row => {
      rowsHtml += `<tr>
        <td>${row.id}</td>
        <td><strong>${row.name}</strong></td>
        <td>${row.email}</td>
        <td><span style="background:#eff6ff;color:#2563eb;padding:2px 8px;border-radius:4px;font-weight:600;">${row.role}</span></td>
      </tr>`;
    });

    tableBody.innerHTML = rowsHtml;
    tableBody.style.opacity = '1';
    showToast('Query returned 4 fresh records from MySQL database!');
  }, 450);
}

/* ==========================================================================
   14. Comprehensive 10-Question Interactive Mastery Quiz
   ========================================================================== */
const quizQuestions = [
  {
    category: 'Stack Fundamentals',
    question: 'What does the acronym LAMP stand for in web engineering?',
    options: [
      'Linux, Apache, MySQL, PHP',
      'Linux, Android, MongoDB, Python',
      'Live, Apache, MariaDB, Perl',
      'Linux, Angular, MySQL, PostgreSQL'
    ],
    correct: 0,
    explanation: 'LAMP stands for Linux (Operating System), Apache (Web Server), MySQL (Database Management System), and PHP (Server-Side Scripting Language).'
  },
  {
    category: 'Operating System Parity',
    question: 'What is the primary difference between LAMP and WAMP?',
    options: [
      'LAMP uses PostgreSQL while WAMP uses Oracle Database',
      'LAMP runs on the Linux OS, whereas WAMP runs on Microsoft Windows',
      'LAMP does not support PHP scripts',
      'WAMP cannot be used for local website testing'
    ],
    correct: 1,
    explanation: 'The sole letter distinction is the host Operating System: L represents Linux (ideal for production servers) and W represents Windows (convenient for local workstation development).'
  },
  {
    category: 'Web Server Architecture',
    question: 'How does Apache HTTP Server handle a request for a static file like "style.css"?',
    options: [
      'It forwards the request to the MySQL database engine',
      'It executes the file inside the PHP Zend bytecode engine',
      'It serves the file directly from the filesystem to the browser, bypassing PHP',
      'It drops the connection if PHP is not enabled'
    ],
    correct: 2,
    explanation: 'For static assets (.css, .js, images, .html), Apache bypasses PHP entirely and streams the byte content straight from disk with minimal latency.'
  },
  {
    category: 'Windows WAMP Details',
    question: 'In WampServer on Windows, what does a GREEN system tray icon signify?',
    options: [
      'The server is updating Windows system files',
      'All background services (Apache and MySQL/MariaDB) are active and running normally',
      'Only MySQL is running; Apache failed to bind port 80',
      'WampServer is in offline diagnostic mode'
    ],
    correct: 1,
    explanation: 'WampServer uses a 3-color status indicator: Red (all services stopped), Orange (partial service active / port conflict), and Green (all services running online).'
  },
  {
    category: 'Linux File Structure',
    question: 'What is the standard default web document root directory on an Ubuntu LAMP server?',
    options: [
      'C:\\wamp64\\www\\',
      '/var/www/html/',
      '/etc/apache2/www/',
      '/home/user/public_html/'
    ],
    correct: 1,
    explanation: 'On Ubuntu/Debian Apache installations, the default DocumentRoot directive points to /var/www/html/. (On WampServer it is C:\\wamp64\\www\\).'
  },
  {
    category: 'Port Configurations',
    question: 'Which default network port is standard for incoming, unencrypted HTTP web traffic?',
    options: [
      'Port 21',
      'Port 22',
      'Port 80',
      'Port 3306'
    ],
    correct: 2,
    explanation: 'Port 80 is the global standard port for unencrypted HTTP traffic. Port 443 is for encrypted HTTPS, Port 3306 is for MySQL, and Port 22 is for SSH.'
  },
  {
    category: 'Filesystem Behavior',
    question: 'Why can developing on WAMP sometimes create unexpected bugs when deploying code to LAMP?',
    options: [
      'Windows NTFS is case-insensitive, while Linux filesystems are strictly case-sensitive',
      'PHP on Windows does not support database queries',
      'Apache does not run on Linux servers',
      'MySQL on Windows cannot save UTF-8 strings'
    ],
    correct: 0,
    explanation: 'Because Windows ignores casing (include "Header.php" will find "header.php"), typos go unnoticed locally. When uploaded to Linux (LAMP), the file is not found, resulting in a fatal 404/inclusion error.'
  },
  {
    category: 'Linux Terminal Management',
    question: 'Which terminal command is used on Ubuntu to restart the Apache web server after editing php.ini?',
    options: [
      'wamp restart apache',
      'sudo systemctl restart apache2',
      'reboot apache.exe',
      'sudo apt remove apache2'
    ],
    correct: 1,
    explanation: 'Systemd controls Linux daemons; "sudo systemctl restart apache2" gracefully restarts Apache and reloads PHP modules without rebooting the whole machine.'
  },
  {
    category: 'Database Drivers',
    question: 'Why is PHP Data Objects (PDO) recommended over legacy functions like mysql_query()?',
    options: [
      'PDO automatically converts PHP code into JavaScript',
      'PDO provides native prepared statements that prevent SQL Injection vulnerabilities',
      'PDO only works on Windows operating systems',
      'PDO requires no database password'
    ],
    correct: 1,
    explanation: 'PDO provides a consistent data-access abstraction layer and parameterized queries, which effectively eliminate SQL Injection attacks.'
  },
  {
    category: 'Production Strategy',
    question: 'What is the widely recommended industry best-practice development lifecycle?',
    options: [
      'Host public enterprise websites on personal Windows laptops with WAMP',
      'Develop and prototype locally on Windows with WAMP, then deploy to Linux LAMP servers for production',
      'Never test websites prior to public launch',
      'Avoid using web servers and open files directly from the desktop'
    ],
    correct: 1,
    explanation: '"Develop on WAMP (or local containers), deploy on LAMP" is the industry standard pattern combining desktop developer convenience with cloud server performance and security.'
  }
];

function loadQuizQuestion(index) {
  const q = quizQuestions[index];
  if (!q) return;

  state.quizAnswered = false;

  const currentQEl = document.getElementById('quizCurrentQ');
  const totalQEl = document.getElementById('quizTotalQ');
  const liveScoreEl = document.getElementById('quizLiveScore');
  const progressBar = document.getElementById('quizProgressBar');
  const categoryBadge = document.getElementById('quizCategoryBadge');
  const questionText = document.getElementById('quizQuestionText');
  const optionsGrid = document.getElementById('quizOptionsGrid');
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const nextBtn = document.getElementById('quizNextBtn');

  if (currentQEl) currentQEl.textContent = index + 1;
  if (totalQEl) totalQEl.textContent = quizQuestions.length;
  if (liveScoreEl) liveScoreEl.textContent = state.quizScore;
  if (progressBar) {
    const progressPercent = ((index + 1) / quizQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }

  if (categoryBadge) categoryBadge.textContent = q.category;
  if (questionText) questionText.textContent = q.question;

  if (feedbackBox) {
    feedbackBox.className = 'quiz-feedback-box hidden';
  }
  if (nextBtn) {
    nextBtn.classList.add('hidden');
    if (index === quizQuestions.length - 1) {
      nextBtn.textContent = 'View Final Results \uD83C\uDFC6';
    } else {
      nextBtn.textContent = 'Next Question \u2192';
    }
  }

  if (optionsGrid) {
    optionsGrid.innerHTML = '';
    const prefixes = ['A', 'B', 'C', 'D'];

    q.options.forEach((optText, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="option-prefix">${prefixes[optIndex]}</span>
        <span class="option-text">${optText}</span>
      `;
      btn.addEventListener('click', () => handleQuizOptionClick(optIndex));
      optionsGrid.appendChild(btn);
    });
  }
}

function handleQuizOptionClick(selectedIndex) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;

  const q = quizQuestions[state.currentQuizIndex];
  const optionButtons = document.querySelectorAll('.quiz-option-btn');
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackExplanation = document.getElementById('feedbackExplanation');
  const nextBtn = document.getElementById('quizNextBtn');
  const liveScoreEl = document.getElementById('quizLiveScore');

  const isCorrect = (selectedIndex === q.correct);

  if (isCorrect) {
    state.quizScore++;
    if (liveScoreEl) liveScoreEl.textContent = state.quizScore;
    state.userAnswers.push({ question: q.question, passed: true });

    if (feedbackBox) {
      feedbackBox.className = 'quiz-feedback-box feedback-correct';
      if (feedbackIcon) feedbackIcon.textContent = '\u2713';
      if (feedbackTitle) feedbackTitle.textContent = 'Correct Answer!';
      if (feedbackExplanation) feedbackExplanation.textContent = q.explanation;
    }
  } else {
    state.userAnswers.push({ question: q.question, passed: false });

    if (feedbackBox) {
      feedbackBox.className = 'quiz-feedback-box feedback-wrong';
      if (feedbackIcon) feedbackIcon.textContent = '\u2717';
      if (feedbackTitle) feedbackTitle.textContent = 'Incorrect';
      if (feedbackExplanation) {
        feedbackExplanation.innerHTML = `<strong>Correct Answer: ${q.options[q.correct]}</strong><br>${q.explanation}`;
      }
    }
  }

  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correct) {
      btn.classList.add('correct');
    } else if (idx === selectedIndex) {
      btn.classList.add('wrong');
    }
  });

  if (nextBtn) nextBtn.classList.remove('hidden');
}

function nextQuizQuestion() {
  if (state.currentQuizIndex < quizQuestions.length - 1) {
    state.currentQuizIndex++;
    loadQuizQuestion(state.currentQuizIndex);
  } else {
    showQuizSummary();
  }
}

function showQuizSummary() {
  const quizCard = document.getElementById('quizCard');
  const summaryCard = document.getElementById('quizSummaryCard');
  const finalScoreEl = document.getElementById('finalScore');
  const finalTotalEl = document.getElementById('finalTotal');
  const finalPercentEl = document.getElementById('finalPercent');
  const summaryTrophy = document.getElementById('summaryTrophy');
  const summaryTitle = document.getElementById('summaryTitle');
  const summaryMessage = document.getElementById('summaryMessage');
  const summaryBreakdown = document.getElementById('summaryBreakdown');

  if (quizCard) quizCard.classList.add('hidden');
  if (summaryCard) summaryCard.classList.remove('hidden');

  const total = quizQuestions.length;
  const score = state.quizScore;
  const percent = Math.round((score / total) * 100);

  if (finalScoreEl) finalScoreEl.textContent = score;
  if (finalTotalEl) finalTotalEl.textContent = total;
  if (finalPercentEl) finalPercentEl.textContent = `${percent}%`;

  if (percent >= 90) {
    if (summaryTrophy) summaryTrophy.textContent = '\uD83C\uDFC6';
    if (summaryTitle) summaryTitle.textContent = 'Master Web Architect!';
    if (summaryMessage) summaryMessage.textContent = 'Outstanding performance! You possess an authoritative grasp of LAMP and WAMP stack architectures, Linux server administration, and Apache data workflows.';
  } else if (percent >= 70) {
    if (summaryTrophy) summaryTrophy.textContent = '\uD83C\uDF1F';
    if (summaryTitle) summaryTitle.textContent = 'Proficient Stack Developer!';
    if (summaryMessage) summaryMessage.textContent = 'Well done! You have a solid working knowledge of web development environments. Review the Linux permissions and case sensitivity sections to score 100%.';
  } else {
    if (summaryTrophy) summaryTrophy.textContent = '\uD83D\uDCDA';
    if (summaryTitle) summaryTitle.textContent = 'Keep Learning & Practicing!';
    if (summaryMessage) summaryMessage.textContent = 'Good start! Review the architecture diagram and hands-on installation walk-throughs in the sidebar to sharpen your foundational skills.';
  }

  if (summaryBreakdown) {
    let breakdownHtml = '<div style="margin:20px 0;text-align:left;max-width:540px;margin-left:auto;margin-right:auto;">';
    state.userAnswers.forEach((ans, i) => {
      breakdownHtml += `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:0.85rem;">
          <span style="color:#475569;">Q${i+1}: ${ans.question.substring(0, 48)}...</span>
          <span style="font-weight:700;color:${ans.passed ? '#059669' : '#dc2626'}">${ans.passed ? '\u2713 Correct' : '\u2717 Missed'}</span>
        </div>
      `;
    });
    breakdownHtml += '</div>';
    summaryBreakdown.innerHTML = breakdownHtml;
  }
}

function restartQuiz() {
  state.currentQuizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.userAnswers = [];

  const quizCard = document.getElementById('quizCard');
  const summaryCard = document.getElementById('quizSummaryCard');

  if (summaryCard) summaryCard.classList.add('hidden');
  if (quizCard) quizCard.classList.remove('hidden');

  loadQuizQuestion(0);
  showToast('Quiz reset! Good luck.');
}
