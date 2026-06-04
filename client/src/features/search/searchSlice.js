import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  filters: { type: '', status: '', genre: '', scoreMin: '', scoreMax: '', yearMin: '', yearMax: '', orderBy: '' },
  results: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action) { state.query = action.payload; },
    setFilter(state, action) { Object.assign(state.filters, action.payload); },
    setResults(state, action) { state.results = action.payload; },
    appendResults(state, action) { state.results.push(...action.payload); },
    setPage(state, action) { state.page = action.payload; },
    setHasMore(state, action) { state.hasMore = action.payload; },
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
    resetSearch(state) {
      state.query = '';
      state.filters = initialState.filters;
      state.results = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
});

export const {
  setQuery, setFilter, setResults, appendResults,
  setPage, setHasMore, setLoading, setError, resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
