import React from 'react'

interface CountdownProps {
    seconds: number;
}

const TimeLoading: React.FC<CountdownProps> = ({ seconds }) => {
    if (seconds === 0) return null;
    return (
        <div className=''>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999999999]">
                <div className="text-white text-60-xs md:text-72md">
                    {seconds}
                </div>
            </div>
        </div>
    )
}

export default TimeLoading