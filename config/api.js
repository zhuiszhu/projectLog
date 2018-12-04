
const fs = require("fs");
const ServicePath = require("./servicePath")

let path = fs.readdirSync(`./${ServicePath}`)

let apiList = []
path.map(url=>{
  url = url.replace(".js","")
  let ser = require(`../${ServicePath}/${url}`)
  
  let {method:met="get",api} = ser
  
  for(let key in api){
    let {method:mtd=met,route,title,dataType,callback} = api[key]
    let pathStr = `/zhuiszhu/${url}/${key}`
    
    let apiObj = {
        title,
        dataType,
        callback,
        path:pathStr,
        method : mtd,
    }

    apiList.push(apiObj)
  }
})

module.exports = {api:apiList}