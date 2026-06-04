import { useRef } from 'react';
import AnimeCard from './AnimeCard';

export default function AnimeRow({ title, items, loading }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="font-display text-2xl md:text-3xl text-luffy-text">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-8 h-8 rounded-full bg-luffy-surface2 flex items-center justify-center text-luffy-muted hover:text-luffy-text transition-colors">&larr;</button>
          <button onClick={() => scroll(1)} className="w-8 h-8 rounded-full bg-luffy-surface2 flex items-center justify-center text-luffy-muted hover:text-luffy-text transition-colors">&rarr;</button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-2 scrollbar-hide snap-x snap-mandatory">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="min-w-[160px] md:min-w-[200px] snap-start">
                <div className="aspect-[2/3] rounded bg-luffy-surface2 animate-shimmer bg-gradient-to-r from-luffy-surface2 via-luffy-offset to-luffy-surface2 bg-[length:200%_100%]" />
              </div>
            ))
          : items?.map((anime) => (
              <div key={anime.mal_id} className="min-w-[160px] md:min-w-[200px] snap-start">
                <AnimeCard anime={anime} />
              </div>
            ))}
      </div>
    </section>
  );
}
