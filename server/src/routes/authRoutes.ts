import express from 'express';
import { authUser, registerUser, logoutUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);

export default router;
