const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { createUserSchema, updateUserSchema } = require('../validators/userValidators');

// GET /api/v1/users & POST /api/v1/users
router
  .route('/')
  .get(userController.getAllUsers)
  .post(validate(createUserSchema), userController.createUser);

// GET, PUT, DELETE /api/v1/users/:id
router
  .route('/:id')
  .get(userController.getUserById)
  .put(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
