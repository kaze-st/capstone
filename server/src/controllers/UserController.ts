import { Request, Response } from 'express';
import FileModel from '@models/FileModel';
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

	static async getUser(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const uid = String(req.query.uid);
		const user = await UserModel.findOne({ uid: uid });

		if (user === null) {
			res.status(400).jsonp({ message: 'User not found' });
			return;
		}

		res.set('Content-Type', 'application/json');
		res.status(200).json(user);
	}

	static async getAllFiles(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const uid = String(req.query.uid);
		const user = await UserModel.findOne({ uid: uid });
		if (user === null) {
			res.status(400).jsonp({ message: 'User not found' });
			return;
		}

		let ownedFiles = await FileModel.find({
			_id: { $in: user.ownedFiles }
		});
		ownedFiles = ownedFiles.map((file) => {
			file.content = undefined;
			return file;
		});

		let sharedFiles = await FileModel.find({
			_id: { $in: user.sharedFiles }
		});
		sharedFiles = sharedFiles.map((file) => {
			file.content = undefined;
			return file;
		});

		res.set('Content-Type', 'application/json');
		res.status(200).json({ ownedFiles: ownedFiles, sharedFiles: sharedFiles });
	}
}