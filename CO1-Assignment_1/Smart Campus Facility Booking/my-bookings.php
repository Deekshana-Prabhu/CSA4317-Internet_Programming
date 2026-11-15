<?php
/**
 * Smart Campus Facility Booking System
 * Page: my-bookings.php
 * Demonstrates: Section 2.H My Bookings & Booking History, Status Labels, View Details, Cancel Booking
 */

require_once __DIR__ . '/config/database.php';

$pageTitle = 'My Bookings - Smart Campus';
$activePage = 'my-bookings';

$facultyId = $_SESSION['faculty_id'] ?? 'FAC-1042';
$feedback = null;
$feedbackType = null;

// Handle Cancellation Action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'cancel_booking') {
    $cancelId = trim($_POST['booking_id'] ?? '');
    if (!empty($cancelId)) {
        $cancelled = cancelBooking($cancelId, $facultyId);
        if ($cancelled) {
            $feedback = "Booking request {$cancelId} has been successfully cancelled.";
            $feedbackType = 'success';
        } else {
            $feedback = "Unable to cancel booking {$cancelId}. It may have already been cancelled or processed.";
            $feedbackType = 'error';
        }
    }
}

// Active Tab & Status Filter
$tab = $_GET['tab'] ?? 'all';
$statusFilter = null;

if ($tab === 'approved') $statusFilter = 'Approved';
elseif ($tab === 'pending') $statusFilter = 'Pending';
elseif ($tab === 'rejected') $statusFilter = 'Rejected';
elseif ($tab === 'cancelled') $statusFilter = 'Cancelled';

// Fetch bookings
$bookings = getBookings($facultyId, $statusFilter);

// If "history" tab is active, filter for past dates
if ($tab === 'history') {
    $today = date('Y-m-d');
    $bookings = array_filter($bookings, function($b) use ($today) {
        return $b['booking_date'] < $today;
    });
}

include __DIR__ . '/includes/header.php';
?>

<!-- Section Header -->
<div class="section-header">
  <div class="section-title-wrap">
    <h2><?= ($tab === 'history') ? 'Booking History & Archive' : 'My Facility Bookings' ?></h2>
    <p>Track your reservation requests, monitor approval status, and manage allocated rooms</p>
  </div>
  <div>
    <a href="booking.php" class="btn-quick-book">
      <span>+ New Reservation</span>
    </a>
  </div>
</div>

<?php if ($feedback): ?>
  <div style="background: <?= ($feedbackType === 'success') ? '#ecfdf5' : '#fef2f2' ?>; border: 1.5px solid <?= ($feedbackType === 'success') ? '#a7f3d0' : '#fecaca' ?>; color: <?= ($feedbackType === 'success') ? '#065f46' : '#991b1b' ?>; padding: 14px 18px; border-radius: var(--radius-lg); margin-bottom: 24px; display: flex; align-items: center; gap: 10px;">
    <span><?= ($feedbackType === 'success') ? '✓' : '⚠️' ?></span>
    <span style="font-weight: 600; font-size: 0.92rem;"><?= htmlspecialchars($feedback) ?></span>
  </div>
<?php endif; ?>

<!-- Tabs Filter Bar -->
<div class="filters-bar" style="margin-bottom: 24px;">
  <div style="display: flex; gap: 8px; flex-wrap: wrap; width: 100%;">
    <a href="my-bookings.php" class="filter-pill <?= ($tab === 'all') ? 'active' : '' ?>">
      All Requests
    </a>
    <a href="my-bookings.php?tab=pending" class="filter-pill <?= ($tab === 'pending') ? 'active' : '' ?>" style="color: #b45309;">
      Pending Review
    </a>
    <a href="my-bookings.php?tab=approved" class="filter-pill <?= ($tab === 'approved') ? 'active' : '' ?>" style="color: #047857;">
      Approved Bookings
    </a>
    <a href="my-bookings.php?tab=rejected" class="filter-pill <?= ($tab === 'rejected') ? 'active' : '' ?>" style="color: #b91c1c;">
      Rejected
    </a>
    <a href="my-bookings.php?tab=cancelled" class="filter-pill <?= ($tab === 'cancelled') ? 'active' : '' ?>" style="color: #475569;">
      Cancelled
    </a>
    <a href="my-bookings.php?tab=history" class="filter-pill <?= ($tab === 'history') ? 'active' : '' ?>" style="margin-left: auto;">
      Historic Archive
    </a>
  </div>
</div>

<!-- =========================================================================
     Bookings Table (Section 2.H)
     Columns: Booking ID, Facility Name, Booking Date, Time Slot, Purpose, Status
     Actions: View Details, Cancel Booking
     ========================================================================= -->
<div class="table-responsive">
  <table class="smart-table">
    <thead>
      <tr>
        <th>Booking ID</th>
        <th>Facility Name</th>
        <th>Booking Date</th>
        <th>Time Slot</th>
        <th>Purpose</th>
        <th>Status</th>
        <th style="text-align: right;">Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php if (!empty($bookings)): ?>
        <?php foreach ($bookings as $b): ?>
          <tr>
            <!-- Booking ID -->
            <td>
              <span class="table-booking-id"><?= htmlspecialchars($b['booking_id']) ?></span>
            </td>

            <!-- Facility Name -->
            <td>
              <div class="table-facility-cell">
                <img src="<?= htmlspecialchars($b['image_url'] ?? 'images/facility-1.svg') ?>" alt="Facility" class="table-facility-img">
                <div>
                  <div class="table-facility-name"><?= htmlspecialchars($b['facility_name']) ?></div>
                  <div class="table-facility-loc"><?= htmlspecialchars($b['location'] ?? 'Campus Facility') ?></div>
                </div>
              </div>
            </td>

            <!-- Booking Date -->
            <td>
              <div style="font-weight: 700; color: #0f172a;">
                <?= date('d M Y', strtotime($b['booking_date'])) ?>
              </div>
              <div style="font-size: 0.76rem; color: #64748b;">
                <?= date('l', strtotime($b['booking_date'])) ?>
              </div>
            </td>

            <!-- Time Slot -->
            <td>
              <div style="font-size: 0.86rem; font-weight: 700; color: #0d9488;">
                <?= date('h:i A', strtotime($b['start_time'])) ?> - <?= date('h:i A', strtotime($b['end_time'])) ?>
              </div>
            </td>

            <!-- Purpose -->
            <td>
              <div style="max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.88rem; font-weight: 600; color: #1e293b;" title="<?= htmlspecialchars($b['booking_purpose']) ?>">
                <?= htmlspecialchars($b['booking_purpose']) ?>
              </div>
              <div style="font-size: 0.75rem; color: #64748b;">
                Attendees: <?= (int)$b['participant_count'] ?>
              </div>
            </td>

            <!-- Booking Status (Approved, Pending, Rejected, Cancelled) -->
            <td>
              <span class="badge-status badge-<?= htmlspecialchars($b['booking_status']) ?>">
                <span class="status-dot"></span>
                <?= htmlspecialchars($b['booking_status']) ?>
              </span>
            </td>

            <!-- Actions: View Details, Print Slip, Cancel Booking -->
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 8px;">
                <!-- View Details -->
                <button type="button" 
                        class="btn-action-table" 
                        onclick="showBookingDetailsModal(<?= htmlspecialchars(json_encode($b)) ?>)">
                  Details
                </button>

                <!-- Print Booking Confirmation -->
                <button type="button" 
                        class="btn-action-table" 
                        style="color: var(--blue-600); border-color: var(--blue-200); background: var(--blue-50);" 
                        onclick="printBookingSlip(<?= htmlspecialchars(json_encode($b)) ?>)" 
                        title="Print Booking Confirmation Slip">
                  🖨️ Print
                </button>

                <!-- Cancel Booking -->
                <?php if (in_array($b['booking_status'], ['Approved', 'Pending'])): ?>
                  <button type="button" 
                          class="btn-action-table btn-action-cancel" 
                          data-action="cancel-booking" 
                          data-booking-id="<?= htmlspecialchars($b['booking_id']) ?>">
                    Cancel
                  </button>
                <?php endif; ?>
              </div>
            </td>
          </tr>
        <?php endforeach; ?>
      <?php else: ?>
        <tr>
          <td colspan="7" style="text-align: center; padding: 48px; color: #64748b;">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">📂</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 4px;">No Bookings Found</h4>
            <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 16px;">
              You have no active reservations matching the current filter.
            </p>
            <a href="booking.php" class="btn-submit" style="text-decoration: none; padding: 8px 20px;">
              Submit a Booking Request
            </a>
          </td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<!-- Modal for Booking Details Voucher -->
<div class="modal-overlay" id="userBookingDetailsModal" role="dialog" aria-modal="true">
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title">Booking Confirmation Slip</h3>
      <button class="modal-close-btn">&times;</button>
    </div>
    <div class="modal-body" id="userBookingDetailsBody">
      <!-- Populated dynamically via JS -->
    </div>
  </div>
</div>

<script>
function showBookingDetailsModal(b) {
  const modal = document.getElementById('userBookingDetailsModal');
  const body = document.getElementById('userBookingDetailsBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 14px; margin-bottom: 18px;">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Booking Identifier</div>
        <div style="font-size: 1.4rem; font-weight: 800; color: #0284c7; font-family: monospace;">${b.booking_id}</div>
      </div>
      <div>
        <span class="badge-status badge-${b.booking_status}">
          <span class="status-dot"></span>
          ${b.booking_status}
        </span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div>
        <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Facility</div>
        <div style="font-weight: 800; color: #0f172a; font-size: 1.05rem;">${b.facility_name}</div>
        <div style="font-size: 0.78rem; color: #0d9488;">${b.location || ''}</div>
      </div>
      <div>
        <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Schedule Window</div>
        <div style="font-weight: 800; color: #0f172a;">${b.booking_date}</div>
        <div style="font-size: 0.85rem; color: #475569;">${b.start_time} - ${b.end_time}</div>
      </div>
      <div>
        <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Requester</div>
        <div style="font-weight: 700; color: #0f172a;">${b.faculty_name || 'Dr. Sarah Jenkins'}</div>
        <div style="font-size: 0.78rem; color: #64748b;">${b.faculty_id}</div>
      </div>
      <div>
        <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: bold;">Participants</div>
        <div style="font-weight: 700; color: #0f172a;">👥 ${b.participant_count} Attendees</div>
      </div>
    </div>

    <div style="margin-bottom: 16px;">
      <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px;">Purpose of Reservation</div>
      <div style="font-size: 0.92rem; color: #1e293b; background: #fff; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
        ${b.booking_purpose}
      </div>
    </div>

    ${b.equipment_required ? `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px;">Equipment Requested</div>
        <div style="font-size: 0.85rem; color: #0f766e; background: #f0fdfa; padding: 8px 12px; border-radius: 8px; border: 1px solid #ccfbf1;">
          ${b.equipment_required}
        </div>
      </div>
    ` : ''}

    ${b.special_requirements ? `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px;">Special Instructions</div>
        <div style="font-size: 0.85rem; color: #64748b; font-style: italic;">
          "${b.special_requirements}"
        </div>
      </div>
    ` : ''}

    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button type="button" onclick='printBookingSlip(${JSON.stringify(b)})' class="btn-submit" style="padding: 8px 18px; cursor: pointer;">🖨️ Print Booking Confirmation</button>
      <button class="btn-reset modal-close-btn" style="padding: 8px 20px;">Close</button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>
