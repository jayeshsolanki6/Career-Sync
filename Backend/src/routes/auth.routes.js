import { Router } from "express";
import { login, logout, signup, checkAuth } from '../controllers/auth.controllers.js'
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', protectedRoute, checkAuth);

export default router;
