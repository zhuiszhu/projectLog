const getColl = require("../db/db")
const oid = require("objectid")

module.exports = {
    api: {
        addComment: {
            method: "post",
            title : "添加商品评价",
            dataType :[
                {key:"goodsID",type:"string",info:"被评价的商品id"},
                {key:"level",type:"number",info:"评分等级1-5"},
                {key:"content",type:"string",info:"评分内容"},

            ],
            callback : [
                {key:"code",type:"number",info:"请求状态,200请求成功,400未登录,103参数错误,500服务器查询失败"},
                {key : "info",type:"object",info:"评价成功信息"},
                {key : "err",type:"object",info:"错误信息"},
                {key : "text",type:"string",info:"请求状态描述"},
            ],
            route(req,res) {
                let {goodsID,level,content} = req.body
                level *= 1
                let resObj = {}
                if(!goodsID || !level || level>5 || level<1 || isNaN(level) || !content){
                    resObj.code = 103
                    resObj.text = "参数错误"
                    res.json(resObj)
                }else{
                    let commentDB = getColl("comment")
                    let userID = req.session.userObj._id

                    commentDB.insert({goodsID,userID,level,content},(err,info)=>{
                        resObj.code = !err ? 200 : 500
                        resObj.err = err
                        resObj.info = info
                        res.json(resObj)
                    })
                }

             
            }
        },
        getComment: {
            title : "获取商品评价",
            method: "get",
            dataType :[
                {key:"goodsID",type:"string",info:"商品ID"},
            ],
            callback : [
                {key:"code",type:"number",info:"请求状态,200请求成功,103参数错误,500服务器操作失败"},
                {key : "list",type:"array",info:"商品评价列表"},
                {key : "err",type:"object",info:"错误信息"}
            ],
            route(req,res) {
                
                let {goodsID} = req.query
                let resObj = {}
                
                if(!goodsID){
                    resObj.code = 103
                    resObj.text = "参数错误,请传入goodsID"
                    res.json(resObj)
                }else{
                    let commentDB = getColl("comment")
                    commentDB.find({goodsID}).toArray((err,list)=>{
                        resObj.code = !err ? 200 : 500
                        resObj.list = list 
                        resObj.err = err 
                        res.json(resObj)
                    })
                }
            }
        },
        update: {
            title : "修改购物车商品数量",
            dataType :[
                {key:"goodsID",type:"string",info:"商品ID"},
                {key:"number",type:"number",info:"商品数量"},
            ],
            callback : [
                {key:"code",type:"number",info:"请求状态,200请求成功,400未登录,500服务器操作失败"},
                {key : "info",type:"object",info:"修改成功信息"},
                {key : "err",type:"object",info:"错误信息"}
            ],
            route(req,res) {
                
                let shopCarDB = getColl("shop_car")
                let {goodsID,number} = req.query
                number *= 1
                let resObj = {}
                let userID = req.session.userObj._id

                if(!goodsID || !number || isNaN(number) || number < 1){
                    resObj.code = 103
                    resObj.text = "参数错误,请传入正确的goodsID及number值"
                    res.json(resObj)
                }else{
                    shopCarDB.update({goodsID,userID},{$set:{number}},(err,info)=>{
                        resObj.code = !err ? 200 : 500
                        resObj.info = info 
                        resObj.err = err 
                        res.json(resObj)
                    })
                }
            }
        },
        del: {
            title : "删除购物车商品",
            dataType :[
                {key:"goodsID",type:"string",info:"商品ID"},
            ],
            callback : [
                {key:"code",type:"number",info:"请求状态,200请求成功,400未登录,500服务器操作失败"},
                {key : "info",type:"object",info:"删除成功信息"},
                {key : "err",type:"object",info:"错误信息"}
            ],
            route(req,res) {
                
                let shopCarDB = getColl("shop_car")
                let {goodsID} = req.query
                let resObj = {}
                let userID = req.session.userObj._id

                if(!goodsID){
                    resObj.code = 103
                    resObj.text = "参数错误,请传入正确的goodsID"
                    res.json(resObj)
                }else{
                    shopCarDB.remove({goodsID,userID},(err,info)=>{
                        resObj.code = !err ? 200 : 500
                        resObj.info = info 
                        resObj.err = err 
                        res.json(resObj)
                    })
                }
            }
        },
    }
}