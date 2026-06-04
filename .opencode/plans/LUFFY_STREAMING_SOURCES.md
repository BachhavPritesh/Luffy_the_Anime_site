# LUFFY — Wire Up Real Anime Streaming Sources

## Problem

The Watch page (`/watch/:animeId/:episode`) displays the correct anime poster but plays a hardcoded Big Buck Bunny demo video. The backend has streaming endpoints that proxy to Consumet API, but they expect AniList IDs while the frontend uses MyAnimeList (MAL) IDs everywhere — creating an ID mismatch that prevents real video from loading.

## Solution

Add a single new backend endpoint that resolves MAL IDs to AniList IDs via AniList's GraphQL API, then proxies to Consumet for streaming sources. The frontend calls this endpoint instead of using the hardcoded demo URL.

---

## 1. Backend Changes

### New endpoint: `GET /api/stream/watch/:malId/:episode`

Add to `server/routes/streamRoutes.js`:
```
GET /api/stream/watch/:malId/:episode  → watchEpisode
```

### New controller function: `watchEpisode` (in `server/controllers/streamController.js`)

1. **Resolve MAL ID to AniList ID** — Query AniList GraphQL API:
   ```graphql
   query ($idMal: Int) {
     Media(idMal: $idMal, type: ANIME) { id }
   }
   ```
   Cached in `StreamCache` with key `mal-map:{malId}`.

2. **Fetch episodes from Consumet** — `GET /meta/anilist/info/{anilistId}`. Returns episodes with Consumet-style IDs and episode numbers. Cached.

3. **Match episode by number** — Find the episode object where `episode.number === parseInt(episode)`.

4. **Fetch sources** — `GET /meta/anilist/watch/{episodeId}`. Returns `{ sources: [{ url, quality, isM3U8 }] }`. Cached.

5. **Return** — `{ sources, episode: { title, number, image, id } }`.

### Error handling per step

| Step | Failure mode | Response |
|------|-------------|----------|
| MAL→AniList resolve | Anime not found on AniList | `404 { error: "Anime not found on streaming service" }` |
| Episode fetch | Consumet unreachable | Serve stale cache → `503` if no cache |
| Episode match | Episode number not found | `404 { error: "Episode not found" }` |
| Source fetch | No video sources | `404 { error: "No video sources available" }` |

### Caching

Reuses existing `StreamCache` model with 30-min TTL. Cache keys:
- `mal-map:{malId}` — MAL→AniList ID resolution
- `watch-episodes:{anilistId}` — episode list
- `watch-sources:{episodeId}` — streaming sources

---

## 2. Frontend Changes

### `client/src/pages/Watch.jsx`

**Remove:**
- Line 152: `src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"`

**Add:**
- `useEffect` that fetches `GET /api/stream/watch/{animeId}/{episode}` when `animeId` or `episode` params change
- Three local state vars: `sourceUrl`, `sourceLoading`, `sourceError`
- Conditional rendering:
  - `sourceLoading` → centered spinner/pulse overlay over the video area
  - `sourceError` → red-tinted overlay with error message + retry button
  - `sourceUrl` → set as video `src`

**Edge cases:**
- Episode param changes → cancel pending fetch, start new one (cleanup in useEffect)
- Source URL is `null` or `undefined` → show "No streams available" state
- Fetch fails → show error with retry button (reuses `<Button>` component)

**No other changes** — player controls, layout, episode sidebar, skip-intro, auto-play-next, fullscreen all remain identical.

---

## 3. Files Changed

| File | Change |
|------|--------|
| `server/controllers/streamController.js` | Add `watchEpisode` function (~50 lines) |
| `server/routes/streamRoutes.js` | Add `GET /watch/:malId/:episode` route (1 line) |
| `client/src/pages/Watch.jsx` | Replace hardcoded src with dynamic fetch (~20 lines) |

**Total:** ~70 lines added, 1 line removed, 0 new dependencies, 0 new models.

---

## 4. Non-Goals

- No refactoring of the player into separate components
- No changes to the episode sidebar or layout
- No changes to the Redux player slice (local state is fine)
- No changes to any other page or API endpoint
- No PiP wiring (exists in slice, not part of this work)
