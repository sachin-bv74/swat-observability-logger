const datadogData = function(body, header){
    let data = {
        "swat.client.name": body.client,
        "swat.bvProduct": body.bvProduct,
        "swat.cl":body.cl,
        "swat.productId":body.productId,
        "swat.deploymentZone":body.deploymentZone,
        "swat.source":body.source,
        "swat.host":body.host,
        "swat.loadId":body.loadId,
        "swat.detail1":body.detail1,
        "swat.detail2":body.detail2,
        "swat.name":body.name,
        "swat.type":body.type,
        "epochSecond": Math.floor(new Date().getTime()/1000.0)
    }
    
    return data;
}

module.exports =  datadogData