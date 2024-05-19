import React, { useState, useEffect } from 'react';
import { UpOutlined } from '@ant-design/icons';

const ToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Hiển thị nút khi cuộn xuống một khoảng cố định từ đầu trang
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="z-50 fixed bottom-6 right-6 ring-2 bg-primary text-white py-3 px-4 rounded-full shadow-md transition duration-300 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                    <UpOutlined className='text-white' />
                </button>
            )}
        </>
    );
};

export default ToTop;
