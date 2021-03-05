import './FileCard.scss';

import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';

import CustomContext from './CustomContext';
import React from 'react';

interface IFileProp {
	imageSource: string;
	name: string;
	extension: string;
}

export default function FileCard(props: IFileProp): JSX.Element {
	const { imageSource, name, extension } = props;
	return (
		<div className="file-card">
			<ContextMenuTrigger id="same_unique_identifier">
				<img src={imageSource} alt={name} />
			</ContextMenuTrigger>
			<CustomContext />
			<div className="file-card-name">{`${name}.${extension}`}</div>
		</div>
	);
}