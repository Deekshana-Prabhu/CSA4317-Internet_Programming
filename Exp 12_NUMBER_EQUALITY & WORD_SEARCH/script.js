/**
 * SMART LOGIC – Number & Word Analyzer
 * Vanilla JavaScript Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Array Word Search Data & Initialization
  // =========================================================================
  const WORDS_ARRAY = [
    "Learning",
    "JavaScript",
    "is",
    "fun",
    "and",
    "useful",
    "for",
    "students"
  ];

  const arrayTilesContainer = document.getElementById('array-tiles-container');
  const wordSearchInput = document.getElementById('word-search-input');
  const searchWordBtn = document.getElementById('search-word-btn');
  const resetWordBtn = document.getElementById('reset-word-btn');
  const wordResultContainer = document.getElementById('word-result-container');

  /**
   * Render the array visualizer tiles with zero-based index numbers
   */
  function renderArrayTiles(highlightIndex = -1) {
    if (!arrayTilesContainer) return;
    arrayTilesContainer.innerHTML = '';

    WORDS_ARRAY.forEach((word, index) => {
      const tile = document.createElement('div');
      tile.className = `array-tile ${index === highlightIndex ? 'highlighted' : ''}`;
      tile.setAttribute('data-index', index);
      tile.setAttribute('id', `tile-${index}`);

      tile.innerHTML = `
        <span class="tile-index-pill">Index [${index}]</span>
        <span class="tile-word-text">${escapeHtml(word)}</span>
      `;

      // Allow clicking a tile directly to populate the search field
      tile.addEventListener('click', () => {
        wordSearchInput.value = word;
        performWordSearch();
      });

      arrayTilesContainer.appendChild(tile);
    });
  }

  // Initial render of the array elements
  renderArrayTiles();

  // =========================================================================
  // 2. Number Equality Checker Logic
  // =========================================================================
  const num1Input = document.getElementById('first-number');
  const num2Input = document.getElementById('second-number');
  const compareBtn = document.getElementById('compare-btn');
  const resetNumBtn = document.getElementById('reset-number-btn');
  const numResultContainer = document.getElementById('number-result-container');

  /**
   * Compare two numbers with validation for empty, decimal, and negative values
   */
  function compareNumbers() {
    const rawVal1 = num1Input.value.trim();
    const rawVal2 = num2Input.value.trim();

    // 1. Validation: check for empty input
    if (rawVal1 === '' || rawVal2 === '') {
      showNumberResult('warn', {
        title: 'Input Required',
        message: 'Please enter valid numerical values in both input fields.',
        meta: ['Status: Incomplete', 'Tip: Negative & decimal numbers supported']
      });
      return;
    }

    // 2. Parse numbers
    const num1 = Number(rawVal1);
    const num2 = Number(rawVal2);

    if (isNaN(num1) || isNaN(num2)) {
      showNumberResult('warn', {
        title: 'Invalid Number Format',
        message: 'One or both inputs are not valid numbers. Please enter digits only.',
        meta: ['Validation: NaN detected']
      });
      return;
    }

    // 3. Strict Comparison using ===
    const areEqual = (num1 === num2);

    if (areEqual) {
      showNumberResult('equal', {
        title: 'Both numbers are equal!',
        message: `Value 1 (${num1}) is strictly equal to Value 2 (${num2}).`,
        meta: [
          `Condition: ${num1} === ${num2} → true`,
          `Difference: 0`,
          'Type: Number'
        ]
      });
    } else {
      const diff = Math.abs(num1 - num2);
      // Format difference to avoid crazy floating point display if needed
      const formattedDiff = Number(diff.toFixed(6));
      showNumberResult('diff', {
        title: 'The numbers are not equal!',
        message: `Value 1 (${num1}) does not match Value 2 (${num2}).`,
        meta: [
          `Condition: ${num1} === ${num2} → false`,
          `Difference: ${formattedDiff}`,
          num1 > num2 ? `${num1} > ${num2}` : `${num1} < ${num2}`
        ]
      });
    }
  }

  /**
   * Render dynamic result card for number comparison
   */
  function showNumberResult(type, data) {
    let iconSvg = '';
    let cardClass = '';

    if (type === 'equal') {
      cardClass = 'result-card-equal';
      iconSvg = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else if (type === 'diff') {
      cardClass = 'result-card-diff';
      iconSvg = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      cardClass = 'result-card-warn';
      iconSvg = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;
    }

    const metaPills = data.meta.map(m => `<span class="meta-pill">${escapeHtml(m)}</span>`).join('');

    numResultContainer.innerHTML = `
      <div class="result-card ${cardClass}">
        <div class="result-main-row">
          <div class="result-status-icon">
            ${iconSvg}
          </div>
          <div class="result-text-group">
            <h4 class="result-headline">${escapeHtml(data.title)}</h4>
            <p class="result-subline">${escapeHtml(data.message)}</p>
          </div>
        </div>
        <div class="result-meta-tags">
          ${metaPills}
        </div>
      </div>
    `;
  }

  /**
   * Reset Number Checker form and result box
   */
  function resetNumberChecker() {
    num1Input.value = '';
    num2Input.value = '';
    numResultContainer.innerHTML = `
      <div class="result-placeholder">
        <div class="placeholder-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <p class="placeholder-text">Enter two numbers above and click <strong>Compare Numbers</strong> to analyze equality.</p>
      </div>
    `;
    num1Input.focus();
  }

  // Number comparison events
  compareBtn.addEventListener('click', compareNumbers);
  resetNumBtn.addEventListener('click', resetNumberChecker);

  // Allow pressing Enter key inside number inputs
  [num1Input, num2Input].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        compareNumbers();
      }
    });
  });

  // =========================================================================
  // 3. Array Word Search Logic
  // =========================================================================

  /**
   * Perform case-insensitive search using indexOf() while preserving original array
   */
  function performWordSearch() {
    const rawSearch = wordSearchInput.value.trim();

    // 1. Validation: check if empty
    if (!rawSearch) {
      renderArrayTiles(-1);
      showWordSearchResult('warn', {
        title: 'Please enter a word',
        message: 'Enter any word into the search box or select one of the quick examples.',
        meta: ['Status: Input empty']
      });
      return;
    }

    // 2. Case-insensitive search using indexOf():
    // Map array elements to lowercase for matching, while leaving original words intact
    const lowerCaseArray = WORDS_ARRAY.map(item => item.toLowerCase());
    const queryLower = rawSearch.toLowerCase();

    // JavaScript indexOf() call
    const foundIndex = lowerCaseArray.indexOf(queryLower);

    if (foundIndex !== -1) {
      // Word found!
      const originalWord = WORDS_ARRAY[foundIndex];
      renderArrayTiles(foundIndex);

      showWordSearchResult('found', {
        title: `Word found at index ${foundIndex}`,
        message: `The word "${originalWord}" was successfully located in the array at zero-based index ${foundIndex}.`,
        meta: [
          `Method: indexOf("${queryLower}") → ${foundIndex}`,
          `Zero-based position: #${foundIndex}`,
          `Original text: "${originalWord}"`
        ]
      });

      // Smooth scroll the matched tile into view if needed
      const matchedTile = document.getElementById(`tile-${foundIndex}`);
      if (matchedTile) {
        matchedTile.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    } else {
      // Word not found
      renderArrayTiles(-1);
      showWordSearchResult('diff', {
        title: 'Word not found in the array',
        message: `The word "${rawSearch}" does not exist in the current sentence array.`,
        meta: [
          `Method: indexOf("${queryLower}") → -1`,
          `Array size: ${WORDS_ARRAY.length} items`,
          'Status: 404 Not Found'
        ]
      });
    }
  }

  /**
   * Display dynamic result card for array word search
   */
  function showWordSearchResult(type, data) {
    let iconSvg = '';
    let cardClass = '';

    if (type === 'found') {
      cardClass = 'result-card-found';
      iconSvg = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else if (type === 'diff') {
      cardClass = 'result-card-diff';
      iconSvg = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      `;
    } else {
      cardClass = 'result-card-warn';
      iconSvg = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
    }

    const metaPills = data.meta.map(m => `<span class="meta-pill">${escapeHtml(m)}</span>`).join('');

    wordResultContainer.innerHTML = `
      <div class="result-card ${cardClass}">
        <div class="result-main-row">
          <div class="result-status-icon">
            ${iconSvg}
          </div>
          <div class="result-text-group">
            <h4 class="result-headline">${escapeHtml(data.title)}</h4>
            <p class="result-subline">${escapeHtml(data.message)}</p>
          </div>
        </div>
        <div class="result-meta-tags">
          ${metaPills}
        </div>
      </div>
    `;
  }

  /**
   * Reset Word Search input, result, and highlight state
   */
  function resetWordSearch() {
    wordSearchInput.value = '';
    renderArrayTiles(-1);
    wordResultContainer.innerHTML = `
      <div class="result-placeholder">
        <div class="placeholder-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <p class="placeholder-text">Enter a word above or pick an example to search with <strong>indexOf()</strong>.</p>
      </div>
    `;
    wordSearchInput.focus();
  }

  // Word search events
  searchWordBtn.addEventListener('click', performWordSearch);
  resetWordBtn.addEventListener('click', resetWordSearch);

  wordSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performWordSearch();
    }
  });

  // =========================================================================
  // 4. Interactive Quick Examples
  // =========================================================================

  // Number Examples:
  // Equal numbers: 25 and 25
  const exEqualBtn = document.getElementById('ex-num-equal');
  if (exEqualBtn) {
    exEqualBtn.addEventListener('click', () => {
      num1Input.value = 25;
      num2Input.value = 25;
      num1Input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Provide visual indicator and execute compare
      compareNumbers();
    });
  }

  // Different numbers: 15 and 20
  const exDiffBtn = document.getElementById('ex-num-diff');
  if (exDiffBtn) {
    exDiffBtn.addEventListener('click', () => {
      num1Input.value = 15;
      num2Input.value = 20;
      num1Input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      compareNumbers();
    });
  }

  // Decimal numbers: 3.14 and 3.14
  const exDecimalBtn = document.getElementById('ex-num-decimal');
  if (exDecimalBtn) {
    exDecimalBtn.addEventListener('click', () => {
      num1Input.value = 3.14;
      num2Input.value = 3.14;
      num1Input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      compareNumbers();
    });
  }

  // Negative numbers: -8 and -8
  const exNegBtn = document.getElementById('ex-num-neg');
  if (exNegBtn) {
    exNegBtn.addEventListener('click', () => {
      num1Input.value = -8;
      num2Input.value = -8;
      num1Input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      compareNumbers();
    });
  }

  // Word Search Examples:
  // JavaScript, Learning, Students, Python
  const wordChipBtns = document.querySelectorAll('.example-chips button[data-word]');
  wordChipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetWord = btn.getAttribute('data-word');
      wordSearchInput.value = targetWord;
      wordSearchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      performWordSearch();
    });
  });

  // =========================================================================
  // 5. Sidebar Navigation & Active Scroll Spy
  // =========================================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');

  // Mobile drawer toggle
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });

    // Close sidebar when clicking outside or selecting a link on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 860) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 860) {
          sidebar.classList.remove('mobile-open');
        }
      });
    });
  }

  // Active navigation highlight on scroll
  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    if (currentSection) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('data-target') === currentSection
        );
      });
    }
  });

  // =========================================================================
  // 6. Utility Functions
  // =========================================================================
  function escapeHtml(string) {
    if (typeof string !== 'string') return String(string);
    return string
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
