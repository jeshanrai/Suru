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
    // 💡 FIX HERE: Added "PUT", "PATCH", and "DELETE"
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 👉 Correct Socket.io CORS config
const io = new Server(server, {
    cors: {
        origin: ["http://192.168.1.72:5173", "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_chat', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('leave_chat', (data) => {
        socket.leave(data);
        console.log(`User with ID: ${socket.id} left room: ${data}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
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

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
