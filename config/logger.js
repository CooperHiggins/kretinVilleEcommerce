const winston = require('winston');

const { combine, timestamp, label, prettyPrint } = winston.format;

const options = {
  file: {
    level: 'info',
    filename: `${__dirname}/../logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFile: 5,
    colorize: false
  },
  console: {
    format: winston.format.simple()
  }
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: `${__dirname}/../logs/error.log`,
      level: 'error'
    }),
    new winston.transports.File({
      filename: `${__dirname}/../logs/combined.log`
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console(options.console));
}
class MyStream {
  write(text) {
    logger.info(text);
  }
}

module.exports = {
  stream: new MyStream(),
  l: logger
};
