# Isooko Community Development Center — Website Requirements

## Overview
Build a complete multi-lingual website for the Isooko Community Development Center located in Masoro village, Rulindo district, Northern Province, Rwanda. The site promotes health, education, and social wellbeing programs for rural communities.

**Live domain**: isookocommunity.org

---

## 1. Technical Stack Requirements

### 1.1 Core Framework
- Vite 5 + React 18 + TypeScript (strict mode)
- react-router-dom v6 with lazy-loaded routes
- react-i18next + i18next for internationalization

### 1.2 Styling
- CSS Modules for component-scoped styles
- CSS custom properties (design tokens) — no Tailwind, no CSS-in-JS
- Earthy color palette: greens, browns, terracotta, cream

### 1.3 Forms
- React Hook Form v7 for all form validation and submission

### 1.4 SEO & Accessibility
- react-helmet-async for per-page meta tags
- WCAG 2.1 AA compliance target
- Semantic HTML5 elements throughout

---

## 2. Page Requirements

### 2.1 Home Page (`/`)
- Full-viewport hero banner with headline, sub-headline, CTA button
- Mission section (two-column: text + image)
- Impact stats strip (4 animated counters)
- Programs strip (3 program cards)
- Latest news section (3 most recent posts)
- Get-involved banner with donate and volunteer CTAs

### 2.2 About Page (`/about`)
- Hero with page title
- Our Story section with narrative body text
- Masoro Context section
- Milestones timeline (vertical, 5 milestones)
- Team section (grid of 5 team member cards)
- Vision & Values section (vision statement + 4 value cards)

### 2.3 Programs Page (`/programs`)
- Jump links navigation at top of page
- Three anchor sections: Health, Education, Social Wellbeing
- Each section: icon, title, description, list of offerings
- Bottom CTA linking to Get Involved

### 2.4 Impact Page (`/impact`)
- Hero section
- Stories section (3 story cards)
- Testimonials (3 blockquotes)
- Stats section (reuse ImpactCounter components)
- Photo gallery with lightbox

### 2.5 Get Involved Page (`/get-involved`)
- Hero section
- Donate section with external donate button
- Volunteer form section
- Partner section

### 2.6 News & Events Page (`/news-events`)
- Hero section
- Filter bar: All / News / Events
- Filtered list of news cards and event items
- Load More button (6 items at a time)

### 2.7 Blog Post Detail Page (`/news-events/:slug`)
- Dynamic route by slug
- If slug not found, redirect to /news-events
- SEO head with post meta
- Featured image, title, date, author, content
- Back link to news listing

### 2.8 Contact Page (`/contact`)
- Hero section
- Two-column layout: contact form + address/map
- Google Maps iframe embed
- Social media links

### 2.9 404 Not Found (`*`)
- Centered layout
- Large "404" display
- Translated error message
- Link back to Home

---

## 3. Internationalization Requirements

### 3.1 Supported Languages
- English (en) — primary
- Kinyarwanda (rw)
- French (fr)

### 3.2 Implementation
- Language preference stored in localStorage key `isooko-lang`
- Browser language auto-detected on first visit
- Language switcher available on all pages via Navbar
- All user-facing strings must use `t()` hook — no hardcoded text

### 3.3 Namespaces
Eight namespaces: common, home, about, programs, impact, getInvolved, newsEvents, contact

---

## 4. Component Requirements

### 4.1 Navigation
- Sticky navbar, transparent → solid on scroll (scrollY > 50)
- Skip-to-content link as first focusable element
- Logo left, nav links center/right, language switcher right
- Hamburger menu on mobile (< 768px)
- Focus trap on open mobile menu
- Active route gets aria-current="page"

### 4.2 Footer
- Dark background (--color-green-dark)
- Three columns: Quick Links, Programs, Contact Info
- Social icons: Facebook, Twitter, Instagram, LinkedIn
- All external links: target="_blank" rel="noopener noreferrer"
- Copyright row at bottom

### 4.3 Forms
- Contact form: name, email, subject, message
- Volunteer form: name, email, phone (optional), area of interest, message
- Both POST to VITE_API_URL endpoint
- Success and error banners after submit

### 4.4 Photo Gallery & Lightbox
- CSS Grid: 3 cols desktop, 2 tablet, 1 mobile
- Lightbox via React portal
- Keyboard navigation: arrows prev/next, Escape to close
- Focus trap while lightbox is open
- aria-modal and role="dialog"

### 4.5 Animated Impact Counters
- Animate from 0 to target on scroll into view
- Uses IntersectionObserver + requestAnimationFrame
- Respects prefers-reduced-motion (jumps to final value)

---

## 5. Performance & SEO Requirements

### 5.1 Code Splitting
- All page components lazy-loaded via React.lazy
- Vendor chunk: react, react-dom, react-router-dom
- i18n chunk: i18next, react-i18next, plugins

### 5.2 SEO
- Every page has unique title and description via SEOHead component
- Open Graph tags: og:title, og:description, og:image, og:url
- lang attribute on html element updated on language change

### 5.3 Accessibility
- All images have meaningful alt text (translated)
- Color contrast meets AA standards
- Focus indicators visible on all interactive elements
- Skip-to-content link present
- Form fields have associated labels

---

## 6. Data Requirements

All data is static TypeScript files in src/data/:
- 4 impact stats
- 3 programs (Health, Education, Social Wellbeing)
- 5 team members
- 4 blog posts
- 3 events
- 6 gallery images
- 3 testimonials
