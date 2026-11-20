/**
 * RegisterHub – Smart User Registration Portal
 * Pure Vanilla JavaScript Client-Side Validation Engine & LocalStorage Manager
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Storage Configuration & State
  // =========================================================================
  const STORAGE_KEY = 'registerhub_users';
  const LAST_REGISTRATION_KEY = 'registerhub_last_registration';

  // In-memory registration records
  let registeredUsers = loadUsersFromStorage();
  let lastRegistration = loadLastRegistration();

  // =========================================================================
  // 2. DOM Selectors
  // =========================================================================
  
  // Navigation & Sidebar
  const sidebar = document.getElementById('sidebar');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');
  const portalSections = document.querySelectorAll('.portal-section');
  const sidebarProgressPill = document.getElementById('sidebar-progress-pill');
  const sidebarCountBadge = document.getElementById('sidebar-count-badge');
  const metricRecordsCount = document.getElementById('metric-records-count');
  const metricFieldsProgress = document.getElementById('metric-fields-progress');

  // Form Progress Bar
  const progressBarFill = document.getElementById('progress-bar-fill');
  const completionPercent = document.getElementById('completion-percent');
  const progressStatusCaption = document.getElementById('progress-status-caption');

  // Registration Form & Alert
  const registrationForm = document.getElementById('registration-form');
  const formAlertBox = document.getElementById('form-alert-box');
  const alertMessageText = document.getElementById('alert-message-text');
  const btnSubmit = document.getElementById('btn-submit');
  const submitSpinner = document.getElementById('submit-spinner');
  const submitBtnText = document.getElementById('submit-btn-text');
  const submitBtnIcon = document.getElementById('submit-btn-icon');
  const btnTriggerReset = document.getElementById('btn-trigger-reset');

  // Form Inputs
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const dobInput = document.getElementById('dob');
  const genderSelect = document.getElementById('gender');
  const countrySelect = document.getElementById('country');
  const addressInput = document.getElementById('address');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const messageInput = document.getElementById('message');
  const termsCheckbox = document.getElementById('terms');
  const newsletterCheckbox = document.getElementById('newsletter');

  // Error Containers
  const fullnameError = document.getElementById('fullname-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const dobError = document.getElementById('dob-error');
  const genderError = document.getElementById('gender-error');
  const countryError = document.getElementById('country-error');
  const addressError = document.getElementById('address-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirm-password-error');
  const messageError = document.getElementById('message-error');
  const termsError = document.getElementById('terms-error');

  // Password Features
  const togglePasswordBtn = document.getElementById('toggle-password');
  const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
  const strengthMeterWrap = document.getElementById('strength-meter-wrap');
  const strengthBadge = document.getElementById('strength-badge');
  const matchPill = document.getElementById('match-pill');
  const ruleLen = document.getElementById('rule-len');
  const ruleUpper = document.getElementById('rule-upper');
  const ruleLower = document.getElementById('rule-lower');
  const ruleNumSym = document.getElementById('rule-num-sym');

  // Character Counter
  const charCounter = document.getElementById('char-counter');
  const charCount = document.getElementById('char-count');

  // Summary Receipt Elements
  const summaryEmptyState = document.getElementById('summary-empty-state');
  const summaryReceiptCard = document.getElementById('summary-receipt-card');
  const receiptRegId = document.getElementById('receipt-reg-id');
  const receiptName = document.getElementById('receipt-name');
  const receiptEmail = document.getElementById('receipt-email');
  const receiptPhone = document.getElementById('receipt-phone');
  const receiptDob = document.getElementById('receipt-dob');
  const receiptGender = document.getElementById('receipt-gender');
  const receiptCountry = document.getElementById('receipt-country');
  const receiptAddress = document.getElementById('receipt-address');
  const receiptContact = document.getElementById('receipt-contact');
  const receiptNewsletter = document.getElementById('receipt-newsletter');
  const receiptTimestamp = document.getElementById('receipt-timestamp');
  const receiptMessage = document.getElementById('receipt-message');
  const btnPrintSummary = document.getElementById('btn-print-summary');
  const btnDownloadTxt = document.getElementById('btn-download-txt');
  const btnRegisterAnother = document.getElementById('btn-register-another');

  // Records Table & Controls
  const searchInput = document.getElementById('search-input');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const btnLoadSamples = document.getElementById('btn-load-samples');
  const btnClearRecords = document.getElementById('btn-clear-records');
  const recordsTable = document.getElementById('records-table');
  const recordsTableBody = document.getElementById('records-table-body');
  const emptyRecordsMessage = document.getElementById('empty-records-message');
  const emptyRecordsTitle = document.getElementById('empty-records-title');
  const emptyRecordsDesc = document.getElementById('empty-records-desc');
  const recordsCountText = document.getElementById('records-count-text');

  // Modals
  const successModal = document.getElementById('success-modal');
  const popupRegId = document.getElementById('popup-reg-id');
  const popupMiniSummary = document.getElementById('popup-mini-summary');
  const btnPopupViewSummary = document.getElementById('btn-popup-view-summary');
  const btnPopupPrint = document.getElementById('btn-popup-print');
  const btnPopupClose = document.getElementById('btn-popup-close');

  const resetConfirmModal = document.getElementById('reset-confirm-modal');
  const btnCancelReset = document.getElementById('btn-cancel-reset');
  const btnConfirmReset = document.getElementById('btn-confirm-reset');

  // Toast Container
  const toastStack = document.getElementById('toast-stack');

  // =========================================================================
  // 3. Regular Expressions & Validation Constraints
  // =========================================================================
  const REGEX = {
    // 3 to 60 characters, letters, spaces, hyphens and apostrophes
    name: /^[a-zA-Z\s'-]{3,60}$/,
    // Standard RFC-compliant email pattern
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    // 10 to 14 digits after stripping non-numeric symbols
    phoneClean: /^\d{10,14}$/,
    // Password requirements: at least 1 upper, 1 lower, 1 digit, 1 special symbol
    pwdUpper: /[A-Z]/,
    pwdLower: /[a-z]/,
    pwdNumber: /[0-9]/,
    pwdSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/
  };

  // List of required fields for progress calculation
  const REQUIRED_FIELDS_COUNT = 10;

  // =========================================================================
  // 4. Initial Application Setup
  // =========================================================================
  initDateConstraints();
  renderRecordsTable();
  updateSidebarMetrics();
  updateFormProgress();
  
  if (lastRegistration) {
    populateSummaryReceipt(lastRegistration);
  }

  // =========================================================================
  // 5. Sidebar Navigation & Drawer Logic
  // =========================================================================
  function openMobileSidebar() {
    sidebar.classList.add('mobile-open');
    sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggleBtn.addEventListener('click', openMobileSidebar);
  sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Smooth Navigation Links & Active State Updates
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      if (window.innerWidth <= 1024) {
        closeMobileSidebar();
      }
    });
  });

  // Intersection Observer for Active Nav Highlighting on Scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  portalSections.forEach(section => sectionObserver.observe(section));

  // =========================================================================
  // 6. Validation Engine Implementation
  // =========================================================================

  /**
   * Set max date for Date of Birth so future dates cannot be chosen
   */
  function initDateConstraints() {
    const today = new Date();
    // Max date: today
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dobInput.max = `${yyyy}-${mm}-${dd}`;
    // Min date: 120 years ago
    dobInput.min = `${yyyy - 120}-01-01`;
  }

  /**
   * Helper to set field validation appearance
   */
  function setFieldState(input, errorElement, isValid, message = '') {
    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      errorElement.textContent = '';
      input.removeAttribute('aria-invalid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      errorElement.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    }
  }

  /**
   * Reset field state to neutral
   */
  function clearFieldState(input, errorElement) {
    input.classList.remove('is-valid', 'is-invalid');
    if (errorElement) errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  // Field: Full Name
  function validateFullName(showError = true) {
    const val = fullnameInput.value.trim();
    if (!val) {
      if (showError) setFieldState(fullnameInput, fullnameError, false, 'Full Name is required.');
      return false;
    }
    if (val.length < 3) {
      if (showError) setFieldState(fullnameInput, fullnameError, false, 'Name must be at least 3 characters long.');
      return false;
    }
    if (!REGEX.name.test(val)) {
      if (showError) setFieldState(fullnameInput, fullnameError, false, 'Name must contain letters, spaces, hyphens or apostrophes only.');
      return false;
    }
    setFieldState(fullnameInput, fullnameError, true);
    return true;
  }

  // Field: Email Address
  function validateEmail(showError = true) {
    const val = emailInput.value.trim();
    if (!val) {
      if (showError) setFieldState(emailInput, emailError, false, 'Email Address is required.');
      return false;
    }
    if (!REGEX.email.test(val)) {
      if (showError) setFieldState(emailInput, emailError, false, 'Please enter a valid email format (e.g., user@domain.com).');
      return false;
    }
    setFieldState(emailInput, emailError, true);
    return true;
  }

  // Field: Phone Number
  function validatePhone(showError = true) {
    const rawVal = phoneInput.value.trim();
    if (!rawVal) {
      if (showError) setFieldState(phoneInput, phoneError, false, 'Phone Number is required.');
      return false;
    }
    // Strip non-digits
    const cleanDigits = rawVal.replace(/\D/g, '');
    if (!REGEX.phoneClean.test(cleanDigits)) {
      if (showError) setFieldState(phoneInput, phoneError, false, 'Please enter 10 to 14 valid digits.');
      return false;
    }
    setFieldState(phoneInput, phoneError, true);
    return true;
  }

  // Field: Date of Birth
  function validateDob(showError = true) {
    const val = dobInput.value;
    if (!val) {
      if (showError) setFieldState(dobInput, dobError, false, 'Date of Birth is required.');
      return false;
    }

    const birthDate = new Date(val);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      if (showError) setFieldState(dobInput, dobError, false, 'Please enter a valid date.');
      return false;
    }

    if (birthDate >= today) {
      if (showError) setFieldState(dobInput, dobError, false, 'Date of Birth must be in the past.');
      return false;
    }

    // Age calculation
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      if (showError) setFieldState(dobInput, dobError, false, 'You must be at least 13 years old to register.');
      return false;
    }
    if (age > 120) {
      if (showError) setFieldState(dobInput, dobError, false, 'Please enter a realistic date of birth.');
      return false;
    }

    setFieldState(dobInput, dobError, true);
    return true;
  }

  // Field: Gender
  function validateGender(showError = true) {
    const val = genderSelect.value;
    if (!val) {
      if (showError) setFieldState(genderSelect, genderError, false, 'Please select your gender.');
      return false;
    }
    setFieldState(genderSelect, genderError, true);
    return true;
  }

  // Field: Country
  function validateCountry(showError = true) {
    const val = countrySelect.value;
    if (!val) {
      if (showError) setFieldState(countrySelect, countryError, false, 'Please select your country.');
      return false;
    }
    setFieldState(countrySelect, countryError, true);
    return true;
  }

  // Field: Address
  function validateAddress(showError = true) {
    const val = addressInput.value.trim();
    if (!val) {
      if (showError) setFieldState(addressInput, addressError, false, 'Address is required.');
      return false;
    }
    if (val.length < 5) {
      if (showError) setFieldState(addressInput, addressError, false, 'Address must be at least 5 characters long.');
      return false;
    }
    setFieldState(addressInput, addressError, true);
    return true;
  }

  // Field: Password & Live Checklist & Strength Indicator
  function evaluatePasswordSecurity(pwd) {
    const checks = {
      length: pwd.length >= 8,
      upper: REGEX.pwdUpper.test(pwd),
      lower: REGEX.pwdLower.test(pwd),
      numSym: (REGEX.pwdNumber.test(pwd) && (REGEX.pwdSpecial.test(pwd) || pwd.length >= 10))
    };

    // Update Checklist UI
    updateChecklistItem(ruleLen, checks.length);
    updateChecklistItem(ruleUpper, checks.upper);
    updateChecklistItem(ruleLower, checks.lower);
    updateChecklistItem(ruleNumSym, checks.numSym);

    // Calculate Entropy Score (0 - 4)
    let score = 0;
    if (checks.length) score++;
    if (checks.upper) score++;
    if (checks.lower) score++;
    if (REGEX.pwdNumber.test(pwd)) score++;
    if (REGEX.pwdSpecial.test(pwd)) score++;

    // Update Strength Meter UI
    strengthMeterWrap.className = 'pwd-strength-container';
    if (!pwd) {
      strengthBadge.textContent = 'None';
    } else if (score <= 2 || pwd.length < 8) {
      strengthMeterWrap.classList.add('strength-weak');
      strengthBadge.textContent = 'Weak';
    } else if (score === 3 || score === 4) {
      strengthMeterWrap.classList.add('strength-medium');
      strengthBadge.textContent = 'Medium';
    } else {
      strengthMeterWrap.classList.add('strength-strong');
      strengthBadge.textContent = 'Strong';
    }

    return checks.length && checks.upper && checks.lower && REGEX.pwdNumber.test(pwd) && REGEX.pwdSpecial.test(pwd);
  }

  function updateChecklistItem(itemElement, isValid) {
    const iconSpan = itemElement.querySelector('.rule-icon');
    if (isValid) {
      itemElement.classList.add('valid');
      iconSpan.textContent = '✓';
    } else {
      itemElement.classList.remove('valid');
      iconSpan.textContent = '○';
    }
  }

  function validatePassword(showError = true) {
    const val = passwordInput.value;
    const isCriteriaMet = evaluatePasswordSecurity(val);

    if (!val) {
      if (showError) setFieldState(passwordInput, passwordError, false, 'Password is required.');
      return false;
    }
    if (val.length < 8) {
      if (showError) setFieldState(passwordInput, passwordError, false, 'Password must be at least 8 characters long.');
      return false;
    }
    if (!isCriteriaMet) {
      if (showError) setFieldState(passwordInput, passwordError, false, 'Password must include uppercase, lowercase, number and special symbol.');
      return false;
    }

    setFieldState(passwordInput, passwordError, true);

    // If confirm password has value, re-evaluate match
    if (confirmPasswordInput.value) {
      validateConfirmPassword(showError);
    }

    return true;
  }

  // Field: Confirm Password
  function validateConfirmPassword(showError = true) {
    const pwdVal = passwordInput.value;
    const confirmVal = confirmPasswordInput.value;

    if (!confirmVal) {
      matchPill.classList.add('d-none');
      if (showError) setFieldState(confirmPasswordInput, confirmPasswordError, false, 'Please confirm your password.');
      return false;
    }

    if (pwdVal !== confirmVal) {
      matchPill.classList.remove('d-none', 'match-yes');
      matchPill.classList.add('match-no');
      matchPill.textContent = 'Mismatch';
      if (showError) setFieldState(confirmPasswordInput, confirmPasswordError, false, 'Passwords do not match.');
      return false;
    }

    matchPill.classList.remove('d-none', 'match-no');
    matchPill.classList.add('match-yes');
    matchPill.textContent = 'Matches';
    setFieldState(confirmPasswordInput, confirmPasswordError, true);
    return true;
  }

  // Field: Message & Character Counter
  function updateMessageCharCounter() {
    const length = messageInput.value.length;
    charCount.textContent = length;
    if (length > 250 || (length > 0 && length < 10)) {
      charCounter.classList.add('is-warning');
    } else {
      charCounter.classList.remove('is-warning');
    }
  }

  function validateMessage(showError = true) {
    const val = messageInput.value.trim();
    updateMessageCharCounter();

    if (!val) {
      if (showError) setFieldState(messageInput, messageError, false, 'Message is required.');
      return false;
    }
    if (val.length < 10) {
      if (showError) setFieldState(messageInput, messageError, false, 'Message must be at least 10 characters long.');
      return false;
    }
    if (val.length > 250) {
      if (showError) setFieldState(messageInput, messageError, false, 'Message cannot exceed 250 characters.');
      return false;
    }

    setFieldState(messageInput, messageError, true);
    return true;
  }

  // Field: Terms and Conditions
  function validateTerms(showError = true) {
    const isChecked = termsCheckbox.checked;
    if (!isChecked) {
      if (showError) {
        termsError.textContent = 'You must accept the Terms and Conditions to proceed.';
        termsCheckbox.classList.add('is-invalid');
      }
      return false;
    }
    termsError.textContent = '';
    termsCheckbox.classList.remove('is-invalid');
    return true;
  }

  // =========================================================================
  // 7. Form Completion Progress Calculation
  // =========================================================================
  function updateFormProgress() {
    let completedCount = 0;

    if (validateFullName(false)) completedCount++;
    if (validateEmail(false)) completedCount++;
    if (validatePhone(false)) completedCount++;
    if (validateDob(false)) completedCount++;
    if (validateGender(false)) completedCount++;
    if (validateCountry(false)) completedCount++;
    if (validateAddress(false)) completedCount++;
    if (validatePassword(false)) completedCount++;
    if (validateConfirmPassword(false)) completedCount++;
    if (validateMessage(false) && validateTerms(false)) completedCount++;

    const percent = Math.round((completedCount / REQUIRED_FIELDS_COUNT) * 100);

    progressBarFill.style.width = `${percent}%`;
    completionPercent.textContent = `${percent}%`;
    progressStatusCaption.textContent = `${completedCount} of ${REQUIRED_FIELDS_COUNT} required items completed`;

    sidebarProgressPill.textContent = `${percent}%`;
    metricFieldsProgress.textContent = `${percent}%`;
  }

  // =========================================================================
  // 8. Event Listeners for Real-Time Validation
  // =========================================================================

  // Full Name
  fullnameInput.addEventListener('input', () => {
    validateFullName(false);
    updateFormProgress();
  });
  fullnameInput.addEventListener('blur', () => {
    validateFullName(true);
    updateFormProgress();
  });

  // Email
  emailInput.addEventListener('input', () => {
    validateEmail(false);
    updateFormProgress();
  });
  emailInput.addEventListener('blur', () => {
    validateEmail(true);
    updateFormProgress();
  });

  // Phone
  phoneInput.addEventListener('input', () => {
    validatePhone(false);
    updateFormProgress();
  });
  phoneInput.addEventListener('blur', () => {
    validatePhone(true);
    updateFormProgress();
  });

  // DOB
  dobInput.addEventListener('input', () => {
    validateDob(true);
    updateFormProgress();
  });
  dobInput.addEventListener('blur', () => {
    validateDob(true);
    updateFormProgress();
  });

  // Gender
  genderSelect.addEventListener('change', () => {
    validateGender(true);
    updateFormProgress();
  });

  // Country
  countrySelect.addEventListener('change', () => {
    validateCountry(true);
    updateFormProgress();
  });

  // Address
  addressInput.addEventListener('input', () => {
    validateAddress(false);
    updateFormProgress();
  });
  addressInput.addEventListener('blur', () => {
    validateAddress(true);
    updateFormProgress();
  });

  // Password
  passwordInput.addEventListener('input', () => {
    validatePassword(false);
    updateFormProgress();
  });
  passwordInput.addEventListener('blur', () => {
    validatePassword(true);
    updateFormProgress();
  });

  // Confirm Password
  confirmPasswordInput.addEventListener('input', () => {
    validateConfirmPassword(false);
    updateFormProgress();
  });
  confirmPasswordInput.addEventListener('blur', () => {
    validateConfirmPassword(true);
    updateFormProgress();
  });

  // Message
  messageInput.addEventListener('input', () => {
    validateMessage(false);
    updateFormProgress();
  });
  messageInput.addEventListener('blur', () => {
    validateMessage(true);
    updateFormProgress();
  });

  // Terms Checkbox
  termsCheckbox.addEventListener('change', () => {
    validateTerms(true);
    updateFormProgress();
  });

  // =========================================================================
  // 9. Password Visibility Toggles
  // =========================================================================
  function setupPasswordToggle(button, input) {
    button.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const eyeOpen = button.querySelector('.icon-eye-open');
      const eyeClosed = button.querySelector('.icon-eye-closed');

      if (isPassword) {
        eyeOpen.classList.add('d-none');
        eyeClosed.classList.remove('d-none');
        button.setAttribute('title', 'Hide password');
      } else {
        eyeOpen.classList.remove('d-none');
        eyeClosed.classList.add('d-none');
        button.setAttribute('title', 'Show password');
      }
    });
  }

  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

  // =========================================================================
  // 10. Form Submission Handler
  // =========================================================================
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Trigger full validation on all fields
    const isNameValid = validateFullName(true);
    const isEmailValid = validateEmail(true);
    const isPhoneValid = validatePhone(true);
    const isDobValid = validateDob(true);
    const isGenderValid = validateGender(true);
    const isCountryValid = validateCountry(true);
    const isAddressValid = validateAddress(true);
    const isPasswordValid = validatePassword(true);
    const isConfirmValid = validateConfirmPassword(true);
    const isMessageValid = validateMessage(true);
    const isTermsValid = validateTerms(true);

    const isFormValid = (
      isNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isDobValid &&
      isGenderValid &&
      isCountryValid &&
      isAddressValid &&
      isPasswordValid &&
      isConfirmValid &&
      isMessageValid &&
      isTermsValid
    );

    updateFormProgress();

    if (!isFormValid) {
      showFormAlert('error', 'Please resolve all highlighted validation errors before submitting the registration.');
      // Smoothly scroll to first invalid field
      const firstInvalid = registrationForm.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    // Hide previous alerts
    hideFormAlert();

    // Visual button loading state
    btnSubmit.disabled = true;
    submitSpinner.classList.remove('d-none');
    submitBtnIcon.classList.add('d-none');
    submitBtnText.textContent = 'Processing...';

    // Simulate short processing delay for realism
    setTimeout(() => {
      btnSubmit.disabled = false;
      submitSpinner.classList.add('d-none');
      submitBtnIcon.classList.remove('d-none');
      submitBtnText.textContent = 'Submit Registration';

      // Capture Selected Contact Method
      const selectedContactEl = document.querySelector('input[name="contact-method"]:checked');
      const contactMethod = selectedContactEl ? selectedContactEl.value : 'Email';

      // Generate Unique Registration ID: #RH-2026-XXXXXX
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      const regId = `#RH-2026-${randomCode}`;

      // Assemble Registration Record
      const newRecord = {
        id: regId,
        fullname: fullnameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dob: dobInput.value,
        gender: genderSelect.value,
        country: countrySelect.value,
        address: addressInput.value.trim(),
        contactMethod: contactMethod,
        message: messageInput.value.trim(),
        newsletter: newsletterCheckbox.checked ? 'Subscribed' : 'Not Subscribed',
        timestamp: new Date().toLocaleString()
      };

      // Save to localStorage
      saveUserToStorage(newRecord);
      saveLastRegistration(newRecord);

      // Update Summary Receipt
      populateSummaryReceipt(newRecord);

      // Re-render Registry Table
      renderRecordsTable();
      updateSidebarMetrics();

      // Show Success Modal
      showSuccessModal(newRecord);

      // Display floating toast
      showToast('Registration submitted and verified successfully!', 'success');

    }, 450);
  });

  function showFormAlert(type, message) {
    formAlertBox.className = `alert-box alert-${type}`;
    alertMessageText.textContent = message;
    formAlertBox.classList.remove('d-none');
  }

  function hideFormAlert() {
    formAlertBox.classList.add('d-none');
    alertMessageText.textContent = '';
  }

  // =========================================================================
  // 11. Reset Form & Confirmation Modal Logic
  // =========================================================================
  btnTriggerReset.addEventListener('click', () => {
    resetConfirmModal.classList.remove('d-none');
  });

  btnCancelReset.addEventListener('click', () => {
    resetConfirmModal.classList.add('d-none');
  });

  btnConfirmReset.addEventListener('click', () => {
    performFormReset();
    resetConfirmModal.classList.add('d-none');
    showToast('Registration form has been cleared.', 'info');
  });

  // Close reset modal on backdrop click
  resetConfirmModal.addEventListener('click', (e) => {
    if (e.target === resetConfirmModal) {
      resetConfirmModal.classList.add('d-none');
    }
  });

  function performFormReset() {
    registrationForm.reset();

    // Clear validation states
    clearFieldState(fullnameInput, fullnameError);
    clearFieldState(emailInput, emailError);
    clearFieldState(phoneInput, phoneError);
    clearFieldState(dobInput, dobError);
    clearFieldState(genderSelect, genderError);
    clearFieldState(countrySelect, countryError);
    clearFieldState(addressInput, addressError);
    clearFieldState(passwordInput, passwordError);
    clearFieldState(confirmPasswordInput, confirmPasswordError);
    clearFieldState(messageInput, messageError);
    termsError.textContent = '';
    termsCheckbox.classList.remove('is-invalid');

    // Reset password indicators
    matchPill.classList.add('d-none');
    evaluatePasswordSecurity('');

    // Reset character counter
    charCount.textContent = '0';
    charCounter.classList.remove('is-warning');

    // Reset progress
    updateFormProgress();
    hideFormAlert();
  }

  // =========================================================================
  // 12. Summary Receipt Population & Printing
  // =========================================================================
  function populateSummaryReceipt(record) {
    if (!record) return;

    summaryEmptyState.classList.add('d-none');
    summaryReceiptCard.classList.remove('d-none');

    receiptRegId.textContent = record.id;
    receiptName.textContent = record.fullname;
    receiptEmail.textContent = record.email;
    receiptPhone.textContent = record.phone;
    receiptDob.textContent = record.dob;
    receiptGender.textContent = record.gender;
    receiptCountry.textContent = record.country;
    receiptAddress.textContent = record.address;
    receiptContact.textContent = record.contactMethod;
    receiptNewsletter.textContent = record.newsletter;
    receiptTimestamp.textContent = record.timestamp;
    receiptMessage.textContent = `"${record.message}"`;
  }

  // Print Summary
  btnPrintSummary.addEventListener('click', () => {
    window.print();
  });

  // Download Summary as .txt
  btnDownloadTxt.addEventListener('click', () => {
    const record = lastRegistration;
    if (!record) return;

    const receiptContent = `=====================================================
REGISTERHUB – SMART USER REGISTRATION SUMMARY RECEIPT
=====================================================
Registration ID   : ${record.id}
Date & Timestamp  : ${record.timestamp}
Full Name         : ${record.fullname}
Email Address     : ${record.email}
Phone Number      : ${record.phone}
Date of Birth     : ${record.dob}
Gender            : ${record.gender}
Country           : ${record.country}
Address           : ${record.address}
Preferred Contact : ${record.contactMethod}
Newsletter Opt-in : ${record.newsletter}
Validation Status : Passed Client-Side Integrity Checks
Storage Engine    : Browser localStorage (Demo Sandbox)

SUBMITTED STATEMENT / MESSAGE:
-----------------------------------------------------
${record.message}

=====================================================
Note: This receipt was generated automatically by
RegisterHub Client-Side Smart Validation Portal.
=====================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `RegisterHub_Receipt_${record.id.replace('#', '')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    showToast('Registration summary downloaded (.txt)', 'info');
  });

  // Register Another User Button
  btnRegisterAnother.addEventListener('click', () => {
    performFormReset();
    window.location.hash = '#register';
    fullnameInput.focus();
    showToast('Ready for a new registration.', 'info');
  });

  // =========================================================================
  // 13. Success Modal Logic
  // =========================================================================
  function showSuccessModal(record) {
    popupRegId.textContent = record.id;
    popupMiniSummary.innerHTML = `
      <div class="modal-mini-row">
        <span class="modal-mini-label">Full Name:</span>
        <span class="modal-mini-value">${escapeHTML(record.fullname)}</span>
      </div>
      <div class="modal-mini-row">
        <span class="modal-mini-label">Email:</span>
        <span class="modal-mini-value">${escapeHTML(record.email)}</span>
      </div>
      <div class="modal-mini-row">
        <span class="modal-mini-label">Phone:</span>
        <span class="modal-mini-value">${escapeHTML(record.phone)}</span>
      </div>
      <div class="modal-mini-row">
        <span class="modal-mini-label">Country:</span>
        <span class="modal-mini-value">${escapeHTML(record.country)}</span>
      </div>
    `;

    successModal.classList.remove('d-none');
  }

  btnPopupClose.addEventListener('click', () => {
    successModal.classList.add('d-none');
  });

  btnPopupViewSummary.addEventListener('click', () => {
    successModal.classList.add('d-none');
  });

  btnPopupPrint.addEventListener('click', () => {
    successModal.classList.add('d-none');
    setTimeout(() => {
      window.print();
    }, 300);
  });

  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.add('d-none');
    }
  });

  // =========================================================================
  // 14. LocalStorage & Table Management
  // =========================================================================
  function loadUsersFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('LocalStorage error while loading users:', err);
      return [];
    }
  }

  function saveUserToStorage(record) {
    registeredUsers.unshift(record); // Prepend to beginning
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registeredUsers));
    } catch (err) {
      console.warn('LocalStorage error while saving user:', err);
    }
  }

  function loadLastRegistration() {
    try {
      const data = localStorage.getItem(LAST_REGISTRATION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  function saveLastRegistration(record) {
    lastRegistration = record;
    try {
      localStorage.setItem(LAST_REGISTRATION_KEY, JSON.stringify(record));
    } catch (err) {
      console.warn('LocalStorage error saving last registration:', err);
    }
  }

  function renderRecordsTable(query = '') {
    const searchTerm = query.trim().toLowerCase();
    const filteredUsers = registeredUsers.filter(u => {
      if (!searchTerm) return true;
      return (
        u.fullname.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        u.id.toLowerCase().includes(searchTerm) ||
        (u.country && u.country.toLowerCase().includes(searchTerm))
      );
    });

    recordsTableBody.innerHTML = '';

    if (filteredUsers.length === 0) {
      recordsTable.classList.add('d-none');
      emptyRecordsMessage.classList.remove('d-none');

      if (searchTerm) {
        emptyRecordsTitle.textContent = 'No Matching Users Found';
        emptyRecordsDesc.textContent = `No registrations match your search keyword "${query}". Try another query or clear the filter.`;
      } else {
        emptyRecordsTitle.textContent = 'No Registered Users in LocalStorage';
        emptyRecordsDesc.textContent = 'Use the registration form above to submit your first user record or click "Load Sample Data".';
      }

      recordsCountText.textContent = 'Showing 0 registered users';
      return;
    }

    recordsTable.classList.remove('d-none');
    emptyRecordsMessage.classList.add('d-none');
    recordsCountText.textContent = `Showing ${filteredUsers.length} of ${registeredUsers.length} registered user${registeredUsers.length === 1 ? '' : 's'}`;

    filteredUsers.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="reg-id-cell">${escapeHTML(user.id)}</td>
        <td><strong>${escapeHTML(user.fullname)}</strong></td>
        <td>${escapeHTML(user.email)}</td>
        <td>${escapeHTML(user.phone)}</td>
        <td>${escapeHTML(user.country || 'N/A')}</td>
        <td style="font-size: 0.8rem; color: #64748b;">${escapeHTML(user.timestamp)}</td>
        <td class="text-right">
          <button type="button" class="table-btn-delete" data-id="${user.id}" title="Delete record" aria-label="Delete ${user.fullname}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </td>
      `;
      recordsTableBody.appendChild(tr);
    });

    // Attach Delete Action Handlers
    const deleteBtns = recordsTableBody.querySelectorAll('.table-btn-delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idToDelete = btn.getAttribute('data-id');
        deleteRecordById(idToDelete);
      });
    });
  }

  function deleteRecordById(id) {
    const userIndex = registeredUsers.findIndex(u => u.id === id);
    if (userIndex > -1) {
      const removedUser = registeredUsers.splice(userIndex, 1)[0];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registeredUsers));
      } catch (err) {
        console.warn('Error saving to localStorage:', err);
      }

      // If the deleted record was the one shown in Summary Receipt, clear it if no users left
      if (lastRegistration && lastRegistration.id === id) {
        if (registeredUsers.length > 0) {
          saveLastRegistration(registeredUsers[0]);
          populateSummaryReceipt(registeredUsers[0]);
        } else {
          lastRegistration = null;
          localStorage.removeItem(LAST_REGISTRATION_KEY);
          summaryReceiptCard.classList.add('d-none');
          summaryEmptyState.classList.remove('d-none');
        }
      }

      renderRecordsTable(searchInput.value);
      updateSidebarMetrics();
      showToast(`User "${removedUser.fullname}" removed from local registry.`, 'info');
    }
  }

  function updateSidebarMetrics() {
    const count = registeredUsers.length;
    sidebarCountBadge.textContent = count;
    metricRecordsCount.textContent = count;
  }

  // Search Filtering
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.trim().length > 0) {
      btnClearSearch.classList.remove('d-none');
    } else {
      btnClearSearch.classList.add('d-none');
    }
    renderRecordsTable(query);
  });

  btnClearSearch.addEventListener('click', () => {
    searchInput.value = '';
    btnClearSearch.classList.add('d-none');
    renderRecordsTable('');
    searchInput.focus();
  });

  // Load Sample Demo Data
  btnLoadSamples.addEventListener('click', () => {
    const sample1 = {
      id: '#RH-2026-784192',
      fullname: 'Eleanor Vance',
      email: 'eleanor.vance@example.com',
      phone: '9876543210',
      dob: '1998-05-14',
      gender: 'Female',
      country: 'United States',
      address: '742 Evergreen Terrace, Springfield, OR',
      contactMethod: 'Email',
      message: 'Excited to explore the RegisterHub portal capabilities and test the client-side validation engine!',
      newsletter: 'Subscribed',
      timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString()
    };

    const sample2 = {
      id: '#RH-2026-319504',
      fullname: 'Liam Sterling',
      email: 'liam.sterling@example.org',
      phone: '9123456789',
      dob: '1994-11-23',
      gender: 'Male',
      country: 'United Kingdom',
      address: '221B Baker Street, Marylebone, London',
      contactMethod: 'WhatsApp',
      message: 'Demonstrating seamless local storage persistence and quick filter search features.',
      newsletter: 'Subscribed',
      timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString()
    };

    // Add samples if not already in list
    let addedCount = 0;
    if (!registeredUsers.some(u => u.id === sample1.id)) {
      registeredUsers.push(sample1);
      addedCount++;
    }
    if (!registeredUsers.some(u => u.id === sample2.id)) {
      registeredUsers.push(sample2);
      addedCount++;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registeredUsers));
    } catch (err) {
      console.warn('Error saving samples to localStorage:', err);
    }

    if (!lastRegistration) {
      saveLastRegistration(sample1);
      populateSummaryReceipt(sample1);
    }

    renderRecordsTable(searchInput.value);
    updateSidebarMetrics();

    if (addedCount > 0) {
      showToast(`${addedCount} sample user records loaded successfully!`, 'success');
    } else {
      showToast('Sample records are already loaded in the registry.', 'info');
    }
  });

  // Clear All Records
  btnClearRecords.addEventListener('click', () => {
    if (registeredUsers.length === 0) {
      showToast('Registry is already empty.', 'info');
      return;
    }

    if (confirm('Are you sure you want to delete ALL registered user records from browser localStorage?')) {
      registeredUsers = [];
      lastRegistration = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LAST_REGISTRATION_KEY);
      } catch (err) {
        console.warn('Error clearing localStorage:', err);
      }

      summaryReceiptCard.classList.add('d-none');
      summaryEmptyState.classList.remove('d-none');

      renderRecordsTable('');
      updateSidebarMetrics();
      showToast('All demonstration records cleared from localStorage.', 'info');
    }
  });

  // =========================================================================
  // 15. Toast Notification System
  // =========================================================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else if (type === 'error') {
      iconSvg = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      <div style="flex-shrink: 0; display: flex; align-items: center;">${iconSvg}</div>
      <div style="flex: 1; font-weight: 500;">${escapeHTML(message)}</div>
    `;

    toastStack.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-closing');
      setTimeout(() => {
        if (toast.parentNode) {
          toastStack.removeChild(toast);
        }
      }, 300);
    }, 3800);
  }

  // =========================================================================
  // 16. Security Helper: Escape HTML
  // =========================================================================
  function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
