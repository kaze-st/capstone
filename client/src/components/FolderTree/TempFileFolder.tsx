import { AiOutlineFile, AiOutlineFolder } from 'react-icons/ai';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import './FolderTree.scss';
import { useFolderTree } from './FolderTreeContext';
import { Key as KeyEvent } from 'ts-key-enum';

const StyledFile = styled.div`
	padding-left: 20px;
	display: flex;
	align-items: center;
	span {
		margin-left: 5px;
	}
`;

interface ITempFileProps {
	parentFolderId: number;
	setIsBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TempInput(props: ITempFileProps): JSX.Element {
	const { parentFolderId, setIsBlur } = props;

	const {
		tempInputName,
		setTempInputName,
		addFileToTree,
		addFolderToTree,
		currDisplayedTempInput,
		setCurrDisplayedTempInput
	} = useFolderTree();

	const [isFocus, setIsFocus] = useState(false);

	const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (setTempInputName !== undefined) {
			setTempInputName(event.target.value);
		}
	};

	const handleFocus = () => {
		setIsBlur(true);
		setIsFocus(true);
	};

	const handleClickAway = () => {
		setIsBlur(false);
		setIsFocus(false);

		// reset default state of the context
		if (setTempInputName !== undefined) {
			setTempInputName('');
		}
		if (setCurrDisplayedTempInput !== undefined) {
			setCurrDisplayedTempInput({
				...currDisplayedTempInput,
				parentFolderId: -1,
				isFolder: false
			});
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === KeyEvent.Enter) {
			if (currDisplayedTempInput.isFolder && addFolderToTree !== null) {
				addFolderToTree(parentFolderId);
			}
			if (!currDisplayedTempInput.isFolder && addFileToTree !== null) {
				addFileToTree(parentFolderId);
			}
			handleClickAway();
		}
	};

	const isInputFocused = isFocus ? 'focused' : '';
	const key = `temp-file-of-folder:${parentFolderId}:created:`;

	const isHidden =
		currDisplayedTempInput.parentFolderId !== parentFolderId ? 'hidden' : '';
	const icon = currDisplayedTempInput.isFolder ? (
		<AiOutlineFolder />
	) : (
		<AiOutlineFile />
	);

	// FOR AUTO FOCUS
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (!isHidden) {
			if (inputRef !== null && inputRef.current !== null) {
				inputRef.current.focus();
			}
		}
	}, [isHidden]);

	return (
		<div key={key} className={isHidden}>
			<StyledFile>
				{icon}
				<input
					className={`temp-file-input ${isInputFocused}`}
					type="text"
					value={tempInputName}
					placeholder={
						currDisplayedTempInput.isFolder
							? 'New Folder Name'
							: 'New File Name'
					}
					onChange={handleFileNameChange}
					onFocus={handleFocus}
					onBlur={handleClickAway}
					onKeyDown={handleKeyDown}
					ref={inputRef}
				/>
			</StyledFile>
		</div>
	);
}
