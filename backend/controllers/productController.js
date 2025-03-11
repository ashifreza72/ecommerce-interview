const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');
const { protect } = require('./authController');
const { getImageUrl } = require('../config/upload');

// Helper function to generate full URL for images
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // Use the backend URL from environment variable or fallback to localhost
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath}`;
};

// Public Routes
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    const productsWithUrls = products.map((product) => ({
      ...product.toJSON(),
      image: getImageUrl(product.image),
    }));
    res.json(productsWithUrls);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productWithUrl = {
      ...product.toJSON(),
      image: getImageUrl(product.image),
    };
    res.json(productWithUrl);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
};

// Protected Admin Routes
exports.createProduct = [
  protect,
  async (req, res) => {
    try {
      const { name, description, price } = req.body;
      if (!name || !description || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const newProduct = await Product.create({
        name,
        description,
        price: parseFloat(price),
        image: imageUrl,
      });

      const productWithUrl = {
        ...newProduct.toJSON(),
        image: getImageUrl(imageUrl),
      };

      res.status(201).json({
        message: 'Product created successfully',
        product: productWithUrl,
      });
    } catch (error) {
      // Clean up uploaded file if there's an error
      if (req.file) {
        const imagePath = path.join(__dirname, '..', req.file.path);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message });
    }
  },
];

exports.updateProduct = [
  protect,
  async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Handle image update
      let imageUrl = product.image;
      if (req.file) {
        // Delete old image if it exists
        if (product.image) {
          const oldImagePath = path.join(__dirname, '..', product.image);
          fs.unlink(oldImagePath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error('Error deleting old image:', err);
            }
          });
        }
        imageUrl = `/uploads/${req.file.filename}`;
      }

      // Update product
      await product.update({
        name: name || product.name,
        description: description || product.description,
        price: price ? parseFloat(price) : product.price,
        image: imageUrl,
      });

      const productWithUrl = {
        ...product.toJSON(),
        image: getImageUrl(imageUrl),
      };

      res.json({
        message: 'Product updated successfully',
        product: productWithUrl,
      });
    } catch (error) {
      // Clean up new uploaded file if there's an error
      if (req.file) {
        const imagePath = path.join(__dirname, '..', req.file.path);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message });
    }
  },
];

exports.deleteProduct = [
  protect,
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Delete associated image file
      if (product.image) {
        const imagePath = path.join(__dirname, '..', product.image);
        fs.unlink(imagePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting image:', err);
          }
        });
      }

      await product.destroy();
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: error.message });
    }
  },
];
