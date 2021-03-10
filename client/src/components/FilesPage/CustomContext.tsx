import { ContextMenu, MenuItem } from 'react-contextmenu';

import { Link } from 'react-router-dom';
import React from 'react';

export default function CustomContext(props: { id: string; fid: string }) {
	const { id, fid } = props;

	const handleShare = () => {
		console.log(`/file/${fid}`);
	};

	return (
		<div>
			{/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
			{/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}
			<ContextMenu id={id}>
				<MenuItem>
					<Link to={`/file/${fid}`}>Open File</Link>
				</MenuItem>
				<MenuItem onClick={handleShare}>Share File</MenuItem>
			</ContextMenu>
		</div>
	);
}
