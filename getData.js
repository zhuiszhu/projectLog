let https = require("https")
let fs = require('fs')

let ws = fs.createWriteStream("./abc.txt")


    https.get("https://detail.tmall.com/item.htm?id=43986072195&ns=1&abbucket=20&on_comment=1",res=>{
        let html = ""
    
        // res.on("data",chunk=>{
        //     html += chunk
        // })
    
        // res.on("end",()=>{
        //     html = html.replace("jsonp267(","")
        //     html = html.slice(0,html.length-1)
        //     console.log(html)
        //     resObj.json(JSON.parse(html))
        // })
        
        res.pipe(ws)
    })
