const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');

/**
 * Helper to compute task metrics (progress %, totalTasks, completedTasks) for a project
 */
const enrichProjectWithTaskStats = async (projectDoc) => {
  const projectObj = projectDoc.toObject ? projectDoc.toObject() : { ...projectDoc };
  const projectId = projectDoc._id || projectDoc.id;

  const [totalTasks, completedTasks] = await Promise.all([
    Task.countDocuments({ project: projectId }),
    Task.countDocuments({ project: projectId, status: 'done' }),
  ]);

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    ...projectObj,
    totalTasks,
    completedTasks,
    progress,
  };
};

/**
 * Controller for Project Management using MongoDB & Mongoose
 */
const getAllProjects = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { techStack: searchRegex },
      ];
    }

    const projects = await Project.find(filter)
      .populate('owner')
      .sort({ createdAt: -1 });

    const enrichedProjects = await Promise.all(
      projects.map((p) => enrichProjectWithTaskStats(p))
    );

    return sendSuccess(res, enrichedProjects, 'Projects retrieved successfully', 200, {
      total: enrichedProjects.length,
    });
  } catch (error) {
    return next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate('owner');

    if (!project) {
      return next(AppError.notFound(`Project with ID '${id}' not found`));
    }

    const enrichedProject = await enrichProjectWithTaskStats(project);
    return sendSuccess(res, enrichedProject, 'Project retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

const getProjectTasks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return next(AppError.notFound(`Project with ID '${id}' not found`));
    }

    const tasks = await Task.find({ project: id })
      .populate('assignee')
      .populate('project')
      .sort({ createdAt: -1 });

    return sendSuccess(
      res,
      tasks,
      `Tasks for project '${project.name}' retrieved successfully`,
      200,
      {
        projectId: id,
        totalTasks: tasks.length,
      }
    );
  } catch (error) {
    return next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const ownerId = payload.owner || payload.leadId;

    if (ownerId) {
      const userExists = await User.findById(ownerId);
      if (!userExists) {
        return next(AppError.badRequest(`Owner/Lead user with ID '${ownerId}' does not exist`));
      }
      payload.owner = ownerId;
    }

    const newProject = await Project.create(payload);
    await newProject.populate('owner');

    const enrichedProject = await enrichProjectWithTaskStats(newProject);
    return sendCreated(res, enrichedProject, 'Project created successfully');
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingProject = await Project.findById(id);

    if (!existingProject) {
      return next(AppError.notFound(`Project with ID '${id}' not found`));
    }

    const payload = { ...req.body };
    const ownerId = payload.owner || payload.leadId;

    if (ownerId) {
      const userExists = await User.findById(ownerId);
      if (!userExists) {
        return next(AppError.badRequest(`Owner/Lead user with ID '${ownerId}' does not exist`));
      }
      payload.owner = ownerId;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).populate('owner');

    const enrichedProject = await enrichProjectWithTaskStats(updatedProject);
    return sendSuccess(res, enrichedProject, 'Project updated successfully');
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return next(AppError.notFound(`Project with ID '${id}' not found`));
    }

    // Cascade delete all tasks belonging to this project
    await Task.deleteMany({ project: id });

    return sendSuccess(res, { id }, 'Project and associated tasks deleted successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectTasks,
  createProject,
  updateProject,
  deleteProject,
};
