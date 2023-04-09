const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
  login,
  createUser,
} = require('../controllers/users');
const {
  getUserSchema,
  createUserSchema,
  loginSchema,
  updateUserSchema,
  updateAvatarSchema,
} = require('../middlewares/validation');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', createUser);
router.post('/signin', login);

router.get('/users', auth, getAllUsers);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:userId', auth,  getUserById);

router.patch('/users/me', auth, updateUserProfile);
router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;
