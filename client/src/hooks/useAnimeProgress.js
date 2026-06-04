import { useLocalStorage } from './useLocalStorage';

export function useAnimeProgress(animeId) {
  const [progress, setProgress] = useLocalStorage(`progress-${animeId}`, {
    lastEpisode: 0,
    timestamp: 0,
  });

  const updateProgress = (episode, time) => {
    setProgress({ lastEpisode: episode, timestamp: time });
  };

  return { progress, updateProgress };
}
