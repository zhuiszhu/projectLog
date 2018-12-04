const getColl = require("../db/db")
const oid = require("objectid")

module.exports = {
    method: "get",
    api: {
        getList: {
            title : "获取购物车列表",
            dataType :[],
            callback : [
                {key:"code",type:"number",info:"请求状态,200请求成功,400未登录,500服务器查询失败"},
                {key : "list",type:"array<goods>",info:"购物车列表数据"},
                {key : "err",type:"object",info:"错误信息"}
            ],
            route(req,res) {
                
                let shoppCarDB = getColl("shop_car")
                let goodsDB = getColl("goods")
                let resObj = {}
                let userID = req.session.userObj._id
             
                shoppCarDB.find({userID}).toArray((err,list)=>{
                    resObj.code = !err ? 200 : 500
                    resObj.text =  !err ? "查询成功" : "查询失败"
                    resObj.err = err
                    resObj.list = list

                    res.json(resObj)
                    

                })
            }
        },
        addToCar: {
            title : "添加购物车",
            dataType :[
                {key:"goodsID",type:"string",info:"商品ID"},
                {key:"number",type:"number",info:"商品数量,默认为1"},
            ],
            callback : [
                {key:"code",type:"number",info:"请求状态,200请求成功,400未登录,500服务器操作失败"},
                {key : "info",type:"object",info:"添加成功信息"},
                {key : "err",type:"object",info:"错误信息"}
            ],
            route(req,res) {
                
                let shopCarDB = getColl("shop_car")
                let goodsDB = getColl("goods")
                let {goodsID,number=1} = req.query
                let resObj = {}
                let userID = req.session.userObj._id

                if(!goodsID){
                    resObj.code = 103
                    resObj.text = "参数错误,请传入goodsID"
                    res.json(resObj)
                }else{
                    goodsDB.find({_id:oid(goodsID)}).toArray((err,list)=>{
                        let {name,price,discount,img} = list[0]
                        shopCarDB.insert({goodsID,userID,number,name,price,discount,img},(err,info)=>{
                            resObj.code = !err ? 200 : 500
                            resObj.info = info 
                            resObj.err = err 
                            res.json(resObj)
                        })
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