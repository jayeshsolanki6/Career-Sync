import express from 'express';
import { addSkillToLearningList, getLearningList, generateRoadmap, removeSkillFromLearningList, getCoursesForSkillController } from '../controllers/learning.controllers.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protectedRoute);

router.post('/add', addSkillToLearningList);
router.get('/', getLearningList);
router.delete('/:id', removeSkillFromLearningList);
router.post('/roadmap', generateRoadmap);
router.get('/courses/:skill', getCoursesForSkillController);

export default router;
