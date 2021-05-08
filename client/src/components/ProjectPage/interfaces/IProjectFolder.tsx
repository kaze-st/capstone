export default interface IProjectFolder {
	_id: string;
	name: string;
	createdOn: string;
	lastEditedOn: string;
	owner: string;
	sharedTo: Array<string>;
}
