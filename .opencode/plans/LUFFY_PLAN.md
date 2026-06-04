# LUFFY — Implementation Plan

## Phase 1: Project Scaffolding

- [ ] Initialize `client/` with Vite + React 18
- [ ] Initialize `server/` with Express
- [ ] Configure Tailwind CSS v3 with luffy theme extension (colors, fonts, animations, shadows)
- [ ] Set up CSS variables in `globals.css` + custom scrollbar + base reset
- [ ] Create `animations.css` with shimmer, glow-pulse, float, slide-up, fade-in
- [ ] Set up Redux Toolkit store with all 5 slices (anime, search, player, auth, ui)
- [ ] Set up RTK Query `animeApi.js` with Jikan API endpoints + 3 req/s throttle
- [ ] Set up React Router v6 with lazy-loaded routes + ScrollToTop
- [ ] Create SVG favicon (straw hat + "LUFFY" wordmark)

## Phase 2: Core UI Components

- [ ] Build `ui/` primitives: Button, Badge, Card, Skeleton, Modal, Input, Tooltip
- [ ] Build `layout/` components: Navbar (desktop + mobile bottom nav), Footer, PageWrapper
- [ ] Build `anime/` components: AnimeCard (with hover effect + skeleton), AnimeRow, HeroBanner
- [ ] Build Skeleton loaders matching all component dimensions

## Phase 3: Pages — Browsing (No Auth)

- [ ] **Home page** — HeroBanner (auto-cycle top 5 trending), Trending Now row, This Season grid, Top Rated row, Genre Pills, Continue Watching (conditional)
- [ ] **Search page** — debounced input, filters sidebar, infinite scroll grid, empty state
- [ ] **AnimeDetail page** — full-bleed cover, metadata grid, synopsis toggle, trailer embed, episodes list, characters scroll, recommendations grid, comments section
- [ ] **Genre page** — hero banner, anime grid, pagination, sort controls
- [ ] **Seasonal page** — season tabs, year picker, anime grid
- [ ] **TopAnime page** — filter tabs (All/TV/Movies/OVA/Upcoming), ranked list
- [ ] **NotFound page** — animated 404 with pirate theme

## Phase 4: Backend — Auth & User Data

- [ ] **MongoDB connection** (config/db.js)
- [ ] **Models**: User, WatchlistItem, Comment, StreamCache
- [ ] **Auth routes**: register, login, refresh, logout, me
- [ ] **Auth middleware**: JWT verification
- [ ] **User routes**: favorites CRUD, watchlist CRUD, history
- [ ] **Comment routes**: CRUD per anime
- [ ] **Error handler middleware** + rate limiting
- [ ] **CORS, Helmet, security headers**

## Phase 5: Auth — Frontend Integration

- [ ] **authSlice** — login, register, logout, hydrate from cookie
- [ ] **LoginModal** + **RegisterModal** (modal overlay, not page)
- [ ] **ProtectedRoute** component (redirects to auth modal)
- [ ] Profile page, Favorites page, Watchlist page

## Phase 6: Streaming

- [ ] **Stream controller** — proxy to Consumet API with MongoDB caching
- [ ] **Stream routes** — info, episodes, sources endpoints
- [ ] **VideoPlayer** component — custom HTML5 controls (play/pause, seek, volume, speed, fullscreen, PiP, skip intro)
- [ ] **EpisodeList** sidebar with progress indicators
- [ ] **playerSlice** — currentEpisode, progress, volume, speed
- [ ] **Watch page** — video player + episode sidebar + auto-play next

## Phase 7: Polish & Edge Cases

- [ ] Framer Motion page transitions + scroll reveal animations
- [ ] Error boundaries + toast notifications for all API errors
- [ ] Loading/empty/error states on every data-fetching component
- [ ] Keyboard navigation + focus states
- [ ] Responsive testing at all breakpoints
- [ ] `prefers-reduced-motion` support
- [ ] Final sweep: semantic HTML, lazy loading images, touch targets

## Build Order Rationale

**Phase 1→2→3** gets a browsable anime catalog working immediately with Jikan API (no auth needed). **Phase 4→5** adds persistence and user features. **Phase 6** adds streaming last since it depends on both the backend proxy and the player UI. **Phase 7** polishes everything.

Each phase is independently testable:
- After Phase 3: browse, search, view anime details
- After Phase 5: register, login, save favorites/watchlist
- After Phase 6: watch episodes with progress tracking
