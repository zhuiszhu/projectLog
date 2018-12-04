const getColl = require("../db/db")
let async = require("async")
let oid = require("objectid")
let getObj = require("../tools/getResponseObj")
let {
    getProjectByClassID,
    getProjectinfo,
    insertProjectinfo,
    getLogsByStudentID,
    setPorjectinfoFunStatusByIndex
} = require("../DAO")

module.exports = {
    method: "get",
    api: {
        getProjectInfo : {
            method : "get",
            route(req,res){
                let {_id:studentID,classID} = req.session.userObj
                studentID = studentID.toString()

                async.waterfall([
                    cb=>getProjectByClassID(classID).then(({err,data})=>cb(err,data)), //查询当前学员所在班级当前项目
                    (projectObj,cb) => { //根据当前项目和学员id查询项目记录
                        if(projectObj){
                            let projectID = projectObj._id.toString()
                            getProjectinfo({studentID,projectID}).then(({err,data})=>cb(err,projectObj,data))
                        }else{
                            cb({code:404},null)
                        }
                    },
                    ({_id,projectname,functions},[projectinfo],cb) => {
                        if(projectinfo){ //如果项目记录存在 则返回
                            cb(null,projectinfo)
                        }else{ //如果项目记录不存在,则添加记录后返回项目记录
                            functions = functions.map(fun=>({...fun,status:"undone"}))
                            
                            projectinfo = {
                                projectID : _id.toString(),
                                studentID,
                                classID,
                                projectname,
                                progress : 0,
                                fraction : 0,
                                functions
                            }

                            insertProjectinfo(projectinfo).then(({err,data})=>cb(err,data.ops[0]))
                        }
                    }
                ],(err,data)=>{
                    if(err && err.code === 404){
                        res.json({
                            code : 404,
                            text : "当前班级尚未进行项目开发"
                        })
                    }else{
                        res.json(getObj(err,data))
                    }
                })
            }
        },
        setProjectinfoFun : {
            route(req,res){
                let {projectinfoid,index,state} = req.query
                if(projectinfoid && index && state){
                    setPorjectinfoFunStatusByIndex(projectinfoid,index,state).then(({err,data})=>res.json(getObj(err,data)))
                }else{
                    res.json({
                        code :  103,
                        text : "参数错误"
                    })
                }
            }
        },
        getUser : {
            method : "get",
            route(req,res){
                let data = {...req.session.userObj}
                delete data.password
                res.json({
                    code : 200,
                    data
                })
            }
        },
        exit : {
            method : "get",
            route(req,res){
                delete req.session.userObj
                res.json({
                    code : 200,
                    text : "操作成功"
                })
            }
        },
        getLogs : {
            route(req,res){
                let {_id:studentID} = req.session.userObj
                studentID = studentID.toString()
                getLogsByStudentID(studentID).then(({err,data})=>res.json(getObj(err,data)))
            }
        },
    }
}