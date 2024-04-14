import React from 'react';

type Props = {
    loading: boolean
};

const Loading: React.FC<Props> = ({ loading }) => {
    return (
        <>
            {
                loading && <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-filter backdrop-blur-md z-[9999]">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
                </div>
            }
        </>
    );
};

export default Loading;
