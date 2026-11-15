<?php
/**
 * Smart Campus Facility Booking System
 * Page: booking.php
 * Demonstrates: Section 2.F Professional Booking Form, Section 2.G HTML5 Drag-and-Drop Room Allocation,
 * Backend Overlapping Check, Prepared Statements, Unique Booking ID, Confirmation Receipt
 */

require_once __DIR__ . '/config/database.php';

$pageTitle = 'Book a Facility - Smart Campus';
$activePage = 'booking';

// Pre-fill parameters from GET
$preFacilityId = isset($_GET['facility_id']) ? (int)$_GET['facility_id'] : '';
$preDate = $_GET['booking_date'] ?? date('Y-m-d');
$preStartTime = $_GET['start_time'] ?? '';
$preEndTime = $_GET['end_time'] ?? '';

$facilities = getAllFacilities();
$feedbackMessage = null;
$feedbackType = null;
$createdBooking = null;

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $facultyId = trim($_POST['faculty_id'] ?? ($_SESSION['faculty_id'] ?? 'FAC-1042'));
    $facultyName = trim($_POST['faculty_name'] ?? ($_SESSION['faculty_name'] ?? 'Dr. Sarah Jenkins'));
    $department = trim($_POST['department'] ?? ($_SESSION['faculty_dept'] ?? 'Computer Science & Engineering'));
    $email = trim($_POST['email'] ?? ($_SESSION['faculty_email'] ?? 's.jenkins@smartcampus.edu'));
    $phone = trim($_POST['contact_number'] ?? ($_SESSION['faculty_phone'] ?? '+1 (555) 234-5678'));

    $facilityId = (int)($_POST['facility_id'] ?? 0);
    $bookingDate = trim($_POST['booking_date'] ?? '');
    $startTime = trim($_POST['start_time'] ?? '');
    $endTime = trim($_POST['end_time'] ?? '');
    $participantCount = (int)($_POST['participant_count'] ?? 0);
    $bookingPurpose = trim($_POST['booking_purpose'] ?? '');
    $specialRequirements = trim($_POST['special_requirements'] ?? '');
    
    // Equipment checkboxes array
    $equipmentRequiredArr = $_POST['equipment_required'] ?? [];
    $equipmentRequired = is_array($equipmentRequiredArr) ? implode(', ', $equipmentRequiredArr) : '';

    // Backend Validation
    $errors = [];

    if ($facilityId <= 0) {
        $errors[] = 'Please select a campus facility or drag one into the allocation zone.';
    }

    if (empty($bookingDate)) {
        $errors[] = 'Booking date is required.';
    } elseif (strtotime($bookingDate) < strtotime(date('Y-m-d'))) {
        $errors[] = 'Booking date cannot be in the past.';
    }

    if (empty($startTime)) {
        $errors[] = 'Start time is required.';
    }
    if (empty($endTime)) {
        $errors[] = 'End time is required.';
    }

    if (!empty($startTime) && !empty($endTime)) {
        if (strtotime($startTime) >= strtotime($endTime)) {
            $errors[] = 'End time must be chronologically after the start time.';
        }
    }

    if ($participantCount <= 0) {
        $errors[] = 'Number of participants must be at least 1.';
    }

    if (empty($bookingPurpose)) {
        $errors[] = 'Please specify the academic or institutional purpose of the booking.';
    }

    // Verify against facility capacity
    $selectedFacObj = getFacilityById($facilityId);
    if ($selectedFacObj && $participantCount > $selectedFacObj['capacity']) {
        $errors[] = "Requested participants ({$participantCount}) exceeds maximum capacity for {$selectedFacObj['facility_name']} ({$selectedFacObj['capacity']} seats).";
    }

    // OVERLAPPING BOOKING CONFLICT CHECK (Backend Rule 6)
    if (empty($errors)) {
        $hasConflict = checkBookingConflict($facilityId, $bookingDate, $startTime, $endTime);
        if ($hasConflict) {
            $errors[] = "Conflict Detected: {$selectedFacObj['facility_name']} is already reserved or has a pending request on " . date('d M Y', strtotime($bookingDate)) . " during the specified time slot (" . date('h:i A', strtotime($startTime)) . " - " . date('h:i A', strtotime($endTime)) . "). Please choose a different time or date.";
        }
    }

    if (!empty($errors)) {
        $feedbackType = 'error';
        $feedbackMessage = $errors[0];
        // Retain values
        $preFacilityId = $facilityId;
        $preDate = $bookingDate;
        $preStartTime = $startTime;
        $preEndTime = $endTime;
    } else {
        // Execute booking creation via prepared statement
        $bookingData = [
            'faculty_id' => $facultyId,
            'faculty_name' => $facultyName,
            'facility_id' => $facilityId,
            'booking_date' => $bookingDate,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'participant_count' => $participantCount,
            'booking_purpose' => $bookingPurpose,
            'special_requirements' => $specialRequirements,
            'equipment_required' => $equipmentRequired
        ];

        $result = createBooking($bookingData);
        if ($result['success']) {
            $feedbackType = 'success';
            $feedbackMessage = $result['message'];
            $createdBooking = [
                'booking_id' => $result['booking_id'],
                'facility_name' => $selectedFacObj['facility_name'],
                'location' => $selectedFacObj['location'],
                'building' => $selectedFacObj['building'],
                'booking_date' => $bookingDate,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'participant_count' => $participantCount,
                'purpose' => $bookingPurpose,
                'equipment' => $equipmentRequired,
                'faculty_name' => $facultyName,
                'faculty_id' => $facultyId,
                'department' => $department
            ];
        } else {
            $feedbackType = 'error';
            $feedbackMessage = $result['message'];
        }
    }
}

include __DIR__ . '/includes/header.php';
?>

<!-- Page Header -->
<div class="section-header">
  <div class="section-title-wrap">
    <h2>Facility Reservation & Allocation</h2>
    <p>Submit booking requests with interactive drag-and-drop room allocation and conflict verification</p>
  </div>
  <div>
    <a href="availability.php" class="btn-card-details" style="padding: 8px 16px;">
      View Availability Grid &rarr;
    </a>
  </div>
</div>

<?php if ($feedbackMessage && $feedbackType === 'error'): ?>
  <div style="background: #fef2f2; border: 1.5px solid #fecaca; color: #991b1b; padding: 16px 20px; border-radius: var(--radius-lg); margin-bottom: 28px; display: flex; align-items: flex-start; gap: 12px; box-shadow: var(--elevation-1);">
    <span style="font-size: 1.5rem; line-height: 1;">⚠️</span>
    <div>
      <strong style="font-size: 0.96rem;">Reservation Conflict or Validation Notice:</strong>
      <div style="font-size: 0.88rem; margin-top: 4px;"><?= htmlspecialchars($feedbackMessage) ?></div>
    </div>
  </div>
<?php endif; ?>

<?php if ($createdBooking): ?>
  <!-- =======================================================================
       Booking Confirmation View / Receipt
       ======================================================================= -->
  <div style="background: #fff; border-radius: var(--radius-xl); border: 2px solid var(--status-available); padding: 36px; box-shadow: var(--elevation-3); margin-bottom: 36px; animation: popIn 0.4s ease;">
    <div style="text-align: center; max-width: 650px; margin: 0 auto 32px auto;">
      <div style="width: 72px; height: 72px; background: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 16px auto; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
        ✓
      </div>
      <h2 style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
        Booking Request Confirmed!
      </h2>
      <p style="font-size: 0.95rem; color: #64748b;">
        Your facility reservation slip has been generated and dispatched to the Estate Management and Department Dean for priority scheduling.
      </p>
    </div>

    <!-- Booking Confirmation Slip Details -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 24px; max-width: 780px; margin: 0 auto 28px auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 16px;">
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Reference Number</span>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--blue-600); font-family: monospace;">
            <?= htmlspecialchars($createdBooking['booking_id']) ?>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="badge-status badge-Pending" style="font-size: 0.82rem; padding: 6px 14px;">
            <span class="status-dot"></span>
            Status: Pending Approval
          </span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-bottom: 20px;">
        <div>
          <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Reserved Space</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">
            <?= htmlspecialchars($createdBooking['facility_name']) ?>
          </div>
          <div style="font-size: 0.78rem; color: #0d9488;"><?= htmlspecialchars($createdBooking['location']) ?></div>
        </div>

        <div>
          <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Date & Time Slot</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">
            <?= date('D, d M Y', strtotime($createdBooking['booking_date'])) ?>
          </div>
          <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">
            <?= date('h:i A', strtotime($createdBooking['start_time'])) ?> - <?= date('h:i A', strtotime($createdBooking['end_time'])) ?>
          </div>
        </div>

        <div>
          <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Faculty Requester</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">
            <?= htmlspecialchars($createdBooking['faculty_name']) ?>
          </div>
          <div style="font-size: 0.78rem; color: #64748b;">
            <?= htmlspecialchars($createdBooking['faculty_id']) ?> &bull; <?= htmlspecialchars($createdBooking['department']) ?>
          </div>
        </div>

        <div>
          <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Participants</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">
            👥 <?= (int)$createdBooking['participant_count'] ?> Attendees
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px;">
        <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Purpose of Booking</div>
        <div style="font-size: 0.92rem; color: #1e293b; font-weight: 600;">
          <?= htmlspecialchars($createdBooking['purpose']) ?>
        </div>
        <?php if (!empty($createdBooking['equipment'])): ?>
          <div style="font-size: 0.78rem; color: #64748b; margin-top: 6px;">
            <strong>Tech Allocated:</strong> <?= htmlspecialchars($createdBooking['equipment']) ?>
          </div>
        <?php endif; ?>
      </div>
    </div>

    <!-- Actions -->
    <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
      <a href="my-bookings.php" class="btn-submit" style="text-decoration: none;">
        View in My Bookings &rarr;
      </a>
      <button type="button" onclick="printBookingSlip(<?= htmlspecialchars(json_encode($createdBooking)) ?>)" class="btn-submit" style="background: linear-gradient(135deg, var(--blue-600), var(--teal-600)); cursor: pointer;">
        🖨️ Print Booking Confirmation
      </button>
      <a href="booking.php" class="btn-reset">
        + Reserve Another Space
      </a>
    </div>
  </div>
<?php endif; ?>

<!-- =========================================================================
     Section 2.G: Interactive Drag-and-Drop Room Allocation Area
     ========================================================================= -->
<section class="dnd-container" id="allocation-dock" aria-label="Interactive Room Allocation Dock">
  <div class="dnd-header">
    <div class="dnd-title">
      <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--teal-100); color: var(--teal-600); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
        ✋
      </div>
      <div>
        <h3>Drag-and-Drop Room Allocation</h3>
        <p style="font-size: 0.84rem; color: #64748b; margin-top: 2px;">
          Drag any available facility card directly into the drop zone to automatically populate and allocate your space
        </p>
      </div>
    </div>
    <span class="dnd-badge">HTML5 Drag & Drop</span>
  </div>

  <div class="dnd-layout">
    <!-- Left: Draggable Facility Palette -->
    <div class="drag-palette-box">
      <div class="palette-title">
        <span>Available Spaces Palette</span>
        <span style="font-size: 0.72rem; color: #0d9488;">Grab and Drag</span>
      </div>

      <div class="draggable-items-list" id="draggablePalette">
        <?php foreach ($facilities as $fac): ?>
          <div class="draggable-card"
               draggable="true"
               data-facility-id="<?= (int)$fac['facility_id'] ?>"
               data-facility-name="<?= htmlspecialchars($fac['facility_name']) ?>"
               data-facility-img="<?= htmlspecialchars($fac['image_url']) ?>"
               data-facility-loc="<?= htmlspecialchars($fac['location']) ?>"
               data-facility-cap="<?= (int)$fac['capacity'] ?>">
            <div class="drag-handle" title="Drag to allocate">⋮⋮</div>
            <img src="<?= htmlspecialchars($fac['image_url']) ?>" onerror="this.onerror=null; this.src='images/facility-<?= (int)$fac['facility_id'] ?>.svg';" alt="<?= htmlspecialchars($fac['facility_name']) ?>" class="drag-thumb">
            <div class="drag-card-meta">
              <div class="drag-card-name"><?= htmlspecialchars($fac['facility_name']) ?></div>
              <div class="drag-card-sub">
                <?= htmlspecialchars($fac['building']) ?> &bull; 👥 <?= (int)$fac['capacity'] ?> Seats
              </div>
            </div>
            <span class="badge-status badge-<?= str_replace(' ', '', $fac['availability_status']) ?>" style="font-size: 0.65rem; padding: 2px 6px;">
              <?= htmlspecialchars($fac['availability_status']) ?>
            </span>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- Right: Drop Target Area -->
    <div class="drop-target-area" id="roomDropZone">
      
      <!-- Empty Drop State -->
      <div class="drop-empty-state" id="emptyDropState">
        <div class="drop-icon-pulse">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20"></path>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <h4>Drag & Drop Facility Here</h4>
        <p>Grab any facility card from the palette on the left and drop it here to assign it to your booking form.</p>
        <span style="font-size: 0.78rem; font-weight: 700; color: var(--teal-600); background: var(--teal-50); padding: 4px 12px; border-radius: 20px; border: 1px solid var(--teal-200);">
          Auto-populates dropdown below
        </span>
      </div>

      <!-- Dropped Facility Visual Display -->
      <div class="dropped-facility-display" id="droppedRoomDisplay" style="display: none;">
        <button type="button" class="dropped-btn-remove" id="btnRemoveAllocation" title="Remove Allocated Room">
          ✕ Remove / Replace
        </button>
        <img id="droppedImg" src="images/facility-1.jpg" onerror="this.onerror=null; this.src='images/facility-1.svg';" alt="Allocated Facility" class="dropped-img">
        <div class="dropped-meta">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #0d9488; font-weight: 700;">Successfully Allocated Space:</div>
          <h4 id="droppedTitle" class="dropped-title">Facility Name</h4>
          <div id="droppedLoc" class="dropped-building">Location</div>
          <div class="dropped-pills">
            <span id="droppedCap" class="stat-pill info">100 Seats</span>
            <span class="stat-pill success">Assigned to Form</span>
          </div>
          <div style="font-size: 0.78rem; color: #64748b;">
            Drop another facility to replace, or continue filling out the reservation details below.
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- =========================================================================
     Section 2.F: Professional Facility Booking Form
     ========================================================================= -->
<section class="form-card" aria-label="Facility Booking Form Container">
  <form id="facilityBookingForm" method="POST" action="booking.php" class="booking-form" novalidate>
    
    <!-- 1. Faculty Information Sub-Section -->
    <div class="form-section-header">
      <h4>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>1. Faculty Member Information</span>
      </h4>
    </div>

    <div class="form-row">
      <!-- Faculty Name -->
      <div class="form-group">
        <label for="faculty_name">Faculty Name <span class="required">*</span></label>
        <input type="text" id="faculty_name" name="faculty_name" class="form-control" value="<?= htmlspecialchars($_SESSION['faculty_name'] ?? 'Dr. Sarah Jenkins') ?>" required>
        <div class="invalid-feedback">Faculty name is required.</div>
      </div>

      <!-- Faculty ID -->
      <div class="form-group">
        <label for="faculty_id">Faculty ID <span class="required">*</span></label>
        <input type="text" id="faculty_id_input" name="faculty_id" class="form-control" value="<?= htmlspecialchars($_SESSION['faculty_id'] ?? 'FAC-1042') ?>" required>
        <div class="invalid-feedback">Faculty ID is required.</div>
      </div>

      <!-- Department -->
      <div class="form-group">
        <label for="department">Department <span class="required">*</span></label>
        <input type="text" id="department" name="department" class="form-control" value="<?= htmlspecialchars($_SESSION['faculty_dept'] ?? 'Computer Science & Engineering') ?>" required>
        <div class="invalid-feedback">Department is required.</div>
      </div>
    </div>

    <div class="form-row">
      <!-- Email Address (HTML5 email control) -->
      <div class="form-group">
        <label for="email">Institutional Email Address <span class="required">*</span></label>
        <input type="email" id="email" name="email" class="form-control" value="<?= htmlspecialchars($_SESSION['faculty_email'] ?? 's.jenkins@smartcampus.edu') ?>" required>
        <div class="invalid-feedback">A valid college email address is required.</div>
      </div>

      <!-- Contact Number (HTML5 tel control) -->
      <div class="form-group">
        <label for="contact_number">Contact Number <span class="required">*</span></label>
        <input type="tel" id="contact_number" name="contact_number" class="form-control" value="<?= htmlspecialchars($_SESSION['faculty_phone'] ?? '+1 (555) 234-5678') ?>" required>
        <div class="invalid-feedback">Contact telephone is required.</div>
      </div>
    </div>

    <!-- 2. Facility Selection & Date / Time Sub-Section -->
    <div class="form-section-header" style="margin-top: 14px;">
      <h4>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>2. Space Selection & Reservation Schedule</span>
      </h4>
    </div>

    <div class="form-row">
      <!-- Facility Selection Dropdown (HTML5 select control) -->
      <div class="form-group">
        <label for="facility_id">Target Facility Space <span class="required">*</span></label>
        <select id="facility_id" name="facility_id" class="form-control" required>
          <option value="">-- Select a Facility (or Drag from Above) --</option>
          <?php foreach ($facilities as $fac): ?>
            <option value="<?= (int)$fac['facility_id'] ?>" <?= ($preFacilityId == $fac['facility_id']) ? 'selected' : '' ?>>
              <?= htmlspecialchars($fac['facility_name']) ?> (<?= htmlspecialchars($fac['building']) ?> - <?= (int)$fac['capacity'] ?> Seats)
            </option>
          <?php endforeach; ?>
        </select>
        <div class="invalid-feedback">Please select a facility space.</div>
      </div>

      <!-- Booking Date (HTML5 date control) -->
      <div class="form-group">
        <label for="booking_date">Booking Date <span class="required">*</span></label>
        <input type="date" id="booking_date" name="booking_date" class="form-control" value="<?= htmlspecialchars($preDate) ?>" min="<?= date('Y-m-d') ?>" required>
        <div class="invalid-feedback">Please select a valid future date.</div>
      </div>

      <!-- Number of Participants (HTML5 number control) -->
      <div class="form-group">
        <label for="participant_count">Number of Participants <span class="required">*</span></label>
        <input type="number" id="participant_count" name="participant_count" class="form-control" value="45" min="1" max="1000" required>
        <div class="invalid-feedback">Please specify at least 1 participant.</div>
      </div>
    </div>

    <div class="form-row">
      <!-- Start Time (HTML5 time control) -->
      <div class="form-group">
        <label for="start_time">Start Time <span class="required">*</span></label>
        <input type="time" id="start_time" name="start_time" class="form-control" value="<?= htmlspecialchars($preStartTime ?: '10:00') ?>" required>
        <div class="invalid-feedback">Start time is required.</div>
      </div>

      <!-- End Time (HTML5 time control) -->
      <div class="form-group">
        <label for="end_time">End Time <span class="required">*</span></label>
        <input type="time" id="end_time" name="end_time" class="form-control" value="<?= htmlspecialchars($preEndTime ?: '12:00') ?>" required>
        <div class="invalid-feedback">End time must be after start time.</div>
      </div>
    </div>

    <!-- 3. Purpose & Requirements Sub-Section -->
    <div class="form-section-header" style="margin-top: 14px;">
      <h4>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <span>3. Purpose & Technical Equipment Requirements</span>
      </h4>
    </div>

    <!-- Purpose of Booking (HTML5 text control) -->
    <div class="form-group">
      <label for="booking_purpose">Purpose of Booking / Event Title <span class="required">*</span></label>
      <input type="text" id="booking_purpose" name="booking_purpose" class="form-control" placeholder="e.g. Faculty Senate Meeting, Guest Lecture on Neural Networks, Capstone Project Demo" required>
      <div class="invalid-feedback">Please describe the purpose of booking.</div>
    </div>

    <!-- Equipment Required (HTML5 Checkboxes) -->
    <div class="form-group">
      <label>Equipment Required (Select all that apply):</label>
      <div class="equipment-checkbox-grid">
        <label class="checkbox-label">
          <input type="checkbox" name="equipment_required[]" value="4K / HD Overhead Projector" checked>
          <span>Projector & Screen</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" name="equipment_required[]" value="Audio PA System & Microphones" checked>
          <span>Audio PA & Microphones</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" name="equipment_required[]" value="High-Speed Wi-Fi & LAN">
          <span>High-Speed Wi-Fi / LAN</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" name="equipment_required[]" value="Workstations / PC Systems">
          <span>Workstations / PCs</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" name="equipment_required[]" value="Video Conferencing Bridge">
          <span>Video Conferencing Cam</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" name="equipment_required[]" value="Digital Podium / Smart Board">
          <span>Smart Interactive Podium</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" name="equipment_required[]" value="Technical Assistant on Site">
          <span>IT Assistant Support</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" name="equipment_required[]" value="Stage Lighting & Green Room">
          <span>Stage Rigging & Lighting</span>
        </label>
      </div>
    </div>

    <!-- Special Requirements (HTML5 textarea control) -->
    <div class="form-group">
      <label for="special_requirements">Special Arrangements / Notes (Optional)</label>
      <textarea id="special_requirements" name="special_requirements" class="form-control" rows="3" placeholder="Provide any additional layout preferences, guest VIP protocol, AC temperature requirements, or cabling needs..."></textarea>
    </div>

    <!-- Form Action Buttons: Submit & Reset -->
    <div class="form-actions">
      <button type="submit" class="btn-submit">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Submit Booking Request</span>
      </button>

      <button type="reset" class="btn-reset" onclick="clearAllocatedRoom()">
        Reset Form
      </button>
    </div>
  </form>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
