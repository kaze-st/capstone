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

interface IFolderTreeContext {
	tempInputName: string;
	setTempInputName: React.Dispatch<React.SetStateAction<string>> | undefined;

	currDisplayedTempInput: ICurrDisplayedTempInput;
	setCurrDisplayedTempInput:
		| React.Dispatch<React.SetStateAction<ICurrDisplayedTempInput>>
		| undefined;

	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	};
	addFileToTree: ((folderId: number) => void) | null;
	addFolderToTree: ((folderId: number) => void) | null;
}

const TreeContext = React.createContext<IFolderTreeContext>({
	tempInputName: '',
	setTempInputName: undefined,

	currDisplayedTempInput: {
		parentFolderId: -1,
		isFolder: false
	},
	setCurrDisplayedTempInput: undefined,

	idToNodeMap: {},
	addFileToTree: null,
	addFolderToTree: null
});

export function useFolderTree(): IFolderTreeContext {
	return useContext(TreeContext);
}

export default function FolderTreeProvider(
	props: ITreeProviderProps
): JSX.Element {
	const { children } = props;
	const [tempInputName, setTempInputName] = useState('');
	const [currDisplayedTempInput, setCurrDisplayedTempInput] = useState({
		parentFolderId: -1,
		isFolder: false
	});

	const { idToNodeMap } = useFolderTree();

	const addFileToTree = (folderId: number) => {
		let newName = tempInputName;
		const currentFolder = idToNodeMap[folderId];
		let counter = 1;
		while (currentFolder.has(newName)) {
			// name already exist, add keep going until we don't have dup
			newName = `${tempInputName} (${counter})`;
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
		let newName = tempInputName;
		const currentFolder = idToNodeMap[folderId];
		let counter = 1;
		while (currentFolder.has(newName)) {
			// name already exist, add keep going until we don't have dup
			newName = `${tempInputName} (${counter})`;
			counter += 1;
		}

		const newFolder = new Y.Map();
		currentFolder.set(newName, newFolder);
		newFolder.set('name', newName);
		newFolder.set('isFolder', true);

		const currentFolderPath = currentFolder.get('path') as string;
		newFolder.set('path', `${currentFolderPath + newName}/`);
	}

	const contextValue: IFolderTreeContext = {
		tempInputName,
		setTempInputName,
		currDisplayedTempInput,
		setCurrDisplayedTempInput,
		idToNodeMap,
		addFileToTree,
		addFolderToTree
	};

	return (
		<TreeContext.Provider value={contextValue}>{children}</TreeContext.Provider>
	);
}
