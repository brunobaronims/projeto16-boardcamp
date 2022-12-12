import { pool } from "../db/pg.js";
import { categorySchema } from "../schema/categorySchema.js";

export async function categoryValidation(req, res, next) {
  const data = req.body;

  try {
    await categorySchema.validateAsync(data);
  } catch (e) {
    return res.status(401).send(e.message);
  }

  const { rows } = await pool.query(
    `SELECT * FROM categories WHERE name=$1`, [data.name]
  )
  if (rows.length)
    return res.status(409).send('Nome de categoria já existe');
  
  next();
}