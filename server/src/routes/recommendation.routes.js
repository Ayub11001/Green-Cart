import express from 'express';
import { getRecommendations } from '../controllers/recommendation.controller.js';
import authUser from '../middleware/authUser.middleware.js';

const router = express.Router();

router.post('/get/:userId', authUser, getRecommendations);

export default router;
