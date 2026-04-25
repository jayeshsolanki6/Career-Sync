import { Router } from 'express';
import { searchJobsController, getJobDetailsController } from '../controllers/job.controllers.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protectedRoute);

// GET /api/jobs/search?query=React+Developer&location=New+York&datePosted=week&jobType=fulltime&remoteOnly=false&page=1
router.get('/search', searchJobsController);

// GET /api/jobs/:jobId
router.get('/:jobId', getJobDetailsController);

export default router;
