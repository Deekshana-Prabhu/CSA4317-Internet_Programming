/**
 * ==============================================================================
 * WeatherNow – Weather Information Dashboard
 * ==============================================================================
 * 
 * Core Technical Concepts Demonstrated:
 * 1. JavaScript Regular Expressions (RegExp) for client-side input validation.
 * 2. Asynchronous AJAX client-server communication using native XMLHttpRequest.
 * 3. Asynchronous Callback Pattern (onSuccess, onError, onComplete).
 * 4. JSON Processing with JSON.parse() and structured object organization.
 * 5. Dynamic HTML (DHTML) & DOM Manipulation without page reload.
 * 6. Robust Exception Handling using try, catch, and finally blocks.
 * 7. State Management for Celsius/Fahrenheit toggle, live clock, & search history.
 * ==============================================================================
 */

// Strict mode for cleaner code and catching common programming errors
'use strict';

/**
 * ------------------------------------------------------------------------------
 * APPLICATION STATE MANAGEMENT
 * ------------------------------------------------------------------------------
 * Centralized state object keeping track of user settings, active city data,
 * and search history.
 */
const AppState = {
  activeUnit: 'C',                // 'C' for Celsius, 'F' for Fahrenheit
  currentWeather: null,           // Current parsed weather object
  activeCityQuery: 'Chennai',     // Currently displayed city query
  isLoading: false,               // Prevents duplicate concurrent requests
  storageKey: 'weathernow_history_v1' // LocalStorage key for recent searches
};

/**
 * ------------------------------------------------------------------------------
 * 1. REGULAR EXPRESSION VALIDATION
 * ------------------------------------------------------------------------------
 * Regular Expressions (RegExp) provide powerful pattern-matching capabilities.
 * 
 * Rules for valid city names:
 * - Accept alphabetic letters (English letters and common accented Latin letters)
 * - Accept spaces (e.g., "New York", "San Francisco")
 * - Accept hyphens (e.g., "Winston-Salem", "Port-au-Prince")
 * - Accept single quotes / apostrophes (e.g., "St. John's", "N'Djamena")
 * - Length between 2 and 60 characters
 * - Reject numbers, illegal punctuation, symbols, and empty input
 */
const CITY_VALIDATION_REGEX = /^[a-zA-Z\u0080-\u024F\s\-']{2,60}$/;

/**
 * Validates a city name input string.
 * @param {string} rawCity - User-provided input string.
 * @returns {Object} Validation outcome { isValid: boolean, message: string, sanitized: string }
 */
function validateCityInput(rawCity) {
  // Check for undefined, null, or non-string inputs
  if (!rawCity || typeof rawCity !== 'string') {
    return {
      isValid: false,
      message: 'Please enter a city name to search.',
      sanitized: ''
    };
  }

  // Trim leading and trailing whitespace
  const sanitized = rawCity.trim();

  // Rule 1: Empty input check
  if (sanitized.length === 0) {
    return {
      isValid: false,
      message: 'City name cannot be empty or contain only blank spaces.',
      sanitized: ''
    };
  }

  // Rule 2: Minimum character length check
  if (sanitized.length < 2) {
    return {
      isValid: false,
      message: 'City name is too short. Please enter at least 2 characters.',
      sanitized: sanitized
    };
  }

  // Rule 3: Reject digits / numbers
  if (/\d/.test(sanitized)) {
    return {
      isValid: false,
      message: 'City names cannot contain numbers or digits.',
      sanitized: sanitized
    };
  }

  // Rule 4: Match against strict Regular Expression
  if (!CITY_VALIDATION_REGEX.test(sanitized)) {
    return {
      isValid: false,
      message: 'City name contains invalid characters. Only alphabetic letters, spaces, and hyphens are allowed.',
      sanitized: sanitized
    };
  }

  // Input passed all regex validation checks
  return {
    isValid: true,
    message: '',
    sanitized: sanitized
  };
}

/**
 * ------------------------------------------------------------------------------
 * 2. AJAX CLIENT-SERVER COMMUNICATION USING XMLHTTPREQUEST
 * ------------------------------------------------------------------------------
 * XMLHttpRequest (XHR) is the foundational web API used to execute asynchronous
 * HTTP requests from the browser to a server without triggering a full page reload.
 * 
 * Callback Architecture:
 * - onSuccess: Called when the server responds with HTTP 200 and valid JSON data.
 * - onError: Called when an error occurs (network failure, 404, invalid JSON).
 * - onComplete: Called in all cases (finally) to clean up loading states and UI spinners.
 * 
 * @param {string} cityName - Sanitized city name.
 * @param {Function} onSuccess - Callback function for success.
 * @param {Function} onError - Callback function for errors.
 * @param {Function} onComplete - Callback function for cleanup.
 */
function executeWeatherRequest(cityName, onSuccess, onError, onComplete) {
  // Instantiate the native XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Build the backend endpoint URL with proper URI encoding
  const endpoint = `/api/weather?city=${encodeURIComponent(cityName)}`;

  // Set request timeout (12 seconds)
  xhr.timeout = 12000;

  try {
    // Configure asynchronous GET request (3rd parameter 'true' indicates async)
    xhr.open('GET', endpoint, true);

    // Set request headers (identifying client request as expecting JSON)
    xhr.setRequestHeader('Accept', 'application/json');

    /**
     * onreadystatechange Event Handler
     * Fires whenever the readyState property changes.
     * 
     * readyState Values:
     * 0: UNSENT
     * 1: OPENED
     * 2: HEADERS_RECEIVED
     * 3: LOADING
     * 4: DONE (Operation is complete)
     */
    xhr.onreadystatechange = function () {
      // We only process the response when readyState is 4 (DONE)
      if (xhr.readyState === 4) {
        try {
          // HTTP Status Code 200: OK / Successful
          if (xhr.status === 200) {
            let parsedResponse;

            // Step: Parse the raw JSON text response safely
            try {
              parsedResponse = JSON.parse(xhr.responseText);
            } catch (jsonParseException) {
              throw new Error('Failed to parse server response as valid JSON.');
            }

            // Verify successful payload structure
            if (parsedResponse && parsedResponse.success && parsedResponse.data) {
              if (typeof onSuccess === 'function') {
                onSuccess(parsedResponse.data);
              }
            } else {
              const errorMessage = (parsedResponse && parsedResponse.error) 
                ? parsedResponse.error 
                : 'Server returned an unformatted response.';
              if (typeof onError === 'function') {
                onError(errorMessage);
              }
            }

          } else {
            // Non-200 HTTP status code (400, 404, 500, 502, etc.)
            let serverErrorMessage = `Weather request failed (Status ${xhr.status})`;
            try {
              const errorObject = JSON.parse(xhr.responseText);
              if (errorObject && errorObject.error) {
                serverErrorMessage = errorObject.error;
              }
            } catch (e) {
              if (xhr.statusText) {
                serverErrorMessage += `: ${xhr.statusText}`;
              }
            }

            if (typeof onError === 'function') {
              onError(serverErrorMessage);
            }
          }

        } catch (processingException) {
          // Catch and report unexpected client-side handling errors
          if (typeof onError === 'function') {
            onError(processingException.message || 'An unexpected error occurred during response processing.');
          }
        } finally {
          // Completion callback executes regardless of success or failure
          if (typeof onComplete === 'function') {
            onComplete();
          }
        }
      }
    };

    /**
     * Network-Level Error Handler
     * Triggered if the request cannot be completed (e.g. server is down, no network connection).
     */
    xhr.onerror = function () {
      try {
        if (typeof onError === 'function') {
          onError('Network error: Unable to reach the weather server. Please check your internet connection.');
        }
      } finally {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    };

    /**
     * Timeout Error Handler
     * Triggered if the request takes longer than xhr.timeout milliseconds.
     */
    xhr.ontimeout = function () {
      try {
        if (typeof onError === 'function') {
          onError('Request timed out: The weather server took too long to respond. Please try again.');
        }
      } finally {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    };

    // Send the asynchronous XMLHttpRequest to the server
    xhr.send();

  } catch (requestException) {
    // Catch synchronous errors during XHR initialization
    try {
      if (typeof onError === 'function') {
        onError('Failed to initiate weather request: ' + requestException.message);
      }
    } finally {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }
}

/**
 * ------------------------------------------------------------------------------
 * 3. TEMPERATURE CONVERSION & FORMATTING HELPERS
 * ------------------------------------------------------------------------------
 */

/**
 * Converts Celsius to Fahrenheit: (C * 9/5) + 32
 * @param {number} celsius 
 * @returns {number}
 */
function celsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

/**
 * Formats a temperature value according to the currently active unit (°C or °F).
 * @param {number} celsiusValue - Base temperature in Celsius.
 * @param {string} unit - 'C' or 'F'.
 * @param {boolean} includeSymbol - Whether to append '°C' or '°F'.
 * @returns {string}
 */
function formatTemperature(celsiusValue, unit = AppState.activeUnit, includeSymbol = true) {
  if (celsiusValue === null || celsiusValue === undefined || isNaN(celsiusValue)) {
    return '--';
  }
  let numeric = celsiusValue;
  if (unit === 'F') {
    numeric = celsiusToFahrenheit(celsiusValue);
  }
  const rounded = Math.round(numeric);
  return includeSymbol ? `${rounded}°${unit}` : `${rounded}`;
}

/**
 * Formats an ISO 8601 time string (e.g. "2026-11-17T06:08") into readable 12-hour AM/PM format.
 * @param {string} isoTimeString 
 * @returns {string} E.g., "06:08 AM"
 */
function formatTime12Hour(isoTimeString) {
  if (!isoTimeString) return '--:--';
  try {
    const parts = isoTimeString.split('T');
    if (parts.length >= 2) {
      const timePart = parts[1].substring(0, 5); // "06:08"
      const [h, m] = timePart.split(':');
      let hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
      return `${String(hour).padStart(2, '0')}:${m} ${ampm}`;
    }
    return isoTimeString;
  } catch (e) {
    return isoTimeString;
  }
}

/**
 * Formats a date string (e.g. "2026-11-17") to a friendly day name and date.
 * @param {string} dateString 
 * @returns {Object} { dayName: "Tomorrow" | "Wed", formattedDate: "18 Nov" }
 */
function formatForecastDate(dateString, index = 0) {
  if (!dateString) return { dayName: 'Day', formattedDate: '' };
  try {
    const dateObj = new Date(dateString + 'T00:00:00');
    if (index === 0) {
      return { dayName: 'Today', formattedDate: dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) };
    }
    if (index === 1) {
      return { dayName: 'Tomorrow', formattedDate: dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) };
    }
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return { dayName, formattedDate };
  } catch (e) {
    return { dayName: dateString, formattedDate: '' };
  }
}

/**
 * ------------------------------------------------------------------------------
 * 4. WEATHER SVG ICONS GENERATOR
 * ------------------------------------------------------------------------------
 * Returns vector SVG illustrations customized for weather conditions.
 */
function getWeatherSvg(iconType, isHero = false) {
  const sizeClass = isHero ? 'weather-svg-hero' : 'weather-svg-icon';

  switch (iconType) {
    case 'sun':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="24" fill="#F59E0B" class="${isHero ? 'anim-pulse-sun' : ''}" />
          <g stroke="#F59E0B" stroke-width="4" stroke-linecap="round">
            <line x1="50" y1="12" x2="50" y2="4" />
            <line x1="50" y1="96" x2="50" y2="88" />
            <line x1="12" y1="50" x2="4" y2="50" />
            <line x1="96" y1="50" x2="88" y2="50" />
            <line x1="23.14" y1="23.14" x2="17.48" y2="17.48" />
            <line x1="82.52" y1="82.52" x2="76.86" y2="76.86" />
            <line x1="23.14" y1="76.86" x2="17.48" y2="82.52" />
            <line x1="82.52" y1="17.48" x2="76.86" y2="23.14" />
          </g>
        </svg>
      `;

    case 'moon':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 20C40 20 28 32 28 48C28 64 40 76 56 76C64 76 71 73 76 67C60 67 48 55 48 39C48 31 51 24 56 20Z" fill="#6366F1" />
          <circle cx="72" cy="30" r="2.5" fill="#FDE047" />
          <circle cx="78" cy="46" r="2" fill="#FDE047" />
          <circle cx="34" cy="26" r="2" fill="#BAE6FD" />
        </svg>
      `;

    case 'cloud-sun':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="64" cy="36" r="16" fill="#F59E0B" class="${isHero ? 'anim-pulse-sun' : ''}" />
          <path d="M30 76H72C79.7 76 86 69.7 86 62C86 54.6 80.3 48.5 73 48.1C71.4 37 61.9 28.5 50.4 28.5C40.7 28.5 32.4 34.6 29.2 43.5C22.1 45.1 16.5 51.5 16.5 59.2C16.5 68.5 22.5 76 30 76Z" fill="#FFFFFF" stroke="#BAE6FD" stroke-width="2" class="${isHero ? 'anim-float-cloud' : ''}" />
        </svg>
      `;

    case 'cloud-moon':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M66 22C54 22 46 30 46 42C46 54 54 62 66 62C72 62 77 60 80 55C68 55 60 45 60 34C60 28 62 24 66 22Z" fill="#6366F1" />
          <path d="M28 76H70C77.7 76 84 69.7 84 62C84 54.6 78.3 48.5 71 48.1C69.4 37 59.9 28.5 48.4 28.5C38.7 28.5 30.4 34.6 27.2 43.5C20.1 45.1 14.5 51.5 14.5 59.2C14.5 68.5 20.5 76 28 76Z" fill="#FFFFFF" stroke="#BAE6FD" stroke-width="2" class="${isHero ? 'anim-float-cloud' : ''}" />
        </svg>
      `;

    case 'cloud':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 74H74C82 74 88 68 88 60C88 52.5 82 46.5 74.5 46.1C72.8 34.5 63 26 51 26C41 26 32.5 32.5 29.2 41.5C21.8 43.1 16 49.5 16 57.5C16 66.5 22.5 74 30 74Z" fill="#E0F2FE" stroke="#7DD3FC" stroke-width="2" class="${isHero ? 'anim-float-cloud' : ''}" />
        </svg>
      `;

    case 'drizzle':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 64H72C79.7 64 86 57.7 86 50C86 42.6 80.3 36.5 73 36.1C71.4 25 61.9 16.5 50.4 16.5C40.7 16.5 32.4 22.6 29.2 31.5C22.1 33.1 16.5 39.5 16.5 47.2C16.5 56.5 22.5 64 30 64Z" fill="#E0F2FE" stroke="#7DD3FC" stroke-width="2" />
          <g stroke="#38BDF8" stroke-width="3" stroke-linecap="round" class="${isHero ? 'anim-rain-drop' : ''}">
            <line x1="36" y1="72" x2="33" y2="80" />
            <line x1="52" y1="72" x2="49" y2="80" />
            <line x1="68" y1="72" x2="65" y2="80" />
          </g>
        </svg>
      `;

    case 'rain':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 62H72C79.7 62 86 55.7 86 48C86 40.6 80.3 34.5 73 34.1C71.4 23 61.9 14.5 50.4 14.5C40.7 14.5 32.4 20.6 29.2 29.5C22.1 31.1 16.5 37.5 16.5 45.2C16.5 54.5 22.5 62 30 62Z" fill="#BAE6FD" stroke="#38BDF8" stroke-width="2" />
          <g stroke="#0284C7" stroke-width="3.5" stroke-linecap="round" class="${isHero ? 'anim-rain-drop' : ''}">
            <line x1="34" y1="70" x2="28" y2="84" />
            <line x1="50" y1="70" x2="44" y2="84" />
            <line x1="66" y1="70" x2="60" y2="84" />
          </g>
        </svg>
      `;

    case 'heavy-rain':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 58H72C79.7 58 86 51.7 86 44C86 36.6 80.3 30.5 73 30.1C71.4 19 61.9 10.5 50.4 10.5C40.7 10.5 32.4 16.6 29.2 25.5C22.1 27.1 16.5 33.5 16.5 41.2C16.5 50.5 22.5 58 30 58Z" fill="#94A3B8" stroke="#64748B" stroke-width="2" />
          <g stroke="#0369A1" stroke-width="4" stroke-linecap="round" class="${isHero ? 'anim-rain-drop' : ''}">
            <line x1="30" y1="66" x2="22" y2="86" />
            <line x1="46" y1="66" x2="38" y2="86" />
            <line x1="62" y1="66" x2="54" y2="86" />
            <line x1="76" y1="66" x2="68" y2="86" />
          </g>
        </svg>
      `;

    case 'thunderstorm':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 54H72C79.7 54 86 47.7 86 40C86 32.6 80.3 26.5 73 26.1C71.4 15 61.9 6.5 50.4 6.5C40.7 6.5 32.4 12.6 29.2 21.5C22.1 23.1 16.5 29.5 16.5 37.2C16.5 46.5 22.5 54 30 54Z" fill="#475569" stroke="#334155" stroke-width="2" />
          <polygon points="52,56 42,70 50,70 44,88 62,68 54,68" fill="#F59E0B" stroke="#D97706" stroke-width="1.5" />
          <g stroke="#38BDF8" stroke-width="3" stroke-linecap="round">
            <line x1="26" y1="64" x2="22" y2="76" />
            <line x1="74" y1="64" x2="70" y2="76" />
          </g>
        </svg>
      `;

    case 'snow':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 60H72C79.7 60 86 53.7 86 46C86 38.6 80.3 32.5 73 32.1C71.4 21 61.9 12.5 50.4 12.5C40.7 12.5 32.4 18.6 29.2 27.5C22.1 29.1 16.5 35.5 16.5 43.2C16.5 52.5 22.5 60 30 60Z" fill="#F1F5F9" stroke="#BAE6FD" stroke-width="2" />
          <circle cx="34" cy="74" r="3.5" fill="#7DD3FC" />
          <circle cx="50" cy="78" r="3.5" fill="#7DD3FC" />
          <circle cx="66" cy="74" r="3.5" fill="#7DD3FC" />
        </svg>
      `;

    case 'fog':
      return `
        <svg class="${sizeClass}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 50H68C74 50 78 46 78 40C78 34.5 74 30 68 29.5C66.5 20 59 13 50 13C42 13 35 18 32.5 25C26 26.5 22 31.5 22 38C22 45 26 50 32 50Z" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="2" />
          <g stroke="#94A3B8" stroke-width="4" stroke-linecap="round">
            <line x1="20" y1="62" x2="80" y2="62" />
            <line x1="28" y1="72" x2="72" y2="72" />
            <line x1="24" y1="82" x2="76" y2="82" />
          </g>
        </svg>
      `;

    default:
      return getWeatherSvg('sun', isHero);
  }
}

/**
 * ------------------------------------------------------------------------------
 * 5. DHTML & DOM MANIPULATION
 * ------------------------------------------------------------------------------
 * Dynamic HTML updates modify elements in the DOM without full page reload.
 */

// Cache DOM element references for optimal performance
const DOM = {
  // Search elements
  searchForm: document.getElementById('weatherSearchForm'),
  cityInput: document.getElementById('cityInput'),
  btnSearch: document.getElementById('btnSearch'),
  btnClearInput: document.getElementById('btnClearInput'),
  validationAlert: document.getElementById('validationAlert'),
  validationMessage: document.getElementById('validationMessage'),
  quickChipsContainer: document.getElementById('quickChipsContainer'),
  recentChipsContainer: document.getElementById('recentChipsContainer'),
  btnClearHistory: document.getElementById('btnClearHistory'),

  // Alerts & Loading
  loadingOverlay: document.getElementById('loadingOverlay'),
  serverErrorAlert: document.getElementById('serverErrorAlert'),
  serverErrorMessage: document.getElementById('serverErrorMessage'),
  btnCloseError: document.getElementById('btnCloseError'),

  // Hero Card Elements
  weatherHeroCard: document.getElementById('weatherHeroCard'),
  displayCity: document.getElementById('displayCity'),
  displayCountry: document.getElementById('displayCountry'),
  displayState: document.getElementById('displayState'),
  displayDateTime: document.getElementById('displayDateTime'),
  displayTemperature: document.getElementById('displayTemperature'),
  displayTempUnit: document.getElementById('displayTempUnit'),
  displayCondition: document.getElementById('displayCondition'),
  displayTempMax: document.getElementById('displayTempMax'),
  displayTempMin: document.getElementById('displayTempMin'),
  displayDescription: document.getElementById('displayDescription'),
  displayLastUpdated: document.getElementById('displayLastUpdated'),
  weatherIconContainer: document.getElementById('weatherIconContainer'),
  displayDayNightBadge: document.getElementById('displayDayNightBadge'),
  displayDayNightText: document.getElementById('displayDayNightText'),

  // Metrics Elements
  displayFeelsLike: document.getElementById('displayFeelsLike'),
  displayFeelsLikeUnit: document.getElementById('displayFeelsLikeUnit'),
  displayFeelsLikeSubtext: document.getElementById('displayFeelsLikeSubtext'),
  displayHumidity: document.getElementById('displayHumidity'),
  humidityProgressFill: document.getElementById('humidityProgressFill'),
  displayHumiditySubtext: document.getElementById('displayHumiditySubtext'),
  displayWindSpeed: document.getElementById('displayWindSpeed'),
  displayWindSubtext: document.getElementById('displayWindSubtext'),
  displayPressure: document.getElementById('displayPressure'),
  displayPressureSubtext: document.getElementById('displayPressureSubtext'),
  displayVisibility: document.getElementById('displayVisibility'),
  displayVisibilitySubtext: document.getElementById('displayVisibilitySubtext'),
  displaySunrise: document.getElementById('displaySunrise'),
  displaySunset: document.getElementById('displaySunset'),
  displayDaylightDuration: document.getElementById('displayDaylightDuration'),
  displayUV: document.getElementById('displayUV'),
  displayUVSubtext: document.getElementById('displayUVSubtext'),
  displayPrecipitation: document.getElementById('displayPrecipitation'),
  displayPrecipSubtext: document.getElementById('displayPrecipSubtext'),

  // Forecast Container
  forecastCardsGrid: document.getElementById('forecastCardsGrid'),

  // Top Bar Controls
  headerClock: document.getElementById('headerClock'),
  unitCelsius: document.getElementById('unitCelsius'),
  unitFahrenheit: document.getElementById('unitFahrenheit'),
  btnRefresh: document.getElementById('btnRefresh')
};

/**
 * Updates all DOM elements with structured real-time weather data.
 * @param {Object} data - Structured weather object received from server.
 */
function updateWeatherDashboardDOM(data) {
  if (!data) return;

  // Store in global state
  AppState.currentWeather = data;
  AppState.activeCityQuery = data.city;

  // 1. Location & Geographic details
  DOM.displayCity.textContent = data.city;
  DOM.displayCountry.textContent = data.country || 'Global';
  DOM.displayState.textContent = data.state ? `${data.state}, ${data.country}` : data.country;

  // 2. Date and Time Formatting
  try {
    const localDate = new Date(data.localTime || Date.now());
    const dateFormatted = localDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeFormatted = formatTime12Hour(data.localTime);
    DOM.displayDateTime.textContent = `${dateFormatted} • ${timeFormatted} (${data.timezone || 'Local'})`;
  } catch (e) {
    DOM.displayDateTime.textContent = 'Current Local Time';
  }

  // 3. Temperature & High/Low
  renderTemperatureReadouts();

  // 4. Condition & Summary Description
  DOM.displayCondition.textContent = data.condition || 'Clear Sky';
  DOM.displayDescription.textContent = data.description || 'Pleasant atmospheric conditions.';

  // 5. Day / Night Indicator Badge
  if (data.isDay) {
    DOM.displayDayNightBadge.classList.remove('night');
    DOM.displayDayNightText.textContent = 'Daytime';
  } else {
    DOM.displayDayNightBadge.classList.add('night');
    DOM.displayDayNightText.textContent = 'Nighttime';
  }

  // 6. Dynamic Hero Weather SVG Icon
  DOM.weatherIconContainer.innerHTML = getWeatherSvg(data.icon, true);

  // 7. Last Updated Timestamp
  const now = new Date();
  DOM.displayLastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;

  // 8. Metric Card 1: Feels Like
  const feelsLikeComfort = getFeelsLikeInterpretation(data.feelsLike, data.temperature);
  DOM.displayFeelsLikeSubtext.textContent = feelsLikeComfort;

  // 9. Metric Card 2: Humidity
  DOM.displayHumidity.textContent = data.humidity;
  DOM.humidityProgressFill.style.width = `${Math.min(Math.max(data.humidity, 0), 100)}%`;
  DOM.displayHumiditySubtext.textContent = getHumidityInterpretation(data.humidity);

  // 10. Metric Card 3: Wind Speed
  DOM.displayWindSpeed.textContent = data.windSpeed;
  DOM.displayWindSubtext.textContent = getWindInterpretation(data.windSpeed);

  // 11. Metric Card 4: Atmospheric Pressure
  DOM.displayPressure.textContent = data.pressure;
  DOM.displayPressureSubtext.textContent = getPressureInterpretation(data.pressure);

  // 12. Metric Card 5: Visibility
  DOM.displayVisibility.textContent = data.visibility;
  DOM.displayVisibilitySubtext.textContent = getVisibilityInterpretation(data.visibility);

  // 13. Metric Card 6: Sunrise & Sunset Schedule
  const sunriseFormatted = formatTime12Hour(data.sunrise);
  const sunsetFormatted = formatTime12Hour(data.sunset);
  DOM.displaySunrise.textContent = sunriseFormatted;
  DOM.displaySunset.textContent = sunsetFormatted;
  DOM.displayDaylightDuration.textContent = calculateDaylightDuration(data.sunrise, data.sunset);

  // 14. Metric Card 7: UV Index
  if (data.uvIndex !== null && data.uvIndex !== undefined) {
    DOM.displayUV.textContent = data.uvIndex;
    DOM.displayUVSubtext.textContent = getUVInterpretation(data.uvIndex);
  } else {
    DOM.displayUV.textContent = 'N/A';
    DOM.displayUVSubtext.textContent = 'UV index not available';
  }

  // 15. Metric Card 8: Precipitation
  DOM.displayPrecipitation.textContent = (data.precipitation !== undefined) ? data.precipitation.toFixed(1) : '0.0';
  DOM.displayPrecipSubtext.textContent = (data.precipitation > 0) ? 'Precipitation detected today' : 'No rainfall recorded';

  // 16. Render 5-Day Forecast Grid
  renderForecastCards(data.forecast);

  // 17. Add to Recent Searches History
  addToRecentSearches(data.city);

  // Smooth scroll or subtle visual flash
  DOM.weatherHeroCard.classList.remove('fadeInAnimation');
  void DOM.weatherHeroCard.offsetWidth; // Trigger DOM reflow to restart CSS animation
  DOM.weatherHeroCard.classList.add('fadeInAnimation');
}

/**
 * Re-renders all temperature fields based on the currently active unit (Celsius or Fahrenheit)
 * without re-fetching from the server.
 */
function renderTemperatureReadouts() {
  const data = AppState.currentWeather;
  if (!data) return;

  const unit = AppState.activeUnit;

  // Hero temperature
  DOM.displayTemperature.textContent = formatTemperature(data.temperature, unit, false);
  DOM.displayTempUnit.textContent = `°${unit}`;

  // Hero High / Low
  DOM.displayTempMax.textContent = formatTemperature(data.tempMax, unit, true);
  DOM.displayTempMin.textContent = formatTemperature(data.tempMin, unit, true);

  // Feels Like
  DOM.displayFeelsLike.textContent = formatTemperature(data.feelsLike, unit, false);
  DOM.displayFeelsLikeUnit.textContent = `°${unit}`;

  // Re-render forecast temperature cards
  if (data.forecast && Array.isArray(data.forecast)) {
    renderForecastCards(data.forecast);
  }
}

/**
 * Dynamically builds and inserts the 5-day forecast cards into the DOM.
 * @param {Array} forecastArray 
 */
function renderForecastCards(forecastArray) {
  if (!DOM.forecastCardsGrid) return;
  DOM.forecastCardsGrid.innerHTML = '';

  if (!forecastArray || !Array.isArray(forecastArray) || forecastArray.length === 0) {
    DOM.forecastCardsGrid.innerHTML = '<p class="no-recent-text">Forecast data currently unavailable.</p>';
    return;
  }

  const unit = AppState.activeUnit;
  const daysToShow = Math.min(forecastArray.length, 5);

  for (let i = 0; i < daysToShow; i++) {
    const dayItem = forecastArray[i];
    const { dayName, formattedDate } = formatForecastDate(dayItem.date, i);
    const maxTempFormatted = formatTemperature(dayItem.tempMax, unit, true);
    const minTempFormatted = formatTemperature(dayItem.tempMin, unit, true);
    const iconSvg = getWeatherSvg(dayItem.icon, false);

    const card = document.createElement('article');
    card.className = `forecast-card ${i === 0 ? 'today' : ''}`;
    card.innerHTML = `
      <h3 class="forecast-day-name">${dayName}</h3>
      <span class="forecast-date">${formattedDate}</span>
      <div class="forecast-icon-wrap" aria-hidden="true">
        ${iconSvg}
      </div>
      <div class="forecast-condition-name">${dayItem.condition}</div>
      <div class="forecast-temp-range">
        <span class="forecast-temp-max" title="High">${maxTempFormatted}</span>
        <span class="dot-sep">/</span>
        <span class="forecast-temp-min" title="Low">${minTempFormatted}</span>
      </div>
    `;

    DOM.forecastCardsGrid.appendChild(card);
  }
}

/**
 * ------------------------------------------------------------------------------
 * 6. METRIC INTERPRETATION HELPERS
 * ------------------------------------------------------------------------------
 */
function getFeelsLikeInterpretation(feelsLike, actual) {
  const diff = feelsLike - actual;
  if (diff > 2) return 'Humidity makes it feel warmer';
  if (diff < -2) return 'Wind chill makes it feel cooler';
  return 'Feels very close to the actual temperature';
}

function getHumidityInterpretation(humidity) {
  if (humidity < 30) return 'Dry air, low moisture';
  if (humidity <= 60) return 'Comfortable, ideal humidity';
  if (humidity <= 80) return 'Moderate to humid air';
  return 'High humidity, humid atmosphere';
}

function getWindInterpretation(speedKmH) {
  if (speedKmH < 5) return 'Calm breeze';
  if (speedKmH < 20) return 'Light, pleasant breeze';
  if (speedKmH < 40) return 'Moderate fresh breeze';
  return 'Strong gusty winds';
}

function getPressureInterpretation(pressureHpa) {
  if (pressureHpa < 1005) return 'Low pressure (stormy/cloudy)';
  if (pressureHpa <= 1020) return 'Standard atmospheric pressure';
  return 'High pressure (fair weather)';
}

function getVisibilityInterpretation(visibilityKm) {
  if (visibilityKm >= 10) return 'Excellent clear view';
  if (visibilityKm >= 5) return 'Good visibility';
  return 'Reduced visibility / Hazy';
}

function getUVInterpretation(uv) {
  if (uv <= 2) return 'Low UV (minimal protection needed)';
  if (uv <= 5) return 'Moderate UV (sunscreen advised)';
  if (uv <= 7) return 'High UV (protection essential)';
  return 'Very High UV (seek shade during peak hours)';
}

function calculateDaylightDuration(sunriseIso, sunsetIso) {
  if (!sunriseIso || !sunsetIso) return 'Daylight duration: ~12 hours';
  try {
    const [sH, sM] = sunriseIso.split('T')[1].split(':');
    const [eH, eM] = sunsetIso.split('T')[1].split(':');
    const startMins = parseInt(sH, 10) * 60 + parseInt(sM, 10);
    const endMins = parseInt(eH, 10) * 60 + parseInt(eM, 10);
    let diff = endMins - startMins;
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `Daylight duration: ${hours}h ${minutes}m`;
  } catch (e) {
    return 'Daylight duration: ~12 hours';
  }
}

/**
 * ------------------------------------------------------------------------------
 * 7. USER INTERACTION & CONTROLLER FLOW
 * ------------------------------------------------------------------------------
 */

/**
 * Main function invoked to search for weather by city name.
 * Demonstrates:
 * 1. Input Sanitization
 * 2. Regular Expression Validation
 * 3. Loading animation management
 * 4. Asynchronous XMLHttpRequest AJAX dispatch
 * 5. Callbacks for Success and Error handling
 * 
 * @param {string} rawCityName 
 */
function handleCitySearch(rawCityName) {
  // Hide any existing error alerts
  hideValidationAlert();
  hideServerErrorAlert();

  // Validate using Regular Expression
  const validation = validateCityInput(rawCityName);
  if (!validation.isValid) {
    showValidationAlert(validation.message);
    DOM.cityInput.focus();
    return;
  }

  const sanitizedCity = validation.sanitized;

  // If already loading this request, ignore repeated clicks
  if (AppState.isLoading) {
    return;
  }

  // Set loading state & show spinner
  setLoadingState(true);

  /**
   * Callback 1: onSuccess Callback
   * Executed when XMLHttpRequest returns HTTP 200 with valid JSON.
   */
  const handleSuccess = function (weatherData) {
    try {
      updateWeatherDashboardDOM(weatherData);
    } catch (domException) {
      console.error('DOM Update Exception:', domException);
      showServerErrorAlert('An error occurred while updating the weather display.');
    }
  };

  /**
   * Callback 2: onError Callback
   * Executed when XMLHttpRequest fails, returns non-200 status, or encounters invalid data.
   */
  const handleError = function (errorMessage) {
    showServerErrorAlert(errorMessage);
  };

  /**
   * Callback 3: onComplete Callback
   * Executed in all situations (finally) to terminate loading animation and re-enable inputs.
   */
  const handleComplete = function () {
    setLoadingState(false);
  };

  // Dispatch the XMLHttpRequest with the callbacks
  executeWeatherRequest(sanitizedCity, handleSuccess, handleError, handleComplete);
}

/**
 * Controls the visibility of the loading indicator and disables action buttons.
 * @param {boolean} isLoading 
 */
function setLoadingState(isLoading) {
  AppState.isLoading = isLoading;

  if (isLoading) {
    DOM.loadingOverlay.classList.remove('hidden');
    DOM.btnSearch.disabled = true;
    DOM.btnSearch.style.opacity = '0.7';
    DOM.btnRefresh.classList.add('spinning');
  } else {
    DOM.loadingOverlay.classList.add('hidden');
    DOM.btnSearch.disabled = false;
    DOM.btnSearch.style.opacity = '1';
    DOM.btnRefresh.classList.remove('spinning');
  }
}

/**
 * Displays the RegExp validation error banner.
 * @param {string} message 
 */
function showValidationAlert(message) {
  DOM.validationMessage.textContent = message;
  DOM.validationAlert.classList.remove('hidden');
}

/**
 * Hides the RegExp validation error banner.
 */
function hideValidationAlert() {
  DOM.validationAlert.classList.add('hidden');
}

/**
 * Displays the server / network error banner.
 * @param {string} message 
 */
function showServerErrorAlert(message) {
  DOM.serverErrorMessage.textContent = message;
  DOM.serverErrorAlert.classList.remove('hidden');
}

/**
 * Hides the server / network error banner.
 */
function hideServerErrorAlert() {
  DOM.serverErrorAlert.classList.add('hidden');
}

/**
 * ------------------------------------------------------------------------------
 * 8. RECENT SEARCHES & LOCAL STORAGE MANAGEMENT
 * ------------------------------------------------------------------------------
 */

/**
 * Loads recent searches from localStorage.
 * @returns {Array<string>}
 */
function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(AppState.storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (storageException) {
    console.warn('Could not read search history from localStorage:', storageException);
  }
  return [];
}

/**
 * Saves a new city into recent searches in localStorage (capped at 6 items).
 * @param {string} cityName 
 */
function addToRecentSearches(cityName) {
  try {
    let searches = loadRecentSearches();
    // Remove if already present (to move to front)
    searches = searches.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    // Insert at front
    searches.unshift(cityName);
    // Cap at 6
    if (searches.length > 6) {
      searches = searches.slice(0, 6);
    }
    localStorage.setItem(AppState.storageKey, JSON.stringify(searches));
    renderRecentSearchesChips();
  } catch (e) {
    console.warn('Could not save search to localStorage:', e);
  }
}

/**
 * Removes a single city from recent search history.
 * @param {string} cityName 
 */
function removeRecentSearch(cityName) {
  try {
    let searches = loadRecentSearches();
    searches = searches.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    localStorage.setItem(AppState.storageKey, JSON.stringify(searches));
    renderRecentSearchesChips();
  } catch (e) {
    console.warn('Could not remove search from localStorage:', e);
  }
}

/**
 * Clears all recent searches from localStorage.
 */
function clearAllRecentSearches() {
  try {
    localStorage.removeItem(AppState.storageKey);
    renderRecentSearchesChips();
  } catch (e) {
    console.warn('Could not clear history from localStorage:', e);
  }
}

/**
 * Dynamically renders the recent searches chips into the DOM.
 */
function renderRecentSearchesChips() {
  if (!DOM.recentChipsContainer) return;
  DOM.recentChipsContainer.innerHTML = '';

  const searches = loadRecentSearches();

  if (searches.length === 0) {
    DOM.recentChipsContainer.innerHTML = '<span class="no-recent-text">No recent searches yet. Search a city to remember it!</span>';
    return;
  }

  searches.forEach(city => {
    const chip = document.createElement('div');
    chip.className = 'recent-chip';
    chip.innerHTML = `
      <span class="chip-text">${city}</span>
      <button type="button" class="chip-remove" aria-label="Remove ${city} from history" title="Remove">&times;</button>
    `;

    // Click on city name searches for it
    chip.querySelector('.chip-text').addEventListener('click', () => {
      DOM.cityInput.value = city;
      handleCitySearch(city);
    });

    // Click on 'x' deletes it from history
    chip.querySelector('.chip-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      removeRecentSearch(city);
    });

    DOM.recentChipsContainer.appendChild(chip);
  });
}

/**
 * ------------------------------------------------------------------------------
 * 9. LIVE HEADER CLOCK
 * ------------------------------------------------------------------------------
 */
function startLiveHeaderClock() {
  function tick() {
    const now = new Date();
    if (DOM.headerClock) {
      DOM.headerClock.textContent = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  }
  tick();
  setInterval(tick, 1000);
}

/**
 * ------------------------------------------------------------------------------
 * 10. EVENT LISTENERS INITIALIZATION
 * ------------------------------------------------------------------------------
 */
function initializeEventListeners() {
  // 1. Search form submit event
  if (DOM.searchForm) {
    DOM.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCitySearch(DOM.cityInput.value);
    });
  }

  // 2. City input 'Enter' key handler
  if (DOM.cityInput) {
    DOM.cityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCitySearch(DOM.cityInput.value);
      }
    });

    // Real-time input handling for clear button & hiding error on typing
    DOM.cityInput.addEventListener('input', () => {
      if (DOM.cityInput.value.length > 0) {
        DOM.btnClearInput.classList.remove('hidden');
      } else {
        DOM.btnClearInput.classList.add('hidden');
      }
      hideValidationAlert();
    });
  }

  // 3. Clear search input button
  if (DOM.btnClearInput) {
    DOM.btnClearInput.addEventListener('click', () => {
      DOM.cityInput.value = '';
      DOM.btnClearInput.classList.add('hidden');
      hideValidationAlert();
      DOM.cityInput.focus();
    });
  }

  // 4. Quick suggestions city chips
  if (DOM.quickChipsContainer) {
    DOM.quickChipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.city-chip');
      if (chip && chip.dataset.city) {
        const targetCity = chip.dataset.city;
        DOM.cityInput.value = targetCity;
        DOM.btnClearInput.classList.remove('hidden');
        handleCitySearch(targetCity);
      }
    });
  }

  // 5. Clear Search History Button
  if (DOM.btnClearHistory) {
    DOM.btnClearHistory.addEventListener('click', () => {
      clearAllRecentSearches();
    });
  }

  // 6. Close server error alert
  if (DOM.btnCloseError) {
    DOM.btnCloseError.addEventListener('click', () => {
      hideServerErrorAlert();
    });
  }

  // 7. Celsius Unit Toggle Button
  if (DOM.unitCelsius) {
    DOM.unitCelsius.addEventListener('click', () => {
      if (AppState.activeUnit !== 'C') {
        AppState.activeUnit = 'C';
        DOM.unitCelsius.classList.add('active');
        DOM.unitCelsius.setAttribute('aria-pressed', 'true');
        DOM.unitFahrenheit.classList.remove('active');
        DOM.unitFahrenheit.setAttribute('aria-pressed', 'false');
        renderTemperatureReadouts();
      }
    });
  }

  // 8. Fahrenheit Unit Toggle Button
  if (DOM.unitFahrenheit) {
    DOM.unitFahrenheit.addEventListener('click', () => {
      if (AppState.activeUnit !== 'F') {
        AppState.activeUnit = 'F';
        DOM.unitFahrenheit.classList.add('active');
        DOM.unitFahrenheit.setAttribute('aria-pressed', 'true');
        DOM.unitCelsius.classList.remove('active');
        DOM.unitCelsius.setAttribute('aria-pressed', 'false');
        renderTemperatureReadouts();
      }
    });
  }

  // 9. Refresh Current Weather Button
  if (DOM.btnRefresh) {
    DOM.btnRefresh.addEventListener('click', () => {
      const currentCity = AppState.activeCityQuery || 'Chennai';
      handleCitySearch(currentCity);
    });
  }
}

/**
 * ------------------------------------------------------------------------------
 * 11. APPLICATION INITIALIZATION
 * ------------------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
  // Start the live header clock
  startLiveHeaderClock();

  // Attach all DOM event listeners
  initializeEventListeners();

  // Render recent searches from localStorage
  renderRecentSearchesChips();

  // Initial default search: Load Chennai or last searched city
  const recent = loadRecentSearches();
  const defaultCity = (recent.length > 0) ? recent[0] : 'Chennai';
  DOM.cityInput.value = defaultCity;
  DOM.btnClearInput.classList.remove('hidden');

  // Load real-time weather via XMLHttpRequest on page load
  handleCitySearch(defaultCity);
});
