import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trending: [],
  seasonal: [],
  topRated: [],
  popularMovies: [],
  currentAnime: null,
  loading: false,
  error: null,
};

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setTrending(state, action) { state.trending = action.payload; },
    setSeasonal(state, action) { state.seasonal = action.payload; },
    setTopRated(state, action) { state.topRated = action.payload; },
    setPopularMovies(state, action) { state.popularMovies = action.payload; },
    setCurrentAnime(state, action) { state.currentAnime = action.payload; },
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
  },
});

export const {
  setTrending, setSeasonal, setTopRated,
  setPopularMovies, setCurrentAnime,
  setLoading, setError,
} = animeSlice.actions;

export default animeSlice.reducer;
