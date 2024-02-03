import MessageContainer from '@/components/Messages';
import RoomInfo from '@/components/RoomInfo';
import SendMessage from '@/components/SendMessage';
import { ChatProps } from '@/types';

const Chat = ({ socket, username, room }: ChatProps) => {
    return (
        <div className='p-8 space-x-20 flex h-screen divide-x'>
            <RoomInfo socket={socket} username={username} room={room} />
            <div className='h-full w-full space-y-8 pl-8'>
                <MessageContainer socket={socket} />
                <SendMessage socket={socket} username={username} room={room} />
            </div>
        </div>
    );
};

export default Chat;
