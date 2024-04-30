const deleteUser = async (id) => {
    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE'
        });
        console.log(response);
        if(response.status === 200) {
            Toastify({
                text:`${response.status} ${response.statusText} Cart ${id} is empty`,
                position:'right',
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast()
            window.location.replace('/users');
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