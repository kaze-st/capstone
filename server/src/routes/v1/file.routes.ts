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

	router.post(
		'/share-file-multiple-receivers',
		[
			body('owner')
				.not()
				.isEmpty()
				.isString()
				.withMessage('owner must be a non empty string'),
			body('receivers')
				.not()
				.isEmpty()
				.isArray()
				.withMessage('receivers must be a non empty array'),
			body('fid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('fid must be a non empty string')
		],
		FileController.shareFileToMultipleUsers
	);

	router.get(
		'/get-file',
		[
			query('fid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('fid must be a non empty string')
		],
		FileController.getFile
	);
	app.use('/file', router);
};
