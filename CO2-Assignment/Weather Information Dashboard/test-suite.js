/**
 * WeatherNow Dashboard - Automated Verification Test Suite
 * Tests all backend and API communication scenarios.
 */

const { app, server } = require('./server.js');

async function runTests() {
  console.log('\n--- STARTING WEATHERNOW TEST SUITE ---\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Static asset tests
  await test('Serves index.html at /', async () => {
    const res = await fetch('http://localhost:3000/');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('WeatherNow')) throw new Error('Missing WeatherNow title in HTML');
    if (!text.includes('script.js')) throw new Error('Missing script.js link');
    if (!text.includes('style.css')) throw new Error('Missing style.css link');
  });

  await test('Serves style.css at /style.css', async () => {
    const res = await fetch('http://localhost:3000/style.css');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('--sky-500')) throw new Error('Missing theme color definitions');
  });

  await test('Serves script.js at /script.js', async () => {
    const res = await fetch('http://localhost:3000/script.js');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('XMLHttpRequest')) throw new Error('Missing XMLHttpRequest implementation');
    if (!text.includes('CITY_VALIDATION_REGEX')) throw new Error('Missing regex validation');
    if (!text.includes('JSON.parse')) throw new Error('Missing JSON.parse');
  });

  // 2. Real-time Weather Endpoint Tests
  const quickCities = ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad'];
  for (const city of quickCities) {
    await test(`Retrieves real-time weather for ${city}`, async () => {
      const res = await fetch(`http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(`Data marked unsuccessful: ${data.error}`);
      if (!data.data.city) throw new Error('Missing city property');
      if (typeof data.data.temperature !== 'number') throw new Error('Temperature is not a number');
      if (typeof data.data.humidity !== 'number') throw new Error('Humidity is not a number');
      if (typeof data.data.windSpeed !== 'number') throw new Error('WindSpeed is not a number');
      if (!data.data.condition) throw new Error('Missing condition property');
      if (typeof data.data.feelsLike !== 'number') throw new Error('Missing feelsLike property');
      if (typeof data.data.pressure !== 'number') throw new Error('Missing pressure property');
      if (typeof data.data.visibility !== 'number') throw new Error('Missing visibility property');
      if (!data.data.sunrise || !data.data.sunset) throw new Error('Missing sunrise or sunset');
      if (!Array.isArray(data.data.forecast) || data.data.forecast.length === 0) throw new Error('Missing forecast');
    });
  }

  // 3. International cities
  const international = ['London', 'Tokyo', 'Paris'];
  for (const city of international) {
    await test(`Retrieves real-time weather for ${city}`, async () => {
      const res = await fetch(`http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(`Data marked unsuccessful: ${data.error}`);
      if (!data.data.city) throw new Error('Missing city property');
    });
  }

  // 4. Invalid input validation tests
  await test('Rejects city with numbers (e.g. Chennai123) with 400 Bad Request', async () => {
    const res = await fetch('http://localhost:3000/api/weather?city=Chennai123');
    if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
    const data = await res.json();
    if (data.success) throw new Error('Should not succeed for city with numbers');
    if (!data.error.includes('Invalid city name')) throw new Error('Missing expected error message');
  });

  await test('Rejects empty city query with 400 Bad Request', async () => {
    const res = await fetch('http://localhost:3000/api/weather?city=');
    if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
    const data = await res.json();
    if (data.success) throw new Error('Should not succeed for empty city');
  });

  await test('Rejects special characters (e.g. Paris$$$) with 400 Bad Request', async () => {
    const res = await fetch('http://localhost:3000/api/weather?city=Paris$$$');
    if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
  });

  await test('Returns 404 for non-existent city name format', async () => {
    const res = await fetch('http://localhost:3000/api/weather?city=Xyzznonexistentplace');
    if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
    const data = await res.json();
    if (data.success) throw new Error('Should not succeed for nonexistent city');
    if (!data.error.includes('was not found')) throw new Error('Missing expected not found message');
  });

  console.log(`\nTEST SUMMARY: ${passed} passed, ${failed} failed.\n`);

  server.close(() => {
    process.exit(failed > 0 ? 1 : 0);
  });
}

runTests();
