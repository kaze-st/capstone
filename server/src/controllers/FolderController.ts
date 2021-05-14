import * as Y from 'yjs';

import { Request, Response } from 'express';

import FolderModel from '@models/FolderModel';
import UserModel from '@models/UserModel';
import consola from 'consola';
import { startSession } from 'mongoose';
import { validationResult } from 'express-validator';

export default class FolderController {
	static async createFolder(req: Request, res: Response): Promise<void> {
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

		const doc = new Y.Doc();
		const ymap = doc.getMap('structure');
		ymap.set('isPlayground', false);
		const root = new Y.Map();
		ymap.set('/', root);
		root.set('name', '/');
		root.set('isFolder', true);
		root.set('path', '/');
		if (reqBody.hasStarterFiles) {
			ymap.set('isPlayground', true);
			const htmlFile = new Y.Map();
			const htmlFileName = 'index.html';
			root.set(htmlFileName, htmlFile);
			htmlFile.set('content', new Y.Text());
			htmlFile.set('name', htmlFileName);
			htmlFile.set('isFolder', false);
			htmlFile.set('path', '/' + htmlFileName);

			const cssFile = new Y.Map();
			const cssFileName = 'style.css';
			root.set(cssFileName, cssFile);
			cssFile.set('content', new Y.Text());
			cssFile.set('name', cssFileName);
			cssFile.set('isFolder', false);
			cssFile.set('path', '/' + cssFileName);

			const jsFile = new Y.Map();
			const jsFileName = 'script.js';
			root.set(jsFileName, jsFile);
			jsFile.set('content', new Y.Text());
			jsFile.set('name', jsFileName);
			jsFile.set('isFolder', false);
			jsFile.set('path', '/' + jsFileName);
		}

		const newState = Y.encodeStateAsUpdate(doc);
		const buffer = Buffer.from(newState);
		const currTime = new Date();
		const newFolder = new FolderModel({
			name: reqBody.name,
			createdOn: currTime,
			lastEditedOn: currTime,
			owner: ownerUID,
			sharedTo: new Array<string>(),
			state: buffer,
			isPlayground: reqBody.hasStarterFiles
		});

		owner.ownedFolders.push(newFolder._id);

		const session = await startSession();

		// eslint-disable-next-line -- callbackErr is never
		let callbackErr: any = null;

		try {
			session.startTransaction();
			await newFolder.save();
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
			message: 'Folder document saved with success',
			folder: newFolder
		});
	}

	static async shareFolder(req: Request, res: Response): Promise<void> {
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

		const pid = String(reqBody.pid);
		const folder = await FolderModel.findById(pid);
		if (folder === null) {
			res.status(400).jsonp({ message: 'Folder not found' });
			return;
		}

		if (folder.owner !== owner.uid) {
			res.status(401).jsonp({ message: 'User not authorized to share folder' });
			return;
		}

		if (
			receiver.sharedFolders.includes(folder._id) ||
			folder.sharedTo.includes(receiver.uid)
		) {
			res
				.status(400)
				.jsonp({ message: 'Folder already shared with this user' });
			return;
		}

		receiver.sharedFolders.push(folder._id);
		folder.sharedTo.push(receiver.uid);
		const session = await startSession();

		try {
			session.startTransaction();
			await Promise.all([receiver.save(), folder.save()]);
			session.commitTransaction();
		} catch (err) {
			session.abortTransaction();
			let message = err?.message;
			if (message === null || message === undefined) {
				message = 'Error saving folders';
			}
			res.status(422).jsonp({ message: message });
			return;
		}

		res.status(200).jsonp({
			message: 'Folder saved with success',
			owner: owner,
			receiver: receiver
		});
	}

	static async shareFolderToMultipleUsers(
		req: Request,
		res: Response
	): Promise<void> {
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

		const receiverUIDs = reqBody.receivers;
		const receivers = await UserModel.find({
			uid: { $in: receiverUIDs }
		});

		if (receivers === null) {
			res.status(400).jsonp({ message: 'Receivers not found' });
			return;
		}

		const pid = String(reqBody.pid);
		const folder = await FolderModel.findById(pid);
		if (folder === null) {
			res.status(400).jsonp({ message: 'Folder not found' });
			return;
		}

		if (folder.owner !== owner.uid) {
			res.status(401).jsonp({ message: 'User not authorized to share folder' });
			return;
		}

		for (const receiver of receivers) {
			if (
				receiver.sharedFolders.includes(folder._id) ||
				folder.sharedTo.includes(receiver.uid)
			) {
				continue;
			}

			receiver.sharedFolders.push(folder._id);
			folder.sharedTo.push(receiver.uid);
			const session = await startSession();

			try {
				session.startTransaction();
				await Promise.all([receiver.save(), folder.save()]);
				session.commitTransaction();
			} catch (err) {
				session.abortTransaction();
				let message = err?.message;
				if (message === null || message === undefined) {
					message = 'Error saving folders';
				}
				res.status(422).jsonp({ message: message });
				return;
			}
		}

		res.status(200).jsonp({
			message: 'Folder saved with success',
			owner: owner,
			receiver: receivers
		});
	}

	static async getFolder(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).jsonp(errors.array());
			return;
		}

		const pid = String(req.query.pid);
		const folder = await FolderModel.findById(pid);

		if (folder === null) {
			res.status(400).jsonp({ message: 'Folder not found' });
			return;
		}

		res.status(200).jsonp(folder);
	}

	static async deleteFolder(req: Request, res: Response): Promise<void> {
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

		const pid = String(req.query.pid);
		const folderToDelete = await FolderModel.findById(pid);
		if (folderToDelete === null) {
			res.status(400).jsonp({ message: 'Folder not found' });
			return;
		}

		if (folderToDelete.owner !== owner.uid) {
			res
				.status(401)
				.jsonp({ message: 'User not authorized to delete folder' });
			return;
		}

		const session = await startSession();
		try {
			session.startTransaction();
			const sharedTo = folderToDelete.sharedTo;
			for (const sharedUserId of sharedTo) {
				const sharedUser = await UserModel.findOne({ uid: sharedUserId });
				if (sharedUser === null) {
					continue;
				}
				sharedUser.sharedFolders.filter((folder) => {
					return !folder.equals(folderToDelete._id);
				});
				await sharedUser.save();
			}
			await FolderModel.findOneAndDelete({ _id: pid });
			session.commitTransaction();
		} catch (err) {
			session.abortTransaction();
			let message = err?.message;
			if (message === null || message === undefined) {
				message = 'Error saving folders';
			}
			res.status(422).jsonp({ message: message });
			return;
		}

		res.status(200).jsonp({
			message: 'Folder deleted successfully'
		});
	}
}
