import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';

import React from 'react';

export default function CustomContext() {
	const handleClick = (e: MouseEvent, data: Record<string, unknown>) => {
		console.log(data);
	};

	return (
		<div>
			{/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
			{/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}

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
