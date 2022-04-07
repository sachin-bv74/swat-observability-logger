const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const datadogData = require('./utils/datadogData')
const analyticsRequest = require('./service/analyticsRequest')
const {endpoint} = require('./const/constants')

const app = express()
app.use(express.json())
app.use(cors())

app.get(endpoint, (req,res) => {
    res.send("Logger")
})

app.post(endpoint, (req, res) => {
    let data = datadogData(req.body,req.get('user-agent'))
    logger.info(data)
    analyticsRequest(req.body, req.headers)
    res.send({"Logged":"yes"})
})  

app.listen(3000, () => {
    console.log('Listening on port 3000')
})





