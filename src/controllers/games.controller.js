import { pool } from "../db/pg.js";

export async function getGames(req, res) {
  const offset = req.query.offset || null;
  const limit = req.query.limit || null;
  const name = req.query.name ? `${req.query.name.toLowerCase()}%` : '%';

  try {
    const { rows } = await pool.query(
      `SELECT * FROM games
       WHERE LOWER(name) LIKE $1 OFFSET $2 LIMIT $3`, [
      name,
      offset,
      limit
    ]);
    return res.status(200).send(rows);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function postGame(req, res) {
  const body = req.body;

  try {
    await pool.query(
      `
      INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ($1, $2, $3, $4, $5)
      `, [
      body.name,
      body.image,
      body.stockTotal,
      body.categoryId,
      body.pricePerDay
    ]);

    return res.sendStatus(201);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}