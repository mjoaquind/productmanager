const socket = io();

let user;

Swal.fire({
    title: "Identifícate",
    input:"text",
    text:"Ingresa tu nombre de usuario",
    inputValidator: (value) => {
        return !value && "Ingresa un nombre de usuario"
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    socket.emit("new-user", user)
})

const chatInput = document.getElementById("chat-input");
chatInput.addEventListener("keyup", (evt) => {
    if(evt.key === "Enter"){
        const inputMessage = chatInput.value
        if(inputMessage.trim().length > 0){
            socket.emit("chat-message", {user, message: inputMessage})
            chatInput.value = ""
        }
    }
})

const messagePanel = document.getElementById("messages-panel");
socket.on('messages', (data) => {
    let messages = "";
    data.forEach((m) => {
        messages += `<b>${m.user} dice:</b> ${m.message}<br/>`;
    });
    messagePanel.innerHTML = messages;
})

socket.on('new-user', (user) => {
    Toastify({
        text:`${user} ingresó al chat`,
        duration:5000,
        position:'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast()
})