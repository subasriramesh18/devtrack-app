const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');

/**
 * Controller for Task Management & Status Workflow using MongoDB & Mongoose
 */
const getAllTasks = async (req, res, next) => {
  try {
    const { projectId, project, assigneeId, assignee, status, priority, search } = req.query;
    const filter = {};

    const targetProject = projectId || project;
    if (targetProject) {
      filter.project = targetProject;
    }

    const targetAssignee = assigneeId || assignee;
    if (targetAssignee) {
      filter.assignee = targetAssignee;
    }

    if (status) {
      const normalizedStatus = status.toLowerCase().replace('_', '-');
      filter.status = normalizedStatus;
    }

    if (priority) {
      filter.priority = priority.toLowerCase();
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    const tasks = await Task.find(filter)
      .populate('project')
      .populate('assignee')
      .sort({ createdAt: -1 });

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
    const task = await Task.findById(id).populate('project').populate('assignee');

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
    const payload = { ...req.body };
    const projectId = payload.project || payload.projectId;
    const assigneeId = payload.assignee || payload.assigneeId;

    if (!projectId) {
      return next(AppError.badRequest('Project ID is required'));
    }

    // Validate that project exists
    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
      return next(
        AppError.badRequest(`Cannot create task: Project with ID '${projectId}' does not exist`)
      );
    }
    payload.project = projectId;

    // Validate assignee if provided
    if (assigneeId) {
      const userExists = await User.findById(assigneeId);
      if (!userExists) {
        return next(
          AppError.badRequest(`Cannot assign task: User with ID '${assigneeId}' does not exist`)
        );
      }
      payload.assignee = assigneeId;
    } else {
      payload.assignee = null;
    }

    const newTask = await Task.create(payload);
    await newTask.populate('project');
    await newTask.populate('assignee');

    return sendCreated(res, newTask, 'Task created successfully');
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingTask = await Task.findById(id);

    if (!existingTask) {
      return next(AppError.notFound(`Task with ID '${id}' not found`));
    }

    const payload = { ...req.body };
    const projectId = payload.project || payload.projectId;
    const assigneeId = payload.assignee !== undefined ? payload.assignee : payload.assigneeId;

    if (projectId) {
      const projectExists = await Project.findById(projectId);
      if (!projectExists) {
        return next(
          AppError.badRequest(`Project with ID '${projectId}' does not exist`)
        );
      }
      payload.project = projectId;
    }

    if (assigneeId) {
      const userExists = await User.findById(assigneeId);
      if (!userExists) {
        return next(
          AppError.badRequest(`User with ID '${assigneeId}' does not exist`)
        );
      }
      payload.assignee = assigneeId;
    } else if (assigneeId === null) {
      payload.assignee = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
      .populate('project')
      .populate('assignee');

    return sendSuccess(res, updatedTask, 'Task updated successfully');
  } catch (error) {
    return next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return next(AppError.notFound(`Task with ID '${id}' not found`));
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('project')
      .populate('assignee');

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
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
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
