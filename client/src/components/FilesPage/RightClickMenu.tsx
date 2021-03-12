import './RightClickMenu.scss';

import { ContextMenu, MenuItem } from 'react-contextmenu';

import { Link } from 'react-router-dom';
import React from 'react';

export default function CardRightClickMenu(props: { id: string; fid: string }) {
	const { id, fid } = props;

	const handleShare = () => {
		console.log(`/file/${fid}`);
	};

	return (
		<div>
			<ContextMenu id={id} className="right-click-menu">
				<MenuItem className="menu-item">
					<Link to={`/file/${fid}`}>Open File</Link>
				</MenuItem>
				<MenuItem onClick={handleShare} className="menu-item">
					Share File
				</MenuItem>
			</ContextMenu>
		</div>
	);
}
