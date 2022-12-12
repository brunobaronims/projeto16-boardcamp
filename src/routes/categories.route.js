import { Router } from "express";

import { getCategories, postCategory } from "../controllers/categories.controller.js";
import { categoryValidation } from "../middlewares/categoryValidation.js";

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', categoryValidation, postCategory);

export default router;