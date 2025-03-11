const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const { upload } = require('../config/upload');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes - require admin authentication
router.post('/', protect, upload.single('image'), createProduct);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
