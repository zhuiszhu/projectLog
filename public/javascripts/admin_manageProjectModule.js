$(()=>{
    let projects = $(".project-list")
    let project_item = projects.find(".project-item") 
    projects.empty()

    let projectBox = $(".project-detail")
    let projectTitle = projectBox.find(".log-header")
    let projectTitleBtn = projectTitle.find(".btn-edit")

    let projectFunctions = projectBox.find(".functions")
    let functionItem = projectFunctions.find(".function-item")
    projectFunctions.empty()
    let projectDeductions = projectBox.find(".deductions")
    let deductionItem = projectDeductions.find(".deduction-item")
    projectDeductions.empty()
    
    let addFunctionItemBtn = projectBox.find(".add-function")
    let addDudectionItemBtn = projectBox.find(".add-deduction")

    let projectSubmit = projectBox.find(".btn-update-submit")
    let projectCancel = projectBox.find(".btn-update-cancel")
    let projectDel = projectBox.find(".btn-update-del")

    let noProject = $(".none-project")
    let logDetail = $("#pm .log-detail")
    let contentBody = $("#pm .content-body")

    let projectList = []

    /**
     * 记录和处理当前项目是否处于编辑状态
     */
    let projectData = {
        _isUpdate : false,
        _editTitle : false,
        _editFunctions : false,
        _editDeductions : false,
        get editTitle(){
            return this._editTitle
        },
        set editTitle(value){
            this._editTitle = value
            this.detection(value)
        },
        get editFunctions(){
            return this._editFunctions
        },
        set editFunctions(value){
            this._editFunctions = value
            this.detection(value)
        },
        get editDeductions(){
            return this._editDeductions
        },
        set editDeductions(value){
            this._editDeductions = value
            this.detection(value)
        },
        get isUpdate(){
            return this._isUpdate
        },
        set isUpdate(value){
            this._isUpdate = value
            if(value){
                projectBox.addClass("edit")
            }else{
                projectBox.removeClass("edit")
            }
        },
        detection(value){
            if(value){
                this.isUpdate = true
            }else{
                this.isUpdate = !this._editTitle && !this._editFunctions && !this._editDeductions ? false : true
            }
        },
        cancel(){
            this.editTitle = false
            this.editFunctions = false
            this.editDeductions = false
        }
    }

    /**
     * 渲染项目列表
     * @param {array} list 项目列表数组
     */
    function renderProjects(list){
        list.map(item=>{
            let newItem = project_item.clone(false)

            newItem.find(".project-name-btn").find(".name").text(item.projectname)
            newItem.attr("data-projectid",item._id)
            if(item.active){
                newItem.addClass("active")
                renderProjectLog(item)
            }
            projects.append(newItem)
        })
        if(list.length == 0){
            noProject.removeClass("hidden")
            logDetail.addClass("hidden")
            contentBody.addClass("hidden")
        }else{
            logDetail.removeClass("hidden")
            contentBody.removeClass("hidden")
            noProject.addClass("hidden")
        }
    }

    //项目名编辑和取消编辑按钮
    projectTitleBtn.click(function(){
        let isEdit = projectTitle.hasClass("edit")
        if(isEdit){
            projectTitle.removeClass("edit")
            $(this).text("编辑")
            projectData.editTitle = false
        }else{
            projectTitle.addClass("edit")
            $(this).text("取消")
            projectData.editTitle = true
        }
    })

    /**
     * 渲染项目详细信息(编辑面板)
     * @param {object} param0 项目对象
     */
    function renderProjectLog({_id,projectname,fraction,functions,deductions}){
        projectBox.attr("data-projectID",_id)
        projectTitle.find(".title-text").text(projectname)
        projectTitle.find(".title-input .form-control").val(projectname)
        projectTitle.find(".fraction span").text(fraction)

        projectFunctions.empty()
        projectDeductions.empty()

        functions.map(({name,fraction:frac})=>{
            let item = functionItem.clone(false)
            let nameD = item.find(".point-name")
            nameD.find(".form-control").val(name)
            nameD.find(".form-text").text(name)
            let fracD = item.find(".point-fraction")
            fracD.find(".form-control").val(frac)
            fracD.find(".form-text span").text(frac)
            projectFunctions.append(item)
        })
        
        deductions.map(({name,fraction:frac})=>{
            let item = deductionItem.clone(false)
            let nameD = item.find(".point-name")
            nameD.find(".form-control").val(name)
            nameD.find(".form-text").text(name)
            let fracD = item.find(".point-fraction")
            fracD.find(".form-control").val(frac)
            fracD.find(".form-text span").text(frac)
            projectDeductions.append(item)
        })
    }

    /**
     * 更新功能点或者评分点编辑状态
     * @param {string} dname "f"代表功能点  "d"代表编辑点
     */
    function isEdit(dname){
        switch(dname){
            case "f":
                let lgn = projectFunctions.find(".function-item.edit").length
                projectData.editFunctions = lgn != 0
                break
            case "d":
                let lg = projectDeductions.find(".deduction-item.edit").length
                projectData.editDeductions = lg != 0
                break
        }
    }

    /**
     * 开始请求项目列表数据
     */
    function initPage(){
        $.ajax({
            url : "/aAjax/getProjects",
            success(info){
                renderProjects(info.list)
                projectList = info.list
            }
    
        })
    }

    initPage()

    /**
     * 从编辑面板中获取项目模板所有信息 用于修改数据
     */
    function getProjectData(){
        let projectID = projectBox.attr("data-projectID")
        let headerDom = projectBox.find(".log-header")
        let fraction = 0
        let functions = []
        let deductions = []
        let projectname = projectData.editTitle ? headerDom.find("input").val()  : headerDom.find(".title-text").text() 



        projectBox.find(".functions .function-item").each((i,dom)=>{
            dom=$(dom)
            let function_item = {}
            if(!dom.hasClass("hidden")){

                if(dom.hasClass("edit")){
                    function_item.fraction = dom.find(".point-fraction input").val()*1
                    function_item.name = dom.find(".point-name input").val()
                }else{
                    function_item.fraction = dom.find(".point-fraction .form-text span").text()*1
                    function_item.name = dom.find(".point-name .form-text").text()
                }

                fraction += function_item.fraction
                functions.push(function_item)
            }
        })

        projectBox.find(".deductions .deduction-item").each((i,dom)=>{
            dom=$(dom)
            let deduction_item = {}
            if(!dom.hasClass("hidden")){

                if(dom.hasClass("edit")){
                    deduction_item.fraction = dom.find(".point-fraction input").val()*1
                    deduction_item.name = dom.find(".point-name input").val()
                }else{
                    deduction_item.fraction = dom.find(".point-fraction .form-text span").text()*1
                    deduction_item.name = dom.find(".point-name .form-text").text()
                }

                fraction += deduction_item.fraction
                deductions.push(deduction_item)
            }
        })

        let data = {projectname,projectID,fraction,functions,deductions}

        return data
    }


    //切换当前选中项目按钮
    projects.on("click",".tab-project-btn",function(){
        let thisItem = $(this).closest(".project-item")
        let projectID = thisItem.attr("data-projectid")
        let data = {projectID}

        $.ajax({
            url : "/aAjax/tabProject",
            data ,
            type : "get",
            success(info){
                if(info.code == 200){
                    projects.find(".active").removeClass("active")
                    thisItem.addClass("active")
                }else{
                    alert("服务器错误,切换失败!")
                }
            }
        })
    })

    projects.on("click",".project-name-btn",function(){
        let thisItem = $(this).closest(".project-item")
        let index = thisItem.index()
        console.log(index)
        renderProjectLog(projectList[index])
    })

    

    //功能点编辑按钮
    projectFunctions.on("click",".btn-edit",function(){
        $(this).closest(".function-item").addClass("edit")
        projectData.editFunctions = true
    })

    //功能点取消编辑按钮
    projectFunctions.on("click",".btn-cancel",function(){
        $(this).closest(".function-item").removeClass("edit")
        $(this).closest(".function-item").removeClass("hidden")
        isEdit("f")
    })

    //删除功能点按钮
    projectFunctions.on("click",".btn-remove",function(){
        $(this).closest(".function-item").addClass("edit")
        $(this).closest(".function-item").addClass("hidden")
        isEdit("f")
    })

    //评分点编辑按钮
    projectDeductions.on("click",".btn-edit",function(){
        $(this).closest(".deduction-item").addClass("edit")
        projectData.editDeductions = true
    })

    //取消编辑评分点按钮
    projectDeductions.on("click",".btn-cancel",function(){
        $(this).closest(".deduction-item").removeClass("edit")
        $(this).closest(".deduction-item").removeClass("hidden")
        isEdit("d")
    })

    //删除评分点按钮
    projectDeductions.on("click",".btn-remove",function(){
        $(this).closest(".deduction-item").addClass("edit")
        $(this).closest(".deduction-item").addClass("hidden")
        isEdit("d")
    })

    //取消编辑按钮
    projectCancel.click(()=>{
        projectBox.removeClass("edit")
        projectBox.find(".newItem").remove()
        projectBox.find(".edit").removeClass("edit")
        projectBox.find(".hidden").removeClass("hidden")
        projectData.cancel()
    })

    //添加功能点按钮
    addFunctionItemBtn.click(()=>{
        let item = functionItem.clone(false)
        item.addClass("edit")
        item.addClass("newItem")
        let cancelBtn = item.find(".btn-cancel")
        item.find(".btn-group").empty().append(cancelBtn)
        cancelBtn.removeClass("btn-cancel")
        projectData.editFunctions = true
        cancelBtn.click(function(){
            $(this).closest(".function-item").remove()
            isEdit("f")
        })

        projectFunctions.append(item)
    })

    //添加评分点按钮
    addDudectionItemBtn.click(()=>{
        let item = deductionItem.clone(false)
        item.addClass("edit")
        item.addClass("newItem")
        let cancelBtn = item.find(".btn-cancel")
        item.find(".btn-group").empty().append(cancelBtn)
        cancelBtn.removeClass("btn-cancel")
        projectData.editDeductions = true
        cancelBtn.click(function(){
            $(this).closest(".deduction-item").remove()
            isEdit("d")
        })

        projectDeductions.append(item)
    })

    //删除项目按钮
    projectDel.click(()=>{
        if(confirm("你确定要删除该项目模板吗?")){
            let projectID = projectBox.attr("data-projectID")
            $.ajax({
                url:  "/aAjax/rmProject",
                data : {projectID},
                type : "post",
                success(info){
                    alert(info.text)
                    initPage()
                }
            })
        }
    })

    projectSubmit.click(()=>{
        let info = getProjectData()
        let data = {data:JSON.stringify(info)}

        $.ajax({
            url:"/aAjax/setProject",
            type : "post",
            data,
            success(info){
                if(info.code == 200){
                    window.location.reload()
                }
            }
        })
    })

    projectBox.on("input",".point-fraction input",updateFraction)
    projectBox.on("click",".btn-cancel, .btn-update-cancel",updateFraction)
    
    function updateFraction(){
        let {fraction} = getProjectData()
        projectBox.find(".log-header .fraction span").text(fraction)
    }
})