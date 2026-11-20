/**
 * SWEET CRUMB – Artisan Bakery
 * Master JavaScript (script.js)
 * Vanilla JS providing mobile navigation, product filtering, and contact form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Navigation Bar & Mobile Drawer Toggle
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const siteHeader = document.querySelector('.site-header');

  if (navToggle && navMenu) {
    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking any nav link
    const navLinks = navMenu.querySelectorAll('.nav-link, .nav-cta');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(e.target) && 
          !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header background shadow on scroll
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ==========================================================================
     2. Highlight Active Navigation Link (Dynamic Fallback)
     ========================================================================== */
  const currentPath = window.location.pathname.toLowerCase();
  const navItems = document.querySelectorAll('.nav-link');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href) {
      const cleanHref = href.toLowerCase();
      // Match file name or root index
      if ((currentPath.endsWith(cleanHref) && cleanHref !== '') || 
          (cleanHref === 'index.html' && (currentPath === '' || currentPath.endsWith('/')))) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      }
    }
  });

  /* ==========================================================================
     3. Product Filter Tabs (Homepage)
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        // Filter cards
        productCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     4. Contact Form Validation & Submission (Contact Page)
     ========================================================================== */
  const contactForm = document.getElementById('bakeryContactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    const fields = {
      fullName: {
        el: document.getElementById('fullName'),
        errorEl: document.getElementById('fullNameError'),
        validate: (val) => {
          if (!val.trim()) return 'Full name is required.';
          if (val.trim().length < 2) return 'Full name must be at least 2 characters.';
          if (!/^[a-zA-Z\s.'-]+$/.test(val.trim())) return 'Please enter a valid name (letters only).';
          return null;
        }
      },
      email: {
        el: document.getElementById('emailAddress'),
        errorEl: document.getElementById('emailError'),
        validate: (val) => {
          if (!val.trim()) return 'Email address is required.';
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!emailPattern.test(val.trim())) return 'Please enter a valid email address (e.g. name@example.com).';
          return null;
        }
      },
      phone: {
        el: document.getElementById('phoneNumber'),
        errorEl: document.getElementById('phoneError'),
        validate: (val) => {
          if (!val.trim()) return 'Phone number is required.';
          // Allow formats like: +1 (555) 234-5678, 555-234-5678, 5552345678
          const cleanPhone = val.replace(/[\s\-().+]/g, '');
          if (cleanPhone.length < 7 || cleanPhone.length > 15 || !/^\d+$/.test(cleanPhone)) {
            return 'Please enter a valid phone number (at least 7 digits).';
          }
          return null;
        }
      },
      subject: {
        el: document.getElementById('subject'),
        errorEl: document.getElementById('subjectError'),
        validate: (val) => {
          if (!val || !val.trim()) return 'Please select or enter an inquiry subject.';
          return null;
        }
      },
      message: {
        el: document.getElementById('message'),
        errorEl: document.getElementById('messageError'),
        validate: (val) => {
          if (!val.trim()) return 'Message cannot be empty.';
          if (val.trim().length < 10) return 'Message must be at least 10 characters long.';
          return null;
        }
      }
    };

    // Helper: validate single field
    const validateField = (key) => {
      const field = fields[key];
      if (!field || !field.el) return true;

      const errorMessage = field.validate(field.el.value);
      if (errorMessage) {
        field.el.classList.add('input-error');
        if (field.errorEl) {
          field.errorEl.textContent = errorMessage;
          field.errorEl.classList.add('visible');
        }
        return false;
      } else {
        field.el.classList.remove('input-error');
        if (field.errorEl) {
          field.errorEl.textContent = '';
          field.errorEl.classList.remove('visible');
        }
        return true;
      }
    };

    // Attach real-time validation listeners on input and blur
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field && field.el) {
        field.el.addEventListener('input', () => {
          // If field currently has error, re-validate to clear as user types
          if (field.el.classList.contains('input-error')) {
            validateField(key);
          }
        });

        field.el.addEventListener('blur', () => {
          validateField(key);
        });
      }
    });

    // Form Submit Handler
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      let firstInvalidInput = null;

      // Validate all fields
      Object.keys(fields).forEach(key => {
        const valid = validateField(key);
        if (!valid) {
          isFormValid = false;
          if (!firstInvalidInput && fields[key].el) {
            firstInvalidInput = fields[key].el;
          }
        }
      });

      if (!isFormValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // Valid form submission handling
      const nameVal = fields.fullName.el.value.trim();
      const emailVal = fields.email.el.value.trim();
      const subjectVal = fields.subject.el.value.trim();

      // Display dynamic success alert banner
      if (formSuccessAlert) {
        const successTitle = formSuccessAlert.querySelector('.alert-title');
        const successMessage = formSuccessAlert.querySelector('.alert-message');

        if (successTitle) {
          successTitle.textContent = `Thank You, ${nameVal}! Message Sent Successfully.`;
        }
        if (successMessage) {
          successMessage.textContent = `We received your inquiry regarding "${subjectVal}". Our head baker will get back to you at ${emailVal} within 24 hours.`;
        }

        formSuccessAlert.classList.add('visible');
        formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form fields
      contactForm.reset();

      // Remove any lingering error classes
      Object.keys(fields).forEach(key => {
        if (fields[key].el) fields[key].el.classList.remove('input-error');
        if (fields[key].errorEl) fields[key].errorEl.classList.remove('visible');
      });
    });
  }

  /* ==========================================================================
     5. Smooth Scroll for Anchor Links (e.g. #menu)
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
