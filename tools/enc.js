const crypto = require("crypto")

module.exports = name => {
    let md5 = crypto.createHash("md5")

    md5.update(name)

    return md5.digest("hex")
}