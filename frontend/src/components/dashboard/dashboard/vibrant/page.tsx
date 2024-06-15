import { getVibrantStudents } from '@/modules/dashboard/services';
import { VibrantTableType } from '@/modules/dashboard/type';
import { Badge, Space, Table } from 'antd';
import { CSVLink } from "react-csv";
import React, { useEffect, useState } from 'react'
import { NodeExpandOutlined } from '@ant-design/icons'
import { DateTime } from 'luxon';
import Link from 'next/link';

type Props = {}

const VibrantTable: React.FC<Props> = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<VibrantTableType[]>([]);
    const headers = [
        { label: "id", key: "id" },
        { label: "Học sinh", key: "user.name" },
        { label: "Bài tập đã làm", key: "practice_count" },
        { label: "Số bài kiểm tra", key: "exam_count" },
        { label: "Tham gia đấu trường", key: "arena_count" },
        { label: "Tần suất thảo luận", key: "forum_frequency.name" },
        { label: "Điểm hoạt động", key: "web_point" }
    ];

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const res = await getVibrantStudents();
            if (res.status.success) {
                setData(res.data[0]);
                setLoading(false);
            }
        }
        fetch();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Học sinh',
            dataIndex: 'user',
            render: (_: any, record: VibrantTableType) => (
                <div className='flex items-center gap-7xs md:gap-7md'>
                    <img src={record.user.avatar} alt="avatar" width={'36px'} className='rounded-full ring-2' />
                    <Link href={`/personal/${record.user.username}`} target='_blank'>
                        {record.user.name}
                    </Link>
                </div>
            )
        },
        {
            title: 'Số bài tập',
            dataIndex: 'practice_count',
            key: 'practice_count',
        },
        {
            title: 'Số đề đã giải',
            dataIndex: 'exam_count',
            key: 'exam_count',
        },
        {
            title: 'Tham gia đấu trường',
            dataIndex: 'arena_count',
            key: 'arena_count',
        },
        {
            title: 'Tần suất thảo luận',
            dataIndex: 'forum_frequency',
            key: 'forum_frequency',
            render: (_: any, record: VibrantTableType) => (
                <Space size="middle" className='capitalize'>
                    {record.forum_frequency.name}
                </Space>
            ),
        },
        {
            title: <div className='text-center'>Điểm sôi nổi</div>,
            dataIndex: 'web_point',
            key: 'web_point',
            render: (_: any, record: VibrantTableType) => (
                <Space className='flex justify-center'>
                    <Badge className='db-badge' color='#fff'>{record.web_point}</Badge>
                </Space>
            )
        },
    ];

    return (
        <div className='mt-10xs md:mt-20md'>
            <div className='flex justify-between py-5xs md:py-5md items-center'>
                <div className='font-bold text-21xs md:text-18md'>Những học sinh sôi nổi nhất</div>
                <div>
                    <CSVLink data={data} headers={headers} filename={`hoc-sinh-soi-noi-${DateTime.local().toISO().toString()}.csv`} className='flex items-center gap-7xs md:gap-7md'>
                        <img src='/excel.png' className='w-14xs md:w-16md'/> Export
                    </CSVLink>
                </div>
            </div>
            <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                pagination={{
                    pageSize: 5, 
                    hideOnSinglePage: true, 
                }}
                className='border rounded'
            />
        </div>
    )
}

export default VibrantTable;
