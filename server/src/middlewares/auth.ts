import * as admin from 'firebase-admin';

import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = admin.initializeApp();

export default async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
): Promise<void> => {
	if (process.env.ENVIRONMENT === 'dev') {
		next();
		return;
	}

	const idToken = req.headers.authorization;
	const errMessage = 'You do not have permissions to access this API';

	if (!idToken) {
		res.status(401).jsonp({ message: errMessage });
		return;
	}

	try {
		await app.auth().verifyIdToken(idToken);
		next();
	} catch (err) {
		res.status(401).jsonp({
			message: errMessage
		});
	}
};
