import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useEffect, useState } from 'react';
import { ChatProps } from '@/types';

interface MessageType {
    message: string;
    username: string;
    __createdTime__: number;
}

const MessageContainer = ({ socket }: Pick<ChatProps, 'socket'>) => {
    const [messagesReceived, setMessagesReceived] = useState<MessageType[]>([]);

    useEffect(() => {
        socket.on('receive_message', (data: MessageType) => {
            setMessagesReceived((state) => [...state, data]);
        });
        return () => {
            socket.off('receive_message');
        };
    }, [socket]);

    const formatDate = (time: number) => {
        return new Date(time).toLocaleString();
    };

    return (
        <ScrollArea className='h-[80%]'>
            <div className='space-y-8'>
                {messagesReceived.map((m) => (
                    <Card key={m.message} className='w-full'>
                        <CardHeader className='flex flex-row justify-between'>
                            {' '}
                            <CardTitle> {m.username} </CardTitle>{' '}
                            {formatDate(m.__createdTime__)}
                        </CardHeader>
                        <CardContent>{m.message}</CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

export default MessageContainer;
