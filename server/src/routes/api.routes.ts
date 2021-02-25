import { Router } from 'express';
import registerV1Routes from './v1/v1.routes';

export default (app: Router): void => {
	const router = Router();
	registerV1Routes(router);
	app.use('/api', router);
};
