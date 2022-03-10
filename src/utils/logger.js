
const { createLogger, format, transports } = require('winston');
const { combine, timestamp} = format;

const logger = createLogger({
  level: 'info',
  format: combine(timestamp({format: 'HH:MM:SS DD:MM:YY'}) , format.json()),
  transports: [
    new transports.File({ filename: 'src/logs/app.log', level: 'info' }),
    new transports.Console()
  ],
});

module.exports = logger;

