/* eslint-disable @typescript-eslint/dot-notation */

import * as Y from 'yjs';

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import React, { Fragment, useState } from 'react';

import AddItemType from './AddItemType';
import Icon from 'react-icons-kit';
import { Queue } from 'queue-typescript';
import { StrollableContainer } from 'react-stroller';
import Tree from 'react-ui-tree';
import { chevronsDown } from 'react-icons-kit/feather/chevronsDown';
import { chevronsRight } from 'react-icons-kit/feather/chevronsRight';
import { file } from 'react-icons-kit/feather/file';
import { filePlus } from 'react-icons-kit/feather/filePlus';
import { folder } from 'react-icons-kit/feather/folder';
import { folderPlus } from 'react-icons-kit/feather/folderPlus';
import { randomInt } from 'crypto';
import styled from 'styled-components';

interface MapNode {
	module: unknown;
	id: string;
	childrenCount: number;
	leaf: boolean;
	collapsed: boolean;
	children: MapNode[] | undefined;
	path: Y.Map<unknown>;
}

interface IProps {
	project: any;
}

const LightScrollbar = styled.div`
	width: 10px;
	background-color: #fff;
	opacity: 0.7;
	border-radius: 4px;
	margin: 4px;
`;
const Toolbar = styled.div`
	position: relative;
	display: flex;
	color: #d8e0f0;
	z-index: +1;
	/*border: 1px solid white;*/
	padding-bottom: 4px;
	i {
		margin-right: 5px;
		cursor: pointer;
	}
	i :hover {
		color: #d8e0f0;
	}
`;

const FloatLeft = styled.span`
	padding-left: 4px;
	width: 100%;
`;

const ToolbarFileFolder = styled.div`
	position: absolute;
	text-align: right;
	width: 92%;
	color: transparent;
	&:hover {
		color: #d8e0f0;
	}
`;

function collect(props) {
	return props;
}

interface IProjectStructure {
	tree: MapNode;
	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	};
}

function createTree(project) {
	const idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	} = {};

	const rootNode: MapNode = {
		module: 'bogey',
		id: 'bogey',
		childrenCount: 1,
		leaf: false,
		collapsed: false,
		children: [],
		path: new Y.Map()
	};

	const parentQueue = new Queue<MapNode>();
	parentQueue.enqueue(rootNode);

	const childrenQueue = new Queue<Y.Map<unknown>>();
	childrenQueue.enqueue(project);
	let id = 0;
	while (parentQueue.length > 0) {
		const currParent = parentQueue.dequeue();
		let childrenLeft = currParent.childrenCount;
		const parentId = id;
		while (childrenLeft > 0 && childrenQueue.length > 0) {
			id += 1;
			childrenLeft -= 1;
			const currChild = childrenQueue.dequeue();
			const childKeyList = Array.from(currChild.keys()).filter(
				(key) =>
					key !== 'content' &&
					key !== 'name' &&
					key !== 'extension' &&
					key !== 'path'
			);
			const node: MapNode = {
				module: currChild.get('name'),
				id: id.toString(),
				childrenCount: childKeyList.length,
				leaf: currChild.get('content') !== undefined,
				collapsed: false,
				children: currChild.get('content') !== undefined ? undefined : [],
				path: currChild
			};
			idToNodeMap[id] = node.path;

			if (currParent.children !== undefined) {
				currParent.children.push(node);
			}
			parentQueue.enqueue(node);
			childKeyList.forEach((key) => {
				const val = currChild.get(key) as Y.Map<unknown>;
				childrenQueue.enqueue(val);
			});
		}
	}
	const tree =
		rootNode.children !== undefined ? rootNode.children[0] : rootNode;
	const result: IProjectStructure = { tree, idToNodeMap };
	return result;
}

export default function ProjectTreeView(props: IProps): JSX.Element {
	const { project } = props;
	console.log('abc');
	// ymap => 3 ymap

	const [projectStructure, setProjectStructure] = useState(createTree(project));

	const addItem = (itemType, node) => {
		console.log(itemType, node);
		const currentFolder = projectStructure.idToNodeMap[node.id];
		if (itemType === AddItemType.File) {
			console.log('file');
			const newFile = new Y.Map();
			const fileName = `file ${Math.random()}`;
			currentFolder.set(fileName, newFile);
			newFile.set('content', new Y.Text());
			newFile.set('name', `${fileName}.gg`);

			console.log(project);
			setProjectStructure(createTree(project));

			// currentFolder.set('html', file);
			// htmlFile.set('content', new Y.Text());
			// htmlFile.set('name', 'index.html');
		} else if (itemType === AddItemType.Project) {
			console.log('proj');
		}
	};

	const renderNode = (node) => {
		console.log('helloNode', node);
		const renderFileFolderToolbar = (isFolder, caption) => (
			<Toolbar>
				<FloatLeft>
					<Icon icon={isFolder ? folder : file} />
					{caption}
				</FloatLeft>
				<ToolbarFileFolder>
					{isFolder && (
						<>
							<Icon
								icon={folderPlus}
								onClick={() => addItem(AddItemType.Project, node)}
							/>
							<Icon
								icon={filePlus}
								onClick={() => addItem(AddItemType.File, node)}
							/>
						</>
					)}
				</ToolbarFileFolder>
			</Toolbar>
		);

		const isFolder = node.children !== undefined;
		return (
			<ContextMenuTrigger
				id="FILE_CONTEXT_MENU"
				key={node.id}
				collect={collect}
				holdToDisplay={-1}
			>
				{renderFileFolderToolbar(isFolder, node.module)}
			</ContextMenuTrigger>
		);
	};

	return (
		<nav className="prj-tree-nav">
			<div className="tree">
				<StrollableContainer draggable bar={LightScrollbar}>
					<Tree
						paddingLeft={20}
						tree={projectStructure.tree}
						renderNode={renderNode}
					/>
				</StrollableContainer>
			</div>

			<ContextMenu id="FILE_CONTEXT_MENU" className="right-click-menu">
				<MenuItem
					data={{ action: 'rename' }} /* onClick={this.handleContextClick} */
					className="menu-item"
				>
					Rename
				</MenuItem>
				<MenuItem
					data={{ action: 'delete' }} /* onClick={this.handleContextClick} */
					className="menu-item"
				>
					Delete
				</MenuItem>
			</ContextMenu>
		</nav>
	);
}
