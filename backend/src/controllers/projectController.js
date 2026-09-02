const dataStore = require('../store/dataStore');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');

/**
 * Controller for Project Management
 */
const getAllProjects = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const projects = await dataStore.getProjects({ category, status, search });
    return sendSuccess(res, projects, 'Projects retrieved successfully', 200, {
      total: projects.length,
    });
  } catch (error) {
    return next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await dataStore.getProjectById(id);

    if (!project) {
      return next(AppError.notFound(`Project with ID '${id}' not found`));
    }

    return sendSuccess(res, project, 'Project retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

const getProjectTasks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await dataStore.getProjectById(id);

    if (!project) {
      return next(AppError.notFound(`Project with ID '${id}' not found`));
    }

    const tasks = await dataStore.getTasksByProjectId(id);
    return sendSuccess(res, tasks, `Tasks for project '${project.name}' retrieved successfully`, 200, {
      projectId: id,
      totalTasks: tasks.length,
    });
  } catch (error) {
    return next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { leadId } = req.body;

    // Validate lead user existence if leadId provided
    if (leadId) {
      const userExists = await dataStore.getUserById(leadId);
      if (!userExists) {
        return next(AppError.badRequest(`Lead user with ID '${leadId}' does not exist`));
      }
    }

    const newProject = await dataStore.createProject(req.body);
    return sendCreated(res, newProject, 'Project created successfully');
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingProject = await dataStore.getProjectById(id);

    if (!existingProject) {
      return next(AppError.notFound(`Project with ID '${id}' not found`));
    }

    if (req.body.leadId) {
      const userExists = await dataStore.getUserById(req.body.leadId);
      if (!userExists) {
        return next(AppError.badRequest(`Lead user with ID '${req.body.leadId}' does not exist`));
      }
    }

    const updatedProject = await dataStore.updateProject(id, req.body);
    return sendSuccess(res, updatedProject, 'Project updated successfully');
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.deleteProject(id);

    if (!deleted) {
      return next(AppError.notFound(`Project with ID '${id}' not found`));
    }

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
