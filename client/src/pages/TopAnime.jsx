import { useState } from 'react';
import { useGetTopAnimeQuery } from '../features/anime/animeApi';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeCardSkeleton } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';

const filters = [
  { value: '', label: 'All' },
  { value: 'tv', label: 'TV' },
  { value: 'movie', label: 'Movies' },
  { value: 'ova', label: 'OVA' },
  { value: 'upcoming', label: 'Upcoming' },
];

export default function TopAnime() {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isFetching } = useGetTopAnimeQuery({ filter, page });

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8">
      <h1 className="font-display text-4xl md:text-5xl text-luffy-text mb-6">Top Anime</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1); }}
            className={`px-5 py-2 rounded text-sm font-medium transition-all cursor-pointer ${
              filter === f.value
                ? 'bg-luffy-red text-white'
                : 'bg-luffy-surface2 text-luffy-muted hover:text-luffy-text border border-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {(isLoading || isFetching) && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && <p className="text-luffy-red">Failed to load top anime.</p>}

      {data?.data?.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.data.map((anime, i) => (
              <div key={anime.mal_id} className="relative">
                {(page - 1) * 25 + i + 1 <= 3 && (
                  <Badge variant="gold" className="absolute -top-1 -left-1 z-10 text-xs px-2">
                    #{(page - 1) * 25 + i + 1}
                  </Badge>
                )}
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-8 pb-16">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-luffy-surface2 rounded text-luffy-muted hover:text-luffy-text disabled:opacity-30 cursor-pointer transition-colors">
              Previous
            </button>
            <span className="px-4 py-2 text-luffy-muted">Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={!data?.pagination?.has_next_page} className="px-4 py-2 bg-luffy-surface2 rounded text-luffy-muted hover:text-luffy-text disabled:opacity-30 cursor-pointer transition-colors">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
