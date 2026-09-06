const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const validate = require('../middlewares/validate');
const { generateTasksSchema } = require('../validators/aiValidators');

/**
 * AI Endpoints
 * POST /api/v1/ai/generate-tasks
 */
router.post(
  '/generate-tasks',
  validate(generateTasksSchema),
  aiController.generateTasks
);

module.exports = router;
