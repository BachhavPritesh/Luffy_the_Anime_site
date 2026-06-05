# FeaturedCarousel — Implementation Plan

## Overview

Create a new `FeaturedCarousel` component, add its skeleton to `Skeleton.jsx`, and update `Home.jsx` to use it instead of `HeroBanner`.

---

## Step 1: Create `FeaturedCarousel.jsx`

**File:** `src/components/anime/FeaturedCarousel.jsx`

Create the component with the following structure:

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPlus } from 'react-icons/fi';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { FeaturedCarouselSkeleton } from '../ui/Skeleton';
```

**State:**
- `current` (number, default 0) — active slide index
- `isPaused` (boolean, default false) — pause auto-slide on hover

**Logic:**
- `itemsArray = items?.slice(0, 5) || []`
- `useEffect` with `setInterval` at 6s, only fires when `!isPaused && itemsArray.length > 1`
- Interval cycles via `setCurrent((prev) => (prev + 1) % itemsArray.length)`
- `onMouseEnter` → `setIsPaused(true)`
- `onMouseLeave` → `setIsPaused(false)` + restart timer

**Early returns:**
- `loading` → `<FeaturedCarouselSkeleton />`
- `error || !itemsArray.length` → `null`

**Render structure:**

```jsx
<div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-20">
  <div className="relative h-[45vh] md:h-[55vh] rounded-2xl overflow-hidden shadow-xl">
    <AnimatePresence mode="wait">
      <motion.div
        key={anime.mal_id}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <img ... className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-transparent to-transparent" />
      </motion.div>
    </AnimatePresence>

    {/* Content overlay — bottom-left */}
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pb-12">
      <motion.div key={`content-${anime.mal_id}`} ...>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] ...">{anime.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {anime.score && <Badge variant="gold">{anime.score.toFixed(1)}</Badge>}
          {anime.episodes && <Badge variant="red">{anime.episodes} EP</Badge>}
          {anime.genres?.slice(0, 3).map((g) => <Badge key={g.mal_id}>{g.name}</Badge>)}
        </div>
        <p className="text-luffy-muted text-sm line-clamp-3 mb-6 max-w-xl">{anime.synopsis}</p>
        <div className="flex items-center gap-4">
          <Link to={`/anime/${anime.mal_id}`}>
            <Button variant="primary" size="lg"><FiPlay className="w-5 h-5 mr-2" /> Watch Now</Button>
          </Link>
          <Link to={`/anime/${anime.mal_id}`}>
            <Button variant="ghost" size="lg"><FiPlus className="w-5 h-5 mr-2" /> Details</Button>
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Dot navigation — bottom-right */}
    <div className="absolute bottom-4 right-4 flex gap-2">
      {itemsArray.map((_, i) => (
        <button
          key={i}
          onClick={() => { setCurrent(i); /* reset timer implicitly via state change */ }}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === current ? 'bg-luffy-red w-6' : 'bg-white/30'
          }`}
        />
      ))}
    </div>
  </div>
</div>
```

**Key differences from HeroBanner:**
- Wrapped in a `max-w-[1400px]` container with `pt-20` (navbar height + spacing)
- Carousel card uses `rounded-2xl` and fixed `h-[45vh] md:h-[55vh]`
- No full-screen (`100dvh`) or `-mt-16` compensation needed
- Hover pause added (`onMouseEnter`/`onMouseLeave`)

---

## Step 2: Add `FeaturedCarouselSkeleton` to `Skeleton.jsx`

**File:** `src/components/ui/Skeleton.jsx`

Add after the `HeroBannerSkeleton` export:

```jsx
export function FeaturedCarouselSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-20">
      <div className="h-[45vh] md:h-[55vh] rounded-2xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}
```

---

## Step 3: Update `Home.jsx`

**File:** `src/pages/Home.jsx`

Changes:
1. Replace `import HeroBanner from ...` with `import FeaturedCarousel from ...`
2. Replace `<HeroBanner items={trending?.data} loading={trendingLoading} error={trendingError} />` with `<FeaturedCarousel items={trending?.data} loading={trendingLoading} error={trendingError} />`
3. Remove the outer `<div>` wrapper around content (the `-mt-16 relative z-10` div)
4. Change its `className` from `"space-y-4 -mt-16 relative z-10"` to `"space-y-4 mt-6"`

Final structure:
```jsx
return (
  <div>
    <FeaturedCarousel items={trending?.data} loading={trendingLoading} error={trendingError} />
    <div className="space-y-4 mt-6">
      <AnimeRow title="Trending Now" ... />
      ...
    </div>
  </div>
);
```

---

## Verification

1. Run `npm run dev` and check the Home page
2. Confirm carousel appears below navbar with rounded corners
3. Confirm auto-slide advances every 6s
4. Confirm hover pauses the slide
5. Confirm dot clicks navigate correctly
6. Confirm skeleton shows during loading
7. Confirm error/null state returns `null` (page shows AnimeRows)
8. Confirm mobile layout works (shorter height, correct padding)

---

## Files Changed Summary

| File | Action |
|------|--------|
| `src/components/anime/FeaturedCarousel.jsx` | **Create** |
| `src/components/ui/Skeleton.jsx` | **Edit** — add `FeaturedCarouselSkeleton` |
| `src/pages/Home.jsx` | **Edit** — swap component, adjust spacing |
