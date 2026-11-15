<?php
/**
 * Smart Campus Facility Booking System
 * Page: availability.php
 * Demonstrates: Section 2.E Room Availability Calendar, Green/Red/Yellow Slot Matrix, Date Navigation
 */

require_once __DIR__ . '/config/database.php';

$pageTitle = 'Room Availability Calendar - Smart Campus';
$activePage = 'availability';

// Date handling
$selectedDate = $_GET['date'] ?? date('Y-m-d');
$timestamp = strtotime($selectedDate);
if (!$timestamp) {
    $selectedDate = date('Y-m-d');
    $timestamp = time();
}

$prevDate = date('Y-m-d', strtotime('-1 day', $timestamp));
$nextDate = date('Y-m-d', strtotime('+1 day', $timestamp));
$todayDate = date('Y-m-d');

// Facility filter handling
$selectedFacilityId = isset($_GET['facility_id']) ? (int)$_GET['facility_id'] : 1;
$facilities = getAllFacilities();
$currentFacility = getFacilityById($selectedFacilityId) ?: ($facilities[0] ?? null);

// Fetch slots for this facility and date
$slots = getFacilityAvailabilitySlots($currentFacility['facility_id'], $selectedDate);

// Calculate slot stats for the day
$availCount = 0;
$bookedCount = 0;
$pendingCount = 0;
foreach ($slots as $s) {
    if ($s['status'] === 'available') $availCount++;
    elseif ($s['status'] === 'booked') $bookedCount++;
    elseif ($s['status'] === 'pending') $pendingCount++;
}

include __DIR__ . '/includes/header.php';
?>

<!-- Section Header -->
<div class="section-header">
  <div class="section-title-wrap">
    <h2>Room Availability Calendar</h2>
    <p>Live schedule matrix, real-time slot statuses, and instant room reservation</p>
  </div>
  <div>
    <a href="booking.php?facility_id=<?= (int)$currentFacility['facility_id'] ?>&booking_date=<?= htmlspecialchars($selectedDate) ?>" class="btn-quick-book">
      <span>Book for <?= date('d M', $timestamp) ?> &rarr;</span>
    </a>
  </div>
</div>

<!-- =========================================================================
     Availability Controls Bar (Date Navigation & Facility Selector)
     ========================================================================= -->
<div class="calendar-card">
  <div class="calendar-topbar">
    
    <!-- Facility Selector -->
    <div style="display: flex; align-items: center; gap: 10px; min-width: 280px;">
      <label for="calendarFacilityFilter" style="font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Facility:</label>
      <select id="calendarFacilityFilter" class="filter-select" style="font-size: 0.95rem; font-weight: 700; width: 100%;">
        <?php foreach ($facilities as $fac): ?>
          <option value="<?= (int)$fac['facility_id'] ?>" <?= ($fac['facility_id'] == $currentFacility['facility_id']) ? 'selected' : '' ?>>
            <?= htmlspecialchars($fac['facility_name']) ?> (<?= htmlspecialchars($fac['building']) ?>)
          </option>
        <?php endforeach; ?>
      </select>
    </div>

    <!-- Date Navigation Controls (Prev, Date Picker, Next, Today) -->
    <div class="calendar-controls">
      <a href="availability.php?facility_id=<?= (int)$currentFacility['facility_id'] ?>&date=<?= $prevDate ?>" class="btn-nav-cal" title="Previous Day">
        &larr; Prev
      </a>

      <input type="date" id="calendarDatePicker" value="<?= htmlspecialchars($selectedDate) ?>" class="cal-date-picker">

      <a href="availability.php?facility_id=<?= (int)$currentFacility['facility_id'] ?>&date=<?= $nextDate ?>" class="btn-nav-cal" title="Next Day">
        Next &rarr;
      </a>

      <?php if ($selectedDate !== $todayDate): ?>
        <a href="availability.php?facility_id=<?= (int)$currentFacility['facility_id'] ?>&date=<?= $todayDate ?>" class="btn-nav-cal" style="background: var(--blue-100); color: var(--blue-600); border-color: var(--blue-200);">
          Today
        </a>
      <?php endif; ?>
    </div>

    <!-- Status Legend (Green: Available, Red: Booked, Yellow: Pending) -->
    <div class="legend-bar">
      <div class="legend-item">
        <span class="legend-box avail"></span>
        <span>Available (<?= $availCount ?>)</span>
      </div>
      <div class="legend-item">
        <span class="legend-box booked"></span>
        <span>Booked (<?= $bookedCount ?>)</span>
      </div>
      <div class="legend-item">
        <span class="legend-box pending"></span>
        <span>Pending (<?= $pendingCount ?>)</span>
      </div>
      <div class="legend-item">
        <span class="legend-box maint"></span>
        <span>Maintenance</span>
      </div>
    </div>
  </div>

  <!-- Selected Room Card Banner -->
  <div style="background: #f8fafc; border-radius: var(--radius-lg); padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
    <div style="display: flex; align-items: center; gap: 16px;">
      <img src="<?= htmlspecialchars($currentFacility['image_url']) ?>" onerror="this.onerror=null; this.src='images/facility-<?= (int)$currentFacility['facility_id'] ?>.svg';" alt="<?= htmlspecialchars($currentFacility['facility_name']) ?>" style="width: 70px; height: 50px; border-radius: 8px; object-fit: cover;">
      <div>
        <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 2px;">
          <?= htmlspecialchars($currentFacility['facility_name']) ?>
        </h3>
        <div style="font-size: 0.82rem; color: #64748b;">
          📍 <?= htmlspecialchars($currentFacility['location']) ?> &bull; 👥 Capacity: <?= (int)$currentFacility['capacity'] ?> Seats
        </div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="text-align: right;">
        <div style="font-size: 0.76rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Selected Date</div>
        <div style="font-size: 1.05rem; font-weight: 800; color: #0d9488;">
          <?= date('l, F j, Y', $timestamp) ?>
        </div>
      </div>
    </div>
  </div>

  <!-- =======================================================================
       Time Slots Grid (Section 2.E)
       Green for available, Red for booked, Yellow for pending
       ======================================================================= -->
  <div style="margin-bottom: 12px;">
    <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 14px;">
      Daily Slot Schedule Matrix
    </h3>
    <div class="slots-grid">
      <?php foreach ($slots as $slot): ?>
        <div class="slot-card slot-<?= htmlspecialchars($slot['status']) ?>"
             data-start="<?= htmlspecialchars($slot['start_time']) ?>"
             data-end="<?= htmlspecialchars($slot['end_time']) ?>"
             title="<?= ($slot['status'] === 'available') ? 'Click to book this time slot' : 'Reserved Slot' ?>">
          <div class="slot-time">
            <span><?= htmlspecialchars($slot['label']) ?></span>
            <span class="slot-badge"><?= ucfirst($slot['status']) ?></span>
          </div>

          <div class="slot-info-text">
            <?php if ($slot['status'] === 'available'): ?>
              <span style="font-weight: 700; color: #047857;">✓ Available for Reservation</span>
              <div style="font-size: 0.74rem; color: #065f46; margin-top: 2px;">Click to reserve instantly</div>
            <?php elseif ($slot['status'] === 'booked'): ?>
              <span style="font-weight: 700; color: #b91c1c;">✕ Confirmed Booking</span>
              <div style="font-size: 0.74rem; color: #991b1b; margin-top: 2px;">
                <?= htmlspecialchars($slot['booking']['booking_purpose'] ?? 'Faculty Academic Session') ?>
              </div>
            <?php elseif ($slot['status'] === 'pending'): ?>
              <span style="font-weight: 700; color: #b45309;">⏳ Under Review</span>
              <div style="font-size: 0.74rem; color: #92400e; margin-top: 2px;">
                Request submitted by faculty
              </div>
            <?php else: ?>
              <span style="color: #64748b; font-weight: 600;">🔒 Maintenance & Sanitization</span>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; font-size: 0.84rem; color: #64748b; flex-wrap: wrap; gap: 10px;">
    <div>
      💡 <strong>Tip:</strong> Click on any green <span style="color: #10b981; font-weight: bold;">Available</span> slot to jump directly into the pre-filled booking form.
    </div>
    <div>
      Need a full day or multi-day conference booking? <a href="contact.php" style="color: var(--teal-600); font-weight: bold;">Contact Facilities Office &rarr;</a>
    </div>
  </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
