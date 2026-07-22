import { Router } from 'express';
import {
  uploadProfileController,
  getProfileController,
  updateProfileController,
} from '../controllers/profile.controllers.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import multer from 'multer';

// Multer instance for the profile upload (resume only, one file)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    }
    cb(null, true);
  },
});

const router = Router();

router.use(protectedRoute);

// POST /api/profile/upload  — upload & AI-parse a new resume
router.post('/upload', upload.fields([{ name: 'resume', maxCount: 1 }]), uploadProfileController);

// GET  /api/profile          — fetch current user's profile
router.get('/', getProfileController);

// PUT  /api/profile          — manually edit skills / roles
router.put('/', updateProfileController);

export default router;
