import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/albums -> a list of all albums
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, slug, title, artist, genre, price_cents, format, section, featured, cover_url
       FROM albums
       ORDER BY artist, title`
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