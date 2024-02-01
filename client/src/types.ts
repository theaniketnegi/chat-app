import { Socket } from "socket.io-client";

export interface ChatProps {
    socket: Socket;
	username: string;
	room: string;
}