import { Router } from "express";

import {
  getCustomers,
  getOneCustomer,
  postCustomer,
  updateCustomer
} from "../controllers/customers.controller.js";
import { customerValidation } from "../middlewares/customerValidation.js";

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getOneCustomer);
router.post('/customers', customerValidation, postCustomer);
router.put('/customers/:id', customerValidation, updateCustomer);

export default router;