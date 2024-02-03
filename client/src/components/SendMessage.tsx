import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatProps } from '@/types';
import {  useState } from 'react';


const SendMessage = ({ username, room, socket }: ChatProps) => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message.trim() !== '') {
            socket.emit('send_message', {
                username,
                room,
                message,
            });
            setMessage('');
        }
    };
    return (
        <div className='grid w-full gap-2 z-10'>
            <Textarea
                placeholder='Type your message here.'
                className='resize-none text-card-foreground'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button className='w-full' onClick={sendMessage}>
                Send
            </Button>
        </div>
    );
};

export default SendMessage;
