import CardWithForm from './screens/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const App = () => {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    return (
        <Router>
            <div>
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
                </Routes>
            </div>
        </Router>
    );
};

export default App;
