const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const validate = require('../middlewares/validate');
const { createProjectSchema, updateProjectSchema } = require('../validators/projectValidators');

// GET /api/v1/projects & POST /api/v1/projects
router
  .route('/')
  .get(projectController.getAllProjects)
  .post(validate(createProjectSchema), projectController.createProject);

// GET /api/v1/projects/:id/tasks
router.get('/:id/tasks', projectController.getProjectTasks);

// GET, PUT, DELETE /api/v1/projects/:id
router
  .route('/:id')
  .get(projectController.getProjectById)
  .put(validate(updateProjectSchema), projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
