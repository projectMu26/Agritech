import express from 'express';
import { getPosts, getPostById, createPost, addComment, toggleLike } from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').get(getPostById);
router.route('/:id/comments').post(protect, addComment);
router.route('/:id/like').post(protect, toggleLike);

export default router;
