import { pool } from "../db/pg.js";
import { rentalSchema } from "../schema/rentalSchema.js";

export async function rentalValidation(req, res, next) {
  const body = req.body;

  const customerRes = await pool.query(
    `SELECT * FROM customers WHERE id=$1`, [body.customerId]
  );
  const customerExists = customerRes.rows.length;
  if (!customerExists)
    return res.status(400).send('Cliente não existe');

  const gameRes = await pool.query(
    `SELECT * FROM games WHERE id=$1`, [body.gameId]
  );
  const gameExists = gameRes.rows.length;
  if (!gameExists)
    return res.status(400).send('Jogo não existe');

  try {
    await rentalSchema.validateAsync(body);
  } catch (e) {
    return res.status(400).send(e.message);
  }
  
  const stockTotal = gameRes.rows[0].stockTotal;1
  const rentalRes = await pool.query(
    `SELECT COUNT(*) FROM rentals WHERE "gameId"=$1 AND "returnDate" IS null`, [body.gameId]
  );
  const openRentals = rentalRes.rows[0].count;

  if (stockTotal <= Number(openRentals))
    return res.status(400).send('Não há jogos disponíveis');

  req.price = (gameRes.rows[0].pricePerDay * body.daysRented);

  next();
}