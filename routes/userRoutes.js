const userRoutes = require('express').Router();
const { createUser, getUsers } = require('../controllers/userController');

userRoutes.get('/', getUsers);
userRoutes.post('/', createUser);

module.exports = userRoutes;