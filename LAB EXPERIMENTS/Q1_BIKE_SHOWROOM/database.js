/**
 * VELOCITY – SMART BIKE SHOWROOM
 * database.js - Client-Side Persistent Database Layer using localStorage
 * 
 * Manages bikes inventory, customer bookings, test rides, wishlist,
 * reviews, and showroom inquiries with realistic Indian market specs & pricing.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VelocityDB = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEYS = {
    BIKES: 'velocity_bikes_v1',
    BOOKINGS: 'velocity_bookings_v1',
    TEST_RIDES: 'velocity_test_rides_v1',
    WISHLIST: 'velocity_wishlist_v1',
    REVIEWS: 'velocity_reviews_v1',
    INQUIRIES: 'velocity_inquiries_v1'
  };

  // 9 Brands with realistic 4 models each (36 models total)
  const DEFAULT_BIKES = [
    // --- 1. ROYAL ENFIELD ---
    {
      id: 're-classic-350',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      category: 'Cruiser',
      price: 193080,
      engine: '349 cc',
      engineValue: 349,
      mileage: '36.2 kmpl',
      mileageValue: 36.2,
      power: '20.2 bhp @ 6100 rpm',
      torque: '27 Nm @ 4000 rpm',
      transmission: '5-Speed Manual',
      fuelType: 'Petrol (E20 Ready)',
      fuelCapacity: '13 Litres',
      kerbWeight: '195 kg',
      topSpeed: '115 km/h',
      brakes: 'Dual Channel ABS (300mm front, 270mm rear disc)',
      colors: [
        { name: 'Halcyon Green', hex: '#2b5329' },
        { name: 'Signals Marsh Grey', hex: '#5b5d50' },
        { name: 'Dark Stealth Black', hex: '#1e1e1e' },
        { name: 'Chrome Bronze', hex: '#8c6239' }
      ],
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'Timeless Classic Elegance with J-Series Smoothness',
      description: 'The All-New Royal Enfield Classic 350 embodies the traditions of the past, now modernised with the refined J-series engine, dual-channel ABS, and USB mobile charging port.'
    },
    {
      id: 're-hunter-350',
      brand: 'Royal Enfield',
      model: 'Hunter 350',
      category: 'Roadster',
      price: 149900,
      engine: '349.34 cc',
      engineValue: 349.34,
      mileage: '38.0 kmpl',
      mileageValue: 38.0,
      power: '20.2 bhp @ 6100 rpm',
      torque: '27 Nm @ 4000 rpm',
      transmission: '5-Speed Manual',
      fuelType: 'Petrol (E20 Ready)',
      fuelCapacity: '13 Litres',
      kerbWeight: '181 kg',
      topSpeed: '114 km/h',
      brakes: 'Dual Channel ABS with 300mm Front Disc',
      colors: [
        { name: 'Dapper White', hex: '#f0f0f0' },
        { name: 'Rebel Blue', hex: '#1b6ca8' },
        { name: 'Rebel Red', hex: '#c0392b' },
        { name: 'Factory Black', hex: '#111111' }
      ],
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: true,
      inStock: true,
      tagline: 'A Shot of Pure Motorcycling for City Streets',
      description: 'A nimble, street-friendly roadster built for tight urban maneuvers. With 17-inch alloy wheels, agile chassis geometry, and throaty exhaust beat.'
    },
    {
      id: 're-gt-650',
      brand: 'Royal Enfield',
      model: 'Continental GT 650',
      category: 'Cafe Racer',
      price: 319000,
      engine: '648 cc',
      engineValue: 648,
      mileage: '25.0 kmpl',
      mileageValue: 25.0,
      power: '47 bhp @ 7250 rpm',
      torque: '52 Nm @ 5250 rpm',
      transmission: '6-Speed with Assist & Slipper Clutch',
      fuelType: 'Petrol (E20 Ready)',
      fuelCapacity: '12.5 Litres',
      kerbWeight: '211 kg',
      topSpeed: '165 km/h',
      brakes: 'Brembo ByBre Twin-Piston ABS Discs',
      colors: [
        { name: 'Apex Grey', hex: '#7f8c8d' },
        { name: 'Slipstream Blue', hex: '#2980b9' },
        { name: 'Mr Clean (Chrome)', hex: '#d5d8dc' },
        { name: 'Rocker Red', hex: '#e74c3c' }
      ],
      image: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: false,
      latest: false,
      inStock: true,
      tagline: 'Ton-Up Cafe Racer with Twin-Cylinder Roar',
      description: 'Authentic 1960s British cafe racer silhouette paired with a smooth parallel-twin 270-degree crankshaft engine and clip-on handlebars for true enthusiasts.'
    },
    {
      id: 're-himalayan-450',
      brand: 'Royal Enfield',
      model: 'Himalayan 450',
      category: 'Adventure',
      price: 285000,
      engine: '452 cc',
      engineValue: 452,
      mileage: '30.0 kmpl',
      mileageValue: 30.0,
      power: '40 bhp @ 8000 rpm',
      torque: '40 Nm @ 5500 rpm',
      transmission: '6-Speed with Slip and Assist Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '17 Litres',
      kerbWeight: '196 kg',
      topSpeed: '150 km/h',
      brakes: 'Switchable Rear Dual Channel ABS, ByBre Discs',
      colors: [
        { name: 'Hanle Black', hex: '#222222' },
        { name: 'Kamet White', hex: '#ecf0f1' },
        { name: 'Slate Himalayan Salt', hex: '#d98880' }
      ],
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: true,
      inStock: true,
      tagline: 'Built for All Roads. Built for No Roads.',
      description: 'Powered by the all-new Sherpa 450 liquid-cooled DOHC motor. Features ride-by-wire, full TFT Tripper-dash with Google Maps integration, and 230mm ground clearance.'
    },

    // --- 2. YAMAHA ---
    {
      id: 'yamaha-r15-v4',
      brand: 'Yamaha',
      model: 'YZF R15 V4',
      category: 'Sports',
      price: 182300,
      engine: '155 cc',
      engineValue: 155,
      mileage: '45.0 kmpl',
      mileageValue: 45.0,
      power: '18.4 bhp @ 10000 rpm',
      torque: '14.2 Nm @ 7500 rpm',
      transmission: '6-Speed with Quick Shifter & Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '11 Litres',
      kerbWeight: '141 kg',
      topSpeed: '140 km/h',
      brakes: 'Dual Channel ABS with Traction Control System (TCS)',
      colors: [
        { name: 'Racing Blue', hex: '#002fa7' },
        { name: 'Metallic Red', hex: '#a93226' },
        { name: 'Dark Knight', hex: '#1c1c1c' },
        { name: 'Intensity White', hex: '#fdfefe' }
      ],
      image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'Pure R-DNA Supersport Engineered for Track & Street',
      description: 'Equipped with Variable Valve Actuation (VVA), Upside-Down (USD) front forks, Quick Shifter, and Y-Connect smartphone Bluetooth telemetry.'
    },
    {
      id: 'yamaha-mt-15-v2',
      brand: 'Yamaha',
      model: 'MT-15 V2',
      category: 'Naked Street',
      price: 168000,
      engine: '155 cc',
      engineValue: 155,
      mileage: '47.5 kmpl',
      mileageValue: 47.5,
      power: '18.4 bhp @ 10000 rpm',
      torque: '14.1 Nm @ 7500 rpm',
      transmission: '6-Speed with Assist & Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '10 Litres',
      kerbWeight: '141 kg',
      topSpeed: '130 km/h',
      brakes: 'Dual Channel ABS with Traction Control',
      colors: [
        { name: 'Cyan Storm', hex: '#00bcd4' },
        { name: 'Ice Fluo-Vermillion', hex: '#ff5722' },
        { name: 'Metallic Black', hex: '#121212' },
        { name: 'Racing Blue', hex: '#0d47a1' }
      ],
      image: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: true,
      inStock: true,
      tagline: 'The Dark Side of Japan with Explosive Agility',
      description: 'Hyper-naked styling featuring aggressive twin-eye LED headlights, DeltaBox frame rigidity, golden upside-down forks, and punchy low-end torque.'
    },
    {
      id: 'yamaha-fzs-v4',
      brand: 'Yamaha',
      model: 'FZ-S FI V4 Deluxe',
      category: 'Commuter Sports',
      price: 129700,
      engine: '149 cc',
      engineValue: 149,
      mileage: '53.0 kmpl',
      mileageValue: 53.0,
      power: '12.4 bhp @ 7250 rpm',
      torque: '13.3 Nm @ 5500 rpm',
      transmission: '5-Speed Constant Mesh',
      fuelType: 'Petrol (E20 Compliant)',
      fuelCapacity: '13 Litres',
      kerbWeight: '136 kg',
      topSpeed: '112 km/h',
      brakes: 'Single Channel Front ABS + Rear Disc',
      colors: [
        { name: 'Majesty Red', hex: '#922b21' },
        { name: 'Racing Blue', hex: '#1f618d' },
        { name: 'Matte Grey', hex: '#566573' }
      ],
      image: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: false,
      latest: false,
      inStock: true,
      tagline: 'Lord of the Streets with Unmatched Fuel Efficiency',
      description: 'The definitive daily street fighter with Blue Core EFI technology, Class-D LED headlight, Traction Control System, and plush single-piece seat comfort.'
    },
    {
      id: 'yamaha-aerox-155',
      brand: 'Yamaha',
      model: 'Aerox 155',
      category: 'Maxi Scooter',
      price: 147800,
      engine: '155 cc',
      engineValue: 155,
      mileage: '40.0 kmpl',
      mileageValue: 40.0,
      power: '15.0 bhp @ 8000 rpm',
      torque: '13.9 Nm @ 6500 rpm',
      transmission: 'V-Belt Automatic CVT',
      fuelType: 'Petrol',
      fuelCapacity: '5.5 Litres',
      kerbWeight: '126 kg',
      topSpeed: '120 km/h',
      brakes: 'Single Channel ABS, Front Disc, Rear Drum',
      colors: [
        { name: 'Metallic Black', hex: '#111111' },
        { name: 'Grey Vermillion', hex: '#e64a19' },
        { name: 'Monster Energy MotoGP Edition', hex: '#1b4f72' }
      ],
      image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: true,
      inStock: true,
      tagline: 'The Heart of an R15 in a Maxi Sports Body',
      description: 'India\'s fastest performance maxi-scooter with the liquid-cooled 155cc VVA engine, external fuel lid, 24.5-litre underseat storage, and 14-inch wide alloy wheels.'
    },

    // --- 3. KTM ---
    {
      id: 'ktm-duke-390',
      brand: 'KTM',
      model: '390 Duke (Gen 3)',
      category: 'Naked Street',
      price: 310520,
      engine: '398.7 cc',
      engineValue: 398.7,
      mileage: '28.5 kmpl',
      mileageValue: 28.5,
      power: '45.3 bhp @ 8500 rpm',
      torque: '39 Nm @ 6500 rpm',
      transmission: '6-Speed with Bi-Directional Quickshifter+',
      fuelType: 'Petrol',
      fuelCapacity: '15 Litres',
      kerbWeight: '168 kg',
      topSpeed: '170 km/h',
      brakes: 'Cornering ABS + Supermoto ABS (320mm Front Radial)',
      colors: [
        { name: 'Electronic Orange Metallic', hex: '#ff6600' },
        { name: 'Atlantic Blue', hex: '#0f4c81' }
      ],
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: true,
      inStock: true,
      tagline: 'The Corner Rocket – Completely Recharged with Launch Control',
      description: 'The Gen-3 390 Duke brings an all-new LC4c 399cc engine, WP APEX adjustable suspension (compression and rebound), Launch Control, 5-inch TFT display, and Cornering MTC.'
    },
    {
      id: 'ktm-rc-390',
      brand: 'KTM',
      model: 'RC 390 GP',
      category: 'Track Supersport',
      price: 318000,
      engine: '373.2 cc',
      engineValue: 373.2,
      mileage: '26.0 kmpl',
      mileageValue: 26.0,
      power: '43.5 bhp @ 9000 rpm',
      torque: '37 Nm @ 7000 rpm',
      transmission: '6-Speed with PASC Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '13.7 Litres',
      kerbWeight: '172 kg',
      topSpeed: '175 km/h',
      brakes: 'Bosch 9.1MP Dual-Channel (Cornering & Supermoto ABS)',
      colors: [
        { name: 'KTM Factory Racing GP Orange', hex: '#ff5500' },
        { name: 'Ceramic White & Black', hex: '#ffffff' }
      ],
      image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: false,
      latest: false,
      inStock: true,
      tagline: 'Track Precision Born Straight from MotoGP Heritage',
      description: 'Grand Prix aero-inspired fairing, bionic frame weight reduction, adjustable clip-on ergonomics, folded-in mirrors, and relentless top-end racing thrill.'
    },
    {
      id: 'ktm-duke-250',
      brand: 'KTM',
      model: '250 Duke',
      category: 'Naked Street',
      price: 239000,
      engine: '249 cc',
      engineValue: 249,
      mileage: '32.0 kmpl',
      mileageValue: 32.0,
      power: '31 bhp @ 9250 rpm',
      torque: '25 Nm @ 7250 rpm',
      transmission: '6-Speed with Assist & Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '15 Litres',
      kerbWeight: '163 kg',
      topSpeed: '148 km/h',
      brakes: 'Dual Channel ABS with Supermoto Mode',
      colors: [
        { name: 'Ceramic White', hex: '#ecf0f1' },
        { name: 'Electronic Orange', hex: '#ff6700' }
      ],
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'The Ultimate Quarter-Litre Street Brawler',
      description: 'The sweet spot of performance and daily usability. Aggressive insectoid LED headlamp, beefy trellis subframe, and crisp throttle response.'
    },
    {
      id: 'ktm-adv-390',
      brand: 'KTM',
      model: '390 Adventure SW (Spoke Wheels)',
      category: 'Adventure Tourer',
      price: 360000,
      engine: '373.2 cc',
      engineValue: 373.2,
      mileage: '28.0 kmpl',
      mileageValue: 28.0,
      power: '43.5 bhp @ 9000 rpm',
      torque: '37 Nm @ 7000 rpm',
      transmission: '6-Speed with Quickshifter+',
      fuelType: 'Petrol',
      fuelCapacity: '14.5 Litres',
      kerbWeight: '177 kg',
      topSpeed: '160 km/h',
      brakes: 'Off-Road ABS with Traction Control Modes',
      colors: [
        { name: 'Rally Orange & Black', hex: '#ff5722' },
        { name: 'Dark Galvano Grey', hex: '#37474f' }
      ],
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: false,
      latest: true,
      inStock: true,
      tagline: 'Dakar Winning DNA Ready for Intercontinental Odysseys',
      description: 'Featuring heavy-duty anodized black spoked wheels (19-inch front), WP APEX adjustable suspension, off-road riding modes, and tall touring windshield.'
    },

    // --- 4. TVS ---
    {
      id: 'tvs-rr310',
      brand: 'TVS',
      model: 'Apache RR 310',
      category: 'Super-Premium Sports',
      price: 272000,
      engine: '312.2 cc',
      engineValue: 312.2,
      mileage: '33.1 kmpl',
      mileageValue: 33.1,
      power: '34 bhp @ 9700 rpm',
      torque: '27.3 Nm @ 7700 rpm',
      transmission: '6-Speed with RT-Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '11 Litres',
      kerbWeight: '174 kg',
      topSpeed: '160 km/h',
      brakes: 'Dual Channel ABS with 4 Riding Modes (Track, Sport, Urban, Rain)',
      colors: [
        { name: 'Racing Red', hex: '#d32f2f' },
        { name: 'Titanium Black', hex: '#212121' }
      ],
      image: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'Crafted in the Wind Tunnel – Race-Tuned Telemetry',
      description: 'Co-developed with BMW Motorrad. Features reverse-inclined DOHC engine, 5-inch vertical SmartXonnect TFT cluster, and Bi-LED twin projector headlamps.'
    },
    {
      id: 'tvs-rtr-200',
      brand: 'TVS',
      model: 'Apache RTR 200 4V',
      category: 'Street Fighter',
      price: 146800,
      engine: '197.75 cc',
      engineValue: 197.75,
      mileage: '39.0 kmpl',
      mileageValue: 39.0,
      power: '20.82 bhp @ 9000 rpm',
      torque: '17.25 Nm @ 7250 rpm',
      transmission: '5-Speed with A-RT Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '12 Litres',
      kerbWeight: '152 kg',
      topSpeed: '127 km/h',
      brakes: 'Dual Channel ABS with RLP (Rear Lift-Off Protection)',
      colors: [
        { name: 'Gloss Black', hex: '#0a0a0a' },
        { name: 'Pearl White', hex: '#ffffff' },
        { name: 'Matte Blue', hex: '#1565c0' }
      ],
      image: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'Segment-First Adjustable Showa Front Suspension',
      description: 'First in segment with Showa preload-adjustable front suspension, adjustable brake/clutch levers, 3 riding modes, and SmartXonnect Bluetooth navigation.'
    },
    {
      id: 'tvs-ronin',
      brand: 'TVS',
      model: 'Ronin 225',
      category: 'Modern Retro Cruiser',
      price: 149000,
      engine: '225.9 cc',
      engineValue: 225.9,
      mileage: '42.0 kmpl',
      mileageValue: 42.0,
      power: '20.4 bhp @ 7750 rpm',
      torque: '19.93 Nm @ 3750 rpm',
      transmission: '5-Speed Assist & Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '14 Litres',
      kerbWeight: '160 kg',
      topSpeed: '120 km/h',
      brakes: 'Dual Channel ABS with Urban & Rain Modes',
      colors: [
        { name: 'Magma Red', hex: '#b71c1c' },
        { name: 'Lightning Black', hex: '#111111' },
        { name: 'Delta Blue', hex: '#283593' }
      ],
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: false,
      latest: true,
      inStock: true,
      tagline: 'Unscripted Life – Ride Anywhere with Low-End Grunt',
      description: 'Gold-finish USD forks, signature T-face LED light, offset asymmetrical speedometer, integrated starter generator (ISG), and Glide-Through Technology (GTT).'
    },
    {
      id: 'tvs-raider-125',
      brand: 'TVS',
      model: 'Raider 125',
      category: 'Commuter Naked',
      price: 95219,
      engine: '124.8 cc',
      engineValue: 124.8,
      mileage: '65.0 kmpl',
      mileageValue: 65.0,
      power: '11.38 bhp @ 7500 rpm',
      torque: '11.2 Nm @ 6000 rpm',
      transmission: '5-Speed Manual',
      fuelType: 'Petrol',
      fuelCapacity: '10 Litres',
      kerbWeight: '123 kg',
      topSpeed: '99 km/h',
      brakes: 'Synchronized Braking Technology (SBT) Front Disc',
      colors: [
        { name: 'Fiery Yellow', hex: '#fbc02d' },
        { name: 'Blazing Blue', hex: '#1976d2' },
        { name: 'Wicked Black', hex: '#212121' },
        { name: 'Striking Red', hex: '#c62828' }
      ],
      image: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: true,
      inStock: true,
      tagline: 'The Wicked 125cc Sensation with Reverse LCD Cluster',
      description: 'India\'s most stylish sporty 125cc motorcycle with Eco/Power ride modes, underseat storage compartment, animated colour TFT display, and animalistic headlamp.'
    },

    // --- 5. BAJAJ ---
    {
      id: 'bajaj-pulsar-ns400z',
      brand: 'Bajaj',
      model: 'Pulsar NS400Z',
      category: 'Hyper Naked',
      price: 185000,
      engine: '373 cc',
      engineValue: 373,
      mileage: '28.0 kmpl',
      mileageValue: 28.0,
      power: '40 bhp @ 8800 rpm',
      torque: '35 Nm @ 6500 rpm',
      transmission: '6-Speed with Assist and Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '12 Litres',
      kerbWeight: '174 kg',
      topSpeed: '154 km/h',
      brakes: 'Dual Channel ABS with 4 Modes (Road, Rain, Sport, Off-Road)',
      colors: [
        { name: 'Brooklyn Black', hex: '#121212' },
        { name: 'Pearl Metallic White', hex: '#f5f5f5' },
        { name: 'Glossy Racing Red', hex: '#d32f2f' },
        { name: 'Pewter Grey', hex: '#616161' }
      ],
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: true,
      inStock: true,
      tagline: 'The Biggest Pulsar Ever – 40 BHP of Pure Adrenaline',
      description: 'Liquid-cooled 373cc engine, 43mm gold USD forks, switchable traction control, turn-by-turn navigation on color LCD display, and aggressive streetfighter stance.'
    },
    {
      id: 'bajaj-dominar-400',
      brand: 'Bajaj',
      model: 'Dominar 400 Touring',
      category: 'Sports Tourer',
      price: 232000,
      engine: '373.3 cc',
      engineValue: 373.3,
      mileage: '27.0 kmpl',
      mileageValue: 27.0,
      power: '40 bhp @ 8800 rpm',
      torque: '35 Nm @ 6500 rpm',
      transmission: '6-Speed with Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '13 Litres',
      kerbWeight: '193 kg',
      topSpeed: '155 km/h',
      brakes: 'Twin Channel ABS with 320mm Front Disc',
      colors: [
        { name: 'Aurora Green', hex: '#2e7d32' },
        { name: 'Charcoal Black', hex: '#263238' }
      ],
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'Born to Sprint and Built to Tour Miles Non-Stop',
      description: 'Factory-fitted touring accessories including tall windscreen, engine bash plate, navigation stay, handguards, and sturdy rear luggage carrier.'
    },
    {
      id: 'bajaj-pulsar-rs200',
      brand: 'Bajaj',
      model: 'Pulsar RS200',
      category: 'Faired Sports',
      price: 173000,
      engine: '199.5 cc',
      engineValue: 199.5,
      mileage: '35.0 kmpl',
      mileageValue: 35.0,
      power: '24.5 bhp @ 9750 rpm',
      torque: '18.7 Nm @ 8000 rpm',
      transmission: '6-Speed Constant Mesh',
      fuelType: 'Petrol',
      fuelCapacity: '13 Litres',
      kerbWeight: '166 kg',
      topSpeed: '141 km/h',
      brakes: 'Dual Channel ABS with 300mm Front Disc',
      colors: [
        { name: 'Burnt Red', hex: '#b71c1c' },
        { name: 'Pewter Grey', hex: '#455a64' },
        { name: 'White Silver', hex: '#e0e0e0' }
      ],
      image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: false,
      latest: false,
      inStock: true,
      tagline: 'The Fastest Pulsar Aerodynamic Beast',
      description: 'Triple spark 4-valve DTS-i liquid-cooled engine, aerodynamic full fairing, crystal LED tail lights, and aggressive projector headlights.'
    },
    {
      id: 'bajaj-avenger-220',
      brand: 'Bajaj',
      model: 'Avenger Cruise 220',
      category: 'Cruiser',
      price: 144500,
      engine: '220 cc',
      engineValue: 220,
      mileage: '40.0 kmpl',
      mileageValue: 40.0,
      power: '19.03 bhp @ 8500 rpm',
      torque: '17.55 Nm @ 7000 rpm',
      transmission: '5-Speed Manual',
      fuelType: 'Petrol',
      fuelCapacity: '13 Litres',
      kerbWeight: '163 kg',
      topSpeed: '120 km/h',
      brakes: 'Single Channel Front ABS (280mm Disc)',
      colors: [
        { name: 'Auburn Black', hex: '#1a1a1a' },
        { name: 'Moon White', hex: '#fafafa' }
      ],
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: false,
      latest: false,
      inStock: true,
      tagline: 'Feel Like God – Laid Back Highway Cruising',
      description: 'Low-slung relaxed seat, tall highway windshield, cushioned pillion backrest, chrome-drenched classic mirrors, and oil-cooled DTS-i engine.'
    },

    // --- 6. HONDA ---
    {
      id: 'honda-cb350-hness',
      brand: 'Honda',
      model: 'CB350 H\'ness',
      category: 'Modern Classic',
      price: 209857,
      engine: '348.36 cc',
      engineValue: 348.36,
      mileage: '38.5 kmpl',
      mileageValue: 38.5,
      power: '21 bhp @ 5500 rpm',
      torque: '30 Nm @ 3000 rpm',
      transmission: '5-Speed with Assist & Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '15 Litres',
      kerbWeight: '181 kg',
      topSpeed: '125 km/h',
      brakes: 'Dual Channel ABS + Honda Selectable Torque Control (HSTC)',
      colors: [
        { name: 'Precious Red Metallic', hex: '#990000' },
        { name: 'Matte Marshall Green Metallic', hex: '#334d3b' },
        { name: 'Pearl Nightstar Black', hex: '#0f0f0f' }
      ],
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'The Royal Roar – Legendary Japanese Craftsmanship',
      description: 'Whisper-smooth counterbalanced engine with signature bass-heavy thump, full LED lights, Honda Smartphone Voice Control system (HSVCS), and hazard switch.'
    },
    {
      id: 'honda-cb300r',
      brand: 'Honda',
      model: 'CB300R Neo Sports Cafe',
      category: 'Neo Sports Cafe',
      price: 240000,
      engine: '286 cc',
      engineValue: 286,
      mileage: '30.0 kmpl',
      mileageValue: 30.0,
      power: '31.1 bhp @ 9000 rpm',
      torque: '27.5 Nm @ 7500 rpm',
      transmission: '6-Speed with Assist Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '9.7 Litres',
      kerbWeight: '146 kg',
      topSpeed: '150 km/h',
      brakes: 'Dual Channel ABS with IMU (Inertial Measurement Unit)',
      colors: [
        { name: 'Matte Steel Black Metallic', hex: '#212121' },
        { name: 'Pearl Spartan Red', hex: '#d32f2f' }
      ],
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: false,
      latest: true,
      inStock: true,
      tagline: 'Featherweight Fighter with Superbike-Grade IMU Chassis',
      description: 'Weighing an astonishing 146 kg with 31.1 bhp, featuring Showa Separate Function Big Piston (SFF-BP) USD forks and circular LED headlamp.'
    },
    {
      id: 'honda-cbr-650r',
      brand: 'Honda',
      model: 'CBR 650R (Inline-4)',
      category: 'Supersport Tourer',
      price: 935000,
      engine: '648.72 cc',
      engineValue: 648.72,
      mileage: '20.4 kmpl',
      mileageValue: 20.4,
      power: '87.0 bhp @ 12000 rpm',
      torque: '57.5 Nm @ 8500 rpm',
      transmission: '6-Speed with Honda E-Clutch Technology',
      fuelType: 'Petrol (Premium 95 Octane)',
      fuelCapacity: '15.4 Litres',
      kerbWeight: '211 kg',
      topSpeed: '220 km/h',
      brakes: 'Dual 310mm Floating Discs with Radial 4-Piston Nissin Calipers, ABS',
      colors: [
        { name: 'Grand Prix Red', hex: '#d50000' },
        { name: 'Matte Gunpowder Black Metallic', hex: '#2c3e50' }
      ],
      image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: false,
      latest: true,
      inStock: true,
      tagline: 'Screaming 4-Cylinder Symphony for Discerning Riders',
      description: 'The definitive inline-four cylinder middleweight supersport with intoxicating exhaust howl, Honda Selectable Torque Control (HSTC), and full 5-inch TFT connectivity.'
    },
    {
      id: 'honda-hornet-20',
      brand: 'Honda',
      model: 'Hornet 2.0',
      category: 'Street Naked',
      price: 139000,
      engine: '184.4 cc',
      engineValue: 184.4,
      mileage: '45.0 kmpl',
      mileageValue: 45.0,
      power: '17.26 bhp @ 8500 rpm',
      torque: '16.1 Nm @ 6000 rpm',
      transmission: '5-Speed Manual',
      fuelType: 'Petrol',
      fuelCapacity: '12 Litres',
      kerbWeight: '142 kg',
      topSpeed: '122 km/h',
      brakes: 'Single Channel ABS, Dual Petal Discs',
      colors: [
        { name: 'Pearl Igneous Black', hex: '#111111' },
        { name: 'Matte Sangria Red Metallic', hex: '#880e4f' },
        { name: 'Matte Marvel Blue', hex: '#0d47a1' }
      ],
      image: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'Fly Against the Wind with Golden USD Forks',
      description: 'Featuring distinctive X-shaped LED tail light, golden front upside-down suspension, assist slipper clutch, and wide 140-section rear radial tyre.'
    },

    // --- 7. SUZUKI ---
    {
      id: 'suzuki-hayabusa',
      brand: 'Suzuki',
      model: 'Hayabusa GSX1300R',
      category: 'Hypersport Legend',
      price: 1690000,
      engine: '1340 cc',
      engineValue: 1340,
      mileage: '14.0 kmpl',
      mileageValue: 14.0,
      power: '190 bhp @ 9700 rpm',
      torque: '150 Nm @ 7000 rpm',
      transmission: '6-Speed with Bi-Directional Quickshifter',
      fuelType: 'Petrol (High Octane)',
      fuelCapacity: '20 Litres',
      kerbWeight: '266 kg',
      topSpeed: '299 km/h (Electronically Limited)',
      brakes: 'Brembo Stylema Calipers with Cornering ABS & Motion Track System',
      colors: [
        { name: 'Metallic Thunder Gray / Candy Daring Red', hex: '#424242' },
        { name: 'Metallic Matte Black No. 2 / Glass Sparkle Black', hex: '#111111' },
        { name: 'Pearl Brilliant White / Metallic Matte Stellar Blue', hex: '#ffffff' }
      ],
      image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'The Ultimate Peregrine Falcon – Sovereign of Aerodynamic Speed',
      description: 'The pinnacle of high-velocity grand touring. Equipped with Suzuki Intelligent Ride System (S.I.R.S.), 6-axis IMU, Launch Control, Anti-Lift System, and iconic wind-tunnel aero.'
    },
    {
      id: 'suzuki-vstrom-sx-250',
      brand: 'Suzuki',
      model: 'V-Strom SX 250',
      category: 'Sports Adventure Tourer',
      price: 211600,
      engine: '249 cc',
      engineValue: 249,
      mileage: '36.0 kmpl',
      mileageValue: 36.0,
      power: '26.5 bhp @ 9300 rpm',
      torque: '22.2 Nm @ 7300 rpm',
      transmission: '6-Speed Constant Mesh',
      fuelType: 'Petrol',
      fuelCapacity: '12 Litres',
      kerbWeight: '167 kg',
      topSpeed: '138 km/h',
      brakes: 'Dual Channel ABS (300mm Front, 240mm Rear)',
      colors: [
        { name: 'Champion Yellow No. 2', hex: '#fdd835' },
        { name: 'Pearl Glacier White', hex: '#f5f5f5' },
        { name: 'Glass Sparkle Black', hex: '#1c1c1c' }
      ],
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: true,
      inStock: true,
      tagline: 'Master of All Terrains – Oil-Cooled Masterpiece',
      description: 'Inherits iconic DR-Z and DR-BIG adventure styling beak, Suzuki Oil Cooling System (SOCS), 205mm ground clearance, tall touring windscreen, and USB charger.'
    },
    {
      id: 'suzuki-gixxer-sf-250',
      brand: 'Suzuki',
      model: 'Gixxer SF 250',
      category: 'Sports Tourer',
      price: 192100,
      engine: '249 cc',
      engineValue: 249,
      mileage: '38.0 kmpl',
      mileageValue: 38.0,
      power: '26.5 bhp @ 9300 rpm',
      torque: '22.2 Nm @ 7300 rpm',
      transmission: '6-Speed Manual',
      fuelType: 'Petrol',
      fuelCapacity: '12 Litres',
      kerbWeight: '161 kg',
      topSpeed: '150 km/h',
      brakes: 'Dual Channel ABS with ByBre Discs',
      colors: [
        { name: 'Metallic Triton Blue (MotoGP Edition)', hex: '#0277bd' },
        { name: 'Matte Black', hex: '#212121' }
      ],
      image: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: false,
      latest: false,
      inStock: true,
      tagline: 'Track-Inspired Aerodynamics with Featherlight Agility',
      description: 'Aerodynamic full fairing tested for stability at high speeds, clip-on handlebars, LED headlight, brushed alloy wheel accents, and Suzuki Ride Connect.'
    },
    {
      id: 'suzuki-access-125',
      brand: 'Suzuki',
      model: 'Access 125 Ride Connect',
      category: 'Executive Scooter',
      price: 89500,
      engine: '124 cc',
      engineValue: 124,
      mileage: '52.4 kmpl',
      mileageValue: 52.4,
      power: '8.7 bhp @ 6750 rpm',
      torque: '10 Nm @ 5500 rpm',
      transmission: 'Automatic CVT',
      fuelType: 'Petrol (E20 Compliant)',
      fuelCapacity: '5 Litres',
      kerbWeight: '103 kg',
      topSpeed: '92 km/h',
      brakes: 'Combined Braking System (CBS) with Front Disc',
      colors: [
        { name: 'Metallic Matte Black', hex: '#1c1c1c' },
        { name: 'Solid Ice Green', hex: '#80cbc4' },
        { name: 'Pearl Mirage White', hex: '#ffffff' }
      ],
      image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'Kam Peeta Hai – India\'s Most Trusted 125cc Commuter',
      description: 'Bluetooth-enabled digital display with Turn-by-Turn navigation, call/SMS alerts, external fuel cap, chrome retro bezel, and ultra-comfortable broad seat.'
    },

    // --- 8. KAWASAKI ---
    {
      id: 'kawasaki-zx10r',
      brand: 'Kawasaki',
      model: 'Ninja ZX-10R',
      category: 'Liter-Class Superbike',
      price: 1679000,
      engine: '998 cc',
      engineValue: 998,
      mileage: '12.0 kmpl',
      mileageValue: 12.0,
      power: '203 bhp @ 13200 rpm (213 bhp with Ram-Air)',
      torque: '114.9 Nm @ 11400 rpm',
      transmission: '6-Speed Cassette with KQS (Kawasaki Quick Shifter)',
      fuelType: 'Petrol (95+ Octane)',
      fuelCapacity: '17 Litres',
      kerbWeight: '207 kg',
      topSpeed: '299 km/h',
      brakes: 'Brembo M50 Monobloc Radial Calipers, Dual 330mm Discs',
      colors: [
        { name: 'Lime Green / Ebony (KRT Edition)', hex: '#76ff03' },
        { name: 'Metallic Graphite Gray', hex: '#424242' }
      ],
      image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: false,
      inStock: true,
      tagline: '6-Time World Superbike Champion – Uncompromising Circuit Dominance',
      description: 'Engineered with WorldSBK technology: integrated aerodynamic winglets delivering 17% more downforce, electronic cruise control, 4.3-inch all-digital TFT color instrumentation, and Launch Control.'
    },
    {
      id: 'kawasaki-ninja-400',
      brand: 'Kawasaki',
      model: 'Ninja 400',
      category: 'Supersport',
      price: 524000,
      engine: '399 cc',
      engineValue: 399,
      mileage: '24.0 kmpl',
      mileageValue: 24.0,
      power: '45 bhp @ 10000 rpm',
      torque: '37 Nm @ 8000 rpm',
      transmission: '6-Speed with Assist & Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '14 Litres',
      kerbWeight: '168 kg',
      topSpeed: '185 km/h',
      brakes: 'Dual Channel ABS with 310mm Semi-Floating Petal Disc',
      colors: [
        { name: 'Lime Green (Ebony)', hex: '#00e676' },
        { name: 'Metallic Carbon Gray', hex: '#37474f' }
      ],
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'Everyday Supersport Brilliance with Parallel-Twin Punch',
      description: 'Lightweight trellis chassis inspired by the Ninja H2, twin LED headlights, smooth clutch pull, and class-leading power-to-weight ratio for both city commute and track days.'
    },
    {
      id: 'kawasaki-z900',
      brand: 'Kawasaki',
      model: 'Z900 Supernaked',
      category: 'Naked Streetfighter',
      price: 938000,
      engine: '948 cc',
      engineValue: 948,
      mileage: '17.0 kmpl',
      mileageValue: 17.0,
      power: '125 bhp @ 9500 rpm',
      torque: '98.6 Nm @ 7700 rpm',
      transmission: '6-Speed with Assist & Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '17 Litres',
      kerbWeight: '212 kg',
      topSpeed: '240 km/h',
      brakes: 'Dual 300mm Petal Discs, 4-Piston Opposed Calipers, ABS',
      colors: [
        { name: 'Metallic Spark Black / Metallic Matte Dark Gray', hex: '#212121' },
        { name: 'Candy Persimmon Red', hex: '#c62828' }
      ],
      image: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: false,
      latest: true,
      inStock: true,
      tagline: 'Sugomi Styling Meets In-Line 4 Raw Muscularity',
      description: 'The definitive aggressive street fighter featuring Kawasaki Traction Control (KTRC), selectable Power Modes, Dunlop Sportmax Roadsport 2 tyres, and throat-clearing intake growl.'
    },
    {
      id: 'kawasaki-versys-650',
      brand: 'Kawasaki',
      model: 'Versys 650',
      category: 'Dual-Sport Tourer',
      price: 777000,
      engine: '649 cc',
      engineValue: 649,
      mileage: '21.0 kmpl',
      mileageValue: 21.0,
      power: '66 bhp @ 8500 rpm',
      torque: '61 Nm @ 7000 rpm',
      transmission: '6-Speed Manual',
      fuelType: 'Petrol',
      fuelCapacity: '21 Litres',
      kerbWeight: '219 kg',
      topSpeed: '190 km/h',
      brakes: 'Dual 300mm Petal Discs with Nissin ABS',
      colors: [
        { name: 'Metallic Phantom Silver', hex: '#b0bec5' },
        { name: 'Metallic Flat Spark Black', hex: '#263238' }
      ],
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: false,
      latest: false,
      inStock: true,
      tagline: 'Endless Horizons with Long-Travel Plush Suspension',
      description: 'Long-travel suspension (Showa separate function fork), upright touring posture, 4-way tool-free adjustable windshield, massive 21-litre fuel range, and all-day comfort.'
    },

    // --- 9. BMW MOTORRAD ---
    {
      id: 'bmw-s1000rr',
      brand: 'BMW Motorrad',
      model: 'S 1000 RR M Package',
      category: 'World Championship Superbike',
      price: 2075000,
      engine: '999 cc',
      engineValue: 999,
      mileage: '15.6 kmpl',
      mileageValue: 15.6,
      power: '210 bhp @ 13750 rpm',
      torque: '113 Nm @ 11000 rpm',
      transmission: '6-Speed with Shift Assistant Pro (Bi-directional)',
      fuelType: 'Petrol (Premium 98 RON)',
      fuelCapacity: '16.5 Litres',
      kerbWeight: '197 kg',
      topSpeed: '303 km/h',
      brakes: 'BMW M Calipers, Dual 320mm Discs, Race ABS Pro (Brake Slide Assist)',
      colors: [
        { name: 'Light White / M Motorsport Tri-Color', hex: '#ffffff' },
        { name: 'Black Storm Metallic', hex: '#111111' },
        { name: 'Passion Racing Red', hex: '#b71c1c' }
      ],
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: true,
      inStock: true,
      tagline: '#NeverStopChallenging – The Unrivaled Track Sovereign',
      description: 'Equipped with BMW ShiftCam variable valve timing, carbon composite M winglets providing 17.1 kg of downforce at top speed, Slide Control, and Hill Start Control Pro.'
    },
    {
      id: 'bmw-g310r',
      brand: 'BMW Motorrad',
      model: 'G 310 R',
      category: 'Dynamic Roadster',
      price: 290000,
      engine: '313 cc',
      engineValue: 313,
      mileage: '30.0 kmpl',
      mileageValue: 30.0,
      power: '34 bhp @ 9250 rpm',
      torque: '28 Nm @ 7500 rpm',
      transmission: '6-Speed with Self-Boosting Anti-Hopping Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '11 Litres',
      kerbWeight: '164 kg',
      topSpeed: '143 km/h',
      brakes: 'BMW Motorrad ABS, 300mm 4-Piston Radial Caliper',
      colors: [
        { name: 'Style Passion Racing Red', hex: '#d50000' },
        { name: 'Cosmic Black 2', hex: '#212121' },
        { name: 'Style Sport Polar White / Racing Blue', hex: '#0288d1' }
      ],
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'Pure Urban Agility Infused with Bavarian Precision',
      description: 'Single-cylinder 4-stroke water-cooled reverse cylinder block for optimal weight distribution, upside-down gold fork, ride-by-wire electronic throttle, and adjustable levers.'
    },
    {
      id: 'bmw-g310gs',
      brand: 'BMW Motorrad',
      model: 'G 310 GS Adventure',
      category: 'Compact Adventure',
      price: 330000,
      engine: '313 cc',
      engineValue: 313,
      mileage: '30.0 kmpl',
      mileageValue: 30.0,
      power: '34 bhp @ 9250 rpm',
      torque: '28 Nm @ 7500 rpm',
      transmission: '6-Speed Constant Mesh with Slipper Clutch',
      fuelType: 'Petrol',
      fuelCapacity: '11.5 Litres',
      kerbWeight: '175 kg',
      topSpeed: '143 km/h',
      brakes: 'BMW Motorrad ABS (Disengageable for Off-Road)',
      colors: [
        { name: 'Kalamata Dark Gold Metallic', hex: '#795548' },
        { name: 'Cosmic Black 3', hex: '#1e272c' },
        { name: 'Style Rallye Racing Red', hex: '#e53935' }
      ],
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
      featured: false,
      popular: false,
      latest: false,
      inStock: true,
      tagline: 'Every Day is an Adventure – The Legendary GS Spirit in Compact Form',
      description: 'Iconic GS flyline and beak, 19-inch front wheel, high windshield, rugged rear luggage rack, and high ground clearance tailored for rough trails and city bumps.'
    },
    {
      id: 'bmw-r1250gs',
      brand: 'BMW Motorrad',
      model: 'R 1250 GS Adventure',
      category: 'King of Adventure',
      price: 2250000,
      engine: '1254 cc',
      engineValue: 1254,
      mileage: '21.0 kmpl',
      mileageValue: 21.0,
      power: '136 bhp @ 7750 rpm',
      torque: '143 Nm @ 6250 rpm',
      transmission: '6-Speed Shaft Drive with Anti-Hopping Clutch',
      fuelType: 'Petrol (Premium)',
      fuelCapacity: '30 Litres',
      kerbWeight: '268 kg',
      topSpeed: '200+ km/h',
      brakes: 'BMW Motorrad Integral ABS Pro with Hill Start Control',
      colors: [
        { name: 'Triple Black Storm Metallic', hex: '#111111' },
        { name: 'Ice Grey', hex: '#cfd8dc' },
        { name: 'Style Rallye Light White / Racing Blue', hex: '#1976d2' }
      ],
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
      featured: true,
      popular: true,
      latest: false,
      inStock: true,
      tagline: 'The Globetrotter Icon with 1254cc Boxer Engine and ShiftCam',
      description: 'The world\'s preeminent globe-touring machine. Features boxer twin with BMW ShiftCam technology, 30-litre aluminum tank, dynamic ESA suspension, cross-spoke wheels, and shaft drive durability.'
    }
  ];

  // Sample seed bookings
  const DEFAULT_BOOKINGS = [
    {
      bookingId: 'VEL-BK-2026-7891',
      receiptNo: 'REC-VEL-2026-101',
      customerName: 'Rahul Sharma',
      mobile: '9876543210',
      email: 'rahul.sharma@example.com',
      bikeId: 're-classic-350',
      bikeModel: 'Royal Enfield Classic 350',
      bikeBrand: 'Royal Enfield',
      bikePrice: 193080,
      selectedColor: 'Halcyon Green',
      bookingDate: '2026-11-18',
      preferredDeliveryDate: '2026-12-05',
      bookingAmount: 5000,
      paymentMethod: 'UPI (Google Pay / PhonePe)',
      paymentRef: 'TXN-UPI-98234871',
      paymentStatus: 'Simulated Demo Payment - Successful',
      status: 'Confirmed',
      createdAt: '2026-11-18T10:30:00Z'
    },
    {
      bookingId: 'VEL-BK-2026-8942',
      receiptNo: 'REC-VEL-2026-102',
      customerName: 'Priya Patel',
      mobile: '9823456781',
      email: 'priya.patel@example.com',
      bikeId: 'yamaha-r15-v4',
      bikeModel: 'Yamaha YZF R15 V4',
      bikeBrand: 'Yamaha',
      bikePrice: 182300,
      selectedColor: 'Racing Blue',
      bookingDate: '2026-11-19',
      preferredDeliveryDate: '2026-12-10',
      bookingAmount: 5000,
      paymentMethod: 'Credit/Debit Card',
      paymentRef: 'TXN-CARD-44912089',
      paymentStatus: 'Simulated Demo Payment - Successful',
      status: 'Confirmed',
      createdAt: '2026-11-19T14:15:00Z'
    },
    {
      bookingId: 'VEL-BK-2026-9104',
      receiptNo: 'REC-VEL-2026-103',
      customerName: 'Vikramaditya Verma',
      mobile: '9712398450',
      email: 'vikram.verma@example.com',
      bikeId: 'ktm-duke-390',
      bikeModel: 'KTM 390 Duke (Gen 3)',
      bikeBrand: 'KTM',
      bikePrice: 310520,
      selectedColor: 'Electronic Orange Metallic',
      bookingDate: '2026-11-20',
      preferredDeliveryDate: '2026-12-15',
      bookingAmount: 10000,
      paymentMethod: 'Cash at Showroom',
      paymentRef: 'TXN-CASH-77124901',
      paymentStatus: 'Token Verified at Counter',
      status: 'Pending Verification',
      createdAt: '2026-11-20T08:45:00Z'
    }
  ];

  // Sample seed test rides
  const DEFAULT_TEST_RIDES = [
    {
      testRideId: 'VEL-TR-2026-5501',
      customerName: 'Arjun Nambiar',
      mobile: '9945123456',
      email: 'arjun.n@example.com',
      bikeId: 'bmw-s1000rr',
      bikeModel: 'BMW S 1000 RR M Package',
      bikeBrand: 'BMW Motorrad',
      preferredDate: '2026-11-22',
      timeSlot: 'Morning (10:00 AM - 12:00 PM)',
      hasLicense: true,
      status: 'Scheduled',
      createdAt: '2026-11-19T11:20:00Z'
    },
    {
      testRideId: 'VEL-TR-2026-5502',
      customerName: 'Ananya Deshmukh',
      mobile: '9867012345',
      email: 'ananya.d@example.com',
      bikeId: 'tvs-rr310',
      bikeModel: 'TVS Apache RR 310',
      bikeBrand: 'TVS',
      preferredDate: '2026-11-23',
      timeSlot: 'Afternoon (02:00 PM - 04:00 PM)',
      hasLicense: true,
      status: 'Completed',
      createdAt: '2026-11-18T16:00:00Z'
    }
  ];

  // Sample reviews
  const DEFAULT_REVIEWS = [
    {
      id: 'rev-001',
      customerName: 'Amitabh Sengupta',
      bikeModel: 'Royal Enfield Continental GT 650',
      rating: 5,
      date: '2026-11-12',
      verifiedBuyer: true,
      comment: 'Velocity Showroom delivered my GT 650 within 4 days of token payment! Seamless documentation and test ride experience. Highly recommended.'
    },
    {
      id: 'rev-002',
      customerName: 'Sneha Kulkarni',
      bikeModel: 'Yamaha MT-15 V2',
      rating: 5,
      date: '2026-11-15',
      verifiedBuyer: true,
      comment: 'The test ride was well organized with safety gear provided. Sales consultants explained all finance and insurance options transparently.'
    },
    {
      id: 'rev-003',
      customerName: 'Karthik Raman',
      bikeModel: 'KTM 390 Duke (Gen 3)',
      rating: 5,
      date: '2026-11-16',
      verifiedBuyer: true,
      comment: 'Rocket of a bike! Velocity gave me the best on-road pricing and complimentary first service pack. Digital receipt and booking was super smooth.'
    },
    {
      id: 'rev-004',
      customerName: 'Rohan Mehra',
      bikeModel: 'Honda CB350 H\'ness',
      rating: 4,
      date: '2026-11-17',
      verifiedBuyer: true,
      comment: 'Super refined engine. Delivery experience was grand with a special key handover ceremony. Very professional staff.'
    }
  ];

  // Sample showroom inquiries
  const DEFAULT_INQUIRIES = [
    {
      id: 'inq-001',
      name: 'Suresh Menon',
      email: 'suresh.m@example.com',
      phone: '9845012399',
      subject: 'Kawasaki Ninja ZX-10R Waiting Period & Accessories',
      message: 'Looking for availability of KRT edition and Akrapovič slip-on exhaust kit.',
      date: '2026-11-19',
      status: 'Responded'
    }
  ];

  // Safe localStorage helper
  function safeGet(key, defaultVal) {
    try {
      const item = localStorage.getItem(key);
      if (item !== null && item !== undefined && item !== '') {
        return JSON.parse(item);
      }
    } catch (e) {
      console.warn('VelocityDB: Failed to read from localStorage:', e);
    }
    return defaultVal;
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('VelocityDB: Failed to write to localStorage:', e);
      return false;
    }
  }

  // Database API
  const VelocityDB = {
    // Initialization: populate seed data if not present
    init: function () {
      if (!localStorage.getItem(STORAGE_KEYS.BIKES)) {
        safeSet(STORAGE_KEYS.BIKES, DEFAULT_BIKES);
      }
      if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        safeSet(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.TEST_RIDES)) {
        safeSet(STORAGE_KEYS.TEST_RIDES, DEFAULT_TEST_RIDES);
      }
      if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
        safeSet(STORAGE_KEYS.WISHLIST, ['re-classic-350', 'yamaha-r15-v4', 'bmw-s1000rr']);
      }
      if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
        safeSet(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
        safeSet(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
      }
      return this;
    },

    // --- BIKES CRUD ---
    getBikes: function () {
      return safeGet(STORAGE_KEYS.BIKES, DEFAULT_BIKES);
    },

    getBikeById: function (id) {
      const bikes = this.getBikes();
      return bikes.find(b => b.id === id) || null;
    },

    getBikesByBrand: function (brandName) {
      const bikes = this.getBikes();
      if (!brandName || brandName === 'All') return bikes;
      return bikes.filter(b => b.brand.toLowerCase() === brandName.toLowerCase());
    },

    getBrandsList: function () {
      return [
        'Royal Enfield',
        'Yamaha',
        'KTM',
        'TVS',
        'Bajaj',
        'Honda',
        'Suzuki',
        'Kawasaki',
        'BMW Motorrad'
      ];
    },

    saveBike: function (bikeData) {
      const bikes = this.getBikes();
      if (!bikeData.id) {
        bikeData.id = 'bike-' + Date.now();
      }
      const index = bikes.findIndex(b => b.id === bikeData.id);
      if (index >= 0) {
        bikes[index] = { ...bikes[index], ...bikeData };
      } else {
        bikes.unshift(bikeData);
      }
      safeSet(STORAGE_KEYS.BIKES, bikes);
      return bikeData;
    },

    deleteBike: function (id) {
      let bikes = this.getBikes();
      bikes = bikes.filter(b => b.id !== id);
      safeSet(STORAGE_KEYS.BIKES, bikes);
      return true;
    },

    toggleBikeAvailability: function (id) {
      const bikes = this.getBikes();
      const bike = bikes.find(b => b.id === id);
      if (bike) {
        bike.inStock = !bike.inStock;
        safeSet(STORAGE_KEYS.BIKES, bikes);
        return bike.inStock;
      }
      return false;
    },

    // --- BOOKINGS ---
    getBookings: function () {
      return safeGet(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    },

    getBookingById: function (id) {
      const bookings = this.getBookings();
      return bookings.find(b => b.bookingId === id || b.receiptNo === id) || null;
    },

    saveBooking: function (data) {
      const bookings = this.getBookings();
      const timestamp = Date.now().toString().slice(-4);
      const bookingId = 'VEL-BK-2026-' + (Math.floor(1000 + Math.random() * 9000));
      const receiptNo = 'REC-VEL-2026-' + timestamp;

      const newBooking = {
        bookingId: bookingId,
        receiptNo: receiptNo,
        customerName: data.customerName,
        mobile: data.mobile,
        email: data.email,
        bikeId: data.bikeId,
        bikeModel: data.bikeModel,
        bikeBrand: data.bikeBrand,
        bikePrice: Number(data.bikePrice) || 0,
        selectedColor: data.selectedColor || 'Standard',
        bookingDate: new Date().toISOString().split('T')[0],
        preferredDeliveryDate: data.preferredDeliveryDate || '',
        bookingAmount: Number(data.bookingAmount) || 5000,
        paymentMethod: data.paymentMethod || 'Simulated UPI',
        paymentRef: data.paymentRef || ('TXN-DEMO-' + Math.floor(100000 + Math.random() * 900000)),
        paymentStatus: 'Simulated Demo Payment - Successful',
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      bookings.unshift(newBooking);
      safeSet(STORAGE_KEYS.BOOKINGS, bookings);
      return newBooking;
    },

    updateBookingStatus: function (bookingId, newStatus) {
      const bookings = this.getBookings();
      const booking = bookings.find(b => b.bookingId === bookingId);
      if (booking) {
        booking.status = newStatus;
        safeSet(STORAGE_KEYS.BOOKINGS, bookings);
        return true;
      }
      return false;
    },

    cancelBooking: function (bookingId) {
      return this.updateBookingStatus(bookingId, 'Cancelled');
    },

    // --- TEST RIDES ---
    getTestRides: function () {
      return safeGet(STORAGE_KEYS.TEST_RIDES, DEFAULT_TEST_RIDES);
    },

    saveTestRide: function (data) {
      const testRides = this.getTestRides();
      const testRideId = 'VEL-TR-2026-' + Math.floor(1000 + Math.random() * 9000);

      const newTestRide = {
        testRideId: testRideId,
        customerName: data.customerName,
        mobile: data.mobile,
        email: data.email,
        bikeId: data.bikeId,
        bikeModel: data.bikeModel,
        bikeBrand: data.bikeBrand,
        preferredDate: data.preferredDate,
        timeSlot: data.timeSlot || 'Morning (10:00 AM - 12:00 PM)',
        hasLicense: !!data.hasLicense,
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      };

      testRides.unshift(newTestRide);
      safeSet(STORAGE_KEYS.TEST_RIDES, testRides);
      return newTestRide;
    },

    updateTestRideStatus: function (id, status) {
      const list = this.getTestRides();
      const item = list.find(t => t.testRideId === id);
      if (item) {
        item.status = status;
        safeSet(STORAGE_KEYS.TEST_RIDES, list);
        return true;
      }
      return false;
    },

    // --- WISHLIST / FAVOURITES ---
    getWishlist: function () {
      return safeGet(STORAGE_KEYS.WISHLIST, []);
    },

    toggleWishlist: function (bikeId) {
      let list = this.getWishlist();
      let added = false;
      if (list.includes(bikeId)) {
        list = list.filter(id => id !== bikeId);
        added = false;
      } else {
        list.push(bikeId);
        added = true;
      }
      safeSet(STORAGE_KEYS.WISHLIST, list);
      return { inWishlist: added, total: list.length };
    },

    isInWishlist: function (bikeId) {
      const list = this.getWishlist();
      return list.includes(bikeId);
    },

    // --- REVIEWS ---
    getReviews: function () {
      return safeGet(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    },

    saveReview: function (data) {
      const reviews = this.getReviews();
      const newReview = {
        id: 'rev-' + Date.now(),
        customerName: data.customerName,
        bikeModel: data.bikeModel || 'General Showroom Experience',
        rating: Math.min(5, Math.max(1, Number(data.rating) || 5)),
        date: new Date().toISOString().split('T')[0],
        verifiedBuyer: !!data.verifiedBuyer,
        comment: data.comment
      };
      reviews.unshift(newReview);
      safeSet(STORAGE_KEYS.REVIEWS, reviews);
      return newReview;
    },

    getAverageRating: function () {
      const reviews = this.getReviews();
      if (!reviews.length) return { average: 5.0, count: 0 };
      const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      return {
        average: (sum / reviews.length).toFixed(1),
        count: reviews.length
      };
    },

    // --- INQUIRIES ---
    getInquiries: function () {
      return safeGet(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
    },

    saveInquiry: function (data) {
      const inquiries = this.getInquiries();
      const newInquiry = {
        id: 'inq-' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject || 'General Inquiry',
        message: data.message,
        date: new Date().toISOString().split('T')[0],
        status: 'Received'
      };
      inquiries.unshift(newInquiry);
      safeSet(STORAGE_KEYS.INQUIRIES, inquiries);
      return newInquiry;
    },

    // --- RESET SYSTEM ---
    resetToDefaults: function () {
      safeSet(STORAGE_KEYS.BIKES, DEFAULT_BIKES);
      safeSet(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
      safeSet(STORAGE_KEYS.TEST_RIDES, DEFAULT_TEST_RIDES);
      safeSet(STORAGE_KEYS.WISHLIST, ['re-classic-350', 'yamaha-r15-v4', 'bmw-s1000rr']);
      safeSet(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
      safeSet(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
      return true;
    },

    // Utility: Format price in Indian Rupee format (e.g. ₹ 1,93,080)
    formatINR: function (amount) {
      const num = Number(amount) || 0;
      return '₹ ' + num.toLocaleString('en-IN');
    }
  };

  // Initialize DB immediately
  VelocityDB.init();

  return VelocityDB;
});
