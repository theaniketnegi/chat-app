import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';
import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { useToast } from '@/components/ui/use-toast';

interface HomeProps {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    room: string;
    setRoom: React.Dispatch<React.SetStateAction<string>>;
    socket: Socket;
}

const CardWithForm = ({
    username,
    setUsername,
    room,
    setRoom,
    socket,
}: HomeProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const joinRoom = () => {
        if (username.trim() !== '' && room.trim() !== '') {
            socket.emit('join_room', { username, room });
            navigate('/chat', { replace: true });
        } else {
            toast({
                title: 'Fields cannot be empty',
                description: 'Username or room is empty',
            });
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <Toaster />
            <Card className='w-[350px]'>
                <CardHeader className='text-center'>
                    <CardTitle>Chatroom</CardTitle>
                    <CardDescription>Join a room</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className='grid w-full items-center gap-4'>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='name'>Username</Label>
                                <Input
                                    id='username'
                                    placeholder='Enter username'
                                    value={username}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='framework'>Room</Label>
                                <Select onValueChange={setRoom} value={room}>
                                    <SelectTrigger id='framework'>
                                        <SelectValue placeholder='Select' />
                                    </SelectTrigger>
                                    <SelectContent position='popper'>
                                        <SelectItem value='Typescript'>
                                            Typescript
                                        </SelectItem>
                                        <SelectItem value='React'>
                                            React
                                        </SelectItem>
                                        <SelectItem value='Node'>
                                            Node
                                        </SelectItem>
                                        <SelectItem value='Other'>
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className='flex justify-center'>
                    <Button className='w-full' onClick={joinRoom}>
                        Join room
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CardWithForm;
