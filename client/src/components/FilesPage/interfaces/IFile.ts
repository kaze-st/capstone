export default interface IFile {
	_id: string;
	name: string;
	createdOn: string;
	lastEditedOn: string;
	owner: string;
	extension: string;
	sharedTo: Array<string>;
}
