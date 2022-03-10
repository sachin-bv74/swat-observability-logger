
const express = require('express')
const axios = require('axios');
const cors = require("cors");
const logger= require('./utils/logger')

const app = express()
app.use(express.json());
app.use(cors())

app.post('/error', (req, res) => {

    let data = {
        "swat.client.name": req.body.client,
        "swat.product": req.body.bvProduct,
        "swat.log":"event",
        "swat.log.cl":req.body.cl,
        "swat.productId":req.body.productId,
        "swat.deploymentZone":req.body.deploymentZone,
        "swat.source":req.body.source,
        "swat.host":req.body.host,
        "swat.loadId":req.body.loadId,
        "swat.detail1":req.body.detail1,
        "swat.detail2":req.body.detail2,
        "swat.name":req.body.name,
        "swat.type":req.body.type,
        "epochSecond": Math.floor(new Date().getTime()/1000.0)
    }
      
    logger.info(data)//log 
    res.send({"Logged":"yes"})
    // axios.post('http://localhost:8080/analytics', {"data": req.body})
    //   .then(function (response) {
    //     console.log(response.data);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})



