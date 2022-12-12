import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

import categoriesRoute from  '../src/routes/categories.route.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(categoriesRoute);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));