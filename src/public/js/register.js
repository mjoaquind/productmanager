const form = document.getElementById('registerForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch('/api/session/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result=>{
        if(result.status===200) {
            Toastify({
                text:`${result.status} ${result.statusText} Usuario registrado correctamente`,
                duration:5000,
                position:'right',
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast()
            window.location.replace('/login');
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