const Category = require('../models/Category');

const categoryController = {
  async getAll(req, res) {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const category = await Category.findBySlug(slug);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async create(req, res) {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.update(id, req.body);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.delete(id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = categoryController;
