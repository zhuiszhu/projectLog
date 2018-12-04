let getColl = require("../db/db")
let asycn = require("async")
let oid = require("objectid")

module.exports = {
    getProjectByClassID(classid){//根据班级id查询到当前班级所用项目信息
        return new Promise(resolve=>{
            let classListDB = getColl("classList")
            let projectDB = getColl("projectModule")
            classid = oid(classid)
            asycn.waterfall([
                cb=>classListDB.find({_id:classid}).toArray((err,list)=>cb(err,list[0])),
                (classObj,cb)=>{
                    if(classObj && classObj.projectID && classObj.projectID !== "none"){
                        let {projectID} = classObj
                        projectID = oid(projectID)
                        projectDB.find({_id:projectID}).toArray((err,list)=>cb(err,list[0]))
                    }else{
                        cb(null,null)
                    }
                }
            ],(err,data)=>{
                resolve({err,data})
            })
        })
    },
    insertProjectinfo(data){
        return new Promise(resolve=>{

            let projectInfoDB = getColl("projectinfo")
    
            projectInfoDB.insert(data,(err,data)=>{
                resolve({err,data})
            })
        })
    },
    getStudentByClassID(classid){
        return new Promise(resolve=>{
            let studentDB = getColl("student")

            studentDB.find({classID:classid}).toArray((err,data)=>resolve({err,data}))
        })
    },
    getProjectByProjectID(projectid){
        return new Promise(res=>{
            let _id = projectid;
            _id = oid(_id)
            let projectModuleDB = getColl("projectModule")

            projectModuleDB.find({_id}).toArray((err,list)=>res({err,data:list[0]}))
        })
    },
    hasProjectinfo(classID,projectID){ //判断当前班级是否注入过指定项目的项目信息
        return new Promise(res=>{
            let projectinfoDB = getColl("projectinfo")
            projectinfoDB.count({classID,projectID},(err,data)=>res({err,data}))
        })
    },
    getProjectinfo(data){
        return new Promise(res=>{
            let projectinfoDB = getColl("projectinfo")
            let query = {...data}
            if(query._id){
                query._id = oid(query._id)
            }
            projectinfoDB.find(query).toArray((err,data)=>res({err,data}))

        })
    },
    getLogsByStudentID(studentID){
        return new Promise(res=>{
            let logsDB = getColl("logs")
            logsDB.find({studentID}).toArray((err,data)=>res({err,data}))
        })
        
    },
    setPorjectinfoFunStatusByIndex(id,i,state){
        return new Promise(res=>{
            let projectinfoDB = getColl("projectinfo")
            let _id = oid(id)
            asycn.waterfall([
                cb=>projectinfoDB.find({_id}).toArray((err,data)=>cb(err,data[0])),
                ({functions},cb)=>{
                    let len = functions.length
                    let half = 0
                    let done = 0
                    functions.map(({status})=>{
                        switch(status){
                            case "success":
                                done ++
                                break
                            case "in-dev":
                                half ++
                                break
                        }
                    })

                    let progress = (half/2+done)/len*100
                    functions[i].status = state

                    projectinfoDB.update({_id},{$set:{functions,progress}},(err,data)=>cb(err,data))
                }

            ],(err,data)=>res({err,data}))
        })
    }
}