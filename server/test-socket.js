const io = require('socket.io-client');

const socket1 = io('http://localhost:5000');
const socket2 = io('http://localhost:5000');

const user1Id = 'user1';
const user2Id = 'user2';
const room = [user1Id, user2Id].sort().join('-');

console.log('Testing Socket.io connection...');

socket1.on('connect', () => {
    console.log('Socket 1 connected:', socket1.id);
    socket1.emit('join_chat', room);
});

socket2.on('connect', () => {
    console.log('Socket 2 connected:', socket2.id);
    socket2.emit('join_chat', room);

    // Send message from 2 to 1
    setTimeout(() => {
        console.log('Socket 2 sending message...');
        socket2.emit('send_message', {
            room: room,
            sender: user2Id,
            receiver: user1Id,
            content: 'Hello from Socket 2'
        });
    }, 1000);
});

socket1.on('receive_message', (data) => {
    console.log('Socket 1 received message:', data);
    if (data.content === 'Hello from Socket 2') {
        console.log('SUCCESS: Message received correctly.');
        process.exit(0);
    }
});

setTimeout(() => {
    console.log('Timeout waiting for message.');
    process.exit(1);
}, 5000);
