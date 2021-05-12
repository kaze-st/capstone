/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import './LandingPage.scss';

import React, { useState } from 'react';

import About from './About';
import Introduction from './Introduction';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Header(props: {
	content: string;
	navClick: (text: string) => void;
}): JSX.Element {
	const { userContext } = useAuth();
	const { content, navClick } = props;

	const onNavKeyboardClick = (event: React.KeyboardEvent<HTMLElement>) => {
		event.preventDefault();
		navClick(event.currentTarget.innerText.toLowerCase());
	};

	const onNavClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		navClick(event.currentTarget.innerText.toLowerCase());
	};

	return (
		<header className="flex-container">
			<div className="logo-and-title">
				<Link to="/">
					<img className="logo" src="./img/logo.png" alt="Code Collab Logo" />
				</Link>
			</div>
			<nav className="landing-nav">
				<ul>
					<li
						className={content === 'home' ? 'active-nav' : ''}
						onClick={onNavClick}
						onKeyPress={onNavKeyboardClick}
					>
						HOME
					</li>
					<li
						className={content === 'about us' ? 'active-nav' : ''}
						onClick={onNavClick}
						onKeyPress={onNavKeyboardClick}
					>
						ABOUT US
					</li>
				</ul>
			</nav>
			<Link to="/login">
				<button className="white-button" type="button">
					{userContext === null ? 'LOG IN' : 'GO TO YOUR FILES'}
				</button>
			</Link>
		</header>
	);
}

function Main(props: {
	content: string;
	pageChange: (text: string) => void;
}): JSX.Element {
	const { content, pageChange } = props;

	let render = <></>;

	if (content === 'home') {
		render = <Introduction pageChange={pageChange} />;
	} else if (content === 'about us') {
		render = <About />;
	}

	return <main>{render}</main>;
}

export function Footer(): JSX.Element {
	return (
		<footer>
			<p>
				&copy; SSCode 2021 by Khoa Luong, Thomas That, Nam Pham, and Hao Chen
			</p>
			<img alt="" src="./img/ischool-logo.png" aria-hidden="true" />
		</footer>
	);
}

export default function LandingPage(): JSX.Element {
	const [content, setContent] = useState('home');

	const onNavClick = (text) => {
		setContent(text);
	};
	return (
		<div className="page-wrapper">
			<Header content={content} navClick={onNavClick} />
			<Main content={content} pageChange={onNavClick} />
			<Footer />
		</div>
	);
}
