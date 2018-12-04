$(()=>{
    let logRoot = $("#lm")
    let studentList = logRoot.find(".student-list")
    let studentItem = studentList.find(".student-item")
    let students = []
    
    function pageInit(){
        studentList.empty()
        $.ajax({
            url : "/aAjax/getStudent",
            success(info){
                let {data:list} = info
                renderStudent(list)
                students = list
            }
        })
    }

    function renderStudent(list){
        studentList.empty()

        list.map(stu=>{
            let item = studentItem.clone(false)
            item.find("a.btn").text(stu.studentname)

            studentList.append(item)
        })
    }


    pageInit()

    studentList.on("click","a.btn",function(){
        let index = $(this).closest(".student-item").index()
        let currentStu = students[index]

        console.log(currentStu)
    })


})