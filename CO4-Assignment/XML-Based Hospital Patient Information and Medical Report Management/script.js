/**
 * XML-Based Hospital Patient Information and Medical Report Management System
 * File: script.js
 * Description: Client-side interactive engine providing XML DOM manipulation,
 *              XSD validation simulation, XSLT transformations, navigation, and reactive UI.
 */

// =============================================================================
// 1. Global State Management
// =============================================================================
const AppState = {
    xmlString: '',
    xmlDoc: null,
    xsdString: '',
    xslString: '',
    xslDoc: null,
    patients: [],
    departments: [
        'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology',
        'Pediatrics', 'General Medicine', 'ENT', 'Ophthalmology'
    ],
    bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    isBackendAvailable: false,
    currentViewMode: 'grid', // 'grid' or 'table'
    activeSection: 'dashboard',
    selectedReportPatientId: 'P001'
};

// =============================================================================
// 2. Initialization & XML Data Loading (with CORS / file:// Resilience)
// =============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    checkBackendStatus();
    initSidebarNavigation();
    await loadInitialXmlData();
    initDashboard();
    initPatientRecords();
    initAddPatientForm();
    initSearchSection();
    initXmlValidation();
    initDomOperations();
    initXsltSection();
    initSourceViewer();
});

/**
 * Detects whether PHP backend is active on the server
 */
function checkBackendStatus() {
    const badge = document.getElementById('mode-indicator-badge');
    const modeText = document.getElementById('mode-indicator-text');
    
    if (window.SERVER_ENVIRONMENT && window.SERVER_ENVIRONMENT.isPHP) {
        AppState.isBackendAvailable = true;
        if (badge && modeText) {
            badge.className = 'mode-badge php-mode';
            modeText.textContent = `XAMPP PHP Backend Active (PHP ${window.SERVER_ENVIRONMENT.phpVersion || ''})`;
        }
    } else {
        AppState.isBackendAvailable = false;
        if (badge && modeText) {
            badge.className = 'mode-badge browser-mode';
            modeText.textContent = 'Browser Demonstration Mode (Client XML DOM)';
        }
    }
}

/**
 * Loads patients.xml, patients.xsd, and patients.xsl with graceful fallback
 */
async function loadInitialXmlData() {
    // 1. Load patients.xml (Prioritize embedded data for zero-latency instant preview)
    const embeddedXml = document.getElementById('embedded-patients-xml');
    if (embeddedXml && embeddedXml.textContent.trim().startsWith('<hospital')) {
        AppState.xmlString = embeddedXml.textContent.trim();
    } else {
        try {
            const response = await fetch('patients.xml', { cache: 'no-store' });
            if (response.ok) {
                AppState.xmlString = await response.text();
            } else {
                throw new Error('patients.xml not accessible');
            }
        } catch (e) {
            console.info('Using bundled clinical XML fallback:', e.message);
            AppState.xmlString = getFallbackXmlString();
        }
    }

    // Check localStorage for demo modifications in browser session
    const savedSessionXml = localStorage.getItem('hospital_patients_xml_session');
    if (savedSessionXml && savedSessionXml.includes('<hospital')) {
        AppState.xmlString = savedSessionXml;
    }

    // Parse XML String to DOM
    parseXmlToState(AppState.xmlString);

    // 2. Load patients.xsd
    const embeddedXsd = document.getElementById('embedded-patients-xsd');
    if (embeddedXsd && embeddedXsd.textContent.trim().startsWith('<xs:schema')) {
        AppState.xsdString = embeddedXsd.textContent.trim();
    } else {
        try {
            const response = await fetch('patients.xsd', { cache: 'no-store' });
            if (response.ok) {
                AppState.xsdString = await response.text();
            } else {
                throw new Error('patients.xsd not accessible');
            }
        } catch (e) {
            AppState.xsdString = getFallbackXsdString();
        }
    }

    // 3. Load patients.xsl
    const embeddedXsl = document.getElementById('embedded-patients-xsl');
    if (embeddedXsl && embeddedXsl.textContent.trim().startsWith('<xsl:stylesheet')) {
        AppState.xslString = embeddedXsl.textContent.trim();
        const parser = new DOMParser();
        AppState.xslDoc = parser.parseFromString(AppState.xslString, 'application/xml');
    } else {
        try {
            const response = await fetch('patients.xsl', { cache: 'no-store' });
            if (response.ok) {
                AppState.xslString = await response.text();
                const parser = new DOMParser();
                AppState.xslDoc = parser.parseFromString(AppState.xslString, 'application/xml');
            } else {
                throw new Error('patients.xsl not accessible');
            }
        } catch (e) {
            AppState.xslString = getFallbackXslString();
            const parser = new DOMParser();
            AppState.xslDoc = parser.parseFromString(AppState.xslString, 'application/xml');
        }
    }
}

/**
 * Parses XML string into DOM and extracts patient objects
 */
function parseXmlToState(xmlStr) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'application/xml');
    
    // Check for XML parsing error
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
        console.error('XML Parse Error:', parserError.textContent);
        showToast('Error parsing XML document structure', 'error');
        return false;
    }

    AppState.xmlDoc = doc;
    AppState.xmlString = xmlStr;
    extractPatientsList();
    return true;
}

/**
 * Extracts structured JavaScript patient records from XML DOM
 */
function extractPatientsList() {
    if (!AppState.xmlDoc) return;
    
    const patientNodes = AppState.xmlDoc.getElementsByTagName('patient');
    AppState.patients = [];

    for (let i = 0; i < patientNodes.length; i++) {
        const pNode = patientNodes[i];
        const id = pNode.getAttribute('id') || `P${i+1}`;
        const name = getElementText(pNode, 'name');
        const age = parseInt(getElementText(pNode, 'age'), 10) || 0;
        const gender = getElementText(pNode, 'gender');
        const bloodGroup = getElementText(pNode, 'bloodGroup');
        const doctor = getElementText(pNode, 'doctor');
        const department = getElementText(pNode, 'department');
        const diagnosis = getElementText(pNode, 'diagnosis');

        // Extract Medical Tests
        const tests = [];
        const testNodes = pNode.getElementsByTagName('test');
        for (let j = 0; j < testNodes.length; j++) {
            const tNode = testNodes[j];
            tests.push({
                name: tNode.getAttribute('name') || 'Diagnostic Test',
                result: getElementText(tNode, 'result'),
                status: getElementText(tNode, 'status') || 'Normal'
            });
        }

        AppState.patients.push({
            id,
            name,
            age,
            gender,
            bloodGroup,
            doctor,
            department,
            diagnosis,
            medicalTests: tests
        });
    }
}

function getElementText(parent, tagName) {
    const el = parent.getElementsByTagName(tagName)[0];
    return el ? el.textContent.trim() : '';
}

// =============================================================================
// 3. Left Sidebar Navigation
// =============================================================================
function initSidebarNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.page-section');
    const breadcrumbTitle = document.getElementById('breadcrumb-current-title');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('main-sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('data-section');
            if (!targetSection) return;

            // Highlight active menu item
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Show target section
            sections.forEach(s => s.classList.remove('active'));
            const activeSec = document.getElementById(`section-${targetSection}`);
            if (activeSec) {
                activeSec.classList.add('active');
                AppState.activeSection = targetSection;
            }

            // Update breadcrumb
            const labelText = item.querySelector('span') ? item.querySelector('span').textContent : targetSection;
            if (breadcrumbTitle) breadcrumbTitle.textContent = labelText;

            // Close mobile menu if open
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
            }

            // Trigger specific section refresher
            onSectionNavigated(targetSection);
        });
    });

    // Toggle Desktop Sidebar Collapse
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Toggle Mobile Sidebar
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
}

function navigateToSection(sectionId) {
    const targetLink = document.querySelector(`.sidebar-nav .nav-item[data-section="${sectionId}"]`);
    if (targetLink) {
        targetLink.click();
    }
}

function onSectionNavigated(sectionId) {
    if (sectionId === 'dashboard') {
        updateDashboardMetrics();
    } else if (sectionId === 'records') {
        renderPatientRecords();
    } else if (sectionId === 'reports') {
        renderMedicalReportView(AppState.selectedReportPatientId || (AppState.patients[0] ? AppState.patients[0].id : 'P001'));
    } else if (sectionId === 'source') {
        loadSourceViewerFile('patients.xml');
    } else if (sectionId === 'dom') {
        refreshDomTreePreview();
    }
}

// =============================================================================
// 4. Hospital Dashboard Implementation
// =============================================================================
function initDashboard() {
    updateDashboardMetrics();

    // Quick Action Buttons
    const quickAddBtn = document.getElementById('quick-add-btn');
    if (quickAddBtn) {
        quickAddBtn.addEventListener('click', () => navigateToSection('add-patient'));
    }

    const quickSearchBtn = document.getElementById('quick-search-btn');
    if (quickSearchBtn) {
        quickSearchBtn.addEventListener('click', () => navigateToSection('search'));
    }

    const quickValidateBtn = document.getElementById('quick-validate-btn');
    if (quickValidateBtn) {
        quickValidateBtn.addEventListener('click', () => navigateToSection('validation'));
    }
}

function updateDashboardMetrics() {
    const totalPatientsEl = document.getElementById('stat-total-patients');
    const totalDoctorsEl = document.getElementById('stat-total-doctors');
    const totalDeptsEl = document.getElementById('stat-total-departments');
    const totalReportsEl = document.getElementById('stat-total-reports');

    const totalPatients = AppState.patients.length;
    const uniqueDoctors = new Set(AppState.patients.map(p => p.doctor).filter(Boolean)).size;
    const uniqueDepts = new Set(AppState.patients.map(p => p.department).filter(Boolean)).size;
    const totalReports = AppState.patients.filter(p => p.medicalTests && p.medicalTests.length > 0).length;

    if (totalPatientsEl) totalPatientsEl.textContent = totalPatients;
    if (totalDoctorsEl) totalDoctorsEl.textContent = uniqueDoctors;
    if (totalDeptsEl) totalDeptsEl.textContent = uniqueDepts;
    if (totalReportsEl) totalReportsEl.textContent = totalReports;

    // Populate Recent Registrations Table
    const recentTableBody = document.getElementById('recent-patients-tbody');
    if (recentTableBody) {
        recentTableBody.innerHTML = '';
        const recentPatients = [...AppState.patients].slice(-5).reverse();
        
        recentPatients.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="patient-id-badge">${escapeHtml(p.id)}</span></td>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td>${p.age} yrs (${escapeHtml(p.gender)})</td>
                <td><span class="blood-badge">${escapeHtml(p.bloodGroup)}</span></td>
                <td>${escapeHtml(p.department)}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewPatientDetailModal('${escapeHtml(p.id)}')">
                        View
                    </button>
                </td>
            `;
            recentTableBody.appendChild(tr);
        });
    }

    // Department Distribution Progress Bars
    renderDepartmentDistribution();
}

function renderDepartmentDistribution() {
    const container = document.getElementById('dept-distribution-container');
    if (!container) return;
    container.innerHTML = '';

    const deptCounts = {};
    AppState.departments.forEach(d => deptCounts[d] = 0);
    AppState.patients.forEach(p => {
        if (deptCounts[p.department] !== undefined) {
            deptCounts[p.department]++;
        }
    });

    const total = AppState.patients.length || 1;
    AppState.departments.forEach(dept => {
        const count = deptCounts[dept] || 0;
        const percentage = Math.round((count / total) * 100);

        const item = document.createElement('div');
        item.className = 'dept-bar-item';
        item.innerHTML = `
            <div class="dept-bar-label">
                <span>${dept}</span>
                <span>${count} patients (${percentage}%)</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        container.appendChild(item);
    });
}

// =============================================================================
// 5. Patient Records Interface (Grid, Table, Filters & Search)
// =============================================================================
function initPatientRecords() {
    const searchInput = document.getElementById('records-search-input');
    const deptFilter = document.getElementById('records-dept-filter');
    const bloodFilter = document.getElementById('records-blood-filter');
    const resetBtn = document.getElementById('records-reset-btn');
    const gridViewBtn = document.getElementById('view-grid-btn');
    const tableViewBtn = document.getElementById('view-table-btn');

    if (searchInput) searchInput.addEventListener('input', renderPatientRecords);
    if (deptFilter) deptFilter.addEventListener('change', renderPatientRecords);
    if (bloodFilter) bloodFilter.addEventListener('change', renderPatientRecords);
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (deptFilter) deptFilter.value = 'all';
            if (bloodFilter) bloodFilter.value = 'all';
            renderPatientRecords();
        });
    }

    if (gridViewBtn && tableViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            AppState.currentViewMode = 'grid';
            gridViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            renderPatientRecords();
        });

        tableViewBtn.addEventListener('click', () => {
            AppState.currentViewMode = 'table';
            tableViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            renderPatientRecords();
        });
    }

    renderPatientRecords();
}

function renderPatientRecords() {
    const gridContainer = document.getElementById('patient-records-grid');
    const tableContainer = document.getElementById('patient-records-table-container');
    const emptyState = document.getElementById('records-empty-state');
    const countBadge = document.getElementById('records-count-badge');

    const searchVal = (document.getElementById('records-search-input')?.value || '').toLowerCase().trim();
    const deptVal = document.getElementById('records-dept-filter')?.value || 'all';
    const bloodVal = document.getElementById('records-blood-filter')?.value || 'all';

    // Filter patients
    const filtered = AppState.patients.filter(p => {
        const matchesSearch = !searchVal || 
            p.id.toLowerCase().includes(searchVal) || 
            p.name.toLowerCase().includes(searchVal) ||
            p.diagnosis.toLowerCase().includes(searchVal) ||
            p.doctor.toLowerCase().includes(searchVal);

        const matchesDept = deptVal === 'all' || p.department === deptVal;
        const matchesBlood = bloodVal === 'all' || p.bloodGroup === bloodVal;

        return matchesSearch && matchesDept && matchesBlood;
    });

    if (countBadge) {
        countBadge.textContent = `Showing ${filtered.length} of ${AppState.patients.length} patients`;
    }

    if (filtered.length === 0) {
        if (gridContainer) gridContainer.style.display = 'none';
        if (tableContainer) tableContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (AppState.currentViewMode === 'grid') {
        if (tableContainer) tableContainer.style.display = 'none';
        if (gridContainer) {
            gridContainer.style.display = 'grid';
            gridContainer.innerHTML = '';
            filtered.forEach(p => {
                gridContainer.appendChild(createPatientCardElement(p));
            });
        }
    } else {
        if (gridContainer) gridContainer.style.display = 'none';
        if (tableContainer) {
            tableContainer.style.display = 'block';
            const tbody = document.getElementById('records-table-tbody');
            if (tbody) {
                tbody.innerHTML = '';
                filtered.forEach(p => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><span class="patient-id-badge">${escapeHtml(p.id)}</span></td>
                        <td><strong>${escapeHtml(p.name)}</strong></td>
                        <td>${p.age} yrs / ${escapeHtml(p.gender)}</td>
                        <td><span class="blood-badge">${escapeHtml(p.bloodGroup)}</span></td>
                        <td>${escapeHtml(p.doctor)}</td>
                        <td><span class="badge-dept">${escapeHtml(p.department)}</span></td>
                        <td><span style="font-size:0.82rem; color:#475569;">${escapeHtml(p.diagnosis)}</span></td>
                        <td>
                            <div style="display:flex; gap:6px;">
                                <button class="btn btn-outline btn-sm" onclick="viewPatientDetailModal('${escapeHtml(p.id)}')">View</button>
                                <button class="btn btn-outline-primary btn-sm" onclick="openMedicalReport('${escapeHtml(p.id)}')">Report</button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }
    }
}

function createPatientCardElement(p) {
    const card = document.createElement('div');
    card.className = 'patient-card';

    // Test pills
    let testPillsHtml = '';
    if (p.medicalTests && p.medicalTests.length > 0) {
        testPillsHtml = p.medicalTests.slice(0, 3).map(t => {
            const statusClass = t.status === 'Normal' ? 'status-normal' : 'status-high';
            return `<span class="test-pill ${statusClass}">${escapeHtml(t.name)}: <strong>${escapeHtml(t.result)}</strong></span>`;
        }).join('');
        if (p.medicalTests.length > 3) {
            testPillsHtml += `<span class="test-pill">+${p.medicalTests.length - 3} more</span>`;
        }
    }

    card.innerHTML = `
        <div>
            <div class="patient-card-top">
                <span class="patient-id-badge">${escapeHtml(p.id)}</span>
                <span class="blood-badge">${escapeHtml(p.bloodGroup)}</span>
            </div>
            <div class="patient-name-line">${escapeHtml(p.name)}</div>
            <div class="patient-demographics">${p.age} Years &bull; ${escapeHtml(p.gender)}</div>
            
            <div class="patient-info-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Physician: <strong>${escapeHtml(p.doctor)}</strong></span>
            </div>
            <div class="patient-info-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 3v18"></path></svg>
                <span>Department: <strong style="color:var(--primary);">${escapeHtml(p.department)}</strong></span>
            </div>

            <div class="patient-diagnosis-box">
                <strong>Diagnosis:</strong> ${escapeHtml(p.diagnosis)}
            </div>

            <div class="test-pills-container">
                ${testPillsHtml}
            </div>
        </div>

        <div class="patient-card-footer">
            <button class="btn btn-outline btn-sm" onclick="viewPatientDetailModal('${escapeHtml(p.id)}')">
                Full Details
            </button>
            <button class="btn btn-teal btn-sm" onclick="openMedicalReport('${escapeHtml(p.id)}')">
                Medical Report &rarr;
            </button>
        </div>
    `;

    return card;
}

// =============================================================================
// 6. Add New Patient (XML DOM Creation in Browser & PHP Backend)
// =============================================================================
function initAddPatientForm() {
    const form = document.getElementById('add-patient-form');
    const addTestRowBtn = document.getElementById('add-test-row-btn');
    const resetBtn = document.getElementById('reset-patient-form-btn');

    if (addTestRowBtn) {
        addTestRowBtn.addEventListener('click', () => {
            appendDynamicTestRow();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetAddPatientForm();
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handlePatientRegistration(form);
        });
    }
}

function appendDynamicTestRow(name = '', result = '', status = 'Normal') {
    const container = document.getElementById('dynamic-tests-container');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'test-row';
    row.innerHTML = `
        <div>
            <input type="text" class="input-field test-name-input" placeholder="Test Name (e.g., Blood Glucose)" value="${escapeHtml(name)}" required />
        </div>
        <div>
            <input type="text" class="input-field test-result-input" placeholder="Result (e.g., 110 mg/dL)" value="${escapeHtml(result)}" required />
        </div>
        <div>
            <select class="select-field test-status-select">
                <option value="Normal" ${status==='Normal'?'selected':''}>Normal</option>
                <option value="High" ${status==='High'?'selected':''}>High</option>
                <option value="Low" ${status==='Low'?'selected':''}>Low</option>
                <option value="Elevated" ${status==='Elevated'?'selected':''}>Elevated</option>
                <option value="Critical" ${status==='Critical'?'selected':''}>Critical</option>
                <option value="Abnormal" ${status==='Abnormal'?'selected':''}>Abnormal</option>
                <option value="Positive" ${status==='Positive'?'selected':''}>Positive</option>
                <option value="Negative" ${status==='Negative'?'selected':''}>Negative</option>
            </select>
        </div>
        <div>
            <button type="button" class="btn-remove-test" onclick="this.closest('.test-row').remove()" title="Remove Test">
                &times;
            </button>
        </div>
    `;
    container.appendChild(row);
}

function resetAddPatientForm() {
    const form = document.getElementById('add-patient-form');
    if (form) form.reset();
    const container = document.getElementById('dynamic-tests-container');
    if (container) {
        container.innerHTML = '';
        appendDynamicTestRow(); // default 1 empty test row
    }
    // Auto-generate next suggested patient ID
    suggestNextPatientId();
}

function suggestNextPatientId() {
    const idInput = document.getElementById('new-patient-id');
    if (!idInput) return;

    let maxNum = 0;
    AppState.patients.forEach(p => {
        const num = parseInt(p.id.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
    });

    const nextId = `P${String(maxNum + 1).padStart(3, '0')}`;
    idInput.value = nextId;
}

function handlePatientRegistration(form) {
    const id = document.getElementById('new-patient-id').value.trim();
    const name = document.getElementById('new-patient-name').value.trim();
    const age = parseInt(document.getElementById('new-patient-age').value, 10);
    const gender = document.getElementById('new-patient-gender').value;
    const bloodGroup = document.getElementById('new-patient-blood').value;
    const doctor = document.getElementById('new-patient-doctor').value.trim();
    const department = document.getElementById('new-patient-dept').value;
    const diagnosis = document.getElementById('new-patient-diagnosis').value.trim();

    // 1. Validation: Prevent duplicate Patient ID
    const exists = AppState.patients.some(p => p.id.toUpperCase() === id.toUpperCase());
    if (exists) {
        showToast(`Patient ID "${id}" already exists. Patient IDs must be unique!`, 'error');
        document.getElementById('new-patient-id').focus();
        return;
    }

    // 2. Validation: Age range (0 to 125)
    if (isNaN(age) || age < 0 || age > 125) {
        showToast('Please enter a valid age between 0 and 125.', 'error');
        document.getElementById('new-patient-age').focus();
        return;
    }

    // 3. Validation: Mandatory fields
    if (!id || !name || !doctor || !department || !diagnosis) {
        showToast('Please fill in all mandatory fields.', 'error');
        return;
    }

    // Extract dynamic tests
    const testRows = document.querySelectorAll('#dynamic-tests-container .test-row');
    const medicalTests = [];
    testRows.forEach(row => {
        const tName = row.querySelector('.test-name-input').value.trim();
        const tResult = row.querySelector('.test-result-input').value.trim();
        const tStatus = row.querySelector('.test-status-select').value;
        if (tName && tResult) {
            medicalTests.push({ name: tName, result: tResult, status: tStatus });
        }
    });

    if (medicalTests.length === 0) {
        showToast('Please add at least one medical diagnostic test for the patient.', 'error');
        return;
    }

    // --- XML DOM Manipulation (JavaScript DOMParser & createElement) ---
    const hospitalRoot = AppState.xmlDoc.getElementsByTagName('hospital')[0];
    if (!hospitalRoot) {
        showToast('Invalid XML structure: <hospital> root missing.', 'error');
        return;
    }

    // Create <patient id="...">
    const patientElem = AppState.xmlDoc.createElement('patient');
    patientElem.setAttribute('id', id);

    // Helper to create and append child elements
    const appendChildElem = (tag, text) => {
        const el = AppState.xmlDoc.createElement(tag);
        el.textContent = text;
        patientElem.appendChild(el);
    };

    appendChildElem('name', name);
    appendChildElem('age', age.toString());
    appendChildElem('gender', gender);
    appendChildElem('bloodGroup', bloodGroup);
    appendChildElem('doctor', doctor);
    appendChildElem('department', department);
    appendChildElem('diagnosis', diagnosis);

    // Create <medicalTests> container
    const medicalTestsElem = AppState.xmlDoc.createElement('medicalTests');
    medicalTests.forEach(t => {
        const testElem = AppState.xmlDoc.createElement('test');
        testElem.setAttribute('name', t.name);

        const resultElem = AppState.xmlDoc.createElement('result');
        resultElem.textContent = t.result;
        testElem.appendChild(resultElem);

        const statusElem = AppState.xmlDoc.createElement('status');
        statusElem.textContent = t.status;
        testElem.appendChild(statusElem);

        medicalTestsElem.appendChild(testElem);
    });
    patientElem.appendChild(medicalTestsElem);

    // Append to <hospital>
    hospitalRoot.appendChild(patientElem);

    // Serialize updated XML Document
    const serializer = new XMLSerializer();
    AppState.xmlString = serializer.serializeToString(AppState.xmlDoc);

    // Save in session storage for demo persistence
    localStorage.setItem('hospital_patients_xml_session', AppState.xmlString);

    // Update in-memory reactive state
    extractPatientsList();
    updateDashboardMetrics();
    renderPatientRecords();

    // If PHP backend is active, also trigger backend sync
    if (AppState.isBackendAvailable) {
        syncPatientToPhpBackend({ id, name, age, gender, bloodGroup, doctor, department, diagnosis, medicalTests });
    }

    showToast(`Patient ${id} (${name}) registered into XML DOM successfully!`, 'success');
    resetAddPatientForm();
    navigateToSection('records');
}

/**
 * Backend sync when running inside XAMPP
 */
async function syncPatientToPhpBackend(patientData) {
    try {
        const formData = new FormData();
        formData.append('action', 'dom_add_patient');
        formData.append('patientJson', JSON.stringify(patientData));

        const res = await fetch('index.php', {
            method: 'POST',
            body: formData
        });
        const result = await res.json();
        if (result.success) {
            console.log('PHP DOM backend updated patients.xml on disk:', result);
        }
    } catch (e) {
        console.warn('Backend sync error:', e);
    }
}

// =============================================================================
// 7. Search Patient Section
// =============================================================================
function initSearchSection() {
    const searchBtn = document.getElementById('search-execute-btn');
    const searchInput = document.getElementById('search-query-input');
    const deptSelect = document.getElementById('search-dept-select');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    if (deptSelect) {
        deptSelect.addEventListener('change', performSearch);
    }
}

function performSearch() {
    const query = (document.getElementById('search-query-input')?.value || '').toLowerCase().trim();
    const dept = document.getElementById('search-dept-select')?.value || 'all';
    const resultsContainer = document.getElementById('search-results-container');
    const emptyResult = document.getElementById('search-empty-state');

    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';

    const matches = AppState.patients.filter(p => {
        const matchesQuery = !query ||
            p.id.toLowerCase() === query ||
            p.id.toLowerCase().includes(query) ||
            p.name.toLowerCase().includes(query) ||
            p.diagnosis.toLowerCase().includes(query) ||
            p.doctor.toLowerCase().includes(query);

        const matchesDept = dept === 'all' || p.department === dept;
        return matchesQuery && matchesDept;
    });

    if (matches.length === 0) {
        if (emptyResult) emptyResult.style.display = 'block';
        return;
    }

    if (emptyResult) emptyResult.style.display = 'none';

    matches.forEach(p => {
        const resultCard = document.createElement('div');
        resultCard.className = 'card';
        resultCard.style.borderLeft = '4px solid var(--primary)';
        resultCard.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                <div>
                    <span class="patient-id-badge" style="font-size:0.95rem;">${escapeHtml(p.id)}</span>
                    <strong style="font-size:1.25rem; margin-left:8px; color:var(--text-primary);">${escapeHtml(p.name)}</strong>
                    <div style="color:var(--text-muted); font-size:0.85rem; margin-top:3px;">
                        Age: ${p.age} &bull; Gender: ${escapeHtml(p.gender)} &bull; Blood: <span class="blood-badge">${escapeHtml(p.bloodGroup)}</span>
                    </div>
                </div>
                <div>
                    <span class="badge-dept" style="background:#e0f2fe; color:#0369a1; padding:4px 10px; border-radius:6px; font-weight:600; font-size:0.85rem;">
                        ${escapeHtml(p.department)}
                    </span>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; background:#f8fafc; padding:1rem; border-radius:8px; margin-bottom:1rem; font-size:0.88rem;">
                <div><strong>Attending Physician:</strong> ${escapeHtml(p.doctor)}</div>
                <div><strong>Primary Diagnosis:</strong> ${escapeHtml(p.diagnosis)}</div>
            </div>

            <h5 style="font-size:0.85rem; text-transform:uppercase; color:var(--primary); margin-bottom:0.5rem;">Diagnostic Test Results (${p.medicalTests.length})</h5>
            <table class="report-table" style="font-size:0.82rem; margin-bottom:1rem;">
                <thead>
                    <tr><th>Test Name</th><th>Result Reading</th><th>Status</th></tr>
                </thead>
                <tbody>
                    ${p.medicalTests.map(t => `
                        <tr>
                            <td><strong>${escapeHtml(t.name)}</strong></td>
                            <td>${escapeHtml(t.result)}</td>
                            <td><span class="status-badge ${t.status==='Normal'?'status-normal':'status-high'}">${escapeHtml(t.status)}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
                <button class="btn btn-outline btn-sm" onclick="viewPatientDetailModal('${escapeHtml(p.id)}')">View Full XML Node</button>
                <button class="btn btn-primary btn-sm" onclick="openMedicalReport('${escapeHtml(p.id)}')">Generate Medical Report</button>
            </div>
        `;
        resultsContainer.appendChild(resultCard);
    });
}

// =============================================================================
// 8. XML Schema (XSD) Validation & Parser Error Handling
// =============================================================================
const ValidationScenarios = {
    valid: {
        title: 'Scenario 1: Valid patients.xml Document',
        desc: 'Standard hospital patient records conforming strictly to patients.xsd rules.',
        xml: () => AppState.xmlString
    },
    missingElement: {
        title: 'Scenario 2: Missing Required Element (<diagnosis>)',
        desc: 'Violates XSD element sequence rule: <patient> is missing mandatory <diagnosis>.',
        xml: () => `<?xml version="1.0" encoding="UTF-8"?>
<hospital>
    <patient id="P099">
        <name>Test Incomplete Record</name>
        <age>42</age>
        <gender>Male</gender>
        <bloodGroup>O+</bloodGroup>
        <doctor>Dr. Rajesh Varma</doctor>
        <department>Cardiology</department>
        <!-- Missing <diagnosis> element -->
        <medicalTests>
            <test name="ECG"><result>Normal</result><status>Normal</status></test>
        </medicalTests>
    </patient>
</hospital>`
    },
    invalidAge: {
        title: 'Scenario 3: Invalid Age Value (250)',
        desc: 'Violates xs:maxInclusive="125" constraint on integer age field.',
        xml: () => `<?xml version="1.0" encoding="UTF-8"?>
<hospital>
    <patient id="P098">
        <name>Robert Brown</name>
        <age>250</age>
        <gender>Male</gender>
        <bloodGroup>B+</bloodGroup>
        <doctor>Dr. Sunita Mehra</doctor>
        <department>Orthopedics</department>
        <diagnosis>Age validation violation</diagnosis>
        <medicalTests>
            <test name="Bone Density"><result>Normal</result><status>Normal</status></test>
        </medicalTests>
    </patient>
</hospital>`
    },
    invalidGender: {
        title: 'Scenario 4: Invalid Gender Value ("Alien")',
        desc: 'Violates xs:enumeration restriction [Male, Female, Other].',
        xml: () => `<?xml version="1.0" encoding="UTF-8"?>
<hospital>
    <patient id="P097">
        <name>Alien Sample</name>
        <age>30</age>
        <gender>Alien</gender>
        <bloodGroup>A+</bloodGroup>
        <doctor>Dr. Shalini Reddy</doctor>
        <department>General Medicine</department>
        <diagnosis>Enumeration violation</diagnosis>
        <medicalTests>
            <test name="Blood Test"><result>Unknown</result><status>Normal</status></test>
        </medicalTests>
    </patient>
</hospital>`
    },
    invalidBlood: {
        title: 'Scenario 5: Invalid Blood Group ("X+")',
        desc: 'Violates xs:enumeration [A+, A-, B+, B-, AB+, AB-, O+, O-].',
        xml: () => `<?xml version="1.0" encoding="UTF-8"?>
<hospital>
    <patient id="P096">
        <name>Invalid Blood Type</name>
        <age>25</age>
        <gender>Female</gender>
        <bloodGroup>X+</bloodGroup>
        <doctor>Dr. Vikram Sengupta</doctor>
        <department>Neurology</department>
        <diagnosis>Blood group constraint violation</diagnosis>
        <medicalTests>
            <test name="Hemoglobin"><result>14.2 g/dL</result><status>Normal</status></test>
        </medicalTests>
    </patient>
</hospital>`
    },
    missingId: {
        title: 'Scenario 6: Missing Patient ID Attribute',
        desc: 'Violates xs:attribute use="required" on <patient id="..."> element.',
        xml: () => `<?xml version="1.0" encoding="UTF-8"?>
<hospital>
    <patient>
        <name>Nameless ID Patient</name>
        <age>50</age>
        <gender>Male</gender>
        <bloodGroup>O-</bloodGroup>
        <doctor>Dr. Sanjeev Kapoor</doctor>
        <department>ENT</department>
        <diagnosis>Missing id attribute on patient node</diagnosis>
        <medicalTests>
            <test name="Audiogram"><result>Normal</result><status>Normal</status></test>
        </medicalTests>
    </patient>
</hospital>`
    },
    duplicateId: {
        title: 'Scenario 7: Duplicate Patient ID Attribute ("P001")',
        desc: 'Violates xs:unique identity constraint "UniquePatientId".',
        xml: () => `<?xml version="1.0" encoding="UTF-8"?>
<hospital>
    <patient id="P001">
        <name>Arun Kumar</name>
        <age>35</age>
        <gender>Male</gender>
        <bloodGroup>O+</bloodGroup>
        <doctor>Dr. Rajesh Varma</doctor>
        <department>Cardiology</department>
        <diagnosis>Hypertension</diagnosis>
        <medicalTests>
            <test name="BP"><result>140/90</result><status>High</status></test>
        </medicalTests>
    </patient>
    <patient id="P001">
        <name>Duplicate Arun Kumar</name>
        <age>40</age>
        <gender>Male</gender>
        <bloodGroup>A+</bloodGroup>
        <doctor>Dr. Rajesh Varma</doctor>
        <department>Cardiology</department>
        <diagnosis>Duplicate ID violation</diagnosis>
        <medicalTests>
            <test name="BP"><result>120/80</result><status>Normal</status></test>
        </medicalTests>
    </patient>
</hospital>`
    }
};

function initXmlValidation() {
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    const xmlEditor = document.getElementById('validation-xml-input');
    const runValidationBtn = document.getElementById('execute-validation-btn');

    scenarioButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            scenarioButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const scenarioKey = btn.getAttribute('data-scenario');
            if (ValidationScenarios[scenarioKey] && xmlEditor) {
                const xmlContent = ValidationScenarios[scenarioKey].xml();
                xmlEditor.value = xmlContent;
                executeXmlValidation(xmlContent, ValidationScenarios[scenarioKey]);
            }
        });
    });

    if (runValidationBtn && xmlEditor) {
        runValidationBtn.addEventListener('click', () => {
            executeXmlValidation(xmlEditor.value, {
                title: 'Custom XML Input Validation',
                desc: 'Validation executed against patients.xsd constraints.'
            });
        });
    }

    // Set default initial scenario
    if (xmlEditor) {
        xmlEditor.value = ValidationScenarios.valid.xml();
    }
}

/**
 * Validates XML against both Well-Formedness (XML Parser) and XSD Rules (Schema Validator)
 */
async function executeXmlValidation(xmlStr, scenarioInfo) {
    const resultBox = document.getElementById('validation-result-box');
    const statusHeader = document.getElementById('validation-status-header');
    const statusBadge = document.getElementById('validation-status-badge');
    const statusSummary = document.getElementById('validation-status-summary');
    const errorsList = document.getElementById('validation-errors-list');
    const wellFormedBadge = document.getElementById('wellformed-status-badge');
    const schemaValidBadge = document.getElementById('schemavalid-status-badge');

    if (!resultBox) return;

    // Step 1: Check Well-Formedness
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'application/xml');
    const parseError = doc.querySelector('parsererror');

    const errors = [];
    let isWellFormed = !parseError;

    if (!isWellFormed) {
        errors.push({
            type: 'Structural Syntax Error (Not Well-Formed)',
            message: parseError.textContent.split('\n')[0] || 'XML syntax is malformed. Tags must be properly nested and closed.'
        });
    } else {
        // Step 2: Validate against XSD rules
        validateXmlAgainstSchemaRules(doc, errors);
    }

    // If PHP Backend is available, also call PHP's DOMDocument::schemaValidate
    if (AppState.isBackendAvailable && isWellFormed) {
        try {
            const formData = new FormData();
            formData.append('action', 'validate_xml');
            formData.append('xmlContent', xmlStr);
            const phpRes = await fetch('index.php', { method: 'POST', body: formData });
            const phpResult = await phpRes.json();
            if (!phpResult.isValid && phpResult.errors) {
                console.log('PHP LibXML Errors:', phpResult.errors);
            }
        } catch (e) {
            console.warn('PHP schemaValidate check failed:', e);
        }
    }

    const isValid = isWellFormed && errors.length === 0;

    // Render Badges
    if (wellFormedBadge) {
        wellFormedBadge.className = isWellFormed ? 'validation-badge pass' : 'validation-badge fail';
        wellFormedBadge.textContent = isWellFormed ? '✓ Well-Formed XML' : '✕ Not Well-Formed';
    }

    if (schemaValidBadge) {
        schemaValidBadge.className = isValid ? 'validation-badge pass' : 'validation-badge fail';
        schemaValidBadge.textContent = isValid ? '✓ Valid (XSD Compliant)' : '✕ Invalid (XSD Violation)';
    }

    if (statusHeader) {
        statusHeader.className = isValid ? 'validation-result-header pass' : 'validation-result-header fail';
    }

    if (statusBadge) {
        statusBadge.textContent = isValid ? 'PASSED VALIDATION' : 'VALIDATION FAILED';
    }

    if (statusSummary) {
        statusSummary.textContent = isValid 
            ? `${scenarioInfo.title}: The XML document is well-formed and strictly conforms to patients.xsd.`
            : `${scenarioInfo.title}: Found ${errors.length} validation failure(s) violating XSD schema requirements.`;
    }

    if (errorsList) {
        errorsList.innerHTML = '';
        if (isValid) {
            const li = document.createElement('li');
            li.style.color = '#166534';
            li.style.padding = '0.5rem 0';
            li.innerHTML = `<strong>Success:</strong> All elements, attributes, identity constraints, and enumerations conform to patients.xsd.`;
            errorsList.appendChild(li);
        } else {
            errors.forEach((err, idx) => {
                const li = document.createElement('li');
                li.className = 'validation-error-item';
                li.innerHTML = `<strong>Error ${idx+1} [${err.type}]:</strong> ${escapeHtml(err.message)}`;
                errorsList.appendChild(li);
            });
        }
    }

    resultBox.style.display = 'block';
}

/**
 * Client-Side XSD Validator Engine enforcing all constraints of patients.xsd
 */
function validateXmlAgainstSchemaRules(doc, errors) {
    const hospital = doc.querySelector('hospital');
    if (!hospital) {
        errors.push({
            type: 'Root Element Violation',
            message: 'Root element must be <hospital>. Found: ' + (doc.documentElement ? doc.documentElement.tagName : 'none')
        });
        return;
    }

    const patients = doc.querySelectorAll('hospital > patient');
    if (patients.length === 0) {
        errors.push({
            type: 'Cardinality Violation',
            message: '<hospital> must contain at least 1 <patient> element (minOccurs="1").'
        });
        return;
    }

    // Constraint: xs:unique on patient/@id
    const seenIds = new Set();
    const validDepts = AppState.departments;
    const validBlood = AppState.bloodGroups;
    const validGenders = ['Male', 'Female', 'Other'];
    const validStatuses = ['Normal', 'High', 'Low', 'Elevated', 'Critical', 'Abnormal', 'Positive', 'Negative', 'Pending'];

    patients.forEach((p, idx) => {
        const pNum = idx + 1;
        const id = p.getAttribute('id');

        // Check required id attribute
        if (!id) {
            errors.push({
                type: 'Attribute Required',
                message: `Patient #${pNum} is missing required attribute "id".`
            });
        } else {
            // Check regex pattern: P[0-9]{3,5}
            if (!/^P[0-9]{3,5}$/.test(id)) {
                errors.push({
                    type: 'Pattern Facet Violation',
                    message: `Patient ID "${id}" does not match pattern "P[0-9]{3,5}".`
                });
            }

            // Check unique constraint
            if (seenIds.has(id)) {
                errors.push({
                    type: 'Identity Constraint Violation (xs:unique)',
                    message: `Duplicate Patient ID "${id}" detected. Constraint "UniquePatientId" violated.`
                });
            }
            seenIds.add(id);
        }

        // Required child elements sequence
        const requiredElements = ['name', 'age', 'gender', 'bloodGroup', 'doctor', 'department', 'diagnosis', 'medicalTests'];
        requiredElements.forEach(elemName => {
            const el = p.querySelector(elemName);
            if (!el) {
                errors.push({
                    type: 'Missing Required Element',
                    message: `Patient [${id || '#' + pNum}] is missing required element <${elemName}>.`
                });
            }
        });

        // Validate Age (integer, 0 to 125)
        const ageEl = p.querySelector('age');
        if (ageEl) {
            const ageVal = Number(ageEl.textContent.trim());
            if (isNaN(ageVal) || !Number.isInteger(ageVal)) {
                errors.push({
                    type: 'Type Facet Violation',
                    message: `Patient [${id}]: Age "${ageEl.textContent}" is not a valid xs:integer.`
                });
            } else if (ageVal < 0 || ageVal > 125) {
                errors.push({
                    type: 'Range Facet Violation',
                    message: `Patient [${id}]: Age ${ageVal} violates minInclusive="0" or maxInclusive="125".`
                });
            }
        }

        // Validate Gender enumeration
        const genderEl = p.querySelector('gender');
        if (genderEl) {
            const gVal = genderEl.textContent.trim();
            if (!validGenders.includes(gVal)) {
                errors.push({
                    type: 'Enumeration Facet Violation',
                    message: `Patient [${id}]: Gender "${gVal}" is invalid. Permitted: [${validGenders.join(', ')}].`
                });
            }
        }

        // Validate Blood Group enumeration
        const bloodEl = p.querySelector('bloodGroup');
        if (bloodEl) {
            const bVal = bloodEl.textContent.trim();
            if (!validBlood.includes(bVal)) {
                errors.push({
                    type: 'Enumeration Facet Violation',
                    message: `Patient [${id}]: Blood group "${bVal}" is invalid. Permitted: [${validBlood.join(', ')}].`
                });
            }
        }

        // Validate Department enumeration
        const deptEl = p.querySelector('department');
        if (deptEl) {
            const dVal = deptEl.textContent.trim();
            if (!validDepts.includes(dVal)) {
                errors.push({
                    type: 'Enumeration Facet Violation',
                    message: `Patient [${id}]: Department "${dVal}" is invalid. Permitted: [${validDepts.join(', ')}].`
                });
            }
        }

        // Validate Medical Tests
        const medicalTestsEl = p.querySelector('medicalTests');
        if (medicalTestsEl) {
            const tests = medicalTestsEl.querySelectorAll('test');
            if (tests.length === 0) {
                errors.push({
                    type: 'MinOccurs Violation',
                    message: `Patient [${id}]: <medicalTests> must contain at least 1 <test> element.`
                });
            }

            tests.forEach((t, tIdx) => {
                const tName = t.getAttribute('name');
                if (!tName || tName.trim() === '') {
                    errors.push({
                        type: 'Attribute Required',
                        message: `Patient [${id}], Test #${tIdx+1} is missing required attribute "name".`
                    });
                }
                const resEl = t.querySelector('result');
                if (!resEl || resEl.textContent.trim() === '') {
                    errors.push({
                        type: 'Element Empty/Missing',
                        message: `Patient [${id}], Test "${tName || '#' + (tIdx+1)}" is missing required <result>.`
                    });
                }
                const statEl = t.querySelector('status');
                if (!statEl || !validStatuses.includes(statEl.textContent.trim())) {
                    errors.push({
                        type: 'Status Facet Violation',
                        message: `Patient [${id}], Test "${tName || '#' + (tIdx+1)}" status is invalid or missing.`
                    });
                }
            });
        }
    });
}

// =============================================================================
// 9. XML DOM Operations (Retrieve, Modify, Add, Medical Tests)
// =============================================================================
function initDomOperations() {
    const tabBtns = document.querySelectorAll('.dom-tab-btn');
    const tabPanels = document.querySelectorAll('.dom-tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(`dom-tab-${targetId}`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // Operation 1: Retrieve Patient
    const retrieveBtn = document.getElementById('dom-retrieve-btn');
    if (retrieveBtn) {
        retrieveBtn.addEventListener('click', executeDomRetrieve);
    }

    // Operation 2: Modify Patient
    const modifySelect = document.getElementById('dom-modify-patient-select');
    if (modifySelect) {
        modifySelect.addEventListener('change', populateDomModifyFields);
    }
    const modifyBtn = document.getElementById('dom-modify-btn');
    if (modifyBtn) {
        modifyBtn.addEventListener('click', executeDomModify);
    }

    // Operation 3: Add Patient
    const domAddBtn = document.getElementById('dom-add-submit-btn');
    if (domAddBtn) {
        domAddBtn.addEventListener('click', executeDomAddPatient);
    }

    // Operation 4: Medical Test Ops
    const testSelect = document.getElementById('dom-test-patient-select');
    if (testSelect) {
        testSelect.addEventListener('change', populateDomTestList);
    }
    const addTestBtn = document.getElementById('dom-test-add-btn');
    if (addTestBtn) {
        addTestBtn.addEventListener('click', executeDomAddTest);
    }

    populateDomPatientDropdowns();
    refreshDomTreePreview();
}

function populateDomPatientDropdowns() {
    const modifySelect = document.getElementById('dom-modify-patient-select');
    const testSelect = document.getElementById('dom-test-patient-select');
    const retrieveInput = document.getElementById('dom-retrieve-id-input');

    const optionsHtml = AppState.patients.map(p => 
        `<option value="${escapeHtml(p.id)}">${escapeHtml(p.id)} - ${escapeHtml(p.name)} (${escapeHtml(p.department)})</option>`
    ).join('');

    if (modifySelect) {
        modifySelect.innerHTML = optionsHtml;
        populateDomModifyFields();
    }
    if (testSelect) {
        testSelect.innerHTML = optionsHtml;
        populateDomTestList();
    }
    if (retrieveInput && !retrieveInput.value && AppState.patients[0]) {
        retrieveInput.value = AppState.patients[0].id;
    }
}

function executeDomRetrieve() {
    const idInput = document.getElementById('dom-retrieve-id-input');
    const displayCard = document.getElementById('dom-retrieve-result');
    const codePre = document.getElementById('dom-retrieve-xml-pre');

    if (!idInput || !displayCard) return;
    const targetId = idInput.value.trim().toUpperCase();

    // Actual DOM method: getElementsByTagName + getAttribute
    const patientNodes = AppState.xmlDoc.getElementsByTagName('patient');
    let matchedNode = null;

    for (let i = 0; i < patientNodes.length; i++) {
        if (patientNodes[i].getAttribute('id')?.toUpperCase() === targetId) {
            matchedNode = patientNodes[i];
            break;
        }
    }

    if (!matchedNode) {
        displayCard.innerHTML = `<div class="validation-error-item">Patient with ID "${escapeHtml(targetId)}" not found in XML DOM.</div>`;
        if (codePre) codePre.textContent = '';
        return;
    }

    // Extract details via DOM methods
    const name = matchedNode.getElementsByTagName('name')[0]?.textContent || '';
    const age = matchedNode.getElementsByTagName('age')[0]?.textContent || '';
    const gender = matchedNode.getElementsByTagName('gender')[0]?.textContent || '';
    const blood = matchedNode.getElementsByTagName('bloodGroup')[0]?.textContent || '';
    const doctor = matchedNode.getElementsByTagName('doctor')[0]?.textContent || '';
    const dept = matchedNode.getElementsByTagName('department')[0]?.textContent || '';
    const diag = matchedNode.getElementsByTagName('diagnosis')[0]?.textContent || '';

    // Serialize specific node
    const serializer = new XMLSerializer();
    const nodeXml = serializer.serializeToString(matchedNode);

    displayCard.innerHTML = `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <h4 style="color:#0369a1; font-size:1.1rem;">${escapeHtml(name)} (<span class="patient-id-badge">${escapeHtml(targetId)}</span>)</h4>
                <span class="blood-badge">${escapeHtml(blood)}</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.88rem; margin-bottom:0.75rem;">
                <div><strong>Age / Gender:</strong> ${age} yrs / ${escapeHtml(gender)}</div>
                <div><strong>Department:</strong> ${escapeHtml(dept)}</div>
                <div><strong>Attending Doctor:</strong> ${escapeHtml(doctor)}</div>
                <div><strong>Diagnosis:</strong> ${escapeHtml(diag)}</div>
            </div>
        </div>
    `;

    if (codePre) {
        codePre.textContent = formatXmlString(nodeXml);
    }
}

function populateDomModifyFields() {
    const select = document.getElementById('dom-modify-patient-select');
    if (!select) return;
    const selectedId = select.value;
    const patient = AppState.patients.find(p => p.id === selectedId);
    if (!patient) return;

    document.getElementById('dom-modify-name').value = patient.name;
    document.getElementById('dom-modify-age').value = patient.age;
    document.getElementById('dom-modify-doctor').value = patient.doctor;
    document.getElementById('dom-modify-dept').value = patient.department;
    document.getElementById('dom-modify-diagnosis').value = patient.diagnosis;
}

function executeDomModify() {
    const select = document.getElementById('dom-modify-patient-select');
    if (!select) return;
    const selectedId = select.value;

    const newName = document.getElementById('dom-modify-name').value.trim();
    const newAge = document.getElementById('dom-modify-age').value.trim();
    const newDoctor = document.getElementById('dom-modify-doctor').value.trim();
    const newDept = document.getElementById('dom-modify-dept').value;
    const newDiag = document.getElementById('dom-modify-diagnosis').value.trim();

    // DOM Operation: Search patient node and update textContent
    const patientNodes = AppState.xmlDoc.getElementsByTagName('patient');
    let targetNode = null;

    for (let i = 0; i < patientNodes.length; i++) {
        if (patientNodes[i].getAttribute('id') === selectedId) {
            targetNode = patientNodes[i];
            break;
        }
    }

    if (!targetNode) {
        showToast('Target patient not found in DOM.', 'error');
        return;
    }

    // Update child nodes
    if (newName) targetNode.getElementsByTagName('name')[0].textContent = newName;
    if (newAge) targetNode.getElementsByTagName('age')[0].textContent = newAge;
    if (newDoctor) targetNode.getElementsByTagName('doctor')[0].textContent = newDoctor;
    if (newDept) targetNode.getElementsByTagName('department')[0].textContent = newDept;
    if (newDiag) targetNode.getElementsByTagName('diagnosis')[0].textContent = newDiag;

    // Serialize and sync state
    const serializer = new XMLSerializer();
    AppState.xmlString = serializer.serializeToString(AppState.xmlDoc);
    localStorage.setItem('hospital_patients_xml_session', AppState.xmlString);

    extractPatientsList();
    updateDashboardMetrics();
    renderPatientRecords();
    refreshDomTreePreview();

    showToast(`Patient ${selectedId} updated via XML DOM!`, 'success');

    // Display updated node in pre
    const diffPre = document.getElementById('dom-modify-result-pre');
    if (diffPre) {
        diffPre.textContent = formatXmlString(serializer.serializeToString(targetNode));
    }
}

function executeDomAddPatient() {
    // Navigate to Add Patient form or trigger inline DOM creation
    navigateToSection('add-patient');
}

function populateDomTestList() {
    const select = document.getElementById('dom-test-patient-select');
    const container = document.getElementById('dom-existing-tests-list');
    if (!select || !container) return;

    const patientId = select.value;
    const patient = AppState.patients.find(p => p.id === patientId);
    if (!patient) return;

    container.innerHTML = '';
    patient.medicalTests.forEach((t, idx) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '0.5rem 0.75rem';
        item.style.background = '#f8fafc';
        item.style.borderRadius = '6px';
        item.style.marginBottom = '6px';
        item.style.fontSize = '0.86rem';
        item.innerHTML = `
            <div>
                <strong>${escapeHtml(t.name)}</strong>: ${escapeHtml(t.result)}
                <span class="status-badge ${t.status==='Normal'?'status-normal':'status-high'}" style="margin-left:6px; font-size:0.75rem;">
                    ${escapeHtml(t.status)}
                </span>
            </div>
            <div>
                <button class="btn btn-outline btn-sm" style="color:#ef4444; border-color:#fecaca;" onclick="executeDomDeleteTest('${escapeHtml(patientId)}', ${idx})">
                    Remove
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

function executeDomAddTest() {
    const select = document.getElementById('dom-test-patient-select');
    const testName = document.getElementById('dom-new-test-name').value.trim();
    const testResult = document.getElementById('dom-new-test-result').value.trim();
    const testStatus = document.getElementById('dom-new-test-status').value;

    if (!select || !testName || !testResult) {
        showToast('Please provide both Test Name and Test Result.', 'error');
        return;
    }

    const patientId = select.value;
    const patientNodes = AppState.xmlDoc.getElementsByTagName('patient');
    let targetPatientNode = null;

    for (let i = 0; i < patientNodes.length; i++) {
        if (patientNodes[i].getAttribute('id') === patientId) {
            targetPatientNode = patientNodes[i];
            break;
        }
    }

    if (!targetPatientNode) return;

    let medicalTestsNode = targetPatientNode.getElementsByTagName('medicalTests')[0];
    if (!medicalTestsNode) {
        medicalTestsNode = AppState.xmlDoc.createElement('medicalTests');
        targetPatientNode.appendChild(medicalTestsNode);
    }

    // DOM createElement & appendChild
    const newTest = AppState.xmlDoc.createElement('test');
    newTest.setAttribute('name', testName);

    const resElem = AppState.xmlDoc.createElement('result');
    resElem.textContent = testResult;
    newTest.appendChild(resElem);

    const statElem = AppState.xmlDoc.createElement('status');
    statElem.textContent = testStatus;
    newTest.appendChild(statElem);

    medicalTestsNode.appendChild(newTest);

    // Save and re-render
    const serializer = new XMLSerializer();
    AppState.xmlString = serializer.serializeToString(AppState.xmlDoc);
    localStorage.setItem('hospital_patients_xml_session', AppState.xmlString);

    extractPatientsList();
    populateDomTestList();
    renderPatientRecords();
    refreshDomTreePreview();

    document.getElementById('dom-new-test-name').value = '';
    document.getElementById('dom-new-test-result').value = '';

    showToast(`Added test "${testName}" to patient ${patientId} in XML DOM!`, 'success');
}

function executeDomDeleteTest(patientId, testIndex) {
    const patientNodes = AppState.xmlDoc.getElementsByTagName('patient');
    for (let i = 0; i < patientNodes.length; i++) {
        if (patientNodes[i].getAttribute('id') === patientId) {
            const testsNode = patientNodes[i].getElementsByTagName('medicalTests')[0];
            if (testsNode) {
                const testElements = testsNode.getElementsByTagName('test');
                if (testElements[testIndex]) {
                    testsNode.removeChild(testElements[testIndex]);
                    
                    const serializer = new XMLSerializer();
                    AppState.xmlString = serializer.serializeToString(AppState.xmlDoc);
                    localStorage.setItem('hospital_patients_xml_session', AppState.xmlString);

                    extractPatientsList();
                    populateDomTestList();
                    renderPatientRecords();
                    refreshDomTreePreview();
                    showToast(`Removed test from patient ${patientId}`, 'info');
                    break;
                }
            }
        }
    }
}

function refreshDomTreePreview() {
    const previewPre = document.getElementById('dom-tree-preview-pre');
    if (previewPre && AppState.xmlString) {
        previewPre.textContent = formatXmlString(AppState.xmlString);
    }
}

// =============================================================================
// 10. Medical Reports Section (Official Printable Hospital Report)
// =============================================================================
function openMedicalReport(patientId) {
    AppState.selectedReportPatientId = patientId;
    navigateToSection('reports');
}

function renderMedicalReportView(patientId) {
    const patient = AppState.patients.find(p => p.id === patientId) || AppState.patients[0];
    if (!patient) return;

    AppState.selectedReportPatientId = patient.id;

    // Populate patient selector dropdown
    const selector = document.getElementById('report-patient-select');
    if (selector) {
        selector.innerHTML = AppState.patients.map(p => 
            `<option value="${escapeHtml(p.id)}" ${p.id===patient.id?'selected':''}>${escapeHtml(p.id)} - ${escapeHtml(p.name)} (${escapeHtml(p.department)})</option>`
        ).join('');

        selector.onchange = (e) => {
            renderMedicalReportView(e.target.value);
        };
    }

    // Populate Report Template Fields
    document.getElementById('rep-meta-id').textContent = `REP-${patient.id}-${new Date().getFullYear()}`;
    document.getElementById('rep-meta-date').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    document.getElementById('rep-patient-id').textContent = patient.id;
    document.getElementById('rep-patient-name').textContent = patient.name;
    document.getElementById('rep-patient-age-gender').textContent = `${patient.age} Yrs / ${patient.gender}`;
    document.getElementById('rep-patient-blood').textContent = patient.bloodGroup;

    document.getElementById('rep-doctor-name').textContent = patient.doctor;
    document.getElementById('rep-doctor-dept').textContent = patient.department;
    document.getElementById('rep-doctor-signoff').textContent = patient.doctor;

    document.getElementById('rep-diagnosis').textContent = patient.diagnosis;

    // Diagnostic tests table
    const tbody = document.getElementById('rep-tests-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        patient.medicalTests.forEach(t => {
            const tr = document.createElement('tr');
            const statusClass = t.status === 'Normal' ? 'status-normal' : 'status-high';
            tr.innerHTML = `
                <td><strong>${escapeHtml(t.name)}</strong></td>
                <td>${escapeHtml(t.result)}</td>
                <td><span class="status-badge ${statusClass}">${escapeHtml(t.status)}</span></td>
                <td>Clinical Correlation Recommended</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Hook Print & Download Buttons
    const printBtn = document.getElementById('print-report-btn');
    if (printBtn) {
        printBtn.onclick = () => window.print();
    }

    const downloadBtn = document.getElementById('download-report-btn');
    if (downloadBtn) {
        downloadBtn.onclick = () => downloadReportAsHtml(patient);
    }
}

function downloadReportAsHtml(patient) {
    const reportHtml = document.getElementById('printable-medical-report').innerHTML;
    const fullDoc = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>Medical Report - ${patient.id} - ${patient.name}</title>
    <link rel="stylesheet" href="style.css"/>
    <style>
        body { padding: 40px; background: #fff; }
        .medical-report-view { box-shadow: none; border: 1px solid #cbd5e1; }
    </style>
</head>
<body>
    <div class="medical-report-view">
        ${reportHtml}
    </div>
</body>
</html>`;

    const blob = new Blob([fullDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medical_Report_${patient.id}_${patient.name.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Medical Report for ${patient.id} downloaded!`, 'success');
}

// =============================================================================
// 11. XSLT Transformation (Browser Native & PHP Engine)
// =============================================================================
function initXsltSection() {
    const transformBtn = document.getElementById('xslt-transform-btn');
    const viewXmlBtn = document.getElementById('xslt-view-xml-btn');
    const viewXslBtn = document.getElementById('xslt-view-xsl-btn');

    if (transformBtn) {
        transformBtn.addEventListener('click', executeXsltTransformation);
    }

    if (viewXmlBtn) {
        viewXmlBtn.addEventListener('click', () => {
            navigateToSection('source');
            loadSourceViewerFile('patients.xml');
        });
    }

    if (viewXslBtn) {
        viewXslBtn.addEventListener('click', () => {
            navigateToSection('source');
            loadSourceViewerFile('patients.xsl');
        });
    }

    // Auto-transform on initial load
    setTimeout(executeXsltTransformation, 500);
}

async function executeXsltTransformation() {
    const frame = document.getElementById('xslt-result-frame');
    const statusNote = document.getElementById('xslt-mode-note');
    if (!frame) return;

    // Check if PHP Backend is active and can transform via XSLTProcessor
    if (AppState.isBackendAvailable) {
        try {
            const res = await fetch('index.php?action=transform_xslt');
            if (res.ok) {
                const transformedHtml = await res.text();
                frame.srcdoc = transformedHtml;
                if (statusNote) {
                    statusNote.innerHTML = `<strong>Backend Mode:</strong> Transformed via PHP <code>XSLTProcessor::transformToXML()</code>.`;
                }
                showToast('XSLT Transformation completed via PHP XSLTProcessor!', 'success');
                return;
            }
        } catch (e) {
            console.warn('PHP XSLT transformation fetch error, falling back to browser XSLT:', e);
        }
    }

    // Browser Native XSLTProcessor
    try {
        if (window.XSLTProcessor && AppState.xslDoc && AppState.xmlDoc) {
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(AppState.xslDoc);
            
            const resultDoc = xsltProcessor.transformToDocument(AppState.xmlDoc);
            const serializer = new XMLSerializer();
            const resultHtml = serializer.serializeToString(resultDoc);

            frame.srcdoc = resultHtml;
            if (statusNote) {
                statusNote.innerHTML = `<strong>Browser Demonstration Mode:</strong> Transformed in browser memory via native <code>window.XSLTProcessor</code>.`;
            }
            showToast('XSLT Transformation executed in browser memory!', 'success');
        } else {
            throw new Error('Native XSLTProcessor unavailable or XSL not parsed');
        }
    } catch (err) {
        console.warn('Native XSLTProcessor fallback:', err);
        // Fallback: Generate HTML medical report directly from parsed XML records
        frame.srcdoc = generateFallbackXsltReportHtml();
        if (statusNote) {
            statusNote.innerHTML = `<strong>Browser Fallback:</strong> Rendered formatted HTML report from XML DOM data.`;
        }
    }
}

function generateFallbackXsltReportHtml() {
    let patientCardsHtml = '';
    AppState.patients.forEach(p => {
        patientCardsHtml += `
            <article class="patient-report-card" style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; margin-bottom:20px; padding:20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                    <span style="background:#0284c7; color:#fff; padding:3px 8px; border-radius:4px; font-weight:bold;">${escapeHtml(p.id)}</span>
                    <strong style="font-size:16px;">${escapeHtml(p.name)}</strong>
                    <span style="color:#0369a1; font-weight:bold;">${escapeHtml(p.department)}</span>
                </div>
                <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:13px;">
                    <tr style="background:#f1f5f9;"><th style="padding:6px; border:1px solid #cbd5e1;">Age</th><th style="padding:6px; border:1px solid #cbd5e1;">Gender</th><th style="padding:6px; border:1px solid #cbd5e1;">Blood</th><th style="padding:6px; border:1px solid #cbd5e1;">Doctor</th></tr>
                    <tr><td style="padding:6px; border:1px solid #cbd5e1;">${p.age}</td><td style="padding:6px; border:1px solid #cbd5e1;">${p.gender}</td><td style="padding:6px; border:1px solid #cbd5e1; color:#0284c7; font-weight:bold;">${p.bloodGroup}</td><td style="padding:6px; border:1px solid #cbd5e1;">${p.doctor}</td></tr>
                </table>
                <div style="font-size:13px; margin-bottom:10px;"><strong>Diagnosis:</strong> ${escapeHtml(p.diagnosis)}</div>
                <h5 style="margin:10px 0 6px 0; font-size:13px; color:#0284c7;">Diagnostic Tests</h5>
                <table style="width:100%; border-collapse:collapse; font-size:13px;">
                    <tr style="background:#f8fafc;"><th style="padding:6px; border:1px solid #cbd5e1; text-align:left;">Test Name</th><th style="padding:6px; border:1px solid #cbd5e1; text-align:left;">Result</th><th style="padding:6px; border:1px solid #cbd5e1; text-align:left;">Status</th></tr>
                    ${p.medicalTests.map(t => `
                        <tr><td style="padding:6px; border:1px solid #cbd5e1;">${escapeHtml(t.name)}</td><td style="padding:6px; border:1px solid #cbd5e1;">${escapeHtml(t.result)}</td><td style="padding:6px; border:1px solid #cbd5e1;"><span style="color:${t.status==='Normal'?'#166534':'#991b1b'}; font-weight:bold;">${escapeHtml(t.status)}</span></td></tr>
                    `).join('')}
                </table>
            </article>
        `;
    });

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>XSLT Report</title>
    <style>body { font-family: sans-serif; background: #f8fafc; padding: 20px; }</style>
</head>
<body>
    <header style="background:#fff; padding:20px; border-radius:10px; border:1px solid #cbd5e1; margin-bottom:20px; display:flex; justify-content:space-between;">
        <h2>AURA METROPOLITAN HOSPITAL - XSLT REPORT</h2>
        <span>Total Records: ${AppState.patients.length}</span>
    </header>
    ${patientCardsHtml}
</body>
</html>`;
}

// =============================================================================
// 12. XML Source Viewer
// =============================================================================
function initSourceViewer() {
    const tabs = document.querySelectorAll('.source-tab-btn');
    const copyBtn = document.getElementById('copy-source-btn');
    const downloadBtn = document.getElementById('download-source-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const file = tab.getAttribute('data-file');
            loadSourceViewerFile(file);
        });
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const codePre = document.getElementById('source-code-pre');
            if (codePre) {
                navigator.clipboard.writeText(codePre.textContent).then(() => {
                    showToast('Source code copied to clipboard!', 'success');
                });
            }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.source-tab-btn.active');
            const fileName = activeTab ? activeTab.getAttribute('data-file') : 'patients.xml';
            const codePre = document.getElementById('source-code-pre');
            if (codePre) {
                const blob = new Blob([codePre.textContent], { type: 'text/xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);
            }
        });
    }

    loadSourceViewerFile('patients.xml');
}

function loadSourceViewerFile(fileName) {
    const filenameLabel = document.getElementById('source-filename-label');
    const codePre = document.getElementById('source-code-pre');
    if (!codePre) return;

    if (filenameLabel) filenameLabel.textContent = fileName;

    let sourceText = '';
    if (fileName === 'patients.xml') {
        sourceText = AppState.xmlString;
    } else if (fileName === 'patients.xsd') {
        sourceText = AppState.xsdString;
    } else if (fileName === 'patients.xsl') {
        sourceText = AppState.xslString;
    }

    codePre.textContent = formatXmlString(sourceText);
}

// =============================================================================
// 13. Modal & Toast Utilities
// =============================================================================
function viewPatientDetailModal(patientId) {
    const patient = AppState.patients.find(p => p.id === patientId);
    if (!patient) return;

    const modal = document.getElementById('patient-modal-backdrop');
    const title = document.getElementById('modal-patient-name');
    const body = document.getElementById('modal-patient-body');
    const reportBtn = document.getElementById('modal-open-report-btn');

    if (title) title.innerHTML = `${escapeHtml(patient.name)} <span class="patient-id-badge" style="font-size:0.85rem; margin-left:6px;">${escapeHtml(patient.id)}</span>`;

    if (body) {
        // Serialize patient node
        let patientXmlSnippet = '';
        if (AppState.xmlDoc) {
            const nodes = AppState.xmlDoc.getElementsByTagName('patient');
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].getAttribute('id') === patient.id) {
                    const serializer = new XMLSerializer();
                    patientXmlSnippet = serializer.serializeToString(nodes[i]);
                    break;
                }
            }
        }

        body.innerHTML = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
                <div style="background:#f8fafc; padding:0.9rem; border-radius:8px; border:1px solid #e2e8f0;">
                    <div style="color:#64748b; font-size:0.8rem; text-transform:uppercase;">Demographics</div>
                    <div style="font-weight:600; font-size:1rem; margin-top:2px;">${patient.age} yrs &bull; ${escapeHtml(patient.gender)}</div>
                    <div style="margin-top:4px;">Blood Phenotype: <span class="blood-badge">${escapeHtml(patient.bloodGroup)}</span></div>
                </div>
                <div style="background:#f8fafc; padding:0.9rem; border-radius:8px; border:1px solid #e2e8f0;">
                    <div style="color:#64748b; font-size:0.8rem; text-transform:uppercase;">Clinical Department</div>
                    <div style="font-weight:600; font-size:1rem; color:#0284c7; margin-top:2px;">${escapeHtml(patient.department)}</div>
                    <div style="margin-top:4px; font-size:0.85rem;">Dr. ${escapeHtml(patient.doctor)}</div>
                </div>
            </div>

            <div style="margin-bottom:1.25rem; background:#f0fdfa; border-left:3px solid #0d9488; padding:0.85rem; border-radius:0 8px 8px 0;">
                <strong style="color:#0f766e; font-size:0.85rem; text-transform:uppercase;">Primary Diagnosis:</strong>
                <p style="margin-top:2px; font-size:0.92rem; color:#134e4a;">${escapeHtml(patient.diagnosis)}</p>
            </div>

            <h4 style="font-size:0.9rem; text-transform:uppercase; color:#0369a1; margin-bottom:0.6rem;">Diagnostic Tests Recorded (${patient.medicalTests.length})</h4>
            <table class="report-table" style="font-size:0.85rem; margin-bottom:1.25rem;">
                <thead>
                    <tr><th>Test Name</th><th>Reading / Result</th><th>Status</th></tr>
                </thead>
                <tbody>
                    ${patient.medicalTests.map(t => `
                        <tr>
                            <td><strong>${escapeHtml(t.name)}</strong></td>
                            <td>${escapeHtml(t.result)}</td>
                            <td><span class="status-badge ${t.status==='Normal'?'status-normal':'status-high'}">${escapeHtml(t.status)}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <h4 style="font-size:0.9rem; text-transform:uppercase; color:#64748b; margin-bottom:0.4rem;">XML DOM Subtree Representation</h4>
            <pre style="background:#0f172a; color:#f8fafc; padding:0.75rem; border-radius:6px; font-size:0.78rem; overflow:auto; max-height:160px; font-family:monospace;">${escapeHtml(formatXmlString(patientXmlSnippet))}</pre>
        `;
    }

    if (reportBtn) {
        reportBtn.onclick = () => {
            closePatientModal();
            openMedicalReport(patient.id);
        };
    }

    if (modal) modal.classList.add('active');
}

function closePatientModal() {
    const modal = document.getElementById('patient-modal-backdrop');
    if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `
        <span style="font-weight:bold; font-size:1.1rem;">${icon}</span>
        <span style="flex:1;">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatXmlString(xml) {
    if (!xml) return '';
    let formatted = '';
    let pad = 0;
    const lines = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3').split('\r\n');
    
    lines.forEach(line => {
        let indent = 0;
        if (line.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (line.match(/^<\/\w/)) {
            if (pad !== 0) pad -= 1;
        } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        const padding = '  '.repeat(pad);
        formatted += padding + line + '\n';
        pad += indent;
    });

    return formatted.trim();
}

function getFallbackXmlString() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<hospital xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="patients.xsd">
    <patient id="P001">
        <name>Arun Kumar</name>
        <age>35</age>
        <gender>Male</gender>
        <bloodGroup>O+</bloodGroup>
        <doctor>Dr. Rajesh Varma</doctor>
        <department>Cardiology</department>
        <diagnosis>Stage 1 Essential Hypertension and Dyslipidemia</diagnosis>
        <medicalTests>
            <test name="Blood Pressure"><result>142/92 mmHg</result><status>High</status></test>
            <test name="Serum Total Cholesterol"><result>238 mg/dL</result><status>High</status></test>
            <test name="Resting 12-Lead ECG"><result>Normal sinus rhythm, HR 76 bpm</result><status>Normal</status></test>
        </medicalTests>
    </patient>
    <patient id="P002">
        <name>Priya Sharma</name>
        <age>28</age>
        <gender>Female</gender>
        <bloodGroup>B+</bloodGroup>
        <doctor>Dr. Ananya Iyer</doctor>
        <department>Dermatology</department>
        <diagnosis>Moderate Atopic Dermatitis with Secondary Lichenification</diagnosis>
        <medicalTests>
            <test name="Total Serum IgE"><result>385 IU/mL</result><status>High</status></test>
            <test name="Absolute Eosinophil Count"><result>520 cells/mcL</result><status>High</status></test>
            <test name="Skin Prick Allergy Panel"><result>Sensitization to Dermatophagoides pteronyssinus</result><status>High</status></test>
        </medicalTests>
    </patient>
    <patient id="P003">
        <name>Mohammed Farooq</name>
        <age>52</age>
        <gender>Male</gender>
        <bloodGroup>A+</bloodGroup>
        <doctor>Dr. Vikram Sengupta</doctor>
        <department>Neurology</department>
        <diagnosis>Chronic Migraine with Visual Aura and Cervical Radiculopathy</diagnosis>
        <medicalTests>
            <test name="Brain MRI with Contrast"><result>No acute ischemic stroke or intracranial lesion</result><status>Normal</status></test>
            <test name="Cervical Spine MRI"><result>C5-C6 disc osteophyte complex</result><status>High</status></test>
            <test name="Serum 25-OH Vitamin D"><result>16.4 ng/mL</result><status>Low</status></test>
        </medicalTests>
    </patient>
    <patient id="P004">
        <name>Sneha Patel</name>
        <age>44</age>
        <gender>Female</gender>
        <bloodGroup>AB-</bloodGroup>
        <doctor>Dr. Sunita Mehra</doctor>
        <department>Orthopedics</department>
        <diagnosis>Bilateral Knee Primary Osteoarthritis (Grade II)</diagnosis>
        <medicalTests>
            <test name="Bilateral Knee X-Ray"><result>Medial compartment joint space narrowing</result><status>High</status></test>
            <test name="ESR"><result>26 mm/hr</result><status>High</status></test>
            <test name="Serum Uric Acid"><result>5.2 mg/dL</result><status>Normal</status></test>
        </medicalTests>
    </patient>
    <patient id="P005">
        <name>David Wilson</name>
        <age>61</age>
        <gender>Male</gender>
        <bloodGroup>O-</bloodGroup>
        <doctor>Dr. Rajesh Varma</doctor>
        <department>Cardiology</department>
        <diagnosis>Coronary Artery Disease Status Post Drug-Eluting Stent</diagnosis>
        <medicalTests>
            <test name="Cardiac Troponin I"><result>0.015 ng/mL</result><status>Normal</status></test>
            <test name="2D Echocardiogram"><result>LVEF 52%</result><status>Normal</status></test>
            <test name="Fasting Plasma Glucose"><result>154 mg/dL</result><status>High</status></test>
        </medicalTests>
    </patient>
    <patient id="P006">
        <name>Ananya Deshmukh</name>
        <age>8</age>
        <gender>Female</gender>
        <bloodGroup>A-</bloodGroup>
        <doctor>Dr. Meenakshi Sundaram</doctor>
        <department>Pediatrics</department>
        <diagnosis>Acute Bronchial Asthma Flare Triggered by Viral URTI</diagnosis>
        <medicalTests>
            <test name="Peak Expiratory Flow Rate"><result>165 L/min (64% predicted)</result><status>Low</status></test>
            <test name="Pulse Oximetry"><result>94 %</result><status>Low</status></test>
            <test name="Chest X-Ray"><result>Bilateral pulmonary hyperinflation</result><status>Normal</status></test>
        </medicalTests>
    </patient>
    <patient id="P007">
        <name>Ramesh Chandra</name>
        <age>67</age>
        <gender>Male</gender>
        <bloodGroup>B-</bloodGroup>
        <doctor>Dr. Harish Nambiar</doctor>
        <department>Ophthalmology</department>
        <diagnosis>Senile Nuclear Sclerotic Cataract (OD) and Primary Open-Angle Glaucoma</diagnosis>
        <medicalTests>
            <test name="Tonometry"><result>Right: 24 mmHg, Left: 18 mmHg</result><status>High</status></test>
            <test name="Visual Acuity"><result>OD: 6/24, OS: 6/9</result><status>Low</status></test>
            <test name="OCT RNFL"><result>Inferior neuroretinal rim thinning</result><status>High</status></test>
        </medicalTests>
    </patient>
    <patient id="P008">
        <name>Kavita Nair</name>
        <age>39</age>
        <gender>Female</gender>
        <bloodGroup>O+</bloodGroup>
        <doctor>Dr. Sanjeev Kapoor</doctor>
        <department>ENT</department>
        <diagnosis>Chronic Suppurative Otitis Media and Left Septal Deviation</diagnosis>
        <medicalTests>
            <test name="Pure Tone Audiometry"><result>Moderate conductive hearing loss (35 dB)</result><status>High</status></test>
            <test name="Ear Culture"><result>Pseudomonas aeruginosa</result><status>High</status></test>
            <test name="CT Temporal Bone"><result>Soft tissue density in middle ear cavity</result><status>Normal</status></test>
        </medicalTests>
    </patient>
    <patient id="P009">
        <name>Vikram Malhotra</name>
        <age>49</age>
        <gender>Male</gender>
        <bloodGroup>AB+</bloodGroup>
        <doctor>Dr. Shalini Reddy</doctor>
        <department>General Medicine</department>
        <diagnosis>Type 2 Diabetes Mellitus with Peripheral Neuropathy</diagnosis>
        <medicalTests>
            <test name="Fasting Blood Sugar"><result>172 mg/dL</result><status>High</status></test>
            <test name="Post-Prandial Blood Sugar"><result>258 mg/dL</result><status>High</status></test>
            <test name="Serum Creatinine"><result>1.05 mg/dL</result><status>Normal</status></test>
        </medicalTests>
    </patient>
    <patient id="P010">
        <name>Ritu Singhania</name>
        <age>31</age>
        <gender>Female</gender>
        <bloodGroup>B+</bloodGroup>
        <doctor>Dr. Vikram Sengupta</doctor>
        <department>Neurology</department>
        <diagnosis>Right Posterior Canal Benign Paroxysmal Positional Vertigo</diagnosis>
        <medicalTests>
            <test name="Dix-Hallpike Maneuver"><result>Upbeat torsional nystagmus provoked</result><status>High</status></test>
            <test name="Video Head Impulse Test"><result>Normal vestibulo-ocular reflex</result><status>Normal</status></test>
            <test name="Electrolyte Panel"><result>Na: 139, K: 4.1</result><status>Normal</status></test>
        </medicalTests>
    </patient>
</hospital>`;
}

function getFallbackXsdString() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified">
    <xs:element name="hospital">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="patient" type="PatientType" minOccurs="1" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
        <xs:unique name="UniquePatientId">
            <xs:selector xpath="patient"/>
            <xs:field xpath="@id"/>
        </xs:unique>
    </xs:element>
    <xs:complexType name="PatientType">
        <xs:sequence>
            <xs:element name="name" type="xs:string"/>
            <xs:element name="age" type="xs:integer"/>
            <xs:element name="gender" type="xs:string"/>
            <xs:element name="bloodGroup" type="xs:string"/>
            <xs:element name="doctor" type="xs:string"/>
            <xs:element name="department" type="xs:string"/>
            <xs:element name="diagnosis" type="xs:string"/>
            <xs:element name="medicalTests">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="test" maxOccurs="unbounded">
                            <xs:complexType>
                                <xs:sequence>
                                    <xs:element name="result" type="xs:string"/>
                                    <xs:element name="status" type="xs:string"/>
                                </xs:sequence>
                                <xs:attribute name="name" type="xs:string" use="required"/>
                            </xs:complexType>
                        </xs:element>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:sequence>
        <xs:attribute name="id" type="xs:string" use="required"/>
    </xs:complexType>
</xs:schema>`;
}

function getFallbackXslString() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html>
        <head>
            <title>Hospital Medical Report</title>
            <style>body { font-family: sans-serif; padding: 20px; }</style>
        </head>
        <body>
            <h2>AURA METROPOLITAN HOSPITAL - XSLT REPORT</h2>
            <xsl:for-each select="hospital/patient">
                <div style="border:1px solid #ccc; padding:15px; margin-bottom:15px; border-radius:8px;">
                    <h3><xsl:value-of select="name"/> (<xsl:value-of select="@id"/>)</h3>
                    <p>Age: <xsl:value-of select="age"/> | Gender: <xsl:value-of select="gender"/> | Blood: <xsl:value-of select="bloodGroup"/></p>
                    <p>Doctor: <xsl:value-of select="doctor"/> | Department: <xsl:value-of select="department"/></p>
                    <p>Diagnosis: <xsl:value-of select="diagnosis"/></p>
                </div>
            </xsl:for-each>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>`;
}
