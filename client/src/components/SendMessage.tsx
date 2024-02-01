import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatProps } from '@/types';
import {  useState } from 'react';


const SendMessage = ({ username, room, socket }: ChatProps) => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message.trim() !== '') {
            const __createdTime__ = Date.now();
            socket.emit('send_message', {
                username,
                room,
                message,
                __createdTime__,
            });
            setMessage('');
        }
    };
    return (
        <div className='grid w-full gap-2'>
            <Textarea
                placeholder='Type your message here.'
                className='resize-none text-white'
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
