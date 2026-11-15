<?php
/**
 * Smart Campus Facility Booking System
 * Include: includes/footer.php
 * Demonstrates: HTML5 Semantic <footer>, Inline CSS, Modals, and JavaScript Inclusion
 */
?>
      </main>
      <!-- Main Content Container ends -->

      <!-- Semantic Footer (Demonstrating CSS3 Requirement: Inline CSS) -->
      <footer class="site-footer" style="position: relative; overflow: hidden; background: #0f172a;">
        <div class="footer-content" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 32px;">
          
          <!-- Column 1: College Info -->
          <div class="footer-brand">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
              <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #0284c7, #0d9488); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">SC</div>
              <h3 style="margin: 0; font-size: 1.2rem; color: #fff;">SMART<span style="color: #2dd4bf;">CAMPUS</span></h3>
            </div>
            <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6; margin-bottom: 16px;">
              Premier autonomous university facility management portal, empowering faculty members with transparent room scheduling, high-tech lab bookings, and auditorium reservations.
            </p>
            <div style="display: flex; gap: 10px;">
              <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; background: rgba(45, 212, 191, 0.15); color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.3);">
                Accredited Grade A++
              </span>
              <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">
                ISO 9001:2026 Certified
              </span>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="footer-column">
            <h4 style="color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 16px; text-transform: uppercase;">Quick Spaces</h4>
            <ul class="footer-links" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
              <li><a href="facilities.php?category=Auditorium+%26+Hall">Auditoriums & Halls</a></li>
              <li><a href="facilities.php?category=Laboratory">Computer & AI Labs</a></li>
              <li><a href="facilities.php?category=Conference+Room">Conference Suites</a></li>
              <li><a href="facilities.php?category=Innovation+Space">Innovation & Maker Hubs</a></li>
              <li><a href="availability.php">Live Slot Matrix</a></li>
            </ul>
          </div>

          <!-- Column 3: Help & Support -->
          <div class="footer-column">
            <h4 style="color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 16px; text-transform: uppercase;">Help & Support</h4>
            <ul class="footer-links" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
              <li><a href="contact.php">Facility Office Directory</a></li>
              <li><a href="contact.php#rules">Campus Reservation Rules</a></li>
              <li><a href="contact.php#faq">Frequently Asked Questions</a></li>
              <li><a href="contact.php#support">IT & AV Assistance</a></li>
              <li><a href="my-bookings.php">Check Request Status</a></li>
            </ul>
          </div>

          <!-- Column 4: Contact Information -->
          <div class="footer-column">
            <h4 style="color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 16px; text-transform: uppercase;">Campus Office</h4>
            <div class="footer-contact-item" style="display: flex; gap: 10px; margin-bottom: 10px; font-size: 0.86rem; color: #94a3b8;">
              <span style="color: #2dd4bf; font-weight: bold;">📍</span>
              <span>Central Estate & Facilities Wing, Room G-04, Technology Tower, Smart Campus University</span>
            </div>
            <div class="footer-contact-item" style="display: flex; gap: 10px; margin-bottom: 10px; font-size: 0.86rem; color: #94a3b8;">
              <span style="color: #38bdf8; font-weight: bold;">📞</span>
              <span>Helpline: +1 (555) 019-2834 (Ext. 4400)</span>
            </div>
            <div class="footer-contact-item" style="display: flex; gap: 10px; margin-bottom: 10px; font-size: 0.86rem; color: #94a3b8;">
              <span style="color: #2dd4bf; font-weight: bold;">✉️</span>
              <span>facilities-support@smartcampus.edu</span>
            </div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 8px;">
              Hours: Mon - Sat: 08:00 AM - 08:00 PM
            </div>
          </div>
        </div>

        <!-- Footer Bottom Bar (Demonstrating Inline Flex CSS) -->
        <div class="footer-bottom" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; color: #64748b; font-size: 0.82rem;">
          <div>
            &copy; <?= date('Y') ?> Smart Campus University Management System. All rights reserved.
          </div>
          <div style="display: flex; gap: 18px;">
            <a href="contact.php" style="color: #64748b;">Terms of Reservation</a>
            <span style="color: #334155;">&bull;</span>
            <a href="contact.php" style="color: #64748b;">IT Security & Privacy</a>
            <span style="color: #334155;">&bull;</span>
            <span style="color: #2dd4bf; font-weight: 600;">System v2.4 (Enterprise Edition)</span>
          </div>
        </div>
      </footer>
    </div>
    <!-- Main Wrapper ends -->
  </div>
  <!-- App Container ends -->

  <!-- =====================================================================
       Global Modals
       ===================================================================== -->
  
  <!-- 1. Facility Quick Details Modal -->
  <div class="modal-overlay" id="facilityDetailModal" role="dialog" aria-modal="true" aria-labelledby="modalFacilityTitle">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title" id="modalFacilityTitle">Facility Details</h3>
        <button class="modal-close-btn" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body">
        <div style="border-radius: var(--radius-lg); overflow: hidden; height: 240px; margin-bottom: 20px; background: #0f172a; position: relative;">
          <img id="modalFacilityImg" src="images/facility-1.jpg" onerror="this.onerror=null; this.src='images/facility-1.svg';" alt="Facility Image" style="width: 100%; height: 100%; object-fit: cover;">
          <span id="modalFacilityStatus" class="facility-status-badge status-Available" style="position: absolute; top: 14px; right: 14px;">Available</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Location / Floor</div>
            <div id="modalFacilityLoc" style="font-weight: 700; color: #0f172a;">Building, Floor</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Seating Capacity</div>
            <div id="modalFacilityCap" style="font-weight: 700; color: #0f172a;">100 Seats</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Operating Hours</div>
            <div id="modalFacilityHours" style="font-weight: 700; color: #0f172a;">08:00 AM - 08:00 PM</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Reservation Lead Time</div>
            <div style="font-weight: 700; color: #0d9488;">24 Hours Advance</div>
          </div>
        </div>

        <div style="margin-bottom: 18px;">
          <h4 style="font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Facility Description</h4>
          <p id="modalFacilityDesc" style="font-size: 0.88rem; color: #475569; line-height: 1.5;"></p>
        </div>

        <div style="margin-bottom: 18px;">
          <h4 style="font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Available Equipment & Tech</h4>
          <div id="modalFacilityEquip" class="equipment-chips"></div>
        </div>

        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Booking Rules & Protocol</h4>
          <p id="modalFacilityRules" style="font-size: 0.84rem; color: #64748b; background: #fffbeb; padding: 10px 14px; border-radius: var(--radius-sm); border-left: 3px solid #f59e0b;"></p>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn-reset modal-close-btn" style="padding: 10px 20px;">Close</button>
          <a id="modalFacilityBookBtn" href="booking.php" class="btn-submit" style="padding: 10px 24px; text-decoration: none;">Book This Space</a>
        </div>
      </div>
    </div>
  </div>

  <!-- 2. Cancel Booking Confirmation Modal -->
  <div class="modal-overlay" id="cancelBookingModal" role="dialog" aria-modal="true">
    <div class="modal-dialog" style="max-width: 480px;">
      <div class="modal-header">
        <h3 class="modal-title" style="color: #991b1b;">Confirm Cancellation</h3>
        <button class="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form method="POST" action="my-bookings.php">
          <input type="hidden" name="action" value="cancel_booking">
          <input type="hidden" name="booking_id" id="cancelBookingIdInput" value="">
          
          <p style="font-size: 0.95rem; color: #334155; margin-bottom: 16px;">
            Are you sure you want to cancel booking request <strong id="cancelBookingIdText" style="color: #0f172a;"></strong>?
          </p>
          <p style="font-size: 0.84rem; color: #64748b; background: #fef2f2; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid #fecaca; margin-bottom: 24px;">
            This action will release the reserved time slot back into the campus availability pool and mark your booking status as <strong>Cancelled</strong>.
          </p>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="button" class="btn-reset modal-close-btn" style="padding: 9px 18px;">Keep Booking</button>
            <button type="submit" class="btn-submit" style="background: #dc2626; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35); padding: 9px 22px;">
              Yes, Cancel Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- =====================================================================
       Dedicated Booking Confirmation Slip (Printed Only on window.print())
       ===================================================================== -->
  <div id="booking-confirmation-slip" class="print-slip-container" aria-label="Official Booking Confirmation Slip">
    <!-- Institutional Header -->
    <div class="slip-header-wrap">
      <div class="slip-brand-left">
        <div class="slip-crest-icon">
          <svg width="28" height="28" viewBox="0 0 60 60" fill="none">
            <rect width="60" height="60" rx="12" fill="#0f172a"/>
            <path d="M 30 14 L 48 24 L 30 34 L 12 24 Z" fill="#0d9488"/>
            <path d="M 44 27 L 44 40 C 44 44, 16 44, 16 40 L 16 27" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="30" cy="42" r="3" fill="#2dd4bf"/>
          </svg>
        </div>
        <div>
          <h2 class="slip-inst-title">SMART CAMPUS UNIVERSITY</h2>
          <div class="slip-inst-sub">Estate & Campus Facilities Management Division</div>
        </div>
      </div>
      <div class="slip-status-pill slip-status-Confirmed" id="slipStatusBadge">
        <span id="slipStatusText">CONFIRMED</span>
      </div>
    </div>

    <!-- Title Bar -->
    <div class="slip-heading-bar">
      <h1 class="slip-main-title">SMART CAMPUS FACILITY BOOKING</h1>
      <h3 class="slip-sub-title">OFFICIAL BOOKING CONFIRMATION SLIP</h3>
    </div>

    <!-- Neatly Aligned Information Table -->
    <table class="slip-info-table">
      <tbody>
        <tr>
          <th>Booking ID</th>
          <td><span class="slip-booking-id-val" id="slipBookingId">BK-2026-1041</span></td>
          <th>Booking Status</th>
          <td><span id="slipStatusVal" style="font-weight: 800; color: #065f46;">Confirmed</span></td>
        </tr>
        <tr>
          <th>Faculty Name</th>
          <td><span id="slipFacultyName">Dr. Sarah Jenkins</span></td>
          <th>Faculty ID</th>
          <td><span id="slipFacultyId">FAC-1042</span></td>
        </tr>
        <tr>
          <th>Department</th>
          <td><span id="slipDepartment">Computer Science & Engineering</span></td>
          <th>Email Address</th>
          <td><span id="slipEmail">s.jenkins@smartcampus.edu</span></td>
        </tr>
        <tr>
          <th>Facility Name</th>
          <td colspan="3" class="slip-col-wide">
            <span class="slip-facility-highlight" id="slipFacilityName">Seminar Hall A</span>
          </td>
        </tr>
        <tr>
          <th>Facility Location</th>
          <td colspan="3" class="slip-col-wide">
            <span id="slipFacilityLoc">Ramanujan Academic Block, 2nd Floor, Room 204</span>
          </td>
        </tr>
        <tr>
          <th>Booking Date</th>
          <td><span id="slipBookingDate" style="font-weight: 700;">Monday, 16 Nov 2026</span></td>
          <th>Reserved Time Slot</th>
          <td><span id="slipTimeWindow" style="font-weight: 700; color: #0284c7;">10:00 AM - 12:00 PM</span></td>
        </tr>
        <tr>
          <th>Participants</th>
          <td><span id="slipParticipants">140 Attendees</span></td>
          <th>Submission Date</th>
          <td><span id="slipSubmittedDate">15 Nov 2026, 11:15 AM</span></td>
        </tr>
        <tr>
          <th>Purpose of Booking</th>
          <td colspan="3" class="slip-col-wide">
            <span id="slipPurpose" style="font-weight: 600;">Special Lecture: Generative AI & Autonomous Systems</span>
          </td>
        </tr>
        <tr id="slipEquipmentRow">
          <th>Equipment Requested</th>
          <td colspan="3" class="slip-col-wide">
            <span id="slipEquipment" style="color: #0f766e; font-weight: 600;">4K Laser Projector, Wireless Microphones, Stage Lighting, Podium PC</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Signatures & Official Seal -->
    <div class="slip-signatures-row">
      <div class="slip-sig-block">
        <div class="slip-sig-line"></div>
        <div class="slip-sig-name">Faculty Member Signature</div>
      </div>
      <div class="slip-seal-stamp">
        <span>SMART CAMPUS</span>
        <span style="font-size: 0.5rem; letter-spacing: 0.5px;">ESTATE OFFICE</span>
        <span style="color: #047857; font-size: 0.52rem;">VERIFIED</span>
      </div>
      <div class="slip-sig-block">
        <div class="slip-sig-line"></div>
        <div class="slip-sig-name">Estate Office Authorized Officer</div>
      </div>
    </div>

    <!-- Footer Notice -->
    <div class="slip-footer-bar">
      <p style="margin: 0 0 3px 0; font-size: 0.85rem; font-weight: 700; color: #0f172a;">
        This is a system-generated booking confirmation.
      </p>
      <p style="margin: 0; font-size: 0.72rem; color: #64748b;">
        Valid across campus blocks with faculty digital authorization &bull; Smart Campus University Portal
      </p>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div id="toastContainer" class="toast-container"></div>

  <!-- External JavaScript (Demonstrating Section 5 JavaScript Functionality) -->
  <script src="js/script.js"></script>
</body>
</html>
