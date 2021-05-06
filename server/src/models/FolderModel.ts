import mongoose, { Document, Schema } from 'mongoose';

import { BaseModel } from '@models/BaseModel';

export interface IFolder extends Document {
	name: string;
	createdOn: Date;
	lastEditedOn: Date;
	owner: string;
	sharedTo: Array<string>;
	state: Buffer;
}

class FolderModel extends BaseModel<IFolder> {
	getName(): string {
		return 'folders';
	}

	getSchema(): Schema<IFolder> {
		return new mongoose.Schema(
			{
				name: { type: String, required: true },
				createdOn: { type: Date, required: true },
				lastEditedOn: { type: Date, required: true },
				owner: { type: String, required: true },
				sharedTo: { type: [String], required: true },
				state: { type: Buffer, required: true }
			},
			{ collection: 'folders' }
		);
	}
}

export default new FolderModel().getInstance();
