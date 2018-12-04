const getColl = require("../db/db")
const async = require("async")
const oid = require("objectid")

module.exports = {
    method: "get",
    api: {
        getList: {
            title : "获取商品列表",
            dataType :[
                {key:"type",type:"string",info:"商品分类类型,可选,默认不按分类进行返回数据"},
                {key:"page",type:"number",info:"分页页码数,默认值为1"},
                {key:"pageSize",type:"number",info:"每页商品数量,默认5条"},
                {key:"sort",type:"string",info:"排序类型,可按价格price,折扣discount,类型type进行排序"},
                {key:"isAsc",type:"number",info:"是否升序,1为升序,-1为降序  默认1"},
            ],
            callback : [
                {key:"code",type:"number",info:"请求状态,200请求成功,103参数错误,500服务器查询失败"},
                {key : "count",type:"number",info:"当前数据总数"},
                {key : "countPage",type:"number",info:"总页数"},
                {key : "list",type:"array<goods>",info:"商品列表数据"},
                {key : "err",type:"object",info:"错误信息"}
            ],
            route(req,res) {
                
                let goodsDB = getColl("goods")
                let {type=null,page=1,pageSize=5,sort=null,isAsc=1} = req.query
                let resObj = {}
                let option = {}
                let sortObj = {}
                pageSize *= 1
                page *= 1
                if(type != null){
                    option["type.value"] = type
                }
                
                if(sort != null ){
                    sortObj[sort] = isAsc*1
                }
                console.log(pageSize)
                async.parallel({
                    list(cb){
                        goodsDB
                            .find(option,{name:1,price:1,discount:1,type:1,img:1})
                            .limit(pageSize)
                            .skip((page-1)*pageSize)
                            .sort(sortObj)
                            .toArray((err,list)=>cb(err,list))
                    },
                    count(cb){
                        goodsDB.count(option,(err,info)=>cb(err,info))
                    }
                },(err,{list,count})=>{
                    if(!err){
                        resObj.code = 200
                        resObj.count = count
                        resObj.countPage = parseInt(count/pageSize) 
                        resObj.list = list
    
                    }else{
                        resObj.code = 500
                        resObj.err = err
                    }
                    
                    res.json(resObj)
                })
            }
        },
        search: {
            title : "商品搜索",
            dataType :[
                {key:"search",type:"string",info:"商品搜索关键字,可输入商品类型或者商品名所包含的文字"},
                {key:"page",type:"number",info:"分页页码数,默认值为1"},
                {key:"pageSize",type:"number",info:"每页商品数量,默认5条"},
                {key:"sort",type:"string",info:"排序类型,可按价格price,折扣discount,类型type进行排序"},
                {key:"isAsc",type:"number",info:"是否升序,1为升序,-1为降序  默认1"},
            ],
            callback : [
                {key:"code",type:"number",info:"请求状态,200请求成功,103参数错误,500服务器查询失败"},
                {key : "count",type:"number",info:"当前数据总数"},
                {key : "countPage",type:"number",info:"总页数"},
                {key : "list",type:"array<goods>",info:"商品列表数据"},
                {key : "err",type:"object",info:"错误信息"}
            ],
            route(req,res) {

                let {search,page=1,pageSize=5,sort=null,isAsc=1} = req.query
                let resObj = {}
                if(!search){
                    resObj.code = 103
                    resObj.text = "参数错误"
                    res.json(resObj)
                }else{
                    let goodsDB = getColl("goods")
                    let option = {$or:[{
                        name : {$regex: search, $options:'i'}
                    },{
                        'type.text' : {$regex: search, $options:'i'}
                    }]}
                    let sortObj = {}
                    pageSize *= 1
                    page *= 1
                    
                    if(sort != null ){
                        sortObj[sort] = isAsc*1
                    }
                    
                    async.parallel({
                        list(cb){
                            goodsDB
                                .find(option,{name:1,price:1,discount:1,type:1})
                                .limit(pageSize)
                                .skip((page-1)*pageSize)
                                .sort(sortObj)
                                .toArray((err,list)=>cb(err,list))
                        },
                        count(cb){
                            goodsDB.count(option,(err,info)=>cb(err,info))
                        }
                    },(err,{list,count})=>{
                        if(!err){
                            resObj.code = 200
                            resObj.count = count
                            resObj.countPage = parseInt(count/pageSize) 
                            resObj.list = list
        
                        }else{
                            resObj.code = 500
                            resObj.err = err
                        }
                        
                        res.json(resObj)
                    })

                }
                
            }
        },
        getGoods: {
            title : "获取商品详情",
            dataType :[
                {key:"goodsID",type:"string",info:"需要获取详情的商品id"},
            ],
            callback : [
                {key:"code",type:"number",info:"查询信息:200查询成功 103参数错误 404找不到指定id商品  500查询服务出错 "},
                {key:"text",type:"string",info:"查询状态文本描述"},
                {key:"goods",type:"object",info:"商品信息描述"},
                {key:"goods._id",type:"string",info:"商品id"},
                {key:"goods.name",type:"string",info:"商品名"},
                {key:"goods.price",type:"number",info:"商品价格"},
                {key:"goods.discount",type:"number",info:"折扣"},
                {key:"goods.stock",type:"number",info:"库存数量"},
                {key:"goods.img",type:"string",info:"商品缩略图地址"},
                {key:"goods.banner",type:"array",info:"商品轮播图图片列表"},
                {key:"goods.detail",type:"string",info:"商品详情"},
                {key:"goods.imgs",type:"array",info:"商品详情图"},
                {key:"goods.type",type:"object",info:"商品分类"},
                {key:"goods.comment",type:"array",info:"商品用户评论"},
            ],
            route(req,res) {
                // console.log(req.query)
                let goodsDB = getColl("goods")
                let {goodsID} = req.query
                let resObj = {}
                if(!goodsID){
                    resObj.code = 103
                    resObj.text = "参数错误"
                    res.json(resObj)
                }else{
                    goodsID = oid(goodsID)
                    goodsDB.find({_id:goodsID}).toArray((err,list)=>{
                        if(!err){
                            
                            resObj.code = list.length == 0 ? 404 : 200
                            resObj.goods = list.length == 0 ? null : list[0]
                            resObj.text = list.length == 0 ? "商品不存在" : "查询成功"
                        }else{
                            resObj.code = 500
                            resObj.text = "查询失败"
                            resObj.err = err
                        }

                        res.json(resObj)
                    })
                }
            }
        },
        getHot: {
            title : "获取热门商品列表",
            dataType :[],
            callback : [
                {key:"code",type:"number",info:"请求状态,200请求成功,500服务器查询失败"},
                {key : "list",type:"array<goods>",info:"商品列表数据"},
                {key : "err",type:"object",info:"错误信息"}
            ],
            route(req,res) {
                
                let goodsDB = getColl("hot_goods")
                let resObj = {}
               goodsDB.find().toArray((err,list)=>{
                   resObj.code = !err ? 200 : 500
                   resObj.err = err
                   resObj.list = !err ? list : []

                   res.json(resObj)
               })
            }
        },
    }
}