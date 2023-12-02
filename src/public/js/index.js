// Iniciar el socket.io

const socket = io();

socket.emit('message', 'Hello from Front');

socket.on('evento_para_mi', (data) => {
    console.log(data);
})

socket.on('evento_no_para_mi', (data) => {
    console.log(data);
})

socket.on('evento_para_todos', (data) => {
    console.log(data);
})
