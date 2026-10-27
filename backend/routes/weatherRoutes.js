import express from 'express';
import { getWeather, getPestAlerts } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/', getWeather);
router.post('/pest-alerts', getPestAlerts);

export default router;
