import React from 'react';
import './FileCard.scss';

interface IFileProp {
	imageSource: string;
	name: string;
	extension: string;
}

export default function FileCard(props: IFileProp): JSX.Element {
	const { imageSource, name, extension } = props;
	return (
		<div className="file-card">
			<img src={imageSource} alt={name} />
			<div className="file-card-name">{`${name}.${extension}`}</div>
		</div>
	);
}
