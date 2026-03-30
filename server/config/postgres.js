const { Pool } = require('pg');

const buildPoolConfig = () => {
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
    return {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined
    };
  }
  return {
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined
  };
};

const pool = new Pool(buildPoolConfig());

const ensureTables = async () => {
  // ── users ──────────────────────────────────────────────────────────────────
  await pool.query(`
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

  // ── communities ────────────────────────────────────────────────────────────
  await pool.query(`
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
      mission             TEXT,
      verification_status TEXT DEFAULT 'pending',
      created_at          TIMESTAMPTZ DEFAULT NOW(),
      updated_at          TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Add mission column if it doesn't exist (migration for existing DBs)
  await pool.query(`
    ALTER TABLE communities ADD COLUMN IF NOT EXISTS mission TEXT;
  `).catch(() => {});

  // ── events ─────────────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id            SERIAL PRIMARY KEY,
      community_id  INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
      title         TEXT NOT NULL,
      description   TEXT DEFAULT '',
      category      TEXT DEFAULT 'General',
      location      TEXT DEFAULT '',
      city          TEXT DEFAULT '',
      state         TEXT DEFAULT '',
      date          DATE NOT NULL,
      time_slot     TEXT DEFAULT '',
      duration      TEXT DEFAULT '',
      capacity      INTEGER DEFAULT 100,
      goal          TEXT DEFAULT '',
      urgency       TEXT DEFAULT 'normal',
      type          TEXT DEFAULT 'Volunteer Event',
      badge         TEXT DEFAULT 'EVENT',
      badge_color   TEXT DEFAULT 'bg-green-600',
      icon          TEXT DEFAULT '🌿',
      points_reward INTEGER DEFAULT 30,
      status        TEXT DEFAULT 'upcoming',
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // ── event_registrations ────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id             SERIAL PRIMARY KEY,
      event_id       INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      clerk_user_id  TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
      status         TEXT DEFAULT 'registered',
      attended       BOOLEAN DEFAULT FALSE,
      hours_logged   NUMERIC(5,2) DEFAULT 0,
      registered_at  TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(event_id, clerk_user_id)
    );
  `);

  // ── donations ──────────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS donations (
      id            SERIAL PRIMARY KEY,
      community_id  INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
      clerk_user_id TEXT REFERENCES users(clerk_user_id) ON DELETE SET NULL,
      amount        NUMERIC(12,2) NOT NULL,
      currency      TEXT DEFAULT 'INR',
      note          TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

module.exports = { pool, ensureTables };