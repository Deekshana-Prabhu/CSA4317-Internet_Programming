<?php
/**
 * Smart Campus Facility Booking System
 * Page: contact.php
 * Demonstrates: Contact Information, Help & Support Desk, Campus Rules, FAQ Accordion
 */

require_once __DIR__ . '/config/database.php';

$pageTitle = 'Contact / Help & Support - Smart Campus';
$activePage = 'contact';

$inquiryFeedback = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_inquiry'])) {
    $inquiryFeedback = "Thank you! Your inquiry has been submitted to the Central Estate Office. Reference Ticket: SUP-" . rand(1000, 9999);
}

include __DIR__ . '/includes/header.php';
?>

<!-- Section Header -->
<div class="section-header">
  <div class="section-title-wrap">
    <h2>Contact & Campus Facilities Helpdesk</h2>
    <p>Get in touch with estate coordinators, request technical AV assistance, and review campus booking policies</p>
  </div>
</div>

<?php if ($inquiryFeedback): ?>
  <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #065f46; padding: 16px 20px; border-radius: var(--radius-lg); margin-bottom: 28px; display: flex; align-items: center; gap: 10px;">
    <span style="font-size: 1.3rem;">✓</span>
    <span style="font-weight: 700;"><?= htmlspecialchars($inquiryFeedback) ?></span>
  </div>
<?php endif; ?>

<!-- Contact Cards Grid -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 36px;">
  
  <!-- Card 1: Facilities Office -->
  <div style="background: #fff; border-radius: var(--radius-xl); padding: 26px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2);">
    <div style="width: 50px; height: 50px; border-radius: 12px; background: var(--blue-100); color: var(--blue-600); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 16px;">
      🏢
    </div>
    <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Estate Management Office</h3>
    <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 16px; line-height: 1.5;">
      Direct point of contact for room keys, air-conditioning scheduling, and formal hall bookings.
    </p>
    <div style="font-size: 0.85rem; color: #1e293b; display: flex; flex-direction: column; gap: 6px;">
      <div><strong>Location:</strong> Room G-04, Technology Tower</div>
      <div><strong>Internal Ext:</strong> 4400 / 4401</div>
      <div><strong>Direct Line:</strong> +1 (555) 019-2834</div>
    </div>
  </div>

  <!-- Card 2: Audio-Visual & IT Support -->
  <div style="background: #fff; border-radius: var(--radius-xl); padding: 26px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2);">
    <div style="width: 50px; height: 50px; border-radius: 12px; background: var(--teal-100); color: var(--teal-700); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 16px;">
      🎧
    </div>
    <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">IT & AV Technical Center</h3>
    <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 16px; line-height: 1.5;">
      Assistance with projector setup, live broadcast streams, wireless mic systems, and lab software.
    </p>
    <div style="font-size: 0.85rem; color: #1e293b; display: flex; flex-direction: column; gap: 6px;">
      <div><strong>Location:</strong> Turing IT Center, 1st Floor</div>
      <div><strong>Internal Ext:</strong> 3100</div>
      <div><strong>Helpline:</strong> +1 (555) 019-3100</div>
    </div>
  </div>

  <!-- Card 3: Campus Security & Access -->
  <div style="background: #fff; border-radius: var(--radius-xl); padding: 26px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2);">
    <div style="width: 50px; height: 50px; border-radius: 12px; background: #fee2e2; color: #b91c1c; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 16px;">
      🛡️
    </div>
    <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Campus Security Command</h3>
    <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 16px; line-height: 1.5;">
      After-hours building access, biometric authorization, VIP parking escorts, and security clearances.
    </p>
    <div style="font-size: 0.85rem; color: #1e293b; display: flex; flex-direction: column; gap: 6px;">
      <div><strong>Location:</strong> Main Gatehouse Command Center</div>
      <div><strong>Emergency Ext:</strong> 9999 / 9911</div>
      <div><strong>Direct Line:</strong> +1 (555) 019-9911</div>
    </div>
  </div>
</div>

<!-- Support Form & Campus Rules -->
<div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; margin-bottom: 40px;">
  
  <!-- Quick Support Inquiry Form -->
  <div style="background: #fff; border-radius: var(--radius-xl); padding: 32px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2);" id="support">
    <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Submit an Inquiry or Request</h3>
    <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 24px;">
      Have a question regarding high-capacity events, special weekend bookings, or facility keys?
    </p>

    <form method="POST" action="contact.php" class="booking-form">
      <div class="form-row">
        <div class="form-group">
          <label>Your Name</label>
          <input type="text" name="inquiry_name" class="form-control" value="<?= htmlspecialchars($_SESSION['faculty_name'] ?? 'Dr. Sarah Jenkins') ?>" required>
        </div>
        <div class="form-group">
          <label>Faculty ID</label>
          <input type="text" name="inquiry_id" class="form-control" value="<?= htmlspecialchars($_SESSION['faculty_id'] ?? 'FAC-1042') ?>" required>
        </div>
      </div>

      <div class="form-group">
        <label>Subject / Topic</label>
        <select name="inquiry_topic" class="form-control" required>
          <option value="Audio Visual Assistance">Audio Visual & Live Stream Assistance</option>
          <option value="Auditorium Special Permission">Auditorium Special Dean Permission</option>
          <option value="Weekend / Night Slot Request">Weekend / Night Slot Scheduling</option>
          <option value="Equipment Troubleshooting">Lab Equipment Troubleshooting</option>
          <option value="General Query">General Facility Reservation Query</option>
        </select>
      </div>

      <div class="form-group">
        <label>Message / Details</label>
        <textarea name="inquiry_message" class="form-control" rows="4" placeholder="Explain your request or inquiry in detail..." required></textarea>
      </div>

      <button type="submit" name="submit_inquiry" class="btn-submit" style="align-self: flex-start; margin-top: 10px;">
        Send Message to Facilities Team
      </button>
    </form>
  </div>

  <!-- Campus Booking Guidelines (Semantic Section) -->
  <div style="background: #fff; border-radius: var(--radius-xl); padding: 32px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2);" id="rules">
    <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 16px;">Campus Reservation Protocols</h3>

    <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 16px;">
      <li style="display: flex; gap: 12px; font-size: 0.88rem; color: #334155; line-height: 1.5;">
        <span style="color: #0d9488; font-weight: bold; font-size: 1.1rem;">01.</span>
        <div>
          <strong style="color: #0f172a;">24-Hour Advance Submission:</strong>
          Standard seminar halls, conference suites, and meeting rooms must be requested at least 24 hours prior to the event.
        </div>
      </li>

      <li style="display: flex; gap: 12px; font-size: 0.88rem; color: #334155; line-height: 1.5;">
        <span style="color: #0d9488; font-weight: bold; font-size: 1.1rem;">02.</span>
        <div>
          <strong style="color: #0f172a;">Auditorium Approvals:</strong>
          Convocations, cultural programs, and grand auditorium bookings require Dean or Vice-Chancellor endorsement.
        </div>
      </li>

      <li style="display: flex; gap: 12px; font-size: 0.88rem; color: #334155; line-height: 1.5;">
        <span style="color: #0d9488; font-weight: bold; font-size: 1.1rem;">03.</span>
        <div>
          <strong style="color: #0f172a;">Overlapping Conflict Policy:</strong>
          The booking engine automatically blocks simultaneous reservations for the same facility and time slot.
        </div>
      </li>

      <li style="display: flex; gap: 12px; font-size: 0.88rem; color: #334155; line-height: 1.5;">
        <span style="color: #0d9488; font-weight: bold; font-size: 1.1rem;">04.</span>
        <div>
          <strong style="color: #0f172a;">Cancellation Etiquette:</strong>
          If an event is rescheduled or called off, faculty members are requested to cancel the booking to release the room.
        </div>
      </li>
    </ul>
  </div>
</div>

<!-- FAQ Section (Section 2.I) -->
<section style="background: #fff; border-radius: var(--radius-xl); padding: 32px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2); margin-bottom: 36px;" id="faq">
  <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 20px;">Frequently Asked Questions</h3>

  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 14px;">
      <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
        How does the drag-and-drop room allocation feature work?
      </h4>
      <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5;">
        On the "Book a Facility" page, simply drag any facility card from the left-hand palette into the allocated drop zone. The system will automatically select that room, preview its thumbnail and capacity, and update the form dropdown immediately.
      </p>
    </div>

    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 14px;">
      <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
        What happens if two faculty members try to book the same room at the same time?
      </h4>
      <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5;">
        The system executes database-level prepared statement checks for conflicting time intervals. If an approved or pending booking exists for that slot, the second request is immediately flagged with a conflict notification.
      </p>
    </div>

    <div>
      <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
        How do I cancel a booking if my guest lecture is postponed?
      </h4>
      <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5;">
        Navigate to "My Bookings" in the sidebar, find the booking card or row, and click the red "Cancel" button. Confirm the action in the prompt, and the room status will update to "Cancelled", freeing the slot on the calendar.
      </p>
    </div>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
