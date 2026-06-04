# LUFFY — Full-Stack Anime Streaming & Discovery App

## Overview

A production-grade anime streaming and discovery web application named "LUFFY" — inspired by the spirit of One Piece. Full-stack React + Express + MongoDB app with Jikan API v4 for metadata and Consumet API for episode streaming.

---

## 1. Architecture

```
Browser (React 18 + Vite + Tailwind + Framer Motion)
  ├── HTTP (throttled 3 req/s) → Jikan API v4 (metadata, images)
  ├── HTTP → Express Server → MongoDB (auth, comments, watchlist, history)
  └── HTTP → Express Server → Consumet API (streaming URLs, cached 30min in MongoDB)
```

- Frontend calls Jikan directly for browsing (RTK Query with 3 req/s throttle)
- Frontend calls Express backend for auth, social, and streaming proxy
- Express proxies to Consumet API with MongoDB caching layer (30-min TTL)

---

## 2. Tech Stack

**Frontend:** React 18, Vite, React Router v6, Tailwind CSS v3, Redux Toolkit + RTK Query, Framer Motion, @dnd-kit/core, react-hot-toast, react-icons, axios, date-fns

**Backend:** Node.js + Express, MongoDB + Mongoose, jsonwebtoken + bcryptjs, cors, helmet, express-rate-limit, dotenv, morgan, nodemon, cookie-parser

**External APIs:** Jikan API v4 (free, no key), Consumet API (free, no key)

### Environment Variables (`server/.env`)

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | number | `5000` | Express server port |
| `MONGO_URI` | string | — | MongoDB connection string |
| `JWT_SECRET` | string | — | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | string | — | Secret for signing refresh tokens |
| `CLIENT_URL` | string | `http://localhost:5173` | Frontend origin for CORS |
| `CONSUMET_URL` | string | `https://api.consumet.org` | Consumet API base URL |
| `NODE_ENV` | string | `development` | Environment mode |

---

## 3. Folder Structure

```
luffy/
├── client/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── app/
│   │   │   ├── store.js
│   │   │   └── rootReducer.js
│   │   ├── features/
│   │   │   ├── anime/         (animeSlice.js, animeApi.js)
│   │   │   ├── search/        (searchSlice.js)
│   │   │   ├── player/        (playerSlice.js)
│   │   │   ├── auth/          (authSlice.js)
│   │   │   └── ui/            (uiSlice.js)
│   │   ├── components/
│   │   │   ├── ui/            (Button, Badge, Card, Skeleton, Modal, Input, Tooltip)
│   │   │   ├── layout/        (Navbar, Footer, PageWrapper, ScrollToTop, BottomNav)
│   │   │   ├── anime/         (AnimeCard, AnimeRow, HeroBanner, EpisodeCard, CharacterCard)
│   │   │   ├── player/        (VideoPlayer, EpisodeList, ProgressBar, VolumeControl)
│   │   │   └── auth/          (LoginModal, RegisterModal, ProtectedRoute)
│   │   ├── pages/             (Home, AnimeDetail, Watch, Search, Genre, Seasonal, TopAnime, Profile, Watchlist, Favorites, NotFound)
│   │   ├── hooks/             (useDebounce, useInfiniteScroll, useLocalStorage, useAnimeProgress)
│   │   ├── utils/             (formatters.js, constants.js, helpers.js)
│   │   ├── styles/            (globals.css, animations.css)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
└── server/
    ├── config/db.js
    ├── controllers/           (authController.js, userController.js, streamController.js, commentsController.js)
    ├── middleware/             (authMiddleware.js, errorHandler.js, rateLimiter.js)
    ├── models/                (User.js, WatchlistItem.js, Comment.js, StreamCache.js)
    ├── routes/                (authRoutes.js, userRoutes.js, streamRoutes.js, commentRoutes.js)
    ├── .env.example
    ├── .env
    └── server.js
```

---

## 4. Pages (11 total)

| Route | Page | Auth | Description |
|-------|------|------|-------------|
| `/` | Home | No* | HeroBanner, Trending, Seasonal, Top Rated, Genre Pills; Continue Watching row shown only for authenticated users |
| `/anime/:id` | AnimeDetail | No | Cover, metadata, synopsis, trailer, episodes, characters, recommendations, comments |
| `/watch/:animeId/:ep` | Watch | No | Video player, episode sidebar, progress tracking, auto-play |
| `/search?q=` | Search | No | Debounced search, filters (type/status/genre/score/year), infinite scroll |
| `/genre/:id` | Genre | No | Anime grid filtered by genre |
| `/seasonal` | Seasonal | No | Season tabs + year picker, anime grid |
| `/top` | TopAnime | No | Filter tabs (All/TV/Movies/OVA/Upcoming), ranked list |
| `/profile` | Profile | Yes | Avatar, stats, activity feed, settings |
| `/watchlist` | Watchlist | Yes | Tabs (Watching/Planning/Completed/Dropped), drag reorder |
| `/favorites` | Favorites | Yes | Grid of favorited anime |
| `*` | NotFound | No | Animated 404 with pirate theme |

---

## 5. State Management (Redux Toolkit)

**animeSlice:** trending, seasonal, top-rated lists
**searchSlice:** query, filters, results, loading/error
**playerSlice:** currentEpisode, progress, volume, speed, fullscreen, PiP
**authSlice:** user, token, isAuthenticated, favorites, watchlist
**uiSlice:** sidebar open/close, modal state, toasts

**RTK Query (animeApi.js):** getTrending, getAnimeById, getEpisodes, searchAnime, getTopAnime, getSeasonalAnime, getGenres, getCharacters — with 5-min cache invalidation and 3 req/s throttle middleware.

---

## 6. Backend API

### Auth
- `POST /api/auth/register` — email, username, password → access token + refresh cookie
- `POST /api/auth/login` — email, password → access token + refresh cookie
- `POST /api/auth/refresh` — validates refresh cookie, returns new access token
- `POST /api/auth/logout` — clears refresh cookie
- `GET /api/auth/me` — returns user from valid session (reads refresh cookie)

### User Data
- `GET/POST /api/user/favorites` — list/add
- `DELETE /api/user/favorites/:animeId` — remove
- `GET/POST /api/user/watchlist` — list/add
- `PATCH /api/user/watchlist/:animeId` — update status/progress
- `DELETE /api/user/watchlist/:animeId` — remove from watchlist
- `GET /api/user/history` — watch history

### Comments
- `GET /api/comments/:animeId` — list for anime
- `POST /api/comments` — create (auth required)
- `PUT /api/comments/:id` — update own comment (auth required)
- `DELETE /api/comments/:id` — delete own comment (auth required)

### Streaming
- `GET /api/stream/info/:animeId` — anime info from Consumet (cached)
- `GET /api/stream/episodes/:animeId` — episode list (cached)
- `GET /api/stream/sources/:episodeId` — video URLs (cached)

---

## 7. Database Schema

### User
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | auto |
| `email` | String | unique, required, lowercase |
| `username` | String | unique, required, 3-20 chars |
| `password` | String | required, bcrypt hashed |
| `refreshToken` | String | nullable, stores current refresh token hash for rotation/revocation |
| `avatar` | String | URL or initials fallback |
| `createdAt` | Date | auto |

### WatchlistItem
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | auto |
| `userId` | ObjectId | ref User, indexed |
| `animeId` | Number | Jikan/MAL anime ID |
| `status` | String | enum: `watching`, `planning`, `completed`, `dropped` |
| `progress` | Number | episodes watched (default 0) |
| `score` | Number | user rating (0-10, nullable) |
| `createdAt` | Date | auto |
| *Index* | `{ userId: 1, animeId: 1 }` | unique compound |

### Comment
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | auto |
| `userId` | ObjectId | ref User, indexed |
| `animeId` | Number | Jikan/MAL anime ID, indexed |
| `text` | String | required, max 1000 chars |
| `parentId` | ObjectId | null for top-level, ref Comment for replies |
| `createdAt` | Date | auto |

### StreamCache
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | auto |
| `cacheKey` | String | unique, e.g. `episode:123` or `info:21` |
| `data` | Mixed | cached JSON response |
| `cachedAt` | Date | auto |
| `expiresAt` | Date | TTL index, 30 min from cachedAt |

---

## 8. Streaming Architecture

- **Provider:** Consumet API (via `CONSUMET_URL` env var, default https://api.consumet.org)
- **Flow:** Client requests episode → Express checks MongoDB cache → cache hit serves immediately → cache miss fetches from Consumet, stores in MongoDB with 30-min TTL, returns result
- **Cache model:** `{ animeId, data, cachedAt, expiresAt }` with TTL index
- **Fallback:** If Consumet unreachable, serve stale cache + `X-Cache-Stale` header
- **Frontend player:** HTML5 `<video>` with custom controls (play/pause, seek, volume, speed 0.5x-2x, fullscreen, PiP, skip intro button with user-configurable offset, default 85s)

---

## 9. Design System

### Colors (CSS variables)
- `--bg: #0a0a0f` (near-black deep navy)
- `--surface: #12121a`
- `--surface-2: #1a1a26`
- `--surface-offset: #1f1f30`
- `--accent-red: #e63946`
- `--accent-gold: #ffd166`
- `--accent-teal: #06d6a0`
- `--text-primary: #f0f0f5`
- `--text-muted: #8888aa`
- `--text-faint: #4a4a6a`
- `--gradient-hero: linear-gradient(135deg, #e63946 0%, #1a0a12 60%)`

### Typography
- Display: `'Bebas Neue', 'Impact', sans-serif` (hero, episode numbers, section titles)
- Body: `'Inter', 'Helvetica Neue', sans-serif` (all UI text)
- Fluid scale: hero `clamp(3rem, 7vw, 8rem)`, headings `clamp(1.5rem, 3vw, 2.5rem)`, body `clamp(1rem, 1.1vw, 1.125rem)`

### Design Principles
- Dark mode only (no light mode)
- Glassmorphism cards: `backdrop-filter: blur(12px)` + `1px border rgba(255,255,255,0.06)`
- Red/gold glow hover effects via `box-shadow` pulse
- Full-bleed 16:9 and 2:3 poster imagery
- Skeleton loaders on all data-fetching components
- Section padding: `clamp(2rem, 5vw, 6rem)`

---

## 10. Key Components

**Navbar:** Sticky, glassmorphism `bg-black/60 backdrop-blur-md border-b border-white/5`, SVG logo (straw hat + "LUFFY" wordmark). Desktop: full horizontal nav links (Home, Seasonal, Top, Search). Mobile: persistent bottom tab bar + hamburger for secondary links → slide-in drawer from right.

**AnimeCard:** 2:3 poster, hover scale(1.04) + gold glow + play overlay, score badge, 2-line clamp title, skeleton loader

**HeroBanner:** Full-screen 100dvh, blurred cover background + dark overlay, Bebas Neue title, genre badges, score, Watch Now + Add to Watchlist buttons, auto-cycles top 5 trending anime from Jikan API every 6s with Framer Motion crossfade

**VideoPlayer:** 16:9, custom HTML5 controls, play/pause/seek/volume/speed/fullscreen/PiP, skip intro button with configurable offset (default 85s), next episode auto-play countdown 10s

**Skeleton:** Shimmer gradient `linear-gradient(90deg, #1a1a26 25%, #2a2a3a 50%, #1a1a26 75%)`, `background-size: 200% 100%`, `animation: shimmer 1.5s ease-in-out infinite`

---

## 11. Auth Flow

- Login/Register as modal overlay (not page navigation)
- JWT access token (15min) in Redux `authSlice`
- Refresh token (7d) in HTTP-only cookie
- On app mount: `GET /api/auth/me` via cookie to hydrate session
- `ProtectedRoute` component checks `isAuthenticated` → opens auth modal if unauthenticated

---

## 12. Animations & Micro-interactions

- Page transitions: opacity 0→1 + y 20→0, 0.3s, ease `[0.16,1,0.3,1]`
- All interactive: `transition-all duration-200`
- Scroll reveal: Framer Motion `whileInView`, `initial={{ opacity:0, y:30 }}`
- Custom CSS: shimmer, glow-pulse, float, slide-up, fade-in keyframes
- Bottom nav on mobile, expanded navbar on desktop

---

## 13. Responsive Breakpoints

| Breakpoint | Grid | Nav | Cards |
|-----------|------|-----|-------|
| Mobile (375px+) | 1 col | Bottom nav | 2 per row |
| Tablet (768px+) | 3 col | Icon sidebar | 3 per row |
| Desktop (1024px+) | 4-5 col | Full sidebar | 4-5 per row |
| Large (1280px+) | 5-6 col | Full sidebar | 5-6 per row |

---

## 14. Error Handling & Edge Cases

- Every data-fetching component: loading skeleton + error state + empty state
- Toast notifications for all API errors (react-hot-toast)
- RTK Query errors surfaced via middleware → toast
- Custom 404 for all unknown routes
- Protected routes redirect to auth modal
- Rate limit errors (429): show retry-after timer
- Streaming: Consumet failure → stale cache + warning
- Scroll-to-top on every route change
- All images: `loading="lazy"`, `width`/`height`, `alt` text

---

## 15. Quality Requirements

- Touch targets minimum 44x44px
- Keyboard navigation on all interactive elements
- No console errors in production
- Semantic HTML (`header`, `nav`, `main`, `section`, `article`)
- Code-split all pages with `React.lazy` + `Suspense`
- Tailwind config with all luffy palette colors, custom animations, glow shadows
- SVG favicon: straw hat silhouette + "LUFFY" text
- `prefers-reduced-motion` respected

---

## 16. Getting Started

```bash
# Server
cd server
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, etc
npm install
npm run dev                 # starts on :5000

# Client
cd ../client
npm install
npm run dev                 # starts on :5173
```

**Server scripts:** `dev` (nodemon), `start` (node)
**Client scripts:** `dev` (vite), `build` (vite build), `preview` (vite preview)

**Deployment notes:**
- Client: build with `npm run build`, serve static files from `dist/` or deploy to Vercel/Netlify
- Server: deploy to Railway/Render/Fly.io with `MONGO_URI` and `JWT_SECRET` set in env
- MongoDB: use MongoDB Atlas (free tier)

---

## 17. Testing Strategy

- **Framework:** Vitest (frontend), Supertest + Jest (backend)
- **Unit tests:** Redux slices, utility functions, formatters, hooks
- **Component tests:** Key components (AnimeCard, HeroBanner, VideoPlayer, Navbar) with React Testing Library
- **API tests:** Supertest for all Express routes (auth, user, comments, stream)
- **Coverage target:** 70%+ for utils and slices, critical paths for components
