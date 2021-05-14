import * as Y from 'yjs';
import * as _ from 'lodash';

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
			const debouncedSaveFolder = _.debounce(async (update) => {
				Y.applyUpdate(doc, update);
				const encodedState = Y.encodeStateAsUpdate(doc);
				const folder = await FolderModel.findById(documentName);

				if (folder) {
					folder.state = Buffer.from(encodedState);
					folder.lastEditedOn = new Date();
					folder.save();
				}
			}, 5000);

			// eslint-disable-next-line
			doc.on('update', async (update: any) => {
				debouncedSaveFolder(update);
			});

			const folder = await FolderModel.findById(documentName);
			const state = folder?.state;
			if (!state) {
				return;
			}
			const ecodedState: Uint8Array = new Uint8Array(state);
			return Y.applyUpdate(doc, ecodedState);
		},
		writeState: async (string: string, doc: Y.Doc) => {
			const encodedState = Y.encodeStateAsUpdate(doc);
			const folder = await FolderModel.findById(string);

			if (folder) {
				folder.state = Buffer.from(encodedState);
				folder.lastEditedOn = new Date();
				folder.save();
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
