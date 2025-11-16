const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', categoryController.getAll);
router.get('/:slug', categoryController.getBySlug);

// Protected routes (admin only)
router.post('/', auth, adminAuth, categoryController.create);
router.put('/:id', auth, adminAuth, categoryController.update);
router.delete('/:id', auth, adminAuth, categoryController.delete);

module.exports = router;
