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
    Swal.fire({
        title: `${user} se unió al chat!`,
        toast: true,
        position: "top-end"
    })
})