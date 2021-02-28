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
			res.status(400).send('User not found');
			return;
		}

		const newFile = new FileModel({
			name: reqBody.name,
			// workaround because content is empty is not allowed by our
			// schema because required = true
			content: '\n',
			createdOn: new Date(),
			owner: ownerUID,
			sharedTo: new Array<string>(),
			extension: reqBody.extension
		});

		owner.ownedFiles.push(newFile);

		// not sure how to roll back these saves
		// if 1 of them fail
		const session = await startSession();
		session.startTransaction();

		// eslint-disable-next-line -- callbackErr is never
		let callbackErr: any = null;

		await newFile.save((err) => {
			if (err !== null) {
				callbackErr = err;
			}
		});

		await owner.save((err) => {
			if (err != null) {
				callbackErr = err;
			}
		});

		await session.commitTransaction();
		session.endSession();

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
