import React, { useState } from 'react';
import styled from 'styled-components';
import Folder from './Folder';
import File from './File';
import * as Y from 'yjs';

const StyledTree = styled.div`
	line-height: 1.5;
`;

interface ITreeProps {
	project: Y.Map<unknown>;
}

interface IProjectStructure {
	tree: JSX.Element[];
	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	};
	currId: [number];
}

function createTree(
	project: Y.Map<unknown>,
	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	},
	currId: [number]
) {
	const nodes: JSX.Element[] = [];

	const itemKeys = Array.from(project.keys());
	itemKeys.forEach((key) => {
		if (!(project.get(key) instanceof Y.Map)) {
			return;
		}
		const curr = project.get(key) as Y.Map<unknown>;
		if (!curr.get('isFolder')) {
			// FILE
			currId[0] += 1;
			const file = <File key={currId[0]} name={curr.get('name') as string} />;
			idToNodeMap[currId[0]] = curr;
			nodes.push(file);
		} else {
			// FOLDER
			const folderId = currId[0] + 1;
			currId[0] += 1;
			const children = createTree(curr, idToNodeMap, currId).tree;
			const folder = (
				<Folder key={folderId} name={curr.get('name') as string}>
					{children}
				</Folder>
			);
			idToNodeMap[folderId] = curr;
			nodes.push(folder);
		}
	});

	const result: IProjectStructure = { tree: nodes, idToNodeMap, currId };
	return result;
}

export default function FolderTree(props: ITreeProps): JSX.Element {
	const { project } = props;

	// const idToNodeMap: {
	// 	[id: number]: Y.Map<unknown>;
	// } = {};

	const [projectStructure, setProjectStructure] = useState<IProjectStructure>(
		createTree(project, {}, [0])
	);

	return <StyledTree>{projectStructure.tree}</StyledTree>;
}

FolderTree.File = File;
FolderTree.Folder = Folder;
