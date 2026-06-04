import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPlus } from 'react-icons/fi';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { HeroBannerSkeleton } from '../ui/Skeleton';

export default function HeroBanner({ items, loading, error }) {
  const [current, setCurrent] = useState(0);
  const itemsArray = items?.slice(0, 5) || [];

  useEffect(() => {
    if (!itemsArray.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % itemsArray.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [itemsArray.length]);

  if (loading) return <HeroBannerSkeleton />;
  if (error || !itemsArray.length) return null;

  const anime = itemsArray[current];

  return (
    <section className="relative h-[100dvh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={anime.mal_id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img
            src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 pb-24 md:pb-16">
        <motion.div
          key={`content-${anime.mal_id}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-[clamp(3rem,7vw,8rem)] leading-none text-luffy-text mb-4 drop-shadow-lg">
            {anime.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {anime.score && <Badge variant="gold">{anime.score.toFixed(1)}</Badge>}
            {anime.episodes && <Badge variant="red">{anime.episodes} EP</Badge>}
            {anime.genres?.slice(0, 3).map((g) => (
              <Badge key={g.mal_id}>{g.name}</Badge>
            ))}
          </div>

          <p className="text-luffy-muted text-sm md:text-base line-clamp-3 mb-8 max-w-xl">
            {anime.synopsis}
          </p>

          <div className="flex items-center gap-4">
            <Link to={`/anime/${anime.mal_id}`}>
              <Button variant="primary" size="lg">
                <FiPlay className="w-5 h-5 mr-2" /> Watch Now
              </Button>
            </Link>
            <Link to={`/anime/${anime.mal_id}`}>
              <Button variant="ghost" size="lg">
                <FiPlus className="w-5 h-5 mr-2" /> Details
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 right-6 md:right-16 flex gap-2">
        {itemsArray.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-luffy-red w-6' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
