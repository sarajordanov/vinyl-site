import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import pool from "../src/db.js";

// When all tests are done, close the database connection
after(() => pool.end());

test("health endpoint answers ok", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
});

test("lists all albums", async () => {
  const res = await request(app).get("/api/albums");
  assert.equal(res.status, 200);
  assert.ok(res.body.length >= 15);
});

test("search finds only matching albums", async () => {
  const res = await request(app).get("/api/albums?q=weeknd");
  assert.equal(res.status, 200);
  assert.ok(res.body.length >= 2);
  assert.ok(res.body.every((a) => a.artist === "The Weeknd"));
});

test("genre filter returns only that genre", async () => {
  const res = await request(app).get("/api/albums?genre=Hip-Hop");
  assert.equal(res.status, 200);
  assert.ok(res.body.length > 0);
  assert.ok(res.body.every((a) => a.genre === "Hip-Hop"));
});

test("maxPrice filter respects the limit", async () => {
  const res = await request(app).get("/api/albums?maxPrice=25");
  assert.equal(res.status, 200);
  assert.ok(res.body.every((a) => a.price_cents <= 2500));
});

test("sorting by price descending puts the most expensive first", async () => {
  const res = await request(app).get("/api/albums?sort=price_desc");
  assert.equal(res.body[0].artist, "Queen");
});

test("a bad maxPrice is rejected with 400", async () => {
  const res = await request(app).get("/api/albums?maxPrice=abc");
  assert.equal(res.status, 400);
});

test("a single album can be loaded by slug", async () => {
  const res = await request(app).get("/api/albums/the-weeknd-dawn-fm");
  assert.equal(res.status, 200);
  assert.equal(res.body.title, "Dawn FM");
  assert.ok(Array.isArray(res.body.tracks));
});

test("an unknown album gives 404", async () => {
  const res = await request(app).get("/api/albums/does-not-exist");
  assert.equal(res.status, 404);
});

test("minPrice filter respects the limit", async () => {
  const res = await request(app).get("/api/albums?minPrice=30");
  assert.equal(res.status, 200);
  assert.ok(res.body.length > 0);
  assert.ok(res.body.every((a) => a.price_cents >= 3000));
});