import FileController from '@controllers/FileController';
import { Router } from 'express';
import { body } from 'express-validator';

export default (app: Router): void => {
	const router = Router();

	router.post(
		'/create-file',
		[
			body('name')
				.not()
				.isEmpty()
				.isString()
				.withMessage('name must be a non empty string'),
			body('owner')
				.not()
				.isEmpty()
				.isString()
				.withMessage('owner must be a non empty string'),
			body('extension')
				.isIn(['py', 'java'])
				.not()
				.isEmpty()
				.isString()
				.withMessage('extension must be a non empty string')
		],
		FileController.createFile
	);

	app.use('/file', router);
};
