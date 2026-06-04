import axios from 'axios';
import StreamCache from '../models/StreamCache.js';

const CONSUMET_URL = process.env.CONSUMET_URL || 'https://api.consumet.org';
const CACHE_TTL = 30 * 60 * 1000;

async function fetchWithCache(cacheKey, fetchFn) {
  const cached = await StreamCache.findOne({ cacheKey });
  if (cached && cached.expiresAt > new Date()) {
    return { data: cached.data, fromCache: true };
  }
  try {
    const data = await fetchFn();
    await StreamCache.findOneAndUpdate(
      { cacheKey },
      { cacheKey, data, cachedAt: new Date(), expiresAt: new Date(Date.now() + CACHE_TTL) },
      { upsert: true }
    );
    return { data, fromCache: false };
  } catch (error) {
    if (cached) {
      return { data: cached.data, fromCache: true, stale: true };
    }
    throw error;
  }
}

export async function getAnimeInfo(req, res) {
  try {
    const { animeId } = req.params;
    const result = await fetchWithCache(`info:${animeId}`, () =>
      axios.get(`${CONSUMET_URL}/meta/anilist/info/${animeId}`).then((r) => r.data)
    );
    if (result.stale) res.set('X-Cache-Stale', 'true');
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch anime info' });
  }
}

export async function getEpisodes(req, res) {
  try {
    const { animeId } = req.params;
    const result = await fetchWithCache(`episodes:${animeId}`, () =>
      axios.get(`${CONSUMET_URL}/meta/anilist/episodes/${animeId}`).then((r) => r.data)
    );
    if (result.stale) res.set('X-Cache-Stale', 'true');
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch episodes' });
  }
}

export async function getSources(req, res) {
  try {
    const { episodeId } = req.params;
    const result = await fetchWithCache(`sources:${episodeId}`, () =>
      axios.get(`${CONSUMET_URL}/meta/anilist/watch/${episodeId}`).then((r) => r.data)
    );
    if (result.stale) res.set('X-Cache-Stale', 'true');
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch streaming sources' });
  }
}

const ANILIST_GRAPHQL = 'https://graphql.anilist.co';

async function resolveMalToAnilist(malId) {
  const result = await fetchWithCache(`mal-map:${malId}`, async () => {
    const query = `query ($idMal: Int) { Media(idMal: $idMal, type: ANIME) { id } }`;
    const response = await axios.post(ANILIST_GRAPHQL, { query, variables: { idMal: malId } });
    const media = response.data?.data?.Media;
    if (!media) {
      const err = new Error('Anime not found on streaming service');
      err.status = 404;
      throw err;
    }
    return { anilistId: media.id };
  });
  return result.data.anilistId;
}

export async function watchEpisode(req, res) {
  try {
    const { malId, episode } = req.params;

    const anilistId = await resolveMalToAnilist(Number(malId));

    const episodesResult = await fetchWithCache(`watch-episodes:${anilistId}`, () =>
      axios.get(`${CONSUMET_URL}/meta/anilist/info/${anilistId}`).then((r) => r.data)
    );
    const episodes = episodesResult.data?.episodes || [];
    const epNumber = Number(episode);
    const matched = episodes.find((e) => e.number === epNumber);
    if (!matched) {
      return res.status(404).json({ error: 'Episode not found' });
    }

    const sourcesResult = await fetchWithCache(`watch-sources:${matched.id}`, () =>
      axios.get(`${CONSUMET_URL}/meta/anilist/watch/${matched.id}`).then((r) => r.data)
    );
    const sources = sourcesResult.data?.sources || [];

    res.json({
      sources,
      episode: {
        id: matched.id,
        title: matched.title,
        number: matched.number,
        image: matched.image,
      },
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch streaming sources' });
  }
}
