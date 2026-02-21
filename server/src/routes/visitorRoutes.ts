import express from 'express';
import { logVisitor, getVisitors } from '../controllers/visitorController';

const router = express.Router();

router.post('/', logVisitor);
router.get('/', getVisitors);

export default router;
