const https = require('https')
const http = require('http')
const {options} = require('../const/constants')

const opt = {
    hostname: options.hostname,
    port: options.port,
    path: options.path,
    method: options.method,
    headers: {
        'Content-Type': 'application/json',
      },
}

const analyticsRequest = function(body){
    const request = http.request(opt, (resp) => {
        console.log('Status Code:', resp.statusCode);
        
    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });
    
    request.write(JSON.stringify(body));
    request.end();
}

module.exports = analyticsRequest

