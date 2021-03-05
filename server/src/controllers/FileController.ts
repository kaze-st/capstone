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

		const currTime = new Date();
		const newFile = new FileModel({
			name: reqBody.name,
			content: '',
			createdOn: currTime,
			lastEditedOn: currTime,
			owner: ownerUID,
			// sharedTo: new Array<string>(),
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

	static async shareFile(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const reqBody = req.body;
		const ownerUID: string = reqBody.owner;
		const owner = await UserModel.findOne({ uid: ownerUID });
		if (owner === null) {
			res.status(400).jsonp({ message: 'Owner not found' });
			return;
		}

		const receiverUID: string = reqBody.receiver;
		const receiver = await UserModel.findOne({ uid: receiverUID });
		if (receiver === null) {
			res.status(400).jsonp({ message: 'Receiver not found' });
			return;
		}

		const fid = String(req.query.fid);
		const file = await FileModel.findById(fid);
		if (file === null) {
			res.status(400).jsonp({ message: 'File not found' });
			return;
		}

		if (file.owner !== owner.uid) {
			res.status(401).jsonp({ message: 'User not authorized to share file' });
			return;
		}

		if (receiver.sharedFiles.includes(file._id)) {
			res.status(400).jsonp({ message: 'File already shared with this user' });
			return;
		}

		receiver.sharedFiles.push(file._id);

		try {
			await receiver.save();
		} catch (err) {
			let message = err?.message;
			if (message === null || message === undefined) {
				message = 'Error saving files';
			}
			res.status(422).jsonp({ message: message });
			return;
		}

		res.status(200).jsonp({
			message: 'File saved with success',
			owner: owner,
			receiver: receiver
		});
	}

	static async getFile(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const fid = String(req.query.fid);
		const file = await FileModel.findById(fid);

		if (file === null) {
			res.status(400).jsonp({ message: 'File not found' });
			return;
		}

		res.status(200).jsonp(file);
	}
}
