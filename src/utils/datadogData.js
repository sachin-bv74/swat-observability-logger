const UAParser = require('ua-parser-js')
const {swat} = require('../const/constants')

const datadogDataInsight = function(body, userAgent){      
    const ua = new UAParser(userAgent)
    if(ua.getDevice().type == "mobile") {
       swat.ua_mobile = true;
    }
    swat.client.name = body.client
    swat.bvProduct.name = body.bvProduct
    swat.bvProduct.version =  body.bvProductVersion,
    swat.cl = body.cl
    swat.productId = body.productId
    swat.deploymentZone = body.deploymentZone
    swat.source = body.source
    swat.host = body.host
    swat.loadId = body.loadId
    swat.detail1 = '' + body.detail1
    swat.detail2 = '' + body.detail2
    swat.name = body.name
    swat.type = body.type
    swat.ua_browser = ua.getBrowser().name
    swat.ua_browserVersion = ua.getBrowser().version
    swat.ua_platform = ua.getOS().name
    swat.environment = body.environment
    swat.locale = body.locale,
    swat.siteId = body.siteId,
    swat.elapsedMs = body.elapsedMs,
    swat.dc = body.dc,
    swat.displaySegment = body.displaySegment,
    swat.context = body.context,
    swat.epochSecond = Math.floor(new Date().getTime()/1000.0)
    
    var data ={
        swat
    }
    return data;
}
const datadogDataerror = function(body,userAgent){
    const ua = new UAParser(userAgent)
    if(ua.getDevice().type == "mobile") {
        swat.ua_mobile = true;
    }
  let dataerror = {
    'swat.logger': body.logger,
    'swat.bvProduct.name': body.extra.app,
    'swat.platform': body.platform,
    'swat.log.level': body.level,
    'swat.exception': body.exception,
    'swat.sdk': { 'name': body.sdk.name, 'version': body.sdk.version },
    'swat.environment': body.environment,
    'swat.client.name': body.tags.client,
    'swat.bvLoaderVersion': body.tags.bv_loader_release,
    'swat.loadId': body.tags.load_id,
    'swat.deploymentZone': body.tags.deployment_zone,
    'swat.dataEnvironment': body.tags.data_environment,
    'swat.locale': body.tags.locale,
    'swat.component.name': body.tags.component,
    'swat.component.release': '4.0.0',
    'swat.browser': { 'name': body.contexts.browser.name },
    'swat.browser.version': body.contexts.browser.version,
    'swat.ua_browser': ua.getBrowser().name,
    'swat.ua_platform': ua.getOS().name,
    'swat.ua_mobile' :  swat.ua_mobile

    }
    return dataerror;
    }

module.exports = {datadogDataInsight, datadogDataerror}
    