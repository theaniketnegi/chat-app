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
        if (username.trim() === '' || room.trim() === '') {
            return;
        }
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
        const chatRoomUsers: UserType[] = allUsers.filter(
            (u) => u.room === room,
        );
        console.log(chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
        socket.to(room).emit('chatroom_users', chatRoomUsers);

        socket.on('leave_room', async (data: Omit<UserType, 'id'>) => {
            const { username, room } = data;
            socket.leave(room);
            allUsers = allUsers.filter((u) => u.id !== socket.id);
            const newChatUsers: UserType[] = allUsers.filter(
                (u) => u.room === room,
            );
            const leaveMessage = await Message.create({
                username: 'BOT',
                room,
                content: `${username} left ${room}`,
            });
            socket.to(room).emit('chatroom_users', newChatUsers);
            socket.to(room).emit('receive_message', leaveMessage.toJSON());
            console.log(`${username} left the chat`);
        });

        socket.on('disconnect', async () => {
            console.log('User disconnected from the chat');
            const user = allUsers.find((user) => user.id == socket.id);
            if (user?.username) {
                allUsers = allUsers.filter((u) => u.id !== socket.id);
                const newChatUsers: UserType[] = allUsers.filter(
                    (u) => u.room === room,
                );
                const leaveMessage = await Message.create({
                    username: 'BOT',
                    room,
                    content: `${username} left ${room}`,
                });
                socket.to(room).emit('chatroom_users', newChatUsers);
                socket.to(room).emit('receive_message', leaveMessage.toJSON());
            }
        });
    });
});

app.get('/', (_req, res) => {
    res.send(`Hello world`);
});

server.listen(4000, () => {
    console.log(`Server started at 4000`);
});
