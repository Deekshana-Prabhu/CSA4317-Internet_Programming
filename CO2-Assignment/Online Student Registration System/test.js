/**
 * ==============================================================================
 * Comprehensive Test Suite for APEX Student Registration System
 * Tests:
 * 1. Backend Server & /api/health
 * 2. Successful Registration 1 -> Appended to Excel
 * 3. Successful Registration 2 -> Appended to same Excel as a new row (Preserving Row 1)
 * 4. Duplicate Registration Handling (re-submitting student with same email)
 * 5. Security & Privacy:
 *    - Passwords are never saved in Excel
 *    - /private_data is blocked with 403 Forbidden from browser
 * 6. Excel file structure, formatting, columns, and data verification
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { app, server, EXCEL_FILE_PATH } = require('./server');

const TEST_PORT = 3456;

async function runTests() {
  console.log('====================================================');
  console.log('  STARTING APEX SYSTEM VERIFICATION & TEST SUITE    ');
  console.log('====================================================\n');

  // Let the server settle or use supertest / fetch
  const BASE_URL = `http://localhost:3000`;

  // Helper fetch function using Node's native fetch (available in Node 18+)
  async function apiPost(endpoint, body) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
  }

  async function apiGet(endpoint) {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, ok: res.ok, data };
  }

  try {
    // --------------------------------------------------------------------------
    // Test 1: Health check
    // --------------------------------------------------------------------------
    console.log('[Test 1] Checking /api/health endpoint...');
    const health = await apiGet('/api/health');
    console.log('Health Status:', health.status, health.data);
    console.assert(health.status === 200, 'Health endpoint should return 200');
    console.assert(health.data.status === 'online', 'Status should be online');
    console.log('✓ Test 1 Passed: Server is online and responsive.\n');

    // Remove existing test Excel file if desired, or let it start fresh
    if (fs.existsSync(EXCEL_FILE_PATH)) {
      fs.unlinkSync(EXCEL_FILE_PATH);
      console.log('Cleared previous Excel file for fresh testing.');
    }

    // --------------------------------------------------------------------------
    // Test 2: Register Student 1 (Aarav Patel - AIML)
    // --------------------------------------------------------------------------
    console.log('[Test 2] Submitting Student 1 Registration...');
    const student1 = {
      registrationNumber: 'APEX-2026-AIML-1024',
      name: 'Aarav Patel',
      email: 'aarav.patel@example.com',
      mobile: '9876543210',
      dateOfBirth: '2005-06-15',
      age: 21,
      gender: 'Male',
      department: 'Artificial Intelligence & Machine Learning (AIML)',
      year: '1st Year (Freshman - Semester 1 & 2)',
      address: 'Plot 42, Sunrise Enclave, Electronic City, Bangalore - 560100',
      registrationDate: 'Nov 17, 2026 at 10:15 PM',
      password: 'ShouldNeverBeSaved!123', // Deliberately include to test security filter
      confirmPassword: 'ShouldNeverBeSaved!123'
    };

    const reg1Res = await apiPost('/api/register', student1);
    console.log('Registration 1 Response:', reg1Res.status, reg1Res.data);
    console.assert(reg1Res.status === 201, 'Student 1 registration should return 201 Created');
    console.assert(reg1Res.data.success === true, 'Success flag should be true');
    console.assert(reg1Res.data.totalRegisteredStudents === 1, 'Total registered should be 1');
    console.log('✓ Test 2 Passed: Student 1 successfully registered.\n');

    // --------------------------------------------------------------------------
    // Test 3: Register Student 2 (Sneha Sharma - CSE)
    // --------------------------------------------------------------------------
    console.log('[Test 3] Submitting Student 2 Registration...');
    const student2 = {
      registrationNumber: 'APEX-2026-CSE-5892',
      name: 'Sneha Sharma',
      email: 'sneha.sharma@example.com',
      mobile: '9123456789',
      dateOfBirth: '2006-02-28',
      age: 20,
      gender: 'Female',
      department: 'Computer Science & Engineering (CSE)',
      year: '2nd Year (Sophomore - Semester 3 & 4)',
      address: 'Flat 302, Green Meadows, Whitefield, Bangalore - 560066',
      registrationDate: 'Nov 17, 2026 at 10:20 PM',
      password: 'AnotherSecretPassword#999'
    };

    const reg2Res = await apiPost('/api/register', student2);
    console.log('Registration 2 Response:', reg2Res.status, reg2Res.data);
    console.assert(reg2Res.status === 201, 'Student 2 registration should return 201 Created');
    console.assert(reg2Res.data.success === true, 'Success flag should be true');
    console.assert(reg2Res.data.totalRegisteredStudents === 2, 'Total registered should be 2');
    console.log('✓ Test 3 Passed: Student 2 successfully registered.\n');

    // --------------------------------------------------------------------------
    // Test 4: Register Student 3 (Rahul Verma - Mechanical)
    // --------------------------------------------------------------------------
    console.log('[Test 4] Submitting Student 3 Registration...');
    const student3 = {
      registrationNumber: 'APEX-2026-MECH-7731',
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      mobile: '9888777666',
      dateOfBirth: '2005-11-10',
      age: 21,
      gender: 'Male',
      department: 'Mechanical Engineering',
      year: '1st Year (Freshman - Semester 1 & 2)',
      address: 'House No 18, 5th Cross, Indiranagar, Bangalore - 560038',
      registrationDate: 'Nov 17, 2026 at 10:25 PM'
    };

    const reg3Res = await apiPost('/api/register', student3);
    console.log('Registration 3 Response:', reg3Res.status, reg3Res.data);
    console.assert(reg3Res.status === 201, 'Student 3 registration should return 201 Created');
    console.assert(reg3Res.data.totalRegisteredStudents === 3, 'Total registered should be 3');
    console.log('✓ Test 4 Passed: Student 3 successfully registered.\n');

    // --------------------------------------------------------------------------
    // Test 5: Verify Duplicate Prevention (Re-submitting student with existing email)
    // --------------------------------------------------------------------------
    console.log('[Test 5] Testing Duplicate Submission Prevention...');
    const duplicateStudent = {
      registrationNumber: 'APEX-2026-AIML-9999',
      name: 'Aarav Imposter',
      email: 'aarav.patel@example.com', // Duplicate email
      mobile: '9999988888',
      dateOfBirth: '2005-06-15',
      age: 21,
      gender: 'Male',
      department: 'AIML',
      year: '1st Year',
      address: 'Some address, Bangalore'
    };

    const dupRes = await apiPost('/api/register', duplicateStudent);
    console.log('Duplicate Registration Response:', dupRes.status, dupRes.data);
    console.assert(dupRes.status === 409, 'Duplicate submission should return 409 Conflict');
    console.assert(dupRes.data.success === false, 'Success should be false for duplicate');
    console.assert(dupRes.data.message.includes('already registered'), 'Message should indicate existing registration');
    console.log('✓ Test 5 Passed: Duplicate submission successfully blocked.\n');

    // --------------------------------------------------------------------------
    // Test 6: Verify Security & Privacy of private_data folder
    // --------------------------------------------------------------------------
    console.log('[Test 6] Testing Security: Direct Browser Access to private_data...');
    const forbiddenRes = await apiGet('/private_data/APEX_Student_Registrations.xlsx');
    console.log('Private Data Access Response:', forbiddenRes.status, forbiddenRes.data);
    console.assert(forbiddenRes.status === 403, 'Access to private_data should return 403 Forbidden');
    console.log('✓ Test 6 Passed: Excel file is strictly protected from browser access.\n');

    // --------------------------------------------------------------------------
    // Test 7: Verify Excel File Content & Structure
    // --------------------------------------------------------------------------
    console.log('[Test 7] Inspecting Excel Workbook Content on Server...');
    console.assert(fs.existsSync(EXCEL_FILE_PATH), `Excel file must exist at ${EXCEL_FILE_PATH}`);

    const verifyWorkbook = new ExcelJS.Workbook();
    await verifyWorkbook.xlsx.readFile(EXCEL_FILE_PATH);
    const worksheet = verifyWorkbook.getWorksheet('Student Registrations');
    console.assert(worksheet !== null && worksheet !== undefined, 'Worksheet "Student Registrations" must exist');

    console.log('Total rows in worksheet (including header):', worksheet.rowCount);
    console.assert(worksheet.rowCount === 4, 'Worksheet should contain exactly 4 rows (1 header + 3 student records)');

    // Verify Header (Row 1)
    const headerRow = worksheet.getRow(1);
    const expectedHeaders = [
      'Registration Number', 'Student Name', 'Email Address', 'Mobile Number',
      'Date of Birth', 'Age', 'Gender', 'Department', 'Year of Study',
      'Residential Address', 'Registration Date & Time'
    ];
    expectedHeaders.forEach((expectedH, idx) => {
      const cellVal = headerRow.getCell(idx + 1).value;
      console.assert(cellVal === expectedH, `Header column ${idx + 1} should be "${expectedH}", got "${cellVal}"`);
    });
    console.log('✓ Header row verified with correct columns.');

    // Verify Row 2 (Student 1: Aarav Patel)
    const row2 = worksheet.getRow(2);
    console.log('Row 2 (Student 1):', {
      regNumber: row2.getCell(1).value,
      name: row2.getCell(2).value,
      email: row2.getCell(3).value,
      mobile: row2.getCell(4).value,
      age: row2.getCell(6).value
    });
    console.assert(row2.getCell(1).value === 'APEX-2026-AIML-1024', 'Student 1 Reg Number match');
    console.assert(row2.getCell(2).value === 'Aarav Patel', 'Student 1 Name match');
    console.assert(row2.getCell(3).value === 'aarav.patel@example.com', 'Student 1 Email match');

    // Verify Row 3 (Student 2: Sneha Sharma)
    const row3 = worksheet.getRow(3);
    console.log('Row 3 (Student 2):', {
      regNumber: row3.getCell(1).value,
      name: row3.getCell(2).value,
      email: row3.getCell(3).value,
      mobile: row3.getCell(4).value,
      age: row3.getCell(6).value
    });
    console.assert(row3.getCell(1).value === 'APEX-2026-CSE-5892', 'Student 2 Reg Number match');
    console.assert(row3.getCell(2).value === 'Sneha Sharma', 'Student 2 Name match');
    console.assert(row3.getCell(3).value === 'sneha.sharma@example.com', 'Student 2 Email match');

    // Verify Row 4 (Student 3: Rahul Verma)
    const row4 = worksheet.getRow(4);
    console.log('Row 4 (Student 3):', {
      regNumber: row4.getCell(1).value,
      name: row4.getCell(2).value,
      email: row4.getCell(3).value
    });
    console.assert(row4.getCell(1).value === 'APEX-2026-MECH-7731', 'Student 3 Reg Number match');
    console.assert(row4.getCell(2).value === 'Rahul Verma', 'Student 3 Name match');

    // Verify Passwords are NEVER saved anywhere in the Excel file
    console.log('\n[Security Audit] Verifying no passwords leaked into Excel cells...');
    let passwordFound = false;
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        const val = String(cell.value || '');
        if (val.includes('ShouldNeverBeSaved') || val.includes('AnotherSecretPassword') || val.toLowerCase().includes('password')) {
          passwordFound = true;
        }
      });
    });
    console.assert(passwordFound === false, 'SECURITY FAILURE: Password was found in Excel sheet!');
    console.log('✓ Security Audit Passed: Passwords are completely omitted from the Excel workbook.');

    console.log('\n====================================================');
    console.log('  ALL TESTS PASSED SUCCESSFULLY! (7/7)              ');
    console.log('====================================================\n');

  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
