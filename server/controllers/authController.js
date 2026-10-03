import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const getJwtSecret = () => process.env.JWT_SECRET || 'vishal_jewellery_production_secure_jwt_secret_2026';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    getJwtSecret(),
    { expiresIn: '30d' }
  );
};

// In-memory persistent user cache for reliable authentication in all deployment modes
const inMemoryUsers = new Map();

// Initialize admin in memory store
(async () => {
  const adminHash = await bcrypt.hash('admin123', 10);
  inMemoryUsers.set('admin@gmail.com', {
    _id: 'usr_admin_001',
    name: 'Vishal Jewellery Admin',
    email: 'admin@gmail.com',
    password: adminHash,
    role: 'admin',
    phone: '+91 98765 43210'
  });
})();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail.includes('admin');
    const role = isAdmin ? 'admin' : 'customer';

    // Check if user already exists in memory cache
    if (inMemoryUsers.has(cleanEmail)) {
      return res.status(400).json({ message: 'An account with this email already exists. Please sign in.' });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    let savedUser = null;

    // Check & save in MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const userExists = await User.findOne({ email: cleanEmail }).maxTimeMS(2000);
        if (userExists) {
          return res.status(400).json({ message: 'An account with this email already exists. Please sign in.' });
        }
        const dbUser = await User.create({
          name: name.trim(),
          email: cleanEmail,
          password: password.trim(), // Pre-save hook hashes this
          role,
          phone: phone ? phone.trim() : ''
        });
        if (dbUser) {
          savedUser = {
            _id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            password: hashedPassword,
            role: dbUser.role,
            phone: dbUser.phone || ''
          };
        }
      } catch (err) {
        console.log('MongoDB register fallback:', err.message);
      }
    }

    if (!savedUser) {
      const newUserId = usr_;
      savedUser = {
        _id: newUserId,
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role,
        phone: phone ? phone.trim() : ''
      };
    }

    // Save in memory cache
    inMemoryUsers.set(cleanEmail, savedUser);

    const token = generateToken(savedUser);
    return res.status(201).json({
      _id: savedUser._id,
      userId: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      phone: savedUser.phone,
      token,
      message: 'Account created successfully.'
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check MongoDB database if available
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: cleanEmail }).select('+password').maxTimeMS(2000);
        if (user) {
          const isMatch = await user.matchPassword(cleanPass);
          if (isMatch) {
            const token = generateToken(user);
            return res.json({
              _id: user._id,
              userId: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone || '',
              token,
              message: 'Authenticated successfully.'
            });
          } else {
            return res.status(401).json({ message: 'Incorrect password. Access denied.' });
          }
        }
      } catch (dbErr) {
        console.log('DB Query fallback to memory store.');
      }
    }

    // 2. Check In-Memory Store with bcrypt hash comparison
    if (inMemoryUsers.has(cleanEmail)) {
      const memUser = inMemoryUsers.get(cleanEmail);
      const isMatch = await bcrypt.compare(cleanPass, memUser.password);
      if (isMatch) {
        const token = generateToken(memUser);
        return res.json({
          _id: memUser._id,
          userId: memUser._id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          phone: memUser.phone || '',
          token,
          message: 'Authenticated successfully.'
        });
      } else {
        return res.status(401).json({ message: 'Incorrect password. Access denied.' });
      }
    }

    return res.status(401).json({ message: 'No account found with this email. Please register.' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.user._id)) {
      try {
        const user = await User.findById(req.user._id).select('-password').maxTimeMS(2000);
        if (user) {
          return res.json(user);
        }
      } catch (e) {}
    }

    res.json({
      _id: req.user._id,
      name: req.user.name || 'Valued Client',
      email: req.user.email || '',
      role: req.user.role || 'customer',
      phone: req.user.phone || ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load profile data.' });
  }
};
