import './CurrentProject.scss';
import '../../Spinner.scss';

import * as Y from 'yjs';

import Editor, { OnMount } from '@monaco-editor/react';
import { Link, RouteComponentProps } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import IFile from '../../types/IFile';
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
	// const [project, setProject] = useState<I | null>(null);

	const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
	const wsurl = process.env.REACT_APP_CURR_FILE_WS_BASE_URL;
	const { pid } = match.params;

	// useEffect(() => {
	// 	axios
	// 		.get(`${url}/api/v1/file/get-file`, { params: { fid } })
	// 		.then((response) => {
	// 			// setProject(response.data);
	// 		});
	// }, [url, fid]);

	// useEffect(() => {
	// 	return () => {
	// 		if (provider.current === null) {
	// 			return;
	// 		}
	// 		provider.current.destroy();
	// 	};
	// });

	if (wsurl === undefined || url === undefined) {
		return <></>;
	}

	// eslint-disable-next-line
	const handleEditorDidMount: OnMount = (editor: any): void => {
		editorRef.current = editor;
		// const ydoc = new Y.Doc();
		// const ytext = ydoc.getText('content');
		// provider.current = new WebsocketProvider(wsurl, match.params.pid, ydoc);

		// // eslint-disable-next-line
		// const monacoBinding = new MonacoBinding(
		// 	ytext,
		// 	/** @type {monaco.editor.ITextModel} */ editor.getModel(),
		// 	new Set([editor]),
		// 	provider.current.awareness
		// );
	};

	// if (project === null) {
	// 	return <Spinner />;
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
			<ProjectTreeView />
			<Editor
				height="calc(100vh - 23px - 80px)"
				// defaultLanguage={extensions[project.extension]}
				onMount={handleEditorDidMount}
				theme="vs-dark"
			/>
		</>
	);
}
