import React from 'react';

interface IFileProp {
	imageSource: string;
	name: string;
	extension: string;
}

export default function File(props: IFileProp): JSX.Element {
	const { imageSource, name, extension } = props;
	return (
		<div className="file-card">
			<img src={imageSource} alt={name} />
			<div>{`${name}.${extension}`}</div>
			<div>{imageSource}</div>
		</div>
	);
}
