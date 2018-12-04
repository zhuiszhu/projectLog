$(function(){
    let isCorrect = true
    let isLgn = $("#adminUser").attr("data-type") == "lgn"
    console.log(isLgn)

    $("#username").change(function(){
        testUsername($(this))
    })
    $("#password").change(function(){
        testPassword($(this))
    })
    

    $("form").submit(function(e){
        e.preventDefault()

        let data = {
            username : this.username.value,
            password : this.password.value
        }
        let url = isLgn ? "/admin/lgn" : "/admin/reg"

        if(!isLgn){
            data.key = this.key.value
        }

        isCorrect = true
        

        testUsername($(this.username))
        testPassword($(this.password))
        

        if(isCorrect){
            $.ajax({
                url,
                type : "post",
                data,
                success(info){
                    console.log(info)

                    if( isLgn && info.code == 200){//登录成功
                        location.href="/ap/index"
                    }else if(info.code == 200){//注册成功
                        // console.log(info)
                    }else{
                        alert(info.text)
                    }
                }
            })
        }


    })

    function testUsername(username){
        let zz = /\w{4,16}/
        let isCor = zz.test(username.val())
        let fg = username.closest(".form-group")
        let hb = fg.find(".help-block")
        if(!isCor){
            fg.addClass("has-error")
            hb.removeClass("hidden")
            hb.text("请输入4-16位由数字字母下划线组成的用户名")
            isCorrect = false
        }else{
            fg.removeClass("has-error")
            fg.addClass("has-success")
            hb.addClass("hidden")
        }
    }

    function testPassword(password){
        let zz = /\w{6,16}/
        let isCor = zz.test(password.val())
        let fg = password.closest(".form-group")
        let hb = fg.find(".help-block")
        if(!isCor){
            fg.addClass("has-error")
            hb.removeClass("hidden")
            hb.text("请输入6-16位由数字字母下划线组成的密码")
            isCorrect = false
        }else{
            fg.removeClass("has-error")
            fg.addClass("has-success")
            hb.addClass("hidden")
        }
    }
    
})