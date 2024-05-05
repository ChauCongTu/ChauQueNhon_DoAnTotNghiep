import Echo from 'laravel-echo';
import io from 'socket.io-client';

const echo = new Echo({
    broadcaster: 'socket.io',
    host: 'http://127.0.0.1:6001',            
    client: io,
});

export default echo;
