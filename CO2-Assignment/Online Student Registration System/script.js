/**
 * ==============================================================================
 * APEX - Online Student Registration Portal
 * Script: Vanilla JavaScript (ES6+) Frontend Architecture
 * ==============================================================================
 * Key Concepts Demonstrated:
 * 1. JavaScript Regular Expressions (RegExp) & .test() methods
 * 2. Date Object manipulation & exact Age calculation using Math methods
 * 3. JavaScript Student Object creation & data encapsulation
 * 4. String, Number, and Array methods for data transformation
 * 5. Dynamic DOM Manipulation (rendering, state classes, DOM traversal)
 * 6. Robust Exception Handling (try, catch, finally blocks)
 * 7. Modern Event Handling (addEventListener for submit, input, change, click)
 * 8. Asynchronous Backend Integration with fetch API & Server-side Excel Storage
 * 9. Window Print API & Accessible UI interaction
 * ==============================================================================
 */

// Execute after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. REGULAR EXPRESSION PATTERNS (RegExp)
  // ==========================================================================
  /**
   * Validation Rules:
   * - Name: Letters (uppercase and lowercase) and spaces only, minimum 3 characters.
   * - Email: Standard RFC 5322 compliant pattern for web forms.
   * - Mobile: Exactly 10 digits (digits 0-9).
   * - Password: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char.
   */
  const REGEX_PATTERNS = {
    // Letters (A-Z, a-z) and spaces, between 3 and 50 characters
    fullName: new RegExp("^[A-Za-z\\s]{3,50}$"),

    // Valid email address format
    email: new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"),

    // Exactly 10 numeric digits
    mobile: new RegExp("^[0-9]{10}$"),

    // Password criteria patterns
    passwordLength: new RegExp(".{8,}"),
    passwordUpper: new RegExp("[A-Z]"),
    passwordLower: new RegExp("[a-z]"),
    passwordNumber: new RegExp("[0-9]"),
    passwordSpecial: new RegExp("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]")
  };

  // Full password validation RegExp combining all requirements:
  const FULL_PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$"
  );

  // ==========================================================================
  // 2. DOM ELEMENT REFERENCES
  // ==========================================================================
  const form = document.getElementById('registrationForm');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Input Fields
  const fullNameInput = document.getElementById('fullName');
  const dobInput = document.getElementById('dateOfBirth');
  const genderInputs = document.querySelectorAll('input[name="gender"]');
  const emailInput = document.getElementById('email');
  const mobileInput = document.getElementById('mobile');
  const addressInput = document.getElementById('address');
  const departmentSelect = document.getElementById('department');
  const yearSelect = document.getElementById('yearOfStudy');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const declarationCheckbox = document.getElementById('declaration');

  // Error Containers
  const fullNameError = document.getElementById('fullNameError');
  const dobError = document.getElementById('dobError');
  const genderError = document.getElementById('genderError');
  const emailError = document.getElementById('emailError');
  const mobileError = document.getElementById('mobileError');
  const addressError = document.getElementById('addressError');
  const departmentError = document.getElementById('departmentError');
  const yearError = document.getElementById('yearError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const declarationError = document.getElementById('declarationError');

  // Live Age Display Badge
  const ageBadge = document.getElementById('ageBadge');
  const ageBadgeText = document.getElementById('ageBadgeText');
  const ageBadgeIcon = document.getElementById('ageBadgeIcon');

  // Password Strength & Rules Elements
  const passwordStrengthBar = document.getElementById('passwordStrengthBar');
  const passwordStrengthText = document.getElementById('passwordStrengthText');
  const passwordStrengthScore = document.getElementById('passwordStrengthScore');
  const ruleLength = document.getElementById('ruleLength');
  const ruleUpper = document.getElementById('ruleUpper');
  const ruleLower = document.getElementById('ruleLower');
  const ruleNumber = document.getElementById('ruleNumber');
  const ruleSpecial = document.getElementById('ruleSpecial');

  // Password Visibility Toggle Buttons
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');

  // Alert Box Elements
  const alertContainer = document.getElementById('alertContainer');
  const alertMessage = document.getElementById('alertMessage');
  const alertIcon = document.getElementById('alertIcon');
  const alertCloseBtn = document.getElementById('alertCloseBtn');

  // Registration Summary Elements
  const summarySection = document.getElementById('summarySection');
  const summaryRegDate = document.getElementById('summaryRegDate');
  const summaryRegNumber = document.getElementById('summaryRegNumber');
  const summaryName = document.getElementById('summaryName');
  const summaryEmail = document.getElementById('summaryEmail');
  const summaryMobile = document.getElementById('summaryMobile');
  const summaryDobAge = document.getElementById('summaryDobAge');
  const summaryGender = document.getElementById('summaryGender');
  const summaryDepartment = document.getElementById('summaryDepartment');
  const summaryYear = document.getElementById('summaryYear');
  const summaryAddress = document.getElementById('summaryAddress');
  const printRegistrationBtn = document.getElementById('printRegistrationBtn');
  const newRegistrationBtn = document.getElementById('newRegistrationBtn');

  // Store registered student object in memory
  let currentRegisteredStudent = null;

  // ==========================================================================
  // 3. DATE SETUP & PREVENT FUTURE DATES
  // ==========================================================================
  /**
   * Sets max attribute on the Date input to prevent selecting future dates.
   * Also sets a reasonable minimum date (100 years prior).
   */
  function initializeDateConstraints() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');

    // Format: YYYY-MM-DD
    const maxDateString = `${currentYear}-${currentMonth}-${currentDay}`;
    const minDateString = `${currentYear - 100}-${currentMonth}-${currentDay}`;

    dobInput.setAttribute('max', maxDateString);
    dobInput.setAttribute('min', minDateString);
  }
  initializeDateConstraints();

  // ==========================================================================
  // 4. DATE AND AGE CALCULATION LOGIC (Using Date & Math)
  // ==========================================================================
  /**
   * Calculates the exact age in completed years from a birth date string.
   * Uses JavaScript Date object methods and Math methods.
   * 
   * @param {string} dobString - Date string in 'YYYY-MM-DD' format
   * @returns {Object} { isValid: boolean, age: number|null, errorMessage: string|null }
   */
  function calculateStudentAge(dobString) {
    if (!dobString || typeof dobString !== 'string') {
      return { isValid: false, age: null, errorMessage: 'Date of birth is required.' };
    }

    // Create Date instances
    const birthDate = new Date(dobString);
    const today = new Date();

    // Validate that birthDate is a valid date object
    if (isNaN(birthDate.getTime())) {
      return { isValid: false, age: null, errorMessage: 'Please enter a valid calendar date.' };
    }

    // Set today to start of day for accurate day-level comparison
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const birthMidnight = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    // Prevent future dates
    if (birthMidnight > todayMidnight) {
      return { isValid: false, age: null, errorMessage: 'Date of birth cannot be in the future.' };
    }

    // Calculate preliminary age by year difference
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if current month/day has not yet occurred this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // Ensure non-negative using Math.max
    age = Math.max(0, Math.floor(age));

    // Verify minimum admission age criteria (Must be at least 16 years old)
    if (age < 16) {
      return {
        isValid: false,
        age: age,
        errorMessage: `Student must be at least 16 years old to register. (Calculated age: ${age} years)`
      };
    }

    return { isValid: true, age: age, errorMessage: null };
  }

  /**
   * Updates the live age badge next to the Date of Birth input.
   */
  function updateLiveAgeDisplay() {
    const dobValue = dobInput.value;

    if (!dobValue) {
      ageBadge.style.display = 'none';
      dobInput.classList.remove('is-valid', 'is-invalid');
      clearFieldError(dobError);
      return;
    }

    const ageResult = calculateStudentAge(dobValue);

    ageBadge.style.display = 'inline-flex';

    if (ageResult.isValid) {
      ageBadge.className = 'age-badge valid';
      ageBadgeIcon.textContent = '🎂';
      ageBadgeText.textContent = `Age: ${ageResult.age} yrs (Eligible)`;
      setFieldSuccess(dobInput, dobError);
    } else {
      ageBadge.className = 'age-badge invalid';
      ageBadgeIcon.textContent = '⚠️';
      ageBadgeText.textContent = ageResult.age !== null ? `Age: ${ageResult.age} yrs (Underage)` : 'Invalid Date';
      setFieldError(dobInput, dobError, ageResult.errorMessage);
    }
  }

  // ==========================================================================
  // 5. FIELD-SPECIFIC VALIDATION FUNCTIONS (Using RegExp)
  // ==========================================================================

  /**
   * Helper: Sets error state on an input element
   */
  function setFieldError(inputElement, errorElement, message) {
    if (inputElement && inputElement.classList) {
      inputElement.classList.add('is-invalid');
      inputElement.classList.remove('is-valid');
    }
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('visible');
    }
  }

  /**
   * Helper: Sets success state on an input element
   */
  function setFieldSuccess(inputElement, errorElement) {
    if (inputElement && inputElement.classList) {
      inputElement.classList.remove('is-invalid');
      inputElement.classList.add('is-valid');
    }
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('visible');
    }
  }

  /**
   * Helper: Clears both error and success state
   */
  function clearFieldError(errorElement) {
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('visible');
    }
  }

  /**
   * Validates Full Name:
   * - Must not be empty after trimming
   * - Letters and spaces only
   * - Minimum 3 characters, maximum 50 characters
   */
  function validateFullName() {
    const nameValue = fullNameInput.value.trim();

    if (nameValue === '') {
      setFieldError(fullNameInput, fullNameError, 'Full Name is required.');
      return false;
    }

    // Test RegExp pattern
    if (!REGEX_PATTERNS.fullName.test(nameValue)) {
      if (nameValue.length < 3) {
        setFieldError(fullNameInput, fullNameError, 'Full Name must be at least 3 characters long.');
      } else {
        setFieldError(fullNameInput, fullNameError, 'Full Name can contain letters and spaces only.');
      }
      return false;
    }

    setFieldSuccess(fullNameInput, fullNameError);
    return true;
  }

  /**
   * Validates Email Address:
   * - Valid email regex format
   */
  function validateEmail() {
    const emailValue = emailInput.value.trim();

    if (emailValue === '') {
      setFieldError(emailInput, emailError, 'Email address is required.');
      return false;
    }

    if (!REGEX_PATTERNS.email.test(emailValue)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address (e.g. name@domain.com).');
      return false;
    }

    setFieldSuccess(emailInput, emailError);
    return true;
  }

  /**
   * Validates Mobile Number:
   * - Exactly 10 digits
   */
  function validateMobile() {
    const mobileValue = mobileInput.value.trim();

    if (mobileValue === '') {
      setFieldError(mobileInput, mobileError, 'Mobile number is required.');
      return false;
    }

    if (!REGEX_PATTERNS.mobile.test(mobileValue)) {
      if (mobileValue.length !== 10) {
        setFieldError(mobileInput, mobileError, `Mobile number must be exactly 10 digits (currently ${mobileValue.length} digits).`);
      } else {
        setFieldError(mobileInput, mobileError, 'Mobile number must contain digits only.');
      }
      return false;
    }

    setFieldSuccess(mobileInput, mobileError);
    return true;
  }

  /**
   * Validates Date of Birth and age requirement
   */
  function validateDateOfBirth() {
    const dobValue = dobInput.value;
    const ageResult = calculateStudentAge(dobValue);

    if (!ageResult.isValid) {
      setFieldError(dobInput, dobError, ageResult.errorMessage);
      return false;
    }

    setFieldSuccess(dobInput, dobError);
    return true;
  }

  /**
   * Validates Gender radio selection
   */
  function validateGender() {
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    if (!selectedGender) {
      genderError.textContent = 'Please select your gender.';
      genderError.classList.add('visible');
      return false;
    }
    clearFieldError(genderError);
    return true;
  }

  /**
   * Validates Department selection
   */
  function validateDepartment() {
    const value = departmentSelect.value;
    if (!value) {
      setFieldError(departmentSelect, departmentError, 'Please select your engineering department.');
      return false;
    }
    setFieldSuccess(departmentSelect, departmentError);
    return true;
  }

  /**
   * Validates Year of Study selection
   */
  function validateYearOfStudy() {
    const value = yearSelect.value;
    if (!value) {
      setFieldError(yearSelect, yearError, 'Please select your academic year of study.');
      return false;
    }
    setFieldSuccess(yearSelect, yearError);
    return true;
  }

  /**
   * Validates Residential Address:
   * - Minimum 10 characters after trimming
   */
  function validateAddress() {
    const addressValue = addressInput.value.trim();
    if (addressValue === '') {
      setFieldError(addressInput, addressError, 'Residential address is required.');
      return false;
    }
    if (addressValue.length < 10) {
      setFieldError(addressInput, addressError, `Address must be at least 10 characters long (currently ${addressValue.length}).`);
      return false;
    }
    setFieldSuccess(addressInput, addressError);
    return true;
  }

  /**
   * Validates Password & Updates Strength Meter Checklist:
   * - Minimum 8 characters
   * - At least 1 uppercase letter
   * - At least 1 lowercase letter
   * - At least 1 numeric digit
   * - At least 1 special character
   */
  function validatePassword() {
    const pwd = passwordInput.value;

    // Check individual criteria using RegExp .test()
    const hasLength = REGEX_PATTERNS.passwordLength.test(pwd);
    const hasUpper = REGEX_PATTERNS.passwordUpper.test(pwd);
    const hasLower = REGEX_PATTERNS.passwordLower.test(pwd);
    const hasNumber = REGEX_PATTERNS.passwordNumber.test(pwd);
    const hasSpecial = REGEX_PATTERNS.passwordSpecial.test(pwd);

    // Update Checklist UI
    updateRuleItem(ruleLength, hasLength);
    updateRuleItem(ruleUpper, hasUpper);
    updateRuleItem(ruleLower, hasLower);
    updateRuleItem(ruleNumber, hasNumber);
    updateRuleItem(ruleSpecial, hasSpecial);

    // Calculate score (0 to 4/5)
    let score = 0;
    if (hasLength) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    // Update Strength Meter Bar
    updatePasswordStrengthBar(pwd, score);

    if (pwd === '') {
      setFieldError(passwordInput, passwordError, 'Password is required.');
      return false;
    }

    if (!FULL_PASSWORD_REGEX.test(pwd)) {
      setFieldError(
        passwordInput,
        passwordError,
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return false;
    }

    setFieldSuccess(passwordInput, passwordError);

    // Also re-validate confirm password if it contains a value
    if (confirmPasswordInput.value.length > 0) {
      validateConfirmPassword();
    }

    return true;
  }

  /**
   * Helper: Updates a specific password rule list item
   */
  function updateRuleItem(itemElement, isMet) {
    if (!itemElement) return;
    const bullet = itemElement.querySelector('.rule-bullet');
    if (isMet) {
      itemElement.classList.add('met');
      if (bullet) bullet.textContent = '✓';
    } else {
      itemElement.classList.remove('met');
      if (bullet) bullet.textContent = '✕';
    }
  }

  /**
   * Helper: Updates the visual strength meter bar
   */
  function updatePasswordStrengthBar(password, score) {
    if (!passwordStrengthBar) return;

    if (!password) {
      passwordStrengthBar.style.width = '0%';
      passwordStrengthBar.style.backgroundColor = '#e2e8f0';
      passwordStrengthText.textContent = 'None';
      passwordStrengthScore.textContent = '0/4';
      return;
    }

    const strengthLevels = [
      { width: '25%', color: '#ef4444', text: 'Weak' },
      { width: '50%', color: '#f59e0b', text: 'Fair' },
      { width: '75%', color: '#3b82f6', text: 'Good' },
      { width: '100%', color: '#10b981', text: 'Strong' }
    ];

    const currentLevel = strengthLevels[Math.max(0, score - 1)] || strengthLevels[0];

    passwordStrengthBar.style.width = currentLevel.width;
    passwordStrengthBar.style.backgroundColor = currentLevel.color;
    passwordStrengthText.textContent = currentLevel.text;
    passwordStrengthScore.textContent = `${score}/4`;
  }

  /**
   * Validates Confirm Password:
   * - Must match password field exactly
   */
  function validateConfirmPassword() {
    const pwd = passwordInput.value;
    const confirmPwd = confirmPasswordInput.value;

    if (confirmPwd === '') {
      setFieldError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password.');
      return false;
    }

    if (pwd !== confirmPwd) {
      setFieldError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match. Please re-check.');
      return false;
    }

    setFieldSuccess(confirmPasswordInput, confirmPasswordError);
    return true;
  }

  /**
   * Validates Declaration checkbox
   */
  function validateDeclaration() {
    if (!declarationCheckbox.checked) {
      declarationError.textContent = 'You must accept and agree to the declaration before submitting.';
      declarationError.classList.add('visible');
      return false;
    }
    clearFieldError(declarationError);
    return true;
  }

  // ==========================================================================
  // 6. UNIQUE REGISTRATION NUMBER GENERATOR (Using Date & Math)
  // ==========================================================================
  /**
   * Generates an official registration identifier:
   * Format: APEX-YYYY-{DEPT}-{4-digit-random}
   * Example: APEX-2026-CSE-7491
   * 
   * @param {string} departmentCode - Department acronym (e.g. 'CSE', 'AIML')
   * @returns {string} Unique registration code
   */
  function generateRegistrationNumber(departmentCode) {
    const currentYear = new Date().getFullYear();
    // Generate a random 4-digit number between 1000 and 9999 using Math.floor & Math.random
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const sanitizedDept = (departmentCode || 'GEN').toUpperCase().trim();
    return `APEX-${currentYear}-${sanitizedDept}-${randomSuffix}`;
  }

  // ==========================================================================
  // 7. ALERT / NOTIFICATION BANNER UTILITY
  // ==========================================================================
  /**
   * Displays an alert banner at the top of the portal.
   * 
   * @param {string} message - Message text to display
   * @param {string} type - 'success' | 'error'
   */
  function showAlert(message, type = 'error') {
    alertContainer.className = `alert-container ${type}`;
    alertMessage.textContent = message;
    alertIcon.textContent = type === 'success' ? '✓' : '⚠️';
    alertContainer.style.display = 'flex';

    // Scroll to alert smoothly
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    alertContainer.style.display = 'none';
  }

  if (alertCloseBtn) {
    alertCloseBtn.addEventListener('click', hideAlert);
  }

  // ==========================================================================
  // 8. PASSWORD VISIBILITY TOGGLE (Event Handling)
  // ==========================================================================
  function setupPasswordToggle(button, inputField) {
    if (!button || !inputField) return;

    button.addEventListener('click', () => {
      const isPassword = inputField.type === 'password';
      inputField.type = isPassword ? 'text' : 'password';

      const eyeOpen = button.querySelector('.eye-open');
      const eyeClosed = button.querySelector('.eye-closed');

      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? 'none' : 'block';
        eyeClosed.style.display = isPassword ? 'block' : 'none';
      }

      button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

  // ==========================================================================
  // 9. DYNAMIC DOM MANIPULATION: RENDER REGISTRATION SUMMARY
  // ==========================================================================
  /**
   * Renders the student object details into the Summary Card and displays it.
   * Note: Student password is strictly NEVER displayed or saved in Excel.
   * 
   * @param {Object} student - Encapsulated student data object
   */
  function displayRegistrationSummary(student) {
    // Format friendly date of birth string: e.g. "January 15, 2005"
    const dobObject = new Date(student.dateOfBirth);
    const formattedDob = dobObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Populate all summary DOM elements
    summaryRegDate.textContent = `Issued: ${student.registrationDate}`;
    summaryRegNumber.textContent = student.registrationNumber;
    summaryName.textContent = student.name;
    summaryEmail.textContent = student.email;
    summaryMobile.textContent = student.mobile;
    summaryDobAge.textContent = `${formattedDob} (${student.age} years old)`;
    summaryGender.textContent = student.gender;
    summaryDepartment.textContent = student.departmentFull;
    summaryYear.textContent = student.year;
    summaryAddress.textContent = student.address;

    // Show summary card only upon successful backend recording
    summarySection.style.display = 'block';

    // Smoothly scroll down to the summary receipt
    summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ==========================================================================
  // 10. FORM SUBMISSION HANDLER WITH EXCEPTION HANDLING (try, catch, finally)
  //     & ASYNCHRONOUS BACKEND EXCEL STORAGE
  // ==========================================================================
  /**
   * Handles form submit event.
   * Uses try, catch, and finally to ensure robust error handling and button state restoration.
   * Sends data to /api/register to append to APEX_Student_Registrations.xlsx.
   */
  async function handleFormSubmit(event) {
    // Prevent standard HTTP form submission / page reload
    event.preventDefault();

    // Cache original button content
    const originalSubmitBtnHTML = submitBtn.innerHTML;

    try {
      // 1. Enter processing state (disable button, show spinner)
      submitBtn.disabled = true;
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnIcon = submitBtn.querySelector('.btn-icon');

      if (btnSpinner) btnSpinner.style.display = 'inline-block';
      if (btnText) btnText.textContent = 'Saving to Excel Database...';
      if (btnIcon) btnIcon.style.display = 'none';

      hideAlert();

      // 2. Perform validations across all fields
      const isNameValid = validateFullName();
      const isDobValid = validateDateOfBirth();
      const isGenderValid = validateGender();
      const isEmailValid = validateEmail();
      const isMobileValid = validateMobile();
      const isAddressValid = validateAddress();
      const isDeptValid = validateDepartment();
      const isYearValid = validateYearOfStudy();
      const isPasswordValid = validatePassword();
      const isConfirmPwdValid = validateConfirmPassword();
      const isDeclarationValid = validateDeclaration();

      const allValid = (
        isNameValid &&
        isDobValid &&
        isGenderValid &&
        isEmailValid &&
        isMobileValid &&
        isAddressValid &&
        isDeptValid &&
        isYearValid &&
        isPasswordValid &&
        isConfirmPwdValid &&
        isDeclarationValid
      );

      // If any validation failed, throw an informative exception
      if (!allValid) {
        throw new Error('Please review and correct the highlighted fields in the registration form.');
      }

      // 3. Extract and sanitize values using String and Number methods
      const rawName = fullNameInput.value.trim();
      // Capitalize each word for neat presentation
      const formattedName = rawName
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      const formattedEmail = emailInput.value.trim().toLowerCase();
      const formattedMobile = mobileInput.value.trim();
      const dobValue = dobInput.value;
      const calculatedAgeResult = calculateStudentAge(dobValue);

      if (!calculatedAgeResult.isValid) {
        throw new Error(calculatedAgeResult.errorMessage || 'Invalid date of birth provided.');
      }

      const selectedGenderInput = document.querySelector('input[name="gender"]:checked');
      const genderValue = selectedGenderInput ? selectedGenderInput.value : '';

      const deptCode = departmentSelect.value;
      const deptFull = departmentSelect.options[departmentSelect.selectedIndex].text;
      const yearValue = yearSelect.options[yearSelect.selectedIndex].text;
      const formattedAddress = addressInput.value.trim();

      // Generate unique registration ID using JavaScript
      const generatedRegNo = generateRegistrationNumber(deptCode);

      // Current timestamp formatting using Date methods
      const now = new Date();
      const formattedTimestamp = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) + ' at ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // 4. JAVASCRIPT STUDENT OBJECT CREATION
      // Encapsulate all student registration properties (passwords are EXCLUDED)
      currentRegisteredStudent = {
        registrationNumber: String(generatedRegNo),
        name: String(formattedName),
        email: String(formattedEmail),
        mobile: String(formattedMobile),
        dateOfBirth: String(dobValue),
        age: Number(calculatedAgeResult.age),
        gender: String(genderValue),
        departmentCode: String(deptCode),
        departmentFull: String(deptFull),
        department: String(deptFull),
        year: String(yearValue),
        address: String(formattedAddress),
        registrationDate: String(formattedTimestamp)
      };

      // 5. SEND STUDENT REGISTRATION TO BACKEND EXCEL STORAGE
      // Requirement: Display 'Registration Successful!' ONLY after the backend confirms that the student record has been saved successfully in the Excel file.
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentRegisteredStudent)
      });

      let responseData = null;
      try {
        responseData = await response.json();
      } catch (jsonErr) {
        throw new Error('Failed to parse server response. Please ensure the APEX local server is running.');
      }

      if (!response.ok || !responseData.success) {
        const errorMsg = responseData?.message || `Server error (${response.status}): Failed to save registration into Excel database.`;
        throw new Error(errorMsg);
      }

      // 6. Display success alert ONLY AFTER BACKEND CONFIRMATION
      showAlert(`Registration Successful! Details for ${formattedName} have been recorded in the APEX database with Registration ID: ${generatedRegNo}.`, 'success');

      // 7. Update the DOM with the Student Registration Summary card
      displayRegistrationSummary(currentRegisteredStudent);

    } catch (error) {
      // Exception Handling: Catch any runtime errors or validation exceptions
      console.error('Registration processing exception caught:', error);

      // Display user-friendly error message
      showAlert(error.message || 'An unexpected error occurred while processing your registration. Please try again.', 'error');

      // Smooth scroll to first invalid input field if present
      const firstInvalidField = form.querySelector('.is-invalid, input:invalid');
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      // Finally block: Always executed to restore submit button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalSubmitBtnHTML;
    }
  }

  // ==========================================================================
  // 11. RESET FORM FUNCTIONALITY
  // ==========================================================================
  /**
   * Clears all form fields, validation indicators, age badge, and summary card.
   */
  function handleFormReset() {
    // Reset standard form inputs
    form.reset();

    // Clear validation styling classes
    const formControls = form.querySelectorAll('.form-control');
    formControls.forEach(ctrl => ctrl.classList.remove('is-valid', 'is-invalid'));

    // Clear radio card styling
    const radioCards = document.querySelectorAll('.radio-card');
    radioCards.forEach(card => card.classList.remove('selected'));

    // Clear all error message texts
    const errorContainers = form.querySelectorAll('.field-error');
    errorContainers.forEach(err => {
      err.textContent = '';
      err.classList.remove('visible');
    });

    // Reset live age badge
    ageBadge.style.display = 'none';
    ageBadge.className = 'age-badge';
    ageBadgeText.textContent = 'Age: --';

    // Reset password strength bar and checklist
    updatePasswordStrengthBar('', 0);
    [ruleLength, ruleUpper, ruleLower, ruleNumber, ruleSpecial].forEach(item => updateRuleItem(item, false));

    // Hide summary card and alert banner
    summarySection.style.display = 'none';
    hideAlert();

    // Clear in-memory student object
    currentRegisteredStudent = null;

    // Scroll smoothly to top of the form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ==========================================================================
  // 12. ATTACH ALL EVENT LISTENERS (addEventListener)
  // ==========================================================================

  // 1. Form Submission
  form.addEventListener('submit', handleFormSubmit);

  // 2. Reset Button Click
  resetBtn.addEventListener('click', handleFormReset);

  // 3. Print Registration Slip (Window Print API)
  printRegistrationBtn.addEventListener('click', () => {
    window.print();
  });

  // 4. "Register Another Student" Button Click
  newRegistrationBtn.addEventListener('click', () => {
    handleFormReset();
  });

  // 5. Live Full Name Validation on Input & Blur
  fullNameInput.addEventListener('input', () => {
    if (fullNameInput.value.length >= 3) validateFullName();
  });
  fullNameInput.addEventListener('blur', validateFullName);

  // 6. Live Email Validation on Input & Blur
  emailInput.addEventListener('input', () => {
    if (emailInput.value.includes('@')) validateEmail();
  });
  emailInput.addEventListener('blur', validateEmail);

  // 7. Live Mobile Validation on Input & Blur (allow only digits typed)
  mobileInput.addEventListener('input', () => {
    // Clean any non-digit character dynamically
    mobileInput.value = mobileInput.value.replace(/\D/g, '');
    if (mobileInput.value.length === 10) {
      validateMobile();
    } else if (mobileInput.value.length > 0) {
      clearFieldError(mobileError);
      mobileInput.classList.remove('is-valid');
    }
  });
  mobileInput.addEventListener('blur', validateMobile);

  // 8. Live Date of Birth & Age Calculation on change and input
  dobInput.addEventListener('change', () => {
    updateLiveAgeDisplay();
    validateDateOfBirth();
  });
  dobInput.addEventListener('input', () => {
    updateLiveAgeDisplay();
  });

  // 9. Gender Radio selection change
  genderInputs.forEach(radio => {
    radio.addEventListener('change', () => {
      validateGender();
      // Update visual selected class
      document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('selected'));
      radio.closest('.radio-card')?.classList.add('selected');
    });
  });

  // 10. Department Dropdown Change
  departmentSelect.addEventListener('change', validateDepartment);

  // 11. Year of Study Dropdown Change
  yearSelect.addEventListener('change', validateYearOfStudy);

  // 12. Address Input & Blur
  addressInput.addEventListener('input', () => {
    if (addressInput.value.trim().length >= 10) validateAddress();
  });
  addressInput.addEventListener('blur', validateAddress);

  // 13. Password live validation & strength meter
  passwordInput.addEventListener('input', () => {
    validatePassword();
  });
  passwordInput.addEventListener('blur', validatePassword);

  // 14. Confirm Password live matching
  confirmPasswordInput.addEventListener('input', () => {
    if (confirmPasswordInput.value.length > 0) {
      validateConfirmPassword();
    }
  });
  confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

  // 15. Declaration checkbox change
  declarationCheckbox.addEventListener('change', validateDeclaration);

});
