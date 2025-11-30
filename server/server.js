const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.use(cors({
    origin: ["http://192.168.1.72:5173", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Socket.io CORS config
const io = new Server(server, {
    cors: {
        origin: ["http://192.168.1.72:5173", "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

// Track which users are in which chat rooms
const userChatRooms = new Map(); // userId -> roomId

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    let currentUserId = null;

    // Join user-specific room for notifications
    socket.on('setup', (userData) => {
        currentUserId = userData._id;
        socket.join(userData._id);
        socket.emit('connected');
        console.log(`User ${userData._id} connected to own room`);
    });

    socket.on('join_chat', (room) => {
        socket.join(room);
        if (currentUserId) {
            userChatRooms.set(currentUserId, room);
        }
        console.log(`User ${currentUserId} joined room: ${room}`);
    });

    socket.on('leave_chat', (room) => {
        socket.leave(room);
        if (currentUserId) {
            userChatRooms.delete(currentUserId);
        }
        console.log(`User ${currentUserId} left room: ${room}`);
    });

    socket.on('send_message', (newMessageReceived) => {
        const { receiver, conversationId, room } = newMessageReceived;

        // Emit to the specific chat room
        socket.to(room).emit('receive_message', newMessageReceived);

        // Check if receiver is currently in this chat room
        const receiverInRoom = userChatRooms.get(receiver) === room;

        // Only send notification if receiver is NOT in the chat room
        if (!receiverInRoom) {
            socket.to(receiver).emit('message_notification', {
                type: 'new_message',
                message: newMessageReceived,
                conversationId
            });
        }
    });

    socket.on('mark_seen', (data) => {
        const { senderId, receiverId, conversationId } = data;
        // Notify the sender that their messages were read
        socket.to(senderId).emit('message_seen', {
            conversationId,
            readerId: receiverId,
            readAt: new Date()
        });
    });

    socket.on('disconnect', () => {
        if (currentUserId) {
            userChatRooms.delete(currentUserId);
        }
        console.log('User disconnected', socket.id);
    });
});

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const startupRoutes = require('./routes/startupRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Network: http://192.168.1.72:${PORT}`);
});
