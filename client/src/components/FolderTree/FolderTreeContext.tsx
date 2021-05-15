import * as Y from 'yjs';
import React, { useContext, useState } from 'react';

interface ITreeProviderProps {
	children: React.ReactNode;
}

interface ITempInput {
	tempInputName: string;
	isSetting: boolean;
}

interface ICurrDisplayedTempInput {
	parentFolderId: number;
	isFolder: boolean;
}

interface ICurrRenamedFile {
	id: number;
	newName: string;
}

interface IFolderTreeContext {
	tempInputState: {
		tempInputName: string;
		isSetting: boolean;
	};
	setTempInputState:
		| React.Dispatch<React.SetStateAction<ITempInput>>
		| undefined;

	currDisplayedTempInput: ICurrDisplayedTempInput;
	setCurrDisplayedTempInput:
		| React.Dispatch<React.SetStateAction<ICurrDisplayedTempInput>>
		| undefined;

	currRenamingFile: ICurrRenamedFile;
	setCurrRenamingFile:
		| React.Dispatch<React.SetStateAction<ICurrRenamedFile>>
		| undefined;

	selectedFileId: number;
	setSelectedFileId: React.Dispatch<React.SetStateAction<number>> | undefined;

	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	};
	addFileToTree: ((folderId: number) => void) | null;
	addFolderToTree: ((folderId: number) => void) | null;
	renameItem: ((nodeId: number) => void) | null;
}

const TreeContext = React.createContext<IFolderTreeContext>({
	tempInputState: {
		tempInputName: '',
		isSetting: false
	},
	setTempInputState: undefined,

	currDisplayedTempInput: {
		parentFolderId: -1,
		isFolder: false
	},
	setCurrDisplayedTempInput: undefined,

	currRenamingFile: {
		id: -1,
		newName: ''
	},
	setCurrRenamingFile: undefined,

	selectedFileId: -1,
	setSelectedFileId: undefined,

	idToNodeMap: {},
	addFileToTree: null,
	addFolderToTree: null,
	renameItem: null
});

export function useFolderTree(): IFolderTreeContext {
	return useContext(TreeContext);
}

export default function FolderTreeProvider(
	props: ITreeProviderProps
): JSX.Element {
	const { children } = props;
	const [tempInputState, setTempInputState] = useState<ITempInput>({
		tempInputName: '',
		isSetting: false
	});
	const [
		currDisplayedTempInput,
		setCurrDisplayedTempInput
	] = useState<ICurrDisplayedTempInput>({
		parentFolderId: -1,
		isFolder: false
	});
	const [currRenamingFile, setCurrRenamingFile] = useState<ICurrRenamedFile>({
		id: -1,
		newName: ''
	});
	const [selectedFileId, setSelectedFileId] = useState(-1);

	const { idToNodeMap } = useFolderTree();

	const addFileToTree = (folderId: number) => {
		let newName = tempInputState.tempInputName;
		const currentFolder = idToNodeMap[folderId];
		let counter = 1;
		while (currentFolder.has(newName)) {
			// name already exist, add keep going until we don't have dup
			newName = `${tempInputState.tempInputName} (${counter})`;
			counter += 1;
		}

		const newFile = new Y.Map();
		currentFolder.set(newName, newFile);
		newFile.set('content', new Y.Text());
		newFile.set('name', newName);
		newFile.set('isFolder', false);

		const currentFolderPath = currentFolder.get('path') as string;
		newFile.set('path', currentFolderPath + newName);
	};

	function addFolderToTree(folderId: number) {
		let newName = tempInputState.tempInputName;
		const currentFolder = idToNodeMap[folderId];
		let counter = 1;
		while (currentFolder.has(newName)) {
			// name already exist, add keep going until we don't have dup
			newName = `${tempInputState.tempInputName} (${counter})`;
			counter += 1;
		}

		const newFolder = new Y.Map();
		currentFolder.set(newName, newFolder);
		newFolder.set('name', newName);
		newFolder.set('isFolder', true);

		const currentFolderPath = currentFolder.get('path') as string;
		newFolder.set('path', `${currentFolderPath + newName}/`);
	}

	const renameItem = (nodeId: number) => {
		const { newName } = currRenamingFile;
		const item = idToNodeMap[nodeId];
		const parent = item.parent as Y.Map<unknown>;
		const itemName = item.get('name') as string;
		if (itemName === newName) {
			return;
		}
		let renamedName = newName;
		let counter = 1;
		while (parent.has(renamedName)) {
			renamedName = `${newName} (${counter})`;
			counter += 1;
		}

		if (parent.has(itemName)) {
			const temp = item.clone() as Y.Map<unknown>;
			temp.set('name', renamedName);
			let newPath = parent.get('path') + renamedName;
			if (item.get('isFolder') === true) {
				newPath += '/';
			}
			temp.set('path', newPath);
			parent.set(renamedName, temp);
			parent.delete(itemName);
		}
	};

	const contextValue: IFolderTreeContext = {
		tempInputState,
		setTempInputState,
		currDisplayedTempInput,
		setCurrDisplayedTempInput,
		currRenamingFile,
		setCurrRenamingFile,
		selectedFileId,
		setSelectedFileId,
		idToNodeMap,
		addFileToTree,
		addFolderToTree,
		renameItem
	};

	return (
		<TreeContext.Provider value={contextValue}>{children}</TreeContext.Provider>
	);
}
