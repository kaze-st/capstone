import React, { useEffect, useRef, useState } from 'react';

import { AiOutlineFile } from 'react-icons/ai';
import FILE_ICONS from './FileIcon';
import { Key as KeyEvent } from 'ts-key-enum';
import styled from 'styled-components';
import { useFolderTree } from './FolderTreeContext';

const StyledFile = styled.div`
	margin-left: 20px;
	display: flex;
	align-items: center;
	span {
		margin-left: 5px;
	}
`;

interface ITreeFileProps {
	id: number;
	name: string;
	onFileClick: () => void;
	setIsBlur: React.Dispatch<React.SetStateAction<boolean>>;
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
	const { id, name, onFileClick, setIsBlur } = props;
	const [isFocus, setIsFocus] = useState(false);
	const { currRenamingFile, setCurrRenamingFile, renameItem } = useFolderTree();

	const extension = getExtensionFromFileName(name);

	const handleFocus = () => {
		setIsBlur(true);
		setIsFocus(true);
		if (setCurrRenamingFile !== undefined)
			setCurrRenamingFile({ ...currRenamingFile, newName: name });
	};

	const handleClickAway = () => {
		setIsBlur(false);
		setIsFocus(false);
		if (setCurrRenamingFile !== undefined)
			setCurrRenamingFile({ ...currRenamingFile, id: -1, newName: name });
	};

	const handleRenamedNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (setCurrRenamingFile !== undefined)
			setCurrRenamingFile({ ...currRenamingFile, newName: event.target.value });
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === KeyEvent.Enter) {
			if (renameItem !== null) renameItem(id);
			handleClickAway();
		}
	};

	const isInputFocused = isFocus ? 'focused-input-item' : '';

	const isInputHidden = id !== currRenamingFile.id ? 'hidden' : '';

	// FOR AUTO FOCUS
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (!isInputHidden) {
			if (inputRef !== null && inputRef.current !== null) {
				inputRef.current.focus();
			}
		}
	}, [isInputHidden]);

	return (
		<div className="tree-line tree-element">
			<StyledFile
				onClick={() => {
					onFileClick();
				}}
			>
				{/* render the extension or fallback to generic file icon  */}
				{FILE_ICONS[extension] || <AiOutlineFile />}
				<span className={isInputHidden ? '' : 'hidden'}>{name}</span>

				<input
					className={`temp-input ${isInputFocused} ${
						isInputHidden ? 'hidden' : ''
					}`}
					type="text"
					value={currRenamingFile.newName}
					placeholder="New File Name"
					onChange={handleRenamedNameChange}
					onFocus={handleFocus}
					onBlur={handleClickAway}
					onKeyDown={handleKeyDown}
					ref={inputRef}
				/>
			</StyledFile>
		</div>
	);
}
