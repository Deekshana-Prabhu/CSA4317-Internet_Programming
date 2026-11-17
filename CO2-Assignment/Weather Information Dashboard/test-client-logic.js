/**
 * Unit Test for Client Logic
 */

const assert = require('assert');

// 1. Regular expression test
const CITY_VALIDATION_REGEX = /^[a-zA-Z\u0080-\u024F\s\-']{2,60}$/;

function validateCityInput(rawCity) {
  if (!rawCity || typeof rawCity !== 'string') {
    return { isValid: false, message: 'Please enter a city name to search.' };
  }
  const sanitized = rawCity.trim();
  if (sanitized.length === 0) {
    return { isValid: false, message: 'City name cannot be empty or contain only blank spaces.' };
  }
  if (sanitized.length < 2) {
    return { isValid: false, message: 'City name is too short. Please enter at least 2 characters.' };
  }
  if (/\d/.test(sanitized)) {
    return { isValid: false, message: 'City names cannot contain numbers or digits.' };
  }
  if (!CITY_VALIDATION_REGEX.test(sanitized)) {
    return { isValid: false, message: 'City name contains invalid characters. Only alphabetic letters, spaces, and hyphens are allowed.' };
  }
  return { isValid: true, message: '', sanitized };
}

function celsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function formatTemperature(celsiusValue, unit = 'C', includeSymbol = true) {
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

function formatTime12Hour(isoTimeString) {
  if (!isoTimeString) return '--:--';
  const parts = isoTimeString.split('T');
  if (parts.length >= 2) {
    const timePart = parts[1].substring(0, 5);
    const [h, m] = timePart.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${String(hour).padStart(2, '0')}:${m} ${ampm}`;
  }
  return isoTimeString;
}

console.log('--- Testing Client Validation Logic ---');

// Valid cities
assert.strictEqual(validateCityInput('Chennai').isValid, true);
assert.strictEqual(validateCityInput('Bengaluru').isValid, true);
assert.strictEqual(validateCityInput('New Delhi').isValid, true);
assert.strictEqual(validateCityInput('Winston-Salem').isValid, true);
assert.strictEqual(validateCityInput("St. John's").isValid, false); // Period rejected by strict regex as required
assert.strictEqual(validateCityInput("St John's").isValid, true);
assert.strictEqual(validateCityInput('Paris').isValid, true);

// Invalid cities
assert.strictEqual(validateCityInput('').isValid, false);
assert.strictEqual(validateCityInput('   ').isValid, false);
assert.strictEqual(validateCityInput('A').isValid, false);
assert.strictEqual(validateCityInput('Delhi123').isValid, false);
assert.strictEqual(validateCityInput('Mumbai$').isValid, false);
assert.strictEqual(validateCityInput('<script>').isValid, false);
assert.strictEqual(validateCityInput('City#9').isValid, false);

console.log('[PASS] All Client Validation tests passed');

// Temperature tests
assert.strictEqual(formatTemperature(0, 'C'), '0°C');
assert.strictEqual(formatTemperature(0, 'F'), '32°F');
assert.strictEqual(formatTemperature(25, 'C'), '25°C');
assert.strictEqual(formatTemperature(25, 'F'), '77°F');
assert.strictEqual(formatTemperature(100, 'C'), '100°C');
assert.strictEqual(formatTemperature(100, 'F'), '212°F');
assert.strictEqual(formatTemperature(26.6, 'C'), '27°C');
assert.strictEqual(formatTemperature(26.6, 'F'), '80°F');

console.log('[PASS] All Temperature Conversion tests passed');

// Time format tests
assert.strictEqual(formatTime12Hour('2026-11-17T06:08'), '06:08 AM');
assert.strictEqual(formatTime12Hour('2026-11-17T17:39'), '05:39 PM');
assert.strictEqual(formatTime12Hour('2026-11-17T00:15'), '12:15 AM');
assert.strictEqual(formatTime12Hour('2026-11-17T12:00'), '12:00 PM');

console.log('[PASS] All Time Formatting tests passed');
console.log('ALL CLIENT-SIDE UNIT TESTS PASSED!');
