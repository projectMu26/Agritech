import express from 'express';
import {
  requestConsultation,
  getMyConsultations,
  getAllConsultations,
  updateConsultation,
} from '../controllers/consultationController.js';
import { protect, expertOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').post(requestConsultation).get(expertOrAdmin, getAllConsultations);
router.route('/my').get(getMyConsultations);
router.route('/:id').put(expertOrAdmin, updateConsultation);

export default router;
