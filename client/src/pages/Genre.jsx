import { useParams, useSearchParams } from 'react-router-dom';
import { useSearchAnimeQuery, useGetGenresQuery } from '../features/anime/animeApi';
import { useState, useEffect } from 'react';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeCardSkeleton } from '../components/ui/Skeleton';

export default function Genre() {
  const { id } = useParams();
  const { data: genresData } = useGetGenresQuery();
  const [page, setPage] = useState(1);

  const genre = genresData?.data?.find((g) => String(g.mal_id) === id);
  const { data, isLoading, error, isFetching } = useSearchAnimeQuery(
    { genre: id, page, orderBy: 'score' },
    { skip: !id }
  );

  useEffect(() => {
    setPage(1);
  }, [id]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-luffy-text">
          {genre?.name || 'Genre'}
        </h1>
        <p className="text-luffy-muted mt-1">{data?.pagination?.items?.total || 0} titles</p>
      </div>

      {(isLoading || isFetching) && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && <p className="text-luffy-red">Failed to load genre.</p>}

      {data?.data?.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.data.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
          {data.pagination?.has_next_page && (
            <div className="text-center mt-8">
              <button onClick={() => setPage((p) => p + 1)} className="px-6 py-2 bg-luffy-red text-white rounded hover:shadow-glow-red transition-all cursor-pointer" disabled={isFetching}>
                {isFetching ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
