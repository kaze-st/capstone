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
				.withMessage('owner must be a non empty string'),
			body('hasStarterFiles')
				.not()
				.isEmpty()
				.isBoolean()
				.withMessage('hasStarterFiles must be a valid boolean')
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
			body('pid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('pid must be a non empty string')
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
			body('pid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('pid must be a non empty string')
		],
		FolderController.shareFolderToMultipleUsers
	);

	router.get(
		'/get-folder',
		[
			query('pid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('pid must be a non empty string')
		],
		FolderController.getFolder
	);

	router.delete(
		'/delete-folder',
		[
			body('owner')
				.not()
				.isEmpty()
				.isString()
				.withMessage('owner must be a non empty string'),
			query('pid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('pid must be a non empty string')
		],
		FolderController.deleteFolder
	);
	app.use('/folder', router);
};
