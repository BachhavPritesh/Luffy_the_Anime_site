import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getFavorites, addFavorite, removeFavorite,
  getWatchlist, addToWatchlist, updateWatchlistItem, removeFromWatchlist,
  getHistory,
} from '../controllers/userController.js';

const router = Router();

router.use(protect);

router.get('/favorites', getFavorites);
router.post('/favorites/:animeId', addFavorite);
router.delete('/favorites/:animeId', removeFavorite);

router.get('/watchlist', getWatchlist);
router.post('/watchlist', addToWatchlist);
router.patch('/watchlist/:animeId', updateWatchlistItem);
router.delete('/watchlist/:animeId', removeFromWatchlist);

router.get('/history', getHistory);

export default router;
