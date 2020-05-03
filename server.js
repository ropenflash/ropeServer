const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const logger = require('./logger');

const server = require('./app');

const port = 8000 || process.env.PORT;

server.listen(port, () => {
  logger.log('info', `Application is running on ${port}`);
});
