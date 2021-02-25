import mongoose, { Document, Schema } from 'mongoose';

import { BaseModel } from '@models/BaseModel';

export interface IUser extends Document {
	uid: string;
	name: string;
	lastName: string;
	// TODO Add file type once implemented
	ownedFiles: Array<any>; // eslint-disable-line
	sharedFiles: Array<any>; // eslint-disable-line
}

class UserModel extends BaseModel<IUser> {
	getName(): string {
		return 'users';
	}

	getSchema(): Schema<IUser> {
		return new mongoose.Schema(
			{
				uid: { type: String, required: true },
				name: { type: String, required: true },
				lastName: { type: String, required: true },
				ownedFiles: { type: [String], required: true },
				sharedFiles: { type: [String], required: true }
			},
			{ collection: 'users' }
		);
	}
}

export default new UserModel().getInstance();
