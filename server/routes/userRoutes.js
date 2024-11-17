const { Router } = require('express');
const {
  registerUser,
  loginUser,
  getUser,
  editUser,
  getAuthors,
  changeAvatar,
} = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware')

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-avatar', authMiddleware, changeAvatar);
router.get('/:id', getUser);
router.get('/', getAuthors);
router.patch('/edit-user', authMiddleware, editUser);

module.exports = router;
