import { Link } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Introduction(props: {
	pageChange: (text: string) => void;
}): JSX.Element {
	const { userContext } = useAuth();
	const { pageChange } = props;

	const onButtonClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		pageChange(event.currentTarget.innerText.toLowerCase());
	};
	return (
		<>
			<section className="flex-container landing-section">
				<div className="row1">
					<h1>Code Your Scripts Together</h1>
					<p>
						Create programming scripts that you can share with others and work
						together on.
					</p>
					<Link to="/register">
						<button className="white-button" type="button">
							{userContext === null ? 'CREATE ACCOUNT' : 'GO TO YOUR FILES'}
						</button>
					</Link>
				</div>
				<div className="row2">
					<img alt="" src="./img/landingComputerImg.jpg" aria-hidden="true" />
				</div>
			</section>
			<section className="flex-container landing-section">
				<div className="row1">
					<img alt="" src="./img/landingImg1.png" aria-hidden="true" />
				</div>
				<div className="row2">
					<h1>Collaborate &#38; Share with your Teammates Across the Web</h1>
					<p>
						CodeCollab is an online code editor that uses cloud storage to store
						your programming scripts online and allow you to share it with
						others so that you can work together on the same script. Its secure
						connection allows you to work with others with low latency and you
						can continue working even while you’re disconnected from the
						internet.
					</p>
				</div>
			</section>
			<section className="flex-container landing-section">
				<div className="row1">
					<h1>Working Remotely Has Never Been Easier</h1>
					<p>
						CodeCollab provides support for many different programming languages
						including:
					</p>
					<ul>
						<li>Python</li>
						<li>C#</li>
						<li>Java</li>
						<li>JavaScript</li>
					</ul>
				</div>
				<div className="row2">
					<img alt="" src="./img/landingImg2.png" aria-hidden="true" />
				</div>
			</section>
			<section className="flex-container landing-section">
				<div className="row1">
					<img alt="" src="./img/team.png" aria-hidden="true" />
				</div>
				<div className="row2">
					<h1>Meet the Team</h1>
					<p>
						We’re a group of students at the University of Washington who work
						with Information Systems on a daily basis. We’ve seen first-hand how
						difficult working with others have been since the pandemic started,
						so we want to provide a way to make that collaboration seem
						effortless. Interested to know more about our experiences? Click the
						link below to learn more.
					</p>
					<button
						type="button"
						className="white-button"
						onClick={onButtonClick}
					>
						ABOUT US
					</button>
				</div>
			</section>
		</>
	);
}
