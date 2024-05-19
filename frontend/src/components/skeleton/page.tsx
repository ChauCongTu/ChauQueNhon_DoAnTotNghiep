import React from 'react';
import { Skeleton } from 'antd';

interface SkeletonProps {
    height?: number;
    type?: 0 | 1 | 2;
    loading: boolean;
}

const CustomSkeleton: React.FC<SkeletonProps> = ({ height = 100, type = 0, loading }) => {
    const getSkeletonContent = () => {
        switch (type) {
            case 1:
                return <Skeleton.Image style={{ width: '100%', height: height }} />;
            case 2:
                return (
                    <div className="flex flex-col space-y-4">
                        <Skeleton.Image style={{ width: '100%', height: height / 2 }} />
                        <Skeleton active paragraph={{ rows: 3 }} />
                    </div>
                );
            default:
                return <Skeleton active paragraph={{ rows: Math.ceil(height / 20) }} />;
        }
    };

    return (
        <>
            {
                loading ?
                    <div className='p-16xs md:p-16md'>
                        {getSkeletonContent()}
                    </div> : null
            }
        </>
    );
};

export default CustomSkeleton;
