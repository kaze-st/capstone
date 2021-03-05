import * as Y from 'yjs';
import * as _ from 'lodash';

import FileModel from '@models/FileModel';
import WebSocket from 'ws';
import consola from 'consola';
import http from 'http';

export default (server: http.Server): void => {
	// eslint-disable-next-line
	const utils = require('y-websocket/bin/utils');

	consola.log(utils);
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
			const fid = '60415ddd4f85ad44966578a8';
			const file = await FileModel.findById(fid);
			const state = file?.state;
			if (!state) {
				return;
			}
			const ecodedState: Uint8Array = new Uint8Array(state);

			return Y.applyUpdate(doc, ecodedState);
		},
		writeState: async (string: string, doc: Y.Doc) => {
			consola.log('closed', string);
			const encodedState = Y.encodeStateAsUpdate(doc);
			const fid = '60415ddd4f85ad44966578a8';
			const file = await FileModel.findById(fid);

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
