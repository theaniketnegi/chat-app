import { Socket } from "socket.io-client";

export interface ChatProps {
    socket: Socket;
	username: string;
	room: string;
}

export interface UserType {
    username: string;
    room: string;
    id: string;
}