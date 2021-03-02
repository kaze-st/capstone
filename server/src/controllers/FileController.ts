import { Request, Response } from 'express';
import FileModel from '@models/FileModel';
import UserModel from '@models/UserModel';
import { startSession } from 'mongoose';
import { validationResult } from 'express-validator';

export default class FileController {
	static async createFile(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const reqBody = req.body;
		const ownerUID: string = reqBody.owner;
		const owner = await UserModel.findOne({ uid: ownerUID });
		if (owner === null) {
			res.status(400).jsonp({ message: 'User not found' });
			return;
		}

		const newFile = new FileModel({
			name: reqBody.name,
			content: '',
			createdOn: new Date(),
			owner: ownerUID,
			sharedTo: new Array<string>(),
			extension: reqBody.extension
		});

		owner.ownedFiles.push(newFile._id);

		const session = await startSession();

		// eslint-disable-next-line -- callbackErr is never
		let callbackErr: any = null;

		try {
			session.startTransaction();
			await newFile.save();
			await owner.save();
			session.commitTransaction();
		} catch (err) {
			session.abortTransaction();
			callbackErr = err;
		} finally {
			session.endSession();
		}

		if (callbackErr !== null) {
			res.status(422).jsonp({ message: callbackErr?.message });
			return;
		}

		res.status(201).json({
			message: 'File document saved with success',
			file: newFile
		});
	}
}
