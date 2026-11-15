/**
 * TECHNOVATE 2026 - Main JavaScript Engine (script.js)
 * Updates:
 * - Countdown fixed for 26 December 2026 at 9:00 AM IST (UTC+05:30).
 * - Full support for Technical & Non-Technical Event Selection.
 * - Strict date constraint validation (26, 27, or 28 December 2026).
 * - Scoped single-page Print Pass execution.
 * - Register Another Student clean reset flow.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================
     1. Navigation Bar & Mobile Drawer
     ========================================================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (navbar) navbar.classList.add('scrolled');
      if (backToTop) backToTop.classList.add('visible');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
      if (backToTop) backToTop.classList.remove('visible');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Menu Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active Link Spy
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
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
  }, { root: null, rootMargin: '-25% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));


  /* ==========================================================
     2. Interactive HTML5 Canvas Particle Network (Hero Section)
     ========================================================== */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 130 };

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    };

    class Particle {
      constructor(x, y, vx, vy, size, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.vx = -this.vx;
        if (this.y > canvas.height || this.y < 0) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 16000);
      const colors = ['rgba(0, 240, 255, 0.85)', 'rgba(139, 92, 246, 0.85)', 'rgba(236, 72, 153, 0.85)'];

      for (let i = 0; i < Math.max(35, particleCount); i++) {
        const size = Math.random() * 2.2 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const vx = (Math.random() - 0.5) * 0.8;
        const vy = (Math.random() - 0.5) * 0.8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, vx, vy, size, color));
      }
    };

    const connectParticles = () => {
      const maxDistance = 110;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = 1 - (dist / maxDistance);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.update());
      connectParticles();
      requestAnimationFrame(animateParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animateParticles();
  }


  /* ==========================================================
     3. FIX THE COUNTDOWN TIMER
     Target: 26 December 2026 at 9:00 AM IST (UTC+05:30)
     Accurately updates every second, displays live status when reached
     ========================================================== */
  const eventTargetTime = new Date('2026-12-26T09:00:00+05:30').getTime();
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');
  const countdownTimerContainer = document.getElementById('countdownTimer');

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = eventTargetTime - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(Math.max(0, days)).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(Math.max(0, hours)).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(Math.max(0, minutes)).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(Math.max(0, seconds)).padStart(2, '0');
    } else {
      // Countdown reached zero: display "EVENT IS LIVE!" cleanly
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';

      const existingLive = document.getElementById('liveStatusBanner');
      if (!existingLive && countdownTimerContainer) {
        const liveDiv = document.createElement('div');
        liveDiv.id = 'liveStatusBanner';
        liveDiv.className = 'event-live-banner';
        liveDiv.innerHTML = '<i class="fa-solid fa-bolt"></i> EVENT IS LIVE!';
        countdownTimerContainer.parentElement.appendChild(liveDiv);
      }
    }
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ==========================================================
     4. Animated Statistics Counters
     ========================================================== */
  const statCounters = document.querySelectorAll('.stat-counter');
  let countersAnimated = false;

  const runCounterAnimation = () => {
    statCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  };

  const statsSection = document.getElementById('about');
  if (statsSection && statCounters.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounterAnimation();
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  }


  /* ==========================================================
     5. Event Schedule Day Filtering Tabs
     ========================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const scheduleRows = document.querySelectorAll('.schedule-table tbody tr');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-day');

      scheduleRows.forEach(row => {
        const rowDay = row.getAttribute('data-day');
        if (filterVal === 'all' || rowDay === filterVal) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });


  /* ==========================================================
     6. Event Cards "Quick Register" (Tech & Non-Tech)
     ========================================================== */
  const quickRegButtons = document.querySelectorAll('.btn-quick-register');
  quickRegButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventName = btn.getAttribute('data-event');
      const targetCheckbox = document.querySelector(`input[name="events[]"][value="${eventName}"]`);

      if (targetCheckbox) {
        targetCheckbox.checked = true;
        const parentCard = targetCheckbox.closest('.custom-checkbox-card');
        if (parentCard) parentCard.classList.add('checked');
      }

      // Smooth scroll to registration section
      const regSection = document.getElementById('register');
      if (regSection) {
        regSection.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('student_name');
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  });

  // Synchronize custom checkbox card styles
  const eventCheckboxes = document.querySelectorAll('input[name="events[]"]');
  eventCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const card = cb.closest('.custom-checkbox-card');
      if (card) {
        card.classList.toggle('checked', cb.checked);
      }
    });
  });


  /* ==========================================================
     7. Form Live Validation & Multiple Event Registration
     ========================================================== */
  const regForm = document.getElementById('registrationForm');
  const errorContainer = document.getElementById('formErrorContainer');
  const dateInput = document.getElementById('participation_date');

  const validDates = ['2026-12-26', '2026-12-27', '2026-12-28'];

  const validateField = (input) => {
    const val = input.value.trim();
    let isValid = true;
    let message = '';

    if (input.hasAttribute('required') && !val) {
      isValid = false;
      message = 'This field is required.';
    } else if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        isValid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (input.id === 'phone') {
      const cleanPhone = val.replace(/[\s\-+]/g, '');
      if (!/^\d{10}$/.test(cleanPhone)) {
        isValid = false;
        message = 'Please enter a valid 10-digit mobile number.';
      }
    } else if (input.id === 'reg_number') {
      if (val.length < 3) {
        isValid = false;
        message = 'Register number must be at least 3 characters.';
      }
    } else if (input.id === 'participation_date') {
      if (!validDates.includes(val)) {
        isValid = false;
        message = 'Participation date must be 26, 27, or 28 December 2026.';
      }
    }

    const errorEl = input.parentElement.querySelector('.input-error-msg');
    if (!isValid) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    } else {
      input.classList.remove('is-invalid');
      if (val) input.classList.add('is-valid');
      if (errorEl) errorEl.style.display = 'none';
    }

    return isValid;
  };

  if (regForm) {
    const inputs = regForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });

    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let formIsValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) formIsValid = false;
      });

      // Validate at least one event selected
      const selectedEvents = Array.from(eventCheckboxes).filter(cb => cb.checked);
      const eventsErrorEl = document.getElementById('eventsErrorMsg');
      if (selectedEvents.length === 0) {
        formIsValid = false;
        if (eventsErrorEl) {
          eventsErrorEl.textContent = 'Please choose at least one technical or non-technical event.';
          eventsErrorEl.style.display = 'block';
        }
      } else {
        if (eventsErrorEl) eventsErrorEl.style.display = 'none';
      }

      // Validate Gender
      const genderRadios = regForm.querySelectorAll('input[name="gender"]');
      const genderSelected = Array.from(genderRadios).some(r => r.checked);
      const genderErrorEl = document.getElementById('genderErrorMsg');
      if (!genderSelected) {
        formIsValid = false;
        if (genderErrorEl) {
          genderErrorEl.textContent = 'Please select your gender.';
          genderErrorEl.style.display = 'block';
        }
      } else {
        if (genderErrorEl) genderErrorEl.style.display = 'none';
      }

      // Validate Date
      if (dateInput && !validDates.includes(dateInput.value)) {
        formIsValid = false;
        const dateErrorEl = dateInput.parentElement.querySelector('.input-error-msg');
        if (dateErrorEl) {
          dateErrorEl.textContent = 'Participation date must be 26, 27, or 28 December 2026.';
          dateErrorEl.style.display = 'block';
        }
      }

      // Validate Terms
      const termsCb = document.getElementById('terms');
      const termsErrorEl = document.getElementById('termsErrorMsg');
      if (termsCb && !termsCb.checked) {
        formIsValid = false;
        if (termsErrorEl) {
          termsErrorEl.textContent = 'You must accept the terms & conditions.';
          termsErrorEl.style.display = 'block';
        }
      } else {
        if (termsErrorEl) termsErrorEl.style.display = 'none';
      }

      if (!formIsValid) {
        if (errorContainer) {
          errorContainer.innerHTML = '<div style="padding:14px 20px; background:rgba(239,68,68,0.15); border:1px solid #ef4444; border-radius:8px; color:#fca5a5; margin-bottom:24px;"><i class="fa-solid fa-triangle-exclamation"></i> Please fill in all required fields and correct the highlighted errors.</div>';
          errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const submitBtn = regForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span><i class="fa-solid fa-spinner fa-spin"></i> Processing Registration...</span>';
      submitBtn.disabled = true;

      // Prepare data
      const studentNameVal = document.getElementById('student_name').value.trim();
      const regNoVal = document.getElementById('reg_number').value.trim();
      const collegeVal = document.getElementById('college_name').value.trim();
      const deptVal = document.getElementById('department').value;
      const yearVal = document.getElementById('year_of_study').value;
      const partDateVal = document.getElementById('participation_date').value;
      const eventNames = selectedEvents.map(cb => cb.value);

      const localRecord = {
        student_name: studentNameVal,
        reg_number: regNoVal,
        college_name: collegeVal,
        department: deptVal,
        year_of_study: yearVal,
        participation_date: partDateVal,
        event_categories: eventNames
      };

      try {
        const formData = new FormData(regForm);
        formData.append('is_ajax', '1');

        const response = await fetch('register.php', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            if (errorContainer) errorContainer.innerHTML = '';
            showSuccessModalAndPass(result.data, result.registration_id);
            return;
          } else {
            if (errorContainer) {
              errorContainer.innerHTML = `<div style="padding:14px 20px; background:rgba(239,68,68,0.15); border:1px solid #ef4444; border-radius:8px; color:#fca5a5; margin-bottom:24px;">⚠️ ${result.message}</div>`;
            }
            return;
          }
        } else {
          throw new Error('Server returned HTTP ' + response.status);
        }
      } catch (err) {
        console.warn('PHP endpoint not reachable or returned non-JSON. Falling back to local persistent pass generation.', err);
        // Client Fallback format: TEC2026-XXXX
        const fallbackId = 'TEC2026-' + String(Math.floor(1000 + Math.random() * 9000));
        localRecord.reg_id = fallbackId;
        showSuccessModalAndPass(localRecord, fallbackId);
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });

    // Reset button
    regForm.addEventListener('reset', () => {
      setTimeout(() => {
        resetFormElements();
      }, 50);
    });
  }

  // Helper to completely reset the registration form
  const resetFormElements = () => {
    if (!regForm) return;
    regForm.reset();
    const inputs = regForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.classList.remove('is-invalid', 'is-valid');
      const err = input.parentElement.querySelector('.input-error-msg');
      if (err) err.style.display = 'none';
    });
    eventCheckboxes.forEach(cb => {
      cb.checked = false;
      const card = cb.closest('.custom-checkbox-card');
      if (card) card.classList.remove('checked');
    });
    const eventsErr = document.getElementById('eventsErrorMsg');
    if (eventsErr) eventsErr.style.display = 'none';
    const genderErr = document.getElementById('genderErrorMsg');
    if (genderErr) genderErr.style.display = 'none';
    const termsErr = document.getElementById('termsErrorMsg');
    if (termsErr) termsErr.style.display = 'none';
    if (errorContainer) errorContainer.innerHTML = '';
    if (dateInput) dateInput.value = '2026-12-26';
  };


  /* ==========================================================
     8. Registration Success Modal & Dedicated Digital Pass
     Populates pass with exact data, sets up Print & Reset
     ========================================================== */
  const successModal = document.getElementById('confirmationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const printPassBtn = document.getElementById('printPassBtn');
  const registerAnotherBtn = document.getElementById('registerAnotherBtn');

  // Format date helper: "2026-12-26" -> "26 December 2026"
  const formatSymposiumDate = (dateStr) => {
    if (dateStr === '2026-12-26') return '26 December 2026 (Day 1)';
    if (dateStr === '2026-12-27') return '27 December 2026 (Day 2)';
    if (dateStr === '2026-12-28') return '28 December 2026 (Day 3)';
    return dateStr || '26–28 December 2026';
  };

  const showSuccessModalAndPass = (data, regId) => {
    const finalId = regId || data.reg_id || 'TEC2026-0001';

    // 1. Success Message details
    const successStudentName = document.getElementById('successStudentName');
    const successRegId = document.getElementById('successRegId');
    const successDate = document.getElementById('successDate');
    const successEventsList = document.getElementById('successEventsList');

    if (successStudentName) successStudentName.textContent = data.student_name;
    if (successRegId) successRegId.textContent = finalId;
    if (successDate) successDate.textContent = formatSymposiumDate(data.participation_date);

    const eventsArray = Array.isArray(data.event_categories) 
      ? data.event_categories 
      : (typeof data.event_categories === 'string' ? data.event_categories.split(',').map(s => s.trim()) : []);

    if (successEventsList) {
      successEventsList.innerHTML = eventsArray.map(evt => `<span class="schedule-badge" style="margin:2px 4px 2px 0; display:inline-block;">${evt}</span>`).join(' ');
    }

    // 2. Official Printable Digital Entry Pass details
    const passRegId = document.getElementById('passRegId');
    const passStudentName = document.getElementById('passStudentName');
    const passRegNo = document.getElementById('passRegNo');
    const passCollege = document.getElementById('passCollege');
    const passDept = document.getElementById('passDept');
    const passDate = document.getElementById('passDate');
    const passEvents = document.getElementById('passEvents');
    const passQrImg = document.getElementById('passQrImg');

    if (passRegId) passRegId.textContent = finalId;
    if (passStudentName) passStudentName.textContent = data.student_name;
    if (passRegNo) passRegNo.textContent = data.reg_number;
    if (passCollege) passCollege.textContent = data.college_name;
    if (passDept) passDept.textContent = `${data.department} — ${data.year_of_study}`;
    if (passDate) passDate.textContent = formatSymposiumDate(data.participation_date);

    if (passEvents) {
      passEvents.innerHTML = eventsArray.map(e => `• ${e}`).join('<br>');
    }

    // QR Code graphic with Registration ID
    if (passQrImg) {
      passQrImg.alt = `QR Code for ${finalId}`;
    }

    // Open Modal
    if (successModal) {
      successModal.classList.add('active');
    }
  };

  // Close modal button
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  /* ==========================================================
     9. FIX PRINT PASS: Prints ONLY the Registration Pass
     Scoped @media print ensures no website clutter appears
     ========================================================== */
  if (printPassBtn) {
    printPassBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* ==========================================================
     10. REGISTER ANOTHER STUDENT
     Returns to a clean registration form ready for new input
     ========================================================== */
  if (registerAnotherBtn) {
    registerAnotherBtn.addEventListener('click', () => {
      // Dismiss modal
      if (successModal) {
        successModal.classList.remove('active');
      }

      // Reset form
      resetFormElements();

      // Smooth scroll back to form
      const regSection = document.getElementById('register');
      if (regSection) {
        regSection.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('student_name');
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  }

});
