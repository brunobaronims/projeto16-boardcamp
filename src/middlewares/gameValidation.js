import { pool } from "../db/pg.js";
import { gameSchema } from "../schema/gameSchema.js";

export async function gameValidation(req, res, next) {
  const body = req.body;

  try {
    await gameSchema.validateAsync(body);
  } catch (e) {
    return res.status(400).send(e.message);
  }

  const categoryIdRes = await pool.query(
    `SELECT * FROM categories WHERE id=$1`, [body.categoryId]
  )
  const idExists = categoryIdRes.rows.length;
  if (!idExists)
    return res.status(400).send('Categoria não existe');

  const gameNameRes = await pool.query(
    `SELECT * FROM games WHERE name=$1`, [body.name]
  )
  const nameExists = gameNameRes.rows.length;
  if (nameExists)
    return res.status(409).send('Nome de jogo já existe');

  next();
}