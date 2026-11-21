/**
 * StreamLearn – Intelligent Video Streaming & Network Buffer Optimization for E-Learning
 * Full-stack interactive JavaScript Engine
 */

// ==========================================================================
// 1. GLOBAL STATE & CONFIGURATION
// ==========================================================================
const StreamLearnState = {
  currentSection: 'home',
  
  // Simulated Network Conditions
  network: {
    preset: 'good',
    downloadBw: 20.0, // Mbps
    uploadBw: 5.2,    // Mbps
    latency: 35,      // ms RTT
    packetLoss: 0.2,  // %
    jitter: 4.2,      // ms
    isUnstable: false,
    fluctuationTimer: null
  },

  // Active Video Player State
  player: {
    currentLectureId: 'lec-cs-301',
    isPlaying: false,
    isBuffering: false,
    simulatedBufferLevel: 18.4, // seconds
    maxBufferSize: 30,          // seconds
    qualityMode: 'auto',        // 'auto' or explicit like '1080p'
    activeQuality: '1080p',
    playbackSpeed: 1.0,
    volume: 0.8,
    isMuted: false,
    isFullscreen: false,
    statsForNerds: false,
    droppedFrames: 0,
    stallsCount: 0,
    totalStallTime: 0,
    simulatedStallTimer: null
  },

  // Interactive Simulator State
  simulator: {
    isRunning: true,
    bandwidth: 20.0, // Mbps
    latency: 35,     // ms
    packetLoss: 0.2, // %
    jitter: 4,       // ms
    targetBufferSize: 30, // s
    requestedQuality: 'auto',
    simBufferLevel: 19.5,
    simPlaybackStatus: 'Playing',
    simStallCount: 0,
    simTotalStallDuration: 0,
    loopInterval: null
  },

  // Buffer Optimization Settings
  bufferOptimization: {
    minBufferThreshold: 2.5, // seconds panic threshold
    maxBufferCapacity: 30.0, // seconds
    initialPrebuffer: 1.5,   // seconds
    recoveryThreshold: 3.0,  // seconds
    engineActive: true,
    naiveBufferLevel: 1.2,
    optBufferLevel: 23.4,
    naiveStalls: 8,
    optStalls: 1
  },

  // Adaptive Bitrate Ladder Specs
  qualityLadder: {
    '1080p': { bitrate: 4500, minBw: 6.0, label: '1080p Full HD (4.5 Mbps)' },
    '720p':  { bitrate: 2500, minBw: 3.0, label: '720p HD (2.5 Mbps)' },
    '480p':  { bitrate: 1200, minBw: 1.5, label: '480p SD (1.2 Mbps)' },
    '360p':  { bitrate: 600,  minBw: 0.8, label: '360p (600 kbps)' },
    '240p':  { bitrate: 300,  minBw: 0.3, label: '240p Low BW (300 kbps)' }
  },

  // Campus Bandwidth Manager
  campus: {
    totalBandwidth: 40.0, // Mbps
    strategy: 'fair',     // 'unmanaged', 'fair', 'priority'
    students: [
      { id: 'st-a', name: 'Student A (Alex)',  course: 'NET 410: TCP Congestion Lab', priority: 'high',   bw: 8.0, quality: '1080p', buffer: 'Optimal (24s)', status: 'Streaming' },
      { id: 'st-b', name: 'Student B (Priya)', course: 'AI 402: Deep Neural Networks', priority: 'normal', bw: 8.0, quality: '1080p', buffer: 'Optimal (21s)', status: 'Streaming' },
      { id: 'st-c', name: 'Student C (Carlos)',course: 'Live Classroom: CS 301',       priority: 'high',   bw: 8.0, quality: '1080p', buffer: 'Optimal (19s)', status: 'Live Sync' },
      { id: 'st-d', name: 'Student D (Mei)',   course: 'MATH 220: Linear Algebra',    priority: 'normal', bw: 8.0, quality: '1080p', buffer: 'Good (16s)',    status: 'Streaming' },
      { id: 'st-e', name: 'Student E (James)', course: 'PROG 250: Asynchronous JS',   priority: 'low',    bw: 8.0, quality: '1080p', buffer: 'Good (15s)',    status: 'Streaming' }
    ]
  },

  // CDN Caching State
  cdn: {
    edgePoP: 'Campus Regional Node (Edge-East)',
    hitRatio: 94.2,
    cachedChunks: 4,
    originLatency: 120,
    edgeLatency: 16
  },

  // ABR Decision History Log
  abrLog: [],

  // User Preferences & Persistence
  preferences: {
    defaultQuality: 'auto',
    dataSaver: false,
    hardwareAccel: true,
    autoPlay: true,
    defaultPreset: 'good',
    showNerdStats: false,
    bookmarks: ['lec-net-410'],
    completedLectures: ['lec-math-220', 'lec-prog-250']
  }
};

// ==========================================================================
// 2. EDUCATIONAL LECTURE DATABASE (12+ SAMPLE LECTURES)
// ==========================================================================
const LECTURES_DATABASE = [
  {
    id: 'lec-cs-301',
    title: 'CS 301: Distributed Systems & Consensus Algorithms',
    instructor: 'Prof. Marcus Vance',
    category: 'Computer Science',
    duration: '48 mins',
    durationSec: 2880,
    gradient: 'thumb-cs',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    qualities: ['1080p', '720p', '480p', '360p', '240p'],
    overview: 'Explore the foundational challenges of building fault-tolerant distributed networks. Covers Paxos and Raft consensus, Byzantine fault tolerance, network partitions under the CAP theorem, and how network latency variations impact replica synchronization.',
    progress: 45
  },
  {
    id: 'lec-ai-402',
    title: 'AI 402: Deep Neural Networks & Backpropagation',
    instructor: 'Dr. Elena Rostova',
    category: 'Artificial Intelligence',
    duration: '52 mins',
    durationSec: 3120,
    gradient: 'thumb-ai',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    qualities: ['1080p', '720p', '480p', '360p'],
    overview: 'Mathematical derivation of multi-layer perceptrons, automatic differentiation, gradient descent optimizers (Adam, RMSProp), and batch normalization mechanics for high-dimensional vision datasets.',
    progress: 80
  },
  {
    id: 'lec-math-220',
    title: 'MATH 220: Linear Algebra & Matrix Transformations',
    instructor: 'Prof. David Thorne',
    category: 'Mathematics',
    duration: '38 mins',
    durationSec: 2280,
    gradient: 'thumb-math',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    qualities: ['1080p', '720p', '480p', '360p', '240p'],
    overview: 'Vector spaces, eigenvalues, eigenvectors, Singular Value Decomposition (SVD), and geometric projections with real-time computational graphics.',
    progress: 100
  },
  {
    id: 'lec-net-410',
    title: 'NET 410: TCP Congestion Control, BBR & Packet Dynamics',
    instructor: 'Dr. Sarah Jenkins',
    category: 'Networking',
    duration: '42 mins',
    durationSec: 2520,
    gradient: 'thumb-net',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    qualities: ['1080p', '720p', '480p', '360p', '240p'],
    overview: 'Deep dive into loss-based congestion algorithms (Cubic, Reno) versus bottleneck bandwidth and round-trip propagation time (BBR) modeling in video streaming pipelines.',
    progress: 65
  },
  {
    id: 'lec-prog-250',
    title: 'PROG 250: Modern Asynchronous JavaScript & Event Loops',
    instructor: 'Devon Patel',
    category: 'Programming',
    duration: '35 mins',
    durationSec: 2100,
    gradient: 'thumb-prog',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    qualities: ['1080p', '720p', '480p'],
    overview: 'Event loops, microtasks vs macrotasks, Promises, async/await internals, and streaming fetch APIs for chunked video media delivery.',
    progress: 100
  },
  {
    id: 'lec-eng-180',
    title: 'ENG 180: Digital Signal Processing & Frequency Analysis',
    instructor: 'Dr. Kenneth Wu',
    category: 'Engineering',
    duration: '46 mins',
    durationSec: 2760,
    gradient: 'thumb-eng',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    qualities: ['1080p', '720p', '480p', '360p', '240p'],
    overview: 'Discrete Fourier Transform (DFT), Fast Fourier Transform (FFT), Nyquist-Shannon sampling theorem, and digital filter design for audio/video codecs.',
    progress: 20
  },
  {
    id: 'lec-cs-450',
    title: 'CS 450: Database Indexing, B-Trees & Query Optimization',
    instructor: 'Prof. Marcus Vance',
    category: 'Computer Science',
    duration: '50 mins',
    durationSec: 3000,
    gradient: 'thumb-cs',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    qualities: ['1080p', '720p', '480p'],
    overview: 'Internal architectures of relational and LSM-tree database engines, WAL logs, concurrency isolation levels, and execution cost planning.',
    progress: 10
  },
  {
    id: 'lec-ai-510',
    title: 'AI 510: Computer Vision & Convolutional Feature Extractors',
    instructor: 'Dr. Elena Rostova',
    category: 'Artificial Intelligence',
    duration: '44 mins',
    durationSec: 2640,
    gradient: 'thumb-ai',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    qualities: ['1080p', '720p', '480p', '360p', '240p'],
    overview: 'Convolutional neural networks, spatial pyramids, attention mechanisms in Vision Transformers (ViT), and feature representation learning.',
    progress: 0
  },
  {
    id: 'lec-math-340',
    title: 'MATH 340: Discrete Mathematics, Graph Theory & Trees',
    instructor: 'Prof. David Thorne',
    category: 'Mathematics',
    duration: '40 mins',
    durationSec: 2400,
    gradient: 'thumb-math',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    qualities: ['1080p', '720p', '480p'],
    overview: 'Dijkstras shortest path, spanning trees, planar graphs, Eulerian circuits, and topological sorting algorithms in network routing.',
    progress: 30
  },
  {
    id: 'lec-net-320',
    title: 'NET 320: HTTP/3, QUIC & Low-Latency Video Protocols',
    instructor: 'Dr. Sarah Jenkins',
    category: 'Networking',
    duration: '36 mins',
    durationSec: 2160,
    gradient: 'thumb-net',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    qualities: ['1080p', '720p', '480p', '360p', '240p'],
    overview: 'Transitioning from TCP head-of-line blocking to UDP-based QUIC multiplexing. Analyzing zero-RTT connection resumption and WebTransport for live classrooms.',
    progress: 0
  },
  {
    id: 'lec-prog-310',
    title: 'PROG 310: Concurrent Systems & Go Goroutines',
    instructor: 'Devon Patel',
    category: 'Programming',
    duration: '41 mins',
    durationSec: 2460,
    gradient: 'thumb-prog',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    qualities: ['1080p', '720p', '480p'],
    overview: 'CSP (Communicating Sequential Processes) concurrency, thread synchronization, mutexes, and lock-free memory buffers in high-throughput streaming relays.',
    progress: 15
  },
  {
    id: 'lec-eng-305',
    title: 'ENG 305: Control Systems, PID Tuning & Stability',
    instructor: 'Dr. Kenneth Wu',
    category: 'Engineering',
    duration: '47 mins',
    durationSec: 2820,
    gradient: 'thumb-eng',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    qualities: ['1080p', '720p', '480p', '360p', '240p'],
    overview: 'Feedback loops, Laplace transforms, Bode plots, and applying PID controllers to dynamically regulate video buffer fill rates under fluctuating network conditions.',
    progress: 0
  }
];

// Live Scheduled Classes
const LIVE_CLASSES_DATA = [
  {
    id: 'live-cs-301',
    title: 'CS 301: Distributed Consensus & Raft Algorithm Implementation',
    instructor: 'Prof. Marcus Vance',
    time: 'Streaming Live Now',
    enrolled: 142,
    reqBw: '6.0 Mbps (1080p)',
    status: 'LIVE NOW',
    isCurrent: true
  },
  {
    id: 'live-ai-402',
    title: 'AI 402: Deep Neural Networks & Backpropagation Lab',
    instructor: 'Dr. Elena Rostova',
    time: 'Tomorrow 10:00 AM',
    enrolled: 88,
    reqBw: '3.0 Mbps (720p)',
    status: 'Scheduled',
    isCurrent: false
  },
  {
    id: 'live-net-410',
    title: 'NET 410: Live Wireshark Packet Analysis & Congestion Drops',
    instructor: 'Dr. Sarah Jenkins',
    time: 'Thursday 2:30 PM',
    enrolled: 115,
    reqBw: '4.5 Mbps (1080p)',
    status: 'Scheduled',
    isCurrent: false
  },
  {
    id: 'live-math-220',
    title: 'MATH 220: Interactive SVD Matrix Factorization Workshop',
    instructor: 'Prof. David Thorne',
    time: 'Friday 11:15 AM',
    enrolled: 74,
    reqBw: '2.5 Mbps (720p)',
    status: 'Scheduled',
    isCurrent: false
  }
];

// Network Condition Preset Definitions
const NETWORK_PRESETS = {
  excellent: {
    name: 'Excellent Fiber',
    downloadBw: 50.0,
    uploadBw: 25.0,
    latency: 15,
    packetLoss: 0.0,
    jitter: 2.0,
    isUnstable: false,
    recommendedQuality: '1080p',
    badgeClass: 'badge-green',
    desc: 'Gigabit fiber optic connection. Perfect zero-stall 1080p Full HD streaming.'
  },
  good: {
    name: 'Good Campus Wi-Fi',
    downloadBw: 20.0,
    uploadBw: 5.2,
    latency: 35,
    packetLoss: 0.2,
    jitter: 4.2,
    isUnstable: false,
    recommendedQuality: '1080p',
    badgeClass: 'badge-blue',
    desc: 'Standard campus university Wi-Fi. Stable 1080p streaming with occasional FEC parity checks.'
  },
  moderate: {
    name: 'Moderate 4G LTE',
    downloadBw: 5.0,
    uploadBw: 1.5,
    latency: 85,
    packetLoss: 1.5,
    jitter: 18.0,
    isUnstable: false,
    recommendedQuality: '720p',
    badgeClass: 'badge-teal',
    desc: 'Commuter 4G cellular connection. ABR smoothly switches between 720p and 480p.'
  },
  poor: {
    name: 'Poor Cellular Edge',
    downloadBw: 1.2,
    uploadBw: 0.4,
    latency: 220,
    packetLoss: 5.8,
    jitter: 45.0,
    isUnstable: false,
    recommendedQuality: '360p',
    badgeClass: 'badge-warning',
    desc: 'Congested cell tower or remote edge. ABR downshifts to 360p/240p to preserve playback continuity.'
  },
  unstable: {
    name: 'Unstable Flapping Wi-Fi',
    downloadBw: 3.5,
    uploadBw: 0.8,
    latency: 180,
    packetLoss: 8.5,
    jitter: 70.0,
    isUnstable: true,
    recommendedQuality: '480p',
    badgeClass: 'badge-red',
    desc: 'Intermittent interference and packet drops. Buffer optimization engages dynamic capacity expansion.'
  }
};

// ==========================================================================
// 3. INITIALIZATION & DOM READY HOOKS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadPreferencesFromStorage();
  initNavigation();
  initVideoPlayer();
  renderLecturesGrids();
  renderUpcomingLiveClasses();
  renderEnrolledCourses();
  initNetworkMonitor();
  initStreamingSimulator();
  initBufferOptimization();
  initBandwidthManager();
  initLiveClassroom();
  initCharts();
  initGlobalSearch();
  startTelemetryBackgroundLoops();
  
  // Set initial network preset based on preferences
  applyNetworkPreset(StreamLearnState.preferences.defaultPreset || 'good', false);
  
  // Log startup in ABR decisions
  logAbrDecision('System initialized. Default ABR policy active. Initial probe: 1080p @ 4.5 Mbps.');
});

// ==========================================================================
// 4. NAVIGATION & ROUTING ENGINE
// ==========================================================================
function initNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.getAttribute('data-section');
      if (sectionId) {
        navigateToSection(sectionId);
      }
    });
  });

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Quick Preset dropdown in header
  const quickSelect = document.getElementById('quickPresetSelect');
  if (quickSelect) {
    quickSelect.addEventListener('change', (e) => {
      applyNetworkPreset(e.target.value);
    });
  }

  // Notifications dropdown
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.remove('active');
      }
    });
  }

  const markReadBtn = document.getElementById('markReadBtn');
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      const unreads = document.querySelectorAll('.notif-item.unread');
      unreads.forEach(u => u.classList.remove('unread'));
      const badge = document.getElementById('notifBadge');
      if (badge) badge.style.display = 'none';
      showToast('All notifications marked as read');
    });
  }

  // Profile pill -> Navigate to Settings
  const profilePill = document.getElementById('profilePill');
  if (profilePill) {
    profilePill.addEventListener('click', () => {
      navigateToSection('settings');
    });
  }
}

function navigateToSection(sectionId) {
  // Update state
  StreamLearnState.currentSection = sectionId;

  // Update navigation items active state
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Show corresponding section
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSection = document.getElementById(sectionId) || document.getElementById(sectionId + '-section');
  if (targetSection) {
    targetSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');

  // Specific triggers when entering sections
  if (sectionId === 'network-monitor' || sectionId === 'streaming-simulator' || sectionId === 'performance-reports') {
    requestAnimationFrame(() => updateAllCharts());
  }
}

// ==========================================================================
// 5. VIDEO PLAYER LOGIC (REAL HTML5 PLAYBACK + SIMULATION OVERLAYS)
// ==========================================================================
let videoEl = null;

function initVideoPlayer() {
  videoEl = document.getElementById('mainVideoPlayer');
  if (!videoEl) return;

  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const timelineContainer = document.getElementById('timelineContainer');
  const timelineProgress = document.getElementById('timelineProgress');
  const timelineBuffer = document.getElementById('timelineBuffer');
  const timelineSimBuffer = document.getElementById('timelineSimBuffer');
  const timelineHoverTime = document.getElementById('timelineHoverTime');
  const currentTimeText = document.getElementById('currentTimeText');
  const durationText = document.getElementById('durationText');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeBtn = document.getElementById('volumeBtn');
  const volumeHighIcon = document.getElementById('volumeHighIcon');
  const volumeMuteIcon = document.getElementById('volumeMuteIcon');
  const replay10Btn = document.getElementById('replay10Btn');
  const forward10Btn = document.getElementById('forward10Btn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const speedMenuBtn = document.getElementById('speedMenuBtn');
  const speedDropdown = document.getElementById('speedDropdown');
  const qualityMenuBtn = document.getElementById('qualityMenuBtn');
  const qualityDropdown = document.getElementById('qualityDropdown');

  // Play / Pause Toggle
  function togglePlayPause() {
    if (videoEl.paused || videoEl.ended) {
      videoEl.play().catch(e => console.log('Autoplay restriction or pause', e));
    } else {
      videoEl.pause();
    }
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  videoEl.addEventListener('click', togglePlayPause);

  videoEl.addEventListener('play', () => {
    StreamLearnState.player.isPlaying = true;
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
  });

  videoEl.addEventListener('pause', () => {
    StreamLearnState.player.isPlaying = false;
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
  });

  // Time Updates
  videoEl.addEventListener('timeupdate', () => {
    if (!videoEl.duration) return;
    const current = videoEl.currentTime;
    const duration = videoEl.duration;
    const pct = (current / duration) * 100;
    
    if (timelineProgress) timelineProgress.style.width = `${pct}%`;
    const scrubber = document.getElementById('timelineScrubber');
    if (scrubber) scrubber.style.left = `${pct}%`;

    if (currentTimeText) currentTimeText.textContent = formatTime(current);
    if (durationText) durationText.textContent = formatTime(duration);

    // Update real HTML5 buffer bar
    if (videoEl.buffered.length > 0) {
      const bufferedEnd = videoEl.buffered.end(videoEl.buffered.length - 1);
      const bufPct = (bufferedEnd / duration) * 100;
      if (timelineBuffer) timelineBuffer.style.width = `${bufPct}%`;
    }

    // Simulated buffer visual progress (extends ahead of playhead)
    const simPct = Math.min(100, pct + (StreamLearnState.player.simulatedBufferLevel / 40) * 100);
    if (timelineSimBuffer) timelineSimBuffer.style.width = `${simPct}%`;

    // Real-time update for stats for nerds
    updateNerdStats();
  });

  videoEl.addEventListener('loadedmetadata', () => {
    if (durationText) durationText.textContent = formatTime(videoEl.duration);
    if (timelineBuffer) timelineBuffer.style.width = '0%';
  });

  // Seeking via Timeline click & drag
  let isDraggingTimeline = false;
  function handleTimelineSeek(e) {
    if (!videoEl.duration) return;
    const rect = timelineContainer.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoEl.currentTime = pos * videoEl.duration;
  }

  if (timelineContainer) {
    timelineContainer.addEventListener('mousedown', (e) => {
      isDraggingTimeline = true;
      handleTimelineSeek(e);
    });
    window.addEventListener('mousemove', (e) => {
      if (isDraggingTimeline) handleTimelineSeek(e);
    });
    window.addEventListener('mouseup', () => {
      isDraggingTimeline = false;
    });

    timelineContainer.addEventListener('mousemove', (e) => {
      if (!videoEl.duration) return;
      const rect = timelineContainer.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const hoverSec = pos * videoEl.duration;
      if (timelineHoverTime) {
        timelineHoverTime.style.display = 'block';
        timelineHoverTime.style.left = `${e.clientX - rect.left}px`;
        timelineHoverTime.textContent = formatTime(hoverSec);
      }
    });

    timelineContainer.addEventListener('mouseleave', () => {
      if (timelineHoverTime) timelineHoverTime.style.display = 'none';
    });
  }

  // Replay & Forward 10s
  if (replay10Btn) {
    replay10Btn.addEventListener('click', () => {
      videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
    });
  }
  if (forward10Btn) {
    forward10Btn.addEventListener('click', () => {
      videoEl.currentTime = Math.min(videoEl.duration || 0, videoEl.currentTime + 10);
    });
  }

  // Volume & Mute
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      videoEl.volume = val;
      StreamLearnState.player.volume = val;
      videoEl.muted = (val === 0);
      updateVolumeIcons(val === 0);
    });
  }

  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      videoEl.muted = !videoEl.muted;
      StreamLearnState.player.isMuted = videoEl.muted;
      updateVolumeIcons(videoEl.muted);
      if (volumeSlider) volumeSlider.value = videoEl.muted ? 0 : StreamLearnState.player.volume;
    });
  }

  function updateVolumeIcons(isMuted) {
    if (isMuted) {
      if (volumeHighIcon) volumeHighIcon.classList.add('hidden');
      if (volumeMuteIcon) volumeMuteIcon.classList.remove('hidden');
    } else {
      if (volumeHighIcon) volumeHighIcon.classList.remove('hidden');
      if (volumeMuteIcon) volumeMuteIcon.classList.add('hidden');
    }
  }

  // Playback Speed
  if (speedMenuBtn && speedDropdown) {
    speedMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      speedDropdown.classList.toggle('active');
      if (qualityDropdown) qualityDropdown.classList.remove('active');
    });

    speedDropdown.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const speed = parseFloat(item.getAttribute('data-speed'));
        videoEl.playbackRate = speed;
        StreamLearnState.player.playbackSpeed = speed;
        speedMenuBtn.textContent = `${speed}x`;
        speedDropdown.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        speedDropdown.classList.remove('active');
        showToast(`Playback speed set to ${speed}x`);
      });
    });
  }

  // Quality Selection (Auto ABR vs Manual Forced)
  if (qualityMenuBtn && qualityDropdown) {
    qualityMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      qualityDropdown.classList.toggle('active');
      if (speedDropdown) speedDropdown.classList.remove('active');
    });

    qualityDropdown.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const quality = item.getAttribute('data-quality');
        setVideoQualityMode(quality);
        qualityDropdown.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        qualityDropdown.classList.remove('active');
      });
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    if (speedDropdown) speedDropdown.classList.remove('active');
    if (qualityDropdown) qualityDropdown.classList.remove('active');
  });

  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.code === 'ArrowLeft') {
      videoEl.currentTime = Math.max(0, videoEl.currentTime - 5);
    } else if (e.code === 'ArrowRight') {
      videoEl.currentTime = Math.min(videoEl.duration || 0, videoEl.currentTime + 5);
    } else if (e.code === 'KeyF') {
      toggleFullscreen();
    }
  });
}

function toggleFullscreen() {
  const container = document.getElementById('videoContainer');
  if (!container) return;
  const enterIcon = document.getElementById('fullscreenEnterIcon');
  const exitIcon = document.getElementById('fullscreenExitIcon');

  if (!document.fullscreenElement) {
    container.requestFullscreen().then(() => {
      if (enterIcon) enterIcon.classList.add('hidden');
      if (exitIcon) exitIcon.classList.remove('hidden');
    }).catch(err => console.log('Fullscreen error', err));
  } else {
    document.exitFullscreen().then(() => {
      if (enterIcon) enterIcon.classList.remove('hidden');
      if (exitIcon) exitIcon.classList.add('hidden');
    });
  }
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Set quality mode: 'auto' or explicit like '1080p', '720p', etc.
function setVideoQualityMode(mode) {
  StreamLearnState.player.qualityMode = mode;
  const btnLabel = document.getElementById('qualityBtnLabel');
  const abrTag = document.getElementById('playerActiveQualityBadge');

  if (mode === 'auto') {
    if (btnLabel) btnLabel.textContent = 'Auto ABR';
    if (abrTag) abrTag.textContent = `Auto (${StreamLearnState.player.activeQuality})`;
    showToast(`Video Quality: Auto Adaptive Bitrate (ABR) enabled`);
    evaluateAbrDecision();
  } else {
    StreamLearnState.player.activeQuality = mode;
    if (btnLabel) btnLabel.textContent = mode;
    if (abrTag) abrTag.textContent = `Manual (${mode})`;
    showToast(`Video Quality manually locked to ${mode}`);

    // If locked quality exceeds current network bandwidth, warn student!
    const ladder = StreamLearnState.qualityLadder[mode];
    if (ladder && ladder.minBw > StreamLearnState.network.downloadBw) {
      triggerSimulatedStall(true);
    }
  }
  updateNerdStats();
}

// Load a specific lecture into player
function playLectureById(lectureId) {
  const lecture = LECTURES_DATABASE.find(l => l.id === lectureId);
  if (!lecture) return;

  StreamLearnState.player.currentLectureId = lectureId;
  const video = document.getElementById('mainVideoPlayer');
  if (video) {
    video.src = lecture.videoUrl;
    video.play().catch(e => console.log('Auto-play note', e));
  }

  // Update Breadcrumbs & Info Card
  const breadcrumbCat = document.getElementById('playerBreadcrumbCategory');
  const breadcrumbTitle = document.getElementById('playerBreadcrumbTitle');
  const playerTitle = document.getElementById('playerCurrentTitle');
  const playerSub = document.getElementById('playerCurrentSubtitle');
  const metaCat = document.getElementById('playerMetaCategory');
  const metaDur = document.getElementById('playerMetaDuration');
  const playerDesc = document.getElementById('playerDescription');

  if (breadcrumbCat) breadcrumbCat.textContent = lecture.category;
  if (breadcrumbTitle) breadcrumbTitle.textContent = lecture.title;
  if (playerTitle) playerTitle.textContent = lecture.title;
  if (playerSub) playerSub.textContent = `Taught by ${lecture.instructor} • ${lecture.category} Department`;
  if (metaCat) metaCat.textContent = lecture.category;
  if (metaDur) metaDur.textContent = lecture.duration;
  if (playerDesc) playerDesc.textContent = lecture.overview;

  // Render player playlist sidebar
  renderPlayerPlaylist(lecture.category, lectureId);

  // Navigate to player section
  navigateToSection('video-player-section');
  showToast(`Streaming: ${lecture.title}`);
}

function renderPlayerPlaylist(category, currentId) {
  const playlistContainer = document.getElementById('playerPlaylist');
  if (!playlistContainer) return;

  const related = LECTURES_DATABASE.filter(l => l.id !== currentId).slice(0, 5);
  let html = '';
  related.forEach(item => {
    html += `
      <div class="playlist-item" onclick="playLectureById('${item.id}')">
        <div class="playlist-thumb-mini ${item.gradient}">
          <span class="cat-pill">${item.category.split(' ')[0]}</span>
        </div>
        <div class="playlist-info-mini">
          <h5 class="playlist-title-mini">${item.title}</h5>
          <span class="playlist-dur-mini">${item.instructor} • ${item.duration}</span>
        </div>
      </div>
    `;
  });
  playlistContainer.innerHTML = html;
}

// Stats for Nerds overlay toggle
function toggleStatsForNerds() {
  const overlay = document.getElementById('playerStatsOverlay');
  if (!overlay) return;
  const isActive = overlay.classList.toggle('active');
  StreamLearnState.player.statsForNerds = isActive;
  if (isActive) updateNerdStats();
}

function updateNerdStats() {
  if (!StreamLearnState.player.statsForNerds) return;
  const nerdVid = document.getElementById('nerdVideoId');
  const nerdRes = document.getElementById('nerdResolution');
  const nerdBitrate = document.getElementById('nerdBitrate');
  const nerdBuf = document.getElementById('nerdBufferHealth');
  const nerdBw = document.getElementById('nerdBandwidth');
  const nerdLat = document.getElementById('nerdLatency');
  const nerdLoss = document.getElementById('nerdPacketLoss');
  const nerdDrops = document.getElementById('nerdDroppedFrames');
  const nerdAbr = document.getElementById('nerdAbrMode');

  if (nerdVid) nerdVid.textContent = StreamLearnState.player.currentLectureId;
  const q = StreamLearnState.player.activeQuality;
  const ladder = StreamLearnState.qualityLadder[q];
  if (nerdRes) nerdRes.textContent = q === '1080p' ? '1920x1080 @ 60fps' : (q === '720p' ? '1280x720 @ 30fps' : '854x480 @ 30fps');
  if (nerdBitrate && ladder) nerdBitrate.textContent = `${ladder.bitrate.toLocaleString()} kbps`;
  if (nerdBuf) nerdBuf.textContent = `${StreamLearnState.player.simulatedBufferLevel.toFixed(1)} s`;
  if (nerdBw) nerdBw.textContent = `${StreamLearnState.network.downloadBw.toFixed(1)} Mbps`;
  if (nerdLat) nerdLat.textContent = `${StreamLearnState.network.latency} ms`;
  if (nerdLoss) nerdLoss.textContent = `${StreamLearnState.network.packetLoss}%`;
  if (nerdDrops) nerdDrops.textContent = StreamLearnState.player.droppedFrames;
  if (nerdAbr) nerdAbr.textContent = StreamLearnState.player.qualityMode === 'auto' ? 'BBR-Aware Dynamic Hybrid' : `Manual Lock (${q})`;
}

// Simulate Network Stalling / Bottleneck
function triggerSimulatedStall(forcedBottleneck = false) {
  const overlay = document.getElementById('playerBufferingOverlay');
  const banner = document.getElementById('playerSimBanner');
  const subText = document.getElementById('bufferingSubText');
  const tankFluid = document.getElementById('tankFluid');
  const tankStatus = document.getElementById('bufferTankStatus');
  const tankHeadroom = document.getElementById('tankHeadroomText');

  StreamLearnState.player.isBuffering = true;
  StreamLearnState.player.stallsCount++;
  StreamLearnState.player.simulatedBufferLevel = 0.4; // Buffer dropped to critical

  if (tankFluid) tankFluid.style.height = '12%';
  if (tankStatus) {
    tankStatus.textContent = 'Stalled (0.4s)';
    tankStatus.className = 'status-indicator-tag badge-red';
  }
  if (tankHeadroom) tankHeadroom.textContent = '0.4 s (Empty)';

  if (overlay) overlay.classList.add('active');
  if (banner) {
    banner.classList.add('active');
    banner.querySelector('span').textContent = forcedBottleneck 
      ? 'Simulation: Locked quality exceeds available bandwidth! Buffer drained to zero.'
      : 'Simulation Event: Network bottleneck simulated. StreamLearn Intelligent Buffer Recovery activated.';
  }
  if (subText) subText.textContent = `Replenishing minimum recovery headroom (${StreamLearnState.bufferOptimization.recoveryThreshold}s) before resuming...`;

  if (videoEl && !videoEl.paused) videoEl.pause();

  // Automatic recovery after safe cushion replenished
  clearTimeout(StreamLearnState.player.simulatedStallTimer);
  StreamLearnState.player.simulatedStallTimer = setTimeout(() => {
    StreamLearnState.player.isBuffering = false;
    StreamLearnState.player.simulatedBufferLevel = 16.5;

    // If auto ABR, adjust quality downwards to prevent re-stall
    if (StreamLearnState.player.qualityMode === 'auto' && StreamLearnState.network.downloadBw < 4.0) {
      StreamLearnState.player.activeQuality = '480p';
      logAbrDecision('Recovered from stall. Downshifting stream to 480p SD to maintain fluid playback continuity.');
    }

    if (overlay) overlay.classList.remove('active');
    if (banner) {
      setTimeout(() => banner.classList.remove('active'), 3500);
    }

    if (tankFluid) tankFluid.style.height = '60%';
    if (tankStatus) {
      tankStatus.textContent = 'Healthy (16.5s)';
      tankStatus.className = 'status-indicator-tag tag-healthy';
    }
    if (tankHeadroom) tankHeadroom.textContent = '16.5 s';

    if (videoEl) videoEl.play().catch(e => console.log(e));
    showToast('Buffer recovered! Playback seamlessly resumed.');
  }, 2200);
}

// Player Tab Switching
function switchPlayerTab(tabId) {
  document.querySelectorAll('.player-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.player-tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tabId}`);
  });
}

// Bookmarking current lecture
function toggleBookmarkCurrent() {
  const currentId = StreamLearnState.player.currentLectureId;
  const bookmarks = StreamLearnState.preferences.bookmarks;
  const idx = bookmarks.indexOf(currentId);
  const bookmarkText = document.getElementById('bookmarkText');

  if (idx > -1) {
    bookmarks.splice(idx, 1);
    showToast('Lecture removed from saved bookmarks');
    if (bookmarkText) bookmarkText.textContent = 'Save Lecture';
  } else {
    bookmarks.push(currentId);
    showToast('Lecture saved to your learning bookmarks!');
    if (bookmarkText) bookmarkText.textContent = 'Saved in Bookmarks';
  }
  savePreferencesToStorage();
  renderSavedBookmarks();
}

function downloadLectureNotes() {
  const current = LECTURES_DATABASE.find(l => l.id === StreamLearnState.player.currentLectureId);
  const title = current ? current.title : 'Lecture_Notes';
  const textContent = `
================================================================================
STREAMLEARN E-LEARNING LECTURE COMPANION NOTES
================================================================================
Lecture: ${title}
Instructor: ${current ? current.instructor : 'StreamLearn Faculty'}
Department: ${current ? current.category : 'Computer Science & Engineering'}

TOPIC SYNOPSIS:
${current ? current.overview : 'Detailed technical lecture notes.'}

STREAMING QoS LOG:
- Content Slicing: 2.0-second ISO-BMFF MPEG-DASH chunks (.m4s)
- Delivery Architecture: Edge CDN with Regional PoP Caching
- Dynamic Buffer Headroom: Smart Buffer 2.4 adaptive sizing
- Protocol: HTTP/3 (QUIC) over TLS 1.3 with BBR Congestion Control

(C) 2026 StreamLearn E-Learning Platform. Generated directly from browser preview.
================================================================================
  `;
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Lecture companion notes downloaded successfully');
}

// ==========================================================================
// 6. VIDEO LIBRARY & RENDERING FUNCTIONS
// ==========================================================================
function renderLecturesGrids() {
  renderHomeRecommendedGrid();
  renderFullLibraryGrid(LECTURES_DATABASE);
}

function renderHomeRecommendedGrid() {
  const container = document.getElementById('homeRecommendedGrid');
  if (!container) return;

  const featured = LECTURES_DATABASE.slice(0, 4);
  container.innerHTML = featured.map(lec => createLectureCardHtml(lec)).join('');
}

function renderFullLibraryGrid(lectures) {
  const container = document.getElementById('fullVideoLibraryGrid');
  if (!container) return;

  if (lectures.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--border-radius-lg); border: 1px dashed var(--border-subtle);">
        <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">No lectures found matching your criteria</h4>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Try adjusting your search terms or clearing category filters.</p>
        <button class="btn btn-outline btn-sm" style="margin-top: 1rem;" onclick="filterVideosByCategory('all')">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = lectures.map(lec => createLectureCardHtml(lec)).join('');
}

function createLectureCardHtml(lec) {
  const isCompleted = StreamLearnState.preferences.completedLectures.includes(lec.id);
  return `
    <div class="video-card" data-category="${lec.category}" data-id="${lec.id}">
      <div class="card-thumb-container">
        <div class="card-mock-thumb ${lec.gradient}">
          <div class="thumb-tag-top">
            <span class="cat-pill">${lec.category}</span>
            <span class="thumb-dur">${lec.duration}</span>
          </div>
          <h4 class="thumb-title-preview">${lec.title.split(':')[0]}</h4>
        </div>
        <div class="card-thumb-overlay">
          <button class="play-btn-circle" onclick="playLectureById('${lec.id}')" title="Stream this lecture">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        </div>
      </div>
      <div class="card-body">
        <span class="card-cat-badge">${lec.category}</span>
        <h4 class="card-lecture-title" title="${lec.title}">${lec.title}</h4>
        <p class="card-instructor">Instructor: ${lec.instructor}</p>
        <div class="card-quality-badges">
          <span class="q-micro-pill">1080p</span>
          <span class="q-micro-pill">720p</span>
          <span class="q-micro-pill">480p</span>
          <span class="q-micro-pill">360p</span>
        </div>
        <div class="card-footer-row">
          <span class="${isCompleted ? 'status-badge-completed' : 'status-badge-pending'}">
            ${isCompleted ? '✓ Completed' : `${lec.progress}% watched`}
          </span>
          <button class="btn btn-sm btn-primary" onclick="playLectureById('${lec.id}')">
            Watch Now &rarr;
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleLibrarySearch(query) {
  const q = query.toLowerCase().trim();
  const filtered = LECTURES_DATABASE.filter(lec => 
    lec.title.toLowerCase().includes(q) ||
    lec.instructor.toLowerCase().includes(q) ||
    lec.category.toLowerCase().includes(q) ||
    lec.overview.toLowerCase().includes(q)
  );
  renderFullLibraryGrid(filtered);
}

function filterVideosByCategory(category) {
  document.querySelectorAll('#categoryFilterContainer .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });

  const filtered = (category === 'all') 
    ? LECTURES_DATABASE 
    : LECTURES_DATABASE.filter(lec => lec.category.toLowerCase() === category.toLowerCase());

  renderFullLibraryGrid(filtered);
}

function sortVideosBy(sortKey) {
  let sorted = [...LECTURES_DATABASE];
  if (sortKey === 'duration-asc') {
    sorted.sort((a, b) => a.durationSec - b.durationSec);
  } else if (sortKey === 'duration-desc') {
    sorted.sort((a, b) => b.durationSec - a.durationSec);
  } else if (sortKey === 'title-asc') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  renderFullLibraryGrid(sorted);
}

// ==========================================================================
// 7. NETWORK PERFORMANCE MONITOR & PRESETS
// ==========================================================================
function initNetworkMonitor() {
  updateNetworkMonitorUI();
}

function applyNetworkPreset(presetKey, notify = true) {
  const preset = NETWORK_PRESETS[presetKey];
  if (!preset) return;

  StreamLearnState.network.preset = presetKey;
  StreamLearnState.network.downloadBw = preset.downloadBw;
  StreamLearnState.network.uploadBw = preset.uploadBw;
  StreamLearnState.network.latency = preset.latency;
  StreamLearnState.network.packetLoss = preset.packetLoss;
  StreamLearnState.network.jitter = preset.jitter;
  StreamLearnState.network.isUnstable = preset.isUnstable;

  // Sync simulator sliders with preset
  syncSimulatorControls(preset);

  // Update UI components
  updateNetworkMonitorUI();
  updateHeaderNetworkPill(preset);
  evaluateAbrDecision();

  // Update active state in preset selector cards
  document.querySelectorAll('.preset-card').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-preset') === presetKey);
  });
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-preset') === presetKey);
  });

  const quickSelect = document.getElementById('quickPresetSelect');
  if (quickSelect && quickSelect.value !== presetKey) {
    quickSelect.value = presetKey;
  }

  // Dashboard trend badge
  const dashPresetBadge = document.getElementById('dashNetworkPresetBadge');
  if (dashPresetBadge) {
    dashPresetBadge.textContent = `${preset.name} Preset`;
  }

  if (notify) {
    showToast(`Network Preset Activated: ${preset.name} (${preset.downloadBw} Mbps, ${preset.latency}ms RTT)`);
    logAbrDecision(`Network switched to ${preset.name}. Download throughput updated to ${preset.downloadBw} Mbps.`);
  }
}

function updateNetworkMonitorUI() {
  const net = StreamLearnState.network;
  const monDown = document.getElementById('monBwDown');
  const monDownBar = document.getElementById('monBwDownBar');
  const monUp = document.getElementById('monBwUp');
  const monUpBar = document.getElementById('monBwUpBar');
  const monLat = document.getElementById('monLatency');
  const monLatBar = document.getElementById('monLatencyBar');
  const monLoss = document.getElementById('monPacketLoss');
  const monLossBar = document.getElementById('monLossBar');
  const monJitter = document.getElementById('monJitter');
  const monJitterBar = document.getElementById('monJitterBar');
  const monBuf = document.getElementById('monBufferHealth');
  const monBufBar = document.getElementById('monBufferBar');

  if (monDown) monDown.textContent = net.downloadBw.toFixed(1);
  if (monDownBar) monDownBar.style.width = `${Math.min(100, (net.downloadBw / 50) * 100)}%`;
  if (monUp) monUp.textContent = net.uploadBw.toFixed(1);
  if (monUpBar) monUpBar.style.width = `${Math.min(100, (net.uploadBw / 25) * 100)}%`;
  if (monLat) monLat.textContent = Math.round(net.latency);
  if (monLatBar) monLatBar.style.width = `${Math.min(100, (net.latency / 250) * 100)}%`;
  if (monLoss) monLoss.textContent = net.packetLoss.toFixed(1);
  if (monLossBar) monLossBar.style.width = `${Math.min(100, (net.packetLoss / 10) * 100)}%`;
  if (monJitter) monJitter.textContent = net.jitter.toFixed(1);
  if (monJitterBar) monJitterBar.style.width = `${Math.min(100, (net.jitter / 50) * 100)}%`;
  if (monBuf) monBuf.textContent = StreamLearnState.player.simulatedBufferLevel.toFixed(1);
  if (monBufBar) monBufBar.style.width = `${Math.min(100, (StreamLearnState.player.simulatedBufferLevel / 30) * 100)}%`;

  // Mini diag on player page
  const diagBw = document.getElementById('diagBw');
  const diagLat = document.getElementById('diagLatency');
  if (diagBw) diagBw.textContent = `${net.downloadBw.toFixed(1)} Mbps`;
  if (diagLat) diagLat.textContent = `${Math.round(net.latency)} ms`;
}

function updateHeaderNetworkPill(preset) {
  const headerBw = document.getElementById('headerBandwidthText');
  const headerQ = document.getElementById('headerQualityText');
  const sidebarDot = document.getElementById('sidebarStatusDot');
  const sidebarText = document.getElementById('sidebarNetworkState');
  const dashBw = document.getElementById('dashNetworkSpeed');
  const dashLiveBw = document.getElementById('dashLiveBwPill');
  const dashLiveLat = document.getElementById('dashLiveLatencyPill');

  if (headerBw) headerBw.textContent = `${preset.downloadBw.toFixed(1)} Mbps`;
  if (headerQ) headerQ.textContent = `${StreamLearnState.player.activeQuality} ABR`;
  if (sidebarText) sidebarText.textContent = `${preset.name} (${preset.downloadBw.toFixed(0)}M)`;
  if (dashBw) dashBw.textContent = `${preset.downloadBw.toFixed(1)} Mbps`;
  if (dashLiveBw) dashLiveBw.textContent = `${preset.downloadBw.toFixed(1)} Mbps Download`;
  if (dashLiveLat) dashLiveLat.textContent = `${preset.latency} ms RTT`;

  if (sidebarDot) {
    sidebarDot.className = 'quick-status-dot ' + (preset.downloadBw > 15 ? 'pulse-good' : (preset.downloadBw > 3 ? '' : 'pulse-danger'));
  }
}

// ==========================================================================
// 8. INTERACTIVE STREAMING SIMULATOR ENGINE
// ==========================================================================
function initStreamingSimulator() {
  // Bind slider events
  syncSimulatorControls(NETWORK_PRESETS.good);
}

function syncSimulatorControls(preset) {
  const sim = StreamLearnState.simulator;
  sim.bandwidth = preset.downloadBw;
  sim.latency = preset.latency;
  sim.packetLoss = preset.packetLoss;
  sim.jitter = preset.jitter;

  const bwSlider = document.getElementById('simBwSlider');
  const latSlider = document.getElementById('simLatencySlider');
  const lossSlider = document.getElementById('simLossSlider');
  const jitterSlider = document.getElementById('simJitterSlider');

  if (bwSlider) bwSlider.value = preset.downloadBw;
  if (latSlider) latSlider.value = preset.latency;
  if (lossSlider) lossSlider.value = preset.packetLoss;
  if (jitterSlider) jitterSlider.value = preset.jitter;

  updateSimDisplays();
}

function updateSimParameter(param, value) {
  const val = parseFloat(value);
  StreamLearnState.simulator[param] = val;

  // Mirror to network state
  if (param === 'bandwidth') StreamLearnState.network.downloadBw = val;
  if (param === 'latency') StreamLearnState.network.latency = val;
  if (param === 'packetLoss') StreamLearnState.network.packetLoss = val;
  if (param === 'jitter') StreamLearnState.network.jitter = val;

  updateSimDisplays();
  updateNetworkMonitorUI();
  evaluateAbrDecision();
}

function updateSimDisplays() {
  const sim = StreamLearnState.simulator;
  const bwDisp = document.getElementById('simBwDisplay');
  const latDisp = document.getElementById('simLatencyDisplay');
  const lossDisp = document.getElementById('simLossDisplay');
  const jitterDisp = document.getElementById('simJitterDisplay');
  const bufDisp = document.getElementById('simBufferSizeDisplay');
  const pipeBw = document.getElementById('simPipeBw');
  const pipeLoss = document.getElementById('simPipeLoss');

  if (bwDisp) bwDisp.textContent = `${sim.bandwidth.toFixed(1)} Mbps`;
  if (latDisp) latDisp.textContent = `${sim.latency} ms`;
  if (lossDisp) lossDisp.textContent = `${sim.packetLoss.toFixed(1)} %`;
  if (jitterDisp) jitterDisp.textContent = `${sim.jitter} ms`;
  if (bufDisp) bufDisp.textContent = `${sim.targetBufferSize} sec`;
  if (pipeBw) pipeBw.textContent = `${sim.bandwidth.toFixed(1)} Mbps`;
  if (pipeLoss) pipeLoss.textContent = `${sim.packetLoss.toFixed(1)}% loss`;
}

function loadSimScenario(scenarioKey) {
  document.querySelectorAll('.scenario-btn').forEach(btn => btn.classList.remove('active'));
  const target = event ? event.currentTarget : null;
  if (target) target.classList.add('active');

  if (scenarioKey === 'high-bw') {
    applyNetworkPreset('excellent');
  } else if (scenarioKey === 'low-bw') {
    applyNetworkPreset('poor');
  } else if (scenarioKey === 'high-latency') {
    updateSimParameter('bandwidth', 10);
    updateSimParameter('latency', 350);
    updateSimParameter('packetLoss', 1.0);
    showToast('Loaded Scenario: High Latency Satellite Link (350ms RTT)');
  } else if (scenarioKey === 'packet-loss') {
    updateSimParameter('bandwidth', 12);
    updateSimParameter('latency', 60);
    updateSimParameter('packetLoss', 12.0);
    showToast('Loaded Scenario: Severe Radio Interference (12% Packet Loss)');
  } else if (scenarioKey === 'unstable-flapping') {
    applyNetworkPreset('unstable');
  }
}

function toggleMainSimulation() {
  const sim = StreamLearnState.simulator;
  sim.isRunning = !sim.isRunning;
  const btnIcon = document.getElementById('simBtnIcon');
  const btnText = document.getElementById('simBtnText');
  const badge = document.getElementById('simPlaybackStateBadge');

  if (sim.isRunning) {
    if (btnIcon) btnIcon.textContent = '⏸';
    if (btnText) btnText.textContent = 'Pause Real-Time Simulation';
    if (badge) {
      badge.textContent = 'SIMULATION RUNNING';
      badge.className = 'badge badge-teal';
    }
    showToast('Streaming Simulation Resumed');
  } else {
    if (btnIcon) btnIcon.textContent = '▶';
    if (btnText) btnText.textContent = 'Resume Real-Time Simulation';
    if (badge) {
      badge.textContent = 'SIMULATION PAUSED';
      badge.className = 'badge badge-warning';
    }
    showToast('Streaming Simulation Paused');
  }
}

function resetSimulatorDefaults() {
  applyNetworkPreset('good');
  showToast('Simulation parameters reset to Campus Wi-Fi defaults');
}

function setSimTargetQuality(quality) {
  StreamLearnState.simulator.requestedQuality = quality;
  document.querySelectorAll('.sim-quality-pills .q-pill').forEach(pill => {
    pill.classList.toggle('active', pill.getAttribute('data-q') === quality);
  });
  const disp = document.getElementById('simQualityDisplay');
  if (disp) disp.textContent = quality === 'auto' ? 'Auto (Adaptive)' : `${quality} Locked`;
  setVideoQualityMode(quality);
}

// ==========================================================================
// 9. BUFFER OPTIMIZATION ENGINE & SIDE-BY-SIDE BENCHMARK
// ==========================================================================
function initBufferOptimization() {
  // Initial parameters
  updateOptDisplays();
}

function updateOptParam(key, val) {
  StreamLearnState.bufferOptimization[key] = parseFloat(val);
  updateOptDisplays();
}

function updateOptDisplays() {
  const opt = StreamLearnState.bufferOptimization;
  const minVal = document.getElementById('optMinBufferVal');
  const maxVal = document.getElementById('optMaxBufferVal');
  const preVal = document.getElementById('optPrebufferVal');
  const recVal = document.getElementById('optRecoveryVal');

  if (minVal) minVal.textContent = `${opt.minBufferThreshold.toFixed(1)}s`;
  if (maxVal) maxVal.textContent = `${opt.maxBufferCapacity.toFixed(0)}s`;
  if (preVal) preVal.textContent = `${opt.initialPrebuffer.toFixed(1)}s`;
  if (recVal) recVal.textContent = `${opt.recoveryThreshold.toFixed(1)}s`;
}

function runOptimizationComparisonDemo() {
  simulateBottleneckOnBoth();
  showToast('Side-by-side benchmark test started');
}

function simulateBottleneckOnBoth() {
  // Simulate sudden 1.2 Mbps bottleneck on both naive & optimized engines
  const naiveTank = document.getElementById('naiveTankBar');
  const naiveVal = document.getElementById('naiveTankVal');
  const optTank = document.getElementById('optTankBar');
  const optVal = document.getElementById('optTankVal');
  const naiveStall = document.getElementById('naiveStallCount');
  const naiveQoE = document.getElementById('naiveQoE');

  if (naiveTank) naiveTank.style.width = '8%';
  if (naiveVal) naiveVal.textContent = '0.3s (STALLING)';
  if (optTank) optTank.style.width = '65%';
  if (optVal) optVal.textContent = '19.4s (Headroom Absorbed)';

  StreamLearnState.bufferOptimization.naiveStalls += 2;
  if (naiveStall) naiveStall.textContent = `${StreamLearnState.bufferOptimization.naiveStalls} Stalls / hr`;
  if (naiveQoE) naiveQoE.textContent = '44 / 100 (Frequent Freezes)';

  showToast('Network spike applied: Naive player stalled 2 times; StreamLearn absorbed spike with 19s buffer!');

  setTimeout(() => {
    if (naiveTank) naiveTank.style.width = '25%';
    if (naiveVal) naiveVal.textContent = '1.2s';
    if (optTank) optTank.style.width = '78%';
    if (optVal) optVal.textContent = '23.4s';
  }, 4000);
}

// ==========================================================================
// 10. ADAPTIVE VIDEO QUALITY (ABR) CONTROLLER
// ==========================================================================
function evaluateAbrDecision() {
  if (StreamLearnState.player.qualityMode !== 'auto') return;

  const bw = StreamLearnState.network.downloadBw;
  const buffer = StreamLearnState.player.simulatedBufferLevel;
  let chosen = '240p';
  let reason = '';

  if (bw >= 6.0 && buffer >= 8.0) {
    chosen = '1080p';
    reason = `Bandwidth is high (${bw.toFixed(1)} Mbps) and buffer is healthy (${buffer.toFixed(1)}s). Scaling up to 1080p Full HD.`;
  } else if (bw >= 3.0 && buffer >= 5.0) {
    chosen = '720p';
    reason = `Bandwidth supports 720p HD (${bw.toFixed(1)} Mbps). Buffer headroom is sufficient.`;
  } else if (bw >= 1.5 && buffer >= 3.0) {
    chosen = '480p';
    reason = `Moderate bandwidth (${bw.toFixed(1)} Mbps). Downshifted to 480p SD to guarantee stall-free streaming.`;
  } else if (bw >= 0.7) {
    chosen = '360p';
    reason = `Constrained bandwidth (${bw.toFixed(1)} Mbps). Selecting 360p to prevent buffer underflow.`;
  } else {
    chosen = '240p';
    reason = `Severe bottleneck (< 0.7 Mbps). Emergency 240p fallback selected.`;
  }

  // Update chosen quality in state
  const prevQuality = StreamLearnState.player.activeQuality;
  StreamLearnState.player.activeQuality = chosen;

  // Update UI Elements
  const choiceEl = document.getElementById('abrCurrentChoice');
  const reasonEl = document.getElementById('abrDecisionReason');
  const bwVal = document.getElementById('abrBwVal');
  const reqVal = document.getElementById('abrReqVal');
  const headVal = document.getElementById('abrHeadroomVal');
  const ladderItem = StreamLearnState.qualityLadder[chosen];

  if (choiceEl && ladderItem) choiceEl.textContent = `${chosen} (${ladderItem.bitrate.toLocaleString()} kbps)`;
  if (reasonEl) reasonEl.textContent = reason;
  if (bwVal) bwVal.textContent = `${bw.toFixed(1)} Mbps`;
  if (reqVal && ladderItem) reqVal.textContent = `${(ladderItem.bitrate / 1000).toFixed(1)} Mbps`;
  if (headVal) headVal.textContent = `${buffer.toFixed(1)} sec`;

  // Update active ladder card
  document.querySelectorAll('.quality-ladder-row .ladder-card').forEach(card => card.classList.remove('active'));
  const cardId = `ladder${chosen.replace('p', '')}`;
  const activeCard = document.getElementById(cardId);
  if (activeCard) activeCard.classList.add('active');

  // Update player tags & resolution badges
  const playerAbrTag = document.getElementById('playerActiveQualityBadge');
  if (playerAbrTag) playerAbrTag.textContent = `Auto (${chosen})`;

  const nerdRes = document.getElementById('nerdResolution');
  if (nerdRes) nerdRes.textContent = chosen === '1080p' ? '1920x1080 @ 60fps' : (chosen === '720p' ? '1280x720 @ 30fps' : '854x480 @ 30fps');

  // If quality switched, log event
  if (prevQuality !== chosen) {
    logAbrDecision(`ABR Switch: ${prevQuality} → ${chosen}. Reason: ${reason}`);
  }
}

function logAbrDecision(msg) {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  StreamLearnState.abrLog.unshift({ time: timeStr, message: msg, isDown: msg.includes('Downshifted') || msg.includes('Emergency') });

  const logStream = document.getElementById('abrLogStream');
  if (!logStream) return;

  const entries = StreamLearnState.abrLog.slice(0, 15);
  logStream.innerHTML = entries.map(item => `
    <div class="abr-log-entry ${item.isDown ? 'down' : ''}">
      <div class="log-meta-line">
        <span class="log-time">${item.time}</span>
        <span class="log-flag">${item.isDown ? '⚡ Downgrade Protection' : '✓ QoS Optimal'}</span>
      </div>
      <p class="log-text">${item.message}</p>
    </div>
  `).join('');
}

function clearAbrLog() {
  StreamLearnState.abrLog = [];
  const logStream = document.getElementById('abrLogStream');
  if (logStream) logStream.innerHTML = '<p style="padding: 1rem; color: var(--text-muted); font-size: 0.8rem;">Decision log cleared.</p>';
}

function switchAbrAlgorithm(algo) {
  document.querySelectorAll('.abr-mode-switcher .btn').forEach(b => b.classList.remove('active', 'btn-primary'));
  document.querySelectorAll('.abr-mode-switcher .btn').forEach(b => b.classList.add('btn-outline'));

  if (algo === 'hybrid') {
    const b = document.getElementById('abrModeAuto');
    if (b) { b.classList.add('active', 'btn-primary'); b.classList.remove('btn-outline'); }
    showToast('ABR Algorithm: Hybrid BOLA + Throughput Estimator');
  } else if (algo === 'throughput') {
    const b = document.getElementById('abrModeThroughput');
    if (b) { b.classList.add('active', 'btn-primary'); b.classList.remove('btn-outline'); }
    showToast('ABR Algorithm: Pure Harmonic Throughput Filter');
  } else if (algo === 'buffer') {
    const b = document.getElementById('abrModeBuffer');
    if (b) { b.classList.add('active', 'btn-primary'); b.classList.remove('btn-outline'); }
    showToast('ABR Algorithm: Pure Buffer Occupancy (BOLA-V)');
  }
}

// ==========================================================================
// 11. CAMPUS BANDWIDTH MANAGER
// ==========================================================================
function initBandwidthManager() {
  renderCampusStudents();
}

function updateCampusTotalBandwidth(val) {
  const bw = parseFloat(val);
  StreamLearnState.campus.totalBandwidth = bw;
  const disp = document.getElementById('campusTotalBwDisplay');
  if (disp) disp.textContent = `${bw.toFixed(0)} Mbps`;
  recalculateCampusAllocation();
}

function setBandwidthStrategy(strategy) {
  StreamLearnState.campus.strategy = strategy;
  recalculateCampusAllocation();
  showToast(`Campus Allocation Strategy switched to: ${strategy.toUpperCase()}`);
}

function simulateCampusPeakHour() {
  const slider = document.getElementById('campusPipeSlider');
  if (slider) slider.value = 15;
  updateCampusTotalBandwidth(15);
  showToast('Simulated campus peak hour: Total pipe throttled to 15 Mbps across all students!');
}

function recalculateCampusAllocation() {
  const campus = StreamLearnState.campus;
  const total = campus.totalBandwidth;
  const students = campus.students;

  if (campus.strategy === 'fair') {
    // Equal split
    const split = total / students.length;
    students.forEach(st => {
      st.bw = split;
      st.quality = split >= 6.0 ? '1080p' : (split >= 3.0 ? '720p' : (split >= 1.5 ? '480p' : '360p'));
      st.buffer = split >= 4.0 ? 'Optimal (22s)' : (split >= 2.0 ? 'Safe (14s)' : 'Constrained (5s)');
    });
  } else if (campus.strategy === 'priority') {
    // Priority: Live classes get guaranteed 6 Mbps, others share remainder
    let remaining = total;
    const liveStudents = students.filter(s => s.priority === 'high');
    const normalStudents = students.filter(s => s.priority !== 'high');

    liveStudents.forEach(st => {
      const grant = Math.min(remaining * 0.4, 7.0);
      st.bw = grant;
      st.quality = grant >= 6.0 ? '1080p' : '720p';
      st.buffer = 'Protected (25s)';
      remaining -= grant;
    });

    const splitRest = Math.max(0.8, remaining / normalStudents.length);
    normalStudents.forEach(st => {
      st.bw = splitRest;
      st.quality = splitRest >= 3.0 ? '720p' : (splitRest >= 1.5 ? '480p' : '360p');
      st.buffer = splitRest >= 2.5 ? 'Good (12s)' : 'Low Headroom (4s)';
    });
  } else {
    // Unmanaged / Greedy (Student A & C hog bandwidth, others starved)
    students[0].bw = total * 0.45;
    students[0].quality = '1080p';
    students[1].bw = total * 0.25;
    students[1].quality = students[1].bw >= 3 ? '720p' : '480p';
    students[2].bw = total * 0.15;
    students[2].quality = '480p';
    students[3].bw = total * 0.10;
    students[3].quality = '360p';
    students[4].bw = total * 0.05;
    students[4].quality = '240p (Buffering)';
  }

  renderCampusStudents();
  updateBandwidthAllocChart();
}

function renderCampusStudents() {
  const container = document.getElementById('campusStudentsGrid');
  if (!container) return;

  container.innerHTML = StreamLearnState.campus.students.map(st => `
    <div class="student-card">
      <div class="st-header">
        <strong>${st.name}</strong>
        <span class="badge ${st.priority === 'high' ? 'badge-purple' : 'badge-blue'}">${st.priority.toUpperCase()} QoS</span>
      </div>
      <p class="st-activity">${st.course}</p>
      <div class="st-alloc-row">
        <span>Allocated Pipe:</span>
        <strong class="text-blue">${st.bw.toFixed(1)} Mbps</strong>
      </div>
      <div class="st-alloc-row">
        <span>Buffer State:</span>
        <strong class="${st.buffer.includes('Optimal') || st.buffer.includes('Protected') ? 'text-green' : 'text-warning'}">${st.buffer}</strong>
      </div>
      <span class="st-stream-pill">${st.quality}</span>
    </div>
  `).join('');
}

// ==========================================================================
// 12. CONTENT DELIVERY & EDGE CACHING (CDN)
// ==========================================================================
function runCdnBenchmark() {
  const originTtfb = document.getElementById('originTtfb');
  const edgeTtfb = document.getElementById('edgeTtfb');
  const originLat = document.getElementById('originLatency');
  const edgeLat = document.getElementById('edgeLatency');

  if (originTtfb) originTtfb.textContent = '192 ms';
  if (edgeTtfb) edgeTtfb.textContent = '14 ms (-92%)';
  if (originLat) originLat.textContent = '128 ms';
  if (edgeLat) edgeLat.textContent = '15 ms (-88%)';

  showToast('CDN Benchmark complete: Edge server reduced retrieval latency by 88%!');
  updateCdnBenchmarkChart();
}

function purgeEdgeCache() {
  const badge = document.getElementById('cdnCacheStatusBadge');
  if (badge) {
    badge.textContent = 'CACHE PURGED (Refetching)';
    badge.style.background = 'var(--warning-status)';
  }
  showToast('Edge cache invalidated. Simulating origin cache replenishment...');

  setTimeout(() => {
    if (badge) {
      badge.textContent = 'CACHE HIT (96%)';
      badge.style.background = 'var(--teal-primary)';
    }
  }, 2500);
}

// ==========================================================================
// 13. LIVE CLASSROOM SIMULATION
// ==========================================================================
function initLiveClassroom() {
  // Live timer interval
  let liveSeconds = 1122; // 18m 42s
  setInterval(() => {
    liveSeconds++;
    const timer = document.getElementById('liveStreamingTimer');
    if (timer) {
      const h = Math.floor(liveSeconds / 3600);
      const m = Math.floor((liveSeconds % 3600) / 60);
      const s = liveSeconds % 60;
      timer.textContent = `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
  }, 1000);
}

function toggleLiveClassAudio() {
  const video = document.getElementById('liveClassVideo');
  const label = document.getElementById('liveAudioLabel');
  if (!video) return;
  video.muted = !video.muted;
  if (label) label.textContent = video.muted ? 'Unmute Audio' : 'Mute Audio';
  showToast(video.muted ? 'Live class muted' : 'Live audio active');
}

function raiseLiveHand() {
  showToast('✋ Hand raised! The instructor has been notified.');
  addLiveChatMessage('System', 'Alex Chen raised their hand.', false);
}

function sendReactionEmoji(emoji) {
  showToast(`Reaction sent: ${emoji}`);
  addLiveChatMessage('Alex Chen', emoji, false);
}

function handleSendChatMessage(e) {
  e.preventDefault();
  const input = document.getElementById('liveChatInput');
  if (!input || !input.value.trim()) return;

  const msg = input.value.trim();
  addLiveChatMessage('Alex Chen (You)', msg, false);
  input.value = '';

  // Automated instructor or peer response after brief delay
  setTimeout(() => {
    const responses = [
      "Great question Alex! In a partitioned network, the minority partition won't commit writes until reconnected.",
      "Notice how our client buffer is holding steady at 4.8s live delay.",
      "Exactly right, check slide 14 for the heartbeat timeout threshold.",
      "Good point Alex, that's why Raft uses randomized election timers to avoid split votes."
    ];
    const randResp = responses[Math.floor(Math.random() * responses.length)];
    addLiveChatMessage('Prof. Marcus Vance', randResp, true);
  }, 1800);
}

function addLiveChatMessage(author, text, isProf) {
  const container = document.getElementById('liveChatMessages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg';
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgDiv.innerHTML = `
    <span class="msg-author ${isProf ? 'author-prof' : ''}">${author}:</span>
    <p class="msg-text">${escapeHtml(text)}</p>
    <span class="msg-time">${timeStr}</span>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function joinLiveClassModal(classId) {
  const live = LIVE_CLASSES_DATA.find(c => c.id === classId);
  if (!live) return;
  const activeTitle = document.getElementById('activeLiveTitle');
  if (activeTitle) activeTitle.textContent = live.title;
  navigateToSection('live-classes');
  showToast(`Joined live class: ${live.title}`);
}

function enrollLiveClass(classId) {
  showToast('Reminder set! You will receive an alert before the class begins.');
}

function renderUpcomingLiveClasses() {
  const tbody = document.getElementById('upcomingLiveClassesTable');
  if (!tbody) return;

  tbody.innerHTML = LIVE_CLASSES_DATA.map(item => `
    <tr>
      <td><strong>${item.title}</strong></td>
      <td>${item.instructor}</td>
      <td>${item.time}</td>
      <td>${item.enrolled} students</td>
      <td><span class="badge badge-blue">${item.reqBw}</span></td>
      <td>
        <span class="${item.isCurrent ? 'badge badge-red' : 'badge badge-teal'}">
          ${item.status}
        </span>
      </td>
      <td>
        <button class="btn btn-sm ${item.isCurrent ? 'btn-primary' : 'btn-outline'}" onclick="joinLiveClassModal('${item.id}')">
          ${item.isCurrent ? 'Join Live' : 'Register'}
        </button>
      </td>
    </tr>
  `).join('');
}

// ==========================================================================
// 14. INTERACTIVE NETWORK ARCHITECTURE EXPLORER
// ==========================================================================
const ARCHITECTURE_NODES = {
  'student-device': {
    title: 'Component 1: Student Device (Player Core)',
    protocol: 'Protocol: HTML5 MediaSource Extensions (MSE) + WebAssembly',
    desc: 'The student browser hosts the client-side streaming player. Utilizing MediaSource Extensions (MSE), video segments downloaded over HTTP are demuxed and appended to the SourceBuffer in device memory. The player decodes H.264/AAC video tracks on the fly and monitors playback progress.',
    specs: [
      { name: 'Client Engine:', val: 'StreamLearn JS Engine v2.4' },
      { name: 'Buffer Interface:', val: 'HTMLMediaElement SourceBuffer' },
      { name: 'Decoders:', val: 'Hardware-Accelerated AVC/H.264 & AAC' },
      { name: 'Telemetry Hook:', val: 'Real-time QoE & Dropped Frame Observer' }
    ]
  },
  'net-monitor': {
    title: 'Component 2: Real-Time Network Monitor',
    protocol: 'Protocol: Active Ping Probes + Passive Harmonic Throughput Estimator',
    desc: 'Continuously measures round-trip time (RTT), jitter variance, and chunk download speeds. Instead of using a simple arithmetic mean which is distorted by outlier spikes, it calculates the harmonic mean of recent chunk transfers to detect genuine congestion drops.',
    specs: [
      { name: 'Sampling Frequency:', val: '1,000 ms sliding window' },
      { name: 'Estimation Filter:', val: 'Harmonic Mean Throughput' },
      { name: 'Loss Detection:', val: 'TCP SACK & Duplicate ACK count' },
      { name: 'Jitter Model:', val: 'RFC 3550 Delay Variance' }
    ]
  },
  'abr-controller': {
    title: 'Component 3: Adaptive Streaming Controller (ABR)',
    protocol: 'Protocol: Hybrid Throughput + Buffer Occupancy (BOLA / MPC)',
    desc: 'Selects the optimal video bitrate for upcoming segments before they are requested. If the buffer is full (> 15s), the controller comfortably requests 1080p chunks even during brief transient network dips. If the buffer begins depleting, it immediately steps down to 480p/360p to prevent playback interruption.',
    specs: [
      { name: 'Quality Ladder:', val: '240p, 360p, 480p, 720p, 1080p' },
      { name: 'Control Horizon:', val: '5 consecutive future chunks (10s)' },
      { name: 'Safety Margin:', val: '1.4x Estimated Throughput' },
      { name: 'Switching Penalty:', val: 'Hysteresis lock prevents flapping' }
    ]
  },
  'buffer-module': {
    title: 'Component 4: Intelligent Buffer Optimization Engine',
    protocol: 'Protocol: Dynamic Window Sizing & Panic Waterline Hysteresis',
    desc: 'Maintains minimum safe headroom and expands buffer capacity up to 35 seconds when network jitter is high. Employs intelligent pre-buffering to achieve sub-second startup times and enforces a 3-second recovery cushion after unexpected stalls to eliminate repeating freeze loops.',
    specs: [
      { name: 'Panic Waterline:', val: '2.5 seconds minimum' },
      { name: 'Dynamic Ceiling:', val: '10s to 60s adaptive capacity' },
      { name: 'Startup Pre-buffer:', val: '1.5 seconds burst pre-fetch' },
      { name: 'Recovery Lock:', val: '3.0 seconds stall release threshold' }
    ]
  },
  'cdn-edge': {
    title: 'Component 5: Regional CDN Edge Point-of-Presence (PoP)',
    protocol: 'Protocol: HTTP/3 over QUIC + TLS 1.3 Multiplexing',
    desc: 'Caches frequently accessed lecture chunks geographically close to university campuses. Reduces round-trip latency from 120ms to 16ms and offloads origin network backbones by serving 94% of chunk requests directly from local NVMe cache storage.',
    specs: [
      { name: 'Edge Location:', val: 'Campus Regional Node (Edge-East)' },
      { name: 'Cache Hit Ratio:', val: '94.2% average' },
      { name: 'Time to First Byte:', val: '14 ms (vs 192 ms Origin)' },
      { name: 'Chunk Slicing:', val: '2.0-second ISO-BMFF MPEG-DASH chunks' }
    ]
  },
  'origin-server': {
    title: 'Component 6: Educational Video Origin Server',
    protocol: 'Protocol: Object Storage (S3 API) + Real-Time Transcoding Array',
    desc: 'Stores the master uncompressed educational lecture archives. Transcodes uploaded lectures into multiple discrete bitrate tiers (240p up to 1080p) using H.264/HEVC encoding and generates manifest files (.mpd / .m3u8) for adaptive distribution.',
    specs: [
      { name: 'Storage Array:', val: 'High-availability replicated object store' },
      { name: 'Transcoding Cluster:', val: 'Hardware NVENC GPU array' },
      { name: 'GOP Structure:', val: 'Closed GOP, 2-second keyframe interval' },
      { name: 'Manifest Formats:', val: 'MPEG-DASH (.mpd) & HLS (.m3u8)' }
    ]
  }
};

function selectArchitectureNode(nodeId) {
  const node = ARCHITECTURE_NODES[nodeId];
  if (!node) return;

  document.querySelectorAll('.arch-node-card').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-node') === nodeId);
  });

  const titleEl = document.getElementById('archDetailTitle');
  const protoEl = document.getElementById('archDetailProtocol');
  const descEl = document.getElementById('archDetailDesc');
  const specsEl = document.getElementById('archDetailSpecs');

  if (titleEl) titleEl.textContent = node.title;
  if (protoEl) protoEl.textContent = node.protocol;
  if (descEl) descEl.textContent = node.desc;
  if (specsEl) {
    specsEl.innerHTML = node.specs.map(s => `
      <div class="spec-item">
        <span class="s-name">${s.name}</span>
        <strong class="s-val">${s.val}</strong>
      </div>
    `).join('');
  }
}

// ==========================================================================
// 15. PERFORMANCE REPORTS & DATA EXPORT (CSV / PRINT)
// ==========================================================================
function downloadCsvReport() {
  const now = new Date().toISOString().replace('T', ' ').split('.')[0];
  const csvRows = [
    ['StreamLearn Performance Analytics Report'],
    ['Generated At', now],
    ['User', 'Alex Chen (alex.chen@university.edu)'],
    ['Platform', 'StreamLearn E-Learning Video Platform v2.4'],
    [''],
    ['METRIC SUMMARY', 'VALUE', 'BASELINE (UNOPTIMIZED)', 'IMPROVEMENT'],
    ['Total Streaming Duration', '48m 12s', '48m 12s', 'N/A'],
    ['Average Video Quality', '1080p Full HD (4.1 Mbps)', '480p SD (1.2 Mbps)', '+241% Bitrate'],
    ['Re-buffering Stalls', '1 Event (1.8s)', '8 Events (16.4s)', '-89% Stalls'],
    ['Average Latency (RTT)', '26.4 ms', '124.0 ms', '-78% Latency'],
    ['Playback Interruption Rate', '0.06%', '0.57%', 'SLA Compliant (<0.1%)'],
    ['QoE Smoothness Index', '94 / 100', '52 / 100', '+80% Gain'],
    [''],
    ['DETAILED SESSION TELEMETRY LOGS'],
    ['Timestamp', 'Lecture Session', 'Resolution', 'Bitrate (kbps)', 'Simulated Bandwidth (Mbps)', 'Buffer Headroom (s)', 'Latency (ms)', 'Status']
  ];

  // Add 10 detailed sample rows
  const lectures = ['CS 301', 'NET 410', 'AI 402', 'MATH 220'];
  for (let i = 1; i <= 10; i++) {
    const sec = i * 4;
    csvRows.push([
      `14:${sec < 10 ? '0' : ''}${sec}:00`,
      lectures[i % lectures.length],
      i > 7 ? '720p' : '1080p',
      i > 7 ? '2500' : '4500',
      (18.5 - (i * 0.4)).toFixed(1),
      (22.4 - (i * 0.3)).toFixed(1),
      (28 + (i * 1.5)).toFixed(0),
      i === 8 ? 'ABR Downshifted' : 'Optimal Playback'
    ]);
  }

  const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `streamlearn_performance_report_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Performance Report downloaded as CSV file!');
}

function renderReportTable() {
  const tbody = document.getElementById('reportSessionTable');
  if (!tbody) return;

  const sampleRows = [
    { time: '14:48:10', lec: 'CS 301: Distributed Systems', res: '1080p Full HD', bw: '20.0 Mbps', buf: '22.4s', rtt: '28 ms', status: 'Optimal' },
    { time: '14:42:00', lec: 'CS 301: Distributed Systems', res: '1080p Full HD', bw: '19.2 Mbps', buf: '20.8s', rtt: '31 ms', status: 'Optimal' },
    { time: '14:35:45', lec: 'NET 410: TCP Congestion Lab', res: '720p HD', bw: '4.8 Mbps', buf: '17.2s', rtt: '68 ms', status: 'ABR Transition' },
    { time: '14:28:12', lec: 'NET 410: TCP Congestion Lab', res: '1080p Full HD', bw: '18.5 Mbps', buf: '24.1s', rtt: '34 ms', status: 'Optimal' },
    { time: '14:15:00', lec: 'AI 402: Deep Neural Networks', res: '1080p Full HD', bw: '22.0 Mbps', buf: '25.0s', rtt: '25 ms', status: 'Optimal' },
    { time: '14:02:30', lec: 'MATH 220: Linear Algebra', res: '1080p Full HD', bw: '21.5 Mbps', buf: '23.6s', rtt: '27 ms', status: 'Optimal' }
  ];

  tbody.innerHTML = sampleRows.map(r => `
    <tr>
      <td><code>${r.time}</code></td>
      <td><strong>${r.lec}</strong></td>
      <td><span class="badge ${r.res.includes('1080p') ? 'badge-purple' : 'badge-teal'}">${r.res}</span></td>
      <td>${r.bw}</td>
      <td><strong>${r.buf}</strong></td>
      <td>${r.rtt}</td>
      <td><span class="badge badge-green">${r.status}</span></td>
    </tr>
  `).join('');
}

// ==========================================================================
// 16. MY LEARNING & SETTINGS PERSISTENCE
// ==========================================================================
function renderEnrolledCourses() {
  const container = document.getElementById('enrolledCoursesList');
  if (!container) return;

  const enrolled = LECTURES_DATABASE.slice(0, 4);
  container.innerHTML = enrolled.map(c => `
    <div class="enrolled-course-row">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div class="mock-thumb ${c.gradient}" style="width: 60px; height: 42px; border-radius: 4px; padding: 0.2rem; flex-shrink: 0;">
          <span class="cat-pill">${c.category.split(' ')[0]}</span>
        </div>
        <div>
          <h4 style="font-size: 0.95rem; font-weight: 700;">${c.title}</h4>
          <span style="font-size: 0.78rem; color: var(--text-muted);">${c.instructor} • ${c.duration}</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <div style="width: 140px;">
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${c.progress}%;"></div></div>
          <span style="font-size: 0.7rem; color: var(--text-muted);">${c.progress}% completed</span>
        </div>
        <button class="btn btn-sm btn-primary" onclick="playLectureById('${c.id}')">Continue</button>
      </div>
    </div>
  `).join('');

  renderSavedBookmarks();
}

function renderSavedBookmarks() {
  const container = document.getElementById('savedBookmarksGrid');
  if (!container) return;

  const bookmarked = LECTURES_DATABASE.filter(l => StreamLearnState.preferences.bookmarks.includes(l.id));
  if (bookmarked.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem;">No saved lectures yet. Click "Save Lecture" on any lecture to view it here.</p>';
    return;
  }
  container.innerHTML = bookmarked.map(l => createLectureCardHtml(l)).join('');
}

function clearLearningHistory() {
  StreamLearnState.preferences.bookmarks = [];
  StreamLearnState.preferences.completedLectures = [];
  savePreferencesToStorage();
  renderEnrolledCourses();
  showToast('Learning history and saved bookmarks reset');
}

function saveUserSettings() {
  const qSelect = document.getElementById('prefDefaultQuality');
  const saverCheck = document.getElementById('prefDataSaver');
  const hwCheck = document.getElementById('prefHwAccel');
  const autoCheck = document.getElementById('prefAutoPlay');
  const presetSelect = document.getElementById('prefDefaultPreset');

  if (qSelect) StreamLearnState.preferences.defaultQuality = qSelect.value;
  if (saverCheck) StreamLearnState.preferences.dataSaver = saverCheck.checked;
  if (hwCheck) StreamLearnState.preferences.hardwareAccel = hwCheck.checked;
  if (autoCheck) StreamLearnState.preferences.autoPlay = autoCheck.checked;
  if (presetSelect) StreamLearnState.preferences.defaultPreset = presetSelect.value;

  savePreferencesToStorage();
  showToast('Preferences saved successfully to local browser storage!');
}

function resetAllLocalStorage() {
  localStorage.removeItem('streamlearn_preferences');
  showToast('All local storage cleared. Reloading platform defaults...');
  setTimeout(() => location.reload(), 1000);
}

function loadPreferencesFromStorage() {
  try {
    const raw = localStorage.getItem('streamlearn_preferences');
    if (raw) {
      const parsed = JSON.parse(raw);
      StreamLearnState.preferences = { ...StreamLearnState.preferences, ...parsed };
    }
  } catch (e) {
    console.log('Storage note', e);
  }
}

function savePreferencesToStorage() {
  try {
    localStorage.setItem('streamlearn_preferences', JSON.stringify(StreamLearnState.preferences));
  } catch (e) {
    console.log('Save note', e);
  }
}

// ==========================================================================
// 17. GLOBAL SEARCH AUTOCOMPLETE
// ==========================================================================
function initGlobalSearch() {
  const input = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchResultsDropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      dropdown.classList.remove('active');
      return;
    }

    const matches = LECTURES_DATABASE.filter(l => 
      l.title.toLowerCase().includes(q) ||
      l.instructor.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      dropdown.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); font-size: 0.8rem;">No matching lectures found</div>';
    } else {
      dropdown.innerHTML = matches.slice(0, 5).map(m => `
        <div class="search-result-item" onclick="playLectureById('${m.id}'); document.getElementById('searchResultsDropdown').classList.remove('active');">
          <div class="search-result-info">
            <h5>${m.title}</h5>
            <span>${m.instructor} • ${m.category}</span>
          </div>
          <span class="badge badge-blue">Watch</span>
        </div>
      `).join('');
    }
    dropdown.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== input) {
      dropdown.classList.remove('active');
    }
  });
}

// ==========================================================================
// 18. CHARTS ENGINE (CHART.JS WITH ROBUST CANVAS FALLBACK)
// ==========================================================================
let charts = {};

function initCharts() {
  renderReportTable();
  createDashboardNetworkChart();
  createMonitorThroughputChart();
  createMonitorLatencyChart();
  createSimulatorTimelineChart();
  createBufferComparisonChart();
  createAbrTransitionChart();
  createBandwidthAllocChart();
  createCdnLatencyChart();
  createReportCharts();
}

function updateAllCharts() {
  Object.values(charts).forEach(c => {
    if (c && typeof c.update === 'function') {
      try { c.update(); } catch (e) {}
    }
  });
}

function hasChartJs() {
  return typeof Chart !== 'undefined';
}

// Home Dashboard Network Chart
function createDashboardNetworkChart() {
  const canvas = document.getElementById('dashNetworkChart');
  if (!canvas) return;

  if (hasChartJs()) {
    const ctx = canvas.getContext('2d');
    charts.dashNetwork = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['0s', '5s', '10s', '15s', '20s', '25s', '30s'],
        datasets: [
          {
            label: 'Bandwidth (Mbps)',
            data: [19.2, 18.8, 20.4, 19.5, 17.8, 19.9, 20.2],
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Buffer Level (s)',
            data: [21.0, 22.4, 23.1, 22.8, 21.5, 22.9, 23.4],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
        }
      }
    });
  } else {
    drawCanvasFallback(canvas, 'Simulated Bandwidth & Buffer Headroom');
  }
}

// Monitor Charts
function createMonitorThroughputChart() {
  const canvas = document.getElementById('monThroughputChart');
  if (!canvas) return;

  if (hasChartJs()) {
    const ctx = canvas.getContext('2d');
    charts.monThroughput = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 15 }, (_, i) => `${i * 2}s`),
        datasets: [{
          label: 'Throughput (Mbps)',
          data: [18.5, 19.2, 19.8, 20.1, 18.9, 19.4, 20.2, 19.8, 18.6, 19.9, 20.4, 20.1, 19.5, 19.8, 20.0],
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.15)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
      }
    });
  } else {
    drawCanvasFallback(canvas, 'Real-Time Throughput (Mbps)');
  }
}

function createMonitorLatencyChart() {
  const canvas = document.getElementById('monLatencyChart');
  if (!canvas) return;

  if (hasChartJs()) {
    const ctx = canvas.getContext('2d');
    charts.monLatency = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 15 }, (_, i) => `${i * 2}s`),
        datasets: [{
          label: 'Latency (ms)',
          data: [28, 31, 29, 35, 32, 30, 28, 34, 30, 28, 29, 33, 31, 28, 29],
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.15)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
      }
    });
  } else {
    drawCanvasFallback(canvas, 'Simulated Latency (RTT) & Jitter');
  }
}

// Simulator Timeline Chart
function createSimulatorTimelineChart() {
  const canvas = document.getElementById('simBufferTimelineChart');
  if (!canvas) return;

  if (hasChartJs()) {
    const ctx = canvas.getContext('2d');
    charts.simTimeline = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['0s', '4s', '8s', '12s', '16s', '20s', '24s', '28s', '32s'],
        datasets: [
          {
            label: 'Client Buffer Level (s)',
            data: [8, 12, 16, 19.5, 21.0, 20.4, 22.1, 21.8, 22.4],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Panic Threshold (2.5s)',
            data: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
            borderColor: '#ef4444',
            borderDash: [5, 5],
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
      }
    });
  } else {
    drawCanvasFallback(canvas, 'Buffer Fill vs. Depletion Timeline');
  }
}

// Buffer Optimization Benchmark Chart
function createBufferComparisonChart() {
  const canvas = document.getElementById('bufferComparisonChart');
  if (!canvas) return;

  if (hasChartJs()) {
    const ctx = canvas.getContext('2d');
    charts.bufferComparison = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Buffering Stalls / hr', 'Stall Duration (sec)', 'TTFP Delay (sec)', 'Buffer Health Score'],
        datasets: [
          {
            label: 'Without Optimization (Naive)',
            data: [8.0, 16.4, 3.4, 52],
            backgroundColor: 'rgba(239, 68, 68, 0.85)'
          },
          {
            label: 'With StreamLearn Smart Buffer',
            data: [1.0, 1.8, 1.3, 94],
            backgroundColor: 'rgba(16, 185, 129, 0.85)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
      }
    });
  } else {
    drawCanvasFallback(canvas, 'Buffer Optimization Benchmark (Naive vs StreamLearn)');
  }
}

// ABR Transition Chart
function createAbrTransitionChart() {
  const canvas = document.getElementById('abrTransitionChart');
  if (!canvas) return;

  if (hasChartJs()) {
    const ctx = canvas.getContext('2d');
    charts.abrTransition = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['0s', '10s', '20s', '30s', '40s', '50s', '60s'],
        datasets: [
          {
            label: 'Bandwidth (Mbps)',
            data: [20, 18, 5.2, 4.8, 5.0, 16, 22],
            borderColor: '#0284c7',
            yAxisID: 'y',
            tension: 0.3
          },
          {
            label: 'Selected Bitrate (kbps)',
            data: [4500, 4500, 2500, 2500, 2500, 4500, 4500],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            yAxisID: 'y1',
            stepped: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { type: 'linear', position: 'left', title: { display: true, text: 'Mbps' }, grid: { color: '#f1f5f9' } },
          y1: { type: 'linear', position: 'right', title: { display: true, text: 'Bitrate (kbps)' }, grid: { display: false } }
        }
      }
    });
  } else {
    drawCanvasFallback(canvas, 'Bandwidth Fluctuations vs. ABR Bitrate Transition');
  }
}

// Bandwidth Allocation Chart
function createBandwidthAllocChart() {
  const canvas = document.getElementById('bandwidthAllocChart');
  if (!canvas) return;

  if (hasChartJs()) {
    const ctx = canvas.getContext('2d');
    const students = StreamLearnState.campus.students;
    charts.bandwidthAlloc = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: students.map(s => s.name.split(' ')[0] + ' ' + s.name.split(' ')[1]),
        datasets: [{
          label: 'Allocated Bandwidth (Mbps)',
          data: students.map(s => s.bw),
          backgroundColor: ['#0284c7', '#8b5cf6', '#0d9488', '#38bdf8', '#a78bfa']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
      }
    });
  } else {
    drawCanvasFallback(canvas, 'Campus Bandwidth Allocation per Student');
  }
}

function updateBandwidthAllocChart() {
  if (charts.bandwidthAlloc && hasChartJs()) {
    const students = StreamLearnState.campus.students;
    charts.bandwidthAlloc.data.datasets[0].data = students.map(s => s.bw);
    charts.bandwidthAlloc.update();
  }
}

// CDN Latency Chart
function createCdnLatencyChart() {
  const canvas = document.getElementById('cdnLatencyCompareChart');
  if (!canvas) return;

  if (hasChartJs()) {
    const ctx = canvas.getContext('2d');
    charts.cdnLatency = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['TTFB (ms)', 'RTT Latency (ms)', '2s Chunk Fetch (ms)'],
        datasets: [
          {
            label: 'Direct Origin Server',
            data: [185, 120, 1240],
            backgroundColor: '#f59e0b'
          },
          {
            label: 'Cached Edge Server (CDN)',
            data: [18, 16, 140],
            backgroundColor: '#10b981'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
      }
    });
  } else {
    drawCanvasFallback(canvas, 'CDN vs. Origin Latency Comparison');
  }
}

function updateCdnBenchmarkChart() {
  if (charts.cdnLatency && hasChartJs()) {
    charts.cdnLatency.data.datasets[1].data = [14, 15, 120];
    charts.cdnLatency.update();
  }
}

// Report Charts
function createReportCharts() {
  const barCanvas = document.getElementById('reportComparisonBarChart');
  const pieCanvas = document.getElementById('reportQualityPieChart');

  if (barCanvas && hasChartJs()) {
    const ctx = barCanvas.getContext('2d');
    charts.reportBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Avg Bitrate (x100 kbps)', 'Stall Events', 'QoE Score (/10)'],
        datasets: [
          {
            label: 'Baseline (No Opt)',
            data: [12, 8, 5.2],
            backgroundColor: 'rgba(239, 68, 68, 0.8)'
          },
          {
            label: 'StreamLearn Optimized',
            data: [41, 1, 9.4],
            backgroundColor: 'rgba(16, 185, 129, 0.8)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
      }
    });
  }

  if (pieCanvas && hasChartJs()) {
    const ctx = pieCanvas.getContext('2d');
    charts.reportPie = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['1080p Full HD', '720p HD', '480p SD'],
        datasets: [{
          data: [68, 24, 8],
          backgroundColor: ['#8b5cf6', '#0284c7', '#0d9488']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

// Fallback Canvas drawing when CDN is unreachable or offline
function drawCanvasFallback(canvas, title) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth || 400;
  const h = canvas.height = canvas.parentElement.clientHeight || 240;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h);

  // Draw title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(title, 15, 25);

  // Draw simulated line graph
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const points = [h - 40, h - 70, h - 90, h - 110, h - 85, h - 120, h - 130];
  const step = (w - 40) / (points.length - 1);
  points.forEach((y, i) => {
    const x = 20 + i * step;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw data nodes
  points.forEach((y, i) => {
    const x = 20 + i * step;
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ==========================================================================
// 19. BACKGROUND TELEMETRY & SIMULATION LOOP
// ==========================================================================
function startTelemetryBackgroundLoops() {
  // 1-second simulation clock
  setInterval(() => {
    const sim = StreamLearnState.simulator;
    const net = StreamLearnState.network;

    // Handle Unstable Flapping preset oscillation
    if (net.isUnstable) {
      const osc = Math.sin(Date.now() / 2500);
      net.downloadBw = Math.max(0.8, 4.5 + osc * 3.5);
      net.latency = Math.max(60, 180 + osc * 60);
      net.packetLoss = Math.max(1.0, 8.5 + osc * 4.0);
      updateSimDisplays();
      updateNetworkMonitorUI();
      evaluateAbrDecision();
    }

    // Dynamic buffer breathing when video is actively streaming
    if (StreamLearnState.player.isPlaying && !StreamLearnState.player.isBuffering) {
      // Consumption rate is 1.0s / s
      // Inflow rate depends on (downloadBw / selectedBitrate)
      const q = StreamLearnState.player.activeQuality;
      const ladder = StreamLearnState.qualityLadder[q];
      const reqBw = ladder ? ladder.minBw : 3.0;
      const ratio = net.downloadBw / reqBw;

      let delta = (ratio - 1.0) * 0.4;
      // Cap buffer fill
      StreamLearnState.player.simulatedBufferLevel = Math.max(
        0.5,
        Math.min(StreamLearnState.player.maxBufferSize, StreamLearnState.player.simulatedBufferLevel + delta)
      );

      // Tank fluid visual height
      const tankFluid = document.getElementById('tankFluid');
      const tankHeadroom = document.getElementById('tankHeadroomText');
      const tankDownload = document.getElementById('tankDownloadSpeed');
      const pct = (StreamLearnState.player.simulatedBufferLevel / StreamLearnState.player.maxBufferSize) * 100;
      
      if (tankFluid) tankFluid.style.height = `${pct}%`;
      if (tankHeadroom) tankHeadroom.textContent = `${StreamLearnState.player.simulatedBufferLevel.toFixed(1)} s`;
      if (tankDownload) tankDownload.textContent = `${ratio.toFixed(1)}x Playback`;

      // Simulator buffer tank
      const simFluid = document.getElementById('simTankFluid');
      const simVal = document.getElementById('simTankVal');
      const simLiveLevel = document.getElementById('simLiveBufferLevel');
      if (simFluid) simFluid.style.height = `${pct}%`;
      if (simVal) simVal.textContent = `${StreamLearnState.player.simulatedBufferLevel.toFixed(1)}s`;
      if (simLiveLevel) simLiveLevel.textContent = `${StreamLearnState.player.simulatedBufferLevel.toFixed(1)} sec`;

      // If buffer drops below panic threshold, initiate stall
      if (StreamLearnState.player.simulatedBufferLevel < StreamLearnState.bufferOptimization.minBufferThreshold) {
        triggerSimulatedStall();
      }
    }
  }, 1000);
}

// ==========================================================================
// 20. UTILITY FUNCTIONS & TOAST SYSTEM
// ==========================================================================
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue-light)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
    <span>${escapeHtml(message)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 3200);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
