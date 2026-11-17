/**
 * ==============================================================================
 * APEX - Online Student Registration System Backend
 * Server: Node.js & Express with ExcelJS Storage
 * ==============================================================================
 * Features:
 * 1. Express web server hosting the APEX portal frontend assets
 * 2. POST /api/register endpoint for appending student registrations to Excel
 * 3. ExcelJS workbook management in private_data/APEX_Student_Registrations.xlsx
 * 4. Automatic file and directory creation with professional spreadsheet formatting
 * 5. Strict privacy: Never stores passwords; private_data is blocked from browser access
 * 6. Duplicate detection (by email or registration number) and error handling
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 3000;

// Path definitions
const PRIVATE_DATA_DIR = path.join(__dirname, 'private_data');
const EXCEL_FILE_NAME = 'APEX_Student_Registrations.xlsx';
const EXCEL_FILE_PATH = path.join(PRIVATE_DATA_DIR, EXCEL_FILE_NAME);

// Ensure private directory exists upon startup
if (!fs.existsSync(PRIVATE_DATA_DIR)) {
  fs.mkdirSync(PRIVATE_DATA_DIR, { recursive: true });
  console.log(`[APEX Server] Created private data directory: ${PRIVATE_DATA_DIR}`);
}

// ------------------------------------------------------------------------------
// Middleware Configuration
// ------------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SECURITY: Explicitly forbid browser/client access to the private_data folder
app.use('/private_data', (req, res) => {
  res.status(403).json({
    success: false,
    error: 'Access Denied: The private_data directory and registration Excel sheets cannot be accessed through the browser.'
  });
});

// Serve frontend assets (index.html, style.css, script.js)
app.use(express.static(__dirname, {
  dotfiles: 'ignore',
  index: 'index.html'
}));

// ------------------------------------------------------------------------------
// ExcelJS Helper: Initialize or Load Workbook
// ------------------------------------------------------------------------------
const SHEET_NAME = 'Student Registrations';

// Column definitions with header labels and widths
const EXCEL_COLUMNS = [
  { header: 'Registration Number', key: 'regNumber', width: 24 },
  { header: 'Student Name', key: 'name', width: 28 },
  { header: 'Email Address', key: 'email', width: 32 },
  { header: 'Mobile Number', key: 'mobile', width: 18 },
  { header: 'Date of Birth', key: 'dateOfBirth', width: 16 },
  { header: 'Age', key: 'age', width: 12 },
  { header: 'Gender', key: 'gender', width: 14 },
  { header: 'Department', key: 'department', width: 26 },
  { header: 'Year of Study', key: 'year', width: 20 },
  { header: 'Residential Address', key: 'address', width: 38 },
  { header: 'Registration Date & Time', key: 'registrationDate', width: 26 }
];

/**
 * Loads the existing workbook or creates a brand new formatted Excel file.
 * @returns {Promise<ExcelJS.Workbook>}
 */
async function getOrCreateWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'APEX Online Admissions System';
  workbook.lastModifiedBy = 'APEX System Administrator';
  workbook.created = new Date();
  workbook.modified = new Date();

  if (fs.existsSync(EXCEL_FILE_PATH)) {
    // Read existing workbook
    await workbook.xlsx.readFile(EXCEL_FILE_PATH);
    let worksheet = workbook.getWorksheet(SHEET_NAME);
    if (!worksheet) {
      worksheet = workbook.addWorksheet(SHEET_NAME, {
        views: [{ state: 'frozen', ySplit: 1 }]
      });
    }
    // Re-bind column mappings so getCell('key') and addRow({ key: val }) function reliably
    worksheet.columns = EXCEL_COLUMNS;
    return workbook;
  } else {
    // Create new worksheet with custom styles
    const worksheet = workbook.addWorksheet(SHEET_NAME, {
      views: [{ state: 'frozen', ySplit: 1 }] // Freeze header row
    });

    worksheet.columns = EXCEL_COLUMNS;

    // Style the Header Row (Row 1)
    const headerRow = worksheet.getRow(1);
    headerRow.height = 32;

    headerRow.eachCell((cell) => {
      // Deep APEX Navy Blue Fill
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' }
      };
      // Crisp White Bold Typography
      cell.font = {
        name: 'Segoe UI',
        size: 11,
        bold: true,
        color: { argb: 'FFFFFFFF' }
      };
      // Center aligned with middle vertical
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
      // Subdued border
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FF334155' } },
        right: { style: 'thin', color: { argb: 'FF334155' } }
      };
    });

    // Save newly initialized workbook
    await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
    console.log(`[APEX Server] Initialized new Excel workbook: ${EXCEL_FILE_PATH}`);
    return workbook;
  }
}

// Mutex / promise queue to prevent simultaneous write race conditions
let writeQueue = Promise.resolve();

function enqueueWrite(fn) {
  writeQueue = writeQueue.then(fn, fn);
  return writeQueue;
}

// ------------------------------------------------------------------------------
// API Routes
// ------------------------------------------------------------------------------

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    portal: 'APEX Online Student Registration System',
    timestamp: new Date().toISOString(),
    excelConfigured: fs.existsSync(EXCEL_FILE_PATH)
  });
});

/**
 * POST /api/register
 * Receives validated student details and appends a row to the Excel file.
 */
app.post('/api/register', async (req, res) => {
  try {
    const student = req.body;

    // 1. Basic Server-side Validation
    if (!student || !student.name || !student.email || !student.mobile || !student.dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Missing required student registration details.'
      });
    }

    // 2. Strict Security: Reject or delete any password field sent accidentally
    delete student.password;
    delete student.confirmPassword;

    // 3. Thread-safe Excel write operation using enqueueWrite
    const result = await enqueueWrite(async () => {
      const workbook = await getOrCreateWorkbook();
      let worksheet = workbook.getWorksheet(SHEET_NAME);

      if (!worksheet) {
        worksheet = workbook.addWorksheet(SHEET_NAME);
        worksheet.columns = EXCEL_COLUMNS;
      }

      // Check for duplicate submission by email or registration number
      let isDuplicate = false;
      let duplicateReason = '';

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const rowRegNumber = row.getCell(1).value;
        const rowEmail = row.getCell(3).value;

        if (rowEmail && String(rowEmail).toLowerCase().trim() === String(student.email).toLowerCase().trim()) {
          isDuplicate = true;
          duplicateReason = `Student with email '${student.email}' is already registered in APEX records.`;
        } else if (rowRegNumber && String(rowRegNumber).trim() === String(student.registrationNumber).trim()) {
          isDuplicate = true;
          duplicateReason = `Registration Number '${student.registrationNumber}' already exists.`;
        }
      });

      if (isDuplicate) {
        const dupError = new Error(duplicateReason);
        dupError.statusCode = 409;
        throw dupError;
      }

      // Append new student record row
      const newRow = worksheet.addRow({
        regNumber: String(student.registrationNumber || ''),
        name: String(student.name || ''),
        email: String(student.email || ''),
        mobile: String(student.mobile || ''),
        dateOfBirth: String(student.dateOfBirth || ''),
        age: Number(student.age) || '',
        gender: String(student.gender || ''),
        department: String(student.department || student.departmentFull || ''),
        year: String(student.year || ''),
        address: String(student.address || ''),
        registrationDate: String(student.registrationDate || new Date().toLocaleString())
      });

      // Style the newly added data row
      newRow.height = 24;
      const isEvenRow = newRow.number % 2 === 0;

      newRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = {
          name: 'Segoe UI',
          size: 10,
          color: { argb: 'FF0F172A' }
        };
        // Subtle zebra striping
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isEvenRow ? 'FFF8FAFC' : 'FFFFFFFF' }
        };
        // Alignment
        const colKey = EXCEL_COLUMNS[colNumber - 1]?.key;
        if (colKey === 'age' || colKey === 'gender' || colKey === 'mobile' || colKey === 'dateOfBirth') {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else if (colKey === 'regNumber') {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: colKey === 'address' };
        }
        // Border
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      });

      // Commit changes to disk
      await workbook.xlsx.writeFile(EXCEL_FILE_PATH);

      console.log(`[APEX Server] Successfully saved registration for ${student.name} (${student.registrationNumber}) to ${EXCEL_FILE_NAME}`);

      return {
        registrationNumber: student.registrationNumber,
        rowCount: worksheet.rowCount - 1 // Exclude header
      };
    });

    // Send successful response back to frontend
    res.status(201).json({
      success: true,
      message: 'Registration successfully recorded in APEX Excel database.',
      registrationNumber: result.registrationNumber,
      totalRegisteredStudents: result.rowCount
    });

  } catch (error) {
    console.error('[APEX Server Error]', error.message);

    const statusCode = error.statusCode || 500;
    let clientMessage = error.message;

    // Handle locked file error (e.g. if open in MS Excel on the host)
    if (error.code === 'EBUSY' || (error.message && error.message.includes('EBUSY'))) {
      clientMessage = 'The Excel database is currently open by an administrator. Please close Excel and try again.';
    }

    res.status(statusCode).json({
      success: false,
      message: clientMessage || 'An unexpected server error occurred while saving to Excel.'
    });
  }
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  APEX Online Student Registration Server is Running  `);
  console.log(`  Portal URL: http://localhost:${PORT}                 `);
  console.log(`  Excel Storage: ${EXCEL_FILE_PATH}                   `);
  console.log(`=======================================================`);
});

module.exports = { app, server, getOrCreateWorkbook, EXCEL_FILE_PATH };
