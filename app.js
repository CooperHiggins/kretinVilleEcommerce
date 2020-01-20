const dotenv = require('dotenv');
const Server = require('./config/server');

dotenv.config();
const routes = require('./routes');
const port = parseInt(process.env.PORT) || 3000;
module.exports = new Server().router(routes).listen(port);
