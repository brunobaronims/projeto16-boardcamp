import { pool } from "../db/pg.js";
import dayjs from 'dayjs';

export async function getRentals(req, res) {
  const offset = req.query.offset || null;
  const limit = req.query.limit || null;

  try {
    const { rows } = await pool.query(
      `SELECT rentals.*,
      customers.name AS "customerName",
      games.name AS "gameName",
      games."categoryId",
      categories.name AS "categoryName"
      FROM rentals
      INNER JOIN customers ON rentals."customerId"=customers.id
      INNER JOIN games ON rentals."gameId"=games.id
      INNER JOIN categories ON games."categoryId"=categories.id
      OFFSET $1
      LIMIT $2`, [
      offset,
      limit
    ]);

    const formattedRentals = rows.map(row => {
      const {
        customerName,
        gameName,
        categoryId,
        categoryName,
        ...rentalData
      } = row;

      const customer = { id: row.customerId, name: customerName };
      const game = {
        id: row.gameId,
        name: gameName,
        categoryId: categoryId,
        categoryName: categoryName
      };

      return { ...rentalData, customer: customer, game: game };
    })

    return res.status(200).send(formattedRentals);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export async function postRental(req, res) {
  dayjs.locale('pt-br');

  const body = req.body;
  const originalPrice = req.price;
  const rentDate = dayjs().format('YYYY-MM-DD');

  try {
    await pool.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
      body.customerId,
      body.gameId,
      rentDate,
      body.daysRented,
      null,
      originalPrice,
      null
    ]
    );
  } catch (e) {
    return res.status(500).send(e.message);
  }

  return res.sendStatus(200);
};

export async function returnRental(req, res) {
  dayjs.locale('pt-br');

  const id = req.params.id;
  const rental = req.rental;
  const returnDate = dayjs().format('YYYY-MM-DD');
  const { daysRented, rentDate, originalPrice } = rental;
  const timePassed = dayjs(returnDate).diff(dayjs(rentDate));
  const daysPassed = timePassed ? dayjs(timePassed).format('D') : 0;
  const pricePerDay = (originalPrice / daysRented);
  const delayFee = ((daysPassed - daysRented) > 0) ? 
  ((daysPassed - daysRented) * pricePerDay) : null;

  try {
    await pool.query(
      `UPDATE rentals
      SET "returnDate"=$1, "delayFee"=$2
      WHERE id=$3`, [
      returnDate,
      delayFee,
      id
    ]);
  } catch (e) {
    return res.status(500).send(e.message);
  }

  return res.sendStatus(200);
};

export async function deleteRental(req, res) {
  const id = req.params.id;

  try {
    await pool.query(`
    DELETE FROM rentals
    WHERE id=$1`, [id]);

    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}