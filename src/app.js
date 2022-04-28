const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const {datadogDataInsight, datadogDataerror} = require('./utils/datadogData')
const {endpoint, PORT, endpointerror} = require('./const/constants')


const app = express()
app.use(express.json())
app.use(cors())

app.get(endpoint, (req,res) => {
    res.send("Logger")
})

app.post(endpoint, (req, res) => {
    logger.info(JSON.stringify(datadogDataInsight(req.body,req.get('user-agent'))))
    res.send({"Logged":"yes"})
})  

app.options(endpointerror,cors())
app.post(endpointerror, cors(),(req, res) => {
    let errorData = datadogDataerror(req.body,req.get('user-agent'))
    logger.error(errorData)
    res.send(errorData)
})
app.listen(PORT, () => {
    console.log('Listening on port '+PORT)
})
