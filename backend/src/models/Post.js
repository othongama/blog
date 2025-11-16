const pool = require('../config/database');

class Post {
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, u.name as author_name, u.avatar_url as author_avatar,
             c.name as category_name, c.slug as category_slug,
             array_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) FILTER (WHERE t.id IS NOT NULL) as tags
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND p.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (p.title ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ` GROUP BY p.id, u.name, u.avatar_url, c.name, c.slug`;
    query += ` ORDER BY p.created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findBySlug(slug) {
    const query = `
      SELECT p.*, u.name as author_name, u.bio as author_bio, u.avatar_url as author_avatar,
             c.name as category_name, c.slug as category_slug,
             array_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) FILTER (WHERE t.id IS NOT NULL) as tags
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.slug = $1
      GROUP BY p.id, u.name, u.bio, u.avatar_url, c.name, c.slug
    `;

    const result = await pool.query(query, [slug]);
    return result.rows[0];
  }

  static async create(postData) {
    const { title, slug, summary, content, featured_image, author_id, category_id, status, tags } = postData;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert post
      const postQuery = `
        INSERT INTO posts (title, slug, summary, content, featured_image, author_id, category_id, status, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const published_at = status === 'published' ? new Date() : null;
      const postResult = await client.query(postQuery, [
        title, slug, summary, content, featured_image, author_id, category_id, status, published_at
      ]);

      const post = postResult.rows[0];

      // Insert tags if provided
      if (tags && tags.length > 0) {
        for (const tag of tags) {
          // Create tag if doesn't exist
          const tagQuery = `
            INSERT INTO tags (name, slug)
            VALUES ($1, $2)
            ON CONFLICT (slug) DO UPDATE SET name = $1
            RETURNING id
          `;
          const tagResult = await client.query(tagQuery, [tag.name, tag.slug]);

          // Associate tag with post
          await client.query(
            'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
            [post.id, tagResult.rows[0].id]
          );
        }
      }

      await client.query('COMMIT');
      return post;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, postData) {
    const { title, slug, summary, content, featured_image, category_id, status, tags } = postData;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const query = `
        UPDATE posts
        SET title = $1, slug = $2, summary = $3, content = $4,
            featured_image = $5, category_id = $6, status = $7,
            updated_at = CURRENT_TIMESTAMP,
            published_at = CASE WHEN $7 = 'published' AND published_at IS NULL THEN CURRENT_TIMESTAMP ELSE published_at END
        WHERE id = $8
        RETURNING *
      `;

      const result = await client.query(query, [
        title, slug, summary, content, featured_image, category_id, status, id
      ]);

      // Update tags
      await client.query('DELETE FROM post_tags WHERE post_id = $1', [id]);

      if (tags && tags.length > 0) {
        for (const tag of tags) {
          const tagQuery = `
            INSERT INTO tags (name, slug)
            VALUES ($1, $2)
            ON CONFLICT (slug) DO UPDATE SET name = $1
            RETURNING id
          `;
          const tagResult = await client.query(tagQuery, [tag.name, tag.slug]);

          await client.query(
            'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
            [id, tagResult.rows[0].id]
          );
        }
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async incrementViews(id) {
    const query = 'UPDATE posts SET views = views + 1 WHERE id = $1';
    await pool.query(query, [id]);
  }

  static async incrementLikes(id) {
    const query = 'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Post;
