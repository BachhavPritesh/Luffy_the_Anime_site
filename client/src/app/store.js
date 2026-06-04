import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { animeApi } from '../features/anime/animeApi';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(animeApi.middleware),
});
