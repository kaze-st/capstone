import mongoose, { Document, Schema } from 'mongoose';

export abstract class BaseModel<T extends Document> {
	abstract getName(): string;

	abstract getSchema(): Schema<T>;

	getInstance(): mongoose.Model<T> {
		const schema = this.getSchema();
		const name = this.getName();
		mongoose.Schema.Types.String.checkRequired((v) => typeof v === 'string');
		mongoose.Schema.Types.Buffer.checkRequired((v) => Buffer.isBuffer(v));
		return mongoose.model<T>(name, schema);
	}
}
