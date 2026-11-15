<?php
/**
 * Smart Campus Facility Booking System
 * Page: dashboard.php
 * Demonstrates: Section 2.A Dashboard Layout, Summary Cards, Quick Booking, Recently Requested Facilities
 */

require_once __DIR__ . '/config/database.php';

$pageTitle = 'Dashboard - Smart Campus Facility Booking';
$activePage = 'dashboard';

// Fetch dynamic statistics from database (or fallback repository)
$stats = getDashboardStats();

// Fetch recently requested bookings (latest 5)
$recentBookings = getBookings(null, null, 5);

// Fetch top featured facilities for quick preview
$featuredFacilities = array_slice(getAllFacilities(), 0, 4);

include __DIR__ . '/includes/header.php';
?>

<!-- Internal CSS for Dashboard Hero & Stat Micro-Animations -->
<style>
  .hero-glass-card {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 50%, rgba(13, 148, 136, 0.85) 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .trend-indicator {
    font-size: 0.74rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
  }
</style>

<!-- =========================================================================
     1. Hero Welcome Banner (Section 2.A)
     ========================================================================= -->
<section class="welcome-hero hero-glass-card" aria-label="Campus Welcome Banner">
  <div class="welcome-content">
    <div class="welcome-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>Faculty Reservation Portal</span>
    </div>
    <!-- Explicitly required text from prompt -->
    <h1 class="welcome-title">Welcome to Smart Campus</h1>
    <p class="welcome-subtitle">Manage and reserve your campus spaces effortlessly.</p>

    <div class="welcome-actions">
      <!-- Quick Booking Button -->
      <a href="booking.php" class="btn-hero-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Quick Booking</span>
      </a>

      <a href="facilities.php" class="btn-hero-secondary">
        <span>Explore All Facilities &rarr;</span>
      </a>

      <a href="availability.php" class="btn-hero-secondary" style="background: rgba(2, 132, 199, 0.2); border-color: rgba(56, 189, 248, 0.3);">
        <span>Check Live Schedule</span>
      </a>
    </div>
  </div>

  <div style="position: relative; z-index: 2; display: none;" class="d-lg-block">
    <div style="background: rgba(255,255,255,0.06); padding: 20px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); width: 220px; text-align: center;">
      <div style="font-size: 0.76rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Smart Allocation</div>
      <div style="font-size: 1.7rem; font-weight: 800; color: #2dd4bf; margin: 4px 0;">Drag & Drop</div>
      <div style="font-size: 0.8rem; color: #cbd5e1; margin-bottom: 12px;">Visual room assignment on booking form</div>
      <a href="booking.php#allocation-dock" style="font-size: 0.82rem; font-weight: 700; color: #38bdf8; text-decoration: underline;">Try Room Allocation &rarr;</a>
    </div>
  </div>
</section>

<!-- =========================================================================
     2. Summary Cards (Section 2.A)
     Total Facilities: 12 | Available: 8 | Currently Booked: 4 | Pending: 3
     ========================================================================= -->
<section class="summary-cards-grid" aria-label="Campus Summary Metrics">
  
  <!-- Metric 1: Total Facilities -->
  <article class="stat-card card-total">
    <div class="stat-icon-wrapper">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 21h18"></path>
        <path d="M5 21V7l8-4v18"></path>
        <path d="M19 21V11l-6-3"></path>
        <path d="M9 9h1"></path>
        <path d="M9 13h1"></path>
        <path d="M9 17h1"></path>
      </svg>
    </div>
    <div class="stat-info">
      <div class="stat-label">Total Facilities</div>
      <div class="stat-value">
        <span><?= htmlspecialchars($stats['total_facilities']) ?></span>
        <span class="stat-pill info">Campus Wide</span>
      </div>
      <div class="trend-indicator" style="color: var(--blue-600);">
        <span>Across 5 Academic Blocks</span>
      </div>
    </div>
  </article>

  <!-- Metric 2: Available Facilities -->
  <article class="stat-card card-available">
    <div class="stat-icon-wrapper">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
    <div class="stat-info">
      <div class="stat-label">Available Facilities</div>
      <div class="stat-value">
        <span style="color: var(--status-available);"><?= htmlspecialchars($stats['available_facilities']) ?></span>
        <span class="stat-pill success">Ready for Booking</span>
      </div>
      <div class="trend-indicator" style="color: var(--status-available);">
        <span>67% Spaces Free Right Now</span>
      </div>
    </div>
  </article>

  <!-- Metric 3: Currently Booked -->
  <article class="stat-card card-booked">
    <div class="stat-icon-wrapper">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </div>
    <div class="stat-info">
      <div class="stat-label">Currently Booked</div>
      <div class="stat-value">
        <span style="color: var(--status-booked);"><?= htmlspecialchars($stats['currently_booked']) ?></span>
        <span class="stat-pill" style="background: #fee2e2; color: #b91c1c;">Occupied Today</span>
      </div>
      <div class="trend-indicator" style="color: #b91c1c;">
        <span>Active Academic Sessions</span>
      </div>
    </div>
  </article>

  <!-- Metric 4: Pending Requests -->
  <article class="stat-card card-pending">
    <div class="stat-icon-wrapper">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    </div>
    <div class="stat-info">
      <div class="stat-label">Pending Requests</div>
      <div class="stat-value">
        <span style="color: var(--status-pending);"><?= htmlspecialchars($stats['pending_requests']) ?></span>
        <span class="stat-pill warning">Under Review</span>
      </div>
      <div class="trend-indicator" style="color: #b45309;">
        <span>Department Clearance</span>
      </div>
    </div>
  </article>
</section>

<!-- =========================================================================
     3. Recently Requested Facilities (Section 2.A)
     ========================================================================= -->
<section style="margin-bottom: 40px;">
  <div class="section-header">
    <div class="section-title-wrap">
      <h2>Recently Requested Facilities</h2>
      <p>Latest reservation submissions, timetable allocations, and pending requests</p>
    </div>
    <div style="display: flex; gap: 12px;">
      <a href="my-bookings.php" class="btn-card-details" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;">
        <span>View All Bookings</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </a>
    </div>
  </div>

  <div class="table-responsive">
    <table class="smart-table">
      <thead>
        <tr>
          <th>Booking ID</th>
          <th>Facility</th>
          <th>Faculty Member</th>
          <th>Date & Time Slot</th>
          <th>Purpose</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <?php if (!empty($recentBookings)): ?>
          <?php foreach ($recentBookings as $booking): ?>
            <tr>
              <td>
                <span class="table-booking-id"><?= htmlspecialchars($booking['booking_id']) ?></span>
              </td>
              <td>
                <div class="table-facility-cell">
                  <img src="<?= htmlspecialchars($booking['image_url'] ?? 'images/facility-1.jpg') ?>" onerror="this.onerror=null; this.src='images/facility-1.svg';" alt="<?= htmlspecialchars($booking['facility_name']) ?>" class="table-facility-img">
                  <div>
                    <div class="table-facility-name"><?= htmlspecialchars($booking['facility_name']) ?></div>
                    <div class="table-facility-loc"><?= htmlspecialchars($booking['location'] ?? 'Campus Facility') ?></div>
                  </div>
                </div>
              </td>
              <td>
                <div style="font-weight: 700; color: #0f172a;"><?= htmlspecialchars($booking['faculty_name'] ?? 'Faculty Member') ?></div>
                <div style="font-size: 0.76rem; color: #64748b;"><?= htmlspecialchars($booking['department'] ?? 'Department') ?></div>
              </td>
              <td>
                <div style="font-weight: 700; color: #0f172a;">
                  <?= date('d M Y', strtotime($booking['booking_date'])) ?>
                </div>
                <div style="font-size: 0.78rem; color: #0d9488; font-weight: 600;">
                  <?= date('h:i A', strtotime($booking['start_time'])) ?> - <?= date('h:i A', strtotime($booking['end_time'])) ?>
                </div>
              </td>
              <td>
                <div style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.86rem;" title="<?= htmlspecialchars($booking['booking_purpose']) ?>">
                  <?= htmlspecialchars($booking['booking_purpose']) ?>
                </div>
                <div style="font-size: 0.75rem; color: #64748b;">
                  Participants: <?= (int)$booking['participant_count'] ?>
                </div>
              </td>
              <td>
                <span class="badge-status badge-<?= htmlspecialchars($booking['booking_status']) ?>">
                  <span class="status-dot"></span>
                  <?= htmlspecialchars($booking['booking_status']) ?>
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 8px;">
                  <button type="button" class="btn-action-table" style="color: var(--blue-600);" onclick="printBookingSlip(<?= htmlspecialchars(json_encode($booking)) ?>)" title="Print Confirmation Slip">
                    🖨️ Print
                  </button>
                  <a href="facility-details.php?id=<?= (int)$booking['facility_id'] ?>" class="btn-action-table" title="View Facility Specs">
                    View
                  </a>
                  <?php if (in_array($booking['booking_status'], ['Pending', 'Approved']) && ($booking['faculty_id'] === ($_SESSION['faculty_id'] ?? 'FAC-1042'))): ?>
                    <button type="button" class="btn-action-table btn-action-cancel" data-action="cancel-booking" data-booking-id="<?= htmlspecialchars($booking['booking_id']) ?>" title="Cancel Request">
                      Cancel
                    </button>
                  <?php endif; ?>
                </div>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php else: ?>
          <tr>
            <td colspan="7" style="text-align: center; padding: 32px; color: #64748b;">
              No booking requests registered yet. <a href="booking.php" style="color: var(--teal-600); font-weight: bold;">Create the first booking &rarr;</a>
            </td>
          </tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</section>

<!-- =========================================================================
     4. Featured Campus Spaces Quick Glance
     ========================================================================= -->
<section>
  <div class="section-header">
    <div class="section-title-wrap">
      <h2>Popular Campus Spaces</h2>
      <p>High-demand auditoriums, research laboratories, and smart lecture halls</p>
    </div>
    <a href="facilities.php" class="btn-card-details" style="padding: 8px 16px;">Browse All 12 Facilities &rarr;</a>
  </div>

  <div class="facilities-grid">
    <?php foreach ($featuredFacilities as $fac): ?>
      <article class="facility-card">
        <div class="facility-card-image-wrap">
          <img src="<?= htmlspecialchars($fac['image_url']) ?>" alt="<?= htmlspecialchars($fac['facility_name']) ?>" class="facility-card-img">
          
          <span class="facility-status-badge status-<?= str_replace(' ', '-', $fac['availability_status']) ?>">
            <span class="status-dot"></span>
            <?= htmlspecialchars($fac['availability_status']) ?>
          </span>

          <div class="facility-capacity-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span><?= (int)$fac['capacity'] ?> Seats</span>
          </div>
        </div>

        <div class="facility-card-body">
          <div class="facility-location-tag"><?= htmlspecialchars($fac['building']) ?></div>
          <h3 class="facility-title"><?= htmlspecialchars($fac['facility_name']) ?></h3>
          <p class="facility-desc"><?= htmlspecialchars($fac['description']) ?></p>

          <div class="facility-equipment-wrap">
            <div class="equipment-label">Equipped With:</div>
            <div class="equipment-chips">
              <?php 
                $chips = array_slice(explode(',', $fac['equipment']), 0, 3);
                foreach ($chips as $c):
              ?>
                <span class="equip-chip"><?= htmlspecialchars(trim($c)) ?></span>
              <?php endforeach; ?>
            </div>
          </div>

          <div class="facility-card-footer">
            <button type="button" 
                    class="btn-card-details" 
                    data-action="view-facility-modal"
                    data-id="<?= (int)$fac['facility_id'] ?>"
                    data-name="<?= htmlspecialchars($fac['facility_name']) ?>"
                    data-location="<?= htmlspecialchars($fac['location']) ?>"
                    data-capacity="<?= (int)$fac['capacity'] ?>"
                    data-equipment="<?= htmlspecialchars($fac['equipment']) ?>"
                    data-desc="<?= htmlspecialchars($fac['description']) ?>"
                    data-hours="<?= htmlspecialchars($fac['operating_hours']) ?>"
                    data-rules="<?= htmlspecialchars($fac['booking_rules'] ?? '') ?>"
                    data-image="<?= htmlspecialchars($fac['image_url']) ?>"
                    data-status="<?= htmlspecialchars($fac['availability_status']) ?>">
              View Details
            </button>

            <?php if ($fac['availability_status'] === 'Under Maintenance'): ?>
              <button class="btn-card-book disabled">Unavailable</button>
            <?php else: ?>
              <a href="booking.php?facility_id=<?= (int)$fac['facility_id'] ?>" class="btn-card-book">
                Book Now
              </a>
            <?php endif; ?>
          </div>
        </div>
      </article>
    <?php endforeach; ?>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
