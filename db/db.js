const mc = require("mongodb").MongoClient

let {host,port,dbname} = require("../config").db

let dbObj = null
mc.connect(`mongodb://${host}:${port}/${dbname}`,(err,db)=>{
    if(!err){
        console.log("数据库连接成功!")
        dbObj = db
    }else{
        console.log("数据库连接失败!原因如下:")
        console.log(err)
    }
})

module.exports = collName => dbObj.collection(collName)