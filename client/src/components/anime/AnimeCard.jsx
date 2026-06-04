import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import { formatScore } from '../../utils/formatters';
import Badge from '../ui/Badge';

export default function AnimeCard({ anime, index = 0 }) {
  const { mal_id, title, images, score, episodes, airing } = anime;

  return (
    <Link to={`/anime/${mal_id}`} className="group block">
      <div className="relative aspect-[2/3] rounded overflow-hidden bg-luffy-surface2">
        <img
          src={images?.webp?.large_image_url || images?.jpg?.large_image_url}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 rounded-full bg-luffy-red/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FiPlay className="w-6 h-6 text-white ml-0.5" />
          </motion.div>
        </div>
        {score && (
          <Badge variant="gold" className="absolute top-2 left-2">
            {formatScore(score)}
          </Badge>
        )}
        {episodes && (
          <Badge variant="red" className="absolute top-2 right-2">
            {airing ? 'Airing' : `${episodes} ep`}
          </Badge>
        )}
      </div>
      <div className="mt-2 space-y-0.5">
        <h3 className="text-sm font-body font-medium text-luffy-text line-clamp-2 leading-tight">
          {title}
        </h3>
      </div>
    </Link>
  );
}
