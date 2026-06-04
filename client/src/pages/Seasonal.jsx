import { useState } from 'react';
import { useGetSeasonalAnimeQuery } from '../features/anime/animeApi';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeCardSkeleton } from '../components/ui/Skeleton';

const seasons = ['winter', 'spring', 'summer', 'fall'];

export default function Seasonal() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [season, setSeason] = useState(getSeason());

  const { data, isLoading, error } = useGetSeasonalAnimeQuery({ year, season });

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8">
      <h1 className="font-display text-4xl md:text-5xl text-luffy-text mb-6">Seasonal Anime</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        {seasons.map((s) => (
          <button
            key={s}
            onClick={() => setSeason(s)}
            className={`px-5 py-2 rounded text-sm font-medium transition-all cursor-pointer ${
              season === s
                ? 'bg-luffy-red text-white'
                : 'bg-luffy-surface2 text-luffy-muted hover:text-luffy-text border border-white/5'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <div className="ml-auto">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-luffy-surface border border-white/5 rounded px-3 py-2 text-sm text-luffy-text cursor-pointer"
          >
            {Array.from({ length: 10 }, (_, i) => now.getFullYear() - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && <p className="text-luffy-red">Failed to load seasonal anime.</p>}

      {data?.data?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.data.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}

function getSeason() {
  const m = new Date().getMonth();
  if (m >= 0 && m <= 2) return 'winter';
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  return 'fall';
}
