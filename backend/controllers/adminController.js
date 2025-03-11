const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin)
      return res.status(400).json({ message: 'Admin already exists' });

    // Create new admin
    const newAdmin = await Admin.create({ username, email, password });
    res
      .status(201)
      .json({ message: 'Admin registered successfully', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ where: { email } });
    if (!admin)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT Token
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Admin Profile (Protected)
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create initial admin if none exists
exports.createInitialAdmin = async () => {
  try {
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        email: 'admin@example.com',
        password: hashedPassword
      });
      console.log('Initial admin account created');
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};
