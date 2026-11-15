<?php
/**
 * Smart Campus Facility Booking System
 * Include: includes/header.php
 * Demonstrates: HTML5 Semantic Header, External CSS, and Internal CSS using <style>
 */
if (!isset($pageTitle)) {
    $pageTitle = 'Smart Campus - Facility Booking System';
}
if (!isset($activePage)) {
    $activePage = 'dashboard';
}

$facultyName = $_SESSION['faculty_name'] ?? 'Dr. Sarah Jenkins';
$facultyDept = $_SESSION['faculty_dept'] ?? 'Computer Science & Engineering';
$facultyId = $_SESSION['faculty_id'] ?? 'FAC-1042';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Smart Campus Facility Booking System - Premium university room reservation, lab scheduling, and auditorium management.">
  <title><?= htmlspecialchars($pageTitle) ?></title>

  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- External Stylesheet (Demonstrating CSS3 Requirement: External CSS) -->
  <link rel="stylesheet" href="css/style.css">

  <!-- Internal CSS using <style> element (Demonstrating CSS3 Requirement: Internal CSS) -->
  <style>
    /* Internal CSS Rules: Page transition, dynamic theme accents, and custom micro-animations */
    @keyframes headerPulseGlow {
      0% {
        box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4);
      }
      70% {
        box-shadow: 0 0 0 8px rgba(20, 184, 166, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(20, 184, 166, 0);
      }
    }

    @keyframes liveShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .internal-css-active-badge {
      animation: headerPulseGlow 2.5s infinite;
    }

    .shimmer-text {
      background: linear-gradient(90deg, #0f172a 0%, #0d9488 50%, #0f172a 100%);
      background-size: 200% auto;
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      animation: liveShimmer 4s linear infinite;
    }

    /* Internal CSS helper for smooth entrance */
    .fade-enter-active {
      animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  </style>
</head>
<body>
  <!-- Mobile Sidebar Backdrop -->
  <div class="sidebar-backdrop" id="sidebarBackdrop" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); z-index: 95; display: none; backdrop-filter: blur(4px);"></div>

  <div class="app-container">
    <?php include __DIR__ . '/sidebar.php'; ?>

    <div class="main-wrapper">
      <!-- Semantic Top Navigation Bar (Header) -->
      <header class="top-navbar">
        <div class="top-nav-left">
          <button class="mobile-toggle" id="mobileToggleBtn" aria-label="Toggle Navigation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <!-- Top Search Bar -->
          <div class="search-box">
            <span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input type="text" id="topNavSearch" placeholder="Search facilities, halls, labs..." onkeydown="if(event.key==='Enter') window.location.href='facilities.php?search='+encodeURIComponent(this.value)">
          </div>
        </div>

        <div class="top-nav-right">
          <!-- Live Date Badge -->
          <div class="date-indicator">
            <span class="dot"></span>
            <span><?= date('l, d M Y') ?></span>
          </div>

          <!-- Notification Bell -->
          <button class="icon-btn" title="Pending Notifications" onclick="window.location.href='my-bookings.php?tab=pending'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="icon-badge">3</span>
          </button>

          <!-- Quick Book CTA -->
          <a href="booking.php" class="btn-quick-book internal-css-active-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Book Space</span>
          </a>
        </div>
      </header>

      <!-- Main Content Container begins -->
      <main class="main-content fade-enter-active">
