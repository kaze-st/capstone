import FileModel, { IFile } from '@models/FileModel';
import FolderModel, { IFolder } from '@models/FolderModel';
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
			email: reqBody.email,
			ownedFiles: new Array<IFile>(),
			sharedFiles: new Array<IFile>()
		});

		// eslint-disable-next-line -- callbackErr is never
		let callbackErr: any = null;
		try {
			newUser.save();
		} catch (err) {
			callbackErr = err;
		}

		if (callbackErr !== null) {
			res.status(422).jsonp({ message: callbackErr });
			return;
		}

		res.status(201).jsonp({
			message: 'Document saved with success'
		});
	}

	static async getUserByUID(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const uid = String(req.query.uid);
		const user = await UserModel.findOne({ uid: uid });

		if (user === null) {
			res.status(200).jsonp({ user: null });
			return;
		}

		res.status(200).jsonp(user);
	}

	static async getUserWithoutFilesByEmail(
		req: Request,
		res: Response
	): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const email = String(req.query.email);
		const user = await UserModel.findOne({ email: email }).select(
			'-ownedFiles -sharedFiles'
		);

		if (user === null) {
			res.status(400).jsonp({ message: 'User email not found' });
			return;
		}

		res.status(200).jsonp(user);
	}

	static async getAllUsersByIds(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const reqBody = req.body;
		const userIDs = reqBody.uids;

		const users = await UserModel.find({
			uid: { $in: userIDs }
		}).select('-ownedFiles -sharedFiles');

		if (users === null) {
			res.status(400).jsonp({ message: 'Users not found' });
			return;
		}

		res.status(200).jsonp(users);
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

		const ownedFiles = await FileModel.find({
			_id: { $in: user.ownedFiles }
		}).select('-content');

		const sharedFiles = await FileModel.find({
			_id: { $in: user.sharedFiles }
		}).select('-content');

		res.set('Content-Type', 'application/json');
		res.status(200).jsonp({
			ownedFiles: ownedFiles,
			sharedFiles: sharedFiles
		});
	}

	static async getAllFolders(req: Request, res: Response): Promise<void> {
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

		const ownedFolders = await FolderModel.find({
			_id: { $in: user.ownedFolders }
		});

		const sharedFolders = await FileModel.find({
			_id: { $in: user.sharedFolders }
		});

		res.set('Content-Type', 'application/json');
		res.status(200).jsonp({
			ownedFolders: ownedFolders,
			sharedFolders: sharedFolders
		});
	}
}
