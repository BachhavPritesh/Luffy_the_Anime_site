import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useGetAnimeByIdQuery, useGetEpisodesQuery } from '../features/anime/animeApi';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiMinimize, FiSkipForward, FiChevronLeft } from 'react-icons/fi';
import { formatTime } from '../utils/helpers';
import { SKIP_INTRO_DEFAULT, AUTO_PLAY_COUNTDOWN } from '../utils/constants';

export default function Watch() {
  const { animeId, episode } = useParams();
  const { data: animeData } = useGetAnimeByIdQuery(animeId);
  const { data: episodesData } = useGetEpisodesQuery(animeId);

  const episodes = episodesData?.data || [];
  const currentIndex = episodes.findIndex((e) => String(e.mal_id) === episode);
  const currentEp = episodes[currentIndex];
  const nextEp = episodes[currentIndex + 1];

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [sourceLoading, setSourceLoading] = useState(true);
  const [sourceError, setSourceError] = useState(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimer = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * duration;
    }
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
    }
    setMuted(v === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(speed);
    const next = speeds[(idx + 1) % speeds.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += SKIP_INTRO_DEFAULT;
    }
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  const handleEnded = () => {
    if (nextEp && countdown === null) {
      setCountdown(AUTO_PLAY_COUNTDOWN);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = `/watch/${animeId}/${nextEp.mal_id}`;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setSourceLoading(true);
    setSourceError(null);
    setSourceUrl(null);

    fetch(`/api/stream/watch/${animeId}/${episode}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load streaming sources');
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const valid = data.sources?.find((s) => s.url && s.isM3U8) || data.sources?.[0];
        if (valid) {
          setSourceUrl(valid.url);
          setSourceLoading(false);
        } else {
          throw new Error('No video sources available');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setSourceError(err.message);
        setSourceLoading(false);
      });

    return () => { cancelled = true; };
  }, [animeId, episode]);

  return (
    <div className="pt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-4 pb-2">
        <Link to={`/anime/${animeId}`} className="inline-flex items-center gap-1 text-luffy-muted hover:text-luffy-text text-sm transition-colors">
          <FiChevronLeft className="w-4 h-4" /> {animeData?.data?.title || 'Back'}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 max-w-[1400px] mx-auto px-4 md:px-8 pb-8">
        <div className="flex-1">
          <div
            ref={containerRef}
            className="relative bg-black rounded-lg overflow-hidden group aspect-video"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => playing && setShowControls(false)}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              onClick={togglePlay}
              playsInline
              poster={currentEp?.images?.jpg?.image_url || animeData?.data?.images?.webp?.large_image_url}
              src={sourceUrl || undefined}
            />

            {sourceLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                <div className="w-10 h-10 border-4 border-luffy-red/30 border-t-luffy-red rounded-full animate-spin" />
              </div>
            )}

            {sourceError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-3">
                <p className="text-luffy-muted text-sm">{sourceError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 text-xs bg-luffy-red text-white rounded hover:bg-luffy-red/80 transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

            <div className={`absolute bottom-0 left-0 right-0 p-4 space-y-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="relative h-1 bg-white/20 rounded cursor-pointer group/seek" onClick={handleSeek}>
                <div className="absolute left-0 top-0 h-full bg-luffy-red rounded" style={{ width: `${(currentTime / duration) * 100 || 0}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-luffy-red rounded-full opacity-0 group-hover/seek:opacity-100 transition-opacity" style={{ left: `${(currentTime / duration) * 100 || 0}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="text-white hover:text-luffy-red transition-colors cursor-pointer">
                    {playing ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors cursor-pointer">
                      {muted || volume === 0 ? <FiVolumeX className="w-4 h-4" /> : <FiVolume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 accent-luffy-red"
                    />
                  </div>

                  <span className="text-xs text-white/70 font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <button onClick={skipIntro} className="text-xs text-luffy-gold hover:text-luffy-red transition-colors cursor-pointer px-2 py-1 border border-luffy-gold/30 rounded">
                    Skip Intro
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={changeSpeed} className="text-xs text-white/70 hover:text-white transition-colors cursor-pointer px-2 py-1 border border-white/10 rounded">
                    {speed}x
                  </button>
                  {nextEp && (
                    <button onClick={() => window.location.href = `/watch/${animeId}/${nextEp.mal_id}`} className="text-white/70 hover:text-white transition-colors cursor-pointer" title="Next Episode">
                      <FiSkipForward className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors cursor-pointer">
                    {fullscreen ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {countdown !== null && countdown > 0 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded text-sm">
                Next episode in {countdown}s
              </div>
            )}
          </div>

          <div className="mt-4">
            <h2 className="font-display text-2xl text-luffy-text">
              {currentEp?.title || `Episode ${currentIndex + 1}`}
            </h2>
            {currentEp?.aired && (
              <p className="text-sm text-luffy-faint">{currentEp.aired}</p>
            )}
          </div>
        </div>

        <div className="lg:w-80 shrink-0">
          <h3 className="font-display text-lg text-luffy-text mb-3">Episodes</h3>
          <div className="space-y-1 max-h-[60dvh] overflow-y-auto">
            {episodes.map((ep, i) => (
              <Link
                key={ep.mal_id}
                to={`/watch/${animeId}/${ep.mal_id}`}
                className={`flex items-center gap-3 p-2 rounded transition-colors ${
                  String(ep.mal_id) === episode
                    ? 'bg-luffy-red/20 border border-luffy-red/30'
                    : 'hover:bg-luffy-surface2 border border-transparent'
                }`}
              >
                {ep.images?.jpg?.image_url && (
                  <img src={ep.images.jpg.image_url} alt="" className="w-16 aspect-video object-cover rounded" />
                )}
                <div className="min-w-0">
                  <p className="text-xs text-luffy-red font-medium">EP {ep.mal_id}</p>
                  <p className="text-xs text-luffy-muted line-clamp-1">{ep.title || `Episode ${ep.mal_id}`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
