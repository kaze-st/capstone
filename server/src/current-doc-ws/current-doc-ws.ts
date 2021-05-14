import * as Y from 'yjs';
import * as _ from 'lodash';

import FileModel from '@models/FileModel';
import FolderModel from '@models/FolderModel';
import WebSocket from 'ws';
import consola from 'consola';
import http from 'http';

export default (server: http.Server): void => {
	// eslint-disable-next-line
	const utils = require('y-websocket/bin/utils');

	const setupWSConnection = utils.setupWSConnection;

	utils.setPersistence({
		bindState: async (documentName: string, doc: Y.Doc) => {
			const [name, type] = documentName.split(':');

			const debouncedSaveFile = _.debounce(async (update) => {
				Y.applyUpdate(doc, update);
				const encodedState = Y.encodeStateAsUpdate(doc);
				const file = await FileModel.findById(name);

				if (file) {
					file.state = Buffer.from(encodedState);
					file.lastEditedOn = new Date();
					file.save();
				}
			}, 5000);

			const debouncedSaveFolder = _.debounce(async (update) => {
				Y.applyUpdate(doc, update);
				const encodedState = Y.encodeStateAsUpdate(doc);
				const folder = await FolderModel.findById(name);

				if (folder) {
					folder.state = Buffer.from(encodedState);
					folder.lastEditedOn = new Date();
					folder.save();
				}
			}, 5000);

			// eslint-disable-next-line
			doc.on('update', async (update: any) => {
				if (type === 'file') {
					debouncedSaveFile(update);
				} else {
					debouncedSaveFolder(update);
				}
			});

			const result =
				type === 'file'
					? await FileModel.findById(name)
					: await FolderModel.findById(name);

			const state = result?.state;
			if (!state) {
				return;
			}
			const encodedState: Uint8Array = new Uint8Array(state);

			const res = Y.applyUpdate(doc, encodedState);
			return res;
		},
		writeState: async (string: string, doc: Y.Doc) => {
			const [name, type] = string.split(':');
			const encodedState = Y.encodeStateAsUpdate(doc);
			const result =
				type === 'file'
					? await FileModel.findById(name)
					: await FolderModel.findById(name);

			if (result) {
				result.state = Buffer.from(encodedState);
				result.lastEditedOn = new Date();
				result.save();
			}

			return new Promise<void>((resolve) => {
				resolve();
			});
		}
	});

	const wss = new WebSocket.Server({ server });

	wss.on('connection', (conn, req) =>
		setupWSConnection(conn, req, {
			gc: true
		})
	);
};
