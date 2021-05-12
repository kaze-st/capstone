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

interface ITempInputProps {
	parentFolderId: number;
	setIsBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TempInput(props: ITempInputProps): JSX.Element {
	const { parentFolderId, setIsBlur } = props;

	const {
		tempInputState,
		setTempInputState,
		addFileToTree,
		addFolderToTree,
		currDisplayedTempInput,
		setCurrDisplayedTempInput
	} = useFolderTree();

	const [isFocus, setIsFocus] = useState(false);

	const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (setTempInputState !== undefined) {
			setTempInputState({
				...tempInputState,
				tempInputName: event.target.value,
				isSetting: true
			});
		}
	};

	const resetCurrentlyDisplayedTempInput = () => {
		if (setTempInputState !== undefined) {
			setTempInputState({
				...tempInputState,
				tempInputName: '',
				isSetting: false
			});
		}
		if (setCurrDisplayedTempInput !== undefined) {
			setCurrDisplayedTempInput({
				...currDisplayedTempInput,
				parentFolderId: -1,
				isFolder: false
			});
		}
	};

	const handleFocus = () => {
		setIsBlur(true);
		setIsFocus(true);
	};

	const handleClickAway = () => {
		setIsBlur(false);
		setIsFocus(false);
		resetCurrentlyDisplayedTempInput();
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
		<div className={isHidden}>
			<StyledFile>
				{icon}
				<input
					className={`temp-input ${isInputFocused}`}
					type="text"
					value={tempInputState.tempInputName}
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
