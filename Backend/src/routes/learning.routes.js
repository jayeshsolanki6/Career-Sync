import express from 'express';
import { addSkillToLearningList, getLearningList, generateRoadmap, removeSkillFromLearningList, getCoursesForSkillController, updateSkillStatus } from '../controllers/learning.controllers.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protectedRoute);

router.post('/add', addSkillToLearningList);
router.get('/', getLearningList);
router.delete('/:id', removeSkillFromLearningList);
router.patch('/:id/status', updateSkillStatus);
router.post('/roadmap', generateRoadmap);
router.get('/courses/:skill', getCoursesForSkillController);

export default router;
