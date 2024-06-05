import React from 'react';
import './style.scss'; // Đảm bảo bạn đã import file CSS

type Props = {
    loading: boolean;
};

const Loading: React.FC<Props> = ({ loading }) => {
    if (!loading) return null;

    const text = "Đang chuẩn bị tài nguyên cho trang web ...";
    const textArray = text.split("");

    return (
        <div className='loading'>
            <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        </div>
    );
};

export default Loading;