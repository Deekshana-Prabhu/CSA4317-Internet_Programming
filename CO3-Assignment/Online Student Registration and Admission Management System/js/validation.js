/**
 * Apex Institute of Technology - Student Admission Portal
 * Form Validation and UI Interactions (js/validation.js)
 */

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Sidebar Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.querySelector(".sidebar");

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });

    // Close sidebar on clicking outside on mobile
    document.addEventListener("click", function (e) {
      if (
        window.innerWidth <= 992 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  // Registration Form Validation Setup
  const registrationForm = document.getElementById("studentRegistrationForm");
  if (registrationForm) {
    initRegistrationValidation(registrationForm);
  }

  // Live Search & Department Filter on Student Details Page
  initStudentSearchAndFilter();
});

/**
 * Initializes validation on the Student Registration Form
 */
function initRegistrationValidation(form) {
  const fields = {
    studentName: {
      elem: document.getElementById("studentName"),
      errorElem: document.getElementById("studentNameError"),
      validate: (val) => {
        if (!val.trim()) return "Student name is required.";
        if (val.trim().length < 3) return "Name must be at least 3 characters long.";
        if (!/^[a-zA-Z\s.]+$/.test(val.trim())) return "Name can only contain alphabets and spaces.";
        return "";
      },
    },
    registerNumber: {
      elem: document.getElementById("registerNumber"),
      errorElem: document.getElementById("registerNumberError"),
      validate: (val) => {
        if (!val.trim()) return "Register number is required.";
        if (val.trim().length < 4) return "Register number must be at least 4 characters.";
        if (!/^[a-zA-Z0-9_-]+$/.test(val.trim())) return "Only letters, numbers, hyphens allowed.";
        return "";
      },
    },
    email: {
      elem: document.getElementById("email"),
      errorElem: document.getElementById("emailError"),
      validate: (val) => {
        if (!val.trim()) return "Email address is required.";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(val.trim())) return "Please enter a valid email address (e.g. name@example.com).";
        return "";
      },
    },
    mobile: {
      elem: document.getElementById("mobile"),
      errorElem: document.getElementById("mobileError"),
      validate: (val) => {
        if (!val.trim()) return "Mobile number is required.";
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(val.trim())) return "Enter a valid 10-digit Indian mobile number starting with 6-9.";
        return "";
      },
    },
    dob: {
      elem: document.getElementById("dob"),
      errorElem: document.getElementById("dobError"),
      validate: (val) => {
        if (!val) return "Date of birth is required.";
        const birthDate = new Date(val);
        const today = new Date();
        if (birthDate >= today) return "Date of birth cannot be in the future.";
        
        // Age check: must be at least 15 years old for college admission
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 15) return "Candidate must be at least 15 years old to register.";
        if (age > 40) return "Candidate age exceeds standard undergraduate admission limit.";
        return "";
      },
    },
    address: {
      elem: document.getElementById("address"),
      errorElem: document.getElementById("addressError"),
      validate: (val) => {
        if (!val.trim()) return "Residential address is required.";
        if (val.trim().length < 10) return "Please provide a complete address (min 10 characters).";
        return "";
      },
    },
    state: {
      elem: document.getElementById("state"),
      errorElem: document.getElementById("stateError"),
      validate: (val) => {
        if (!val || val === "") return "Please select a state.";
        return "";
      },
    },
    department: {
      elem: document.getElementById("department"),
      errorElem: document.getElementById("departmentError"),
      validate: (val) => {
        if (!val || val === "") return "Please select an admission department.";
        return "";
      },
    },
    preferredDepartment: {
      elem: document.getElementById("preferredDepartment"),
      errorElem: document.getElementById("preferredDepartmentError"),
      validate: (val) => {
        if (!val || val === "") return "Please select a preferred alternative department.";
        return "";
      },
    },
    marks10: {
      elem: document.getElementById("marks10"),
      errorElem: document.getElementById("marks10Error"),
      validate: (val) => {
        if (val === "" || val === null) return "Class 10 marks are required.";
        const num = parseFloat(val);
        if (isNaN(num)) return "Marks must be a numeric value.";
        if (num < 0 || num > 100) return "Marks must be between 0 and 100.";
        return "";
      },
    },
    marks12: {
      elem: document.getElementById("marks12"),
      errorElem: document.getElementById("marks12Error"),
      validate: (val) => {
        if (val === "" || val === null) return "Class 12 marks are required.";
        const num = parseFloat(val);
        if (isNaN(num)) return "Marks must be a numeric value.";
        if (num < 0 || num > 100) return "Marks must be between 0 and 100.";
        return "";
      },
    },
  };

  // Attach live blur and input events for real-time visual feedback
  Object.keys(fields).forEach((key) => {
    const item = fields[key];
    if (item.elem) {
      item.elem.addEventListener("blur", function () {
        validateField(item);
      });
      item.elem.addEventListener("input", function () {
        if (item.elem.classList.contains("is-invalid")) {
          validateField(item);
        }
      });
    }
  });

  // Radio button gender selection styling
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  genderRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".radio-label").forEach((lbl) => lbl.classList.remove("selected"));
      if (this.checked) {
        this.closest(".radio-label").classList.add("selected");
        const genderError = document.getElementById("genderError");
        if (genderError) {
          genderError.textContent = "";
          genderError.classList.remove("show");
        }
      }
    });
  });

  // Validate single field helper
  function validateField(item) {
    if (!item.elem) return true;
    const errorMsg = item.validate(item.elem.value);
    if (errorMsg) {
      item.elem.classList.add("is-invalid");
      item.elem.classList.remove("is-valid");
      if (item.errorElem) {
        item.errorElem.textContent = errorMsg;
        item.errorElem.classList.add("show");
      }
      return false;
    } else {
      item.elem.classList.remove("is-invalid");
      item.elem.classList.add("is-valid");
      if (item.errorElem) {
        item.errorElem.textContent = "";
        item.errorElem.classList.remove("show");
      }
      return true;
    }
  }

  // Handle Form Submission
  form.addEventListener("submit", function (e) {
    let isValid = true;
    let firstInvalidElem = null;

    // Validate all standard input fields
    Object.keys(fields).forEach((key) => {
      const item = fields[key];
      const valid = validateField(item);
      if (!valid) {
        isValid = false;
        if (!firstInvalidElem && item.elem) {
          firstInvalidElem = item.elem;
        }
      }
    });

    // Validate Gender radio
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    const genderError = document.getElementById("genderError");
    if (!genderSelected) {
      isValid = false;
      if (genderError) {
        genderError.textContent = "Please select candidate's gender.";
        genderError.classList.add("show");
      }
      if (!firstInvalidElem) {
        firstInvalidElem = document.querySelector('input[name="gender"]');
      }
    } else {
      if (genderError) {
        genderError.textContent = "";
        genderError.classList.remove("show");
      }
    }

    if (!isValid) {
      e.preventDefault();
      if (firstInvalidElem) {
        firstInvalidElem.focus();
        firstInvalidElem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  // Handle Form Reset
  form.addEventListener("reset", function () {
    setTimeout(() => {
      Object.keys(fields).forEach((key) => {
        const item = fields[key];
        if (item.elem) {
          item.elem.classList.remove("is-invalid", "is-valid");
        }
        if (item.errorElem) {
          item.errorElem.textContent = "";
          item.errorElem.classList.remove("show");
        }
      });
      document.querySelectorAll(".radio-label").forEach((lbl) => lbl.classList.remove("selected"));
      const genderError = document.getElementById("genderError");
      if (genderError) {
        genderError.textContent = "";
        genderError.classList.remove("show");
      }
    }, 10);
  });
}

/**
 * Initializes Real-time Client-Side Search and Department Filtering
 * for the Student Details Page
 */
function initStudentSearchAndFilter() {
  const searchInput = document.getElementById("studentSearchInput");
  const deptFilter = document.getElementById("departmentFilter");
  const table = document.getElementById("studentsTable");

  if (!table) return;

  function filterTable() {
    const query = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const selectedDept = (deptFilter ? deptFilter.value : "").trim();
    const rows = table.querySelectorAll("tbody tr.student-row");
    let visibleCount = 0;

    rows.forEach((row) => {
      const regNo = (row.getAttribute("data-regno") || "").toLowerCase();
      const name = (row.getAttribute("data-name") || "").toLowerCase();
      const dept = row.getAttribute("data-dept") || "";

      const matchesSearch = !query || regNo.includes(query) || name.includes(query);
      const matchesDept = !selectedDept || dept === selectedDept;

      if (matchesSearch && matchesDept) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    // Handle empty state row if no records match
    let noMatchRow = document.getElementById("noFilterMatchRow");
    if (visibleCount === 0 && rows.length > 0) {
      if (!noMatchRow) {
        noMatchRow = document.createElement("tr");
        noMatchRow.id = "noFilterMatchRow";
        noMatchRow.innerHTML = `<td colspan="9" style="text-align:center; padding: 32px; color: #64748b;">
          <strong>No matching student records found.</strong> Try adjusting your search query or department filter.
        </td>`;
        table.querySelector("tbody").appendChild(noMatchRow);
      } else {
        noMatchRow.style.display = "";
      }
    } else if (noMatchRow) {
      noMatchRow.style.display = "none";
    }

    const countBadge = document.getElementById("studentCountBadge");
    if (countBadge) {
      countBadge.textContent = visibleCount + (visibleCount === 1 ? " Student" : " Students");
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterTable);
  }
  if (deptFilter) {
    deptFilter.addEventListener("change", filterTable);
  }
}

/**
 * Opens Student Detail Modal with full candidate profile
 */
function openStudentModal(data) {
  const modal = document.getElementById("studentDetailModal");
  if (!modal) return;

  document.getElementById("modalStudentName").textContent = data.name || "N/A";
  document.getElementById("modalRegNo").textContent = data.regNo || "N/A";
  document.getElementById("modalEmail").textContent = data.email || "N/A";
  document.getElementById("modalMobile").textContent = data.mobile || "N/A";
  document.getElementById("modalDob").textContent = data.dob || "N/A";
  document.getElementById("modalGender").textContent = data.gender || "N/A";
  document.getElementById("modalAddress").textContent = data.address || "N/A";
  document.getElementById("modalState").textContent = data.state || "N/A";
  document.getElementById("modalDepartment").textContent = data.department || "N/A";
  document.getElementById("modalPrefDepartment").textContent = data.preferredDepartment || "N/A";
  document.getElementById("modalMarks10").textContent = (data.marks10 !== undefined ? data.marks10 : "N/A") + "%";
  document.getElementById("modalMarks12").textContent = (data.marks12 !== undefined ? data.marks12 : "N/A") + "%";

  modal.classList.add("active");
}

/**
 * Closes the Student Detail Modal
 */
function closeStudentModal() {
  const modal = document.getElementById("studentDetailModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

/**
 * Confirms Student Deletion
 */
function confirmDelete(regNo, studentName) {
  if (confirm(`Are you sure you want to delete the record for ${studentName} (Reg No: ${regNo})?\nThis action cannot be undone.`)) {
    window.location.href = `students?action=delete&regNo=${encodeURIComponent(regNo)}`;
  }
}
