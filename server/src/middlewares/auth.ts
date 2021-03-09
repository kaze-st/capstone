import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

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
		const response = await axios.get(
			'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
		);

		const publicKeys = response.data;
		const header64 = idToken.split('.')[0];
		const header = JSON.parse(
			Buffer.from(header64, 'base64').toString('ascii')
		);

		//eslint-disable-next-line -- Verified Object can anything
		const verificationObj: any = jwt.verify(idToken, publicKeys[header.kid], {
			algorithms: ['RS256']
		});

		// TODO add UserContext
		res.locals.uid = verificationObj.user_id;
		next();
	} catch (err) {
		res.status(401).jsonp({
			message: errMessage
		});
	}
};
