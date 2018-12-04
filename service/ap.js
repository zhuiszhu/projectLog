const getColl = require("../db/db")
let {username:nv,password:pv,name:sv} = require("../tools/strVali")
const jm = require("../tools/enc")
const getClass = require("../tools/getClassName")

module.exports = {
    method: "get",
    api: {
        index : {
            route(req,res){
                res.render("admIndex")
            }
        },
        pm : {
            route(req,res){
                res.render("admProject")
            }
        },
        cm : {
            route(req,res){
                res.render("admClassManage/admClass")
            }
        }
    }
}