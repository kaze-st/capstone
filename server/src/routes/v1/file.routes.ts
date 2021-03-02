import FileController from '@controllers/FileController';
import { Router } from 'express';
import { body } from 'express-validator';

enum Extensions {
	PYTHON = 'py',
	JAVA = 'java'
}

export default (app: Router): void => {
	const router = Router();
	const extensions = Object.values(Extensions) as string[];

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
				.isIn(extensions)
				.not()
				.isEmpty()
				.isString()
				.withMessage('extension must be a non empty string')
		],
		FileController.createFile
	);

	app.use('/file', router);
};
