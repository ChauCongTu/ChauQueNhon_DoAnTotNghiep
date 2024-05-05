// file: /path/to/nextjs-app/pages/index.js
"use client"
import React, { useEffect, useState } from 'react';
import Echo from 'laravel-echo';

// const ws = new WebSocket('ws://www.host.com/path');

const IndexPage = () => {
    // const [data, setData] = useState("");
    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: window.location.hostname + ':6001',
        });
        echo.channel('gouni_database_tick').listen( '.MessagePushed', (data:any) => {
            console.log(data);
        });
    }, []);

    return (
        <>
            <h1>Next.js App</h1>
            <p>Open the browser console to see received messages.</p>
            
        </>
    );
};

export default IndexPage;
