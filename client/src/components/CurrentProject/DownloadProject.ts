import * as Y from 'yjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function createTree(project: Y.Map<unknown>, zip: JSZip) {
	const nodes: JSZip.JSZipObject[] = [];

	const itemKeys = Array.from(project.keys());

	itemKeys.forEach((key) => {
		if (!(project.get(key) instanceof Y.Map)) {
			return;
		}
		const curr = project.get(key) as Y.Map<unknown>;
		if (!curr.get('isFolder')) {
			// FILE
			const fileName = curr.get('name') as string;
			const content = (curr.get('content') as Y.Text).toJSON();
			zip.file(fileName, content);
		} else {
			// FOLDER
			const folderName = curr.get('name') as string;
			const folder = zip.folder(folderName);
			if (folder !== null) createTree(curr, folder);
		}
	});

	return nodes;
}

export default function downloadProject(
	project: Y.Map<unknown> | null,
	projectName: string
): void {
	const zip = new JSZip();
	if (project !== null) createTree(project, zip);
	zip.generateAsync({ type: 'blob' }).then((content) => {
		// see FileSaver.js
		saveAs(content, `${projectName}.zip`);
	});
}
