$(()=>{
    
    let addBtn = $(".addclass-btn")
    let editBtn = $(".editclass-btn")
    let classNameInput = $("#classname")
    let cityInput = $("#city")
    let activeInput = $("#isActive")
    let modal = $("#myModal")
    let editModal = $("#editModal")
    let classoption = $(".classoption")
    let classoptionItem = $("#classoption").find("option")
    let projectList = []
    

    let tabel = $(".class-list")
    let classList = tabel.find("tbody")
    let classItem = classList.find("tr")
    
    function render(list,cityList=[]){
        classList.empty()
        classoption.empty()
        console.log(projectList)
        cityList.map(city=>{
            let newItem = classoptionItem.clone(false)
            newItem.val(city)
            classoption.append(newItem)
        })

        list.map(({classname,active,classSymbol,_id,city,projectID})=>{
            let newItem = classItem.clone(false)
            let select = newItem.find(".currentProject").find("select")
            select.empty()
            if(active){
                newItem.addClass("warning")
            }
            newItem.attr("data-classid",_id)
            newItem.find(".classname").text(classname)
            newItem.find(".classSymbol").text(classSymbol)
            newItem.find(".isActive").text(active ? "已启用":"未启用")
            newItem.find(".city").text(city)
            select.append($(`<option value='none'>无</option>`))
            projectList.map(proObj=>{
                let item = $(`<option value='${proObj._id}'>${proObj.projectname}</option>`)
                select.append(item)
            })
            
            select.val(projectID || "none")
            classList.append(newItem)
        })
    }

    function getProjectList(cb){
        $.ajax({
            url : "/aAjax/getProjects",
            success(info){
                projectList = info.list
                cb()
            }
        })
    }

    
    function getNewClassList(){
        $.ajax({
            url :"/aAjax/getClass",
            type : "get",
            success(info){
                if(info.code == 200){
                    render(info.list,info.cityList)
                }else{
                    alert(info.text)
                }
            }
        })
    }
    
    getProjectList(getNewClassList)

    //添加班级
    addBtn.click(()=>{
        let data = {
            classname : classNameInput.val(),
            city : cityInput.val(),
            active : activeInput[0].checked
        }

        $.ajax({
            url :"/aAjax/addClass",
            type : "get",
            data,
            success(info){
                alert(info.text)
                if(info.code == 200){
                    modal.modal("hide")
                    getNewClassList()
                }
            }
        })
    })

    editBtn.click(()=>{
        let form = editModal.find("form")[0]
        let classid = $(form).attr("data-classid")

        let data = {
            classname : form.classname.value,
            city : form.city.value,
            classid
        }

        $.ajax({
            url : "/aAjax/setClass",
            type : "get",
            data,
            success(info){
                
                alert(info.text)
                editModal.modal("hide")
                if(info.code == 200){
                    getNewClassList()
                }
            }
        })
    })

    //切换当前班级
    classList.on("click",".active-btn",function(){
        let classid = $(this).closest("tr").attr("data-classid")
        
        $.ajax({
            url : "/aAjax/tabClass",
            type : "get",
            data : {classid},
            success(info){
                if(info.code == 200){
                    getNewClassList()
                }else{
                    alert(info.text)
                }
            }
        })
    })

    //编辑按钮
    classList.on("click",".edit-btn",function(){
        let tr = $(this).closest("tr")
        let classid = tr.attr("data-classid")
        
        let form = editModal.find("form")[0]

        form.classname.value = tr.find(".classname").text()
        form.city.value = tr.find(".city").text()
        $(form).attr("data-classid",classid)
        $(form).find(".classSymbol").text(tr.find(".classSymbol").text())

        editModal.modal("show")
    })

    //删除按钮
    classList.on("click",".remove-btn",function(){
        if(confirm("确定要删除该班级吗?")){
            let classid = $(this).closest("tr").attr("data-classid")
            
            $.ajax({
                url : "/aAjax/rmClass",
                type : "get",
                data : {classid},
                success(info){
                    if(info.code == 200){
                        alert(info.text)
                        getNewClassList()
                    }else{
                        alert(info.text)
                    }
                }
            })
        }
    })

    //切换指定班级的当前项目
    classList.on("change",".currentProject select",function(){
            let classid = $(this).closest("tr").attr("data-classid")
            let projectID = $(this).val()

            $.ajax({
                url : "/aAjax/setClass_project",
                type : "get",
                data : {classid,projectID},
                success(info){
                    getNewClassList()
                }
            })
    })
})