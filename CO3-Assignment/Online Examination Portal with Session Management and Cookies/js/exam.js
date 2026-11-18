/**
 * ONLINE EXAMINATION PORTAL - MASTER CLIENT CONTROLLER
 * Handles interactive examination navigation, countdown timer,
 * answer palette state tracking, modal confirmation, cookie auto-fill,
 * and live session timeout demonstration.
 */

// Global State
let currentQuestionIndex = 1;
const TOTAL_QUESTIONS = 10;
let examTimerInterval = null;
let remainingExamSeconds = 10 * 60; // 10 minutes

// -----------------------------------------------------------------------------
// 1. EXAMINATION NAVIGATION & INTERACTION
// -----------------------------------------------------------------------------

/**
 * Initializes the exam interface, starts the 10-minute timer,
 * and hooks event listeners.
 */
function initExam() {
  showQuestion(1);
  startExamTimer();
  updatePaletteStatus();
}

/**
 * Displays a specific question card by its 1-based index
 * @param {number} qNum - Question number (1 to 10)
 */
function showQuestion(qNum) {
  if (qNum < 1 || qNum > TOTAL_QUESTIONS) return;
  currentQuestionIndex = qNum;

  // Toggle question containers
  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    const card = document.getElementById('question-card-' + i);
    const palBtn = document.getElementById('palette-btn-' + i);

    if (card) {
      if (i === qNum) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    }

    if (palBtn) {
      if (i === qNum) {
        palBtn.classList.add('active');
      } else {
        palBtn.classList.remove('active');
      }
    }
  }

  // Update navigation button states
  const prevBtn = document.getElementById('prevQuestionBtn');
  const nextBtn = document.getElementById('nextQuestionBtn');

  if (prevBtn) {
    prevBtn.disabled = (qNum === 1);
  }

  if (nextBtn) {
    if (qNum === TOTAL_QUESTIONS) {
      nextBtn.innerHTML = 'Review & Submit <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      nextBtn.classList.remove('btn-primary');
      nextBtn.classList.add('btn-success');
    } else {
      nextBtn.innerHTML = 'Next Question <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      nextBtn.classList.add('btn-primary');
      nextBtn.classList.remove('btn-success');
    }
  }

  // Update question header text
  const currentHeader = document.getElementById('current-q-num-display');
  if (currentHeader) {
    currentHeader.innerText = qNum;
  }
}

/**
 * Moves to next question or opens confirmation modal if on last question
 */
function nextQuestion() {
  if (currentQuestionIndex < TOTAL_QUESTIONS) {
    showQuestion(currentQuestionIndex + 1);
  } else {
    openSubmitModal();
  }
}

/**
 * Moves to previous question
 */
function prevQuestion() {
  if (currentQuestionIndex > 1) {
    showQuestion(currentQuestionIndex - 1);
  }
}

/**
 * Handles selecting an option via clicking the option card or radio button
 * @param {number} qId - Question ID (1-10)
 * @param {string} optKey - Option key ('A', 'B', 'C', 'D')
 */
function selectAnswer(qId, optKey) {
  const radio = document.getElementById('opt_' + qId + '_' + optKey);
  if (radio) {
    radio.checked = true;
  }

  // Highlight selected container
  const parentContainer = document.getElementById('question-card-' + qId);
  if (parentContainer) {
    const allOptions = parentContainer.querySelectorAll('.option-item');
    allOptions.forEach(function(item) {
      item.classList.remove('selected');
    });
  }

  const selectedItem = document.getElementById('option_item_' + qId + '_' + optKey);
  if (selectedItem) {
    selectedItem.classList.add('selected');
  }

  // Update palette status
  const palBtn = document.getElementById('palette-btn-' + qId);
  if (palBtn) {
    palBtn.classList.add('answered');
  }

  updatePaletteStatus();
}

/**
 * Clears the selected answer for the specified question
 * @param {number} qId - Question ID
 */
function clearSelection(qId) {
  const parentContainer = document.getElementById('question-card-' + qId);
  if (parentContainer) {
    const radios = parentContainer.querySelectorAll('input[type="radio"]');
    radios.forEach(function(r) { r.checked = false; });

    const allOptions = parentContainer.querySelectorAll('.option-item');
    allOptions.forEach(function(item) { item.classList.remove('selected'); });
  }

  const palBtn = document.getElementById('palette-btn-' + qId);
  if (palBtn) {
    palBtn.classList.remove('answered');
  }

  updatePaletteStatus();
}

/**
 * Recalculates answered and unanswered counts and updates the UI
 */
function updatePaletteStatus() {
  let answered = 0;
  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    const answeredRadio = document.querySelector('input[name="q' + i + '"]:checked');
    const palBtn = document.getElementById('palette-btn-' + i);
    if (answeredRadio) {
      answered++;
      if (palBtn) palBtn.classList.add('answered');
    } else {
      if (palBtn) palBtn.classList.remove('answered');
    }
  }

  const unanswered = TOTAL_QUESTIONS - answered;

  const answeredEl = document.getElementById('answered-count-display');
  const unansweredEl = document.getElementById('unanswered-count-display');

  if (answeredEl) answeredEl.innerText = answered;
  if (unansweredEl) unansweredEl.innerText = unanswered;

  return { answered: answered, unanswered: unanswered };
}

// -----------------------------------------------------------------------------
// 2. COUNTDOWN TIMER (10 MINUTES WITH AUTO-SUBMIT)
// -----------------------------------------------------------------------------

function startExamTimer() {
  const timerDisplay = document.getElementById('examTimerDisplay');
  const timerBox = document.getElementById('examTimerBox');
  if (!timerDisplay) return;

  function tick() {
    if (remainingExamSeconds <= 0) {
      clearInterval(examTimerInterval);
      timerDisplay.innerText = "00:00";
      // Auto-submit examination
      alert("Time is up! Your 10-minute examination period has ended. The portal is automatically submitting your answers now.");
      const examForm = document.getElementById('examForm');
      if (examForm) {
        examForm.submit();
      }
      return;
    }

    remainingExamSeconds--;

    const minutes = Math.floor(remainingExamSeconds / 60);
    const seconds = remainingExamSeconds % 60;
    const formatted = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    timerDisplay.innerText = formatted;

    if (timerBox) {
      if (remainingExamSeconds < 30) {
        timerBox.classList.remove('warning');
        timerBox.classList.add('danger');
      } else if (remainingExamSeconds < 120) {
        timerBox.classList.add('warning');
      }
    }
  }

  tick(); // initial tick
  examTimerInterval = setInterval(tick, 1000);
}

// -----------------------------------------------------------------------------
// 3. CONFIRMATION MODAL & FINAL SUBMIT
// -----------------------------------------------------------------------------

function openSubmitModal() {
  const stats = updatePaletteStatus();
  const summaryText = document.getElementById('modal-summary-text');
  if (summaryText) {
    summaryText.innerHTML = `You have answered <strong>${stats.answered}</strong> out of <strong>${TOTAL_QUESTIONS}</strong> questions.<br>` +
      (stats.unanswered > 0 
        ? `<span style="color: #ef4444; font-weight: 600;">Warning: You have ${stats.unanswered} unanswered question(s)!</span>`
        : `<span style="color: #10b981; font-weight: 600;">Great job! All questions have been answered.</span>`);
  }

  const modal = document.getElementById('submitModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeSubmitModal() {
  const modal = document.getElementById('submitModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function confirmExamSubmit() {
  closeSubmitModal();
  const examForm = document.getElementById('examForm');
  if (examForm) {
    examForm.submit();
  }
}

// -----------------------------------------------------------------------------
// 4. COOKIE UTILITIES & LOGIN AUTO-FILL
// -----------------------------------------------------------------------------

/**
 * Retrieves a cookie value by name from document.cookie
 * @param {string} name - Cookie name
 * @returns {string|null}
 */
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

/**
 * Automatically checks and fills remembered username and preferred language
 * on login page load.
 */
function autoFillRememberedCredentials() {
  const rememberedUser = getCookie('rememberedUser');
  const preferredLang = getCookie('preferredLang');

  const usernameInput = document.getElementById('username');
  const rememberCheckbox = document.getElementById('rememberMe');
  const languageSelect = document.getElementById('language');
  const rememberedAlert = document.getElementById('rememberedUserNotice');

  if (rememberedUser && usernameInput) {
    usernameInput.value = rememberedUser;
    if (rememberCheckbox) {
      rememberCheckbox.checked = true;
    }
    if (rememberedAlert) {
      rememberedAlert.style.display = 'block';
      const nameSpan = document.getElementById('rememberedUserDisplay');
      if (nameSpan) nameSpan.innerText = rememberedUser;
    }
  }

  if (preferredLang && languageSelect) {
    languageSelect.value = preferredLang;
  }
}

/**
 * Convenient autofill button for demonstration
 */
function fillSampleCredentials() {
  const u = document.getElementById('username');
  const p = document.getElementById('password');
  const r = document.getElementById('rememberMe');
  if (u) u.value = 'student101';
  if (p) p.value = 'student123';
  if (r) r.checked = true;
}

// -----------------------------------------------------------------------------
// 5. SESSION TIMEOUT DEMONSTRATION CONTROLLER (5 MINUTES)
// -----------------------------------------------------------------------------

let sessionTimeoutSeconds = 300; // 5 minutes (300 seconds)
let sessionTimerInterval = null;

function initSessionDemo(initialSeconds) {
  if (initialSeconds && initialSeconds > 0) {
    sessionTimeoutSeconds = initialSeconds;
  }

  const timerEl = document.getElementById('sessionCountdownDisplay');
  const progressBar = document.getElementById('sessionProgressBar');

  function updateTimer() {
    if (sessionTimeoutSeconds <= 0) {
      clearInterval(sessionTimerInterval);
      if (timerEl) timerEl.innerText = "00:00 (EXPIRED)";
      if (progressBar) progressBar.style.width = "0%";
      const statusBadge = document.getElementById('sessionStatusBadge');
      if (statusBadge) {
        statusBadge.className = 'badge badge-danger';
        statusBadge.innerText = 'EXPIRED';
      }
      return;
    }

    sessionTimeoutSeconds--;

    const m = Math.floor(sessionTimeoutSeconds / 60);
    const s = sessionTimeoutSeconds % 60;
    const formatted = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;

    if (timerEl) timerEl.innerText = formatted;
    if (progressBar) {
      const pct = (sessionTimeoutSeconds / 300) * 100;
      progressBar.style.width = pct + "%";
    }
  }

  updateTimer();
  sessionTimerInterval = setInterval(updateTimer, 1000);
}

// -----------------------------------------------------------------------------
// 6. TOGGLE MOBILE SIDEBAR
// -----------------------------------------------------------------------------

function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}
