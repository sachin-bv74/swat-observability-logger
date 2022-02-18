const express = require('express')
const url = require('url')
const logger= require('./utils/logger')

const app = express()
app.use(express.json());


app.post('/error', (req, res) => {

    // let data = {
      
    //     "swat.exception.name": req.body.exception,
        
    //     }
        logger.addContext("swat.client.name", req.body.tags.client)
        logger.addContext("swat.browser.name", req.body.browser.name)
        logger.addContext("swat.component.name", req.body.tags.component)
        logger.addContext("swat.log.level", req.body.level)
        logger.addContext("swat.sdk", req.body.sdk.name)
        logger.addContext("swat.exception", req.body.exception)
    logger.error(req.body.exception)//log 
    
    res.send('<h1>Log</h1>')
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})


