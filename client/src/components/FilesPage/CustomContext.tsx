import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';

import { ProxyTypeSet } from 'immer/dist/internal';
import React from 'react';

const MENU_TYPE = 'SIMPLE';

interface Files {
	file: {
		_id: string;
		sharedTo: string[];
		name: string;
		createdOn: string;
		owner: string;
		extension: string;
		__v: number;
	};
}

export default function CustomContext({ file }: Files) {
	const handleClick = (e: MouseEvent, data: Record<string, unknown>) => {
		console.log(data);
	};

	return (
		<div>
			{/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
			{/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}

			<ContextMenuTrigger id="same_unique_identifier">
				<div className="well">{file.name}</div>
			</ContextMenuTrigger>

			<ContextMenu id="same_unique_identifier">
				<MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
					ContextMenu Item 1
				</MenuItem>
				<MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
					ContextMenu Item 2
				</MenuItem>
				<MenuItem divider />
				<MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
					ContextMenu Item 3
				</MenuItem>
			</ContextMenu>
		</div>
	);
}
