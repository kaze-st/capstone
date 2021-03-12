import { ContextMenu, MenuItem } from 'react-contextmenu';

import React from 'react';

export default function CardRightClickMenu(): JSX.Element {
	return (
		<div>
			<ContextMenu id="same_unique_identifier">
				<MenuItem data={{ foo: 'bar' }}>Open File</MenuItem>
				<MenuItem data={{ foo: 'bar' }}>Share File</MenuItem>
			</ContextMenu>
		</div>
	);
}
