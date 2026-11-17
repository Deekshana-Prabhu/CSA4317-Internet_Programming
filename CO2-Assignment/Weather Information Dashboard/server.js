/**
 * WeatherNow – Weather Information Dashboard Backend Server
 * 
 * Built with Node.js and Express.
 * Acts as an intermediary proxy between the client-side XMLHttpRequest and
 * the free Open-Meteo Geocoding & Weather APIs.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Regular expression to validate city input on the server side
// Allows letters (including unicode accents), spaces, hyphens, and apostrophes
const SERVER_CITY_REGEX = /^[a-zA-Z\u0080-\u024F\s\-']{2,60}$/;

// Serve static frontend files (index.html, style.css, script.js, etc.)
app.use(express.static(path.join(__dirname)));

/**
 * WMO Weather Interpretation Codes (WW)
 * Maps Open-Meteo numeric codes to human-readable condition descriptions and icon identifiers.
 */
function getWeatherConditionDetails(code, isDay = 1) {
  const numericCode = Number(code);
  const dayOrNight = isDay === 0 ? 'night' : 'day';

  switch (numericCode) {
    case 0:
      return {
        condition: 'Clear Sky',
        description: isDay ? 'Clear sunny skies and excellent visibility' : 'Clear starry skies with calm conditions',
        icon: isDay ? 'sun' : 'moon',
        category: 'clear'
      };
    case 1:
      return {
        condition: 'Mainly Clear',
        description: 'Mostly clear skies with a few passing high clouds',
        icon: isDay ? 'cloud-sun' : 'cloud-moon',
        category: 'clear'
      };
    case 2:
      return {
        condition: 'Partly Cloudy',
        description: 'Scattered clouds with periods of pleasant sunshine',
        icon: isDay ? 'cloud-sun' : 'cloud-moon',
        category: 'cloudy'
      };
    case 3:
      return {
        condition: 'Overcast',
        description: 'Cloud blanket covering the sky with minimal direct sunlight',
        icon: 'cloud',
        category: 'cloudy'
      };
    case 45:
      return {
        condition: 'Foggy',
        description: 'Reduced visibility due to dense ground-level fog',
        icon: 'fog',
        category: 'fog'
      };
    case 48:
      return {
        condition: 'Depositing Rime Fog',
        description: 'Freezing fog forming icy deposits on exposed surfaces',
        icon: 'fog',
        category: 'fog'
      };
    case 51:
      return {
        condition: 'Light Drizzle',
        description: 'Gentle mist and fine light drizzle in the air',
        icon: 'drizzle',
        category: 'rain'
      };
    case 53:
      return {
        condition: 'Moderate Drizzle',
        description: 'Steady fine droplets falling with damp conditions',
        icon: 'drizzle',
        category: 'rain'
      };
    case 55:
      return {
        condition: 'Dense Drizzle',
        description: 'Heavy drizzle reducing visibility and wetting surfaces',
        icon: 'drizzle',
        category: 'rain'
      };
    case 56:
    case 57:
      return {
        condition: 'Freezing Drizzle',
        description: 'Supercooled drizzle that freezes upon ground contact',
        icon: 'snow',
        category: 'snow'
      };
    case 61:
      return {
        condition: 'Slight Rain',
        description: 'Light scattered raindrops with damp surroundings',
        icon: 'rain',
        category: 'rain'
      };
    case 63:
      return {
        condition: 'Moderate Rain',
        description: 'Continuous steady rainfall across the region',
        icon: 'rain',
        category: 'rain'
      };
    case 65:
      return {
        condition: 'Heavy Rain',
        description: 'Intense rain showers with possible localized puddles',
        icon: 'heavy-rain',
        category: 'rain'
      };
    case 66:
    case 67:
      return {
        condition: 'Freezing Rain',
        description: 'Rain that freezes on impact, causing icy surfaces',
        icon: 'snow',
        category: 'snow'
      };
    case 71:
      return {
        condition: 'Slight Snow',
        description: 'Light dusting of gentle snowflakes drifting down',
        icon: 'snow',
        category: 'snow'
      };
    case 73:
      return {
        condition: 'Moderate Snow',
        description: 'Steady snowfall accumulating on sidewalks and roadways',
        icon: 'snow',
        category: 'snow'
      };
    case 75:
      return {
        condition: 'Heavy Snow',
        description: 'Intense snowfall with significant ground accumulation',
        icon: 'snow',
        category: 'snow'
      };
    case 77:
      return {
        condition: 'Snow Grains',
        description: 'Small, white opaque grains of frozen precipitation',
        icon: 'snow',
        category: 'snow'
      };
    case 80:
      return {
        condition: 'Light Showers',
        description: 'Passing brief rain showers interspersed with breaks',
        icon: 'rain',
        category: 'rain'
      };
    case 81:
      return {
        condition: 'Moderate Showers',
        description: 'Periodic heavy downpours with overcast skies',
        icon: 'rain',
        category: 'rain'
      };
    case 82:
      return {
        condition: 'Violent Showers',
        description: 'Sudden heavy cloudbursts with gusty wind conditions',
        icon: 'heavy-rain',
        category: 'rain'
      };
    case 85:
    case 86:
      return {
        condition: 'Snow Showers',
        description: 'Intermittent snow flurries and brisk chilly winds',
        icon: 'snow',
        category: 'snow'
      };
    case 95:
      return {
        condition: 'Thunderstorm',
        description: 'Thunder and lightning accompanied by gusty winds',
        icon: 'thunderstorm',
        category: 'thunderstorm'
      };
    case 96:
    case 99:
      return {
        condition: 'Severe Thunderstorm',
        description: 'Severe thunderstorm with thunder, lightning, and hail',
        icon: 'thunderstorm',
        category: 'thunderstorm'
      };
    default:
      return {
        condition: 'Variable Weather',
        description: 'Mild atmospheric conditions with typical regional weather',
        icon: isDay ? 'sun' : 'moon',
        category: 'clear'
      };
  }
}

/**
 * GET /api/weather
 * Query parameter: city (e.g. /api/weather?city=Chennai)
 * 
 * 1. Validates city name using Regular Expression
 * 2. Queries Open-Meteo Geocoding API to resolve coordinates (lat, lon)
 * 3. Queries Open-Meteo Weather API for real-time parameters
 * 4. Combines and returns clean, structured JSON to client
 */
app.get('/api/weather', async (req, res) => {
  try {
    const rawCity = req.query.city;

    // Step 1: Check if city query parameter exists
    if (!rawCity || typeof rawCity !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'City parameter is missing. Please provide a city name (e.g., ?city=Chennai).'
      });
    }

    const trimmedCity = rawCity.trim();

    // Step 2: Validate against Regular Expression
    if (!SERVER_CITY_REGEX.test(trimmedCity)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid city name format. City names must contain only letters, spaces, hyphens, and apostrophes (2-60 characters).'
      });
    }

    // Step 3: Fetch Coordinates from Open-Meteo Geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedCity)}&count=1&language=en&format=json`;
    
    let geoResponse;
    try {
      geoResponse = await fetch(geoUrl, {
        headers: { 'User-Agent': 'WeatherNow-Dashboard/1.0' }
      });
    } catch (networkErr) {
      return res.status(502).json({
        success: false,
        error: 'Unable to reach the geocoding service. Please check your internet connection or try again later.'
      });
    }

    if (!geoResponse.ok) {
      return res.status(502).json({
        success: false,
        error: `Geocoding service returned status ${geoResponse.status}.`
      });
    }

    const geoData = await geoResponse.json();

    // If city is not found in geocoding database
    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({
        success: false,
        error: `City "${trimmedCity}" was not found. Please check the spelling and try again.`
      });
    }

    const location = geoData.results[0];
    const { name: resolvedCity, country, admin1: state, latitude, longitude, timezone } = location;

    // Step 4: Fetch Real-Time Weather Data from Open-Meteo Forecast API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=${encodeURIComponent(timezone || 'auto')}`;

    let weatherResponse;
    try {
      weatherResponse = await fetch(weatherUrl, {
        headers: { 'User-Agent': 'WeatherNow-Dashboard/1.0' }
      });
    } catch (networkErr) {
      return res.status(502).json({
        success: false,
        error: 'Unable to reach the weather forecast service. Please try again shortly.'
      });
    }

    if (!weatherResponse.ok) {
      return res.status(502).json({
        success: false,
        error: `Weather forecast service returned status ${weatherResponse.status}.`
      });
    }

    const weatherData = await weatherResponse.json();

    // Step 5: Process and structure the real-time weather object
    const current = weatherData.current || {};
    const daily = weatherData.daily || {};

    const weatherCode = current.weather_code !== undefined ? current.weather_code : 0;
    const isDay = current.is_day !== undefined ? current.is_day : 1;
    const conditionMeta = getWeatherConditionDetails(weatherCode, isDay);

    // Visibility in Open-Meteo is returned in meters (convert to kilometers)
    let visibilityKm = 10;
    if (current.visibility !== undefined && current.visibility !== null) {
      visibilityKm = parseFloat((current.visibility / 1000).toFixed(1));
    }

    // Extract sunrise and sunset times
    const sunrise = (daily.sunrise && daily.sunrise[0]) ? daily.sunrise[0] : null;
    const sunset = (daily.sunset && daily.sunset[0]) ? daily.sunset[0] : null;

    // Daily high and low for today
    const tempMax = (daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined)
      ? daily.temperature_2m_max[0]
      : current.temperature_2m;
    const tempMin = (daily.temperature_2m_min && daily.temperature_2m_min[0] !== undefined)
      ? daily.temperature_2m_min[0]
      : current.temperature_2m;
    const uvIndex = (daily.uv_index_max && daily.uv_index_max[0] !== undefined)
      ? daily.uv_index_max[0]
      : null;

    // Build 5-day forecast array for extra utility
    const forecastDays = [];
    if (daily.time && Array.isArray(daily.time)) {
      const daysCount = Math.min(daily.time.length, 6);
      for (let i = 0; i < daysCount; i++) {
        const fCode = daily.weather_code ? daily.weather_code[i] : 0;
        const fMeta = getWeatherConditionDetails(fCode, 1);
        forecastDays.push({
          date: daily.time[i],
          weatherCode: fCode,
          condition: fMeta.condition,
          icon: fMeta.icon,
          tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[i] : null,
          tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[i] : null
        });
      }
    }

    // Structured JSON payload
    const structuredPayload = {
      success: true,
      data: {
        city: resolvedCity,
        country: country || '',
        state: state || '',
        coordinates: {
          latitude: latitude,
          longitude: longitude
        },
        timezone: timezone || weatherData.timezone || 'UTC',
        localTime: current.time || new Date().toISOString(),
        isDay: isDay === 1,
        temperature: current.temperature_2m !== undefined ? Math.round(current.temperature_2m * 10) / 10 : 0,
        feelsLike: current.apparent_temperature !== undefined ? Math.round(current.apparent_temperature * 10) / 10 : 0,
        humidity: current.relative_humidity_2m !== undefined ? current.relative_humidity_2m : 0,
        windSpeed: current.wind_speed_10m !== undefined ? Math.round(current.wind_speed_10m * 10) / 10 : 0,
        pressure: current.surface_pressure !== undefined ? Math.round(current.surface_pressure) : 1013,
        visibility: visibilityKm,
        precipitation: current.precipitation !== undefined ? current.precipitation : 0,
        uvIndex: uvIndex,
        tempMax: tempMax,
        tempMin: tempMin,
        weatherCode: weatherCode,
        condition: conditionMeta.condition,
        description: conditionMeta.description,
        icon: conditionMeta.icon,
        category: conditionMeta.category,
        sunrise: sunrise,
        sunset: sunset,
        forecast: forecastDays,
        lastUpdated: new Date().toISOString()
      }
    };

    return res.status(200).json(structuredPayload);

  } catch (unexpectedError) {
    console.error('Unexpected server error:', unexpectedError);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while retrieving weather data. Please try again.'
    });
  }
});

// Fallback route for 404
app.use((req, res) => {
  res.status(404).send('Resource not found');
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`WeatherNow Server running smoothly on http://localhost:${PORT}`);
});

module.exports = { app, server };
