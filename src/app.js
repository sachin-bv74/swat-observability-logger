const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const { datadogDataInsight, datadogDataerror} = require('./utils/datadogData')
const {endpoint, PORT, endpointerror} = require('./const/constants')
const Sentry = require("@sentry/node")
Sentry.init({
        dsn: 'https://eee5654df24848d2a73e8760a8feb3b5:30454371d3ff449fbc49ee8107c76a47@sentry.io/97678'
})

const app = express()
app.use(express.json())
app.use(cors())

app.get(endpoint, (req,res) => {
    res.send("Logger") 
})
app.get(endpointerror, (req,res) => {
    res.send("ERROR")
})

app.post(endpoint, (req, res) => {
    logger.info(JSON.stringify(datadogDataInsight(req.body,req.get('user-agent'))))
    res.send({"Logged":"yes"})
})
app.options(endpointerror,cors())
app.post(endpointerror, cors(),(req, res) => {
const errorData = datadogDataerror(req.body, req.get('user-agent'))
logger.error(errorData)
Sentry.captureException(req.body)
res.send({"Error":"yes"})
}
);

app.listen(PORT, () => {
    console.log('Listening on port '+PORT)
})