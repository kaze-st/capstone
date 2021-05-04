import mongoose, { Document, Schema } from 'mongoose';

import { BaseModel } from '@models/BaseModel';

export interface IFile extends Document {
	name: string;
	content: string;
	createdOn: Date;
	lastEditedOn: Date;
	owner: string;
	sharedTo: Array<string>;
	extension: string;
	state: Buffer;
}

class FileModel extends BaseModel<IFile> {
	getName(): string {
		return 'files';
	}

	getSchema(): Schema<IFile> {
		return new mongoose.Schema(
			{
				name: { type: String, required: true },
				content: { type: String, required: true },
				createdOn: { type: Date, required: true },
				lastEditedOn: { type: Date, required: true },
				owner: { type: String, required: true },
				sharedTo: { type: [String], required: true },
				extension: { type: String, required: true },
				state: { type: Buffer, required: true }
			},
			{ collection: 'files' }
		);
	}
}

export default new FileModel().getInstance();
