import { Request, Response } from 'express';

import UserModel from '@models/UserModel';
import { validationResult } from 'express-validator';

export default class UserController {
	static async createUser(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const reqBody = req.body;
		const newUser = new UserModel({
			name: reqBody.name,
			lastName: reqBody.lastName,
			uid: reqBody.uid,
			// eslint-disable-next-line -- fill in with File type
			ownedFiles: new Array<any>(),
			// eslint-disable-next-line -- fill in with File type
			sharedFiles: new Array<any>()
		});

		// eslint-disable-next-line -- callbackErr is never
		let callbackErr: any = null;

		newUser.save((err) => {
			if (err !== null) {
				callbackErr = err;
			}
		});

		if (callbackErr !== null) {
			res.status(422).jsonp({ message: callbackErr?.message });
			return;
		}

		res.status(201).json({
			message: 'Document saved with success'
		});
	}
}
