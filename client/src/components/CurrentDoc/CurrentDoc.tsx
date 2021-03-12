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

// eslint-disable-next-line
// const MonacoBinding = require('y-monaco');

interface MatchParams {
	fid: string;
}
export default function CurrentDoc(
	props: RouteComponentProps<MatchParams>
): JSX.Element {
	const { match } = props;
	console.log('props lolol ', match.params.fid);

	const editorRef = useRef<any>(null);
	const provider = useRef<any>(null);
	const [file, setFile] = useState<IFile | null>(null);

	const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
	const { fid } = match.params;

	useEffect(() => {
		axios
			.get(`${url}/api/v1/file/get-file`, { params: { fid } })
			.then((response) => {
				console.log(response);
				setFile(response.data);
			});
	}, [url, fid]);

	useEffect(() => {
		console.log('editor', editorRef);

		return () => {
			if (provider.current === null) {
				return;
			}
			console.log('called');
			provider.current.destroy();
		};
	});
	const handleEditorDidMount: OnMount = (editor: any): void => {
		console.log('here3');
		editorRef.current = editor;
		const ydoc = new Y.Doc();
		const ytext = ydoc.getText('content');
		provider.current = new WebsocketProvider(
			'ws://localhost:8080',
			match.params.fid,
			ydoc
		);
		const monacoBinding = new MonacoBinding(
			ytext,
			/** @type {monaco.editor.ITextModel} */ editor.getModel(),
			new Set([editor]),
			provider.current.awareness
		);
	};

	if (file === null) {
		console.log('here');
		return <Spinner />;
	}

	console.log('file', file);

	const displayedFileName = `${file.name}.${file.extension}`;
	return (
		<>
			<nav className="editor-nav">
				<ul className="editor-nav-links">
					<li>
						<button className="white-button" type="button">
							<Link to="/files/ownedFiles">Go Back to Files</Link>
						</button>
					</li>
					<li className="display-name">{displayedFileName}</li>
				</ul>
			</nav>
			<Editor
				height="calc(100vh - 23px - 80px)"
				defaultLanguage="javascript"
				onMount={handleEditorDidMount}
				theme="vs-dark"
			/>
		</>
	);
}
