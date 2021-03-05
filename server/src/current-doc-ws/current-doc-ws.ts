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
			const r = _.debounce(() => {
				consola.log('Here');
			}, 1000);

			// eslint-disable-next-line
			doc.on('update', (update: any) => {
				consola.log('aya');
				r();
				// Y.applyUpdate(doc, update);
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
