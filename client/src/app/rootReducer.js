import { combineReducers } from '@reduxjs/toolkit';
import animeReducer from '../features/anime/animeSlice';
import searchReducer from '../features/search/searchSlice';
import playerReducer from '../features/player/playerSlice';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import { animeApi } from '../features/anime/animeApi';

const rootReducer = combineReducers({
  anime: animeReducer,
  search: searchReducer,
  player: playerReducer,
  auth: authReducer,
  ui: uiReducer,
  [animeApi.reducerPath]: animeApi.reducer,
});

export default rootReducer;
