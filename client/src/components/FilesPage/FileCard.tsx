import './FileCard.scss';
import './ExtensionsColor.scss';

import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';

import CustomContext from './CustomContext';
import { Link } from 'react-router-dom';
import React from 'react';

interface IFileProp {
	imageSource: string;
	name: string;
	extension: string;
	fid: string;
}

export default function FileCard(props: IFileProp): JSX.Element {
	const { imageSource, name, extension, fid } = props;
	console.log(fid);
	return (
		<div>
			<ContextMenuTrigger id="same_unique_identifier">
				<Link to={`/file/${fid}`}>
					<div className="file-card">
						<div className={`file-card-img-container ${extension}`}>
							<img src={imageSource} alt={name} />
						</div>

						<div className="file-card-name">
							<div>{`${name}.${extension}`}</div>
						</div>
					</div>
				</Link>
			</ContextMenuTrigger>
			<CustomContext />
		</div>
	);
}
