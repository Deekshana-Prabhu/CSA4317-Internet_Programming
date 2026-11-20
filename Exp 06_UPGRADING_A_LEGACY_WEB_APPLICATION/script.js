/**
 * RegisterHub – Modern Commercial Registration Portal
 * Vanilla ES6+ JavaScript – Application Logic & State Management
 * Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Toast Notification Utility
  // =========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, duration);
  }

  // =========================================================================
  // 2. Mobile Sidebar & Navigation Active Highlighting (ScrollSpy)
  // =========================================================================
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const appSidebar = document.getElementById('appSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const contentSections = document.querySelectorAll('.content-section');

  function setSidebarOpen(open) {
    if (!appSidebar || !sidebarOverlay) return;
    if (open) {
      appSidebar.classList.add('sidebar-open');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      appSidebar.classList.remove('sidebar-open');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isOpen = appSidebar.classList.contains('sidebar-open');
      setSidebarOpen(!isOpen);
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => setSidebarOpen(false));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      }
    });
  });

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
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  contentSections.forEach(section => sectionObserver.observe(section));

  // =========================================================================
  // 3. Form Field Elements & Interactive State Helpers
  // =========================================================================
  const studentRegistrationForm = document.getElementById('studentRegistrationForm');
  const regFullName = document.getElementById('regFullName');
  const regEmail = document.getElementById('regEmail');
  const regPhone = document.getElementById('regPhone');
  const regPassword = document.getElementById('regPassword');
  const btnToggleRegPassword = document.getElementById('btnToggleRegPassword');
  const passwordMeterWrap = document.getElementById('passwordMeterWrap');
  const passwordMeterLabel = document.getElementById('passwordMeterLabel');
  const regDob = document.getElementById('regDob');
  const regAge = document.getElementById('regAge');
  const regWebsite = document.getElementById('regWebsite');
  const regColor = document.getElementById('regColor');
  const regColorVal = document.getElementById('regColorVal');
  const regRating = document.getElementById('regRating');
  const ratingNumber = document.getElementById('ratingNumber');
  const ratingText = document.getElementById('ratingText');
  const regMessage = document.getElementById('regMessage');
  const charCounter = document.getElementById('charCounter');
  const formProgressBarFill = document.getElementById('formProgressBarFill');
  const formProgressPercent = document.getElementById('formProgressPercent');
  const btnResetForm = document.getElementById('btnResetForm');
  const formSuccessReceipt = document.getElementById('formSuccessReceipt');
  const receiptSummaryContent = document.getElementById('receiptSummaryContent');
  const btnRegisterAnother = document.getElementById('btnRegisterAnother');

  // Rating descriptions
  const ratingDescriptions = {
    1: 'Poor', 2: 'Fair', 3: 'Acceptable', 4: 'Satisfactory', 5: 'Average',
    6: 'Good', 7: 'Very Good', 8: 'Great', 9: 'Excellent', 10: 'Outstanding'
  };

  if (regRating) {
    regRating.addEventListener('input', () => {
      const val = regRating.value;
      if (ratingNumber) ratingNumber.textContent = val;
      if (ratingText) ratingText.textContent = ratingDescriptions[val] || 'Good';
    });
  }

  if (regColor && regColorVal) {
    regColor.addEventListener('input', () => {
      regColorVal.textContent = regColor.value;
    });
  }

  if (btnToggleRegPassword && regPassword) {
    btnToggleRegPassword.addEventListener('click', () => {
      const isPwd = regPassword.type === 'password';
      regPassword.type = isPwd ? 'text' : 'password';
      btnToggleRegPassword.textContent = isPwd ? '🙈' : '👁️';
    });
  }

  if (regMessage && charCounter) {
    regMessage.addEventListener('input', () => {
      charCounter.textContent = `${regMessage.value.length} / 500`;
    });
  }

  // --- Password Strength Meter ---
  function updatePasswordStrength(val) {
    if (!passwordMeterWrap || !passwordMeterLabel) return;
    passwordMeterWrap.className = 'password-meter-wrap';

    if (!val || val.length === 0) {
      passwordMeterLabel.textContent = 'Strength: Empty';
      return;
    }

    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val) || val.length >= 12) score++;

    if (score <= 2) {
      passwordMeterWrap.classList.add('meter-weak');
      passwordMeterLabel.textContent = 'Strength: Weak (Needs 8+ chars, uppercase & digit)';
    } else if (score <= 4) {
      passwordMeterWrap.classList.add('meter-medium');
      passwordMeterLabel.textContent = 'Strength: Medium (Good password)';
    } else {
      passwordMeterWrap.classList.add('meter-strong');
      passwordMeterLabel.textContent = 'Strength: Strong (Excellent security)';
    }
  }

  if (regPassword) {
    regPassword.addEventListener('input', () => {
      updatePasswordStrength(regPassword.value);
      updateFormProgress();
    });
  }

  // --- Real-Time Form Completion Progress Indicator ---
  function updateFormProgress() {
    if (!formProgressBarFill || !formProgressPercent) return;

    const requiredFields = [
      () => regFullName && regFullName.value.trim().length >= 3,
      () => regEmail && regEmail.checkValidity() && regEmail.value.trim() !== '',
      () => regPhone && regPhone.checkValidity() && regPhone.value.trim() !== '',
      () => regPassword && regPassword.checkValidity() && regPassword.value.trim() !== '',
      () => regDob && regDob.value !== '',
      () => regAge && regAge.checkValidity() && regAge.value !== '',
      () => {
        if (!studentRegistrationForm) return false;
        const radios = studentRegistrationForm.elements['gender'];
        if (!radios) return false;
        for (let r of radios) {
          if (r.checked) return true;
        }
        return false;
      }
    ];

    let completed = 0;
    requiredFields.forEach(fn => {
      if (fn()) completed++;
    });

    const percent = Math.round((completed / requiredFields.length) * 100);
    formProgressBarFill.style.width = `${percent}%`;
    formProgressPercent.textContent = `${percent}%`;
  }

  // --- Real-Time Validation Handlers ---
  const formValidationFields = [
    { id: 'regFullName', groupId: 'groupFullName' },
    { id: 'regEmail', groupId: 'groupEmail' },
    { id: 'regPhone', groupId: 'groupPhone' },
    { id: 'regPassword', groupId: 'groupPassword' },
    { id: 'regDob', groupId: 'groupDob' },
    { id: 'regAge', groupId: 'groupAge' },
    { id: 'regWebsite', groupId: 'groupWebsite' }
  ];

  formValidationFields.forEach(field => {
    const inputEl = document.getElementById(field.id);
    const groupEl = document.getElementById(field.groupId);
    if (!inputEl || !groupEl) return;

    inputEl.addEventListener('blur', () => {
      validateField(inputEl, groupEl);
      updateFormProgress();
    });

    inputEl.addEventListener('input', () => {
      if (groupEl.classList.contains('has-error')) {
        validateField(inputEl, groupEl);
      }
      updateFormProgress();
    });
  });

  function validateField(inputEl, groupEl) {
    if (!inputEl.checkValidity()) {
      groupEl.classList.add('has-error');
      inputEl.classList.add('is-invalid');
      inputEl.classList.remove('is-valid');
      return false;
    } else {
      groupEl.classList.remove('has-error');
      inputEl.classList.remove('is-invalid');
      if (inputEl.value.trim() !== '') {
        inputEl.classList.add('is-valid');
      } else {
        inputEl.classList.remove('is-valid');
      }
      return true;
    }
  }

  const genderRadios = studentRegistrationForm ? studentRegistrationForm.elements['gender'] : null;
  if (genderRadios) {
    for (let r of genderRadios) {
      r.addEventListener('change', () => {
        const groupGender = document.getElementById('groupGender');
        if (groupGender) groupGender.classList.remove('has-error');
        updateFormProgress();
      });
    }
  }

  // =========================================================================
  // 4. Form Submission & Persistent Directory Storage
  // =========================================================================
  const USERS_STORAGE_KEY = 'registerhub_member_directory';

  function getStoredUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStoredUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  if (studentRegistrationForm) {
    studentRegistrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      let firstInvalidElement = null;

      formValidationFields.forEach(field => {
        const inputEl = document.getElementById(field.id);
        const groupEl = document.getElementById(field.groupId);
        if (inputEl && groupEl) {
          const valid = validateField(inputEl, groupEl);
          if (!valid) {
            isFormValid = false;
            if (!firstInvalidElement) firstInvalidElement = inputEl;
          }
        }
      });

      // Gender Radio Validation
      const groupGender = document.getElementById('groupGender');
      let genderSelected = false;
      let genderValue = '';

      if (genderRadios) {
        for (let r of genderRadios) {
          if (r.checked) {
            genderSelected = true;
            genderValue = r.value;
            break;
          }
        }
      }

      if (!genderSelected) {
        isFormValid = false;
        if (groupGender) groupGender.classList.add('has-error');
        if (!firstInvalidElement && genderRadios && genderRadios[0]) firstInvalidElement = genderRadios[0];
      } else {
        if (groupGender) groupGender.classList.remove('has-error');
      }

      if (!isFormValid) {
        showToast('Please correct highlighted fields before submitting.');
        if (firstInvalidElement) firstInvalidElement.focus();
        return;
      }

      // Collect Form Data
      const newMember = {
        id: 'usr_' + Date.now(),
        fullName: regFullName.value.trim(),
        email: regEmail.value.trim(),
        phone: regPhone.value.trim(),
        dob: regDob.value,
        age: regAge.value,
        gender: genderValue,
        website: regWebsite.value.trim() || 'Not specified',
        favColor: regColor.value,
        rating: regRating.value,
        message: regMessage.value.trim() || 'No additional comments',
        registeredAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Save to localStorage
      const users = getStoredUsers();
      users.unshift(newMember); // Insert at beginning
      saveStoredUsers(users);

      // Render Receipt
      if (receiptSummaryContent) {
        receiptSummaryContent.innerHTML = `
          <div class="receipt-row">
            <span class="receipt-label">Full Name:</span>
            <span class="receipt-value">${escapeHtml(newMember.fullName)}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Email Address:</span>
            <span class="receipt-value">${escapeHtml(newMember.email)}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Phone:</span>
            <span class="receipt-value">${escapeHtml(newMember.phone)}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Date of Birth:</span>
            <span class="receipt-value">${escapeHtml(newMember.dob)} (Age: ${escapeHtml(newMember.age)})</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Gender:</span>
            <span class="receipt-value">${escapeHtml(newMember.gender)}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Portfolio URL:</span>
            <span class="receipt-value">${escapeHtml(newMember.website)}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Profile Accent:</span>
            <span class="receipt-value" style="display:flex; align-items:center; gap:6px;">
              <span class="user-color-indicator" style="background-color: ${newMember.favColor};"></span>
              ${escapeHtml(newMember.favColor)}
            </span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Rating:</span>
            <span class="receipt-value">${escapeHtml(newMember.rating)} / 10 (${ratingDescriptions[newMember.rating] || ''})</span>
          </div>
        `;
      }

      // Hide form, show receipt
      studentRegistrationForm.style.display = 'none';
      if (formSuccessReceipt) formSuccessReceipt.style.display = 'block';

      // Update Directory & Counter
      renderUsersDirectory();
      showToast('Profile registered successfully!');
    });
  }

  // Reset Button Handler
  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      formValidationFields.forEach(field => {
        const inputEl = document.getElementById(field.id);
        const groupEl = document.getElementById(field.groupId);
        if (inputEl) inputEl.classList.remove('is-valid', 'is-invalid');
        if (groupEl) groupEl.classList.remove('has-error');
      });
      const groupGender = document.getElementById('groupGender');
      if (groupGender) groupGender.classList.remove('has-error');

      if (charCounter) charCounter.textContent = '0 / 500';
      if (ratingNumber) ratingNumber.textContent = '9';
      if (ratingText) ratingText.textContent = 'Excellent';
      if (regColorVal) regColorVal.textContent = '#2563eb';
      if (formProgressBarFill) formProgressBarFill.style.width = '0%';
      if (formProgressPercent) formProgressPercent.textContent = '0%';
      updatePasswordStrength('');
      showToast('Form fields cleared.');
    });
  }

  // Register Another Member Button
  if (btnRegisterAnother) {
    btnRegisterAnother.addEventListener('click', () => {
      if (formSuccessReceipt) formSuccessReceipt.style.display = 'none';
      if (studentRegistrationForm) {
        studentRegistrationForm.reset();
        studentRegistrationForm.style.display = 'flex';
      }
      formValidationFields.forEach(field => {
        const inputEl = document.getElementById(field.id);
        const groupEl = document.getElementById(field.groupId);
        if (inputEl) inputEl.classList.remove('is-valid', 'is-invalid');
        if (groupEl) groupEl.classList.remove('has-error');
      });
      if (charCounter) charCounter.textContent = '0 / 500';
      if (formProgressBarFill) formProgressBarFill.style.width = '0%';
      if (formProgressPercent) formProgressPercent.textContent = '0%';
      updatePasswordStrength('');
      showToast('Ready for new member registration.');
    });
  }

  // =========================================================================
  // 5. Registered Users Directory Component
  // =========================================================================
  const usersCardsGrid = document.getElementById('usersCardsGrid');
  const directoryCountBadge = document.getElementById('directoryCountBadge');
  const sidebarUserCount = document.getElementById('sidebarUserCount');
  const directorySearchInput = document.getElementById('directorySearchInput');
  const btnClearAllUsers = document.getElementById('btnClearAllUsers');

  // Initial Sample Data seeding if empty
  function seedInitialUsersIfEmpty() {
    const existing = getStoredUsers();
    if (existing.length === 0) {
      const sampleProfiles = [
        {
          id: 'usr_sample_1',
          fullName: 'Eleanor Vance',
          email: 'eleanor.vance@registerhub.io',
          phone: '9876543210',
          dob: '1998-05-14',
          age: '28',
          gender: 'Female',
          website: 'https://eleanorvance.design',
          favColor: '#7c3aed',
          rating: '10',
          message: 'Excited to explore RegisterHub platform standards.',
          registeredAt: 'Nov 20, 2026, 11:20 AM'
        },
        {
          id: 'usr_sample_2',
          fullName: 'Marcus Sterling',
          email: 'marcus.s@enterprise.com',
          phone: '9123456780',
          dob: '1994-08-22',
          age: '32',
          gender: 'Male',
          website: 'https://msterling.dev',
          favColor: '#2563eb',
          rating: '9',
          message: 'Testing HTML5 constraint validation and local persistence.',
          registeredAt: 'Nov 20, 2026, 10:15 AM'
        }
      ];
      saveStoredUsers(sampleProfiles);
    }
  }

  seedInitialUsersIfEmpty();

  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  function renderUsersDirectory(filterQuery = '') {
    if (!usersCardsGrid) return;
    const users = getStoredUsers();
    const query = filterQuery.toLowerCase().trim();

    const filteredUsers = query
      ? users.filter(u => u.fullName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
      : users;

    // Update Counts
    const totalCountText = `${users.length} ${users.length === 1 ? 'Member' : 'Members'}`;
    if (directoryCountBadge) directoryCountBadge.textContent = totalCountText;
    if (sidebarUserCount) sidebarUserCount.textContent = users.length;

    usersCardsGrid.innerHTML = '';

    if (filteredUsers.length === 0) {
      usersCardsGrid.innerHTML = `
        <div class="empty-users-card">
          <div class="empty-users-icon">👥</div>
          <h4 class="empty-users-title">${query ? 'No matching members found' : 'No registered members yet'}</h4>
          <p class="empty-users-desc">
            ${query ? 'Try searching with a different name or email address.' : 'Complete the registration form above to add your first member to the directory!'}
          </p>
          ${!query ? `<a href="#registration" class="btn btn-primary"><span>Register Member</span></a>` : ''}
        </div>
      `;
      return;
    }

    filteredUsers.forEach(user => {
      const card = document.createElement('div');
      card.className = 'user-card';
      const initials = getInitials(user.fullName);

      card.innerHTML = `
        <div class="user-card-header">
          <div class="user-avatar" style="background: linear-gradient(135deg, ${user.favColor || '#2563eb'} 0%, #7c3aed 100%);">
            ${initials}
          </div>
          <div class="user-main-info">
            <h4 class="user-name" title="${escapeHtml(user.fullName)}">${escapeHtml(user.fullName)}</h4>
            <p class="user-email" title="${escapeHtml(user.email)}">${escapeHtml(user.email)}</p>
          </div>
          <span class="user-badge">${escapeHtml(user.gender)}</span>
        </div>

        <div class="user-card-body">
          <div class="user-detail-row">
            <span>Phone:</span>
            <span>${escapeHtml(user.phone)}</span>
          </div>
          <div class="user-detail-row">
            <span>Age &amp; DOB:</span>
            <span>${escapeHtml(user.age)} yrs (${escapeHtml(user.dob)})</span>
          </div>
          <div class="user-detail-row">
            <span>Website:</span>
            <span>${user.website && user.website.startsWith('http') ? `<a href="${escapeHtml(user.website)}" target="_blank" rel="noopener">Link ↗</a>` : escapeHtml(user.website)}</span>
          </div>
          <div class="user-detail-row">
            <span>Rating:</span>
            <span>${escapeHtml(user.rating)} / 10 (${ratingDescriptions[user.rating] || 'Good'})</span>
          </div>
          <div class="user-detail-row">
            <span>Accent Shade:</span>
            <span><span class="user-color-indicator" style="background-color: ${user.favColor};"></span>${escapeHtml(user.favColor)}</span>
          </div>
        </div>

        <div class="user-card-footer">
          <span class="user-timestamp">${escapeHtml(user.registeredAt)}</span>
          <button type="button" class="btn-delete-user" data-user-id="${user.id}">Delete</button>
        </div>
      `;

      usersCardsGrid.appendChild(card);
    });

    // Attach Delete Listeners
    usersCardsGrid.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const idToDelete = btn.getAttribute('data-user-id');
        const updatedUsers = getStoredUsers().filter(u => u.id !== idToDelete);
        saveStoredUsers(updatedUsers);
        renderUsersDirectory(directorySearchInput ? directorySearchInput.value : '');
        showToast('Member removed from directory.');
      });
    });
  }

  if (directorySearchInput) {
    directorySearchInput.addEventListener('input', () => {
      renderUsersDirectory(directorySearchInput.value);
    });
  }

  if (btnClearAllUsers) {
    btnClearAllUsers.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all registered members from browser memory?')) {
        saveStoredUsers([]);
        renderUsersDirectory();
        showToast('All registered member records cleared.');
      }
    });
  }

  renderUsersDirectory();

  // =========================================================================
  // 6. Back to Top Floating Button
  // =========================================================================
  const btnBackToTop = document.getElementById('btnBackToTop');

  window.addEventListener('scroll', () => {
    if (!btnBackToTop) return;
    if (window.scrollY > 350) {
      btnBackToTop.classList.add('visible');
    } else {
      btnBackToTop.classList.remove('visible');
    }
  });

  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

});
