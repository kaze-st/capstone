import './FileCard.scss';
import './ExtensionsColor.scss';

import CardRightClickMenu from './RightClickMenu';
import { ContextMenuTrigger } from 'react-contextmenu';
import IFile from './interfaces/IFile';
import { Link } from 'react-router-dom';
import React from 'react';

interface IFileCardProp {
	imageSource: string;
	name: string;
	extension: string;
	file: IFile;
	handleShareModalOpen: () => void;
	setCurrentFileToShare: React.Dispatch<
		React.SetStateAction<IFile | undefined>
	>;
}

export default function FileCard(props: IFileCardProp): JSX.Element {
	const {
		imageSource,
		name,
		extension,
		file,
		handleShareModalOpen,
		setCurrentFileToShare
	} = props;
	// eslint-disable-next-line
	const fid = file._id;
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
			<CardRightClickMenu
				file={file}
				id={fid}
				handleShareModalOpen={handleShareModalOpen}
				setCurrentFileToShare={setCurrentFileToShare}
			/>
		</div>
	);
}

export function RecentFileCard(
	props: IFileCardProp & { lastEditedOn: string }
): JSX.Element {
	const {
		imageSource,
		name,
		extension,
		file,
		lastEditedOn,
		handleShareModalOpen,
		setCurrentFileToShare
	} = props;
	// eslint-disable-next-line
	const fid = file._id;
	const uniqueID = `${fid}-recent`;
	const date = new Date(lastEditedOn);
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
							<p>Last edited on {date.toLocaleString()}</p>
						</div>
					</div>
				</Link>
			</ContextMenuTrigger>
			<CardRightClickMenu
				id={uniqueID}
				file={file}
				handleShareModalOpen={handleShareModalOpen}
				setCurrentFileToShare={setCurrentFileToShare}
			/>
		</div>
	);
}
