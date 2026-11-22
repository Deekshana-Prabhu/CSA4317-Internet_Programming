/**
 * PASSGUARD – Password Strength & Regex Validator
 * Complete Client-Side JavaScript Logic
 * Standard: Vanilla ES6+
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. REGEX DEFINITIONS & VALIDATION ENGINE
  // ==========================================================================
  const REGEX_RULES = {
    length: {
      regex: /.{8,}/,
      elementId: 'req-length',
      label: 'Minimum 8 characters'
    },
    upper: {
      regex: /[A-Z]/,
      elementId: 'req-upper',
      label: 'At least one uppercase letter (A-Z)'
    },
    lower: {
      regex: /[a-z]/,
      elementId: 'req-lower',
      label: 'At least one lowercase letter (a-z)'
    },
    number: {
      regex: /[0-9]/,
      elementId: 'req-number',
      label: 'At least one number (0-9)'
    }
  };

  // Combined Master Regular Expression
  const COMBINED_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // DOM Elements - Password Validator
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeIcon = document.getElementById('eyeIcon');
  const eyeOffIcon = document.getElementById('eyeOffIcon');
  const validateBtn = document.getElementById('validateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const markWeak = document.getElementById('markWeak');
  const markMedium = document.getElementById('markMedium');
  const markStrong = document.getElementById('markStrong');
  const validationAlert = document.getElementById('validationAlert');
  const alertIcon = document.getElementById('alertIcon');
  const alertTitle = document.getElementById('alertTitle');
  const alertMessage = document.getElementById('alertMessage');
  const startValidationBtn = document.getElementById('startValidationBtn');

  // ==========================================================================
  // 2. PASSWORD VALIDATION LOGIC
  // ==========================================================================

  /**
   * Evaluates the given password against all rules and updates the UI
   * @param {string} password - The password string
   * @param {boolean} showExplicitAlert - Whether to force the alert banner (e.g. on Validate button click)
   */
  function evaluatePassword(password, showExplicitAlert = false) {
    const trimmed = password || '';
    const isEmpty = trimmed.length === 0;

    let satisfiedCount = 0;
    const unsatisfiedLabels = [];

    // Evaluate each individual rule
    Object.keys(REGEX_RULES).forEach(key => {
      const rule = REGEX_RULES[key];
      const el = document.getElementById(rule.elementId);
      const isSatisfied = rule.regex.test(trimmed);

      if (isEmpty) {
        // Neutral reset state when input is cleared
        el.classList.remove('satisfied', 'unsatisfied');
      } else if (isSatisfied) {
        el.classList.add('satisfied');
        el.classList.remove('unsatisfied');
        satisfiedCount++;
      } else {
        el.classList.add('unsatisfied');
        el.classList.remove('satisfied');
        unsatisfiedLabels.push(rule.label);
      }
    });

    // Verify with Combined Regex Pattern
    const isCombinedValid = COMBINED_REGEX.test(trimmed);

    // Update Strength Meter
    updateStrengthMeter(trimmed, satisfiedCount);

    // Update Status Alert Message Banner
    updateValidationAlert(trimmed, isCombinedValid, unsatisfiedLabels, showExplicitAlert);
  }

  /**
   * Updates visual progress bar and text label according to satisfied criteria count
   */
  function updateStrengthMeter(password, score) {
    // Reset marks active state
    markWeak.classList.remove('active-indicator');
    markMedium.classList.remove('active-indicator');
    markStrong.classList.remove('active-indicator');

    // Reset bar classes
    strengthBar.className = 'strength-bar-fill';
    strengthText.className = 'strength-status-badge';

    if (!password || password.length === 0) {
      strengthBar.style.width = '0%';
      strengthText.textContent = 'Awaiting Input';
      strengthText.classList.add('badge-neutral');
      return;
    }

    if (score <= 2) {
      // WEAK
      strengthBar.style.width = score === 1 ? '25%' : '40%';
      strengthBar.classList.add('bar-weak');
      strengthText.textContent = 'Weak';
      strengthText.classList.add('badge-weak');
      markWeak.classList.add('active-indicator');
    } else if (score === 3) {
      // MEDIUM
      strengthBar.style.width = '70%';
      strengthBar.classList.add('bar-medium');
      strengthText.textContent = 'Medium';
      strengthText.classList.add('badge-medium');
      markMedium.classList.add('active-indicator');
    } else if (score === 4) {
      // STRONG (All 4 conditions satisfied)
      // Bonus fill to 100% if longer than 12 chars
      strengthBar.style.width = password.length >= 12 ? '100%' : '90%';
      strengthBar.classList.add('bar-strong');
      strengthText.textContent = 'Strong';
      strengthText.classList.add('badge-strong');
      markStrong.classList.add('active-indicator');
    }
  }

  /**
   * Updates the status banner with appropriate success or missing criteria messages
   */
  function updateValidationAlert(password, isValid, missingRules, forceDisplay = false) {
    if (!password || password.length === 0) {
      validationAlert.classList.add('hidden');
      return;
    }

    if (isValid) {
      // All conditions met: Success banner
      validationAlert.className = 'validation-alert alert-success';
      alertIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
      alertTitle.textContent = 'Password is valid!';
      alertMessage.textContent = 'Excellent! Your password satisfies all security requirements and regular expression checks.';
      validationAlert.classList.remove('hidden');
    } else if (forceDisplay || password.length > 0) {
      // Missing requirements: Warning/Info banner
      validationAlert.className = 'validation-alert alert-warning';
      alertIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
      alertTitle.textContent = 'Password Requirements Incomplete';
      alertMessage.textContent = `Please fulfill the missing conditions: ${missingRules.join(', ')}.`;
      validationAlert.classList.remove('hidden');
    }
  }

  // Real-time input validation listener
  passwordInput.addEventListener('input', () => {
    evaluatePassword(passwordInput.value, false);
  });

  // Explicit "Validate Password" button listener
  validateBtn.addEventListener('click', () => {
    const val = passwordInput.value;
    if (!val || val.length === 0) {
      // Empty input notification
      validationAlert.className = 'validation-alert alert-warning';
      alertIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
      alertTitle.textContent = 'No Password Entered';
      alertMessage.textContent = 'Please type a password into the input field above before validating.';
      validationAlert.classList.remove('hidden');
      passwordInput.focus();
      return;
    }

    evaluatePassword(val, true);

    // Subtle feedback flash on input
    passwordInput.style.borderColor = COMBINED_REGEX.test(val) ? 'var(--color-success)' : 'var(--color-warning)';
    setTimeout(() => {
      passwordInput.style.borderColor = '';
    }, 1200);
  });

  // "Reset" button listener
  resetBtn.addEventListener('click', () => {
    passwordInput.value = '';
    evaluatePassword('', false);
    passwordInput.focus();
  });

  // "Show/Hide Password" Toggle
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    if (isPassword) {
      passwordInput.setAttribute('type', 'text');
      eyeIcon.classList.add('hidden');
      eyeOffIcon.classList.remove('hidden');
      togglePasswordBtn.setAttribute('aria-label', 'Hide password');
    } else {
      passwordInput.setAttribute('type', 'password');
      eyeIcon.classList.remove('hidden');
      eyeOffIcon.classList.add('hidden');
      togglePasswordBtn.setAttribute('aria-label', 'Show password');
    }
  });

  // ==========================================================================
  // 3. REGEX EXAMPLES & AUTO-FILL HANDLERS
  // ==========================================================================

  // Copy Combined Pattern to Clipboard
  const copyPatternBtn = document.getElementById('copyPatternBtn');
  if (copyPatternBtn) {
    copyPatternBtn.addEventListener('click', async () => {
      const patternText = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/';
      try {
        await navigator.clipboard.writeText(patternText);
        const originalText = copyPatternBtn.querySelector('.copy-text').textContent;
        copyPatternBtn.querySelector('.copy-text').textContent = 'Copied!';
        copyPatternBtn.style.backgroundColor = 'var(--color-success)';
        copyPatternBtn.style.color = '#ffffff';

        setTimeout(() => {
          copyPatternBtn.querySelector('.copy-text').textContent = originalText;
          copyPatternBtn.style.backgroundColor = '';
          copyPatternBtn.style.color = '';
        }, 2000);
      } catch (err) {
        // Fallback for clipboard API restrictions
        const textarea = document.createElement('textarea');
        textarea.value = patternText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyPatternBtn.querySelector('.copy-text').textContent = 'Copied!';
        setTimeout(() => {
          copyPatternBtn.querySelector('.copy-text').textContent = 'Copy';
        }, 2000);
      }
    });
  }

  // "Try Example" buttons in Examples section
  const exampleButtons = document.querySelectorAll('.btn-example');
  exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const samplePassword = btn.getAttribute('data-password');
      if (samplePassword) {
        passwordInput.value = samplePassword;
        // Evaluate immediately
        evaluatePassword(samplePassword, true);

        // Smooth scroll to validator section
        const validatorSection = document.getElementById('validator');
        if (validatorSection) {
          validatorSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Highlight input field
        passwordInput.focus();
        passwordInput.style.borderColor = 'var(--primary)';
        passwordInput.style.boxShadow = '0 0 0 4px var(--primary-light)';
        setTimeout(() => {
          passwordInput.style.borderColor = '';
          passwordInput.style.boxShadow = '';
        }, 1500);
      }
    });
  });

  // Hero "Start Validation" button scroll
  if (startValidationBtn) {
    startValidationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const validatorSection = document.getElementById('validator');
      if (validatorSection) {
        validatorSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => passwordInput.focus(), 500);
      }
    });
  }

  // ==========================================================================
  // 4. REGEXP OBJECT METHODS INTERACTIVE SANDBOX
  // ==========================================================================
  const sampleTextInput = document.getElementById('sampleTextInput');
  const regexPatternInput = document.getElementById('regexPatternInput');
  const regexFlagsInput = document.getElementById('regexFlagsInput');
  const testPatternBtn = document.getElementById('testPatternBtn');
  const resetSandboxBtn = document.getElementById('resetSandboxBtn');
  const sandboxError = document.getElementById('sandboxError');
  const sandboxErrorMessage = document.getElementById('sandboxErrorMessage');
  const matchStatusBadge = document.getElementById('matchStatusBadge');
  const highlightedOutput = document.getElementById('highlightedOutput');
  const testCallExpr = document.getElementById('testCallExpr');
  const testResultVal = document.getElementById('testResultVal');
  const execCallExpr = document.getElementById('execCallExpr');
  const execResultVal = document.getElementById('execResultVal');
  const execMatchText = document.getElementById('execMatchText');
  const execMatchIndex = document.getElementById('execMatchIndex');
  const toStringCallExpr = document.getElementById('toStringCallExpr');
  const toStringResultVal = document.getElementById('toStringResultVal');
  const presetButtons = document.querySelectorAll('.preset-btn');

  /**
   * Helper function to escape HTML special characters to prevent injection in highlights
   */
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Parses user input pattern and flags safely
   * Supports both plain pattern e.g. [A-Z] and literal regex e.g. /[A-Z]/gi
   */
  function parseUserRegex(rawPattern, rawFlags) {
    let cleanPattern = rawPattern.trim();
    let cleanFlags = (rawFlags || '').trim();

    // Check if user entered pattern enclosed in slashes: /pattern/flags
    const slashMatch = cleanPattern.match(/^\/(.*)\/([gimsuy]*)$/);
    if (slashMatch) {
      cleanPattern = slashMatch[1];
      if (!cleanFlags && slashMatch[2]) {
        cleanFlags = slashMatch[2];
      }
    }

    // Instantiate RegExp safely
    return new RegExp(cleanPattern, cleanFlags);
  }

  /**
   * Runs the interactive regex sandbox evaluation safely
   */
  function runRegexSandbox() {
    const text = sampleTextInput.value;
    const patternStr = regexPatternInput.value;
    const flagsStr = regexFlagsInput.value;

    // Reset error banner
    sandboxError.classList.add('hidden');
    sandboxErrorMessage.textContent = '';

    if (!patternStr) {
      sandboxError.classList.remove('hidden');
      sandboxErrorMessage.textContent = 'Please enter a regular expression pattern.';
      return;
    }

    let regexInstance;
    try {
      regexInstance = parseUserRegex(patternStr, flagsStr);
    } catch (err) {
      // Safe error handling for invalid regular expression syntax
      sandboxError.classList.remove('hidden');
      sandboxErrorMessage.textContent = err.message || 'Invalid regular expression syntax.';
      
      // Update UI to indicate error state
      matchStatusBadge.className = 'status-pill status-not-found';
      matchStatusBadge.textContent = 'Syntax Error';
      highlightedOutput.innerHTML = escapeHTML(text);
      testResultVal.className = 'out-result res-false';
      testResultVal.textContent = 'Error';
      execResultVal.textContent = 'null';
      execMatchText.textContent = 'N/A';
      execMatchIndex.textContent = 'N/A';
      toStringResultVal.textContent = 'Invalid RegExp';
      return;
    }

    // 1. Demonstrate test() method
    // Note: If regex has global 'g' flag, exec/test advances lastIndex, so we create clean instances for testing
    let testInstance;
    try {
      testInstance = parseUserRegex(patternStr, flagsStr);
    } catch (e) {
      testInstance = regexInstance;
    }

    const testResult = testInstance.test(text);

    // 2. Demonstrate exec() method
    let execInstance;
    try {
      execInstance = parseUserRegex(patternStr, flagsStr);
    } catch (e) {
      execInstance = regexInstance;
    }

    const execResult = execInstance.exec(text);

    // 3. Demonstrate toString() method
    const toStringResult = regexInstance.toString();

    // Update expressions in UI
    testCallExpr.textContent = `${toStringResult}.test("${escapeHTML(text).slice(0, 24)}")`;
    execCallExpr.textContent = `${toStringResult}.exec("${escapeHTML(text).slice(0, 24)}")`;
    toStringCallExpr.textContent = `${toStringResult}.toString()`;

    // Update test() Result Output
    if (testResult) {
      testResultVal.className = 'out-result res-true';
      testResultVal.textContent = 'true';
      matchStatusBadge.className = 'status-pill status-found';
      matchStatusBadge.textContent = 'Match Found (true)';
    } else {
      testResultVal.className = 'out-result res-false';
      testResultVal.textContent = 'false';
      matchStatusBadge.className = 'status-pill status-not-found';
      matchStatusBadge.textContent = 'No Match (false)';
    }

    // Update exec() Result Output
    if (execResult !== null) {
      // Format array details
      const matchArray = Array.from(execResult);
      execResultVal.textContent = JSON.stringify(matchArray);
      execMatchText.textContent = `"${execResult[0]}"`;
      execMatchIndex.textContent = `${execResult.index}`;
    } else {
      execResultVal.textContent = 'null';
      execMatchText.textContent = 'null';
      execMatchIndex.textContent = 'null';
    }

    // Update toString() Result Output
    toStringResultVal.textContent = `"${toStringResult}"`;

    // 4. Update Visual Match Highlight
    renderMatchHighlights(text, regexInstance, execResult);
  }

  /**
   * Renders the sample text with visual chips highlighting match locations
   */
  function renderMatchHighlights(text, regex, firstMatch) {
    if (!text || text.length === 0) {
      highlightedOutput.innerHTML = '<span style="color:var(--text-subtle); font-style:italic;">(Empty string)</span>';
      return;
    }

    if (!firstMatch) {
      highlightedOutput.innerHTML = escapeHTML(text);
      return;
    }

    try {
      // Check if regex has global flag
      if (regex.global) {
        let highlighted = '';
        let lastIdx = 0;
        let match;
        const globalRegex = new RegExp(regex.source, regex.flags);

        while ((match = globalRegex.exec(text)) !== null) {
          const matchStart = match.index;
          const matchEnd = matchStart + match[0].length;

          // Append unmatched prefix
          highlighted += escapeHTML(text.substring(lastIdx, matchStart));
          // Append highlighted match
          highlighted += `<span class="match-chip">${escapeHTML(match[0])}</span>`;
          lastIdx = matchEnd;

          // Prevent infinite loop on zero-length matches
          if (match[0].length === 0) {
            globalRegex.lastIndex++;
          }
        }
        highlighted += escapeHTML(text.substring(lastIdx));
        highlightedOutput.innerHTML = highlighted;
      } else {
        // Single match highlight
        const matchStart = firstMatch.index;
        const matchEnd = matchStart + firstMatch[0].length;
        const before = escapeHTML(text.substring(0, matchStart));
        const matched = escapeHTML(text.substring(matchStart, matchEnd));
        const after = escapeHTML(text.substring(matchEnd));

        highlightedOutput.innerHTML = `${before}<span class="match-chip">${matched}</span>${after}`;
      }
    } catch (err) {
      highlightedOutput.innerHTML = escapeHTML(text);
    }
  }

  // Sandbox Event Listeners
  if (testPatternBtn) {
    testPatternBtn.addEventListener('click', runRegexSandbox);
  }

  // Run on input change inside sandbox inputs
  [sampleTextInput, regexPatternInput, regexFlagsInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', runRegexSandbox);
    }
  });

  // Sandbox Presets buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pattern = btn.getAttribute('data-pattern');
      const text = btn.getAttribute('data-text');
      const flags = btn.getAttribute('data-flags') || '';

      if (pattern && text !== null) {
        regexPatternInput.value = pattern;
        sampleTextInput.value = text;
        regexFlagsInput.value = flags;
        runRegexSandbox();
      }
    });
  });

  // Sandbox Reset button
  if (resetSandboxBtn) {
    resetSandboxBtn.addEventListener('click', () => {
      sampleTextInput.value = 'Hello123';
      regexPatternInput.value = '[A-Z]';
      regexFlagsInput.value = '';
      runRegexSandbox();
    });
  }

  // ==========================================================================
  // 5. NAVIGATION, SCROLLSPY & MOBILE MENU
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile drawer
  if (mobileMenuBtn && sidebar && sidebarOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    });
  }

  // Smooth scroll and active class management on nav click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);

        if (targetEl) {
          e.preventDefault();

          // Close mobile menu if open
          if (sidebar) sidebar.classList.remove('open');
          if (sidebarOverlay) sidebarOverlay.classList.remove('active');

          targetEl.scrollIntoView({ behavior: 'smooth' });

          // Update active class
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // ScrollSpy using IntersectionObserver
  const sections = document.querySelectorAll('.content-section');
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
            const linkSection = link.getAttribute('data-section');
            if (linkSection === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // ==========================================================================
  // 6. INITIAL RUN
  // ==========================================================================
  // Initialize sandbox with default values
  runRegexSandbox();

  // Initialize password validator in clean awaiting state
  evaluatePassword('', false);
});
