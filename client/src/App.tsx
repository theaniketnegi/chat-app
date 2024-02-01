import CardWithForm from './screens/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './screens/Chat';

const socket = io('http://localhost:4000');

const App = () => {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    return (
        <Router>
            <div className='bg-background dark'>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <CardWithForm
                                username={username}
                                setUsername={setUsername}
                                room={room}
                                setRoom={setRoom}
                                socket={socket}
                            />
                        }
                    />
                    <Route
                        path='/chat'
                        element={
                            <Chat
                                socket={socket}
                                username={username}
                                room={room}
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
