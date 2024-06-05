"use client"
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
                    className="fixed bottom-30xs md:bottom-30md z-50 right-30md bg-gray-800 px-10xs md:px-20md py-6xs md:py-15md transition-all opacity-30 hover:opacity-100"
                >
                    <UpOutlined className='text-white' />
                </button>
            )}
        </>
    );
};

export default ToTop;
