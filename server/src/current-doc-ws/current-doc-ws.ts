import * as Y from 'yjs';
import * as _ from 'lodash';

import FileModel from '@models/FileModel';
import WebSocket from 'ws';
import consola from 'consola';
import http from 'http';

export default (server: http.Server): void => {
	// eslint-disable-next-line
	const utils = require('y-websocket/bin/utils');

	const setupWSConnection = utils.setupWSConnection;

	utils.setPersistence({
		bindState: async (documentName: string, doc: Y.Doc) => {
			const debouncedSaveFile = _.debounce(async (update) => {
				Y.applyUpdate(doc, update);
				const encodedState = Y.encodeStateAsUpdate(doc);
				const file = await FileModel.findById(documentName);

				if (file) {
					file.state = Buffer.from(encodedState);
					file.lastEditedOn = new Date();
					file.save();
					consola.log('saved');
				}
			}, 5000);

			// eslint-disable-next-line
			doc.on('update', async (update: any) => {
				consola.log('aya');
				consola.log('update');
				debouncedSaveFile(update);
			});

			const file = await FileModel.findById(documentName);
			const state = file?.state;
			if (!state) {
				return;
			}
			const ecodedState: Uint8Array = new Uint8Array(state);

			return Y.applyUpdate(doc, ecodedState);
		},
		writeState: async (string: string, doc: Y.Doc) => {
			consola.log('closed');
			const encodedState = Y.encodeStateAsUpdate(doc);
			const file = await FileModel.findById(string);

			if (file) {
				file.state = Buffer.from(encodedState);
				file.lastEditedOn = new Date();
				file.save();
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
