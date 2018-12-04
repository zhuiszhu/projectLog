$(()=>{
    
    
    let headerDom = $("#nav.navbar")
    let exitBtn = $("#exit")
    let pageContent = $(".main .content")
    let myModal = $("#myModal")
    let inputBox = myModal.find(".input-box")
    let inputItem = inputBox.find(".input-item")
    let addInputItem = myModal.find(".addItem-btn")
    let functionList = $(".functions")
    let functionItem = functionList.find(".function-item")
    let projectName = $(".project-name")

    /**
     * 页面数据初始化
     */
    function pageInit(){
        // 获取项目信息
        $.ajax({
            url : "/sAjax/getProjectInfo",
            type : "get",
            success(info){
                
                if(info.code == 404){
                    pageContent.addClass("hidden")
                    $(".page-message").removeClass("hidden")
                }else{
                    pageContent.removeClass("hidden")
                    $(".page-message").addClass("hidden")
                    renderProjectinfo(info.data)

                    let myScroll = new IScroll("#myScroll",{mouseWheel: true,})
                }
            }
        })

        //获取日志列表
        $.ajax({
            url : "/sAjax/getLogs",
            success(info){
                // console.log(info)
            }
        })
    }

    /**
     * 获取用户信息
     */
    function getUser(){
        $.ajax({
            url : "/sAjax/getUser",
            success(info){
                renderUser(info.data)
            }
        })
    }

    /**
     * 渲染页面用户相关信息
     * @param {object} user 
     */
    function renderUser(user){
        headerDom.find(".classname").text(user.classname)
        headerDom.find(".username").text(user.username)
    }

    
    function renderProjectinfo({functions:list,projectname:pn,_id}){
        functionList.empty()
        functionList.attr("data-projectinfo-ID",_id)
        projectName.text(pn)
        list.map(({name,status})=>{
            let item = functionItem.eq(0).clone(false)

            item.find(".fun-name").text(name)
            let classname = status !== "undone" ? status : ""
            item.addClass(classname)

            functionList.append(item)
        })
    }

    
    pageInit()
    getUser()

    //退出登录
    exitBtn.click(()=>{
        if(confirm("确定要退出登录吗?")){
            $.ajax({
                url : "/sAjax/exit",
                success(info){
                    if(info.code == 200){
                        window.location.reload()
                    }
                }
            })
        }
    })

    //添加日志输入框按钮
    addInputItem.click(()=>{
        let newItem = inputItem.eq(0).clone(false)
        newItem.find("input").val("")
        let i = inputBox.find(".input-item").length + 1
        newItem.find(".control-label span").text(i)
        inputBox.append(newItem)
    })

    inputBox.on("click",".del-btn",function(){
        $(this).closest(".input-item").remove()
    })

    functionList.on("click",".dropdown-menu a",function(){
        let index = $(this).closest(".function-item").index()
        let state = $(this).attr("data-value")
        let projectinfoid = functionList.attr("data-projectinfo-id")
        let data = {index,state,projectinfoid}

        $.ajax({
            url :"/sAjax/setProjectinfoFun",
            data,
            success(info){
                console.log(info)
            }
        })
    })
})