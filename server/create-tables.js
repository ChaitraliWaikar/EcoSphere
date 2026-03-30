/**
 * create-tables.js
 * Run once to create users + communities tables in the Connectrust Postgres DB.
 * Usage: node create-tables.js
 */
require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: DATABASE_URL is not set in .env');
  process.exit(1);
}

console.log('Connecting to:', connectionString.replace(/:([^:@]+)@/, ':***@'));

const pool = new Pool({ connectionString, ssl: false });

async function run() {
  const client = await pool.connect();
  console.log('Connected to PostgreSQL!\n');

  try {
    // ── users ──────────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id              SERIAL PRIMARY KEY,
        clerk_user_id   TEXT UNIQUE NOT NULL,
        email           TEXT UNIQUE NOT NULL,
        first_name      TEXT,
        last_name       TEXT,
        full_name       TEXT,
        image_url       TEXT,
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅  Table "users" is ready.');

    // ── communities ────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS communities (
        id                  SERIAL PRIMARY KEY,
        name                TEXT NOT NULL,
        email               TEXT UNIQUE NOT NULL,
        password_hash       TEXT NOT NULL,
        contact_person      TEXT NOT NULL,
        contact_phone       TEXT NOT NULL,
        address             TEXT NOT NULL,
        website             TEXT,
        registration_number TEXT,
        instagram           TEXT,
        facebook            TEXT,
        linkedin            TEXT,
        twitter             TEXT,
        verification_status TEXT DEFAULT 'pending',
        created_at          TIMESTAMPTZ DEFAULT NOW(),
        updated_at          TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅  Table "communities" is ready.\n');

    // Confirm by listing all tables
    const { rows } = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('Tables now in Connectrust (public schema):');
    rows.forEach(r => console.log('  •', r.table_name));

  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
