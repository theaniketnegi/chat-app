import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { ReceivedMessage, UserType, UserWithoutIdType } from './types';
import { dbConnect } from './dbConfig';
import Message from './messageModel';

const app = express();
app.use(cors());

const server = http.createServer(app);

dbConnect();

let allUsers: UserType[] = [];

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket: Socket) => {
    console.log(`Client ${socket.id} connected`);
    socket.on('join_room', async (data: UserWithoutIdType) => {
        const { username, room } = data;
        socket.join(room);

        const messages = await Message.findAll({ limit: 50, where: { room } });
        const oldMessages = messages.map((m) => m.toJSON());
        socket.emit('old_messages', oldMessages);

        const welcomeMessage = await Message.create({
            username: 'BOT',
            room,
            content: `${username} joined ${room}. Welcome ${username}.`,
        });
        socket.to(room).emit('receive_message', welcomeMessage.toJSON());
        socket.emit('receive_message', welcomeMessage.toJSON());
        socket.on('send_message', async (data: ReceivedMessage) => {
            const { room, message, username } = data;
            const storedMessage = await Message.create({
                username,
                room,
                content: message,
            });
            io.in(room).emit('receive_message', storedMessage.toJSON());

            console.log(storedMessage.toJSON());
        });
        allUsers.push({ id: socket.id, username, room });
        const chatRoomUsers = allUsers.filter((u) => u.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
    });
});

app.get('/', (_req, res) => {
    res.send(`Hello world`);
});

server.listen(4000, () => {
    console.log(`Server started at 4000`);
});
