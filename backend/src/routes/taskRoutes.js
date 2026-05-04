import express from 'express';
import { createTask, getTasks, updateTaskStatus, getUserTasks } from '../controllers/taskController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, createTask);
router.route('/user').get(protect, getUserTasks);
router.route('/:projectId').get(protect, getTasks);
router.route('/:taskId/status').put(protect, updateTaskStatus);

export default router;
