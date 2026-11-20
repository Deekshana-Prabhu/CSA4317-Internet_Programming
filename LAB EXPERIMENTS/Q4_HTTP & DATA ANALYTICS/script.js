// script.js - Navigation, Interactions, Copy Buttons & Dynamic OLAP Calculations

document.addEventListener("DOMContentLoaded", function () {
  initSidebarNavigation();
  initCopyButtons();
  renderRollUpAnalysis();
  initDiceAnalysis();
});

/* ==========================================================================
   1. SIDEBAR NAVIGATION & SCROLLSPY
   ========================================================================== */
function initSidebarNavigation() {
  const navLinks = document.querySelectorAll(".sidebar .nav-link");
  const sections = document.querySelectorAll("section[id]");
  const mobileToggle = document.getElementById("mobileToggle");
  const sidebar = document.getElementById("sidebar");

  // Mobile menu toggle
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
  }

  // Smooth scroll & close mobile sidebar
  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
      }
    });
  });

  // Scrollspy to highlight active link
  window.addEventListener("scroll", function () {
    let current = "";
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   2. HTTP CODE COPY BUTTONS
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll(".copy-btn");

  copyButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        const textToCopy = targetEl.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = this.innerText;
          this.innerText = "Copied!";
          this.style.background = "#10b981";

          setTimeout(() => {
            this.innerText = originalText;
            this.style.background = "";
          }, 2000);
        }).catch(err => {
          console.error("Clipboard copy failed: ", err);
        });
      }
    });
  });
}

/* ==========================================================================
   3. OLAP ROLL-UP: REGIONAL SALES AGGREGATION
   ========================================================================== */
function renderRollUpAnalysis() {
  if (typeof salesData === "undefined" || !salesData.length) {
    console.error("salesData not loaded");
    return;
  }

  const regions = ["North", "South", "East", "West"];
  const regionTotals = {
    North: { revenue: 0, units: 0, orders: 0 },
    South: { revenue: 0, units: 0, orders: 0 },
    East: { revenue: 0, units: 0, orders: 0 },
    West: { revenue: 0, units: 0, orders: 0 }
  };

  let grandTotal = 0;
  let totalUnits = 0;

  // Aggregate by region
  salesData.forEach(row => {
    if (regionTotals[row.region]) {
      regionTotals[row.region].revenue += row.totalRevenue;
      regionTotals[row.region].units += row.quantity;
      regionTotals[row.region].orders += 1;
      grandTotal += row.totalRevenue;
      totalUnits += row.quantity;
    }
  });

  // Display Grand Total Metric
  const grandTotalEl = document.getElementById("rollupGrandTotal");
  if (grandTotalEl) grandTotalEl.innerText = `$${grandTotal.toLocaleString()}`;

  const totalUnitsEl = document.getElementById("rollupTotalUnits");
  if (totalUnitsEl) totalUnitsEl.innerText = `${totalUnits.toLocaleString()} units`;

  // Determine Max Revenue for Bar Scaling
  const maxRevenue = Math.max(...regions.map(r => regionTotals[r].revenue));

  // Render Regional Bar Chart
  const chartContainer = document.getElementById("rollupBarChart");
  if (chartContainer) {
    chartContainer.innerHTML = regions.map(r => {
      const data = regionTotals[r];
      const percentWidth = Math.round((data.revenue / maxRevenue) * 100);
      return `
        <div class="bar-row">
          <div class="bar-label">${r}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${percentWidth}%;"></div>
          </div>
          <div class="bar-value">$${data.revenue.toLocaleString()}</div>
        </div>
      `;
    }).join("");
  }

  // Render Roll-Up Table
  const tableBody = document.getElementById("rollupTableBody");
  if (tableBody) {
    tableBody.innerHTML = regions.map(r => {
      const data = regionTotals[r];
      const contribution = ((data.revenue / grandTotal) * 100).toFixed(1);
      return `
        <tr>
          <td><strong>${r} Region</strong></td>
          <td>${data.orders}</td>
          <td>${data.units}</td>
          <td><strong>$${data.revenue.toLocaleString()}</strong></td>
          <td>${contribution}%</td>
        </tr>
      `;
    }).join("");
  }
}

/* ==========================================================================
   4. OLAP DICE: AGE GROUP & PRODUCT CATEGORY FILTERING
   ========================================================================== */
function initDiceAnalysis() {
  const ageFilter = document.getElementById("diceAgeFilter");
  const catFilter = document.getElementById("diceCategoryFilter");

  if (!ageFilter || !catFilter) return;

  function updateDiceView() {
    const selectedAge = ageFilter.value;
    const selectedCat = catFilter.value;

    // Filter sales dataset dynamically
    const filtered = salesData.filter(row => {
      const matchAge = selectedAge === "ALL" || row.ageGroup === selectedAge;
      const matchCat = selectedCat === "ALL" || row.category === selectedCat;
      return matchAge && matchCat;
    });

    let dicedRevenue = 0;
    let dicedUnits = 0;

    filtered.forEach(item => {
      dicedRevenue += item.totalRevenue;
      dicedUnits += item.quantity;
    });

    // Update Result Counters
    const resultCountEl = document.getElementById("diceResultCount");
    const resultRevEl = document.getElementById("diceResultRevenue");
    if (resultCountEl) resultCountEl.innerText = `${filtered.length} Orders (${dicedUnits} Units)`;
    if (resultRevEl) resultRevEl.innerText = `Total: $${dicedRevenue.toLocaleString()}`;

    // Render Filtered Table
    const tableBody = document.getElementById("diceTableBody");
    if (tableBody) {
      if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:20px;">No transactions match the selected Dice filters.</td></tr>`;
      } else {
        tableBody.innerHTML = filtered.map(row => `
          <tr>
            <td>#${row.salesId}</td>
            <td>${row.productName}</td>
            <td><span class="badge-fk">${row.category}</span></td>
            <td>${row.customerName}</td>
            <td><strong>${row.ageGroup}</strong> (${row.age}y)</td>
            <td>${row.region}</td>
            <td><strong>$${row.totalRevenue.toLocaleString()}</strong></td>
          </tr>
        `).join("");
      }
    }
  }

  ageFilter.addEventListener("change", updateDiceView);
  catFilter.addEventListener("change", updateDiceView);

  // Initial calculation
  updateDiceView();
}
