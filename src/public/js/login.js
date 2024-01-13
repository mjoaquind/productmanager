const form = document.getElementById('loginForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result=>{
        if(result.status===200) {
            console.log(result);
            window.location.replace('/products');
        } else {
            Toastify({
                text:`${result.status} ${result.statusText}`,
                duration:5000,
                position:'right',
                style: {
                    background: "linear-gradient(to right, #d9534f, #dc3545)",
                }
            }).showToast()
        }
    })
})