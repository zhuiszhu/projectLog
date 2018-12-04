$(()=>{
    let path = location.pathname
    $(".navbar-nav").find(`a[href='${path}']`).closest("li").addClass("active")
})