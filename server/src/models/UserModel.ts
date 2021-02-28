import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel } from '@models/BaseModel';
import FileModel from './FileModel';
import { IFile } from './FileModel';

export interface IUser extends Document {
	uid: string;
	name: string;
	lastName: string;
	ownedFiles: Array<IFile>;
	sharedFiles: Array<IFile>;
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
				ownedFiles: { type: [FileModel.schema], required: true },
				sharedFiles: { type: [FileModel.schema], required: true }
			},
			{ collection: 'users' }
		);
	}
}

export default new UserModel().getInstance();
