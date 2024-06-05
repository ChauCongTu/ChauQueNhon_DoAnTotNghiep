import React from 'react';
import './style.scss'; // Đảm bảo bạn đã import file CSS

type Props = {
    loading: boolean;
};

const FirstLoading: React.FC<Props> = ({ loading }) => {
    if (!loading) return null;

    const text = "Đang chuẩn bị tài nguyên cho trang web ...";
    const textArray = text.split("");

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-[9999]">
            <div className="text-center">
                <img src="/logo.png" alt="logo" className="w-36 md:w-44 mx-auto mb-4" />
                <div className="text-lg text-gray-700 loading-text">
                    {textArray.map((char, index) => (
                        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                            {char}
                        </span>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default FirstLoading;