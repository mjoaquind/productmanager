const form = document.getElementById("resetPasswordForm");

form.addEventListener("submit", e =>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {}; 
    data.forEach((value,key)=>obj[key]=value);
    
    fetch("/api/session/resetPassword", {
        method: "POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(result=>{
        if(result.status === 200){
            Toastify({
                text:`${result.status} ${result.statusText} Contrasenya restablecida correctamente`,
                duration:5000,
                position:'right',
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast()
            window.location.replace('/login');
        }else{
            console.log("error");
            console.log(result);
        }
    })
})