import { useGetTrendingQuery, useGetTopAnimeQuery, useGetSeasonalAnimeQuery, useGetGenresQuery } from '../features/anime/animeApi';
import { useSelector } from 'react-redux';
import FeaturedCarousel from '../components/anime/FeaturedCarousel';
import AnimeRow from '../components/anime/AnimeRow';
import AnimeCard from '../components/anime/AnimeCard';
import { Link } from 'react-router-dom';
import { AnimeCardSkeleton } from '../components/ui/Skeleton';

export default function Home() {
  const { data: trending, isLoading: trendingLoading, error: trendingError } = useGetTrendingQuery();
  const { data: topRated, isLoading: topLoading } = useGetTopAnimeQuery({ page: 1 });
  const { data: seasonal, isLoading: seasonalLoading } = useGetSeasonalAnimeQuery({ year: new Date().getFullYear(), season: getSeason() });
  const { data: genres } = useGetGenresQuery();
  const { isAuthenticated } = useSelector((s) => s.auth);

  return (
    <div>
      <FeaturedCarousel items={trending?.data} loading={trendingLoading} error={trendingError} />

      <div className="space-y-4 mt-6">
        <AnimeRow title="Trending Now" items={trending?.data} loading={trendingLoading} />
        <AnimeRow title="This Season" items={seasonal?.data} loading={seasonalLoading} />
        <AnimeRow title="Top Rated All Time" items={topRated?.data} loading={topLoading} />

        <section className="py-8 px-4 md:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-luffy-text mb-4">Genres</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {genres?.data?.slice(0, 15).map((genre) => (
              <Link
                key={genre.mal_id}
                to={`/genre/${genre.mal_id}`}
                className="shrink-0 px-4 py-2 bg-luffy-surface2 rounded border border-white/5 text-luffy-muted hover:text-luffy-text hover:border-luffy-red/30 transition-all text-sm"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </section>

        {isAuthenticated && (
          <section className="py-8 px-4 md:px-8">
            <h2 className="font-display text-2xl md:text-3xl text-luffy-text mb-4">Continue Watching</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="col-span-full text-luffy-faint text-sm p-8 text-center border border-dashed border-white/5 rounded">
                No watch history yet. Start watching to see your progress here.
              </div>
            </div>
          </section>
        )}
      </div>
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
