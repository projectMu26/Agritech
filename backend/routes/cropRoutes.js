import express from 'express';
import { getCrops, getCropById, createCrop, updateCrop, deleteCrop } from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All crop monitoring routes require authentication

router.route('/').get(getCrops).post(createCrop);
router.route('/:id').get(getCropById).put(updateCrop).delete(deleteCrop);

export default router;
