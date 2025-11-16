const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findById(id) {
    const query = 'SELECT id, email, name, bio, avatar_url, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async create(userData) {
    const { email, password, name, bio, avatar_url, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (email, password, name, bio, avatar_url, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, bio, avatar_url, role, created_at
    `;

    const result = await pool.query(query, [
      email, hashedPassword, name, bio, avatar_url, role || 'author'
    ]);

    return result.rows[0];
  }

  static async update(id, userData) {
    const { name, bio, avatar_url } = userData;

    const query = `
      UPDATE users
      SET name = $1, bio = $2, avatar_url = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, email, name, bio, avatar_url, role, created_at
    `;

    const result = await pool.query(query, [name, bio, avatar_url, id]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findAll() {
    const query = 'SELECT id, email, name, bio, avatar_url, role, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = User;
