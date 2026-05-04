import express from 'express';
import { getAiDescription } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected AI route
router.get('/generate-description', protect, getAiDescription);

export default router;
