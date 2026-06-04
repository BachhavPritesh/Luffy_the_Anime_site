import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchAnimeQuery } from '../features/anime/animeApi';
import { useDebounce } from '../hooks/useDebounce';
import AnimeCard from '../components/anime/AnimeCard';
import Input from '../components/ui/Input';
import { FiSearch as FiSearchIcon } from 'react-icons/fi';
import { AnimeCardSkeleton } from '../components/ui/Skeleton';
import { useEffect } from 'react';

const types = ['', 'tv', 'movie', 'ova', 'special'];
const statuses = ['', 'airing', 'complete', 'upcoming'];
const orderOptions = [
  { value: '', label: 'Default' },
  { value: 'score', label: 'Score' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'start_date', label: 'Start Date' },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [orderBy, setOrderBy] = useState(searchParams.get('order_by') || '');
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error, isFetching } = useSearchAnimeQuery(
    { q: debouncedQuery, page, type, status, orderBy },
    { skip: !debouncedQuery }
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, type, status, orderBy]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8">
      <h1 className="font-display text-4xl md:text-5xl text-luffy-text mb-6">Search</h1>

      <Input
        icon={FiSearchIcon}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search anime..."
        className="mb-6 text-lg"
      />

      <div className="flex flex-wrap gap-3 mb-8">
        <select value={type} onChange={handleFilterChange(setType)} className="bg-luffy-surface border border-white/5 rounded px-3 py-2 text-sm text-luffy-text cursor-pointer">
          <option value="">All Types</option>
          {types.slice(1).map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select value={status} onChange={handleFilterChange(setStatus)} className="bg-luffy-surface border border-white/5 rounded px-3 py-2 text-sm text-luffy-text cursor-pointer">
          <option value="">All Status</option>
          {statuses.slice(1).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select value={orderBy} onChange={handleFilterChange(setOrderBy)} className="bg-luffy-surface border border-white/5 rounded px-3 py-2 text-sm text-luffy-text cursor-pointer">
          {orderOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {!debouncedQuery && (
        <div className="text-center py-20 text-luffy-faint">
          <FiSearchIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Search for your favorite anime</p>
        </div>
      )}

      {(isLoading || isFetching) && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && <p className="text-luffy-red text-center py-8">Search failed. Please try again.</p>}

      {data?.data?.length > 0 && (
        <>
          <p className="text-sm text-luffy-muted mb-4">{data.pagination?.items?.count || data.data.length} results</p>
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

      {debouncedQuery && !isLoading && !isFetching && data?.data?.length === 0 && (
        <div className="text-center py-20 text-luffy-faint">
          <p className="text-xl mb-2">No results found</p>
          <p className="text-sm">Try different search terms or filters</p>
        </div>
      )}
    </div>
  );
}
