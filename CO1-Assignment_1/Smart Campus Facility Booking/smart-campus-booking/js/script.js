/**
 * Smart Campus Facility Booking System
 * Script: js/script.js
 * Comprehensive Frontend Interactions, Drag-and-Drop, Calendar, and Form Validations
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initDragAndDrop();
  initFacilityFiltering();
  initFormValidation();
  initCalendarInteractions();
  initModals();
  initToasts();
});

/* ==========================================================================
   1. Sidebar & Mobile Navigation
   ========================================================================== */
function initSidebar() {
  const toggleBtn = document.getElementById('mobileToggleBtn');
  const sidebar = document.getElementById('mainSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
      if (backdrop) backdrop.classList.toggle('active');
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (sidebar) sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('active');
    });
  }

  // Highlight active page link based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.php';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.php') || (currentPath === 'dashboard.php' && href === 'index.php')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   2. HTML5 Drag-and-Drop Room Allocation (Section 2.G)
   ========================================================================== */
function initDragAndDrop() {
  const draggableCards = document.querySelectorAll('.draggable-card');
  const dropZone = document.getElementById('roomDropZone');
  const facilitySelect = document.getElementById('facility_id');
  const droppedDisplay = document.getElementById('droppedRoomDisplay');
  const emptyDropState = document.getElementById('emptyDropState');

  if (!dropZone) return;

  // Setup draggable cards
  draggableCards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      const facilityId = card.getAttribute('data-facility-id');
      const facilityName = card.getAttribute('data-facility-name');
      const facilityImg = card.getAttribute('data-facility-img');
      const facilityLoc = card.getAttribute('data-facility-loc');
      const facilityCap = card.getAttribute('data-facility-cap');

      const data = JSON.stringify({
        id: facilityId,
        name: facilityName,
        img: facilityImg,
        loc: facilityLoc,
        cap: facilityCap
      });

      e.dataTransfer.setData('application/json', data);
      e.dataTransfer.setData('text/plain', facilityId);
      e.dataTransfer.effectAllowed = 'copyMove';

      card.classList.add('is-dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
    });
  });

  // Setup Drop Zone
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', (e) => {
    if (!dropZone.contains(e.relatedTarget)) {
      dropZone.classList.remove('drag-over');
    }
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    let droppedData = null;
    try {
      const jsonStr = e.dataTransfer.getData('application/json');
      if (jsonStr) {
        droppedData = JSON.parse(jsonStr);
      }
    } catch (err) {
      // Fallback
    }

    if (!droppedData) {
      const id = e.dataTransfer.getData('text/plain');
      if (id) {
        const matchingCard = document.querySelector(`.draggable-card[data-facility-id="${id}"]`);
        if (matchingCard) {
          droppedData = {
            id: id,
            name: matchingCard.getAttribute('data-facility-name'),
            img: matchingCard.getAttribute('data-facility-img'),
            loc: matchingCard.getAttribute('data-facility-loc'),
            cap: matchingCard.getAttribute('data-facility-cap')
          };
        }
      }
    }

    if (droppedData && droppedData.id) {
      applyAllocatedRoom(droppedData);
      showToast(`Allocated: ${droppedData.name}`, 'success');
    }
  });

  // Two-way synchronization with <select id="facility_id">
  if (facilitySelect) {
    facilitySelect.addEventListener('change', () => {
      const selectedId = facilitySelect.value;
      if (!selectedId) {
        clearAllocatedRoom();
        return;
      }
      const matchingCard = document.querySelector(`.draggable-card[data-facility-id="${selectedId}"]`);
      if (matchingCard) {
        const data = {
          id: selectedId,
          name: matchingCard.getAttribute('data-facility-name'),
          img: matchingCard.getAttribute('data-facility-img'),
          loc: matchingCard.getAttribute('data-facility-loc'),
          cap: matchingCard.getAttribute('data-facility-cap')
        };
        applyAllocatedRoom(data, false);
      }
    });

    // Check if a facility is preselected on page load (e.g. from URL parameter ?facility_id=X)
    if (facilitySelect.value) {
      facilitySelect.dispatchEvent(new Event('change'));
    }
  }

  // Remove button handler inside dropped room display
  const removeBtn = document.getElementById('btnRemoveAllocation');
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearAllocatedRoom();
      showToast('Facility allocation removed.', 'info');
    });
  }
}

/**
 * Renders the allocated room in the drop area and synchronizes with the form dropdown.
 */
function applyAllocatedRoom(data, updateSelect = true) {
  const dropZone = document.getElementById('roomDropZone');
  const droppedDisplay = document.getElementById('droppedRoomDisplay');
  const emptyDropState = document.getElementById('emptyDropState');
  const facilitySelect = document.getElementById('facility_id');

  if (!droppedDisplay || !emptyDropState) return;

  // Populate visual display
  const droppedImg = document.getElementById('droppedImg');
  const droppedTitle = document.getElementById('droppedTitle');
  const droppedLoc = document.getElementById('droppedLoc');
  const droppedCap = document.getElementById('droppedCap');

  if (droppedImg) droppedImg.src = data.img || 'images/facility-1.svg';
  if (droppedTitle) droppedTitle.textContent = data.name;
  if (droppedLoc) droppedLoc.textContent = data.loc;
  if (droppedCap) droppedCap.textContent = `${data.cap} Seats`;

  emptyDropState.style.display = 'none';
  droppedDisplay.style.display = 'flex';
  if (dropZone) dropZone.style.borderColor = 'var(--teal-500)';

  // Update select dropdown if requested
  if (updateSelect && facilitySelect) {
    facilitySelect.value = data.id;
    facilitySelect.classList.remove('is-invalid');
  }

  // If participants input has value, check capacity
  const participantsInput = document.getElementById('participant_count');
  if (participantsInput && participantsInput.value) {
    const count = parseInt(participantsInput.value, 10);
    const cap = parseInt(data.cap, 10);
    if (count > cap) {
      showToast(`Warning: Participant count (${count}) exceeds room capacity (${cap})!`, 'error');
    }
  }
}

/**
 * Clears allocated room and resets drop zone.
 */
function clearAllocatedRoom() {
  const dropZone = document.getElementById('roomDropZone');
  const droppedDisplay = document.getElementById('droppedRoomDisplay');
  const emptyDropState = document.getElementById('emptyDropState');
  const facilitySelect = document.getElementById('facility_id');

  if (droppedDisplay) droppedDisplay.style.display = 'none';
  if (emptyDropState) emptyDropState.style.display = 'flex';
  if (dropZone) dropZone.style.borderColor = '#94a3b8';
  if (facilitySelect) facilitySelect.value = '';
}

/* ==========================================================================
   3. Facility Search & Filter (Section 2.C)
   ========================================================================== */
function initFacilityFiltering() {
  const searchInput = document.getElementById('facilitySearchInput');
  const categoryFilter = document.getElementById('facilityCategoryFilter');
  const statusFilter = document.getElementById('facilityStatusFilter');
  const capacityFilter = document.getElementById('facilityCapacityFilter');
  const filterPills = document.querySelectorAll('.filter-pill');
  const facilityCards = document.querySelectorAll('.facility-card-item');

  if (!facilityCards.length) return;

  function filterCards() {
    const searchVal = (searchInput ? searchInput.value.toLowerCase().trim() : '');
    const selectedCategory = (categoryFilter ? categoryFilter.value : 'All');
    const selectedStatus = (statusFilter ? statusFilter.value : 'All');
    const selectedCap = (capacityFilter ? capacityFilter.value : 'All');

    let visibleCount = 0;

    facilityCards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const building = (card.getAttribute('data-building') || '').toLowerCase();
      const equipment = (card.getAttribute('data-equipment') || '').toLowerCase();
      const category = card.getAttribute('data-category') || '';
      const status = card.getAttribute('data-status') || '';
      const capacity = parseInt(card.getAttribute('data-capacity') || '0', 10);

      // Search match
      const matchesSearch = !searchVal || 
        name.includes(searchVal) || 
        building.includes(searchVal) || 
        equipment.includes(searchVal);

      // Category match
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory;

      // Status match
      const matchesStatus = selectedStatus === 'All' || status === selectedStatus;

      // Capacity match
      let matchesCapacity = true;
      if (selectedCap === '1-30') matchesCapacity = (capacity >= 1 && capacity <= 30);
      else if (selectedCap === '31-60') matchesCapacity = (capacity >= 31 && capacity <= 60);
      else if (selectedCap === '61-150') matchesCapacity = (capacity >= 61 && capacity <= 150);
      else if (selectedCap === '151+') matchesCapacity = (capacity > 150);

      if (matchesSearch && matchesCategory && matchesStatus && matchesCapacity) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const emptyNotice = document.getElementById('noFacilitiesNotice');
    if (emptyNotice) {
      emptyNotice.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  }

  if (searchInput) searchInput.addEventListener('input', filterCards);
  if (categoryFilter) categoryFilter.addEventListener('change', filterCards);
  if (statusFilter) statusFilter.addEventListener('change', filterCards);
  if (capacityFilter) capacityFilter.addEventListener('change', filterCards);

  // Quick filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-category');
      if (categoryFilter) {
        categoryFilter.value = cat;
      }
      filterCards();
    });
  });
}

/* ==========================================================================
   4. Form Validation (Section 2.F)
   ========================================================================== */
function initFormValidation() {
  const bookingForm = document.getElementById('facilityBookingForm');
  if (!bookingForm) return;

  const dateInput = document.getElementById('booking_date');
  const startTimeInput = document.getElementById('start_time');
  const endTimeInput = document.getElementById('end_time');
  const participantsInput = document.getElementById('participant_count');
  const facilitySelect = document.getElementById('facility_id');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  bookingForm.addEventListener('submit', (e) => {
    let isValid = true;
    const errors = [];

    // Facility validation
    if (!facilitySelect || !facilitySelect.value) {
      if (facilitySelect) markInvalid(facilitySelect, 'Please select or drag a facility.');
      errors.push('Facility selection is required.');
      isValid = false;
    } else {
      markValid(facilitySelect);
    }

    // Booking Date validation
    if (!dateInput || !dateInput.value) {
      if (dateInput) markInvalid(dateInput, 'Booking date is required.');
      errors.push('Booking date is required.');
      isValid = false;
    } else {
      const chosenDate = new Date(dateInput.value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (chosenDate < now) {
        markInvalid(dateInput, 'Booking date cannot be in the past.');
        errors.push('Booking date cannot be in the past.');
        isValid = false;
      } else {
        markValid(dateInput);
      }
    }

    // Start & End Time validation
    if (!startTimeInput || !startTimeInput.value) {
      if (startTimeInput) markInvalid(startTimeInput, 'Start time is required.');
      errors.push('Start time is required.');
      isValid = false;
    } else {
      markValid(startTimeInput);
    }

    if (!endTimeInput || !endTimeInput.value) {
      if (endTimeInput) markInvalid(endTimeInput, 'End time is required.');
      errors.push('End time is required.');
      isValid = false;
    } else {
      markValid(endTimeInput);
    }

    if (startTimeInput && startTimeInput.value && endTimeInput && endTimeInput.value) {
      if (startTimeInput.value >= endTimeInput.value) {
        markInvalid(endTimeInput, 'End time must be chronologically after start time.');
        errors.push('End time must be after start time.');
        isValid = false;
      }
    }

    // Participants validation
    if (!participantsInput || !participantsInput.value || parseInt(participantsInput.value, 10) <= 0) {
      if (participantsInput) markInvalid(participantsInput, 'Please specify at least 1 participant.');
      errors.push('Participant count must be at least 1.');
      isValid = false;
    } else {
      markValid(participantsInput);
    }

    // Purpose validation
    const purposeInput = document.getElementById('booking_purpose');
    if (!purposeInput || !purposeInput.value.trim()) {
      if (purposeInput) markInvalid(purposeInput, 'Please provide the purpose of booking.');
      errors.push('Booking purpose is required.');
      isValid = false;
    } else {
      markValid(purposeInput);
    }

    if (!isValid) {
      e.preventDefault();
      showToast(errors[0] || 'Please fix the highlighted errors.', 'error');
    }
  });

  // Real-time error clearing
  bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('is-invalid');
    });
    field.addEventListener('change', () => {
      field.classList.remove('is-invalid');
    });
  });
}

function markInvalid(element, message) {
  element.classList.add('is-invalid');
  element.classList.remove('is-valid');
  let feedback = element.nextElementSibling;
  if (!feedback || !feedback.classList.contains('invalid-feedback')) {
    feedback = element.parentElement.querySelector('.invalid-feedback');
  }
  if (feedback) {
    feedback.textContent = message;
    feedback.style.display = 'block';
  }
}

function markValid(element) {
  element.classList.remove('is-invalid');
  element.classList.add('is-valid');
  let feedback = element.nextElementSibling;
  if (!feedback || !feedback.classList.contains('invalid-feedback')) {
    feedback = element.parentElement.querySelector('.invalid-feedback');
  }
  if (feedback) {
    feedback.style.display = 'none';
  }
}

/* ==========================================================================
   5. Availability Calendar Interactions (Section 2.E)
   ========================================================================== */
function initCalendarInteractions() {
  const calPicker = document.getElementById('calendarDatePicker');
  const facilityFilter = document.getElementById('calendarFacilityFilter');
  const slotCards = document.querySelectorAll('.slot-card.slot-available');

  if (calPicker) {
    calPicker.addEventListener('change', () => {
      // Reload or trigger dynamic query
      const date = calPicker.value;
      const facId = facilityFilter ? facilityFilter.value : '';
      const url = new URL(window.location.href);
      url.searchParams.set('date', date);
      if (facId) url.searchParams.set('facility_id', facId);
      window.location.href = url.toString();
    });
  }

  if (facilityFilter) {
    facilityFilter.addEventListener('change', () => {
      const facId = facilityFilter.value;
      const date = calPicker ? calPicker.value : '';
      const url = new URL(window.location.href);
      if (facId) url.searchParams.set('facility_id', facId);
      if (date) url.searchParams.set('date', date);
      window.location.href = url.toString();
    });
  }

  // Click on available slot to book immediately
  slotCards.forEach(slot => {
    slot.addEventListener('click', () => {
      const startTime = slot.getAttribute('data-start');
      const endTime = slot.getAttribute('data-end');
      const date = calPicker ? calPicker.value : '';
      const facId = facilityFilter ? facilityFilter.value : '';

      if (startTime && endTime) {
        let bookingUrl = `booking.php?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`;
        if (date) bookingUrl += `&booking_date=${encodeURIComponent(date)}`;
        if (facId) bookingUrl += `&facility_id=${encodeURIComponent(facId)}`;
        window.location.href = bookingUrl;
      }
    });
  });

  // Clicking reserved slots warns user
  document.querySelectorAll('.slot-card.slot-booked, .slot-card.slot-pending').forEach(slot => {
    slot.addEventListener('click', () => {
      showToast('This time slot is already reserved or pending approval.', 'error');
    });
  });
}

/* ==========================================================================
   6. Modals (Facility Details & Cancel Confirmation)
   ========================================================================== */
function initModals() {
  // Facility Quick Details Modal
  const detailBtns = document.querySelectorAll('[data-action="view-facility-modal"]');
  const modalOverlay = document.getElementById('facilityDetailModal');

  detailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const facilityId = btn.getAttribute('data-id');
      const facilityName = btn.getAttribute('data-name');
      const facilityLoc = btn.getAttribute('data-location');
      const facilityCap = btn.getAttribute('data-capacity');
      const facilityEquip = btn.getAttribute('data-equipment');
      const facilityDesc = btn.getAttribute('data-desc');
      const facilityHours = btn.getAttribute('data-hours');
      const facilityRules = btn.getAttribute('data-rules');
      const facilityImg = btn.getAttribute('data-image');
      const facilityStatus = btn.getAttribute('data-status');

      // Populate modal elements
      const mTitle = document.getElementById('modalFacilityTitle');
      const mImg = document.getElementById('modalFacilityImg');
      const mLoc = document.getElementById('modalFacilityLoc');
      const mCap = document.getElementById('modalFacilityCap');
      const mHours = document.getElementById('modalFacilityHours');
      const mStatus = document.getElementById('modalFacilityStatus');
      const mDesc = document.getElementById('modalFacilityDesc');
      const mEquip = document.getElementById('modalFacilityEquip');
      const mRules = document.getElementById('modalFacilityRules');
      const mBookBtn = document.getElementById('modalFacilityBookBtn');

      if (mTitle) mTitle.textContent = facilityName;
      if (mImg) {
        mImg.src = facilityImg || 'images/facility-1.jpg';
        mImg.onerror = function() {
          this.onerror = null;
          this.src = (facilityImg || 'images/facility-1.jpg').replace('.jpg', '.svg');
        };
      }
      if (mLoc) mLoc.textContent = facilityLoc;
      if (mCap) mCap.textContent = `${facilityCap} Seats`;
      if (mHours) mHours.textContent = facilityHours || '08:00 AM - 08:00 PM';
      if (mDesc) mDesc.textContent = facilityDesc;
      if (mRules) mRules.textContent = facilityRules || 'Campus reservation protocols apply.';

      if (mStatus) {
        mStatus.textContent = facilityStatus;
        mStatus.className = `facility-status-badge status-${facilityStatus.replace(/\s+/g, '-')}`;
      }

      if (mEquip && facilityEquip) {
        mEquip.innerHTML = facilityEquip.split(',')
          .map(item => `<span class="equip-chip">${item.trim()}</span>`)
          .join(' ');
      }

      if (mBookBtn) {
        mBookBtn.href = `booking.php?facility_id=${facilityId}`;
        if (facilityStatus === 'Under Maintenance') {
          mBookBtn.classList.add('disabled');
          mBookBtn.textContent = 'Under Maintenance';
        } else {
          mBookBtn.classList.remove('disabled');
          mBookBtn.textContent = 'Book This Space';
        }
      }

      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Generic modal close handlers
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Cancel Booking modal confirmation
  const cancelBtns = document.querySelectorAll('[data-action="cancel-booking"]');
  const cancelModal = document.getElementById('cancelBookingModal');
  const cancelInput = document.getElementById('cancelBookingIdInput');
  const cancelText = document.getElementById('cancelBookingIdText');

  cancelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const bookingId = btn.getAttribute('data-booking-id');
      if (cancelInput) cancelInput.value = bookingId;
      if (cancelText) cancelText.textContent = bookingId;
      if (cancelModal) {
        cancelModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

/* ==========================================================================
   7. Toast Notification System
   ========================================================================== */
function initToasts() {
  if (!document.getElementById('toastContainer')) {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  else if (type === 'error') icon = '⚠️';

  toast.innerHTML = `
    <span style="font-size: 1.2rem; font-weight: bold;">${icon}</span>
    <span style="font-size: 0.88rem; font-weight: 600; color: #1e293b;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   8. Dedicated Booking Confirmation Slip Printing
   Prints ONLY the single A4 confirmation slip with selected booking details
   ========================================================================== */
function ensureBookingConfirmationSlip() {
  let slip = document.getElementById('booking-confirmation-slip');
  if (slip) return slip;

  slip = document.createElement('div');
  slip.id = 'booking-confirmation-slip';
  slip.className = 'print-slip-container';
  slip.setAttribute('aria-label', 'Official Booking Confirmation Slip');
  slip.innerHTML = `
    <!-- Institutional Header -->
    <div class="slip-header-wrap">
      <div class="slip-brand-left">
        <div class="slip-crest-icon">
          <svg width="28" height="28" viewBox="0 0 60 60" fill="none">
            <rect width="60" height="60" rx="12" fill="#0f172a"/>
            <path d="M 30 14 L 48 24 L 30 34 L 12 24 Z" fill="#0d9488"/>
            <path d="M 44 27 L 44 40 C 44 44, 16 44, 16 40 L 16 27" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="30" cy="42" r="3" fill="#2dd4bf"/>
          </svg>
        </div>
        <div>
          <h2 class="slip-inst-title">SMART CAMPUS UNIVERSITY</h2>
          <div class="slip-inst-sub">Estate & Campus Facilities Management Division</div>
        </div>
      </div>
      <div class="slip-status-pill slip-status-Confirmed" id="slipStatusBadge">
        <span id="slipStatusText">CONFIRMED</span>
      </div>
    </div>

    <!-- Title Bar -->
    <div class="slip-heading-bar">
      <h1 class="slip-main-title">SMART CAMPUS FACILITY BOOKING</h1>
      <h3 class="slip-sub-title">OFFICIAL BOOKING CONFIRMATION SLIP</h3>
    </div>

    <!-- Neatly Aligned Information Table -->
    <table class="slip-info-table">
      <tbody>
        <tr>
          <th>Booking ID</th>
          <td><span class="slip-booking-id-val" id="slipBookingId">BK-2026-1041</span></td>
          <th>Booking Status</th>
          <td><span id="slipStatusVal" style="font-weight: 800; color: #065f46;">Confirmed</span></td>
        </tr>
        <tr>
          <th>Faculty Name</th>
          <td><span id="slipFacultyName">Dr. Sarah Jenkins</span></td>
          <th>Faculty ID</th>
          <td><span id="slipFacultyId">FAC-1042</span></td>
        </tr>
        <tr>
          <th>Department</th>
          <td><span id="slipDepartment">Computer Science & Engineering</span></td>
          <th>Email Address</th>
          <td><span id="slipEmail">s.jenkins@smartcampus.edu</span></td>
        </tr>
        <tr>
          <th>Facility Name</th>
          <td colspan="3" class="slip-col-wide">
            <span class="slip-facility-highlight" id="slipFacilityName">Seminar Hall A</span>
          </td>
        </tr>
        <tr>
          <th>Facility Location</th>
          <td colspan="3" class="slip-col-wide">
            <span id="slipFacilityLoc">Ramanujan Academic Block, 2nd Floor, Room 204</span>
          </td>
        </tr>
        <tr>
          <th>Booking Date</th>
          <td><span id="slipBookingDate" style="font-weight: 700;">Monday, 16 Nov 2026</span></td>
          <th>Reserved Time Slot</th>
          <td><span id="slipTimeWindow" style="font-weight: 700; color: #0284c7;">10:00 AM - 12:00 PM</span></td>
        </tr>
        <tr>
          <th>Participants</th>
          <td><span id="slipParticipants">140 Attendees</span></td>
          <th>Submission Date</th>
          <td><span id="slipSubmittedDate">15 Nov 2026, 11:15 AM</span></td>
        </tr>
        <tr>
          <th>Purpose of Booking</th>
          <td colspan="3" class="slip-col-wide">
            <span id="slipPurpose" style="font-weight: 600;">Academic Facility Reservation</span>
          </td>
        </tr>
        <tr id="slipEquipmentRow">
          <th>Equipment Requested</th>
          <td colspan="3" class="slip-col-wide">
            <span id="slipEquipment" style="color: #0f766e; font-weight: 600;">Projector, Audio System</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Signatures & Official Seal -->
    <div class="slip-signatures-row">
      <div class="slip-sig-block">
        <div class="slip-sig-line"></div>
        <div class="slip-sig-name">Faculty Member Signature</div>
      </div>
      <div class="slip-seal-stamp">
        <span>SMART CAMPUS</span>
        <span style="font-size: 0.5rem; letter-spacing: 0.5px;">ESTATE OFFICE</span>
        <span style="color: #047857; font-size: 0.52rem;">VERIFIED</span>
      </div>
      <div class="slip-sig-block">
        <div class="slip-sig-line"></div>
        <div class="slip-sig-name">Estate Office Authorized Officer</div>
      </div>
    </div>

    <!-- Footer Notice -->
    <div class="slip-footer-bar">
      <p style="margin: 0 0 3px 0; font-size: 0.85rem; font-weight: 700; color: #0f172a;">
        This is a system-generated booking confirmation.
      </p>
      <p style="margin: 0; font-size: 0.72rem; color: #64748b;">
        Valid across campus blocks with faculty digital authorization &bull; Smart Campus University Portal
      </p>
    </div>
  `;
  document.body.appendChild(slip);
  return slip;
}

function printBookingSlip(b) {
  if (!b) return;

  ensureBookingConfirmationSlip();

  const el = (id) => document.getElementById(id);
  
  // Format details with extensive fallback mappings
  const bookingId = b.booking_id || b.id || 'N/A';
  const status = b.booking_status || b.status || 'Confirmed';
  const facultyName = b.faculty_name || 'Dr. Sarah Jenkins';
  const facultyId = b.faculty_id || 'FAC-1042';
  const department = b.department || 'Computer Science & Engineering';
  const email = b.email || b.faculty_email || 's.jenkins@smartcampus.edu';
  const facilityName = b.facility_name || 'Selected Campus Space';
  const facilityLoc = b.location || (b.building ? `${b.building}, Room ${b.room_number || ''}` : 'Campus Academic Block');
  const bookingDate = b.booking_date || '';
  const timeWindow = (b.start_time && b.end_time) ? `${b.start_time} - ${b.end_time}` : 'Scheduled Session';
  const participants = `${b.participant_count || 1} Attendees`;
  const purpose = b.booking_purpose || b.purpose || 'Academic Facility Reservation';
  const submittedDate = b.created_at || new Date().toLocaleString();
  const equipment = b.equipment_required || b.equipment || '';

  // Populate DOM elements
  if (el('slipBookingId')) el('slipBookingId').textContent = bookingId;
  if (el('slipStatusVal')) el('slipStatusVal').textContent = status;
  if (el('slipStatusText')) el('slipStatusText').textContent = status.toUpperCase();
  
  const statusBadge = el('slipStatusBadge');
  if (statusBadge) {
    statusBadge.className = `slip-status-pill slip-status-${status.replace(/\s+/g, '')}`;
  }

  if (el('slipFacultyName')) el('slipFacultyName').textContent = facultyName;
  if (el('slipFacultyId')) el('slipFacultyId').textContent = facultyId;
  if (el('slipDepartment')) el('slipDepartment').textContent = department;
  if (el('slipEmail')) el('slipEmail').textContent = email;
  if (el('slipFacilityName')) el('slipFacilityName').textContent = facilityName;
  if (el('slipFacilityLoc')) el('slipFacilityLoc').textContent = facilityLoc;
  if (el('slipBookingDate')) el('slipBookingDate').textContent = bookingDate;
  if (el('slipTimeWindow')) el('slipTimeWindow').textContent = timeWindow;
  if (el('slipParticipants')) el('slipParticipants').textContent = participants;
  if (el('slipPurpose')) el('slipPurpose').textContent = purpose;
  if (el('slipSubmittedDate')) el('slipSubmittedDate').textContent = submittedDate;

  const equipRow = el('slipEquipmentRow');
  const equipVal = el('slipEquipment');
  if (equipment && equipment.trim() !== '') {
    if (equipVal) equipVal.textContent = equipment;
    if (equipRow) equipRow.style.display = '';
  } else {
    if (equipRow) equipRow.style.display = 'none';
  }

  // Trigger print dialog
  setTimeout(() => {
    window.print();
  }, 100);
}

// Global modal for viewing booking details with instant Print option
function showBookingDetailsModal(b) {
  let modal = document.getElementById('userBookingDetailsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'userBookingDetailsModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Booking Confirmation Slip</h3>
          <button class="modal-close-btn" onclick="this.closest('.modal-overlay').classList.remove('active'); document.body.style.overflow='';" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body" id="userBookingDetailsBody"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  const body = document.getElementById('userBookingDetailsBody');
  if (!body) return;

  const bookingId = b.booking_id || b.id || 'N/A';
  const status = b.booking_status || b.status || 'Confirmed';
  const facilityName = b.facility_name || 'Campus Facility';
  const location = b.location || (b.building ? `${b.building}, Room ${b.room_number || ''}` : '');
  const date = b.booking_date || '';
  const time = `${b.start_time || ''} - ${b.end_time || ''}`;
  const facultyName = b.faculty_name || 'Dr. Sarah Jenkins';
  const facultyId = b.faculty_id || 'FAC-1042';
  const participants = b.participant_count || 1;
  const purpose = b.booking_purpose || b.purpose || 'Academic Facility Reservation';
  const equipment = b.equipment_required || b.equipment || '';
  const specialReqs = b.special_requirements || '';

  body.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 14px; margin-bottom: 18px;">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Booking Identifier</div>
        <div style="font-size: 1.4rem; font-weight: 800; color: #0284c7; font-family: monospace;">${bookingId}</div>
      </div>
      <div>
        <span class="badge-status badge-${status}">
          <span class="status-dot"></span>
          ${status}
        </span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div>
        <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Facility</div>
        <div style="font-weight: 800; color: #0f172a; font-size: 1.05rem;">${facilityName}</div>
        <div style="font-size: 0.78rem; color: #0d9488;">${location}</div>
      </div>
      <div>
        <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Schedule Window</div>
        <div style="font-weight: 800; color: #0f172a;">${date}</div>
        <div style="font-size: 0.85rem; color: #475569;">${time}</div>
      </div>
      <div>
        <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Requester</div>
        <div style="font-weight: 700; color: #0f172a;">${facultyName}</div>
        <div style="font-size: 0.78rem; color: #64748b;">${facultyId}</div>
      </div>
      <div>
        <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Participants</div>
        <div style="font-weight: 700; color: #0f172a;">👥 ${participants} Attendees</div>
      </div>
    </div>

    <div style="margin-bottom: 16px;">
      <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px;">Purpose of Reservation</div>
      <div style="font-size: 0.92rem; color: #1e293b; background: #fff; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
        ${purpose}
      </div>
    </div>

    ${equipment ? `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px;">Equipment Requested</div>
        <div style="font-size: 0.85rem; color: #0f766e; background: #f0fdfa; padding: 8px 12px; border-radius: 8px; border: 1px solid #ccfbf1;">
          ${equipment}
        </div>
      </div>
    ` : ''}

    ${specialReqs ? `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px;">Special Instructions</div>
        <div style="font-size: 0.85rem; color: #64748b; font-style: italic;">
          "${specialReqs}"
        </div>
      </div>
    ` : ''}

    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button type="button" id="modalPrintSlipBtn" class="btn-submit" style="padding: 8px 18px; cursor: pointer;">🖨️ Print Booking Confirmation</button>
      <button type="button" class="btn-reset modal-close-btn" onclick="document.getElementById('userBookingDetailsModal').classList.remove('active'); document.body.style.overflow='';" style="padding: 8px 20px;">Close</button>
    </div>
  `;

  const printBtn = document.getElementById('modalPrintSlipBtn');
  if (printBtn) {
    printBtn.onclick = () => printBookingSlip(b);
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

