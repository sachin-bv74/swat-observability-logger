
const express = require('express')
const axios = require('axios');
const logger= require('./utils/logger')

const app = express()
app.use(express.json());

app.post('/error', (req, res) => {

    let data = {
        "swat.client.name": req.body.tags.client,
        "swat.browser.name": req.body.browser.name,
        "swat.component.name": req.body.tags.component,
        "swat.log.level": req.body.level,
        "swat.sdk": req.body.sdk.name,
        "swat.exception.name": req.body.exception,
        "epochSecond": Math.floor(new Date().getTime()/1000.0)
    }
      
    logger.error(data)//log 
    res.send({"Logged":"yes"})
    axios.post('http://localhost:8080/analytics', {"data": req.body})
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})


