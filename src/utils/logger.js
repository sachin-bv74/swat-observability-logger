

// const log4js = require('log4js');

// log4js.addLayout('json', config => function (logEvent) {
//     return JSON.stringify(logEvent) + config.separator;
//   });
  
//   log4js.configure({
//     appenders: {
//       out: { type: 'stdout', layout: { type: 'json', separator: ',' } },
//       errorLogger: { type: 'file', filename: './logs/app.log', layout: { type: 'json', separator: ',' }}
//     },
//     categories: {
//       default: { appenders: ['out', 'errorLogger'], level: 'error' },
//     }
//   });

// const logger = log4js.getLogger('errorLogger');

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