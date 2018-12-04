let getColl = require("../db/db")

module.exports = (classSymbol,cb) => {
    let classList = getColl("classList")
    classList.find({classSymbol}).toArray((err,[classObj])=>{
        cb(classObj)
    })
}

