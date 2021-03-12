import React from 'react';
import './Modal.scss';

interface IModalProp {
	show: boolean;
	children: JSX.Element | JSX.Element[] | string;
}

export default function Modal(props: IModalProp): JSX.Element {
	const { show, children } = props;
	const showHideClassName = show ? 'modal' : 'modal hide';
	return (
		<div className={showHideClassName}>
			<div className="modal-container">{children}</div>
		</div>
	);
}
