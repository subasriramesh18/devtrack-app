const aiService = require('../services/aiService');
const { sendSuccess } = require('../utils/response');

/**
 * Controller for AI-powered assistant features
 */

/**
 * POST /api/v1/ai/generate-tasks
 * Generates 4-6 sprint task suggestions from a project goal/description using Gemini
 */
const generateTasks = async (req, res, next) => {
  try {
    const goal =
      req.body.goal ||
      req.body.prompt ||
      req.body.description ||
      req.body.topic;

    const projectName = req.body.projectName || '';

    const tasks = await aiService.generateTasksForGoal(goal, projectName);

    return sendSuccess(
      res,
      tasks,
      'Suggested tasks generated successfully',
      200,
      {
        count: tasks.length,
        goal,
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateTasks,
};
