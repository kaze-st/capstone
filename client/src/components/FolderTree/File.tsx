import { AiOutlineFile } from 'react-icons/ai';
import FILE_ICONS from './FileIcon';
import React from 'react';
import styled from 'styled-components';

const StyledFile = styled.div`
	padding-left: 20px;
	display: flex;
	align-items: center;
	span {
		margin-left: 5px;
	}
`;

interface ITreeFileProps {
	name: string;
	onFileClick: () => void;
}

function getExtensionFromFileName(name: string) {
	let extension = '';
	if (name !== null && name !== undefined) {
		const extensionArr = name.split('.');
		if (extensionArr.length > 0) {
			extension = extensionArr[extensionArr.length - 1];
		}
	}
	return extension;
}

export default function File(props: ITreeFileProps): JSX.Element {
	const { name, onFileClick } = props;

	const extension = getExtensionFromFileName(name);

	return (
		<StyledFile
			onClick={() => {
				onFileClick();
			}}
		>
			{/* render the extension or fallback to generic file icon  */}
			{FILE_ICONS[extension] || <AiOutlineFile />}
			<span>{name}</span>
		</StyledFile>
	);
}
