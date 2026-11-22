/**
 * ==============================================================================
 * SMART SEARCH: Interactive Form Events & AJAX Autocomplete
 * Vanilla JavaScript Implementation (Strict Three-File Architecture)
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* --------------------------------------------------------------------------
     1. Sample Course & Skills Dataset (In-Memory JSON Store)
     Must include: Python, Java, JavaScript, HTML, CSS, Machine Learning,
     Artificial Intelligence, Computer Vision, Data Science, Web Development.
     -------------------------------------------------------------------------- */
  const COURSE_DATABASE = [
    {
      id: "PY-101",
      name: "Python",
      category: "Programming Language",
      icon: "🐍",
      level: "Beginner to Advanced",
      duration: "8 Weeks",
      prerequisites: "None (Beginner Friendly)",
      description: "Master Python fundamentals, OOP, data structures, and practical scripting applied in web development, automation, and AI.",
      modules: ["Syntax & Collections", "Object-Oriented Programming", "Package Management & PIP", "File I/O & Exception Handling", "Standard Libraries"]
    },
    {
      id: "JV-201",
      name: "Java",
      category: "Enterprise Software",
      icon: "☕",
      level: "Intermediate",
      duration: "10 Weeks",
      prerequisites: "Basic programming logic",
      description: "Enterprise-grade object-oriented application development, JVM architecture, concurrency, and Spring Boot microservices.",
      modules: ["JVM & Memory Management", "Generics & Collections Framework", "Multithreading & Concurrency", "Spring Boot Microservices", "JUnit Testing"]
    },
    {
      id: "JS-301",
      name: "JavaScript",
      category: "Web & Full-Stack",
      icon: "⚡",
      level: "Beginner to Full-Stack",
      duration: "10 Weeks",
      prerequisites: "HTML & CSS basics",
      description: "The core language of the interactive modern web: ES6+ syntax, asynchronous programming, DOM events, and Fetch API.",
      modules: ["Modern ES6+ Syntax", "Event Loop & Promises", "DOM Manipulation & Events", "Fetch API & AJAX", "Async/Await Architecture"]
    },
    {
      id: "HT-100",
      name: "HTML",
      category: "Web Foundations",
      icon: "🌐",
      level: "Absolute Beginner",
      duration: "3 Weeks",
      prerequisites: "None",
      description: "Structure accessible and semantic web documents using HTML5 standards, web accessibility guidelines (WCAG), and responsive forms.",
      modules: ["Semantic HTML5 Tags", "Interactive Forms & Inputs", "Media & Audio/Video", "Accessibility & ARIA", "SEO Essentials"]
    },
    {
      id: "CS-105",
      name: "CSS",
      category: "UI & Styling",
      icon: "🎨",
      level: "Beginner to Intermediate",
      duration: "4 Weeks",
      prerequisites: "HTML basics",
      description: "Craft modern, responsive user interfaces with CSS Flexbox, Grid layouts, custom properties, animations, and responsive media queries.",
      modules: ["Box Model & Specificity", "Flexbox & CSS Grid Systems", "Custom Properties (Variables)", "Keyframe Transitions & Animations", "Responsive Mobile-First Design"]
    },
    {
      id: "ML-401",
      name: "Machine Learning",
      category: "Artificial Intelligence",
      icon: "🤖",
      level: "Intermediate to Advanced",
      duration: "12 Weeks",
      prerequisites: "Python & Linear Algebra",
      description: "Build predictive models using supervised and unsupervised learning algorithms, regression, classification, clustering, and Scikit-Learn.",
      modules: ["Supervised vs Unsupervised Models", "Regression & Classification", "Decision Trees & Random Forests", "Model Evaluation & Cross-Validation", "Scikit-Learn Pipelines"]
    },
    {
      id: "AI-501",
      name: "Artificial Intelligence",
      category: "Emerging Tech",
      icon: "🧠",
      level: "Advanced",
      duration: "14 Weeks",
      prerequisites: "Machine Learning fundamentals",
      description: "Deep dive into neural networks, reinforcement learning, transformer architectures, and foundational AI agent system designs.",
      modules: ["Deep Neural Networks", "Backpropagation & Optimizers", "Transformers & Attention Mechanisms", "Reinforcement Learning", "Ethical AI & Deployment"]
    },
    {
      id: "CV-450",
      name: "Computer Vision",
      category: "Visual Computing",
      icon: "👁️",
      level: "Advanced",
      duration: "8 Weeks",
      prerequisites: "Python & Deep Learning",
      description: "Process and understand digital images and videos using OpenCV, convolutional neural networks (CNNs), object detection, and segmentation.",
      modules: ["OpenCV Image Processing", "Convolutional Neural Networks (CNN)", "Object Detection (YOLO)", "Image Segmentation", "Face & Pose Recognition"]
    },
    {
      id: "DS-350",
      name: "Data Science",
      category: "Analytics & Big Data",
      icon: "📊",
      level: "Intermediate",
      duration: "10 Weeks",
      prerequisites: "Basic Python or Statistics",
      description: "Extract actionable insights from raw data using Pandas, NumPy, statistical hypothesis testing, and interactive data visualization.",
      modules: ["Exploratory Data Analysis (EDA)", "Pandas & NumPy Arrays", "Data Cleaning & Feature Engineering", "Matplotlib & Seaborn Visualizations", "Statistical Inference"]
    },
    {
      id: "WD-250",
      name: "Web Development",
      category: "Full-Stack Development",
      icon: "🚀",
      level: "Beginner to Career Ready",
      duration: "16 Weeks",
      prerequisites: "None",
      description: "End-to-end full-stack web development: client-side interactivity, server-side APIs, database modeling, and cloud deployment pipelines.",
      modules: ["Frontend Architecture (HTML/CSS/JS)", "RESTful API Integration", "Client-Server HTTP Cycle", "State Management & Storage", "Performance & Production Deployment"]
    }
  ];

  /**
   * Create an Asynchronous JSON Data URL.
   * This provides a true JavaScript fetch() asynchronous data endpoint
   * without needing external servers or a fourth file.
   */
  const JSON_DATA_URL = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(COURSE_DATABASE));

  /* --------------------------------------------------------------------------
     2. Global Telemetry State & Counters
     -------------------------------------------------------------------------- */
  const telemetryState = {
    keyPresses: 0,
    focusEvents: 0,
    blurEvents: 0,
    ajaxFetches: 0,
    lastEventFilter: "all"
  };

  const logsHistory = [];

  /* --------------------------------------------------------------------------
     3. DOM Element References
     -------------------------------------------------------------------------- */
  // Navigation & Layout
  const sidebar = document.getElementById("sidebar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const navLinks = document.querySelectorAll(".nav-link");
  const currentSectionTitle = document.getElementById("current-section-title");
  const liveEventsPill = document.getElementById("live-events-pill");

  // Counters
  const counterKeys = document.getElementById("counter-keys");
  const counterFocus = document.getElementById("counter-focus");
  const counterBlur = document.getElementById("counter-blur");
  const counterAjax = document.getElementById("counter-ajax");

  // Form Fields & Groups
  const interactiveForm = document.getElementById("interactive-demo-form");
  const inputFullName = document.getElementById("input-fullname");
  const inputEmail = document.getElementById("input-email");
  const groupFullName = document.getElementById("group-fullname");
  const groupEmail = document.getElementById("group-email");
  const feedbackFullName = document.getElementById("feedback-fullname");
  const feedbackEmail = document.getElementById("feedback-email");
  const btnClearForm = document.getElementById("btn-clear-form");
  const btnSampleData = document.getElementById("btn-sample-data");

  // Keydown Inspector Elements
  const displayKeyName = document.getElementById("display-key-name");
  const displayKeyCode = document.getElementById("display-key-code");
  const displayKeyTarget = document.getElementById("display-key-target");
  const displayKeyCount = document.getElementById("display-key-count");
  const specialKeyAlert = document.getElementById("special-key-alert");
  const specialKeyTitle = document.getElementById("special-key-title");
  const specialKeyDesc = document.getElementById("special-key-desc");

  // AJAX Autocomplete Elements
  const searchInput = document.getElementById("ajax-search-input");
  const searchSpinner = document.getElementById("search-spinner");
  const btnClearSearch = document.getElementById("btn-clear-search");
  const dropdownWrapper = document.getElementById("dropdown-wrapper");
  const suggestionsList = document.getElementById("suggestions-list");
  const noResultsView = document.getElementById("no-results-view");
  const dropdownCountLabel = document.getElementById("dropdown-count-label");
  const debounceStatusBadge = document.getElementById("debounce-status-badge");
  const fetchStatusBadge = document.getElementById("fetch-status-badge");
  const feedbackSearch = document.getElementById("feedback-search");
  const sampleTags = document.querySelectorAll(".sample-tag");

  // Result Preview Elements
  const previewCard = document.getElementById("search-result-preview");
  const previewEmptyState = document.getElementById("preview-empty-state");
  const previewActiveContent = document.getElementById("preview-active-content");
  const previewCategory = document.getElementById("preview-category");
  const previewLevel = document.getElementById("preview-level");
  const previewIconBox = document.getElementById("preview-icon-box");
  const previewTitle = document.getElementById("preview-title");
  const previewCode = document.getElementById("preview-code");
  const previewDescription = document.getElementById("preview-description");
  const previewModules = document.getElementById("preview-modules");
  const previewDuration = document.getElementById("preview-duration");
  const previewPrereq = document.getElementById("preview-prereq");
  const btnCopyPreview = document.getElementById("btn-copy-preview");
  const btnDismissPreview = document.getElementById("btn-dismiss-preview");

  // Event Monitor & Log Elements
  const logStreamContainer = document.getElementById("log-stream-container");
  const logList = document.getElementById("log-list");
  const emptyLogState = document.getElementById("empty-log-state");
  const btnClearLog = document.getElementById("btn-clear-log");
  const logFilterGroup = document.getElementById("log-filter-group");
  const filterChips = document.querySelectorAll(".filter-chip");
  const countFilterAll = document.getElementById("count-filter-all");
  const countFilterFocus = document.getElementById("count-filter-focus");
  const countFilterBlur = document.getElementById("count-filter-blur");
  const countFilterKeydown = document.getElementById("count-filter-keydown");
  const countFilterAjax = document.getElementById("count-filter-ajax");

  // Reset Controls
  const btnSidebarReset = document.getElementById("btn-sidebar-reset");
  const btnGlobalReset = document.getElementById("btn-global-reset");
  const toastContainer = document.getElementById("toast-container");

  /* --------------------------------------------------------------------------
     4. Utility Functions: Logging, Toasts, & UI Counters
     -------------------------------------------------------------------------- */

  /**
   * Display floating toast alert message.
   */
  function showToast(title, message, theme = "toast-blue") {
    const toast = document.createElement("div");
    toast.className = `toast ${theme}`;

    let iconSymbol = "ℹ️";
    if (theme === "toast-purple") iconSymbol = "⚡";
    if (theme === "toast-green") iconSymbol = "✅";
    if (theme === "toast-amber") iconSymbol = "⚠️";
    if (theme === "toast-red") iconSymbol = "🚨";

    toast.innerHTML = `
      <div class="toast-icon">${iconSymbol}</div>
      <div class="toast-body">
        <span class="toast-title">${title}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Auto dismiss after 3.2s
    setTimeout(() => {
      toast.classList.add("hiding");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, 3200);
  }

  /**
   * Log an event into the live stream and update counts.
   */
  function logEvent(type, targetName, message) {
    const timestamp = new Date();
    const timeStr = timestamp.toTimeString().split(" ")[0] + "." + String(timestamp.getMilliseconds()).padStart(3, "0");

    const logItem = {
      id: Date.now() + Math.random(),
      type: type.toLowerCase(), // 'focus', 'blur', 'keydown', 'ajax', 'reset'
      typeDisplay: type.toUpperCase(),
      time: timeStr,
      target: targetName,
      message: message
    };

    logsHistory.unshift(logItem);
    if (logsHistory.length > 100) {
      logsHistory.pop();
    }

    renderLogs();
    updateCounterDisplays();
  }

  /**
   * Render logs filtered by current active tab.
   */
  function renderLogs() {
    const filter = telemetryState.lastEventFilter;
    const filtered = filter === "all" ? logsHistory : logsHistory.filter(item => item.type === filter);

    logList.innerHTML = "";

    if (filtered.length === 0) {
      emptyLogState.classList.add("visible");
    } else {
      emptyLogState.classList.remove("visible");

      filtered.forEach(item => {
        const entry = document.createElement("div");
        entry.className = "log-entry";
        entry.innerHTML = `
          <span class="log-time">${item.time}</span>
          <div><span class="log-badge type-${item.type}">${item.typeDisplay}</span></div>
          <span class="log-target" title="${item.target}">${item.target}</span>
          <span class="log-message">${escapeHTML(item.message)}</span>
        `;
        logList.appendChild(entry);
      });
    }

    // Update filter counters
    countFilterAll.textContent = logsHistory.length;
    countFilterFocus.textContent = logsHistory.filter(i => i.type === "focus").length;
    countFilterBlur.textContent = logsHistory.filter(i => i.type === "blur").length;
    countFilterKeydown.textContent = logsHistory.filter(i => i.type === "keydown").length;
    countFilterAjax.textContent = logsHistory.filter(i => i.type === "ajax").length;
  }

  /**
   * Update metric cards and indicators on screen.
   */
  function updateCounterDisplays() {
    counterKeys.textContent = telemetryState.keyPresses;
    counterFocus.textContent = telemetryState.focusEvents;
    counterBlur.textContent = telemetryState.blurEvents;
    counterAjax.textContent = telemetryState.ajaxFetches;
    liveEventsPill.textContent = logsHistory.length;
  }

  /**
   * Escape HTML helper.
   */
  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* --------------------------------------------------------------------------
     5. Form Events: Focus, Blur & Validation Logic
     Demonstrating Focus: Border color change + helper message.
     Demonstrating Blur: Restore border + show message + validate value.
     -------------------------------------------------------------------------- */

  /**
   * Update Field Feedback UI Component.
   */
  function setFieldFeedback(feedbackEl, badgeClass, badgeLabel, textMessage) {
    feedbackEl.innerHTML = `
      <span class="feedback-badge ${badgeClass}">${badgeLabel}</span>
      <span class="feedback-text">${textMessage}</span>
    `;
  }

  // --- Full Name Input Handlers ---
  inputFullName.addEventListener("focus", (e) => {
    telemetryState.focusEvents++;
    groupFullName.classList.remove("valid", "invalid");
    setFieldFeedback(
      feedbackFullName,
      "focus-active",
      "Focus Active",
      "Field focused! Enter your full name (minimum 3 characters required)."
    );
    logEvent("focus", "Full Name Input", "Gained focus. Border glow activated.");
    showToast("Focus Event", "Full Name field active", "toast-blue");
  });

  inputFullName.addEventListener("blur", (e) => {
    telemetryState.blurEvents++;
    const value = inputFullName.value.trim();

    if (value.length === 0) {
      groupFullName.classList.add("invalid");
      groupFullName.classList.remove("valid");
      setFieldFeedback(
        feedbackFullName,
        "error-state",
        "Validation Error",
        "Full Name cannot be empty. Please enter your name."
      );
      logEvent("blur", "Full Name Input", "Lost focus with validation error: Field is empty.");
      showToast("Blur Validation Failed", "Full Name is required", "toast-red");
    } else if (value.length < 3) {
      groupFullName.classList.add("invalid");
      groupFullName.classList.remove("valid");
      setFieldFeedback(
        feedbackFullName,
        "error-state",
        "Validation Error",
        `Name "${value}" is too short. Minimum 3 characters needed.`
      );
      logEvent("blur", "Full Name Input", `Lost focus with validation error: Name too short (${value.length} chars).`);
      showToast("Blur Validation Failed", "Name must be at least 3 characters", "toast-amber");
    } else {
      groupFullName.classList.add("valid");
      groupFullName.classList.remove("invalid");
      setFieldFeedback(
        feedbackFullName,
        "valid-state",
        "Validated",
        `Valid name recognized: "${value}". Border restored to success state.`
      );
      logEvent("blur", "Full Name Input", `Lost focus and passed validation: "${value}".`);
      showToast("Blur Validated", "Full Name looks great", "toast-green");
    }
  });

  // --- Email Address Input Handlers ---
  inputEmail.addEventListener("focus", (e) => {
    telemetryState.focusEvents++;
    groupEmail.classList.remove("valid", "invalid");
    setFieldFeedback(
      feedbackEmail,
      "focus-active",
      "Focus Active",
      "Field focused! Please input your corporate or personal email address."
    );
    logEvent("focus", "Email Input", "Gained focus. Border glow activated.");
    showToast("Focus Event", "Email field active", "toast-purple");
  });

  inputEmail.addEventListener("blur", (e) => {
    telemetryState.blurEvents++;
    const value = inputEmail.value.trim();
    // Comprehensive standard email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (value.length === 0) {
      groupEmail.classList.add("invalid");
      groupEmail.classList.remove("valid");
      setFieldFeedback(
        feedbackEmail,
        "error-state",
        "Validation Error",
        "Email address cannot be empty. Please enter an email."
      );
      logEvent("blur", "Email Input", "Lost focus with validation error: Email is empty.");
      showToast("Blur Validation Failed", "Email address is required", "toast-red");
    } else if (!emailRegex.test(value)) {
      groupEmail.classList.add("invalid");
      groupEmail.classList.remove("valid");
      setFieldFeedback(
        feedbackEmail,
        "error-state",
        "Syntax Error",
        `"${value}" is not a valid email syntax (must include @ and valid domain).`
      );
      logEvent("blur", "Email Input", `Lost focus with validation error: Invalid format "${value}".`);
      showToast("Blur Validation Failed", "Invalid email format entered", "toast-amber");
    } else {
      groupEmail.classList.add("valid");
      groupEmail.classList.remove("invalid");
      setFieldFeedback(
        feedbackEmail,
        "valid-state",
        "Verified",
        `Email verified: "${value}". Ready for dispatch.`
      );
      logEvent("blur", "Email Input", `Lost focus and passed validation: "${value}".`);
      showToast("Blur Validated", "Email format verified", "toast-green");
    }
  });

  // Form Submission Event
  interactiveForm.addEventListener("submit", (e) => {
    e.preventDefault();
    inputFullName.focus();
    inputFullName.blur();
    inputEmail.focus();
    inputEmail.blur();

    const isNameValid = groupFullName.classList.contains("valid");
    const isEmailValid = groupEmail.classList.contains("valid");

    if (isNameValid && isEmailValid) {
      showToast("Form Submitted Successfully", `Registered: ${inputFullName.value.trim()}`, "toast-green");
      logEvent("focus", "Form Submission", `Submission approved for ${inputFullName.value.trim()} <${inputEmail.value.trim()}>`);
    } else {
      showToast("Submission Blocked", "Please resolve highlighted field errors", "toast-red");
      logEvent("blur", "Form Submission", "Submission rejected due to invalid fields.");
    }
  });

  // Sample data button
  btnSampleData.addEventListener("click", () => {
    inputFullName.value = "Jordan Vance";
    inputEmail.value = "jordan.vance@example.com";
    inputFullName.focus();
    setTimeout(() => {
      inputFullName.blur();
      inputEmail.focus();
      setTimeout(() => {
        inputEmail.blur();
      }, 150);
    }, 150);
    showToast("Sample Data Loaded", "Populated and verified sample profile", "toast-purple");
  });

  // Clear form button
  btnClearForm.addEventListener("click", () => {
    inputFullName.value = "";
    inputEmail.value = "";
    groupFullName.classList.remove("valid", "invalid");
    groupEmail.classList.remove("valid", "invalid");
    setFieldFeedback(feedbackFullName, "default", "Idle", "Click or tab into this field to test focus event.");
    setFieldFeedback(feedbackEmail, "default", "Idle", "Field will validate email syntax when you blur away.");
    showToast("Form Cleared", "Inputs reset to default state", "toast-blue");
    logEvent("reset", "User Form", "Cleared all input fields and validation states.");
  });

  /* --------------------------------------------------------------------------
     6. Keydown Telemetry & Special Key Handler
     Displays pressed key & code, counts keypresses, special banners for Enter/Backspace.
     -------------------------------------------------------------------------- */
  function handleKeydownTelemetry(e) {
    telemetryState.keyPresses++;
    displayKeyCount.textContent = telemetryState.keyPresses;

    const keyName = e.key === " " ? "Space" : e.key;
    const keyCode = e.code || e.keyCode;
    const targetTag = e.target.id || e.target.tagName;

    // Update capsule display
    displayKeyName.textContent = keyName;
    displayKeyCode.textContent = keyCode;
    displayKeyTarget.textContent = targetTag;

    // Key capsule pulse animation
    displayKeyCapsuleAnimation();

    // Special key detection: Enter & Backspace
    if (e.key === "Enter") {
      specialKeyAlert.className = "special-key-panel enter-active";
      specialKeyTitle.textContent = "🚀 Special Key: [Enter] Triggered!";
      specialKeyDesc.innerHTML = `You pressed <kbd>Enter</kbd> (code: <code>${keyCode}</code>). In forms, Enter initiates submission or triggers selection.`;
      logEvent("keydown", targetTag, `Special key [Enter] pressed (code: ${keyCode}).`);
      showToast("Special Key Detected", "Enter key pressed!", "toast-green");
    } else if (e.key === "Backspace") {
      specialKeyAlert.className = "special-key-panel backspace-active";
      specialKeyTitle.textContent = "⌫ Special Key: [Backspace] Detected!";
      specialKeyDesc.innerHTML = `You pressed <kbd>Backspace</kbd> (code: <code>${keyCode}</code>). Deletion event registered in input stream.`;
      logEvent("keydown", targetTag, `Special key [Backspace] pressed (code: ${keyCode}).`);
    } else {
      specialKeyAlert.className = "special-key-panel";
      specialKeyTitle.textContent = `Keystroke: [${keyName}]`;
      specialKeyDesc.innerHTML = `Key: <kbd>${keyName}</kbd> | Code: <code>${keyCode}</code> | Target: <code>${targetTag}</code>.`;
      logEvent("keydown", targetTag, `Keydown [${keyName}] (code: ${keyCode}).`);
    }

    updateCounterDisplays();
  }

  function displayKeyCapsuleAnimation() {
    displayKeyName.classList.remove("key-pop");
    void displayKeyName.offsetWidth; // trigger reflow
    displayKeyName.classList.add("key-pop");
    setTimeout(() => {
      displayKeyName.classList.remove("key-pop");
    }, 120);
  }

  // Attach keydown listener to interactive inputs
  [inputFullName, inputEmail, searchInput].forEach(field => {
    field.addEventListener("keydown", handleKeydownTelemetry);
  });

  /* --------------------------------------------------------------------------
     7. AJAX Autocomplete Search Engine
     - Real-time debounced asynchronous Fetch API
     - URL / Data URL endpoint
     - Filter suggestions based on query
     - Dynamic dropdown creation & keyboard navigation
     - No-results handling & error handling
     -------------------------------------------------------------------------- */
  let debounceTimeout = null;
  let activeIndex = -1;
  let currentSearchResults = [];

  // Focus & Blur on Search Input
  searchInput.addEventListener("focus", () => {
    telemetryState.focusEvents++;
    setFieldFeedback(
      feedbackSearch,
      "focus-active",
      "Search Active",
      "Search field focused. Enter keywords to query the asynchronous JSON endpoint."
    );
    logEvent("focus", "Search Input", "Gained focus. Autocomplete engine listening.");
    if (searchInput.value.trim().length > 0 && currentSearchResults.length > 0) {
      openDropdown();
    }
  });

  searchInput.addEventListener("blur", () => {
    telemetryState.blurEvents++;
    setFieldFeedback(
      feedbackSearch,
      "default",
      "Idle",
      "Search inactive. Click to query courses and skills."
    );
    logEvent("blur", "Search Input", "Lost focus.");
    // Allow click events on suggestions to register before closing
    setTimeout(() => {
      closeDropdown();
    }, 200);
  });

  // Clear search button
  btnClearSearch.addEventListener("click", () => {
    clearSearchState();
    searchInput.focus();
    showToast("Search Cleared", "Input cleared and dropdown closed", "toast-blue");
    logEvent("reset", "Search Input", "Search query cleared.");
  });

  function clearSearchState() {
    searchInput.value = "";
    btnClearSearch.classList.remove("visible");
    closeDropdown();
    hidePreviewCard();
    currentSearchResults = [];
    activeIndex = -1;
    debounceStatusBadge.classList.remove("active");
    debounceStatusBadge.innerHTML = `<span class="dot-status"></span> Debounce: 300ms`;
    fetchStatusBadge.textContent = "Fetch: Ready";
  }

  // Sample quick tag buttons
  sampleTags.forEach(tag => {
    tag.addEventListener("click", () => {
      const query = tag.getAttribute("data-query");
      searchInput.value = query;
      triggerSearch(query);
      searchInput.focus();
    });
  });

  // Debounced input handler
  searchInput.addEventListener("input", (e) => {
    const query = searchInput.value.trim();

    if (query.length > 0) {
      btnClearSearch.classList.add("visible");
    } else {
      btnClearSearch.classList.remove("visible");
      closeDropdown();
      hidePreviewCard();
      return;
    }

    // Indicate debounce timer waiting
    debounceStatusBadge.classList.add("active");
    debounceStatusBadge.innerHTML = `<span class="dot-status"></span> Debouncing...`;

    // Clear previous pending debounce timer
    clearTimeout(debounceTimeout);

    // 300ms debounce as specified in requirements
    debounceTimeout = setTimeout(() => {
      debounceStatusBadge.classList.remove("active");
      debounceStatusBadge.innerHTML = `<span class="dot-status"></span> Debounced (300ms)`;
      triggerSearch(query);
    }, 300);
  });

  /**
   * Asynchronous Search Trigger using Fetch API.
   * Fetches data from the JSON Data URL, filters records, and renders suggestions.
   */
  async function triggerSearch(query) {
    if (!query || query.trim() === "") {
      closeDropdown();
      return;
    }

    const cleanQuery = query.trim().toLowerCase();
    searchSpinner.classList.add("active");
    fetchStatusBadge.textContent = "Fetch: Fetching...";
    telemetryState.ajaxFetches++;
    updateCounterDisplays();

    logEvent("ajax", "Fetch API", `Dispatching async request for "${query}" to JSON endpoint...`);

    try {
      // Simulate real asynchronous network delay of ~120ms for realistic user feedback
      await new Promise(r => setTimeout(r, 120));

      const response = await fetch(JSON_DATA_URL);
      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }

      const allCourses = await response.json();

      // Dynamic Filter based on user input (not hardcoded)
      const matched = allCourses.filter(course => {
        const nameMatch = course.name.toLowerCase().includes(cleanQuery);
        const categoryMatch = course.category.toLowerCase().includes(cleanQuery);
        const descMatch = course.description.toLowerCase().includes(cleanQuery);
        const moduleMatch = course.modules.some(m => m.toLowerCase().includes(cleanQuery));
        return nameMatch || categoryMatch || descMatch || moduleMatch;
      });

      currentSearchResults = matched;
      fetchStatusBadge.textContent = `Fetch: ${matched.length} results`;
      logEvent("ajax", "Fetch API", `Request resolved: Found ${matched.length} match(es) for "${query}".`);

      renderSuggestions(matched, query);

    } catch (error) {
      console.error("AJAX Fetch Error:", error);
      fetchStatusBadge.textContent = "Fetch: Error";
      logEvent("ajax", "Fetch API", `Error occurred during fetch: ${error.message}`);
      showToast("AJAX Fetch Failed", error.message, "toast-red");
      renderErrorState(error.message);
    } finally {
      searchSpinner.classList.remove("active");
    }
  }

  /**
   * Render dynamic suggestions list.
   */
  function renderSuggestions(results, query) {
    suggestionsList.innerHTML = "";
    activeIndex = -1;

    if (results.length === 0) {
      noResultsView.classList.add("visible");
      dropdownCountLabel.textContent = "No matches";
      openDropdown();
      return;
    }

    noResultsView.classList.remove("visible");
    dropdownCountLabel.textContent = `${results.length} Suggestion${results.length > 1 ? "s" : ""} Found`;

    results.forEach((course, index) => {
      const li = document.createElement("li");
      li.className = "suggestion-item";
      li.setAttribute("role", "option");
      li.setAttribute("data-index", index);

      // Highlight matching substrings safely
      const highlightedName = highlightSubstring(course.name, query);

      li.innerHTML = `
        <div class="suggestion-left">
          <span class="suggestion-icon">${course.icon}</span>
          <span class="suggestion-title">${highlightedName}</span>
        </div>
        <span class="suggestion-meta">${course.category}</span>
      `;

      // Clickable suggestion selection
      li.addEventListener("click", () => {
        selectCourseSuggestion(course);
      });

      suggestionsList.appendChild(li);
    });

    openDropdown();
  }

  /**
   * Highlight query substring within text.
   */
  function highlightSubstring(text, query) {
    if (!query) return escapeHTML(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    return escapeHTML(text).replace(regex, "<mark>$1</mark>");
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function renderErrorState(errorMessage) {
    suggestionsList.innerHTML = "";
    noResultsView.classList.add("visible");
    dropdownCountLabel.textContent = "Fetch Failure";
    noResultsView.innerHTML = `
      <div class="no-results-icon">⚠️</div>
      <h4 class="no-results-title">Failed to fetch suggestions</h4>
      <p class="no-results-desc">${escapeHTML(errorMessage)}</p>
    `;
    openDropdown();
  }

  function openDropdown() {
    dropdownWrapper.classList.add("open");
  }

  function closeDropdown() {
    dropdownWrapper.classList.remove("open");
    activeIndex = -1;
  }

  /**
   * Handle Suggestion Selection:
   * Fills input, reveals preview card, logs event, and closes dropdown.
   */
  function selectCourseSuggestion(course) {
    searchInput.value = course.name;
    btnClearSearch.classList.add("visible");
    closeDropdown();

    // Populate and show Preview Inspector Card
    showCoursePreview(course);

    showToast("Suggestion Selected", `Loaded details for "${course.name}"`, "toast-purple");
    logEvent("ajax", "Autocomplete Select", `Selected suggestion: "${course.name}" (${course.category}).`);
  }

  /**
   * Populate Search Result Preview Card.
   */
  function showCoursePreview(course) {
    previewEmptyState.style.display = "none";
    previewActiveContent.classList.add("active");

    previewCategory.textContent = course.category;
    previewLevel.textContent = course.level;
    previewIconBox.textContent = course.icon;
    previewTitle.textContent = course.name;
    previewCode.textContent = `COURSE REF: #${course.id}`;
    previewDescription.textContent = course.description;
    previewDuration.textContent = course.duration;
    previewPrereq.textContent = course.prerequisites;

    // Render modules tags
    previewModules.innerHTML = "";
    course.modules.forEach(mod => {
      const span = document.createElement("span");
      span.className = "module-pill";
      span.textContent = mod;
      previewModules.appendChild(span);
    });

    // Copy button handler
    btnCopyPreview.onclick = () => {
      const summary = `${course.name} (${course.category}) - ${course.description}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(summary).then(() => {
          showToast("Copied to Clipboard", `Copied details for ${course.name}`, "toast-green");
        }).catch(() => {
          showToast("Copy Ready", summary, "toast-blue");
        });
      } else {
        showToast("Copy Ready", summary, "toast-blue");
      }
      logEvent("keydown", "Preview Card", `Copied summary of "${course.name}" to clipboard.`);
    };
  }

  function hidePreviewCard() {
    previewEmptyState.style.display = "flex";
    previewActiveContent.classList.remove("active");
  }

  btnDismissPreview.addEventListener("click", () => {
    hidePreviewCard();
    showToast("Preview Closed", "Inspector reset to empty state", "toast-blue");
    logEvent("blur", "Preview Card", "Closed course details preview.");
  });

  // Keyboard navigation inside Autocomplete Search Input
  searchInput.addEventListener("keydown", (e) => {
    if (!dropdownWrapper.classList.contains("open")) return;

    const items = suggestionsList.querySelectorAll(".suggestion-item");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      highlightActiveSuggestion(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      highlightActiveSuggestion(items);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < currentSearchResults.length) {
        e.preventDefault();
        selectCourseSuggestion(currentSearchResults[activeIndex]);
      }
    } else if (e.key === "Escape") {
      closeDropdown();
      showToast("Dropdown Dismissed", "Closed suggestions with Escape", "toast-blue");
    }
  });

  function highlightActiveSuggestion(items) {
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add("selected");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("selected");
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. Event Monitor Log Controls & Filtering
     -------------------------------------------------------------------------- */
  btnClearLog.addEventListener("click", () => {
    logsHistory.length = 0;
    renderLogs();
    showToast("Activity Log Cleared", "Timeline history emptied", "toast-blue");
  });

  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.getAttribute("data-filter");
      telemetryState.lastEventFilter = filter;
      renderLogs();
    });
  });

  /* --------------------------------------------------------------------------
     9. Global Reset Everything Functionality
     -------------------------------------------------------------------------- */
  function resetAllState() {
    // 1. Reset Form
    inputFullName.value = "";
    inputEmail.value = "";
    groupFullName.classList.remove("valid", "invalid");
    groupEmail.classList.remove("valid", "invalid");
    setFieldFeedback(feedbackFullName, "default", "Idle", "Click or tab into this field to test the focus event.");
    setFieldFeedback(feedbackEmail, "default", "Idle", "Field will validate email syntax when you blur away.");

    // 2. Reset Search
    clearSearchState();

    // 3. Reset Keydown Inspector
    displayKeyName.textContent = "None";
    displayKeyCode.textContent = "—";
    displayKeyTarget.textContent = "—";
    displayKeyCount.textContent = "0";
    specialKeyAlert.className = "special-key-panel";
    specialKeyTitle.textContent = "Awaiting keystroke...";
    specialKeyDesc.innerHTML = `Press any key in any input field. Notice distinct alerts for <kbd>Enter</kbd> and <kbd>Backspace</kbd>.`;

    // 4. Reset Telemetry Counters
    telemetryState.keyPresses = 0;
    telemetryState.focusEvents = 0;
    telemetryState.blurEvents = 0;
    telemetryState.ajaxFetches = 0;
    logsHistory.length = 0;

    // 5. Update UI
    updateCounterDisplays();
    renderLogs();

    showToast("System Reset Complete", "All forms, search queries, and event monitors restored", "toast-blue");
    logEvent("reset", "System State", "Complete application state initialized to zero.");
  }

  btnSidebarReset.addEventListener("click", resetAllState);
  btnGlobalReset.addEventListener("click", resetAllState);

  /* --------------------------------------------------------------------------
     10. Sidebar Navigation & Smooth Section Tracking
     -------------------------------------------------------------------------- */
  // Mobile drawer toggle
  mobileMenuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    sidebarBackdrop.classList.toggle("active");
  });

  sidebarBackdrop.addEventListener("click", () => {
    sidebar.classList.remove("open");
    sidebarBackdrop.classList.remove("active");
  });

  // Smooth scroll and active indicator
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth" });

          navLinks.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
          currentSectionTitle.textContent = link.querySelector(".nav-label").textContent;

          // Close mobile menu if open
          sidebar.classList.remove("open");
          sidebarBackdrop.classList.remove("active");
        }
      }
    });
  });

  // IntersectionObserver to sync sidebar navigation with scroll position
  const sections = document.querySelectorAll(".content-section");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentSectionTitle.textContent = link.querySelector(".nav-label").textContent;
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* --------------------------------------------------------------------------
     11. Initial Application Boot & Log Entry
     -------------------------------------------------------------------------- */
  updateCounterDisplays();
  renderLogs();
  logEvent("ajax", "System Ready", "Data URL endpoint primed with 10 sample technology courses.");
  showToast("Application Online", "DOM listeners & AJAX Autocomplete ready", "toast-blue");

});
