import express from 'express';
import { logVisitor } from '../controllers/visitorController';

const router = express.Router();

router.post('/', logVisitor);

export default router;
