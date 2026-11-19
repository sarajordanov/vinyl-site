import pool from "./db.js";

// Turns "The Weeknd Dawn FM" into "the-weeknd-dawn-fm" for use in web addresses
const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const albums = [
  { artist: "Queen", title: "A Night At The Opera", price: 170, genre: "Rock", featured: true },
  { artist: "The Weeknd", title: "Dawn FM", price: 38, genre: "Soul & R&B", section: "new" },
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

  // Rock
  { artist: "Pink Floyd", title: "The Dark Side of the Moon", price: 29.99, genre: "Rock" },
  { artist: "Fleetwood Mac", title: "Rumours", price: 27.99, genre: "Rock" },
  { artist: "Nirvana", title: "Nevermind", price: 26.99, genre: "Rock" },
  { artist: "Led Zeppelin", title: "Led Zeppelin IV", price: 28.5, genre: "Rock" },
  { artist: "The Strokes", title: "Is This It", price: 22.99, genre: "Rock" },
  { artist: "Radiohead", title: "OK Computer", price: 31.99, genre: "Rock" },
  // Pop
  { artist: "Michael Jackson", title: "Thriller", price: 24.99, genre: "Pop" },
  { artist: "Taylor Swift", title: "1989", price: 34.99, genre: "Pop" },
  { artist: "Dua Lipa", title: "Future Nostalgia", price: 29.99, genre: "Pop" },
  { artist: "Harry Styles", title: "Fine Line", price: 27.99, genre: "Pop" },
  // Hip-Hop
  { artist: "Kendrick Lamar", title: "good kid, m.A.A.d city", price: 32.99, genre: "Hip-Hop" },
  { artist: "Kanye West", title: "Graduation", price: 29.99, genre: "Hip-Hop" },
  { artist: "Nas", title: "Illmatic", price: 25.99, genre: "Hip-Hop" },
  { artist: "The Notorious B.I.G.", title: "Ready to Die", price: 27.99, genre: "Hip-Hop" },
  // Soul & R&B
  { artist: "Frank Ocean", title: "Blonde", price: 44.99, genre: "Soul & R&B" },
  { artist: "SZA", title: "SOS", price: 33.99, genre: "Soul & R&B" },
  { artist: "Marvin Gaye", title: "What's Going On", price: 23.99, genre: "Soul & R&B" },
  { artist: "Stevie Wonder", title: "Songs in the Key of Life", price: 38.99, genre: "Soul & R&B" },
  // Electronic
  { artist: "Daft Punk", title: "Discovery", price: 36.99, genre: "Electronic" },
  { artist: "Justice", title: "Cross", price: 28.99, genre: "Electronic" },
  { artist: "Massive Attack", title: "Mezzanine", price: 31.99, genre: "Electronic" },
];

try {
  for (const a of albums) {
    // Insert the album, or update it if its slug already exists.
    // cover_url and stock are left alone, so existing covers are kept.
    await pool.query(
      `INSERT INTO albums (slug, title, artist, genre, price_cents, stock, section, featured)
       VALUES ($1, $2, $3, $4, $5, 10, $6, $7)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         artist = EXCLUDED.artist,
         genre = EXCLUDED.genre,
         price_cents = EXCLUDED.price_cents,
         section = EXCLUDED.section,
         featured = EXCLUDED.featured`,
      [
        slugify(`${a.artist} ${a.title}`),
        a.title,
        a.artist,
        a.genre,
        Math.round(a.price * 100),
        a.section ?? null,
        a.featured ?? false,
      ]
    );
  }
  console.log(`Seed done: ${albums.length} albums.`);
} catch (error) {
  console.error("Seed failed:", error);
} finally {
  await pool.end();
}