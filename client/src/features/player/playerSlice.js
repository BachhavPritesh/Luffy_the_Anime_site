import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentEpisode: null,
  episodes: [],
  progress: 0,
  volume: 1,
  isMuted: false,
  playbackSpeed: 1,
  isFullscreen: false,
  isPiP: false,
  isLoading: false,
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentEpisode(state, action) { state.currentEpisode = action.payload; },
    setEpisodes(state, action) { state.episodes = action.payload; },
    setProgress(state, action) { state.progress = action.payload; },
    setVolume(state, action) { state.volume = action.payload; },
    toggleMute(state) { state.isMuted = !state.isMuted; },
    setPlaybackSpeed(state, action) { state.playbackSpeed = action.payload; },
    toggleFullscreen(state) { state.isFullscreen = !state.isFullscreen; },
    togglePiP(state) { state.isPiP = !state.isPiP; },
    setPlayerLoading(state, action) { state.isLoading = action.payload; },
    setPlayerError(state, action) { state.error = action.payload; },
    resetPlayer() { return initialState; },
  },
});

export const {
  setCurrentEpisode, setEpisodes, setProgress,
  setVolume, toggleMute, setPlaybackSpeed,
  toggleFullscreen, togglePiP, setPlayerLoading,
  setPlayerError, resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
