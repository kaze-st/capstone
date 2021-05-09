import { AiOutlineFile } from 'react-icons/ai';
import styled from 'styled-components';
import React from 'react';
import FILE_ICONS from './FileIcon';

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
}

export default function File(props: ITreeFileProps): JSX.Element {
	const { name } = props;
	const extensionArr = name.split('.');
	const extension = extensionArr[extensionArr.length - 1];

	return (
		<StyledFile>
			{/* render the extension or fallback to generic file icon  */}
			{FILE_ICONS[extension] || <AiOutlineFile />}
			<span>{name}</span>
		</StyledFile>
	);
}
