-- The albums table: one row per record in the shop
CREATE TABLE IF NOT EXISTS albums (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  artist       TEXT NOT NULL,
  genre        TEXT,
  price_cents  INTEGER NOT NULL CHECK (price_cents >= 0),
  stock        INTEGER NOT NULL DEFAULT 0,
  format       TEXT NOT NULL DEFAULT 'Vinyl',
  description  TEXT,
  label        TEXT,
  producers    TEXT,
  grammage     TEXT,
  color        TEXT,
  discs        TEXT,
  release_year INTEGER,
  section      TEXT CHECK (section IN ('new', 'bestseller', 'coming_soon')),
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  cover_url    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The tracks table: one row per song, each linked to an album
CREATE TABLE IF NOT EXISTS tracks (
  id        SERIAL PRIMARY KEY,
  album_id  INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  position  INTEGER NOT NULL,
  title     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON tracks(album_id);