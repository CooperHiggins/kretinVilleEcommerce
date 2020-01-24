const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const os = require('os');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const methodOverride = require('method-override');
const morgan = require('morgan');

const config = require('./config');
const logger = require('./logger');

const { l, stream } = logger;

const rootDir = config.root;
const app = express();

module.exports = class ExpressServer {
  constructor() {
    app.set('appPath', `${config.root}client`);
    app.use(morgan('combined', { stream }));
    app.use(compression());
    app.use(methodOverride());
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb'
      })
    );
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${config.root}/public`));
  }

  router(routes) {
    routes(app);
    // 404 error handler
    app.use((req, res, next) => {
      const err = new Error('404 - route not found');
      err.status = 404;
      next(err);
    });
    // eslint-disable-next-line no-unused-vars, no-shadow
    // 500 error handlers
    app.use((err, req, res, next) => {
      if (process.env.NODE_ENV !== 'productions') {
        console.log(err.message);
      }
      res.status(err.status || 500);
      res.json({ message: err.message });
    });
    return this;
  }

  listen(port) {
    const welcome = port => () =>
      l.info(
        `up and running in ${process.env.NODE_ENV ||
          'development'} @: ${os.hostname()} on port: ${port}}`
      );
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
};
