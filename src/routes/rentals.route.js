import { Router } from "express";

import {
  deleteRental,
  getRentals,
  postRental,
  returnRental
} from "../controllers/rentals.controller.js";
import { rentalValidation } from "../middlewares/rentalValidation.js";
import { returnValidation } from "../middlewares/returnValidation.js";
import { deleteValidation } from "../middlewares/deleteValidation.js";

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', rentalValidation, postRental);
router.post('/rentals/:id/return', returnValidation, returnRental);
router.delete('/rentals/:id', deleteValidation, deleteRental);

export default router;