import 'module-alias/register';
import '@models/db';

import consola from 'consola';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// Create a new express app instance
const app: express.Application = express();

app.listen(3000, async function () {
	consola.info('Server is listening on port 3000');
});

app.use('/api');
