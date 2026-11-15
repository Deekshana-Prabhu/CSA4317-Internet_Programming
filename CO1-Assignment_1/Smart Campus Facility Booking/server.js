/**
 * Smart Campus Facility Booking System
 * Localhost Development & Live Preview Server
 * Built with pure Node.js (Zero external dependencies required)
 * Allows running the full website on localhost:8000 immediately!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const PORT = process.env.PORT || 8000;
const ROOT_DIR = __dirname;

// Active Faculty Session
const facultySession = {
  faculty_id: 'FAC-1042',
  faculty_name: 'Dr. Sarah Jenkins',
  faculty_dept: 'Computer Science & Engineering',
  faculty_email: 's.jenkins@smartcampus.edu',
  faculty_phone: '+1 (555) 234-5678'
};

// Facility Store (12 Facilities matching smart_campus.sql)
const facilities = [
  {
    facility_id: 1,
    facility_code: 'FACIL-001',
    facility_name: 'Seminar Hall A',
    location: 'Ramanujan Academic Block, 2nd Floor',
    building: 'Ramanujan Academic Block',
    floor: '2nd Floor, Room 204',
    capacity: 180,
    equipment: '4K Laser Projector, Surround Sound, Wireless Microphones, Stage Lighting, Podium PC, High-Speed Wi-Fi',
    description: 'Spacious tiered auditorium designed for academic keynote lectures, inter-college seminars, and guest presentations with state-of-the-art acoustic cladding.',
    operating_hours: '08:00 AM - 08:00 PM',
    availability_status: 'Available',
    image_url: 'images/facility-1.jpg',
    category: 'Auditorium & Hall',
    booking_rules: 'Booking must be made at least 24 hours in advance. Technical assistant required for stage lighting console. Food and refreshments restricted to foyer area.'
  },
  {
    facility_id: 2,
    facility_code: 'FACIL-002',
    facility_name: 'Seminar Hall B',
    location: 'Ramanujan Academic Block, 1st Floor',
    building: 'Ramanujan Academic Block',
    floor: '1st Floor, Room 108',
    capacity: 120,
    equipment: 'HD Projector, Dual Microphones, PA System, Video Conferencing, Smart Interactive Board, Air Conditioning',
    description: 'Contemporary seminar hall tailored for departmental symposiums, guest speaker interactions, and faculty panel conferences with flexible seating.',
    operating_hours: '08:00 AM - 07:00 PM',
    availability_status: 'Available',
    image_url: 'images/facility-2.jpg',
    category: 'Auditorium & Hall',
    booking_rules: 'Reserve 12 hours ahead. AV check 15 minutes before the session starts. All equipment must be powered down following completion.'
  },
  {
    facility_id: 3,
    facility_code: 'FACIL-003',
    facility_name: 'Computer Laboratory',
    location: 'Turing IT Center, 3rd Floor',
    building: 'Turing IT Center',
    floor: '3rd Floor, Lab 301',
    capacity: 60,
    equipment: '60 High-Performance Workstations, Gigabit LAN, Overhead Projector, Centralized UPS, Dual Gigabit Switches',
    description: 'State-of-the-art computing facility equipped with high-spec desktop machines for programming examinations, hackathons, and software engineering practicals.',
    operating_hours: '08:30 AM - 07:30 PM',
    availability_status: 'Booked',
    image_url: 'images/facility-3.jpg',
    category: 'Laboratory',
    booking_rules: 'Student attendance logs must be maintained. External USB storage devices restricted without administrator clearance. Strictly no beverages inside.'
  },
  {
    facility_id: 4,
    facility_code: 'FACIL-004',
    facility_name: 'AI & ML Laboratory',
    location: 'Turing IT Center, 4th Floor',
    building: 'Turing IT Center',
    floor: '4th Floor, Lab 402',
    capacity: 45,
    equipment: 'NVIDIA RTX GPU Workstations, Cloud ML Compute Rack, Dual Presentation Displays, Interactive Digital Whiteboard',
    description: 'Specialized deep learning and computer vision laboratory with dedicated GPU compute servers for advanced research, model training, and capstone projects.',
    operating_hours: '08:00 AM - 08:00 PM',
    availability_status: 'Available',
    image_url: 'images/facility-4.jpg',
    category: 'Laboratory',
    booking_rules: 'Workstation reservations prioritize departmental AI research and scheduled practical labs. Compute jobs must comply with campus power policies.'
  },
  {
    facility_id: 5,
    facility_code: 'FACIL-005',
    facility_name: 'Conference Room',
    location: 'Administrative Tower, 2nd Floor',
    building: 'Administrative Tower',
    floor: '2nd Floor, Room 210',
    capacity: 35,
    equipment: 'Polycom 4K Video Bridge, 75" UHD Touch Display, Omni-Directional Mics, Executive Ergonomic Seating, Teleconference Audio',
    description: 'Executive conference suite designed for board meetings, administrative panels, accreditation reviews, and collaborative hybrid video conferences.',
    operating_hours: '08:00 AM - 06:30 PM',
    availability_status: 'Booked',
    image_url: 'images/facility-5.jpg',
    category: 'Conference Room',
    booking_rules: 'Head of Department or Dean approval required for external visitors. Teleconference bridge links should be requested at least 6 hours prior.'
  },
  {
    facility_id: 6,
    facility_code: 'FACIL-006',
    facility_name: 'Auditorium',
    location: 'Grand Arts & Cultural Complex, 1st Floor',
    building: 'Grand Arts & Cultural Complex',
    floor: 'Ground & 1st Floor',
    capacity: 600,
    equipment: 'Concert-Grade Line-Array Acoustics, Motorized 300" Projection Screen, Green Rooms, Stage Rigging, Live Stream Broadcast Setup',
    description: 'The premier venue of the university campus for annual convocations, national conferences, cultural fests, and distinguished presidential addresses.',
    operating_hours: '08:00 AM - 09:00 PM',
    availability_status: 'Booked',
    image_url: 'images/facility-6.jpg',
    category: 'Auditorium & Hall',
    booking_rules: 'Booking requires Dean or Campus Director endorsement. Stage management and electrical crew must be assigned 48 hours prior to the event.'
  },
  {
    facility_id: 7,
    facility_code: 'FACIL-007',
    facility_name: 'Innovation Hub',
    location: 'Technology Incubation Block, 1st Floor',
    building: 'Technology Incubation Block',
    floor: '1st Floor, Suite 101',
    capacity: 50,
    equipment: '3D Printers, Prototyping Workbenches, Modular Collaborative Furniture, Brainstorming Glass Walls, IoT Development Kits',
    description: 'Dynamic creative ideation and rapid prototyping maker space where students and faculty incubate startup ventures, patent prototypes, and design solutions.',
    operating_hours: '08:00 AM - 08:00 PM',
    availability_status: 'Available',
    image_url: 'images/facility-7.jpg',
    category: 'Innovation Space',
    booking_rules: 'Safety goggles mandatory when operating fabrication machinery and 3D printing equipment. Clean work area upon completion.'
  },
  {
    facility_id: 8,
    facility_code: 'FACIL-008',
    facility_name: 'Research Laboratory',
    location: 'Science & Engineering Wing, 2nd Floor',
    building: 'Science & Engineering Wing',
    floor: '2nd Floor, Room 215',
    capacity: 30,
    equipment: 'Precision Measurement Units, Digital Oscilloscopes, RF Spectrum Analyzers, Isolated Power Benches, ESD Clean Mats',
    description: 'Advanced multidisciplinary laboratory dedicated to postgraduate research, circuit synthesis, sensor testing, and experimental validation.',
    operating_hours: '08:00 AM - 08:00 PM',
    availability_status: 'Booked',
    image_url: 'images/facility-8.jpg',
    category: 'Laboratory',
    booking_rules: 'Authorized research scholars and faculty only. Chemical handling protocols and static charge grounding are mandatory.'
  },
  {
    facility_id: 9,
    facility_code: 'FACIL-009',
    facility_name: 'Digital Learning Room',
    location: 'Central Library Wing, 2nd Floor',
    building: 'Central Library Wing',
    floor: '2nd Floor, Room 205',
    capacity: 40,
    equipment: 'Lecture Capture Multi-Cam, Wireless Screen Mirroring, VR Headsets, Student Response Clickers, Ceiling Microphones',
    description: 'Next-generation smart classroom optimized for hybrid distance learning, MOOC recording, interactive simulations, and flipped classroom pedagogy.',
    operating_hours: '08:30 AM - 07:00 PM',
    availability_status: 'Available',
    image_url: 'images/facility-9.jpg',
    category: 'Digital Learning',
    booking_rules: 'Recording storage quota assigned per faculty. Camera calibration should be completed 10 minutes prior to session onset.'
  },
  {
    facility_id: 10,
    facility_code: 'FACIL-010',
    facility_name: 'Meeting Room',
    location: 'Administrative Tower, 1st Floor',
    building: 'Administrative Tower',
    floor: '1st Floor, Room 104',
    capacity: 16,
    equipment: 'Video Conferencing System, 55" Display, Whiteboard, Speakerphone, HDMI Matrix Switcher, High-Speed Wi-Fi',
    description: 'Intimate meeting room perfect for thesis defenses, interview committees, faculty recruitment, and cross-departmental coordination huddles.',
    operating_hours: '08:00 AM - 06:00 PM',
    availability_status: 'Available',
    image_url: 'images/facility-10.jpg',
    category: 'Conference Room',
    booking_rules: 'Drop-in bookings subject to minimum 1-hour notice. Whiteboards should be erased after each session.'
  },
  {
    facility_id: 11,
    facility_code: 'FACIL-011',
    facility_name: 'Executive Boardroom',
    location: 'Chancellery Block, 3rd Floor',
    building: 'Chancellery Block',
    floor: '3rd Floor, Suite 300',
    capacity: 24,
    equipment: 'Biometric Access, 85" Ultra-HD Display, Integrated Table Mics, Executive Video Bridge, Document Camera, Privacy Blinds',
    description: 'High-level executive boardroom with panoramic campus views, tailored for Senate summits, international delegation talks, and Chancellor councils.',
    operating_hours: '08:00 AM - 06:00 PM',
    availability_status: 'Available',
    image_url: 'images/facility-11.jpg',
    category: 'Conference Room',
    booking_rules: 'Requires Vice-Chancellor or Registrar office clearance. Protocol catering service available on request.'
  },
  {
    facility_id: 12,
    facility_code: 'FACIL-012',
    facility_name: 'IoT & Robotics Studio',
    location: 'Technology Incubation Block, 2nd Floor',
    building: 'Technology Incubation Block',
    floor: '2nd Floor, Studio 202',
    capacity: 35,
    equipment: 'Robotic Arms, Embedded Development Kits, Soldering Stations, Drone Test Cage, High-Speed Camera, Signal Generators',
    description: 'Specialized experimental robotics and automated systems proving ground featuring autonomous rover testing courses and aerial drone nets.',
    operating_hours: '08:30 AM - 07:30 PM',
    availability_status: 'Available',
    image_url: 'images/facility-12.jpg',
    category: 'Innovation Space',
    booking_rules: 'Drone flight testing strictly inside test cage. Safety circuit breaker must be activated during soldering tasks.'
  }
];

// Helper: Dates
const todayStr = new Date().toISOString().split('T')[0];
const tomorrowDate = new Date(); tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrowStr = tomorrowDate.toISOString().split('T')[0];
const day2Date = new Date(); day2Date.setDate(day2Date.getDate() + 2);
const day2Str = day2Date.toISOString().split('T')[0];
const day3Date = new Date(); day3Date.setDate(day3Date.getDate() + 3);
const day3Str = day3Date.toISOString().split('T')[0];

// Bookings Store (Seed bookings matching smart_campus.sql)
let bookings = [
  {
    booking_id: 'BK-2026-1041',
    faculty_id: 'FAC-1042',
    faculty_name: 'Dr. Sarah Jenkins',
    facility_id: 3,
    facility_name: 'Computer Laboratory',
    location: 'Turing IT Center, 3rd Floor',
    booking_date: todayStr,
    start_time: '09:00:00',
    end_time: '12:00:00',
    participant_count: 55,
    booking_purpose: 'Advanced Cloud Computing Practical Examination',
    special_requirements: 'Ensure local server instances and compiler binaries are loaded on all 60 systems.',
    equipment_required: 'Workstation Access, Overhead Projector, High-Speed Wi-Fi / LAN',
    booking_status: 'Approved',
    created_at: '2026-11-13 10:00:00'
  },
  {
    booking_id: 'BK-2026-1042',
    faculty_id: 'FAC-1088',
    faculty_name: 'Prof. Robert Martinez',
    facility_id: 5,
    facility_name: 'Conference Room',
    location: 'Administrative Tower, 2nd Floor',
    booking_date: todayStr,
    start_time: '10:00:00',
    end_time: '12:30:00',
    participant_count: 28,
    booking_purpose: 'ABET & NBA Accreditation Strategy Review',
    special_requirements: 'Teleconference link with external evaluators and water service required.',
    equipment_required: 'Polycom 4K Video Bridge, 75" UHD Touch Display, Omni-Directional Mics',
    booking_status: 'Approved',
    created_at: '2026-11-12 11:30:00'
  },
  {
    booking_id: 'BK-2026-1043',
    faculty_id: 'FAC-1215',
    faculty_name: 'Prof. Anita Deshmukh',
    facility_id: 6,
    facility_name: 'Auditorium',
    location: 'Grand Arts & Cultural Complex, 1st Floor',
    booking_date: todayStr,
    start_time: '13:30:00',
    end_time: '17:30:00',
    participant_count: 450,
    booking_purpose: 'Annual International Engineering Colloquium & Keynote',
    special_requirements: 'Podium mic, floral stage arrangement, live streaming to alumni YouTube channel.',
    equipment_required: 'Concert-Grade Line-Array Acoustics, Motorized 300" Projection Screen, Stage Rigging',
    booking_status: 'Approved',
    created_at: '2026-11-10 09:15:00'
  },
  {
    booking_id: 'BK-2026-1044',
    faculty_id: 'FAC-1105',
    faculty_name: 'Dr. Elena Rostova',
    facility_id: 8,
    facility_name: 'Research Laboratory',
    location: 'Science & Engineering Wing, 2nd Floor',
    booking_date: todayStr,
    start_time: '14:00:00',
    end_time: '17:00:00',
    participant_count: 22,
    booking_purpose: 'Departmental Quantum Sensors Testing & Data Collection',
    special_requirements: 'Calibrated RF analyzers and cleanroom air filters must be running.',
    equipment_required: 'Precision Measurement Units, Digital Oscilloscopes, RF Spectrum Analyzers',
    booking_status: 'Approved',
    created_at: '2026-11-14 16:45:00'
  },
  {
    booking_id: 'BK-2026-1081',
    faculty_id: 'FAC-1042',
    faculty_name: 'Dr. Sarah Jenkins',
    facility_id: 1,
    facility_name: 'Seminar Hall A',
    location: 'Ramanujan Academic Block, 2nd Floor',
    booking_date: tomorrowStr,
    start_time: '10:00:00',
    end_time: '12:00:00',
    participant_count: 140,
    booking_purpose: 'Special Lecture: Generative AI & Autonomous Systems',
    special_requirements: 'Stage podium with wireless collar mic and dual slide presenter clicker.',
    equipment_required: '4K Laser Projector, Wireless Microphones, Stage Lighting, Podium PC',
    booking_status: 'Pending',
    created_at: '2026-11-15 08:00:00'
  },
  {
    booking_id: 'BK-2026-1082',
    faculty_id: 'FAC-1140',
    faculty_name: 'Dr. Marcus Vance',
    facility_id: 7,
    facility_name: 'Innovation Hub',
    location: 'Technology Incubation Block, 1st Floor',
    booking_date: day2Str,
    start_time: '14:00:00',
    end_time: '17:00:00',
    participant_count: 40,
    booking_purpose: 'Inter-College Smart India Hackathon Ideation Session',
    special_requirements: 'Access to modular whiteboards and 3D printing filament stocks.',
    equipment_required: '3D Printers, Prototyping Workbenches, Modular Furniture',
    booking_status: 'Pending',
    created_at: '2026-11-15 06:30:00'
  },
  {
    booking_id: 'BK-2026-1083',
    faculty_id: 'FAC-1088',
    faculty_name: 'Prof. Robert Martinez',
    facility_id: 4,
    facility_name: 'AI & ML Laboratory',
    location: 'Turing IT Center, 4th Floor',
    booking_date: day3Str,
    start_time: '11:00:00',
    end_time: '13:00:00',
    participant_count: 38,
    booking_purpose: 'NVIDIA CUDA Deep Learning Accelerated Workshop',
    special_requirements: 'Allocate student accounts on the GPU cluster beforehand.',
    equipment_required: 'NVIDIA RTX GPU Workstations, Cloud ML Compute Rack',
    booking_status: 'Pending',
    created_at: '2026-11-14 22:00:00'
  },
  {
    booking_id: 'BK-2026-0912',
    faculty_id: 'FAC-1042',
    faculty_name: 'Dr. Sarah Jenkins',
    facility_id: 2,
    facility_name: 'Seminar Hall B',
    location: 'Ramanujan Academic Block, 1st Floor',
    booking_date: '2026-11-10',
    start_time: '09:30:00',
    end_time: '11:30:00',
    participant_count: 95,
    booking_purpose: 'Faculty Development Program on Cloud Microservices',
    special_requirements: 'Setup recording camera and pass-around cordless microphone.',
    equipment_required: 'HD Projector, Dual Microphones, PA System',
    booking_status: 'Approved',
    created_at: '2026-11-05 10:00:00'
  },
  {
    booking_id: 'BK-2026-0920',
    faculty_id: 'FAC-1042',
    faculty_name: 'Dr. Sarah Jenkins',
    facility_id: 9,
    facility_name: 'Digital Learning Room',
    location: 'Central Library Wing, 2nd Floor',
    booking_date: '2026-11-07',
    start_time: '15:00:00',
    end_time: '16:30:00',
    participant_count: 30,
    booking_purpose: 'Recorded Demonstration for NPTEL Online Course',
    special_requirements: 'Microphone battery check and green screen background adjustment.',
    equipment_required: 'Lecture Capture Multi-Cam, Wireless Screen Mirroring',
    booking_status: 'Cancelled',
    created_at: '2026-11-01 14:00:00'
  }
];

// Helper: Conflict Check
function hasBookingConflict(facilityId, date, startTime, endTime, excludeBookingId = null) {
  const newStart = new Date(`${date}T${startTime}`).getTime();
  const newEnd = new Date(`${date}T${endTime}`).getTime();

  for (const b of bookings) {
    if (b.facility_id === facilityId && b.booking_date === date && ['Approved', 'Pending'].includes(b.booking_status)) {
      if (excludeBookingId && b.booking_id === excludeBookingId) continue;
      const bStart = new Date(`${b.booking_date}T${b.start_time}`).getTime();
      const bEnd = new Date(`${b.booking_date}T${b.end_time}`).getTime();

      // Overlap condition
      if (!(newEnd <= bStart || newStart >= bEnd)) {
        return true;
      }
    }
  }
  return false;
}

// Helper: Time slots for availability
function getSlotsForFacility(facilityId, date) {
  const slotsConfig = [
    { start: '08:00:00', end: '09:30:00', label: '08:00 AM - 09:30 AM' },
    { start: '09:30:00', end: '11:00:00', label: '09:30 AM - 11:00 AM' },
    { start: '11:00:00', end: '12:30:00', label: '11:00 AM - 12:30 PM' },
    { start: '12:30:00', end: '01:30:00', label: '12:30 PM - 01:30 PM (Maintenance)' },
    { start: '01:30:00', end: '03:00:00', label: '01:30 PM - 03:00 PM' },
    { start: '03:00:00', end: '04:30:00', label: '03:00 PM - 04:30 PM' },
    { start: '04:30:00', end: '06:00:00', label: '04:30 PM - 06:00 PM' },
    { start: '06:00:00', end: '07:30:00', label: '06:00 PM - 07:30 PM' }
  ];

  return slotsConfig.map(slot => {
    let status = 'available';
    let bookingObj = null;
    if (slot.start === '12:30:00') {
      status = 'maintenance';
    } else {
      const slotStart = new Date(`${date}T${slot.start}`).getTime();
      const slotEnd = new Date(`${date}T${slot.end}`).getTime();

      for (const b of bookings) {
        if (b.facility_id === facilityId && b.booking_date === date && ['Approved', 'Pending'].includes(b.booking_status)) {
          const bStart = new Date(`${b.booking_date}T${b.start_time}`).getTime();
          const bEnd = new Date(`${b.booking_date}T${b.end_time}`).getTime();

          if (!(slotEnd <= bStart || slotStart >= bEnd)) {
            if (b.booking_status === 'Approved') {
              status = 'booked';
              bookingObj = b;
              break;
            } else if (b.booking_status === 'Pending') {
              status = 'pending';
              bookingObj = b;
            }
          }
        }
      }
    }
    return {
      label: slot.label,
      start_time: slot.start,
      end_time: slot.end,
      status,
      booking: bookingObj
    };
  });
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json'
};

// Common Layout Helpers
function renderHeader(title, activeNav) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Smart Campus</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
  <style>
    @keyframes headerPulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); }
      70% { box-shadow: 0 0 0 8px rgba(20, 184, 166, 0); }
      100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); }
    }
    .internal-css-active-badge { animation: headerPulseGlow 2.5s infinite; }
  </style>
</head>
<body>
  <div class="sidebar-backdrop" id="sidebarBackdrop"></div>
  <div class="app-container">
    <aside class="sidebar" id="mainSidebar">
      <div class="sidebar-header">
        <a href="/" class="sidebar-brand">
          <div class="brand-icon">🏛️</div>
          <div class="brand-text">
            <h2>SMART<span>CAMPUS</span></h2>
            <p>FACILITY PORTAL</p>
          </div>
        </a>
      </div>
      <nav class="nav-menu">
        <div class="nav-section-title">Main Management</div>
        <li class="nav-item">
          <a href="/" class="nav-link ${activeNav === 'dashboard' ? 'active' : ''}">
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="/facilities.php" class="nav-link ${activeNav === 'facilities' ? 'active' : ''}">
            <span class="nav-icon">🏢</span>
            <span>Explore Facilities</span>
            <span class="nav-badge">12</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="/availability.php" class="nav-link ${activeNav === 'availability' ? 'active' : ''}">
            <span class="nav-icon">📅</span>
            <span>Room Availability</span>
          </a>
        </li>
        <div class="nav-section-title">Reservations</div>
        <li class="nav-item">
          <a href="/booking.php" class="nav-link ${activeNav === 'booking' ? 'active' : ''}">
            <span class="nav-icon">✍️</span>
            <span>Book a Facility</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="/my-bookings.php" class="nav-link ${activeNav === 'my-bookings' ? 'active' : ''}">
            <span class="nav-icon">📋</span>
            <span>My Bookings</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="/my-bookings.php?tab=history" class="nav-link ${activeNav === 'history' ? 'active' : ''}">
            <span class="nav-icon">🕒</span>
            <span>Booking History</span>
          </a>
        </li>
        <div class="nav-section-title">Support & Campus</div>
        <li class="nav-item">
          <a href="/contact.php" class="nav-link ${activeNav === 'contact' ? 'active' : ''}">
            <span class="nav-icon">📞</span>
            <span>Contact / Help</span>
          </a>
        </li>
      </nav>
      <div class="sidebar-profile">
        <div class="profile-avatar-wrap">
          <img src="/images/avatar-faculty.svg" alt="Faculty" class="profile-avatar">
          <span class="online-dot"></span>
        </div>
        <div class="profile-info">
          <div class="profile-name">${facultySession.faculty_name}</div>
          <div class="profile-dept">${facultySession.faculty_dept}</div>
          <div style="font-size: 0.68rem; color: var(--teal-400); font-weight: 700; margin-top: 2px;">
            ID: ${facultySession.faculty_id}
          </div>
        </div>
      </div>
    </aside>

    <div class="main-wrapper">
      <header class="top-navbar">
        <div class="top-nav-left">
          <button class="mobile-toggle" id="mobileToggleBtn">☰</button>
          <div class="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search facilities, halls, labs..." onkeydown="if(event.key==='Enter') window.location.href='/facilities.php?search='+encodeURIComponent(this.value)">
          </div>
        </div>
        <div class="top-nav-right">
          <div class="date-indicator">
            <span class="dot"></span>
            <span>${new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <button class="icon-btn" onclick="window.location.href='/my-bookings.php?tab=pending'" title="Pending Requests">
            🔔
            <span class="icon-badge">3</span>
          </button>
          <a href="/booking.php" class="btn-quick-book internal-css-active-badge">
            <span>+ Book Space</span>
          </a>
        </div>
      </header>
      <main class="main-content">`;
}

function renderFooter() {
  return `</main>
      <footer class="site-footer" style="position: relative; overflow: hidden; background: #0f172a;">
        <div class="footer-content" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 32px;">
          <div class="footer-brand">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
              <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #0284c7, #0d9488); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">SC</div>
              <h3 style="margin: 0; font-size: 1.2rem; color: #fff;">SMART<span style="color: #2dd4bf;">CAMPUS</span></h3>
            </div>
            <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6; margin-bottom: 16px;">
              Premier autonomous university facility management portal, empowering faculty members with transparent room scheduling, high-tech lab bookings, and auditorium reservations.
            </p>
          </div>
          <div class="footer-column">
            <h4 style="color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 16px;">Quick Spaces</h4>
            <ul class="footer-links">
              <li><a href="/facilities.php?category=Auditorium+%26+Hall">Auditoriums & Halls</a></li>
              <li><a href="/facilities.php?category=Laboratory">Computer & AI Labs</a></li>
              <li><a href="/facilities.php?category=Conference+Room">Conference Suites</a></li>
              <li><a href="/availability.php">Live Slot Matrix</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4 style="color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 16px;">Help & Support</h4>
            <ul class="footer-links">
              <li><a href="/contact.php">Facility Office Directory</a></li>
              <li><a href="/contact.php#rules">Campus Reservation Rules</a></li>
              <li><a href="/contact.php#faq">Frequently Asked Questions</a></li>
              <li><a href="/my-bookings.php">My Bookings Status</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4 style="color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 16px;">Campus Office</h4>
            <div class="footer-contact-item">📍 Technology Tower, Room G-04</div>
            <div class="footer-contact-item">📞 Helpline: +1 (555) 019-2834 (Ext. 4400)</div>
            <div class="footer-contact-item">✉️ facilities-support@smartcampus.edu</div>
          </div>
        </div>
        <div class="footer-bottom" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; color: #64748b; font-size: 0.82rem;">
          <div>&copy; 2026 Smart Campus University Management System. All rights reserved.</div>
          <div style="color: #2dd4bf; font-weight: 600;">System v2.4 (Enterprise Edition - Localhost)</div>
        </div>
      </footer>
    </div>
  </div>

  <!-- Facility Details Modal -->
  <div class="modal-overlay" id="facilityDetailModal">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title" id="modalFacilityTitle">Facility Details</h3>
        <button class="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div style="border-radius: var(--radius-lg); overflow: hidden; height: 240px; margin-bottom: 20px; background: #0f172a; position: relative;">
          <img id="modalFacilityImg" src="/images/facility-1.jpg" alt="Facility Image" style="width: 100%; height: 100%; object-fit: cover;">
          <span id="modalFacilityStatus" class="facility-status-badge status-Available" style="position: absolute; top: 14px; right: 14px;">Available</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Location / Floor</div>
            <div id="modalFacilityLoc" style="font-weight: 700; color: #0f172a;">Building</div>
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
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Reservation Policy</div>
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
          <a id="modalFacilityBookBtn" href="/booking.php" class="btn-submit" style="padding: 10px 24px; text-decoration: none;">Book This Space</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Cancel Booking Modal -->
  <div class="modal-overlay" id="cancelBookingModal">
    <div class="modal-dialog" style="max-width: 480px;">
      <div class="modal-header">
        <h3 class="modal-title" style="color: #991b1b;">Confirm Cancellation</h3>
        <button class="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form method="POST" action="/my-bookings.php">
          <input type="hidden" name="action" value="cancel_booking">
          <input type="hidden" name="booking_id" id="cancelBookingIdInput" value="">
          <p style="font-size: 0.95rem; color: #334155; margin-bottom: 16px;">
            Are you sure you want to cancel booking <strong id="cancelBookingIdText"></strong>?
          </p>
          <p style="font-size: 0.84rem; color: #64748b; background: #fef2f2; padding: 10px 14px; border-radius: 8px; border: 1px solid #fecaca; margin-bottom: 24px;">
            This will release the reserved time slot back into the campus availability pool and mark status as <strong>Cancelled</strong>.
          </p>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="button" class="btn-reset modal-close-btn">Keep Booking</button>
            <button type="submit" class="btn-submit" style="background: #dc2626;">Yes, Cancel Booking</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Dedicated Booking Confirmation Slip (Printed Only on window.print()) -->
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

  <div id="toastContainer" class="toast-container"></div>
  <script src="/js/script.js"></script>
</body>
</html>`;
}

// Router
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Static Assets: CSS, JS, SVG Images
  if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/images/')) {
    const filePath = path.join(ROOT_DIR, pathname);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Handle POST requests
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const postData = querystring.parse(body);

      // 1. Booking submission
      if (pathname === '/booking.php') {
        const facId = parseInt(postData.facility_id, 10);
        const bDate = postData.booking_date;
        const sTime = postData.start_time;
        const eTime = postData.end_time;
        const pCount = parseInt(postData.participant_count, 10);
        const purpose = postData.booking_purpose;
        const special = postData.special_requirements || '';
        const equip = Array.isArray(postData['equipment_required[]']) 
          ? postData['equipment_required[]'].join(', ') 
          : (postData['equipment_required[]'] || '');

        const targetFac = facilities.find(f => f.facility_id === facId);
        let error = null;

        if (!targetFac) error = 'Please select a valid facility space.';
        else if (new Date(bDate) < new Date(todayStr)) error = 'Booking date cannot be in the past.';
        else if (sTime >= eTime) error = 'End time must be after start time.';
        else if (pCount <= 0) error = 'Participant count must be at least 1.';
        else if (!purpose) error = 'Purpose of booking is required.';
        else if (hasBookingConflict(facId, bDate, sTime, eTime)) {
          error = `Conflict Detected: ${targetFac.facility_name} is already booked on ${bDate} between ${sTime} and ${eTime}.`;
        }

        if (error) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(renderBookingPage({ error, preFill: postData }));
        } else {
          const bookingId = 'BK-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
          const newBooking = {
            booking_id: bookingId,
            faculty_id: facultySession.faculty_id,
            faculty_name: facultySession.faculty_name,
            facility_id: facId,
            facility_name: targetFac.facility_name,
            location: targetFac.location,
            booking_date: bDate,
            start_time: sTime,
            end_time: eTime,
            participant_count: pCount,
            booking_purpose: purpose,
            special_requirements: special,
            equipment_required: equip,
            booking_status: 'Pending',
            created_at: new Date().toISOString()
          };
          bookings.unshift(newBooking);

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(renderBookingPage({ confirmed: newBooking }));
        }
        return;
      }

      // 2. Cancel Booking
      if (pathname === '/my-bookings.php' && postData.action === 'cancel_booking') {
        const cancelId = postData.booking_id;
        const b = bookings.find(item => item.booking_id === cancelId);
        if (b) {
          b.booking_status = 'Cancelled';
        }
        res.writeHead(302, { 'Location': '/my-bookings.php?feedback=cancelled' });
        res.end();
        return;
      }

      // 3. Contact form inquiry
      if (pathname === '/contact.php') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderContactPage('Thank you! Your inquiry has been submitted to the Central Estate Office. Reference Ticket: SUP-' + Math.floor(1000 + Math.random() * 9000)));
        return;
      }
    });
    return;
  }

  // Handle GET Pages
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  if (pathname === '/' || pathname === '/index.php' || pathname === '/dashboard.php') {
    res.end(renderDashboard());
  } else if (pathname === '/facilities.php') {
    res.end(renderFacilities(query));
  } else if (pathname === '/facility-details.php') {
    res.end(renderFacilityDetails(query));
  } else if (pathname === '/availability.php') {
    res.end(renderAvailability(query));
  } else if (pathname === '/booking.php') {
    res.end(renderBookingPage({ preFill: query }));
  } else if (pathname === '/my-bookings.php') {
    res.end(renderMyBookings(query));
  } else if (pathname === '/contact.php') {
    res.end(renderContactPage());
  } else {
    res.end(renderDashboard());
  }
});

// 1. Dashboard View
function renderDashboard() {
  const total = facilities.length;
  const avail = facilities.filter(f => f.availability_status === 'Available').length;
  const booked = facilities.filter(f => f.availability_status === 'Booked').length;
  const pending = bookings.filter(b => b.booking_status === 'Pending').length;
  const recent = bookings.slice(0, 5);

  return renderHeader('Dashboard', 'dashboard') + `
    <!-- Welcome Hero -->
    <section class="welcome-hero" aria-label="Campus Welcome Banner">
      <div class="welcome-content">
        <div class="welcome-badge">Faculty Reservation Portal</div>
        <h1 class="welcome-title">Welcome to Smart Campus</h1>
        <p class="welcome-subtitle">Manage and reserve your campus spaces effortlessly.</p>
        <div class="welcome-actions">
          <a href="/booking.php" class="btn-hero-primary">
            <span>+ Quick Booking</span>
          </a>
          <a href="/facilities.php" class="btn-hero-secondary">
            <span>Explore All Facilities &rarr;</span>
          </a>
          <a href="/availability.php" class="btn-hero-secondary" style="background: rgba(2, 132, 199, 0.2); border-color: rgba(56, 189, 248, 0.3);">
            <span>Check Live Schedule</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Summary Cards -->
    <section class="summary-cards-grid">
      <article class="stat-card card-total">
        <div class="stat-icon-wrapper">🏢</div>
        <div class="stat-info">
          <div class="stat-label">Total Facilities</div>
          <div class="stat-value"><span>${total}</span> <span class="stat-pill info">Campus Wide</span></div>
          <div class="trend-indicator" style="color: var(--blue-600);">Across 5 Academic Blocks</div>
        </div>
      </article>

      <article class="stat-card card-available">
        <div class="stat-icon-wrapper">✓</div>
        <div class="stat-info">
          <div class="stat-label">Available Facilities</div>
          <div class="stat-value"><span style="color: var(--status-available);">${avail}</span> <span class="stat-pill success">Ready for Booking</span></div>
          <div class="trend-indicator" style="color: var(--status-available);">67% Spaces Free Right Now</div>
        </div>
      </article>

      <article class="stat-card card-booked">
        <div class="stat-icon-wrapper">📅</div>
        <div class="stat-info">
          <div class="stat-label">Currently Booked</div>
          <div class="stat-value"><span style="color: var(--status-booked);">${booked}</span> <span class="stat-pill" style="background: #fee2e2; color: #b91c1c;">Occupied Today</span></div>
          <div class="trend-indicator" style="color: #b91c1c;">Active Academic Sessions</div>
        </div>
      </article>

      <article class="stat-card card-pending">
        <div class="stat-icon-wrapper">⏳</div>
        <div class="stat-info">
          <div class="stat-label">Pending Requests</div>
          <div class="stat-value"><span style="color: var(--status-pending);">${pending}</span> <span class="stat-pill warning">Under Review</span></div>
          <div class="trend-indicator" style="color: #b45309;">Department Clearance</div>
        </div>
      </article>
    </section>

    <!-- Recently Requested Facilities Table -->
    <section style="margin-bottom: 40px;">
      <div class="section-header">
        <div class="section-title-wrap">
          <h2>Recently Requested Facilities</h2>
          <p>Latest reservation submissions, timetable allocations, and pending requests</p>
        </div>
        <a href="/my-bookings.php" class="btn-card-details">View All Bookings &rarr;</a>
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
            ${recent.map(b => `
              <tr>
                <td><span class="table-booking-id">${b.booking_id}</span></td>
                <td>
                  <div class="table-facility-cell">
                    <img src="/images/facility-${b.facility_id}.jpg" onerror="this.onerror=null; this.src='/images/facility-${b.facility_id}.svg';" alt="Facility" class="table-facility-img">
                    <div>
                      <div class="table-facility-name">${b.facility_name}</div>
                      <div class="table-facility-loc">${b.location}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="font-weight: 700; color: #0f172a;">${b.faculty_name}</div>
                  <div style="font-size: 0.76rem; color: #64748b;">${b.faculty_id}</div>
                </td>
                <td>
                  <div style="font-weight: 700; color: #0f172a;">${b.booking_date}</div>
                  <div style="font-size: 0.78rem; color: #0d9488; font-weight: 600;">${b.start_time} - ${b.end_time}</div>
                </td>
                <td>
                  <div style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.86rem;">
                    ${b.booking_purpose}
                  </div>
                  <div style="font-size: 0.75rem; color: #64748b;">Participants: ${b.participant_count}</div>
                </td>
                <td>
                  <span class="badge-status badge-${b.booking_status}">
                    <span class="status-dot"></span>
                    ${b.booking_status}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 8px;">
                    <button type="button" class="btn-action-table" style="color: var(--blue-600);" onclick='printBookingSlip(${JSON.stringify(b)})' title="Print Confirmation Slip">🖨️ Print</button>
                    <a href="/facility-details.php?id=${b.facility_id}" class="btn-action-table">View</a>
                    ${['Approved', 'Pending'].includes(b.booking_status) ? `
                      <button type="button" class="btn-action-table btn-action-cancel" data-action="cancel-booking" data-booking-id="${b.booking_id}">Cancel</button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Popular Campus Spaces -->
    <section>
      <div class="section-header">
        <div class="section-title-wrap">
          <h2>Popular Campus Spaces</h2>
          <p>High-demand auditoriums, research laboratories, and smart lecture halls</p>
        </div>
        <a href="/facilities.php" class="btn-card-details">Browse All 12 Facilities &rarr;</a>
      </div>
      <div class="facilities-grid">
        ${facilities.slice(0, 4).map(renderFacilityCardHtml).join('')}
      </div>
    </section>
  ` + renderFooter();
}

function renderFacilityCardHtml(fac) {
  return `
    <article class="facility-card facility-card-item"
             data-id="${fac.facility_id}"
             data-name="${fac.facility_name}"
             data-building="${fac.building}"
             data-category="${fac.category}"
             data-status="${fac.availability_status}"
             data-capacity="${fac.capacity}"
             data-equipment="${fac.equipment}">
      <div class="facility-card-image-wrap">
        <img src="/${fac.image_url}" onerror="this.onerror=null; this.src='/images/facility-${fac.facility_id}.svg';" alt="${fac.facility_name}" class="facility-card-img" loading="lazy">
        <span class="facility-status-badge status-${fac.availability_status.replace(/\s+/g, '-')}">
          <span class="status-dot"></span>
          ${fac.availability_status}
        </span>
        <div class="facility-capacity-badge">
          <span>👥 ${fac.capacity} Seats</span>
        </div>
      </div>
      <div class="facility-card-body">
        <div class="facility-location-tag">📍 ${fac.location}</div>
        <h3 class="facility-title">${fac.facility_name}</h3>
        <p class="facility-desc">${fac.description}</p>
        <div class="facility-equipment-wrap">
          <div class="equipment-label">Equipped With:</div>
          <div class="equipment-chips">
            ${fac.equipment.split(',').slice(0, 3).map(c => `<span class="equip-chip">${c.trim()}</span>`).join('')}
          </div>
        </div>
        <div class="facility-card-footer">
          <button type="button" class="btn-card-details" data-action="view-facility-modal"
                  data-id="${fac.facility_id}"
                  data-name="${fac.facility_name}"
                  data-location="${fac.location}"
                  data-capacity="${fac.capacity}"
                  data-equipment="${fac.equipment}"
                  data-desc="${fac.description}"
                  data-hours="${fac.operating_hours}"
                  data-rules="${fac.booking_rules}"
                  data-image="/${fac.image_url}"
                  data-status="${fac.availability_status}">
            View Details
          </button>
          ${fac.availability_status === 'Under Maintenance' ? `
            <button class="btn-card-book disabled">Unavailable</button>
          ` : `
            <a href="/booking.php?facility_id=${fac.facility_id}" class="btn-card-book">Book Now</a>
          `}
        </div>
      </div>
    </article>
  `;
}

// 2. Facilities Page
function renderFacilities(query) {
  const cat = query.category || 'All';
  const stat = query.status || 'All';
  const search = (query.search || '').toLowerCase();

  let filtered = facilities.filter(f => {
    if (cat !== 'All' && f.category !== cat) return false;
    if (stat !== 'All' && f.availability_status !== stat) return false;
    if (search && !f.facility_name.toLowerCase().includes(search) && !f.building.toLowerCase().includes(search) && !f.equipment.toLowerCase().includes(search)) return false;
    return true;
  });

  return renderHeader('Explore Facilities', 'facilities') + `
    <div class="section-header">
      <div class="section-title-wrap">
        <h2>Explore Campus Facilities</h2>
        <p>Discover and reserve premier university auditoriums, smart computer labs, and conference suites</p>
      </div>
      <a href="/booking.php" class="btn-quick-book">+ Reserve a Room</a>
    </div>

    <div class="filters-bar">
      <div class="search-box" style="width: 280px; box-shadow: none;">
        <span>🔍</span>
        <input type="text" id="facilitySearchInput" value="${query.search || ''}" placeholder="Search by name, block, gear...">
      </div>
      <div class="filter-group">
        <span class="filter-label">Space Type:</span>
        <select id="facilityCategoryFilter" class="filter-select">
          <option value="All" ${cat === 'All' ? 'selected' : ''}>All Spaces (12)</option>
          <option value="Auditorium & Hall" ${cat === 'Auditorium & Hall' ? 'selected' : ''}>Auditoriums & Halls</option>
          <option value="Laboratory" ${cat === 'Laboratory' ? 'selected' : ''}>Computer & Research Labs</option>
          <option value="Conference Room" ${cat === 'Conference Room' ? 'selected' : ''}>Conference & Meeting</option>
          <option value="Innovation Space" ${cat === 'Innovation Space' ? 'selected' : ''}>Innovation & Robotics</option>
          <option value="Digital Learning" ${cat === 'Digital Learning' ? 'selected' : ''}>Digital Classrooms</option>
        </select>
      </div>
      <div class="filter-group">
        <span class="filter-label">Status:</span>
        <select id="facilityStatusFilter" class="filter-select">
          <option value="All" ${stat === 'All' ? 'selected' : ''}>All Statuses</option>
          <option value="Available" ${stat === 'Available' ? 'selected' : ''}>Available (8)</option>
          <option value="Booked" ${stat === 'Booked' ? 'selected' : ''}>Currently Booked (4)</option>
          <option value="Under Maintenance" ${stat === 'Under Maintenance' ? 'selected' : ''}>Under Maintenance</option>
        </select>
      </div>
      <div class="filter-group">
        <span class="filter-label">Capacity:</span>
        <select id="facilityCapacityFilter" class="filter-select">
          <option value="All">Any Size</option>
          <option value="1-30">1 - 30 Seats</option>
          <option value="31-60">31 - 60 Seats</option>
          <option value="61-150">61 - 150 Seats</option>
          <option value="151+">151+ Seats</option>
        </select>
      </div>
      <div class="filter-pills">
        <button type="button" class="filter-pill ${cat === 'All' ? 'active' : ''}" data-category="All">All</button>
        <button type="button" class="filter-pill ${cat === 'Auditorium & Hall' ? 'active' : ''}" data-category="Auditorium & Hall">Auditoriums</button>
        <button type="button" class="filter-pill ${cat === 'Laboratory' ? 'active' : ''}" data-category="Laboratory">Labs</button>
        <button type="button" class="filter-pill ${cat === 'Conference Room' ? 'active' : ''}" data-category="Conference Room">Conference</button>
        <button type="button" class="filter-pill ${cat === 'Innovation Space' ? 'active' : ''}" data-category="Innovation Space">Innovation</button>
      </div>
    </div>

    <div class="facilities-grid" id="facilitiesGrid">
      ${filtered.map(renderFacilityCardHtml).join('')}
    </div>
  ` + renderFooter();
}

// 3. Facility Details Page
function renderFacilityDetails(query) {
  const facId = parseInt(query.id || '1', 10);
  const fac = facilities.find(f => f.facility_id === facId) || facilities[0];
  const date = query.date || todayStr;
  const slots = getSlotsForFacility(fac.facility_id, date);

  return renderHeader(`${fac.facility_name} - Details`, 'facilities') + `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
      <a href="/facilities.php" style="color: var(--teal-600); font-weight: 700;">&larr; Back to Facilities</a>
      <a href="/booking.php?facility_id=${fac.facility_id}" class="btn-hero-primary" style="padding: 8px 20px;">Book Now</a>
    </div>

    <div style="background: #fff; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2); margin-bottom: 32px;">
      <div style="height: 380px; width: 100%; position: relative; background: #0f172a;">
        <img src="/${fac.image_url}" onerror="this.onerror=null; this.src='/images/facility-${fac.facility_id}.svg';" alt="${fac.facility_name}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; top: 20px; right: 20px;">
          <span class="facility-status-badge status-${fac.availability_status.replace(/\s+/g, '-')}">
            <span class="status-dot"></span>
            ${fac.availability_status}
          </span>
        </div>
      </div>
      <div style="padding: 32px;">
        <h1 style="font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${fac.facility_name}</h1>
        <p style="font-size: 1.05rem; color: #64748b; margin-bottom: 28px;">${fac.description}</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; background: #f8fafc; padding: 22px; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; margin-bottom: 32px;">
          <div>
            <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Capacity</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">👥 ${fac.capacity} People</div>
          </div>
          <div>
            <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Location</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">🏢 ${fac.building}</div>
          </div>
          <div>
            <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Floor</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">📍 ${fac.floor}</div>
          </div>
          <div>
            <div style="font-size: 0.76rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Operating Hours</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #0d9488;">🕒 ${fac.operating_hours}</div>
          </div>
        </div>

        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 14px;">Available Equipment</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px;">
            ${fac.equipment.split(',').map(item => `
              <div style="background: #fff; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.88rem; font-weight: 600;">✓ ${item.trim()}</div>
            `).join('')}
          </div>
        </div>

        <div style="margin-bottom: 32px; background: #fefce8; border: 1px solid #fef08a; padding: 20px; border-radius: 12px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #854d0e; margin-bottom: 6px;">📋 Booking Rules</h4>
          <p style="font-size: 0.9rem; color: #713f12;">${fac.booking_rules}</p>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">Daily Time Slots for ${date}</h3>
            <form method="GET" action="/facility-details.php">
              <input type="hidden" name="id" value="${fac.facility_id}">
              <input type="date" name="date" value="${date}" onchange="this.form.submit()" class="cal-date-picker">
            </form>
          </div>
          <div class="slots-grid">
            ${slots.map(s => `
              <div class="slot-card slot-${s.status}" data-start="${s.start_time}" data-end="${s.end_time}">
                <div class="slot-time"><span>${s.label}</span><span class="slot-badge">${s.status}</span></div>
                <div class="slot-info-text">${s.status === 'available' ? 'Click to book this time slot' : (s.booking ? s.booking.booking_purpose : 'Reserved / Maintenance')}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  ` + renderFooter();
}

// 4. Availability Calendar
function renderAvailability(query) {
  const facId = parseInt(query.facility_id || '1', 10);
  const curFac = facilities.find(f => f.facility_id === facId) || facilities[0];
  const date = query.date || todayStr;
  const slots = getSlotsForFacility(curFac.facility_id, date);

  return renderHeader('Room Availability Calendar', 'availability') + `
    <div class="section-header">
      <div class="section-title-wrap">
        <h2>Room Availability Calendar</h2>
        <p>Live schedule matrix, real-time slot statuses, and instant room reservation</p>
      </div>
      <a href="/booking.php?facility_id=${curFac.facility_id}&booking_date=${date}" class="btn-quick-book">
        Book for Selected Date &rarr;
      </a>
    </div>

    <div class="calendar-card">
      <div class="calendar-topbar">
        <div style="display: flex; align-items: center; gap: 10px; min-width: 280px;">
          <label style="font-size: 0.85rem; font-weight: 700; color: #64748b;">FACILITY:</label>
          <select id="calendarFacilityFilter" class="filter-select">
            ${facilities.map(f => `
              <option value="${f.facility_id}" ${f.facility_id === curFac.facility_id ? 'selected' : ''}>
                ${f.facility_name} (${f.building})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="calendar-controls">
          <input type="date" id="calendarDatePicker" value="${date}" class="cal-date-picker">
        </div>

        <div class="legend-bar">
          <div class="legend-item"><span class="legend-box avail"></span><span>Available</span></div>
          <div class="legend-item"><span class="legend-box booked"></span><span>Booked</span></div>
          <div class="legend-item"><span class="legend-box pending"></span><span>Pending</span></div>
          <div class="legend-item"><span class="legend-box maint"></span><span>Maintenance</span></div>
        </div>
      </div>

      <div style="background: #f8fafc; border-radius: var(--radius-lg); padding: 18px; border: 1px solid #e2e8f0; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="/${curFac.image_url}" onerror="this.onerror=null; this.src='/images/facility-${curFac.facility_id}.svg';" alt="Room" style="width: 60px; height: 42px; border-radius: 6px; object-fit: cover;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">${curFac.facility_name}</h3>
            <div style="font-size: 0.82rem; color: #64748b;">📍 ${curFac.location} &bull; 👥 ${curFac.capacity} Seats</div>
          </div>
        </div>
        <div style="font-size: 1rem; font-weight: 800; color: #0d9488;">${date}</div>
      </div>

      <div class="slots-grid">
        ${slots.map(s => `
          <div class="slot-card slot-${s.status}" data-start="${s.start_time}" data-end="${s.end_time}">
            <div class="slot-time"><span>${s.label}</span><span class="slot-badge">${s.status}</span></div>
            <div class="slot-info-text">${s.status === 'available' ? '✓ Click to book this slot' : (s.booking ? s.booking.booking_purpose : 'Reserved Slot')}</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` + renderFooter();
}

// 5. Booking Page (with HTML5 Drag and Drop)
function renderBookingPage({ error, confirmed, preFill = {} }) {
  const selectedFacId = parseInt(preFill.facility_id || '0', 10);

  return renderHeader('Book a Facility', 'booking') + `
    <div class="section-header">
      <div class="section-title-wrap">
        <h2>Facility Reservation & Allocation</h2>
        <p>Submit booking requests with interactive drag-and-drop room allocation and conflict verification</p>
      </div>
      <a href="/availability.php" class="btn-card-details">View Availability Grid &rarr;</a>
    </div>

    ${error ? `
      <div style="background: #fef2f2; border: 1.5px solid #fecaca; color: #991b1b; padding: 16px 20px; border-radius: var(--radius-lg); margin-bottom: 28px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.4rem;">⚠️</span>
        <div><strong>Reservation Conflict:</strong> ${error}</div>
      </div>
    ` : ''}

    ${confirmed ? `
      <div style="background: #fff; border-radius: var(--radius-xl); border: 2px solid var(--status-available); padding: 36px; box-shadow: var(--elevation-3); margin-bottom: 36px; animation: popIn 0.4s ease;">
        <div style="text-align: center; max-width: 650px; margin: 0 auto 28px auto;">
          <div style="width: 68px; height: 68px; background: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 14px auto;">✓</div>
          <h2 style="font-size: 1.7rem; font-weight: 800; color: #0f172a; margin-bottom: 4px;">Booking Request Confirmed!</h2>
          <p style="font-size: 0.92rem; color: #64748b;">Your facility reservation request has been submitted successfully with reference ID below.</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 22px; max-width: 700px; margin: 0 auto 24px auto;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding-bottom: 14px; margin-bottom: 14px;">
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Reference Code</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: var(--blue-600); font-family: monospace;">${confirmed.booking_id}</div>
            </div>
            <div>
              <span class="badge-status badge-Pending"><span class="status-dot"></span>Pending Review</span>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div><strong>Space:</strong> ${confirmed.facility_name}</div>
            <div><strong>Date:</strong> ${confirmed.booking_date}</div>
            <div><strong>Time Window:</strong> ${confirmed.start_time} - ${confirmed.end_time}</div>
            <div><strong>Attendees:</strong> ${confirmed.participant_count} People</div>
          </div>
          <div style="margin-top: 14px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            <strong>Purpose:</strong> ${confirmed.booking_purpose}
          </div>
        </div>
        <div style="display: flex; justify-content: center; gap: 12px;">
          <a href="/my-bookings.php" class="btn-submit" style="text-decoration: none;">View in My Bookings &rarr;</a>
          <button type="button" onclick='printBookingSlip(${JSON.stringify(confirmed)})' class="btn-submit" style="background: linear-gradient(135deg, var(--blue-600), var(--teal-600)); cursor: pointer;">🖨️ Print Booking Confirmation</button>
          <a href="/booking.php" class="btn-reset">+ Another Booking</a>
        </div>
      </div>
    ` : ''}

    <!-- HTML5 Drag & Drop Room Allocation Dock -->
    <section class="dnd-container" id="allocation-dock">
      <div class="dnd-header">
        <div class="dnd-title">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--teal-100); color: var(--teal-600); display: flex; align-items: center; justify-content: center;">✋</div>
          <div>
            <h3>Drag-and-Drop Room Allocation</h3>
            <p style="font-size: 0.84rem; color: #64748b;">Drag any facility card from the palette directly into the drop zone</p>
          </div>
        </div>
        <span class="dnd-badge">HTML5 Drag & Drop</span>
      </div>

      <div class="dnd-layout">
        <!-- Palette -->
        <div class="drag-palette-box">
          <div class="palette-title"><span>Available Spaces Palette</span></div>
          <div class="draggable-items-list" id="draggablePalette">
            ${facilities.map(f => `
              <div class="draggable-card" draggable="true"
                   data-facility-id="${f.facility_id}"
                   data-facility-name="${f.facility_name}"
                   data-facility-img="/${f.image_url}"
                   data-facility-loc="${f.location}"
                   data-facility-cap="${f.capacity}">
                <div class="drag-handle">⋮⋮</div>
                <img src="/${f.image_url}" onerror="this.onerror=null; this.src='/images/facility-${f.facility_id}.svg';" alt="Thumbnail" class="drag-thumb">
                <div class="drag-card-meta">
                  <div class="drag-card-name">${f.facility_name}</div>
                  <div class="drag-card-sub">${f.building} &bull; 👥 ${f.capacity} Seats</div>
                </div>
                <span class="badge-status badge-${f.availability_status.replace(/\s+/g, '')}" style="font-size: 0.65rem;">
                  ${f.availability_status}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Drop Target -->
        <div class="drop-target-area" id="roomDropZone">
          <div class="drop-empty-state" id="emptyDropState">
            <div class="drop-icon-pulse">🎯</div>
            <h4>Drag & Drop Facility Here</h4>
            <p>Grab any facility card from the palette on the left and drop it here to assign it to your booking form.</p>
          </div>

          <div class="dropped-facility-display" id="droppedRoomDisplay" style="display: none;">
            <button type="button" class="dropped-btn-remove" id="btnRemoveAllocation">✕ Remove / Replace</button>
            <img id="droppedImg" src="/images/facility-1.jpg" onerror="this.onerror=null; this.src='/images/facility-1.svg';" alt="Allocated Facility" class="dropped-img">
            <div class="dropped-meta">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: #0d9488; font-weight: 700;">Allocated Space:</div>
              <h4 id="droppedTitle" class="dropped-title">Facility</h4>
              <div id="droppedLoc" class="dropped-building">Location</div>
              <div class="dropped-pills">
                <span id="droppedCap" class="stat-pill info">100 Seats</span>
                <span class="stat-pill success">Assigned to Form</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Professional Booking Form -->
    <section class="form-card">
      <form id="facilityBookingForm" method="POST" action="/booking.php" class="booking-form" novalidate>
        <div class="form-section-header">
          <h4>👤 1. Faculty Member Information</h4>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Faculty Name *</label>
            <input type="text" name="faculty_name" class="form-control" value="${facultySession.faculty_name}" required>
          </div>
          <div class="form-group">
            <label>Faculty ID *</label>
            <input type="text" name="faculty_id" class="form-control" value="${facultySession.faculty_id}" required>
          </div>
          <div class="form-group">
            <label>Department *</label>
            <input type="text" name="department" class="form-control" value="${facultySession.faculty_dept}" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Institutional Email *</label>
            <input type="email" name="email" class="form-control" value="${facultySession.faculty_email}" required>
          </div>
          <div class="form-group">
            <label>Contact Number *</label>
            <input type="tel" name="contact_number" class="form-control" value="${facultySession.faculty_phone}" required>
          </div>
        </div>

        <div class="form-section-header" style="margin-top: 14px;">
          <h4>📅 2. Space Selection & Reservation Schedule</h4>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Target Facility Space *</label>
            <select id="facility_id" name="facility_id" class="form-control" required>
              <option value="">-- Select a Facility (or Drag from Above) --</option>
              ${facilities.map(f => `
                <option value="${f.facility_id}" ${selectedFacId === f.facility_id ? 'selected' : ''}>
                  ${f.facility_name} (${f.building} - ${f.capacity} Seats)
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Booking Date *</label>
            <input type="date" id="booking_date" name="booking_date" class="form-control" value="${preFill.booking_date || todayStr}" min="${todayStr}" required>
          </div>
          <div class="form-group">
            <label>Number of Participants *</label>
            <input type="number" id="participant_count" name="participant_count" class="form-control" value="${preFill.participant_count || 45}" min="1" max="1000" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Start Time *</label>
            <input type="time" id="start_time" name="start_time" class="form-control" value="${preFill.start_time || '10:00'}" required>
          </div>
          <div class="form-group">
            <label>End Time *</label>
            <input type="time" id="end_time" name="end_time" class="form-control" value="${preFill.end_time || '12:00'}" required>
          </div>
        </div>

        <div class="form-section-header" style="margin-top: 14px;">
          <h4>⚙️ 3. Purpose & Equipment Requirements</h4>
        </div>
        <div class="form-group">
          <label>Purpose of Booking / Event Title *</label>
          <input type="text" id="booking_purpose" name="booking_purpose" class="form-control" value="${preFill.booking_purpose || ''}" placeholder="e.g. Faculty Senate Meeting, Guest Lecture on Neural Networks, Practical Exam" required>
        </div>
        <div class="form-group">
          <label>Equipment Required:</label>
          <div class="equipment-checkbox-grid">
            <label class="checkbox-label"><input type="checkbox" name="equipment_required[]" value="4K Projector" checked> <span>Projector & Screen</span></label>
            <label class="checkbox-label"><input type="checkbox" name="equipment_required[]" value="Audio PA System" checked> <span>Audio & Microphones</span></label>
            <label class="checkbox-label"><input type="checkbox" name="equipment_required[]" value="High-Speed Wi-Fi"> <span>High-Speed Wi-Fi / LAN</span></label>
            <label class="checkbox-label"><input type="checkbox" name="equipment_required[]" value="Workstations"> <span>Workstations / PCs</span></label>
            <label class="checkbox-label"><input type="checkbox" name="equipment_required[]" value="Video Conferencing"> <span>Video Conferencing</span></label>
            <label class="checkbox-label"><input type="checkbox" name="equipment_required[]" value="Digital Podium"> <span>Interactive Podium</span></label>
          </div>
        </div>
        <div class="form-group">
          <label>Special Instructions / Notes</label>
          <textarea name="special_requirements" class="form-control" rows="3" placeholder="Seating arrangement or AV requirements...">${preFill.special_requirements || ''}</textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">Submit Booking Request</button>
          <button type="reset" class="btn-reset" onclick="clearAllocatedRoom()">Reset Form</button>
        </div>
      </form>
    </section>
  ` + renderFooter();
}

// 6. My Bookings Page
function renderMyBookings(query) {
  const tab = query.tab || 'all';
  let filtered = bookings.filter(b => b.faculty_id === facultySession.faculty_id);

  if (tab === 'pending') filtered = filtered.filter(b => b.booking_status === 'Pending');
  else if (tab === 'approved') filtered = filtered.filter(b => b.booking_status === 'Approved');
  else if (tab === 'rejected') filtered = filtered.filter(b => b.booking_status === 'Rejected');
  else if (tab === 'cancelled') filtered = filtered.filter(b => b.booking_status === 'Cancelled');
  else if (tab === 'history') filtered = filtered.filter(b => b.booking_date < todayStr);

  return renderHeader('My Bookings', tab === 'history' ? 'history' : 'my-bookings') + `
    <div class="section-header">
      <div class="section-title-wrap">
        <h2>${tab === 'history' ? 'Booking History & Archive' : 'My Facility Bookings'}</h2>
        <p>Track your reservation requests, monitor approval status, and manage allocated rooms</p>
      </div>
      <a href="/booking.php" class="btn-quick-book">+ New Reservation</a>
    </div>

    ${query.feedback === 'cancelled' ? `
      <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #065f46; padding: 14px 18px; border-radius: var(--radius-lg); margin-bottom: 24px;">
        ✓ The booking request has been successfully cancelled and the time slot is now available.
      </div>
    ` : ''}

    <div class="filters-bar" style="margin-bottom: 24px;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; width: 100%;">
        <a href="/my-bookings.php" class="filter-pill ${tab === 'all' ? 'active' : ''}">All Requests</a>
        <a href="/my-bookings.php?tab=pending" class="filter-pill ${tab === 'pending' ? 'active' : ''}">Pending Review</a>
        <a href="/my-bookings.php?tab=approved" class="filter-pill ${tab === 'approved' ? 'active' : ''}">Approved Bookings</a>
        <a href="/my-bookings.php?tab=rejected" class="filter-pill ${tab === 'rejected' ? 'active' : ''}">Rejected</a>
        <a href="/my-bookings.php?tab=cancelled" class="filter-pill ${tab === 'cancelled' ? 'active' : ''}">Cancelled</a>
        <a href="/my-bookings.php?tab=history" class="filter-pill ${tab === 'history' ? 'active' : ''}" style="margin-left: auto;">Historic Archive</a>
      </div>
    </div>

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
          ${filtered.length > 0 ? filtered.map(b => `
            <tr>
              <td><span class="table-booking-id">${b.booking_id}</span></td>
              <td>
                <div class="table-facility-cell">
                  <img src="/images/facility-${b.facility_id}.jpg" onerror="this.onerror=null; this.src='/images/facility-${b.facility_id}.svg';" alt="Room" class="table-facility-img">
                  <div>
                    <div class="table-facility-name">${b.facility_name}</div>
                    <div class="table-facility-loc">${b.location}</div>
                  </div>
                </div>
              </td>
              <td><div style="font-weight: 700;">${b.booking_date}</div></td>
              <td><div style="font-weight: 700; color: #0d9488;">${b.start_time} - ${b.end_time}</div></td>
              <td>
                <div style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600;">
                  ${b.booking_purpose}
                </div>
                <div style="font-size: 0.75rem; color: #64748b;">Attendees: ${b.participant_count}</div>
              </td>
              <td>
                <span class="badge-status badge-${b.booking_status}">
                  <span class="status-dot"></span>${b.booking_status}
                </span>
              </td>
              <td style="text-align: right;">
                <div style="display: inline-flex; gap: 8px;">
                  <button type="button" class="btn-action-table" style="color: var(--blue-600); border-color: var(--blue-200); background: var(--blue-50);" onclick='printBookingSlip(${JSON.stringify(b)})' title="Print Confirmation Slip">🖨️ Print</button>
                  <button type="button" class="btn-action-table" onclick='showBookingDetailsModal(${JSON.stringify(b)})' title="View Full Details">Details</button>
                  ${['Approved', 'Pending'].includes(b.booking_status) ? `
                    <button type="button" class="btn-action-table btn-action-cancel" data-action="cancel-booking" data-booking-id="${b.booking_id}">Cancel</button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `).join('') : `
            <tr>
              <td colspan="7" style="text-align: center; padding: 40px; color: #64748b;">
                No bookings found matching current tab. <a href="/booking.php" style="color: var(--teal-600); font-weight: bold;">Create a new booking &rarr;</a>
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  ` + renderFooter();
}

// 7. Contact Page
function renderContactPage(feedback = null) {
  return renderHeader('Contact & Support', 'contact') + `
    <div class="section-header">
      <div class="section-title-wrap">
        <h2>Contact & Campus Facilities Helpdesk</h2>
        <p>Get in touch with estate coordinators, request technical AV assistance, and review campus booking policies</p>
      </div>
    </div>

    ${feedback ? `
      <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #065f46; padding: 16px 20px; border-radius: var(--radius-lg); margin-bottom: 24px;">
        ✓ ${feedback}
      </div>
    ` : ''}

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 36px;">
      <div style="background: #fff; border-radius: var(--radius-xl); padding: 26px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2);">
        <div style="font-size: 2rem; margin-bottom: 12px;">🏢</div>
        <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Estate Management Office</h3>
        <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 14px;">Direct point of contact for room keys, air-conditioning scheduling, and formal hall bookings.</p>
        <div style="font-size: 0.85rem; color: #1e293b;">
          <div><strong>Location:</strong> Room G-04, Technology Tower</div>
          <div><strong>Helpline:</strong> +1 (555) 019-2834 (Ext. 4400)</div>
        </div>
      </div>

      <div style="background: #fff; border-radius: var(--radius-xl); padding: 26px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2);">
        <div style="font-size: 2rem; margin-bottom: 12px;">🎧</div>
        <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">IT & AV Technical Center</h3>
        <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 14px;">Assistance with projector setup, live broadcast streams, wireless mic systems, and lab software.</p>
        <div style="font-size: 0.85rem; color: #1e293b;">
          <div><strong>Location:</strong> Turing IT Center, 1st Floor</div>
          <div><strong>Helpline:</strong> +1 (555) 019-3100 (Ext. 3100)</div>
        </div>
      </div>

      <div style="background: #fff; border-radius: var(--radius-xl); padding: 26px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2);">
        <div style="font-size: 2rem; margin-bottom: 12px;">🛡️</div>
        <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Campus Security Command</h3>
        <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 14px;">After-hours building access, biometric authorization, and event security clearances.</p>
        <div style="font-size: 0.85rem; color: #1e293b;">
          <div><strong>Location:</strong> Main Gatehouse Command Center</div>
          <div><strong>Emergency Ext:</strong> 9999</div>
        </div>
      </div>
    </div>

    <!-- Booking Protocols -->
    <div style="background: #fff; border-radius: var(--radius-xl); padding: 32px; border: 1px solid #e2e8f0; box-shadow: var(--elevation-2); margin-bottom: 36px;" id="rules">
      <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 16px;">Campus Reservation Protocols</h3>
      <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 14px;">
        <li style="display: flex; gap: 12px; font-size: 0.88rem; color: #334155;">
          <span style="color: #0d9488; font-weight: bold;">01.</span>
          <div><strong>24-Hour Advance Submission:</strong> Seminar halls, conference suites, and meeting rooms must be requested at least 24 hours prior to the event.</div>
        </li>
        <li style="display: flex; gap: 12px; font-size: 0.88rem; color: #334155;">
          <span style="color: #0d9488; font-weight: bold;">02.</span>
          <div><strong>Auditorium Approvals:</strong> Convocations and grand auditorium bookings require Dean or Vice-Chancellor endorsement.</div>
        </li>
        <li style="display: flex; gap: 12px; font-size: 0.88rem; color: #334155;">
          <span style="color: #0d9488; font-weight: bold;">03.</span>
          <div><strong>Overlapping Conflict Policy:</strong> The booking engine automatically blocks simultaneous reservations for the same facility and time slot.</div>
        </li>
      </ul>
    </div>
  ` + renderFooter();
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Smart Campus Facility Booking System is running!`);
  console.log(`🌐 Local URL:  http://localhost:${PORT}`);
  console.log(`📁 Directory:  ${ROOT_DIR}`);
  console.log(`======================================================\n`);
});
