import { Router } from "express";
import pool from "../db.js";

const router = Router();

// Sorting options we allow. Anything else falls back to the default order.
const sortOptions = {
  price_asc: "price_cents ASC",
  price_desc: "price_cents DESC",
  title: "title ASC",
  newest: "created_at DESC",
};

// GET /api/albums -> a list of albums, with optional search, filters and sorting
router.get("/", async (req, res) => {
  try {
    const { q, genre, artist, maxPrice, sort } = req.query;

    if (maxPrice && Number.isNaN(Number(maxPrice))) {
      return res.status(400).json({ error: "maxPrice must be a number" });
    }

    const conditions = []; // the filter rules
    const values = [];     // the values that go with them

    if (q) {
      values.push(`%${q}%`);
      conditions.push(`(title ILIKE $${values.length} OR artist ILIKE $${values.length})`);
    }
    if (genre) {
      values.push(genre);
      conditions.push(`genre = $${values.length}`);
    }
    if (artist) {
      values.push(artist);
      conditions.push(`artist = $${values.length}`);
    }
    if (maxPrice) {
      values.push(Math.round(Number(maxPrice) * 100)); // dollars -> cents
      conditions.push(`price_cents <= $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderBy = sortOptions[sort] ?? "artist ASC, title ASC";

    const { rows } = await pool.query(
      `SELECT id, slug, title, artist, genre, price_cents, format, section, featured, cover_url
       FROM albums
       ${where}
       ORDER BY ${orderBy}`,
      values
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load albums" });
  }
});

// GET /api/albums/some-slug -> one album, with its tracks
router.get("/:slug", async (req, res) => {
  try {
    const album = await pool.query("SELECT * FROM albums WHERE slug = $1", [req.params.slug]);

    if (album.rows.length === 0) {
      return res.status(404).json({ error: "Album not found" });
    }

    const tracks = await pool.query(
      "SELECT position, title FROM tracks WHERE album_id = $1 ORDER BY position",
      [album.rows[0].id]
    );

    res.json({ ...album.rows[0], tracks: tracks.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load album" });
  }
});

export default router;