import { pool } from "../db/pg.js";

export async function deleteValidation(req, res, next) {
  const id = req.params.id;

  const rentalRes = await pool.query(`
  SELECT * FROM rentals WHERE id=$1`, [id]);
  const rentalExists = rentalRes.rows.length;
  if (!rentalExists)
    return res.status(404).send('Aluguel não existe');

  const rentalIsClosed = rentalRes.rows[0].returnDate;
  if (!rentalIsClosed) 
    return res.status(400).send('Aluguel ainda não foi finalizado');

  next();
};