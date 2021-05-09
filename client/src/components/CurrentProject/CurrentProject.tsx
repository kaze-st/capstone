import './CurrentProject.scss';
import '../../Spinner.scss';

import * as Y from 'yjs';

import Editor, { OnMount } from '@monaco-editor/react';
import { Link, RouteComponentProps } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import IFile from '../../types/IFile';
import IProjectFolder from '../ProjectPage/interfaces/IProjectFolder';
import { MonacoBinding } from 'y-monaco';
import ProjectTreeView from './ProjectTreeView';
import Spinner from '../../Spinner';
import { WebsocketProvider } from 'y-websocket';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface MatchParams {
	pid: string;
}
export default function CurrentProject(
	props: RouteComponentProps<MatchParams>
): JSX.Element {
	const { match } = props;

	// eslint-disable-next-line
	const editorRef = useRef<any>(null);
	// eslint-disable-next-line
	const provider = useRef<any>(null);
	const [project, setProject] = useState<Y.Map<unknown> | null>(null);
	const [projectStructure, setProjectStructure] = useState<any | null>(null);

	const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
	const wsurl = process.env.REACT_APP_CURR_FILE_WS_BASE_URL;
	const { pid } = match.params;
	console.log('pid', pid);
	useEffect(() => {
		axios
			.get(`${url}/api/v1/folder/get-folder`, { params: { pid } })
			.then((response) => {
				console.log('response', response);
				setProject(response.data);
			});
	}, [url, pid]);

	useEffect(() => {
		return () => {
			if (provider.current === null) {
				return;
			}
			provider.current.destroy();
		};
	}, []);

	if (wsurl === undefined || url === undefined) {
		return <></>;
	}

	// eslint-disable-next-line
	const handleEditorDidMount: OnMount = (editor: any): void => {
		editorRef.current = editor;
		const ydoc = new Y.Doc();
		provider.current = new WebsocketProvider(
			wsurl,
			`${match.params.pid}:folder`,
			ydoc
		);

		const structure = ydoc.getMap('structure');
		console.log('ws', wsurl);
		structure.observeDeep((e) => {
			console.log('strucurte', structure.toJSON());
			console.log('event', e);

			if (e[0].target instanceof Y.Map) {
				setProjectStructure(ydoc.getMap('structure'));
			}
		});

		// eslint-disable-next-line
		// const monacoBinding = new MonacoBinding(
		// 	ytext,
		// 	/** @type {monaco.editor.ITextModel} */ editor.getModel(),
		// 	new Set([editor]),
		// 	provider.current.awareness
		// );
	};

	// if (project === null) {
	// 	// return <Spinner />;
	// 	return <div>Wsup??</div>;
	// }

	const displayedProjectName = `My Project`;
	return (
		<>
			<nav className="editor-nav">
				<ul className="editor-nav-links">
					<li>
						<button className="white-button" type="button">
							<Link to="/projects/ownedProjects">Go Back to Projects</Link>
						</button>
					</li>
					<li className="display-name">{displayedProjectName}</li>
				</ul>
			</nav>
			{projectStructure && <ProjectTreeView project={projectStructure} />}
			<Editor
				height="calc(100vh - 23px - 80px)"
				// defaultLanguage={extensions[project.extension]}
				onMount={handleEditorDidMount}
				theme="vs-dark"
			/>
		</>
	);
}
