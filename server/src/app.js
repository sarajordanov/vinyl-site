import express from "express";
import cors from "cors";
import pool from "./db.js";
import albumsRouter from "./routes/albums.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", exposedHeaders: ["X-Total-Count"] }));
app.use(express.json());

app.use("/api/albums", albumsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Asks the database for the current time, to prove the connection works
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS time");
    res.json({ database: "connected", time: result.rows[0].time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ database: "error" });
  }
});

export default app;