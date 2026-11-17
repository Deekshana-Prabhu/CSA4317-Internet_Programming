/**
 * ============================================================================
 * APEX MULTISPECIALITY HOSPITAL - BACKEND SERVER
 * ============================================================================
 * Technologies: Node.js & Express
 * Purpose: Provides REST API endpoints for retrieving doctor profiles,
 * checking real-time available appointment slots, and persisting new bookings.
 * ============================================================================
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to data files
const DOCTORS_FILE = path.join(__dirname, 'doctors.json');
const APPOINTMENTS_FILE = path.join(__dirname, 'appointments.json');

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Serve static frontend files (HTML, CSS, JS, Assets) from current directory
app.use(express.static(__dirname));

/**
 * Helper function to safely read JSON from a file
 * @param {string} filePath
 * @param {any} fallback
 * @returns {any}
 */
function readJsonFile(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return fallback;
  }
}

/**
 * Helper function to safely write JSON to a file
 * @param {string} filePath
 * @param {any} data
 */
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err.message);
    return false;
  }
}

/**
 * ----------------------------------------------------------------------------
 * ENDPOINT 1: GET /api/doctors
 * Returns the list of all hospital doctors and their specializations.
 * ----------------------------------------------------------------------------
 */
app.get('/api/doctors', (req, res) => {
  const doctors = readJsonFile(DOCTORS_FILE, []);
  res.json({
    success: true,
    count: doctors.length,
    doctors: doctors
  });
});

/**
 * ----------------------------------------------------------------------------
 * ENDPOINT 2: GET /api/slots
 * Query Parameters: doctorId, date (format: YYYY-MM-DD)
 * Returns the available time slots for a specific doctor on a given date.
 * Automatically excludes slots that have already been booked!
 * ----------------------------------------------------------------------------
 */
app.get('/api/slots', (req, res) => {
  const { doctorId, date } = req.query;

  // Validate presence of required query parameters
  if (!doctorId || !date) {
    return res.status(400).json({
      success: false,
      message: 'Both doctorId and date query parameters are required.'
    });
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Expected YYYY-MM-DD.'
    });
  }

  // Validate date is not in the past
  const requestedDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (requestedDate < today) {
    return res.status(400).json({
      success: false,
      message: 'Cannot retrieve slots for past dates.'
    });
  }

  // Find the requested doctor
  const doctors = readJsonFile(DOCTORS_FILE, []);
  const doctor = doctors.find((doc) => doc.id === doctorId);

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: `Doctor with ID '${doctorId}' was not found.`
    });
  }

  // Read booked appointments to filter out unavailable slots
  const appointments = readJsonFile(APPOINTMENTS_FILE, []);

  // Filter booked slots for this doctor on this specific date
  const bookedSlots = appointments
    .filter((appt) => appt.doctorId === doctorId && appt.appointmentDate === date && appt.status === 'Confirmed')
    .map((appt) => appt.timeSlot);

  // Compute remaining available slots
  const allDoctorSlots = doctor.defaultSlots || [];
  const availableSlots = allDoctorSlots.filter((slot) => !bookedSlots.includes(slot));

  return res.json({
    success: true,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialization: doctor.specialization,
    date: date,
    totalSlots: allDoctorSlots.length,
    availableSlots: availableSlots,
    bookedSlots: bookedSlots,
    isFullyBooked: availableSlots.length === 0
  });
});

/**
 * ----------------------------------------------------------------------------
 * ENDPOINT 3: POST /api/appointments
 * Creates and persists a new appointment.
 * Validates fields, checks for duplicate bookings, and stores in appointments.json.
 * ----------------------------------------------------------------------------
 */
app.post('/api/appointments', (req, res) => {
  const {
    patientName,
    email,
    phone,
    gender,
    age,
    doctorId,
    appointmentDate,
    timeSlot,
    reason
  } = req.body;

  // 1. Mandatory fields check
  if (
    !patientName ||
    !email ||
    !phone ||
    !gender ||
    !age ||
    !doctorId ||
    !appointmentDate ||
    !timeSlot
  ) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided.'
    });
  }

  // 2. Regular Expression Validations:
  // Patient Name: Letters and spaces only, minimum 3 characters
  const nameRegex = /^[A-Za-z\s]{3,}$/;
  if (!nameRegex.test(patientName.trim())) {
    return res.status(400).json({
      success: false,
      field: 'patientName',
      message: 'Patient name must contain only letters and spaces (minimum 3 characters).'
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      field: 'email',
      message: 'Please provide a valid email address.'
    });
  }

  // Phone number: Exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone.trim())) {
    return res.status(400).json({
      success: false,
      field: 'phone',
      message: 'Mobile number must consist of exactly 10 numeric digits.'
    });
  }

  // Age validation
  const parsedAge = parseInt(age, 10);
  if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
    return res.status(400).json({
      success: false,
      field: 'age',
      message: 'Age must be a valid number between 1 and 120.'
    });
  }

  // 3. Date Validation: Prevent past appointment dates
  const requestedDate = new Date(`${appointmentDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(requestedDate.getTime()) || requestedDate < today) {
    return res.status(400).json({
      success: false,
      field: 'appointmentDate',
      message: 'Appointment date cannot be in the past or invalid.'
    });
  }

  // 4. Verify Doctor Exists
  const doctors = readJsonFile(DOCTORS_FILE, []);
  const doctor = doctors.find((doc) => doc.id === doctorId);

  if (!doctor) {
    return res.status(404).json({
      success: false,
      field: 'doctorId',
      message: 'The selected doctor does not exist.'
    });
  }

  // 5. Check Duplicate Booking (Concurrency / Conflict protection)
  const appointments = readJsonFile(APPOINTMENTS_FILE, []);
  const isSlotAlreadyBooked = appointments.some(
    (appt) =>
      appt.doctorId === doctorId &&
      appt.appointmentDate === appointmentDate &&
      appt.timeSlot === timeSlot &&
      appt.status === 'Confirmed'
  );

  if (isSlotAlreadyBooked) {
    return res.status(409).json({
      success: false,
      message: `The time slot '${timeSlot}' on ${appointmentDate} has already been reserved for ${doctor.name}. Please select a different slot.`
    });
  }

  // 6. Create New Appointment Record
  // Generate friendly unique Appointment ID: e.g. APX-728194
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const appointmentId = `APX-${randomNum}`;

  const newAppointment = {
    appointmentId,
    patientName: patientName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    gender,
    age: parsedAge,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialization: doctor.specialization,
    consultationFee: doctor.fee,
    appointmentDate,
    timeSlot,
    reason: (reason || 'General Medical Consultation').trim(),
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  // 7. Save to JSON File
  appointments.push(newAppointment);
  const saved = writeJsonFile(APPOINTMENTS_FILE, appointments);

  if (!saved) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record appointment in storage. Please try again.'
    });
  }

  // 8. Return Success Response
  return res.status(201).json({
    success: true,
    message: 'Appointment Booked Successfully!',
    appointment: newAppointment
  });
});

/**
 * ----------------------------------------------------------------------------
 * ENDPOINT 4: GET /api/appointments
 * Optional utility endpoint to review booked appointments
 * ----------------------------------------------------------------------------
 */
app.get('/api/appointments', (req, res) => {
  const appointments = readJsonFile(APPOINTMENTS_FILE, []);
  res.json({
    success: true,
    total: appointments.length,
    appointments: appointments
  });
});

// Export app and helper functions for testing and modularity
module.exports = app;

// Start Express Server only when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🏥 Apex Multispeciality Hospital Server is running!`);
    console.log(`🔗 Local Address: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}
