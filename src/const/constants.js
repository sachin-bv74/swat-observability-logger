
const endpoint = '/insight'
const endpointerror = '/error'

const PORT = 8080;

var swat = {
  client : {
    name : ""
  },
  bvProduct : {
    name: "",
    version: ""
  },
  cl: "",
  productId: "",
  deploymentZone: "",
  source: "",
  host: "",
  loadId: "",
  detail1: "",
  detail2: "",
  name: "",
  type: "",
  ua_browser: "",
  ua_browserVersion: "",
  ua_mobile: false,
  ua_platform: "",
  epochSecond: "",
  environment:"",
  locale:"",
  siteId:"",
  elapsedMs:""
}

module.exports =  {
    endpoint,
    swat,
    PORT,
    endpointerror
  }

  
  