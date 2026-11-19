import pool from "./db.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
    const { rows } = await pool.query(
    "SELECT id, title, artist FROM albums WHERE cover_url IS NULL ORDER BY id"
  );
  for (const album of rows) {
    const term = encodeURIComponent(`${album.artist} ${album.title}`);
    const res = await fetch(`https://itunes.apple.com/search?term=${term}&entity=album&limit=1`);

    if (!res.ok) {
      console.log(`Request failed (${res.status}): ${album.artist} - ${album.title}`);
      continue;
    }

    const data = await res.json();
    const hit = data.results?.[0];

    if (!hit) {
      console.log(`No match: ${album.artist} - ${album.title}`);
      continue;
    }

    // The search gives a tiny 100px image. Ask for a bigger one.
    const url = hit.artworkUrl100.replace("100x100bb", "600x600bb");
    await pool.query("UPDATE albums SET cover_url = $1 WHERE id = $2", [url, album.id]);

    // Print what we asked for and what we found, so you can check the match
    console.log(`${album.artist} - ${album.title}  ->  ${hit.artistName} - ${hit.collectionName}`);

    await wait(3500); // stay under the rate limit of the free API
  }
  console.log("Done.");
} catch (error) {
  console.error("Covers failed:", error);
} finally {
  await pool.end();
}