const addProductToCart = async (cid, pid) => {
    fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'POST'
    }).then(result=>{
        if(result.status===200) {
            Toastify({
                text:`${result.status} ${result.statusText} Product ${pid} successfully added to cart ${cid}`,
                duration:5000,
                position:'right',
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast()
            window.location.replace(`/carts/${cid}`);
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
}