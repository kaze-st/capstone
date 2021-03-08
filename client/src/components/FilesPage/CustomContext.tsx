import { ContextMenu, MenuItem } from 'react-contextmenu';

import React from 'react';

export default function CustomContext(props: { fid: string }) {
	const { fid } = props;
	const handleClick = (e: MouseEvent, data: Record<string, unknown>) => {
		console.log(fid);
	};

	return (
		<div>
			{/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
			{/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}

			<ContextMenu id={fid}>
				<MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
					Open File
				</MenuItem>
				<MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
					Share File
				</MenuItem>
				<MenuItem divider />
				<MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
					Delete File
				</MenuItem>
			</ContextMenu>
		</div>
	);
}
