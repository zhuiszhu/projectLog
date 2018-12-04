var express = require('express');
var router = express.Router();
let {service} = require("../config")
let isLogin = require("../tools/isLogin")

const fs = require("fs");

let path = fs.readdirSync(`./${service}`)

router.get("/",(req,res)=>{
  res.redirect("/user/login")
})

path.map(url=>{
  url = url.replace(".js","")
  let ser = require(`../service/${url}`)
  
  let {method:met="get",api} = ser
  
  for(let key in api){
    let {method:mtd=met,route} = api[key]
    
    router[mtd](`/${url}/${key}`,isLogin,(req,res)=>{
      
      route(req,res)
    })
  }
})


module.exports = router;
