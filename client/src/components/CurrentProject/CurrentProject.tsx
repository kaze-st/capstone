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
	const monacoRef = useRef<any>(null);
	const [project, setProject] = useState<IProjectFolder | null>(null);
	const [projectStructure, setProjectStructure] = useState<any | null>(null);
	const [test, setTest] = useState<Y.Doc | null>(null);
	const monacoBinding = useRef<any>(null);
	const structureRef = useRef<any>(null);

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
			console.log('destroy');
			if (provider.current !== null) {
				provider.current.destroy();
			}

			if (monacoBinding.current !== null) {
				monacoBinding.current.destroy();
			}
		};
	}, []);

	if (wsurl === undefined || url === undefined) {
		return <></>;
	}

	// eslint-disable-next-line
	const handleEditorDidMount: OnMount = (editor, monaco): void => {
		editorRef.current = editor;
		monacoRef.current = monaco;
		const ydoc = new Y.Doc();
		provider.current = new WebsocketProvider(
			wsurl,
			`${match.params.pid}:folder`,
			ydoc
		);

		const structure = ydoc.getMap('structure');
		console.log('ws', wsurl);
		structureRef.current = structure;

		structure.observeDeep((e) => {
			console.log('strucurte', structure.toJSON());
			console.log('event', e);

			if (e[0].target instanceof Y.Map) {
				setProjectStructure(ydoc.getMap('structure').toJSON());

				// const ydoc2 = new Y.Doc();

				// const folder1 = ydoc2.getMap('structure');

				// const file1 = new Y.Map();
				// folder1.set('filehtml', file1);
				// folder1.set('name', 'Project 1');

				// const textforFile = new Y.Text();
				// file1.set('content', textforFile);
				// file1.set('extension', 'html');
				// file1.set('name', 'index.html');

				// textforFile.insert(0, 'hfuewihfuiewhfiewhu');

				// const file2 = new Y.Map();
				// folder1.set('filecss', file2);

				// const textforFile2 = new Y.Text();
				// file2.set('content', textforFile2);
				// file2.set('extension', 'css');
				// file2.set('name', 'index.css');

				// textforFile2.insert(0, 'wdwdwdwdwdw');
				setTest(ydoc);
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

	const onFileClick = (e) => {
		console.log('Hii', e);
	};

	const onClickFile = (file: Y.Map<any>) => {
		const ytext = file.get('content');

		if (monacoBinding.current !== null) {
			monacoBinding.current.destroy();
		}
		const editor = editorRef.current;
		const path = `urn:${file.get('name')}`;
		console.log('monaco', monacoRef.current.editor.getModel('amy j cunt'));
		if (monacoRef.current.editor.getModel(path) === null)
			monacoRef.current.editor.createModel(ytext.toString(), 'html', path);

		editor.setModel(monacoRef.current.editor.getModel(path));

		// eslint-disable-next-line
		monacoBinding.current = new MonacoBinding(
			ytext,
			/** @type {monaco.editor.ITextModel} */ editor.getModel(),
			new Set([editor]),
			provider.current.awareness
		);
	};
	return (
		<>
			{test && (
				<div>
					<button
						type="button"
						onClick={() => {
							onClickFile(test.getMap('structure').get('css'));
						}}
					>
						CSS
					</button>
					<button
						type="button"
						onClick={() => {
							onClickFile(test.getMap('structure').get('html'));
						}}
					>
						HTML
					</button>

					<button
						type="button"
						onClick={() => {
							onClickFile(test.getMap('structure').get('js'));
						}}
					>
						JS
					</button>
				</div>
			)}
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
			{projectStructure && (
				<ProjectTreeView project={projectStructure} onFileClick={onFileClick} />
			)}
			<Editor
				height="calc(100vh - 23px - 80px)"
				// defaultLanguage={extensions[project.extension]}
				onMount={handleEditorDidMount}
				theme="vs-dark"
			/>
		</>
	);
}
