import { Router } from 'express';
import { getAnimeInfo, getEpisodes, getSources, watchEpisode } from '../controllers/streamController.js';

const router = Router();

router.get('/info/:animeId', getAnimeInfo);
router.get('/episodes/:animeId', getEpisodes);
router.get('/sources/:episodeId', getSources);
router.get('/watch/:malId/:episode', watchEpisode);

export default router;
