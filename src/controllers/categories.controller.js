import { pool } from "../db/pg.js";

export async function getCategories(req, res) {
  const offset = req.query.offset || null;
  const limit = req.query.limit || null;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM categories
       OFFSET $1 LIMIT $2`, [
      offset,
      limit,
    ]);
    return res.status(200).send(rows);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export async function postCategory(req, res) {
  const body = req.body;

  try {
    await pool.query(
      `
      INSERT INTO categories (name)
      VALUES ($1)
      `, [body.name]
    )

    return res.sendStatus(201);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};