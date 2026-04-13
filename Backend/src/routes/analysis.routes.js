import { Router } from 'express';

import { uploadResumeAndJdController, getAnalysisHistoryController } from '../controllers/analysis.controllers.js';
import { uploadResumeAndJd } from '../middlewares/upload.middleware.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', protectedRoute, uploadResumeAndJd, uploadResumeAndJdController);
router.get('/history', protectedRoute, getAnalysisHistoryController);

export default router;
