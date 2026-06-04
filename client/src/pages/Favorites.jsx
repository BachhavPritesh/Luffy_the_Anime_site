import { AnimeCardSkeleton } from '../components/ui/Skeleton';

export default function Favorites() {
  const favorites = [];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8">
      <h1 className="font-display text-4xl md:text-5xl text-luffy-text mb-6">Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 text-luffy-faint border border-dashed border-white/5 rounded">
          <p className="text-lg mb-1">No favorites yet</p>
          <p className="text-sm">Add anime to your favorites from their detail page</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((anime) => (
            <div key={anime.mal_id}>Anime Card</div>
          ))}
        </div>
      )}
    </div>
  );
}
