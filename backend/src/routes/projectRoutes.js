import express from 'express';
import { createProject, getProjects, addMember, getProjectById } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, createProject).get(protect, getProjects);
router.route('/:id').get(protect, getProjectById);
router.route('/member').post(protect, admin, addMember);

export default router;
