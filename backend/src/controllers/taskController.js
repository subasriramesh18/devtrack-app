const dataStore = require('../store/dataStore');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');

/**
 * Controller for Task Management & Status Workflow
 */
const getAllTasks = async (req, res, next) => {
  try {
    const { projectId, assigneeId, status, priority, search } = req.query;
    const tasks = await dataStore.getTasks({
      projectId,
      assigneeId,
      status,
      priority,
      search,
    });

    return sendSuccess(res, tasks, 'Tasks retrieved successfully', 200, {
      total: tasks.length,
    });
  } catch (error) {
    return next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await dataStore.getTaskById(id);

    if (!task) {
      return next(AppError.notFound(`Task with ID '${id}' not found`));
    }

    return sendSuccess(res, task, 'Task retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { projectId, assigneeId } = req.body;

    // Validate that associated project exists
    const projectExists = await dataStore.getProjectById(projectId);
    if (!projectExists) {
      return next(AppError.badRequest(`Cannot create task: Project with ID '${projectId}' does not exist`));
    }

    // Validate assignee if provided
    if (assigneeId) {
      const userExists = await dataStore.getUserById(assigneeId);
      if (!userExists) {
        return next(AppError.badRequest(`Cannot assign task: User with ID '${assigneeId}' does not exist`));
      }
    }

    const newTask = await dataStore.createTask(req.body);
    return sendCreated(res, newTask, 'Task created successfully');
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingTask = await dataStore.getTaskById(id);

    if (!existingTask) {
      return next(AppError.notFound(`Task with ID '${id}' not found`));
    }

    if (req.body.projectId) {
      const projectExists = await dataStore.getProjectById(req.body.projectId);
      if (!projectExists) {
        return next(AppError.badRequest(`Project with ID '${req.body.projectId}' does not exist`));
      }
    }

    if (req.body.assigneeId) {
      const userExists = await dataStore.getUserById(req.body.assigneeId);
      if (!userExists) {
        return next(AppError.badRequest(`User with ID '${req.body.assigneeId}' does not exist`));
      }
    }

    const updatedTask = await dataStore.updateTask(id, req.body);
    return sendSuccess(res, updatedTask, 'Task updated successfully');
  } catch (error) {
    return next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingTask = await dataStore.getTaskById(id);
    if (!existingTask) {
      return next(AppError.notFound(`Task with ID '${id}' not found`));
    }

    const updatedTask = await dataStore.updateTaskStatus(id, status);
    return sendSuccess(
      res,
      updatedTask,
      `Task status successfully updated to '${updatedTask.status}'`
    );
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.deleteTask(id);

    if (!deleted) {
      return next(AppError.notFound(`Task with ID '${id}' not found`));
    }

    return sendSuccess(res, { id }, 'Task deleted successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
