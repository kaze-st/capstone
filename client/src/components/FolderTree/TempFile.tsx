import { AiOutlineFile } from 'react-icons/ai';
import FILE_ICONS from './FileIcon';
import React, { useState } from 'react';
import styled from 'styled-components';
import './FolderTree.scss';

const StyledFile = styled.div`
	padding-left: 20px;
	display: flex;
	align-items: center;
	span {
		margin-left: 5px;
	}
`;

interface ITempFileProps {
	setIsBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TempFile(props: ITempFileProps): JSX.Element {
	const { setIsBlur } = props;

	const [fileName, setFileName] = useState('');
	const [isHidden, setIsHidden] = useState(true);
	const [isFocus, setIsFocus] = useState(false);

	const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFileName(event.target.value);
	};

	const handleFocus = () => {
		setIsBlur(true);
		setIsFocus(true);
	};

	const handleBlur = () => {
		setIsBlur(false);
		setIsFocus(false);
	};

	const isInputFocused = isFocus ? 'focused' : '';

	return (
		<div className={isHidden ? 'hidden' : ''}>
			<StyledFile>
				<AiOutlineFile />
				<input
					className={`temp-file-input ${isInputFocused}`}
					type="text"
					value={fileName}
					placeholder="New File Name"
					onChange={handleFileNameChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
			</StyledFile>
		</div>
	);
}
