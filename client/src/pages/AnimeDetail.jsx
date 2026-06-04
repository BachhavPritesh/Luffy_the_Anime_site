import { useParams, Link } from 'react-router-dom';
import { useGetAnimeByIdQuery, useGetEpisodesQuery, useGetCharactersQuery, useGetRecommendationsQuery } from '../features/anime/animeApi';
import { useState } from 'react';
import { FiPlay, FiStar, FiCalendar, FiClock } from 'react-icons/fi';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import AnimeCard from '../components/anime/AnimeCard';
import { DetailSkeleton } from '../components/ui/Skeleton';
import { formatScore, formatDate } from '../utils/formatters';

export default function AnimeDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetAnimeByIdQuery(id);
  const { data: episodesData } = useGetEpisodesQuery(id);
  const { data: charactersData } = useGetCharactersQuery(id);
  const { data: recsData } = useGetRecommendationsQuery(id);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  if (isLoading) return <DetailSkeleton />;
  if (error || !data?.data) return <div className="min-h-screen flex items-center justify-center text-luffy-muted">Failed to load anime details.</div>;

  const anime = data.data;

  return (
    <div>
      <div className="relative h-[50dvh] md:h-[60dvh] overflow-hidden">
        <img
          src={anime.images?.webp?.large_image_url}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-48 md:w-56 shrink-0 hidden md:block">
            <img
              src={anime.images?.webp?.large_image_url}
              alt={anime.title}
              className="w-full aspect-[2/3] rounded object-cover shadow-card"
            />
          </div>

          <div className="flex-1 space-y-4">
            <h1 className="font-display text-[clamp(2rem,5vw,4rem)] text-luffy-text leading-none">
              {anime.title}
            </h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <p className="text-luffy-muted text-lg">{anime.title_english}</p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {anime.score && <Badge variant="gold"><FiStar className="w-3 h-3 mr-1 inline" />{formatScore(anime.score)}</Badge>}
              {anime.rank && <Badge variant="red">#{anime.rank}</Badge>}
              {anime.episodes && <Badge>{anime.episodes} EP</Badge>}
              {anime.status && <Badge>{anime.status}</Badge>}
              {anime.aired?.from && <Badge><FiCalendar className="w-3 h-3 mr-1 inline" />{formatDate(anime.aired.from)}</Badge>}
              {anime.duration && <Badge><FiClock className="w-3 h-3 mr-1 inline" />{anime.duration}</Badge>}
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.genres?.map((g) => (
                <Link key={g.mal_id} to={`/genre/${g.mal_id}`}>
                  <Badge variant="default" className="cursor-pointer hover:bg-luffy-offset transition-colors">{g.name}</Badge>
                </Link>
              ))}
              {anime.studios?.map((s) => (
                <Badge key={s.mal_id} variant="teal">{s.name}</Badge>
              ))}
            </div>

            {anime.synopsis && (
              <div>
                <p className={`text-luffy-muted leading-relaxed ${!synopsisExpanded ? 'line-clamp-4' : ''}`}>
                  {anime.synopsis}
                </p>
                {anime.synopsis.length > 300 && (
                  <button onClick={() => setSynopsisExpanded(!synopsisExpanded)} className="text-luffy-red text-sm mt-1 hover:underline cursor-pointer">
                    {synopsisExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Link to={`/watch/${anime.mal_id}/1`}>
                <Button variant="primary" size="lg"><FiPlay className="w-5 h-5 mr-2" /> Watch Now</Button>
              </Link>
            </div>
          </div>
        </div>

        {anime.trailer?.url && (
          <section className="mt-12">
            <h2 className="font-display text-2xl text-luffy-text mb-4">Trailer</h2>
            <div className="aspect-video rounded overflow-hidden">
              <iframe src={anime.trailer.embed_url} className="w-full h-full" title="Trailer" allowFullScreen />
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="font-display text-2xl text-luffy-text mb-4">Episodes ({episodesData?.data?.length || 0})</h2>
          <div className="grid gap-2">
            {episodesData?.data?.slice(0, 24).map((ep) => (
              <Link
                key={ep.mal_id}
                to={`/watch/${anime.mal_id}/${ep.mal_id}`}
                className="flex items-center gap-4 p-3 rounded bg-luffy-surface2 hover:bg-luffy-offset transition-colors border border-white/5"
              >
                {ep.images?.jpg?.image_url && (
                  <img src={ep.images.jpg.image_url} alt="" className="w-20 aspect-video object-cover rounded" />
                )}
                <div>
                  <p className="text-sm text-luffy-red font-medium">Episode {ep.mal_id}</p>
                  <p className="text-luffy-text line-clamp-1">{ep.title || `Episode ${ep.mal_id}`}</p>
                </div>
              </Link>
            ))}
            {(episodesData?.data?.length || 0) > 24 && (
              <p className="text-luffy-faint text-sm text-center mt-2">+ more episodes available</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-luffy-text mb-4">Characters</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {charactersData?.data?.slice(0, 10).map((char) => (
              <div key={char.character.mal_id} className="shrink-0 w-32 text-center">
                <img
                  src={char.character.images?.webp?.image_url || char.character.images?.jpg?.image_url}
                  alt={char.character.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-white/5"
                />
                <p className="text-xs text-luffy-text line-clamp-1">{char.character.name}</p>
                <p className="text-xs text-luffy-faint">{char.role}</p>
              </div>
            ))}
          </div>
        </section>

        {recsData?.data?.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl text-luffy-text mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recsData.data.slice(0, 6).map((rec) => (
                <AnimeCard key={rec.entry.mal_id} anime={rec.entry} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 mb-16">
          <h2 className="font-display text-2xl text-luffy-text mb-4">Comments</h2>
          <div className="text-luffy-faint text-sm p-6 border border-dashed border-white/5 rounded text-center">
            Comments will be available after backend setup.
          </div>
        </section>
      </div>
    </div>
  );
}
