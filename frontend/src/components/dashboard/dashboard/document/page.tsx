import { getMostViewed } from '@/modules/dashboard/services';
import { Space, Table } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LessonType } from '@/modules/lessons/type';

type Props = {};

const VibrantTable: React.FC<Props> = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<LessonType[]>([]);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const res = await getMostViewed();
            if (res.status.success) {
                setData(res.data[0]);
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Bài học',
            dataIndex: 'user',
            width: 500,
            render: (_: any, record: LessonType) => (
                <div className='flex items-center gap-7xs md:gap-7md'>
                    {record.name}
                </div>
            ),
        },
        {
            title: 'Môn học',
            dataIndex: 'subject',
            render: (_: any, record: LessonType) => (
                <Space className=''>
                    {record.subject?.name} {record.subject?.grade}
                </Space>
            ),
            width: 150, 
        },
        {
            title: 'Lượt truy cập',
            dataIndex: 'view_count',
            key: 'view_count',
            width: 120,
        },
        {
            title: '',
            dataIndex: 'web_point',
            key: 'web_point',
            width: 100, 
            render: (_: any, record: LessonType) => (
                <Space className='flex justify-center'>
                    <Link href={`/lesson/${record.slug}`} target='_blank'>
                        <ExportOutlined />
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div className='mt-10xs md:mt-10md'>
            <div className='flex justify-between py-5xs md:py-5md items-center'>
                <div className='font-bold text-21xs md:text-18md'>Tài liệu được xem và tải nhiều nhất</div>
            </div>
            <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                pagination={{
                    pageSize: 5, // Số lượng bản ghi trên mỗi trang
                    hideOnSinglePage: true, // Ẩn phân trang khi chỉ có 1 trang
                }}
                className='border rounded'
            />
        </div>
    );
};

export default VibrantTable;
