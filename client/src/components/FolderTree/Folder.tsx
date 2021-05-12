/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineFolder } from 'react-icons/ai';
import styled from 'styled-components';
import { useFolderTree } from './FolderTreeContext';
import { Key as KeyEvent } from 'ts-key-enum';

const StyledFolder = styled.div`
	padding-left: 20px;

	.folder--label {
		display: flex;
		align-items: center;
		span {
			margin-left: 5px;
		}
	}
`;

const StyledFolderRoot = styled.div`
	.folder--label {
		display: flex;
		align-items: center;
		span {
			margin-left: 5px;
		}
	}
`;

const Collapsible = styled.div`
	/* set the height depending on isOpen prop */
	height: ${(p) => (p.isOpen ? 'auto' : '0')};
	/* hide the excess content */
	overflow: hidden;
`;

interface IFolderProps {
	id: number;
	name: string;
	children: React.ReactNode;
	setIsBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Folder(props: IFolderProps): JSX.Element {
	const { id, name, children, setIsBlur } = props;
	const [isFocus, setIsFocus] = useState(false);
	const {
		currRenamingFile,
		setCurrRenamingFile,
		renameItem,
		tempInputState
	} = useFolderTree();

	const [isOpen, setIsOpen] = useState(true);

	const handleToggle = (e) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};

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
			setCurrRenamingFile({
				...currRenamingFile,
				newName: event.target.value
			});
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

	const rootFolder = (
		<StyledFolderRoot>
			<div className="folder--label" onClick={handleToggle}>
				<AiOutlineFolder />
				<span>{name}</span>
			</div>
			<Collapsible isOpen>{children}</Collapsible>
		</StyledFolderRoot>
	);

	if (!isOpen && tempInputState.isSetting) {
		setIsOpen(true);
	}

	const normalFolder = (
		<StyledFolder>
			<div className="folder--label" onClick={handleToggle}>
				<AiOutlineFolder />
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
			</div>
			<Collapsible isOpen={isOpen}>{children}</Collapsible>
		</StyledFolder>
	);

	return name === '/' ? rootFolder : normalFolder;
}
