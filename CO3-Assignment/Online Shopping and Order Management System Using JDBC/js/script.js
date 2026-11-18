/**
 * SHOPZONE E-Commerce System - Interactive UI Scripts
 * Handles mobile sidebar drawer, client-side validation, live cart stepper,
 * payment selection, and dynamic UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initPaymentOptionCards();
  initFormValidations();
  initAlertAutoDismiss();
});

/**
 * Mobile Sidebar Drawer Handling
 */
function initSidebar() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.app-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!toggleBtn || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener('click', closeSidebar);

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}

/**
 * Payment method selection cards visual styling
 */
function initPaymentOptionCards() {
  const paymentCards = document.querySelectorAll('.payment-option-card');
  if (!paymentCards || paymentCards.length === 0) return;

  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        paymentCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      }
    });
  });
}

/**
 * Client-Side Form Validations (Registration, Checkout, etc.)
 */
function initFormValidations() {
  // 1. Registration Form Validation
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      const name = registerForm.querySelector('[name="customerName"]')?.value.trim();
      const email = registerForm.querySelector('[name="email"]')?.value.trim();
      const mobile = registerForm.querySelector('[name="mobile"]')?.value.trim();
      const password = registerForm.querySelector('[name="password"]')?.value;
      const confirmPassword = registerForm.querySelector('[name="confirmPassword"]')?.value;
      const address = registerForm.querySelector('[name="address"]')?.value.trim();

      if (!name || !email || !mobile || !password || !confirmPassword || !address) {
        alert('All fields are required. Please fill in all fields.');
        e.preventDefault();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address (e.g. name@example.com).');
        e.preventDefault();
        return;
      }

      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number.');
        e.preventDefault();
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        e.preventDefault();
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match. Please ensure both passwords match.');
        e.preventDefault();
        return;
      }
    });
  }

  // 2. Checkout Form Validation
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      const mobile = checkoutForm.querySelector('[name="mobile"]')?.value.trim();
      const address = checkoutForm.querySelector('[name="deliveryAddress"]')?.value.trim();
      const payment = checkoutForm.querySelector('input[name="paymentMethod"]:checked');

      if (!mobile || !address) {
        alert('Please provide your complete delivery address and mobile number.');
        e.preventDefault();
        return;
      }

      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobile)) {
        alert('Please provide a valid 10-digit mobile number.');
        e.preventDefault();
        return;
      }

      if (!payment) {
        alert('Please select a payment method.');
        e.preventDefault();
        return;
      }
    });
  }
}

/**
 * Auto-dismiss alerts after 6 seconds (optional subtle fade)
 */
function initAlertAutoDismiss() {
  const alerts = document.querySelectorAll('.alert');
  if (!alerts || alerts.length === 0) return;

  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-10px)';
      setTimeout(() => alert.remove(), 500);
    }, 6000);
  });
}

/**
 * Helper to adjust cart item quantity via buttons
 */
function changeCartQuantity(productId, delta, maxStock) {
  const input = document.getElementById('qty_' + productId);
  if (!input) return;

  let currentVal = parseInt(input.value) || 1;
  let newVal = currentVal + delta;

  if (newVal < 1) newVal = 1;
  if (maxStock && newVal > maxStock) {
    alert('Maximum available stock for this item is ' + maxStock);
    newVal = maxStock;
  }

  input.value = newVal;
  // Submit enclosing update form
  const form = document.getElementById('form_' + productId);
  if (form) {
    form.submit();
  }
}
