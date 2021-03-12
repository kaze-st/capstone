import * as Y from 'yjs';

import Editor, { OnMount } from '@monaco-editor/react';
import React, { useEffect, useRef } from 'react';

import { MonacoBinding } from 'y-monaco';
import { RouteComponentProps } from 'react-router-dom';
import { WebsocketProvider } from 'y-websocket';

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

	useEffect(() => {
		console.log('editor', editorRef);

		return () => {
			console.log('called');
			console.log(provider);
			provider.current.destroy();
			console.log(provider);
		};
	});
	const handleEditorDidMount: OnMount = (editor: any): void => {
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

	return (
		<>
			<nav className="editor-nav">
				<button className="white-button" type="button">
					Hi
				</button>
			</nav>
			<Editor
				height="90vh"
				defaultLanguage="javascript"
				onMount={handleEditorDidMount}
				theme="vs-dark"
			/>
		</>
	);
}
