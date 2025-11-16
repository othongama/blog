const pool = require('../config/database');

class Category {
  static async findAll() {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findBySlug(slug) {
    const query = 'SELECT * FROM categories WHERE slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  }

  static async create(categoryData) {
    const { name, slug, description } = categoryData;
    const query = `
      INSERT INTO categories (name, slug, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [name, slug, description]);
    return result.rows[0];
  }

  static async update(id, categoryData) {
    const { name, slug, description } = categoryData;
    const query = `
      UPDATE categories
      SET name = $1, slug = $2, description = $3
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [name, slug, description, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updatePostCount() {
    const query = `
      UPDATE categories c
      SET post_count = (
        SELECT COUNT(*) FROM posts p
        WHERE p.category_id = c.id AND p.status = 'published'
      )
    `;
    await pool.query(query);
  }
}

module.exports = Category;
