import { pool } from "../db/pg.js";

export async function getCustomers(req, res) {
  const offset = req.query.offset || null;
  const limit = req.query.limit || null;
  const cpf = req.query.cpf ? `${req.query.cpf}%` : '%';

  try {
    const { rows } = await pool.query(
      `SELECT * FROM customers
       WHERE cpf LIKE $1 OFFSET $2 LIMIT $3`, [
      cpf,
      offset,
      limit
    ]);
    return res.status(200).send(rows);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function getOneCustomer(req, res) {
  const id = req.params.id;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM customers
      WHERE id=$1`, [id]
    );

    if (!rows.length)
      return res.status(404).send('Usuário não existe');
    return res.status(200).send(rows);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function postCustomer(req, res) {
  const customer = req.body;

  try {
    await pool.query(
      `
      INSERT INTO customers (name, phone, cpf, birthday)
      VALUES($1, $2, $3, $4)
      `, [
      customer.name,
      customer.phone,
      customer.cpf,
      customer.birthday
    ]);

    return res.sendStatus(201);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function updateCustomer(req, res) {
  const customer = req.body;
  const id = req.params.id;

  try {
    await pool.query(
      `
      UPDATE customers
      SET name=$1, phone=$2, cpf=$3, birthday=$4
      WHERE id=$5
      `, [
        customer.name,
        customer.phone,
        customer.cpf,
        customer.birthday,
        id
      ]);

      return res.sendStatus(200);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}