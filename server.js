const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let usernames = {};  // Store usernames

app.use(express.static('public'));
io.on('connection', (socket) => {
    let username = 'Guest';

    // Send the stored usernames to the connected client
    socket.emit('usernames', Object.values(usernames));

    socket.on('setUsername', (newUsername) => {
        usernames[socket.id] = newUsername;
        io.emit('usernames', Object.values(usernames));
    });

    socket.on('message', (message) => {
        io.emit('message', { user: usernames[socket.id], content: message });
    });

    socket.on('disconnect', () => {
        delete usernames[socket.id];
        io.emit('usernames', Object.values(usernames));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
