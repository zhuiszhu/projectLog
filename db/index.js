module.exports = name => {
    console.log(1)
    let getC = require("../db")
    return getC(name)
}