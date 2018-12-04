$(function(){
    let form = $("#goods_info")
    let addBannerBtn = $(".addBanner")
    let bannerBox = $(".banner-box")
    let bannerItem = bannerBox.find("input")

    let imgsBox = $(".imgs-box")
    let imgsItem = imgsBox.find("input")
    let addImgsBtn = $(".addImgs")

    addImgsBtn.click(()=>{
        let newItem = imgsItem.clone(false)
        newItem.val("")
        imgsBox.append(newItem)
    })

    addBannerBtn.click(()=>{
        let newItem = bannerItem.clone(false)
        newItem.val("")
        bannerBox.append(newItem)
    })

    form.submit(event=>{
        event.preventDefault()
        
        update()
    })

    function update(){
        let f = form[0]
        let jType = $(f.type)
        let type = {
            value : jType.val(),
            text : jType.find("option:selected").text()
        }

        let banner = []
        let imgs = []
        if(!f.banner.length){
            banner.push(f.banner.value)
        }else{
            for(let i = 0;i < f.banner.length; i++){
                banner.push(f.banner[i].value)
            }
        }

        if(!f.imgs.length){
            imgs.push(f.banner.value)
        }else{
            for(let i = 0;i < f.imgs.length; i++){
                imgs.push(f.imgs[i].value)
            }
        }
        
        let strData = {
            collName : "goods",
            name : f.name.value,
            price : f.price.value*1,
            discount : f.discount.value*1,
            stock : f.stock.value*1,
            img : f.img.value,
            detail : f.detail.value,
            type,
            banner,
            imgs
        }

        let data = {
            data : JSON.stringify(strData)
        }
        $.ajax({
            url:"/input",
            type : "post",
            data,
            success(info){
                console.log(info)
                if(info.code == 200){
                    alert("商品录入成功!再接再厉")
                    window.location.reload()

                }
            }
        })
    }

    
   
})
