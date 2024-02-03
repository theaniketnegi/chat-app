import { ChatProps, UserType } from '@/types';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomInfo = ({ socket, username, room }: ChatProps) => {
    const [roomUsers, setRoomUsers] = useState<UserType[]>([]);

    useEffect(() => {
        socket.on('chatroom_users', (data: UserType[]) => {
            console.log(data);
            setRoomUsers(data);
        });
        return () => {
            socket.off('chatroom_users');
        };
    }, [socket]);
    const navigate = useNavigate();

    const leaveRoom = () => {
        socket.emit('leave_room', { username, room });
        navigate('/', { replace: true });
    };
    return (
        <div className='pb-16 w-[350px] space-y-24'>
            <h2 className='text-card-foreground scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight'>
                {room}
            </h2>
            <div>
                <h4 className='scroll-m-20 text-xl font-semibold tracking-tight text-card-foreground'>
                    Users
                </h4>
                <ScrollArea className='h-[200px]  mt-6'>
                    <div>
                        {roomUsers.map((r) => (
                            <p className='leading-7 text-card-foreground' key={r.id}>
                                {r.username}
                            </p>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <Button onClick={leaveRoom}>Leave room</Button>
        </div>
    );
};

export default RoomInfo;
