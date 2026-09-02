const dataStore = require('../store/dataStore');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');

/**
 * Controller for User Management
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const users = await dataStore.getUsers({ search, role });
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
    const user = await dataStore.getUserById(id);

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
    const existingUser = await dataStore.getUserByEmail(email);

    if (existingUser) {
      return next(AppError.conflict(`A user with email '${email}' already exists`));
    }

    const newUser = await dataStore.createUser(req.body);
    return sendCreated(res, newUser, 'User created successfully');
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingUser = await dataStore.getUserById(id);

    if (!existingUser) {
      return next(AppError.notFound(`User with ID '${id}' not found`));
    }

    if (req.body.email && req.body.email.toLowerCase() !== existingUser.email.toLowerCase()) {
      const emailConflict = await dataStore.getUserByEmail(req.body.email);
      if (emailConflict) {
        return next(AppError.conflict(`A user with email '${req.body.email}' already exists`));
      }
    }

    const updatedUser = await dataStore.updateUser(id, req.body);
    return sendSuccess(res, updatedUser, 'User updated successfully');
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.deleteUser(id);

    if (!deleted) {
      return next(AppError.notFound(`User with ID '${id}' not found`));
    }

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
