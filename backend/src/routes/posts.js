const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', (req, res, next) => {
  // Optional auth - attach user if token is present but don't require it
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    const jwt = require('jsonwebtoken');
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Invalid token, continue as guest
    }
  }
  next();
}, postController.getAll);

router.get('/:slug', (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    const jwt = require('jsonwebtoken');
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Invalid token, continue as guest
    }
  }
  next();
}, postController.getBySlug);

router.post('/:id/like', postController.like);

// Protected routes
router.post('/', auth, postController.create);
router.put('/:id', auth, postController.update);
router.delete('/:id', auth, adminAuth, postController.delete);

module.exports = router;
