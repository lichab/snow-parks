require('dotenv').config();
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { name, version } = require('./package');
const { mongoose } = require('snow-parks-data');
const {
	env: { PORT = 8080, NODE_ENV: env, MONGODB_URL },
	argv: [, , port = PORT],
} = process;
const router = require('./routes');

mongoose
	.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		const logger = winston.createLogger({
			level: env === 'development' ? 'debug' : 'info',
			format: winston.format.json(),
			transports: [new winston.transports.File({ filename: 'server.log' })],
		});

		if (env !== 'production') {
			logger.add(
				new winston.transports.Console({
					format: winston.format.simple(),
				})
			);
		}

		const accessLogStream = fs.createWriteStream(
			path.join(__dirname, 'access.log'),
			{ flags: 'a' }
		);

		const app = express();

		app.use(cors());

		app.use(morgan('combined', { stream: accessLogStream }));

		app.use('/api', router);

		app.listen(port, () =>
			logger.info(`server ${name} ${version} up and running on port ${port}`)
		);

		process.on('SIGINT', () => {
			logger.info('server abruptly stopped');

			process.exit(0);
		});
	})
	.catch(error => console.error(error));
