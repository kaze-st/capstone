import 'module-alias/register';
import '@models/db';

import bodyParser from 'body-parser';
import consola from 'consola';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import registerAPIRoutes from '@routes/api.routes';

dotenv.config();

// Create a new express app instance
const app: express.Application = express();

// Useful middlewares to parse request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Enable CORS protocol
app.use(cors());

app.listen(3000, async function () {
	consola.info('Server is listening on port 3000');
});

registerAPIRoutes(app);
