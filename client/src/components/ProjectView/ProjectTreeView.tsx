/* eslint-disable @typescript-eslint/dot-notation */

import * as Y from 'yjs';

import { Queue } from 'queue-typescript';
import React from 'react';

interface MapNode {
	module: string;
	id: string;
	childrenCount: number;
	leaf: boolean;
	children: MapNode[] | undefined;
}

function createTree(root) {
	const map: MapNode = {
		module: 'bogey',
		id: 'bogey',
		childrenCount: 1,
		leaf: false,
		children: []
	};

	const parentQueue = new Queue<MapNode>();
	parentQueue.enqueue(map);

	const childrenQueue = new Queue<JSON>();
	childrenQueue.enqueue(root);
	while (parentQueue.length > 0) {
		const currParent = parentQueue.dequeue();
		let childrenLeft = currParent.childrenCount;
		while (childrenLeft > 0 && childrenQueue.length > 0) {
			childrenLeft -= 1;
			const currChild = childrenQueue.dequeue();
			const childKeyList = Object.keys(currChild).filter(
				(key) => key !== 'content' && key !== 'name' && key !== 'id'
			);
			const node: MapNode = {
				module: currChild['name'],
				id: currChild['id'],
				childrenCount: childKeyList.length,
				leaf: currChild['content'] !== undefined,
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
	console.log(JSON.stringify(map));
	return map;
}

export default function ProjectTreeView(): JSX.Element {
	const ydoc = new Y.Doc();

	const folder1 = ydoc.getMap('structure');

	const file = new Y.Map();
	folder1.set('filehtml', file);
	folder1.set('name', 'Project 1');
	folder1.set('id', 0);

	const textforFile = new Y.Text();
	file.set('content', textforFile);
	file.set('name', 'index.html');
	file.set('id', 1);

	textforFile.insert(0, 'hfuewihfuiewhfiewhu');

	console.log(folder1.toJSON());
	createTree(folder1.toJSON());

	const nodes = [
		{
			id: 1,
			parentId: null,
			label: 'Project 1',
			items: [
				{
					id: 2,
					label: 'index.html',
					parentId: 1 // Removing parentId on files doesn't break code, unclear if needed
				},
				{
					id: 3,
					label: 'index.js',
					parentId: 1
				}
			]
		}
	];
	return <div>stuff</div>;
}
