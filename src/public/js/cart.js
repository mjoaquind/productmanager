const removeAll = async (id) => {
    try {
        const response = await fetch(`/api/carts/${id}`, {
            method: 'DELETE'
        });
        if(response.status === 200) {
            Toastify({
                text:`${response.status} ${response.statusText} Cart ${id} is empty`,
                position:'right',
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast()
            window.location.replace('/products');
        } else {
            Toastify({
                text:`${response.status} ${response.statusText}`,
                position:'right',
                style: {
                    background: "linear-gradient(to right, #d9534f, #dc3545)",
                }
            }).showToast()
        }
    } catch (error) {
        console.log(error);
    }
};

const purchase = async (id) => {
    try {
        const response = await fetch(`/api/carts/${id}/purchase`, {
            method: 'POST'
        });

        if (response.status === 200) {
            Toastify({
                text: `${response.status} ${response.statusText} Cart ${id} purchased successfully`,
                position: 'right',
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
            window.location.replace('/products');
        } else {
            Toastify({
                text: `${response.status} ${response.statusText}`,
                position: 'right',
                style: {
                    background: "linear-gradient(to right, #d9534f, #dc3545)",
                }
            }).showToast();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};