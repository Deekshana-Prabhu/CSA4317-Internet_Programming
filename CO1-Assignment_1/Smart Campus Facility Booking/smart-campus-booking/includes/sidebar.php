<?php
/**
 * Smart Campus Facility Booking System
 * Include: includes/sidebar.php
 * Demonstrates: HTML5 Semantic <aside> and <nav> elements, Faculty Profile Section
 */
$currentPage = basename($_SERVER['PHP_SELF']);
$currentTab = $_GET['tab'] ?? '';
?>
<!-- Semantic Aside Sidebar Navigation -->
<aside class="sidebar" id="mainSidebar" aria-label="Campus Facility Navigation">
  <div class="sidebar-header">
    <a href="index.php" class="sidebar-brand">
      <div class="brand-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <div class="brand-text">
        <h2>SMART<span>CAMPUS</span></h2>
        <p>FACILITY PORTAL</p>
      </div>
    </a>
  </div>

  <!-- Navigation Menu -->
  <nav class="nav-menu" aria-label="Main Navigation">
    <div class="nav-section-title">Main Management</div>

    <!-- 1. Dashboard -->
    <li class="nav-item">
      <a href="index.php" class="nav-link <?= in_array($currentPage, ['index.php', 'dashboard.php']) ? 'active' : '' ?>">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </span>
        <span>Dashboard</span>
      </a>
    </li>

    <!-- 2. Explore Facilities -->
    <li class="nav-item">
      <a href="facilities.php" class="nav-link <?= in_array($currentPage, ['facilities.php', 'facility-details.php']) ? 'active' : '' ?>">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
            <path d="M9 18h6"></path>
            <path d="M10 7h4"></path>
            <path d="M10 11h4"></path>
          </svg>
        </span>
        <span>Explore Facilities</span>
        <span class="nav-badge">12</span>
      </a>
    </li>

    <!-- 3. Room Availability -->
    <li class="nav-item">
      <a href="availability.php" class="nav-link <?= ($currentPage === 'availability.php') ? 'active' : '' ?>">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </span>
        <span>Room Availability</span>
      </a>
    </li>

    <div class="nav-section-title">Reservations</div>

    <!-- 4. Book a Facility -->
    <li class="nav-item">
      <a href="booking.php" class="nav-link <?= ($currentPage === 'booking.php') ? 'active' : '' ?>">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </span>
        <span>Book a Facility</span>
      </a>
    </li>

    <!-- 5. My Bookings -->
    <li class="nav-item">
      <a href="my-bookings.php" class="nav-link <?= ($currentPage === 'my-bookings.php' && $currentTab !== 'history') ? 'active' : '' ?>">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </span>
        <span>My Bookings</span>
      </a>
    </li>

    <!-- 6. Booking History -->
    <li class="nav-item">
      <a href="my-bookings.php?tab=history" class="nav-link <?= ($currentPage === 'my-bookings.php' && $currentTab === 'history') ? 'active' : '' ?>">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </span>
        <span>Booking History</span>
      </a>
    </li>

    <div class="nav-section-title">Support & Campus</div>

    <!-- 7. Contact / Help -->
    <li class="nav-item">
      <a href="contact.php" class="nav-link <?= ($currentPage === 'contact.php') ? 'active' : '' ?>">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </span>
        <span>Contact / Help</span>
      </a>
    </li>
  </nav>

  <!-- Faculty Member Profile Section (Section 2.B) -->
  <div class="sidebar-profile">
    <div class="profile-avatar-wrap">
      <img src="images/avatar-faculty.svg" alt="Faculty Profile" class="profile-avatar">
      <span class="online-dot" title="Authenticated Faculty Active"></span>
    </div>
    <div class="profile-info">
      <div class="profile-name"><?= htmlspecialchars($_SESSION['faculty_name'] ?? 'Dr. Sarah Jenkins') ?></div>
      <div class="profile-dept"><?= htmlspecialchars($_SESSION['faculty_dept'] ?? 'Computer Science & Eng.') ?></div>
      <div style="font-size: 0.68rem; color: var(--teal-400); font-weight: 700; margin-top: 2px;">
        ID: <?= htmlspecialchars($_SESSION['faculty_id'] ?? 'FAC-1042') ?>
      </div>
    </div>
  </div>
</aside>
