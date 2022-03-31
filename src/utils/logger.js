
const { createLogger, format, transports } = require('winston');
const { combine, timestamp} = format;

const httpTransportOptions = {
  host: 'http-intake.logs.datadoghq.com',
  path: '/api/v2/logs?dd-api-key=89ac45815f9d2c52f57aa0fb3ab1a1c1&ddsource=nodejs&service=SwatObservability',
  ssl: true
};

const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: combine(timestamp({format: 'HH:MM:SS DD:MM:YY'}) , format.json()),
  transports: [
    // new transports.Http(httpTransportOptions),
    new transports.Console()
  ],
});

module.exports = logger;
