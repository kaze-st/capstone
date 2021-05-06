import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel } from '@models/BaseModel';
import { ObjectId } from 'mongodb';

export interface IUser extends Document {
	uid: string;
	email: string;
	name: string;
	lastName: string;
	ownedFiles: Array<ObjectId>;
	sharedFiles: Array<ObjectId>;
	ownedFolders: Array<ObjectId>;
	sharedFolders: Array<ObjectId>;
}

class UserModel extends BaseModel<IUser> {
	getName(): string {
		return 'users';
	}

	getSchema(): Schema<IUser> {
		return new mongoose.Schema(
			{
				uid: { type: String, required: true },
				email: { type: String, required: true },
				name: { type: String, required: true },
				lastName: { type: String, required: true },
				ownedFiles: { type: [ObjectId], required: true },
				sharedFiles: { type: [ObjectId], required: true },
				ownedFolders: { type: [ObjectId], required: true },
				sharedFolders: { type: [ObjectId], required: true }
			},
			{ collection: 'users' }
		);
	}
}

export default new UserModel().getInstance();
