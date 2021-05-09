/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState } from 'react';
import { AiOutlineFolder } from 'react-icons/ai';
import Icon from 'react-icons-kit';
import styled from 'styled-components';
import { filePlus } from 'react-icons-kit/feather/filePlus';
import { folderPlus } from 'react-icons-kit/feather/folderPlus';

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

	return (
		<StyledFolder>
			<div className="folder--label" onClick={handleToggle}>
				<AiOutlineFolder />
				<span>{name}</span>
			</div>
			<Collapsible isOpen={isOpen}>{children}</Collapsible>
		</StyledFolder>
	);
}
