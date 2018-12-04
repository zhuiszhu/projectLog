const getColl = require("../db/db")
let {username:nv,password:pv,name:sv} = require("../tools/strVali")
const jm = require("../tools/enc")
const getClass = require("../tools/getClassName")

module.exports = {
    method: "post",
    api: {
        login: {
            method : "get",
            route(req, res) {
                res.render("stuLogin")
            }
        },
        register: {
            method : "get",
            route(req, res) {
                res.render("stuRegister")
            }
        },
        reg: {
            title : "学员注册",
            dataType :[
                {key:"username",type:"string",info:"用户名"},
                {key:"password",type:"string",info:"密码"},
                {key:"studentname",type:"string",info:"真实姓名"}
            ],
            callback : [
                {key : "code",type:"number",info:"注册状态码,200注册成功,100用户名已存在,101用户名不合法,102密码不合法,103参数不合法500服务器错误"},
                {key : "text",type:"string",info:"注册状态文字说明"}
            ],
            route(req, res) {
                let usersDB = getColl("student")
                let {username,password,studentname,classSymbol} = req.body
                let resObj = {}
                
                
                if(!username || !password || !studentname){
                    resObj.code = 103
                    resObj.text = "请传入正确的参数"
                    res.json(resObj)
                }else if(!nv(username)){
                    resObj.code = 101
                    resObj.text = "用户名不合法"
                    res.json(resObj)
                }else if(!pv(password)){
                    resObj.code = 102
                    resObj.text = "密码不合法"
                    res.json(resObj)
                }else if(!sv(studentname)){
                    resObj.code = 102
                    resObj.text = "姓名不合法"
                    res.json(resObj)
                }else{
                    let {classSymbol} = req.body
                    getClass(classSymbol,classObj=>{
                        if(classObj){
                            let {_id:classID,classname,classSymbol} = classObj
                            classID = classID.toString()
                            password = jm(password)

                            usersDB.count({username},(err,num)=>{
                                if(!err && num == 0){
                                    insert()
                                }else{
                                    let obj = {
                                        code : !err ? 11000 : 500,
                                        text : !err ?  "用户名已存在" : "服务器错误"
                                    }
                                    res.json(obj)
                                }
                            })

                            function insert(){
                                usersDB.insert({username,password,studentname,classname,classID,classSymbol},(err,info)=>{
                                    if(!err){
                                        resObj.code = 200
                                        resObj.text = "注册成功"
                                    }else{
                                        if(err.code == 11000){
                                            resObj.code = 100
                                            resObj.text = "用户名已存在"
                                        }else{
                                            resObj.code = 500
                                            resObj.text = "数据录入失败,请联系管理员"
                                        }
                                    }
                                    res.json(resObj)
                                })
                            }
                        }else{
                            res.json({
                                code : 103,
                                text : "班级唯一标识有误,请确认检查后填入"
                            })
                        }
                    })

                }

                
            }
        },
        lgn: {
            title : "用户登录",
            dataType :[
                {key:"username",type:"string",info:"用户名"},
                {key:"password",type:"string",info:"密码"},
            ],
            callback : [
                {key : "code",type:"number",info:"登录状态码,200登录成功,101用户名不合法,102密码不合法,400用户名或密码错误,500服务器错误"},
                {key : "text",type:"string",info:"登录状态文字说明"}
            ],
            route(req, res) {
                let usersDB = getColl("student")
                let {username,password} = req.body
                let resObj = {}

                if(!username || !password){
                    resObj.code = 103
                    resObj.text = "请传入正确的参数"
                    res.json(resObj)
                }else if(!nv(username)){
                    resObj.code = 101
                    resObj.text = "用户名不合法"
                    res.json(resObj)
                }else if(!pv(password)){
                    resObj.code = 102
                    resObj.text = "密码不合法"
                    res.json(resObj)
                }else{
                    password = jm(password)
                    
                    usersDB.find({username}).toArray((err,list)=>{
                        if(!err){
                            if(list.length != 0 && list[0].password == password){
                                req.session.userObj = list[0]
                                resObj.code = 200
                                resObj.text = "登录成功"
                            }else{
                                resObj.code = 400
                                resObj.text = "用户名或密码错误"
                            }
                        }else{
                            console.log(err)
                            resObj.code = 500
                            resObj.text = "服务器错误,请联系管理员"
                        }

                        res.json(resObj)
                    })
                }
            }
        },
        exit:{
            title : "退出登录",
            method : "get",
            dataType :[],
            callback : [
                {key : "code",type:"number",info:"登录状态码,200请求成功"},
                {key : "text",type:"string",info:"请求状态文字说明"}
            ],
            route(req, res) {
                delete req.session.userObj
            }
        }
    }
}