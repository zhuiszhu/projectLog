let {stu,admin} = require("../config/isLogin")
let urlObj = require("url")
module.exports = (req,res,next) => {
    let urlstr = urlObj.parse(req.url).pathname
    let url = urlstr.split("/")

    if(stu.page.indexOf(url[1]) >= 0){
        if(req.session.userObj && !req.session.userObj.isAdmin){
            next()
        }else if(req.session.userObj){
            res.send("您已登录管理员账号,请进入管理员界面")
        }else{
            res.redirect("/user/login")
        }
    }else if(stu.ajax.indexOf(url[1]) >= 0){
        if(req.session.userObj  && !req.session.userObj.isAdmin){
            next()
        }else if(req.session.userObj){
            res.json({
                code : 401,
                text : "您已登录管理员账号,权限不符"
            })
        }else{
            res.json({
                code : 400,
                text : "您尚未登录,请登录后再试"
            })
        }
    }else if(admin.page.indexOf(url[1]) >= 0){
        if(req.session.userObj && req.session.userObj.isAdmin){
            next()
        }else if(req.session.userObj){
            res.redirect("/user/login")
        }else{
            res.redirect("/admin/login")
        }
    }else if(admin.ajax.indexOf(url[1]) >= 0){
        if(req.session.userObj && req.session.userObj.isAdmin){
            next()
        }else if(req.session.userObj){
            res.json({
                code : 401,
                text : "权限不足,请登录管理员账号后再试"
            })
        }else{
            res.json({
                code : 400,
                text : "您尚未登录,请登录后再试"
            })
        }
    }else{
        next()
    }

}