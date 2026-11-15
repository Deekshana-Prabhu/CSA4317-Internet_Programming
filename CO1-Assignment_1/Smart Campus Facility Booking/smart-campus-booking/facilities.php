<?php
/**
 * Smart Campus Facility Booking System
 * Page: facilities.php
 * Demonstrates: Section 2.C Explore Facilities, Search & Filtering, 12 Facility Cards, Modals
 */

require_once __DIR__ . '/config/database.php';

$pageTitle = 'Explore Facilities - Smart Campus';
$activePage = 'facilities';

// Retrieve filter query parameters if any
$categoryParam = $_GET['category'] ?? 'All';
$statusParam = $_GET['status'] ?? 'All';
$searchParam = $_GET['search'] ?? '';

// Fetch all facilities matching criteria
$facilities = getAllFacilities($categoryParam, $statusParam, $searchParam);

include __DIR__ . '/includes/header.php';
?>

<!-- Page Header Section -->
<div class="section-header">
  <div class="section-title-wrap">
    <h2>Explore Campus Facilities</h2>
    <p>Discover and reserve premier university auditoriums, smart computer labs, and conference suites</p>
  </div>
  <div>
    <a href="booking.php" class="btn-quick-book">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span>Reserve a Room</span>
    </a>
  </div>
</div>

<!-- =========================================================================
     Interactive Filters & Search Bar (Section 5 JS Functionality)
     ========================================================================= -->
<div class="filters-bar">
  <!-- Search Input -->
  <div class="search-box" style="width: 280px; box-shadow: none;">
    <span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </span>
    <input type="text" id="facilitySearchInput" value="<?= htmlspecialchars($searchParam) ?>" placeholder="Search by name, block, gear...">
  </div>

  <!-- Category Filter -->
  <div class="filter-group">
    <span class="filter-label">Space Type:</span>
    <select id="facilityCategoryFilter" class="filter-select">
      <option value="All" <?= ($categoryParam === 'All') ? 'selected' : '' ?>>All Spaces (12)</option>
      <option value="Auditorium & Hall" <?= ($categoryParam === 'Auditorium & Hall') ? 'selected' : '' ?>>Auditoriums & Halls</option>
      <option value="Laboratory" <?= ($categoryParam === 'Laboratory') ? 'selected' : '' ?>>Computer & Research Labs</option>
      <option value="Conference Room" <?= ($categoryParam === 'Conference Room') ? 'selected' : '' ?>>Conference & Meeting</option>
      <option value="Innovation Space" <?= ($categoryParam === 'Innovation Space') ? 'selected' : '' ?>>Innovation & Robotics</option>
      <option value="Digital Learning" <?= ($categoryParam === 'Digital Learning') ? 'selected' : '' ?>>Digital Classrooms</option>
    </select>
  </div>

  <!-- Status Filter -->
  <div class="filter-group">
    <span class="filter-label">Status:</span>
    <select id="facilityStatusFilter" class="filter-select">
      <option value="All" <?= ($statusParam === 'All') ? 'selected' : '' ?>>All Statuses</option>
      <option value="Available" <?= ($statusParam === 'Available') ? 'selected' : '' ?>>Available (8)</option>
      <option value="Booked" <?= ($statusParam === 'Booked') ? 'selected' : '' ?>>Currently Booked (4)</option>
      <option value="Under Maintenance" <?= ($statusParam === 'Under Maintenance') ? 'selected' : '' ?>>Under Maintenance</option>
    </select>
  </div>

  <!-- Capacity Filter -->
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

  <!-- Quick Category Pills -->
  <div class="filter-pills">
    <button type="button" class="filter-pill <?= ($categoryParam === 'All') ? 'active' : '' ?>" data-category="All">All</button>
    <button type="button" class="filter-pill <?= ($categoryParam === 'Auditorium & Hall') ? 'active' : '' ?>" data-category="Auditorium & Hall">Auditoriums</button>
    <button type="button" class="filter-pill <?= ($categoryParam === 'Laboratory') ? 'active' : '' ?>" data-category="Laboratory">Labs</button>
    <button type="button" class="filter-pill <?= ($categoryParam === 'Conference Room') ? 'active' : '' ?>" data-category="Conference Room">Conference</button>
    <button type="button" class="filter-pill <?= ($categoryParam === 'Innovation Space') ? 'active' : '' ?>" data-category="Innovation Space">Innovation</button>
  </div>
</div>

<!-- =========================================================================
     Facilities Grid - 12 Campus Facilities Cards
     ========================================================================= -->
<div class="facilities-grid" id="facilitiesGrid">
  <?php foreach ($facilities as $fac): ?>
    <article class="facility-card facility-card-item"
             data-id="<?= (int)$fac['facility_id'] ?>"
             data-name="<?= htmlspecialchars($fac['facility_name']) ?>"
             data-building="<?= htmlspecialchars($fac['building']) ?>"
             data-category="<?= htmlspecialchars($fac['category']) ?>"
             data-status="<?= htmlspecialchars($fac['availability_status']) ?>"
             data-capacity="<?= (int)$fac['capacity'] ?>"
             data-equipment="<?= htmlspecialchars($fac['equipment']) ?>">
      
      <!-- Facility Image & Status Badges -->
      <div class="facility-card-image-wrap">
        <img src="<?= htmlspecialchars($fac['image_url']) ?>" onerror="this.onerror=null; this.src='images/facility-<?= (int)$fac['facility_id'] ?>.svg';" alt="<?= htmlspecialchars($fac['facility_name']) ?>" class="facility-card-img" loading="lazy">

        <!-- Status Indicator: Available, Booked, Under Maintenance -->
        <span class="facility-status-badge status-<?= str_replace(' ', '-', $fac['availability_status']) ?>">
          <span class="status-dot"></span>
          <?= htmlspecialchars($fac['availability_status']) ?>
        </span>

        <!-- Seating Capacity Badge -->
        <div class="facility-capacity-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span><?= (int)$fac['capacity'] ?> Seats</span>
        </div>
      </div>

      <!-- Facility Details Body -->
      <div class="facility-card-body">
        <div class="facility-location-tag">
          📍 <?= htmlspecialchars($fac['location']) ?>
        </div>

        <h3 class="facility-title"><?= htmlspecialchars($fac['facility_name']) ?></h3>
        
        <p class="facility-desc"><?= htmlspecialchars($fac['description']) ?></p>

        <!-- Equipment Chips -->
        <div class="facility-equipment-wrap">
          <div class="equipment-label">Available Equipment:</div>
          <div class="equipment-chips">
            <?php 
              $equipList = explode(',', $fac['equipment']);
              foreach (array_slice($equipList, 0, 4) as $item):
            ?>
              <span class="equip-chip"><?= htmlspecialchars(trim($item)) ?></span>
            <?php endforeach; ?>
            <?php if (count($equipList) > 4): ?>
              <span class="equip-chip" style="background: #e0f2fe; color: #0284c7; border-color: #bae6fd;">
                +<?= count($equipList) - 4 ?> more
              </span>
            <?php endif; ?>
          </div>
        </div>

        <!-- Operating Hours Note -->
        <div style="font-size: 0.76rem; color: #64748b; margin-bottom: 14px; display: flex; align-items: center; gap: 6px;">
          <span>🕒</span>
          <span>Operating: <?= htmlspecialchars($fac['operating_hours'] ?? '08:00 AM - 08:00 PM') ?></span>
        </div>

        <!-- Action Buttons: View Details & Book Now -->
        <div class="facility-card-footer">
          <button type="button" 
                  class="btn-card-details" 
                  data-action="view-facility-modal"
                  data-id="<?= (int)$fac['facility_id'] ?>"
                  data-name="<?= htmlspecialchars($fac['facility_name']) ?>"
                  data-location="<?= htmlspecialchars($fac['location']) ?>"
                  data-capacity="<?= (int)$fac['capacity'] ?>"
                  data-equipment="<?= htmlspecialchars($fac['equipment']) ?>"
                  data-desc="<?= htmlspecialchars($fac['description']) ?>"
                  data-hours="<?= htmlspecialchars($fac['operating_hours']) ?>"
                  data-rules="<?= htmlspecialchars($fac['booking_rules'] ?? '') ?>"
                  data-image="<?= htmlspecialchars($fac['image_url']) ?>"
                  data-status="<?= htmlspecialchars($fac['availability_status']) ?>">
            View Details
          </button>

          <?php if ($fac['availability_status'] === 'Under Maintenance'): ?>
            <button class="btn-card-book disabled">Unavailable</button>
          <?php else: ?>
            <a href="booking.php?facility_id=<?= (int)$fac['facility_id'] ?>" class="btn-card-book">
              Book Now
            </a>
          <?php endif; ?>
        </div>
      </div>
    </article>
  <?php endforeach; ?>
</div>

<!-- Empty Search Result Notice -->
<div id="noFacilitiesNotice" style="display: none; text-align: center; padding: 60px 20px; background: #fff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0;">
  <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
  <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">No Facilities Found</h3>
  <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 20px;">Try adjusting your keyword query, category filter, or capacity selection.</p>
  <button type="button" class="btn-reset" onclick="document.getElementById('facilitySearchInput').value=''; document.getElementById('facilityCategoryFilter').value='All'; document.getElementById('facilityStatusFilter').value='All'; document.getElementById('facilityCapacityFilter').value='All'; document.getElementById('facilitySearchInput').dispatchEvent(new Event('input'));">
    Reset All Filters
  </button>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
