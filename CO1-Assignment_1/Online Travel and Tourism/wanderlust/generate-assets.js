const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'wanderlust', 'assets', 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Helper to create visually rich SVG travel destination cards
function makeSvg(title, subtitle, type, colors, icon) {
  const [c1, c2, c3] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="50%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c3}" />
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0a192f" stop-opacity="0.9" />
      <stop offset="60%" stop-color="#0a192f" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  
  <!-- Base Background -->
  <rect width="800" height="500" fill="url(#bgGrad)" />
  
  <!-- Stylized Decorative Elements -->
  <circle cx="700" cy="90" r="180" fill="#ffffff" fill-opacity="0.08" />
  <circle cx="100" cy="400" r="220" fill="#ffffff" fill-opacity="0.05" />
  
  <!-- Mountain / Wave / Silhouette Landscape Shapes -->
  ${type === 'mountain' ? `
    <path d="M-50 420 L180 230 L380 430 L550 200 L750 390 L850 310 L850 500 L-50 500 Z" fill="#ffffff" fill-opacity="0.15" />
    <path d="M50 450 L320 270 L520 440 L680 280 L850 420 L850 500 L50 500 Z" fill="#000000" fill-opacity="0.25" />
  ` : type === 'beach' ? `
    <path d="M-50 340 Q150 290 350 350 T750 330 T950 360 L950 500 L-50 500 Z" fill="#ffffff" fill-opacity="0.15" />
    <path d="M-50 380 Q200 340 450 390 T900 370 L900 500 L-50 500 Z" fill="#f7f1e5" fill-opacity="0.3" />
    <path d="M-50 430 Q250 400 550 440 T950 420 L950 500 L-50 500 Z" fill="#d4a373" fill-opacity="0.4" />
  ` : type === 'heritage' ? `
    <rect x="180" y="220" width="80" height="200" fill="#ffffff" fill-opacity="0.12" rx="10" />
    <polygon points="180,220 220,160 260,220" fill="#ffffff" fill-opacity="0.2" />
    <rect x="300" y="180" width="200" height="240" fill="#ffffff" fill-opacity="0.15" rx="15" />
    <polygon points="300,180 400,100 500,180" fill="#ffffff" fill-opacity="0.25" />
    <circle cx="400" cy="140" r="18" fill="#ffffff" fill-opacity="0.3" />
    <rect x="540" y="220" width="80" height="200" fill="#ffffff" fill-opacity="0.12" rx="10" />
    <polygon points="540,220 580,160 620,220" fill="#ffffff" fill-opacity="0.2" />
  ` : `
    <path d="M0 320 Q200 280 400 340 T800 310 L800 500 L0 500 Z" fill="#ffffff" fill-opacity="0.12" />
    <circle cx="650" cy="150" r="50" fill="#ffd166" fill-opacity="0.8" />
  `}
  
  <!-- Overlay Gradient for Readability -->
  <rect width="800" height="500" fill="url(#overlay)" />
  
  <!-- Badge -->
  <g transform="translate(50, 50)">
    <rect width="130" height="36" rx="18" fill="#ffffff" fill-opacity="0.25" stroke="#ffffff" stroke-width="1.5"/>
    <text x="65" y="23" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">WANDERLUST</text>
  </g>

  <!-- Central Destination Graphic/Icon -->
  <g transform="translate(400, 210)" text-anchor="middle" filter="url(#shadow)">
    <text font-family="'Segoe UI Emoji', sans-serif" font-size="70">${icon}</text>
  </g>
  
  <!-- Content Block at Bottom -->
  <g transform="translate(50, 420)" filter="url(#shadow)">
    <text x="0" y="-30" font-family="'Segoe UI', 'Outfit', sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="0.5">${title}</text>
    <text x="0" y="5" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#e0f2fe">${subtitle}</text>
  </g>
</svg>`;
}

const destinations = [
  { file: 'ooty.svg', title: 'Ooty', sub: 'Queen of Hill Stations • Nilgiris, Tamil Nadu', type: 'mountain', colors: ['#0f766e', '#047857', '#064e3b'], icon: '⛰️' },
  { file: 'kodaikanal.svg', title: 'Kodaikanal', sub: 'Princess of Hill Stations • Tamil Nadu', type: 'mountain', colors: ['#0369a1', '#0e7490', '#155e75'], icon: '🌲' },
  { file: 'goa.svg', title: 'Goa', sub: 'Sun, Sand, Vibrant Nightlife & Heritage Beaches', type: 'beach', colors: ['#0284c7', '#0891b2', '#0d9488'], icon: '🏖️' },
  { file: 'manali.svg', title: 'Manali', sub: 'Snowy Himalayan Valleys • Himachal Pradesh', type: 'mountain', colors: ['#1e40af', '#3b82f6', '#1d4ed8'], icon: '🏔️' },
  { file: 'kerala.svg', title: 'Kerala', sub: 'God’s Own Country • Backwaters & Houseboats', type: 'beach', colors: ['#059669', '#10b981', '#047857'], icon: '🌴' },
  { file: 'jaipur.svg', title: 'Jaipur', sub: 'The Pink City • Royal Palaces & Forts, Rajasthan', type: 'heritage', colors: ['#b45309', '#c2410c', '#9a3412'], icon: '🏰' },
  { file: 'bali.svg', title: 'Bali', sub: 'Island of Gods • Temples, Terraces & Beaches', type: 'beach', colors: ['#0d9488', '#059669', '#0891b2'], icon: '🌺' },
  { file: 'maldives.svg', title: 'Maldives', sub: 'Overwater Luxury Bungalows & Turquoise Reefs', type: 'beach', colors: ['#0284c7', '#06b6d4', '#0891b2'], icon: '🏝️' }
];

destinations.forEach(d => {
  fs.writeFileSync(path.join(imgDir, d.file), makeSvg(d.title, d.sub, d.type, d.colors, d.icon));
});

// Hotels
const hotels = [
  { file: 'hotel-savoy.svg', title: 'Savoy Heritage Palace', sub: '5-Star Colonial Luxury • Ooty', type: 'heritage', colors: ['#475569', '#334155', '#1e293b'], icon: '🏨' },
  { file: 'hotel-leela.svg', title: 'The Leela Beach Resort', sub: '5-Star Beachfront Paradise • Goa', type: 'beach', colors: ['#0284c7', '#0369a1', '#075985'], icon: '🏊' },
  { file: 'hotel-solang.svg', title: 'Solang Valley Retreat', sub: '4.8-Star Alpine Chalet • Manali', type: 'mountain', colors: ['#1e3a8a', '#1e40af', '#172554'], icon: '🏔️' },
  { file: 'hotel-kumarakom.svg', title: 'Kumarakom Lagoon Villas', sub: '5-Star Ayurvedic Resort • Kerala', type: 'beach', colors: ['#047857', '#065f46', '#064e3b'], icon: '🛶' },
  { file: 'hotel-rambagh.svg', title: 'Rambagh Royal Palace', sub: 'Heritage Palace of Maharajas • Jaipur', type: 'heritage', colors: ['#9a3412', '#7c2d12', '#451a03'], icon: '👑' },
  { file: 'hotel-ayana.svg', title: 'Ayana Ocean Cliff Resort', sub: '5-Star Cliffside Infinity Villas • Bali', type: 'beach', colors: ['#0891b2', '#0e7490', '#155e75'], icon: '🍹' }
];

hotels.forEach(h => {
  fs.writeFileSync(path.join(imgDir, h.file), makeSvg(h.title, h.sub, h.type, h.colors, h.icon));
});

// Logo SVG
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00a8ff" />
      <stop offset="100%" stop-color="#10ac84" />
    </linearGradient>
    <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g transform="translate(10, 10)">
    <!-- Compass / Globe Icon -->
    <circle cx="30" cy="30" r="28" fill="url(#logoGrad)" filter="url(#logoShadow)"/>
    <circle cx="30" cy="30" r="25" fill="#ffffff" fill-opacity="0.15" />
    <!-- Stylized Compass Needle -->
    <polygon points="30,12 36,30 30,26 24,30" fill="#ffffff" />
    <polygon points="30,48 36,30 30,34 24,30" fill="#ffd166" />
    <circle cx="30" cy="30" r="4" fill="#0a3d62" />
    <!-- Flight trail -->
    <path d="M 45 15 A 24 24 0 0 1 52 40" stroke="#ffd166" stroke-width="2.5" stroke-dasharray="3 3" fill="none" />
    <polygon points="54,42 48,38 56,36" fill="#ffd166" />
  </g>
  <!-- Text -->
  <text x="82" y="44" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" fill="#0a3d62" letter-spacing="2">WANDER<tspan fill="#00a8ff">LUST</tspan></text>
  <text x="85" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#10ac84" letter-spacing="3.5">EXPLORE THE WORLD</text>
</svg>`;
fs.writeFileSync(path.join(imgDir, 'logo.svg'), logoSvg);

// Hero BG SVG
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c2461" />
      <stop offset="40%" stop-color="#0a3d62" />
      <stop offset="75%" stop-color="#00a8ff" />
      <stop offset="100%" stop-color="#48dbfb" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="75%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#ffd166" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#ff9f43" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#ff9f43" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#skyGrad)" />
  <circle cx="1440" cy="320" r="380" fill="url(#sunGlow)" />
  
  <!-- Distant Mountains -->
  <path d="M-100 800 L300 450 L750 780 L1200 420 L1650 750 L2020 510 L2020 1080 L-100 1080 Z" fill="#0a3d62" fill-opacity="0.55" />
  <path d="M150 820 L580 520 L980 790 L1450 490 L1880 760 L2100 630 L2100 1080 L150 1080 Z" fill="#0c2461" fill-opacity="0.7" />
  
  <!-- Foreground Tropical Waves and Islands -->
  <path d="M-100 920 Q400 840 900 930 T1920 890 L1920 1080 L-100 1080 Z" fill="#079992" fill-opacity="0.5" />
  <path d="M-100 960 Q500 900 1100 980 T2020 940 L2020 1080 L-100 1080 Z" fill="#0a3d62" fill-opacity="0.9" />
  
  <!-- Golden Sand Beach Edge -->
  <path d="M-50 1020 Q800 980 1920 1020 L1920 1080 L-50 1080 Z" fill="#f7d794" fill-opacity="0.3" />
</svg>`;
fs.writeFileSync(path.join(imgDir, 'hero-bg.svg'), heroSvg);

// Package images
const packages = [
  { file: 'pkg-ooty.svg', title: 'Ooty Weekend Escape', sub: '3 Days / 2 Nights • ₹14,999/person', type: 'mountain', colors: ['#047857', '#059669', '#10b981'], icon: '🚂' },
  { file: 'pkg-kerala.svg', title: 'Kerala Backwater Retreat', sub: '5 Days / 4 Nights • ₹22,500/person', type: 'beach', colors: ['#0d9488', '#14b8a6', '#0f766e'], icon: '⛵' },
  { file: 'pkg-goa.svg', title: 'Goa Beach Holiday', sub: '4 Days / 3 Nights • ₹16,800/person', type: 'beach', colors: ['#0284c7', '#38bdf8', '#0369a1'], icon: '🏄' },
  { file: 'pkg-manali.svg', title: 'Manali Adventure Trip', sub: '6 Days / 5 Nights • ₹24,999/person', type: 'mountain', colors: ['#1d4ed8', '#3b82f6', '#2563eb'], icon: '🎿' },
  { file: 'pkg-jaipur.svg', title: 'Jaipur Heritage Tour', sub: '4 Days / 3 Nights • ₹18,200/person', type: 'heritage', colors: ['#c2410c', '#ea580c', '#9a3412'], icon: '🐘' },
  { file: 'pkg-bali.svg', title: 'Bali Tropical Vacation', sub: '7 Days / 6 Nights • ₹48,500/person', type: 'beach', colors: ['#0f766e', '#10b981', '#0284c7'], icon: '🌋' }
];

packages.forEach(p => {
  fs.writeFileSync(path.join(imgDir, p.file), makeSvg(p.title, p.sub, p.type, p.colors, p.icon));
});

// Offers images
const offers = [
  { file: 'offer-summer.svg', title: 'Summer Holiday Offers', sub: 'Up to 30% OFF on Hill Stations', type: 'mountain', colors: ['#059669', '#10b981', '#047857'], icon: '☀️' },
  { file: 'offer-family.svg', title: 'Family Vacation Special', sub: 'Kids Stay Free + Group Discounts', type: 'beach', colors: ['#0284c7', '#0ea5e9', '#0369a1'], icon: '👨‍👩‍👧‍👦' },
  { file: 'offer-honeymoon.svg', title: 'Honeymoon Romance', sub: 'Candlelight Dinner & Spa Included', type: 'beach', colors: ['#be185d', '#e11d48', '#9f1239'], icon: '💖' },
  { file: 'offer-adventure.svg', title: 'Adventure Travel Blast', sub: '20% OFF Rafting & Paragliding', type: 'mountain', colors: ['#d97706', '#f59e0b', '#b45309'], icon: '🪂' },
  { file: 'offer-earlybird.svg', title: 'Early Bird Discount', sub: 'Flat ₹5,000 OFF on 30-Day Advance', type: 'heritage', colors: ['#7c3aed', '#8b5cf6', '#6d28d9'], icon: '🎟️' }
];

offers.forEach(o => {
  fs.writeFileSync(path.join(imgDir, o.file), makeSvg(o.title, o.sub, o.type, o.colors, o.icon));
});

console.log('Successfully generated all fallback SVGs and vector images in assets/images!');
