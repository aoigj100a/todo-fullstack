// src/routes/stats.routes.ts
import { Router } from 'express';
import {
  getTodoStats,
  getCompletionTimeStats,
  getProductivityStats,
} from '../controllers/stats.controllers';

const router = Router();

router.get('/', getTodoStats);
router.get('/completion-time', getCompletionTimeStats);
router.get('/productivity', getProductivityStats);

export default router;
