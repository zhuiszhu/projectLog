var express = require('express');
var router = express.Router();
let getColl = require("../db/db")
let {api} = require("../config/api")

let taobao = require("../getData")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '走秀接口说明',api});
});

router.get('/input', function(req, res, next) {
  res.render('inputGoods');
});

router.get('/test', function(req, res, next) {
  res.render('apiTest');
});
router.post("/tt",(req,res)=>{
  console.log(typeof req.body)
})

router.post("/aa",(req,res)=>{
  // console.log(typeof req.body)
  taobao(res)
})
module.exports = router;
