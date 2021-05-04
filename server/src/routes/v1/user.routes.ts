import { body, query } from 'express-validator';
import { Router } from 'express';
import UserController from '@controllers/UserController';

export default (app: Router): void => {
	const router = Router();

	router.post(
		'/create-user',
		[
			body('uid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('uid must be a non empty string'),
			body('email')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('uid must be a non empty string'),
			body('name')
				.not()
				.isEmpty()
				.isString()
				.withMessage('name must be a non empty string'),
			body('lastName')
				.not()
				.isEmpty()
				.isString()
				.withMessage('lastName must be a non empty string')
		],
		UserController.createUser
	);

	router.get(
		'/get-user',
		[
			query('uid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('uid must be a non empty string')
		],
		UserController.getUserByUID
	);

	router.get(
		'/get-user-email',
		[
			query('email')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('uid must be a non empty string')
		],
		UserController.getUserWithoutFilesByEmail
	);

	// POST because fucking axios does not allow for GET request to have a request body
	router.post(
		'/get-users',
		[
			body('uids')
				.exists()
				.isArray()
				.withMessage('uids must be an array that exist')
		],
		UserController.getAllUsersByIds
	);

	router.get(
		'/files',
		[
			query('uid')
				.exists()
				.not()
				.isEmpty()
				.isString()
				.withMessage('uid must be a non empty string')
		],
		UserController.getAllFiles
	);

	app.use('/user', router);
};
