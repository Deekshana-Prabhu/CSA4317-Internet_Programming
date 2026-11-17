/**
 * ============================================================================
 * APEX MULTISPECIALITY HOSPITAL - COMPREHENSIVE AUTOMATED TEST SUITE
 * ============================================================================
 * Tests:
 * 1. Doctor listing endpoint GET /api/doctors (at least 6 doctors, specializations)
 * 2. Slot retrieval endpoint GET /api/slots (real-time filtering)
 * 3. Date validation & rejection of past dates
 * 4. Regular expression validation (name, email, phone)
 * 5. Appointment creation via POST /api/appointments
 * 6. Duplicate slot booking prevention (Concurrency/Collision test)
 * 7. Verification that booked slot is removed from available slots in GET /api/slots
 * 8. Static file integrity (index.html, style.css, script.js)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const app = require('./server.js');

// Lightweight in-memory request dispatcher for Express 5
function simulateRequest(app, method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const req = new EventEmitter();
    req.method = method.toUpperCase();
    req.url = urlPath;
    req.headers = {
      'content-type': 'application/json',
      'accept': 'application/json'
    };
    req.socket = { remoteAddress: '127.0.0.1' };
    req.body = body || {};

    const res = new EventEmitter();
    let statusCode = 200;
    let resData = null;

    res.status = function(code) {
      statusCode = code;
      return res;
    };
    res.setHeader = function() {};
    res.getHeader = function() {};
    res.json = function(data) {
      resData = data;
      resolve({ statusCode, data: resData });
    };
    res.send = function(data) {
      resData = data;
      resolve({ statusCode, data: resData });
    };
    res.end = function() {
      resolve({ statusCode, data: resData });
    };

    // Execute Express handle
    try {
      app.handle(req, res, (err) => {
        if (err) reject(err);
        else resolve({ statusCode: 404, data: { message: 'Not found' } });
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING APEX MULTISPECIALITY HOSPITAL TEST SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      process.exitCode = 1;
    }
  }

  // Backup original appointments.json
  const appointmentsPath = path.join(__dirname, 'appointments.json');
  const originalAppointments = fs.readFileSync(appointmentsPath, 'utf-8');

  // Reset appointments to empty array for testing
  fs.writeFileSync(appointmentsPath, '[]', 'utf-8');

  try {
    console.log('--- TEST GROUP 1: DOCTORS API ---');
    const doctorsRes = await simulateRequest(app, 'GET', '/api/doctors');

    assert(doctorsRes.statusCode === 200, 'GET /api/doctors returns HTTP 200');
    assert(doctorsRes.data.success === true, 'Response contains success: true');
    assert(Array.isArray(doctorsRes.data.doctors), 'doctors is an array');
    assert(doctorsRes.data.doctors.length >= 6, `At least 6 doctors returned (found: ${doctorsRes.data.doctors.length})`);

    const specializations = doctorsRes.data.doctors.map((d) => d.specialization);
    const requiredSpecs = [
      'Cardiology',
      'Neurology',
      'Dermatology',
      'Pediatrics',
      'Orthopedics',
      'General Medicine'
    ];
    const hasAllSpecs = requiredSpecs.every((s) => specializations.includes(s));
    assert(hasAllSpecs, `All required specializations present: ${requiredSpecs.join(', ')}`);

    console.log('\n--- TEST GROUP 2: DATE VALIDATION & SLOT RETRIEVAL ---');
    const today = new Date();
    const futureDateObj = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    const futureDateStr = futureDateObj.toISOString().split('T')[0];

    const pastDateObj = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
    const pastDateStr = pastDateObj.toISOString().split('T')[0];

    // Past date rejection test
    const pastSlotsRes = await simulateRequest(app, 'GET', `/api/slots?doctorId=doc-1&date=${pastDateStr}`);
    assert(pastSlotsRes.statusCode === 400, 'Past date slot retrieval is rejected with HTTP 400');

    // Future date slots test
    const validSlotsRes = await simulateRequest(app, 'GET', `/api/slots?doctorId=doc-1&date=${futureDateStr}`);
    assert(validSlotsRes.statusCode === 200, 'Future date slot retrieval returns HTTP 200');
    assert(validSlotsRes.data.availableSlots && validSlotsRes.data.availableSlots.length > 0, `Returns available slots (count: ${validSlotsRes.data.availableSlots.length})`);

    const initialSlotCount = validSlotsRes.data.availableSlots.length;
    const testSlot = validSlotsRes.data.availableSlots[0];

    console.log('\n--- TEST GROUP 3: REGEX & FIELD VALIDATIONS ON BOOKING ---');
    // Name validation
    const invalidNameRes = await simulateRequest(app, 'POST', '/api/appointments', {
      patientName: 'A1', // Invalid
      email: 'test@example.com',
      phone: '1234567890',
      gender: 'Male',
      age: 30,
      doctorId: 'doc-1',
      appointmentDate: futureDateStr,
      timeSlot: testSlot
    });
    assert(invalidNameRes.statusCode === 400, 'Rejects invalid name (regex failed) with HTTP 400');

    // Email validation
    const invalidEmailRes = await simulateRequest(app, 'POST', '/api/appointments', {
      patientName: 'Robert Frost',
      email: 'invalid-email-address', // Invalid
      phone: '1234567890',
      gender: 'Male',
      age: 30,
      doctorId: 'doc-1',
      appointmentDate: futureDateStr,
      timeSlot: testSlot
    });
    assert(invalidEmailRes.statusCode === 400, 'Rejects invalid email format with HTTP 400');

    // Phone validation
    const invalidPhoneRes = await simulateRequest(app, 'POST', '/api/appointments', {
      patientName: 'Robert Frost',
      email: 'robert@example.com',
      phone: '12345', // Invalid
      gender: 'Male',
      age: 30,
      doctorId: 'doc-1',
      appointmentDate: futureDateStr,
      timeSlot: testSlot
    });
    assert(invalidPhoneRes.statusCode === 400, 'Rejects phone numbers that are not 10 digits with HTTP 400');

    // Past date appointment rejection
    const pastApptRes = await simulateRequest(app, 'POST', '/api/appointments', {
      patientName: 'Robert Frost',
      email: 'robert@example.com',
      phone: '9876543210',
      gender: 'Male',
      age: 30,
      doctorId: 'doc-1',
      appointmentDate: pastDateStr, // Past date
      timeSlot: testSlot
    });
    assert(pastApptRes.statusCode === 400, 'Rejects appointment submission for past date with HTTP 400');

    console.log('\n--- TEST GROUP 4: APPOINTMENT CREATION VIA POST ---');
    const validBookingRes = await simulateRequest(app, 'POST', '/api/appointments', {
      patientName: 'Alice Walker',
      email: 'alice.walker@hospital.test',
      phone: '9876543210',
      gender: 'Female',
      age: 28,
      doctorId: 'doc-1',
      appointmentDate: futureDateStr,
      timeSlot: testSlot,
      reason: 'Annual Cardiovascular Health Check'
    });

    assert(validBookingRes.statusCode === 201, 'POST /api/appointments creates appointment with HTTP 201');
    assert(validBookingRes.data.success === true, 'Response contains success: true');
    assert(validBookingRes.data.appointment && validBookingRes.data.appointment.appointmentId, 'Generates valid appointmentId');
    assert(validBookingRes.data.appointment.status === 'Confirmed', 'Status is Confirmed');
    assert(validBookingRes.data.appointment.doctorName === 'Dr. Sarah Jenkins', 'Correctly associates doctor name');

    console.log('\n--- TEST GROUP 5: DUPLICATE BOOKING PREVENTION ---');
    const duplicateBookingRes = await simulateRequest(app, 'POST', '/api/appointments', {
      patientName: 'Bob Builder',
      email: 'bob@example.com',
      phone: '9988776655',
      gender: 'Male',
      age: 42,
      doctorId: 'doc-1',
      appointmentDate: futureDateStr,
      timeSlot: testSlot // SAME DOCTOR, DATE, AND SLOT!
    });

    assert(duplicateBookingRes.statusCode === 409, 'Rejects duplicate slot booking with HTTP 409 Conflict');
    assert(duplicateBookingRes.data.success === false, 'Duplicate booking returns success: false');

    console.log('\n--- TEST GROUP 6: DYNAMIC SLOT UPDATE VERIFICATION ---');
    const updatedSlotsRes = await simulateRequest(app, 'GET', `/api/slots?doctorId=doc-1&date=${futureDateStr}`);

    assert(
      !updatedSlotsRes.data.availableSlots.includes(testSlot),
      `Booked slot '${testSlot}' is now excluded from availableSlots`
    );
    assert(
      updatedSlotsRes.data.bookedSlots.includes(testSlot),
      `Booked slot '${testSlot}' is recorded in bookedSlots list`
    );
    assert(
      updatedSlotsRes.data.availableSlots.length === initialSlotCount - 1,
      `Available slots count decreased from ${initialSlotCount} to ${updatedSlotsRes.data.availableSlots.length}`
    );

    console.log('\n--- TEST GROUP 7: STATIC ASSETS & CODE IMPLEMENTATION CHECK ---');
    const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    assert(htmlContent.includes('APEX MULTISPECIALITY HOSPITAL'), 'index.html includes hospital name');
    assert(htmlContent.includes('Your Health, Our Priority'), 'index.html includes hero heading');
    assert(htmlContent.includes('medical-cross-icon'), 'index.html includes medical cross logo');
    assert(htmlContent.includes('doctorSelect'), 'index.html includes doctor dropdown');
    assert(htmlContent.includes('appointmentDate'), 'index.html includes appointment date picker');
    assert(htmlContent.includes('timeSlotsContainer'), 'index.html includes time slots dynamic container');

    const jsContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf-8');
    assert(jsContent.includes('XMLHttpRequest'), 'script.js implements XMLHttpRequest for POST submission');
    assert(jsContent.includes('fetch('), 'script.js implements Fetch API for slot retrieval');
    assert(jsContent.includes('JSON.stringify'), 'script.js uses JSON.stringify()');
    assert(jsContent.includes('JSON.parse'), 'script.js uses JSON.parse()');
    assert(jsContent.includes('window.print'), 'script.js implements window.print()');
    assert(jsContent.includes('new Date('), 'script.js uses JavaScript Date object');
    assert(jsContent.includes('addEventListener'), 'script.js uses addEventListener');

    const cssContent = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf-8');
    assert(cssContent.includes('@media print'), 'style.css contains @media print rules');

  } catch (err) {
    console.error('Test suite runtime error:', err);
    process.exitCode = 1;
  } finally {
    // Restore original appointments.json
    fs.writeFileSync(appointmentsPath, originalAppointments, 'utf-8');
  }

  console.log('\n================================================================');
  console.log(`📊 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('================================================================\n');

  if (passedTests === totalTests && totalTests > 0) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED.\n');
    process.exit(1);
  }
}

runTestSuite();
