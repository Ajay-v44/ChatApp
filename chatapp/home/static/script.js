function scrollToBottom() {
    // Scroll to the bottom of the chat container
    var chatContainer = document.getElementById("chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

const websocketProtocol = window.location.protocol === "https:" ? "wss" : "ws";
const wsEndpoint = `${websocketProtocol}://${window.location.host}/ws/notification/{{room_name}}/`;
const socket = new WebSocket(wsEndpoint);

document.getElementById('message-form').addEventListener('submit', function(event) {
    // Handle form submission
    event.preventDefault();
    const messageInput = document.getElementById('msg');
    const message = messageInput.value.trim();

    if (message !== "") {
        // Send the message to the server
        socket.send(
            JSON.stringify({
                'message': message,
                'room_name': '{{room_name}}',
                'sender': '{{user}}',
            })
        );
        messageInput.value = ''; // Clear the input field
    }
});

// response from consumer on server
socket.addEventListener("message", (event) => {
const messageData = JSON.parse(event.data);
console.log(messageData);

var sender = messageData.message.sender;
var message = messageData.message.message;

// Append the message to the chatbox in real-time
var messageDiv = document.querySelector('.message');
if (sender !== '{{user}}') {
    var receiveDiv = document.createElement('div');
    receiveDiv.classList.add('receive');
    receiveDiv.innerHTML = '<p style="color: #000;">' + message + '<strong>-' + sender + '</strong></p>';
    messageDiv.appendChild(receiveDiv);
} else {
    var sendDiv = document.createElement('div');
    sendDiv.classList.add('send');
    sendDiv.innerHTML = '<p style="color: #000;">' + message + '</p>';
    messageDiv.appendChild(sendDiv);
}
scrollToBottom();
});



// WebSocket connection opened
socket.onopen = (event) => {
    console.log("WebSocket connection opened!");
};

// WebSocket connection closed
socket.onclose = (event) => {
    console.log("WebSocket connection closed!");
};