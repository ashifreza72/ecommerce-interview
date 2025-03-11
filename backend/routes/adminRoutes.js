const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { login } = require('../controllers/authController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', login);
router.get('/profile', authMiddleware, getAdminProfile); // Protected Route
router.get('/verify', protect, (req, res) => {
  res.json({ 
    message: 'Token is valid',
    admin: {
      id: req.admin.id,
      email: req.admin.email
    }
  });
});

module.exports = router;
