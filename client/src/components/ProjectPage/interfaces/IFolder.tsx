export default interface IFolder {
	_id: string;
	name: string;
	createdOn: string;
	lastEditedOn: string;
	owner: string;
	sharedTo: Array<string>;
}
