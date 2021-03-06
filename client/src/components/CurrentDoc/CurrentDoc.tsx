import './CurrentDoc.scss';
import '../../Spinner.scss';

import * as Y from 'yjs';

import Editor, { OnMount } from '@monaco-editor/react';
import { Link, RouteComponentProps } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import IFile from '../../types/IFile';
import { MonacoBinding } from 'y-monaco';
import Spinner from '../../Spinner';
import { WebsocketProvider } from 'y-websocket';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface MatchParams {
	fid: string;
}
export default function CurrentDoc(
	props: RouteComponentProps<MatchParams>
): JSX.Element {
	const { match } = props;

	// eslint-disable-next-line
	const editorRef = useRef<any>(null);
	// eslint-disable-next-line
	const provider = useRef<any>(null);
	const [file, setFile] = useState<IFile | null>(null);

	const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
	const wsurl = process.env.REACT_APP_CURR_FILE_WS_BASE_URL;
	const { fid } = match.params;
	console.log('url', url, wsurl, process.env);
	useEffect(() => {
		axios
			.get(`${url}/api/v1/file/get-file`, { params: { fid } })
			.then((response) => {
				setFile(response.data);
			});
	}, [url, fid]);

	useEffect(() => {
		return () => {
			if (provider.current === null) {
				return;
			}
			provider.current.destroy();
		};
	});

	if (wsurl === undefined || url === undefined) {
		return <></>;
	}

	// eslint-disable-next-line
	const handleEditorDidMount: OnMount = (editor: any): void => {
		editorRef.current = editor;
		const ydoc = new Y.Doc();
		const ytext = ydoc.getText('content');
		provider.current = new WebsocketProvider(
			wsurl,
			`${match.params.fid}:file`,
			ydoc
		);
		// eslint-disable-next-line
		const monacoBinding = new MonacoBinding(
			ytext,
			/** @type {monaco.editor.ITextModel} */ editor.getModel(),
			new Set([editor]),
			provider.current.awareness
		);
	};

	const handleDownload = () => {
		const content = editorRef.current.getValue();
		const downloadFile = new Blob([content], { type: 'text/plain' });
		const downloadURL = URL.createObjectURL(downloadFile);
		const element = document.createElement('a');
		element.href = downloadURL;
		element.download = `${file?.name}.${file?.extension}`;
		document.body.appendChild(element);
		element.click();
	};

	if (file === null) {
		return <Spinner />;
	}

	// change this shit later we don't support txt
	const extensions = {
		py: 'python',
		java: 'java',
		rb: 'ruby',
		go: 'go',
		js: 'javascript',
		cpp: 'cpp'
	};

	const displayedFileName = `${file.name}.${file.extension}`;
	return (
		<div className="page-wrapper">
			<header className="editor-nav">
				<ul className="editor-nav-links">
					<li>
						<Link to="/files/ownedFiles">
							<button className="white-button" type="button">
								Go Back to Files
							</button>
						</Link>
					</li>
					<li className="display-name">{displayedFileName}</li>
				</ul>
			</header>
			<nav className="editor-sub-nav">
				<ul>
					<button type="button" onClick={handleDownload}>
						Download
					</button>
				</ul>
			</nav>
			<Editor
				height="100%"
				defaultLanguage={extensions[file.extension]}
				onMount={handleEditorDidMount}
				theme="vs-dark"
			/>
		</div>
	);
}
