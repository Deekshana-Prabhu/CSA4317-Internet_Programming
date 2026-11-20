# WANDERLY – Explore Beyond Boundaries
### Premium Responsive Travel & Lifestyle Platform

**Wanderly** is a complete, modern, and fully functional responsive travel discovery and lifestyle website built with vanilla **HTML5**, **CSS3**, and **JavaScript (ES6+)**. The platform demonstrates production-level responsive web design principles, adapting fluidly across smartphones, tablets, laptops, and ultra-wide desktop monitors without external frameworks or dependencies.

---

## 🌟 Key Features & Functional Modules

### 1. Adaptive Navigation Header
- **Desktop View**: Clean horizontal navigation bar with subtle underline animations, active scrollspy highlighting, saved trips counter badge, and a "Plan My Trip" CTA button.
- **Mobile/Tablet View**: Touch-optimized hamburger button that morphs into an animated close icon, triggering a slide-out navigation drawer with backdrop blur and smooth transitions.
- **Smart Behavior**: Automatically closes the drawer when selecting any navigation link, clicking outside the drawer, or pressing the `Escape` key.
- **Sticky Elevation**: Adds a translucent glassmorphic backdrop with soft shadow as the user scrolls.

### 2. Immersive Hero Section & Real-Time Escape Matcher
- Large scenic photography background with an atmospheric dark navy gradient overlay.
- Dynamic responsive typography using CSS `clamp()` (`Discover Places. Create Memories.`).
- **Interactive Search Interface**:
  - Destination input with auto-suggestions.
  - Travel date picker with automatic minimum date enforcement (today's date).
  - Number of travelers selector (Solo, Duo, Family, Expedition).
  - Real-time search that smoothly scrolls down and filters matching destinations.
- Quick statistical highlights strip: 120+ Havens, 4.95★ Rating, 100% Tailored, 24/7 Global Concierge.

### 3. Popular Destinations (CSS Grid & Interactive Filters)
- Multi-column CSS Grid layout (1 column on phones, 2 columns on tablets, 3 columns on desktops).
- **Interactive Filtering**: Filter by *All*, *Beaches*, *Adventure*, *Culture*, *Luxury*, *Nature*, or *Saved/Favorites*.
- **Favorites System**: Interactive heart toggle on each card that persists via `localStorage`, updates the header and filter counters, and triggers toast notifications.
- **"Plan Trip" Integration**: Clicking "Plan Trip" automatically selects that destination in the Travel Planner form and scrolls directly to it.
- **Empty State Fallback**: Graceful illustration and reset button if no destinations match the filter.

### 4. Travel Experiences
- 6 curated experience categories: *Adventure*, *Beaches*, *Nature*, *City Exploration*, *Cultural Experiences*, and *Luxury Travel*.
- Card hover zoom transitions and direct category links that dynamically filter the popular destinations grid.

### 5. Responsive Image Gallery with HD Lightbox
- Modern asymmetric CSS Grid on desktop; balanced 2-column grid on tablets; touch-friendly 1-column layout on phones.
- Interactive hover overlays with location tags, captions, and expansion cues.
- **Full Lightbox Modal**:
  - High-definition image display with loading spinner and smooth fade transition.
  - Location title, caption, and image counter (e.g. `3 / 8`).
  - Previous (`<`) and Next (`>`) navigation buttons.
  - Full keyboard support: `Escape` to close, `ArrowLeft` for previous, `ArrowRight` for next.
  - Touch-friendly backdrop click to dismiss.

### 6. Why Choose Us & Trust Metrics
- 4 comprehensive value proposition cards with custom SVG icons: *Carefully Selected Destinations*, *Easy Travel Planning*, *Flexible Travel Options*, and *Memorable Experiences*.
- Dark nocturnal trust metrics ribbon displaying verified milestones (50,000+ wanderers, 120+ destinations, 99.4% satisfaction, 24/7 concierge).

### 7. Interactive Travel Planner & Custom Blueprint Generator
- Complete travel planning form with client-side validation:
  - Destination selection.
  - Departure and return date picker with automated date range constraints (return date cannot precede departure date).
  - Number of travelers.
  - Travel style/category selection.
  - **Dynamic Budget Slider**: Real-time display of budget per person from $1,000 to $8,000+.
  - Preferred accommodation style selection (Luxury Resort, Boutique Villa, Eco-Lodge, Heritage Estate).
  - Special requests and preferences textarea.
- **Formatted Summary Output**:
  - Generates a custom booking reference (`REF #WND-2026-XXXX`).
  - Calculates trip duration in days and nights.
  - Computes total estimated travel investment.
  - Renders curated perks (private transfers, welcome champagne, flexible cancellation).
  - "Print / Save Itinerary" button with dedicated `@media print` clean styling.

### 8. Traveler Reviews
- Genuine traveler testimonial cards with customer avatars, names, trips taken, and 5-star ratings.
- Adapts smoothly from 1 column on mobile to 2 columns on tablets and desktops.

### 9. Newsletter Subscription
- Email input with regex validation.
- Friendly inline success messaging and instant toast confirmation.
- Prevents duplicate submissions.

### 10. Contact & Concierge Dispatch
- Contact details for global headquarters, 24/7 priority hotline, and direct email channels.
- Quick concierge inquiry form with field validation and immediate dispatch feedback.

### 11. Footer & Floating Controls
- Brand story, navigation columns, top destinations, travel styles, and social links.
- Floating scroll-to-top button with smooth scroll.
- Non-intrusive toast notification system.

---

## 📐 Mobile-First Responsive Design Architecture

Wanderly follows a strict **mobile-first CSS architecture**. All baseline styles are authored for compact mobile screens and systematically enhanced via progressive media queries.

### Responsive Breakpoints Matrix:

| Viewport Width | Device Category | Layout Behavior |
| :--- | :--- | :--- |
| **320px – 430px** | Smartphones (iPhone SE, iPhone 14/15, Galaxy S) | Single-column layouts, hamburger menu, full-width buttons & forms, compact padding, touch-friendly min 48px targets, zero horizontal overflow. |
| **601px – 1024px** | Tablets & Foldables (iPad Mini, iPad Air, Surface) | 2-column destination & experience grids, adapted hero search form (2x2 grid), balanced typography, 4-column trust ribbon. |
| **1025px – 1439px** | Small Laptops & Desktops | Full horizontal navigation, 3-column destination grid, 4-column asymmetric gallery, single-row hero search bar, split contact section. |
| **1440px+** | Large Desktop & Ultra-wide Displays | Constrained container (`1360px` max-width), spacious breathing room, enhanced hero display. |

### Responsive Units & Modern CSS Techniques Used:
- **`clamp()`**: Fluid typography for titles and headings without sudden jumps (`clamp(2rem, 5.5vw + 0.8rem, 4.25rem)`).
- **`rem` & `em`**: Scalable typography and element spacing relative to root font size.
- **`%` & `vw` / `vh`**: Flexible layout dimensions and full-screen hero media.
- **CSS Grid**: `grid-template-columns: repeat(...)` with flexible track sizes.
- **CSS Flexbox**: `justify-content`, `align-items`, and `flex-wrap: wrap`.
- **CSS Variables**: Unified design system for colors, shadows, radii, and transitions.
- **Responsive Images**: `width: 100%`, `height: auto`, and `object-fit: cover`.
- **`box-sizing: border-box`**: Global box model to prevent container overflow.

---

## 📁 File Structure

The project strictly contains exactly 4 clean files:

```
Exp 09_RESPONSIVE_WEBPAGE/
├── index.html     # Semantic HTML5 website structure and components
├── style.css      # Design tokens, mobile-first layouts, and media queries
├── script.js       # Interactive UI logic, validation, lightbox, and state
└── README.md       # Project documentation and responsive architecture guide
```

---

## 🚀 How to Run the Website

No Node.js, npm, package managers, or local server installations are required:

1. Simply double-click **`index.html`** or right-click and choose **Open with** (Google Chrome, Microsoft Edge, Safari, Firefox).
2. To test responsive design across screen widths:
   - Open Developer Tools in your browser (`F12` or `Ctrl + Shift + I`).
   - Toggle Device Toolbar (`Ctrl + Shift + M`).
   - Test viewports: **320px**, **375px**, **430px**, **768px**, **1024px**, and **1440px**.
   - Notice how all elements, navigation, cards, search forms, and typography seamlessly adapt.

---

## 🎨 Color Palette & Design System

- **Background Cream**: `#FAF7F2` (Warm Linen), `#F3ECE2` (Warm Sand)
- **Surfaces**: `#FFFFFF` (Card), `#0D1B2A` (Nocturnal Navy)
- **Primary Accent**: `#F26A36` (Warm Coral Orange), `#FF8A5B` (Soft Peach Orange)
- **Typography**: `#0F1D38` (Deep Navy), `#4A5B73` (Slate Navy), `#7889A2` (Muted)
- **Typography Families**: `'Outfit'` (Headings) & `'Plus Jakarta Sans'` (Body)
