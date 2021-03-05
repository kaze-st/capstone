import { Router } from 'express';
import registerFileRoutes from './file.routes';
import registerUserRoutes from './user.routes';
import verifyAuth from '@middlewares/auth';

export default (app: Router): void => {
	const router = Router();
	router.use(verifyAuth);
	registerUserRoutes(router);
	registerFileRoutes(router);
	app.use('/v1', router);
};
