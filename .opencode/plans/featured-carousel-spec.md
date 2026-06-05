# FeaturedCarousel — Design Spec

## Summary

Replace the full-screen `HeroBanner` on the Home page with a contained, rounded carousel component (`FeaturedCarousel`) positioned below the fixed navbar. The carousel auto-slides through trending anime with hover pause, showing image, title, score, genres, synopsis, and action buttons.

## Motivation

The current full-screen hero is visually overwhelming and pushes all other content below the fold. A contained carousel keeps the same featured-anime spotlight while giving immediate access to the rest of the page content and matching a more modern card-based layout.

## Component: FeaturedCarousel

**File:** `src/components/anime/FeaturedCarousel.jsx`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<Object>` | — | Trending anime objects from Jikan API |
| `loading` | `boolean` | `false` | Loading state from RTK Query |
| `error` | `boolean` | `false` | Error state from RTK Query |

**Data source:** `trending?.data` (same as current HeroBanner). The component internally caps at 5 slides via `items?.slice(0, 5)`.

## Layout & Styling

```
[Navbar - fixed top, h-16, z-40]
[Page content - pt-16]
  ┌─ max-w-[1400px] mx-auto px-4 md:px-8 ─┐
  │                                         │
  │  ┌─ rounded-2xl overflow-hidden ──────┐ │
  │  │  h-[55vh] md:h-[55vh] relative     │ │
  │  │  shadow-xl                         │ │
  │  │                                    │ │
  │  │  [slide image]                     │ │
  │  │  [gradient overlays]               │ │
  │  │  [content overlay bottom-left]     │ │
  │  │  [dot navigation bottom-right]     │ │
  │  └────────────────────────────────────┘ │
  │                                         │
  │  [AnimeRow: Trending Now]               │
  │  [AnimeRow: This Season]                │
  │  ...                                    │
  └─────────────────────────────────────────┘
```

- Outer container: `max-w-[1400px] mx-auto px-4 md:px-8` (matches site content width)
- Carousel card: `h-[45vh] md:h-[55vh] rounded-2xl overflow-hidden shadow-xl relative` (shorter on mobile, full height at `md:` breakpoint and above)

## Slide Content

Each slide overlays the same elements as the current HeroBanner:

1. **Background image** — `anime.images.webp.large_image_url`, full-cover
2. **Gradients** — `bg-gradient-to-t from-[#0a0a0f]` (bottom fade) and `bg-gradient-to-r from-[#0a0a0f]` (left fade)
3. **Title** — `font-display text-[clamp(2rem,5vw,3.5rem)]` positioned at bottom-left
4. **Badge row** — Score (gold), episode count (red), first 3 genres
5. **Synopsis** — `text-luffy-muted line-clamp-3`, max 2-3 lines
6. **Action buttons** — "Watch Now" (primary, links to `/anime/${anime.mal_id}`) + "Details" (ghost, links to same page)

All content positioned with `absolute bottom-0` + padding inside the card.

## Carousel Behavior

- **Auto-slide:** Advances every 6 seconds via `useEffect` + `setInterval`, loops back to slide 0 after the last slide
- **Hover pause:** `onMouseEnter`/`onMouseLeave` sets `isPaused` state; interval only fires when not paused
- **Navigation:** Dot indicators at `bottom-4 right-4`, clickable to jump to slide; clicking a dot resets the 6-second auto-slide timer
- **Transition:** framer-motion `AnimatePresence mode="wait"`, opacity + scale crossfade, 0.8s duration
- **Single item:** No auto-slide (interval disabled when `items.length < 2`)
- **Edge — no items:** Returns `null` (page degrades gracefully to AnimeRows)

## Skeleton & Error States

- **Loading:** `FeaturedCarouselSkeleton` — pulsing `rounded-2xl h-[55vh]` rectangle matching carousel shape
- **Error:** Returns `null` (same as current HeroBanner behavior)

## Home Page Changes

**File:** `src/pages/Home.jsx`

- Replace `import HeroBanner` with `import FeaturedCarousel`
- Replace `<HeroBanner ... />` usage with `<FeaturedCarousel ... />`
- Remove the `-mt-16 relative z-10` wrapper div (was compensating for full-screen hero height)
- Change to `mt-6` spacing between carousel and content below

## Files Changed

| File | Action |
|------|--------|
| `src/components/anime/FeaturedCarousel.jsx` | **Create** — new component |
| `src/components/ui/Skeleton.jsx` | **Edit** — add `FeaturedCarouselSkeleton` export |
| `src/pages/Home.jsx` | **Edit** — swap HeroBanner for FeaturedCarousel, adjust spacing |

## What's NOT Changing

- Navbar, Footer, BottomNav — unchanged
- AnimeRow, AnimeCard — unchanged
- Redux store, RTK Query endpoints — unchanged
- Other pages (Search, AnimeDetail, etc.) — unchanged
- No new API endpoints, no server changes
