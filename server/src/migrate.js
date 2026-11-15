import fs from "node:fs";
import pool from "./db.js";

// Read the SQL file and send it to the database
const sql = fs.readFileSync(
  new URL("../db/001_create_albums_and_tracks.sql", import.meta.url),
  "utf8"
);

try {
  await pool.query(sql);
  console.log("Migration done: tables are ready.");
} catch (error) {
  console.error("Migration failed:", error);
} finally {
  await pool.end(); // close the connection so the script can finish
}