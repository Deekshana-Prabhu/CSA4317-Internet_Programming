<?php
/**
 * Smart Campus Facility Booking System
 * Page: facility-details.php
 * Demonstrates: Section 2.D Facility Details Page, Large Image, Specs, Operating Hours, Time Slots, Booking Rules
 */

require_once __DIR__ . '/config/database.php';

$facilityId = isset($_GET['id']) ? (int)$_GET['id'] : 1;
$facility = getFacilityById($facilityId);

if (!$facility) {
    header("Location: facilities.php");
    exit;
}

$pageTitle = htmlspecialchars($facility['facility_name']) . ' - Facility Details';
$activePage = 'facilities';

// Check date for time slot preview (defaults to today)
$selectedDate = $_GET['date'] ?? date('Y-m-d');
$slots = getFacilityAvailabilitySlots($facilityId, $selectedDate);

include __DIR__ . '/includes/header.php';
?>

<!-- Breadcrumbs & Back Navigation -->
<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
  <div style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #64748b;">
    <a href="facilities.php" style="color: var(--teal-600); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <span>Back to Facilities</span>
    </a>
    <span>/</span>
    <span style="color: #0f172a; font-weight: 600;"><?= htmlspecialchars($facility['facility_name']) ?></span>
  </div>

  <div style="display: flex; gap: 10px;">
    <a href="availability.php?facility_id=<?= (int)$facility['facility_id'] ?>" class="btn-card-details" style="padding: 8px 16px;">
      View Full Calendar &rarr;
    </a>
    <?php if ($facility['availability_status'] !== 'Under Maintenance'): ?>
      <a href="booking.php?facility_id=<?= (int)$facility['facility_id'] ?>" class="btn-hero-primary" style="padding: 9px 22px;">
        Book Now
      </a>
    <?php endif; ?>
  </div>
</div>

<!-- Facility Showcase Banner -->
<div style="background: #fff; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2); margin-bottom: 32px;">
  <div style="height: 380px; width: 100%; position: relative; background: #0f172a;">
    <img src="<?= htmlspecialchars($facility['image_url']) ?>" onerror="this.onerror=null; this.src='images/facility-<?= (int)$facility['facility_id'] ?>.svg';" alt="<?= htmlspecialchars($facility['facility_name']) ?>" style="width: 100%; height: 100%; object-fit: cover;">
    
    <!-- Status Badge Overlay -->
    <div style="position: absolute; top: 20px; right: 20px;">
      <span class="facility-status-badge status-<?= str_replace(' ', '-', $facility['availability_status']) ?>" style="font-size: 0.86rem; padding: 6px 16px;">
        <span class="status-dot"></span>
        <?= htmlspecialchars($facility['availability_status']) ?>
      </span>
    </div>

    <!-- Category Pill -->
    <div style="position: absolute; bottom: 20px; left: 24px; display: flex; gap: 10px; align-items: center;">
      <span style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.2);">
        <?= htmlspecialchars($facility['category']) ?>
      </span>
      <span style="background: rgba(13, 148, 136, 0.9); backdrop-filter: blur(8px); color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700;">
        Code: <?= htmlspecialchars($facility['facility_code']) ?>
      </span>
    </div>
  </div>

  <div style="padding: 32px;">
    <h1 style="font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
      <?= htmlspecialchars($facility['facility_name']) ?>
    </h1>
    <p style="font-size: 1.05rem; color: #64748b; line-height: 1.6; margin-bottom: 28px;">
      <?= htmlspecialchars($facility['description']) ?>
    </p>

    <!-- Key Metrics Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; background: #f8fafc; padding: 22px; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; margin-bottom: 32px;">
      <div>
        <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Seating Capacity</div>
        <div style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-top: 4px;">
          👥 <?= (int)$facility['capacity'] ?> People
        </div>
      </div>
      <div>
        <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Building & Block</div>
        <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-top: 4px;">
          🏢 <?= htmlspecialchars($facility['building']) ?>
        </div>
      </div>
      <div>
        <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Floor & Room Number</div>
        <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-top: 4px;">
          📍 <?= htmlspecialchars($facility['floor']) ?>
        </div>
      </div>
      <div>
        <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Operating Hours</div>
        <div style="font-size: 1.05rem; font-weight: 800; color: #0d9488; margin-top: 4px;">
          🕒 <?= htmlspecialchars($facility['operating_hours']) ?>
        </div>
      </div>
    </div>

    <!-- Equipment List (Semantic List) -->
    <div style="margin-bottom: 32px;">
      <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 14px;">Available Equipment & Technical Facilities</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px;">
        <?php foreach (explode(',', $facility['equipment']) as $item): ?>
          <div style="display: flex; align-items: center; gap: 10px; background: #fff; padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid #e2e8f0; box-shadow: var(--elevation-1);">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;">✓</div>
            <span style="font-size: 0.9rem; font-weight: 600; color: #1e293b;"><?= htmlspecialchars(trim($item)) ?></span>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- Booking Rules & Campus Protocol -->
    <div style="margin-bottom: 36px; background: #fefce8; border: 1px solid #fef08a; padding: 22px; border-radius: var(--radius-lg);">
      <h3 style="font-size: 1.15rem; font-weight: 800; color: #854d0e; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
        <span>📋</span>
        <span>Booking Rules & Compliance Guidelines</span>
      </h3>
      <p style="font-size: 0.92rem; color: #713f12; line-height: 1.6;">
        <?= htmlspecialchars($facility['booking_rules'] ?? 'Campus reservation policies apply. Please maintain safety protocols and technical cleanliness.') ?>
      </p>
    </div>

    <!-- Live Time Slot Availability Preview for Today -->
    <div style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">
          Schedule for <?= date('l, d M Y', strtotime($selectedDate)) ?>
        </h3>
        <form method="GET" action="facility-details.php" style="display: flex; align-items: center; gap: 8px;">
          <input type="hidden" name="id" value="<?= (int)$facility['facility_id'] ?>">
          <label for="slotDate" style="font-size: 0.84rem; font-weight: 700; color: #64748b;">Select Date:</label>
          <input type="date" id="slotDate" name="date" value="<?= htmlspecialchars($selectedDate) ?>" onchange="this.form.submit()" class="cal-date-picker">
        </form>
      </div>

      <div class="slots-grid">
        <?php foreach ($slots as $slot): ?>
          <div class="slot-card slot-<?= htmlspecialchars($slot['status']) ?>"
               data-start="<?= htmlspecialchars($slot['start_time']) ?>"
               data-end="<?= htmlspecialchars($slot['end_time']) ?>">
            <div class="slot-time">
              <span><?= htmlspecialchars($slot['label']) ?></span>
              <span class="slot-badge"><?= ucfirst($slot['status']) ?></span>
            </div>
            <div class="slot-info-text">
              <?php if ($slot['status'] === 'available'): ?>
                Click to book this time slot
              <?php elseif ($slot['status'] === 'booked'): ?>
                Reserved: <?= htmlspecialchars($slot['booking']['booking_purpose'] ?? 'Academic Session') ?>
              <?php elseif ($slot['status'] === 'pending'): ?>
                Request Pending Approval
              <?php else: ?>
                Scheduled Sanitization / Maintenance
              <?php endif; ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- Bottom Action CTA -->
    <div style="padding-top: 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 14px;">
      <a href="facilities.php" class="btn-reset">Browse Other Spaces</a>
      <?php if ($facility['availability_status'] !== 'Under Maintenance'): ?>
        <a href="booking.php?facility_id=<?= (int)$facility['facility_id'] ?>" class="btn-submit" style="text-decoration: none;">
          Proceed to Booking Form &rarr;
        </a>
      <?php endif; ?>
    </div>
  </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
