import 'module-alias/register';
import '@models/db';

import bodyParser from 'body-parser';
import consola from 'consola';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import registerAPIRoutes from '@routes/api.routes';
import registerWS from './current-doc-ws/current-doc-ws';

dotenv.config();

const PORT = 8080;

// Create a new express app instance
const app: express.Application = express();

// Useful middlewares to parse request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Enable CORS protocol
app.use(cors());

const server = app.listen(PORT, async function () {
	consola.info('Server is listening on port: ' + PORT);
});

registerAPIRoutes(app);
registerWS(server);
