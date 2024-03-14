document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');

    let username = 'Guest';

    socket.on('usernames', (usernamesArray) => {
        // Update the UI with the list of usernames
        console.log(usernamesArray);
    });

    // Display a welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message welcome';
    welcomeMessage.innerHTML = `Welcome, ${username}!`;
    messagesContainer.appendChild(welcomeMessage);

    // Set the username when prompted
    const newUsername = prompt("Please enter your name:");
    if (newUsername) {
        username = newUsername;
        socket.emit('setUsername', username);
    }

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const messageContent = messageInput.value.trim();
        if (messageContent !== '') {
            socket.emit('message', messageContent);
            messageInput.value = '';
        }
    });

    socket.on('message', (data) => {
        const { user, content } = data;
        const messageElement = document.createElement('div');
        messageElement.className = `message ${user === username ? 'sent' : 'received'}`;
        const messageContent = user === username ? `You: ${content}` : `${user}: ${content}`;
        messageElement.innerHTML = `<span>${messageContent}</span>`;

        // Append the new message at the end of the container
        messagesContainer.appendChild(messageElement);

        // Automatically scroll to the bottom when a new message is added
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
});
