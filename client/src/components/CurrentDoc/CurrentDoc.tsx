import * as Y from 'yjs';

import Editor, { OnMount } from '@monaco-editor/react';
import React, { useRef } from 'react';

import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';

// eslint-disable-next-line
// const MonacoBinding = require('y-monaco');

export default function CurrentDoc(): JSX.Element {
	const editorRef = useRef<any>(null);

	const handleEditorDidMount: OnMount = (editor: any): void => {
		editorRef.current = editor;
		const ydoc = new Y.Doc();
		const ytext = ydoc.getText('content');
		const provider = new WebsocketProvider('ws://localhost:8080', 'pene', ydoc);

		provider.awareness.setLocalStateField('user', {
			// Define a print name that should be displayed
			name: 'Emmanuelle Charpentier',
			// Define a color that should be associated to the user:
			color: '#ffb61e' // should be a hex color
		});
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
