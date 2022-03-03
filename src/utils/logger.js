
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const logger = createLogger({
  level: 'error',
  format: combine(timestamp({format: 'HH:MM:SS DD:MM:YY'}) , format.json()),
  transports: [
    new transports.File({ filename: 'src/logs/app.log', level: 'error' }),
    new transports.Console()
  ],
});

module.exports = logger;