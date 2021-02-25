import { Router } from 'express';
import registerUserRoutes from './user.routes';

export default (app: Router): void => {
	const router = Router();
	registerUserRoutes(router);

	app.use('/v1', router);
};
