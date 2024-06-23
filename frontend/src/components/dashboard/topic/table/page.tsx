import { Popconfirm, Space, Table } from 'antd';
import React from 'react';
import Link from 'next/link';
import { TopicType } from '@/modules/topics/types';
import { deleteTopic } from '@/modules/topics/services';
import toast from 'react-hot-toast';
import { ArrowRightOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const stripHtmlTags = (html: any) => {
    const cleanHtml = DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p'], ALLOWED_ATTR: [] });
    return cleanHtml;
};

type Props = {
    topics: TopicType[];
    setTopics: (subjects: TopicType[]) => void;
    page: number;
    fetch: (page?: number) => void;
};

const TopicTable: React.FC<Props> = ({ topics, setTopics, page, fetch }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80, // Fixed width for ID column
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: 200, // Fixed width for Tiêu đề column
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            width: 300, // Fixed width for Nội dung column
            render: (_: any, record: TopicType) => (
                <Space size="middle">
                    <div className='line-clamp-1' dangerouslySetInnerHTML={{ __html: stripHtmlTags(record.content) }}></div>
                </Space>
            ),
        },
        {
            title: 'Người đăng',
            dataIndex: 'author',
            key: 'author',
            width: 150, // Fixed width for Người đăng column
            render: (_: any, record: TopicType) => (
                <Space size="middle">
                    {record.author.name}
                </Space>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 120, // Fixed width for action column
            render: (_: any, record: TopicType) => (
                <Space size="middle">
                    <Popconfirm
                        title={'Xác nhận xóa'}
                        onConfirm={() => handleDelete(record.id)}
                        okText={'Xóa'}
                        cancelText={'Hủy'}
                    >
                        <button>Xóa</button>
                    </Popconfirm>
                    <Link href={`/topic/${record.slug}`} className='text-nowrap' target='_blank'>Đến <ArrowRightOutlined /></Link>
                </Space>
            ),
        },
    ];

    const handleDelete = async (id: number) => {
        const res = await deleteTopic(id);
        if (res.status.success) {
            fetch(page);
            toast.success('Xóa thành công.');
        }
    };

    return (
        <div>
            <Table dataSource={topics} columns={columns} pagination={false} />
        </div>
    );
};

export default TopicTable;
