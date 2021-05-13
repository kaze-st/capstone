import './CurrentProject.scss';
import '../../Spinner.scss';

import * as Y from 'yjs';

import Editor, { OnMount } from '@monaco-editor/react';
import { Link, RouteComponentProps } from 'react-router-dom';
import React, { useEffect, useReducer, useRef, useState } from 'react';

import FolderTree from '../FolderTree/Tree';
import { Footer } from '../LandingPage/LandingPage';
import { MonacoBinding } from 'y-monaco';
import Spinner from '../../Spinner';
import { WebsocketProvider } from 'y-websocket';
import axios from 'axios';
import dotenv from 'dotenv';
import downloadProject from './DownloadProject';
import IProjectFolder from '../ProjectPage/interfaces/IProjectFolder';

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
	const currentFileRef = useRef<any>(null);
	const onUpdateFileFunc = useRef<any>(null);
	const [project, setProject] = useState<IProjectFolder | null>(null);
	const [
		projectStructure,
		setProjectStructure
	] = useState<Y.Map<unknown> | null>(null);

	const [, forceUpdate] = useReducer((x) => x + 1, 0);
	const [currentFile, setCurrentFile] = useState<Y.Map<any> | null>(null);
	const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
	const wsurl = process.env.REACT_APP_CURR_FILE_WS_BASE_URL;
	const { pid } = match.params;
	useEffect(() => {
		axios
			.get(`${url}/api/v1/folder/get-folder`, { params: { pid } })
			.then((response) => {
				setProject(response.data);
			});
	}, [url, pid]);

	useEffect(() => {
		return () => {
			if (provider.current !== null) {
				provider.current.destroy();
			}

			if (monacoBinding.current !== null) {
				monacoBinding.current.destroy();
			}

			if (monacoRef.current !== null) {
				monacoRef.current.editor.getModels().forEach((model) => {
					model.dispose();
				});
			}

			// if (structureRef.current !== null && onUpdateFileFunc.current !== null) {
			// 	console.log('Func disposed');
			// 	// structureRef.current.unobserve(onUpdateFileFunc.current);
			// }
		};
	}, []);

	useEffect(() => {});

	if (wsurl === undefined || url === undefined) {
		return <></>;
	}

	// const getCurrentFile = () => {
	// 	return currentFile;
	// };

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
		structureRef.current = structure;
		structure.observeDeep((events) => {
			events.forEach((event) => {
				const { target } = event;
				if (target instanceof Y.Map) {
					if (
						currentFileRef.current &&
						currentFileRef.current.keys().next().done
					) {
						currentFileRef.current = null;
						setCurrentFile(null);
					}

					setTest(ydoc);
					setProjectStructure(ydoc.getMap('structure'));
					forceUpdate();
				}
			});
		});
	};

	const displayedProjectName = project === null ? 'My Project' : project.name;

	const onFileClick = (file: Y.Map<any>) => {
		setCurrentFile(file);
		currentFileRef.current = file;
		const ytext = file.get('content');

		if (monacoBinding.current !== null) {
			monacoBinding.current.destroy();
		}
		const editor = editorRef.current;
		const path = `urn:${file.get('path')}`;
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
		const root = structure.get('/');
		const html = root.get('index.html').get('content').toString();
		const css = root.get('style.css').get('content').toString();
		const js = root.get('script.js').get('content').toString();

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

	const handleDownload = () => {
		downloadProject(projectStructure, displayedProjectName);
	};

	const isPlayground =
		projectStructure !== null &&
		(projectStructure.get('isPlayground') as boolean);

	return (
		<>
			<div className="page-wrapper">
				<header className="editor-nav">
					{test && (
						<div>
							{isPlayground && (
								<button type="button" onClick={runCode}>
									Run Code
								</button>
							)}
							<button type="button" onClick={handleDownload}>
								Download
							</button>
						</div>
					)}
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
								isPlayground={isPlayground}
							/>
						)}
						<div className={`prj-editor-container${!currentFile && ' hidden'}`}>
							<Editor
								// defaultLanguage={extensions[project.extension]}
								width="100%"
								onMount={handleEditorDidMount}
								theme="vs-dark"
								loading={<Spinner />}
							/>
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
					</div>
				</main>
				<Footer />
			</div>
		</>
	);
}
