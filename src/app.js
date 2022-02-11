const express = require('express')
const url = require('url')
const logger= require('./utils/logger');
var StatsD = require('hot-shots');

const app = express()
app.use(express.json());


app.get('/error', (req, res) => {

    let data = {
        "swat.client.name": req.body.tags.client,
        "swat.browser.name": req.body.browser.client,
        "swat.component.name": req.body.tags.component,
        "swat.exception.name": req.body.exception,
        "swat.log.level": req.body.level,
        "swat.sdk": req.body.sdk.name
        }
  
    logger.error(data)//log 
    res.send('<h1>Log</h1>')
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})

var dogstatsd = new StatsD();
dogstatsd.increment('page.errors')
