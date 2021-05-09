/* eslint-disable @typescript-eslint/dot-notation */

import * as Y from 'yjs';

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import React, { Fragment, useState } from 'react';

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
import styled from 'styled-components';

interface MapNode {
	module: string;
	id: string;
	childrenCount: number;
	leaf: boolean;
	collapsed: boolean;
	children: MapNode[] | undefined;
}

interface IProps {
	project: any;
	onFileClick: (e) => void;
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

function deleteFromTree(o, id) {}

function createTree(root) {
	const map: MapNode = {
		module: 'bogey',
		id: 'bogey',
		childrenCount: 1,
		leaf: false,
		collapsed: false,
		children: []
	};

	const parentQueue = new Queue<MapNode>();
	parentQueue.enqueue(map);

	const childrenQueue = new Queue<JSON>();
	childrenQueue.enqueue(root);
	let idCount = 0;
	while (parentQueue.length > 0) {
		idCount += 1;
		const currParent = parentQueue.dequeue();
		let childrenLeft = currParent.childrenCount;
		while (childrenLeft > 0 && childrenQueue.length > 0) {
			childrenLeft -= 1;
			const currChild = childrenQueue.dequeue();
			const childKeyList = Object.keys(currChild).filter(
				(key) => key !== 'content' && key !== 'name' && key !== 'extension'
			);
			const node: MapNode = {
				module: currChild['name'],
				id: idCount.toString(),
				childrenCount: childKeyList.length,
				leaf: currChild['content'] !== undefined,
				collapsed: false,
				children: currChild['content'] !== undefined ? undefined : []
			};
			if (currParent.children !== undefined) {
				currParent.children.push(node);
			}
			parentQueue.enqueue(node);
			childKeyList.forEach((key) => {
				childrenQueue.enqueue(currChild[key]);
			});
		}
	}
	return map.children !== undefined ? map.children[0] : map;
}

export default function ProjectTreeView(props: IProps): JSX.Element {
	const { project, onFileClick } = props;

	// const ydoc = new Y.Doc();

	// const folder1 = ydoc.getMap('structure');

	// const file1 = new Y.Map();
	// folder1.set('filehtml', file1);
	// folder1.set('name', 'Project 1');

	// const textforFile = new Y.Text();
	// file1.set('content', textforFile);
	// file1.set('extension', 'html');
	// file1.set('name', 'index.html');

	// textforFile.insert(0, 'hfuewihfuiewhfiewhu');

	// const file2 = new Y.Map();
	// folder1.set('filecss', file2);

	// const textforFile2 = new Y.Text();
	// file2.set('content', textforFile2);
	// file2.set('extension', 'css');
	// file2.set('name', 'index.css');

	// textforFile2.insert(0, 'wdwdwdwdwdw');
	const [tree, setTree] = useState(createTree(project));
	const addItem = (itemType, active) => {};

	const handleContextClick = (event) => {};
	const renderNode = (node) => {
		console.log('helloNode', node);
		const renderFileFolderToolbar = (isFolder, caption) => (
			<Toolbar>
				<FloatLeft onClick={onFileClick}>
					<Icon icon={isFolder ? folder : file} />
					{caption}
				</FloatLeft>
				<ToolbarFileFolder>
					{isFolder && (
						<>
							<Icon icon={folderPlus} onClick={() => addItem('folder', node)} />
							<Icon icon={filePlus} onClick={() => addItem('file', node)} />
						</>
					)}
				</ToolbarFileFolder>
			</Toolbar>
		);

		/* const attributes = {
      "data-count": 0,
      className: "example-multiple-targets well"
    }; */

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
		<div>
			<div className="tree">
				<StrollableContainer draggable bar={LightScrollbar}>
					<Tree paddingLeft={20} tree={tree} renderNode={renderNode} />
				</StrollableContainer>
			</div>

			<ContextMenu id="FILE_CONTEXT_MENU" className="right-click-menu">
				{/* Add copy / cut later */}
				{/* <MenuItem data={{ action: "copy" }} onClick={this.handleContextClick}>
            Copy
          </MenuItem>
          <MenuItem divider /> */}
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
		</div>
	);
}
