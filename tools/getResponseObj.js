module.exports =(err,data,textSuc="操作成功",textErr="服务器错误")=>({
    code : !err ? 200:500,
    text : !err ? textSuc : textErr,
    data,
    err
})