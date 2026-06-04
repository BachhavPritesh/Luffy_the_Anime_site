import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentsController.js';

const router = Router();

router.get('/:animeId', getComments);
router.post('/:animeId', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
