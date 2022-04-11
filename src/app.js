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
//Approach 1
app.post('/logger', (req, res) => {
    let data = datadogDataInsight(req.body,req.get('user-agent'))
    logger.info(data)
<<<<<<< HEAD
=======
    // analyticsRequest(req.body, req.headers)
    res.send({"Logged":"yes"})
}) 
//Approach 2(in-progress)
app.post('/logger/url', (req,res)=> {
    var url = req.body.url;
    let params = (new URL(url)).searchParams;
    if(params.get('r_batch')){
        var batch = params.get('r_batch').replace(/,/g, "&").replace(/:/g, "=");//setting r_batch in query param format to make later processing easier
        params.set('r_batch',batch)
        var batchUrl = params.get('r_batch').match(/\(([^()]*)\)/g).map(function($0) { return $0.substring(1,$0.length-1) })//extracting each event from batch
        console.log( new URLSearchParams(batchUrl[0]) )
    }
>>>>>>> 9bb5969 (Approach 2)
    res.send({"Logged":"yes"})
})  
app.options(endpointerror,cors())
app.post(endpointerror, cors(),(req, res) => {
    let errorData = datadogDataerror(req.body)
    logger.error(errorData)
  
  res.send(errorData)
})
app.listen(PORT, () => {
    console.log('Listening on port '+PORT)
})
