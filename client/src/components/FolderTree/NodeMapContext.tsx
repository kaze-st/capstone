import React, { useContext, useState } from 'react';

interface ITreeProviderProps {
	children: React.ReactNode;
}

interface IFolderTreeContext {
	tree: any;
}

const TreeContext = React.createContext({
	tree: null
});

export function useFolderTree(): IFolderTreeContext {
	return useContext(TreeContext);
}

export default function FolderTreeProvider(
	props: ITreeProviderProps
): JSX.Element {
	const { children } = props;
	const [x, setX] = useState('');

	const contextValue: IFolderTreeContext = {
		tree: null
	};

	return (
		<TreeContext.Provider value={contextValue}>{children}</TreeContext.Provider>
	);
}
