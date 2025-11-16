const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');

    // Read schema file
    const schemaPath = path.join(__dirname, '../../..', 'database', 'schema.sql');
    let schema = fs.readFileSync(schemaPath, 'utf8');

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

    // Replace placeholder with actual hashed password
    schema = schema.replace('$2a$10$YourHashedPasswordHere', hashedPassword);

    // Execute schema
    await pool.query(schema);

    console.log('✅ Database setup completed successfully!');
    console.log('📧 Default admin email:', process.env.ADMIN_EMAIL || 'admin@monetizepro.com');
    console.log('🔑 Default admin password:', process.env.ADMIN_PASSWORD || 'admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
