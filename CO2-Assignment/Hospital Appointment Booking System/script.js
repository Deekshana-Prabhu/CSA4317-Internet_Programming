/**
 * ============================================================================
 * APEX MULTISPECIALITY HOSPITAL - CLIENT JAVASCRIPT APPLICATION (script.js)
 * ============================================================================
 * Concepts Demonstrated:
 * 1. JavaScript DOM Manipulation & Dynamic Component Rendering
 * 2. Form Validation using Regular Expressions (RegEx)
 * 3. Date Validation using the JavaScript Date Object (Past-date prevention)
 * 4. Event Handling using addEventListener (input, change, click, submit)
 * 5. Asynchronous AJAX Data Fetching using the Fetch API (Slot retrieval)
 * 6. Asynchronous HTTP Requests using XMLHttpRequest (XHR POST submission)
 * 7. Callback Architecture for Response Processing
 * 8. Window Print API & Print Media Query Coordination
 * ============================================================================
 */

// Execute after full DOM content has loaded
document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
   * SECTION 1: GLOBAL STATE & DOM REFERENCES
   * -------------------------------------------------------------------------- */
  
  // Cache all necessary DOM elements for optimal performance
  const dom = {
    // Navigation
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),

    // Doctor Section
    doctorsGrid: document.getElementById('doctorsGrid'),
    filterButtons: document.querySelectorAll('.filter-btn'),

    // Form & Input Controls
    bookingForm: document.getElementById('appointmentForm'),
    bookingCard: document.getElementById('bookingCard'),
    patientNameInput: document.getElementById('patientName'),
    emailInput: document.getElementById('email'),
    phoneInput: document.getElementById('phone'),
    ageInput: document.getElementById('age'),
    genderInputs: document.querySelectorAll('input[name="gender"]'),
    doctorSelect: document.getElementById('doctorSelect'),
    appointmentDateInput: document.getElementById('appointmentDate'),
    selectedTimeSlotInput: document.getElementById('selectedTimeSlot'),
    visitReasonInput: document.getElementById('visitReason'),
    charCountSpan: document.getElementById('charCount'),

    // Slot Container & Feedback
    timeSlotsContainer: document.getElementById('timeSlotsContainer'),
    slotSyncStatus: document.getElementById('slotSyncStatus'),
    doctorQuickMeta: document.getElementById('doctorQuickMeta'),
    quickFeeBadge: document.getElementById('quickFeeBadge'),
    quickExpBadge: document.getElementById('quickExpBadge'),

    // Form Alert & Submit Buttons
    formAlert: document.getElementById('formAlert'),
    alertIcon: document.getElementById('alertIcon'),
    alertMessage: document.getElementById('alertMessage'),
    btnSubmit: document.getElementById('btnSubmitAppointment'),
    btnSubmitText: document.getElementById('btnSubmitText'),
    btnSubmitIcon: document.getElementById('btnSubmitIcon'),
    btnSpinner: document.getElementById('btnSpinner'),
    btnReset: document.getElementById('btnResetForm'),

    // Confirmation Section
    confirmationWrapper: document.getElementById('confirmationWrapper'),
    toastContainer: document.getElementById('toastContainer')
  };

  // Application State
  const state = {
    doctors: [],            // List of doctors loaded from server
    selectedDoctorId: '',   // Currently active doctor ID
    selectedDate: '',       // Selected date string (YYYY-MM-DD)
    selectedSlot: '',       // Selected time slot string (e.g., '10:00 AM')
    isSubmitting: false     // Duplicate submission lock
  };

  // Fallback doctors list ensuring resilient display even when opened via static file:// protocol
  const FALLBACK_DOCTORS = [
    {
      id: "doc-1",
      name: "Dr. Sarah Jenkins",
      specialization: "Cardiology",
      qualification: "MD, DM (Cardiology), FACC",
      experience: "14 Years Experience",
      experienceYears: 14,
      fee: 120,
      rating: 4.9,
      reviewsCount: 184,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      avatarFallback: "SJ",
      defaultSlots: ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"]
    },
    {
      id: "doc-2",
      name: "Dr. Rajesh Kumar",
      specialization: "Neurology",
      qualification: "MD, DM (Neurology), FAAN",
      experience: "16 Years Experience",
      experienceYears: 16,
      fee: 150,
      rating: 4.9,
      reviewsCount: 210,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
      avatarFallback: "RK",
      defaultSlots: ["09:30 AM", "10:30 AM", "11:45 AM", "02:15 PM", "03:45 PM", "05:00 PM"]
    },
    {
      id: "doc-3",
      name: "Dr. Emily Chen",
      specialization: "Dermatology",
      qualification: "MD (Dermatology, Venereology & Leprosy)",
      experience: "10 Years Experience",
      experienceYears: 10,
      fee: 90,
      rating: 4.8,
      reviewsCount: 162,
      image: "https://images.unsplash.com/photo-1594824813583-05c09361329c?auto=format&fit=crop&q=80&w=600",
      avatarFallback: "EC",
      defaultSlots: ["10:00 AM", "11:15 AM", "12:30 PM", "02:30 PM", "04:00 PM", "05:15 PM"]
    },
    {
      id: "doc-4",
      name: "Dr. Marcus Vance",
      specialization: "Pediatrics",
      qualification: "MD, DCH (Pediatrics), FAAP",
      experience: "12 Years Experience",
      experienceYears: 12,
      fee: 85,
      rating: 4.9,
      reviewsCount: 195,
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
      avatarFallback: "MV",
      defaultSlots: ["08:30 AM", "09:45 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:15 PM"]
    },
    {
      id: "doc-5",
      name: "Dr. Elena Rostova",
      specialization: "Orthopedics",
      qualification: "MS (Orthopedics), MCh (Joint Replacement)",
      experience: "15 Years Experience",
      experienceYears: 15,
      fee: 130,
      rating: 4.8,
      reviewsCount: 178,
      image: "https://images.unsplash.com/photo-1559839734-9276949b9101?auto=format&fit=crop&q=80&w=600",
      avatarFallback: "ER",
      defaultSlots: ["09:00 AM", "10:15 AM", "11:30 AM", "02:00 PM", "03:15 PM", "04:45 PM"]
    },
    {
      id: "doc-6",
      name: "Dr. David Miller",
      specialization: "General Medicine",
      qualification: "MD (Internal Medicine), FACP",
      experience: "18 Years Experience",
      experienceYears: 18,
      fee: 75,
      rating: 4.9,
      reviewsCount: 240,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600",
      avatarFallback: "DM",
      defaultSlots: ["08:00 AM", "09:15 AM", "10:30 AM", "11:45 AM", "02:00 PM", "03:30 PM", "04:45 PM"]
    }
  ];

  /* --------------------------------------------------------------------------
   * SECTION 2: INITIALIZATION & MINIMUM DATE SETUP
   * -------------------------------------------------------------------------- */

  /**
   * Concept: JavaScript Date Object for Past-Date Prevention
   * Sets the 'min' attribute of the appointment date input to today's date in YYYY-MM-DD format.
   * This automatically prevents the browser's native datepicker from selecting past dates.
   */
  function initializeDateRestrictions() {
    const today = new Date();
    // Extract year, month (0-indexed so +1), and day
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Format to YYYY-MM-DD
    const minDateString = `${year}-${month}-${day}`;
    dom.appointmentDateInput.setAttribute('min', minDateString);
  }

  /* --------------------------------------------------------------------------
   * SECTION 3: REGULAR EXPRESSION VALIDATIONS
   * -------------------------------------------------------------------------- */

  /**
   * Concept: Regular Expressions (RegEx)
   * Pattern rules specified by requirements:
   * 1. Patient Name: Letters and spaces only, minimum 3 characters
   * 2. Email: Standard email syntax (user@domain.ext)
   * 3. Phone: Exactly 10 numeric digits
   */
  const validationRules = {
    // Letters (uppercase & lowercase) and whitespace only, at least 3 characters
    patientName: /^[A-Za-z\s]{3,}$/,

    // Email format: non-space chars @ non-space chars . 2+ chars domain
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // Exactly 10 digits
    phone: /^\d{10}$/
  };

  /**
   * Validates an individual field and toggles error/success classes in the DOM
   * @param {string} fieldId - ID of field ('patientName', 'email', 'phone', 'age', 'date', 'doctor', 'gender', 'slot')
   * @returns {boolean} - true if valid, false if invalid
   */
  function validateField(fieldId) {
    let isValid = true;

    switch (fieldId) {
      case 'patientName': {
        const val = dom.patientNameInput.value.trim();
        isValid = validationRules.patientName.test(val);
        toggleFieldValidationState('patientName', isValid);
        break;
      }

      case 'email': {
        const val = dom.emailInput.value.trim();
        isValid = validationRules.email.test(val);
        toggleFieldValidationState('email', isValid);
        break;
      }

      case 'phone': {
        const val = dom.phoneInput.value.trim();
        isValid = validationRules.phone.test(val);
        toggleFieldValidationState('phone', isValid);
        break;
      }

      case 'age': {
        const val = parseInt(dom.ageInput.value, 10);
        isValid = !isNaN(val) && val >= 1 && val <= 120;
        toggleFieldValidationState('age', isValid);
        break;
      }

      case 'doctor': {
        isValid = dom.doctorSelect.value !== '';
        toggleFieldValidationState('doctor', isValid);
        break;
      }

      case 'gender': {
        const checkedGender = document.querySelector('input[name="gender"]:checked');
        isValid = checkedGender !== null;
        toggleFieldValidationState('gender', isValid);
        break;
      }

      case 'date': {
        const dateVal = dom.appointmentDateInput.value;
        if (!dateVal) {
          isValid = false;
        } else {
          // Concept: JavaScript Date object validation
          // Parse selected date and compare with today midnight
          const selectedDateObj = new Date(`${dateVal}T00:00:00`);
          const todayMidnight = new Date();
          todayMidnight.setHours(0, 0, 0, 0);

          isValid = !isNaN(selectedDateObj.getTime()) && selectedDateObj >= todayMidnight;
        }
        toggleFieldValidationState('date', isValid);
        break;
      }

      case 'slot': {
        isValid = dom.selectedTimeSlotInput.value !== '';
        toggleFieldValidationState('slot', isValid);
        break;
      }
    }

    return isValid;
  }

  /**
   * Helper to toggle visual validation state in the UI
   * @param {string} fieldId
   * @param {boolean} isValid
   */
  function toggleFieldValidationState(fieldId, isValid) {
    const groupElement = document.getElementById(`group-${fieldId}`);
    if (!groupElement) return;

    if (isValid) {
      groupElement.classList.remove('has-error');
      groupElement.classList.add('is-valid');
    } else {
      groupElement.classList.remove('is-valid');
      groupElement.classList.add('has-error');
    }
  }

  /**
   * Clears all validation borders and error indicators
   */
  function clearValidationStates() {
    const allGroups = dom.bookingForm.querySelectorAll('.form-group');
    allGroups.forEach((group) => {
      group.classList.remove('has-error');
      group.classList.remove('is-valid');
    });
    hideFormAlert();
  }

  /* --------------------------------------------------------------------------
   * SECTION 4: DOCTOR SECTION & DYNAMIC RENDERING
   * -------------------------------------------------------------------------- */

  /**
   * Fetch doctors list on page load using Fetch API
   */
  function loadDoctors() {
    fetch('/api/doctors')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load doctor profiles');
        return response.json();
      })
      .then((data) => {
        if (data.success && data.doctors && data.doctors.length > 0) {
          state.doctors = data.doctors;
          renderDoctorCards(state.doctors);
          populateDoctorDropdown(state.doctors);
        } else {
          throw new Error('Empty doctor dataset');
        }
      })
      .catch((err) => {
        console.warn('Live /api/doctors endpoint unreachable, falling back to embedded doctor dataset:', err);
        state.doctors = FALLBACK_DOCTORS;
        renderDoctorCards(state.doctors);
        populateDoctorDropdown(state.doctors);
      });
  }

  /**
   * Concept: DOM Manipulation
   * Dynamically renders at least 6 doctor profile cards with images, specialization,
   * qualifications, experience, and consultation fees.
   * @param {Array} doctorsList
   */
  function renderDoctorCards(doctorsList) {
    dom.doctorsGrid.innerHTML = '';

    if (doctorsList.length === 0) {
      dom.doctorsGrid.innerHTML = `
        <div class="doctors-loading-placeholder">
          <p>No doctors found matching this specialty filter.</p>
        </div>
      `;
      return;
    }

    doctorsList.forEach((doctor) => {
      const card = document.createElement('div');
      card.className = 'doctor-card';
      card.setAttribute('data-doctor-id', doctor.id);
      card.setAttribute('data-specialty', doctor.specialization);

      // Card inner structure with SVG avatar fallback if image fails
      card.innerHTML = `
        <div class="doctor-card-top">
          <img 
            src="${doctor.image}" 
            alt="${doctor.name}" 
            class="doctor-photo" 
            loading="lazy"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="avatar-fallback-wrapper" style="display: none;">
            <span class="avatar-initials">${doctor.avatarFallback || 'DR'}</span>
          </div>
          <span class="doctor-spec-tag">${doctor.specialization}</span>
          <div class="doctor-rating-tag">
            <svg class="icon-sm star-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>${doctor.rating} (${doctor.reviewsCount})</span>
          </div>
        </div>

        <div class="doctor-card-body">
          <h3 class="doctor-name">${doctor.name}</h3>
          <p class="doctor-qualifications">${doctor.qualification}</p>

          <ul class="doctor-details-list">
            <li class="doctor-detail-item">
              <svg class="icon-sm text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span><strong>Experience:</strong> ${doctor.experience}</span>
            </li>
            <li class="doctor-detail-item">
              <svg class="icon-sm text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span><strong>Availability:</strong> Mon - Sat OPD</span>
            </li>
          </ul>

          <div class="doctor-fee-row">
            <div>
              <span class="fee-label">Consultation Fee</span>
              <div class="fee-amount">$${doctor.fee}</div>
            </div>
            <span class="badge-exp">${doctor.experienceYears} Yrs Exp</span>
          </div>

          <button type="button" class="btn btn-primary btn-select-doctor" data-select-id="${doctor.id}">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Select Doctor</span>
          </button>
        </div>
      `;

      dom.doctorsGrid.appendChild(card);
    });

    // Re-attach event listeners to new "Select Doctor" buttons
    attachSelectDoctorListeners();
  }

  /**
   * Populates the HTML <select> dropdown with doctor options
   * @param {Array} doctors
   */
  function populateDoctorDropdown(doctors) {
    dom.doctorSelect.innerHTML = '<option value="" disabled selected>-- Choose a Doctor --</option>';
    doctors.forEach((doc) => {
      const opt = document.createElement('option');
      opt.value = doc.id;
      opt.textContent = `${doc.name} - ${doc.specialization} ($${doc.fee})`;
      dom.doctorSelect.appendChild(opt);
    });
  }

  /**
   * Concept: Event Handling using addEventListener
   * Listens for click events on the "Select Doctor" button of each doctor card
   */
  function attachSelectDoctorListeners() {
    const selectButtons = dom.doctorsGrid.querySelectorAll('.btn-select-doctor');
    selectButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const docId = btn.getAttribute('data-select-id');
        handleDoctorSelection(docId, true);
      });
    });
  }

  /**
   * Synchronizes doctor selection across Doctor Cards, Select Dropdown, and Slot Fetching
   * @param {string} doctorId
   * @param {boolean} shouldScroll - whether to smooth scroll to booking section
   */
  function handleDoctorSelection(doctorId, shouldScroll = false) {
    state.selectedDoctorId = doctorId;
    dom.doctorSelect.value = doctorId;

    // Highlight selected doctor card visually
    const allCards = dom.doctorsGrid.querySelectorAll('.doctor-card');
    allCards.forEach((c) => c.classList.remove('selected-doctor-active'));
    const matchingCard = dom.doctorsGrid.querySelector(`.doctor-card[data-doctor-id="${doctorId}"]`);
    if (matchingCard) {
      matchingCard.classList.add('selected-doctor-active');
    }

    // Update quick fee & experience badges
    const selectedDoc = state.doctors.find((d) => d.id === doctorId);
    if (selectedDoc) {
      dom.doctorQuickMeta.style.display = 'flex';
      dom.quickFeeBadge.textContent = `Fee: $${selectedDoc.fee}`;
      dom.quickExpBadge.textContent = selectedDoc.experience;
    }

    // Validate doctor field
    validateField('doctor');

    // If an appointment date is already chosen, trigger slot fetching
    if (dom.appointmentDateInput.value) {
      fetchAvailableSlots();
    } else {
      dom.slotSyncStatus.textContent = 'Please choose an appointment date';
    }

    // Smooth scroll to appointment form if requested
    if (shouldScroll) {
      dom.bookingCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast(`Selected: ${selectedDoc ? selectedDoc.name : 'Doctor'}`, 'info');
    }
  }

  /* --------------------------------------------------------------------------
   * SECTION 5: AJAX USING FETCH API FOR AVAILABLE TIME SLOTS
   * -------------------------------------------------------------------------- */

  /**
   * Concept: AJAX using Fetch API
   * Retrieves available appointment slots for a selected doctor and date from local server endpoint.
   * Uses callback functions to process the response.
   */
  function fetchAvailableSlots() {
    const doctorId = dom.doctorSelect.value;
    const dateVal = dom.appointmentDateInput.value;

    // Reset selected slot state
    state.selectedSlot = '';
    dom.selectedTimeSlotInput.value = '';
    toggleFieldValidationState('slot', false);

    // If either doctor or date is missing, display prompt
    if (!doctorId || !dateVal) {
      dom.timeSlotsContainer.classList.remove('active-loaded');
      dom.timeSlotsContainer.innerHTML = `
        <div class="slot-initial-notice">
          <svg class="icon-lg text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <p>Please select both a <strong>Doctor</strong> and an <strong>Appointment Date</strong> to view available time slots.</p>
        </div>
      `;
      dom.slotSyncStatus.textContent = 'Doctor & date required';
      return;
    }

    // Validate that the date is not in the past
    if (!validateField('date')) {
      dom.timeSlotsContainer.innerHTML = `
        <div class="slot-empty-notice" style="color: var(--color-error);">
          <p>Please choose a valid date that is not in the past.</p>
        </div>
      `;
      dom.slotSyncStatus.textContent = 'Invalid date';
      return;
    }

    // Display loading indicator
    dom.slotSyncStatus.textContent = 'Checking real-time slot availability...';
    dom.timeSlotsContainer.innerHTML = `
      <div class="slot-loading-box">
        <div class="spinner"></div>
        <p>Retrieving available slots from hospital database...</p>
      </div>
    `;

    // Construct URL with query parameters
    const apiUrl = `/api/slots?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(dateVal)}`;

    // Concept: Fetch API call
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            throw new Error(errData.message || `Server responded with status ${response.status}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        // Concept: Callback invocation for slot processing
        handleSlotSuccessCallback(data);
      })
      .catch((error) => {
        // Concept: Callback invocation for slot retrieval error
        handleSlotErrorCallback(error);
      });
  }

  /**
   * Concept: Callback Method for Available Slots Success
   * Processes the JSON data returned from the GET /api/slots endpoint.
   * Dynamically renders slot buttons with click event handlers.
   * @param {Object} responseData
   */
  function handleSlotSuccessCallback(responseData) {
    dom.timeSlotsContainer.classList.add('active-loaded');
    dom.timeSlotsContainer.innerHTML = '';

    const availableSlots = responseData.availableSlots || [];
    const bookedSlots = responseData.bookedSlots || [];

    dom.slotSyncStatus.textContent = `${availableSlots.length} slot(s) available on ${responseData.date}`;

    // Case 1: No slots available
    if (availableSlots.length === 0) {
      dom.timeSlotsContainer.innerHTML = `
        <div class="slot-empty-notice">
          <svg class="icon-lg" style="color: var(--color-warning);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p><strong>Fully Booked!</strong> All appointment slots for ${responseData.doctorName} on this date are already reserved. Please select another date or doctor.</p>
        </div>
      `;
      return;
    }

    // Case 2: Render available slot buttons
    const slotsGrid = document.createElement('div');
    slotsGrid.className = 'time-slots-grid';

    // Combine all doctor slots for display: available ones enabled, booked ones disabled
    const doctorObj = state.doctors.find((d) => d.id === responseData.doctorId);
    const allSlots = doctorObj ? doctorObj.defaultSlots : availableSlots;

    allSlots.forEach((slotTime) => {
      const isBooked = bookedSlots.includes(slotTime);

      const slotBtn = document.createElement('button');
      slotBtn.type = 'button';
      slotBtn.className = `slot-pill-btn ${isBooked ? 'slot-booked' : 'slot-available'}`;
      slotBtn.setAttribute('data-slot', slotTime);

      if (isBooked) {
        slotBtn.disabled = true;
        slotBtn.innerHTML = `
          <span>${slotTime}</span>
          <span class="slot-status-indicator">Booked</span>
        `;
      } else {
        slotBtn.innerHTML = `
          <span>${slotTime}</span>
          <span class="slot-status-indicator">Available</span>
        `;

        // Event listener for slot pill click
        slotBtn.addEventListener('click', () => {
          selectTimeSlot(slotTime, slotBtn);
        });
      }

      slotsGrid.appendChild(slotBtn);
    });

    dom.timeSlotsContainer.appendChild(slotsGrid);
  }

  /**
   * Concept: Callback Method for Available Slots Error
   * @param {Error} error
   */
  function handleSlotErrorCallback(error) {
    console.error('Slot retrieval error:', error);
    dom.slotSyncStatus.textContent = 'Error checking slots';
    dom.timeSlotsContainer.innerHTML = `
      <div class="slot-empty-notice" style="color: var(--color-error);">
        <p><strong>Failed to retrieve slots:</strong> ${error.message || 'Network error'}.</p>
      </div>
    `;
  }

  /**
   * Handles user clicking a slot button
   * @param {string} slotTime
   * @param {HTMLElement} btnElement
   */
  function selectTimeSlot(slotTime, btnElement) {
    state.selectedSlot = slotTime;
    dom.selectedTimeSlotInput.value = slotTime;

    // Highlight chosen slot button
    const allSlotButtons = dom.timeSlotsContainer.querySelectorAll('.slot-pill-btn');
    allSlotButtons.forEach((b) => b.classList.remove('selected-slot'));
    btnElement.classList.add('selected-slot');

    // Mark slot field as valid
    validateField('slot');
  }

  /* --------------------------------------------------------------------------
   * SECTION 6: XMLHTTPREQUEST (XHR) FOR FORM SUBMISSION
   * -------------------------------------------------------------------------- */

  /**
   * Concept: Form Submission using XMLHttpRequest (Requirement 8)
   * Sends appointment details to the server endpoint using a POST request.
   * Details are serialized with JSON.stringify().
   * Response is parsed using JSON.parse().
   * Callbacks handle the asynchronous outcome.
   * ReadyState and HTTP Status are rigorously verified.
   * @param {Object} appointmentData
   * @param {Function} onSuccessCallback
   * @param {Function} onErrorCallback
   */
  function submitAppointmentUsingXHR(appointmentData, onSuccessCallback, onErrorCallback) {
    // 1. Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // 2. Configure HTTP POST request to /api/appointments
    xhr.open('POST', '/api/appointments', true);

    // 3. Set Request Header to indicate JSON content
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.setRequestHeader('Accept', 'application/json');

    // 4. Attach readyState change handler
    xhr.onreadystatechange = function () {
      // readyState 4 represents the DONE state (operation complete)
      if (xhr.readyState === XMLHttpRequest.DONE || xhr.readyState === 4) {
        // HTTP Status 200 or 201 indicates success
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            // Parse server JSON response
            const response = JSON.parse(xhr.responseText);
            // Execute success callback
            onSuccessCallback(response);
          } catch (parseErr) {
            onErrorCallback({
              status: xhr.status,
              message: 'Failed to parse JSON response from server.'
            });
          }
        } else {
          // HTTP Error handling (e.g. 400 Validation or 409 Conflict)
          let errorPayload;
          try {
            errorPayload = JSON.parse(xhr.responseText);
          } catch (e) {
            errorPayload = { message: xhr.statusText || `Request failed with status ${xhr.status}` };
          }
          errorPayload.status = xhr.status;
          // Execute error callback
          onErrorCallback(errorPayload);
        }
      }
    };

    // 5. Attach network error handler
    xhr.onerror = function () {
      onErrorCallback({
        status: 0,
        message: 'Network error occurred while connecting to the hospital server.'
      });
    };

    // 6. Convert JavaScript object into JSON string and send
    const payloadString = JSON.stringify(appointmentData);
    xhr.send(payloadString);
  }

  /* --------------------------------------------------------------------------
   * SECTION 7: CALLBACK METHODS FOR APPOINTMENT SUBMISSION
   * -------------------------------------------------------------------------- */

  /**
   * Concept: Callback Method for Successful Booking (Requirement 9 & 10)
   * Dynamically renders confirmation card using DOM manipulation.
   * @param {Object} response
   */
  function handleBookingSuccessCallback(response) {
    setSubmittingState(false);

    const appt = response.appointment;

    // Display confirmation card dynamically using DOM manipulation
    renderDynamicConfirmationCard(appt);

    // Show top notification toast
    showToast('Appointment Booked Successfully!', 'success');

    // Hide booking form card smoothly
    dom.bookingCard.style.display = 'none';

    // Smoothly scroll to the confirmation slip
    dom.confirmationWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Concept: Callback Method for Submission Failure (Requirement 9)
   * @param {Object} error
   */
  function handleBookingErrorCallback(error) {
    setSubmittingState(false);

    console.error('Booking submission error:', error);
    const errorMessage = error.message || 'Failed to complete appointment booking. Please try again.';

    // Show error banner in form
    showFormAlert(errorMessage, 'danger');

    // If slot collision occurred (409 Conflict), refresh slots immediately
    if (error.status === 409) {
      showToast(errorMessage, 'error');
      fetchAvailableSlots();
    } else {
      showToast(errorMessage, 'error');
    }
  }

  /* --------------------------------------------------------------------------
   * SECTION 8: DYNAMIC CONFIRMATION CARD RENDERING (REQUIREMENT 10)
   * -------------------------------------------------------------------------- */

  /**
   * Concept: DOM Manipulation for Confirmation Card
   * Dynamically constructs the official Appointment Confirmation Slip
   * with Appointment ID, Patient Name, Doctor, Specialization, Date, Time Slot,
   * and a functional Print Appointment button.
   * @param {Object} appt
   */
  function renderDynamicConfirmationCard(appt) {
    dom.confirmationWrapper.innerHTML = '';

    // Create wrapper card element
    const card = document.createElement('div');
    card.className = 'confirmation-card';
    card.id = 'printableConfirmationCard';

    // Build header
    const header = document.createElement('div');
    header.className = 'confirmation-card-header';
    header.innerHTML = `
      <div class="confirm-header-brand">
        <div class="logo-icon-badge small">
          <svg class="medical-cross-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
          </svg>
        </div>
        <div>
          <h3 class="confirm-hospital-title">APEX MULTISPECIALITY HOSPITAL</h3>
          <p style="font-size: 0.75rem; opacity: 0.9;">Official Appointment Confirmation Slip</p>
        </div>
      </div>
      <div class="confirm-badge-status">
        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${appt.status || 'CONFIRMED'}</span>
      </div>
    `;

    // Build body
    const body = document.createElement('div');
    body.className = 'confirmation-card-body';

    // Format human-friendly date
    let formattedDate = appt.appointmentDate;
    try {
      const dObj = new Date(`${appt.appointmentDate}T00:00:00`);
      formattedDate = dObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      formattedDate = appt.appointmentDate;
    }

    body.innerHTML = `
      <div class="confirm-success-hero">
        <div class="success-check-badge">
          <svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2>Appointment Booked Successfully!</h2>
        <p>A digital confirmation and visit instructions have been recorded in the hospital registry.</p>
      </div>

      <div class="confirm-details-grid">
        <div class="confirm-detail-cell">
          <span class="confirm-label">Appointment ID</span>
          <span class="confirm-val highlight-id">${appt.appointmentId}</span>
        </div>

        <div class="confirm-detail-cell">
          <span class="confirm-label">Booking Status</span>
          <span class="confirm-val" style="color: var(--color-success); font-weight: 800;">${appt.status || 'Confirmed'}</span>
        </div>

        <div class="confirm-detail-cell">
          <span class="confirm-label">Patient Name</span>
          <span class="confirm-val">${appt.patientName} (${appt.age} Yrs, ${appt.gender})</span>
        </div>

        <div class="confirm-detail-cell">
          <span class="confirm-label">Contact Details</span>
          <span class="confirm-val">${appt.phone} | ${appt.email}</span>
        </div>

        <div class="confirm-detail-cell">
          <span class="confirm-label">Assigned Specialist</span>
          <span class="confirm-val">${appt.doctorName}</span>
        </div>

        <div class="confirm-detail-cell">
          <span class="confirm-label">Specialization</span>
          <span class="confirm-val">${appt.specialization}</span>
        </div>

        <div class="confirm-detail-cell">
          <span class="confirm-label">Appointment Date</span>
          <span class="confirm-val">${formattedDate}</span>
        </div>

        <div class="confirm-detail-cell">
          <span class="confirm-label">Scheduled Time Slot</span>
          <span class="confirm-val highlight-slot">${appt.timeSlot}</span>
        </div>

        <div class="confirm-detail-cell">
          <span class="confirm-label">Consultation Fee</span>
          <span class="confirm-val">$${appt.consultationFee || 100} (Pay at Hospital Counter)</span>
        </div>

        <div class="confirm-detail-cell">
          <span class="confirm-label">Reason for Visit</span>
          <span class="confirm-val">${appt.reason || 'General Consultation'}</span>
        </div>
      </div>

      <div class="confirm-instructions">
        <svg class="icon-md" style="flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <div>
          <strong>Patient Guidelines:</strong> Please arrive at the OPD reception at least 15 minutes before your scheduled slot. Present this Appointment ID along with valid identification and any prior medical diagnostic records.
        </div>
      </div>

      <!-- Action Buttons for Printing and New Booking -->
      <div class="confirmation-actions no-print">
        <button type="button" class="btn btn-secondary" id="btnBookAnother">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Book Another Appointment</span>
        </button>

        <button type="button" class="btn btn-primary" id="btnPrintSlip">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Print Appointment Slip</span>
        </button>
      </div>
    `;

    card.appendChild(header);
    card.appendChild(body);

    dom.confirmationWrapper.appendChild(card);
    dom.confirmationWrapper.style.display = 'block';

    // Attach Event Listeners to Confirmation Actions
    const btnPrintSlip = document.getElementById('btnPrintSlip');
    const btnBookAnother = document.getElementById('btnBookAnother');

    if (btnPrintSlip) {
      btnPrintSlip.addEventListener('click', () => {
        // Concept: Window Print API & Media Query Coordination (Requirement 10)
        window.print();
      });
    }

    if (btnBookAnother) {
      btnBookAnother.addEventListener('click', () => {
        resetAppointmentForm();
        dom.confirmationWrapper.style.display = 'none';
        dom.bookingCard.style.display = 'block';
        dom.bookingCard.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  /* --------------------------------------------------------------------------
   * SECTION 9: FORM SUBMISSION HANDLING
   * -------------------------------------------------------------------------- */

  /**
   * Concept: Event Handling using addEventListener
   * Listens for form submit event, performs client-side validation,
   * gathers inputs, and delegates to XMLHttpRequest.
   */
  dom.bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Prevent duplicate clicks if already processing
    if (state.isSubmitting) return;

    // Validate all form fields
    const isNameValid = validateField('patientName');
    const isEmailValid = validateField('email');
    const isPhoneValid = validateField('phone');
    const isAgeValid = validateField('age');
    const isGenderValid = validateField('gender');
    const isDoctorValid = validateField('doctor');
    const isDateValid = validateField('date');
    const isSlotValid = validateField('slot');

    const isFormValid =
      isNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isAgeValid &&
      isGenderValid &&
      isDoctorValid &&
      isDateValid &&
      isSlotValid;

    if (!isFormValid) {
      showFormAlert('Please correct the highlighted fields before submitting.', 'danger');
      showToast('Form validation failed. Please check required fields.', 'error');
      return;
    }

    // Prepare appointment data object
    const checkedGender = document.querySelector('input[name="gender"]:checked');
    const payload = {
      patientName: dom.patientNameInput.value.trim(),
      email: dom.emailInput.value.trim(),
      phone: dom.phoneInput.value.trim(),
      age: parseInt(dom.ageInput.value, 10),
      gender: checkedGender ? checkedGender.value : 'Other',
      doctorId: dom.doctorSelect.value,
      appointmentDate: dom.appointmentDateInput.value,
      timeSlot: dom.selectedTimeSlotInput.value,
      reason: dom.visitReasonInput.value.trim()
    };

    // Lock button and start spinner
    setSubmittingState(true);
    hideFormAlert();

    // Call XMLHttpRequest submission function (Requirement 8)
    submitAppointmentUsingXHR(
      payload,
      handleBookingSuccessCallback,
      handleBookingErrorCallback
    );
  });

  /**
   * Toggles submitting UI state (spinner, disable button)
   * @param {boolean} isSubmitting
   */
  function setSubmittingState(isSubmitting) {
    state.isSubmitting = isSubmitting;
    dom.btnSubmit.disabled = isSubmitting;

    if (isSubmitting) {
      dom.btnSpinner.style.display = 'inline-block';
      dom.btnSubmitIcon.style.display = 'none';
      dom.btnSubmitText.textContent = 'Processing Appointment...';
    } else {
      dom.btnSpinner.style.display = 'none';
      dom.btnSubmitIcon.style.display = 'inline-block';
      dom.btnSubmitText.textContent = 'Confirm & Book Appointment';
    }
  }

  /* --------------------------------------------------------------------------
   * SECTION 10: REAL-TIME INPUT EVENT LISTENERS
   * -------------------------------------------------------------------------- */

  // Patient Name: Real-time validation
  dom.patientNameInput.addEventListener('input', () => {
    validateField('patientName');
  });

  // Email: Real-time validation
  dom.emailInput.addEventListener('input', () => {
    validateField('email');
  });

  // Phone: Limit to digits and real-time validation
  dom.phoneInput.addEventListener('input', (e) => {
    // Strip non-numeric characters
    dom.phoneInput.value = dom.phoneInput.value.replace(/\D/g, '').slice(0, 10);
    validateField('phone');
  });

  // Age: Real-time validation
  dom.ageInput.addEventListener('input', () => {
    validateField('age');
  });

  // Gender Radio buttons change listener
  dom.genderInputs.forEach((radio) => {
    radio.addEventListener('change', () => {
      validateField('gender');
    });
  });

  // Doctor Select Dropdown change listener
  dom.doctorSelect.addEventListener('change', (e) => {
    handleDoctorSelection(e.target.value, false);
  });

  // Appointment Date Picker change listener
  dom.appointmentDateInput.addEventListener('change', () => {
    validateField('date');
    fetchAvailableSlots();
  });

  // Visit Reason Character Count indicator
  dom.visitReasonInput.addEventListener('input', (e) => {
    dom.charCountSpan.textContent = e.target.value.length;
  });

  // Specialty Filter buttons click listener
  dom.filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      dom.filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        renderDoctorCards(state.doctors);
      } else {
        const filtered = state.doctors.filter((d) => d.specialization === filter);
        renderDoctorCards(filtered);
      }
    });
  });

  // Mobile navigation hamburger toggle
  if (dom.navToggle) {
    dom.navToggle.addEventListener('click', () => {
      dom.navMenu.classList.toggle('open');
    });
  }

  // Close mobile nav menu when clicking any nav link
  dom.navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      dom.navMenu.classList.remove('open');
    });
  });

  /* --------------------------------------------------------------------------
   * SECTION 11: RESET FORM FUNCTIONALITY
   * -------------------------------------------------------------------------- */

  dom.btnReset.addEventListener('click', () => {
    resetAppointmentForm();
    showToast('Form has been reset', 'info');
  });

  /**
   * Resets all form fields, selections, and validation classes
   */
  function resetAppointmentForm() {
    dom.bookingForm.reset();
    state.selectedDoctorId = '';
    state.selectedDate = '';
    state.selectedSlot = '';
    dom.selectedTimeSlotInput.value = '';
    dom.charCountSpan.textContent = '0';

    clearValidationStates();

    // Reset doctor selection highlights
    const allCards = dom.doctorsGrid.querySelectorAll('.doctor-card');
    allCards.forEach((c) => c.classList.remove('selected-doctor-active'));
    dom.doctorQuickMeta.style.display = 'none';

    // Reset slots container
    dom.timeSlotsContainer.classList.remove('active-loaded');
    dom.timeSlotsContainer.innerHTML = `
      <div class="slot-initial-notice">
        <svg class="icon-lg text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <p>Please select a <strong>Doctor</strong> and <strong>Appointment Date</strong> above to load real-time available time slots.</p>
      </div>
    `;
    dom.slotSyncStatus.textContent = 'Select a doctor & date to see slots';
  }

  /* --------------------------------------------------------------------------
   * SECTION 12: UI FEEDBACK & TOAST HELPERS
   * -------------------------------------------------------------------------- */

  function showFormAlert(message, type = 'danger') {
    dom.formAlert.className = `alert-banner alert-${type}`;
    dom.alertMessage.textContent = message;
    dom.formAlert.style.display = 'flex';
  }

  function hideFormAlert() {
    dom.formAlert.style.display = 'none';
  }

  /**
   * Displays non-intrusive floating toast notifications
   * @param {string} message
   * @param {string} type ('success', 'error', 'info')
   */
  function showToast(message, type = 'info') {
    if (!dom.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconMarkup = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    if (type === 'success') {
      iconMarkup = '<svg class="icon-sm text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconMarkup = '<svg class="icon-sm" style="color: var(--color-error);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    }

    toast.innerHTML = `${iconMarkup}<span>${message}</span>`;
    dom.toastContainer.appendChild(toast);

    // Auto remove after 3.8 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, 3800);
  }

  /* --------------------------------------------------------------------------
   * SECTION 13: BOOTSTRAP APPLICATION
   * -------------------------------------------------------------------------- */
  initializeDateRestrictions();
  loadDoctors();

});
