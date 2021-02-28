import { Router } from 'express';
import registerFileRoutes from './file.routes';
import registerUserRoutes from './user.routes';

export default (app: Router): void => {
	const router = Router();
	registerUserRoutes(router);
	registerFileRoutes(router);
	app.use('/v1', router);
};
