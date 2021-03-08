import './FileCard.scss';
import './ExtensionsColor.scss';

import { ContextMenuTrigger } from 'react-contextmenu';
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
	return (
		<div>
			<ContextMenuTrigger id={fid}>
				<Link to={`/file/${fid}`}>
					<div className="file-card">
						<div className={`file-card-img-container ${extension}`}>
							<img src={imageSource} alt={name} />
						</div>

						<div className="file-card-name">
							<p>{`${name}.${extension}`}</p>
						</div>
					</div>
				</Link>
			</ContextMenuTrigger>
			<CustomContext fid={fid} />
		</div>
	);
}

export function RecentFileCard(
	props: IFileProp & { createdOn: string }
): JSX.Element {
	const { imageSource, name, extension, fid, createdOn } = props;
	const uniqueID = `${fid}-recent`;
	const date = new Date(createdOn);
	return (
		<div>
			<ContextMenuTrigger id={uniqueID}>
				<Link to={`/file/${fid}`}>
					<div className="file-card recent-file">
						<div className={`file-card-img-container ${extension}`}>
							<img src={imageSource} alt={name} />
						</div>

						<div className="file-card-name">
							<p>{`${name}.${extension}`}</p>
							<p>Created on {date.toUTCString()}</p>
						</div>
					</div>
				</Link>
			</ContextMenuTrigger>
			<CustomContext fid={uniqueID} />
		</div>
	);
}
