# StreamLearn – Intelligent Video Streaming and Network Buffer Optimization for E-Learning

> **"Learn Without Limits. Stream Without Interruptions."**

StreamLearn is a modern, fully interactive e-learning video streaming platform built to demonstrate and optimize streaming video delivery under diverse and challenging network conditions. It incorporates client-side buffer models, adaptive bitrate algorithms (ABR), campus bandwidth management, content delivery network (CDN) edge caching, and interactive networking simulators.

---

## 🌟 Key Features & Interactive Modules

### 1. Modern Design & User Interface
- **Visual Design:** Premium, modern layout with white background, subtle elevation shadows, and light blue (`#0284c7`), purple (`#8b5cf6`), and teal (`#0d9488`) accents.
- **Left Sidebar Navigation:** 12 functional sections with active state management.
- **Compact Header:** Live search bar with instant autocomplete, network telemetry capsule, preset selector, system notifications, and student profile.
- **Responsive Layout:** Optimized across desktop, tablet, and mobile viewports.

### 2. Video Player with Custom Controls & Telemetry
- **Actual HTML5 Playback:** Uses reliable public domain H.264 video streams.
- **Custom Controls:**
  - Play, pause, forward 10s, rewind 10s.
  - Interactive timeline scrubber displaying both actual HTML5 buffered byte ranges and simulated buffer headroom.
  - Volume slider with instant mute toggle.
  - Playback speed control (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x).
  - Video quality selection (Auto ABR, 1080p, 720p, 480p, 360p, 240p).
  - Fullscreen toggle with keyboard shortcut (`F`).
  - **Stats for Nerds Overlay:** Real-time stream telemetry (resolution, bitrate, buffer fill, RTT latency, packet loss, dropped frames, codec, and CDN cache status).
  - **Simulate Network Stalling Button:** Directly test buffer depletion, spinner overlay, and recovery.

### 3. Video Library (12+ Academic Lectures)
- Categorized across 6 engineering and scientific disciplines:
  - **Computer Science** (Distributed Systems, Database Indexing)
  - **Artificial Intelligence** (Deep Neural Networks, Computer Vision)
  - **Mathematics** (Linear Algebra, Graph Theory)
  - **Networking** (TCP Congestion Control & BBR, HTTP/3 & QUIC)
  - **Programming** (Modern Asynchronous JS, Concurrent Go Goroutines)
  - **Engineering** (Digital Signal Processing, PID Control Systems)
- Features: Instant title/instructor search, category filter pills, duration sorting, and "Watch Now" routing.

### 4. Interactive Network Performance Monitor
- **Real-Time Telemetry:** Download bandwidth (Mbps), upload bandwidth (Mbps), round-trip latency (ms), packet loss (%), jitter delay variation (ms), and buffer health.
- **5 Network Condition Presets:**
  - *Excellent Network* (50 Mbps, 15ms RTT, 0.0% loss)
  - *Good Network* (20 Mbps, 35ms RTT, 0.2% loss)
  - *Moderate Network* (5 Mbps, 85ms RTT, 1.5% loss)
  - *Poor Network* (1.2 Mbps, 220ms RTT, 5.8% loss)
  - *Unstable Flapping Network* (Oscillating bandwidth, high jitter & packet loss)
- **Live Telemetry Charts:** Streaming throughput and latency profiles.

### 5. Interactive Streaming Performance Simulator
- Sliders for live adjustment:
  - Available Bandwidth (0.5 to 60 Mbps)
  - Network Latency (5 to 500 ms)
  - Packet Loss (0 to 25%)
  - Jitter (0 to 100 ms)
  - Target Buffer Size (5 to 60s)
  - Video Quality Selection (Auto vs 1080p-240p)
- **Visual Buffer Tank:** Animated liquid fill, critical panic waterline (2.5s), safe target line (12s), and max capacity (30s).
- **Physical Stream Pipe:** Visual packet animation showing chunk flow from Edge Server to Client Buffer to Video Player.

### 6. Intelligent Buffer Optimization Techniques
Demonstrates 5 core optimization algorithms:
1. **Adaptive Buffer Management:** Harmonic mean throughput estimation.
2. **Dynamic Buffer Sizing:** Buffer expansion during high jitter periods and reduction during stable periods to conserve memory.
3. **Intelligent Pre-Buffering:** Low-latency chunk pre-fetching for sub-second startup times.
4. **Buffer Threshold Hysteresis:** Prevents rapid resolution toggling during momentary dips.
5. **Intelligent Playback Recovery:** Enforces a 3-second recovery cushion after stalls to eliminate stutter loops.
- **Live Side-by-Side Benchmark:** Demonstrates naive fixed buffering vs. StreamLearn Smart Buffer engine under the same 5 Mbps bottleneck spike.

### 7. Adaptive Video Quality (ABR)
- **Ladder Hierarchy:** 1080p (4.5M), 720p (2.5M), 480p (1.2M), 360p (600k), 240p (300k).
- **Hybrid Decision Engine:** Evaluates bandwidth headroom and buffer occupancy.
- **Quality Switching History Log:** Live timestamped audit log detailing why each quality shift was triggered.
- **Dynamic Transition Graph:** Real-time visualization of bandwidth vs. selected bitrate curve.

### 8. University Campus Bandwidth Manager
- Simulates multi-student contention across a shared university backbone pipe (5 concurrent active students).
- Slider for total campus pipe (5 Mbps to 100 Mbps).
- Three allocation strategies:
  - **Unmanaged (Greedy):** First-come-first-served, leading to starvation for lower-priority streams.
  - **Fair-Share Allocation:** Equal bandwidth distribution across all active learners.
  - **Priority QoS Allocation:** Guarantees bandwidth for live interactive classes first, sharing remainder across recorded tutorials.

### 9. Content Delivery Network (CDN) & Edge Caching
- **Visual Architecture:** Origin Video Server (Central) ➔ Backbone ➔ Regional Edge Cache ➔ Student Devices.
- **Benchmark Tool:** Direct Origin Server vs. Cached Edge Server comparing TTFB (185ms vs 14ms) and segment fetch times.
- **Video Segmentation (Chunking):** Visual display of 2-second ISO-BMFF MPEG-DASH chunks and caching states.

### 10. Live Classes Simulation
- Virtual classroom view featuring active lecture stream, real-time sync metrics, raise-hand capability, emoji reactions, and live interactive student-instructor discussion chat.

### 11. Interactive Network Architecture Explorer
- 6-component interactive pipeline:
  1. Student Device
  2. Network Monitoring
  3. Adaptive Streaming Controller
  4. Buffer Optimization Module
  5. Regional CDN Edge Server
  6. Video Origin Server
- Clickable nodes displaying technical specifications, protocol stacks (HLS, MPEG-DASH, WebAssembly, TCP BBR, HTTP/3 QUIC), and role explanations.

### 12. Performance Analytics & Export
- Aggregated metrics: Total streaming duration, average video quality, buffering stall events, average latency, and QoE gain score.
- **Export Capabilities:**
  - **Download CSV Report:** Exports full RFC-4180 compliant CSV file with session timestamps and telemetry.
  - **Print / Export PDF:** Clean, dedicated print stylesheet.

---

## 🚀 How to Run and View in Browser Preview

### Zero Configuration or Server Required
The project is built entirely with clean vanilla **HTML5**, **CSS3**, and **JavaScript**, requiring no npm packages, node servers, or build steps.

1. **Option A: Direct File Open**
   - Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

2. **Option B: Antigravity Browser Preview**
   - Open Antigravity's built-in browser preview pointing to the local path:
     `file:///c:/Users/ASUS/OneDrive/Desktop/IP/ASSIGNMENT 5/Intelligent Video Streaming and Network Buffer Optimization for E-/index.html`
   - Or run a lightweight local static server if desired:
     ```powershell
     python -m http.server 8080
     ```
     and browse to `http://localhost:8080`.

---

## 📁 File Structure

```
├── index.html       # Complete semantic structure with all 12 modules & components
├── style.css        # Responsive stylesheet with custom color palette & animations
├── script.js        # Interactive simulation engines, ABR logic, charts & player controls
└── README.md        # Technical architecture, feature documentation & run guide
```

---

## 🔬 Mathematical and Networking Models Used

- **Harmonic Mean Throughput:**
  $$\text{Throughput}_{\text{harmonic}} = \frac{K}{\sum_{i=1}^K \frac{1}{T_i}}$$
  Filters out transient latency spikes when predicting available bandwidth.

- **Buffer Rate of Change:**
  $$\frac{dB(t)}{dt} = \frac{C(t)}{R(t)} - 1$$
  Where $C(t)$ is available network capacity, and $R(t)$ is selected video bitrate.

- **QoE (Quality of Experience) Metric:**
  $$\text{QoE} = \sum_{k=1}^N q(R_k) - \lambda \sum_{k=1}^N T_{\text{stall}, k} - \mu \sum_{k=1}^{N-1} |q(R_{k+1}) - q(R_k)|$$
  Balances high resolution against stall penalties and frequent resolution oscillations.
