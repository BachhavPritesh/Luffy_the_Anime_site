import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { JIKAN_BASE_URL } from '../../utils/constants';

let requestCount = 0;
let lastRequestTime = 0;

export const animeApi = createApi({
  reducerPath: 'animeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: JIKAN_BASE_URL,
    fetchFn: async (...args) => {
      const now = Date.now();
      const elapsed = now - lastRequestTime;
      if (elapsed < 334) {
        await new Promise((r) => setTimeout(r, 334 - elapsed));
      }
      requestCount++;
      lastRequestTime = Date.now();
      return fetch(...args);
    },
  }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getTrending: builder.query({
      query: () => '/top/anime?filter=airing&limit=10',
    }),
    getAnimeById: builder.query({
      query: (id) => `/anime/${id}/full`,
    }),
    getEpisodes: builder.query({
      query: (id) => `/anime/${id}/episodes`,
    }),
    searchAnime: builder.query({
      query: ({ q, page = 1, type, status, genre, orderBy }) => {
        const params = new URLSearchParams({ q, page });
        if (type) params.set('type', type);
        if (status) params.set('status', status);
        if (genre) params.set('genres', genre);
        if (orderBy) params.set('order_by', orderBy);
        return `/anime?${params}`;
      },
    }),
    getTopAnime: builder.query({
      query: ({ filter, page = 1 }) =>
        `/top/anime${filter ? `?filter=${filter}` : ''}&page=${page}`,
    }),
    getSeasonalAnime: builder.query({
      query: ({ year, season }) => `/seasons/${year}/${season}`,
    }),
    getGenres: builder.query({
      query: () => '/genres/anime',
    }),
    getCharacters: builder.query({
      query: (id) => `/anime/${id}/characters`,
    }),
    getRecommendations: builder.query({
      query: (id) => `/anime/${id}/recommendations`,
    }),
  }),
});

export const {
  useGetTrendingQuery,
  useGetAnimeByIdQuery,
  useGetEpisodesQuery,
  useSearchAnimeQuery,
  useGetTopAnimeQuery,
  useGetSeasonalAnimeQuery,
  useGetGenresQuery,
  useGetCharactersQuery,
  useGetRecommendationsQuery,
} = animeApi;
