module.exports = {
    username(name){
        let zz = /\w{4,16}/
        return zz.test(name)
    },
    password(pwd){
        let zz = /\w{6,16}/
        return zz.test(pwd)
    },
    name(name){
        let zz = /^[\u4E00-\u9FA5]{2,4}$/
        return zz.test(name)
    }
}