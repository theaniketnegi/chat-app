import MessageContainer from '@/components/Messages';
import SendMessage from '@/components/SendMessage';
import { ChatProps } from '@/types';

const Chat = ({ socket, username, room }: ChatProps) => {
    return (
        <div className='p-8 flex flex-col justify-between h-screen max-w-[80%] mx-auto'>
            <MessageContainer socket={socket} />
            <SendMessage socket={socket} username={username} room={room}/>
        </div>
    );
};

export default Chat;
