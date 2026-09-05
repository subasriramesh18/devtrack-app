const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');

/**
 * Controller for User Management using MongoDB & Mongoose
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const filter = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { handle: searchRegex },
        { role: searchRegex },
      ];
    }

    if (role) {
      filter.role = new RegExp(`^${role.trim()}$`, 'i');
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    return sendSuccess(res, users, 'Users retrieved successfully', 200, {
      total: users.length,
    });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(AppError.notFound(`User with ID '${id}' not found`));
    }

    return sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return next(AppError.conflict(`A user with email '${email}' already exists`));
    }

    const newUser = await User.create(req.body);
    return sendCreated(res, newUser, 'User created successfully');
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return next(AppError.notFound(`User with ID '${id}' not found`));
    }

    if (req.body.email && req.body.email.toLowerCase().trim() !== existingUser.email) {
      const emailConflict = await User.findOne({
        email: req.body.email.toLowerCase().trim(),
        _id: { $ne: id },
      });
      if (emailConflict) {
        return next(AppError.conflict(`A user with email '${req.body.email}' already exists`));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, updatedUser, 'User updated successfully');
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return next(AppError.notFound(`User with ID '${id}' not found`));
    }

    // Cascade: Unassign tasks assigned to this user
    await Task.updateMany({ assignee: id }, { assignee: null });

    // Cascade: Clear owner from projects owned by this user
    await Project.updateMany({ owner: id }, { owner: null });

    return sendSuccess(res, { id }, 'User deleted successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
