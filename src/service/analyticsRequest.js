const https = require('https')
const http = require('http')
const querystring = require('query-string');


const analyticsRequest = function(body,head){
    const qPara = querystring.stringify(body);
    const opt = {
        hostname: 'network-stg',
        port: 443,
        path: '/st.gif?' + qPara,
        method: 'GET',
        headers: head
    }
    const request = http.request(opt, (resp) => {
        console.log('Status Code:', resp.statusCode);
        
    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });
    request.write(JSON.stringify(body));
    request.end();
}

module.exports = analyticsRequest

