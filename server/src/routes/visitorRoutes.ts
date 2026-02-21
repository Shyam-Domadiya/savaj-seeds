import express from 'express';
import { logVisitor, getVisitors, updateVisitorTime } from '../controllers/visitorController';

const router = express.Router();

router.post('/', logVisitor);
router.put('/time', updateVisitorTime);
router.get('/', getVisitors);

export default router;
