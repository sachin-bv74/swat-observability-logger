const UAParser = require('ua-parser-js')
var ua_mobile = false;

const datadogData = function(body, userAgent){
    const ua = new UAParser(userAgent)
    if(ua.getDevice().type == "mobile") {
        ua_mobile = true;
    }
    let data = {
        "swat.client.name": body.client,
        "swat.bvProduct": body.bvProduct,
        "swat.bvProduct.version": body.bvProductVersion,
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
        "swat.ua_browser": ua.getBrowser().name,
        "swat.ua_platform": ua.getOS().name,
        "swat.ua_mobile":ua_mobile,
        "epochSecond": Math.floor(new Date().getTime()/1000.0),
        
    }  
    return data;
  }
  const datadogDataerror = function(body){
  let dataerror = {
    'swat.logger': body.logger,
    'swat.platform': body.platform,
    'swat.log.level': body.level,
    'swat.exception': body.exception,
    'swat.sdk': { 'name': body.sdk.name, 'version': body.sdk.version },
    'swat.client.name': body.tags.client,
    'swat.component.name': body.tags.component,
    'swat.component.release': '4.0.0',
    'swat.browser': { 'name': body.contexts.browser.name },
    'swat.browser.version': body.contexts.browser.version,
    }
    return dataerror;
    }

module.exports = {datadogData, datadogDataerror}