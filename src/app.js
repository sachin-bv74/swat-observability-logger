const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const {datadogData, datadogDataerror} = require('./utils/datadogData')
const {endpoint, PORT, endpointerror} = require('./const/constants')


const app = express()
app.use(express.json())
app.use(cors())

app.get(endpoint, (req,res) => {
    res.send("Logger")
})

app.post(endpoint, (req, res) => {
    let data = datadogData(req.body,req.get('user-agent'))
    logger.info(data)
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
