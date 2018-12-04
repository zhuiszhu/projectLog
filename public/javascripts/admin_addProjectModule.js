$(()=>{
    let points = $(".points")
    let countFraction = $("#count-fraction")
    let addForm = $("#add-project-form")

    let addSubmit = $("#add-project-submit")
    

    let functions = $(".functions.add")
    let function_item = functions.find(".function-item")
    let addFunction = $("#add-function")
    functions.empty()
    
    let deductions = $(".deductions.add")
    let deduction_item = deductions.find(".deduction-item")
    let addDeduction = $("#add-deduction")
    deductions.empty()

    addFunction.click(()=>{
        let item = function_item.clone(false)
        functions.append(item)
    })
    addDeduction.click(()=>{
        let item = deduction_item.clone(false)
        deductions.append(item)
    })

    points.on("click",".btn-del",function(){
        let dom = $(this).closest(".point-item")
        dom.remove()
        updateCountFraction()
    })

    points.on("input",".form-fraction",function(){
        updateCountFraction()
    })

    addForm.submit(function(e){
        e.preventDefault()

        let functionsData = []
        functions.find(".function-item").each((i,item)=>{
            let obj = {
                name : $(item).find(".ddtname").val(),
                fraction : $(item).find(".ftn").val()*1,
            }

            functionsData.push(obj)
        })

        functionsData = JSON.stringify(functionsData)

        let deductionsData = []
        deductions.find(".deduction-item").each((i,item)=>{
            let obj = {
                name : $(item).find(".ddtname").val(),
                fraction : $(item).find(".ftn").val()*1,
            }

            deductionsData.push(obj)
        })

        deductionsData = JSON.stringify(deductionsData)

        let data = {
            projectname : this.projectname.value,
            fraction : this.fraction.value*1,
            functions : functionsData,
            deductions : deductionsData,
            active : this.active.checked
        }
        
        $.ajax({
            url : "/aAjax/addProjectModule",
            type : "post",
            data,
            success(info){
                alert(info.text)
            }
        })

    })

    addSubmit.click(()=>{
        addForm.submit()
    })

    /**
     * 更新总分
     */
    function updateCountFraction(){
        let fractions = points.find(".form-fraction")
        let count = 0;
        fractions.each((index,{value})=>{
            value *= 1
            count += value
        })
        countFraction.val(count)
    }

})