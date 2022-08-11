function currentTime(){
    //let el = document.createTextNode(Date())^
    document.getElementById("clock").innerText = new Date()

    console.log("Test");
    
    let t = setTimeout(function(){currentTime(),100})
}
currentTime()