const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validate = require('../middlewares/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} = require('../validators/taskValidators');

// GET /api/v1/tasks & POST /api/v1/tasks
router
  .route('/')
  .get(taskController.getAllTasks)
  .post(validate(createTaskSchema), taskController.createTask);

// PATCH /api/v1/tasks/:id/status (Dedicated status management endpoint)
router.patch(
  '/:id/status',
  validate(updateTaskStatusSchema),
  taskController.updateTaskStatus
);

// GET, PUT, DELETE /api/v1/tasks/:id
router
  .route('/:id')
  .get(taskController.getTaskById)
  .put(validate(updateTaskSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
