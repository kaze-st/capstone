import * as Y from 'yjs';

import Editor, { OnMount } from '@monaco-editor/react';
import React, { useRef } from 'react';

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
	console.log('props', match.params.fid);

	const editorRef = useRef<any>(null);

	const handleEditorDidMount: OnMount = (editor: any): void => {
		editorRef.current = editor;
		const ydoc = new Y.Doc();
		const ytext = ydoc.getText('content');
		const provider = new WebsocketProvider(
			'ws://localhost:8080',
			match.params.fid,
			ydoc
		);

		const monacoBinding = new MonacoBinding(
			ytext,
			/** @type {monaco.editor.ITextModel} */ editor.getModel(),
			new Set([editor]),
			provider.awareness
		);
	};

	return (
		<>
			<Editor
				height="90vh"
				defaultLanguage="javascript"
				onMount={handleEditorDidMount}
				theme="vs-dark"
			/>
		</>
	);
}
