import { body, query } from 'express-validator';

import FolderController from '@controllers/FolderController';
import { Router } from 'express';

export default (app: Router): void => {
	const router = Router();

	router.post(
		'/create-folder',
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
				.withMessage('owner must be a non empty string')
		],
		FolderController.createFolder
	);

	router.post(
		'/share-folder',
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
		FolderController.createFolder
	);

	router.post(
		'/share-folder-multiple-receivers',
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
		FolderController.shareFolderToMultipleUsers
	);

	router.get(
		'/get-folder',
		[
			query('fid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('fid must be a non empty string')
		],
		FolderController.getFolder
	);
	app.use('/folder', router);
};
