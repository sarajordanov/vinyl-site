import pool from "./db.js";

// Turns "The Weeknd Dawn FM" into "the-weeknd-dawn-fm" for use in web addresses
const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const albums = [
  { artist: "Queen", title: "A Night At The Opera", price: 170, genre: "Rock", featured: true },
  { artist: "The Weeknd", title: "Dawn FM", price: 38, genre: "Soul & R&B", section: "new"},
  { artist: "Tyler, The Creator", title: "Call Me If You Get Lost", price: 24.99, genre: "Hip-Hop", section: "new" },
  { artist: "Billie Eilish", title: "Happier than ever", price: 36.99, genre: "Pop", section: "new" },
  { artist: "Adele", title: "30", price: 30.07, genre: "Pop", section: "new" },
  { artist: "The Beatles", title: "Abbey Road", price: 19.75, genre: "Rock", section: "bestseller" },
  { artist: "Amy Winehouse", title: "Back to black", price: 24.99, genre: "Soul & R&B", section: "bestseller" },
  { artist: "Eminem", title: "The Eminem Show", price: 24.99, genre: "Hip-Hop", section: "bestseller" },
  { artist: "Arctic Monkeys", title: "AM", price: 17.79, genre: "Rock", section: "bestseller" },
  { artist: "Aaliyah", title: "Aaliyah", price: 25.99, genre: "Soul & R&B", section: "coming_soon" },
  { artist: "Jack Harlow", title: "That's What They All Say", price: 19.59, genre: "Hip-Hop", section: "coming_soon" },
  { artist: "2Pac", title: "All Eyez On Me", price: 39.3, genre: "Hip-Hop", section: "coming_soon" },
  { artist: "The Weeknd", title: "Starboy", price: 33.64, genre: "Soul & R&B" },
  { artist: "Daft Punk", title: "Random Access Memories", price: 47.77, genre: "Electronic" },
  { artist: "Drake", title: "More Life", price: 32.79, genre: "Hip-Hop" },
];

try {
  // Start clean, so running the script twice doesn't create duplicates
  await pool.query("TRUNCATE tracks, albums RESTART IDENTITY CASCADE");

  for (const a of albums) {
    // $1, $2, ... are placeholders: the values are sent separately and safely
    const { rows } = await pool.query(
      `INSERT INTO albums
        (slug, title, artist, genre, price_cents, stock, section, featured,
         description, label, producers, grammage, color, discs, release_year)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING id`,
      [
        slugify(`${a.artist} ${a.title}`), a.title, a.artist, a.genre,
        Math.round(a.price * 100), 10, a.section ?? null, a.featured ?? false,
        a.description ?? null, a.label ?? null, a.producers ?? null,
        a.grammage ?? null, a.color ?? null, a.discs ?? null, a.year ?? null,
      ]
    );

    for (const [i, title] of (a.tracks ?? []).entries()) {
      await pool.query(
        "INSERT INTO tracks (album_id, position, title) VALUES ($1, $2, $3)",
        [rows[0].id, i + 1, title]
      );
    }
  }
  console.log(`Seed done: ${albums.length} albums inserted.`);
} catch (error) {
  console.error("Seed failed:", error);
} finally {
  await pool.end();
}