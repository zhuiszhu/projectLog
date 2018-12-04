$(function(){
    let isCorrect = true

    $("#username").change(function(){
        testUsername($(this))
    })
    $("#password").change(function(){
        testPassword($(this))
    })
    $("#password2").change(function(){
        testPassword2($(this),$("#password"))
    })
    $("#studentname").change(function(){
        testName($(this))
    })

    $("form").submit(function(e){
        e.preventDefault()
        let type = $(this).attr("data-type")

        let data = {
            username : this.username.value,
            password : this.password.value
        }
        let url = "/user/lgn"

        isCorrect = true
        isLgn = type == "lgn"

        testUsername($(this.username))
        testPassword($(this.password))
        
        if(!isLgn){
            data.studentname = this.studentname.value
            data.classSymbol = this.classSymbol.value
            testPassword2($(this.password2),$(this.password))
            testName($(this.studentname))
            url = "/user/reg"
        }
        
        if(isCorrect){
            $.ajax({
                url,
                type : "post",
                data,
                success(info){
                    console.log(info)
                    if(info.code == 200){
                        if(isLgn){
                            location.href="/sp/index"
                        }else{
                            if(confirm("注册成功,是否跳转到登录页?")){
                                location.href= "/user/login"
                            }
                        }
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

    function testPassword2(password2,password){
        let isSame = password2.val() == password.val()
        let fg = password2.closest(".form-group")
        let hb = fg.find(".help-block")
        if(!isSame){
            fg.addClass("has-error")
            hb.removeClass("hidden")
            hb.text("两次密码不一致")
            isCorrect = false
        }else{
            fg.removeClass("has-error")
            fg.addClass("has-success")
            hb.addClass("hidden")
        }
    }

    function testName(name){
        let zz = /^[\u4E00-\u9FA5]{2,4}$/
        let isCor = zz.test(name.val())
        let fg = name.closest(".form-group")
        let hb = fg.find(".help-block")
        if(!isCor){
            fg.addClass("has-error")
            hb.removeClass("hidden")
            hb.text("不要调皮,输入真实姓名!")
            isCorrect = false
        }else{
            fg.removeClass("has-error")
            fg.addClass("has-success")
            hb.addClass("hidden")
        }
    }

})