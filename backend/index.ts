import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { ReceivedMessage, UserType, UserWithoutIdType } from './types';
const app = express();
app.use(cors());

const server = http.createServer(app);
let chatRoom = '';
let allUsers: UserType[] = [];

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket: Socket) => {
    console.log(`Client ${socket.id} connected`);
    socket.on('join_room', (data: UserWithoutIdType) => {
        const { username, room } = data;
        socket.join(room);
        let __createdTime__ = Date.now();
        socket.to(room).emit('receive_message', {
            message: `${username} joined ${room}`,
            username: 'CHATBOT',
            __createdTime__,
        });

        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: 'CHATBOT',
            __createdTime__,
        });

        socket.on('send_message', (data: ReceivedMessage) => {
            const { __createdTime__, room, message, username } = data;
            io.in(room).emit('receive_message', data);
        });
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        const chatRoomUsers = allUsers.filter((u) => u.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
    });
});

app.get('/', (_req, res) => {
    res.send(`Hello world`);
});

server.listen(4000, () => `Server started at 4000`);
