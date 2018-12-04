const getColl = require("../db/db")
let {username:nv,password:pv,name:sv} = require("../tools/strVali")
const jm = require("../tools/enc")
const getClass = require("../tools/getClassName")
let async = require("async")
let oid = require("objectid")
let getObj = require("../tools/getResponseObj")
let {
        getStudentByClassID,
        getProjectByProjectID,
        insertProjectinfo
    } = require("../DAO")

module.exports = {
    method: "post",
    api: {
        addProjectModule : {
            route(req,res){
                let data = req.body
                let projectModule = getColl("projectModule")
                let adminID = req.session.userObj._id

                data.fraction *= 1
                data.functions = JSON.parse(data.functions)
                data.deductions = JSON.parse(data.deductions)
                data.active = data.active === "true"
                
                if(data.active){
                    projectModule.update({adminID},{$set:{active:false}},{multi:true},(err,info)=>{
                        if(!err){
                            insert()
                        }else{
                            res.json({
                                code : 500,
                                text : "服务器错误",
                                err
                            })
                        }
                    })
                }else{
                    insert()
                }

                function insert(){
                    data.adminID = adminID
                    projectModule.insert(data,(err,info)=>{
                        let obj = {
                            code : !err ? 200 : 500,
                            text : !err ? "录入成功" : "服务器错误"
                        }
                        res.json(obj)
                    })
                }
            }
        },
        getProjects : {
            method:"get",
            route(req,res){
                let projectModule = getColl("projectModule")
                let {_id:adminID} = req.session.userObj
                projectModule.find({adminID}).toArray((err,list)=>{
                    let obj = {
                        code : !err ? 200 : 500,
                        list : !err ? list : null,
                        err
                    }

                    res.json(obj)
                })
            }
        },
        tabProject : {
            method : "get",
            route(req,res){
                let projectModule = getColl("projectModule")
                let {projectID} = req.query
                let {_id:adminID} = req.session.userObj
                projectID = oid(projectID)

                async.series([
                    cb=>{
                        projectModule.update({adminID},{$set:{active:false}},{multi:true},(err,info)=>{
                            cb(err,info)
                        })
                    },
                    cb=>{
                        projectModule.update({_id:projectID},{$set:{active:true}},(err,info)=>{
                            cb(err,info)
                        })
                    }
                ],(err,info)=>{
                    let obj = {
                        code : !err ? 200 : 500,
                        err,
                        info
                    }

                    res.json(obj)
                })
            }
        },
        rmProject : {
            route(req,res){
                let {projectID} = req.body
                projectID = oid(projectID)

                let projectModule = getColl("projectModule")

                projectModule.remove({_id:projectID},(err,info)=>{
                    let obj = {
                        code : !err ? 200 : 500,
                        text : !err ? "删除成功" : "服务器错误,删除失败!",
                        err,
                        info
                    }

                    res.json(obj)
                })
            }
        },
        setProject : {
            route(req,res){
                let {data} = req.body
                data = JSON.parse(data)
                let {projectID} = data
                projectID = oid(projectID)
                delete data.projectID

                let projectModule = getColl("projectModule")

                 projectModule.update({_id:projectID},{$set:data},(err,info)=>{
                    let obj = {
                        code : !err ? 200 : 500,
                        text : !err ? "修改成功" : "服务器错误,修改失败!",
                        err,
                        info
                    }

                    res.json(obj)
                })
            }
        },
        addClass : {
            method : "get",
            route(req,res){
                let data = req.query
                let classList = getColl("classList")
                data.active = data.active == "true"
                let {_id:adminID,username:adminName} = req.session.userObj
                let nData = {...data,adminID}
                
                async.parallel({
                    count(cb){
                        classList.find({adminID}).sort({classSymbolNum:-1}).limit(1).toArray((err,list)=>cb(err,list[0].classSymbolNum))

                    },
                    repeat(cb){
                        classList.count({adminID,classname:data.classname,city:data.city},(err,num)=>cb(err,num))
                    }
                },(err,{count=0,repeat:num})=>{
                    if(num == 0){
                        count*=1
                        let classSymbolNum = count+1
                        
                        nData.classSymbolNum = classSymbolNum
                        nData.classSymbol = adminName + "_" + classSymbolNum
                        if(data.active){ //确保当前用户下仅有一个班级为选中状态
                            classList.update({adminID},{$set:{active:false}},{multi:true},(err,info)=>{
                                if(!err){
                                    insert()
                                }else{
                                    res.json({
                                        code : 500,
                                        text : "服务器错误",
                                        err,
                                        info
                                    })
                                }
                            })
                        }else{
                            insert()
                        }

                        function insert(){
                            classList.insert(nData,(err,info)=>{
                                let obj = {
                                    code : !err ? 200 : 500,
                                    text : !err ? "班级添加成功" : "服务器错误",
                                    err,
                                    info
                                }
            
                                res.json(obj)
                            })
                        }
                        
                    }else{
                        let obj = {
                            code : !err ? 1100 : 500,
                            text : !err ? "该班级名在当前校区已存在" : "服务器错误"
                        }
                        res.json(obj)
                    }
                })

            }
        },
        getClass : {
            method : "get",
            route(req,res){
                let {_id:adminID} = req.session.userObj

                let classList = getColl("classList")
                
                async.parallel({
                    list : cb=>classList.find({adminID}).toArray((err,list)=>cb(err,list)),
                    cityList : cb => classList.distinct("city",{adminID},(err,list)=>cb(err,list))
                },(err,{list,cityList=[]})=>{
                    let obj = {
                        code : !err ? 200 : 500,
                        text : !err ? "" : "服务器错误",
                        cityList,
                        list,
                        err
                    }
    
                    res.json(obj)
                })
                
            }
        },
        tabClass : {
            method : "get",
            route(req,res){
                let {classid:id} = req.query
                if(id){
                    id = oid(id)
                    let {_id:adminID} = req.session.userObj
    
                    let classListDB = getColl("classList")
    
                    async.series([
                        cb=>classListDB.update({adminID},{$set:{active:false}},{multi:true},(err,info)=>cb(err,info)),
                        cb=>classListDB.update({_id:id},{$set:{active:true}},(err,info)=>cb(err,info))
                    ],(err)=>{
                        let obj = {
                            code : !err ? 200 : 500,
                            text : !err ? "修改成功" : "服务器错误",
                            err
                        }
    
                        res.json(obj)
                    })
                }else{
                    res.json({
                        code : 103,
                        text : "请传入班级id"
                    })
                }
            }
        },
        setClass : {
            method : "get",
            route(req,res){
                let {classid:_id,classname,city} = req.query
                let {_id:adminID} = req.session.userObj

                _id = oid(_id)

                let classListDB = getColl("classList")

                classListDB.count({adminID,classname,city},(err,num)=>{
                    if(!err && num == 0){
                        classListDB.update({_id},{$set:{classname,city}},(err,info)=>{
                            let obj = {
                                code : !err ? 200 : 500,
                                text : !err ? "修改成功" : "服务器错误",
                                err,
                                info
                            }

                            res.json(obj)
                        })
                    }else{
                        let obj = {
                            code : !err ? 1100 : 500,
                            text : !err ? "该地区下班级名已存在" : "服务器错误",
                            err
                        }

                        res.json(obj)
                    }
                })
            }
        },
        setClass_project : {
            method : "get",
            route(req,res){
                let {classid,projectID} = req.query
                let _id = classid
                _id = oid(_id)
                let classListDB = getColl("classList")

                
                //根据项目id和班级id查询到项目对象和学员列表 并整合成一个项目信息列表
                async.parallel({
                        stuList : cb => getStudentByClassID(classid).then(({err,data})=>cb(err,data)),
                        projectObj : cb => getProjectByProjectID(projectID).then(({err,data})=>cb(err,data))
                },(err,{stuList,projectObj})=>{
                    let projectinfoList = stuList.map(stu=>{
                        let functions = projectObj.functions.map(({name:funName,fraction})=>{
                            return {funName,fraction,status:"undone"}
                        })
                        
                        let obj = {
                            projectID : projectObj._id.toString(),
                            studentID : stu._id.toString(),
                            projectname : projectObj.projectname,
                            classID : classid,
                            progress : 0,
                            fraction : 0,
                            functions
                        }
                        return obj
                    })

                    insertProjectinfo(projectinfoList).then(({err,data})=>{
                        console.log(data)
                    })
                })

                //根据班

                classListDB.update({_id},{$set:{projectID}},(err,info)=>{
                    res.json(getObj(err,info))
                })
            }
        },
        rmClass : {
            method : "get",
            route(req,res){
                let {classid} = req.query
                classid = oid(classid)

                let classListDB = getColl("classList")

                classListDB.remove({_id:classid},(err,info)=>{
                    let obj = {
                        code : !err ? 200 : 500,
                        text : !err ? "班级删除成功" : "服务器错误",
                        err,
                        info
                    }

                    res.json(obj)
                })

            }
        },
        getStudent : {
            method : "get",
            route(req,res){
                // 根据当前管理员查询 当前所选中的班级
                let {_id:adminID} = req.session.userObj
                let classListDB = getColl("classList")
                let studentDB = getColl("student")
                adminID = adminID.toString()

                classListDB.find({adminID,active:true}).toArray((err,list)=>{
                    
                    if(!err && list.length != 0){
                        let classObj = list[0]
                        let {_id:classID} = classObj
                        classID = classID.toString()

                        // 根据班级id查询所属学员列表

                        studentDB.find({classID},{password:0}).toArray((err,list)=>{
                            res.json(getObj(err,list))
                        })
                    }else{
                        res.json({
                            code : !err ? 404 : 500,
                            text : !err ? "当前无班级或没有启用班级,请前往班级管理页面添加及启用班级" : "服务器错误"
                        })
                    }
                })
            }
        }
    }
}