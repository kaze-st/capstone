import './CurrentProject.scss';
import '../../Spinner.scss';

import * as Y from 'yjs';

import Editor, { OnMount } from '@monaco-editor/react';
import { Link, RouteComponentProps } from 'react-router-dom';
import React, { useEffect, useReducer, useRef, useState } from 'react';

import FolderTree from '../FolderTree/Tree';
import { Footer } from '../LandingPage/LandingPage';
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

	const [test, setTest] = useState<Y.Doc | null>(null);
	const monacoBinding = useRef<any>(null);
	const structureRef = useRef<any>(null);
	const iframeRef = useRef<any>(null);
	const [project, setProject] = useState<Y.Map<unknown> | null>(null);
	const [
		projectStructure,
		setProjectStructure
	] = useState<Y.Map<unknown> | null>(null);

	const [, updateState] = React.useState();
	const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

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
				setTest(ydoc);
				setProjectStructure(ydoc.getMap('structure'));
				console.log('here');
				forceUpdate();
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

	// const onFileClick = (e) => {
	// 	console.log('Hii', e);
	// };

	const onFileClick = (file: Y.Map<any>) => {
		console.log(file.toJSON());
		const ytext = file.get('content');

		if (monacoBinding.current !== null) {
			monacoBinding.current.destroy();
		}
		const editor = editorRef.current;
		const path = `urn:${file.get('path')}`;
		console.log('monaco', monacoRef.current.editor.getModel('amy j cunt'));
		if (monacoRef.current.editor.getModel(path) === null)
			monacoRef.current.editor.createModel(ytext.toString(), undefined, path);

		editor.setModel(monacoRef.current.editor.getModel(path));

		// eslint-disable-next-line
		monacoBinding.current = new MonacoBinding(
			ytext,
			/** @type {monaco.editor.ITextModel} */ editor.getModel(),
			new Set([editor]),
			provider.current.awareness
		);
	};

	const runCode = () => {
		if (test === null) {
			return;
		}
		const structure = test.getMap('structure');
		const html = structure.get('html').get('content').toString();
		const css = structure.get('css').get('content').toString();
		const js = structure.get('js').get('content').toString();

		const iframe = iframeRef.current;
		const document = iframe.contentDocument;
		const documentContents = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            <style>
              ${css}
            </style>
          </head>
          <body>
            ${html}
    
            <script type="text/javascript">
              ${js}
            </script>
          </body>
          </html>
        `;

		document.open();
		document.write(documentContents);
		document.close();
	};

	return (
		<>
			{test && (
				<div>
					<button
						type="button"
						onClick={() => {
							onFileClick(test.getMap('structure').get('css'));
						}}
					>
						CSS
					</button>
					<button
						type="button"
						onClick={() => {
							onFileClick(test.getMap('structure').get('html'));
						}}
					>
						HTML
					</button>

					<button
						type="button"
						onClick={() => {
							onFileClick(test.getMap('structure').get('js'));
						}}
					>
						JS
					</button>
					<button type="button" onClick={runCode}>
						Run Code
					</button>
				</div>
			)}

			<div className="page-wrapper">
				<header className="editor-nav">
					<ul className="editor-nav-links">
						<li>
							<button className="white-button" type="button">
								<Link to="/projects/ownedProjects">Go Back to Projects</Link>
							</button>
						</li>
						<li className="display-name">{displayedProjectName}</li>
					</ul>
				</header>
				<main>
					<div className="flex-container outer-file-container">
						{projectStructure && (
							<FolderTree
								project={projectStructure}
								onFileClick={onFileClick}
							/>
						)}
						<div className="prj-editor-container">
							<Editor
								// defaultLanguage={extensions[project.extension]}
								height="51rem"
								onMount={handleEditorDidMount}
								theme="vs-dark"
								loading={<Spinner />}
							/>
						</div>
					</div>
				</main>
				<Footer />
			</div>
			<section className="result">
				<iframe
					title="result"
					className="iframe"
					ref={(iframe) => {
						iframeRef.current = iframe;
					}}
				/>
			</section>
		</>
	);
}
