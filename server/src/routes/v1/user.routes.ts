import { Router } from 'express';

export default (app: Router): void => {
	const router = Router();
	router.post('/create-user', (req, res) => {
		// Do something
		res.json({
			message: 'Tu madre'
		});
	});

	app.use('/user', router);
};
