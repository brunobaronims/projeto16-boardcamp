import { pool } from "../db/pg.js";
import { customerSchema } from "../schema/customerSchema.js";

export async function customerValidation(req, res, next) {
  const body = req.body;
  const id = req.params.id;

  try {
    await customerSchema.validateAsync(body);
  } catch (e) {
    return res.status(400).send(e.message);
  }

  const customerRes = await pool.query(
    `SELECT * FROM customers WHERE cpf=$1`, [body.cpf]
  )
  const customer = (customerRes.rows)[0];
  if (customer && (customer.id != id))
    return res.status(409).send('CPF já cadastrado');

  next();
}