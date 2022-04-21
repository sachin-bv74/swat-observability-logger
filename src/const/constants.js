process.env.NODE_ENV = 'development';
const endpoint = '/insight'
const endpointerror = '/error'

const PORT = 3000;

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
  ua_mobile: false,
  ua_platform: "",
  epochSecond: "",
  environment:"",
}

module.exports =  {
    endpoint,
    swat,
    PORT,
    endpointerror
  }

  
  