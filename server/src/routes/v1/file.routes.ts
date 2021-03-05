import { body, query } from 'express-validator';

import Extensions from '@extensions/FileExtension';
import FileController from '@controllers/FileController';
import { Router } from 'express';

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

	router.post(
		'/share-file',
		[
			body('owner')
				.not()
				.isEmpty()
				.isString()
				.withMessage('owner must be a non empty string'),
			body('receiver')
				.not()
				.isEmpty()
				.isString()
				.withMessage('receiver must be a non empty string'),
			body('fid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('fid must be a non empty string')
		],
		FileController.shareFile
	);
	app.use('/file', router);
};
