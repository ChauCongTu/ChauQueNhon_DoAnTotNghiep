import Echo from 'laravel-echo';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import addNotification from 'react-push-notification';

const Notification = () => {
    const router = useRouter();
    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: `${window.location.hostname}:6001`,
        });

        const channel = echo.channel('gouni_database_tick');

        const handleMessage = (data: string) => {
            console.log(data);
            const parseObject = JSON.parse(data);
            if (parseObject.type = "notification") {
                addNotification({
                    title: '[Luyện thi GoUni]',
                    subtitle: 'Săp bắt đầu thi',
                    message: parseObject.message,
                    theme: 'darkblue',
                    onClick: () => handleLink(parseObject.data.id, parseObject.data.mode),
                    native: true
                });
            }
        }
        channel.listen('.NotificationPushed', handleMessage);

        return () => {
            channel.stopListening('.NotificationPushed', handleMessage);
            echo.disconnect();
        };
    }, []);
    const buttonClick = () => {
        addNotification({
            title: 'Warning',
            subtitle: 'Săp bắt đầu thi',
            message: 'Phòng thi của bạn sắp bắt đầu, hãy bắt đầu ngay để không bỏ lỡ.',
            theme: 'darkblue',

            native: true
        });
    };

    const handleLink = (roomId: number, mode: number) => {
        const url = mode == 1 ? 'http://localhost:3000/arena/v2/' + roomId : 'http://localhost:3000/arena/' + roomId;
        router.push(url);
    }

    return (
        <></>
    );
}

export default Notification;