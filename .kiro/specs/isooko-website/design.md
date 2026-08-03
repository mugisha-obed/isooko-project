# Isooko Website — Design Document

## Architecture Overview

```
src/
├── main.tsx           # Entry point, providers
├── App.tsx            # Layout shell (Navbar + Outlet + Footer)
├── router.tsx         # Route definitions (all lazy)
├── i18n.ts            # i18next initialization
├── styles/            # Global CSS (tokens, global, typography)
├── hooks/             # Custom React hooks
├── data/              # Static TypeScript data files
├── components/        # Reusable UI components
└── pages/             # Route-level page components
```

## Design Tokens

```css
/* Colors */
--color-green-dark: #2D6A4F
--color-green-mid: #52B788
--color-brown-dark: #7F5539
--color-brown-mid: #9C6644
--color-terracotta: #BC6C25
--color-cream: #FAF7F2
--color-cream-dark: #F0EAE0
--color-text-primary: #1A1A1A
--color-text-muted: #5A5A5A

/* Typography */
--font-heading: 'Playfair Display', serif
--font-body: 'Inter', sans-serif

/* Spacing scale: 4px base */
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-24: 6rem     /* 96px */
```

## Component Architecture

### Layout Components
- `Navbar` — sticky header, scroll-aware, mobile hamburger
- `Footer` — dark, 3-column, social icons
- `LanguageSwitcher` — EN/RW/FR toggle buttons

### Utility Components
- `SEOHead` — helmet wrapper
- `Spinner` — loading indicator

### Feature Components
- `HeroBanner` — full-viewport, bg image + overlay
- `ImpactCounter` — animated number with IntersectionObserver
- `ProgramCard` — icon + title + description + link
- `NewsCard` — image + meta + excerpt
- `TeamMemberCard` — photo + name + role
- `PhotoGallery` — CSS grid with Lightbox trigger
- `Lightbox` — portal, keyboard nav, focus trap
- `ContactForm` — RHF, POST to API
- `VolunteerForm` — RHF, POST to API

## Hook Designs

### useIntersectionObserver
```ts
function useIntersectionObserver(
  ref: RefObject<Element>,
  options?: IntersectionObserverInit
): boolean  // isIntersecting
```

### useCounter
```ts
function useCounter(
  target: number,
  duration: number,
  enabled: boolean
): number  // current animated value
```

### useFocusTrap
```ts
function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  isActive: boolean
): void
```

## Routing

```tsx
// All routes lazy-loaded
const Home = lazy(() => import('./pages/Home/Home'))
// ... etc

<Route path="/" element={<App />}>
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />
  <Route path="programs" element={<Programs />} />
  <Route path="impact" element={<Impact />} />
  <Route path="get-involved" element={<GetInvolved />} />
  <Route path="news-events" element={<NewsEvents />} />
  <Route path="news-events/:slug" element={<BlogPost />} />
  <Route path="contact" element={<Contact />} />
  <Route path="*" element={<NotFound />} />
</Route>
```

## i18n Setup

```ts
i18next
  .use(HttpBackend)        // loads from /public/locales/
  .use(LanguageDetector)   // localStorage → navigator
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'rw', 'fr'],
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common','home','about','programs','impact','getInvolved','newsEvents','contact'],
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'isooko-lang',
    },
  })
```

## Data Type Interfaces

```ts
interface ImpactStat { id: string; value: number; suffix: string; labelKey: string }
interface Program { id: string; icon: string; titleKey: string; descKey: string; offerings: string[] }
interface TeamMember { id: string; name: string; roleKey: string; photo: string }
interface BlogPost { slug: string; titleKey: string; excerptKey: string; contentKey: string; date: string; author: string; featuredImage: string; category: 'news'|'event' }
interface Event { id: string; titleKey: string; date: string; time: string; locationKey: string; descKey: string }
interface GalleryImage { id: string; src: string; altKey: string }
interface Testimonial { id: string; quoteKey: string; attribution: string; roleKey: string }
```
