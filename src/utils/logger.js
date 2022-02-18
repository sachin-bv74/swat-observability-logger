

const log4js = require('log4js');

log4js.addLayout('json', config => function (logEvent) {
    return JSON.stringify(logEvent) + config.separator;
  });
  
  log4js.configure({
    appenders: {
      out: { type: 'stdout', layout: { type: 'json', separator: ',' } },
      errorLogger: { type: 'file', filename: './logs/app.log', layout: { type: 'json', separator: ',' }}
    },
    categories: {
      default: { appenders: ['out', 'errorLogger'], level: 'error' },
    }
  });

const logger = log4js.getLogger('errorLogger');

module.exports = logger;