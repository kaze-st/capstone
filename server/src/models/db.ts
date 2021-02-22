import consola from 'consola';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

class Database {
	constructor() {
		if (!MONGODB_URL) {
			consola.error(new Error('URL for mongoDB is undefined'));
			process.exit(1);
		}

		this.connect(MONGODB_URL);
	}

	private async connect(mongodbURL: string) {
		await mongoose.connect(mongodbURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		consola.info('Database connected');
	}
}

const gracefulShutdown = (msg: string, callback: () => void) => {
	mongoose.connection.close(() => {
		consola.info(msg);
		callback();
	});
};

// For nodemon restarts
process.once('SIGUSR2', () => {
	gracefulShutdown('nodemon restart', function () {
		process.kill(process.pid, 'SIGUSR2');
	});
});

// For app termination
process.on('SIGINT', () => {
	gracefulShutdown('app termination', function () {
		process.exit(0);
	});
});

// For app termination in cloud
process.on('SIGTERM', () => {
	gracefulShutdown('app termination in cloud', function () {
		process.exit(0);
	});
});

export default new Database();
