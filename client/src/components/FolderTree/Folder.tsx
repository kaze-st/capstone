/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState } from 'react';

import { AiOutlineFolder } from 'react-icons/ai';
import styled from 'styled-components';

const StyledFolder = styled.div`
	margin-left: 20px;

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
	name: string;
	children: React.ReactNode;
}

export default function Folder(props: IFolderProps): JSX.Element {
	const { name, children } = props;
	const [isOpen, setIsOpen] = useState(true);

	const handleToggle = (e) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};

	const rootFolder = (
		<StyledFolderRoot>
			<div className="tree-element folder--label" onClick={handleToggle}>
				<AiOutlineFolder />
				<span>{name}</span>
			</div>
			<Collapsible isOpen>{children}</Collapsible>
		</StyledFolderRoot>
	);

	const normalFolder = (
		<StyledFolder>
			<div className="tree-element folder--label" onClick={handleToggle}>
				<AiOutlineFolder />
				<span>{name}</span>
			</div>
			<Collapsible isOpen={isOpen}>{children}</Collapsible>
		</StyledFolder>
	);

	return name === '/' ? rootFolder : normalFolder;
}
