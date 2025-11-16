const Post = require('../models/Post');
const Category = require('../models/Category');

const postController = {
  async getAll(req, res) {
    try {
      const { status, category, search, limit, offset } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (search) filters.search = search;
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);

      // If not authenticated or not admin, only show published posts
      if (!req.user || req.user.role !== 'admin') {
        filters.status = 'published';
      }

      const posts = await Post.findAll(filters);

      res.json({
        posts,
        pagination: {
          limit: filters.limit || 10,
          offset: filters.offset || 0,
          total: posts.length
        }
      });
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const post = await Post.findBySlug(slug);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Only allow viewing unpublished posts for admin/author
      if (post.status !== 'published') {
        if (!req.user || (req.user.role !== 'admin' && req.user.id !== post.author_id)) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      // Increment views
      await Post.incrementViews(post.id);

      res.json(post);
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async create(req, res) {
    try {
      const postData = {
        ...req.body,
        author_id: req.user.id
      };

      const post = await Post.create(postData);

      // Update category post count
      await Category.updatePostCount();

      res.status(201).json(post);
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      // Check if post exists
      const existingPost = await Post.findBySlug(req.body.slug);
      if (existingPost && existingPost.id !== parseInt(id)) {
        return res.status(400).json({ error: 'Slug already exists' });
      }

      const post = await Post.update(id, req.body);

      // Update category post count
      await Category.updatePostCount();

      res.json(post);
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.delete(id);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Update category post count
      await Category.updatePostCount();

      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async like(req, res) {
    try {
      const { id } = req.params;
      const result = await Post.incrementLikes(id);
      res.json({ likes: result.likes });
    } catch (error) {
      console.error('Like post error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = postController;
