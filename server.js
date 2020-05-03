const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const server = require('./app');

console.log(process.env.PORT);

const port = 8000 || process.env.PORT;

server.listen(port, () => {
  console.log(`Application is running on ${port}`);
});
