import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChatProps } from '@/types';

interface MessageType {
    content: string;
    username: string;
    createdAt: string;
    id: number;
}

const MessageContainer = ({ socket }: Pick<ChatProps, 'socket'>) => {
    const [messagesReceived, setMessagesReceived] = useState<MessageType[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (containerRef && containerRef.current) {
            const element = containerRef.current;
            if (element)
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
        }
    }, [containerRef, messagesReceived]);

    useEffect(() => {
        socket.on('receive_message', (data: MessageType) => {
            setMessagesReceived((state) => [...state, data]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket, containerRef]);

    useEffect(() => {
        socket.on('old_messages', (messages: MessageType[]) => {
            setMessagesReceived(messages);
        });
    }, [socket]);
    const formatDate = (time: string) => {
        return new Date(time).toLocaleString();
    };

    return (
        <ScrollArea className='h-[80%]'>
            <div className='space-y-8'>
                {messagesReceived.map((m) => (
                    <Card key={m.id} className='w-full'>
                        <CardHeader className='flex flex-row justify-between'>
                            {' '}
                            <CardTitle> {m.username} </CardTitle>{' '}
                            {formatDate(m.createdAt)}
                        </CardHeader>
                        <CardContent>{m.content}</CardContent>
                    </Card>
                ))}
                <div ref={containerRef} />
            </div>
        </ScrollArea>
    );
};

export default MessageContainer;
